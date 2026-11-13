import {
  NotFoundError,
  UserInputError,
} from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import {
  RecordScopingRuleException,
  RecordScopingRuleExceptionCode,
} from 'src/engine/metadata-modules/record-scoping-rule/record-scoping-rule.exception';
import { RecordScopingRuleGraphqlApiExceptionFilter } from 'src/engine/metadata-modules/record-scoping-rule/utils/record-scoping-rule-graphql-api-exception.filter';

describe('RecordScopingRuleGraphqlApiExceptionFilter', () => {
  const filter = new RecordScopingRuleGraphqlApiExceptionFilter();
  const catchCode = (code: RecordScopingRuleExceptionCode) => () =>
    filter.catch(new RecordScopingRuleException('message', code), {} as never);

  it.each([
    RecordScopingRuleExceptionCode.ROLE_NOT_FOUND,
    RecordScopingRuleExceptionCode.OBJECT_METADATA_NOT_FOUND,
    RecordScopingRuleExceptionCode.RECORD_SCOPING_RULE_NOT_FOUND,
  ])('maps %s to a not found error', (code) => {
    expect(catchCode(code)).toThrow(NotFoundError);
  });

  it('maps invalid input to a user input error with a friendly message', () => {
    expect(
      catchCode(
        RecordScopingRuleExceptionCode.INVALID_RECORD_SCOPING_RULE_INPUT,
      ),
    ).toThrow(UserInputError);
  });
});
