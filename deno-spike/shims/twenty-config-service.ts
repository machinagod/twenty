// Minimal TwentyConfigService stub for the cache-memory boot check. The real service
// pulls the whole config graph (typeorm/logger, class-validator, twenty-shared…);
// the factory under test only needs the type, and the harness injects its own config.
export class TwentyConfigService {
  get(_key: string): unknown {
    return undefined;
  }
}
