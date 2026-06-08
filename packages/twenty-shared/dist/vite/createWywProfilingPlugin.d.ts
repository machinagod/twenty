import { type Plugin } from 'vite';
type WywProfilingOptions = {
    devSlowThresholdMs?: number;
    topSlowFilesCount?: number;
    warmupThresholdMs?: number;
};
export declare const createWywProfilingPlugin: (wywPlugin: Plugin, options?: WywProfilingOptions) => Plugin;
export {};
//# sourceMappingURL=createWywProfilingPlugin.d.ts.map