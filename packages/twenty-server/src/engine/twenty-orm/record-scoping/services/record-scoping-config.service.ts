import { Injectable, Logger } from '@nestjs/common';

import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { parseRecordScopingRules } from 'src/engine/twenty-orm/record-scoping/config/parse-record-scoping-rules.util';
import { RecordScopingConfigException } from 'src/engine/twenty-orm/record-scoping/exceptions/record-scoping-config.exception';
import { type RecordScopingRule } from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';

// Reads and validates the RECORD_SCOPING_RULES config once, then serves the parsed
// rules from memory. The config is process-level (not per-workspace), so a single
// parse is reused for every workspace context load. If the config is malformed we
// log loudly and serve no rules — surfaced via logs rather than crashing boot.
@Injectable()
export class RecordScopingConfigService {
  private readonly logger = new Logger(RecordScopingConfigService.name);
  private cachedRules: RecordScopingRule[] | undefined;

  constructor(private readonly twentyConfigService: TwentyConfigService) {}

  getRules(): RecordScopingRule[] {
    if (this.cachedRules !== undefined) {
      return this.cachedRules;
    }

    const rawConfig = this.twentyConfigService.get('RECORD_SCOPING_RULES');

    try {
      this.cachedRules = parseRecordScopingRules(rawConfig);

      if (this.cachedRules.length > 0) {
        this.logger.log(
          `Record scoping enabled: ${this.cachedRules.length} rule(s) loaded`,
        );
      }
    } catch (error) {
      this.cachedRules = [];

      if (error instanceof RecordScopingConfigException) {
        this.logger.error(
          `RECORD_SCOPING_RULES is invalid — record scoping is DISABLED until fixed. ${error.message}`,
        );
      } else {
        throw error;
      }
    }

    return this.cachedRules;
  }

  isEnabled(): boolean {
    return this.getRules().length > 0;
  }
}
