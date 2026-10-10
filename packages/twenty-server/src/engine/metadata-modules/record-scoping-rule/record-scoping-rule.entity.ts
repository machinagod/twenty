import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { ADD_RECORD_SCOPING_RULE_UPGRADE_COMMAND_NAME } from 'src/database/commands/upgrade-version-command/2-45/add-record-scoping-rule-upgrade-command-name.constant';
import { WasIntroducedInUpgrade } from 'src/engine/core-modules/upgrade/decorators/was-introduced-in-upgrade.decorator';
import type { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import type { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import {
  type RecordScopingCondition,
  type RecordScopingLogicalOperator,
} from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';
import { WorkspaceRelatedEntity } from 'src/engine/workspace-manager/types/workspace-related-entity.type';

// Clean-room record scoping (see docs/RECORD_SCOPING.md): one rule per
// (role, object), edited from Settings > Roles. Independent of the Enterprise
// rowLevelPermissionPredicate tables.
@Entity({ name: 'recordScopingRule', schema: 'core' })
@WasIntroducedInUpgrade({
  upgradeCommandName: ADD_RECORD_SCOPING_RULE_UPGRADE_COMMAND_NAME,
})
@Unique('IDX_RECORD_SCOPING_RULE_ROLE_OBJECT_UNIQUE', [
  'workspaceId',
  'roleId',
  'objectMetadataId',
])
@Index('IDX_RECORD_SCOPING_RULE_WORKSPACE_ID', ['workspaceId'])
export class RecordScopingRuleEntity extends WorkspaceRelatedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'uuid' })
  roleId: string;

  @ManyToOne('RoleEntity', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Relation<RoleEntity>;

  @Column({ nullable: false, type: 'uuid' })
  objectMetadataId: string;

  @ManyToOne('ObjectMetadataEntity', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'objectMetadataId' })
  objectMetadata: Relation<ObjectMetadataEntity>;

  @Column({ nullable: false, type: 'text', default: 'AND' })
  logicalOperator: RecordScopingLogicalOperator;

  @Column({ nullable: false, type: 'jsonb' })
  conditions: RecordScopingCondition[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
