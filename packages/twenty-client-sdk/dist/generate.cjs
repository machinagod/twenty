"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const r=require("node:fs/promises"),s=require("node:path"),h=require("@genql/cli"),c=require("esbuild"),f="TWENTY_API_URL",q="// __STRIPPED_DURING_INJECTION_START__",w="// __STRIPPED_DURING_INJECTION_END__",u="// __UPLOAD_FILE_START__",d="// __UPLOAD_FILE_END__",o=n=>n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),m=(n,t)=>{let e=n;return e=e.replace(new RegExp(`${o(q)}[\\s\\S]*?${o(w)}\\n?`),""),e=e.replace("'__TWENTY_DEFAULT_URL__'",t.defaultUrl),e=e.replace(/TwentyGeneratedClient/g,t.apiClientName),t.includeUploadFile?(e=e.replace(new RegExp(`\\s*${o(u)}\\n`),`
`),e=e.replace(new RegExp(`\\s*${o(d)}\\n`),`
`)):e=e.replace(new RegExp(`\\s*${o(u)}[\\s\\S]*?${o(d)}\\n?`),`
`),`
// ${t.apiClientName} (auto-injected by twenty-client-sdk)
${e}`},y=n=>r.mkdir(n,{recursive:!0}),_=async n=>{let t;try{t=await r.readdir(n)}catch(e){if(e instanceof Error&&"code"in e&&e.code==="ENOENT"){await r.mkdir(n,{recursive:!0});return}throw e}await Promise.all(t.map(e=>r.rm(s.join(n,e),{recursive:!0,force:!0})))},A=async(n,t)=>{try{await r.rename(n,t)}catch(e){if(e instanceof Error&&"code"in e&&e.code==="EXDEV")await r.cp(n,t,{recursive:!0}),await r.rm(n,{recursive:!0,force:!0});else throw e}},p=n=>r.rm(n,{recursive:!0,force:!0}),T=`// Ambient type stubs for the genql-generated code this template gets
// injected into. They enable full typecheck/lint on this file.
// __STRIPPED_DURING_INJECTION_START__
type QueryGenqlSelection = Record<string, unknown>;
type MutationGenqlSelection = Record<string, unknown>;
type GraphqlOperation = Record<string, unknown>;

type ClientOptions = {
  url?: string;
  headers?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
  fetcher?: (
    operation: GraphqlOperation | GraphqlOperation[],
  ) => Promise<unknown>;
  fetch?: typeof globalThis.fetch;
  batch?: unknown;
};

type Client = {
  query: (
    request: QueryGenqlSelection & { __name?: string },
  ) => Promise<unknown>;
  mutation: (
    request: MutationGenqlSelection & { __name?: string },
  ) => Promise<unknown>;
};

declare function createClient(options: ClientOptions): Client;

declare class GenqlError extends Error {
  constructor(errors: unknown, data: unknown);
}
// __STRIPPED_DURING_INJECTION_END__

const APP_ACCESS_TOKEN_ENV_KEY = 'TWENTY_APP_ACCESS_TOKEN';
const API_KEY_ENV_KEY = 'TWENTY_API_KEY';

type TwentyGeneratedClientOptions = ClientOptions;

type ProcessEnvironment = Record<string, string | undefined>;

type GraphqlErrorPayloadEntry = {
  message?: string;
  extensions?: { code?: string };
};

type GraphqlResponsePayload = {
  data?: Record<string, unknown>;
  errors?: GraphqlErrorPayloadEntry[];
};

type GraphqlResponse = {
  status: number;
  statusText: string;
  payload: GraphqlResponsePayload | null;
  rawBody: string;
};

const getProcessEnvironment = (): ProcessEnvironment => {
  const processObject = (
    globalThis as { process?: { env?: ProcessEnvironment } }
  ).process;

  return processObject?.env ?? {};
};

