export type AgentResponseFieldType = 'string' | 'number' | 'boolean';
export type AgentResponseSchema = {
    type: 'object';
    properties: Record<string, {
        type: AgentResponseFieldType;
        description?: string;
    }>;
    required?: string[];
    additionalProperties?: false;
};
//# sourceMappingURL=agent-response-schema.type.d.ts.map