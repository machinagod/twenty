import { FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED } from 'twenty-shared/constants';
import { type ObjectRecord } from 'twenty-shared/types';
import { type Repository } from 'typeorm';

import { type CommonRecordVisibilityService } from 'src/engine/api/common/common-record-visibility/common-record-visibility.service';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { type MessageChannelEntity } from 'src/engine/metadata-modules/message-channel/entities/message-channel.entity';
import { type WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { ApplyMessagesVisibilityRestrictionsService } from 'src/modules/messaging/common/query-hooks/message/apply-messages-visibility-restrictions.service';
import { type MessageMailboxAdminService } from 'src/modules/messaging/common/services/message-mailbox-admin.service';

describe('ApplyMessagesVisibilityRestrictionsService', () => {
  let executeInWorkspaceContext: jest.Mock;
  let isAdmin: jest.Mock;
  let service: ApplyMessagesVisibilityRestrictionsService;

  const buildMessage = (): ObjectRecord =>
    ({
      id: 'message-1',
      subject: 'Proposta',
      text: 'Corpo da mensagem',
    }) as ObjectRecord;

  const userAuthContext = (userWorkspaceId: string) =>
    ({
      type: 'user',
      workspace: { id: 'workspace-1' },
      userWorkspaceId,
    }) as unknown as WorkspaceAuthContext;

  const apiKeyAuthContext = {
    type: 'apiKey',
    workspace: { id: 'workspace-1' },
  } as unknown as WorkspaceAuthContext;

  beforeEach(() => {
    executeInWorkspaceContext = jest.fn().mockResolvedValue([]);
    isAdmin = jest.fn();
    service = new ApplyMessagesVisibilityRestrictionsService(
      { executeInWorkspaceContext } as unknown as WorkspaceOrmManager,
      {} as CommonRecordVisibilityService,
      {} as Repository<MessageChannelEntity>,
      { isAdmin } as unknown as MessageMailboxAdminService,
    );
  });

  it('should leave messages untouched for an admin', async () => {
    isAdmin.mockResolvedValue(true);
    const records = [buildMessage()];

    await service.applyVisibilityRestrictions({
      records,
      authContext: userAuthContext('uw-admin'),
    });

    expect(records).toEqual([buildMessage()]);
    expect(isAdmin).toHaveBeenCalledWith('workspace-1', 'uw-admin');
    expect(executeInWorkspaceContext).not.toHaveBeenCalled();
  });

  it('should mask messages from mailboxes a non-admin cannot see', async () => {
    isAdmin.mockResolvedValue(false);
    const records = [buildMessage()];

    await service.applyVisibilityRestrictions({
      records,
      authContext: userAuthContext('uw-rep'),
    });

    expect(executeInWorkspaceContext).toHaveBeenCalled();
    expect(records[0].subject).toBe(
      FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED,
    );
    expect(records[0].text).toBe(
      FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED,
    );
  });

  it('should not look up an admin role for a caller without a user', async () => {
    await service.applyVisibilityRestrictions({
      records: [buildMessage()],
      authContext: apiKeyAuthContext,
    });

    expect(isAdmin).not.toHaveBeenCalled();
    expect(executeInWorkspaceContext).toHaveBeenCalled();
  });

  it('should skip records that select no restricted field', async () => {
    await service.applyVisibilityRestrictions({
      records: [{ id: 'message-1' } as ObjectRecord],
      authContext: userAuthContext('uw-rep'),
    });

    expect(isAdmin).not.toHaveBeenCalled();
    expect(executeInWorkspaceContext).not.toHaveBeenCalled();
  });
});
