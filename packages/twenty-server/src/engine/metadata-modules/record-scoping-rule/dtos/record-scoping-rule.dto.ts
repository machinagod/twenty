import { Field, ObjectType } from '@nestjs/graphql';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { RecordScopingConditionDTO } from 'src/engine/metadata-modules/record-scoping-rule/dtos/record-scoping-condition.dto';

@ObjectType('RecordScopingRule')
export class RecordScopingRuleDTO {
  @Field(() => UUIDScalarType)
  id: string;

  @Field(() => UUIDScalarType)
  roleId: string;

  @Field(() => UUIDScalarType)
  objectMetadataId: string;

  @Field()
  logicalOperator: string;

  @Field(() => [RecordScopingConditionDTO])
  conditions: RecordScopingConditionDTO[];
}
