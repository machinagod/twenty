import { type MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { assertUnreachable } from 'twenty-shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum RecordScopingRuleExceptionCode {
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
  OBJECT_METADATA_NOT_FOUND = 'OBJECT_METADATA_NOT_FOUND',
  RECORD_SCOPING_RULE_NOT_FOUND = 'RECORD_SCOPING_RULE_NOT_FOUND',
  INVALID_RECORD_SCOPING_RULE_INPUT = 'INVALID_RECORD_SCOPING_RULE_INPUT',
}

const getRecordScopingRuleExceptionUserFriendlyMessage = (
  code: RecordScopingRuleExceptionCode,
) => {
  switch (code) {
    case RecordScopingRuleExceptionCode.ROLE_NOT_FOUND:
      return msg`Role not found.`;
    case RecordScopingRuleExceptionCode.OBJECT_METADATA_NOT_FOUND:
      return msg`Object not found.`;
    case RecordScopingRuleExceptionCode.RECORD_SCOPING_RULE_NOT_FOUND:
      return msg`Record-level rule not found.`;
    case RecordScopingRuleExceptionCode.INVALID_RECORD_SCOPING_RULE_INPUT:
      return msg`Invalid record-level rule.`;
    default:
      assertUnreachable(code);
  }
};

export class RecordScopingRuleException extends CustomException<RecordScopingRuleExceptionCode> {
  constructor(
    message: string,
    code: RecordScopingRuleExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getRecordScopingRuleExceptionUserFriendlyMessage(code),
    });
  }
}
