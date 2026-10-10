import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

@ObjectType('RecordScopingRelatedRecords')
export class RecordScopingRelatedRecordsDTO {
  @Field(() => UUIDScalarType)
  objectMetadataId: string;

  @Field(() => String, { nullable: true })
  matchColumn?: string;

  @Field()
  logicalOperator: string;

  @Field(() => [RecordScopingConditionDTO])
  conditions: RecordScopingConditionDTO[];
}

@ObjectType('RecordScopingCondition')
export class RecordScopingConditionDTO {
  @Field()
  column: string;

  @Field()
  operator: string;

  @Field(() => GraphQLJSON, { nullable: true })
  staticValue?: unknown;

  @Field(() => String, { nullable: true })
  currentWorkspaceMemberField?: string;

  @Field(() => RecordScopingRelatedRecordsDTO, { nullable: true })
  relatedRecords?: RecordScopingRelatedRecordsDTO;
}

@InputType()
export class RecordScopingRelatedRecordsInput {
  @IsUUID()
  @Field(() => UUIDScalarType)
  objectMetadataId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  matchColumn?: string | null;

  @IsIn(['AND', 'OR'])
  @Field()
  logicalOperator: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecordScopingConditionInput)
  @Field(() => [RecordScopingConditionInput])
  conditions: RecordScopingConditionInput[];
}

@InputType()
export class RecordScopingConditionInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  column: string;

  @IsIn(['eq', 'neq', 'in'])
  @Field()
  operator: string;

  @IsOptional()
  @Field(() => GraphQLJSON, { nullable: true })
  staticValue?: unknown;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  currentWorkspaceMemberField?: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecordScopingRelatedRecordsInput)
  @Field(() => RecordScopingRelatedRecordsInput, { nullable: true })
  relatedRecords?: RecordScopingRelatedRecordsInput | null;
}
