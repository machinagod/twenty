// Add Jest matchers for toThrowError and other missing methods
import { i18n } from '@lingui/core';

// Many server util specs call functions that contain `t\`…\`` lingui macros
// without booting the I18nService. Activate a locale with an empty catalog
// so `i18n._()` returns the message id instead of throwing "Attempted to call
// a translation function without setting a locale."
i18n.load('en', {});
i18n.activate('en');

export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toThrowError(error?: string | RegExp | Error): R;
      toBeCalledTimes(expected: number): R;
    }
  }
}
