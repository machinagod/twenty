import { getToastOptionsFromError } from '@/error-handler/utils/getToastOptionsFromError';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { SettingsRolePermissionsObjectLevelRecordScopingConditionRow } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/components/SettingsRolePermissionsObjectLevelRecordScopingConditionRow';
import { type RecordScopingConditionDraft } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingConditionDraft';
import { getRecordScopingColumnOptions } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/utils/getRecordScopingColumnOptions';
import {
  createRecordScopingConditionDraft,
  fromRecordScopingCondition,
  toRecordScopingConditionInput,
} from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/utils/recordScopingConditionDraft';
import { Select } from '@/ui/input/components/Select';
import { useMutation } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { useMemo, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { useToast } from 'twenty-ui/components';
import { IconPlus } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { Card } from 'twenty-ui/primitives/surfaces';
import { themeCssVariables } from 'twenty-ui/theme';
import {
  DeleteRecordScopingRuleDocument,
  FindRecordScopingRulesDocument,
  type RecordScopingRuleFragmentFragment,
  UpsertRecordScopingRuleDocument,
} from '~/generated-metadata/graphql';

const StyledConditions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]};
`;

const StyledEmptyState = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledFooter = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
  margin-top: ${themeCssVariables.spacing[3]};
`;

const StyledFooterGroup = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

type LogicalOperator = 'AND' | 'OR';

type SettingsRolePermissionsObjectLevelRecordScopingRuleFormProps = {
  roleId: string;
  objectMetadataItem: EnrichedObjectMetadataItem;
  rule: RecordScopingRuleFragmentFragment | undefined;
};

export const SettingsRolePermissionsObjectLevelRecordScopingRuleForm = ({
  roleId,
  objectMetadataItem,
  rule,
}: SettingsRolePermissionsObjectLevelRecordScopingRuleFormProps) => {
  const { enqueueToast } = useToast();

  const columns = useMemo(
    () => getRecordScopingColumnOptions(objectMetadataItem),
    [objectMetadataItem],
  );

  const [drafts, setDrafts] = useState<RecordScopingConditionDraft[]>(
    () => rule?.conditions.map(fromRecordScopingCondition) ?? [],
  );
  const [logicalOperator, setLogicalOperator] = useState<LogicalOperator>(() =>
    rule?.logicalOperator === 'OR' ? 'OR' : 'AND',
  );

  const refetchQueries = [
    { query: FindRecordScopingRulesDocument, variables: { roleId } },
  ];
  const [upsertRule, { loading: isSaving }] = useMutation(
    UpsertRecordScopingRuleDocument,
    { refetchQueries },
  );
  const [deleteRule, { loading: isDeleting }] = useMutation(
    DeleteRecordScopingRuleDocument,
    { refetchQueries },
  );

  const conditionInputs = drafts.map((draft) =>
    toRecordScopingConditionInput(
      draft,
      columns.find((column) => column.column === draft.column),
    ),
  );
  const isValid =
    conditionInputs.length > 0 && conditionInputs.every(isDefined);

  const savedState = JSON.stringify({
    logicalOperator: rule?.logicalOperator ?? 'AND',
    conditions:
      rule?.conditions.map((condition) =>
        toRecordScopingConditionInput(
          fromRecordScopingCondition(condition),
          columns.find((column) => column.column === condition.column),
        ),
      ) ?? [],
  });
  const isDirty =
    JSON.stringify({ logicalOperator, conditions: conditionInputs }) !==
    savedState;

  const handleAddCondition = () => {
    // An owner-style relation is the most common rule; actor columns
    // (created by / updated by) come next.
    const defaultColumn =
      columns.find(
        (column) =>
          column.valueKind === 'WORKSPACE_MEMBER' &&
          !column.column.endsWith('WorkspaceMemberId'),
      ) ??
      columns.find((column) => column.valueKind === 'WORKSPACE_MEMBER') ??
      columns[0];

    if (isDefined(defaultColumn)) {
      setDrafts((current) => [
        ...current,
        createRecordScopingConditionDraft(defaultColumn),
      ]);
    }
  };

  const handleConditionChange = (nextDraft: RecordScopingConditionDraft) => {
    setDrafts((current) =>
      current.map((draft) => (draft.key === nextDraft.key ? nextDraft : draft)),
    );
  };

  const handleConditionRemove = (key: string) => {
    setDrafts((current) => current.filter((draft) => draft.key !== key));
  };

  const handleSave = async () => {
    try {
      await upsertRule({
        variables: {
          input: {
            roleId,
            objectMetadataId: objectMetadataItem.id,
            logicalOperator,
            conditions: conditionInputs.filter(isDefined),
          },
        },
      });
      enqueueToast({
        variant: 'success',
        children: t`Record-level rule saved`,
      });
    } catch (error) {
      enqueueToast(getToastOptionsFromError({ error }));
    }
  };

  const handleRemoveRule = async () => {
    try {
      await deleteRule({
        variables: {
          input: { roleId, objectMetadataId: objectMetadataItem.id },
        },
      });
      setDrafts([]);
      setLogicalOperator('AND');
      enqueueToast({
        variant: 'success',
        children: t`Record-level rule removed`,
      });
    } catch (error) {
      enqueueToast(getToastOptionsFromError({ error }));
    }
  };

  return (
    <>
      <Card.Root rounded>
        <StyledConditions>
          {drafts.length === 0 ? (
            <StyledEmptyState>
              {t`No record-level rule: this role sees every record it can read.`}
            </StyledEmptyState>
          ) : (
            drafts.map((draft) => (
              <SettingsRolePermissionsObjectLevelRecordScopingConditionRow
                key={draft.key}
                draft={draft}
                columns={columns}
                instanceId={`record-scoping-${objectMetadataItem.id}-${draft.key}`}
                onChange={handleConditionChange}
                onRemove={() => handleConditionRemove(draft.key)}
              />
            ))
          )}
        </StyledConditions>
      </Card.Root>
      <StyledFooter>
        <StyledFooterGroup>
          <Button
            size="sm"
            variant="outline"
            startIcon={<IconPlus />}
            onClick={handleAddCondition}
            disabled={columns.length === 0}
          >{t`Add condition`}</Button>
          {drafts.length > 1 && (
            <Select
              dropdownId={`record-scoping-${objectMetadataItem.id}-logical-operator`}
              options={[
                { value: 'AND', label: t`Match all conditions` },
                { value: 'OR', label: t`Match any condition` },
              ]}
              value={logicalOperator}
              onChange={(value: LogicalOperator) => setLogicalOperator(value)}
            />
          )}
        </StyledFooterGroup>
        <StyledFooterGroup>
          {isDefined(rule) && (
            <Button
              size="sm"
              variant="outline"
              color="danger"
              onClick={handleRemoveRule}
              disabled={isDeleting}
            >{t`Remove rule`}</Button>
          )}
          <Button
            size="sm"
            variant="solid"
            color="accent"
            onClick={handleSave}
            disabled={!isValid || !isDirty || isSaving}
          >{t`Save rule`}</Button>
        </StyledFooterGroup>
      </StyledFooter>
    </>
  );
};
