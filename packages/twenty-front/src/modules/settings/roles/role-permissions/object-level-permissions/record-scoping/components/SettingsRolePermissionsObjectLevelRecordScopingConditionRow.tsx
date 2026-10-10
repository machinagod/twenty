import { type RecordScopingColumnOption } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingColumnOption';
import {
  type RecordScopingConditionDraft,
  type RecordScopingOperator,
  type RecordScopingValueSource,
} from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingConditionDraft';
import { SettingsRolePermissionsObjectLevelRecordScopingConditionList } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/components/SettingsRolePermissionsObjectLevelRecordScopingConditionList';
import {
  canMatchRelatedRecords,
  createRecordScopingConditionDraft,
  type GetRecordScopingColumns,
  getCurrentMemberFieldForColumn,
  getRecordScopingOperators,
  MAX_RECORD_SCOPING_RELATED_DEPTH,
  toRelatedRecordScopingConditionDraft,
} from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/utils/recordScopingConditionDraft';
import { Select } from '@/ui/input/components/Select';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { isDefined } from 'twenty-shared/utils';
import { LightIconButton } from 'twenty-ui/components';
import { IconTrash } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledRow = styled.div`
  align-items: center;
  display: grid;
  gap: ${themeCssVariables.spacing[2]};
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr) minmax(0, 3fr) auto;
`;

const StyledCondition = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledRelated = styled.div`
  border-left: 1px solid ${themeCssVariables.border.color.medium};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  margin-left: ${themeCssVariables.spacing[2]};
  padding-left: ${themeCssVariables.spacing[3]};
`;

