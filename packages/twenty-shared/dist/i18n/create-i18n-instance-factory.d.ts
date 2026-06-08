import { type I18n, type Messages } from '@lingui/core';
import { type AppLocale } from '@/translations/constants/AppLocales';
export type LocaleMessagesMap = Partial<Record<AppLocale, Messages>>;
export declare const createI18nInstanceFactory: (messagesByLocale: LocaleMessagesMap) => (locale: AppLocale) => I18n;
//# sourceMappingURL=create-i18n-instance-factory.d.ts.map