import { type PathParam } from 'react-router-dom';
import { AppPath, type SettingsPath } from '../../types';
export declare const getSettingsPath: <T extends SettingsPath>(to: T, params?: { [key in PathParam<`/${AppPath.Settings}/${T}`>]: string | null; }, queryParams?: Record<string, any>, hash?: string) => string;
//# sourceMappingURL=getSettingsPath.d.ts.map