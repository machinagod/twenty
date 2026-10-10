import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { PermissionFlagType } from 'twenty-shared/constants';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { AuthPrincipalGuard } from 'src/engine/guards/auth-principal.guard';
import { SettingsPermissionGuard } from 'src/engine/guards/settings-permission.guard';
import { PermissionsGraphqlApiExceptionFilter } from 'src/engine/metadata-modules/permissions/utils/permissions-graphql-api-exception.filter';
import { DeleteRecordScopingRuleInput } from 'src/engine/metadata-modules/record-scoping-rule/dtos/delete-record-scoping-rule.input';
import { RecordScopingRuleDTO } from 'src/engine/metadata-modules/record-scoping-rule/dtos/record-scoping-rule.dto';
import { UpsertRecordScopingRuleInput } from 'src/engine/metadata-modules/record-scoping-rule/dtos/upsert-record-scoping-rule.input';
import { RecordScopingRuleService } from 'src/engine/metadata-modules/record-scoping-rule/services/record-scoping-rule.service';
import { RecordScopingRuleGraphqlApiExceptionFilter } from 'src/engine/metadata-modules/record-scoping-rule/utils/record-scoping-rule-graphql-api-exception.filter';

// Same access as editing a role's object permissions.
@MetadataResolver(() => RecordScopingRuleDTO)
@UsePipes(ResolverValidationPipe)
@UseGuards(
  AuthPrincipalGuard({
    userSession: {
      standard: true,
      impersonated: true,
      playground: true,
      workspaceAgnostic: false,
    },
    apiKey: true,
    oauthClient: true,
    application: true,
  }),
  SettingsPermissionGuard(PermissionFlagType.ROLES),
)
@UseFilters(
  RecordScopingRuleGraphqlApiExceptionFilter,
  PermissionsGraphqlApiExceptionFilter,
  PreventNestToAutoLogGraphqlErrorsFilter,
)
export class RecordScopingRuleResolver {
  constructor(
    private readonly recordScopingRuleService: RecordScopingRuleService,
  ) {}

  @Query(() => [RecordScopingRuleDTO])
  async recordScopingRules(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('roleId', { type: () => UUIDScalarType }) roleId: string,
  ): Promise<RecordScopingRuleDTO[]> {
    return this.recordScopingRuleService.findByRole({
      workspaceId: workspace.id,
      roleId,
    });
  }

  @Mutation(() => RecordScopingRuleDTO)
  async upsertRecordScopingRule(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: UpsertRecordScopingRuleInput,
  ): Promise<RecordScopingRuleDTO> {
    return this.recordScopingRuleService.upsert({
      workspaceId: workspace.id,
      input,
    });
  }

  @Mutation(() => RecordScopingRuleDTO)
  async deleteRecordScopingRule(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: DeleteRecordScopingRuleInput,
  ): Promise<RecordScopingRuleDTO> {
    return this.recordScopingRuleService.delete({
      workspaceId: workspace.id,
      input,
    });
  }
}
