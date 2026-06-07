// Pure-Deno runtime shim for @lingui/core/macro (directive: no build step, so the
// lingui babel/swc macro transform never runs). The real @lingui/core/macro re-exports
// a babel macro that throws at runtime; here we implement msg/t/defineMessage as actual
// runtime functions over @lingui/core's i18n.
//
// Limitation: a tagged template gives us interpolation VALUES but not the source
// variable NAMES, so interpolated messages use positional placeholders ({0},{1}) — they
// render correctly in the active/default locale but won't match catalog ids built from
// named placeholders. Static (non-interpolated) messages match catalogs normally.
import { i18n } from '@lingui/core';

type Descriptor = { id?: string; message?: string; values?: Record<string, unknown> };

const toDescriptor = (strings: unknown, values: unknown[]): Descriptor => {
  if (typeof strings === 'string') {
    return { message: strings };
  }

  if (Array.isArray(strings)) {
    let message = '';
    const valueMap: Record<string, unknown> = {};

    (strings as string[]).forEach((part, index) => {
      message += part;
      if (index < values.length) {
        message += `{${index}}`;
        valueMap[index] = values[index];
      }
    });

    return values.length > 0 ? { message, values: valueMap } : { message };
  }

  // Already a MessageDescriptor object.
  return strings as Descriptor;
};

// msg`...` / msg({...}) -> a MessageDescriptor for deferred translation.
export const msg = (strings: unknown, ...values: unknown[]): Descriptor =>
  toDescriptor(strings, values);

export const defineMessage = msg;

// t`...` -> translated string now. Also supports t(i18n)`...`.
export const t = (
  strings: unknown,
  ...values: unknown[]
): string | ((s: unknown, ...v: unknown[]) => string) => {
  if (
    strings &&
    typeof (strings as { _?: unknown })._ === 'function' &&
    !Array.isArray(strings)
  ) {
    const customI18n = strings as { _: (d: unknown) => string };

    return (s: unknown, ...v: unknown[]) => customI18n._(toDescriptor(s, v));
  }

  return i18n._(toDescriptor(strings, values));
};
