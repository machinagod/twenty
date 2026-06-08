export declare const LOGIC_FUNCTION_HTTP_RESPONSE_MARKER = "__twentyHttpResponse";
export type LogicFunctionHttpResponse = {
    __twentyHttpResponse: true;
    body: unknown;
    status?: number;
    headers?: Record<string, string>;
};
export declare const isLogicFunctionHttpResponse: (value: unknown) => value is LogicFunctionHttpResponse;
//# sourceMappingURL=LogicFunctionResponse.d.ts.map