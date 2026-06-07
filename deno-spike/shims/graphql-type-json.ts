// Deno's CJS interop gives `module.exports` (an object) as the default import, whereas
// Node's esModuleInterop yields `exports.default`. graphql-type-json sets a real default
// (the GraphQLJSON scalar), so `import GraphQLJSON from 'graphql-type-json'` is the scalar
// on Node but the namespace object on Deno (breaking `() => GraphQLJSON`). This shim
// re-exports the proper default + named values so the unmodified source works on Deno.
import * as graphqlTypeJson from 'npm:graphql-type-json@0.3.2';

export const GraphQLJSON = (graphqlTypeJson as { GraphQLJSON: unknown }).GraphQLJSON;
export const GraphQLJSONObject = (graphqlTypeJson as { GraphQLJSONObject: unknown }).GraphQLJSONObject;
export default GraphQLJSON;
