import { type WorkspacePostQueryHookInstance } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/interfaces/workspace-query-hook.interface';

import { WorkspaceQueryHook } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator';
import { WorkspaceQueryHookType } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/types/workspace-query-hook.type';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { ApplyMessageThreadsVisibilityRestrictionsService } from 'src/modules/messaging/common/query-hooks/message-thread/apply-message-threads-visibility-restrictions.service';
import { messageThreadVisibilityCaller } from 'src/modules/messaging/common/query-hooks/message-thread/utils/message-thread-visibility-caller.util';
import { type MessageThreadWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-thread.workspace-entity';

@WorkspaceQueryHook({
  key: `messageThread.findMany`,
  type: WorkspaceQueryHookType.POST_HOOK,
})
export class MessageThreadFindManyPostQueryHook implements WorkspacePostQueryHookInstance {
  constructor(
    private readonly applyMessageThreadsVisibilityRestrictionsService: ApplyMessageThreadsVisibilityRestrictionsService,
  ) {}

  async execute(
    authContext: WorkspaceAuthContext,
    _objectName: string,
    payload: MessageThreadWorkspaceEntity[],
  ): Promise<void> {
    await this.applyMessageThreadsVisibilityRestrictionsService.applyMessageThreadsVisibilityRestrictions(
      payload,
      authContext.workspace.id,
      messageThreadVisibilityCaller(authContext),
    );
  }
}
