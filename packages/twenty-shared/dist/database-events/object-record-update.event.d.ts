import { type ObjectRecordDiff } from '@/database-events/object-record-diff';
import { ObjectRecordBaseEvent } from '@/database-events/object-record.base.event';
export declare class ObjectRecordUpdateEvent<T = object> extends ObjectRecordBaseEvent<T> {
    properties: {
        updatedFields: string[];
        diff: Partial<ObjectRecordDiff<T>>;
        before: T;
        after: T;
    };
}
//# sourceMappingURL=object-record-update.event.d.ts.map