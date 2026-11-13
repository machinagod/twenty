import { Field, InputType } from '@nestjs/graphql';

import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { RecordScopingConditionInput } from 'src/engine/metadata-modules/record-scoping-rule/dtos/record-scoping-condition.dto';

@InputType()
export class UpsertRecordScopingRuleInput {
  @IsUUID()
  @Field(() => UUIDScalarType)
  roleId: string;

  @IsUUID()
  @Field(() => UUIDScalarType)
  objectMetadataId: string;

  @IsIn(['AND', 'OR'])
  @Field()
  logicalOperator: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RecordScopingConditionInput)
  @Field(() => [RecordScopingConditionInput])
  conditions: RecordScopingConditionInput[];
}
