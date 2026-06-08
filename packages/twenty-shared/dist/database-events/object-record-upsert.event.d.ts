import { ObjectRecordBaseEvent } from '@/database-events/object-record.base.event';
import { type ObjectRecordDiff } from '@/database-events/object-record-diff';
export declare class ObjectRecordUpsertEvent<T = object> extends ObjectRecordBaseEvent<T> {
    properties: {
        before?: T;
        after: T;
        diff?: Partial<ObjectRecordDiff<T>>;
        updatedFields?: string[];
    };
}
//# sourceMappingURL=object-record-upsert.event.d.ts.map