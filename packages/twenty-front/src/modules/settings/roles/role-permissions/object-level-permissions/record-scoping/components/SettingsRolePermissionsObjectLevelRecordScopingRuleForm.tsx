import { getToastOptionsFromError } from '@/error-handler/utils/getToastOptionsFromError';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { SettingsRolePermissionsObjectLevelRecordScopingConditionList } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/components/SettingsRolePermissionsObjectLevelRecordScopingConditionList';
import {
  type RecordScopingConditionDraft,
  type RecordScopingLogicalOperator,
} from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingConditionDraft';
import { getRecordScopingColumnOptions } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/utils/getRecordScopingColumnOptions';
import {
  createRecordScopingConditionDraft,
  fromRecordScopingCondition,
  getDefaultRecordScopingColumn,
  toRecordScopingConditionInputs,
} from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/utils/recordScopingConditionDraft';
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

  const { objectMetadataItems } = useObjectMetadataItems();

  const columns = useMemo(
    () =>
      getRecordScopingColumnOptions(objectMetadataItem, objectMetadataItems),
    [objectMetadataItem, objectMetadataItems],
  );

  const getColumns = (objectMetadataId: string) => {
    const relatedObjectMetadataItem = objectMetadataItems.find(
      (item) => item.id === objectMetadataId,
    );

    return isDefined(relatedObjectMetadataItem)
      ? getRecordScopingColumnOptions(
          relatedObjectMetadataItem,
          objectMetadataItems,
        )
      : undefined;
  };

  const getObjectLabel = (objectMetadataId: string) =>
    objectMetadataItems.find((item) => item.id === objectMetadataId)
      ?.labelPlural ?? '';

  const [drafts, setDrafts] = useState<RecordScopingConditionDraft[]>(
    () => rule?.conditions.map(fromRecordScopingCondition) ?? [],
  );
  const [logicalOperator, setLogicalOperator] =
    useState<RecordScopingLogicalOperator>(() =>
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

  const conditionInputs = toRecordScopingConditionInputs(
    drafts,
    columns,
    getColumns,
  );
  const isValid = isDefined(conditionInputs);

  const savedState = JSON.stringify({
    logicalOperator: rule?.logicalOperator ?? 'AND',
    conditions:
      toRecordScopingConditionInputs(
        rule?.conditions.map(fromRecordScopingCondition) ?? [],
        columns,
        getColumns,
      ) ?? [],
  });
  const isDirty =
    JSON.stringify({ logicalOperator, conditions: conditionInputs }) !==
    savedState;

  const handleAddFirstCondition = () => {
    const defaultColumn = getDefaultRecordScopingColumn(columns);

    if (isDefined(defaultColumn)) {
      setDrafts([createRecordScopingConditionDraft(defaultColumn, getColumns)]);
    }
  };

  const handleSave = async () => {
    try {
      await upsertRule({
        variables: {
          input: {
            roleId,
            objectMetadataId: objectMetadataItem.id,
            logicalOperator,
            conditions: conditionInputs ?? [],
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
            <>
              <StyledEmptyState>
                {t`No record-level rule: this role sees every record it can read.`}
              </StyledEmptyState>
              <StyledFooterGroup>
                <Button
                  size="sm"
                  variant="outline"
                  startIcon={<IconPlus />}
                  onClick={handleAddFirstCondition}
                  disabled={columns.length === 0}
                >{t`Add condition`}</Button>
              </StyledFooterGroup>
            </>
          ) : (
            <SettingsRolePermissionsObjectLevelRecordScopingConditionList
              drafts={drafts}
              logicalOperator={logicalOperator}
              columns={columns}
              getColumns={getColumns}
              getObjectLabel={getObjectLabel}
              depth={0}
              instanceId={`record-scoping-${objectMetadataItem.id}`}
              onDraftsChange={setDrafts}
              onLogicalOperatorChange={setLogicalOperator}
            />
          )}
        </StyledConditions>
      </Card.Root>
      <StyledFooter>
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
        </StyledFooterGroup>
        <Button
          size="sm"
          variant="solid"
          color="accent"
          onClick={handleSave}
          disabled={!isValid || !isDirty || isSaving}
        >{t`Save rule`}</Button>
      </StyledFooter>
    </>
  );
};
