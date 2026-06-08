import { type CompositeType } from '../composite-types/composite-type.interface';
export declare const linksCompositeType: CompositeType;
export type LinkMetadata = {
    label: string;
    url: string;
};
export type LinksMetadata = {
    primaryLinkLabel: string;
    primaryLinkUrl: string;
    secondaryLinks: LinkMetadata[] | null;
};
export type LinkMetadataNullable = {
    label: string | null;
    url: string | null;
};
//# sourceMappingURL=links.composite-type.d.ts.map