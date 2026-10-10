import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { MessageChannelEntity } from 'src/engine/metadata-modules/message-channel/entities/message-channel.entity';
import { MessageFolderEntity } from 'src/engine/metadata-modules/message-folder/entities/message-folder.entity';
import { ApplyMessagesVisibilityRestrictionsService } from 'src/modules/messaging/common/query-hooks/message/apply-messages-visibility-restrictions.service';
import { MessageFindManyPostQueryHook } from 'src/modules/messaging/common/query-hooks/message/message-find-many.post-query.hook';
import { MessageFindOnePostQueryHook } from 'src/modules/messaging/common/query-hooks/message/message-find-one.post-query.hook';
import { ApplyMessageThreadsVisibilityRestrictionsService } from 'src/modules/messaging/common/query-hooks/message-thread/apply-message-threads-visibility-restrictions.service';
import { MessageThreadFindManyPostQueryHook } from 'src/modules/messaging/common/query-hooks/message-thread/message-thread-find-many.post-query.hook';
import { MessageThreadFindOnePostQueryHook } from 'src/modules/messaging/common/query-hooks/message-thread/message-thread-find-one.post-query.hook';
import { MessageThreadTargetCreateManyPreQueryHook } from 'src/modules/messaging/common/query-hooks/message-thread-target/message-thread-target-create-many.pre-query-hook';
import { MessageThreadTargetCreateOnePreQueryHook } from 'src/modules/messaging/common/query-hooks/message-thread-target/message-thread-target-create-one.pre-query-hook';
import { MessageMailboxAdminService } from 'src/modules/messaging/common/services/message-mailbox-admin.service';
import { MessagingImportManagerModule } from 'src/modules/messaging/message-import-manager/messaging-import-manager.module';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';

@Module({
  imports: [
    MessagingImportManagerModule,
    WorkspaceCacheModule,
    TypeOrmModule.forFeature([
      ConnectedAccountEntity,
      MessageChannelEntity,
      MessageFolderEntity,
      UserWorkspaceEntity,
    ]),
  ],
  providers: [
    ApplyMessagesVisibilityRestrictionsService,
    MessageMailboxAdminService,
    MessageFindOnePostQueryHook,
    MessageFindManyPostQueryHook,
    ApplyMessageThreadsVisibilityRestrictionsService,
    MessageThreadFindOnePostQueryHook,
    MessageThreadFindManyPostQueryHook,
    MessageThreadTargetCreateOnePreQueryHook,
    MessageThreadTargetCreateManyPreQueryHook,
  ],
})
export class MessagingQueryHookModule {}
