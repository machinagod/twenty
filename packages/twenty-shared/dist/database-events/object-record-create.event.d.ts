import { ObjectRecordBaseEvent } from '@/database-events/object-record.base.event';
export declare class ObjectRecordCreateEvent<T = object> extends ObjectRecordBaseEvent<T> {
    properties: {
        after: T;
    };
}
//# sourceMappingURL=object-record-create.event.d.ts.map