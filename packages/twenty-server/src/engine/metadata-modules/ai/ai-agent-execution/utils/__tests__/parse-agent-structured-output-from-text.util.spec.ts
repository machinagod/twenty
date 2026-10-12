import { type AgentResponseSchema } from 'twenty-shared/ai';

import { parseAgentStructuredOutputFromText } from 'src/engine/metadata-modules/ai/ai-agent-execution/utils/parse-agent-structured-output-from-text.util';

const schema: AgentResponseSchema = {
  type: 'object',
  properties: {
    tipo_pedido: { type: 'string' },
    motivo: { type: 'string' },
  },
  required: ['tipo_pedido', 'motivo'],
  additionalProperties: false,
};

describe('parseAgentStructuredOutputFromText', () => {
  it('reads a reply that is exactly the JSON', () => {
    expect(
      parseAgentStructuredOutputFromText(
        schema,
        ' {"tipo_pedido": "OUTRO", "motivo": "Newsletter"}\n',
      ),
    ).toEqual({ tipo_pedido: 'OUTRO', motivo: 'Newsletter' });
  });

  it('reads the JSON out of a code fence or surrounding prose', () => {
    expect(
      parseAgentStructuredOutputFromText(
        schema,
        '```json\n{"tipo_pedido": "PEDIDO_CLIENTE", "motivo": "Pede preços"}\n```',
      ),
    ).toEqual({ tipo_pedido: 'PEDIDO_CLIENTE', motivo: 'Pede preços' });
    expect(
      parseAgentStructuredOutputFromText(
        schema,
        'Here it is: {"tipo_pedido": "OUTRO", "motivo": "Fatura"} Done.',
      ),
    ).toEqual({ tipo_pedido: 'OUTRO', motivo: 'Fatura' });
  });

  it('returns null when the JSON does not match the schema', () => {
    expect(
      parseAgentStructuredOutputFromText(
        schema,
        '{"classificacao": "OUTRO", "justificativa": "Encomenda firme"}',
      ),
    ).toBeNull();
  });

  it('returns null when there is no JSON at all', () => {
    expect(
      parseAgentStructuredOutputFromText(schema, 'I would say OUTRO.'),
    ).toBeNull();
    expect(parseAgentStructuredOutputFromText(schema, '{not json}')).toBeNull();
  });
});
