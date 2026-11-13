import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonRecordVisibilityModule } from 'src/engine/api/common/common-record-visibility/common-record-visibility.module';
import { ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { MessageChannelEntity } from 'src/engine/metadata-modules/message-channel/entities/message-channel.entity';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';
import { ApplyAttachmentsVisibilityRestrictionsService } from 'src/modules/messaging/common/query-hooks/attachment/apply-attachments-visibility-restrictions.service';
import { ApplyMessagesVisibilityRestrictionsService } from 'src/modules/messaging/common/query-hooks/message/apply-messages-visibility-restrictions.service';
import { ApplyMessageThreadsVisibilityRestrictionsService } from 'src/modules/messaging/common/query-hooks/message-thread/apply-message-threads-visibility-restrictions.service';
import { MessageThreadTargetCreateManyPreQueryHook } from 'src/modules/messaging/common/query-hooks/message-thread-target/message-thread-target-create-many.pre-query-hook';
import { MessageThreadTargetCreateOnePreQueryHook } from 'src/modules/messaging/common/query-hooks/message-thread-target/message-thread-target-create-one.pre-query-hook';
import { MessageMailboxAdminService } from 'src/modules/messaging/common/services/message-mailbox-admin.service';

@Module({
  imports: [
    WorkspaceCacheModule,
    CommonRecordVisibilityModule,
    TypeOrmModule.forFeature([MessageChannelEntity, ConnectedAccountEntity]),
  ],
  providers: [
    ApplyMessagesVisibilityRestrictionsService,
    ApplyMessageThreadsVisibilityRestrictionsService,
    MessageMailboxAdminService,
    ApplyAttachmentsVisibilityRestrictionsService,
    MessageThreadTargetCreateOnePreQueryHook,
    MessageThreadTargetCreateManyPreQueryHook,
  ],
})
export class MessagingQueryHookModule {}
