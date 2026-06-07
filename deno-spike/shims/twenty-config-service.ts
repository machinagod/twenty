// Stub TwentyConfigService for the module boot (the real one needs full env/DB config
// init). MetricsCacheService injects it; the queue factory uses a separate stub token.
export class TwentyConfigService {
  get(_key: string): unknown { return undefined; }
}
