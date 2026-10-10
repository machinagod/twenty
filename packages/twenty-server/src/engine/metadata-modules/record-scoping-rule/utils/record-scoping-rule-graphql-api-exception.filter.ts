import {
  Catch,
  type ExceptionFilter,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { assertUnreachable } from 'twenty-shared/utils';

import {
  NotFoundError,
  UserInputError,
} from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import {
  RecordScopingRuleException,
  RecordScopingRuleExceptionCode,
} from 'src/engine/metadata-modules/record-scoping-rule/record-scoping-rule.exception';

@Catch(RecordScopingRuleException)
@Injectable()
export class RecordScopingRuleGraphqlApiExceptionFilter implements ExceptionFilter {
  catch(exception: RecordScopingRuleException, _host: ExecutionContext) {
    switch (exception.code) {
      case RecordScopingRuleExceptionCode.ROLE_NOT_FOUND:
      case RecordScopingRuleExceptionCode.OBJECT_METADATA_NOT_FOUND:
      case RecordScopingRuleExceptionCode.RECORD_SCOPING_RULE_NOT_FOUND:
        throw new NotFoundError(exception);
      case RecordScopingRuleExceptionCode.INVALID_RECORD_SCOPING_RULE_INPUT:
        throw new UserInputError(exception);
      default:
        return assertUnreachable(exception.code);
    }
  }
}
