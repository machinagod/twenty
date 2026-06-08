import { i as p } from "./isDefined-BAmzg2fZ.mjs";
import { isObject as z, isNumber as ue, isString as Me, isNumberOrNaN as En, isNonEmptyString as S, isNonEmptyArray as le, isUndefined as Z } from "@sniptt/guards";
import { Parser as pn } from "expr-eval-fork";
import { Temporal as T } from "temporal-polyfill";
import me from "handlebars";
import { F as E } from "./FieldMetadataType-CPAdLk1i.mjs";
import { V as a, a as y } from "./ViewFilterOperandDeprecated-C9y0ExQo.mjs";
import { F as Nn, R as de, a as R, A as Te } from "./RecordFilterGroupLogicalOperator-BIFZRC4L.mjs";
import { S as Sn, b as On, R as We, C as mn, c as v, A as dn, a as Tn, L as An } from "./SubdomainPattern-DLxKt39o.mjs";
import g, { z as A } from "zod";
import { i as hn } from "./isValidUuid-CKnAJUCa.mjs";
import { isDefined as B } from "class-validator";
import { v4 as yn } from "uuid";
import re from "lodash.escaperegexp";
import Rn from "lodash.camelcase";
import Ge from "qs";
import { generatePath as Be } from "react-router-dom";
import { APP_LOCALES as j } from "./translations.mjs";
import { S as te } from "./SourceLocale-ByWXuXx7.mjs";
import { getCountries as je, getCountryCallingCode as _n } from "libphonenumber-js";
function Ln(e, n = new Error("Value not defined")) {
  if (!p(e)) throw n;
}
const Lt = (e) => e !== null && e in j, wt = (e) => Sn.test(e), wn = [
  E.TEXT,
  E.FULL_NAME,
  E.EMAILS,
  E.ADDRESS,
  E.LINKS,
  E.PHONES,
  E.RICH_TEXT,
  E.UUID
], It = (e) => wn.includes(e), Ae = Object.keys(j).reduce((e, n) => {
  const r = n.split("-")[0].toLowerCase();
  return (!e[r] || n === te) && (e[r] = n), e;
}, {}), gt = (e) => {
  if (e === null)
    return te;
  if (e in j)
    return e;
  const n = Object.keys(j).find(
    (t) => t.toLowerCase() === e.toLowerCase()
  );
  if (n)
    return n;
  const r = e?.trim() ? e.split("-")[0].toLowerCase() : "";
  return Ae[r] ? Ae[r] : te;
}, Ke = /* @__PURE__ */ Symbol("micropatch-delete"), Je = ["__proto__", "constructor", "prototype"], Ut = (e, n) => {
  if (!p(e))
    throw new Error("Cannot apply diff to null or undefined object");
  if (!Array.isArray(n))
    throw new Error("Diffs must be an array");
  const r = $n(e), t = [];
  for (const s of n)
    if (!(!s || !s.path || s.path.length === 0))
      try {
        In(r, s, t);
      } catch (o) {
        throw new Error(
          `Failed to apply diff at path ${s.path.join(".")}: ${o}`
        );
      }
  return t.forEach((s) => s()), r;
}, In = (e, n, r) => {
  const { path: t, type: s } = n, o = "value" in n ? n.value : void 0, c = t.length, i = t[c - 1], f = gn(e, t);
  switch (s) {
    case "CREATE":
    case "CHANGE":
      Un(f, i, o);
      break;
    case "REMOVE":
      Cn(
        e,
        t,
        f,
        i,
        r
      );
      break;
    default:
      throw new Error(`Unsupported diff type: ${s}`);
  }
}, gn = (e, n) => {
  let r = e;
  for (let t = 0; t < n.length - 1; t++) {
    const s = n[t];
    if (r == null)
      throw new Error(
        `Cannot traverse path: found null/undefined at element ${t}`
      );
    if (ue(s) && !Array.isArray(r))
      throw new Error(
        `Expected array at path element ${t}, got ${typeof r}`
      );
    if (Me(s) && Array.isArray(r))
      throw new Error(`Expected object at path element ${t}, got array`);
    Array.isArray(r), r = r[s];
  }
  return r;
}, Un = (e, n, r) => {
  if (Array.isArray(e)) {
    if (!ue(n))
      throw new Error(
        `Expected numeric index for array, got ${typeof n}`
      );
    try {
      e[n] = r;
    } catch (t) {
      throw new Error(
        `Cannot set array element at index ${n}: ${t}. Array may be non-extensible.`
      );
    }
  } else if (z(e)) {
    if (Je.includes(n))
      throw new Error(
        `Refusing to set forbidden property key '${n}' on object (prototype pollution protection)`
      );
    try {
      e[n] = r;
    } catch (t) {
      throw new Error(
        `Cannot set property '${String(n)}': ${t}. Object may be non-extensible.`
      );
    }
  } else
    throw new Error(`Expected object or array, got ${typeof e}`);
}, Cn = (e, n, r, t, s) => {
  Array.isArray(r) ? Dn(
    e,
    n,
    r,
    t,
    s
  ) : vn(r, t);
}, Dn = (e, n, r, t, s) => {
  if (typeof t != "number")
    throw new Error(
      `Expected numeric index for array removal, got ${typeof t}`
    );
  r[t] = Ke, s.push(() => {
    n.length === 1 ? Array.isArray(e) && he(e) : he(r);
  });
}, vn = (e, n) => {
  Je.includes(n) || delete e[n];
}, he = (e) => {
  const n = [];
  for (let r = 0; r < e.length; r++)
    e[r] === Ke && n.push(r);
  for (let r = n.length - 1; r >= 0; r--)
    e.splice(n[r], 1);
}, $n = (e) => {
  if (e === null || !z(e))
    return e;
  if (typeof structuredClone < "u")
    try {
      return structuredClone(e);
    } catch {
      return ye(e);
    }
  return ye(e);
}, ye = (e) => {
  try {
    return JSON.parse(JSON.stringify(e));
  } catch {
    throw new Error("Failed to clone object");
  }
}, Ct = (e, n, r) => e.length !== n.length || e.some(
  (t) => !n.some((s) => s[r] === t[r])
) || n.some(
  (t) => !e.some((s) => s[r] === t[r])
), Dt = (e, n, r) => r.findIndex((t) => t.id === e.id) === n, vt = (e, n) => (r) => r[e] !== n, Qe = (e) => (n) => n.id === e, $t = (e, n) => (r) => r[e] === n, bt = (e, n, r = new Error("Element not found")) => {
  const t = e.find(n);
  return Ln(t, r), t;
}, kt = (e, n = 0) => Array.from(
  { length: e },
  (r, t) => n + t
), F = (e) => !!(Array.isArray(e) && ue(e.length) && e.length > 0), Pt = (e) => e.id, xt = (e) => (n) => n[e], Yt = (e) => (n, r) => (typeof n != "number" && (n = 0), En(r[e]) && (n += r[e]), n), qt = (e, n) => {
  const r = e.findIndex(
    Qe(n.id)
  );
  if (r > -1) {
    const s = [...e];
    return s.splice(r, 1, n), s;
  } else
    return e.concat(n);
}, Ht = (e, n) => {
  const r = e.findIndex(
    Qe(n.id)
  );
  if (r > -1) {
    const s = [...e], o = {
      ...e[r],
      ...n
    };
    return s.splice(r, 1, o), s;
  } else
    return e.concat({
      ...n
    });
}, $ = (e, n) => {
  throw new Error(n ?? "Didn't expect to get here.");
}, Mt = (e) => e.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ""), bn = /* @__PURE__ */ new Set([
  "__proto__",
  "constructor",
  "prototype"
]), fe = (e, n) => {
  if (!Me(n))
    return;
  const r = n.split(".");
  let t = e;
  for (const s of r) {
    if (!p(t) || !z(t) || bn.has(s) || !Object.prototype.hasOwnProperty.call(t, s))
      return;
    t = t[s];
  }
  return t;
}, b = (e, n) => (r, t) => le(r) ? r[e](
  (s) => n(fe(s, t))
) : !1, P = (e, n) => (r, t, s) => le(r) ? r[e](
  (o) => n(fe(o, t), s)
) : !1, d = new pn();
d.functions.isDefined = (e) => p(e);
d.functions.isNonEmptyString = (e) => S(e);
d.functions.includes = (e, n) => Array.isArray(e) && e.includes(n);
d.functions.arrayLength = (e) => Array.isArray(e) ? e.length : 0;
d.functions.every = b(
  "every",
  Boolean
);
d.functions.everyDefined = b(
  "every",
  p
);
d.functions.some = b(
  "some",
  Boolean
);
d.functions.someDefined = b(
  "some",
  p
);
d.functions.someNonEmptyString = b("some", S);
d.functions.none = b(
  "every",
  (e) => !e
);
d.functions.noneDefined = b(
  "every",
  (e) => !p(e)
);
d.functions.everyEquals = P(
  "every",
  (e, n) => e === n
);
d.functions.someEquals = P(
  "some",
  (e, n) => e === n
);
d.functions.noneEquals = P(
  "every",
  (e, n) => e !== n
);
d.functions.includesEvery = P(
  "every",
  (e, n) => Array.isArray(e) && e.includes(n)
);
d.functions.includesSome = P(
  "some",
  (e, n) => Array.isArray(e) && e.includes(n)
);
d.functions.includesNone = P(
  "every",
  (e, n) => Array.isArray(e) && !e.includes(n)
);
const Wt = (e, n) => {
  if (!S(e))
    return !0;
  try {
    return d.parse(e).evaluate(n) === !0;
  } catch {
    return !1;
  }
}, K = (e) => S(e) ? e[0].toUpperCase() + e.slice(1) : "", kn = /\$\{([^{}]+)\}/g, Pn = /\$\{[^{}]+\}/, xn = /^(\w+)\((.+)\)$/, Yn = {
  capitalize: K,
  lowercase: (e) => e.toLowerCase()
}, qn = ({
  expression: e,
  context: n
}) => {
  const r = e.trim(), t = r.match(
    xn
  ), s = t ? t[2].trim() : r, o = t ? Yn[t[1]] : void 0, c = fe(
    n,
    s
  );
  if (!p(c))
    return "";
  const i = String(c);
  return p(o) ? o(i) : i;
}, Gt = ({
  label: e,
  context: n
}) => p(e) ? Pn.test(e) ? e.replace(kn, (r, t) => {
  try {
    return qn({ expression: t, context: n });
  } catch {
    return r;
  }
}) : e : null, Bt = ({
  objectMetadataItem: e,
  numberOfSelectedRecords: n
}) => n === 1 ? e.labelSingular : e.labelPlural, G = (e, n) => {
  if (e === n) return !0;
  if (e && n && typeof e == "object" && typeof n == "object") {
    if (e.constructor !== n.constructor) return !1;
    if (Array.isArray(e)) {
      const s = e, o = n;
      if (s.length !== o.length) return !1;
      for (let c = s.length; c-- !== 0; )
        if (!G(s[c], o[c])) return !1;
      return !0;
    }
    if (e instanceof Map && n instanceof Map) {
      if (e.size !== n.size) return !1;
      for (const [s] of e.entries())
        if (!n.has(s)) return !1;
      for (const [s, o] of e.entries())
        if (!G(o, n.get(s))) return !1;
      return !0;
    }
    if (e instanceof Set && n instanceof Set) {
      if (e.size !== n.size) return !1;
      for (const s of e)
        if (!n.has(s)) return !1;
      return !0;
    }
    if (ArrayBuffer.isView(e) && ArrayBuffer.isView(n)) {
      const s = e, o = n;
      if (s.length !== o.length) return !1;
      for (let c = s.length; c-- !== 0; )
        if (s[c] !== o[c]) return !1;
      return !0;
    }
    if (e.constructor === RegExp) {
      const s = e, o = n;
      return s.source === o.source && s.flags === o.flags;
    }
    if (e.valueOf !== Object.prototype.valueOf)
      return e.valueOf() === n.valueOf();
    if (e.toString !== Object.prototype.toString)
      return e.toString() === n.toString();
    const r = Object.keys(e), t = Object.keys(n);
    if (r.length !== t.length) return !1;
    for (let s = r.length; s-- !== 0; )
      if (!(r[s] in n)) return !1;
    for (let s = r.length; s-- !== 0; ) {
      const o = r[s];
      if (!G(
        e[o],
        n[o]
      ))
        return !1;
    }
    return !0;
  }
  return e !== e && n !== n;
}, Re = (e, n) => n.reduce((r, t) => ({
  ...r,
  [t]: e[t]
}), {}), jt = ({
  existingObjects: e,
  receivedObjects: n,
  propertiesToCompare: r,
  isEntityIncluded: t
}) => {
  const s = [], o = [], c = [], i = new Map(
    e.map((u) => [u.id, u])
  ), f = new Map(
    n.map((u) => [u.id, u])
  );
  for (const u of n) {
    const N = i.get(u.id);
    if (p(N))
      if (!t(N))
        c.push(u);
      else {
        const L = Re(
          N,
          r
        ), U = Re(
          u,
          r
        );
        G(L, U) || o.push(u);
      }
    else
      s.push(u);
  }
  const l = e.filter((u) => t(u)).filter((u) => !f.has(u.id)).map((u) => u.id);
  return {
    toCreate: s,
    toUpdate: o,
    toRestoreAndUpdate: c,
    idsToRemove: l
  };
}, Kt = (e) => /^\d{4}-\d{2}-\d{2}$/.test(e), Jt = (e, n) => T.PlainDate.compare(e, n) === 1, Qt = (e, n) => T.PlainDate.compare(e, n) === -1, zt = (e, n) => T.PlainDate.compare(e, n) <= 0, Vt = (e, n) => e.month === n.month && e.year === n.year, Xt = (e) => e.dayOfWeek > 5, Zt = (e, n) => T.PlainDate.compare(e, n) === 0, Ft = (e) => {
  try {
    return T.Instant.from(e).toZonedDateTimeISO("UTC").toPlainDate();
  } catch {
  }
  try {
    return T.PlainDate.from(e);
  } catch {
  }
  throw new Error(`Cannot parse date string as PlainDate : "${e}"`);
}, es = (e) => (n, r) => {
  const t = T.PlainDate.compare(n, r);
  return t === 0 ? 0 : e === "asc" ? t : -t;
}, ns = (e) => T.PlainDate.from({
  day: e.getDate(),
  month: e.getMonth() + 1,
  year: e.getFullYear()
}), rs = (e, n) => e.toZonedDateTime(n).toInstant().toString(), ts = (e) => {
  const n = Intl.DateTimeFormat().resolvedOptions().timeZone, r = e.toZonedDateTime(n).toInstant().toString();
  return new Date(r);
}, Hn = (e, n) => {
  if (!e) return n;
  if (!n) return e;
  const r = { ...e };
  return Object.keys(n).forEach((t) => {
    const s = e[t], o = n[t];
    if (o !== void 0) {
      if (o === null) {
        r[t] = null;
        return;
      }
      if (Array.isArray(s) && Array.isArray(o)) {
        r[t] = [...s, ...o];
        return;
      }
      if (o instanceof Date || o instanceof RegExp || s instanceof Date || s instanceof RegExp) {
        r[t] = o;
        return;
      }
      if (s && o && typeof s == "object" && typeof o == "object" && !Array.isArray(s) && !Array.isArray(o)) {
        r[t] = Hn(
          s,
          o
        );
        return;
      }
      r[t] = o;
    }
  }), r;
};
class C extends Error {
  constructor(n, r) {
    super(n), this.code = r;
  }
}
const se = (e, n) => {
  try {
    me.registerHelper("json", (s) => JSON.stringify(s));
    const r = e.replace("{{", "{{{ json ").replace("}}", " }}}"), t = me.compile(r)(n, {
      helpers: {
        json: (s) => JSON.stringify(s)
      }
    });
    return JSON.parse(t);
  } catch {
    return;
  }
}, Mn = /\s+/g, ze = (e) => e.trim().replace(Mn, " "), ss = (e, n, r = 10) => {
  const t = (s, o) => {
    if (s !== void 0) {
      if (s === null)
        return null;
      if (o >= r)
        return s;
      if (Array.isArray(s))
        return s.map((c) => t(c, o));
      if (typeof s == "object") {
        const c = s;
        return Object.keys(c).reduce(
          (f, l) => ({
            ...f,
            [l]: t(c[l], o + 1)
          }),
          {}
        );
      }
      return typeof s == "string" ? ze(s) : s;
    }
  };
  return n.reduce((s, o) => {
    const c = t(e[o], 0);
    return c === void 0 ? s : {
      ...s,
      [o]: c
    };
  }, {});
}, Wn = "(Copy)", Gn = "(copy)", as = (e) => !S(e) || e.toLowerCase().endsWith(Gn) ? e : `${e} ${Wn}`, os = (e) => e.replace(/-([a-z])/g, (n, r) => r.toUpperCase()), V = (e) => K(Rn(e)), is = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase(), Bn = ({
  fieldName: e,
  relationType: n,
  targetObjectMetadataNameSingular: r,
  targetObjectMetadataNamePlural: t
}) => {
  if (n === "MANY_TO_ONE")
    return `${e}${K(r)}`;
  if (n === "ONE_TO_MANY")
    return `${e}${K(t)}`;
  throw new C(
    `Invalid relation type (${n}) for field ${e} on ${r}`,
    "INVALID_RELATION_TYPE_FOR_COMPUTE_MORPH_RELATION_GQL_FIELD_NAME"
  );
}, jn = ({
  name: e
}) => `${e}Id`, cs = ({
  fieldName: e,
  relationType: n,
  targetObjectMetadataNameSingular: r,
  targetObjectMetadataNamePlural: t
}) => {
  const s = Bn({
    fieldName: e,
    relationType: n,
    targetObjectMetadataNameSingular: r,
    targetObjectMetadataNamePlural: t
  });
  return jn({ name: s });
}, us = (e) => e === E.MULTI_SELECT || e === E.ARRAY, ls = (e) => e === E.DATE || e === E.DATE_TIME, fs = ({
  fieldName: e,
  fieldType: n,
  isLabelIdentifierField: r
}) => !(e === "deletedAt" || n === E.TS_VECTOR || n === E.POSITION || e === "id" && !r || r), Kn = [
  E.NUMBER,
  E.NUMERIC,
  E.CURRENCY,
  E.RATING,
  E.POSITION
], Es = (e) => Kn.includes(e), ps = (e) => e === E.SELECT || e === E.MULTI_SELECT, Jn = [
  E.TEXT,
  E.RICH_TEXT
], Ns = (e) => Jn.includes(e), Ss = (e) => {
  if (!S(e))
    throw new Error("Invalid fullPath provided");
  const n = e.split("/"), r = n.pop() || "", t = n.join("/"), s = r.lastIndexOf("."), o = s !== -1 ? r.slice(s + 1) : "";
  return { folderPath: t, filename: r, type: o };
}, Qn = (e) => [
  a.IS_EMPTY,
  a.IS_NOT_EMPTY
].includes(e), Ee = (e) => {
  switch (e) {
    case E.DATE_TIME:
      return "DATE_TIME";
    case E.DATE:
      return "DATE";
    case E.LINKS:
      return "LINKS";
    case E.FULL_NAME:
      return "FULL_NAME";
    case E.NUMBER:
      return "NUMBER";
    case E.CURRENCY:
      return "CURRENCY";
    case E.EMAILS:
      return "EMAILS";
    case E.PHONES:
      return "PHONES";
    case E.RELATION:
      return "RELATION";
    case E.SELECT:
      return "SELECT";
    case E.MULTI_SELECT:
      return "MULTI_SELECT";
    case E.ADDRESS:
      return "ADDRESS";
    case E.RATING:
      return "RATING";
    case E.ACTOR:
      return "ACTOR";
    case E.ARRAY:
      return "ARRAY";
    case E.RAW_JSON:
      return "RAW_JSON";
    case E.FILES:
      return "FILES";
    case E.BOOLEAN:
      return "BOOLEAN";
    case E.TS_VECTOR:
      return "TS_VECTOR";
    case E.UUID:
      return "UUID";
    default:
      return "TEXT";
  }
}, zn = ({
  recordFilterOperand: e,
  correspondingFieldMetadataItem: n
}) => {
  if (!Qn(e))
    return !1;
  const t = ["BOOLEAN", "TS_VECTOR"], s = Ee(
    n.type
  );
  return !t.includes(s) === !0;
}, Vn = ({
  recordFilter: e,
  correspondingFieldMetadataItem: n,
  subFieldName: r
}) => {
  if (S(r))
    switch (r) {
      case "primaryEmail":
        switch (e.operand) {
          case a.CONTAINS:
            return {
              [n.name]: {
                primaryEmail: {
                  ilike: `%${e.value}%`
                }
              }
            };
          case a.DOES_NOT_CONTAIN:
            return {
              not: {
                [n.name]: {
                  primaryEmail: {
                    ilike: `%${e.value}%`
                  }
                }
              }
            };
          default:
            throw new Error(
              `Unknown operand ${e.operand} for ${n.type} filter`
            );
        }
      case "additionalEmails":
        switch (e.operand) {
          case a.CONTAINS:
            return {
              [n.name]: {
                additionalEmails: {
                  like: `%${e.value}%`
                }
              }
            };
          case a.DOES_NOT_CONTAIN:
            return {
              or: [
                {
                  not: {
                    [n.name]: {
                      additionalEmails: {
                        like: `%${e.value}%`
                      }
                    }
                  }
                },
                {
                  [n.name]: {
                    additionalEmails: {
                      is: "NULL"
                    }
                  }
                }
              ]
            };
          default:
            throw new C(
              `Unknown operand ${e.operand} for ${n.type} filter`,
              "UNKNOWN_OPERAND_FOR_FILTER"
            );
        }
      default:
        throw new C(
          `Unknown subfield name ${r}`,
          "UNKNOWN_SUBFIELD_NAME"
        );
    }
  switch (e.operand) {
    case a.CONTAINS:
      return {
        or: [
          {
            [n.name]: {
              primaryEmail: {
                ilike: `%${e.value}%`
              }
            }
          },
          {
            [n.name]: {
              additionalEmails: {
                like: `%${e.value}%`
              }
            }
          }
        ]
      };
    case a.DOES_NOT_CONTAIN:
      return {
        and: [
          {
            not: {
              [n.name]: {
                primaryEmail: {
                  ilike: `%${e.value}%`
                }
              }
            }
          },
          {
            or: [
              {
                not: {
                  [n.name]: {
                    additionalEmails: {
                      like: `%${e.value}%`
                    }
                  }
                }
              },
              {
                [n.name]: {
                  additionalEmails: {
                    is: "NULL"
                  }
                }
              }
            ]
          }
        ]
      };
    default:
      throw new Error(
        `Unknown operand ${e.operand} for ${n.type} filter`
      );
  }
}, Xn = ({
  recordFilter: e,
  correspondingFieldMetadataItem: n,
  subFieldName: r
}) => {
  if (S(r))
    switch (r) {
      case "primaryLinkLabel":
      case "primaryLinkUrl":
        switch (e.operand) {
          case a.CONTAINS:
            return {
              [n.name]: {
                [r]: {
                  ilike: `%${e.value}%`
                }
              }
            };
          case a.DOES_NOT_CONTAIN:
            return {
              not: {
                [n.name]: {
                  [r]: {
                    ilike: `%${e.value}%`
                  }
                }
              }
            };
          default:
            throw new C(
              `Unknown operand ${e.operand} for ${n.type} filter`,
              "UNKNOWN_OPERAND_FOR_FILTER"
            );
        }
      case "secondaryLinks":
        switch (e.operand) {
          case a.CONTAINS:
            return {
              [n.name]: {
                secondaryLinks: {
                  like: `%${e.value}%`
                }
              }
            };
          case a.DOES_NOT_CONTAIN:
            return {
              or: [
                {
                  not: {
                    [n.name]: {
                      secondaryLinks: {
                        like: `%${e.value}%`
                      }
                    }
                  }
                },
                {
                  [n.name]: {
                    secondaryLinks: {
                      is: "NULL"
                    }
                  }
                }
              ]
            };
          default:
            throw new Error(
              `Unknown operand ${e.operand} for ${n.type} filter`
            );
        }
      default:
        throw new Error(
          // TODO
          `Unknown subfield name ${r}`
          // 'UNKNOWN_SUBFIELD_NAME',
        );
    }
  switch (e.operand) {
    case a.CONTAINS:
      return {
        or: [
          {
            [n.name]: {
              primaryLinkUrl: {
                ilike: `%${e.value}%`
              }
            }
          },
          {
            [n.name]: {
              primaryLinkLabel: {
                ilike: `%${e.value}%`
              }
            }
          },
          {
            [n.name]: {
              secondaryLinks: {
                like: `%${e.value}%`
              }
            }
          }
        ]
      };
    case a.DOES_NOT_CONTAIN:
      return {
        and: [
          {
            not: {
              [n.name]: {
                primaryLinkLabel: {
                  ilike: `%${e.value}%`
                }
              }
            }
          },
          {
            not: {
              [n.name]: {
                primaryLinkUrl: {
                  ilike: `%${e.value}%`
                }
              }
            }
          },
          {
            or: [
              {
                not: {
                  [n.name]: {
                    secondaryLinks: {
                      like: `%${e.value}%`
                    }
                  }
                }
              },
              {
                [n.name]: {
                  secondaryLinks: {
                    is: "NULL"
                  }
                }
              }
            ]
          }
        ]
      };
    default:
      throw new Error(
        `Unknown operand ${e.operand} for ${n.type} filter`
      );
  }
}, Zn = ({
  recordFilter: e,
  correspondingFieldMetadataItem: n
}) => {
  const r = e.subFieldName;
  if (S(r))
    switch (r) {
      case "primaryEmail":
        return {
          or: [
            {
              [n.name]: {
                primaryEmail: { eq: "" }
              }
            },
            {
              [n.name]: {
                primaryEmail: { is: "NULL" }
              }
            }
          ]
        };
      case "additionalEmails":
        return {
          or: [
            {
              [n.name]: {
                additionalEmails: { is: "NULL" }
              }
            },
            {
              [n.name]: {
                additionalEmails: { like: "[]" }
              }
            }
          ]
        };
      default:
        throw new C(
          `Unknown subfield name ${r}`,
          "UNKNOWN_SUBFIELD_NAME"
        );
    }
  return {
    and: [
      {
        or: [
          {
            [n.name]: {
              primaryEmail: { eq: "" }
            }
          },
          {
            [n.name]: {
              primaryEmail: { is: "NULL" }
            }
          }
        ]
      },
      {
        or: [
          {
            [n.name]: {
              additionalEmails: { is: "NULL" }
            }
          },
          {
            [n.name]: {
              additionalEmails: { like: "[]" }
            }
          }
        ]
      }
    ]
  };
}, Fn = ({
  recordFilter: e,
  correspondingFieldMetadataItem: n
}) => {
  const r = e.subFieldName;
  if (S(r))
    switch (r) {
      case "primaryLinkLabel":
        return {
          or: [
            {
              [n.name]: {
                primaryLinkLabel: { eq: "" }
              }
            },
            {
              [n.name]: {
                primaryLinkLabel: { is: "NULL" }
              }
            }
          ]
        };
      case "primaryLinkUrl":
        return {
          or: [
            {
              [n.name]: {
                primaryLinkUrl: { eq: "" }
              }
            },
            {
              [n.name]: {
                primaryLinkUrl: { is: "NULL" }
              }
            }
          ]
        };
      case "secondaryLinks":
        return {
          or: [
            {
              [n.name]: {
                secondaryLinks: { is: "NULL" }
              }
            },
            {
              [n.name]: {
                secondaryLinks: { like: "[]" }
              }
            }
          ]
        };
      default:
        throw new C(
          `Unknown subfield name ${r}`,
          "UNKNOWN_SUBFIELD_NAME"
        );
    }
  return {
    and: [
      {
        or: [
          {
            [n.name]: {
              primaryLinkLabel: { eq: "" }
            }
          },
          {
            [n.name]: {
              primaryLinkLabel: { is: "NULL" }
            }
          }
        ]
      },
      {
        or: [
          {
            [n.name]: {
              primaryLinkUrl: { eq: "" }
            }
          },
          {
            [n.name]: {
              primaryLinkUrl: { is: "NULL" }
            }
          }
        ]
      },
      {
        or: [
          {
            [n.name]: {
              secondaryLinks: { is: "NULL" }
            }
          },
          {
            [n.name]: {
              secondaryLinks: { like: "[]" }
            }
          }
        ]
      }
    ]
  };
}, er = (e) => {
  switch (e) {
    case a.IS_NOT_NULL:
    case a.IS_EMPTY:
    case a.IS_NOT_EMPTY:
    case a.IS_IN_PAST:
    case a.IS_IN_FUTURE:
    case a.IS_TODAY:
      return !1;
    default:
      return !0;
  }
}, Ve = (e) => er(e.operand) ? p(e.value) && e.value !== "" && e.value !== "[]" : !0, Os = (e) => e.filter(Ve), w = ({
  filterValue: e,
  fieldMetadataItem: n
}) => ({
  id: yn(),
  value: e,
  fieldMetadataId: n.id
}), nr = Object.entries(
  On
).map(([e, { label: n }]) => ({
  value: e,
  label: `${n} (${e})`
})), ms = ({
  filterValue: e,
  fields: n
}) => {
  const r = [], t = A.coerce.number().safeParse(e).success;
  for (const i of n)
    switch (i.type) {
      case E.TEXT: {
        r.push({
          ...w({
            filterValue: e,
            fieldMetadataItem: i
          }),
          operand: a.CONTAINS,
          type: "TEXT"
        });
        break;
      }
      case E.ADDRESS: {
        r.push({
          ...w({
            filterValue: e,
            fieldMetadataItem: i
          }),
          operand: a.CONTAINS,
          type: "ADDRESS"
        });
        break;
      }
      case E.LINKS: {
        r.push({
          ...w({
            filterValue: e,
            fieldMetadataItem: i
          }),
          operand: a.CONTAINS,
          type: "LINKS"
        });
        break;
      }
      case E.FULL_NAME: {
        r.push({
          ...w({
            filterValue: e,
            fieldMetadataItem: i
          }),
          operand: a.CONTAINS,
          type: "FULL_NAME"
        });
        break;
      }
      case E.ARRAY: {
        r.push({
          ...w({
            filterValue: e,
            fieldMetadataItem: i
          }),
          operand: a.CONTAINS,
          type: "ARRAY"
        });
        break;
      }
      case E.EMAILS: {
        r.push({
          ...w({
            filterValue: e,
            fieldMetadataItem: i
          }),
          operand: a.CONTAINS,
          type: "EMAILS"
        });
        break;
      }
      case E.PHONES: {
        r.push({
          ...w({
            filterValue: e,
            fieldMetadataItem: i
          }),
          operand: a.CONTAINS,
          type: "PHONES"
        });
        break;
      }
      case E.NUMBER: {
        t && r.push({
          ...w({
            filterValue: e,
            fieldMetadataItem: i
          }),
          operand: a.IS,
          type: "NUMBER"
        });
        break;
      }
      case E.CURRENCY: {
        if (t && r.push({
          ...w({
            filterValue: e,
            fieldMetadataItem: i
          }),
          operand: a.IS,
          type: "CURRENCY"
        }), S(e)) {
          const f = nr.filter(
            (l) => l.label.includes(e) || l.value.includes(e)
          );
          if (F(f)) {
            const l = JSON.stringify(
              f.map((u) => u.value)
            );
            r.push({
              ...w({
                filterValue: l,
                fieldMetadataItem: i
              }),
              operand: a.IS,
              type: "CURRENCY",
              subFieldName: "currencyCode"
            });
          }
        }
        break;
      }
      case E.SELECT: {
        if (S(e)) {
          const { foundCorrespondingSelectOptions: f } = Pe({
            fieldMetadataItem: i,
            filterValue: e
          });
          if (F(f)) {
            const l = JSON.stringify(
              f.map(
                (u) => u.value
              )
            );
            r.push({
              ...w({
                fieldMetadataItem: i,
                filterValue: l
              }),
              operand: a.IS,
              type: "SELECT"
            });
          }
        }
        break;
      }
      case E.MULTI_SELECT: {
        if (S(e)) {
          const { foundCorrespondingSelectOptions: f } = Pe({
            fieldMetadataItem: i,
            filterValue: e
          });
          if (F(f)) {
            const l = JSON.stringify(
              f.map(
                (u) => u.value
              )
            );
            r.push({
              ...w({
                fieldMetadataItem: i,
                filterValue: l
              }),
              operand: a.CONTAINS,
              type: "MULTI_SELECT"
            });
          }
        }
        break;
      }
    }
  const s = new Map(
    n.map((i) => [i.id, i])
  ), o = r.map(
    (i) => Se({
      filterValueDependencies: {},
      fieldMetadataItemById: s,
      recordFilter: i
    })
  ).filter(p), c = {
    or: o
  };
  return o.length === 0 ? { recordGqlOperationFilter: {} } : {
    recordGqlOperationFilter: c
  };
}, ds = (e) => {
  const n = e.filter(
    (r) => Object.keys(r).length > 0
  );
  return n.length === 0 ? {} : n.length === 1 ? n[0] : {
    and: n
  };
}, rr = (e) => We.filter(
  (n) => +n.split("_")[1] >= e
), tr = (e) => We.filter(
  (n) => +n.split("_")[1] <= e
), _e = (e) => `RATING_${e}`, Xe = (e, n, r, t = !1) => t ? r.map((s) => ({
  or: [
    {
      [n]: {
        [s]: {
          is: "NULL"
        }
      }
    },
    {
      [n]: {
        [s]: {
          ilike: ""
        }
      }
    }
  ]
})) : e.split(" ").reduce((s, o) => [
  ...s,
  ...r.map((c) => ({
    [n]: {
      [c]: {
        ilike: `%${o}%`
      }
    }
  }))
], []), sr = ({
  operand: e,
  correspondingField: n,
  recordFilter: r
}) => {
  let t = {};
  const s = r.subFieldName, o = S(s), c = Ee(n.type);
  switch (c) {
    case "TEXT":
      t = {
        or: [
          { [n.name]: { ilike: "" } },
          { [n.name]: { is: "NULL" } }
        ]
      };
      break;
    case "PHONES": {
      if (!o)
        t = {
          and: [
            {
              or: [
                {
                  [n.name]: {
                    primaryPhoneNumber: { is: "NULL" }
                  }
                },
                {
                  [n.name]: {
                    primaryPhoneNumber: { ilike: "" }
                  }
                }
              ]
            },
            {
              or: [
                {
                  [n.name]: {
                    additionalPhones: { is: "NULL" }
                  }
                },
                {
                  [n.name]: {
                    additionalPhones: { like: "[]" }
                  }
                }
              ]
            }
          ]
        };
      else
        switch (s) {
          case "primaryPhoneNumber":
          case "primaryPhoneCallingCode": {
            t = {
              or: [
                {
                  [n.name]: {
                    [s]: { is: "NULL" }
                  }
                },
                {
                  [n.name]: {
                    [s]: { ilike: "" }
                  }
                }
              ]
            };
            break;
          }
          case "additionalPhones": {
            t = {
              or: [
                {
                  [n.name]: {
                    additionalPhones: { is: "NULL" }
                  }
                },
                {
                  [n.name]: {
                    additionalPhones: { like: "[]" }
                  }
                }
              ]
            };
            break;
          }
          default:
            throw new Error(
              `Unsupported composite field name ${s} for filter type ${c}`
            );
        }
      break;
    }
    case "CURRENCY":
      t = {
        or: [
          {
            [n.name]: {
              amountMicros: { is: "NULL" }
            }
          }
        ]
      };
      break;
    case "FULL_NAME": {
      o ? t = {
        or: [
          {
            [n.name]: {
              [s]: { ilike: "" }
            }
          },
          {
            [n.name]: {
              [s]: { is: "NULL" }
            }
          }
        ]
      } : t = {
        and: Xe(
          "",
          n.name,
          ["firstName", "lastName"],
          !0
        )
      };
      break;
    }
    case "LINKS": {
      t = Fn({
        correspondingFieldMetadataItem: n,
        recordFilter: r
      });
      break;
    }
    case "ADDRESS":
      o ? t = {
        or: [
          {
            [n.name]: {
              [s]: { ilike: "" }
            }
          },
          {
            [n.name]: {
              [s]: { is: "NULL" }
            }
          }
        ]
      } : t = {
        and: [
          {
            or: [
              {
                [n.name]: {
                  addressStreet1: { ilike: "" }
                }
              },
              {
                [n.name]: {
                  addressStreet1: { is: "NULL" }
                }
              }
            ]
          },
          {
            or: [
              {
                [n.name]: {
                  addressStreet2: { ilike: "" }
                }
              },
              {
                [n.name]: {
                  addressStreet2: { is: "NULL" }
                }
              }
            ]
          },
          {
            or: [
              {
                [n.name]: {
                  addressCity: { ilike: "" }
                }
              },
              {
                [n.name]: {
                  addressCity: { is: "NULL" }
                }
              }
            ]
          },
          {
            or: [
              {
                [n.name]: {
                  addressState: { ilike: "" }
                }
              },
              {
                [n.name]: {
                  addressState: { is: "NULL" }
                }
              }
            ]
          },
          {
            or: [
              {
                [n.name]: {
                  addressCountry: { ilike: "" }
                }
              },
              {
                [n.name]: {
                  addressCountry: { is: "NULL" }
                }
              }
            ]
          },
          {
            or: [
              {
                [n.name]: {
                  addressPostcode: { ilike: "" }
                }
              },
              {
                [n.name]: {
                  addressPostcode: { is: "NULL" }
                }
              }
            ]
          }
        ]
      };
      break;
    case "NUMBER":
      t = {
        [n.name]: { is: "NULL" }
      };
      break;
    case "RATING":
      t = {
        [n.name]: { is: "NULL" }
      };
      break;
    case "DATE":
    case "DATE_TIME":
      t = {
        [n.name]: { is: "NULL" }
      };
      break;
    case "SELECT":
      t = {
        [n.name]: { is: "NULL" }
      };
      break;
    case "UUID":
      t = {
        [n.name]: { is: "NULL" }
      };
      break;
    case "MULTI_SELECT":
      t = {
        or: [
          {
            [n.name]: { is: "NULL" }
          },
          {
            [n.name]: {
              isEmptyArray: !0
            }
          }
        ]
      };
      break;
    case "RELATION":
      t = {
        [n.name + "Id"]: { is: "NULL" }
      };
      break;
    case "ACTOR":
      t = {
        or: [
          {
            [n.name]: {
              name: { ilike: "" }
            }
          },
          {
            [n.name]: {
              name: { is: "NULL" }
            }
          }
        ]
      };
      break;
    case "ARRAY":
      t = {
        or: [
          {
            [n.name]: { is: "NULL" }
          },
          {
            [n.name]: { isEmptyArray: !0 }
          }
        ]
      };
      break;
    case "FILES":
    case "RAW_JSON":
      t = {
        or: [
          {
            [n.name]: { is: "NULL" }
          }
        ]
      };
      break;
    case "EMAILS":
      t = Zn({
        correspondingFieldMetadataItem: n,
        recordFilter: r
      });
      break;
    default:
      throw new C(
        `Unsupported empty filter type ${c}`,
        "UNSUPPORTED_EMPTY_FILTER_TYPE"
      );
  }
  switch (e) {
    case a.IS_EMPTY:
      return t;
    case a.IS_NOT_EMPTY:
      return {
        not: t
      };
    default:
      throw new C(
        `Unknown operand ${e} for ${c} filter`,
        "UNKNOWN_OPERAND_FOR_FILTER"
      );
  }
}, Le = [
  a.IS_EMPTY,
  a.IS_NOT_EMPTY
], we = {
  CURRENCY: {
    currencyCode: [
      a.IS,
      a.IS_NOT,
      ...Le
    ],
    amountMicros: [
      a.GREATER_THAN_OR_EQUAL,
      a.LESS_THAN_OR_EQUAL,
      a.IS,
      a.IS_NOT,
      ...Le
    ]
  }
}, m = [
  a.IS_EMPTY,
  a.IS_NOT_EMPTY
], ar = [
  a.IS,
  a.IS_NOT
], or = {
  TEXT: [
    a.CONTAINS,
    a.DOES_NOT_CONTAIN,
    ...m
  ],
  EMAILS: [
    a.CONTAINS,
    a.DOES_NOT_CONTAIN,
    ...m
  ],
  FULL_NAME: [
    a.CONTAINS,
    a.DOES_NOT_CONTAIN,
    ...m
  ],
  ADDRESS: [
    a.CONTAINS,
    a.DOES_NOT_CONTAIN,
    ...m
  ],
  LINKS: [
    a.CONTAINS,
    a.DOES_NOT_CONTAIN,
    ...m
  ],
  PHONES: [
    a.CONTAINS,
    a.DOES_NOT_CONTAIN,
    ...m
  ],
  CURRENCY: [
    a.GREATER_THAN_OR_EQUAL,
    a.LESS_THAN_OR_EQUAL,
    ...m
  ],
  NUMBER: [
    a.IS,
    a.IS_NOT,
    a.GREATER_THAN_OR_EQUAL,
    a.LESS_THAN_OR_EQUAL,
    ...m
  ],
  RAW_JSON: [
    a.CONTAINS,
    a.DOES_NOT_CONTAIN,
    ...m
  ],
  FILES: [
    a.CONTAINS,
    a.DOES_NOT_CONTAIN,
    ...m
  ],
  DATE_TIME: [
    a.IS,
    a.IS_RELATIVE,
    a.IS_IN_PAST,
    a.IS_IN_FUTURE,
    a.IS_TODAY,
    a.IS_BEFORE,
    a.IS_AFTER,
    ...m
  ],
  DATE: [
    a.IS,
    a.IS_RELATIVE,
    a.IS_IN_PAST,
    a.IS_IN_FUTURE,
    a.IS_TODAY,
    a.IS_BEFORE,
    a.IS_AFTER,
    ...m
  ],
  RATING: [
    a.IS,
    a.IS_NOT,
    a.GREATER_THAN_OR_EQUAL,
    a.LESS_THAN_OR_EQUAL,
    ...m
  ],
  RELATION: [...ar, ...m],
  MULTI_SELECT: [
    a.CONTAINS,
    a.DOES_NOT_CONTAIN,
    ...m
  ],
  SELECT: [a.IS, a.IS_NOT, ...m],
  ACTOR: [
    a.CONTAINS,
    a.DOES_NOT_CONTAIN,
    ...m
  ],
  ARRAY: [
    a.CONTAINS,
    a.DOES_NOT_CONTAIN,
    ...m
  ],
  BOOLEAN: [a.IS],
  TS_VECTOR: [a.VECTOR_SEARCH],
  UUID: [a.IS, a.IS_NOT, ...m]
}, ir = [
  a.IS,
  a.IS_NOT,
  a.IS_EMPTY,
  a.IS_NOT_EMPTY
], Ts = ({
  filterType: e,
  subFieldName: n
}) => e === "CURRENCY" ? n === "currencyCode" ? we.CURRENCY.currencyCode : we.CURRENCY.amountMicros : e === "ACTOR" && (n === "source" || n === "workspaceMemberId") ? ir : or[e], Ie = (e, n, r) => Object.values(
  mn[e]
).includes(n) && n === r, As = ({
  arrayFilter: e,
  value: n
}) => {
  switch (!0) {
    case e.is !== void 0:
      return e.is === "NULL" ? n === null : n !== null;
    case e.isEmptyArray !== void 0:
      return Array.isArray(n) && n.length === 0;
    case e.containsIlike !== void 0: {
      const r = e.containsIlike.toLowerCase();
      return Array.isArray(n) && n.some((t) => t.toLowerCase().includes(r));
    }
    default:
      throw new Error(
        `Unexpected value for array filter: ${JSON.stringify(e)}`
      );
  }
}, hs = ({
  booleanFilter: e,
  value: n
}) => {
  if (e.eq !== void 0)
    return n === e.eq;
  if (e.is !== void 0)
    return e.is === "NULL" ? n === null : n !== null;
  throw new Error(
    `Unexpected value for string filter : ${JSON.stringify(e)}`
  );
}, ge = (e, n) => {
  switch (!0) {
    case e?.in !== void 0:
      return S(n) && e.in.includes(n);
    case e?.is !== void 0:
      return e.is === "NULL" ? n === null : n !== null;
    default:
      throw new Error(
        `Unexpected operand for currency code filter : ${JSON.stringify(
          e
        )}`
      );
  }
}, Ue = (e, n) => {
  switch (!0) {
    case e?.eq !== void 0:
      return n === e.eq;
    case e?.neq !== void 0:
      return n !== e.neq;
    case e?.gt !== void 0:
      return p(n) && n > e.gt;
    case e?.gte !== void 0:
      return p(n) && n >= e.gte;
    case e?.lt !== void 0:
      return p(n) && n < e.lt;
    case e?.lte !== void 0:
      return p(n) && n <= e.lte;
    case e?.is !== void 0:
      return e.is === "NULL" ? n === null : n !== null;
    default:
      throw new Error(
        `Unexpected operand for currency amount micros filter : ${JSON.stringify(
          e
        )}`
      );
  }
}, ys = ({
  currencyFilter: e,
  value: n
}) => {
  const r = p(e.currencyCode), t = p(e.amountMicros);
  if (r && t)
    return Ue(
      e.amountMicros,
      n.amountMicros
    ) && ge(
      e.currencyCode,
      n.currencyCode
    );
  if (t)
    return Ue(
      e.amountMicros,
      n.amountMicros
    );
  if (r)
    return ge(
      e.currencyCode,
      n.currencyCode
    );
  throw new Error(
    `Unexpected filter for currency : ${JSON.stringify(e)}`
  );
};
function ae(e) {
  "@babel/helpers - typeof";
  return ae = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, ae(e);
}
function h(e) {
  if (e === null || e === !0 || e === !1)
    return NaN;
  var n = Number(e);
  return isNaN(n) ? n : n < 0 ? Math.ceil(n) : Math.floor(n);
}
function O(e, n) {
  if (n.length < e)
    throw new TypeError(e + " argument" + (e > 1 ? "s" : "") + " required, but only " + n.length + " present");
}
function D(e) {
  O(1, arguments);
  var n = Object.prototype.toString.call(e);
  return e instanceof Date || ae(e) === "object" && n === "[object Date]" ? new Date(e.getTime()) : typeof e == "number" || n === "[object Number]" ? new Date(e) : ((typeof e == "string" || n === "[object String]") && typeof console < "u" && (console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"), console.warn(new Error().stack)), /* @__PURE__ */ new Date(NaN));
}
function pe(e, n) {
  O(2, arguments);
  var r = D(e), t = h(n);
  return isNaN(t) ? /* @__PURE__ */ new Date(NaN) : (t && r.setDate(r.getDate() + t), r);
}
function J(e, n) {
  O(2, arguments);
  var r = D(e), t = h(n);
  if (isNaN(t))
    return /* @__PURE__ */ new Date(NaN);
  if (!t)
    return r;
  var s = r.getDate(), o = new Date(r.getTime());
  o.setMonth(r.getMonth() + t + 1, 0);
  var c = o.getDate();
  return s >= c ? o : (r.setFullYear(o.getFullYear(), o.getMonth(), s), r);
}
function Ne(e, n) {
  O(2, arguments);
  var r = D(e).getTime(), t = h(n);
  return new Date(r + t);
}
var cr = 36e5;
function Ze(e, n) {
  O(2, arguments);
  var r = h(n);
  return Ne(e, r * cr);
}
var ur = 6e4;
function Fe(e, n) {
  O(2, arguments);
  var r = h(n);
  return Ne(e, r * ur);
}
function en(e, n) {
  O(2, arguments);
  var r = h(n);
  return Ne(e, r * 1e3);
}
function nn(e, n) {
  O(2, arguments);
  var r = h(n), t = r * 7;
  return pe(e, t);
}
function rn(e, n) {
  O(2, arguments);
  var r = h(n);
  return J(e, r * 12);
}
var tn = 6e4, sn = 36e5;
function Ce(e, n) {
  O(2, arguments);
  var r = D(e), t = D(n);
  return r.getTime() > t.getTime();
}
function De(e, n) {
  O(2, arguments);
  var r = D(e), t = D(n);
  return r.getTime() < t.getTime();
}
function H(e, n) {
  O(2, arguments);
  var r = D(e), t = D(n);
  return r.getTime() === t.getTime();
}
function lr(e, n) {
  O(2, arguments);
  var r = h(n);
  return pe(e, -r);
}
function I(e, n) {
  var r;
  O(1, arguments);
  var t = h((r = void 0) !== null && r !== void 0 ? r : 2);
  if (t !== 2 && t !== 1 && t !== 0)
    throw new RangeError("additionalDigits must be 0, 1 or 2");
  if (!(typeof e == "string" || Object.prototype.toString.call(e) === "[object String]"))
    return /* @__PURE__ */ new Date(NaN);
  var s = Nr(e), o;
  if (s.date) {
    var c = Sr(s.date, t);
    o = Or(c.restDateString, c.year);
  }
  if (!o || isNaN(o.getTime()))
    return /* @__PURE__ */ new Date(NaN);
  var i = o.getTime(), f = 0, l;
  if (s.time && (f = mr(s.time), isNaN(f)))
    return /* @__PURE__ */ new Date(NaN);
  if (s.timezone) {
    if (l = dr(s.timezone), isNaN(l))
      return /* @__PURE__ */ new Date(NaN);
  } else {
    var u = new Date(i + f), N = /* @__PURE__ */ new Date(0);
    return N.setFullYear(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate()), N.setHours(u.getUTCHours(), u.getUTCMinutes(), u.getUTCSeconds(), u.getUTCMilliseconds()), N;
  }
  return new Date(i + f + l);
}
var M = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/
}, fr = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/, Er = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/, pr = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function Nr(e) {
  var n = {}, r = e.split(M.dateTimeDelimiter), t;
  if (r.length > 2)
    return n;
  if (/:/.test(r[0]) ? t = r[0] : (n.date = r[0], t = r[1], M.timeZoneDelimiter.test(n.date) && (n.date = e.split(M.timeZoneDelimiter)[0], t = e.substr(n.date.length, e.length))), t) {
    var s = M.timezone.exec(t);
    s ? (n.time = t.replace(s[1], ""), n.timezone = s[1]) : n.time = t;
  }
  return n;
}
function Sr(e, n) {
  var r = new RegExp("^(?:(\\d{4}|[+-]\\d{" + (4 + n) + "})|(\\d{2}|[+-]\\d{" + (2 + n) + "})$)"), t = e.match(r);
  if (!t) return {
    year: NaN,
    restDateString: ""
  };
  var s = t[1] ? parseInt(t[1]) : null, o = t[2] ? parseInt(t[2]) : null;
  return {
    year: o === null ? s : o * 100,
    restDateString: e.slice((t[1] || t[2]).length)
  };
}
function Or(e, n) {
  if (n === null) return /* @__PURE__ */ new Date(NaN);
  var r = e.match(fr);
  if (!r) return /* @__PURE__ */ new Date(NaN);
  var t = !!r[4], s = x(r[1]), o = x(r[2]) - 1, c = x(r[3]), i = x(r[4]), f = x(r[5]) - 1;
  if (t)
    return Rr(n, i, f) ? Tr(n, i, f) : /* @__PURE__ */ new Date(NaN);
  var l = /* @__PURE__ */ new Date(0);
  return !hr(n, o, c) || !yr(n, s) ? /* @__PURE__ */ new Date(NaN) : (l.setUTCFullYear(n, o, Math.max(s, c)), l);
}
function x(e) {
  return e ? parseInt(e) : 1;
}
function mr(e) {
  var n = e.match(Er);
  if (!n) return NaN;
  var r = ee(n[1]), t = ee(n[2]), s = ee(n[3]);
  return _r(r, t, s) ? r * sn + t * tn + s * 1e3 : NaN;
}
function ee(e) {
  return e && parseFloat(e.replace(",", ".")) || 0;
}
function dr(e) {
  if (e === "Z") return 0;
  var n = e.match(pr);
  if (!n) return 0;
  var r = n[1] === "+" ? -1 : 1, t = parseInt(n[2]), s = n[3] && parseInt(n[3]) || 0;
  return Lr(t, s) ? r * (t * sn + s * tn) : NaN;
}
function Tr(e, n, r) {
  var t = /* @__PURE__ */ new Date(0);
  t.setUTCFullYear(e, 0, 4);
  var s = t.getUTCDay() || 7, o = (n - 1) * 7 + r + 1 - s;
  return t.setUTCDate(t.getUTCDate() + o), t;
}
var Ar = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function an(e) {
  return e % 400 === 0 || e % 4 === 0 && e % 100 !== 0;
}
function hr(e, n, r) {
  return n >= 0 && n <= 11 && r >= 1 && r <= (Ar[n] || (an(e) ? 29 : 28));
}
function yr(e, n) {
  return n >= 1 && n <= (an(e) ? 366 : 365);
}
function Rr(e, n, r) {
  return n >= 1 && n <= 53 && r >= 0 && r <= 6;
}
function _r(e, n, r) {
  return e === 24 ? n === 0 && r === 0 : r >= 0 && r < 60 && n >= 0 && n < 60 && e >= 0 && e < 25;
}
function Lr(e, n) {
  return n >= 0 && n <= 59;
}
function ve(e, n) {
  O(2, arguments);
  var r = h(n);
  return J(e, -r);
}
function wr(e, n) {
  O(2, arguments);
  var r = h(n);
  return Ze(e, -r);
}
function Ir(e, n) {
  O(2, arguments);
  var r = h(n);
  return Fe(e, -r);
}
function gr(e, n) {
  O(2, arguments);
  var r = h(n);
  return en(e, -r);
}
function Ur(e, n) {
  O(2, arguments);
  var r = h(n);
  return nn(e, -r);
}
function Cr(e, n) {
  O(2, arguments);
  var r = h(n);
  return rn(e, -r);
}
const Rs = ({
  dateFilter: e,
  value: n
}) => {
  switch (!0) {
    case e.eq !== void 0:
      return H(I(n), I(e.eq));
    case e.neq !== void 0:
      return !H(I(n), I(e.neq));
    case e.in !== void 0:
      return e.in.includes(n);
    case e.is !== void 0:
      return e.is === "NULL" ? n === null : n !== null;
    case e.gt !== void 0:
      return Ce(I(n), I(e.gt));
    case e.gte !== void 0: {
      const r = I(n), t = I(e.gte);
      return Ce(r, t) || H(r, t);
    }
    case e.lt !== void 0:
      return De(I(n), I(e.lt));
    case e.lte !== void 0: {
      const r = I(n), t = I(e.lte);
      return De(r, t) || H(r, t);
    }
    default:
      throw new Error(
        `Unexpected value for string filter : ${JSON.stringify(e)}`
      );
  }
}, _s = ({
  filesFilter: e,
  value: n
}) => {
  switch (!0) {
    case e.like !== void 0: {
      const t = e.like.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      ).replace(/%/g, ".*"), s = new RegExp(`^${t}$`, "is"), o = JSON.stringify(n, null, 1);
      return s.test(o);
    }
    case e.is !== void 0:
      return e.is === "NULL" ? n === null || n.length === 0 : n !== null && n.length > 0;
    default:
      throw new Error(
        `Unexpected value for files filter : ${JSON.stringify(e)}`
      );
  }
}, Ls = ({
  floatFilter: e,
  value: n
}) => {
  switch (!0) {
    case e.eq !== void 0:
      return n === e.eq;
    case e.neq !== void 0:
      return n !== e.neq;
    case e.gt !== void 0:
      return n > e.gt;
    case e.gte !== void 0:
      return n >= e.gte;
    case e.lt !== void 0:
      return n < e.lt;
    case e.lte !== void 0:
      return n <= e.lte;
    case e.in !== void 0:
      return e.in.includes(n);
    case e.is !== void 0:
      return e.is === "NULL" ? n === null : n !== null;
    default:
      throw new Error(
        `Unexpected value for float filter : ${JSON.stringify(e)}`
      );
  }
}, ws = ({
  multiSelectFilter: e,
  value: n
}) => {
  switch (!0) {
    case e.containsAny !== void 0:
      return Array.isArray(n) && e.containsAny.every((r) => n.includes(r));
    case e.isEmptyArray !== void 0:
      return Array.isArray(n) && n.length === 0;
    case e.is !== void 0:
      return e.is === "NULL" ? n === null : n !== null;
    default:
      throw new Error(
        `Unexpected value for multi-select filter: ${JSON.stringify(
          e
        )}`
      );
  }
}, Is = ({
  ratingFilter: e,
  value: n
}) => {
  switch (!0) {
    case e.eq !== void 0:
      return n === e.eq;
    case e.in !== void 0:
      return n !== null && e.in.includes(n);
    case e.is !== void 0:
      return e.is === "NULL" ? n === null : n !== null;
    default:
      throw new Error(
        `Unexpected value for rating filter : ${JSON.stringify(e)}`
      );
  }
}, gs = ({
  rawJsonFilter: e,
  value: n
}) => {
  switch (!0) {
    case e.like !== void 0: {
      const r = e.like.replace(/%/g, ".*"), t = new RegExp(`^${r}$`, "is"), s = JSON.stringify(n, null, 1);
      return t.test(s);
    }
    case e.is !== void 0:
      return e.is === "NULL" ? n === null : n !== null;
    default:
      throw new Error(
        `Unexpected value for string filter : ${JSON.stringify(e)}`
      );
  }
}, Us = ({
  richTextFilter: e,
  value: n
}) => {
  if (!0 === (e.markdown !== void 0)) {
    const t = re(e.markdown.ilike).replace(/%/g, ".*");
    return new RegExp(`^${t}$`, "i").test(n);
  } else
    throw new Error(
      `Unexpected value for RICH_TEXT filter : ${JSON.stringify(e)}`
    );
}, Cs = ({
  selectFilter: e,
  value: n
}) => {
  switch (!0) {
    case e.in !== void 0:
      return e.in.includes(n);
    case e.is !== void 0:
      return e.is === "NULL" ? n === null : n !== null;
    case e.eq !== void 0:
      return n === e.eq;
    case e.neq !== void 0:
      return n !== e.neq;
    default:
      throw new Error(
        `Unexpected value for select filter : ${JSON.stringify(e)}`
      );
  }
}, Ds = ({
  stringFilter: e,
  value: n
}) => {
  switch (!0) {
    case e.eq !== void 0:
      return n === e.eq;
    case e.neq !== void 0:
      return n !== e.neq;
    case e.like !== void 0: {
      const t = re(e.like).replace(/%/g, ".*");
      return new RegExp(`^${t}$`).test(n);
    }
    case e.ilike !== void 0: {
      const t = re(e.ilike).replace(/%/g, ".*");
      return new RegExp(`^${t}$`, "i").test(n);
    }
    case e.in !== void 0:
      return e.in.includes(n);
    case e.is !== void 0:
      return e.is === "NULL" ? n === null : n !== null;
    case e.regex !== void 0: {
      const r = e.regex;
      return new RegExp(r).test(n);
    }
    case e.iregex !== void 0: {
      const r = e.iregex;
      return new RegExp(r, "i").test(n);
    }
    case e.startsWith !== void 0:
      return n.startsWith(e.startsWith);
    default:
      throw new Error(
        `Unexpected value for string filter : ${JSON.stringify(e)}`
      );
  }
}, vs = ({
  tsVectorFilter: e,
  value: n
}) => {
  if (n === void 0)
    return !0;
  if (!0 === (e.search !== void 0)) {
    const r = e.search.toLowerCase(), t = n.toLowerCase();
    return r.split(/\s+/).filter(Boolean).every((o) => t.includes(o));
  } else
    throw new Error(
      `Unexpected value for ts_vector filter : ${JSON.stringify(e)}`
    );
}, $s = ({
  uuidFilter: e,
  value: n
}) => {
  switch (!0) {
    case e.eq !== void 0:
      return n === e.eq;
    case e.neq !== void 0:
      return n !== e.neq;
    case e.in !== void 0:
      return e.in.includes(n);
    case e.is !== void 0:
      return e.is === "NULL" ? n === null : n !== null;
    default:
      throw new Error(
        `Unexpected value for string filter : ${JSON.stringify(e)}`
      );
  }
}, W = A.string().transform((e) => e === "" ? [] : oe(e) ? [e] : JSON.parse(e)).refine(
  (e) => Array.isArray(e) && e.every((n) => typeof n == "string"),
  {
    error: "Expected an array of strings"
  }
), ne = A.preprocess(
  (e) => {
    try {
      if (typeof e == "string") {
        if (oe(e))
          return [e];
        try {
          const n = JSON.parse(e);
          return Array.isArray(n) ? n : [n];
        } catch {
          return [e];
        }
      }
      return Array.isArray(e) ? e : [e];
    } catch {
      return [];
    }
  },
  A.array(
    A.string().refine((e) => hn(e) || oe(e), "Must be a valid UUID or a variable with {{ }} syntax")
  )
).catch([]), Dr = A.object({
  isCurrentWorkspaceMemberSelected: A.boolean().optional(),
  isCurrentRecordSelected: A.boolean().optional(),
  selectedRecordIds: A.array(A.string())
}), $e = A.string().transform((e, n) => {
  try {
    return JSON.parse(e);
  } catch (r) {
    return n.addIssue({
      code: "custom",
      message: r.message
    }), A.NEVER;
  }
}).pipe(Dr), Se = ({
  recordFilter: e,
  fieldMetadataItemById: n,
  filterValueDependencies: r
}) => {
  const t = n.get(
    e.fieldMetadataId
  );
  if (p(t) && Ve(e)) {
    if (t.type === E.RELATION && p(e.relationTargetFieldMetadataId)) {
      const s = n.get(
        e.relationTargetFieldMetadataId
      );
      if (!p(s))
        return;
      const o = be({
        recordFilter: {
          ...e,
          fieldMetadataId: s.id,
          relationTargetFieldMetadataId: null
        },
        fieldMetadataItem: s,
        filterValueDependencies: r
      });
      return p(o) ? {
        [t.name]: o
      } : void 0;
    }
    return be({
      recordFilter: e,
      fieldMetadataItem: t,
      filterValueDependencies: r
    });
  }
}, be = ({
  recordFilter: e,
  fieldMetadataItem: n,
  filterValueDependencies: r
}) => {
  if (zn({
    recordFilterOperand: e.operand,
    correspondingFieldMetadataItem: n
  }))
    return sr({
      operand: e.operand,
      correspondingField: n,
      recordFilter: e
    });
  const s = e.subFieldName, o = S(s), c = Ee(n.type);
  switch (c) {
    case "TEXT":
      switch (e.operand) {
        case a.CONTAINS:
          return {
            [n.name]: {
              ilike: `%${e.value}%`
            }
          };
        case a.DOES_NOT_CONTAIN:
          return {
            not: {
              [n.name]: {
                ilike: `%${e.value}%`
              }
            }
          };
        default:
          throw new C(
            `Unknown operand ${e.operand} for ${c} filter`,
            "UNKNOWN_OPERAND_FOR_FILTER"
          );
      }
    case "TS_VECTOR":
      if (e.operand === a.VECTOR_SEARCH)
        return {
          [n.name]: {
            search: e.value
          }
        };
      throw new Error(
        `Unknown operand ${e.operand} for ${c} filter`
      );
    case "RAW_JSON":
      switch (e.operand) {
        case a.CONTAINS:
          return {
            [n.name]: {
              like: `%${e.value}%`
            }
          };
        case a.DOES_NOT_CONTAIN:
          return {
            not: {
              [n.name]: {
                like: `%${e.value}%`
              }
            }
          };
        default:
          throw new Error(
            `Unknown operand ${e.operand} for ${c} filter`
          );
      }
    case "FILES":
      switch (e.operand) {
        case a.CONTAINS:
          return {
            [n.name]: {
              like: `%${e.value}%`
            }
          };
        case a.DOES_NOT_CONTAIN:
          return {
            not: {
              [n.name]: {
                like: `%${e.value}%`
              }
            }
          };
        default:
          throw new Error(
            `Unknown operand ${e.operand} for ${c} filter`
          );
      }
    case "DATE": {
      if (e.operand === a.IS_RELATIVE) {
        const l = ln(
          e.value
        ), u = Hr({
          value: "PAST_1_DAY",
          operand: a.IS_RELATIVE
        });
        if (!u)
          throw new Error("Failed to resolve default date range");
        const N = l?.start?.toString() ?? u.start, L = l?.end?.toString() ?? u.end;
        return {
          and: [
            {
              [n.name]: {
                gte: N
              }
            },
            {
              [n.name]: {
                lt: L
              }
            }
          ]
        };
      }
      if (e.operand === a.IS_TODAY || e.operand === a.IS_IN_PAST || e.operand === a.IS_IN_FUTURE) {
        const l = T.Now.plainDateISO(
          r.timeZone
        ).toString();
        switch (e.operand) {
          case a.IS_IN_PAST:
            return {
              [n.name]: {
                lt: l
              }
            };
          case a.IS_IN_FUTURE:
            return {
              [n.name]: {
                gte: l
              }
            };
          case a.IS_TODAY:
            return {
              [n.name]: {
                eq: l
              }
            };
        }
      } else {
        const l = e.value;
        switch (e.operand) {
          case a.IS_AFTER:
            return {
              [n.name]: {
                gte: l
              }
            };
          case a.IS_BEFORE:
            return {
              [n.name]: {
                lt: l
              }
            };
          case a.IS:
            return {
              [n.name]: {
                eq: l
              }
            };
        }
      }
      throw new Error(
        `Unknown operand ${e.operand} for ${c} filter`
      );
    }
    case "DATE_TIME": {
      if (e.operand === a.IS_RELATIVE) {
        const l = ke(e), u = p(l) && typeof l == "object" ? l : null;
        if (!p(u))
          throw new Error(
            `Cannot parse relative date filter : "${e.value}"`
          );
        const N = ke({
          value: `PAST_1_DAY;;${r.timeZone}`,
          operand: a.IS_RELATIVE
        });
        if (!p(N?.start) || !p(N?.end))
          throw new Error("Failed to resolve default date range");
        const L = u?.start ?? N.start, U = u?.end ?? N.end;
        return {
          and: [
            {
              [n.name]: {
                gte: L.toInstant().toString()
              }
            },
            {
              [n.name]: {
                lt: U.toInstant().toString()
              }
            }
          ]
        };
      }
      if (e.operand === a.IS_TODAY || e.operand === a.IS_IN_PAST || e.operand === a.IS_IN_FUTURE) {
        const l = T.Now.zonedDateTimeISO(
          r.timeZone
        );
        switch (e.operand) {
          case a.IS_IN_PAST:
            return {
              [n.name]: {
                lt: l.toInstant().round("minute").toString()
              }
            };
          case a.IS_IN_FUTURE:
            return {
              [n.name]: {
                gt: l.toInstant().round("minute").toString()
              }
            };
          case a.IS_TODAY:
            return {
              and: [
                {
                  [n.name]: {
                    gte: _(l, "DAY").toInstant().toString()
                  }
                },
                {
                  [n.name]: {
                    lt: Q(l, "DAY").toInstant().toString()
                  }
                }
              ]
            };
        }
      } else {
        if (!S(e.value))
          throw new Error("Date filter is empty");
        if (e.operand === a.IS) {
          const u = r.timeZone ?? "UTC";
          let N = null;
          try {
            N = e.value.includes("T") ? T.Instant.from(e.value).toZonedDateTimeISO(u).toPlainDate() : T.PlainDate.from(e.value);
          } catch {
            throw new Error(
              `Cannot parse "${e.value}" for ${c} filter`
            );
          }
          const L = N.toZonedDateTime(u), U = L.toInstant(), X = L.add({ days: 1 }).toInstant();
          return {
            and: [
              {
                [n.name]: {
                  gte: U.toString()
                }
              },
              {
                [n.name]: {
                  lt: X.toString()
                }
              }
            ]
          };
        }
        const l = T.Instant.from(e.value);
        switch (e.operand) {
          case a.IS_AFTER:
            return {
              [n.name]: {
                gte: l.toString()
              }
            };
          case a.IS_BEFORE:
            return {
              [n.name]: {
                lt: l.toString()
              }
            };
        }
      }
      throw new Error(
        `Unknown operand ${e.operand} for ${c} filter`
      );
    }
    case "RATING":
      switch (e.operand) {
        case a.IS:
          return {
            [n.name]: {
              eq: _e(parseFloat(e.value))
            }
          };
        case a.IS_NOT:
          return {
            not: {
              [n.name]: {
                eq: _e(parseFloat(e.value))
              }
            }
          };
        case a.GREATER_THAN_OR_EQUAL:
          return {
            [n.name]: {
              in: rr(
                parseFloat(e.value)
              )
            }
          };
        case a.LESS_THAN_OR_EQUAL:
          return {
            [n.name]: {
              in: tr(
                parseFloat(e.value)
              )
            }
          };
        default:
          throw new Error(
            `Unknown operand ${e.operand} for ${c} filter`
          );
      }
    case "NUMBER":
      switch (e.operand) {
        case a.GREATER_THAN_OR_EQUAL:
          return {
            [n.name]: {
              gte: parseFloat(e.value)
            }
          };
        case a.LESS_THAN_OR_EQUAL:
          return {
            [n.name]: {
              lte: parseFloat(e.value)
            }
          };
        case a.IS:
          return {
            [n.name]: {
              eq: parseFloat(e.value)
            }
          };
        case a.IS_NOT:
          return {
            not: {
              [n.name]: {
                eq: parseFloat(e.value)
              }
            }
          };
        default:
          throw new Error(
            `Unknown operand ${e.operand} for ${c} filter`
          );
      }
    case "RELATION": {
      const {
        isCurrentWorkspaceMemberSelected: i,
        isCurrentRecordSelected: f,
        selectedRecordIds: l
      } = $e.catch({
        isCurrentWorkspaceMemberSelected: !1,
        isCurrentRecordSelected: !1,
        selectedRecordIds: ne.parse(
          e.value
        )
      }).parse(e.value), u = [
        ...l,
        ...i ? [r?.currentWorkspaceMemberId] : [],
        ...f ? [r?.currentRecordId] : []
      ].filter(p);
      if (u.length === 0) return;
      switch (e.operand) {
        case a.IS:
          return {
            [n.name + "Id"]: {
              in: u
            }
          };
        case a.IS_NOT:
          return !p(u) || u.length === 0 ? void 0 : {
            or: [
              {
                not: {
                  [n.name + "Id"]: {
                    in: u
                  }
                }
              },
              {
                [n.name + "Id"]: {
                  is: "NULL"
                }
              }
            ]
          };
        default:
          throw new Error(
            `Unknown operand ${e.operand} for ${c} filter`
          );
      }
    }
    case "CURRENCY":
      if (Ie(
        E.CURRENCY,
        "currencyCode",
        s
      )) {
        const i = W.parse(
          e.value
        );
        if (i.length === 0) return;
        const f = {
          [n.name]: {
            currencyCode: { in: i }
          }
        };
        switch (e.operand) {
          case a.IS:
            return f;
          case a.IS_NOT:
            return {
              not: f
            };
          default:
            throw new Error(
              `Unknown operand ${e.operand} for ${c} / ${s} filter`
            );
        }
      } else if (Ie(
        E.CURRENCY,
        "amountMicros",
        s
      ) || !o)
        switch (e.operand) {
          case a.GREATER_THAN_OR_EQUAL:
            return {
              [n.name]: {
                amountMicros: { gte: parseFloat(e.value) * 1e6 }
              }
            };
          case a.LESS_THAN_OR_EQUAL:
            return {
              [n.name]: {
                amountMicros: { lte: parseFloat(e.value) * 1e6 }
              }
            };
          case a.IS:
            return {
              [n.name]: {
                amountMicros: { eq: parseFloat(e.value) * 1e6 }
              }
            };
          case a.IS_NOT:
            return {
              not: {
                [n.name]: {
                  amountMicros: {
                    eq: parseFloat(e.value) * 1e6
                  }
                }
              }
            };
          default:
            throw new Error(
              `Unknown operand ${e.operand} for ${c} / ${s}  filter`
            );
        }
      else
        throw new Error(
          `Unknown subfield ${s} for ${c} filter`
        );
    case "LINKS":
      return Xn({
        correspondingFieldMetadataItem: n,
        recordFilter: e,
        subFieldName: s
      });
    case "FULL_NAME": {
      const i = Xe(
        e.value,
        n.name,
        ["firstName", "lastName"]
      );
      switch (e.operand) {
        case a.CONTAINS:
          return o ? {
            [n.name]: {
              [s]: {
                ilike: `%${e.value}%`
              }
            }
          } : {
            or: i
          };
        case a.DOES_NOT_CONTAIN:
          return o ? {
            not: {
              [n.name]: {
                [s]: {
                  ilike: `%${e.value}%`
                }
              }
            }
          } : {
            and: i.map((f) => ({
              not: f
            }))
          };
        default:
          throw new Error(
            `Unknown operand ${e.operand} for ${c} filter`
          );
      }
    }
    case "ADDRESS":
      switch (e.operand) {
        case a.CONTAINS:
          if (o) {
            if (s === "addressCountry") {
              const i = W.parse(
                e.value
              );
              return i.length === 0 ? {} : {
                [n.name]: {
                  [s]: {
                    in: i
                  }
                }
              };
            }
            return {
              [n.name]: {
                [s]: {
                  ilike: `%${e.value}%`
                }
              }
            };
          } else
            return {
              or: [
                {
                  [n.name]: {
                    addressStreet1: {
                      ilike: `%${e.value}%`
                    }
                  }
                },
                {
                  [n.name]: {
                    addressStreet2: {
                      ilike: `%${e.value}%`
                    }
                  }
                },
                {
                  [n.name]: {
                    addressCity: {
                      ilike: `%${e.value}%`
                    }
                  }
                },
                {
                  [n.name]: {
                    addressState: {
                      ilike: `%${e.value}%`
                    }
                  }
                },
                {
                  [n.name]: {
                    addressCountry: {
                      ilike: `%${e.value}%`
                    }
                  }
                },
                {
                  [n.name]: {
                    addressPostcode: {
                      ilike: `%${e.value}%`
                    }
                  }
                }
              ]
            };
        case a.DOES_NOT_CONTAIN:
          if (o) {
            if (s === "addressCountry") {
              const i = JSON.parse(
                e.value
              );
              return e.value === "[]" || i.length === 0 ? {} : {
                or: [
                  {
                    not: {
                      [n.name]: {
                        addressCountry: {
                          in: JSON.parse(e.value)
                        }
                      }
                    }
                  },
                  {
                    [n.name]: {
                      addressCountry: {
                        is: "NULL"
                      }
                    }
                  }
                ]
              };
            }
            return {
              or: [
                {
                  not: {
                    [n.name]: {
                      [s]: {
                        ilike: `%${e.value}%`
                      }
                    }
                  }
                },
                {
                  [n.name]: {
                    [s]: {
                      is: "NULL"
                    }
                  }
                }
              ]
            };
          } else
            return {
              and: [
                {
                  or: [
                    {
                      not: {
                        [n.name]: {
                          addressStreet1: {
                            ilike: `%${e.value}%`
                          }
                        }
                      }
                    },
                    {
                      [n.name]: {
                        addressStreet1: {
                          is: "NULL"
                        }
                      }
                    }
                  ]
                },
                {
                  or: [
                    {
                      not: {
                        [n.name]: {
                          addressStreet2: {
                            ilike: `%${e.value}%`
                          }
                        }
                      }
                    },
                    {
                      [n.name]: {
                        addressStreet2: {
                          is: "NULL"
                        }
                      }
                    }
                  ]
                },
                {
                  or: [
                    {
                      not: {
                        [n.name]: {
                          addressCity: {
                            ilike: `%${e.value}%`
                          }
                        }
                      }
                    },
                    {
                      [n.name]: {
                        addressCity: {
                          is: "NULL"
                        }
                      }
                    }
                  ]
                },
                {
                  or: [
                    {
                      not: {
                        [n.name]: {
                          addressState: {
                            ilike: `%${e.value}%`
                          }
                        }
                      }
                    },
                    {
                      [n.name]: {
                        addressState: {
                          is: "NULL"
                        }
                      }
                    }
                  ]
                },
                {
                  or: [
                    {
                      not: {
                        [n.name]: {
                          addressPostcode: {
                            ilike: `%${e.value}%`
                          }
                        }
                      }
                    },
                    {
                      [n.name]: {
                        addressPostcode: {
                          is: "NULL"
                        }
                      }
                    }
                  ]
                },
                {
                  or: [
                    {
                      not: {
                        [n.name]: {
                          addressCountry: {
                            ilike: `%${e.value}%`
                          }
                        }
                      }
                    },
                    {
                      [n.name]: {
                        addressCountry: {
                          is: "NULL"
                        }
                      }
                    }
                  ]
                }
              ]
            };
        default:
          throw new Error(
            `Unknown operand ${e.operand} for ${c} filter`
          );
      }
    case "MULTI_SELECT": {
      const i = W.parse(e.value);
      if (i.length === 0) return;
      const f = i.filter((u) => u === ""), l = i.filter((u) => u !== "");
      switch (e.operand) {
        case a.CONTAINS: {
          const u = [];
          return l.length > 0 && u.push({
            [n.name]: {
              containsAny: l
            }
          }), f.length > 0 && u.push({
            [n.name]: {
              isEmptyArray: !0
            }
          }), u.length === 1 ? u[0] : { or: u };
        }
        case a.DOES_NOT_CONTAIN:
          return {
            or: [
              {
                not: {
                  [n.name]: {
                    containsAny: l
                  }
                }
              },
              {
                [n.name]: {
                  isEmptyArray: !0
                }
              },
              {
                [n.name]: {
                  is: "NULL"
                }
              }
            ]
          };
        default:
          throw new Error(
            `Unknown operand ${e.operand} for ${c} filter`
          );
      }
    }
    case "SELECT": {
      const i = W.parse(e.value);
      if (i.length === 0) return;
      const f = i.filter((u) => u === ""), l = i.filter((u) => u !== "");
      switch (e.operand) {
        case a.IS: {
          const u = [];
          return l.length > 0 && u.push({
            [n.name]: {
              in: l
            }
          }), f.length > 0 && u.push({
            [n.name]: {
              is: "NULL"
            }
          }), u.length === 1 ? u[0] : { or: u };
        }
        case a.IS_NOT: {
          const u = [];
          return l.length > 0 && u.push({
            not: {
              [n.name]: {
                in: l
              }
            }
          }), f.length > 0 && u.push({
            not: {
              [n.name]: {
                is: "NULL"
              }
            }
          }), u.length === 1 ? u[0] : { and: u };
        }
        default:
          throw new Error(
            `Unknown operand ${e.operand} for ${c} filter`
          );
      }
    }
    case "ARRAY":
      switch (e.operand) {
        case a.CONTAINS:
          return {
            [n.name]: {
              containsIlike: `%${e.value}%`
            }
          };
        case a.DOES_NOT_CONTAIN:
          return {
            not: {
              [n.name]: {
                containsIlike: `%${e.value}%`
              }
            }
          };
        default:
          throw new Error(
            `Unknown operand ${e.operand} for ${c} filter`
          );
      }
    case "ACTOR": {
      if (s === "source")
        switch (e.operand) {
          case a.IS: {
            if (e.value === "[]")
              return;
            const f = JSON.parse(e.value);
            return {
              [n.name]: {
                source: {
                  in: f
                }
              }
            };
          }
          case a.IS_NOT: {
            if (e.value === "[]")
              return;
            const f = JSON.parse(e.value);
            return f.length === 0 ? void 0 : {
              not: {
                [n.name]: {
                  source: {
                    in: f
                  }
                }
              }
            };
          }
          default:
            throw new Error(
              `Unknown operand ${e.operand} for ${n.label} filter`
            );
        }
      if (s === "workspaceMemberId") {
        const { isCurrentWorkspaceMemberSelected: f, selectedRecordIds: l } = $e.catch({
          isCurrentWorkspaceMemberSelected: !1,
          selectedRecordIds: ne.parse(
            e.value
          )
        }).parse(e.value), u = f ? [
          ...l,
          r?.currentWorkspaceMemberId
        ].filter(p) : l;
        if (!p(u) || u.length === 0)
          return;
        switch (e.operand) {
          case a.IS:
            return {
              [n.name]: {
                workspaceMemberId: {
                  in: u
                }
              }
            };
          case a.IS_NOT:
            return {
              or: [
                {
                  not: {
                    [n.name]: {
                      workspaceMemberId: {
                        in: u
                      }
                    }
                  }
                },
                {
                  [n.name]: {
                    workspaceMemberId: {
                      is: "NULL"
                    }
                  }
                }
              ]
            };
          default:
            throw new Error(
              `Unknown operand ${e.operand} for ${n.label} filter`
            );
        }
      }
      const i = Object.values(Nn).filter(
        (f) => f.toLowerCase().includes(e.value.toLowerCase())
      );
      switch (e.operand) {
        case a.CONTAINS:
          return {
            or: [
              {
                [n.name]: {
                  name: {
                    ilike: `%${e.value}%`
                  }
                }
              },
              ...i.length > 0 ? [
                {
                  [n.name]: {
                    source: {
                      in: i
                    }
                  }
                }
              ] : []
            ]
          };
        case a.DOES_NOT_CONTAIN:
          return {
            and: [
              {
                not: {
                  [n.name]: {
                    name: {
                      ilike: `%${e.value}%`
                    }
                  }
                }
              },
              ...i.length > 0 ? [
                {
                  not: {
                    [n.name]: {
                      source: {
                        in: i
                      }
                    }
                  }
                }
              ] : []
            ]
          };
        default:
          throw new Error(
            `Unknown operand ${e.operand} for ${n.label} filter`
          );
      }
    }
    case "EMAILS":
      return Vn({
        correspondingFieldMetadataItem: n,
        recordFilter: e,
        subFieldName: s
      });
    case "PHONES": {
      if (!o) {
        const f = e.value.replace(/[^0-9]/g, "");
        if (!S(f))
          return;
        switch (e.operand) {
          case a.CONTAINS:
            return {
              or: [
                {
                  [n.name]: {
                    primaryPhoneNumber: {
                      ilike: `%${f}%`
                    }
                  }
                },
                {
                  [n.name]: {
                    primaryPhoneCallingCode: {
                      ilike: `%${f}%`
                    }
                  }
                },
                {
                  [n.name]: {
                    additionalPhones: {
                      like: `%${f}%`
                    }
                  }
                }
              ]
            };
          case a.DOES_NOT_CONTAIN:
            return {
              and: [
                {
                  not: {
                    [n.name]: {
                      primaryPhoneNumber: {
                        ilike: `%${f}%`
                      }
                    }
                  }
                },
                {
                  not: {
                    [n.name]: {
                      primaryPhoneCallingCode: {
                        ilike: `%${f}%`
                      }
                    }
                  }
                },
                {
                  or: [
                    {
                      not: {
                        [n.name]: {
                          additionalPhones: {
                            like: `%${f}%`
                          }
                        }
                      }
                    },
                    {
                      [n.name]: {
                        additionalPhones: {
                          is: "NULL"
                        }
                      }
                    }
                  ]
                }
              ]
            };
          default:
            throw new Error(
              `Unknown operand ${e.operand} for ${c} filter`
            );
        }
      }
      const i = e.value;
      switch (s) {
        case "additionalPhones":
          switch (e.operand) {
            case a.CONTAINS:
              return {
                or: [
                  {
                    [n.name]: {
                      additionalPhones: {
                        like: `%${i}%`
                      }
                    }
                  }
                ]
              };
            case a.DOES_NOT_CONTAIN:
              return {
                or: [
                  {
                    not: {
                      [n.name]: {
                        additionalPhones: {
                          like: `%${i}%`
                        }
                      }
                    }
                  },
                  {
                    [n.name]: {
                      additionalPhones: {
                        is: "NULL"
                      }
                    }
                  }
                ]
              };
            default:
              throw new Error(
                `Unknown operand ${e.operand} for ${c} filter`
              );
          }
        case "primaryPhoneNumber":
          switch (e.operand) {
            case a.CONTAINS:
              return {
                [n.name]: {
                  primaryPhoneNumber: {
                    ilike: `%${i}%`
                  }
                }
              };
            case a.DOES_NOT_CONTAIN:
              return {
                not: {
                  [n.name]: {
                    primaryPhoneNumber: {
                      ilike: `%${i}%`
                    }
                  }
                }
              };
            default:
              throw new Error(
                `Unknown operand ${e.operand} for ${c} filter`
              );
          }
        case "primaryPhoneCallingCode":
          switch (e.operand) {
            case a.CONTAINS:
              return {
                [n.name]: {
                  primaryPhoneCallingCode: {
                    ilike: `%${i}%`
                  }
                }
              };
            case a.DOES_NOT_CONTAIN:
              return {
                not: {
                  [n.name]: {
                    primaryPhoneCallingCode: {
                      ilike: `%${i}%`
                    }
                  }
                }
              };
            default:
              throw new Error(
                `Unknown operand ${e.operand} for ${c} filter`
              );
          }
        default:
          throw new Error(
            `Unknown subfield ${s} for ${c} filter`
          );
      }
    }
    case "BOOLEAN":
      return {
        [n.name]: {
          eq: e.value === "true"
        }
      };
    case "UUID": {
      const i = ne.parse(
        e.value
      ), f = p(i) && i.length > 0 ? i : ["00000000-0000-4000-8000-000000000000"];
      switch (e.operand) {
        case a.IS:
          return {
            [n.name]: {
              in: f
            }
          };
        case a.IS_NOT:
          return {
            not: {
              [n.name]: {
                in: f
              }
            }
          };
        default:
          throw new Error(
            `Unknown operand ${e.operand} for ${c} filter`
          );
      }
    }
    default:
      throw new Error("Unknown filter type");
  }
}, on = ({
  filterValueDependencies: e,
  filters: n,
  fieldMetadataItemById: r,
  recordFilterGroups: t,
  currentRecordFilterGroupId: s
}) => {
  const o = t.find(
    (l) => l.id === s
  );
  if (!p(o))
    return;
  const i = n.filter(
    (l) => l.recordFilterGroupId === s
  ).map(
    (l) => Se({
      filterValueDependencies: e,
      recordFilter: l,
      fieldMetadataItemById: r
    })
  ).filter(p), f = t.filter(
    (l) => l.parentRecordFilterGroupId === s
  ).map(
    (l) => on({
      filterValueDependencies: e,
      filters: n,
      fieldMetadataItemById: r,
      recordFilterGroups: t,
      currentRecordFilterGroupId: l.id
    })
  ).filter(p);
  if (o.logicalOperator === de.AND)
    return {
      and: [
        ...i,
        ...f
      ]
    };
  if (o.logicalOperator === de.OR)
    return {
      or: [
        ...i,
        ...f
      ]
    };
  throw new Error(
    `Unknown logical operator ${o.logicalOperator}`
  );
}, bs = ({
  fieldMetadataItems: e,
  recordFilters: n,
  recordFilterGroups: r,
  filterValueDependencies: t
}) => {
  const s = new Map(
    e.map((u) => [u.id, u])
  ), o = n.filter((u) => !p(u.recordFilterGroupId)).map((u) => Se({
    recordFilter: u,
    fieldMetadataItemById: s,
    filterValueDependencies: t
  })).filter(p), c = r.find(
    (u) => !u.parentRecordFilterGroupId
  )?.id, i = on({
    filterValueDependencies: t,
    filters: n,
    fieldMetadataItemById: s,
    recordFilterGroups: r,
    currentRecordFilterGroupId: c
  }), f = [
    ...o,
    i
  ].filter(p);
  return f.length === 0 ? {} : f.length === 1 ? f[0] : {
    and: f
  };
}, ks = (e, n, r) => {
  switch (r) {
    case "SECOND":
      return en(e, n);
    case "MINUTE":
      return Fe(e, n);
    case "HOUR":
      return Ze(e, n);
    case "DAY":
      return pe(e, n);
    case "WEEK":
      return nn(e, n);
    case "MONTH":
      return J(e, n);
    case "QUARTER":
      return J(e, n * 3);
    case "YEAR":
      return rn(e, n);
  }
}, k = (e, n, r) => {
  switch (n) {
    case "DAY":
      return e.add({ days: r });
    case "WEEK":
      return e.add({ weeks: r });
    case "QUARTER":
      return e.add({
        months: r * 3
      });
    case "MONTH":
      return e.add({
        months: r
      });
    case "YEAR":
      return e.add({
        years: r
      });
    case "SECOND":
      return e.add({
        seconds: r
      });
    case "MINUTE":
      return e.add({
        minutes: r
      });
    case "HOUR":
      return e.add({
        hours: r
      });
    default:
      return $();
  }
}, Ps = (e, n) => {
  switch (e) {
    case v.MONDAY:
      return R.MONDAY;
    case v.SATURDAY:
      return R.SATURDAY;
    case v.SUNDAY:
      return R.SUNDAY;
    case v.SYSTEM:
      return n;
    default:
      return $();
  }
}, xs = (e) => {
  switch (e) {
    case R.MONDAY:
      return v.MONDAY;
    case R.SATURDAY:
      return v.SATURDAY;
    case R.SUNDAY:
      return v.SUNDAY;
  }
}, vr = g.enum([
  R.MONDAY,
  R.SATURDAY,
  R.SUNDAY
]), Ys = (e) => {
  switch (e) {
    case R.MONDAY:
      return 1;
    case R.SATURDAY:
      return 6;
    case R.SUNDAY:
      return 0;
    default:
      return $();
  }
}, $r = (e) => {
  switch (e) {
    case R.MONDAY:
      return 1;
    case R.SATURDAY:
      return 6;
    case R.SUNDAY:
      return 7;
    default:
      return $();
  }
}, _ = (e, n, r) => {
  switch (n) {
    case "DAY":
      return e.startOfDay();
    case "WEEK": {
      const t = p(r) ? $r(r) : br, s = (e.dayOfWeek - t + 7) % 7;
      return e.startOfDay().subtract({ days: s });
    }
    case "QUARTER": {
      const t = Math.floor((e.month - 1) / 3);
      return e.startOfDay().with({ day: 1, month: t * 3 + 1 });
    }
    case "MONTH":
      return e.startOfDay().with({ day: 1 });
    case "YEAR":
      return e.startOfDay().with({ day: 1, month: 1 });
    case "SECOND":
      return e.with({ nanosecond: 0, microsecond: 0, millisecond: 0 });
    case "MINUTE":
      return e.with({
        second: 0,
        nanosecond: 0,
        microsecond: 0,
        millisecond: 0
      });
    case "HOUR":
      return e.with({
        minute: 0,
        second: 0,
        nanosecond: 0,
        microsecond: 0,
        millisecond: 0
      });
    default:
      return $();
  }
}, br = 1, Q = (e, n, r) => {
  switch (n) {
    case "DAY":
      return _(e, "DAY").add({ days: 1 });
    case "WEEK":
      return _(e, "WEEK", r).add({
        weeks: 1
      });
    case "MONTH":
      return _(e, "MONTH", r).add({
        months: 1
      });
    case "QUARTER":
      return _(e, "QUARTER", r).add({
        months: 3
      });
    case "YEAR":
      return _(e, "YEAR", r).add({
        years: 1
      });
    case "SECOND":
      return _(e, "SECOND").add({ seconds: 1 });
    case "MINUTE":
      return _(e, "MINUTE").add({ minutes: 1 });
    case "HOUR":
      return _(e, "HOUR").add({ hours: 1 });
    default:
      return $();
  }
}, kr = g.union([g.coerce.number().int().positive(), g.literal("undefined")]).transform((e) => e === "undefined" ? void 0 : e), Pr = g.enum([
  "NEXT",
  "THIS",
  "PAST"
]), xr = g.enum([
  "SECOND",
  "MINUTE",
  "HOUR",
  "DAY",
  "WEEK",
  "MONTH",
  "QUARTER",
  "YEAR"
]), cn = g.object({
  direction: Pr,
  amount: kr.nullish(),
  unit: xr,
  timezone: g.string().nullish(),
  firstDayOfTheWeek: vr.nullish()
}).refine((e) => !(e.amount === void 0 && e.direction !== "THIS"), {
  error: "Amount cannot be 'undefined' unless direction is 'THIS'"
}), Yr = /((?:THIS)|(?:PAST)|(?:NEXT))_(\d*)_(DAY|MONTH|YEAR|WEEK|QUARTER|HOUR|MINUTE|SECOND)(?:(?:;;([^;;]*);;)?(?:(MONDAY|SUNDAY|SATURDAY);;)?)?/, un = g.string().transform((e, n) => {
  const t = new RegExp(
    Yr
  ).exec(e);
  if (!le(t))
    return n.addIssue(
      `Cannot parse stringified inline relative date filter, value : "${e}"`
    ), g.NEVER;
  const [s, o, c, i, f, l] = t;
  return cn.parse({
    direction: o,
    amount: c,
    unit: i,
    timezone: f,
    firstDayOfTheWeek: l
  });
}), q = (e, n, r) => {
  switch (n) {
    case "DAY":
      return e.subtract({ days: r });
    case "WEEK":
      return e.subtract({ weeks: r });
    case "QUARTER":
      return e.subtract({
        months: r * 3
      });
    case "MONTH":
      return e.subtract({
        months: r
      });
    case "YEAR":
      return e.subtract({
        years: r
      });
    case "SECOND":
      return e.subtract({
        seconds: r
      });
    case "MINUTE":
      return e.subtract({
        minutes: r
      });
    case "HOUR":
      return e.subtract({
        hours: r
      });
    default:
      return $();
  }
}, qr = (e, n) => {
  const { direction: r, amount: t, unit: s, firstDayOfTheWeek: o } = e;
  switch (r) {
    case "NEXT": {
      if (!B(t))
        throw new Error("Amount is required");
      if (s === "QUARTER") {
        const u = _(
          n,
          "QUARTER",
          o
        ), N = k(
          u,
          "QUARTER",
          1
        ), L = k(
          N,
          "QUARTER",
          t
        ), U = N.toPlainDate().toString(), X = L.toPlainDate().toString();
        return {
          ...e,
          start: U,
          end: X
        };
      }
      const c = n.startOfDay().add({ days: 1 }), i = k(
        c,
        s,
        t
      ), f = c.toPlainDate().toString(), l = i?.toPlainDate().toString();
      return {
        ...e,
        start: f,
        end: l
      };
    }
    case "PAST": {
      if (!B(t))
        throw new Error("Amount is required");
      if (s === "QUARTER") {
        const u = _(
          n,
          "QUARTER",
          o
        ), L = q(
          u,
          "QUARTER",
          t
        ).toPlainDate().toString(), U = u.toPlainDate().toString();
        return {
          ...e,
          start: L,
          end: U
        };
      }
      const c = n.startOfDay(), f = q(
        c,
        s,
        t
      )?.toPlainDate().toString(), l = c.toPlainDate().toString();
      return {
        ...e,
        start: f,
        end: l
      };
    }
    case "THIS": {
      const c = _(
        n,
        s,
        o
      ), i = Q(
        n,
        s,
        o
      ), f = c?.toPlainDate().toString(), l = i?.toPlainDate().toString();
      return {
        ...e,
        start: f,
        end: l
      };
    }
  }
}, ln = (e) => {
  if (!S(e))
    return null;
  const n = un.safeParse(
    e
  );
  if (!n.success)
    return null;
  const r = n.data, t = B(r.timezone) ? T.Now.zonedDateTimeISO(r.timezone) : T.Now.zonedDateTimeISO();
  return qr(
    r,
    t
  );
}, Hr = (e) => e.value ? e.operand === a.IS_RELATIVE ? ln(
  e.value
) : e.value : null, Mr = (e, n) => {
  const { direction: r, amount: t, unit: s, firstDayOfTheWeek: o } = e, c = ["SECOND", "MINUTE", "HOUR"].includes(s);
  switch (r) {
    case "NEXT": {
      if (!p(t))
        throw new Error("Amount is required");
      if (s === "QUARTER") {
        const i = Q(
          n,
          "QUARTER"
        );
        return {
          ...e,
          start: i,
          end: k(i, s, t)
        };
      }
      if (c)
        return {
          ...e,
          start: n,
          end: k(n, s, t)
        };
      {
        const i = n.startOfDay().add({ days: 1 });
        return {
          ...e,
          start: i,
          end: k(i, s, t)
        };
      }
    }
    case "PAST": {
      if (!p(t))
        throw new Error("Amount is required");
      if (s === "QUARTER") {
        const i = _(
          n,
          "QUARTER"
        );
        return {
          ...e,
          start: q(i, s, t),
          end: i
        };
      }
      if (c)
        return {
          ...e,
          start: q(n, s, t),
          end: n
        };
      {
        const i = n.startOfDay();
        return {
          ...e,
          start: q(i, s, t),
          end: i
        };
      }
    }
    case "THIS":
      return {
        ...e,
        start: _(n, s, o),
        end: Q(
          n,
          s,
          o
        )
      };
  }
}, Wr = (e) => {
  if (!S(e))
    return null;
  const n = un.safeParse(
    e
  );
  if (n.success) {
    const r = n.data, t = B(r.timezone) ? T.Now.zonedDateTimeISO(r.timezone) : T.Now.zonedDateTimeISO();
    return Mr(
      r,
      t.round({ smallestUnit: "second" })
    );
  } else
    return null;
}, ke = (e) => e.value ? e.operand === a.IS_RELATIVE ? Wr(
  e.value
) : e.value : null, qs = (e, n, r) => {
  switch (r) {
    case "SECOND":
      return gr(e, n);
    case "MINUTE":
      return Ir(e, n);
    case "HOUR":
      return wr(e, n);
    case "DAY":
      return lr(e, n);
    case "WEEK":
      return Ur(e, n);
    case "MONTH":
      return ve(e, n);
    case "QUARTER":
      return ve(e, n * 3);
    case "YEAR":
      return Cr(e, n);
  }
}, Gr = {
  [y.Is]: a.IS,
  [y.IsNotNull]: a.IS_NOT_NULL,
  [y.IsNot]: a.IS_NOT,
  [y.LessThanOrEqual]: a.LESS_THAN_OR_EQUAL,
  [y.GreaterThanOrEqual]: a.GREATER_THAN_OR_EQUAL,
  [y.IsBefore]: a.IS_BEFORE,
  [y.IsAfter]: a.IS_AFTER,
  [y.Contains]: a.CONTAINS,
  [y.DoesNotContain]: a.DOES_NOT_CONTAIN,
  [y.IsEmpty]: a.IS_EMPTY,
  [y.IsNotEmpty]: a.IS_NOT_EMPTY,
  [y.IsRelative]: a.IS_RELATIVE,
  [y.IsInPast]: a.IS_IN_PAST,
  [y.IsInFuture]: a.IS_IN_FUTURE,
  [y.IsToday]: a.IS_TODAY,
  [a.IS]: a.IS,
  [a.IS_NOT_NULL]: a.IS_NOT_NULL,
  [a.IS_NOT]: a.IS_NOT,
  [a.LESS_THAN_OR_EQUAL]: a.LESS_THAN_OR_EQUAL,
  [a.GREATER_THAN_OR_EQUAL]: a.GREATER_THAN_OR_EQUAL,
  [a.IS_BEFORE]: a.IS_BEFORE,
  [a.IS_AFTER]: a.IS_AFTER,
  [a.CONTAINS]: a.CONTAINS,
  [a.DOES_NOT_CONTAIN]: a.DOES_NOT_CONTAIN,
  [a.IS_EMPTY]: a.IS_EMPTY,
  [a.IS_NOT_EMPTY]: a.IS_NOT_EMPTY,
  [a.IS_RELATIVE]: a.IS_RELATIVE,
  [a.IS_IN_PAST]: a.IS_IN_PAST,
  [a.IS_IN_FUTURE]: a.IS_IN_FUTURE,
  [a.IS_TODAY]: a.IS_TODAY,
  [a.VECTOR_SEARCH]: a.VECTOR_SEARCH
}, Hs = (e) => Gr[e], Ms = (e) => typeof e == "string" ? e : JSON.stringify(e ?? ""), Pe = ({
  fieldMetadataItem: e,
  filterValue: n
}) => ({
  foundCorrespondingSelectOptions: e.options?.filter(
    (s) => s.value.toLocaleLowerCase().includes(n.toLocaleLowerCase()) || s.label.toLocaleLowerCase().includes(n.toLocaleLowerCase())
  )
}), Ws = (e) => {
  const n = e < 0 ? "-" : "", r = Math.abs(e);
  return r < 1e3 ? n + r.toFixed(1).replace(/\.?0+$/, "") : r < 1e6 ? n + (r / 1e3).toFixed(1).replace(/\.?0+$/, "") + "k" : r < 1e9 ? n + (r / 1e6).toFixed(1).replace(/\.?0+$/, "") + "m" : n + (r / 1e9).toFixed(1).replace(/\.?0+$/, "") + "b";
}, Gs = ({
  array: e,
  uniqueKey: n
}) => e.reduce((r, t) => {
  const s = t[n];
  if (p(r[s]))
    throw new Error(
      `Should never occur, flat array contains twice the same unique key ${t[n]}`
    );
  return {
    ...r,
    [s]: t
  };
}, {}), Bs = ({
  array: e,
  key: n
}) => e.reduce((r, t) => {
  const s = t[n], o = r[s];
  return p(o) ? {
    ...r,
    [s]: [...o, t]
  } : {
    ...r,
    [s]: [t]
  };
}, {}), Br = (e) => {
  try {
    return new URL(e);
  } catch {
    return null;
  }
}, js = (e) => V(e), Ks = (e) => `${V(e)}Connection`, Js = (e) => `${V(e)}Edge`, Qs = (e) => `${V(e)}GroupByConnection`, zs = ({
  imageUrl: e,
  baseUrl: n
}) => e.startsWith("https:") || e.startsWith("http:") ? e : e.startsWith("/") ? new URL(`/files${e}`, n).toString() : new URL(`/files/${e}`, n).toString(), jr = (e) => e ? e.replace(/(https?:\/\/)|(www\.)/g, "").replace(/\/$/, "") : "", Vs = (e) => {
  const n = jr(e);
  return n ? `https://twenty-icons.com/${n}` : void 0;
}, Xs = (e) => {
  const n = e.indexMetadatas.filter(
    (o) => o.isUnique
  ), r = new Map(
    e.fields.map((o) => [o.id, o])
  ), t = e.fields.find(
    (o) => o.name === "id"
  );
  if (!p(t))
    throw new Error(
      `Primary key constraint field not found for object metadata ${e.id}`
    );
  const s = n.map(
    (o) => o.indexFieldMetadatas.map((c) => {
      const i = r.get(c.fieldMetadataId);
      if (!p(i))
        throw new Error(
          `Index field not found for field id ${c.fieldMetadataId} in index metadata ${o.id}`
        );
      return i;
    })
  );
  return [[t], ...s];
}, Zs = (e) => e === dn || e === Tn, Fs = (e, n, r) => {
  let t = e;
  if (p(n) && (t = Be(e, n)), p(r)) {
    const s = Object.fromEntries(
      Object.entries(r).filter(([c, i]) => p(i))
    ), o = Ge.stringify(s);
    o !== "" && (t += `?${o}`);
  }
  return t;
}, ea = (e, n, r, t) => {
  let s = `/${Te.Settings}/${e}`;
  if (p(n) && (s = Be(
    `/${Te.Settings}/${e}`,
    n
  )), p(r)) {
    const o = Object.fromEntries(
      Object.entries(r).filter(([i, f]) => p(f))
    ), c = Ge.stringify(o);
    c !== "" && (s += `?${c}`);
  }
  return p(t) && (s += `#${t.replace(/^#/, "")}`), s;
}, na = (e) => {
  try {
    return !p(e) || e === "" ? null : JSON.parse("[" + e + "]")[0];
  } catch {
    return null;
  }
}, ra = (e, n) => {
  const r = { ...e };
  for (const t of n)
    delete r[t];
  return r;
}, xe = (e) => e === void 0 || e === null || typeof e != "object" ? e : Array.isArray(e) ? e.map((n) => xe(n)).filter((n) => !Z(n)) : Object.entries(e).reduce(
  (n, [r, t]) => {
    if (Z(t))
      return n;
    if (t === null || t instanceof Date)
      return { ...n, [r]: t };
    if (typeof t == "object") {
      const s = xe(t);
      return !Z(s) && Object.keys(s).length > 0 ? { ...n, [r]: s } : n;
    }
    return { ...n, [r]: t };
  },
  {}
), Kr = /\{"type":"variableTag","attrs":\{"variable":"(\{\{[^{}]+\}\})"\}\}|\{"attrs":\{"variable":"(\{\{[^{}]+\}\})"\},"type":"variableTag"\}/g, Ye = (e) => JSON.stringify(e).slice(1, -1), Jr = (e) => {
  const n = e.split(`
`);
  return n.length === 1 ? `{"type":"text","text":"${Ye(e)}"}` : n.map((r, t) => {
    const s = `{"type":"text","text":"${Ye(r)}"}`;
    return t < n.length - 1 ? `${s},{"type":"hardBreak"}` : s;
  }).join(",");
}, ta = (e, n) => {
  if (p(e))
    return e.replace(
      Kr,
      (r, t, s) => {
        const c = se(t ?? s, n), i = p(c) ? String(c) : "";
        return Jr(i);
      }
    );
}, sa = (e) => {
  try {
    const n = JSON.parse(e), r = cn.safeParse(n);
    return r.success ? r.data : void 0;
  } catch {
    return;
  }
}, aa = (e) => e?.match(/^[A-Z][a-z]*/)?.[0], oa = (e) => e.split("_").map((n) => n.charAt(0)?.toUpperCase() + n.slice(1)?.toLowerCase()).join(" "), ia = (e) => e.replace(/([A-Z])/g, (n) => `-${n.toLowerCase()}`), ca = (e) => e.replace(/[A-Z]/g, (n) => `_${n.toLowerCase()}`), ua = (e) => {
  try {
    if (e === void 0)
      return "undefined";
    if (e === null)
      return "null";
    if (e === 1 / 0)
      return "Infinity";
    if (e === -1 / 0)
      return "-Infinity";
    if (typeof e == "number" && isNaN(e))
      return "NaN";
    const n = JSON.stringify(e);
    return n === void 0 ? String(e) : n;
  } catch {
    return String(e);
  }
}, la = (e) => e.charAt(0).toLowerCase() + e.slice(1), Y = {
  BOLD: "bold",
  ITALIC: "italic",
  UNDERLINE: "underline",
  STRIKE: "strike",
  LINK: "link"
}, fa = {
  PARAGRAPH: "paragraph",
  TEXT: "text",
  HEADING: "heading",
  VARIABLE_TAG: "variableTag",
  IMAGE: "image",
  BULLET_LIST: "bulletList",
  ORDERED_LIST: "orderedList",
  LIST_ITEM: "listItem",
  HARD_BREAK: "hardBreak"
}, Ea = [
  Y.UNDERLINE,
  Y.BOLD,
  Y.ITALIC,
  Y.STRIKE,
  Y.LINK
], pa = (e, n, r) => n.reduce(
  (t, s) => {
    const o = e[s];
    return o === void 0 || typeof o != "string" || o === null ? t : {
      ...t,
      [s]: ze(o)
    };
  },
  r ? {} : e
), Na = (e) => Object.entries(e), Sa = (e) => "metadataName" in e, Oa = (e) => typeof e == "object" && e !== null && !Array.isArray(e), ma = (e) => "objectNameSingular" in e, da = (e, n) => {
  if (e == null)
    throw new Error(
      `Value must be defined for variable ${n}, this should not happen`
    );
}, Qr = /^\d+$/, zr = (e) => e.endsWith("FastInstanceCommand") ? "(instance fast)" : e.endsWith("SlowInstanceCommand") ? "(instance slow)" : "(workspace)", Vr = (e) => e.replace(/FastInstanceCommand$/, "").replace(/SlowInstanceCommand$/, "").replace(/Command$/, ""), Ta = (e) => {
  const n = e.split("_");
  if (n.length < 3)
    return e;
  const r = n[0], t = n[n.length - 1], s = Qr.test(t), o = n.slice(1, -1).join("_"), c = Vr(o), i = zr(o);
  return s ? `${c} ${t} (${r}) ${i}` : `${c} (${r}) ${i}`;
}, fn = (e) => {
  const n = e.trim();
  return n.startsWith("http://") || n.startsWith("https://") || n.startsWith("HTTPS://") || n.startsWith("HTTP://") ? n : `https://${n}`;
}, Xr = (e, n) => {
  const r = n?.allowIp ?? !0, t = n?.allowLocalhost ?? !0, o = /^(((?!-))(xn--|_)?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.){1,10}(xn--)?([a-z0-9][a-z0-9-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$/.test(e), c = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(e), i = e === "localhost" || e === "127.0.0.1";
  return i && !t || c && !r ? !1 : o || i || c;
}, Oe = A.string().transform((e, n) => {
  const r = e.trim(), t = fn(r), s = t.replace("https://", "").replace("http://", "").replace("HTTPS://", "").replace("HTTP://", "");
  if (/^\d+(?:\/[a-zA-Z]*)?$/.test(s))
    return n.addIssue({
      code: "custom",
      message: "domain is not a valid url"
    }), A.NEVER;
  try {
    const o = new URL(t);
    return Xr(o.hostname) ? t : (n.addIssue({
      code: "custom",
      message: "domain is not a valid url"
    }), A.NEVER);
  } catch {
    return n.addIssue({
      code: "custom",
      message: "domain is not a valid url"
    }), A.NEVER;
  }
}), Aa = ({
  path: e,
  token: n
}) => {
  if (e.startsWith("https:") || e.startsWith("http:"))
    return e;
  const r = e.split("/"), t = r.pop();
  if (!S(t))
    throw new Error(
      `Filename empty: cannot build signed path from folderPath '${e}'`
    );
  return `${r.join("/")}/${n}/${t}`;
}, ha = (e) => {
  try {
    return Oe.parse(e);
  } catch {
    throw new Error("Invalid URL");
  }
}, Zr = ["http:", "https:", "mailto:", "tel:"], qe = (e) => {
  if (e.startsWith("/") && !e.startsWith("//"))
    return !0;
  try {
    const n = new URL(e);
    return Zr.includes(n.protocol);
  } catch {
    return !1;
  }
}, ya = (e) => {
  if (!e || e.trim().length === 0)
    return;
  if (qe(e))
    return e;
  const n = `https://${e}`;
  return qe(n) ? n : void 0;
}, Ra = (e) => {
  const n = Oe.safeParse(e);
  if (!n.success)
    throw new Error("Invalid URL");
  try {
    return new URL(n.data).hostname;
  } catch {
    throw new Error("Invalid URL");
  }
}, _a = (e) => Oe.safeParse(e).success, Fr = (e) => {
  const n = Br(e);
  return p(n) ? (n.origin + n.pathname + n.search + n.hash).replace(/\/$/, "") : e;
}, La = (e) => {
  const n = e.trim();
  return n === "" ? n : Fr(fn(n));
}, wa = (e) => {
  try {
    return decodeURIComponent(e);
  } catch {
    return e;
  }
}, Ia = (e) => {
  const n = e.replace(/-/g, "");
  return BigInt("0x" + n).toString(36);
}, ga = (e) => z(e) && Object.keys(e).length === 0, Ua = (e) => An.includes(e), oe = (e) => /^{{[^{}]+}}$/.test(e), ie = /* @__PURE__ */ new Map();
for (const e of je()) {
  const n = _n(e), r = ie.get(n);
  r ? r.push(e) : ie.set(n, [e]);
}
const Ca = (e) => {
  const n = e.startsWith("+") ? e.slice(1) : e;
  return ie.get(n) ?? [];
}, et = new Set(je()), Da = (e) => et.has(e), nt = (e) => typeof e == "string", He = RegExp("\\{\\{([^{}]+)\\}\\}", "g"), ce = (e, n) => p(e) ? nt(e) ? st(e, n) : Array.isArray(e) ? rt(e, n) : typeof e == "object" && e !== null ? tt(e, n) : e : e, rt = (e, n) => {
  const r = e;
  for (let t = 0; t < e.length; ++t)
    r[t] = ce(e[t], n);
  return r;
}, tt = (e, n) => Object.entries(e).reduce(
  (r, [t, s]) => {
    const o = ce(t, n);
    return r[typeof o == "string" ? o : String(o)] = ce(s, n), r;
  },
  {}
), st = (e, n) => {
  const r = e.match(He);
  return !r || r.length === 0 ? e : r.length === 1 && r[0] === e ? se(e, n) : e.replace(He, (t, s) => se(t, n));
};
export {
  we as COMPOSITE_FIELD_FILTER_OPERANDS_MAP,
  C as CustomError,
  or as FILTER_OPERANDS_MAP,
  br as FIRST_DAY_OF_WEEK_ISO_8601_MONDAY,
  Ea as TIPTAP_MARKS_RENDER_ORDER,
  Y as TIPTAP_MARK_TYPES,
  fa as TIPTAP_NODE_TYPES,
  Oe as absoluteUrlSchema,
  ks as addUnitToDateTime,
  k as addUnitToZonedDateTime,
  as as appendCopySuffix,
  Ut as applyDiff,
  W as arrayOfStringsOrVariablesSchema,
  ne as arrayOfUuidOrVariableSchema,
  Ln as assertIsDefinedOrThrow,
  $ as assertUnreachable,
  Mt as base64UrlEncode,
  Aa as buildSignedPath,
  ia as camelToKebab,
  ca as camelToSnakeCase,
  K as capitalize,
  zn as checkIfShouldComputeEmptinessFilter,
  ds as combineFilters,
  Ct as compareArraysOfObjectsByProperty,
  jt as computeDiffBetweenObjects,
  Zn as computeEmptyGqlOperationFilterForEmails,
  Fn as computeEmptyGqlOperationFilterForLinks,
  Vn as computeGqlOperationFilterForEmails,
  Xn as computeGqlOperationFilterForLinks,
  cs as computeMorphRelationGqlFieldJoinColumnName,
  Bn as computeMorphRelationGqlFieldName,
  bs as computeRecordGqlOperationFilter,
  jn as computeRelationGqlFieldJoinColumnName,
  d as conditionalAvailabilityParser,
  Ps as convertCalendarStartDayNonIsoNumberToFirstDayOfTheWeek,
  xs as convertFirstDayOfTheWeekToCalendarStartDayNumber,
  rr as convertGreaterThanOrEqualRatingToArrayOfRatingValues,
  tr as convertLessThanOrEqualRatingToArrayOfRatingValues,
  _e as convertRatingToRatingValue,
  Hs as convertViewFilterOperandToCoreOperand,
  Ms as convertViewFilterValueToString,
  w as createAnyFieldRecordFilterBaseProperties,
  Hn as deepMerge,
  fn as ensureAbsoluteUrl,
  se as evalFromContext,
  Wt as evaluateConditionalAvailabilityExpression,
  ss as extractAndSanitizeObjectStringFields,
  Ss as extractFolderPathFilenameAndTypeOrThrow,
  G as fastDeepEqual,
  Dt as filterDuplicatesById,
  vt as filterOutByProperty,
  Os as filterOutInvalidRecordFilters,
  Pe as filterSelectOptionsOfFieldMetadataItem,
  Qe as findById,
  $t as findByProperty,
  bt as findOrThrow,
  vr as firstDayOfWeekSchema,
  Ws as formatToShortNumber,
  Ta as formatUpgradeCommandName,
  Gs as fromArrayToUniqueKeyRecord,
  Bs as fromArrayToValuesByKeyRecord,
  Xe as generateILikeFiltersForCompositeFields,
  ha as getAbsoluteUrlOrThrow,
  Fs as getAppPath,
  Ks as getConnectionTypename,
  kt as getContiguousIncrementalValues,
  Ca as getCountryCodesForCallingCode,
  Js as getEdgeTypename,
  sr as getEmptyRecordGqlOperationFilter,
  Ts as getFilterOperandsForFilterableFieldType,
  Ee as getFilterTypeFromFieldType,
  Ys as getFirstDayOfTheWeekAsANumberForDateFNS,
  $r as getFirstDayOfTheWeekAsISONumber,
  aa as getGenericOperationName,
  Qs as getGroupByConnectionTypename,
  oa as getHumanReadableNameFromCode,
  zs as getImageAbsoluteURI,
  Vs as getLogoUrlFromDomainName,
  Q as getNextPeriodStart,
  js as getNodeTypename,
  _ as getPeriodStart,
  ya as getSafeUrl,
  ea as getSettingsPath,
  Br as getURLSafely,
  Xs as getUniqueConstraintsFields,
  Ra as getUrlHostnameOrThrow,
  Gt as interpolateCommandMenuItemTemplate,
  Zs as isAutoSelectModelId,
  Kt as isDateWithoutTime,
  p as isDefined,
  Qn as isEmptinessOperand,
  ga as isEmptyObject,
  Ie as isExpectedSubFieldName,
  us as isFieldMetadataArrayKind,
  ls as isFieldMetadataDateKind,
  fs as isFieldMetadataEligibleForFieldsWidget,
  Es as isFieldMetadataNumericKind,
  ps as isFieldMetadataSelectKind,
  Ns as isFieldMetadataTextKind,
  Ua as isLabelIdentifierFieldMetadataTypes,
  As as isMatchingArrayFilter,
  hs as isMatchingBooleanFilter,
  ys as isMatchingCurrencyFilter,
  Rs as isMatchingDateFilter,
  _s as isMatchingFilesFilter,
  Ls as isMatchingFloatFilter,
  ws as isMatchingMultiSelectFilter,
  Is as isMatchingRatingFilter,
  gs as isMatchingRawJsonFilter,
  Us as isMatchingRichTextFilter,
  Cs as isMatchingSelectFilter,
  Ds as isMatchingStringFilter,
  vs as isMatchingTSVectorFilter,
  $s as isMatchingUUIDFilter,
  Sa as isMetadataGqlOperationSignature,
  F as isNonEmptyArray,
  Jt as isPlainDateAfter,
  Qt as isPlainDateBefore,
  zt as isPlainDateBeforeOrEqual,
  Vt as isPlainDateInSameMonth,
  Xt as isPlainDateInWeekend,
  Oa as isPlainObject,
  er as isRecordFilterOperandExpectingValue,
  Ve as isRecordFilterValueValid,
  ma as isRecordGqlOperationSignature,
  qe as isSafeUrl,
  Zt as isSamePlainDate,
  It as isSearchableFieldType,
  Da as isValidCountryCode,
  Xr as isValidHostname,
  Lt as isValidLocale,
  wt as isValidTwentySubdomain,
  _a as isValidUrl,
  hn as isValidUuid,
  oe as isValidVariable,
  $e as jsonRelationFilterValueSchema,
  os as kebabToCamelCase,
  Pt as mapById,
  xt as mapByProperty,
  gt as normalizeLocale,
  La as normalizeUrl,
  Fr as normalizeUrlOrigin,
  na as parseJson,
  Ft as parseToPlainDateOrThrow,
  V as pascalCase,
  is as pascalToKebab,
  Dr as relationFilterValueSchemaObject,
  kr as relativeDateFilterAmountSchema,
  Pr as relativeDateFilterDirectionSchema,
  cn as relativeDateFilterSchema,
  un as relativeDateFilterStringifiedSchema,
  xr as relativeDateFilterUnitSchema,
  ra as removePropertiesFromRecord,
  xe as removeUndefinedFields,
  Hr as resolveDateFilter,
  ke as resolveDateTimeFilter,
  ce as resolveInput,
  Bt as resolveObjectMetadataLabel,
  qr as resolveRelativeDateFilter,
  ln as resolveRelativeDateFilterStringified,
  Mr as resolveRelativeDateTimeFilter,
  Wr as resolveRelativeDateTimeFilterStringified,
  ta as resolveRichTextVariables,
  wa as safeDecodeURIComponent,
  fe as safeGetNestedProperty,
  sa as safeParseRelativeDateFilterJsonStringified,
  jr as sanitizeURL,
  es as sortPlainDate,
  ua as stringifySafely,
  qs as subUnitFromDateTime,
  q as subUnitFromZonedDateTime,
  Yt as sumByProperty,
  da as throwIfNotDefined,
  pa as trimAndRemoveDuplicatedWhitespacesFromObjectStringProperties,
  ze as trimAndRemoveDuplicatedWhitespacesFromString,
  ms as turnAnyFieldFilterIntoRecordGqlFilter,
  ns as turnJSDateToPlainDate,
  rs as turnPlainDateIntoUserTimeZoneInstantString,
  ts as turnPlainDateToShiftedDateInSystemTimeZone,
  on as turnRecordFilterGroupsIntoGqlOperationFilter,
  Se as turnRecordFilterIntoRecordGqlOperationFilter,
  Na as typedObjectEntries,
  la as uncapitalize,
  qt as upsertIntoArrayOfObjectsComparingId,
  Ht as upsertPropertiesOfItemIntoArrayOfObjectsComparingId,
  Ia as uuidToBase36
};
