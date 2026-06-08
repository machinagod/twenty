import { type OrderBy } from './OrderBy';
type OrderByValue = OrderBy | {
    [fieldName: string]: OrderByValue;
};
export type RecordGqlOperationOrderBy = Array<{
    [fieldName: string]: OrderByValue;
}>;
export {};
//# sourceMappingURL=RecordGqlOperationOrderBy.d.ts.map