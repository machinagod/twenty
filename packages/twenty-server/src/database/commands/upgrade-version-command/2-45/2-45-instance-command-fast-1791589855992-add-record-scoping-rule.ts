import { QueryRunner } from 'typeorm';

import { RegisteredInstanceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-instance-command.decorator';
import { FastInstanceCommand } from 'src/engine/core-modules/upgrade/interfaces/fast-instance-command.interface';

@RegisteredInstanceCommand('2.45.0', 1791589855992)
export class AddRecordScopingRuleFastInstanceCommand implements FastInstanceCommand {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "core"."recordScopingRule" ("workspaceId" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" uuid NOT NULL, "objectMetadataId" uuid NOT NULL, "logicalOperator" text NOT NULL DEFAULT \'AND\', "conditions" jsonb NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "IDX_RECORD_SCOPING_RULE_ROLE_OBJECT_UNIQUE" UNIQUE ("workspaceId", "roleId", "objectMetadataId"), CONSTRAINT "PK_78b7ee709995f16ec70acb050a0" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE INDEX "IDX_RECORD_SCOPING_RULE_WORKSPACE_ID" ON "core"."recordScopingRule" ("workspaceId") ');
    await queryRunner.query('ALTER TABLE "core"."recordScopingRule" ADD CONSTRAINT "FK_d5cb1e99afb31fb49521ecaaded" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "core"."recordScopingRule" ADD CONSTRAINT "FK_bb1b48a4e449a47b55a314807fe" FOREIGN KEY ("roleId") REFERENCES "core"."role"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "core"."recordScopingRule" ADD CONSTRAINT "FK_2bb77a583914edf5d537b06f796" FOREIGN KEY ("objectMetadataId") REFERENCES "core"."objectMetadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "core"."recordScopingRule" DROP CONSTRAINT "FK_2bb77a583914edf5d537b06f796"');
    await queryRunner.query('ALTER TABLE "core"."recordScopingRule" DROP CONSTRAINT "FK_bb1b48a4e449a47b55a314807fe"');
    await queryRunner.query('ALTER TABLE "core"."recordScopingRule" DROP CONSTRAINT "FK_d5cb1e99afb31fb49521ecaaded"');
    await queryRunner.query('DROP INDEX "core"."IDX_RECORD_SCOPING_RULE_WORKSPACE_ID"');
    await queryRunner.query('DROP TABLE "core"."recordScopingRule"');
  }
}