const getTokenFromAuthorizationHeader = (
  authorizationHeader: string | undefined,
): string | null => {
  if (typeof authorizationHeader !== 'string') {
    return null;
  }

  const trimmedAuthorizationHeader = authorizationHeader.trim();

  if (trimmedAuthorizationHeader.length === 0) {
    return null;
  }

  if (trimmedAuthorizationHeader === 'Bearer') {
    return null;
  }

  if (trimmedAuthorizationHeader.startsWith('Bearer ')) {
    return trimmedAuthorizationHeader.slice('Bearer '.length).trim();
  }

  return trimmedAuthorizationHeader;
};

const getTokenFromHeaders = (
  headers: HeadersInit | undefined,
): string | null => {
  if (!headers) {
    return null;
  }

  if (headers instanceof Headers) {
    return getTokenFromAuthorizationHeader(
      headers.get('Authorization') ?? undefined,
    );
  }

  if (Array.isArray(headers)) {
    const matchedAuthorizationHeader = headers.find(
      ([headerName]) => headerName.toLowerCase() === 'authorization',
    );

    return getTokenFromAuthorizationHeader(matchedAuthorizationHeader?.[1]);
  }

  const headersRecord = headers as Record<string, string | undefined>;

  return getTokenFromAuthorizationHeader(
    headersRecord.Authorization ?? headersRecord.authorization,
  );
};

const hasAuthenticationErrorInGraphqlPayload = (
  payload: GraphqlResponsePayload | null,
): boolean => {
  if (!payload?.errors) {
    return false;
  }

  return payload.errors.some((graphqlError) => {
    return (
      graphqlError.extensions?.code === 'UNAUTHENTICATED' ||
      graphqlError.message?.toLowerCase() === 'unauthorized'
    );
  });
};

const defaultOptions: TwentyGeneratedClientOptions = {
  url: '__TWENTY_DEFAULT_URL__',
  headers: {
    'Content-Type': 'application/json',
  },
};

export class TwentyGeneratedClient {
  private client: Client;
  private url: string;
  private requestOptions: RequestInit;
  private headers: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
  private fetchImplementation: typeof globalThis.fetch | null;
  private authorizationToken: string | null;
  private refreshAccessTokenPromise: Promise<string | null> | null = null;

  constructor(options?: TwentyGeneratedClientOptions) {
    const merged: TwentyGeneratedClientOptions = {
      ...defaultOptions,
      ...options,
    };

    const {
      url,
      headers,
      fetch: customFetchImplementation,
      fetcher: _fetcher,
      batch: _batch,
      ...requestOptions
    } = merged;

    this.url = url ?? '';
    this.requestOptions = requestOptions;
    this.headers = headers ?? {};
    this.fetchImplementation =
      customFetchImplementation ?? globalThis.fetch ?? null;

    const processEnvironment = getProcessEnvironment();
    const tokenFromHeaders = getTokenFromHeaders(
      typeof headers === 'function' ? undefined : headers,
    );

    // Priority: explicit header > app access token > api key (legacy).
    this.authorizationToken =
      tokenFromHeaders ??
      processEnvironment[APP_ACCESS_TOKEN_ENV_KEY] ??
      processEnvironment[API_KEY_ENV_KEY] ??
      null;

    this.client = createClient({
      ...merged,
      headers: undefined,
      fetcher: async (operation) =>
        this.executeGraphqlRequestWithOptionalRefresh({
          operation,
        }),
    });
  }

  query<R extends QueryGenqlSelection>(request: R & { __name?: string }) {
    return this.client.query(request);
  }

  mutation<R extends MutationGenqlSelection>(request: R & { __name?: string }) {
    return this.client.mutation(request);
  }

