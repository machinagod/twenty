export declare const needsEscaping: (key: string) => boolean;
export declare const escapePathSegment: (segment: string) => string;
export declare const joinVariablePath: (segments: string[]) => string;
/**
 * Parses a variable path string into segments, handling bracket notation.
 * Examples:
 *   "step.normal.key" => ["step", "normal", "key"]
 *   "step.[key with space].value" => ["step", "key with space", "value"]
 *   "step.[key.with.dots]" => ["step", "key.with.dots"]
 */
export declare const parseVariablePath: (path: string) => string[];
//# sourceMappingURL=variable-path.util.d.ts.map