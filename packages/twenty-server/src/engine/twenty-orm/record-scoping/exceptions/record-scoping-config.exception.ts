// Raised when RECORD_SCOPING_RULES is present but malformed. The config service
// catches this, logs it prominently and treats scoping as unconfigured, so a
// typo never silently ships a broken lock.
export class RecordScopingConfigException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RecordScopingConfigException';
  }
}
