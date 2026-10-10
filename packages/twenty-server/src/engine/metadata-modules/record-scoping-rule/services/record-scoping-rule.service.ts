import { Injectable } from '@nestjs/common';

import { isDefined } from 'twenty-shared/utils';

import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { type DeleteRecordScopingRuleInput } from 'src/engine/metadata-modules/record-scoping-rule/dtos/delete-record-scoping-rule.input';
import { type RecordScopingRuleDTO } from 'src/engine/metadata-modules/record-scoping-rule/dtos/record-scoping-rule.dto';
import { type UpsertRecordScopingRuleInput } from 'src/engine/metadata-modules/record-scoping-rule/dtos/upsert-record-scoping-rule.input';
import { RecordScopingRuleEntity } from 'src/engine/metadata-modules/record-scoping-rule/record-scoping-rule.entity';
import {
  RecordScopingRuleException,
  RecordScopingRuleExceptionCode,
} from 'src/engine/metadata-modules/record-scoping-rule/record-scoping-rule.exception';
import { getRecordScopingColumns } from 'src/engine/metadata-modules/record-scoping-rule/utils/get-record-scoping-columns.util';
import { validateRecordScopingConditions } from 'src/engine/metadata-modules/record-scoping-rule/utils/validate-record-scoping-conditions.util';
import { type RecordScopingLogicalOperator } from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';
import { InjectWorkspaceScopedRepository } from 'src/engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator';
import { WorkspaceScopedRepository } from 'src/engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';

const toDto = (rule: RecordScopingRuleEntity): RecordScopingRuleDTO => ({
  id: rule.id,
  roleId: rule.roleId,
  objectMetadataId: rule.objectMetadataId,
  logicalOperator: rule.logicalOperator,
  conditions: rule.conditions,
});

@Injectable()
export class RecordScopingRuleService {
  constructor(
    @InjectWorkspaceScopedRepository(RecordScopingRuleEntity)
    private readonly recordScopingRuleRepository: WorkspaceScopedRepository<RecordScopingRuleEntity>,
    private readonly workspaceCacheService: WorkspaceCacheService,
  ) {}

  async findByRole({
    workspaceId,
    roleId,
  }: {
    workspaceId: string;
    roleId: string;
  }): Promise<RecordScopingRuleDTO[]> {
    const rules = await this.recordScopingRuleRepository.find(workspaceId, {
      where: { roleId },
      order: { createdAt: 'ASC' },
    });

    return rules.map(toDto);
  }

  async upsert({
    workspaceId,
    input,
  }: {
    workspaceId: string;
    input: UpsertRecordScopingRuleInput;
  }): Promise<RecordScopingRuleDTO> {
    const { flatRoleMaps, flatObjectMetadataMaps, flatFieldMetadataMaps } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'flatRoleMaps',
        'flatObjectMetadataMaps',
        'flatFieldMetadataMaps',
      ]);

    const role = findFlatEntityByIdInFlatEntityMaps({
      flatEntityMaps: flatRoleMaps,
      flatEntityId: input.roleId,
    });

    if (!isDefined(role)) {
      throw new RecordScopingRuleException(
        `Role ${input.roleId} not found`,
        RecordScopingRuleExceptionCode.ROLE_NOT_FOUND,
      );
    }

    const flatObjectMetadata = findFlatEntityByIdInFlatEntityMaps({
      flatEntityMaps: flatObjectMetadataMaps,
      flatEntityId: input.objectMetadataId,
    });

    if (!isDefined(flatObjectMetadata)) {
      throw new RecordScopingRuleException(
        `Object ${input.objectMetadataId} not found`,
        RecordScopingRuleExceptionCode.OBJECT_METADATA_NOT_FOUND,
      );
    }

    const workspaceMemberObjectMetadataId = Object.values(
      flatObjectMetadataMaps.byUniversalIdentifier,
    ).find(
      (objectMetadata) => objectMetadata?.nameSingular === 'workspaceMember',
    )?.id;

    const conditions = validateRecordScopingConditions({
      conditions: input.conditions,
      columns: getRecordScopingColumns({
        flatObjectMetadata,
        flatFieldMetadataMaps,
        workspaceMemberObjectMetadataId,
      }),
    });

    const rule = await this.recordScopingRuleRepository.upsertAndReturnOne(
      workspaceId,
      {
        roleId: input.roleId,
        objectMetadataId: input.objectMetadataId,
        logicalOperator: input.logicalOperator as RecordScopingLogicalOperator,
        conditions,
      },
      ['workspaceId', 'roleId', 'objectMetadataId'],
    );

    await this.invalidateCache(workspaceId);

    return toDto(rule);
  }

  async delete({
    workspaceId,
    input,
  }: {
    workspaceId: string;
    input: DeleteRecordScopingRuleInput;
  }): Promise<RecordScopingRuleDTO> {
    const rule = await this.recordScopingRuleRepository.findOne(workspaceId, {
      where: {
        roleId: input.roleId,
        objectMetadataId: input.objectMetadataId,
      },
    });

    if (!isDefined(rule)) {
      throw new RecordScopingRuleException(
        `No record-level rule for role ${input.roleId} on object ${input.objectMetadataId}`,
        RecordScopingRuleExceptionCode.RECORD_SCOPING_RULE_NOT_FOUND,
      );
    }

    await this.recordScopingRuleRepository.delete(workspaceId, {
      id: rule.id,
    });

    await this.invalidateCache(workspaceId);

    return toDto(rule);
  }

  private async invalidateCache(workspaceId: string): Promise<void> {
    await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
      'recordScopingRulesByRoleId',
    ]);
  }
}
