import { type AgentResponseSchema } from 'twenty-shared/ai';

import { validateAgentStructuredOutput } from 'src/engine/metadata-modules/ai/ai-agent-execution/utils/validate-agent-structured-output.util';

const schema: AgentResponseSchema = {
  type: 'object',
  properties: {
    tipo_pedido: { type: 'string' },
    score: { type: 'number' },
    isQualified: { type: 'boolean' },
  },
  required: ['tipo_pedido', 'score', 'isQualified'],
  additionalProperties: false,
};

describe('validateAgentStructuredOutput', () => {
  it('accepts an output with every key and the right types', () => {
    const value = { tipo_pedido: 'OUTRO', score: 3, isQualified: false };

    expect(validateAgentStructuredOutput(schema, value)).toEqual({
      success: true,
      value,
    });
  });

  it('accepts null for a field the model could not fill', () => {
    expect(
      validateAgentStructuredOutput(schema, {
        tipo_pedido: null,
        score: 1,
        isQualified: true,
      }).success,
    ).toBe(true);
  });

  it('rejects an output whose keys the model made up', () => {
    const validation = validateAgentStructuredOutput(schema, {
      classificacao: 'OUTRO',
      score: 1,
      isQualified: true,
    });

    expect(validation.success).toBe(false);
    expect(validation.success === false && validation.error.message).toBe(
      'Structured output does not match the schema: missing tipo_pedido; unexpected classificacao',
    );
  });

  it('rejects a value of the wrong type', () => {
    const validation = validateAgentStructuredOutput(schema, {
      tipo_pedido: 'OUTRO',
      score: '3',
      isQualified: true,
    });

    expect(validation.success === false && validation.error.message).toBe(
      'Structured output does not match the schema: wrong type for score',
    );
  });

  it('rejects anything that is not an object', () => {
    expect(validateAgentStructuredOutput(schema, ['OUTRO']).success).toBe(
      false,
    );
    expect(validateAgentStructuredOutput(schema, 'OUTRO').success).toBe(false);
  });
});
