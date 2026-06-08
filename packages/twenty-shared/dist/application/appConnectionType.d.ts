export type AppConnection = {
    id: string;
    providerName: string;
    name: string;
    handle: string;
    visibility: 'user' | 'workspace';
    userWorkspaceId: string;
    accessToken: string;
    scopes: string[];
    authFailedAt: string | null;
};
//# sourceMappingURL=appConnectionType.d.ts.map