const StyledRelatedTitle = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledValueGroup = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  min-width: 0;
`;

type SettingsRolePermissionsObjectLevelRecordScopingConditionRowProps = {
  draft: RecordScopingConditionDraft;
  columns: RecordScopingColumnOption[];
  getColumns: GetRecordScopingColumns;
  getObjectLabel: (objectMetadataId: string) => string;
  depth: number;
  instanceId: string;
  onChange: (draft: RecordScopingConditionDraft) => void;
  onRemove: () => void;
};

export const SettingsRolePermissionsObjectLevelRecordScopingConditionRow = ({
  draft,
  columns,
  getColumns,
  getObjectLabel,
  depth,
  instanceId,
  onChange,
  onRemove,
}: SettingsRolePermissionsObjectLevelRecordScopingConditionRowProps) => {
  const column = columns.find((option) => option.column === draft.column);

  const operatorLabels: Record<RecordScopingOperator, string> = {
    eq: t`Is`,
    neq: t`Is not`,
    in: t`Is any of`,
  };

  const handleColumnChange = (columnName: string) => {
    const nextColumn = columns.find((option) => option.column === columnName);

    if (isDefined(nextColumn)) {
      onChange({
        ...createRecordScopingConditionDraft(nextColumn),
        key: draft.key,
      });
    }
  };

  const handleOperatorChange = (operator: RecordScopingOperator) => {
    onChange({
      ...draft,
      operator,
      valueSource: operator === 'in' ? 'STATIC' : draft.valueSource,
    });
  };

  const canUseRelatedRecords =
    isDefined(column) &&
    canMatchRelatedRecords(column) &&
    depth < MAX_RECORD_SCOPING_RELATED_DEPTH;

  const handleValueSourceChange = (valueSource: RecordScopingValueSource) => {
    if (!isDefined(column)) {
      return;
    }

    if (valueSource === 'RELATED') {
      onChange(toRelatedRecordScopingConditionDraft(draft, column, getColumns));
      return;
    }

    onChange({
      ...draft,
      valueSource,
      operator: draft.valueSource === 'RELATED' ? 'eq' : draft.operator,
      related: undefined,
    });
  };

  const renderValueInput = () => {
    if (!isDefined(column)) {
      return null;
    }

    if (canUseRelatedRecords) {
      return (
        <StyledValueGroup>
          <Select
            dropdownId={`${instanceId}-value-source`}
            fullWidth
            options={[
              { value: 'STATIC', label: t`Value` },
              { value: 'RELATED', label: t`Matching records` },
            ]}
            value={draft.valueSource}
            onChange={handleValueSourceChange}
          />
          {draft.valueSource === 'STATIC' && (
            <SettingsTextInput
              instanceId={`${instanceId}-value`}
              fullWidth
              value={draft.staticValue}
              placeholder={
                draft.operator === 'in'
                  ? t`Comma-separated values`
                  : t`Enter value`
              }
              onChange={(staticValue) => onChange({ ...draft, staticValue })}
            />
          )}
        </StyledValueGroup>
      );
    }

    if (column.valueKind === 'WORKSPACE_MEMBER') {
      return (
        <Select
          dropdownId={`${instanceId}-value`}
          fullWidth
          disabled
          options={[{ value: 'CURRENT_MEMBER', label: t`Me` }]}
          value="CURRENT_MEMBER"
        />
      );
    }

    if (column.valueKind === 'SELECT' || column.valueKind === 'BOOLEAN') {
      const options =
        column.valueKind === 'BOOLEAN'
          ? [
              { value: 'true', label: t`True` },
              { value: 'false', label: t`False` },
            ]
          : (column.selectOptions ?? []);

      return (
        <Select
          dropdownId={`${instanceId}-value`}
          fullWidth
          options={options}
          value={draft.staticValue}
          onChange={(staticValue) => onChange({ ...draft, staticValue })}
        />
      );
    }

    const textInput = (
      <SettingsTextInput
        instanceId={`${instanceId}-value`}
        fullWidth
        value={draft.staticValue}
        placeholder={
          draft.operator === 'in' ? t`Comma-separated values` : t`Enter value`
        }
        onChange={(staticValue) => onChange({ ...draft, staticValue })}
      />
    );

    const canUseCurrentMember =
      isDefined(getCurrentMemberFieldForColumn(column)) &&
      draft.operator !== 'in';

    if (!canUseCurrentMember) {
      return textInput;
    }

    return (
      <StyledValueGroup>
        <Select
          dropdownId={`${instanceId}-value-source`}
          fullWidth
          options={[
            { value: 'STATIC', label: t`Value` },
            { value: 'CURRENT_MEMBER', label: t`My email` },
          ]}
          value={draft.valueSource}
          onChange={handleValueSourceChange}
        />
        {draft.valueSource === 'STATIC' && textInput}
      </StyledValueGroup>
    );
  };

  const isRelated = draft.valueSource === 'RELATED' && isDefined(draft.related);
  const related = draft.related;

  return (
    <StyledCondition>
      <StyledRow>
        <Select
          dropdownId={`${instanceId}-column`}
          fullWidth
          withSearchInput
          options={columns.map((option) => ({
            value: option.column,
            label: option.label,
          }))}
          value={draft.column}
          onChange={handleColumnChange}
        />
        <Select
          dropdownId={`${instanceId}-operator`}
          fullWidth
          disabled={isRelated}
          options={(isDefined(column)
            ? getRecordScopingOperators(column)
            : []
          ).map((operator) => ({
            value: operator,
            label: operatorLabels[operator],
          }))}
          value={draft.operator}
          onChange={handleOperatorChange}
        />
        {renderValueInput()}
        <LightIconButton
          aria-label={t`Remove condition`}
          emphasis="subtle"
          onClick={onRemove}
        >
          <IconTrash />
        </LightIconButton>
      </StyledRow>
      {isRelated && isDefined(related) && (
        <StyledRelated>
          <StyledRelatedTitle>
            {t`${getObjectLabel(related.objectMetadataId)} matching`}
          </StyledRelatedTitle>
          <SettingsRolePermissionsObjectLevelRecordScopingConditionList
            drafts={related.conditions}
            logicalOperator={related.logicalOperator}
            columns={getColumns(related.objectMetadataId) ?? []}
            getColumns={getColumns}
            getObjectLabel={getObjectLabel}
            depth={depth + 1}
            instanceId={`${instanceId}-related`}
            onDraftsChange={(conditions) =>
              onChange({ ...draft, related: { ...related, conditions } })
            }
            onLogicalOperatorChange={(logicalOperator) =>
              onChange({ ...draft, related: { ...related, logicalOperator } })
            }
          />
        </StyledRelated>
      )}
    </StyledCondition>
  );
};
