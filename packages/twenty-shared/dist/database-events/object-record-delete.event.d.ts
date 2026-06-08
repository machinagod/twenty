import { type ObjectRecordDiff } from '@/database-events/object-record-diff';
import { ObjectRecordBaseEvent } from '@/database-events/object-record.base.event';
export declare class ObjectRecordDeleteEvent<T = object> extends ObjectRecordBaseEvent<T> {
    properties: {
        before: T;
        after: T;
        updatedFields: string[];
        diff: Partial<ObjectRecordDiff<T>>;
    };
}
//# sourceMappingURL=object-record-delete.event.d.ts.map