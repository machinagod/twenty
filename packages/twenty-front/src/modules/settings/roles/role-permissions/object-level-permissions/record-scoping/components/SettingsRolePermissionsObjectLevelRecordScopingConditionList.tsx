import { SettingsRolePermissionsObjectLevelRecordScopingConditionRow } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/components/SettingsRolePermissionsObjectLevelRecordScopingConditionRow';
import { type RecordScopingColumnOption } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingColumnOption';
import {
  type RecordScopingConditionDraft,
  type RecordScopingLogicalOperator,
} from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingConditionDraft';
import {
  createRecordScopingConditionDraft,
  type GetRecordScopingColumns,
  getDefaultRecordScopingColumn,
} from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/utils/recordScopingConditionDraft';
import { Select } from '@/ui/input/components/Select';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { isDefined } from 'twenty-shared/utils';
import { IconPlus } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledActions = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

type SettingsRolePermissionsObjectLevelRecordScopingConditionListProps = {
  drafts: RecordScopingConditionDraft[];
  logicalOperator: RecordScopingLogicalOperator;
  columns: RecordScopingColumnOption[];
  getColumns: GetRecordScopingColumns;
  getObjectLabel: (objectMetadataId: string) => string;
  depth: number;
  instanceId: string;
  onDraftsChange: (drafts: RecordScopingConditionDraft[]) => void;
  onLogicalOperatorChange: (
    logicalOperator: RecordScopingLogicalOperator,
  ) => void;
};

// The conditions of a rule, or of the related records one of them matches.
export const SettingsRolePermissionsObjectLevelRecordScopingConditionList = ({
  drafts,
  logicalOperator,
  columns,
  getColumns,
  getObjectLabel,
  depth,
  instanceId,
  onDraftsChange,
  onLogicalOperatorChange,
}: SettingsRolePermissionsObjectLevelRecordScopingConditionListProps) => {
  const handleAddCondition = () => {
    const defaultColumn = getDefaultRecordScopingColumn(columns);

    if (isDefined(defaultColumn)) {
      onDraftsChange([
        ...drafts,
        createRecordScopingConditionDraft(defaultColumn),
      ]);
    }
  };

  return (
    <StyledList>
      {drafts.map((draft) => (
        <SettingsRolePermissionsObjectLevelRecordScopingConditionRow
          key={draft.key}
          draft={draft}
          columns={columns}
          getColumns={getColumns}
          getObjectLabel={getObjectLabel}
          depth={depth}
          instanceId={`${instanceId}-${draft.key}`}
          onChange={(nextDraft) =>
            onDraftsChange(
              drafts.map((current) =>
                current.key === nextDraft.key ? nextDraft : current,
              ),
            )
          }
          onRemove={() =>
            onDraftsChange(
              drafts.filter((current) => current.key !== draft.key),
            )
          }
        />
      ))}
      <StyledActions>
        <Button
          size="sm"
          variant="outline"
          startIcon={<IconPlus />}
          onClick={handleAddCondition}
          disabled={columns.length === 0}
        >{t`Add condition`}</Button>
        {drafts.length > 1 && (
          <Select
            dropdownId={`${instanceId}-logical-operator`}
            options={[
              { value: 'AND', label: t`Match all conditions` },
              { value: 'OR', label: t`Match any condition` },
            ]}
            value={logicalOperator}
            onChange={onLogicalOperatorChange}
          />
        )}
      </StyledActions>
    </StyledList>
  );
};
