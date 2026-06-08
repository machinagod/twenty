import { type OAuthProviderTokenRequestContentType } from '@/application/oauthProviderTokenRequestContentType.type';
export type StoredOAuthConnectionProviderConfig = {
    authorizationEndpoint: string;
    tokenEndpoint: string;
    revokeEndpoint: string | null;
    scopes: string[];
    clientIdVariable: string;
    clientSecretVariable: string;
    authorizationParams: Record<string, string> | null;
    tokenRequestContentType: OAuthProviderTokenRequestContentType;
    usePkce: boolean;
};
//# sourceMappingURL=storedOAuthConnectionProviderConfigType.d.ts.map