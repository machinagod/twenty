import { ObjectRecordCreateEvent } from '@/database-events/object-record-create.event';
import { type ObjectRecordDiff } from '@/database-events/object-record-diff';
export declare class ObjectRecordRestoreEvent<T = object> extends ObjectRecordCreateEvent<T> {
    properties: {
        before: T;
        after: T;
        updatedFields: string[];
        diff: Partial<ObjectRecordDiff<T>>;
    };
}
//# sourceMappingURL=object-record-restore.event.d.ts.map