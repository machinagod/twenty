import { mkdir as f, readdir as q, rm as l, rename as A, cp as R, appendFile as m, copyFile as c, writeFile as I } from "node:fs/promises";
import { join as r } from "node:path";
import { generate as y } from "@genql/cli";
import { build as u } from "esbuild";
const T = "TWENTY_API_URL", P = "// __STRIPPED_DURING_INJECTION_START__", k = "// __STRIPPED_DURING_INJECTION_END__", d = "// __UPLOAD_FILE_START__", p = "// __UPLOAD_FILE_END__", o = (n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), _ = (n, t) => {
  let e = n;
  return e = e.replace(
    new RegExp(
      `${o(P)}[\\s\\S]*?${o(k)}\\n?`
    ),
    ""
  ), e = e.replace("'__TWENTY_DEFAULT_URL__'", t.defaultUrl), e = e.replace(/TwentyGeneratedClient/g, t.apiClientName), t.includeUploadFile ? (e = e.replace(
    new RegExp(`\\s*${o(d)}\\n`),
    `
`
  ), e = e.replace(
    new RegExp(`\\s*${o(p)}\\n`),
    `
`
  )) : e = e.replace(
    new RegExp(
      `\\s*${o(d)}[\\s\\S]*?${o(p)}\\n?`
    ),
    `
`
  ), `
// ${t.apiClientName} (auto-injected by twenty-client-sdk)
${e}`;
}, E = (n) => f(n, { recursive: !0 }), g = async (n) => {
  let t;
  try {
    t = await q(n);
  } catch (e) {
    if (e instanceof Error && "code" in e && e.code === "ENOENT") {
      await f(n, { recursive: !0 });
      return;
    }
    throw e;
  }
  await Promise.all(
    t.map(
      (e) => l(r(n, e), { recursive: !0, force: !0 })
    )
  );
}, C = async (n, t) => {
  try {
    await A(n, t);
  } catch (e) {
    if (e instanceof Error && "code" in e && e.code === "EXDEV")
      await R(n, t, { recursive: !0 }), await l(n, { recursive: !0, force: !0 });
    else
      throw e;
  }
}, h = (n) => l(n, { recursive: !0, force: !0 }), w = `// Ambient type stubs for the genql-generated code this template gets
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
`, O = {
  DateTime: "string",
  JSON: "Record<string, unknown>",
  UUID: "string"
}, v = "core/generated", N = async ({
  schema: n,
  outputPath: t,
  clientWrapperTemplateSource: e
}) => {
  const a = e ?? w, s = `${t}.tmp`;
  await E(s), await g(s);
  try {
    await y({
      schema: n,
      output: s,
      scalarTypes: O
    });
    const i = _(a, {
      apiClientName: "CoreApiClient",
      defaultUrl: `\`\${process.env.${T}}/graphql\``,
      includeUploadFile: !0
    });
    await m(r(s, "index.ts"), i), await h(t), await C(s, t), await S(t);
  } catch (i) {
    throw await h(s), i;
  }
}, x = async ({
  packageRoot: n,
  schema: t
}) => {
  const e = r(n, "dist", v);
  await N({ schema: t, outputPath: e }), await c(
    r(e, "index.mjs"),
    r(n, "dist", "core.mjs")
  ), await c(
    r(e, "index.cjs"),
    r(n, "dist", "core.cjs")
  );
}, S = async (n) => {
  const t = r(n, "index.ts"), e = r(n, "index.mjs");
  await u({
    entryPoints: [t],
    outfile: e,
    bundle: !0,
    format: "esm",
    platform: "node",
    target: "node18",
    sourcemap: !1,
    minify: !1
  }), await u({
    entryPoints: [t],
    outfile: r(n, "index.cjs"),
    bundle: !0,
    format: "cjs",
    platform: "node",
    target: "node18",
    sourcemap: !1,
    minify: !1
  }), await I(
    r(n, "package.json"),
    JSON.stringify(
      { type: "module", main: "index.mjs", module: "index.mjs" },
      null,
      2
    )
  );
}, G = {
  DateTime: "string",
  JSON: "Record<string, unknown>",
  UUID: "string"
}, b = async ({
  schema: n,
  outputPath: t,
  clientWrapperTemplateSource: e
}) => {
  const a = e ?? w;
  await E(t), await g(t), await y({
    schema: n,
    output: t,
    scalarTypes: {
      ...G,
      Upload: "File"
    }
  });
  const s = _(a, {
    apiClientName: "MetadataApiClient",
    defaultUrl: `\`\${process.env.${T}}/metadata\``,
    includeUploadFile: !0
  });
  await m(r(t, "index.ts"), s);
};
export {
  v as GENERATED_CORE_DIR,
  N as generateCoreClientFromSchema,
  b as generateMetadataClient,
  x as replaceCoreClient
};
