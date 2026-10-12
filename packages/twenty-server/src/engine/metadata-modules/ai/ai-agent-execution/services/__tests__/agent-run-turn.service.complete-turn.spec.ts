import {
  generateText,
  type LanguageModelUsage,
  NoObjectGeneratedError,
} from 'ai';
import { type AgentResponseSchema } from 'twenty-shared/ai';
import { type Repository } from 'typeorm';

import { type WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { type AgentRunPersonaService } from 'src/engine/metadata-modules/ai/ai-agent-execution/services/agent-run-persona.service';
import {
  AgentRunTurnService,
  type StartedAgentRunTurn,
} from 'src/engine/metadata-modules/ai/ai-agent-execution/services/agent-run-turn.service';
import { type AgentTurnService } from 'src/engine/metadata-modules/ai/ai-agent-execution/services/agent-turn.service';
import { type RunAgentAttachmentService } from 'src/engine/metadata-modules/ai/ai-agent-execution/services/run-agent-attachment.service';
import { STRUCTURED_OUTPUT_MAX_ATTEMPTS } from 'src/engine/metadata-modules/ai/ai-agent/constants/structured-output-max-attempts.const';
import { type AiBillingService } from 'src/engine/metadata-modules/ai/ai-billing/services/ai-billing.service';
import { AiException } from 'src/engine/metadata-modules/ai/ai.exception';

jest.mock('ai', () => ({
  ...jest.requireActual('ai'),
  generateText: jest.fn(),
}));

const generateTextMock = jest.mocked(generateText);

const SCHEMA: AgentResponseSchema = {
  type: 'object',
  properties: {
    tipo_pedido: { type: 'string' },
    motivo: { type: 'string' },
  },
  required: ['tipo_pedido', 'motivo'],
  additionalProperties: false,
};

const USAGE = {
  inputTokens: 10,
  outputTokens: 5,
  totalTokens: 15,
} as LanguageModelUsage;

const VALID_OUTPUT = { tipo_pedido: 'OUTRO', motivo: 'Newsletter' };

const buildNoObjectGeneratedError = () =>
  new NoObjectGeneratedError({
    message: 'No object generated',
    text: '{"invented": true}',
    response: {
      id: 'response-id',
      timestamp: new Date(0),
      modelId: 'model-id',
    },
    usage: USAGE,
    finishReason: 'stop',
  });

const buildStartedTurn = (replyText: string) =>
  ({
    turn: {
      stream: {
        text: Promise.resolve(replyText),
        usage: Promise.resolve(USAGE),
        steps: Promise.resolve([]),
      },
      registeredModel: {
        model: 'model',
        modelId: 'model-id',
        sdkPackage: '@ai-sdk/anthropic',
      },
      toolset: { offeredPausingToolNames: [] },
      getStopReason: () => undefined,
      isContentRecordingAllowed: false,
    },
    source: {},
    isStructuredOutputInSameRequest: false,
  }) as unknown as StartedAgentRunTurn;

describe('AgentRunTurnService.completeTurn structured output', () => {
  let calculateAndBillUsage: jest.Mock;
  let service: AgentRunTurnService;

  const completeTurn = (replyText: string) =>
    service.completeTurn({
      started: buildStartedTurn(replyText),
      persona: {
        agentId: 'agent-id',
        applicationId: null,
        promptCacheKey: 'agent-id',
      } as never,
      responseFormat: { type: 'json', schema: SCHEMA },
      workspaceId: 'workspace-id',
      executionContext: { userWorkspaceId: 'user-workspace-id' } as never,
      abortSignal: undefined,
    });

  beforeEach(() => {
    generateTextMock.mockReset();
    calculateAndBillUsage = jest.fn();

    service = new AgentRunTurnService(
      {} as AgentTurnService,
      {
        calculateAndBillUsage,
        calculateStepsCost: jest.fn().mockReturnValue(0),
      } as unknown as AiBillingService,
      {} as AgentRunPersonaService,
      {} as RunAgentAttachmentService,
      {} as Repository<WorkspaceEntity>,
    );
  });

  it('should use a reply that already is the JSON without asking again', async () => {
    const completed = await completeTurn(JSON.stringify(VALID_OUTPUT));

    expect(completed.result).toEqual(VALID_OUTPUT);
    expect(generateTextMock).not.toHaveBeenCalled();
    expect(completed.structuredOutputSteps).toEqual([]);
  });

  it('should ask for the structured output when the reply is prose', async () => {
    generateTextMock.mockResolvedValueOnce({
      output: VALID_OUTPUT,
      usage: USAGE,
      steps: [],
    } as never);

    const completed = await completeTurn('It is a newsletter.');

    expect(completed.result).toEqual(VALID_OUTPUT);
    expect(generateTextMock).toHaveBeenCalledTimes(1);
    expect(generateTextMock.mock.calls[0][0].prompt).toContain('tipo_pedido');
    expect(calculateAndBillUsage).toHaveBeenCalledTimes(1);
  });

  it('should retry an output that ignored the schema and bill both attempts', async () => {
    generateTextMock
      .mockRejectedValueOnce(buildNoObjectGeneratedError())
      .mockResolvedValueOnce({
        output: VALID_OUTPUT,
        usage: USAGE,
        steps: [],
      } as never);

    const completed = await completeTurn('It is a newsletter.');

    expect(completed.result).toEqual(VALID_OUTPUT);
    expect(generateTextMock).toHaveBeenCalledTimes(2);
    expect(calculateAndBillUsage).toHaveBeenCalledTimes(2);
  });

  it('should fail once every attempt ignored the schema', async () => {
    generateTextMock.mockRejectedValue(buildNoObjectGeneratedError());

    await expect(completeTurn('It is a newsletter.')).rejects.toBeInstanceOf(
      NoObjectGeneratedError,
    );
    expect(generateTextMock).toHaveBeenCalledTimes(
      STRUCTURED_OUTPUT_MAX_ATTEMPTS,
    );
  });

  it('should fail when the model returns no output at all', async () => {
    generateTextMock.mockResolvedValue({
      output: null,
      usage: USAGE,
      steps: [],
    } as never);

    await expect(completeTurn('It is a newsletter.')).rejects.toBeInstanceOf(
      AiException,
    );
  });
});
