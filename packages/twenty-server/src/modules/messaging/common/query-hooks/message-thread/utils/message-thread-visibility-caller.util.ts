import { isApplicationAuthContext } from 'src/engine/core-modules/auth/guards/is-application-auth-context.guard';
import { isUserAuthContext } from 'src/engine/core-modules/auth/guards/is-user-auth-context.guard';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';

// Who is reading threads: a user owns mailboxes through their user workspace,
// an application through the connections it created. API keys own none.
export const messageThreadVisibilityCaller = (
  authContext: WorkspaceAuthContext,
): { userWorkspaceId?: string; applicationId?: string } => {
  if (isUserAuthContext(authContext)) {
    return { userWorkspaceId: authContext.userWorkspaceId };
  }

  if (isApplicationAuthContext(authContext)) {
    return { applicationId: authContext.application.id };
  }

  return {};
};
