import { type CountryCode } from 'libphonenumber-js';
import { type CompositeType } from '../composite-types/composite-type.interface';
export declare const phonesCompositeType: CompositeType;
export type AdditionalPhoneMetadata = {
    number: string;
    countryCode: CountryCode;
    callingCode: string;
};
type PrimaryPhoneMetadata<T extends AdditionalPhoneMetadata = AdditionalPhoneMetadata> = {
    [Property in keyof AdditionalPhoneMetadata as `primaryPhone${Capitalize<string & Property>}`]: T[Property];
};
export type PhonesMetadata = PrimaryPhoneMetadata & {
    additionalPhones: Array<AdditionalPhoneMetadata> | null;
};
export {};
//# sourceMappingURL=phones.composite-type.d.ts.map