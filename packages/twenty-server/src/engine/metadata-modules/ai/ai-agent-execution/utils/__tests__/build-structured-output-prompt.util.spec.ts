import { buildStructuredOutputPrompt } from 'src/engine/metadata-modules/ai/ai-agent-execution/utils/build-structured-output-prompt.util';

describe('buildStructuredOutputPrompt', () => {
  it('carries the execution results and the schema keys to the model', () => {
    const prompt = buildStructuredOutputPrompt({
      executionResultsText: '{"tipo_pedido": "OUTRO"}',
      schema: {
        type: 'object',
        properties: {
          tipo_pedido: {
            type: 'string',
            description: 'PEDIDO_CLIENTE or OUTRO',
          },
          motivo: { type: 'string' },
        },
        required: ['tipo_pedido', 'motivo'],
        additionalProperties: false,
      },
    });

    expect(prompt).toContain('Execution Results: {"tipo_pedido": "OUTRO"}');
    expect(prompt).toContain('"tipo_pedido": {');
    expect(prompt).toContain('"description": "PEDIDO_CLIENTE or OUTRO"');
    expect(prompt).toContain('"motivo": {');
    expect(prompt).toContain('"additionalProperties": false');
  });
});
