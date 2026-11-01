import { STANDARD_OBJECTS } from 'twenty-shared/metadata';

import { AddRetryWorkflowRunCommandMenuItemCommand } from 'src/database/commands/upgrade-version-command/2-45/2-45-workspace-command-1793565413000-add-retry-workflow-run-command-menu-item.command';
import { getRegisteredWorkspaceCommandMetadata } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { STANDARD_COMMAND_MENU_ITEMS } from 'src/engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant';
import { TWENTY_STANDARD_APPLICATION } from 'src/engine/workspace-manager/twenty-standard-application/constants/twenty-standard-applications';
import { WorkspaceMigrationBuilderException } from 'src/engine/workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception';

const WORKSPACE_ID = 'workspace-id';
const APPLICATION_ID = 'application-id';
const WORKFLOW_RUN_OBJECT_ID = 'workflow-run-object-id';
const RETRY_UNIVERSAL_IDENTIFIER =
  STANDARD_COMMAND_MENU_ITEMS.retryWorkflowRun.universalIdentifier;

const STOP_COMMAND_MENU_ITEM = {
  universalIdentifier:
    STANDARD_COMMAND_MENU_ITEMS.stopWorkflowRun.universalIdentifier,
  applicationId: APPLICATION_ID,
  applicationUniversalIdentifier:
    TWENTY_STANDARD_APPLICATION.universalIdentifier,
};

const RETRY_COMMAND_MENU_ITEM = {
  ...STOP_COMMAND_MENU_ITEM,
  universalIdentifier: RETRY_UNIVERSAL_IDENTIFIER,
};

describe('AddRetryWorkflowRunCommandMenuItemCommand', () => {
  let getOrRecompute: jest.Mock;
  let validateBuildAndRunLegacyWorkspaceMigration: jest.Mock;
  let command: AddRetryWorkflowRunCommandMenuItemCommand;

  const args = (dryRun = false) =>
    ({ workspaceId: WORKSPACE_ID, options: { dryRun } }) as never;

  const mockWorkspaceCommandMenuItems = (commandMenuItems: object[]) => {
    getOrRecompute.mockResolvedValue({
      flatCommandMenuItemMaps: {
        byUniversalIdentifier: Object.fromEntries(
          commandMenuItems.map((commandMenuItem) => [
            (commandMenuItem as typeof STOP_COMMAND_MENU_ITEM)
              .universalIdentifier,
            commandMenuItem,
          ]),
        ),
      },
      flatObjectMetadataMaps: {
        ...createEmptyFlatEntityMaps(),
        byUniversalIdentifier: {
          [STANDARD_OBJECTS.workflowRun.universalIdentifier]: {
            id: WORKFLOW_RUN_OBJECT_ID,
            universalIdentifier:
              STANDARD_OBJECTS.workflowRun.universalIdentifier,
          },
        },
      },
    });
  };

  const migrationOperations = () =>
    validateBuildAndRunLegacyWorkspaceMigration.mock.calls[0][0]
      .allFlatEntityOperationByMetadataName.commandMenuItem;

  beforeEach(() => {
    getOrRecompute = jest.fn();
    validateBuildAndRunLegacyWorkspaceMigration = jest
      .fn()
      .mockResolvedValue({ status: 'success' });
    command = new AddRetryWorkflowRunCommandMenuItemCommand(
      {} as never,
      { getOrRecompute } as never,
      { validateBuildAndRunLegacyWorkspaceMigration } as never,
    );
  });

  it('sits in the 2.45.2 fork slot so prod runs it after 2.45.1', () => {
    expect(
      getRegisteredWorkspaceCommandMetadata(
        AddRetryWorkflowRunCommandMenuItemCommand,
      ),
    ).toEqual({ version: '2.45.2', timestamp: 1793565413000 });
  });

  describe('up', () => {
    it('adds Retry to a workspace that predates it, available on failed runs', async () => {
      mockWorkspaceCommandMenuItems([STOP_COMMAND_MENU_ITEM]);

      await command.runOnWorkspace(args());

      expect(
        validateBuildAndRunLegacyWorkspaceMigration,
      ).toHaveBeenCalledTimes(1);

      const { flatEntityToCreate, flatEntityToDelete, flatEntityToUpdate } =
        migrationOperations();

      expect(flatEntityToDelete).toEqual([]);
      expect(flatEntityToUpdate).toEqual([]);
      expect(flatEntityToCreate).toHaveLength(1);
      expect(flatEntityToCreate[0]).toMatchObject({
        universalIdentifier: RETRY_UNIVERSAL_IDENTIFIER,
        applicationId: APPLICATION_ID,
        workspaceId: WORKSPACE_ID,
        availabilityObjectMetadataId: WORKFLOW_RUN_OBJECT_ID,
        conditionalAvailabilityExpression:
          'someEquals(selectedRecords, "status", "FAILED")',
      });
    });

    it('leaves a workspace that already has Retry alone', async () => {
      mockWorkspaceCommandMenuItems([
        STOP_COMMAND_MENU_ITEM,
        RETRY_COMMAND_MENU_ITEM,
      ]);

      await command.up(args());

      expect(
        validateBuildAndRunLegacyWorkspaceMigration,
      ).not.toHaveBeenCalled();
    });

    it('writes nothing on a dry run', async () => {
      mockWorkspaceCommandMenuItems([STOP_COMMAND_MENU_ITEM]);

      await command.up(args(true));

      expect(
        validateBuildAndRunLegacyWorkspaceMigration,
      ).not.toHaveBeenCalled();
    });

    it('fails the upgrade when the migration is rejected', async () => {
      mockWorkspaceCommandMenuItems([STOP_COMMAND_MENU_ITEM]);
      validateBuildAndRunLegacyWorkspaceMigration.mockResolvedValue({
        status: 'fail',
        report: {},
      });

      await expect(command.up(args())).rejects.toBeInstanceOf(
        WorkspaceMigrationBuilderException,
      );
    });
  });

  describe('down', () => {
    it('removes Retry', async () => {
      mockWorkspaceCommandMenuItems([
        STOP_COMMAND_MENU_ITEM,
        RETRY_COMMAND_MENU_ITEM,
      ]);

      await command.down(args());

      const { flatEntityToCreate, flatEntityToDelete } = migrationOperations();

      expect(flatEntityToCreate).toEqual([]);
      expect(flatEntityToDelete).toEqual([RETRY_COMMAND_MENU_ITEM]);
    });

    it('does nothing when Retry is already gone', async () => {
      mockWorkspaceCommandMenuItems([STOP_COMMAND_MENU_ITEM]);

      await command.down(args());

      expect(
        validateBuildAndRunLegacyWorkspaceMigration,
      ).not.toHaveBeenCalled();
    });
  });
});
