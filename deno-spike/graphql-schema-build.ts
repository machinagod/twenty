// Tackles GraphQL head-on for the Deno port. Proves two things:
//  (1) @nestjs/graphql's CODE-FIRST schema builder (decorators + emitDecoratorMetadata
//      + reflection) runs under Deno node-compat — Twenty is 100% code-first, so this
//      gates the entire GraphQL layer.
//  (2) Twenty's Yarn `patch:` patch for @nestjs/graphql is actually applied under Deno
//      (Yarn's patch protocol doesn't exist here). Run deno-spike/apply-patches.sh
//      first; this harness then verifies the loaded package contains the patch.
//
//   bash deno-spike/apply-patches.sh           # patch the Deno-resolved node_modules
//   deno run -A --config deno-spike/graphql-schema-build.json deno-spike/graphql-schema-build.ts

import 'reflect-metadata';
import { Field, ObjectType, Query, Resolver, Int, GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { NestFactory } from '@nestjs/core';
import { printSchema } from 'graphql';

@ObjectType()
class Person {
  @Field()
  name!: string;

  @Field(() => Int)
  age!: number;
}

@Resolver(() => Person)
class PersonResolver {
  @Query(() => [Person])
  people(): Person[] {
    return [];
  }

  @Query(() => Person)
  person(): Person {
    return { name: 'Ada', age: 36 };
  }
}

const app = await NestFactory.create(GraphQLSchemaBuilderModule, { logger: ['error'] });
await app.init();

const schemaFactory = app.get(GraphQLSchemaFactory);
const schema = await schemaFactory.create([PersonResolver]);

const sdl = printSchema(schema);
console.log('--- generated SDL ---');
console.log(sdl);

const schemaOk =
  sdl.includes('type Person') &&
  sdl.includes('name: String!') &&
  sdl.includes('age: Int!') &&
  sdl.includes('people: [Person!]!');

console.log(`\n[1] code-first schema build under Deno: ${schemaOk ? 'PASS ✅' : 'FAIL ❌'}`);

// Verify Deno is running the PATCHED @nestjs/graphql (apply-patches.sh applied the
// Yarn patch in place). The patch adds computeReachableTypes() to the schema factory.
let patchOk = false;
try {
  const indexUrl = import.meta.resolve('@nestjs/graphql');
  const factoryUrl = new URL(
    './schema-builder/graphql-schema.factory.js',
    indexUrl,
  );
  const factorySrc = await Deno.readTextFile(factoryUrl);
  patchOk = factorySrc.includes('computeReachableTypes');
} catch (error) {
  console.log(`    (could not read resolved @nestjs/graphql: ${(error as Error).message})`);
}
console.log(
  `[2] Deno is running the PATCHED @nestjs/graphql: ${patchOk ? 'PASS ✅' : 'FAIL ❌ (run apply-patches.sh)'}`,
);

const ok = schemaOk && patchOk;
console.log(`\n==== ${ok ? 'PASS ✅' : 'FAIL ❌'} ====`);
await app.close();
if (!ok) Deno.exit(1);
