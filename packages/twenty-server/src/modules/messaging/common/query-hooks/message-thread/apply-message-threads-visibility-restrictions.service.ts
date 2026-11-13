import { Injectable, type OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED } from 'twenty-shared/constants';
import {
  MessageChannelVisibility,
  type ObjectRecord,
} from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { In, Repository } from 'typeorm';

import { CommonRecordVisibilityService } from 'src/engine/api/common/common-record-visibility/common-record-visibility.service';
import { type RecordVisibilityRestrictionHandler } from 'src/engine/api/common/common-record-visibility/types/record-visibility-restriction-handler.type';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { MessageChannelEntity } from 'src/engine/metadata-modules/message-channel/entities/message-channel.entity';
import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { MessageMailboxAdminService } from 'src/modules/messaging/common/services/message-mailbox-admin.service';
import { type MessageChannelMessageAssociationWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-channel-message-association.workspace-entity';
import { messageThreadVisibilityCaller } from 'src/modules/messaging/common/query-hooks/message-thread/utils/message-thread-visibility-caller.util';
import { type MessageWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message.workspace-entity';

// A thread's subject is its title, so it follows the same rule as
// message.subject: shown when one of the thread's mailboxes is the caller's
// own, is shared (SHARE_EVERYTHING) or shares subjects (SUBJECT); masked when
// every mailbox only shares metadata. Admins see every subject.
@Injectable()
export class ApplyMessageThreadsVisibilityRestrictionsService
  implements RecordVisibilityRestrictionHandler, OnModuleInit
{
  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
    private readonly commonRecordVisibilityService: CommonRecordVisibilityService,
    @InjectRepository(MessageChannelEntity)
    private readonly messageChannelRepository: Repository<MessageChannelEntity>,
    @InjectRepository(ConnectedAccountEntity)
    private readonly connectedAccountRepository: Repository<ConnectedAccountEntity>,
    private readonly messageMailboxAdminService: MessageMailboxAdminService,
  ) {}

  onModuleInit() {
    this.commonRecordVisibilityService.registerHandler({
      objectNameSingular: 'messageThread',
      handler: this,
    });
  }

  public async applyVisibilityRestrictions({
    records,
    authContext,
  }: {
    records: ObjectRecord[];
    authContext: WorkspaceAuthContext;
  }): Promise<void> {
    const messageThreads = records.filter(
      (messageThread) => 'subject' in messageThread,
    );

    if (messageThreads.length === 0) {
      return;
    }

    const workspaceId = authContext.workspace.id;
    const caller = messageThreadVisibilityCaller(authContext);

    if (
      isDefined(caller.userWorkspaceId) &&
      (await this.messageMailboxAdminService.isAdmin(
        workspaceId,
        caller.userWorkspaceId,
      ))
    ) {
      return;
    }

    // The association's own messageThreadId is not populated by the sync, so
    // threads are reached through their messages.
    const associations =
      await this.workspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const messages = await this.workspaceOrmManager
            .getRepositoryWithoutPermissionChecks<MessageWorkspaceEntity>(
              'message',
            )
            .find({
              where: {
                messageThreadId: In(messageThreads.map((thread) => thread.id)),
              },
              select: { id: true, messageThreadId: true },
            });

          const threadIdByMessageId = new Map(
            messages.map((message) => [message.id, message.messageThreadId]),
          );

          const messageAssociations =
            messages.length > 0
              ? await this.workspaceOrmManager
                  .getRepositoryWithoutPermissionChecks<MessageChannelMessageAssociationWorkspaceEntity>(
                    'messageChannelMessageAssociation',
                  )
                  .find({
                    where: { messageId: In([...threadIdByMessageId.keys()]) },
                    select: { messageId: true, messageChannelId: true },
                  })
              : [];

          return messageAssociations.map((association) => ({
            messageThreadId: threadIdByMessageId.get(association.messageId),
            messageChannelId: association.messageChannelId,
          }));
        },
        buildSystemAuthContext(workspaceId),
        { lite: true },
      );

    const channelIds = [
      ...new Set(
        associations.map((association) => association.messageChannelId),
      ),
    ];

    const channels =
      channelIds.length > 0
        ? await this.messageChannelRepository.find({
            where: { id: In(channelIds), workspaceId },
            select: { id: true, visibility: true, connectedAccountId: true },
          })
        : [];

    const accountIds = [
      ...new Set(channels.map((channel) => channel.connectedAccountId)),
    ];

    const accounts =
      accountIds.length > 0
        ? await this.connectedAccountRepository.find({
            where: { id: In(accountIds), workspaceId },
            select: { id: true, userWorkspaceId: true, applicationId: true },
          })
        : [];

    const accountById = new Map(
      accounts.map((account) => [account.id, account]),
    );

    const showsSubject = (channel: MessageChannelEntity): boolean => {
      if (channel.visibility !== MessageChannelVisibility.METADATA) {
        return true;
      }

      const account = accountById.get(channel.connectedAccountId);

      return (
        isDefined(account) &&
        ((isDefined(caller.userWorkspaceId) &&
          account.userWorkspaceId === caller.userWorkspaceId) ||
          (isDefined(caller.applicationId) &&
            account.applicationId === caller.applicationId))
      );
    };

    const subjectVisibleChannelIds = new Set(
      channels.filter(showsSubject).map((channel) => channel.id),
    );

    const threadIdsWithVisibleSubject = new Set(
      associations
        .filter((association) =>
          subjectVisibleChannelIds.has(association.messageChannelId),
        )
        .map((association) => association.messageThreadId),
    );

    for (const messageThread of messageThreads) {
      if (
        isDefined(messageThread.subject) &&
        !threadIdsWithVisibleSubject.has(messageThread.id)
      ) {
        messageThread.subject =
          FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED;
      }
    }
  }
}
