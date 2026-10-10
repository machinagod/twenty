import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

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
}
