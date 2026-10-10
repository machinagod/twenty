import { Injectable } from '@nestjs/common';

import { isAdminUserWorkspace } from 'src/engine/twenty-orm/record-scoping/utils/build-message-visibility-condition.util';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';

// Admins read every mailbox in full; everyone else only their own mailboxes
// and shared ones.
@Injectable()
export class MessageMailboxAdminService {
  constructor(private readonly workspaceCacheService: WorkspaceCacheService) {}

  async isAdmin(
    workspaceId: string,
    userWorkspaceId: string,
  ): Promise<boolean> {
    const { userWorkspaceRoleMap, roleIdsWithAllRecordsAccess } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'userWorkspaceRoleMap',
        'roleIdsWithAllRecordsAccess',
      ]);

    return isAdminUserWorkspace({
      userWorkspaceId,
      userWorkspaceRoleMap,
      adminRoleIds: roleIdsWithAllRecordsAccess,
    });
  }
}
