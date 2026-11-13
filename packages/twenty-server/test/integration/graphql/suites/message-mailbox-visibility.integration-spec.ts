import { randomBytes, randomUUID } from 'crypto';

import { parse } from 'graphql';

import { makeGraphqlApiRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { search } from 'test/integration/graphql/utils/search.util';
import { findOneRoleByLabel } from 'test/integration/metadata/suites/role/utils/find-one-role-by-label.util';
import { updateWorkspaceMemberRole } from 'test/integration/metadata/suites/role/utils/update-workspace-member-role.util';

import { SEED_APPLE_WORKSPACE_ID } from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';
import { getWorkspaceSchemaName } from 'src/engine/workspace-datasource/utils/get-workspace-schema-name.util';

// Proves that messages, threads and participants are only visible through a
// mailbox the user connected or one shared with everyone (SHARE_EVERYTHING),
// on every read path: lists, counts, findOne, relations, search and the person
// timeline. Admins see every mailbox in full. API keys keep the upstream
// per-channel masking, now also on the thread subject.
type Mailbox = 'jony' | 'phil' | 'shared';

const MAILBOXES: Mailbox[] = ['jony', 'phil', 'shared'];
const RESTRICTED = 'FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED';

describe('messages are only visible from own or shared mailboxes', () => {
  const schema = getWorkspaceSchemaName(SEED_APPLE_WORKSPACE_ID);
  const marker = `mv${randomBytes(4).toString('hex')}`;
  const personId = randomUUID();

  const ids = Object.fromEntries(
    MAILBOXES.map((mailbox) => [
      mailbox,
      {
        account: randomUUID(),
        channel: randomUUID(),
        thread: randomUUID(),
        message: randomUUID(),
        association: randomUUID(),
        participant: randomUUID(),
        target: randomUUID(),
        word: `${marker}${mailbox}`,
      },
    ]),
  ) as Record<
    Mailbox,
    {
      account: string;
      channel: string;
      thread: string;
      message: string;
      association: string;
      participant: string;
      target: string;
      word: string;
    }
  >;

  const subjectOf = (mailbox: Mailbox) => `Proposta ${ids[mailbox].word}`;
  const textOf = (mailbox: Mailbox) => `Corpo ${mailbox}`;

  let philOriginalRoleId: string;

  const userWorkspaceIdOf = async (workspaceMemberId: string) => {
    const [row] = await global.testDataSource.query(
      `SELECT uw.id FROM core."userWorkspace" uw
       JOIN ${schema}."workspaceMember" wm ON wm."userId" = uw."userId"
       WHERE uw."workspaceId" = $1 AND wm.id = $2`,
      [SEED_APPLE_WORKSPACE_ID, workspaceMemberId],
    );

    return row.id as string;
  };

  const query = (token: string, gqlQuery: string, variables = {}) =>
    makeGraphqlApiRequest({ query: parse(gqlQuery), variables }, token);

  const ourIds = (kind: 'thread' | 'message' | 'participant') =>
    MAILBOXES.map((mailbox) => ids[mailbox][kind]);

  const visibleMailboxes = <TNode extends { id: string }>(
    nodes: TNode[],
    kind: 'thread' | 'message' | 'participant',
  ) =>
    MAILBOXES.filter((mailbox) =>
      nodes.some((node) => node.id === ids[mailbox][kind]),
    );

  beforeAll(async () => {
    const jonyUserWorkspaceId = await userWorkspaceIdOf(
      WORKSPACE_MEMBER_DATA_SEED_IDS.JONY,
    );
    const philUserWorkspaceId = await userWorkspaceIdOf(
      WORKSPACE_MEMBER_DATA_SEED_IDS.PHIL,
    );

    const owners: Record<Mailbox, string> = {
      jony: jonyUserWorkspaceId,
      phil: philUserWorkspaceId,
      shared: philUserWorkspaceId,
    };
    const visibilities: Record<Mailbox, string> = {
      jony: 'METADATA',
      phil: 'SUBJECT',
      shared: 'SHARE_EVERYTHING',
    };

    await global.testDataSource.query(
      `INSERT INTO ${schema}.person (id, "nameFirstName", "nameLastName") VALUES ($1, 'Mailbox', $2)`,
      [personId, marker],
    );

    for (const mailbox of MAILBOXES) {
      const row = ids[mailbox];

      await global.testDataSource.query(
        `INSERT INTO core."connectedAccount" (id, "workspaceId", handle, provider, "userWorkspaceId")
         VALUES ($1, $2, $3, 'imap_smtp_caldav', $4)`,
        [
          row.account,
          SEED_APPLE_WORKSPACE_ID,
          `${row.word}@apple.dev`,
          owners[mailbox],
        ],
      );
      await global.testDataSource.query(
        `INSERT INTO core."messageChannel" (id, "workspaceId", "connectedAccountId", handle, type, visibility, "pendingGroupEmailsAction", "syncStage", "isSyncEnabled")
         VALUES ($1, $2, $3, $4, 'EMAIL', $5, 'NONE', 'PENDING_CONFIGURATION', false)`,
        [
          row.channel,
          SEED_APPLE_WORKSPACE_ID,
          row.account,
          `${row.word}@apple.dev`,
          visibilities[mailbox],
        ],
      );
      await global.testDataSource.query(
        `INSERT INTO ${schema}."messageThread" (id, subject) VALUES ($1, $2)`,
        [row.thread, subjectOf(mailbox)],
      );
      await global.testDataSource.query(
        `INSERT INTO ${schema}.message (id, subject, text, "messageThreadId", "receivedAt") VALUES ($1, $2, $3, $4, now())`,
        [row.message, subjectOf(mailbox), textOf(mailbox), row.thread],
      );
      await global.testDataSource.query(
        `INSERT INTO ${schema}."messageChannelMessageAssociation" (id, "messageId", "messageChannelId") VALUES ($1, $2, $3)`,
        [row.association, row.message, row.channel],
      );
      await global.testDataSource.query(
        `INSERT INTO ${schema}."messageParticipant" (id, "messageId", "personId", handle) VALUES ($1, $2, $3, $4)`,
        [row.participant, row.message, personId, `${row.word}@client.dev`],
      );
      // The timeline reads threads through their targets.
      await global.testDataSource.query(
        `INSERT INTO ${schema}."messageThreadTarget" (id, "messageThreadId", "targetPersonId") VALUES ($1, $2, $3)`,
        [row.target, row.thread, personId],
      );
    }

    const guestRole = await findOneRoleByLabel({ label: 'Guest' });
    const memberRole = await findOneRoleByLabel({ label: 'Member' });

    philOriginalRoleId = guestRole.id;

    await updateWorkspaceMemberRole({
      input: {
        workspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.PHIL,
        roleId: memberRole.id,
      },
      expectToFail: false,
    });
  });

  afterAll(async () => {
    await updateWorkspaceMemberRole({
      input: {
        workspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.PHIL,
        roleId: philOriginalRoleId,
      },
      expectToFail: false,
    });

    for (const mailbox of MAILBOXES) {
      const row = ids[mailbox];

      await global.testDataSource.query(
        `DELETE FROM ${schema}."messageThreadTarget" WHERE id = $1`,
        [row.target],
      );
      await global.testDataSource.query(
        `DELETE FROM ${schema}."messageParticipant" WHERE id = $1`,
        [row.participant],
      );
      await global.testDataSource.query(
        `DELETE FROM ${schema}."messageChannelMessageAssociation" WHERE id = $1`,
        [row.association],
      );
      await global.testDataSource.query(
        `DELETE FROM ${schema}.message WHERE id = $1`,
        [row.message],
      );
      await global.testDataSource.query(
        `DELETE FROM ${schema}."messageThread" WHERE id = $1`,
        [row.thread],
      );
      await global.testDataSource.query(
        `DELETE FROM core."messageChannel" WHERE id = $1`,
        [row.channel],
      );
      await global.testDataSource.query(
        `DELETE FROM core."connectedAccount" WHERE id = $1`,
        [row.account],
      );
    }

    await global.testDataSource.query(
      `DELETE FROM ${schema}.person WHERE id = $1`,
      [personId],
    );
  });

  const listMessages = (token: string) =>
    query(
      token,
      `query ($ids: [UUID!]) {
        messages(filter: { id: { in: $ids } }) {
          totalCount
          edges { node { id subject text messageThread { id subject } } }
        }
      }`,
      { ids: ourIds('message') },
    );

  const listThreads = (token: string) =>
    query(
      token,
      `query ($ids: [UUID!]) {
        messageThreads(filter: { id: { in: $ids } }) {
          totalCount
          edges { node { id subject } }
        }
      }`,
      { ids: ourIds('thread') },
    );

  const listParticipants = (token: string) =>
    query(
      token,
      `query ($ids: [UUID!]) {
        messageParticipants(filter: { id: { in: $ids } }) {
          totalCount
          edges { node { id handle message { id subject } } }
        }
      }`,
      { ids: ourIds('participant') },
    );

  const findThread = (token: string, threadId: string) =>
    query(
      token,
      `query ($id: UUID!) { messageThread(filter: { id: { eq: $id } }) { id subject } }`,
      { id: threadId },
    );

  const searchRecordIds = async (token: string, word: string) => {
    const response = await search({
      searchInput: word,
      limit: 20,
      includedObjectNameSingulars: ['messageThread', 'message'],
      accessToken: token,
      expectToFail: false,
    });

    expect(response.errors).toBeUndefined();

    return response.data.search.edges.map((edge) => edge.node.recordId);
  };

  const timeline = (token: string) =>
    query(
      token,
      `query ($personId: UUID!) {
        getTimelineThreadsFromPersonId(personId: $personId, page: 1, pageSize: 10) {
          totalNumberOfThreads
          timelineThreads { id subject lastMessageBody }
        }
      }`,
      { personId },
    );

  describe.each([
    [
      'Jony',
      () => APPLE_JONY_MEMBER_ACCESS_TOKEN,
      ['jony', 'shared'] as Mailbox[],
    ],
    [
      'Phil',
      () => APPLE_PHIL_GUEST_ACCESS_TOKEN,
      ['phil', 'shared'] as Mailbox[],
    ],
  ])('as %s (a non-admin)', (_name, token, visible) => {
    const hidden = MAILBOXES.filter((mailbox) => !visible.includes(mailbox));

    it('should list and count only messages from own and shared mailboxes, in full', async () => {
      const response = await listMessages(token());
      const { totalCount, edges } = response.body.data.messages;
      const nodes = edges.map((edge: { node: unknown }) => edge.node);

      expect(response.body.errors).toBeUndefined();
      expect(totalCount).toBe(visible.length);
      expect(visibleMailboxes(nodes, 'message')).toEqual(visible);

      for (const mailbox of visible) {
        const node = nodes.find(
          (candidate: { id: string }) => candidate.id === ids[mailbox].message,
        );

        expect(node.subject).toBe(subjectOf(mailbox));
        expect(node.text).toBe(textOf(mailbox));
        expect(node.messageThread.subject).toBe(subjectOf(mailbox));
      }
    });

    it('should list and count only threads from own and shared mailboxes', async () => {
      const response = await listThreads(token());
      const { totalCount, edges } = response.body.data.messageThreads;
      const nodes = edges.map((edge: { node: unknown }) => edge.node);

      expect(totalCount).toBe(visible.length);
      expect(visibleMailboxes(nodes, 'thread')).toEqual(visible);
      expect(
        nodes.map((node: { subject: string }) => node.subject).sort(),
      ).toEqual(visible.map(subjectOf).sort());
    });

    it('should not find a thread from another mailbox by id', async () => {
      for (const mailbox of hidden) {
        const response = await findThread(token(), ids[mailbox].thread);

        expect(response.body.data?.messageThread ?? null).toBeNull();
      }

      const ownResponse = await findThread(token(), ids[visible[0]].thread);

      expect(ownResponse.body.data.messageThread.subject).toBe(
        subjectOf(visible[0]),
      );
    });

    it('should list only participants of visible messages', async () => {
      const response = await listParticipants(token());
      const { totalCount, edges } = response.body.data.messageParticipants;
      const nodes = edges.map((edge: { node: unknown }) => edge.node);

      expect(totalCount).toBe(visible.length);
      expect(visibleMailboxes(nodes, 'participant')).toEqual(visible);
    });

    it('should not return hidden threads or messages from search', async () => {
      for (const mailbox of hidden) {
        const recordIds = await searchRecordIds(token(), ids[mailbox].word);

        expect(recordIds).not.toContain(ids[mailbox].thread);
        expect(recordIds).not.toContain(ids[mailbox].message);
      }
    });

    it('should show only visible threads on the person timeline', async () => {
      const response = await timeline(token());
      const { totalNumberOfThreads, timelineThreads } =
        response.body.data.getTimelineThreadsFromPersonId;

      expect(totalNumberOfThreads).toBe(visible.length);
      expect(
        timelineThreads.map((thread: { id: string }) => thread.id).sort(),
      ).toEqual(visible.map((mailbox) => ids[mailbox].thread).sort());
      expect(
        timelineThreads.map((thread: { subject: string }) => thread.subject),
      ).not.toContain(subjectOf(hidden[0]));
    });
  });

  // Messaging objects are system objects and not searchable (they can't be made
  // searchable through the metadata API), so search never exposes a thread
  // subject. If that ever changes upstream, this fails: search reads through the
  // workspace repository, so the mailbox rule would apply, but recheck it.
  it('should keep threads and messages out of search for every caller', async () => {
    for (const token of [
      APPLE_JANE_ADMIN_ACCESS_TOKEN,
      APPLE_JONY_MEMBER_ACCESS_TOKEN,
    ]) {
      for (const mailbox of MAILBOXES) {
        const recordIds = await searchRecordIds(token, ids[mailbox].word);

        expect(recordIds).not.toContain(ids[mailbox].thread);
        expect(recordIds).not.toContain(ids[mailbox].message);
      }
    }
  });

  describe('as an admin', () => {
    it('should see every mailbox in full', async () => {
      const response = await listMessages(APPLE_JANE_ADMIN_ACCESS_TOKEN);
      const nodes = response.body.data.messages.edges.map(
        (edge: { node: unknown }) => edge.node,
      );

      expect(visibleMailboxes(nodes, 'message')).toEqual(MAILBOXES);
      for (const mailbox of MAILBOXES) {
        const node = nodes.find(
          (candidate: { id: string }) => candidate.id === ids[mailbox].message,
        );

        expect(node.subject).toBe(subjectOf(mailbox));
        expect(node.text).toBe(textOf(mailbox));
      }

      const threads = await listThreads(APPLE_JANE_ADMIN_ACCESS_TOKEN);

      expect(threads.body.data.messageThreads.totalCount).toBe(3);

      const timelineResponse = await timeline(APPLE_JANE_ADMIN_ACCESS_TOKEN);
      const timelineThreads =
        timelineResponse.body.data.getTimelineThreadsFromPersonId
          .timelineThreads;

      expect(timelineThreads).toHaveLength(3);
      expect(
        timelineThreads
          .map((thread: { subject: string }) => thread.subject)
          .sort(),
      ).toEqual(MAILBOXES.map(subjectOf).sort());
    });
  });

  describe('with an API key', () => {
    it('should mask a thread subject the same way as its messages', async () => {
      const response = await listThreads(API_KEY_ACCESS_TOKEN);
      const nodes: { id: string; subject: string }[] =
        response.body.data.messageThreads.edges.map(
          (edge: { node: unknown }) => edge.node,
        );
      const subjectFor = (mailbox: Mailbox) =>
        nodes.find((node) => node.id === ids[mailbox].thread)?.subject;

      expect(subjectFor('jony')).toBe(RESTRICTED);
      expect(subjectFor('phil')).toBe(subjectOf('phil'));
      expect(subjectFor('shared')).toBe(subjectOf('shared'));
    });
  });
});
