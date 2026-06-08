import { ObjectRecordBaseEvent } from '@/database-events/object-record.base.event';
export declare class ObjectRecordDestroyEvent<T = object> extends ObjectRecordBaseEvent<T> {
    properties: {
        before: T;
    };
}
//# sourceMappingURL=object-record-destroy.event.d.ts.map