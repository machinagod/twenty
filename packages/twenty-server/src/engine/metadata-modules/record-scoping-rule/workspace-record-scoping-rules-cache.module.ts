import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecordScopingRuleEntity } from 'src/engine/metadata-modules/record-scoping-rule/record-scoping-rule.entity';
import { WorkspaceRecordScopingRulesCacheService } from 'src/engine/metadata-modules/record-scoping-rule/services/workspace-record-scoping-rules-cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecordScopingRuleEntity])],
  providers: [WorkspaceRecordScopingRulesCacheService],
  exports: [WorkspaceRecordScopingRulesCacheService],
})
export class WorkspaceRecordScopingRulesCacheModule {}
