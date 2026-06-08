export type AgentChatSubscriptionEvent = {
    type: 'stream-chunk';
    chunk: Record<string, unknown>;
    seq?: number;
} | {
    type: 'message-persisted';
    messageId: string;
} | {
    type: 'queue-updated';
} | {
    type: 'stream-error';
    code: string;
    message: string;
} | {
    type: 'credits-exhausted';
};
//# sourceMappingURL=AgentChatSubscriptionEvent.d.ts.map