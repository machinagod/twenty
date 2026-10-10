import { type WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { MessageMailboxAdminService } from 'src/modules/messaging/common/services/message-mailbox-admin.service';

describe('MessageMailboxAdminService', () => {
  let getOrRecompute: jest.Mock;
  let service: MessageMailboxAdminService;

  beforeEach(() => {
    getOrRecompute = jest.fn().mockResolvedValue({
      userWorkspaceRoleMap: { 'uw-admin': 'role-admin', 'uw-rep': 'role-rep' },
      roleIdsWithAllRecordsAccess: ['role-admin'],
    });
    service = new MessageMailboxAdminService({
      getOrRecompute,
    } as unknown as WorkspaceCacheService);
  });

  it('should treat a role with every setting as admin', async () => {
    await expect(service.isAdmin('workspace-1', 'uw-admin')).resolves.toBe(
      true,
    );
    expect(getOrRecompute).toHaveBeenCalledWith('workspace-1', [
      'userWorkspaceRoleMap',
      'roleIdsWithAllRecordsAccess',
    ]);
  });

  it('should not treat other roles or unknown users as admin', async () => {
    await expect(service.isAdmin('workspace-1', 'uw-rep')).resolves.toBe(false);
    await expect(service.isAdmin('workspace-1', 'uw-unknown')).resolves.toBe(
      false,
    );
  });
});
