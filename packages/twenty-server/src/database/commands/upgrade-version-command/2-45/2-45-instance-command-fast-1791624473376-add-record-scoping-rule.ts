import { QueryRunner } from 'typeorm';

import { RegisteredInstanceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-instance-command.decorator';
import { FastInstanceCommand } from 'src/engine/core-modules/upgrade/interfaces/fast-instance-command.interface';

// First shipped as a 2.45.0 command, which instances already past 2.45.0 never
// ran (instance commands sort before a version's workspace commands). Re-slotted
// under 2.45.1, so it must tolerate instances that created the table under 2.45.0.
@RegisteredInstanceCommand('2.45.1', 1791624473376)
export class AddRecordScopingRuleFastInstanceCommand implements FastInstanceCommand {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE IF NOT EXISTS "core"."recordScopingRule" ("workspaceId" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" uuid NOT NULL, "objectMetadataId" uuid NOT NULL, "logicalOperator" text NOT NULL DEFAULT \'AND\', "conditions" jsonb NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "IDX_RECORD_SCOPING_RULE_ROLE_OBJECT_UNIQUE" UNIQUE ("workspaceId", "roleId", "objectMetadataId"), CONSTRAINT "PK_78b7ee709995f16ec70acb050a0" PRIMARY KEY ("id"), CONSTRAINT "FK_d5cb1e99afb31fb49521ecaaded" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_bb1b48a4e449a47b55a314807fe" FOREIGN KEY ("roleId") REFERENCES "core"."role"("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_2bb77a583914edf5d537b06f796" FOREIGN KEY ("objectMetadataId") REFERENCES "core"."objectMetadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION)');
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_RECORD_SCOPING_RULE_WORKSPACE_ID" ON "core"."recordScopingRule" ("workspaceId") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "core"."IDX_RECORD_SCOPING_RULE_WORKSPACE_ID"');
    await queryRunner.query('DROP TABLE IF EXISTS "core"."recordScopingRule"');
  }
}