  // __UPLOAD_FILE_START__
  async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    contentType: string = 'application/octet-stream',
    fieldMetadataUniversalIdentifier: string,
  ): Promise<{
    id: string;
    path: string;
    size: number;
    createdAt: string;
    url: string;
  }> {
    const form = new FormData();

    form.append(
      'operations',
      JSON.stringify({
        query: \`mutation UploadFilesFieldFileByUniversalIdentifier($file: Upload!, $fieldMetadataUniversalIdentifier: String!) {
        uploadFilesFieldFileByUniversalIdentifier(file: $file, fieldMetadataUniversalIdentifier: $fieldMetadataUniversalIdentifier) { id path size createdAt url }
      }\`,
        variables: {
          file: null,
          fieldMetadataUniversalIdentifier,
        },
      }),
    );
    form.append('map', JSON.stringify({ '0': ['variables.file'] }));
    form.append(
      '0',
      new Blob([fileBuffer as BlobPart], { type: contentType }),
      filename,
    );

    const result = await this.executeGraphqlRequestWithOptionalRefresh({
      operation: form,
      headers: {},
      requestInit: {
        method: 'POST',
      },
    });

    if (result.errors) {
      throw new GenqlError(result.errors, result.data);
    }

    const data = result.data as Record<string, unknown>;

    return data.uploadFilesFieldFileByUniversalIdentifier as {
      id: string;
      path: string;
      size: number;
      createdAt: string;
      url: string;
    };
  }
  // __UPLOAD_FILE_END__

  private async executeGraphqlRequestWithOptionalRefresh({
    operation,
    headers,
    requestInit,
  }: {
    operation: GraphqlOperation | GraphqlOperation[] | FormData;
    headers?: HeadersInit;
    requestInit?: RequestInit;
  }) {
    const firstResponse = await this.executeGraphqlRequest({
      operation,
      headers,
      requestInit,
      token: this.authorizationToken,
    });

    if (this.shouldRefreshToken(firstResponse)) {
      const refreshedAccessToken = await this.requestRefreshedAccessToken();

      if (refreshedAccessToken) {
        const retryResponse = await this.executeGraphqlRequest({
          operation,
          headers,
          requestInit,
          token: refreshedAccessToken,
        });

        return this.assertResponseIsSuccessful(retryResponse);
      }
    }

    return this.assertResponseIsSuccessful(firstResponse);
  }

  private async executeGraphqlRequest({
    operation,
    headers,
    requestInit,
    token,
  }: {
    operation: GraphqlOperation | GraphqlOperation[] | FormData;
    headers?: HeadersInit;
    requestInit?: RequestInit;
    token: string | null;
  }): Promise<GraphqlResponse> {
    if (!this.fetchImplementation) {
      throw new Error(
        'Global \`fetch\` function is not available, ' +
          'pass a fetch implementation to the Twenty client',
      );
    }

    const resolvedHeaders = await this.resolveHeaders();
    const requestHeaders = new Headers(resolvedHeaders);

    if (headers) {
      new Headers(headers).forEach((value, key) =>
        requestHeaders.set(key, value),
      );
    }

    if (operation instanceof FormData) {
      requestHeaders.delete('Content-Type');
    } else {
      requestHeaders.set('Content-Type', 'application/json');
    }

    if (token) {
      requestHeaders.set('Authorization', \`Bearer \${token}\`);
    } else {
      requestHeaders.delete('Authorization');
    }

    const response = await this.fetchImplementation.call(globalThis, this.url, {
      ...this.requestOptions,
      ...requestInit,
      method: requestInit?.method ?? 'POST',
      headers: requestHeaders,
      body:
        operation instanceof FormData ? operation : JSON.stringify(operation),
    });

    const rawBody = await response.text();
    let payload: GraphqlResponsePayload | null = null;

    if (rawBody.trim().length > 0) {
      try {
        payload = JSON.parse(rawBody) as GraphqlResponsePayload;
      } catch {
        payload = null;
      }
    }

    return {
      status: response.status,
      statusText: response.statusText,
      payload,
      rawBody,
    };
  }

  private async resolveHeaders(): Promise<HeadersInit> {
    if (typeof this.headers === 'function') {
      return (await this.headers()) ?? {};
    }

    return this.headers ?? {};
  }

  private shouldRefreshToken(response: GraphqlResponse): boolean {
    if (response.status === 401) {
      return true;
    }

    return hasAuthenticationErrorInGraphqlPayload(response.payload);
  }

  private assertResponseIsSuccessful(response: GraphqlResponse) {
    if (response.status < 200 || response.status >= 300) {
      throw new Error(\`\${response.statusText}: \${response.rawBody}\`);
    }

    if (response.payload === null) {
      throw new Error('Invalid JSON response');
    }

    return response.payload;
  }

  private async requestRefreshedAccessToken(): Promise<string | null> {
    const refreshAccessTokenFunction = (
      globalThis as {
        frontComponentHostCommunicationApi?: {
          requestAccessTokenRefresh?: () => Promise<string>;
        };
      }
    ).frontComponentHostCommunicationApi?.requestAccessTokenRefresh;

    if (typeof refreshAccessTokenFunction !== 'function') {
      return null;
    }

    if (!this.refreshAccessTokenPromise) {
      this.refreshAccessTokenPromise = refreshAccessTokenFunction()
        .then((refreshedAccessToken) => {
          if (
            typeof refreshedAccessToken !== 'string' ||
            refreshedAccessToken.length === 0
          ) {
            return null;
          }

          this.setAuthorizationToken(refreshedAccessToken);

          return refreshedAccessToken;
        })
        .catch((refreshError: unknown) => {
          console.error('Twenty client: token refresh failed', refreshError);

          return null;
        })
        .finally(() => {
          this.refreshAccessTokenPromise = null;
        });
    }

    return this.refreshAccessTokenPromise;
  }

  private setAuthorizationToken(token: string) {
    this.authorizationToken = token;

    const processEnvironment = getProcessEnvironment();

    processEnvironment[APP_ACCESS_TOKEN_ENV_KEY] = token;
  }
}
`,R={DateTime:"string",JSON:"Record<string, unknown>",UUID:"string"},E="core/generated",g=async({schema:n,outputPath:t,clientWrapperTemplateSource:e})=>{const a=e??T,i=`${t}.tmp`;await y(i),await _(i);try{await h.generate({schema:n,output:i,scalarTypes:R});const l=m(a,{apiClientName:"CoreApiClient",defaultUrl:`\`\${process.env.${f}}/graphql\``,includeUploadFile:!0});await r.appendFile(s.join(i,"index.ts"),l),await p(t),await A(i,t),await P(t)}catch(l){throw await p(i),l}},I=async({packageRoot:n,schema:t})=>{const e=s.join(n,"dist",E);await g({schema:t,outputPath:e}),await r.copyFile(s.join(e,"index.mjs"),s.join(n,"dist","core.mjs")),await r.copyFile(s.join(e,"index.cjs"),s.join(n,"dist","core.cjs"))},P=async n=>{const t=s.join(n,"index.ts"),e=s.join(n,"index.mjs");await c.build({entryPoints:[t],outfile:e,bundle:!0,format:"esm",platform:"node",target:"node18",sourcemap:!1,minify:!1}),await c.build({entryPoints:[t],outfile:s.join(n,"index.cjs"),bundle:!0,format:"cjs",platform:"node",target:"node18",sourcemap:!1,minify:!1}),await r.writeFile(s.join(n,"package.json"),JSON.stringify({type:"module",main:"index.mjs",module:"index.mjs"},null,2))},k={DateTime:"string",JSON:"Record<string, unknown>",UUID:"string"},C=async({schema:n,outputPath:t,clientWrapperTemplateSource:e})=>{const a=e??T;await y(t),await _(t),await h.generate({schema:n,output:t,scalarTypes:{...k,Upload:"File"}});const i=m(a,{apiClientName:"MetadataApiClient",defaultUrl:`\`\${process.env.${f}}/metadata\``,includeUploadFile:!0});await r.appendFile(s.join(t,"index.ts"),i)};exports.GENERATED_CORE_DIR=E;exports.generateCoreClientFromSchema=g;exports.generateMetadataClient=C;exports.replaceCoreClient=I;
