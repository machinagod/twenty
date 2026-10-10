import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionsModule } from 'src/engine/metadata-modules/permissions/permissions.module';
import { RecordScopingRuleEntity } from 'src/engine/metadata-modules/record-scoping-rule/record-scoping-rule.entity';
import { RecordScopingRuleResolver } from 'src/engine/metadata-modules/record-scoping-rule/record-scoping-rule.resolver';
import { RecordScopingRuleService } from 'src/engine/metadata-modules/record-scoping-rule/services/record-scoping-rule.service';
import { WorkspaceRecordScopingRulesCacheModule } from 'src/engine/metadata-modules/record-scoping-rule/workspace-record-scoping-rules-cache.module';
import { provideWorkspaceScopedRepository } from 'src/engine/twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecordScopingRuleEntity]),
    WorkspaceCacheModule,
    WorkspaceRecordScopingRulesCacheModule,
    PermissionsModule,
  ],
  providers: [
    RecordScopingRuleService,
    RecordScopingRuleResolver,
    provideWorkspaceScopedRepository(RecordScopingRuleEntity),
  ],
})
export class RecordScopingRuleModule {}
