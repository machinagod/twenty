import { isDefined } from 'twenty-shared/utils';

import { isUserAuthContext } from 'src/engine/core-modules/auth/guards/is-user-auth-context.guard';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { type UserWorkspaceRoleMap } from 'src/engine/metadata-modules/role-target/types/user-workspace-role-map.type';
import { type SqlCondition } from 'src/engine/twenty-orm/types/row-access-policy.type';
import { escapeIdentifier } from 'src/engine/workspace-manager/workspace-migration/utils/remove-sql-injection.util';

export const MATCH_NO_MESSAGES: SqlCondition = { sql: '1 = 0', parameters: {} };

export const MESSAGE_VISIBILITY_OBJECT_NAMES = [
  'message',
  'messageThread',
  'messageParticipant',
  'messageChannelMessageAssociation',
  'messageChannelMessageAssociationMessageFolder',
] as const;

export type MessageVisibilityObjectName =
  (typeof MESSAGE_VISIBILITY_OBJECT_NAMES)[number];

export const isMessageVisibilityObjectName = (
  nameSingular: string,
): nameSingular is MessageVisibilityObjectName =>
  (MESSAGE_VISIBILITY_OBJECT_NAMES as readonly string[]).includes(nameSingular);

// Admin roles (canUpdateAllSettings) read every mailbox in full.
export const isAdminUserWorkspace = ({
  userWorkspaceId,
  userWorkspaceRoleMap,
  adminRoleIds,
}: {
  userWorkspaceId: string;
  userWorkspaceRoleMap: UserWorkspaceRoleMap;
  adminRoleIds: string[];
}): boolean => {
  const roleId = userWorkspaceRoleMap[userWorkspaceId];

  return isDefined(roleId) && adminRoleIds.includes(roleId);
};

// The rows of a messaging object a user may see: those synced through a
// mailbox they connected, or through one shared with everyone
// (SHARE_EVERYTHING: shared addresses and groups). Mailbox ownership lives in
// core.connectedAccount, so the allowed channels are read in the same
// statement rather than cached.
export const renderMessageVisibilitySql = ({
  alias,
  objectNameSingular,
  associationTable,
  messageTable,
  parameterPrefix,
  workspaceId,
  userWorkspaceId,
}: {
  alias: string;
  objectNameSingular: MessageVisibilityObjectName;
  // Escaped, schema-qualified messageChannelMessageAssociation and message
  // tables.
  associationTable: string;
  messageTable: string;
  parameterPrefix: string;
  workspaceId: string;
  userWorkspaceId: string;
}): SqlCondition => {
  const workspaceParameter = `${parameterPrefix}_workspaceId`;
  const userWorkspaceParameter = `${parameterPrefix}_userWorkspaceId`;

  const allowedChannelIds = `SELECT "mvChannel"."id" FROM "core"."messageChannel" "mvChannel" JOIN "core"."connectedAccount" "mvAccount" ON "mvAccount"."id" = "mvChannel"."connectedAccountId" WHERE "mvChannel"."workspaceId" = :${workspaceParameter} AND ("mvChannel"."visibility" = 'SHARE_EVERYTHING' OR "mvAccount"."userWorkspaceId" = :${userWorkspaceParameter})`;

  const allowedAssociations = (selectedColumn: string) =>
    `SELECT "mvAssociation".${escapeIdentifier(selectedColumn)} FROM ${associationTable} "mvAssociation" WHERE "mvAssociation"."deletedAt" IS NULL AND "mvAssociation"."messageChannelId" IN (${allowedChannelIds})`;

  // The association's own messageThreadId is not populated by the sync, so
  // threads are reached through their messages.
  const allowedThreadIds = `SELECT "mvMessage"."messageThreadId" FROM ${messageTable} "mvMessage" WHERE "mvMessage"."id" IN (${allowedAssociations('messageId')})`;

  const column = (name: string) =>
    `${escapeIdentifier(alias)}.${escapeIdentifier(name)}`;

  const sqlByObject: Record<MessageVisibilityObjectName, string> = {
    message: `${column('id')} IN (${allowedAssociations('messageId')})`,
    messageThread: `${column('id')} IN (${allowedThreadIds})`,
    messageParticipant: `${column('messageId')} IN (${allowedAssociations('messageId')})`,
    messageChannelMessageAssociation: `${column('messageChannelId')} IN (${allowedChannelIds})`,
    messageChannelMessageAssociationMessageFolder: `${column('messageChannelMessageAssociationId')} IN (${allowedAssociations('id')})`,
  };

  return {
    sql: sqlByObject[objectNameSingular],
    parameters: {
      [workspaceParameter]: workspaceId,
      [userWorkspaceParameter]: userWorkspaceId,
    },
  };
};

// The mailbox restriction for one alias of a user query, or undefined when it
// doesn't apply (other objects, admins, API keys, applications, system
// contexts). Fails closed when the messaging tables can't be resolved.
export const buildMessageVisibilityCondition = ({
  alias,
  objectNameSingular,
  isStandardObject,
  workspaceId,
  authContext,
  userWorkspaceRoleMap,
  adminRoleIds,
  getStandardTableName,
}: {
  alias: string;
  objectNameSingular: string;
  isStandardObject: boolean;
  workspaceId: string;
  authContext: WorkspaceAuthContext;
  userWorkspaceRoleMap: UserWorkspaceRoleMap;
  adminRoleIds: string[];
  // Escaped, schema-qualified table of a standard object, by name.
  getStandardTableName: (nameSingular: string) => string | undefined;
}): SqlCondition | undefined => {
  if (!isStandardObject || !isMessageVisibilityObjectName(objectNameSingular)) {
    return undefined;
  }

  if (!isUserAuthContext(authContext)) {
    return undefined;
  }

  const { userWorkspaceId } = authContext;

  if (!isDefined(userWorkspaceId)) {
    return MATCH_NO_MESSAGES;
  }

  if (
    isAdminUserWorkspace({
      userWorkspaceId,
      userWorkspaceRoleMap,
      adminRoleIds,
    })
  ) {
    return undefined;
  }

  const associationTable = getStandardTableName(
    'messageChannelMessageAssociation',
  );
  const messageTable = getStandardTableName('message');

  if (!isDefined(associationTable) || !isDefined(messageTable)) {
    return MATCH_NO_MESSAGES;
  }

  return renderMessageVisibilitySql({
    alias,
    objectNameSingular,
    associationTable,
    messageTable,
    parameterPrefix: `messageVisibility_${alias.replace(/[^A-Za-z0-9_]/g, '_')}`,
    workspaceId,
    userWorkspaceId,
  });
};
