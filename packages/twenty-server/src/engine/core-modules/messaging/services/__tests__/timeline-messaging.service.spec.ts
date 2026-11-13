import { MessageChannelVisibility } from 'twenty-shared/types';
import { type Repository } from 'typeorm';

import { type FileUrlService } from 'src/engine/core-modules/file/file-url/file-url.service';
import { TimelineMessagingService } from 'src/engine/core-modules/messaging/services/timeline-messaging.service';
import { type ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { type MessageChannelEntity } from 'src/engine/metadata-modules/message-channel/entities/message-channel.entity';
import { type RecordPermissionsService } from 'src/engine/permissions/record-permissions.service';
import { type WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { type MessageMailboxAdminService } from 'src/modules/messaging/common/services/message-mailbox-admin.service';

describe('TimelineMessagingService mailbox visibility', () => {
  let executeInWorkspaceContext: jest.Mock;
  let isAdmin: jest.Mock;
  let service: TimelineMessagingService;

  const CHANNEL = {
    type: 'email',
    provider: 'google',
    applicationId: null,
  };

  beforeEach(() => {
    executeInWorkspaceContext = jest.fn().mockResolvedValue({
      threadVisibilityByThreadId: {
        'thread-1': MessageChannelVisibility.METADATA,
      },
      threadChannelByThreadId: { 'thread-1': CHANNEL },
    });
    isAdmin = jest.fn();

    service = new TimelineMessagingService(
      { executeInWorkspaceContext } as unknown as WorkspaceOrmManager,
      {} as Repository<MessageChannelEntity>,
      {} as Repository<ConnectedAccountEntity>,
      {} as FileUrlService,
      {} as RecordPermissionsService,
      { isAdmin } as unknown as MessageMailboxAdminService,
    );
  });

  describe('resolveRestrictedUserWorkspaceId', () => {
    it('should not restrict an admin', async () => {
      isAdmin.mockResolvedValue(true);

      await expect(
        service.resolveRestrictedUserWorkspaceId({
          userWorkspaceId: 'uw-admin',
          workspaceId: 'workspace-1',
        }),
      ).resolves.toBeUndefined();
      expect(isAdmin).toHaveBeenCalledWith('workspace-1', 'uw-admin');
    });

    it('should restrict everyone else to their own mailboxes', async () => {
      isAdmin.mockResolvedValue(false);

      await expect(
        service.resolveRestrictedUserWorkspaceId({
          userWorkspaceId: 'uw-rep',
          workspaceId: 'workspace-1',
        }),
      ).resolves.toBe('uw-rep');
    });
  });

  describe('getThreadVisibilityAndChannelByThreadId', () => {
    it('should show every thread in full to an admin and keep the channels', async () => {
      isAdmin.mockResolvedValue(true);

      const result = await service.getThreadVisibilityAndChannelByThreadId({
        messageThreadIds: ['thread-1', 'thread-2'],
        userWorkspaceId: 'uw-admin',
        workspaceId: 'workspace-1',
      });

      expect(result).toEqual({
        threadVisibilityByThreadId: {
          'thread-1': MessageChannelVisibility.SHARE_EVERYTHING,
          'thread-2': MessageChannelVisibility.SHARE_EVERYTHING,
        },
        threadChannelByThreadId: { 'thread-1': CHANNEL },
      });
    });

    it('should keep the channel visibility for everyone else', async () => {
      isAdmin.mockResolvedValue(false);

      const result = await service.getThreadVisibilityAndChannelByThreadId({
        messageThreadIds: ['thread-1'],
        userWorkspaceId: 'uw-rep',
        workspaceId: 'workspace-1',
      });

      expect(result.threadVisibilityByThreadId).toEqual({
        'thread-1': MessageChannelVisibility.METADATA,
      });
    });
  });
});
