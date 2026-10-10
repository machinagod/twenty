import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import {
  buildMessageVisibilityCondition,
  isAdminUserWorkspace,
  isMessageVisibilityObjectName,
  MATCH_NO_MESSAGES,
  MESSAGE_VISIBILITY_OBJECT_NAMES,
  renderMessageVisibilitySql,
} from 'src/engine/twenty-orm/record-scoping/utils/build-message-visibility-condition.util';
import { compileNamedParameters } from 'src/engine/twenty-orm/sql/utils/compile-named-parameters.util';

const ASSOCIATION_TABLE = '"ws"."messageChannelMessageAssociation"';
const MESSAGE_TABLE = '"ws"."message"';
const TABLES: Record<string, string> = {
  messageChannelMessageAssociation: ASSOCIATION_TABLE,
  message: MESSAGE_TABLE,
};

const memberAuthContext = {
  type: 'user',
  userWorkspaceId: 'uw-member',
  workspaceMember: { id: 'wm-member' },
} as unknown as WorkspaceAuthContext;

const adminAuthContext = {
  type: 'user',
  userWorkspaceId: 'uw-admin',
  workspaceMember: { id: 'wm-admin' },
} as unknown as WorkspaceAuthContext;

const userWorkspaceRoleMap = {
  'uw-member': 'role-member',
  'uw-admin': 'role-admin',
};

const build = (
  overrides: Partial<
    Parameters<typeof buildMessageVisibilityCondition>[0]
  > = {},
) =>
  buildMessageVisibilityCondition({
    alias: 'message',
    objectNameSingular: 'message',
    isStandardObject: true,
    workspaceId: 'workspace-1',
    authContext: memberAuthContext,
    userWorkspaceRoleMap,
    adminRoleIds: ['role-admin'],
    getStandardTableName: (nameSingular) => TABLES[nameSingular],
    ...overrides,
  });

describe('isMessageVisibilityObjectName', () => {
  it('should recognise the messaging objects only', () => {
    for (const name of MESSAGE_VISIBILITY_OBJECT_NAMES) {
      expect(isMessageVisibilityObjectName(name)).toBe(true);
    }
    expect(isMessageVisibilityObjectName('person')).toBe(false);
    expect(isMessageVisibilityObjectName('calendarEvent')).toBe(false);
  });
});

describe('isAdminUserWorkspace', () => {
  it('should be true only for a role in the admin set', () => {
    const base = { userWorkspaceRoleMap, adminRoleIds: ['role-admin'] };

    expect(isAdminUserWorkspace({ ...base, userWorkspaceId: 'uw-admin' })).toBe(
      true,
    );
    expect(
      isAdminUserWorkspace({ ...base, userWorkspaceId: 'uw-member' }),
    ).toBe(false);
    expect(
      isAdminUserWorkspace({ ...base, userWorkspaceId: 'uw-unknown' }),
    ).toBe(false);
  });
});

describe('buildMessageVisibilityCondition', () => {
  it('should not touch other objects or custom objects named like messaging ones', () => {
    expect(build({ objectNameSingular: 'person' })).toBeUndefined();
    expect(build({ isStandardObject: false })).toBeUndefined();
  });

  it('should not restrict API keys, applications or system contexts', () => {
    for (const type of ['apiKey', 'application', 'system']) {
      expect(
        build({ authContext: { type } as unknown as WorkspaceAuthContext }),
      ).toBeUndefined();
    }
  });

  it('should let admins see every mailbox', () => {
    expect(build({ authContext: adminAuthContext })).toBeUndefined();
  });

  it('should match nothing when the user workspace is unknown', () => {
    expect(
      build({
        authContext: {
          type: 'user',
          workspaceMember: { id: 'wm-member' },
        } as unknown as WorkspaceAuthContext,
      }),
    ).toEqual(MATCH_NO_MESSAGES);
  });

  it('should match nothing when a messaging table is missing', () => {
    expect(
      build({
        getStandardTableName: (nameSingular) =>
          nameSingular === 'message' ? undefined : ASSOCIATION_TABLE,
      }),
    ).toEqual(MATCH_NO_MESSAGES);
    expect(build({ getStandardTableName: () => undefined })).toEqual(
      MATCH_NO_MESSAGES,
    );
  });

  it('should limit messages to own and shared mailboxes', () => {
    const condition = build();

    expect(condition?.sql).toBe(
      `"message"."id" IN (SELECT "mvAssociation"."messageId" FROM ${ASSOCIATION_TABLE} "mvAssociation" WHERE "mvAssociation"."deletedAt" IS NULL AND "mvAssociation"."messageChannelId" IN (SELECT "mvChannel"."id" FROM "core"."messageChannel" "mvChannel" JOIN "core"."connectedAccount" "mvAccount" ON "mvAccount"."id" = "mvChannel"."connectedAccountId" WHERE "mvChannel"."workspaceId" = :messageVisibility_message_workspaceId AND ("mvChannel"."visibility" = 'SHARE_EVERYTHING' OR "mvAccount"."userWorkspaceId" = :messageVisibility_message_userWorkspaceId)))`,
    );
    expect(condition?.parameters).toEqual({
      messageVisibility_message_workspaceId: 'workspace-1',
      messageVisibility_message_userWorkspaceId: 'uw-member',
    });
  });

  it('should compile to positional parameters', () => {
    const condition = build({ alias: 'message.thread' })!;
    const { text, values } = compileNamedParameters(
      condition.sql,
      condition.parameters,
    );

    expect(text).not.toContain(':messageVisibility');
    expect(values).toEqual(['workspace-1', 'uw-member']);
  });
});

describe('renderMessageVisibilitySql', () => {
  const render = (
    objectNameSingular: Parameters<
      typeof renderMessageVisibilitySql
    >[0]['objectNameSingular'],
  ) =>
    renderMessageVisibilitySql({
      alias: 'row',
      objectNameSingular,
      associationTable: ASSOCIATION_TABLE,
      messageTable: MESSAGE_TABLE,
      parameterPrefix: 'p',
      workspaceId: 'workspace-1',
      userWorkspaceId: 'uw-member',
    }).sql;

  it.each([
    [
      'messageThread',
      '"row"."id" IN (SELECT "mvMessage"."messageThreadId" FROM "ws"."message" "mvMessage" WHERE "mvMessage"."id" IN (SELECT "mvAssociation"."messageId"',
    ],
    [
      'messageParticipant',
      '"row"."messageId" IN (SELECT "mvAssociation"."messageId"',
    ],
    [
      'messageChannelMessageAssociation',
      '"row"."messageChannelId" IN (SELECT "mvChannel"."id"',
    ],
    [
      'messageChannelMessageAssociationMessageFolder',
      '"row"."messageChannelMessageAssociationId" IN (SELECT "mvAssociation"."id"',
    ],
  ] as const)('should scope %s through the allowed channels', (name, start) => {
    const sql = render(name);

    expect(sql.startsWith(start)).toBe(true);
    expect(sql).toContain(`"mvChannel"."visibility" = 'SHARE_EVERYTHING'`);
    expect(sql).toContain(`"mvAccount"."userWorkspaceId" = :p_userWorkspaceId`);
  });
});
