/**
 * Deep merges two objects or arrays recursively
 * - Objects are merged by combining their properties
 * - Arrays are merged by concatenating them
 * - Primitive values from target override source
 * - Null values from target are preserved
 * - Undefined values from target are ignored
 * - Date and RegExp objects are treated as primitives (replaced, not merged)
 *
 * @param source The source object to merge from
 * @param target The target object to merge into
 * @returns A new merged object
 */
export declare const deepMerge: <T extends object>(source: Required<T>, target: Required<T>) => T;
//# sourceMappingURL=deepMerge.d.ts.map