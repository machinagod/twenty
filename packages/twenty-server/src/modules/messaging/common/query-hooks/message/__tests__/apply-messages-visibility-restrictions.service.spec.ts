import { type Repository } from 'typeorm';

import { type UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { type ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { type MessageChannelEntity } from 'src/engine/metadata-modules/message-channel/entities/message-channel.entity';
import { type WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { ApplyMessagesVisibilityRestrictionsService } from 'src/modules/messaging/common/query-hooks/message/apply-messages-visibility-restrictions.service';
import { type MessageMailboxAdminService } from 'src/modules/messaging/common/services/message-mailbox-admin.service';
import { type MessageWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message.workspace-entity';

describe('ApplyMessagesVisibilityRestrictionsService', () => {
  let executeInWorkspaceContext: jest.Mock;
  let isAdmin: jest.Mock;
  let service: ApplyMessagesVisibilityRestrictionsService;

  const message = () =>
    ({
      id: 'message-1',
      subject: 'Proposta',
      text: 'Corpo da mensagem',
    }) as MessageWorkspaceEntity;

  beforeEach(() => {
    executeInWorkspaceContext = jest.fn().mockResolvedValue([]);
    isAdmin = jest.fn();
    service = new ApplyMessagesVisibilityRestrictionsService(
      { executeInWorkspaceContext } as unknown as WorkspaceOrmManager,
      {} as Repository<ConnectedAccountEntity>,
      {} as Repository<UserWorkspaceEntity>,
      {} as Repository<MessageChannelEntity>,
      { isAdmin } as unknown as MessageMailboxAdminService,
    );
  });

  it('should leave messages untouched for an admin', async () => {
    isAdmin.mockResolvedValue(true);
    const messages = [message()];

    const result = await service.applyMessagesVisibilityRestrictions(
      messages,
      'workspace-1',
      'user-1',
      undefined,
      'uw-admin',
    );

    expect(result).toEqual([message()]);
    expect(isAdmin).toHaveBeenCalledWith('workspace-1', 'uw-admin');
    expect(executeInWorkspaceContext).not.toHaveBeenCalled();
  });

  it('should apply the channel visibility rules to everyone else', async () => {
    isAdmin.mockResolvedValue(false);

    await service.applyMessagesVisibilityRestrictions(
      [message()],
      'workspace-1',
      'user-1',
      undefined,
      'uw-rep',
    );

    expect(executeInWorkspaceContext).toHaveBeenCalled();
  });

  it('should apply the rules when there is no user workspace', async () => {
    await service.applyMessagesVisibilityRestrictions(
      [message()],
      'workspace-1',
    );

    expect(isAdmin).not.toHaveBeenCalled();
    expect(executeInWorkspaceContext).toHaveBeenCalled();
  });
});
