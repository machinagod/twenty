import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  MessageChannelVisibility,
  MessageParticipantRole,
} from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { In, type Repository } from 'typeorm';

import { FileUrlService } from 'src/engine/core-modules/file/file-url/file-url.service';
import { type TimelineThreadDTO } from 'src/engine/core-modules/messaging/dtos/timeline-thread.dto';
import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { type TargetFilter } from 'src/engine/core-modules/target/utils/get-target-field-name-for-object-record.util';
import { ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { MessageChannelEntity } from 'src/engine/metadata-modules/message-channel/entities/message-channel.entity';
import { type WorkspaceSelectQueryBuilder } from 'src/engine/twenty-orm/query-builder/workspace-select-query-builder';
import {
  type MessageVisibilityObjectName,
  renderMessageVisibilitySql,
} from 'src/engine/twenty-orm/record-scoping/utils/build-message-visibility-condition.util';
import { computeObjectTargetTable } from 'src/engine/utils/compute-object-target-table.util';
import { getWorkspaceSchemaName } from 'src/engine/workspace-datasource/utils/get-workspace-schema-name.util';
import { TWENTY_STANDARD_APPLICATION } from 'src/engine/workspace-manager/twenty-standard-application/constants/twenty-standard-applications';
import { escapeIdentifier } from 'src/engine/workspace-manager/workspace-migration/utils/remove-sql-injection.util';
import { type MessageWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message.workspace-entity';
import { MessageMailboxAdminService } from 'src/modules/messaging/common/services/message-mailbox-admin.service';
import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { type MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';
import { type MessageThreadWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-thread.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

// Who is reading the timeline: admins see every mailbox, everyone else only
// threads from mailboxes they connected or that are shared with everyone.
export type TimelineMessageViewer = {
  userWorkspaceId: string | null;
  isAdmin: boolean;
};

@Injectable()
export class TimelineMessagingService {
  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
    @InjectRepository(MessageChannelEntity)
    private readonly messageChannelRepository: Repository<MessageChannelEntity>,
    @InjectRepository(ConnectedAccountEntity)
    private readonly connectedAccountRepository: Repository<ConnectedAccountEntity>,
    @InjectRepository(UserWorkspaceEntity)
    private readonly userWorkspaceRepository: Repository<UserWorkspaceEntity>,
    private readonly fileUrlService: FileUrlService,
    private readonly messageMailboxAdminService: MessageMailboxAdminService,
  ) {}

  public async resolveViewer(
    workspaceMemberId: string,
    workspaceId: string,
  ): Promise<TimelineMessageViewer> {
    const authContext = buildSystemAuthContext(workspaceId);

    const userWorkspaceId =
      await this.workspaceOrmManager.executeInWorkspaceContext(async () => {
        const workspaceMemberRepository =
          this.workspaceOrmManager.getRepository<WorkspaceMemberWorkspaceEntity>(
            'workspaceMember',
            { shouldBypassPermissionChecks: true },
          );

        const currentMember = await workspaceMemberRepository.findOne({
          where: { id: workspaceMemberId },
          select: { userId: true },
        });

        if (!currentMember) {
          return null;
        }

        const currentUserWorkspace = await this.userWorkspaceRepository.findOne(
          {
            where: { userId: currentMember.userId, workspaceId },
            select: { id: true },
          },
        );

        return currentUserWorkspace?.id ?? null;
      }, authContext);

    return {
      userWorkspaceId,
      isAdmin:
        isDefined(userWorkspaceId) &&
        (await this.messageMailboxAdminService.isAdmin(
          workspaceId,
          userWorkspaceId,
        )),
    };
  }

  private visibilitySql({
    alias,
    objectNameSingular,
    workspaceId,
    userWorkspaceId,
  }: {
    alias: string;
    objectNameSingular: MessageVisibilityObjectName;
    workspaceId: string;
    userWorkspaceId: string;
  }) {
    const standardTable = (nameSingular: string) =>
      `${escapeIdentifier(getWorkspaceSchemaName(workspaceId))}.${escapeIdentifier(
        computeObjectTargetTable({
          nameSingular,
          applicationUniversalIdentifier:
            TWENTY_STANDARD_APPLICATION.universalIdentifier,
        }),
      )}`;

    return renderMessageVisibilitySql({
      alias,
      objectNameSingular,
      associationTable: standardTable('messageChannelMessageAssociation'),
      messageTable: standardTable('message'),
      parameterPrefix: `timelineVisibility_${alias}`,
      workspaceId,
      userWorkspaceId,
    });
  }

  public async getAndCountMessageThreads(
    personIds: string[],
    workspaceId: string,
    offset: number,
    pageSize: number,
    viewer: TimelineMessageViewer,
    targetFilter?: TargetFilter,
  ): Promise<{
    messageThreads: Omit<
      TimelineThreadDTO,
      | 'firstParticipant'
      | 'lastTwoParticipants'
      | 'participantCount'
      | 'read'
      | 'visibility'
    >[];
    totalNumberOfThreads: number;
  }> {
    const authContext = buildSystemAuthContext(workspaceId);

    if (!viewer.isAdmin && !isDefined(viewer.userWorkspaceId)) {
      return { messageThreads: [], totalNumberOfThreads: 0 };
    }

    const restrictedUserWorkspaceId = viewer.isAdmin
      ? null
      : viewer.userWorkspaceId;

    return this.workspaceOrmManager.executeInWorkspaceContext(async () => {
      const messageThreadRepository =
        this.workspaceOrmManager.getRepository<MessageThreadWorkspaceEntity>(
          'messageThread',
          { shouldBypassPermissionChecks: true },
        );

      const totalQueryBuilder = messageThreadRepository
        .createQueryBuilder('messageThread')
        .innerJoin('messageThread.messages', 'messages')
        .groupBy('messageThread.id');
      const threadIdsQueryBuilder = messageThreadRepository
        .createQueryBuilder('messageThread')
        .select('messageThread.id', 'id')
        .addSelect('MAX(messages.receivedAt)', 'max_received_at')
        .innerJoin('messageThread.messages', 'messages')
        .groupBy('messageThread.id')
        .orderBy('max_received_at', 'DESC')
        .offset(offset)
        .limit(pageSize);

      const applyRecordFilter = (
        queryBuilder: WorkspaceSelectQueryBuilder,
      ): void => {
        if (isDefined(targetFilter)) {
          queryBuilder
            .innerJoin(
              'messageThread.messageThreadTargets',
              'messageThreadTargets',
            )
            .where(
              `messageThreadTargets.${targetFilter.fieldName} = :targetRecordId`,
              { targetRecordId: targetFilter.recordId },
            );

          return;
        }

        queryBuilder
          .innerJoin('messages.messageParticipants', 'messageParticipants')
          .where('messageParticipants.personId IN(:...personIds)', {
            personIds,
          });
      };

      applyRecordFilter(totalQueryBuilder);
      applyRecordFilter(threadIdsQueryBuilder);

      if (isDefined(restrictedUserWorkspaceId)) {
        const threadVisibility = this.visibilitySql({
          alias: 'messageThread',
          objectNameSingular: 'messageThread',
          workspaceId,
          userWorkspaceId: restrictedUserWorkspaceId,
        });

        totalQueryBuilder.andWhere(
          threadVisibility.sql,
          threadVisibility.parameters,
        );
        threadIdsQueryBuilder.andWhere(
          threadVisibility.sql,
          threadVisibility.parameters,
        );
      }

      const totalNumberOfThreads = await totalQueryBuilder.getCount();
      const threadIdsQuery = await threadIdsQueryBuilder.getRawMany();

      const messageThreadIds = threadIdsQuery.map((thread) => thread.id);

      const messageThreads = await messageThreadRepository.find({
        where: {
          id: In(messageThreadIds),
        },
        order: {
          messages: {
            receivedAt: 'DESC',
          },
        },
        relations: ['messages'],
      });

      // A visible thread can still hold replies that only reached someone
      // else's mailbox; those stay out of the preview.
      if (isDefined(restrictedUserWorkspaceId) && messageThreadIds.length > 0) {
        const messageVisibility = this.visibilitySql({
          alias: 'message',
          objectNameSingular: 'message',
          workspaceId,
          userWorkspaceId: restrictedUserWorkspaceId,
        });

        const visibleMessageIds = new Set(
          (
            await this.workspaceOrmManager
              .getRepository<MessageWorkspaceEntity>('message', {
                shouldBypassPermissionChecks: true,
              })
              .createQueryBuilder('message')
              .select('message.id', 'id')
              .where('message.messageThreadId IN (:...messageThreadIds)', {
                messageThreadIds,
              })
              .andWhere(messageVisibility.sql, messageVisibility.parameters)
              .getRawMany<{ id: string }>()
          ).map((row) => row.id),
        );

        for (const messageThread of messageThreads) {
          messageThread.messages = messageThread.messages.filter((message) =>
            visibleMessageIds.has(message.id),
          );
        }
      }

      const threadsWithMessages = messageThreads.filter(
        (messageThread) => messageThread.messages.length > 0,
      );

      return {
        messageThreads: threadsWithMessages.map((messageThread) => {
          const lastMessage = messageThread.messages[0];
          const firstMessage =
            messageThread.messages[messageThread.messages.length - 1];

          return {
            id: messageThread.id,
            subject: firstMessage.subject ?? '',
            lastMessageBody: lastMessage.text ?? '',
            lastMessageReceivedAt: lastMessage.receivedAt ?? new Date(),
            numberOfMessagesInThread: messageThread.messages.length,
            lastMessageIsDraft: lastMessage.isDraft ?? false,
          };
        }),
        totalNumberOfThreads,
      };
    }, authContext);
  }

  public async getThreadParticipantsByThreadId(
    messageThreadIds: string[],
    workspaceId: string,
  ): Promise<{
    [key: string]: MessageParticipantWorkspaceEntity[];
  }> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.workspaceOrmManager.executeInWorkspaceContext(async () => {
      const messageParticipantRepository =
        this.workspaceOrmManager.getRepository<MessageParticipantWorkspaceEntity>(
          'messageParticipant',
          { shouldBypassPermissionChecks: true },
        );

      const threadParticipants = await messageParticipantRepository
        .createQueryBuilder()
        .select('messageParticipant')
        .addSelect('message.messageThreadId')
        .addSelect('message.receivedAt')
        .leftJoinAndSelect('messageParticipant.person', 'person')
        .leftJoinAndSelect(
          'messageParticipant.workspaceMember',
          'workspaceMember',
        )
        .leftJoin('messageParticipant.message', 'message')
        .where('message.messageThreadId = ANY(:messageThreadIds)', {
          messageThreadIds,
        })
        .andWhere('messageParticipant.role = :role', {
          role: MessageParticipantRole.FROM,
        })
        .orderBy('message.messageThreadId')
        .distinctOn(['message.messageThreadId', 'messageParticipant.handle'])
        .getMany<MessageParticipantWorkspaceEntity>();

      const orderedThreadParticipants = threadParticipants.sort(
        (a, b) =>
          (a.message.receivedAt ?? new Date()).getTime() -
          (b.message.receivedAt ?? new Date()).getTime(),
      );

      const threadParticipantPromises = orderedThreadParticipants.map(
        async (threadParticipant) => {
          const personAvatarFileUrl =
            await this.fileUrlService.signFirstFilesFieldFileUrl({
              filesFieldValue: threadParticipant.person?.avatarFile,
              workspaceId,
            });

          return {
            ...threadParticipant,
            person: {
              id: threadParticipant.person?.id,
              name: {
                //oxlint-disable-next-line
                //@ts-ignore
                firstName: threadParticipant.person?.nameFirstName,
                //oxlint-disable-next-line
                //@ts-ignore
                lastName: threadParticipant.person?.nameLastName,
              },
              avatarUrl:
                personAvatarFileUrl || threadParticipant.person?.avatarUrl,
            },
            workspaceMember: {
              id: threadParticipant.workspaceMember?.id,
              name: {
                //oxlint-disable-next-line
                //@ts-ignore
                firstName: threadParticipant.workspaceMember?.nameFirstName,
                //oxlint-disable-next-line
                //@ts-ignore
                lastName: threadParticipant.workspaceMember?.nameLastName,
              },
              avatarUrl: threadParticipant.workspaceMember?.avatarUrl,
            },
          };
        },
      );

      const threadParticipantsWithCompositeFields = await Promise.all(
        threadParticipantPromises,
      );

      return threadParticipantsWithCompositeFields.reduce(
        (threadParticipantsAcc, threadParticipant) => {
          if (!threadParticipant.message.messageThreadId)
            return threadParticipantsAcc;

          if (
            // @ts-expect-error legacy noImplicitAny
            !threadParticipantsAcc[threadParticipant.message.messageThreadId]
          )
            // @ts-expect-error legacy noImplicitAny
            threadParticipantsAcc[threadParticipant.message.messageThreadId] =
              [];

          // @ts-expect-error legacy noImplicitAny
          threadParticipantsAcc[threadParticipant.message.messageThreadId].push(
            threadParticipant,
          );

          return threadParticipantsAcc;
        },
        {},
      );
    }, authContext);
  }

  public async getThreadVisibilityByThreadId(
    messageThreadIds: string[],
    workspaceMemberId: string,
    workspaceId: string,
    viewer?: TimelineMessageViewer,
  ): Promise<{
    [key: string]: MessageChannelVisibility;
  }> {
    if (viewer?.isAdmin) {
      return Object.fromEntries(
        messageThreadIds.map((threadId) => [
          threadId,
          MessageChannelVisibility.SHARE_EVERYTHING,
        ]),
      );
    }

    const authContext = buildSystemAuthContext(workspaceId);

    return this.workspaceOrmManager.executeInWorkspaceContext(async () => {
      const workspaceMemberRepository =
        this.workspaceOrmManager.getRepository<WorkspaceMemberWorkspaceEntity>(
          'workspaceMember',
          { shouldBypassPermissionChecks: true },
        );

      const currentMember = await workspaceMemberRepository.findOne({
        where: { id: workspaceMemberId },
        select: { userId: true },
      });

      if (!currentMember) {
        return {};
      }

      const currentUserWorkspace = await this.userWorkspaceRepository.findOne({
        where: { userId: currentMember.userId, workspaceId },
        select: { id: true },
      });

      if (!currentUserWorkspace) {
        return {};
      }

      const currentUserWorkspaceId = currentUserWorkspace.id;

      const messageThreadRepository =
        this.workspaceOrmManager.getRepository<MessageThreadWorkspaceEntity>(
          'messageThread',
          { shouldBypassPermissionChecks: true },
        );

      const threadChannelRows = await messageThreadRepository
        .createQueryBuilder()
        .select('messageThread.id', 'id')
        .addSelect(
          'messageChannelMessageAssociation.messageChannelId',
          'messageChannelId',
        )
        .leftJoin('messageThread.messages', 'message')
        .leftJoin(
          'message.messageChannelMessageAssociations',
          'messageChannelMessageAssociation',
        )
        .where('messageThread.id = ANY(:messageThreadIds)', {
          messageThreadIds,
        })
        .getRawMany<{ id: string; messageChannelId: string | null }>();

      const allMessageChannelIds = [
        ...new Set(
          threadChannelRows
            .map((row) => row.messageChannelId)
            .filter((id): id is string => id !== null && id !== undefined),
        ),
      ];

      if (allMessageChannelIds.length === 0) {
        return {};
      }

      const messageChannels = await this.messageChannelRepository.find({
        where: { id: In(allMessageChannelIds), workspaceId },
        select: { id: true, visibility: true, connectedAccountId: true },
      });

      const allConnectedAccountIds = [
        ...new Set(
          messageChannels.map((channel) => channel.connectedAccountId),
        ),
      ];

      const ownedAccountIds = new Set(
        (
          await this.connectedAccountRepository.find({
            where: {
              id: In(allConnectedAccountIds),
              userWorkspaceId: currentUserWorkspaceId,
            },
            select: { id: true },
          })
        ).map((account) => account.id),
      );

      const channelVisibilityMap = new Map(
        messageChannels.map((channel) => [
          channel.id,
          ownedAccountIds.has(channel.connectedAccountId)
            ? MessageChannelVisibility.SHARE_EVERYTHING
            : channel.visibility,
        ]),
      );

      const visibilityValues = Object.values(MessageChannelVisibility);

      const threadVisibilityByThreadId: {
        [key: string]: MessageChannelVisibility;
      } = {};

      for (const { id: threadId, messageChannelId } of threadChannelRows) {
        if (!messageChannelId) continue;

        const channelVisibility = channelVisibilityMap.get(messageChannelId);

        if (!channelVisibility) continue;

        threadVisibilityByThreadId[threadId] =
          visibilityValues[
            Math.max(
              visibilityValues.indexOf(channelVisibility),
              visibilityValues.indexOf(
                threadVisibilityByThreadId[threadId] ??
                  MessageChannelVisibility.METADATA,
              ),
            )
          ];
      }

      return threadVisibilityByThreadId;
    }, authContext);
  }
}
