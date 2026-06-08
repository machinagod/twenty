import { type CompositeType } from '../composite-types/composite-type.interface';
import type { ConnectedAccountProvider } from '../ConnectedAccountProvider';
export declare enum FieldActorSource {
    EMAIL = "EMAIL",
    CALENDAR = "CALENDAR",
    WORKFLOW = "WORKFLOW",
    AGENT = "AGENT",
    API = "API",
    IMPORT = "IMPORT",
    MANUAL = "MANUAL",
    SYSTEM = "SYSTEM",
    WEBHOOK = "WEBHOOK",
    APPLICATION = "APPLICATION"
}
export declare const actorCompositeType: CompositeType;
export type ActorMetadata = {
    source: FieldActorSource;
    workspaceMemberId: string | null;
    name: string;
    context: {
        provider?: ConnectedAccountProvider;
    };
};
//# sourceMappingURL=actor.composite-type.d.ts.map