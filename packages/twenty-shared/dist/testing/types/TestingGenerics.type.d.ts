/**
 * Type testing utilities for TypeScript
 * @module TypeTesting
 */
/**
 * A type utility for testing TypeScript type assertions
 *
 * @template T - The actual type to test
 */
export type Expect<T extends true> = T;
/**
 * Tests if two types are exactly equal
 *
 * @template A - First type to compare
 * @template B - Second type to compare
 */
export type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
/**
 * Tests if a type has all required properties of another type
 * Works with both class types and regular object types
 *
 * @template T - Type that should contain the properties
 * @template U - Type whose properties should be contained in T
 */
export type HasAllProperties<T, U> = [T] extends [new (...args: any[]) => any] ? HasAllProperties<InstanceType<T>, U> : [U] extends [new (...args: any[]) => any] ? HasAllProperties<T, InstanceType<U>> : {
    [K in keyof U]-?: K extends keyof T ? Equal<T[K], U[K]> : false;
}[keyof U] extends true ? true : false;
//# sourceMappingURL=TestingGenerics.type.d.ts.map