import { promises as fs } from 'fs';
import { join } from 'path';

import { LocalChildProcessRunnerService } from 'src/engine/core-modules/logic-function/logic-function-drivers/drivers/local/services/local-child-process-runner.service';
import { TemporaryDirManager } from 'src/engine/core-modules/logic-function/logic-function-drivers/utils/temporary-dir-manager';

// Exercises the generated bootstrap runner end-to-end: a handler returning a
// payload far larger than the OS pipe buffer must survive the IPC round-trip.
// Before the flush-before-exit fix, `process.exit(0)` raced the async
// `process.send`, dropping large results and yielding an empty HTTP body.
describe('LocalChildProcessRunnerService', () => {
  const runner = new LocalChildProcessRunnerService();
  let temporaryDirManager: TemporaryDirManager;
  let sourceTemporaryDir: string;

  beforeEach(async () => {
    temporaryDirManager = new TemporaryDirManager();
    ({ sourceTemporaryDir } = await temporaryDirManager.init());
  });

  afterEach(async () => {
    await temporaryDirManager.clean();
  });

  const writeHandlerBundle = async (source: string): Promise<string> => {
    const builtFileAbsPath = join(sourceTemporaryDir, 'handler.mjs');

    await fs.writeFile(builtFileAbsPath, source, 'utf8');

    return builtFileAbsPath;
  };

  const run = async (builtFileAbsPath: string, payload: unknown) => {
    const runnerPath = await runner.writeBootstrapRunner({
      dir: sourceTemporaryDir,
      builtFileAbsPath,
      handlerName: 'handler',
    });

    return runner.runChildWithEnv({
      runnerPath,
      env: {},
      payload,
      timeoutMs: 30_000,
    });
  };

  it('returns a small handler result over IPC', async () => {
    const builtFileAbsPath = await writeHandlerBundle(
      `export const handler = async () => ({ product_rows: [1, 2, 3] });`,
    );

    const result = await run(builtFileAbsPath, {});

    expect(result.ok).toBe(true);
    expect(result.result).toEqual({ product_rows: [1, 2, 3] });
  });

  // The regression: ~156KB is the real charge-map pending payload size; it
  // exceeds the pipe buffer and was being dropped, producing an empty response.
  it('returns a large handler result (>64KB pipe buffer) without dropping it', async () => {
    const builtFileAbsPath = await writeHandlerBundle(
      `export const handler = async () => ({ blob: 'x'.repeat(200000) });`,
    );

    const result = await run(builtFileAbsPath, {});

    expect(result.ok).toBe(true);
    expect((result.result as { blob: string }).blob).toHaveLength(200000);
  });

  it('propagates handler errors instead of a silent success', async () => {
    const builtFileAbsPath = await writeHandlerBundle(
      `export const handler = async () => { throw new Error('boom'); };`,
    );

    const result = await run(builtFileAbsPath, {});

    expect(result.ok).toBe(false);
    expect(result.error).toContain('boom');
  });
});
