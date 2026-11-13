import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { SettingsRolePermissionsObjectLevelRecordScopingRuleForm } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/components/SettingsRolePermissionsObjectLevelRecordScopingRuleForm';
import { settingsPersistedRoleFamilyState } from '@/settings/roles/states/settingsPersistedRoleFamilyState';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { useQuery } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { isDefined } from 'twenty-shared/utils';
import { Section } from 'twenty-ui/components';
import { themeCssVariables } from 'twenty-ui/theme';
import { FindRecordScopingRulesDocument } from '~/generated-metadata/graphql';

const StyledContent = styled.div`
  padding-bottom: ${themeCssVariables.spacing[2]};
`;

const StyledNotice = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

type SettingsRolePermissionsObjectLevelRecordScopingSectionProps = {
  objectMetadataItem: EnrichedObjectMetadataItem;
  roleId: string;
};

// The fork's clean-room record-level section (docs/RECORD_SCOPING.md): rules are
// saved on their own, independent of the role draft, and apply immediately.
export const SettingsRolePermissionsObjectLevelRecordScopingSection = ({
  objectMetadataItem,
  roleId,
}: SettingsRolePermissionsObjectLevelRecordScopingSectionProps) => {
  const settingsPersistedRole = useAtomFamilyStateValue(
    settingsPersistedRoleFamilyState,
    roleId,
  );
  const isRoleSaved = isDefined(settingsPersistedRole);

  const { data, loading } = useQuery(FindRecordScopingRulesDocument, {
    variables: { roleId },
    skip: !isRoleSaved,
  });

  const rule = data?.recordScopingRules.find(
    (candidate) => candidate.objectMetadataId === objectMetadataItem.id,
  );

  return (
    <Section.Root>
      <Section.Header
        title={t`Record-level`}
        description={t`Ability to filter the records a user can interact with.`}
      />
      <StyledContent>
        {!isRoleSaved ? (
          <StyledNotice>
            {t`Save the role before adding record-level rules.`}
          </StyledNotice>
        ) : (
          !loading && (
            <SettingsRolePermissionsObjectLevelRecordScopingRuleForm
              key={rule?.id ?? 'new'}
              roleId={roleId}
              objectMetadataItem={objectMetadataItem}
              rule={rule}
            />
          )
        )}
      </StyledContent>
    </Section.Root>
  );
};
