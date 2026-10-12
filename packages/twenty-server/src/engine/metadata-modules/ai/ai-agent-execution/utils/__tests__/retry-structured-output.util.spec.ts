import { NoObjectGeneratedError } from 'ai';

import { retryStructuredOutput } from 'src/engine/metadata-modules/ai/ai-agent-execution/utils/retry-structured-output.util';

const noObject = () =>
  new NoObjectGeneratedError({
    message: 'No object generated: could not parse the response.',
    text: '{"classificacao": "OUTRO"}',
    response: { id: 'r', timestamp: new Date(0), modelId: 'm' },
    usage: {} as never,
    finishReason: 'stop',
  });

describe('retryStructuredOutput', () => {
  it('returns the first output without retrying', async () => {
    const generate = jest.fn().mockResolvedValue({ tipo_pedido: 'OUTRO' });
    const onFailedAttempt = jest.fn();

    await expect(
      retryStructuredOutput({ maxAttempts: 3, generate, onFailedAttempt }),
    ).resolves.toEqual({ tipo_pedido: 'OUTRO' });
    expect(generate).toHaveBeenCalledTimes(1);
    expect(onFailedAttempt).not.toHaveBeenCalled();
  });

  it('asks again after an output that does not match the schema', async () => {
    const generate = jest
      .fn()
      .mockRejectedValueOnce(noObject())
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ tipo_pedido: 'PEDIDO_CLIENTE' });
    const onFailedAttempt = jest.fn();

    await expect(
      retryStructuredOutput({ maxAttempts: 3, generate, onFailedAttempt }),
    ).resolves.toEqual({ tipo_pedido: 'PEDIDO_CLIENTE' });
    expect(generate).toHaveBeenCalledTimes(3);
    expect(onFailedAttempt).toHaveBeenCalledTimes(1);
    expect(onFailedAttempt).toHaveBeenCalledWith(1, expect.any(Error));
  });

  it('throws the last schema failure once the attempts run out', async () => {
    const generate = jest.fn().mockRejectedValue(noObject());

    await expect(
      retryStructuredOutput({
        maxAttempts: 2,
        generate,
        onFailedAttempt: jest.fn(),
      }),
    ).rejects.toThrow('No object generated');
    expect(generate).toHaveBeenCalledTimes(2);
  });

  it('returns null when every attempt came back empty', async () => {
    const generate = jest.fn().mockResolvedValue(null);

    await expect(
      retryStructuredOutput({
        maxAttempts: 2,
        generate,
        onFailedAttempt: jest.fn(),
      }),
    ).resolves.toBeNull();
    expect(generate).toHaveBeenCalledTimes(2);
  });

  it('does not retry other errors', async () => {
    const generate = jest.fn().mockRejectedValue(new Error('rate limited'));

    await expect(
      retryStructuredOutput({
        maxAttempts: 3,
        generate,
        onFailedAttempt: jest.fn(),
      }),
    ).rejects.toThrow('rate limited');
    expect(generate).toHaveBeenCalledTimes(1);
  });
});
