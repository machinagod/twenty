import { type PathParam } from 'react-router-dom';
import { type AppPath } from '../../types';
export declare const getAppPath: <T extends AppPath>(to: T, params?: { [key in PathParam<T>]: string | null; }, queryParams?: Record<string, any>) => string;
//# sourceMappingURL=getAppPath.d.ts.map