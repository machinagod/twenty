import { FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED } from 'twenty-shared/constants';
import {
  MessageChannelVisibility,
  type ObjectRecord,
} from 'twenty-shared/types';
import { type Repository } from 'typeorm';

import { type CommonRecordVisibilityService } from 'src/engine/api/common/common-record-visibility/common-record-visibility.service';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { type ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { type MessageChannelEntity } from 'src/engine/metadata-modules/message-channel/entities/message-channel.entity';
import { type WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { ApplyMessageThreadsVisibilityRestrictionsService } from 'src/modules/messaging/common/query-hooks/message-thread/apply-message-threads-visibility-restrictions.service';
import { type MessageMailboxAdminService } from 'src/modules/messaging/common/services/message-mailbox-admin.service';

describe('ApplyMessageThreadsVisibilityRestrictionsService', () => {
  let executeInWorkspaceContext: jest.Mock;
  let findMessageChannels: jest.Mock;
  let findConnectedAccounts: jest.Mock;
  let isAdmin: jest.Mock;
  let registerHandler: jest.Mock;
  let service: ApplyMessageThreadsVisibilityRestrictionsService;

  const userAuthContext = {
    type: 'user',
    workspace: { id: 'workspace-1' },
    userWorkspaceId: 'uw-rep',
  } as unknown as WorkspaceAuthContext;

  const buildThread = (id: string): ObjectRecord =>
    ({ id, subject: `Subject ${id}` }) as ObjectRecord;

  const givenThreadChannels = (
    channels: {
      threadId: string;
      channelId: string;
      visibility: MessageChannelVisibility;
      ownerUserWorkspaceId: string;
    }[],
  ) => {
    executeInWorkspaceContext.mockResolvedValue(
      channels.map(({ threadId, channelId }) => ({
        messageThreadId: threadId,
        messageChannelId: channelId,
      })),
    );
    findMessageChannels.mockResolvedValue(
      channels.map(({ channelId, visibility }) => ({
        id: channelId,
        visibility,
        connectedAccountId: `account-${channelId}`,
      })),
    );
    findConnectedAccounts.mockResolvedValue(
      channels.map(({ channelId, ownerUserWorkspaceId }) => ({
        id: `account-${channelId}`,
        userWorkspaceId: ownerUserWorkspaceId,
        applicationId: null,
      })),
    );
  };

  beforeEach(() => {
    executeInWorkspaceContext = jest.fn().mockResolvedValue([]);
    findMessageChannels = jest.fn().mockResolvedValue([]);
    findConnectedAccounts = jest.fn().mockResolvedValue([]);
    isAdmin = jest.fn().mockResolvedValue(false);
    registerHandler = jest.fn();

    service = new ApplyMessageThreadsVisibilityRestrictionsService(
      { executeInWorkspaceContext } as unknown as WorkspaceOrmManager,
      { registerHandler } as unknown as CommonRecordVisibilityService,
      {
        find: findMessageChannels,
      } as unknown as Repository<MessageChannelEntity>,
      {
        find: findConnectedAccounts,
      } as unknown as Repository<ConnectedAccountEntity>,
      { isAdmin } as unknown as MessageMailboxAdminService,
    );
  });

  it('should register itself as the messageThread handler', () => {
    service.onModuleInit();

    expect(registerHandler).toHaveBeenCalledWith({
      objectNameSingular: 'messageThread',
      handler: service,
    });
  });

  it('should keep subjects for an admin', async () => {
    isAdmin.mockResolvedValue(true);
    const records = [buildThread('thread-1')];

    await service.applyVisibilityRestrictions({
      records,
      authContext: userAuthContext,
    });

    expect(records[0].subject).toBe('Subject thread-1');
    expect(executeInWorkspaceContext).not.toHaveBeenCalled();
  });

  it('should mask a thread whose only mailbox shares metadata', async () => {
    givenThreadChannels([
      {
        threadId: 'thread-1',
        channelId: 'channel-1',
        visibility: MessageChannelVisibility.METADATA,
        ownerUserWorkspaceId: 'uw-other',
      },
    ]);
    const records = [buildThread('thread-1')];

    await service.applyVisibilityRestrictions({
      records,
      authContext: userAuthContext,
    });

    expect(records[0].subject).toBe(
      FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED,
    );
  });

  it('should keep the subject of a thread from a subject-sharing mailbox', async () => {
    givenThreadChannels([
      {
        threadId: 'thread-1',
        channelId: 'channel-1',
        visibility: MessageChannelVisibility.SUBJECT,
        ownerUserWorkspaceId: 'uw-other',
      },
    ]);
    const records = [buildThread('thread-1')];

    await service.applyVisibilityRestrictions({
      records,
      authContext: userAuthContext,
    });

    expect(records[0].subject).toBe('Subject thread-1');
  });

  it("should keep the subject of a thread from the caller's own metadata-only mailbox", async () => {
    givenThreadChannels([
      {
        threadId: 'thread-1',
        channelId: 'channel-1',
        visibility: MessageChannelVisibility.METADATA,
        ownerUserWorkspaceId: 'uw-rep',
      },
    ]);
    const records = [buildThread('thread-1')];

    await service.applyVisibilityRestrictions({
      records,
      authContext: userAuthContext,
    });

    expect(records[0].subject).toBe('Subject thread-1');
  });

  it('should skip records that do not select the subject', async () => {
    await service.applyVisibilityRestrictions({
      records: [{ id: 'thread-1' } as ObjectRecord],
      authContext: userAuthContext,
    });

    expect(isAdmin).not.toHaveBeenCalled();
    expect(executeInWorkspaceContext).not.toHaveBeenCalled();
  });
});
