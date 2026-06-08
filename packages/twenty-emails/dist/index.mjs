import { jsx as w, jsxs as ie, Fragment as je } from "react/jsx-runtime";
import * as Ze from "react";
import le, { Fragment as y2 } from "react";
import { messages as b2 } from "./locales/generated/af-ZA.mjs";
import { messages as S2 } from "./locales/generated/ar-SA.mjs";
import { messages as k2 } from "./locales/generated/ca-ES.mjs";
import { messages as w2 } from "./locales/generated/cs-CZ.mjs";
import { messages as I2 } from "./locales/generated/da-DK.mjs";
import { messages as x2 } from "./locales/generated/de-DE.mjs";
import { messages as O2 } from "./locales/generated/el-GR.mjs";
import { messages as E2 } from "./locales/generated/en.mjs";
import { messages as P2 } from "./locales/generated/es-ES.mjs";
import { messages as N2 } from "./locales/generated/fi-FI.mjs";
import { messages as T2 } from "./locales/generated/fr-FR.mjs";
import { messages as z2 } from "./locales/generated/he-IL.mjs";
import { messages as A2 } from "./locales/generated/hu-HU.mjs";
import { messages as D2 } from "./locales/generated/it-IT.mjs";
import { messages as C2 } from "./locales/generated/ja-JP.mjs";
import { messages as U2 } from "./locales/generated/ko-KR.mjs";
import { messages as R2 } from "./locales/generated/nl-NL.mjs";
import { messages as L2 } from "./locales/generated/no-NO.mjs";
import { messages as j2 } from "./locales/generated/pl-PL.mjs";
import { messages as M2 } from "./locales/generated/pseudo-en.mjs";
import { messages as Z2 } from "./locales/generated/pt-BR.mjs";
import { messages as F2 } from "./locales/generated/pt-PT.mjs";
import { messages as B2 } from "./locales/generated/ro-RO.mjs";
import { messages as G2 } from "./locales/generated/ru-RU.mjs";
import { messages as H2 } from "./locales/generated/sr-Cyrl.mjs";
import { messages as J2 } from "./locales/generated/sv-SE.mjs";
import { messages as V2 } from "./locales/generated/tr-TR.mjs";
import { messages as q2 } from "./locales/generated/uk-UA.mjs";
import { messages as W2 } from "./locales/generated/vi-VN.mjs";
import { messages as K2 } from "./locales/generated/zh-CN.mjs";
import { messages as Y2 } from "./locales/generated/zh-TW.mjs";
const X2 = /<([a-zA-Z0-9]+)>(.*?)<\/\1>|<([a-zA-Z0-9]+)\/>/, Q2 = /(?:\r\n|\r|\n)/g, e0 = {
  area: !0,
  base: !0,
  br: !0,
  col: !0,
  embed: !0,
  hr: !0,
  img: !0,
  input: !0,
  keygen: !0,
  link: !0,
  meta: !0,
  param: !0,
  source: !0,
  track: !0,
  wbr: !0,
  menuitem: !0
};
function Wl(e, t = {}) {
  const n = t0(0, "$lingui$"), i = e.replace(Q2, "").split(X2);
  if (i.length === 1)
    return e;
  const r = [], o = i.shift();
  o && r.push(o);
  for (const [a, s, d] of Kl(i)) {
    let p = typeof a < "u" ? t[a] : void 0;
    (!p || e0[p.type] && s) && (console.error(
      p ? `${p.type} is a void element tag therefore it must have no children` : `Can't use element at index '${a}' as it is not declared in the original translation`
    ), p = le.createElement(le.Fragment)), Array.isArray(p) && (p = le.createElement(le.Fragment, {}, p)), r.push(
      le.cloneElement(
        p,
        { key: n() },
        // format children for pair tags
        // unpaired tags might have children if it's a component passed as a variable
        s ? Wl(s, t) : p.props.children
      )
    ), d && r.push(d);
  }
  return r.length === 1 ? r[0] : r;
}
function Kl(e) {
  if (!e.length)
    return [];
  const [t, n, i, r] = e.slice(0, 4);
  return [[t || i, n || "", r]].concat(Kl(e.slice(4, e.length)));
}
const t0 = (e = 0, t = "") => () => `${t}_${e++}`;
function r0(e) {
  const {
    render: t,
    component: n,
    id: i,
    message: r,
    formats: o,
    lingui: { i18n: a, defaultComponent: s }
  } = e, d = { ...e.values }, p = { ...e.components };
  d && Object.keys(d).forEach((m) => {
    const g = Object.keys(p).length;
    typeof d[m] == "string" || typeof d[m] == "number" || (p[g] = /* @__PURE__ */ le.createElement(le.Fragment, null, d[m]), d[m] = `<${g}/>`);
  });
  const f = a && typeof a._ == "function" ? a._(i, d, { message: r, formats: o }) : i, h = f ? Wl(f, p) : null;
  if (t === null || n === null)
    return h;
  const c = s || n0, u = {
    id: i,
    message: r,
    translation: h,
    children: h
    // for type-compatibility with `component` prop
  };
  if (t && n)
    console.error(
      "You can't use both `component` and `render` prop at the same time. `component` is ignored."
    );
  else if (t && typeof t != "function")
    console.error(
      `Invalid value supplied to prop \`render\`. It must be a function, provided ${t}`
    );
  else if (n && typeof n != "function")
    return console.error(
      `Invalid value supplied to prop \`component\`. It must be a React component, provided ${n}`
    ), le.createElement(c, u, h);
  if (typeof t == "function")
    return t(u);
  const l = n || c;
  return le.createElement(l, u, h);
}
const n0 = ({ children: e }) => /* @__PURE__ */ le.createElement(le.Fragment, null, e), Yl = le.createContext(null), i0 = (e) => {
  const t = le.useContext(Yl);
  if (process.env.NODE_ENV !== "production" && t == null)
    throw new Error(
      e ?? "useLingui hook was used without I18nProvider."
    );
  return t;
}, o0 = ({
  i18n: e,
  defaultComponent: t,
  children: n
}) => {
  const i = le.useRef(e.locale), r = le.useCallback(
    () => ({
      i18n: e,
      defaultComponent: t,
      _: e.t.bind(e)
    }),
    [e, t]
  ), [o, a] = le.useState(r());
  return le.useEffect(() => {
    const s = () => {
      i.current = e.locale, a(r());
    }, d = e.on("change", s);
    return i.current !== e.locale && s(), d;
  }, [e, r]), i.current ? /* @__PURE__ */ le.createElement(Yl.Provider, { value: o }, n) : (process.env.NODE_ENV === "development" && console.log(
    "I18nProvider rendered `null`. A call to `i18n.activate` needs to happen in order for translations to be activated and for the I18nProvider to render.This is not an error but an informational message logged only in development."
  ), null);
};
function de(e) {
  let t;
  process.env.NODE_ENV !== "production" && (t = `Trans component was rendered without I18nProvider.
Attempted to render message: ${e.message} id: ${e.id}. Make sure this component is rendered inside a I18nProvider.`);
  const n = i0(t);
  return le.createElement(r0, { ...e, lingui: n });
}
var a0 = Object.defineProperty, s0 = Object.defineProperties, u0 = Object.getOwnPropertyDescriptors, Dn = Object.getOwnPropertySymbols, Xl = Object.prototype.hasOwnProperty, Ql = Object.prototype.propertyIsEnumerable, Js = (e, t, n) => t in e ? a0(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, l0 = (e, t) => {
  for (var n in t || (t = {}))
    Xl.call(t, n) && Js(e, n, t[n]);
  if (Dn)
    for (var n of Dn(t))
      Ql.call(t, n) && Js(e, n, t[n]);
  return e;
}, c0 = (e, t) => s0(e, u0(t)), d0 = (e, t) => {
  var n = {};
  for (var i in e)
    Xl.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && Dn)
    for (var i of Dn(e))
      t.indexOf(i) < 0 && Ql.call(e, i) && (n[i] = e[i]);
  return n;
}, ec = Ze.forwardRef(
  (e, t) => {
    var n = e, { children: i, style: r } = n, o = d0(n, ["children", "style"]);
    return /* @__PURE__ */ w(
      "body",
      c0(l0({}, o), {
        style: {
          background: r?.background,
          backgroundColor: r?.backgroundColor
        },
        ref: t,
        children: /* @__PURE__ */ w(
          "table",
          {
            border: 0,
            width: "100%",
            cellPadding: "0",
            cellSpacing: "0",
            role: "presentation",
            align: "center",
            children: /* @__PURE__ */ w("tbody", { children: /* @__PURE__ */ w("tr", { children: /* @__PURE__ */ w("td", { style: r, children: i }) }) })
          }
        )
      })
    );
  }
);
ec.displayName = "Body";
var f0 = Object.defineProperty, p0 = Object.defineProperties, h0 = Object.getOwnPropertyDescriptors, Cn = Object.getOwnPropertySymbols, tc = Object.prototype.hasOwnProperty, rc = Object.prototype.propertyIsEnumerable, Vs = (e, t, n) => t in e ? f0(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, qs = (e, t) => {
  for (var n in t || (t = {}))
    tc.call(t, n) && Vs(e, n, t[n]);
  if (Cn)
    for (var n of Cn(t))
      rc.call(t, n) && Vs(e, n, t[n]);
  return e;
}, Ws = (e, t) => p0(e, h0(t)), m0 = (e, t) => {
  var n = {};
  for (var i in e)
    tc.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && Cn)
    for (var i of Cn(e))
      t.indexOf(i) < 0 && rc.call(e, i) && (n[i] = e[i]);
  return n;
};
function rn(e) {
  let t = 0;
  if (!e)
    return t;
  if (typeof e == "number")
    return e;
  const n = /^([\d.]+)(px|em|rem|%)$/.exec(e);
  if (n && n.length === 3) {
    const i = Number.parseFloat(n[1]);
    switch (n[2]) {
      case "px":
        return i;
      case "em":
      case "rem":
        return t = i * 16, t;
      case "%":
        return t = i / 100 * 600, t;
      default:
        return i;
    }
  }
  return 0;
}
function g0(e) {
  if (typeof e == "number")
    return {
      paddingTop: e,
      paddingBottom: e,
      paddingLeft: e,
      paddingRight: e
    };
  if (typeof e == "string") {
    const t = e.toString().trim().split(/\s+/);
    if (t.length === 1)
      return {
        paddingTop: t[0],
        paddingBottom: t[0],
        paddingLeft: t[0],
        paddingRight: t[0]
      };
    if (t.length === 2)
      return {
        paddingTop: t[0],
        paddingRight: t[1],
        paddingBottom: t[0],
        paddingLeft: t[1]
      };
    if (t.length === 3)
      return {
        paddingTop: t[0],
        paddingRight: t[1],
        paddingBottom: t[2],
        paddingLeft: t[1]
      };
    if (t.length === 4)
      return {
        paddingTop: t[0],
        paddingRight: t[1],
        paddingBottom: t[2],
        paddingLeft: t[3]
      };
  }
  return {
    paddingTop: void 0,
    paddingBottom: void 0,
    paddingLeft: void 0,
    paddingRight: void 0
  };
}
function v0(e) {
  let t, n, i, r;
  for (const [o, a] of Object.entries(e))
    o === "padding" ? { paddingTop: t, paddingBottom: i, paddingLeft: r, paddingRight: n } = g0(a) : o === "paddingTop" ? t = a : o === "paddingRight" ? n = a : o === "paddingBottom" ? i = a : o === "paddingLeft" && (r = a);
  return {
    paddingTop: t ? rn(t) : void 0,
    paddingRight: n ? rn(n) : void 0,
    paddingBottom: i ? rn(i) : void 0,
    paddingLeft: r ? rn(r) : void 0
  };
}
var Ks = (e) => typeof e == "number" && !Number.isNaN(Number(e)) ? e * 3 / 4 : void 0, $0 = 5;
function Ys(e) {
  if (e === 0) return [0, 0];
  let t = 0;
  const n = () => t > 0 ? e / t / 2 : Number.POSITIVE_INFINITY;
  for (; n() > $0; )
    t++;
  return [n(), t];
}
var nc = Ze.forwardRef(
  (e, t) => {
    var n = e, { children: i, style: r, target: o = "_blank" } = n, a = m0(n, ["children", "style", "target"]);
    const { paddingTop: s, paddingRight: d, paddingBottom: p, paddingLeft: f } = v0(r ?? {}), h = (s ?? 0) + (p ?? 0), c = Ks(h), [u, l] = Ys(
      f ?? 0
    ), [m, g] = Ys(
      d ?? 0
    );
    return /* @__PURE__ */ ie(
      "a",
      Ws(qs({}, a), {
        ref: t,
        style: Ws(qs({
          lineHeight: "100%",
          textDecoration: "none",
          display: "inline-block",
          maxWidth: "100%",
          msoPaddingAlt: "0px"
        }, r), {
          paddingTop: s,
          paddingRight: d,
          paddingBottom: p,
          paddingLeft: f
        }),
        target: o,
        children: [
          /* @__PURE__ */ w(
            "span",
            {
              dangerouslySetInnerHTML: {
                // The `&#8202;` is as close to `1px` of an empty character as we can get, then, we use the `mso-font-width`
                // to scale it according to what padding the developer wants. `mso-font-width` also does not allow for percentages
                // >= 500% so we need to add extra spaces accordingly.
                //
                // See https://github.com/resend/react-email/issues/1512 for why we do not use letter-spacing instead.
                __html: `<!--[if mso]><i style="mso-font-width:${u * 100}%;mso-text-raise:${c}" hidden>${"&#8202;".repeat(
                  l
                )}</i><![endif]-->`
              }
            }
          ),
          /* @__PURE__ */ w(
            "span",
            {
              style: {
                maxWidth: "100%",
                display: "inline-block",
                lineHeight: "120%",
                msoPaddingAlt: "0px",
                msoTextRaise: Ks(p)
              },
              children: i
            }
          ),
          /* @__PURE__ */ w(
            "span",
            {
              dangerouslySetInnerHTML: {
                __html: `<!--[if mso]><i style="mso-font-width:${m * 100}%" hidden>${"&#8202;".repeat(
                  g
                )}&#8203;</i><![endif]-->`
              }
            }
          )
        ]
      })
    );
  }
);
nc.displayName = "Button";
var st = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, _0 = Object.defineProperty, y0 = Object.defineProperties, b0 = Object.getOwnPropertyDescriptors, Un = Object.getOwnPropertySymbols, ic = Object.prototype.hasOwnProperty, oc = Object.prototype.propertyIsEnumerable, Xs = (e, t, n) => t in e ? _0(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, S0 = (e, t) => {
  for (var n in t || (t = {}))
    ic.call(t, n) && Xs(e, n, t[n]);
  if (Un)
    for (var n of Un(t))
      oc.call(t, n) && Xs(e, n, t[n]);
  return e;
}, k0 = (e, t) => y0(e, b0(t)), w0 = (e, t) => {
  var n = {};
  for (var i in e)
    ic.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && Un)
    for (var i of Un(e))
      t.indexOf(i) < 0 && oc.call(e, i) && (n[i] = e[i]);
  return n;
}, St = Ze.forwardRef(
  (e, t) => {
    var n = e, { children: i, style: r } = n, o = w0(n, ["children", "style"]);
    return /* @__PURE__ */ w("td", k0(S0({}, o), { "data-id": "__react-email-column", ref: t, style: r, children: i }));
  }
);
St.displayName = "Column";
var I0 = Object.defineProperty, x0 = Object.defineProperties, O0 = Object.getOwnPropertyDescriptors, Rn = Object.getOwnPropertySymbols, ac = Object.prototype.hasOwnProperty, sc = Object.prototype.propertyIsEnumerable, Qs = (e, t, n) => t in e ? I0(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, eu = (e, t) => {
  for (var n in t || (t = {}))
    ac.call(t, n) && Qs(e, n, t[n]);
  if (Rn)
    for (var n of Rn(t))
      sc.call(t, n) && Qs(e, n, t[n]);
  return e;
}, E0 = (e, t) => x0(e, O0(t)), P0 = (e, t) => {
  var n = {};
  for (var i in e)
    ac.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && Rn)
    for (var i of Rn(e))
      t.indexOf(i) < 0 && sc.call(e, i) && (n[i] = e[i]);
  return n;
}, ei = Ze.forwardRef(
  (e, t) => {
    var n = e, { children: i, style: r } = n, o = P0(n, ["children", "style"]);
    return /* @__PURE__ */ w(
      "table",
      E0(eu({
        align: "center",
        width: "100%"
      }, o), {
        border: 0,
        cellPadding: "0",
        cellSpacing: "0",
        ref: t,
        role: "presentation",
        style: eu({ maxWidth: "37.5em" }, r),
        children: /* @__PURE__ */ w("tbody", { children: /* @__PURE__ */ w("tr", { style: { width: "100%" }, children: /* @__PURE__ */ w("td", { children: i }) }) })
      })
    );
  }
);
ei.displayName = "Container";
var N0 = ({
  fontFamily: e,
  fallbackFontFamily: t,
  webFont: n,
  fontStyle: i = "normal",
  fontWeight: r = 400
}) => {
  const o = n ? `src: url(${n.url}) format('${n.format}');` : "", a = `
    @font-face {
      font-family: '${e}';
      font-style: ${i};
      font-weight: ${r};
      mso-font-alt: '${Array.isArray(t) ? t[0] : t}';
      ${o}
    }

    * {
      font-family: '${e}', ${Array.isArray(t) ? t.join(", ") : t};
    }
  `;
  return /* @__PURE__ */ w("style", { dangerouslySetInnerHTML: { __html: a } });
}, T0 = Object.defineProperty, z0 = Object.defineProperties, A0 = Object.getOwnPropertyDescriptors, Ln = Object.getOwnPropertySymbols, uc = Object.prototype.hasOwnProperty, lc = Object.prototype.propertyIsEnumerable, tu = (e, t, n) => t in e ? T0(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, D0 = (e, t) => {
  for (var n in t || (t = {}))
    uc.call(t, n) && tu(e, n, t[n]);
  if (Ln)
    for (var n of Ln(t))
      lc.call(t, n) && tu(e, n, t[n]);
  return e;
}, C0 = (e, t) => z0(e, A0(t)), U0 = (e, t) => {
  var n = {};
  for (var i in e)
    uc.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && Ln)
    for (var i of Ln(e))
      t.indexOf(i) < 0 && lc.call(e, i) && (n[i] = e[i]);
  return n;
}, To = Ze.forwardRef(
  (e, t) => {
    var n = e, { children: i } = n, r = U0(n, ["children"]);
    return /* @__PURE__ */ ie("head", C0(D0({}, r), { ref: t, children: [
      /* @__PURE__ */ w("meta", { content: "text/html; charset=UTF-8", httpEquiv: "Content-Type" }),
      /* @__PURE__ */ w("meta", { name: "x-apple-disable-message-reformatting" }),
      i
    ] }));
  }
);
To.displayName = "Head";
var R0 = Object.defineProperty, L0 = Object.defineProperties, j0 = Object.getOwnPropertyDescriptors, jn = Object.getOwnPropertySymbols, cc = Object.prototype.hasOwnProperty, dc = Object.prototype.propertyIsEnumerable, ru = (e, t, n) => t in e ? R0(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Jt = (e, t) => {
  for (var n in t || (t = {}))
    cc.call(t, n) && ru(e, n, t[n]);
  if (jn)
    for (var n of jn(t))
      dc.call(t, n) && ru(e, n, t[n]);
  return e;
}, fc = (e, t) => L0(e, j0(t)), M0 = (e, t) => {
  var n = {};
  for (var i in e)
    cc.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && jn)
    for (var i of jn(e))
      t.indexOf(i) < 0 && dc.call(e, i) && (n[i] = e[i]);
  return n;
}, Z0 = (e) => [
  vt(e.m, ["margin"]),
  vt(e.mx, ["marginLeft", "marginRight"]),
  vt(e.my, ["marginTop", "marginBottom"]),
  vt(e.mt, ["marginTop"]),
  vt(e.mr, ["marginRight"]),
  vt(e.mb, ["marginBottom"]),
  vt(e.ml, ["marginLeft"])
].filter((i) => Object.keys(i).length).reduce((i, r) => Jt(Jt({}, i), r), {}), vt = (e, t) => t.reduce((n, i) => isNaN(parseFloat(e)) ? n : fc(Jt({}, n), { [i]: `${e}px` }), {}), ti = Ze.forwardRef(
  (e, t) => {
    var n = e, { as: i = "h1", children: r, style: o, m: a, mx: s, my: d, mt: p, mr: f, mb: h, ml: c } = n, u = M0(n, ["as", "children", "style", "m", "mx", "my", "mt", "mr", "mb", "ml"]);
    return /* @__PURE__ */ w(
      i,
      fc(Jt({}, u), {
        ref: t,
        style: Jt(Jt({}, Z0({ m: a, mx: s, my: d, mt: p, mr: f, mb: h, ml: c })), o),
        children: r
      })
    );
  }
);
ti.displayName = "Heading";
var F0 = Object.defineProperty, B0 = Object.defineProperties, G0 = Object.getOwnPropertyDescriptors, Mn = Object.getOwnPropertySymbols, pc = Object.prototype.hasOwnProperty, hc = Object.prototype.propertyIsEnumerable, nu = (e, t, n) => t in e ? F0(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, H0 = (e, t) => {
  for (var n in t || (t = {}))
    pc.call(t, n) && nu(e, n, t[n]);
  if (Mn)
    for (var n of Mn(t))
      hc.call(t, n) && nu(e, n, t[n]);
  return e;
}, J0 = (e, t) => B0(e, G0(t)), V0 = (e, t) => {
  var n = {};
  for (var i in e)
    pc.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && Mn)
    for (var i of Mn(e))
      t.indexOf(i) < 0 && hc.call(e, i) && (n[i] = e[i]);
  return n;
}, zo = Ze.forwardRef(
  (e, t) => {
    var n = e, { children: i, lang: r = "en", dir: o = "ltr" } = n, a = V0(n, ["children", "lang", "dir"]);
    return /* @__PURE__ */ w("html", J0(H0({}, a), { dir: o, lang: r, ref: t, children: i }));
  }
);
zo.displayName = "Html";
var q0 = Object.defineProperty, W0 = Object.defineProperties, K0 = Object.getOwnPropertyDescriptors, Zn = Object.getOwnPropertySymbols, mc = Object.prototype.hasOwnProperty, gc = Object.prototype.propertyIsEnumerable, iu = (e, t, n) => t in e ? q0(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, ou = (e, t) => {
  for (var n in t || (t = {}))
    mc.call(t, n) && iu(e, n, t[n]);
  if (Zn)
    for (var n of Zn(t))
      gc.call(t, n) && iu(e, n, t[n]);
  return e;
}, Y0 = (e, t) => W0(e, K0(t)), X0 = (e, t) => {
  var n = {};
  for (var i in e)
    mc.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && Zn)
    for (var i of Zn(e))
      t.indexOf(i) < 0 && gc.call(e, i) && (n[i] = e[i]);
  return n;
}, ri = Ze.forwardRef(
  (e, t) => {
    var n = e, { alt: i, src: r, width: o, height: a, style: s } = n, d = X0(n, ["alt", "src", "width", "height", "style"]);
    return /* @__PURE__ */ w(
      "img",
      Y0(ou({}, d), {
        alt: i,
        height: a,
        ref: t,
        src: r,
        style: ou({
          display: "block",
          outline: "none",
          border: "none",
          textDecoration: "none"
        }, s),
        width: o
      })
    );
  }
);
ri.displayName = "Img";
var Q0 = Object.defineProperty, eg = Object.defineProperties, tg = Object.getOwnPropertyDescriptors, Fn = Object.getOwnPropertySymbols, vc = Object.prototype.hasOwnProperty, $c = Object.prototype.propertyIsEnumerable, au = (e, t, n) => t in e ? Q0(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, su = (e, t) => {
  for (var n in t || (t = {}))
    vc.call(t, n) && au(e, n, t[n]);
  if (Fn)
    for (var n of Fn(t))
      $c.call(t, n) && au(e, n, t[n]);
  return e;
}, rg = (e, t) => eg(e, tg(t)), ng = (e, t) => {
  var n = {};
  for (var i in e)
    vc.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && Fn)
    for (var i of Fn(e))
      t.indexOf(i) < 0 && $c.call(e, i) && (n[i] = e[i]);
  return n;
}, _c = Ze.forwardRef(
  (e, t) => {
    var n = e, { target: i = "_blank", style: r } = n, o = ng(n, ["target", "style"]);
    return /* @__PURE__ */ w(
      "a",
      rg(su({}, o), {
        ref: t,
        style: su({
          color: "#067df7",
          textDecorationLine: "none"
        }, r),
        target: i,
        children: o.children
      })
    );
  }
);
_c.displayName = "Link";
var ig = Object.defineProperty, og = Object.defineProperties, ag = Object.getOwnPropertyDescriptors, Bn = Object.getOwnPropertySymbols, yc = Object.prototype.hasOwnProperty, bc = Object.prototype.propertyIsEnumerable, uu = (e, t, n) => t in e ? ig(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, sg = (e, t) => {
  for (var n in t || (t = {}))
    yc.call(t, n) && uu(e, n, t[n]);
  if (Bn)
    for (var n of Bn(t))
      bc.call(t, n) && uu(e, n, t[n]);
  return e;
}, ug = (e, t) => og(e, ag(t)), lg = (e, t) => {
  var n = {};
  for (var i in e)
    yc.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && Bn)
    for (var i of Bn(e))
      t.indexOf(i) < 0 && bc.call(e, i) && (n[i] = e[i]);
  return n;
}, ni = Ze.forwardRef(
  (e, t) => {
    var n = e, { children: i, style: r } = n, o = lg(n, ["children", "style"]);
    return /* @__PURE__ */ w(
      "table",
      ug(sg({
        align: "center",
        width: "100%",
        border: 0,
        cellPadding: "0",
        cellSpacing: "0",
        role: "presentation"
      }, o), {
        ref: t,
        style: r,
        children: /* @__PURE__ */ w("tbody", { style: { width: "100%" }, children: /* @__PURE__ */ w("tr", { style: { width: "100%" }, children: i }) })
      })
    );
  }
);
ni.displayName = "Row";
var cg = Object.defineProperty, dg = Object.defineProperties, fg = Object.getOwnPropertyDescriptors, Gn = Object.getOwnPropertySymbols, Sc = Object.prototype.hasOwnProperty, kc = Object.prototype.propertyIsEnumerable, lu = (e, t, n) => t in e ? cg(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, pr = (e, t) => {
  for (var n in t || (t = {}))
    Sc.call(t, n) && lu(e, n, t[n]);
  if (Gn)
    for (var n of Gn(t))
      kc.call(t, n) && lu(e, n, t[n]);
  return e;
}, pg = (e, t) => dg(e, fg(t)), hg = (e, t) => {
  var n = {};
  for (var i in e)
    Sc.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && Gn)
    for (var i of Gn(e))
      t.indexOf(i) < 0 && kc.call(e, i) && (n[i] = e[i]);
  return n;
};
function mg(e) {
  if (typeof e == "number")
    return {
      marginTop: e,
      marginBottom: e,
      marginLeft: e,
      marginRight: e
    };
  if (typeof e == "string") {
    const t = e.toString().trim().split(/\s+/);
    if (t.length === 1)
      return {
        marginTop: t[0],
        marginBottom: t[0],
        marginLeft: t[0],
        marginRight: t[0]
      };
    if (t.length === 2)
      return {
        marginTop: t[0],
        marginRight: t[1],
        marginBottom: t[0],
        marginLeft: t[1]
      };
    if (t.length === 3)
      return {
        marginTop: t[0],
        marginRight: t[1],
        marginBottom: t[2],
        marginLeft: t[1]
      };
    if (t.length === 4)
      return {
        marginTop: t[0],
        marginRight: t[1],
        marginBottom: t[2],
        marginLeft: t[3]
      };
  }
  return {
    marginTop: void 0,
    marginBottom: void 0,
    marginLeft: void 0,
    marginRight: void 0
  };
}
function gg(e) {
  let t = {
    marginTop: void 0,
    marginRight: void 0,
    marginBottom: void 0,
    marginLeft: void 0
  };
  for (const [n, i] of Object.entries(e))
    n === "margin" ? t = mg(i) : n === "marginTop" ? t.marginTop = i : n === "marginRight" ? t.marginRight = i : n === "marginBottom" ? t.marginBottom = i : n === "marginLeft" && (t.marginLeft = i);
  return t;
}
var Er = Ze.forwardRef(
  (e, t) => {
    var n = e, { style: i } = n, r = hg(n, ["style"]);
    const o = {};
    i?.marginTop === void 0 && (o.marginTop = "16px"), i?.marginBottom === void 0 && (o.marginBottom = "16px");
    const a = gg(pr(pr({}, o), i));
    return /* @__PURE__ */ w(
      "p",
      pg(pr({}, r), {
        ref: t,
        style: pr(pr({
          fontSize: "14px",
          lineHeight: "24px"
        }, i), a)
      })
    );
  }
);
Er.displayName = "Text";
const $t = {
  gray60: "#333333",
  gray50: "#666666",
  gray35: "#b3b3b3",
  gray20: "#ebebeb",
  gray15: "#f1f1f1",
  gray0: "#ffffff"
}, vg = {
  blue40: "#5e90f2"
}, V = {
  font: {
    colors: {
      highlighted: $t.gray60,
      primary: $t.gray50,
      tertiary: $t.gray35,
      inverted: $t.gray0,
      blue: vg.blue40
    },
    family: "Trebuchet MS",
    weight: {
      regular: 400,
      bold: 600
    },
    size: {
      sm: "12px",
      md: "13px",
      lg: "16px",
      xl: "24px"
    },
    lineHeight: "20px"
  },
  border: {
    radius: {
      sm: "4px",
      md: "8px"
    },
    color: {
      highlighted: $t.gray20
    }
  },
  background: {
    colors: {
      highlight: $t.gray15
    },
    button: $t.gray60,
    transparent: {
      medium: "rgba(0, 0, 0, 0.08)",
      light: "rgba(0, 0, 0, 0.04)"
    }
  }
}, $g = () => /* @__PURE__ */ ie(To, {
  children: [
    /* @__PURE__ */ w("title", {
      children: "Twenty email"
    }),
    /* @__PURE__ */ w(N0, {
      fontFamily: V.font.family,
      fallbackFontFamily: "sans-serif",
      fontStyle: "normal",
      fontWeight: V.font.weight.regular
    })
  ]
}), _g = {
  textDecoration: "underline"
}, kt = ({ value: e, href: t, color: n }) => /* @__PURE__ */ w(_c, {
  href: t,
  style: {
    ..._g,
    color: n ?? V.font.colors.tertiary
  },
  children: e
}), yg = {
  fontSize: V.font.size.sm,
  fontWeight: V.font.weight.regular,
  color: V.font.colors.tertiary,
  margin: "0 0 12px 0",
  lineHeight: V.font.lineHeight
}, hr = ({ children: e }) => /* @__PURE__ */ w(Er, {
  style: yg,
  children: e
}), bg = {
  marginTop: "12px"
}, Sg = ({ i18n: e }) => /* @__PURE__ */ ie(ei, {
  style: bg,
  children: [
    /* @__PURE__ */ ie(ni, {
      children: [
        /* @__PURE__ */ w(St, {
          children: /* @__PURE__ */ w(hr, {
            children: /* @__PURE__ */ w(kt, {
              href: "https://twenty.com/",
              value: e._("Website"),
              "aria-label": e._("Visit Twenty's website")
            })
          })
        }),
        /* @__PURE__ */ w(St, {
          children: /* @__PURE__ */ w(hr, {
            children: /* @__PURE__ */ w(kt, {
              href: "https://github.com/twentyhq/twenty",
              value: e._("Github"),
              "aria-label": e._("Visit Twenty's GitHub repository")
            })
          })
        }),
        /* @__PURE__ */ w(St, {
          children: /* @__PURE__ */ w(hr, {
            children: /* @__PURE__ */ w(kt, {
              href: "https://docs.twenty.com/getting-started/introduction",
              value: e._("User guide"),
              "aria-label": e._("Read Twenty's user guide")
            })
          })
        }),
        /* @__PURE__ */ w(St, {
          children: /* @__PURE__ */ w(hr, {
            children: /* @__PURE__ */ w(kt, {
              href: "https://docs.twenty.com/",
              value: e._("Developers"),
              "aria-label": e._("Visit Twenty's developer documentation")
            })
          })
        })
      ]
    }),
    /* @__PURE__ */ w(hr, {
      children: /* @__PURE__ */ ie(je, {
        children: [
          e._("Twenty.com, Public Benefit Corporation"),
          /* @__PURE__ */ w("br", {}),
          e._("San Francisco / Paris")
        ]
      })
    })
  ]
}), kg = {
  marginBottom: "40px"
}, wg = () => /* @__PURE__ */ w(ri, {
  src: "https://app.twenty.com/images/icons/windows11/Square150x150Logo.scale-100.png",
  alt: "Twenty logo",
  width: "40",
  height: "40",
  style: kg
}), Ao = "en";
var Mt = {}, nn = {}, vo = { exports: {} }, Ig = vo.exports, cu;
function xg() {
  return cu || (cu = 1, (function(e) {
    (function(t, n) {
      e.exports ? e.exports = n() : t.moo = n();
    })(Ig, function() {
      var t = Object.prototype.hasOwnProperty, n = Object.prototype.toString, i = typeof new RegExp().sticky == "boolean";
      function r(b) {
        return b && n.call(b) === "[object RegExp]";
      }
      function o(b) {
        return b && typeof b == "object" && !r(b) && !Array.isArray(b);
      }
      function a(b) {
        return b.replace(/[-\/\\^$*+?.()|[\]{}]/g, function(k) {
          return k === "-" ? "\\x2d" : "\\" + k;
        });
      }
      function s(b) {
        var k = new RegExp("|" + b);
        return k.exec("").length - 1;
      }
      function d(b) {
        return "(" + b + ")";
      }
      function p(b) {
        if (!b.length) return "(?!)";
        var k = b.map(function(E) {
          return "(?:" + E + ")";
        }).join("|");
        return "(?:" + k + ")";
      }
      function f(b) {
        if (typeof b == "string")
          return "(?:" + a(b) + ")";
        if (r(b)) {
          if (b.ignoreCase) throw new Error("RegExp /i flag not allowed");
          if (b.global) throw new Error("RegExp /g flag is implied");
          if (b.sticky) throw new Error("RegExp /y flag is implied");
          if (b.multiline) throw new Error("RegExp /m flag is implied");
          return b.source;
        } else
          throw new Error("Not a pattern: " + b);
      }
      function h(b, k) {
        return b.length > k ? b : Array(k - b.length + 1).join(" ") + b;
      }
      function c(b, k) {
        for (var E = b.length, z = 0; ; ) {
          var R = b.lastIndexOf(`
`, E - 1);
          if (R === -1 || (z++, E = R, z === k) || E === 0)
            break;
        }
        var U = z < k ? 0 : E + 1;
        return b.substring(U).split(`
`);
      }
      function u(b) {
        for (var k = Object.getOwnPropertyNames(b), E = [], z = 0; z < k.length; z++) {
          var R = k[z], U = b[R], F = [].concat(U);
          if (R === "include") {
            for (var X = 0; X < F.length; X++)
              E.push({ include: F[X] });
            continue;
          }
          var K = [];
          F.forEach(function(B) {
            o(B) ? (K.length && E.push(m(R, K)), E.push(m(R, B)), K = []) : K.push(B);
          }), K.length && E.push(m(R, K));
        }
        return E;
      }
      function l(b) {
        for (var k = [], E = 0; E < b.length; E++) {
          var z = b[E];
          if (z.include) {
            for (var R = [].concat(z.include), U = 0; U < R.length; U++)
              k.push({ include: R[U] });
            continue;
          }
          if (!z.type)
            throw new Error("Rule has no type: " + JSON.stringify(z));
          k.push(m(z.type, z));
        }
        return k;
      }
      function m(b, k) {
        if (o(k) || (k = { match: k }), k.include)
          throw new Error("Matching rules cannot also include states");
        var E = {
          defaultType: b,
          lineBreaks: !!k.error || !!k.fallback,
          pop: !1,
          next: null,
          push: null,
          error: !1,
          fallback: !1,
          value: null,
          type: null,
          shouldThrow: !1
        };
        for (var z in k)
          t.call(k, z) && (E[z] = k[z]);
        if (typeof E.type == "string" && b !== E.type)
          throw new Error("Type transform cannot be a string (type '" + E.type + "' for token '" + b + "')");
        var R = E.match;
        return E.match = Array.isArray(R) ? R : R ? [R] : [], E.match.sort(function(U, F) {
          return r(U) && r(F) ? 0 : r(F) ? -1 : r(U) ? 1 : F.length - U.length;
        }), E;
      }
      function g(b) {
        return Array.isArray(b) ? l(b) : u(b);
      }
      var v = m("error", { lineBreaks: !0, shouldThrow: !0 });
      function _(b, k) {
        for (var E = null, z = /* @__PURE__ */ Object.create(null), R = !0, U = null, F = [], X = [], K = 0; K < b.length; K++)
          b[K].fallback && (R = !1);
        for (var K = 0; K < b.length; K++) {
          var B = b[K];
          if (B.include)
            throw new Error("Inheritance is not allowed in stateless lexers");
          if (B.error || B.fallback) {
            if (E)
              throw !B.fallback == !E.fallback ? new Error("Multiple " + (B.fallback ? "fallback" : "error") + " rules not allowed (for token '" + B.defaultType + "')") : new Error("fallback and error are mutually exclusive (for token '" + B.defaultType + "')");
            E = B;
          }
          var se = B.match.slice();
          if (R)
            for (; se.length && typeof se[0] == "string" && se[0].length === 1; ) {
              var it = se.shift();
              z[it.charCodeAt(0)] = B;
            }
          if (B.pop || B.push || B.next) {
            if (!k)
              throw new Error("State-switching options are not allowed in stateless lexers (for token '" + B.defaultType + "')");
            if (B.fallback)
              throw new Error("State-switching options are not allowed on fallback tokens (for token '" + B.defaultType + "')");
          }
          if (se.length !== 0) {
            R = !1, F.push(B);
            for (var Pe = 0; Pe < se.length; Pe++) {
              var qe = se[Pe];
              if (r(qe)) {
                if (U === null)
                  U = qe.unicode;
                else if (U !== qe.unicode && B.fallback === !1)
                  throw new Error("If one rule is /u then all must be");
              }
            }
            var ot = p(se.map(f)), we = new RegExp(ot);
            if (we.test(""))
              throw new Error("RegExp matches empty string: " + we);
            var mt = s(ot);
            if (mt > 0)
              throw new Error("RegExp has capture groups: " + we + `
Use (?: … ) instead`);
            if (!B.lineBreaks && we.test(`
`))
              throw new Error("Rule should declare lineBreaks: " + we);
            X.push(d(ot));
          }
        }
        var at = E && E.fallback, gt = i && !at ? "ym" : "gm", jt = i || at ? "" : "|";
        U === !0 && (gt += "u");
        var to = new RegExp(p(X) + jt, gt);
        return { regexp: to, groups: F, fast: z, error: E || v };
      }
      function x(b) {
        var k = _(g(b));
        return new I({ start: k }, "start");
      }
      function y(b, k, E) {
        var z = b && (b.push || b.next);
        if (z && !E[z])
          throw new Error("Missing state '" + z + "' (in token '" + b.defaultType + "' of state '" + k + "')");
        if (b && b.pop && +b.pop != 1)
          throw new Error("pop must be 1 (in token '" + b.defaultType + "' of state '" + k + "')");
      }
      function $(b, k) {
        var E = b.$all ? g(b.$all) : [];
        delete b.$all;
        var z = Object.getOwnPropertyNames(b);
        k || (k = z[0]);
        for (var R = /* @__PURE__ */ Object.create(null), U = 0; U < z.length; U++) {
          var F = z[U];
          R[F] = g(b[F]).concat(E);
        }
        for (var U = 0; U < z.length; U++)
          for (var F = z[U], X = R[F], K = /* @__PURE__ */ Object.create(null), B = 0; B < X.length; B++) {
            var se = X[B];
            if (se.include) {
              var it = [B, 1];
              if (se.include !== F && !K[se.include]) {
                K[se.include] = !0;
                var Pe = R[se.include];
                if (!Pe)
                  throw new Error("Cannot include nonexistent state '" + se.include + "' (in state '" + F + "')");
                for (var qe = 0; qe < Pe.length; qe++) {
                  var ot = Pe[qe];
                  X.indexOf(ot) === -1 && it.push(ot);
                }
              }
              X.splice.apply(X, it), B--;
            }
          }
        for (var we = /* @__PURE__ */ Object.create(null), U = 0; U < z.length; U++) {
          var F = z[U];
          we[F] = _(R[F], !0);
        }
        for (var U = 0; U < z.length; U++) {
          for (var mt = z[U], at = we[mt], gt = at.groups, B = 0; B < gt.length; B++)
            y(gt[B], mt, we);
          for (var jt = Object.getOwnPropertyNames(at.fast), B = 0; B < jt.length; B++)
            y(at.fast[jt[B]], mt, we);
        }
        return new I(we, k);
      }
      function O(b) {
        for (var k = typeof Map < "u", E = k ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null), z = Object.getOwnPropertyNames(b), R = 0; R < z.length; R++) {
          var U = z[R], F = b[U], X = Array.isArray(F) ? F : [F];
          X.forEach(function(K) {
            if (typeof K != "string")
              throw new Error("keyword must be string (in keyword '" + U + "')");
            k ? E.set(K, U) : E[K] = U;
          });
        }
        return function(K) {
          return k ? E.get(K) : E[K];
        };
      }
      var I = function(b, k) {
        this.startState = k, this.states = b, this.buffer = "", this.stack = [], this.reset();
      };
      I.prototype.reset = function(b, k) {
        return this.buffer = b || "", this.index = 0, this.line = k ? k.line : 1, this.col = k ? k.col : 1, this.queuedToken = k ? k.queuedToken : null, this.queuedText = k ? k.queuedText : "", this.queuedThrow = k ? k.queuedThrow : null, this.setState(k ? k.state : this.startState), this.stack = k && k.stack ? k.stack.slice() : [], this;
      }, I.prototype.save = function() {
        return {
          line: this.line,
          col: this.col,
          state: this.state,
          stack: this.stack.slice(),
          queuedToken: this.queuedToken,
          queuedText: this.queuedText,
          queuedThrow: this.queuedThrow
        };
      }, I.prototype.setState = function(b) {
        if (!(!b || this.state === b)) {
          this.state = b;
          var k = this.states[b];
          this.groups = k.groups, this.error = k.error, this.re = k.regexp, this.fast = k.fast;
        }
      }, I.prototype.popState = function() {
        this.setState(this.stack.pop());
      }, I.prototype.pushState = function(b) {
        this.stack.push(this.state), this.setState(b);
      };
      var D = i ? function(b, k) {
        return b.exec(k);
      } : function(b, k) {
        var E = b.exec(k);
        return E[0].length === 0 ? null : E;
      };
      I.prototype._getGroup = function(b) {
        for (var k = this.groups.length, E = 0; E < k; E++)
          if (b[E + 1] !== void 0)
            return this.groups[E];
        throw new Error("Cannot find token type for matched text");
      };
      function L() {
        return this.value;
      }
      if (I.prototype.next = function() {
        var b = this.index;
        if (this.queuedGroup) {
          var k = this._token(this.queuedGroup, this.queuedText, b);
          return this.queuedGroup = null, this.queuedText = "", k;
        }
        var E = this.buffer;
        if (b !== E.length) {
          var F = this.fast[E.charCodeAt(b)];
          if (F)
            return this._token(F, E.charAt(b), b);
          var z = this.re;
          z.lastIndex = b;
          var R = D(z, E), U = this.error;
          if (R == null)
            return this._token(U, E.slice(b, E.length), b);
          var F = this._getGroup(R), X = R[0];
          return U.fallback && R.index !== b ? (this.queuedGroup = F, this.queuedText = X, this._token(U, E.slice(b, R.index), b)) : this._token(F, X, b);
        }
      }, I.prototype._token = function(b, k, E) {
        var z = 0;
        if (b.lineBreaks) {
          var R = /\n/g, U = 1;
          if (k === `
`)
            z = 1;
          else
            for (; R.exec(k); )
              z++, U = R.lastIndex;
        }
        var F = {
          type: typeof b.type == "function" && b.type(k) || b.defaultType,
          value: typeof b.value == "function" ? b.value(k) : k,
          text: k,
          toString: L,
          offset: E,
          lineBreaks: z,
          line: this.line,
          col: this.col
        }, X = k.length;
        if (this.index += X, this.line += z, z !== 0 ? this.col = X - U + 1 : this.col += X, b.shouldThrow) {
          var K = new Error(this.formatError(F, "invalid syntax"));
          throw K;
        }
        return b.pop ? this.popState() : b.push ? this.pushState(b.push) : b.next && this.setState(b.next), F;
      }, typeof Symbol < "u" && Symbol.iterator) {
        var M = function(b) {
          this.lexer = b;
        };
        M.prototype.next = function() {
          var b = this.lexer.next();
          return { value: b, done: !b };
        }, M.prototype[Symbol.iterator] = function() {
          return this;
        }, I.prototype[Symbol.iterator] = function() {
          return new M(this);
        };
      }
      return I.prototype.formatError = function(z, k) {
        if (z == null)
          var E = this.buffer.slice(this.index), z = {
            text: E,
            offset: this.index,
            lineBreaks: E.indexOf(`
`) === -1 ? 0 : 1,
            line: this.line,
            col: this.col
          };
        var R = 2, U = Math.max(z.line - R, 1), F = z.line + R, X = String(F).length, K = c(
          this.buffer,
          this.line - z.line + R + 1
        ).slice(0, 5), B = [];
        B.push(k + " at line " + z.line + " col " + z.col + ":"), B.push("");
        for (var se = 0; se < K.length; se++) {
          var it = K[se], Pe = U + se;
          B.push(h(String(Pe), X) + "  " + it), Pe === z.line && B.push(h("", X + z.col + 1) + "^");
        }
        return B.join(`
`);
      }, I.prototype.clone = function() {
        return new I(this.states, this.state);
      }, I.prototype.has = function(b) {
        return !0;
      }, {
        compile: x,
        states: $,
        error: Object.freeze({ error: !0 }),
        fallback: Object.freeze({ fallback: !0 }),
        keywords: O
      };
    });
  })(vo)), vo.exports;
}
var du;
function Og() {
  return du || (du = 1, (function(e) {
    var t = nn && nn.__importDefault || function(i) {
      return i && i.__esModule ? i : { default: i };
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.lexer = e.states = void 0;
    const n = t(xg());
    e.states = {
      body: {
        doubleapos: { match: "''", value: () => "'" },
        quoted: {
          lineBreaks: !0,
          match: /'[{}#](?:[^']|'')*'(?!')/u,
          value: (i) => i.slice(1, -1).replace(/''/g, "'")
        },
        argument: {
          lineBreaks: !0,
          match: /\{\s*[^\p{Pat_Syn}\p{Pat_WS}]+\s*/u,
          push: "arg",
          value: (i) => i.substring(1).trim()
        },
        octothorpe: "#",
        end: { match: "}", pop: 1 },
        content: { lineBreaks: !0, match: /[^][^{}#']*/u }
      },
      arg: {
        select: {
          lineBreaks: !0,
          match: /,\s*(?:plural|select|selectordinal)\s*,\s*/u,
          next: "select",
          value: (i) => i.split(",")[1].trim()
        },
        "func-args": {
          lineBreaks: !0,
          match: /,\s*[^\p{Pat_Syn}\p{Pat_WS}]+\s*,/u,
          next: "body",
          value: (i) => i.split(",")[1].trim()
        },
        "func-simple": {
          lineBreaks: !0,
          match: /,\s*[^\p{Pat_Syn}\p{Pat_WS}]+\s*/u,
          value: (i) => i.substring(1).trim()
        },
        end: { match: "}", pop: 1 }
      },
      select: {
        offset: {
          lineBreaks: !0,
          match: /\s*offset\s*:\s*\d+\s*/u,
          value: (i) => i.split(":")[1].trim()
        },
        case: {
          lineBreaks: !0,
          match: /\s*(?:=\d+|[^\p{Pat_Syn}\p{Pat_WS}]+)\s*\{/u,
          push: "body",
          value: (i) => i.substring(0, i.indexOf("{")).trim()
        },
        end: { match: /\s*\}/u, pop: 1 }
      }
    }, e.lexer = n.default.states(e.states);
  })(nn)), nn;
}
var fu;
function Eg() {
  if (fu) return Mt;
  fu = 1, Object.defineProperty(Mt, "__esModule", { value: !0 }), Mt.ParseError = void 0, Mt.parse = d;
  const e = Og(), t = (p) => ({
    offset: p.offset,
    line: p.line,
    col: p.col,
    text: p.text,
    lineBreaks: p.lineBreaks
  }), n = (p) => p === "plural" || p === "select" || p === "selectordinal";
  function i(p, f) {
    let h = "", c = "";
    for (const u of f) {
      const l = u.ctx.text;
      switch (c += l, u.type) {
        case "content":
          h += u.value;
          break;
        case "argument":
        case "function":
        case "octothorpe":
          h += l;
          break;
        default:
          throw new a(p, `Unsupported part in strict mode function arg style: ${l}`);
      }
    }
    return [{
      type: "content",
      value: h.trim(),
      ctx: Object.assign({}, f[0].ctx, { text: c })
    }];
  }
  const r = [
    "number",
    "date",
    "time",
    "spellout",
    "ordinal",
    "duration"
  ], o = ["zero", "one", "two", "few", "many", "other"];
  class a extends Error {
    /** @internal */
    constructor(f, h) {
      super(e.lexer.formatError(f, h));
    }
  }
  Mt.ParseError = a;
  class s {
    constructor(f, h) {
      var c, u, l, m;
      this.lexer = e.lexer.reset(f), this.cardinalKeys = (c = h?.cardinal) !== null && c !== void 0 ? c : o, this.ordinalKeys = (u = h?.ordinal) !== null && u !== void 0 ? u : o, this.strict = (l = h?.strict) !== null && l !== void 0 ? l : !1, this.strictPluralKeys = (m = h?.strictPluralKeys) !== null && m !== void 0 ? m : !0;
    }
    parse() {
      return this.parseBody(!1, !0);
    }
    checkSelectKey(f, h, c) {
      if (c[0] === "=") {
        if (h === "select")
          throw new a(f, `The case ${c} is not valid with select`);
      } else if (h !== "select") {
        const u = h === "plural" ? this.cardinalKeys : this.ordinalKeys;
        if (this.strictPluralKeys && u.length > 0 && !u.includes(c)) {
          const l = `The ${h} case ${c} is not valid in this locale`;
          throw new a(f, l);
        }
      }
    }
    parseSelect({ value: f }, h, c, u) {
      const l = { type: u, arg: f, cases: [], ctx: c };
      u === "plural" || u === "selectordinal" ? h = !0 : this.strict && (h = !1);
      for (const m of this.lexer)
        switch (m.type) {
          case "offset":
            if (u === "select")
              throw new a(m, "Unexpected plural offset for select");
            if (l.cases.length > 0)
              throw new a(m, "Plural offset must be set before cases");
            l.pluralOffset = Number(m.value), c.text += m.text, c.lineBreaks += m.lineBreaks;
            break;
          case "case": {
            this.checkSelectKey(m, u, m.value), l.cases.push({
              key: m.value,
              tokens: this.parseBody(h),
              ctx: t(m)
            });
            break;
          }
          case "end":
            return l;
          /* istanbul ignore next: never happens */
          default:
            throw new a(m, `Unexpected lexer token: ${m.type}`);
        }
      throw new a(null, "Unexpected message end");
    }
    parseArgToken(f, h) {
      const c = t(f), u = this.lexer.next();
      if (!u)
        throw new a(null, "Unexpected message end");
      if (c.text += u.text, c.lineBreaks += u.lineBreaks, this.strict && (u.type === "func-simple" || u.type === "func-args") && !r.includes(u.value)) {
        const l = `Invalid strict mode function arg type: ${u.value}`;
        throw new a(f, l);
      }
      switch (u.type) {
        case "end":
          return { type: "argument", arg: f.value, ctx: c };
        case "func-simple": {
          const l = this.lexer.next();
          if (!l)
            throw new a(null, "Unexpected message end");
          if (l.type !== "end")
            throw new a(l, `Unexpected lexer token: ${l.type}`);
          if (c.text += l.text, n(u.value.toLowerCase()))
            throw new a(u, `Invalid type identifier: ${u.value}`);
          return {
            type: "function",
            arg: f.value,
            key: u.value,
            ctx: c
          };
        }
        case "func-args": {
          if (n(u.value.toLowerCase())) {
            const m = `Invalid type identifier: ${u.value}`;
            throw new a(u, m);
          }
          let l = this.parseBody(this.strict ? !1 : h);
          return this.strict && l.length > 0 && (l = i(f, l)), {
            type: "function",
            arg: f.value,
            key: u.value,
            param: l,
            ctx: c
          };
        }
        case "select":
          if (n(u.value))
            return this.parseSelect(f, h, c, u.value);
          throw new a(u, `Unexpected select type ${u.value}`);
        /* istanbul ignore next: never happens */
        default:
          throw new a(u, `Unexpected lexer token: ${u.type}`);
      }
    }
    parseBody(f, h) {
      const c = [];
      let u = null;
      for (const l of this.lexer)
        if (l.type === "argument")
          u && (u = null), c.push(this.parseArgToken(l, f));
        else if (l.type === "octothorpe" && f)
          u && (u = null), c.push({ type: "octothorpe", ctx: t(l) });
        else {
          if (l.type === "end" && !h)
            return c;
          {
            let m = l.value;
            if (!f && l.type === "quoted" && m[0] === "#") {
              if (m.includes("{")) {
                const g = `Unsupported escape pattern: ${m}`;
                throw new a(l, g);
              }
              m = l.text;
            }
            u ? (u.value += m, u.ctx.text += l.text, u.ctx.lineBreaks += l.lineBreaks) : (u = { type: "content", value: m, ctx: t(l) }, c.push(u));
          }
        }
      if (h)
        return c;
      throw new a(null, "Unexpected message end");
    }
  }
  function d(p, f = {}) {
    return new s(p, f).parse();
  }
  return Mt;
}
var Pg = Eg();
let yt = class extends Error {
  /** @internal */
  constructor(t, n, i) {
    super(t), this.token = n, this.type = i || "error";
  }
};
const wc = (e) => e < 4 ? "short" : e === 4 ? "long" : "narrow", yr = (e) => e % 2 === 0 ? "2-digit" : "numeric";
function Ng(e, t) {
  switch (e.char) {
    case "y":
      return { year: yr(e.width) };
    case "r":
      return { calendar: "gregory", year: "numeric" };
    default:
      return t(`${e.desc} is not supported; falling back to year:numeric`, yt.WARNING), { year: "numeric" };
  }
}
function Tg(e, t) {
  switch (e.width) {
    case 1:
      return "numeric";
    case 2:
      return "2-digit";
    case 3:
      return "short";
    case 4:
      return "long";
    case 5:
      return "narrow";
    default:
      t(`${e.desc} is not supported with width ${e.width}`);
      return;
  }
}
function zg(e, t) {
  const { char: n, desc: i, width: r } = e;
  if (n === "d")
    return yr(r);
  t(`${i} is not supported`);
}
function Ag(e, t) {
  const { char: n, desc: i, width: r } = e;
  if ((n === "c" || n === "e") && r < 3) {
    const o = `Numeric value is not supported for ${i}; falling back to weekday:short`;
    t(o, yt.WARNING);
  }
  return wc(r);
}
function Dg(e) {
  const t = yr(e.width);
  let n;
  switch (e.char) {
    case "h":
      n = "h12";
      break;
    case "H":
      n = "h23";
      break;
    case "k":
      n = "h24";
      break;
    case "K":
      n = "h11";
      break;
  }
  return n ? { hour: t, hourCycle: n } : { hour: t };
}
function Cg(e, t) {
  const { char: n, desc: i, width: r } = e;
  switch (n) {
    case "v":
    case "z":
      return r === 4 ? "long" : "short";
    case "V":
      if (r === 4)
        return "long";
      t(`${i} is not supported with width ${r}`);
      return;
    case "X":
      t(`${i} is not supported`);
      return;
  }
  return "short";
}
function Ug(e, t) {
  switch (e.field) {
    case "era":
      return { era: wc(e.width) };
    case "year":
      return Ng(e, t);
    case "month":
      return { month: Tg(e, t) };
    case "day":
      return { day: zg(e, t) };
    case "weekday":
      return { weekday: Ag(e, t) };
    case "period":
      return;
    case "hour":
      return Dg(e);
    case "min":
      return { minute: yr(e.width) };
    case "sec":
      return { second: yr(e.width) };
    case "tz":
      return { timeZoneName: Cg(e, t) };
    case "quarter":
    case "week":
    case "sec-frac":
    case "ms":
      t(`${e.desc} is not supported`);
  }
}
function Rg(e, t, n = (i) => {
  throw i;
}) {
  const i = {
    timeZone: t
  }, r = [];
  for (const o of e) {
    const { error: a, field: s, str: d } = o;
    if (a) {
      const f = new yt(a.message, o);
      f.stack = a.stack, n(f);
    }
    if (d) {
      const f = `Ignoring string part: ${d}`;
      n(new yt(f, o, yt.WARNING));
    }
    s && (r.indexOf(s) === -1 ? r.push(s) : n(new yt(`Duplicate ${s} token`, o)));
    const p = Ug(o, (f, h) => n(new yt(f, o, h)));
    p && Object.assign(i, p);
  }
  return i;
}
const Lg = {
  G: { field: "era", desc: "Era" },
  y: { field: "year", desc: "Year" },
  Y: { field: "year", desc: 'Year of "Week of Year"' },
  u: { field: "year", desc: "Extended year" },
  U: { field: "year", desc: "Cyclic year name" },
  r: { field: "year", desc: "Related Gregorian year" },
  Q: { field: "quarter", desc: "Quarter" },
  q: { field: "quarter", desc: "Stand-alone quarter" },
  M: { field: "month", desc: "Month in year" },
  L: { field: "month", desc: "Stand-alone month in year" },
  w: { field: "week", desc: "Week of year" },
  W: { field: "week", desc: "Week of month" },
  d: { field: "day", desc: "Day in month" },
  D: { field: "day", desc: "Day of year" },
  F: { field: "day", desc: "Day of week in month" },
  g: { field: "day", desc: "Modified julian day" },
  E: { field: "weekday", desc: "Day of week" },
  e: { field: "weekday", desc: "Local day of week" },
  c: { field: "weekday", desc: "Stand-alone local day of week" },
  a: { field: "period", desc: "AM/PM marker" },
  b: { field: "period", desc: "AM/PM/noon/midnight marker" },
  B: { field: "period", desc: "Flexible day period" },
  h: { field: "hour", desc: "Hour in AM/PM (1~12)" },
  H: { field: "hour", desc: "Hour in day (0~23)" },
  k: { field: "hour", desc: "Hour in day (1~24)" },
  K: { field: "hour", desc: "Hour in AM/PM (0~11)" },
  j: { field: "hour", desc: "Hour in preferred cycle" },
  J: { field: "hour", desc: "Hour in preferred cycle without marker" },
  C: { field: "hour", desc: "Hour in preferred cycle with flexible marker" },
  m: { field: "min", desc: "Minute in hour" },
  s: { field: "sec", desc: "Second in minute" },
  S: { field: "sec-frac", desc: "Fractional second" },
  A: { field: "ms", desc: "Milliseconds in day" },
  z: { field: "tz", desc: "Time Zone: specific non-location" },
  Z: { field: "tz", desc: "Time Zone" },
  O: { field: "tz", desc: "Time Zone: localized" },
  v: { field: "tz", desc: "Time Zone: generic non-location" },
  V: { field: "tz", desc: "Time Zone: ID" },
  X: { field: "tz", desc: "Time Zone: ISO8601 with Z" },
  x: { field: "tz", desc: "Time Zone: ISO8601" }
}, pu = (e) => e >= "A" && e <= "Z" || e >= "a" && e <= "z";
function jg(e, t) {
  const n = e[t];
  let i = 1;
  for (; e[++t] === n; )
    ++i;
  const r = Lg[n];
  if (!r) {
    const o = `The letter ${n} is not a valid field identifier`;
    return { char: n, error: new Error(o), width: i };
  }
  return { char: n, field: r.field, desc: r.desc, width: i };
}
function Mg(e, t) {
  let n = e[++t], i = 2;
  if (n === "'")
    return { char: "'", str: n, width: i };
  for (; ; ) {
    const r = e[++t];
    if (++i, r === void 0) {
      const o = `Unterminated quoted literal in pattern: ${n || e}`;
      return { char: "'", error: new Error(o), str: n, width: i };
    } else if (r === "'") {
      if (e[++t] !== "'")
        return { char: "'", str: n, width: i };
      ++i;
    }
    n += r;
  }
}
function Zg(e, t) {
  const n = e[t];
  if (!n)
    return null;
  if (pu(n))
    return jg(e, t);
  if (n === "'")
    return Mg(e, t);
  let i = n, r = 1;
  for (; ; ) {
    const o = e[++t];
    if (!o || pu(o) || o === "'")
      return { char: n, str: i, width: r };
    i += o, r += 1;
  }
}
function Fg(e) {
  const t = [];
  let n = 0;
  for (; ; ) {
    const i = Zg(e, n);
    if (!i)
      return t;
    t.push(i), n += i.width;
  }
}
function Ic(e, t) {
  return e.filter((n) => n.type !== "content").length ? e.map((n) => {
    if (n.type === "content")
      return t(n.value);
    if (n.type === "octothorpe")
      return "#";
    if (n.type === "argument")
      return [n.arg];
    if (n.type === "function") {
      const o = n?.param?.[0];
      if (n.key === "date" && o) {
        const a = Bg(o.value.trim(), (s) => {
          throw new Error(`Unable to compile date expression: ${s.message}`);
        });
        return [n.arg, n.key, a];
      }
      return o ? [n.arg, n.key, o.value.trim()] : [n.arg, n.key];
    }
    const i = n.pluralOffset, r = {};
    return n.cases.forEach(({ key: o, tokens: a }) => {
      const s = o[0] === "=" ? o.slice(1) : o;
      r[s] = Ic(a, t);
    }), [
      n.arg,
      n.type,
      {
        offset: i,
        ...r
      }
    ];
  }) : e.map((n) => t(n.value));
}
function Bg(e, t) {
  if (/^::/.test(e)) {
    const n = Fg(e.substring(2));
    return Rg(n, void 0, t);
  }
  return e;
}
function Gg(e, t = (n) => n) {
  return Ic(Pg.parse(e), t);
}
function Hg(e, t = (n) => n) {
  try {
    return Gg(e, t);
  } catch (n) {
    return console.error(`${n.message} 

Message: ${e}`), [e];
  }
}
const ut = (e) => typeof e == "string", Jg = (e) => typeof e == "function", hu = /* @__PURE__ */ new Map(), xc = "en";
function Do(e) {
  return [...Array.isArray(e) ? e : [e], xc];
}
function Co(e, t, n) {
  const i = Do(e);
  n || (n = "default");
  let r;
  if (typeof n == "string")
    switch (r = {
      day: "numeric",
      month: "short",
      year: "numeric"
    }, n) {
      case "full":
        r.weekday = "long";
      case "long":
        r.month = "long";
        break;
      case "short":
        r.month = "numeric";
        break;
    }
  else
    r = n;
  return Hn(
    () => Jn("date", i, n),
    () => new Intl.DateTimeFormat(i, r)
  ).format(ut(t) ? new Date(t) : t);
}
function Vg(e, t, n) {
  let i;
  if (n || (n = "default"), typeof n == "string")
    switch (i = {
      second: "numeric",
      minute: "numeric",
      hour: "numeric"
    }, n) {
      case "full":
      case "long":
        i.timeZoneName = "short";
        break;
      case "short":
        delete i.second;
    }
  else
    i = n;
  return Co(e, t, i);
}
function $o(e, t, n) {
  const i = Do(e);
  return Hn(
    () => Jn("number", i, n),
    () => new Intl.NumberFormat(i, n)
  ).format(t);
}
function mu(e, t, n, { offset: i = 0, ...r }) {
  const o = Do(e), a = t ? Hn(
    () => Jn("plural-ordinal", o),
    () => new Intl.PluralRules(o, { type: "ordinal" })
  ) : Hn(
    () => Jn("plural-cardinal", o),
    () => new Intl.PluralRules(o, { type: "cardinal" })
  );
  return r[n] ?? r[a.select(n - i)] ?? r.other;
}
function Hn(e, t) {
  const n = e();
  let i = hu.get(n);
  return i || (i = t(), hu.set(n, i)), i;
}
function Jn(e, t, n) {
  const i = t.join("-");
  return `${e}-${i}-${JSON.stringify(n)}`;
}
const Oc = /\\u[a-fA-F0-9]{4}|\\x[a-fA-F0-9]{2}/, Ec = (e) => e.replace(
  // Same pattern but with capturing groups for extracting values during replacement
  /\\u([a-fA-F0-9]{4})|\\x([a-fA-F0-9]{2})/g,
  (t, n, i) => {
    if (n) {
      const r = parseInt(n, 16);
      return String.fromCharCode(r);
    } else {
      const r = parseInt(i, 16);
      return String.fromCharCode(r);
    }
  }
), Pc = "%__lingui_octothorpe__%", qg = (e, t, n = {}) => {
  const i = t || e, r = (a) => typeof a == "object" ? a : n[a], o = (a, s) => {
    const d = Object.keys(n).length ? r("number") : void 0, p = $o(i, a, d);
    return s.replace(new RegExp(Pc, "g"), p);
  };
  return {
    plural: (a, s) => {
      const { offset: d = 0 } = s, p = mu(i, !1, a, s);
      return o(a - d, p);
    },
    selectordinal: (a, s) => {
      const { offset: d = 0 } = s, p = mu(i, !0, a, s);
      return o(a - d, p);
    },
    select: Wg,
    number: (a, s) => $o(
      i,
      a,
      r(s) || { style: s }
    ),
    date: (a, s) => Co(i, a, r(s) || s),
    time: (a, s) => Vg(i, a, r(s) || s)
  };
}, Wg = (e, t) => t[e] ?? t.other;
function Kg(e, t, n) {
  return (i = {}, r) => {
    const o = qg(t, n, r), a = (d, p = !1) => Array.isArray(d) ? d.reduce((f, h) => {
      if (h === "#" && p)
        return f + Pc;
      if (ut(h))
        return f + h;
      const [c, u, l] = h;
      let m = {};
      u === "plural" || u === "selectordinal" || u === "select" ? Object.entries(l).forEach(
        ([v, _]) => {
          m[v] = a(
            _,
            u === "plural" || u === "selectordinal"
          );
        }
      ) : m = l;
      let g;
      if (u) {
        const v = o[u];
        g = v(i[c], m);
      } else
        g = i[c];
      return g == null ? f : f + g;
    }, "") : d, s = a(e);
    return ut(s) && Oc.test(s) ? Ec(s) : ut(s) ? s : s ? String(s) : "";
  };
}
var Yg = Object.defineProperty, Xg = (e, t, n) => t in e ? Yg(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Qg = (e, t, n) => (Xg(e, t + "", n), n);
class ev {
  constructor() {
    Qg(this, "_events", {});
  }
  on(t, n) {
    var i;
    return (i = this._events)[t] ?? (i[t] = []), this._events[t].push(n), () => this.removeListener(t, n);
  }
  removeListener(t, n) {
    const i = this._getListeners(t);
    if (!i)
      return;
    const r = i.indexOf(n);
    ~r && i.splice(r, 1);
  }
  emit(t, ...n) {
    const i = this._getListeners(t);
    i && i.map((r) => r.apply(this, n));
  }
  _getListeners(t) {
    const n = this._events[t];
    return Array.isArray(n) ? n : !1;
  }
}
var tv = Object.defineProperty, rv = (e, t, n) => t in e ? tv(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, _t = (e, t, n) => (rv(e, typeof t != "symbol" ? t + "" : t, n), n);
class nv extends ev {
  constructor(t) {
    super(), _t(this, "_locale", ""), _t(this, "_locales"), _t(this, "_localeData", {}), _t(this, "_messages", {}), _t(this, "_missing"), _t(this, "_messageCompiler"), _t(this, "t", this._.bind(this)), process.env.NODE_ENV !== "production" && this.setMessagesCompiler(Hg), t.missing != null && (this._missing = t.missing), t.messages != null && this.load(t.messages), t.localeData != null && this.loadLocaleData(t.localeData), (typeof t.locale == "string" || t.locales) && this.activate(t.locale ?? xc, t.locales);
  }
  get locale() {
    return this._locale;
  }
  get locales() {
    return this._locales;
  }
  get messages() {
    return this._messages[this._locale] ?? {};
  }
  /**
   * @deprecated this has no effect. Please remove this from the code. Deprecated in v4
   */
  get localeData() {
    return this._localeData[this._locale] ?? {};
  }
  _loadLocaleData(t, n) {
    const i = this._localeData[t];
    i ? Object.assign(i, n) : this._localeData[t] = n;
  }
  /**
   * Registers a `MessageCompiler` to enable the use of uncompiled catalogs at runtime.
   *
   * In production builds, the `MessageCompiler` is typically excluded to reduce bundle size.
   * By default, message catalogs should be precompiled during the build process. However,
   * if you need to compile catalogs at runtime, you can use this method to set a message compiler.
   *
   * Example usage:
   *
   * ```ts
   * import { compileMessage } from "@lingui/message-utils/compileMessage";
   *
   * i18n.setMessagesCompiler(compileMessage);
   * ```
   */
  setMessagesCompiler(t) {
    return this._messageCompiler = t, this;
  }
  /**
   * @deprecated Plurals automatically used from Intl.PluralRules you can safely remove this call. Deprecated in v4
   */
  loadLocaleData(t, n) {
    typeof t == "string" ? this._loadLocaleData(t, n) : Object.keys(t).forEach(
      (i) => this._loadLocaleData(i, t[i])
    ), this.emit("change");
  }
  _load(t, n) {
    const i = this._messages[t];
    i ? Object.assign(i, n) : this._messages[t] = n;
  }
  load(t, n) {
    typeof t == "string" && typeof n == "object" ? this._load(t, n) : Object.entries(t).forEach(
      ([i, r]) => this._load(i, r)
    ), this.emit("change");
  }
  /**
   * @param options {@link LoadAndActivateOptions}
   */
  loadAndActivate({ locale: t, locales: n, messages: i }) {
    this._locale = t, this._locales = n || void 0, this._messages[this._locale] = i, this.emit("change");
  }
  activate(t, n) {
    process.env.NODE_ENV !== "production" && (this._messages[t] || console.warn(`Messages for locale "${t}" not loaded.`)), this._locale = t, this._locales = n, this.emit("change");
  }
  _(t, n, i) {
    if (!this.locale)
      throw new Error(
        "Lingui: Attempted to call a translation function without setting a locale.\nMake sure to call `i18n.activate(locale)` before using Lingui functions.\nThis issue may also occur due to a race condition in your initialization logic."
      );
    let r = i?.message;
    t || (t = ""), ut(t) || (n = t.values || n, r = t.message, t = t.id);
    const o = this.messages[t], a = o === void 0, s = this._missing;
    if (s && a)
      return Jg(s) ? s(this._locale, t) : s;
    a && this.emit("missing", { id: t, locale: this._locale });
    let d = o || r || t;
    return ut(d) && (this._messageCompiler ? d = this._messageCompiler(d) : console.warn(`Uncompiled message detected! Message:

> ${d}

That means you use raw catalog or your catalog doesn't have a translation for the message and fallback was used.
ICU features such as interpolation and plurals will not work properly for that message. 

Please compile your catalog first. 
`)), ut(d) && Oc.test(d) ? Ec(d) : ut(d) ? d : Kg(
      d,
      this._locale,
      this._locales
    )(n, i?.formats);
  }
  date(t, n) {
    return Co(this._locales || this._locale, t, n);
  }
  number(t, n) {
    return $o(this._locales || this._locale, t, n);
  }
}
function Nc(e = {}) {
  return new nv(e);
}
Nc();
const iv = (e) => {
  const t = {};
  return (n) => {
    const i = t[n];
    if (i !== void 0)
      return i;
    const r = e[Ao] ?? {}, o = e[n] ?? r, a = Nc();
    return a.load(n, o), a.activate(n), t[n] = a, a;
  };
}, ov = {
  en: E2,
  "pseudo-en": M2,
  "af-ZA": b2,
  "ar-SA": S2,
  "ca-ES": k2,
  "cs-CZ": w2,
  "da-DK": I2,
  "de-DE": x2,
  "el-GR": O2,
  "es-ES": P2,
  "fi-FI": N2,
  "fr-FR": T2,
  "he-IL": z2,
  "hu-HU": A2,
  "it-IT": D2,
  "ja-JP": C2,
  "ko-KR": U2,
  "nl-NL": R2,
  "no-NO": L2,
  "pl-PL": j2,
  "pt-BR": Z2,
  "pt-PT": F2,
  "ro-RO": B2,
  "ru-RU": G2,
  "sr-Cyrl": H2,
  "sv-SE": J2,
  "tr-TR": V2,
  "uk-UA": q2,
  "vi-VN": W2,
  "zh-CN": K2,
  "zh-TW": Y2
}, ft = iv(ov), Nt = ({ children: e, width: t, locale: n }) => {
  const i = ft(n);
  return /* @__PURE__ */ w(o0, {
    i18n: i,
    children: /* @__PURE__ */ ie(zo, {
      lang: n,
      children: [
        /* @__PURE__ */ w($g, {}),
        /* @__PURE__ */ ie(ei, {
          width: t || 290,
          children: [
            /* @__PURE__ */ w(wg, {}),
            e,
            /* @__PURE__ */ w(Sg, {
              i18n: i
            })
          ]
        })
      ]
    })
  });
}, av = {
  display: "inline-flex",
  padding: "8px 32px",
  borderRadius: V.border.radius.md,
  border: `1px solid ${V.background.transparent.light}`,
  background: V.background.button,
  boxShadow: `0px 2px 4px 0px ${V.background.transparent.light}, 0px 0px 4px 0px ${V.background.transparent.medium}`,
  color: V.font.colors.inverted,
  fontSize: V.font.size.md,
  fontWeight: V.font.weight.bold,
  width: "auto"
}, Tt = ({ value: e, href: t }) => /* @__PURE__ */ w(nc, {
  href: t,
  style: av,
  children: e
}), sv = {
  fontFamily: V.font.family,
  fontSize: V.font.size.md,
  fontWeight: V.font.weight.regular,
  color: V.font.colors.primary,
  lineHeight: V.font.lineHeight
}, pt = ({ children: e }) => /* @__PURE__ */ w(Er, {
  style: sv,
  children: e
}), uv = {
  fontFamily: V.font.family,
  fontSize: V.font.size.xl,
  fontWeight: V.font.weight.bold,
  color: V.font.colors.highlighted
}, zt = ({ value: e }) => /* @__PURE__ */ w(ti, {
  style: uv,
  as: "h1",
  children: e
}), lv = ({ daysSinceInactive: e, userName: t, workspaceDisplayName: n, locale: i }) => {
  const r = ft(i);
  return /* @__PURE__ */ ie(Nt, {
    width: 333,
    locale: i,
    children: [
      /* @__PURE__ */ w(zt, {
        value: r._("Deleted Workspace")
      }),
      /* @__PURE__ */ ie(pt, {
        children: [
          t?.length > 1 ? /* @__PURE__ */ w(de, {
            id: "Dear {userName},",
            values: {
              userName: t
            }
          }) : /* @__PURE__ */ w(de, {
            id: "Hello,"
          }),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w(de, {
            id: "Your workspace <0>{workspaceDisplayName}</0> has been deleted as your subscription expired {daysSinceInactive} days ago.",
            values: {
              workspaceDisplayName: n,
              daysSinceInactive: e
            },
            components: {
              0: /* @__PURE__ */ w("b", {})
            }
          }),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w(de, {
            id: "All data in this workspace has been permanently deleted."
          }),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w(de, {
            id: "If you wish to use Twenty again, you can create a new workspace."
          })
        ]
      }),
      /* @__PURE__ */ w("br", {}),
      /* @__PURE__ */ w(Tt, {
        href: "https://app.twenty.com/",
        value: r._("Create a new workspace")
      }),
      /* @__PURE__ */ w("br", {}),
      /* @__PURE__ */ w("br", {})
    ]
  });
};
lv.PreviewProps = {
  daysSinceInactive: 1,
  userName: "John Doe",
  workspaceDisplayName: "My Workspace",
  locale: "en"
};
const cv = ({ duration: e, hasPassword: t, link: n, locale: i }) => {
  const r = ft(i), o = t ? r._("Reset your password 🗝") : r._("Set your password 🗝"), a = t ? r._("Reset") : r._("Set");
  return /* @__PURE__ */ ie(Nt, {
    locale: i,
    children: [
      /* @__PURE__ */ w(zt, {
        value: o
      }),
      /* @__PURE__ */ ie(pt, {
        children: [
          /* @__PURE__ */ w(de, {
            id: "This link is only valid for the next {duration}. If the link does not work, you can use the login verification link directly:",
            values: {
              duration: e
            }
          }),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w(kt, {
            href: n,
            value: n
          })
        ]
      }),
      /* @__PURE__ */ w("br", {}),
      /* @__PURE__ */ w(Tt, {
        href: n,
        value: a
      }),
      /* @__PURE__ */ w("br", {}),
      /* @__PURE__ */ w("br", {})
    ]
  });
};
cv.PreviewProps = {
  duration: "24 hours",
  hasPassword: !0,
  link: "https://app.twenty.com/reset-password/123",
  locale: "en"
};
const dv = ({ userName: e, email: t, link: n, locale: i }) => {
  const r = ft(i), o = r.date(/* @__PURE__ */ new Date());
  return /* @__PURE__ */ ie(Nt, {
    locale: i,
    children: [
      /* @__PURE__ */ w(zt, {
        value: r._("Password updated")
      }),
      /* @__PURE__ */ ie(pt, {
        children: [
          e?.length > 1 ? /* @__PURE__ */ w(de, {
            id: "Dear {userName},",
            values: {
              userName: e
            }
          }) : /* @__PURE__ */ w(de, {
            id: "Hello,"
          }),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w(de, {
            id: "This is a confirmation that password for your account ({email}) was successfully changed on {formattedDate}.",
            values: {
              email: t,
              formattedDate: o
            }
          }),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w(de, {
            id: "If you did not initiate this change, please contact your workspace owner immediately."
          }),
          /* @__PURE__ */ w("br", {})
        ]
      }),
      /* @__PURE__ */ w("br", {}),
      /* @__PURE__ */ w(Tt, {
        value: r._("Connect to Twenty"),
        href: n
      }),
      /* @__PURE__ */ w("br", {}),
      /* @__PURE__ */ w("br", {})
    ]
  });
};
dv.PreviewProps = {
  userName: "John Doe",
  email: "john.doe@example.com",
  link: "https://app.twenty.com",
  locale: "en"
};
const fv = ({ link: e, locale: t, isEmailUpdate: n = !1 }) => {
  const i = ft(t), r = n ? i._("Confirm your new email address") : i._("Confirm your email address"), o = n ? "We received a request to change the email address associated with your Twenty account. Click below to confirm this change." : "Thanks for registering for an account on Twenty! Before we get started, we just need to confirm that this is you. Click below to verify your email address.", a = n ? i._("Confirm new email") : i._("Verify Email");
  return /* @__PURE__ */ ie(Nt, {
    width: 333,
    locale: t,
    children: [
      /* @__PURE__ */ w(zt, {
        value: r
      }),
      /* @__PURE__ */ w(pt, {
        children: /* @__PURE__ */ w(de, {
          id: o
        })
      }),
      /* @__PURE__ */ w("br", {}),
      /* @__PURE__ */ w(Tt, {
        href: e,
        value: a
      }),
      /* @__PURE__ */ w("br", {}),
      /* @__PURE__ */ w("br", {})
    ]
  });
};
fv.PreviewProps = {
  link: "https://app.twenty.com/verify-email/123",
  locale: "en",
  isEmailUpdate: !1
};
const pv = {
  background: V.background.colors.highlight,
  border: `1px solid ${V.border.color.highlighted}`,
  borderRadius: V.border.radius.md,
  padding: "24px 48px"
}, Tc = ({ children: e }) => /* @__PURE__ */ w(ei, {
  style: pv,
  children: le.Children.map(e, (t) => /* @__PURE__ */ w(ni, {
    children: /* @__PURE__ */ w(St, {
      align: "center",
      children: t
    })
  }))
}), hv = {
  borderRadius: V.border.radius.sm,
  background: V.background.colors.highlight,
  padding: "4px 8px",
  fontSize: V.font.size.lg,
  fontWeight: V.font.weight.bold,
  color: V.font.colors.highlighted
}, zc = ({ value: e }) => /* @__PURE__ */ w(Er, {
  style: hv,
  children: e
}), mv = {
  fontFamily: V.font.family,
  fontSize: V.font.size.lg,
  fontWeight: V.font.weight.bold,
  color: V.font.colors.highlighted
}, gv = ({ value: e }) => /* @__PURE__ */ w(ti, {
  style: mv,
  as: "h3",
  children: e
}), vv = ({ i18n: e }) => /* @__PURE__ */ ie(je, {
  children: [
    /* @__PURE__ */ w(gv, {
      value: e._("What is Twenty?")
    }),
    /* @__PURE__ */ w(pt, {
      children: e._("It's a CRM, a software to help businesses manage their customer data and relationships efficiently.")
    })
  ]
});
var Ue = {}, ro = {}, ve = {}, gu;
function _o() {
  if (gu) return ve;
  gu = 1, Object.defineProperty(ve, "__esModule", { value: !0 }), ve.isSymbol = ve.isBigInt = ve.isString = ve.isNumber = ve.isBoolean = ve.isUndefined = void 0;
  const e = (a) => typeof a > "u";
  ve.isUndefined = e;
  const t = (a) => typeof a == "boolean";
  ve.isBoolean = t;
  const n = (a) => typeof a == "number" && !Number.isNaN(a);
  ve.isNumber = n;
  const i = (a) => typeof a == "string";
  ve.isString = i;
  const r = (a) => typeof a == "bigint";
  ve.isBigInt = r;
  const o = (a) => typeof a == "symbol";
  return ve.isSymbol = o, ve;
}
var no = {}, vu;
function yo() {
  return vu || (vu = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.isDate = e.isWeakSet = e.isWeakMap = e.isSet = e.isMap = e.isArray = e.isObject = e.isFunction = e.isNull = void 0;
    const t = (f) => f === null;
    e.isNull = t;
    const n = (f) => typeof f == "function";
    e.isFunction = n;
    const i = (f) => !e.isNull(f) && typeof f == "object";
    e.isObject = i;
    const r = (f) => Array.isArray(f);
    e.isArray = r;
    const o = (f) => f instanceof Map;
    e.isMap = o;
    const a = (f) => f instanceof Set;
    e.isSet = a;
    const s = (f) => f instanceof WeakMap;
    e.isWeakMap = s;
    const d = (f) => f instanceof WeakSet;
    e.isWeakSet = d;
    const p = (f) => f instanceof Date;
    e.isDate = p;
  })(no)), no;
}
var $u;
function _u() {
  return $u || ($u = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.isNegativeInteger = e.isNonNegativeInteger = e.isPositiveInteger = e.isInteger = e.isNumberOrNaN = e.isNonEmptyString = e.isNonEmptyArray = e.isObjectOrNull = void 0;
    const t = _o(), n = yo(), i = (h) => typeof h == "object";
    e.isObjectOrNull = i;
    const r = (h) => n.isArray(h) && h.length > 0;
    e.isNonEmptyArray = r;
    const o = (h) => t.isString(h) && h.length > 0;
    e.isNonEmptyString = o;
    const a = (h) => typeof h == "number";
    e.isNumberOrNaN = a;
    const s = (h) => t.isNumber(h) && Number.isInteger(h);
    e.isInteger = s;
    const d = (h) => e.isInteger(h) && h > 0;
    e.isPositiveInteger = d;
    const p = (h) => e.isInteger(h) && h >= 0;
    e.isNonNegativeInteger = p;
    const f = (h) => e.isInteger(h) && h < 0;
    e.isNegativeInteger = f;
  })(ro)), ro;
}
var yu;
function $v() {
  return yu || (yu = 1, (function(e) {
    var t = Ue && Ue.__createBinding || (Object.create ? (function(o, a, s, d) {
      d === void 0 && (d = s), Object.defineProperty(o, d, { enumerable: !0, get: function() {
        return a[s];
      } });
    }) : (function(o, a, s, d) {
      d === void 0 && (d = s), o[d] = a[s];
    })), n = Ue && Ue.__setModuleDefault || (Object.create ? (function(o, a) {
      Object.defineProperty(o, "default", { enumerable: !0, value: a });
    }) : function(o, a) {
      o.default = a;
    }), i = Ue && Ue.__importStar || function(o) {
      if (o && o.__esModule) return o;
      var a = {};
      if (o != null) for (var s in o) s !== "default" && Object.prototype.hasOwnProperty.call(o, s) && t(a, o, s);
      return n(a, o), a;
    }, r = Ue && Ue.__exportStar || function(o, a) {
      for (var s in o) s !== "default" && !Object.prototype.hasOwnProperty.call(a, s) && t(a, o, s);
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.structural = e.primitives = e.convenience = void 0, e.convenience = i(_u()), r(_u(), e), e.primitives = i(_o()), r(_o(), e), e.structural = i(yo()), r(yo(), e);
  })(Ue)), Ue;
}
var He = $v();
const Ac = (e) => He.isNonEmptyString(e) ? e[0].toUpperCase() + e.slice(1) : "", Me = (e) => !He.isUndefined(e) && !He.isNull(e);
var Ne = "INUMBER", ar = "IOP1", sr = "IOP2", ur = "IOP3", Qe = "IVAR", xt = "IVARNAME", qt = "IFUNCALL", ii = "IFUNDEF", Se = "IEXPR", Uo = "IEXPREVAL", At = "IMEMBER", oi = "IENDSTATEMENT", Wt = "IARRAY";
function W(e, t) {
  this.type = e, this.value = t ?? 0;
}
W.prototype.toString = function() {
  switch (this.type) {
    case Ne:
    case ar:
    case sr:
    case ur:
    case Qe:
    case xt:
    case oi:
      return this.value;
    case qt:
      return "CALL " + this.value;
    case ii:
      return "DEF " + this.value;
    case Wt:
      return "ARRAY " + this.value;
    case At:
      return "." + this.value;
    default:
      return "Invalid Instruction";
  }
};
function ai(e) {
  return new W(ar, e);
}
function rt(e) {
  return new W(sr, e);
}
function Dc(e) {
  return new W(ur, e);
}
function bo(e, t, n, i, r) {
  for (var o = [], a = [], s, d, p, f, h = 0; h < e.length; h++) {
    var c = e[h], u = c.type;
    if (u === Ne || u === xt)
      Array.isArray(c.value) ? o.push.apply(o, bo(c.value.map(function(l) {
        return new W(Ne, l);
      }).concat(new W(Wt, c.value.length)), t, n, i, r)) : o.push(c);
    else if (u === Qe && Object.hasOwn(r, c.value))
      c = new W(Ne, r[c.value]), o.push(c);
    else if (u === sr && o.length > 1)
      d = o.pop(), s = o.pop(), f = n[c.value], c = new W(Ne, f(s.value, d.value)), o.push(c);
    else if (u === ur && o.length > 2)
      p = o.pop(), d = o.pop(), s = o.pop(), c.value === "?" ? o.push(s.value ? d.value : p.value) : (f = i[c.value], c = new W(Ne, f(s.value, d.value, p.value)), o.push(c));
    else if (u === ar && o.length > 0)
      s = o.pop(), f = t[c.value], c = new W(Ne, f(s.value)), o.push(c);
    else if (u === Se) {
      for (; o.length > 0; )
        a.push(o.shift());
      a.push(new W(Se, bo(c.value, t, n, i, r)));
    } else if (u === At && o.length > 0)
      s = o.pop(), o.push(new W(Ne, s.value[c.value]));
    else {
      for (; o.length > 0; )
        a.push(o.shift());
      a.push(c);
    }
  }
  for (; o.length > 0; )
    a.push(o.shift());
  return a;
}
function Cc(e, t, n) {
  for (var i = [], r = 0; r < e.length; r++) {
    var o = e[r], a = o.type;
    if (a === Qe && o.value === t)
      for (var s = 0; s < n.tokens.length; s++) {
        var d = n.tokens[s], p;
        d.type === ar ? p = ai(d.value) : d.type === sr ? p = rt(d.value) : d.type === ur ? p = Dc(d.value) : p = new W(d.type, d.value), i.push(p);
      }
    else a === Se ? i.push(new W(Se, Cc(o.value, t, n))) : i.push(o);
  }
  return i;
}
function io(e, t, n) {
  if (Object.values(t.functions).includes(e)) return !0;
  for (const r of Object.values(n))
    if (typeof r == "object" && r !== null) {
      for (const o of Object.values(r))
        if (o === e) {
          const a = Object.freeze({
            abs: Math.abs,
            acos: Math.acos,
            asin: Math.asin,
            atan: Math.atan,
            atan2: Math.atan2,
            ceil: Math.ceil,
            clz32: Math.clz32,
            cos: Math.cos,
            exp: Math.exp,
            floor: Math.floor,
            imul: Math.imul,
            fround: Math.fround,
            f16round: Math.f16round,
            log: Math.log,
            max: Math.max,
            min: Math.min,
            pow: Math.pow,
            random: Math.random,
            round: Math.round,
            sin: Math.sin,
            sqrt: Math.sqrt,
            tan: Math.tan,
            log10: Math.log10,
            log2: Math.log2,
            log1p: Math.log1p,
            expm1: Math.expm1,
            cosh: Math.cosh,
            sinh: Math.sinh,
            tanh: Math.tanh,
            acosh: Math.acosh,
            asinh: Math.asinh,
            atanh: Math.atanh,
            hypot: Math.hypot,
            trunc: Math.trunc,
            sign: Math.sign,
            cbrt: Math.cbrt
          });
          for (var i of Object.getOwnPropertyNames(a))
            if (a[i] === o) return !0;
          return Object.values(t.functions).includes(o);
        }
    }
  return !1;
}
function bt(e, t, n) {
  var i = [], r, o, a, s, d, p;
  if (Ro(e))
    return Ke(e, n);
  for (var f = e.length, h = 0; h < f; h++) {
    var c = e[h], u = c.type;
    if (u === Ne || u === xt)
      i.push(c.value);
    else if (u === sr)
      o = i.pop(), r = i.pop(), c.value === "and" ? i.push(r ? !!bt(o, t, n) : !1) : c.value === "or" ? i.push(r ? !0 : !!bt(o, t, n)) : c.value === "=" ? (s = t.binaryOps[c.value], i.push(s(r, bt(o, t, n), n))) : (s = t.binaryOps[c.value], i.push(s(Ke(r, n), Ke(o, n))));
    else if (u === ur)
      a = i.pop(), o = i.pop(), r = i.pop(), c.value === "?" ? i.push(bt(r ? o : a, t, n)) : (s = t.ternaryOps[c.value], i.push(s(Ke(r, n), Ke(o, n), Ke(a, n))));
    else if (u === Qe) {
      if (/^__proto__|prototype|constructor$/.test(c.value))
        throw new Error("prototype access detected");
      if (c.value in t.functions)
        i.push(t.functions[c.value]);
      else if (c.value in t.unaryOps && t.parser.isOperatorEnabled(c.value))
        i.push(t.unaryOps[c.value]);
      else {
        var l = n[c.value];
        if (l !== void 0) {
          if (typeof l == "function" && !io(l, t, n))
            throw new Error("Variable references an unallowed function: " + c.value);
          i.push(l);
        } else
          throw new Error("undefined variable: " + c.value);
      }
    } else if (u === ar)
      r = i.pop(), s = t.unaryOps[c.value], i.push(s(Ke(r, n)));
    else if (u === qt) {
      for (p = c.value, d = []; p-- > 0; )
        d.unshift(Ke(i.pop(), n));
      if (s = i.pop(), !io(s, t, n))
        throw new Error("Is not an allowed function.");
      if (s.apply && s.call)
        i.push(s.apply(void 0, d));
      else
        throw new Error(s + " is not a function");
    } else if (u === ii)
      i.push((function() {
        for (var m = i.pop(), g = [], v = c.value; v-- > 0; )
          g.unshift(i.pop());
        var _ = i.pop(), x = function() {
          for (var y = Object.assign({}, n), $ = 0, O = g.length; $ < O; $++)
            y[g[$]] = arguments[$];
          return bt(m, t, y);
        };
        return t.functions["lambda_" + t.functions.__counter++] = x, n[_] = x, x;
      })());
    else if (u === Se)
      i.push(_v(c, t));
    else if (u === Uo)
      i.push(c);
    else if (u === At) {
      if (r = i.pop(), /^__proto__|prototype|constructor$/.test(c.value))
        throw new Error("prototype access detected in MEMBER");
      if (typeof r == "object" && typeof r[c.value] == "function" && !io(r[c.value], t, n))
        throw new Error("Is not an allowed function in MEMBER.");
      i.push(r[c.value]);
    } else if (u === oi)
      i.pop();
    else if (u === Wt) {
      for (p = c.value, d = []; p-- > 0; )
        d.unshift(i.pop());
      i.push(d);
    } else
      throw new Error("invalid Expression");
  }
  if (i.length > 1)
    throw new Error("invalid Expression (parity)");
  return i[0] === 0 ? 0 : Ke(i[0], n);
}
function _v(e, t, n) {
  return Ro(e) ? e : {
    type: Uo,
    value: function(i) {
      return bt(e.value, t, i);
    }
  };
}
function Ro(e) {
  return e && e.type === Uo;
}
function Ke(e, t) {
  return Ro(e) ? e.value(t) : e;
}
function Lo(e, t) {
  for (var n = [], i, r, o, a, s, d, p = 0; p < e.length; p++) {
    var f = e[p], h = f.type;
    if (h === Ne)
      typeof f.value == "number" && f.value < 0 ? n.push("(" + f.value + ")") : Array.isArray(f.value) ? n.push("[" + f.value.map(bu).join(", ") + "]") : n.push(bu(f.value));
    else if (h === sr)
      r = n.pop(), i = n.pop(), a = f.value, t ? a === "^" ? n.push("Math.pow(" + i + ", " + r + ")") : a === "and" ? n.push("(!!" + i + " && !!" + r + ")") : a === "or" ? n.push("(!!" + i + " || !!" + r + ")") : a === "||" ? n.push("(function(a,b){ return Array.isArray(a) && Array.isArray(b) ? a.concat(b) : String(a) + String(b); }((" + i + "),(" + r + ")))") : a === "==" ? n.push("(" + i + " === " + r + ")") : a === "!=" ? n.push("(" + i + " !== " + r + ")") : a === "[" ? n.push(i + "[(" + r + ") | 0]") : n.push("(" + i + " " + a + " " + r + ")") : a === "[" ? n.push(i + "[" + r + "]") : n.push("(" + i + " " + a + " " + r + ")");
    else if (h === ur)
      if (o = n.pop(), r = n.pop(), i = n.pop(), a = f.value, a === "?")
        n.push("(" + i + " ? " + r + " : " + o + ")");
      else
        throw new Error("invalid Expression");
    else if (h === Qe || h === xt)
      n.push(f.value);
    else if (h === ar)
      i = n.pop(), a = f.value, a === "-" || a === "+" ? n.push("(" + a + i + ")") : t ? a === "not" ? n.push("(!" + i + ")") : a === "!" ? n.push("fac(" + i + ")") : n.push(a + "(" + i + ")") : a === "!" ? n.push("(" + i + "!)") : n.push("(" + a + " " + i + ")");
    else if (h === qt) {
      for (d = f.value, s = []; d-- > 0; )
        s.unshift(n.pop());
      a = n.pop(), n.push(a + "(" + s.join(", ") + ")");
    } else if (h === ii) {
      for (r = n.pop(), d = f.value, s = []; d-- > 0; )
        s.unshift(n.pop());
      i = n.pop(), t ? n.push("(" + i + " = function(" + s.join(", ") + ") { return " + r + " })") : n.push("(" + i + "(" + s.join(", ") + ") = " + r + ")");
    } else if (h === At)
      i = n.pop(), n.push(i + "." + f.value);
    else if (h === Wt) {
      for (d = f.value, s = []; d-- > 0; )
        s.unshift(n.pop());
      n.push("[" + s.join(", ") + "]");
    } else if (h === Se)
      n.push("(" + Lo(f.value, t) + ")");
    else if (h !== oi) throw new Error("invalid Expression");
  }
  return n.length > 1 && (t ? n = [n.join(",")] : n = [n.join(";")]), String(n[0]);
}
function bu(e) {
  return typeof e == "string" ? JSON.stringify(e).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") : e;
}
function Ht(e, t) {
  for (var n = 0; n < e.length; n++)
    if (e[n] === t)
      return !0;
  return !1;
}
function jo(e, t, n) {
  n = n || {};
  for (var i = !!n.withMembers, r = null, o = 0; o < e.length; o++) {
    var a = e[o];
    a.type === Qe || a.type === xt ? !i && !Ht(t, a.value) ? t.push(a.value) : (r !== null && (Ht(t, r) || t.push(r)), r = a.value) : a.type === At && i && r !== null ? r += "." + a.value : a.type === Se ? jo(a.value, t, n) : r !== null && (Ht(t, r) || t.push(r), r = null);
  }
  r !== null && !Ht(t, r) && t.push(r);
}
function Le(e, t) {
  this.tokens = e, this.parser = t, this.unaryOps = t.unaryOps, this.binaryOps = t.binaryOps, this.ternaryOps = t.ternaryOps, this.functions = t.functions;
}
Le.prototype.simplify = function(e) {
  return e = e || {}, new Le(bo(this.tokens, this.unaryOps, this.binaryOps, this.ternaryOps, e), this.parser);
};
Le.prototype.substitute = function(e, t) {
  return t instanceof Le || (t = this.parser.parse(String(t))), new Le(Cc(this.tokens, e, t), this.parser);
};
Le.prototype.evaluate = function(e) {
  return e = e || {}, bt(this.tokens, this, e);
};
Le.prototype.toString = function() {
  return Lo(this.tokens, !1);
};
Le.prototype.symbols = function(e) {
  e = e || {};
  var t = [];
  return jo(this.tokens, t, e), t;
};
Le.prototype.variables = function(e) {
  e = e || {};
  var t = [];
  jo(this.tokens, t, e);
  var n = this.functions;
  return t.filter(function(i) {
    return !(i in n);
  });
};
Le.prototype.toJSFunction = function(e, t) {
  var n = this, i = new Function(e, "with(this.functions) with (this.ternaryOps) with (this.binaryOps) with (this.unaryOps) { return " + Lo(this.simplify(t).tokens, !0) + "; }");
  return function() {
    return i.apply(n, arguments);
  };
};
var br = "TEOF", re = "TOP", si = "TNUMBER", Uc = "TSTRING", et = "TPAREN", Kt = "TBRACKET", ui = "TCOMMA", Mo = "TNAME", Zo = "TSEMICOLON";
function Rc(e, t, n) {
  this.type = e, this.value = t, this.index = n;
}
Rc.prototype.toString = function() {
  return this.type + ": " + this.value;
};
function ue(e, t) {
  this.pos = 0, this.current = null, this.unaryOps = e.unaryOps, this.binaryOps = e.binaryOps, this.ternaryOps = e.ternaryOps, this.consts = e.consts, this.expression = t, this.savedPosition = 0, this.savedCurrent = null, this.options = e.options, this.parser = e;
}
ue.prototype.newToken = function(e, t, n) {
  return new Rc(e, t, n ?? this.pos);
};
ue.prototype.save = function() {
  this.savedPosition = this.pos, this.savedCurrent = this.current;
};
ue.prototype.restore = function() {
  this.pos = this.savedPosition, this.current = this.savedCurrent;
};
ue.prototype.next = function() {
  if (this.pos >= this.expression.length)
    return this.newToken(br, "EOF");
  if (this.isWhitespace() || this.isComment())
    return this.next();
  if (this.isRadixInteger() || this.isNumber() || this.isOperator() || this.isString() || this.isParen() || this.isBracket() || this.isComma() || this.isSemicolon() || this.isNamedOp() || this.isConst() || this.isName())
    return this.current;
  this.parseError('Unknown character "' + this.expression.charAt(this.pos) + '"');
};
ue.prototype.isString = function() {
  var e = !1, t = this.pos, n = this.expression.charAt(t);
  if (n === "'" || n === '"')
    for (var i = this.expression.indexOf(n, t + 1); i >= 0 && this.pos < this.expression.length; ) {
      if (this.pos = i + 1, this.expression.charAt(i - 1) !== "\\") {
        var r = this.expression.substring(t + 1, i);
        this.current = this.newToken(Uc, this.unescape(r), t), e = !0;
        break;
      }
      i = this.expression.indexOf(n, i + 1);
    }
  return e;
};
ue.prototype.isParen = function() {
  var e = this.expression.charAt(this.pos);
  return e === "(" || e === ")" ? (this.current = this.newToken(et, e), this.pos++, !0) : !1;
};
ue.prototype.isBracket = function() {
  var e = this.expression.charAt(this.pos);
  return (e === "[" || e === "]") && this.isOperatorEnabled("[") ? (this.current = this.newToken(Kt, e), this.pos++, !0) : !1;
};
ue.prototype.isComma = function() {
  var e = this.expression.charAt(this.pos);
  return e === "," ? (this.current = this.newToken(ui, ","), this.pos++, !0) : !1;
};
ue.prototype.isSemicolon = function() {
  var e = this.expression.charAt(this.pos);
  return e === ";" ? (this.current = this.newToken(Zo, ";"), this.pos++, !0) : !1;
};
ue.prototype.isConst = function() {
  for (var e = this.pos, t = e; t < this.expression.length; t++) {
    var n = this.expression.charAt(t);
    if (n.toUpperCase() === n.toLowerCase() && (t === this.pos || n !== "_" && n !== "." && (n < "0" || n > "9")))
      break;
  }
  if (t > e) {
    var i = this.expression.substring(e, t);
    if (i in this.consts)
      return this.current = this.newToken(si, this.consts[i]), this.pos += i.length, !0;
  }
  return !1;
};
ue.prototype.isNamedOp = function() {
  for (var e = this.pos, t = e; t < this.expression.length; t++) {
    var n = this.expression.charAt(t);
    if (n.toUpperCase() === n.toLowerCase() && (t === this.pos || n !== "_" && (n < "0" || n > "9")))
      break;
  }
  if (t > e) {
    var i = this.expression.substring(e, t);
    if (this.isOperatorEnabled(i) && (i in this.binaryOps || i in this.unaryOps || i in this.ternaryOps))
      return this.current = this.newToken(re, i), this.pos += i.length, !0;
  }
  return !1;
};
ue.prototype.isName = function() {
  for (var e = this.pos, t = e, n = !1; t < this.expression.length; t++) {
    var i = this.expression.charAt(t);
    if (i.toUpperCase() === i.toLowerCase()) {
      if (t === this.pos && (i === "$" || i === "_")) {
        i === "_" && (n = !0);
        continue;
      } else if (t === this.pos || !n || i !== "_" && (i < "0" || i > "9"))
        break;
    } else
      n = !0;
  }
  if (n) {
    var r = this.expression.substring(e, t);
    return this.current = this.newToken(Mo, r), this.pos += r.length, !0;
  }
  return !1;
};
ue.prototype.isWhitespace = function() {
  for (var e = !1, t = this.expression.charAt(this.pos); (t === " " || t === "	" || t === `
` || t === "\r") && (e = !0, this.pos++, !(this.pos >= this.expression.length)); )
    t = this.expression.charAt(this.pos);
  return e;
};
var yv = /^[0-9a-f]{4}$/i;
ue.prototype.unescape = function(e) {
  var t = e.indexOf("\\");
  if (t < 0)
    return e;
  for (var n = e.substring(0, t); t >= 0; ) {
    var i = e.charAt(++t);
    switch (i) {
      case "'":
        n += "'";
        break;
      case '"':
        n += '"';
        break;
      case "\\":
        n += "\\";
        break;
      case "/":
        n += "/";
        break;
      case "b":
        n += "\b";
        break;
      case "f":
        n += "\f";
        break;
      case "n":
        n += `
`;
        break;
      case "r":
        n += "\r";
        break;
      case "t":
        n += "	";
        break;
      case "u":
        var r = e.substring(t + 1, t + 5);
        yv.test(r) || this.parseError("Illegal escape sequence: \\u" + r), n += String.fromCharCode(parseInt(r, 16)), t += 4;
        break;
      default:
        throw this.parseError('Illegal escape sequence: "\\' + i + '"');
    }
    ++t;
    var o = e.indexOf("\\", t);
    n += e.substring(t, o < 0 ? e.length : o), t = o;
  }
  return n;
};
ue.prototype.isComment = function() {
  var e = this.expression.charAt(this.pos);
  return e === "/" && this.expression.charAt(this.pos + 1) === "*" ? (this.pos = this.expression.indexOf("*/", this.pos) + 2, this.pos === 1 && (this.pos = this.expression.length), !0) : !1;
};
ue.prototype.isRadixInteger = function() {
  var e = this.pos;
  if (e >= this.expression.length - 2 || this.expression.charAt(e) !== "0")
    return !1;
  ++e;
  var t, n;
  if (this.expression.charAt(e) === "x")
    t = 16, n = /^[0-9a-f]$/i, ++e;
  else if (this.expression.charAt(e) === "b")
    t = 2, n = /^[01]$/i, ++e;
  else
    return !1;
  for (var i = !1, r = e; e < this.expression.length; ) {
    var o = this.expression.charAt(e);
    if (n.test(o))
      e++, i = !0;
    else
      break;
  }
  return i && (this.current = this.newToken(si, parseInt(this.expression.substring(r, e), t)), this.pos = e), i;
};
ue.prototype.isNumber = function() {
  for (var e = !1, t = this.pos, n = t, i = t, r = !1, o = !1, a; t < this.expression.length && (a = this.expression.charAt(t), a >= "0" && a <= "9" || !r && a === "."); )
    a === "." ? r = !0 : o = !0, t++, e = o;
  if (e && (i = t), a === "e" || a === "E") {
    t++;
    for (var s = !0, d = !1; t < this.expression.length; ) {
      if (a = this.expression.charAt(t), s && (a === "+" || a === "-"))
        s = !1;
      else if (a >= "0" && a <= "9")
        d = !0, s = !1;
      else
        break;
      t++;
    }
    d || (t = i);
  }
  return e ? (this.current = this.newToken(si, parseFloat(this.expression.substring(n, t))), this.pos = t) : this.pos = i, e;
};
ue.prototype.isOperator = function() {
  var e = this.pos, t = this.expression.charAt(this.pos);
  if (t === "+" || t === "-" || t === "*" || t === "/" || t === "%" || t === "^" || t === "?" || t === ":" || t === ".")
    this.current = this.newToken(re, t);
  else if (t === "∙" || t === "•")
    this.current = this.newToken(re, "*");
  else if (t === ">")
    this.expression.charAt(this.pos + 1) === "=" ? (this.current = this.newToken(re, ">="), this.pos++) : this.current = this.newToken(re, ">");
  else if (t === "<")
    this.expression.charAt(this.pos + 1) === "=" ? (this.current = this.newToken(re, "<="), this.pos++) : this.current = this.newToken(re, "<");
  else if (t === "|")
    if (this.expression.charAt(this.pos + 1) === "|")
      this.current = this.newToken(re, "||"), this.pos++;
    else
      return !1;
  else if (t === "=")
    this.expression.charAt(this.pos + 1) === "=" ? (this.current = this.newToken(re, "=="), this.pos++) : this.current = this.newToken(re, t);
  else if (t === "!")
    this.expression.charAt(this.pos + 1) === "=" ? (this.current = this.newToken(re, "!="), this.pos++) : this.current = this.newToken(re, t);
  else
    return !1;
  return this.pos++, this.isOperatorEnabled(this.current.value) ? !0 : (this.pos = e, !1);
};
ue.prototype.isOperatorEnabled = function(e) {
  return this.parser.isOperatorEnabled(e);
};
ue.prototype.getCoordinates = function() {
  var e = 0, t, n = -1;
  do
    e++, t = this.pos - n, n = this.expression.indexOf(`
`, n + 1);
  while (n >= 0 && n < this.pos);
  return {
    line: e,
    column: t
  };
};
ue.prototype.parseError = function(e) {
  var t = this.getCoordinates();
  throw new Error("parse error [" + t.line + ":" + t.column + "]: " + e);
};
function oe(e, t, n) {
  this.parser = e, this.tokens = t, this.current = null, this.nextToken = null, this.next(), this.savedCurrent = null, this.savedNextToken = null, this.allowMemberAccess = n.allowMemberAccess !== !1;
}
oe.prototype.next = function() {
  return this.current = this.nextToken, this.nextToken = this.tokens.next();
};
oe.prototype.tokenMatches = function(e, t) {
  return typeof t > "u" ? !0 : Array.isArray(t) ? Ht(t, e.value) : typeof t == "function" ? t(e) : e.value === t;
};
oe.prototype.save = function() {
  this.savedCurrent = this.current, this.savedNextToken = this.nextToken, this.tokens.save();
};
oe.prototype.restore = function() {
  this.tokens.restore(), this.current = this.savedCurrent, this.nextToken = this.savedNextToken;
};
oe.prototype.accept = function(e, t) {
  return this.nextToken.type === e && this.tokenMatches(this.nextToken, t) ? (this.next(), !0) : !1;
};
oe.prototype.expect = function(e, t) {
  if (!this.accept(e, t)) {
    var n = this.tokens.getCoordinates();
    throw new Error("parse error [" + n.line + ":" + n.column + "]: Expected " + (t || e));
  }
};
oe.prototype.parseAtom = function(e) {
  var t = this.tokens.unaryOps;
  function n(r) {
    return r.value in t;
  }
  if (this.accept(Mo) || this.accept(re, n))
    e.push(new W(Qe, this.current.value));
  else if (this.accept(si))
    e.push(new W(Ne, this.current.value));
  else if (this.accept(Uc))
    e.push(new W(Ne, this.current.value));
  else if (this.accept(et, "("))
    this.parseExpression(e), this.expect(et, ")");
  else if (this.accept(Kt, "["))
    if (this.accept(Kt, "]"))
      e.push(new W(Wt, 0));
    else {
      var i = this.parseArrayList(e);
      e.push(new W(Wt, i));
    }
  else
    throw new Error("unexpected " + this.nextToken);
};
oe.prototype.parseExpression = function(e) {
  var t = [];
  this.parseUntilEndStatement(e, t) || (this.parseVariableAssignmentExpression(t), !this.parseUntilEndStatement(e, t) && this.pushExpression(e, t));
};
oe.prototype.pushExpression = function(e, t) {
  for (var n = 0, i = t.length; n < i; n++)
    e.push(t[n]);
};
oe.prototype.parseUntilEndStatement = function(e, t) {
  return this.accept(Zo) ? (this.nextToken && this.nextToken.type !== br && !(this.nextToken.type === et && this.nextToken.value === ")") && t.push(new W(oi)), this.nextToken.type !== br && this.parseExpression(t), e.push(new W(Se, t)), !0) : !1;
};
oe.prototype.parseArrayList = function(e) {
  for (var t = 0; !this.accept(Kt, "]"); )
    for (this.parseExpression(e), ++t; this.accept(ui); )
      this.parseExpression(e), ++t;
  return t;
};
oe.prototype.parseVariableAssignmentExpression = function(e) {
  for (this.parseConditionalExpression(e); this.accept(re, "="); ) {
    var t = e.pop(), n = [], i = e.length - 1;
    if (t.type === qt) {
      if (!this.tokens.isOperatorEnabled("()="))
        throw new Error("function definition is not permitted");
      for (var r = 0, o = t.value + 1; r < o; r++) {
        var a = i - r;
        e[a].type === Qe && (e[a] = new W(xt, e[a].value));
      }
      this.parseVariableAssignmentExpression(n), e.push(new W(Se, n)), e.push(new W(ii, t.value));
      continue;
    }
    if (t.type !== Qe && t.type !== At)
      throw new Error("expected variable for assignment");
    this.parseVariableAssignmentExpression(n), e.push(new W(xt, t.value)), e.push(new W(Se, n)), e.push(rt("="));
  }
};
oe.prototype.parseConditionalExpression = function(e) {
  for (this.parseOrExpression(e); this.accept(re, "?"); ) {
    var t = [], n = [];
    this.parseConditionalExpression(t), this.expect(re, ":"), this.parseConditionalExpression(n), e.push(new W(Se, t)), e.push(new W(Se, n)), e.push(Dc("?"));
  }
};
oe.prototype.parseOrExpression = function(e) {
  for (this.parseAndExpression(e); this.accept(re, "or"); ) {
    var t = [];
    this.parseAndExpression(t), e.push(new W(Se, t)), e.push(rt("or"));
  }
};
oe.prototype.parseAndExpression = function(e) {
  for (this.parseComparison(e); this.accept(re, "and"); ) {
    var t = [];
    this.parseComparison(t), e.push(new W(Se, t)), e.push(rt("and"));
  }
};
var bv = ["==", "!=", "<", "<=", ">=", ">", "in"];
oe.prototype.parseComparison = function(e) {
  for (this.parseAddSub(e); this.accept(re, bv); ) {
    var t = this.current;
    this.parseAddSub(e), e.push(rt(t.value));
  }
};
var Sv = ["+", "-", "||"];
oe.prototype.parseAddSub = function(e) {
  for (this.parseTerm(e); this.accept(re, Sv); ) {
    var t = this.current;
    this.parseTerm(e), e.push(rt(t.value));
  }
};
var kv = ["*", "/", "%"];
oe.prototype.parseTerm = function(e) {
  for (this.parseFactor(e); this.accept(re, kv); ) {
    var t = this.current;
    this.parseFactor(e), e.push(rt(t.value));
  }
};
oe.prototype.parseFactor = function(e) {
  var t = this.tokens.unaryOps;
  function n(r) {
    return r.value in t;
  }
  if (this.save(), this.accept(re, n)) {
    if (this.current.value !== "-" && this.current.value !== "+") {
      if (this.nextToken.type === et && this.nextToken.value === "(") {
        this.restore(), this.parseExponential(e);
        return;
      } else if (this.nextToken.type === Zo || this.nextToken.type === ui || this.nextToken.type === br || this.nextToken.type === et && this.nextToken.value === ")") {
        this.restore(), this.parseAtom(e);
        return;
      }
    }
    var i = this.current;
    this.parseFactor(e), e.push(ai(i.value));
  } else
    this.parseExponential(e);
};
oe.prototype.parseExponential = function(e) {
  for (this.parsePostfixExpression(e); this.accept(re, "^"); )
    this.parseFactor(e), e.push(rt("^"));
};
oe.prototype.parsePostfixExpression = function(e) {
  for (this.parseFunctionCall(e); this.accept(re, "!"); )
    e.push(ai("!"));
};
oe.prototype.parseFunctionCall = function(e) {
  var t = this.tokens.unaryOps;
  function n(o) {
    return o.value in t;
  }
  if (this.accept(re, n)) {
    var i = this.current;
    this.parseAtom(e), e.push(ai(i.value));
  } else
    for (this.parseMemberExpression(e); this.accept(et, "("); )
      if (this.accept(et, ")"))
        e.push(new W(qt, 0));
      else {
        var r = this.parseArgumentList(e);
        e.push(new W(qt, r));
      }
};
oe.prototype.parseArgumentList = function(e) {
  for (var t = 0; !this.accept(et, ")"); )
    for (this.parseExpression(e), ++t; this.accept(ui); )
      this.parseExpression(e), ++t;
  return t;
};
oe.prototype.parseMemberExpression = function(e) {
  for (this.parseAtom(e); this.accept(re, ".") || this.accept(Kt, "["); ) {
    var t = this.current;
    if (t.value === ".") {
      if (!this.allowMemberAccess)
        throw new Error('unexpected ".", member access is not permitted');
      this.expect(Mo), e.push(new W(At, this.current.value));
    } else if (t.value === "[") {
      if (!this.tokens.isOperatorEnabled("["))
        throw new Error('unexpected "[]", arrays are disabled');
      this.parseExpression(e), this.expect(Kt, "]"), e.push(rt("["));
    } else
      throw new Error("unexpected symbol: " + t.value);
  }
};
function wv(e, t) {
  return Number(e) + Number(t);
}
function Iv(e, t) {
  return e - t;
}
function xv(e, t) {
  return e * t;
}
function Ov(e, t) {
  return e / t;
}
function Ev(e, t) {
  return e % t;
}
function Pv(e, t) {
  return Array.isArray(e) && Array.isArray(t) ? e.concat(t) : "" + e + t;
}
function Nv(e, t) {
  return e === t;
}
function Tv(e, t) {
  return e !== t;
}
function zv(e, t) {
  return e > t;
}
function Av(e, t) {
  return e < t;
}
function Dv(e, t) {
  return e >= t;
}
function Cv(e, t) {
  return e <= t;
}
function Uv(e, t) {
  return !!(e && t);
}
function Rv(e, t) {
  return !!(e || t);
}
function Lv(e, t) {
  return Ht(t, e);
}
function jv(e) {
  return (Math.exp(e) - Math.exp(-e)) / 2;
}
function Mv(e) {
  return (Math.exp(e) + Math.exp(-e)) / 2;
}
function Zv(e) {
  return e === 1 / 0 ? 1 : e === -1 / 0 ? -1 : (Math.exp(e) - Math.exp(-e)) / (Math.exp(e) + Math.exp(-e));
}
function Fv(e) {
  return e === -1 / 0 ? e : Math.log(e + Math.sqrt(e * e + 1));
}
function Bv(e) {
  return Math.log(e + Math.sqrt(e * e - 1));
}
function Gv(e) {
  return Math.log((1 + e) / (1 - e)) / 2;
}
function Su(e) {
  return Math.log(e) * Math.LOG10E;
}
function Hv(e) {
  return -e;
}
function Jv(e) {
  return !e;
}
function Vv(e) {
  return e < 0 ? Math.ceil(e) : Math.floor(e);
}
function qv(e) {
  return Math.random() * (e || 1);
}
function ku(e) {
  return Fo(e + 1);
}
function Wv(e) {
  return isFinite(e) && e === Math.round(e);
}
var Kv = 4.7421875, oo = [
  0.9999999999999971,
  57.15623566586292,
  -59.59796035547549,
  14.136097974741746,
  -0.4919138160976202,
  3399464998481189e-20,
  4652362892704858e-20,
  -9837447530487956e-20,
  1580887032249125e-19,
  -21026444172410488e-20,
  21743961811521265e-20,
  -1643181065367639e-19,
  8441822398385275e-20,
  -26190838401581408e-21,
  36899182659531625e-22
];
function Fo(e) {
  var t, n;
  if (Wv(e)) {
    if (e <= 0)
      return isFinite(e) ? 1 / 0 : NaN;
    if (e > 171)
      return 1 / 0;
    for (var i = e - 2, r = e - 1; i > 1; )
      r *= i, i--;
    return r === 0 && (r = 1), r;
  }
  if (e < 0.5)
    return Math.PI / (Math.sin(Math.PI * e) * Fo(1 - e));
  if (e >= 171.35)
    return 1 / 0;
  if (e > 85) {
    var o = e * e, a = o * e, s = a * e, d = s * e;
    return Math.sqrt(2 * Math.PI / e) * Math.pow(e / Math.E, e) * (1 + 1 / (12 * e) + 1 / (288 * o) - 139 / (51840 * a) - 571 / (2488320 * s) + 163879 / (209018880 * d) + 5246819 / (75246796800 * d * e));
  }
  --e, n = oo[0];
  for (var p = 1; p < oo.length; ++p)
    n += oo[p] / (e + p);
  return t = e + Kv + 0.5, Math.sqrt(2 * Math.PI) * Math.pow(t, e + 0.5) * Math.exp(-t) * n;
}
function Yv(e) {
  return Array.isArray(e) ? e.length : String(e).length;
}
function wu() {
  for (var e = 0, t = 0, n = 0; n < arguments.length; n++) {
    var i = Math.abs(arguments[n]), r;
    t < i ? (r = t / i, e = e * r * r + 1, t = i) : i > 0 ? (r = i / t, e += r * r) : e += i;
  }
  return t === 1 / 0 ? 1 / 0 : t * Math.sqrt(e);
}
function Iu(e, t, n) {
  return e ? t : n;
}
function Xv(e, t) {
  return typeof t > "u" || +t == 0 ? Math.round(e) : (e = +e, t = -+t, isNaN(e) || !(typeof t == "number" && t % 1 === 0) ? NaN : (e = e.toString().split("e"), e = Math.round(+(e[0] + "e" + (e[1] ? +e[1] - t : -t))), e = e.toString().split("e"), +(e[0] + "e" + (e[1] ? +e[1] + t : t))));
}
function Qv(e, t, n) {
  return n && (n[e] = t), t;
}
function e$(e, t) {
  return e[t | 0];
}
function t$(e) {
  return arguments.length === 1 && Array.isArray(e) ? Math.max.apply(Math, e) : Math.max.apply(Math, arguments);
}
function r$(e) {
  return arguments.length === 1 && Array.isArray(e) ? Math.min.apply(Math, e) : Math.min.apply(Math, arguments);
}
function n$(e, t) {
  if (typeof e != "function")
    throw new Error("First argument to map is not a function");
  if (!Array.isArray(t))
    throw new Error("Second argument to map is not an array");
  return t.map(function(n, i) {
    return e(n, i);
  });
}
function i$(e, t, n) {
  if (typeof e != "function")
    throw new Error("First argument to fold is not a function");
  if (!Array.isArray(n))
    throw new Error("Second argument to fold is not an array");
  return n.reduce(function(i, r, o) {
    return e(i, r, o);
  }, t);
}
function o$(e, t) {
  if (typeof e != "function")
    throw new Error("First argument to filter is not a function");
  if (!Array.isArray(t))
    throw new Error("Second argument to filter is not an array");
  return t.filter(function(n, i) {
    return e(n, i);
  });
}
function a$(e, t) {
  if (!(Array.isArray(t) || typeof t == "string"))
    throw new Error("Second argument to indexOf is not a string or array");
  return t.indexOf(e);
}
function s$(e, t) {
  if (!Array.isArray(t))
    throw new Error("Second argument to join is not an array");
  return t.join(e);
}
function u$(e) {
  return (e > 0) - (e < 0) || +e;
}
var xu = 1 / 3;
function l$(e) {
  return e < 0 ? -Math.pow(-e, xu) : Math.pow(e, xu);
}
function c$(e) {
  return Math.exp(e) - 1;
}
function d$(e) {
  return Math.log(1 + e);
}
function f$(e) {
  return Math.log(e) / Math.LN2;
}
function p$(e) {
  if (!Array.isArray(e))
    throw new Error("Sum argument is not an array");
  return e.reduce(function(t, n) {
    return t + Number(n);
  }, 0);
}
function Dt(e) {
  this.options = e || {}, this.unaryOps = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sinh: Math.sinh || jv,
    cosh: Math.cosh || Mv,
    tanh: Math.tanh || Zv,
    asinh: Math.asinh || Fv,
    acosh: Math.acosh || Bv,
    atanh: Math.atanh || Gv,
    sqrt: Math.sqrt,
    cbrt: Math.cbrt || l$,
    log: Math.log,
    log2: Math.log2 || f$,
    ln: Math.log,
    lg: Math.log10 || Su,
    log10: Math.log10 || Su,
    expm1: Math.expm1 || c$,
    log1p: Math.log1p || d$,
    abs: Math.abs,
    ceil: Math.ceil,
    floor: Math.floor,
    round: Math.round,
    trunc: Math.trunc || Vv,
    "-": Hv,
    "+": Number,
    exp: Math.exp,
    not: Jv,
    length: Yv,
    "!": ku,
    sign: Math.sign || u$
  }, this.binaryOps = {
    "+": wv,
    "-": Iv,
    "*": xv,
    "/": Ov,
    "%": Ev,
    "^": Math.pow,
    "||": Pv,
    "==": Nv,
    "!=": Tv,
    ">": zv,
    "<": Av,
    ">=": Dv,
    "<=": Cv,
    and: Uv,
    or: Rv,
    in: Lv,
    "=": Qv,
    "[": e$
  }, this.ternaryOps = {
    "?": Iu
  }, this.functions = {
    random: qv,
    fac: ku,
    min: r$,
    max: t$,
    hypot: Math.hypot || wu,
    pyt: Math.hypot || wu,
    // backward compat
    pow: Math.pow,
    atan2: Math.atan2,
    if: Iu,
    gamma: Fo,
    roundTo: Xv,
    map: n$,
    fold: i$,
    filter: o$,
    indexOf: a$,
    join: s$,
    sum: p$
  }, this.consts = {
    E: Math.E,
    PI: Math.PI,
    true: !0,
    false: !1
  };
}
Dt.prototype.parse = function(e) {
  var t = [], n = new oe(
    this,
    new ue(this, e),
    { allowMemberAccess: this.options.allowMemberAccess }
  );
  return n.parseExpression(t), n.expect(br, "EOF"), new Le(t, this);
};
Dt.prototype.evaluate = function(e, t) {
  return this.parse(e).evaluate(t);
};
var Lc = new Dt();
Dt.parse = function(e) {
  return Lc.parse(e);
};
Dt.evaluate = function(e, t) {
  return Lc.parse(e).evaluate(t);
};
var Ou = {
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "/": "divide",
  "%": "remainder",
  "^": "power",
  "!": "factorial",
  "<": "comparison",
  ">": "comparison",
  "<=": "comparison",
  ">=": "comparison",
  "==": "comparison",
  "!=": "comparison",
  "||": "concatenate",
  and: "logical",
  or: "logical",
  not: "logical",
  "?": "conditional",
  ":": "conditional",
  "=": "assignment",
  "[": "array",
  "()=": "fndef"
};
function h$(e) {
  return Object.hasOwn(Ou, e) ? Ou[e] : e;
}
Dt.prototype.isOperatorEnabled = function(e) {
  var t = h$(e), n = this.options.operators || {};
  return !(t in n) || !!n[t];
};
var on = { exports: {} }, an = { exports: {} }, Re = {}, ye = {}, Eu;
function ke() {
  if (Eu) return ye;
  Eu = 1, ye.__esModule = !0, ye.extend = r, ye.indexOf = d, ye.escapeExpression = p, ye.isEmpty = f, ye.createFrame = h, ye.blockParams = c, ye.appendContextPath = u;
  var e = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;",
    "=": "&#x3D;"
  }, t = /[&<>"'`=]/g, n = /[&<>"'`=]/;
  function i(l) {
    return e[l];
  }
  function r(l) {
    for (var m = 1; m < arguments.length; m++)
      for (var g in arguments[m])
        Object.prototype.hasOwnProperty.call(arguments[m], g) && (l[g] = arguments[m][g]);
    return l;
  }
  var o = Object.prototype.toString;
  ye.toString = o;
  var a = function(m) {
    return typeof m == "function";
  };
  a(/x/) && (ye.isFunction = a = function(l) {
    return typeof l == "function" && o.call(l) === "[object Function]";
  }), ye.isFunction = a;
  var s = Array.isArray || function(l) {
    return l && typeof l == "object" ? o.call(l) === "[object Array]" : !1;
  };
  ye.isArray = s;
  function d(l, m) {
    for (var g = 0, v = l.length; g < v; g++)
      if (l[g] === m)
        return g;
    return -1;
  }
  function p(l) {
    if (typeof l != "string") {
      if (l && l.toHTML)
        return l.toHTML();
      if (l == null)
        return "";
      if (!l)
        return l + "";
      l = "" + l;
    }
    return n.test(l) ? l.replace(t, i) : l;
  }
  function f(l) {
    return !l && l !== 0 ? !0 : !!(s(l) && l.length === 0);
  }
  function h(l) {
    var m = r({}, l);
    return m._parent = l, m;
  }
  function c(l, m) {
    return l.path = m, l;
  }
  function u(l, m) {
    return (l ? l + "." : "") + m;
  }
  return ye;
}
var sn = { exports: {} }, Pu;
function De() {
  return Pu || (Pu = 1, (function(e, t) {
    t.__esModule = !0;
    var n = ["description", "fileName", "lineNumber", "endLineNumber", "message", "name", "number", "stack"];
    function i(r, o) {
      var a = o && o.loc, s = void 0, d = void 0, p = void 0, f = void 0;
      a && (s = a.start.line, d = a.end.line, p = a.start.column, f = a.end.column, r += " - " + s + ":" + p);
      for (var h = Error.prototype.constructor.call(this, r), c = 0; c < n.length; c++)
        this[n[c]] = h[n[c]];
      Error.captureStackTrace && Error.captureStackTrace(this, i);
      try {
        a && (this.lineNumber = s, this.endLineNumber = d, Object.defineProperty ? (Object.defineProperty(this, "column", {
          value: p,
          enumerable: !0
        }), Object.defineProperty(this, "endColumn", {
          value: f,
          enumerable: !0
        })) : (this.column = p, this.endColumn = f));
      } catch {
      }
    }
    i.prototype = new Error(), t.default = i, e.exports = t.default;
  })(sn, sn.exports)), sn.exports;
}
var mr = {}, un = { exports: {} }, Nu;
function m$() {
  return Nu || (Nu = 1, (function(e, t) {
    t.__esModule = !0;
    var n = ke();
    t.default = function(i) {
      i.registerHelper("blockHelperMissing", function(r, o) {
        var a = o.inverse, s = o.fn;
        if (r === !0)
          return s(this);
        if (r === !1 || r == null)
          return a(this);
        if (n.isArray(r))
          return r.length > 0 ? (o.ids && (o.ids = [o.name]), i.helpers.each(r, o)) : a(this);
        if (o.data && o.ids) {
          var d = n.createFrame(o.data);
          d.contextPath = n.appendContextPath(o.data.contextPath, o.name), o = { data: d };
        }
        return s(r, o);
      });
    }, e.exports = t.default;
  })(un, un.exports)), un.exports;
}
var ln = { exports: {} }, Tu;
function g$() {
  return Tu || (Tu = 1, (function(e, t) {
    t.__esModule = !0;
    function n(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var i = ke(), r = De(), o = n(r);
    t.default = function(a) {
      a.registerHelper("each", function(s, d) {
        if (!d)
          throw new o.default("Must pass iterator to #each");
        var p = d.fn, f = d.inverse, h = 0, c = "", u = void 0, l = void 0;
        d.data && d.ids && (l = i.appendContextPath(d.data.contextPath, d.ids[0]) + "."), i.isFunction(s) && (s = s.call(this)), d.data && (u = i.createFrame(d.data));
        function m(y, $, O) {
          u && (u.key = y, u.index = $, u.first = $ === 0, u.last = !!O, l && (u.contextPath = l + y)), c = c + p(s[y], {
            data: u,
            blockParams: i.blockParams([s[y], y], [l + y, null])
          });
        }
        if (s && typeof s == "object")
          if (i.isArray(s))
            for (var g = s.length; h < g; h++)
              h in s && m(h, h, h === s.length - 1);
          else if (typeof Symbol == "function" && s[Symbol.iterator]) {
            for (var v = [], _ = s[Symbol.iterator](), x = _.next(); !x.done; x = _.next())
              v.push(x.value);
            s = v;
            for (var g = s.length; h < g; h++)
              m(h, h, h === s.length - 1);
          } else
            (function() {
              var y = void 0;
              Object.keys(s).forEach(function($) {
                y !== void 0 && m(y, h - 1), y = $, h++;
              }), y !== void 0 && m(y, h - 1, !0);
            })();
        return h === 0 && (c = f(this)), c;
      });
    }, e.exports = t.default;
  })(ln, ln.exports)), ln.exports;
}
var cn = { exports: {} }, zu;
function v$() {
  return zu || (zu = 1, (function(e, t) {
    t.__esModule = !0;
    function n(o) {
      return o && o.__esModule ? o : { default: o };
    }
    var i = De(), r = n(i);
    t.default = function(o) {
      o.registerHelper("helperMissing", function() {
        if (arguments.length !== 1)
          throw new r.default('Missing helper: "' + arguments[arguments.length - 1].name + '"');
      });
    }, e.exports = t.default;
  })(cn, cn.exports)), cn.exports;
}
var dn = { exports: {} }, Au;
function $$() {
  return Au || (Au = 1, (function(e, t) {
    t.__esModule = !0;
    function n(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var i = ke(), r = De(), o = n(r);
    t.default = function(a) {
      a.registerHelper("if", function(s, d) {
        if (arguments.length != 2)
          throw new o.default("#if requires exactly one argument");
        return i.isFunction(s) && (s = s.call(this)), !d.hash.includeZero && !s || i.isEmpty(s) ? d.inverse(this) : d.fn(this);
      }), a.registerHelper("unless", function(s, d) {
        if (arguments.length != 2)
          throw new o.default("#unless requires exactly one argument");
        return a.helpers.if.call(this, s, {
          fn: d.inverse,
          inverse: d.fn,
          hash: d.hash
        });
      });
    }, e.exports = t.default;
  })(dn, dn.exports)), dn.exports;
}
var fn = { exports: {} }, Du;
function _$() {
  return Du || (Du = 1, (function(e, t) {
    t.__esModule = !0, t.default = function(n) {
      n.registerHelper("log", function() {
        for (var i = [void 0], r = arguments[arguments.length - 1], o = 0; o < arguments.length - 1; o++)
          i.push(arguments[o]);
        var a = 1;
        r.hash.level != null ? a = r.hash.level : r.data && r.data.level != null && (a = r.data.level), i[0] = a, n.log.apply(n, i);
      });
    }, e.exports = t.default;
  })(fn, fn.exports)), fn.exports;
}
var pn = { exports: {} }, Cu;
function y$() {
  return Cu || (Cu = 1, (function(e, t) {
    t.__esModule = !0, t.default = function(n) {
      n.registerHelper("lookup", function(i, r, o) {
        return i && o.lookupProperty(i, r);
      });
    }, e.exports = t.default;
  })(pn, pn.exports)), pn.exports;
}
var hn = { exports: {} }, Uu;
function b$() {
  return Uu || (Uu = 1, (function(e, t) {
    t.__esModule = !0;
    function n(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var i = ke(), r = De(), o = n(r);
    t.default = function(a) {
      a.registerHelper("with", function(s, d) {
        if (arguments.length != 2)
          throw new o.default("#with requires exactly one argument");
        i.isFunction(s) && (s = s.call(this));
        var p = d.fn;
        if (i.isEmpty(s))
          return d.inverse(this);
        var f = d.data;
        return d.data && d.ids && (f = i.createFrame(d.data), f.contextPath = i.appendContextPath(d.data.contextPath, d.ids[0])), p(s, {
          data: f,
          blockParams: i.blockParams([s], [f && f.contextPath])
        });
      });
    }, e.exports = t.default;
  })(hn, hn.exports)), hn.exports;
}
var Ru;
function jc() {
  if (Ru) return mr;
  Ru = 1, mr.__esModule = !0, mr.registerDefaultHelpers = m, mr.moveHelperToHooks = g;
  function e(v) {
    return v && v.__esModule ? v : { default: v };
  }
  var t = m$(), n = e(t), i = g$(), r = e(i), o = v$(), a = e(o), s = $$(), d = e(s), p = _$(), f = e(p), h = y$(), c = e(h), u = b$(), l = e(u);
  function m(v) {
    n.default(v), r.default(v), a.default(v), d.default(v), f.default(v), c.default(v), l.default(v);
  }
  function g(v, _, x) {
    v.helpers[_] && (v.hooks[_] = v.helpers[_], x || (v.helpers[_] = void 0));
  }
  return mr;
}
var mn = {}, gn = { exports: {} }, Lu;
function S$() {
  return Lu || (Lu = 1, (function(e, t) {
    t.__esModule = !0;
    var n = ke();
    t.default = function(i) {
      i.registerDecorator("inline", function(r, o, a, s) {
        var d = r;
        return o.partials || (o.partials = {}, d = function(p, f) {
          var h = a.partials;
          a.partials = n.extend({}, h, o.partials);
          var c = r(p, f);
          return a.partials = h, c;
        }), o.partials[s.args[0]] = s.fn, d;
      });
    }, e.exports = t.default;
  })(gn, gn.exports)), gn.exports;
}
var ju;
function k$() {
  if (ju) return mn;
  ju = 1, mn.__esModule = !0, mn.registerDefaultDecorators = i;
  function e(r) {
    return r && r.__esModule ? r : { default: r };
  }
  var t = S$(), n = e(t);
  function i(r) {
    n.default(r);
  }
  return mn;
}
var vn = { exports: {} }, Mu;
function Mc() {
  return Mu || (Mu = 1, (function(e, t) {
    t.__esModule = !0;
    var n = ke(), i = {
      methodMap: ["debug", "info", "warn", "error"],
      level: "info",
      // Maps a given level value to the `methodMap` indexes above.
      lookupLevel: function(o) {
        if (typeof o == "string") {
          var a = n.indexOf(i.methodMap, o.toLowerCase());
          a >= 0 ? o = a : o = parseInt(o, 10);
        }
        return o;
      },
      // Can be overridden in the host environment
      log: function(o) {
        if (o = i.lookupLevel(o), typeof console < "u" && i.lookupLevel(i.level) <= o) {
          var a = i.methodMap[o];
          console[a] || (a = "log");
          for (var s = arguments.length, d = Array(s > 1 ? s - 1 : 0), p = 1; p < s; p++)
            d[p - 1] = arguments[p];
          console[a].apply(console, d);
        }
      }
    };
    t.default = i, e.exports = t.default;
  })(vn, vn.exports)), vn.exports;
}
var Zt = {}, Zu;
function Zc() {
  if (Zu) return Zt;
  Zu = 1, Zt.__esModule = !0, Zt.createProtoAccessControl = o, Zt.resultIsAllowed = a, Zt.resetLoggedProperties = p;
  function e(f) {
    return f && f.__esModule ? f : { default: f };
  }
  var t = ke(), n = Mc(), i = e(n), r = /* @__PURE__ */ Object.create(null);
  function o(f) {
    var h = /* @__PURE__ */ Object.create(null);
    h.__proto__ = !1, t.extend(h, f.allowedProtoProperties);
    var c = /* @__PURE__ */ Object.create(null);
    return c.constructor = !1, c.__defineGetter__ = !1, c.__defineSetter__ = !1, c.__lookupGetter__ = !1, c.__lookupSetter__ = !1, t.extend(c, f.allowedProtoMethods), {
      properties: {
        whitelist: h,
        defaultValue: f.allowProtoPropertiesByDefault
      },
      methods: {
        whitelist: c,
        defaultValue: f.allowProtoMethodsByDefault
      }
    };
  }
  function a(f, h, c) {
    return s(typeof f == "function" ? h.methods : h.properties, c);
  }
  function s(f, h) {
    return f.whitelist[h] !== void 0 ? f.whitelist[h] === !0 : f.defaultValue !== void 0 ? f.defaultValue : (d(h), !1);
  }
  function d(f) {
    r[f] !== !0 && (r[f] = !0, i.default.log("error", 'Handlebars: Access has been denied to resolve the property "' + f + `" because it is not an "own property" of its parent.
You can add a runtime option to disable the check or this warning:
See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details`));
  }
  function p() {
    Object.keys(r).forEach(function(f) {
      delete r[f];
    });
  }
  return Zt;
}
var Fu;
function Bo() {
  if (Fu) return Re;
  Fu = 1, Re.__esModule = !0, Re.HandlebarsEnvironment = l;
  function e(g) {
    return g && g.__esModule ? g : { default: g };
  }
  var t = ke(), n = De(), i = e(n), r = jc(), o = k$(), a = Mc(), s = e(a), d = Zc(), p = "4.7.9";
  Re.VERSION = p;
  var f = 8;
  Re.COMPILER_REVISION = f;
  var h = 7;
  Re.LAST_COMPATIBLE_COMPILER_REVISION = h;
  var c = {
    1: "<= 1.0.rc.2",
    // 1.0.rc.2 is actually rev2 but doesn't report it
    2: "== 1.0.0-rc.3",
    3: "== 1.0.0-rc.4",
    4: "== 1.x.x",
    5: "== 2.0.0-alpha.x",
    6: ">= 2.0.0-beta.1",
    7: ">= 4.0.0 <4.3.0",
    8: ">= 4.3.0"
  };
  Re.REVISION_CHANGES = c;
  var u = "[object Object]";
  function l(g, v, _) {
    this.helpers = g || {}, this.partials = v || {}, this.decorators = _ || {}, r.registerDefaultHelpers(this), o.registerDefaultDecorators(this);
  }
  l.prototype = {
    constructor: l,
    logger: s.default,
    log: s.default.log,
    registerHelper: function(v, _) {
      if (t.toString.call(v) === u) {
        if (_)
          throw new i.default("Arg not supported with multiple helpers");
        t.extend(this.helpers, v);
      } else
        this.helpers[v] = _;
    },
    unregisterHelper: function(v) {
      delete this.helpers[v];
    },
    registerPartial: function(v, _) {
      if (t.toString.call(v) === u)
        t.extend(this.partials, v);
      else {
        if (typeof _ > "u")
          throw new i.default('Attempting to register a partial called "' + v + '" as undefined');
        this.partials[v] = _;
      }
    },
    unregisterPartial: function(v) {
      delete this.partials[v];
    },
    registerDecorator: function(v, _) {
      if (t.toString.call(v) === u) {
        if (_)
          throw new i.default("Arg not supported with multiple decorators");
        t.extend(this.decorators, v);
      } else
        this.decorators[v] = _;
    },
    unregisterDecorator: function(v) {
      delete this.decorators[v];
    },
    /**
     * Reset the memory of illegal property accesses that have already been logged.
     * @deprecated should only be used in handlebars test-cases
     */
    resetLoggedPropertyAccesses: function() {
      d.resetLoggedProperties();
    }
  };
  var m = s.default.log;
  return Re.log = m, Re.createFrame = t.createFrame, Re.logger = s.default, Re;
}
var $n = { exports: {} }, Bu;
function w$() {
  return Bu || (Bu = 1, (function(e, t) {
    t.__esModule = !0;
    function n(i) {
      this.string = i;
    }
    n.prototype.toString = n.prototype.toHTML = function() {
      return "" + this.string;
    }, t.default = n, e.exports = t.default;
  })($n, $n.exports)), $n.exports;
}
var Ye = {}, _n = {}, Gu;
function I$() {
  if (Gu) return _n;
  Gu = 1, _n.__esModule = !0, _n.wrapHelper = e;
  function e(t, n) {
    if (typeof t != "function")
      return t;
    var i = function() {
      var o = arguments[arguments.length - 1];
      return arguments[arguments.length - 1] = n(o), t.apply(this, arguments);
    };
    return i;
  }
  return _n;
}
var Hu;
function x$() {
  if (Hu) return Ye;
  Hu = 1, Ye.__esModule = !0, Ye.checkRevision = f, Ye.template = h, Ye.wrapProgram = c, Ye.resolvePartial = u, Ye.invokePartial = l, Ye.noop = m;
  function e($) {
    return $ && $.__esModule ? $ : { default: $ };
  }
  function t($) {
    if ($ && $.__esModule)
      return $;
    var O = {};
    if ($ != null)
      for (var I in $)
        Object.prototype.hasOwnProperty.call($, I) && (O[I] = $[I]);
    return O.default = $, O;
  }
  var n = ke(), i = t(n), r = De(), o = e(r), a = Bo(), s = jc(), d = I$(), p = Zc();
  function f($) {
    var O = $ && $[0] || 1, I = a.COMPILER_REVISION;
    if (!(O >= a.LAST_COMPATIBLE_COMPILER_REVISION && O <= a.COMPILER_REVISION))
      if (O < a.LAST_COMPATIBLE_COMPILER_REVISION) {
        var D = a.REVISION_CHANGES[I], L = a.REVISION_CHANGES[O];
        throw new o.default("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + D + ") or downgrade your runtime to an older version (" + L + ").");
      } else
        throw new o.default("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + $[1] + ").");
  }
  function h($, O) {
    if (!O)
      throw new o.default("No environment passed to template");
    if (!$ || !$.main)
      throw new o.default("Unknown template object: " + typeof $);
    $.main.decorator = $.main_d, O.VM.checkRevision($.compiler);
    var I = $.compiler && $.compiler[0] === 7;
    function D(b, k, E) {
      E.hash && (k = i.extend({}, k, E.hash), E.ids && (E.ids[0] = !0)), b = O.VM.resolvePartial.call(this, b, k, E), E.hooks = this.hooks, E.protoAccessControl = this.protoAccessControl;
      var z = O.VM.invokePartial.call(this, b, k, E);
      if (z == null && O.compile && (E.partials[E.name] = O.compile(b, $.compilerOptions, O), z = E.partials[E.name](k, E)), z != null) {
        if (E.indent) {
          for (var R = z.split(`
`), U = 0, F = R.length; U < F && !(!R[U] && U + 1 === F); U++)
            R[U] = E.indent + R[U];
          z = R.join(`
`);
        }
        return z;
      } else
        throw new o.default("The partial " + E.name + " could not be compiled when running in runtime-only mode");
    }
    var L = {
      strict: function(k, E, z) {
        if (!k || !(E in k))
          throw new o.default('"' + E + '" not defined in ' + k, {
            loc: z
          });
        return L.lookupProperty(k, E);
      },
      lookupProperty: function(k, E) {
        var z = k[E];
        if (z == null || Object.prototype.hasOwnProperty.call(k, E) || p.resultIsAllowed(z, L.protoAccessControl, E))
          return z;
      },
      lookup: function(k, E) {
        for (var z = k.length, R = 0; R < z; R++) {
          var U = k[R] && L.lookupProperty(k[R], E);
          if (U != null)
            return U;
        }
      },
      lambda: function(k, E) {
        return typeof k == "function" ? k.call(E) : k;
      },
      escapeExpression: i.escapeExpression,
      invokePartial: D,
      fn: function(k) {
        var E = $[k];
        return E.decorator = $[k + "_d"], E;
      },
      programs: [],
      program: function(k, E, z, R, U) {
        var F = this.programs[k], X = this.fn(k);
        return E || U || R || z ? F = c(this, k, X, E, z, R, U) : F || (F = this.programs[k] = c(this, k, X)), F;
      },
      data: function(k, E) {
        for (; k && E--; )
          k = k._parent;
        return k;
      },
      mergeIfNeeded: function(k, E) {
        var z = k || E;
        return k && E && k !== E && (z = i.extend({}, E, k)), z;
      },
      // An empty object to use as replacement for null-contexts
      nullContext: Object.seal({}),
      noop: O.VM.noop,
      compilerInfo: $.compiler
    };
    function M(b) {
      var k = arguments.length <= 1 || arguments[1] === void 0 ? {} : arguments[1], E = k.data;
      M._setup(k), !k.partial && $.useData && (E = v(b, E));
      var z = void 0, R = $.useBlockParams ? [] : void 0;
      $.useDepths && (k.depths ? z = b != k.depths[0] ? [b].concat(k.depths) : k.depths : z = [b]);
      function U(F) {
        return "" + $.main(L, F, L.helpers, L.partials, E, R, z);
      }
      return U = _($.main, U, L, k.depths || [], E, R), U(b, k);
    }
    return M.isTop = !0, M._setup = function(b) {
      if (b.partial)
        L.protoAccessControl = b.protoAccessControl, L.helpers = b.helpers, L.partials = b.partials, L.decorators = b.decorators, L.hooks = b.hooks;
      else {
        var k = {};
        x(k, O.helpers, L), x(k, b.helpers, L), L.helpers = k, $.usePartial && (L.partials = L.mergeIfNeeded(b.partials, O.partials)), ($.usePartial || $.useDecorators) && (L.decorators = i.extend({}, O.decorators, b.decorators)), L.hooks = {}, L.protoAccessControl = p.createProtoAccessControl(b);
        var E = b.allowCallsToHelperMissing || I;
        s.moveHelperToHooks(L, "helperMissing", E), s.moveHelperToHooks(L, "blockHelperMissing", E);
      }
    }, M._child = function(b, k, E, z) {
      if ($.useBlockParams && !E)
        throw new o.default("must pass block params");
      if ($.useDepths && !z)
        throw new o.default("must pass parent depths");
      return c(L, b, $[b], k, 0, E, z);
    }, M;
  }
  function c($, O, I, D, L, M, b) {
    function k(E) {
      var z = arguments.length <= 1 || arguments[1] === void 0 ? {} : arguments[1], R = b;
      return b && E != b[0] && !(E === $.nullContext && b[0] === null) && (R = [E].concat(b)), I($, E, $.helpers, $.partials, z.data || D, M && [z.blockParams].concat(M), R);
    }
    return k = _(I, k, $, b, D, M), k.program = O, k.depth = b ? b.length : 0, k.blockParams = L || 0, k;
  }
  function u($, O, I) {
    return $ ? !$.call && !I.name && (I.name = $, $ = g(I.partials, $)) : I.name === "@partial-block" ? $ = g(I.data, "partial-block") : $ = g(I.partials, I.name), $;
  }
  function l($, O, I) {
    var D = g(I.data, "partial-block");
    I.partial = !0, I.ids && (I.data.contextPath = I.ids[0] || I.data.contextPath);
    var L = void 0;
    if (I.fn && I.fn !== m && (function() {
      I.data = a.createFrame(I.data);
      var M = I.fn;
      L = I.data["partial-block"] = function(k) {
        var E = arguments.length <= 1 || arguments[1] === void 0 ? {} : arguments[1];
        return E.data = a.createFrame(E.data), E.data["partial-block"] = D, M(k, E);
      }, M.partials && (I.partials = i.extend({}, I.partials, M.partials));
    })(), $ === void 0 && L && ($ = L), $ === void 0)
      throw new o.default("The partial " + I.name + " could not be found");
    if ($ instanceof Function)
      return $(O, I);
  }
  function m() {
    return "";
  }
  function g($, O) {
    if ($ && Object.prototype.hasOwnProperty.call($, O))
      return $[O];
  }
  function v($, O) {
    return (!O || !("root" in O)) && (O = O ? a.createFrame(O) : {}, O.root = $), O;
  }
  function _($, O, I, D, L, M) {
    if ($.decorator) {
      var b = {};
      O = $.decorator(O, b, I, D && D[0], L, M, D), i.extend(O, b);
    }
    return O;
  }
  function x($, O, I) {
    O && Object.keys(O).forEach(function(D) {
      var L = O[D];
      $[D] = y(L, I);
    });
  }
  function y($, O) {
    var I = O.lookupProperty;
    return d.wrapHelper($, function(D) {
      return D.lookupProperty = I, D;
    });
  }
  return Ye;
}
var yn = { exports: {} }, Ju;
function Fc() {
  return Ju || (Ju = 1, (function(e, t) {
    t.__esModule = !0, t.default = function(n) {
      (function() {
        typeof globalThis != "object" && (Object.prototype.__defineGetter__("__magic__", function() {
          return this;
        }), __magic__.globalThis = __magic__, delete Object.prototype.__magic__);
      })();
      var i = globalThis.Handlebars;
      n.noConflict = function() {
        return globalThis.Handlebars === n && (globalThis.Handlebars = i), n;
      };
    }, e.exports = t.default;
  })(yn, yn.exports)), yn.exports;
}
var Vu;
function O$() {
  return Vu || (Vu = 1, (function(e, t) {
    t.__esModule = !0;
    function n(_) {
      return _ && _.__esModule ? _ : { default: _ };
    }
    function i(_) {
      if (_ && _.__esModule)
        return _;
      var x = {};
      if (_ != null)
        for (var y in _)
          Object.prototype.hasOwnProperty.call(_, y) && (x[y] = _[y]);
      return x.default = _, x;
    }
    var r = Bo(), o = i(r), a = w$(), s = n(a), d = De(), p = n(d), f = ke(), h = i(f), c = x$(), u = i(c), l = Fc(), m = n(l);
    function g() {
      var _ = new o.HandlebarsEnvironment();
      return h.extend(_, o), _.SafeString = s.default, _.Exception = p.default, _.Utils = h, _.escapeExpression = h.escapeExpression, _.VM = u, _.template = function(x) {
        return u.template(x, _);
      }, _;
    }
    var v = g();
    v.create = g, m.default(v), v.default = v, t.default = v, e.exports = t.default;
  })(an, an.exports)), an.exports;
}
var bn = { exports: {} }, qu;
function Bc() {
  return qu || (qu = 1, (function(e, t) {
    t.__esModule = !0;
    var n = {
      // Public API used to evaluate derived attributes regarding AST nodes
      helpers: {
        // a mustache is definitely a helper if:
        // * it is an eligible helper, and
        // * it has at least one parameter or hash segment
        helperExpression: function(r) {
          return r.type === "SubExpression" || (r.type === "MustacheStatement" || r.type === "BlockStatement") && !!(r.params && r.params.length || r.hash);
        },
        scopedId: function(r) {
          return /^\.|this\b/.test(r.original);
        },
        // an ID is simple if it only has one part, and that part is not
        // `..` or `this`.
        simpleId: function(r) {
          return r.parts.length === 1 && !n.helpers.scopedId(r) && !r.depth;
        }
      }
    };
    t.default = n, e.exports = t.default;
  })(bn, bn.exports)), bn.exports;
}
var Ft = {}, Sn = { exports: {} }, Wu;
function E$() {
  return Wu || (Wu = 1, (function(e, t) {
    t.__esModule = !0;
    var n = (function() {
      var i = {
        trace: function() {
        },
        yy: {},
        symbols_: { error: 2, root: 3, program: 4, EOF: 5, program_repetition0: 6, statement: 7, mustache: 8, block: 9, rawBlock: 10, partial: 11, partialBlock: 12, content: 13, COMMENT: 14, CONTENT: 15, openRawBlock: 16, rawBlock_repetition0: 17, END_RAW_BLOCK: 18, OPEN_RAW_BLOCK: 19, helperName: 20, openRawBlock_repetition0: 21, openRawBlock_option0: 22, CLOSE_RAW_BLOCK: 23, openBlock: 24, block_option0: 25, closeBlock: 26, openInverse: 27, block_option1: 28, OPEN_BLOCK: 29, openBlock_repetition0: 30, openBlock_option0: 31, openBlock_option1: 32, CLOSE: 33, OPEN_INVERSE: 34, openInverse_repetition0: 35, openInverse_option0: 36, openInverse_option1: 37, openInverseChain: 38, OPEN_INVERSE_CHAIN: 39, openInverseChain_repetition0: 40, openInverseChain_option0: 41, openInverseChain_option1: 42, inverseAndProgram: 43, INVERSE: 44, inverseChain: 45, inverseChain_option0: 46, OPEN_ENDBLOCK: 47, OPEN: 48, mustache_repetition0: 49, mustache_option0: 50, OPEN_UNESCAPED: 51, mustache_repetition1: 52, mustache_option1: 53, CLOSE_UNESCAPED: 54, OPEN_PARTIAL: 55, partialName: 56, partial_repetition0: 57, partial_option0: 58, openPartialBlock: 59, OPEN_PARTIAL_BLOCK: 60, openPartialBlock_repetition0: 61, openPartialBlock_option0: 62, param: 63, sexpr: 64, OPEN_SEXPR: 65, sexpr_repetition0: 66, sexpr_option0: 67, CLOSE_SEXPR: 68, hash: 69, hash_repetition_plus0: 70, hashSegment: 71, ID: 72, EQUALS: 73, blockParams: 74, OPEN_BLOCK_PARAMS: 75, blockParams_repetition_plus0: 76, CLOSE_BLOCK_PARAMS: 77, path: 78, dataName: 79, STRING: 80, NUMBER: 81, BOOLEAN: 82, UNDEFINED: 83, NULL: 84, DATA: 85, pathSegments: 86, SEP: 87, $accept: 0, $end: 1 },
        terminals_: { 2: "error", 5: "EOF", 14: "COMMENT", 15: "CONTENT", 18: "END_RAW_BLOCK", 19: "OPEN_RAW_BLOCK", 23: "CLOSE_RAW_BLOCK", 29: "OPEN_BLOCK", 33: "CLOSE", 34: "OPEN_INVERSE", 39: "OPEN_INVERSE_CHAIN", 44: "INVERSE", 47: "OPEN_ENDBLOCK", 48: "OPEN", 51: "OPEN_UNESCAPED", 54: "CLOSE_UNESCAPED", 55: "OPEN_PARTIAL", 60: "OPEN_PARTIAL_BLOCK", 65: "OPEN_SEXPR", 68: "CLOSE_SEXPR", 72: "ID", 73: "EQUALS", 75: "OPEN_BLOCK_PARAMS", 77: "CLOSE_BLOCK_PARAMS", 80: "STRING", 81: "NUMBER", 82: "BOOLEAN", 83: "UNDEFINED", 84: "NULL", 85: "DATA", 87: "SEP" },
        productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [13, 1], [10, 3], [16, 5], [9, 4], [9, 4], [24, 6], [27, 6], [38, 6], [43, 2], [45, 3], [45, 1], [26, 3], [8, 5], [8, 5], [11, 5], [12, 3], [59, 5], [63, 1], [63, 1], [64, 5], [69, 1], [71, 3], [74, 3], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [56, 1], [56, 1], [79, 2], [78, 1], [86, 3], [86, 1], [6, 0], [6, 2], [17, 0], [17, 2], [21, 0], [21, 2], [22, 0], [22, 1], [25, 0], [25, 1], [28, 0], [28, 1], [30, 0], [30, 2], [31, 0], [31, 1], [32, 0], [32, 1], [35, 0], [35, 2], [36, 0], [36, 1], [37, 0], [37, 1], [40, 0], [40, 2], [41, 0], [41, 1], [42, 0], [42, 1], [46, 0], [46, 1], [49, 0], [49, 2], [50, 0], [50, 1], [52, 0], [52, 2], [53, 0], [53, 1], [57, 0], [57, 2], [58, 0], [58, 1], [61, 0], [61, 2], [62, 0], [62, 1], [66, 0], [66, 2], [67, 0], [67, 1], [70, 1], [70, 2], [76, 1], [76, 2]],
        performAction: function(s, d, p, f, h, c, u) {
          var l = c.length - 1;
          switch (h) {
            case 1:
              return c[l - 1];
            case 2:
              this.$ = f.prepareProgram(c[l]);
              break;
            case 3:
              this.$ = c[l];
              break;
            case 4:
              this.$ = c[l];
              break;
            case 5:
              this.$ = c[l];
              break;
            case 6:
              this.$ = c[l];
              break;
            case 7:
              this.$ = c[l];
              break;
            case 8:
              this.$ = c[l];
              break;
            case 9:
              this.$ = {
                type: "CommentStatement",
                value: f.stripComment(c[l]),
                strip: f.stripFlags(c[l], c[l]),
                loc: f.locInfo(this._$)
              };
              break;
            case 10:
              this.$ = {
                type: "ContentStatement",
                original: c[l],
                value: c[l],
                loc: f.locInfo(this._$)
              };
              break;
            case 11:
              this.$ = f.prepareRawBlock(c[l - 2], c[l - 1], c[l], this._$);
              break;
            case 12:
              this.$ = { path: c[l - 3], params: c[l - 2], hash: c[l - 1] };
              break;
            case 13:
              this.$ = f.prepareBlock(c[l - 3], c[l - 2], c[l - 1], c[l], !1, this._$);
              break;
            case 14:
              this.$ = f.prepareBlock(c[l - 3], c[l - 2], c[l - 1], c[l], !0, this._$);
              break;
            case 15:
              this.$ = { open: c[l - 5], path: c[l - 4], params: c[l - 3], hash: c[l - 2], blockParams: c[l - 1], strip: f.stripFlags(c[l - 5], c[l]) };
              break;
            case 16:
              this.$ = { path: c[l - 4], params: c[l - 3], hash: c[l - 2], blockParams: c[l - 1], strip: f.stripFlags(c[l - 5], c[l]) };
              break;
            case 17:
              this.$ = { path: c[l - 4], params: c[l - 3], hash: c[l - 2], blockParams: c[l - 1], strip: f.stripFlags(c[l - 5], c[l]) };
              break;
            case 18:
              this.$ = { strip: f.stripFlags(c[l - 1], c[l - 1]), program: c[l] };
              break;
            case 19:
              var m = f.prepareBlock(c[l - 2], c[l - 1], c[l], c[l], !1, this._$), g = f.prepareProgram([m], c[l - 1].loc);
              g.chained = !0, this.$ = { strip: c[l - 2].strip, program: g, chain: !0 };
              break;
            case 20:
              this.$ = c[l];
              break;
            case 21:
              this.$ = { path: c[l - 1], strip: f.stripFlags(c[l - 2], c[l]) };
              break;
            case 22:
              this.$ = f.prepareMustache(c[l - 3], c[l - 2], c[l - 1], c[l - 4], f.stripFlags(c[l - 4], c[l]), this._$);
              break;
            case 23:
              this.$ = f.prepareMustache(c[l - 3], c[l - 2], c[l - 1], c[l - 4], f.stripFlags(c[l - 4], c[l]), this._$);
              break;
            case 24:
              this.$ = {
                type: "PartialStatement",
                name: c[l - 3],
                params: c[l - 2],
                hash: c[l - 1],
                indent: "",
                strip: f.stripFlags(c[l - 4], c[l]),
                loc: f.locInfo(this._$)
              };
              break;
            case 25:
              this.$ = f.preparePartialBlock(c[l - 2], c[l - 1], c[l], this._$);
              break;
            case 26:
              this.$ = { path: c[l - 3], params: c[l - 2], hash: c[l - 1], strip: f.stripFlags(c[l - 4], c[l]) };
              break;
            case 27:
              this.$ = c[l];
              break;
            case 28:
              this.$ = c[l];
              break;
            case 29:
              this.$ = {
                type: "SubExpression",
                path: c[l - 3],
                params: c[l - 2],
                hash: c[l - 1],
                loc: f.locInfo(this._$)
              };
              break;
            case 30:
              this.$ = { type: "Hash", pairs: c[l], loc: f.locInfo(this._$) };
              break;
            case 31:
              this.$ = { type: "HashPair", key: f.id(c[l - 2]), value: c[l], loc: f.locInfo(this._$) };
              break;
            case 32:
              this.$ = f.id(c[l - 1]);
              break;
            case 33:
              this.$ = c[l];
              break;
            case 34:
              this.$ = c[l];
              break;
            case 35:
              this.$ = { type: "StringLiteral", value: c[l], original: c[l], loc: f.locInfo(this._$) };
              break;
            case 36:
              this.$ = { type: "NumberLiteral", value: Number(c[l]), original: Number(c[l]), loc: f.locInfo(this._$) };
              break;
            case 37:
              this.$ = { type: "BooleanLiteral", value: c[l] === "true", original: c[l] === "true", loc: f.locInfo(this._$) };
              break;
            case 38:
              this.$ = { type: "UndefinedLiteral", original: void 0, value: void 0, loc: f.locInfo(this._$) };
              break;
            case 39:
              this.$ = { type: "NullLiteral", original: null, value: null, loc: f.locInfo(this._$) };
              break;
            case 40:
              this.$ = c[l];
              break;
            case 41:
              this.$ = c[l];
              break;
            case 42:
              this.$ = f.preparePath(!0, c[l], this._$);
              break;
            case 43:
              this.$ = f.preparePath(!1, c[l], this._$);
              break;
            case 44:
              c[l - 2].push({ part: f.id(c[l]), original: c[l], separator: c[l - 1] }), this.$ = c[l - 2];
              break;
            case 45:
              this.$ = [{ part: f.id(c[l]), original: c[l] }];
              break;
            case 46:
              this.$ = [];
              break;
            case 47:
              c[l - 1].push(c[l]);
              break;
            case 48:
              this.$ = [];
              break;
            case 49:
              c[l - 1].push(c[l]);
              break;
            case 50:
              this.$ = [];
              break;
            case 51:
              c[l - 1].push(c[l]);
              break;
            case 58:
              this.$ = [];
              break;
            case 59:
              c[l - 1].push(c[l]);
              break;
            case 64:
              this.$ = [];
              break;
            case 65:
              c[l - 1].push(c[l]);
              break;
            case 70:
              this.$ = [];
              break;
            case 71:
              c[l - 1].push(c[l]);
              break;
            case 78:
              this.$ = [];
              break;
            case 79:
              c[l - 1].push(c[l]);
              break;
            case 82:
              this.$ = [];
              break;
            case 83:
              c[l - 1].push(c[l]);
              break;
            case 86:
              this.$ = [];
              break;
            case 87:
              c[l - 1].push(c[l]);
              break;
            case 90:
              this.$ = [];
              break;
            case 91:
              c[l - 1].push(c[l]);
              break;
            case 94:
              this.$ = [];
              break;
            case 95:
              c[l - 1].push(c[l]);
              break;
            case 98:
              this.$ = [c[l]];
              break;
            case 99:
              c[l - 1].push(c[l]);
              break;
            case 100:
              this.$ = [c[l]];
              break;
            case 101:
              c[l - 1].push(c[l]);
              break;
          }
        },
        table: [{ 3: 1, 4: 2, 5: [2, 46], 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 1: [3] }, { 5: [1, 4] }, { 5: [2, 2], 7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10, 13: 11, 14: [1, 12], 15: [1, 20], 16: 17, 19: [1, 23], 24: 15, 27: 16, 29: [1, 21], 34: [1, 22], 39: [2, 2], 44: [2, 2], 47: [2, 2], 48: [1, 13], 51: [1, 14], 55: [1, 18], 59: 19, 60: [1, 24] }, { 1: [2, 1] }, { 5: [2, 47], 14: [2, 47], 15: [2, 47], 19: [2, 47], 29: [2, 47], 34: [2, 47], 39: [2, 47], 44: [2, 47], 47: [2, 47], 48: [2, 47], 51: [2, 47], 55: [2, 47], 60: [2, 47] }, { 5: [2, 3], 14: [2, 3], 15: [2, 3], 19: [2, 3], 29: [2, 3], 34: [2, 3], 39: [2, 3], 44: [2, 3], 47: [2, 3], 48: [2, 3], 51: [2, 3], 55: [2, 3], 60: [2, 3] }, { 5: [2, 4], 14: [2, 4], 15: [2, 4], 19: [2, 4], 29: [2, 4], 34: [2, 4], 39: [2, 4], 44: [2, 4], 47: [2, 4], 48: [2, 4], 51: [2, 4], 55: [2, 4], 60: [2, 4] }, { 5: [2, 5], 14: [2, 5], 15: [2, 5], 19: [2, 5], 29: [2, 5], 34: [2, 5], 39: [2, 5], 44: [2, 5], 47: [2, 5], 48: [2, 5], 51: [2, 5], 55: [2, 5], 60: [2, 5] }, { 5: [2, 6], 14: [2, 6], 15: [2, 6], 19: [2, 6], 29: [2, 6], 34: [2, 6], 39: [2, 6], 44: [2, 6], 47: [2, 6], 48: [2, 6], 51: [2, 6], 55: [2, 6], 60: [2, 6] }, { 5: [2, 7], 14: [2, 7], 15: [2, 7], 19: [2, 7], 29: [2, 7], 34: [2, 7], 39: [2, 7], 44: [2, 7], 47: [2, 7], 48: [2, 7], 51: [2, 7], 55: [2, 7], 60: [2, 7] }, { 5: [2, 8], 14: [2, 8], 15: [2, 8], 19: [2, 8], 29: [2, 8], 34: [2, 8], 39: [2, 8], 44: [2, 8], 47: [2, 8], 48: [2, 8], 51: [2, 8], 55: [2, 8], 60: [2, 8] }, { 5: [2, 9], 14: [2, 9], 15: [2, 9], 19: [2, 9], 29: [2, 9], 34: [2, 9], 39: [2, 9], 44: [2, 9], 47: [2, 9], 48: [2, 9], 51: [2, 9], 55: [2, 9], 60: [2, 9] }, { 20: 25, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 36, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 37, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 4: 38, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 15: [2, 48], 17: 39, 18: [2, 48] }, { 20: 41, 56: 40, 64: 42, 65: [1, 43], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 44, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 5: [2, 10], 14: [2, 10], 15: [2, 10], 18: [2, 10], 19: [2, 10], 29: [2, 10], 34: [2, 10], 39: [2, 10], 44: [2, 10], 47: [2, 10], 48: [2, 10], 51: [2, 10], 55: [2, 10], 60: [2, 10] }, { 20: 45, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 46, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 47, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 41, 56: 48, 64: 42, 65: [1, 43], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [2, 78], 49: 49, 65: [2, 78], 72: [2, 78], 80: [2, 78], 81: [2, 78], 82: [2, 78], 83: [2, 78], 84: [2, 78], 85: [2, 78] }, { 23: [2, 33], 33: [2, 33], 54: [2, 33], 65: [2, 33], 68: [2, 33], 72: [2, 33], 75: [2, 33], 80: [2, 33], 81: [2, 33], 82: [2, 33], 83: [2, 33], 84: [2, 33], 85: [2, 33] }, { 23: [2, 34], 33: [2, 34], 54: [2, 34], 65: [2, 34], 68: [2, 34], 72: [2, 34], 75: [2, 34], 80: [2, 34], 81: [2, 34], 82: [2, 34], 83: [2, 34], 84: [2, 34], 85: [2, 34] }, { 23: [2, 35], 33: [2, 35], 54: [2, 35], 65: [2, 35], 68: [2, 35], 72: [2, 35], 75: [2, 35], 80: [2, 35], 81: [2, 35], 82: [2, 35], 83: [2, 35], 84: [2, 35], 85: [2, 35] }, { 23: [2, 36], 33: [2, 36], 54: [2, 36], 65: [2, 36], 68: [2, 36], 72: [2, 36], 75: [2, 36], 80: [2, 36], 81: [2, 36], 82: [2, 36], 83: [2, 36], 84: [2, 36], 85: [2, 36] }, { 23: [2, 37], 33: [2, 37], 54: [2, 37], 65: [2, 37], 68: [2, 37], 72: [2, 37], 75: [2, 37], 80: [2, 37], 81: [2, 37], 82: [2, 37], 83: [2, 37], 84: [2, 37], 85: [2, 37] }, { 23: [2, 38], 33: [2, 38], 54: [2, 38], 65: [2, 38], 68: [2, 38], 72: [2, 38], 75: [2, 38], 80: [2, 38], 81: [2, 38], 82: [2, 38], 83: [2, 38], 84: [2, 38], 85: [2, 38] }, { 23: [2, 39], 33: [2, 39], 54: [2, 39], 65: [2, 39], 68: [2, 39], 72: [2, 39], 75: [2, 39], 80: [2, 39], 81: [2, 39], 82: [2, 39], 83: [2, 39], 84: [2, 39], 85: [2, 39] }, { 23: [2, 43], 33: [2, 43], 54: [2, 43], 65: [2, 43], 68: [2, 43], 72: [2, 43], 75: [2, 43], 80: [2, 43], 81: [2, 43], 82: [2, 43], 83: [2, 43], 84: [2, 43], 85: [2, 43], 87: [1, 50] }, { 72: [1, 35], 86: 51 }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 52: 52, 54: [2, 82], 65: [2, 82], 72: [2, 82], 80: [2, 82], 81: [2, 82], 82: [2, 82], 83: [2, 82], 84: [2, 82], 85: [2, 82] }, { 25: 53, 38: 55, 39: [1, 57], 43: 56, 44: [1, 58], 45: 54, 47: [2, 54] }, { 28: 59, 43: 60, 44: [1, 58], 47: [2, 56] }, { 13: 62, 15: [1, 20], 18: [1, 61] }, { 33: [2, 86], 57: 63, 65: [2, 86], 72: [2, 86], 80: [2, 86], 81: [2, 86], 82: [2, 86], 83: [2, 86], 84: [2, 86], 85: [2, 86] }, { 33: [2, 40], 65: [2, 40], 72: [2, 40], 80: [2, 40], 81: [2, 40], 82: [2, 40], 83: [2, 40], 84: [2, 40], 85: [2, 40] }, { 33: [2, 41], 65: [2, 41], 72: [2, 41], 80: [2, 41], 81: [2, 41], 82: [2, 41], 83: [2, 41], 84: [2, 41], 85: [2, 41] }, { 20: 64, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 65, 47: [1, 66] }, { 30: 67, 33: [2, 58], 65: [2, 58], 72: [2, 58], 75: [2, 58], 80: [2, 58], 81: [2, 58], 82: [2, 58], 83: [2, 58], 84: [2, 58], 85: [2, 58] }, { 33: [2, 64], 35: 68, 65: [2, 64], 72: [2, 64], 75: [2, 64], 80: [2, 64], 81: [2, 64], 82: [2, 64], 83: [2, 64], 84: [2, 64], 85: [2, 64] }, { 21: 69, 23: [2, 50], 65: [2, 50], 72: [2, 50], 80: [2, 50], 81: [2, 50], 82: [2, 50], 83: [2, 50], 84: [2, 50], 85: [2, 50] }, { 33: [2, 90], 61: 70, 65: [2, 90], 72: [2, 90], 80: [2, 90], 81: [2, 90], 82: [2, 90], 83: [2, 90], 84: [2, 90], 85: [2, 90] }, { 20: 74, 33: [2, 80], 50: 71, 63: 72, 64: 75, 65: [1, 43], 69: 73, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 72: [1, 79] }, { 23: [2, 42], 33: [2, 42], 54: [2, 42], 65: [2, 42], 68: [2, 42], 72: [2, 42], 75: [2, 42], 80: [2, 42], 81: [2, 42], 82: [2, 42], 83: [2, 42], 84: [2, 42], 85: [2, 42], 87: [1, 50] }, { 20: 74, 53: 80, 54: [2, 84], 63: 81, 64: 75, 65: [1, 43], 69: 82, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 83, 47: [1, 66] }, { 47: [2, 55] }, { 4: 84, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 47: [2, 20] }, { 20: 85, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 86, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 26: 87, 47: [1, 66] }, { 47: [2, 57] }, { 5: [2, 11], 14: [2, 11], 15: [2, 11], 19: [2, 11], 29: [2, 11], 34: [2, 11], 39: [2, 11], 44: [2, 11], 47: [2, 11], 48: [2, 11], 51: [2, 11], 55: [2, 11], 60: [2, 11] }, { 15: [2, 49], 18: [2, 49] }, { 20: 74, 33: [2, 88], 58: 88, 63: 89, 64: 75, 65: [1, 43], 69: 90, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 65: [2, 94], 66: 91, 68: [2, 94], 72: [2, 94], 80: [2, 94], 81: [2, 94], 82: [2, 94], 83: [2, 94], 84: [2, 94], 85: [2, 94] }, { 5: [2, 25], 14: [2, 25], 15: [2, 25], 19: [2, 25], 29: [2, 25], 34: [2, 25], 39: [2, 25], 44: [2, 25], 47: [2, 25], 48: [2, 25], 51: [2, 25], 55: [2, 25], 60: [2, 25] }, { 20: 92, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 31: 93, 33: [2, 60], 63: 94, 64: 75, 65: [1, 43], 69: 95, 70: 76, 71: 77, 72: [1, 78], 75: [2, 60], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 33: [2, 66], 36: 96, 63: 97, 64: 75, 65: [1, 43], 69: 98, 70: 76, 71: 77, 72: [1, 78], 75: [2, 66], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 22: 99, 23: [2, 52], 63: 100, 64: 75, 65: [1, 43], 69: 101, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 33: [2, 92], 62: 102, 63: 103, 64: 75, 65: [1, 43], 69: 104, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 105] }, { 33: [2, 79], 65: [2, 79], 72: [2, 79], 80: [2, 79], 81: [2, 79], 82: [2, 79], 83: [2, 79], 84: [2, 79], 85: [2, 79] }, { 33: [2, 81] }, { 23: [2, 27], 33: [2, 27], 54: [2, 27], 65: [2, 27], 68: [2, 27], 72: [2, 27], 75: [2, 27], 80: [2, 27], 81: [2, 27], 82: [2, 27], 83: [2, 27], 84: [2, 27], 85: [2, 27] }, { 23: [2, 28], 33: [2, 28], 54: [2, 28], 65: [2, 28], 68: [2, 28], 72: [2, 28], 75: [2, 28], 80: [2, 28], 81: [2, 28], 82: [2, 28], 83: [2, 28], 84: [2, 28], 85: [2, 28] }, { 23: [2, 30], 33: [2, 30], 54: [2, 30], 68: [2, 30], 71: 106, 72: [1, 107], 75: [2, 30] }, { 23: [2, 98], 33: [2, 98], 54: [2, 98], 68: [2, 98], 72: [2, 98], 75: [2, 98] }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 73: [1, 108], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 23: [2, 44], 33: [2, 44], 54: [2, 44], 65: [2, 44], 68: [2, 44], 72: [2, 44], 75: [2, 44], 80: [2, 44], 81: [2, 44], 82: [2, 44], 83: [2, 44], 84: [2, 44], 85: [2, 44], 87: [2, 44] }, { 54: [1, 109] }, { 54: [2, 83], 65: [2, 83], 72: [2, 83], 80: [2, 83], 81: [2, 83], 82: [2, 83], 83: [2, 83], 84: [2, 83], 85: [2, 83] }, { 54: [2, 85] }, { 5: [2, 13], 14: [2, 13], 15: [2, 13], 19: [2, 13], 29: [2, 13], 34: [2, 13], 39: [2, 13], 44: [2, 13], 47: [2, 13], 48: [2, 13], 51: [2, 13], 55: [2, 13], 60: [2, 13] }, { 38: 55, 39: [1, 57], 43: 56, 44: [1, 58], 45: 111, 46: 110, 47: [2, 76] }, { 33: [2, 70], 40: 112, 65: [2, 70], 72: [2, 70], 75: [2, 70], 80: [2, 70], 81: [2, 70], 82: [2, 70], 83: [2, 70], 84: [2, 70], 85: [2, 70] }, { 47: [2, 18] }, { 5: [2, 14], 14: [2, 14], 15: [2, 14], 19: [2, 14], 29: [2, 14], 34: [2, 14], 39: [2, 14], 44: [2, 14], 47: [2, 14], 48: [2, 14], 51: [2, 14], 55: [2, 14], 60: [2, 14] }, { 33: [1, 113] }, { 33: [2, 87], 65: [2, 87], 72: [2, 87], 80: [2, 87], 81: [2, 87], 82: [2, 87], 83: [2, 87], 84: [2, 87], 85: [2, 87] }, { 33: [2, 89] }, { 20: 74, 63: 115, 64: 75, 65: [1, 43], 67: 114, 68: [2, 96], 69: 116, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 117] }, { 32: 118, 33: [2, 62], 74: 119, 75: [1, 120] }, { 33: [2, 59], 65: [2, 59], 72: [2, 59], 75: [2, 59], 80: [2, 59], 81: [2, 59], 82: [2, 59], 83: [2, 59], 84: [2, 59], 85: [2, 59] }, { 33: [2, 61], 75: [2, 61] }, { 33: [2, 68], 37: 121, 74: 122, 75: [1, 120] }, { 33: [2, 65], 65: [2, 65], 72: [2, 65], 75: [2, 65], 80: [2, 65], 81: [2, 65], 82: [2, 65], 83: [2, 65], 84: [2, 65], 85: [2, 65] }, { 33: [2, 67], 75: [2, 67] }, { 23: [1, 123] }, { 23: [2, 51], 65: [2, 51], 72: [2, 51], 80: [2, 51], 81: [2, 51], 82: [2, 51], 83: [2, 51], 84: [2, 51], 85: [2, 51] }, { 23: [2, 53] }, { 33: [1, 124] }, { 33: [2, 91], 65: [2, 91], 72: [2, 91], 80: [2, 91], 81: [2, 91], 82: [2, 91], 83: [2, 91], 84: [2, 91], 85: [2, 91] }, { 33: [2, 93] }, { 5: [2, 22], 14: [2, 22], 15: [2, 22], 19: [2, 22], 29: [2, 22], 34: [2, 22], 39: [2, 22], 44: [2, 22], 47: [2, 22], 48: [2, 22], 51: [2, 22], 55: [2, 22], 60: [2, 22] }, { 23: [2, 99], 33: [2, 99], 54: [2, 99], 68: [2, 99], 72: [2, 99], 75: [2, 99] }, { 73: [1, 108] }, { 20: 74, 63: 125, 64: 75, 65: [1, 43], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 23], 14: [2, 23], 15: [2, 23], 19: [2, 23], 29: [2, 23], 34: [2, 23], 39: [2, 23], 44: [2, 23], 47: [2, 23], 48: [2, 23], 51: [2, 23], 55: [2, 23], 60: [2, 23] }, { 47: [2, 19] }, { 47: [2, 77] }, { 20: 74, 33: [2, 72], 41: 126, 63: 127, 64: 75, 65: [1, 43], 69: 128, 70: 76, 71: 77, 72: [1, 78], 75: [2, 72], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 24], 14: [2, 24], 15: [2, 24], 19: [2, 24], 29: [2, 24], 34: [2, 24], 39: [2, 24], 44: [2, 24], 47: [2, 24], 48: [2, 24], 51: [2, 24], 55: [2, 24], 60: [2, 24] }, { 68: [1, 129] }, { 65: [2, 95], 68: [2, 95], 72: [2, 95], 80: [2, 95], 81: [2, 95], 82: [2, 95], 83: [2, 95], 84: [2, 95], 85: [2, 95] }, { 68: [2, 97] }, { 5: [2, 21], 14: [2, 21], 15: [2, 21], 19: [2, 21], 29: [2, 21], 34: [2, 21], 39: [2, 21], 44: [2, 21], 47: [2, 21], 48: [2, 21], 51: [2, 21], 55: [2, 21], 60: [2, 21] }, { 33: [1, 130] }, { 33: [2, 63] }, { 72: [1, 132], 76: 131 }, { 33: [1, 133] }, { 33: [2, 69] }, { 15: [2, 12], 18: [2, 12] }, { 14: [2, 26], 15: [2, 26], 19: [2, 26], 29: [2, 26], 34: [2, 26], 47: [2, 26], 48: [2, 26], 51: [2, 26], 55: [2, 26], 60: [2, 26] }, { 23: [2, 31], 33: [2, 31], 54: [2, 31], 68: [2, 31], 72: [2, 31], 75: [2, 31] }, { 33: [2, 74], 42: 134, 74: 135, 75: [1, 120] }, { 33: [2, 71], 65: [2, 71], 72: [2, 71], 75: [2, 71], 80: [2, 71], 81: [2, 71], 82: [2, 71], 83: [2, 71], 84: [2, 71], 85: [2, 71] }, { 33: [2, 73], 75: [2, 73] }, { 23: [2, 29], 33: [2, 29], 54: [2, 29], 65: [2, 29], 68: [2, 29], 72: [2, 29], 75: [2, 29], 80: [2, 29], 81: [2, 29], 82: [2, 29], 83: [2, 29], 84: [2, 29], 85: [2, 29] }, { 14: [2, 15], 15: [2, 15], 19: [2, 15], 29: [2, 15], 34: [2, 15], 39: [2, 15], 44: [2, 15], 47: [2, 15], 48: [2, 15], 51: [2, 15], 55: [2, 15], 60: [2, 15] }, { 72: [1, 137], 77: [1, 136] }, { 72: [2, 100], 77: [2, 100] }, { 14: [2, 16], 15: [2, 16], 19: [2, 16], 29: [2, 16], 34: [2, 16], 44: [2, 16], 47: [2, 16], 48: [2, 16], 51: [2, 16], 55: [2, 16], 60: [2, 16] }, { 33: [1, 138] }, { 33: [2, 75] }, { 33: [2, 32] }, { 72: [2, 101], 77: [2, 101] }, { 14: [2, 17], 15: [2, 17], 19: [2, 17], 29: [2, 17], 34: [2, 17], 39: [2, 17], 44: [2, 17], 47: [2, 17], 48: [2, 17], 51: [2, 17], 55: [2, 17], 60: [2, 17] }],
        defaultActions: { 4: [2, 1], 54: [2, 55], 56: [2, 20], 60: [2, 57], 73: [2, 81], 82: [2, 85], 86: [2, 18], 90: [2, 89], 101: [2, 53], 104: [2, 93], 110: [2, 19], 111: [2, 77], 116: [2, 97], 119: [2, 63], 122: [2, 69], 135: [2, 75], 136: [2, 32] },
        parseError: function(s, d) {
          throw new Error(s);
        },
        parse: function(s) {
          var d = this, p = [0], f = [null], h = [], c = this.table, u = "", l = 0, m = 0;
          this.lexer.setInput(s), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, this.yy.parser = this, typeof this.lexer.yylloc > "u" && (this.lexer.yylloc = {});
          var g = this.lexer.yylloc;
          h.push(g);
          var v = this.lexer.options && this.lexer.options.ranges;
          typeof this.yy.parseError == "function" && (this.parseError = this.yy.parseError);
          function _() {
            var E;
            return E = d.lexer.lex() || 1, typeof E != "number" && (E = d.symbols_[E] || E), E;
          }
          for (var x, y, $, O, I = {}, D, L, M, b; ; ) {
            if (y = p[p.length - 1], this.defaultActions[y] ? $ = this.defaultActions[y] : ((x === null || typeof x > "u") && (x = _()), $ = c[y] && c[y][x]), typeof $ > "u" || !$.length || !$[0]) {
              var k = "";
              {
                b = [];
                for (D in c[y]) this.terminals_[D] && D > 2 && b.push("'" + this.terminals_[D] + "'");
                this.lexer.showPosition ? k = "Parse error on line " + (l + 1) + `:
` + this.lexer.showPosition() + `
Expecting ` + b.join(", ") + ", got '" + (this.terminals_[x] || x) + "'" : k = "Parse error on line " + (l + 1) + ": Unexpected " + (x == 1 ? "end of input" : "'" + (this.terminals_[x] || x) + "'"), this.parseError(k, { text: this.lexer.match, token: this.terminals_[x] || x, line: this.lexer.yylineno, loc: g, expected: b });
              }
            }
            if ($[0] instanceof Array && $.length > 1)
              throw new Error("Parse Error: multiple actions possible at state: " + y + ", token: " + x);
            switch ($[0]) {
              case 1:
                p.push(x), f.push(this.lexer.yytext), h.push(this.lexer.yylloc), p.push($[1]), x = null, m = this.lexer.yyleng, u = this.lexer.yytext, l = this.lexer.yylineno, g = this.lexer.yylloc;
                break;
              case 2:
                if (L = this.productions_[$[1]][1], I.$ = f[f.length - L], I._$ = { first_line: h[h.length - (L || 1)].first_line, last_line: h[h.length - 1].last_line, first_column: h[h.length - (L || 1)].first_column, last_column: h[h.length - 1].last_column }, v && (I._$.range = [h[h.length - (L || 1)].range[0], h[h.length - 1].range[1]]), O = this.performAction.call(I, u, m, l, this.yy, $[1], f, h), typeof O < "u")
                  return O;
                L && (p = p.slice(0, -1 * L * 2), f = f.slice(0, -1 * L), h = h.slice(0, -1 * L)), p.push(this.productions_[$[1]][0]), f.push(I.$), h.push(I._$), M = c[p[p.length - 2]][p[p.length - 1]], p.push(M);
                break;
              case 3:
                return !0;
            }
          }
          return !0;
        }
      }, r = (function() {
        var a = {
          EOF: 1,
          parseError: function(d, p) {
            if (this.yy.parser)
              this.yy.parser.parseError(d, p);
            else
              throw new Error(d);
          },
          setInput: function(d) {
            return this._input = d, this._more = this._less = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = ["INITIAL"], this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 }, this.options.ranges && (this.yylloc.range = [0, 0]), this.offset = 0, this;
          },
          input: function() {
            var d = this._input[0];
            this.yytext += d, this.yyleng++, this.offset++, this.match += d, this.matched += d;
            var p = d.match(/(?:\r\n?|\n).*/g);
            return p ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), d;
          },
          unput: function(d) {
            var p = d.length, f = d.split(/(?:\r\n?|\n)/g);
            this._input = d + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - p - 1), this.offset -= p;
            var h = this.match.split(/(?:\r\n?|\n)/g);
            this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), f.length - 1 && (this.yylineno -= f.length - 1);
            var c = this.yylloc.range;
            return this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: f ? (f.length === h.length ? this.yylloc.first_column : 0) + h[h.length - f.length].length - f[0].length : this.yylloc.first_column - p
            }, this.options.ranges && (this.yylloc.range = [c[0], c[0] + this.yyleng - p]), this;
          },
          more: function() {
            return this._more = !0, this;
          },
          less: function(d) {
            this.unput(this.match.slice(d));
          },
          pastInput: function() {
            var d = this.matched.substr(0, this.matched.length - this.match.length);
            return (d.length > 20 ? "..." : "") + d.substr(-20).replace(/\n/g, "");
          },
          upcomingInput: function() {
            var d = this.match;
            return d.length < 20 && (d += this._input.substr(0, 20 - d.length)), (d.substr(0, 20) + (d.length > 20 ? "..." : "")).replace(/\n/g, "");
          },
          showPosition: function() {
            var d = this.pastInput(), p = new Array(d.length + 1).join("-");
            return d + this.upcomingInput() + `
` + p + "^";
          },
          next: function() {
            if (this.done)
              return this.EOF;
            this._input || (this.done = !0);
            var d, p, f, h, c;
            this._more || (this.yytext = "", this.match = "");
            for (var u = this._currentRules(), l = 0; l < u.length && (f = this._input.match(this.rules[u[l]]), !(f && (!p || f[0].length > p[0].length) && (p = f, h = l, !this.options.flex))); l++)
              ;
            return p ? (c = p[0].match(/(?:\r\n?|\n).*/g), c && (this.yylineno += c.length), this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: c ? c[c.length - 1].length - c[c.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + p[0].length
            }, this.yytext += p[0], this.match += p[0], this.matches = p, this.yyleng = this.yytext.length, this.options.ranges && (this.yylloc.range = [this.offset, this.offset += this.yyleng]), this._more = !1, this._input = this._input.slice(p[0].length), this.matched += p[0], d = this.performAction.call(this, this.yy, this, u[h], this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done = !1), d || void 0) : this._input === "" ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + `. Unrecognized text.
` + this.showPosition(), { text: "", token: null, line: this.yylineno });
          },
          lex: function() {
            var d = this.next();
            return typeof d < "u" ? d : this.lex();
          },
          begin: function(d) {
            this.conditionStack.push(d);
          },
          popState: function() {
            return this.conditionStack.pop();
          },
          _currentRules: function() {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
          },
          topState: function() {
            return this.conditionStack[this.conditionStack.length - 2];
          },
          pushState: function(d) {
            this.begin(d);
          }
        };
        return a.options = {}, a.performAction = function(d, p, f, h) {
          function c(u, l) {
            return p.yytext = p.yytext.substring(u, p.yyleng - l + u);
          }
          switch (f) {
            case 0:
              if (p.yytext.slice(-2) === "\\\\" ? (c(0, 1), this.begin("mu")) : p.yytext.slice(-1) === "\\" ? (c(0, 1), this.begin("emu")) : this.begin("mu"), p.yytext) return 15;
              break;
            case 1:
              return 15;
            case 2:
              return this.popState(), 15;
            case 3:
              return this.begin("raw"), 15;
            case 4:
              return this.popState(), this.conditionStack[this.conditionStack.length - 1] === "raw" ? 15 : (c(5, 9), "END_RAW_BLOCK");
            case 5:
              return 15;
            case 6:
              return this.popState(), 14;
            case 7:
              return 65;
            case 8:
              return 68;
            case 9:
              return 19;
            case 10:
              return this.popState(), this.begin("raw"), 23;
            case 11:
              return 55;
            case 12:
              return 60;
            case 13:
              return 29;
            case 14:
              return 47;
            case 15:
              return this.popState(), 44;
            case 16:
              return this.popState(), 44;
            case 17:
              return 34;
            case 18:
              return 39;
            case 19:
              return 51;
            case 20:
              return 48;
            case 21:
              this.unput(p.yytext), this.popState(), this.begin("com");
              break;
            case 22:
              return this.popState(), 14;
            case 23:
              return 48;
            case 24:
              return 73;
            case 25:
              return 72;
            case 26:
              return 72;
            case 27:
              return 87;
            case 28:
              break;
            case 29:
              return this.popState(), 54;
            case 30:
              return this.popState(), 33;
            case 31:
              return p.yytext = c(1, 2).replace(/\\"/g, '"'), 80;
            case 32:
              return p.yytext = c(1, 2).replace(/\\'/g, "'"), 80;
            case 33:
              return 85;
            case 34:
              return 82;
            case 35:
              return 82;
            case 36:
              return 83;
            case 37:
              return 84;
            case 38:
              return 81;
            case 39:
              return 75;
            case 40:
              return 77;
            case 41:
              return 72;
            case 42:
              return p.yytext = p.yytext.replace(/\\([\\\]])/g, "$1"), 72;
            case 43:
              return "INVALID";
            case 44:
              return 5;
          }
        }, a.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{(?=[^\/]))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]+?(?=(\{\{\{\{)))/, /^(?:[\s\S]*?--(~)?\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#>)/, /^(?:\{\{(~)?#\*?)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{(~)?!--)/, /^(?:\{\{(~)?![\s\S]*?\}\})/, /^(?:\{\{(~)?\*?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)|])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:undefined(?=([~}\s)])))/, /^(?:null(?=([~}\s)])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/, /^(?:as\s+\|)/, /^(?:\|)/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/, /^(?:\[(\\\]|[^\]])*\])/, /^(?:.)/, /^(?:$)/], a.conditions = { mu: { rules: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44], inclusive: !1 }, emu: { rules: [2], inclusive: !1 }, com: { rules: [6], inclusive: !1 }, raw: { rules: [3, 4, 5], inclusive: !1 }, INITIAL: { rules: [0, 1, 44], inclusive: !0 } }, a;
      })();
      i.lexer = r;
      function o() {
        this.yy = {};
      }
      return o.prototype = i, i.Parser = o, new o();
    })();
    t.default = n, e.exports = t.default;
  })(Sn, Sn.exports)), Sn.exports;
}
var kn = { exports: {} }, wn = { exports: {} }, Ku;
function Gc() {
  return Ku || (Ku = 1, (function(e, t) {
    t.__esModule = !0;
    function n(p) {
      return p && p.__esModule ? p : { default: p };
    }
    var i = De(), r = n(i);
    function o() {
      this.parents = [];
    }
    o.prototype = {
      constructor: o,
      mutating: !1,
      // Visits a given value. If mutating, will replace the value if necessary.
      acceptKey: function(f, h) {
        var c = this.accept(f[h]);
        if (this.mutating) {
          if (c && !o.prototype[c.type])
            throw new r.default('Unexpected node type "' + c.type + '" found when accepting ' + h + " on " + f.type);
          f[h] = c;
        }
      },
      // Performs an accept operation with added sanity check to ensure
      // required keys are not removed.
      acceptRequired: function(f, h) {
        if (this.acceptKey(f, h), !f[h])
          throw new r.default(f.type + " requires " + h);
      },
      // Traverses a given array. If mutating, empty respnses will be removed
      // for child elements.
      acceptArray: function(f) {
        for (var h = 0, c = f.length; h < c; h++)
          this.acceptKey(f, h), f[h] || (f.splice(h, 1), h--, c--);
      },
      accept: function(f) {
        if (f) {
          if (!this[f.type])
            throw new r.default("Unknown type: " + f.type, f);
          this.current && this.parents.unshift(this.current), this.current = f;
          var h = this[f.type](f);
          if (this.current = this.parents.shift(), !this.mutating || h)
            return h;
          if (h !== !1)
            return f;
        }
      },
      Program: function(f) {
        this.acceptArray(f.body);
      },
      MustacheStatement: a,
      Decorator: a,
      BlockStatement: s,
      DecoratorBlock: s,
      PartialStatement: d,
      PartialBlockStatement: function(f) {
        d.call(this, f), this.acceptKey(f, "program");
      },
      ContentStatement: function() {
      },
      CommentStatement: function() {
      },
      SubExpression: a,
      PathExpression: function() {
      },
      StringLiteral: function() {
      },
      NumberLiteral: function() {
      },
      BooleanLiteral: function() {
      },
      UndefinedLiteral: function() {
      },
      NullLiteral: function() {
      },
      Hash: function(f) {
        this.acceptArray(f.pairs);
      },
      HashPair: function(f) {
        this.acceptRequired(f, "value");
      }
    };
    function a(p) {
      this.acceptRequired(p, "path"), this.acceptArray(p.params), this.acceptKey(p, "hash");
    }
    function s(p) {
      a.call(this, p), this.acceptKey(p, "program"), this.acceptKey(p, "inverse");
    }
    function d(p) {
      this.acceptRequired(p, "name"), this.acceptArray(p.params), this.acceptKey(p, "hash");
    }
    t.default = o, e.exports = t.default;
  })(wn, wn.exports)), wn.exports;
}
var Yu;
function P$() {
  return Yu || (Yu = 1, (function(e, t) {
    t.__esModule = !0;
    function n(f) {
      return f && f.__esModule ? f : { default: f };
    }
    var i = Gc(), r = n(i);
    function o() {
      var f = arguments.length <= 0 || arguments[0] === void 0 ? {} : arguments[0];
      this.options = f;
    }
    o.prototype = new r.default(), o.prototype.Program = function(f) {
      var h = !this.options.ignoreStandalone, c = !this.isRootSeen;
      this.isRootSeen = !0;
      for (var u = f.body, l = 0, m = u.length; l < m; l++) {
        var g = u[l], v = this.accept(g);
        if (v) {
          var _ = a(u, l, c), x = s(u, l, c), y = v.openStandalone && _, $ = v.closeStandalone && x, O = v.inlineStandalone && _ && x;
          v.close && d(u, l, !0), v.open && p(u, l, !0), h && O && (d(u, l), p(u, l) && g.type === "PartialStatement" && (g.indent = /([ \t]+$)/.exec(u[l - 1].original)[1])), h && y && (d((g.program || g.inverse).body), p(u, l)), h && $ && (d(u, l), p((g.inverse || g.program).body));
        }
      }
      return f;
    }, o.prototype.BlockStatement = o.prototype.DecoratorBlock = o.prototype.PartialBlockStatement = function(f) {
      this.accept(f.program), this.accept(f.inverse);
      var h = f.program || f.inverse, c = f.program && f.inverse, u = c, l = c;
      if (c && c.chained)
        for (u = c.body[0].program; l.chained; )
          l = l.body[l.body.length - 1].program;
      var m = {
        open: f.openStrip.open,
        close: f.closeStrip.close,
        // Determine the standalone candiacy. Basically flag our content as being possibly standalone
        // so our parent can determine if we actually are standalone
        openStandalone: s(h.body),
        closeStandalone: a((u || h).body)
      };
      if (f.openStrip.close && d(h.body, null, !0), c) {
        var g = f.inverseStrip;
        g.open && p(h.body, null, !0), g.close && d(u.body, null, !0), f.closeStrip.open && p(l.body, null, !0), !this.options.ignoreStandalone && a(h.body) && s(u.body) && (p(h.body), d(u.body));
      } else f.closeStrip.open && p(h.body, null, !0);
      return m;
    }, o.prototype.Decorator = o.prototype.MustacheStatement = function(f) {
      return f.strip;
    }, o.prototype.PartialStatement = o.prototype.CommentStatement = function(f) {
      var h = f.strip || {};
      return {
        inlineStandalone: !0,
        open: h.open,
        close: h.close
      };
    };
    function a(f, h, c) {
      h === void 0 && (h = f.length);
      var u = f[h - 1], l = f[h - 2];
      if (!u)
        return c;
      if (u.type === "ContentStatement")
        return (l || !c ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(u.original);
    }
    function s(f, h, c) {
      h === void 0 && (h = -1);
      var u = f[h + 1], l = f[h + 2];
      if (!u)
        return c;
      if (u.type === "ContentStatement")
        return (l || !c ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(u.original);
    }
    function d(f, h, c) {
      var u = f[h == null ? 0 : h + 1];
      if (!(!u || u.type !== "ContentStatement" || !c && u.rightStripped)) {
        var l = u.value;
        u.value = u.value.replace(c ? /^\s+/ : /^[ \t]*\r?\n?/, ""), u.rightStripped = u.value !== l;
      }
    }
    function p(f, h, c) {
      var u = f[h == null ? f.length - 1 : h - 1];
      if (!(!u || u.type !== "ContentStatement" || !c && u.leftStripped)) {
        var l = u.value;
        return u.value = u.value.replace(c ? /\s+$/ : /[ \t]+$/, ""), u.leftStripped = u.value !== l, u.leftStripped;
      }
    }
    t.default = o, e.exports = t.default;
  })(kn, kn.exports)), kn.exports;
}
var Ie = {}, Xu;
function N$() {
  if (Xu) return Ie;
  Xu = 1, Ie.__esModule = !0, Ie.SourceLocation = r, Ie.id = o, Ie.stripFlags = a, Ie.stripComment = s, Ie.preparePath = d, Ie.prepareMustache = p, Ie.prepareRawBlock = f, Ie.prepareBlock = h, Ie.prepareProgram = c, Ie.preparePartialBlock = u;
  function e(l) {
    return l && l.__esModule ? l : { default: l };
  }
  var t = De(), n = e(t);
  function i(l, m) {
    if (m = m.path ? m.path.original : m, l.path.original !== m) {
      var g = { loc: l.path.loc };
      throw new n.default(l.path.original + " doesn't match " + m, g);
    }
  }
  function r(l, m) {
    this.source = l, this.start = {
      line: m.first_line,
      column: m.first_column
    }, this.end = {
      line: m.last_line,
      column: m.last_column
    };
  }
  function o(l) {
    return /^\[.*\]$/.test(l) ? l.substring(1, l.length - 1) : l;
  }
  function a(l, m) {
    return {
      open: l.charAt(2) === "~",
      close: m.charAt(m.length - 3) === "~"
    };
  }
  function s(l) {
    return l.replace(/^\{\{~?!-?-?/, "").replace(/-?-?~?\}\}$/, "");
  }
  function d(l, m, g) {
    g = this.locInfo(g);
    for (var v = l ? "@" : "", _ = [], x = 0, y = 0, $ = m.length; y < $; y++) {
      var O = m[y].part, I = m[y].original !== O;
      if (v += (m[y].separator || "") + O, !I && (O === ".." || O === "." || O === "this")) {
        if (_.length > 0)
          throw new n.default("Invalid path: " + v, { loc: g });
        O === ".." && x++;
      } else
        _.push(O);
    }
    return {
      type: "PathExpression",
      data: l,
      depth: x,
      parts: _,
      original: v,
      loc: g
    };
  }
  function p(l, m, g, v, _, x) {
    var y = v.charAt(3) || v.charAt(2), $ = y !== "{" && y !== "&", O = /\*/.test(v);
    return {
      type: O ? "Decorator" : "MustacheStatement",
      path: l,
      params: m,
      hash: g,
      escaped: $,
      strip: _,
      loc: this.locInfo(x)
    };
  }
  function f(l, m, g, v) {
    i(l, g), v = this.locInfo(v);
    var _ = {
      type: "Program",
      body: m,
      strip: {},
      loc: v
    };
    return {
      type: "BlockStatement",
      path: l.path,
      params: l.params,
      hash: l.hash,
      program: _,
      openStrip: {},
      inverseStrip: {},
      closeStrip: {},
      loc: v
    };
  }
  function h(l, m, g, v, _, x) {
    v && v.path && i(l, v);
    var y = /\*/.test(l.open);
    m.blockParams = l.blockParams;
    var $ = void 0, O = void 0;
    if (g) {
      if (y)
        throw new n.default("Unexpected inverse block on decorator", g);
      g.chain && (g.program.body[0].closeStrip = v.strip), O = g.strip, $ = g.program;
    }
    return _ && (_ = $, $ = m, m = _), {
      type: y ? "DecoratorBlock" : "BlockStatement",
      path: l.path,
      params: l.params,
      hash: l.hash,
      program: m,
      inverse: $,
      openStrip: l.strip,
      inverseStrip: O,
      closeStrip: v && v.strip,
      loc: this.locInfo(x)
    };
  }
  function c(l, m) {
    if (!m && l.length) {
      var g = l[0].loc, v = l[l.length - 1].loc;
      g && v && (m = {
        source: g.source,
        start: {
          line: g.start.line,
          column: g.start.column
        },
        end: {
          line: v.end.line,
          column: v.end.column
        }
      });
    }
    return {
      type: "Program",
      body: l,
      strip: {},
      loc: m
    };
  }
  function u(l, m, g, v) {
    return i(l, g), {
      type: "PartialBlockStatement",
      name: l.path,
      params: l.params,
      hash: l.hash,
      program: m,
      openStrip: l.strip,
      closeStrip: g && g.strip,
      loc: this.locInfo(v)
    };
  }
  return Ie;
}
var Qu;
function T$() {
  if (Qu) return Ft;
  Qu = 1, Ft.__esModule = !0, Ft.parseWithoutProcessing = c, Ft.parse = u;
  function e(v) {
    if (v && v.__esModule)
      return v;
    var _ = {};
    if (v != null)
      for (var x in v)
        Object.prototype.hasOwnProperty.call(v, x) && (_[x] = v[x]);
    return _.default = v, _;
  }
  function t(v) {
    return v && v.__esModule ? v : { default: v };
  }
  var n = E$(), i = t(n), r = P$(), o = t(r), a = N$(), s = e(a), d = De(), p = t(d), f = ke();
  Ft.parser = i.default;
  var h = {};
  f.extend(h, s);
  function c(v, _) {
    if (v.type === "Program")
      return l(v), v;
    i.default.yy = h, h.locInfo = function(y) {
      return new h.SourceLocation(_ && _.srcName, y);
    };
    var x = i.default.parse(v);
    return x;
  }
  function u(v, _) {
    var x = c(v, _), y = new o.default(_);
    return y.accept(x);
  }
  function l(v) {
    m(v);
  }
  function m(v) {
    if (v != null) {
      if (Array.isArray(v)) {
        v.forEach(m);
        return;
      }
      if (typeof v == "object") {
        if (v.type === "PathExpression") {
          if (!g(v.depth))
            throw new p.default("Invalid AST: PathExpression.depth must be an integer");
          if (!Array.isArray(v.parts))
            throw new p.default("Invalid AST: PathExpression.parts must be an array");
          for (var _ = 0; _ < v.parts.length; _++)
            if (typeof v.parts[_] != "string")
              throw new p.default("Invalid AST: PathExpression.parts must only contain strings");
        } else if (v.type === "NumberLiteral") {
          if (typeof v.value != "number" || !isFinite(v.value))
            throw new p.default("Invalid AST: NumberLiteral.value must be a number");
        } else if (v.type === "BooleanLiteral" && typeof v.value != "boolean")
          throw new p.default("Invalid AST: BooleanLiteral.value must be a boolean");
        Object.keys(v).forEach(function(x) {
          x !== "loc" && m(v[x]);
        });
      }
    }
  }
  function g(v) {
    return typeof v == "number" && isFinite(v) && Math.floor(v) === v && v >= 0;
  }
  return Ft;
}
var Bt = {}, el;
function z$() {
  if (el) return Bt;
  el = 1, Bt.__esModule = !0, Bt.Compiler = s, Bt.precompile = d, Bt.compile = p;
  function e(c) {
    return c && c.__esModule ? c : { default: c };
  }
  var t = De(), n = e(t), i = ke(), r = Bc(), o = e(r), a = [].slice;
  function s() {
  }
  s.prototype = {
    compiler: s,
    equals: function(u) {
      var l = this.opcodes.length;
      if (u.opcodes.length !== l)
        return !1;
      for (var m = 0; m < l; m++) {
        var g = this.opcodes[m], v = u.opcodes[m];
        if (g.opcode !== v.opcode || !f(g.args, v.args))
          return !1;
      }
      l = this.children.length;
      for (var m = 0; m < l; m++)
        if (!this.children[m].equals(u.children[m]))
          return !1;
      return !0;
    },
    guid: 0,
    compile: function(u, l) {
      return this.sourceNode = [], this.opcodes = [], this.children = [], this.options = l, this.stringParams = l.stringParams, this.trackIds = l.trackIds, l.blockParams = l.blockParams || [], l.knownHelpers = i.extend(/* @__PURE__ */ Object.create(null), {
        helperMissing: !0,
        blockHelperMissing: !0,
        each: !0,
        if: !0,
        unless: !0,
        with: !0,
        log: !0,
        lookup: !0
      }, l.knownHelpers), this.accept(u);
    },
    compileProgram: function(u) {
      var l = new this.compiler(), m = l.compile(u, this.options), g = this.guid++;
      return this.usePartial = this.usePartial || m.usePartial, this.children[g] = m, this.useDepths = this.useDepths || m.useDepths, g;
    },
    accept: function(u) {
      if (!this[u.type])
        throw new n.default("Unknown type: " + u.type, u);
      this.sourceNode.unshift(u);
      var l = this[u.type](u);
      return this.sourceNode.shift(), l;
    },
    Program: function(u) {
      this.options.blockParams.unshift(u.blockParams);
      for (var l = u.body, m = l.length, g = 0; g < m; g++)
        this.accept(l[g]);
      return this.options.blockParams.shift(), this.isSimple = m === 1, this.blockParams = u.blockParams ? u.blockParams.length : 0, this;
    },
    BlockStatement: function(u) {
      h(u);
      var l = u.program, m = u.inverse;
      l = l && this.compileProgram(l), m = m && this.compileProgram(m);
      var g = this.classifySexpr(u);
      g === "helper" ? this.helperSexpr(u, l, m) : g === "simple" ? (this.simpleSexpr(u), this.opcode("pushProgram", l), this.opcode("pushProgram", m), this.opcode("emptyHash"), this.opcode("blockValue", u.path.original)) : (this.ambiguousSexpr(u, l, m), this.opcode("pushProgram", l), this.opcode("pushProgram", m), this.opcode("emptyHash"), this.opcode("ambiguousBlockValue")), this.opcode("append");
    },
    DecoratorBlock: function(u) {
      var l = u.program && this.compileProgram(u.program), m = this.setupFullMustacheParams(u, l, void 0), g = u.path;
      this.useDecorators = !0, this.opcode("registerDecorator", m.length, g.original);
    },
    PartialStatement: function(u) {
      this.usePartial = !0;
      var l = u.program;
      l && (l = this.compileProgram(u.program));
      var m = u.params;
      if (m.length > 1)
        throw new n.default("Unsupported number of partial arguments: " + m.length, u);
      m.length || (this.options.explicitPartialContext ? this.opcode("pushLiteral", "undefined") : m.push({ type: "PathExpression", parts: [], depth: 0 }));
      var g = u.name.original, v = u.name.type === "SubExpression";
      v && this.accept(u.name), this.setupFullMustacheParams(u, l, void 0, !0);
      var _ = u.indent || "";
      this.options.preventIndent && _ && (this.opcode("appendContent", _), _ = ""), this.opcode("invokePartial", v, g, _), this.opcode("append");
    },
    PartialBlockStatement: function(u) {
      this.PartialStatement(u);
    },
    MustacheStatement: function(u) {
      this.SubExpression(u), u.escaped && !this.options.noEscape ? this.opcode("appendEscaped") : this.opcode("append");
    },
    Decorator: function(u) {
      this.DecoratorBlock(u);
    },
    ContentStatement: function(u) {
      u.value && this.opcode("appendContent", u.value);
    },
    CommentStatement: function() {
    },
    SubExpression: function(u) {
      h(u);
      var l = this.classifySexpr(u);
      l === "simple" ? this.simpleSexpr(u) : l === "helper" ? this.helperSexpr(u) : this.ambiguousSexpr(u);
    },
    ambiguousSexpr: function(u, l, m) {
      var g = u.path, v = g.parts[0], _ = l != null || m != null;
      this.opcode("getContext", g.depth), this.opcode("pushProgram", l), this.opcode("pushProgram", m), g.strict = !0, this.accept(g), this.opcode("invokeAmbiguous", v, _);
    },
    simpleSexpr: function(u) {
      var l = u.path;
      l.strict = !0, this.accept(l), this.opcode("resolvePossibleLambda");
    },
    helperSexpr: function(u, l, m) {
      var g = this.setupFullMustacheParams(u, l, m), v = u.path, _ = v.parts[0];
      if (this.options.knownHelpers[_])
        this.opcode("invokeKnownHelper", g.length, _);
      else {
        if (this.options.knownHelpersOnly)
          throw new n.default("You specified knownHelpersOnly, but used the unknown helper " + _, u);
        v.strict = !0, v.falsy = !0, this.accept(v), this.opcode("invokeHelper", g.length, v.original, o.default.helpers.simpleId(v));
      }
    },
    PathExpression: function(u) {
      this.addDepth(u.depth), this.opcode("getContext", u.depth);
      var l = u.parts[0], m = o.default.helpers.scopedId(u), g = !u.depth && !m && this.blockParamIndex(l);
      g ? this.opcode("lookupBlockParam", g, u.parts) : l ? u.data ? (this.options.data = !0, this.opcode("lookupData", u.depth, u.parts, u.strict)) : this.opcode("lookupOnContext", u.parts, u.falsy, u.strict, m) : this.opcode("pushContext");
    },
    StringLiteral: function(u) {
      this.opcode("pushString", u.value);
    },
    NumberLiteral: function(u) {
      this.opcode("pushLiteral", u.value);
    },
    BooleanLiteral: function(u) {
      this.opcode("pushLiteral", u.value);
    },
    UndefinedLiteral: function() {
      this.opcode("pushLiteral", "undefined");
    },
    NullLiteral: function() {
      this.opcode("pushLiteral", "null");
    },
    Hash: function(u) {
      var l = u.pairs, m = 0, g = l.length;
      for (this.opcode("pushHash"); m < g; m++)
        this.pushParam(l[m].value);
      for (; m--; )
        this.opcode("assignToHash", l[m].key);
      this.opcode("popHash");
    },
    // HELPERS
    opcode: function(u) {
      this.opcodes.push({
        opcode: u,
        args: a.call(arguments, 1),
        loc: this.sourceNode[0].loc
      });
    },
    addDepth: function(u) {
      u && (this.useDepths = !0);
    },
    classifySexpr: function(u) {
      var l = o.default.helpers.simpleId(u.path), m = l && !!this.blockParamIndex(u.path.parts[0]), g = !m && o.default.helpers.helperExpression(u), v = !m && (g || l);
      if (v && !g) {
        var _ = u.path.parts[0], x = this.options;
        x.knownHelpers[_] ? g = !0 : x.knownHelpersOnly && (v = !1);
      }
      return g ? "helper" : v ? "ambiguous" : "simple";
    },
    pushParams: function(u) {
      for (var l = 0, m = u.length; l < m; l++)
        this.pushParam(u[l]);
    },
    pushParam: function(u) {
      var l = u.value != null ? u.value : u.original || "";
      if (this.stringParams)
        l.replace && (l = l.replace(/^(\.?\.\/)*/g, "").replace(/\//g, ".")), u.depth && this.addDepth(u.depth), this.opcode("getContext", u.depth || 0), this.opcode("pushStringParam", l, u.type), u.type === "SubExpression" && this.accept(u);
      else {
        if (this.trackIds) {
          var m = void 0;
          if (u.parts && !o.default.helpers.scopedId(u) && !u.depth && (m = this.blockParamIndex(u.parts[0])), m) {
            var g = u.parts.slice(1).join(".");
            this.opcode("pushId", "BlockParam", m, g);
          } else
            l = u.original || l, l.replace && (l = l.replace(/^this(?:\.|$)/, "").replace(/^\.\//, "").replace(/^\.$/, "")), this.opcode("pushId", u.type, l);
        }
        this.accept(u);
      }
    },
    setupFullMustacheParams: function(u, l, m, g) {
      var v = u.params;
      return this.pushParams(v), this.opcode("pushProgram", l), this.opcode("pushProgram", m), u.hash ? this.accept(u.hash) : this.opcode("emptyHash", g), v;
    },
    blockParamIndex: function(u) {
      for (var l = 0, m = this.options.blockParams.length; l < m; l++) {
        var g = this.options.blockParams[l], v = g && i.indexOf(g, u);
        if (g && v >= 0)
          return [l, v];
      }
    }
  };
  function d(c, u, l) {
    if (c == null || typeof c != "string" && c.type !== "Program")
      throw new n.default("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + c);
    u = u || {}, "data" in u || (u.data = !0), u.compat && (u.useDepths = !0);
    var m = l.parse(c, u), g = new l.Compiler().compile(m, u);
    return new l.JavaScriptCompiler().compile(g, u);
  }
  function p(c, u, l) {
    if (u === void 0 && (u = {}), c == null || typeof c != "string" && c.type !== "Program")
      throw new n.default("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + c);
    u = i.extend({}, u), "data" in u || (u.data = !0), u.compat && (u.useDepths = !0);
    var m = void 0;
    function g() {
      var _ = l.parse(c, u), x = new l.Compiler().compile(_, u), y = new l.JavaScriptCompiler().compile(x, u, void 0, !0);
      return l.template(y);
    }
    function v(_, x) {
      return m || (m = g()), m.call(this, _, x);
    }
    return v._setup = function(_) {
      return m || (m = g()), m._setup(_);
    }, v._child = function(_, x, y, $) {
      return m || (m = g()), m._child(_, x, y, $);
    }, v;
  }
  function f(c, u) {
    if (c === u)
      return !0;
    if (i.isArray(c) && i.isArray(u) && c.length === u.length) {
      for (var l = 0; l < c.length; l++)
        if (!f(c[l], u[l]))
          return !1;
      return !0;
    }
  }
  function h(c) {
    if (!c.path.parts) {
      var u = c.path;
      c.path = {
        type: "PathExpression",
        data: !1,
        depth: 0,
        parts: [u.original + ""],
        original: u.original + "",
        loc: u.loc
      };
    }
  }
  return Bt;
}
var In = { exports: {} }, xn = { exports: {} }, gr = {}, ao = {}, On = {}, En = {}, tl;
function A$() {
  if (tl) return En;
  tl = 1;
  var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  return En.encode = function(t) {
    if (0 <= t && t < e.length)
      return e[t];
    throw new TypeError("Must be between 0 and 63: " + t);
  }, En.decode = function(t) {
    var n = 65, i = 90, r = 97, o = 122, a = 48, s = 57, d = 43, p = 47, f = 26, h = 52;
    return n <= t && t <= i ? t - n : r <= t && t <= o ? t - r + f : a <= t && t <= s ? t - a + h : t == d ? 62 : t == p ? 63 : -1;
  }, En;
}
var rl;
function Hc() {
  if (rl) return On;
  rl = 1;
  var e = A$(), t = 5, n = 1 << t, i = n - 1, r = n;
  function o(s) {
    return s < 0 ? (-s << 1) + 1 : (s << 1) + 0;
  }
  function a(s) {
    var d = (s & 1) === 1, p = s >> 1;
    return d ? -p : p;
  }
  return On.encode = function(d) {
    var p = "", f, h = o(d);
    do
      f = h & i, h >>>= t, h > 0 && (f |= r), p += e.encode(f);
    while (h > 0);
    return p;
  }, On.decode = function(d, p, f) {
    var h = d.length, c = 0, u = 0, l, m;
    do {
      if (p >= h)
        throw new Error("Expected more digits in base 64 VLQ value.");
      if (m = e.decode(d.charCodeAt(p++)), m === -1)
        throw new Error("Invalid base64 digit: " + d.charAt(p - 1));
      l = !!(m & r), m &= i, c = c + (m << u), u += t;
    } while (l);
    f.value = a(c), f.rest = p;
  }, On;
}
var so = {}, nl;
function Pr() {
  return nl || (nl = 1, (function(e) {
    function t(y, $, O) {
      if ($ in y)
        return y[$];
      if (arguments.length === 3)
        return O;
      throw new Error('"' + $ + '" is a required argument.');
    }
    e.getArg = t;
    var n = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/, i = /^data:.+\,.+$/;
    function r(y) {
      var $ = y.match(n);
      return $ ? {
        scheme: $[1],
        auth: $[2],
        host: $[3],
        port: $[4],
        path: $[5]
      } : null;
    }
    e.urlParse = r;
    function o(y) {
      var $ = "";
      return y.scheme && ($ += y.scheme + ":"), $ += "//", y.auth && ($ += y.auth + "@"), y.host && ($ += y.host), y.port && ($ += ":" + y.port), y.path && ($ += y.path), $;
    }
    e.urlGenerate = o;
    function a(y) {
      var $ = y, O = r(y);
      if (O) {
        if (!O.path)
          return y;
        $ = O.path;
      }
      for (var I = e.isAbsolute($), D = $.split(/\/+/), L, M = 0, b = D.length - 1; b >= 0; b--)
        L = D[b], L === "." ? D.splice(b, 1) : L === ".." ? M++ : M > 0 && (L === "" ? (D.splice(b + 1, M), M = 0) : (D.splice(b, 2), M--));
      return $ = D.join("/"), $ === "" && ($ = I ? "/" : "."), O ? (O.path = $, o(O)) : $;
    }
    e.normalize = a;
    function s(y, $) {
      y === "" && (y = "."), $ === "" && ($ = ".");
      var O = r($), I = r(y);
      if (I && (y = I.path || "/"), O && !O.scheme)
        return I && (O.scheme = I.scheme), o(O);
      if (O || $.match(i))
        return $;
      if (I && !I.host && !I.path)
        return I.host = $, o(I);
      var D = $.charAt(0) === "/" ? $ : a(y.replace(/\/+$/, "") + "/" + $);
      return I ? (I.path = D, o(I)) : D;
    }
    e.join = s, e.isAbsolute = function(y) {
      return y.charAt(0) === "/" || n.test(y);
    };
    function d(y, $) {
      y === "" && (y = "."), y = y.replace(/\/$/, "");
      for (var O = 0; $.indexOf(y + "/") !== 0; ) {
        var I = y.lastIndexOf("/");
        if (I < 0 || (y = y.slice(0, I), y.match(/^([^\/]+:\/)?\/*$/)))
          return $;
        ++O;
      }
      return Array(O + 1).join("../") + $.substr(y.length + 1);
    }
    e.relative = d;
    var p = (function() {
      var y = /* @__PURE__ */ Object.create(null);
      return !("__proto__" in y);
    })();
    function f(y) {
      return y;
    }
    function h(y) {
      return u(y) ? "$" + y : y;
    }
    e.toSetString = p ? f : h;
    function c(y) {
      return u(y) ? y.slice(1) : y;
    }
    e.fromSetString = p ? f : c;
    function u(y) {
      if (!y)
        return !1;
      var $ = y.length;
      if ($ < 9 || y.charCodeAt($ - 1) !== 95 || y.charCodeAt($ - 2) !== 95 || y.charCodeAt($ - 3) !== 111 || y.charCodeAt($ - 4) !== 116 || y.charCodeAt($ - 5) !== 111 || y.charCodeAt($ - 6) !== 114 || y.charCodeAt($ - 7) !== 112 || y.charCodeAt($ - 8) !== 95 || y.charCodeAt($ - 9) !== 95)
        return !1;
      for (var O = $ - 10; O >= 0; O--)
        if (y.charCodeAt(O) !== 36)
          return !1;
      return !0;
    }
    function l(y, $, O) {
      var I = g(y.source, $.source);
      return I !== 0 || (I = y.originalLine - $.originalLine, I !== 0) || (I = y.originalColumn - $.originalColumn, I !== 0 || O) || (I = y.generatedColumn - $.generatedColumn, I !== 0) || (I = y.generatedLine - $.generatedLine, I !== 0) ? I : g(y.name, $.name);
    }
    e.compareByOriginalPositions = l;
    function m(y, $, O) {
      var I = y.generatedLine - $.generatedLine;
      return I !== 0 || (I = y.generatedColumn - $.generatedColumn, I !== 0 || O) || (I = g(y.source, $.source), I !== 0) || (I = y.originalLine - $.originalLine, I !== 0) || (I = y.originalColumn - $.originalColumn, I !== 0) ? I : g(y.name, $.name);
    }
    e.compareByGeneratedPositionsDeflated = m;
    function g(y, $) {
      return y === $ ? 0 : y === null ? 1 : $ === null ? -1 : y > $ ? 1 : -1;
    }
    function v(y, $) {
      var O = y.generatedLine - $.generatedLine;
      return O !== 0 || (O = y.generatedColumn - $.generatedColumn, O !== 0) || (O = g(y.source, $.source), O !== 0) || (O = y.originalLine - $.originalLine, O !== 0) || (O = y.originalColumn - $.originalColumn, O !== 0) ? O : g(y.name, $.name);
    }
    e.compareByGeneratedPositionsInflated = v;
    function _(y) {
      return JSON.parse(y.replace(/^\)]}'[^\n]*\n/, ""));
    }
    e.parseSourceMapInput = _;
    function x(y, $, O) {
      if ($ = $ || "", y && (y[y.length - 1] !== "/" && $[0] !== "/" && (y += "/"), $ = y + $), O) {
        var I = r(O);
        if (!I)
          throw new Error("sourceMapURL could not be parsed");
        if (I.path) {
          var D = I.path.lastIndexOf("/");
          D >= 0 && (I.path = I.path.substring(0, D + 1));
        }
        $ = s(o(I), $);
      }
      return a($);
    }
    e.computeSourceURL = x;
  })(so)), so;
}
var uo = {}, il;
function Jc() {
  if (il) return uo;
  il = 1;
  var e = Pr(), t = Object.prototype.hasOwnProperty, n = typeof Map < "u";
  function i() {
    this._array = [], this._set = n ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
  }
  return i.fromArray = function(o, a) {
    for (var s = new i(), d = 0, p = o.length; d < p; d++)
      s.add(o[d], a);
    return s;
  }, i.prototype.size = function() {
    return n ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  }, i.prototype.add = function(o, a) {
    var s = n ? o : e.toSetString(o), d = n ? this.has(o) : t.call(this._set, s), p = this._array.length;
    (!d || a) && this._array.push(o), d || (n ? this._set.set(o, p) : this._set[s] = p);
  }, i.prototype.has = function(o) {
    if (n)
      return this._set.has(o);
    var a = e.toSetString(o);
    return t.call(this._set, a);
  }, i.prototype.indexOf = function(o) {
    if (n) {
      var a = this._set.get(o);
      if (a >= 0)
        return a;
    } else {
      var s = e.toSetString(o);
      if (t.call(this._set, s))
        return this._set[s];
    }
    throw new Error('"' + o + '" is not in the set.');
  }, i.prototype.at = function(o) {
    if (o >= 0 && o < this._array.length)
      return this._array[o];
    throw new Error("No element indexed by " + o);
  }, i.prototype.toArray = function() {
    return this._array.slice();
  }, uo.ArraySet = i, uo;
}
var lo = {}, ol;
function D$() {
  if (ol) return lo;
  ol = 1;
  var e = Pr();
  function t(i, r) {
    var o = i.generatedLine, a = r.generatedLine, s = i.generatedColumn, d = r.generatedColumn;
    return a > o || a == o && d >= s || e.compareByGeneratedPositionsInflated(i, r) <= 0;
  }
  function n() {
    this._array = [], this._sorted = !0, this._last = { generatedLine: -1, generatedColumn: 0 };
  }
  return n.prototype.unsortedForEach = function(r, o) {
    this._array.forEach(r, o);
  }, n.prototype.add = function(r) {
    t(this._last, r) ? (this._last = r, this._array.push(r)) : (this._sorted = !1, this._array.push(r));
  }, n.prototype.toArray = function() {
    return this._sorted || (this._array.sort(e.compareByGeneratedPositionsInflated), this._sorted = !0), this._array;
  }, lo.MappingList = n, lo;
}
var al;
function Vc() {
  if (al) return ao;
  al = 1;
  var e = Hc(), t = Pr(), n = Jc().ArraySet, i = D$().MappingList;
  function r(o) {
    o || (o = {}), this._file = t.getArg(o, "file", null), this._sourceRoot = t.getArg(o, "sourceRoot", null), this._skipValidation = t.getArg(o, "skipValidation", !1), this._sources = new n(), this._names = new n(), this._mappings = new i(), this._sourcesContents = null;
  }
  return r.prototype._version = 3, r.fromSourceMap = function(a) {
    var s = a.sourceRoot, d = new r({
      file: a.file,
      sourceRoot: s
    });
    return a.eachMapping(function(p) {
      var f = {
        generated: {
          line: p.generatedLine,
          column: p.generatedColumn
        }
      };
      p.source != null && (f.source = p.source, s != null && (f.source = t.relative(s, f.source)), f.original = {
        line: p.originalLine,
        column: p.originalColumn
      }, p.name != null && (f.name = p.name)), d.addMapping(f);
    }), a.sources.forEach(function(p) {
      var f = p;
      s !== null && (f = t.relative(s, p)), d._sources.has(f) || d._sources.add(f);
      var h = a.sourceContentFor(p);
      h != null && d.setSourceContent(p, h);
    }), d;
  }, r.prototype.addMapping = function(a) {
    var s = t.getArg(a, "generated"), d = t.getArg(a, "original", null), p = t.getArg(a, "source", null), f = t.getArg(a, "name", null);
    this._skipValidation || this._validateMapping(s, d, p, f), p != null && (p = String(p), this._sources.has(p) || this._sources.add(p)), f != null && (f = String(f), this._names.has(f) || this._names.add(f)), this._mappings.add({
      generatedLine: s.line,
      generatedColumn: s.column,
      originalLine: d != null && d.line,
      originalColumn: d != null && d.column,
      source: p,
      name: f
    });
  }, r.prototype.setSourceContent = function(a, s) {
    var d = a;
    this._sourceRoot != null && (d = t.relative(this._sourceRoot, d)), s != null ? (this._sourcesContents || (this._sourcesContents = /* @__PURE__ */ Object.create(null)), this._sourcesContents[t.toSetString(d)] = s) : this._sourcesContents && (delete this._sourcesContents[t.toSetString(d)], Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null));
  }, r.prototype.applySourceMap = function(a, s, d) {
    var p = s;
    if (s == null) {
      if (a.file == null)
        throw new Error(
          `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
        );
      p = a.file;
    }
    var f = this._sourceRoot;
    f != null && (p = t.relative(f, p));
    var h = new n(), c = new n();
    this._mappings.unsortedForEach(function(u) {
      if (u.source === p && u.originalLine != null) {
        var l = a.originalPositionFor({
          line: u.originalLine,
          column: u.originalColumn
        });
        l.source != null && (u.source = l.source, d != null && (u.source = t.join(d, u.source)), f != null && (u.source = t.relative(f, u.source)), u.originalLine = l.line, u.originalColumn = l.column, l.name != null && (u.name = l.name));
      }
      var m = u.source;
      m != null && !h.has(m) && h.add(m);
      var g = u.name;
      g != null && !c.has(g) && c.add(g);
    }, this), this._sources = h, this._names = c, a.sources.forEach(function(u) {
      var l = a.sourceContentFor(u);
      l != null && (d != null && (u = t.join(d, u)), f != null && (u = t.relative(f, u)), this.setSourceContent(u, l));
    }, this);
  }, r.prototype._validateMapping = function(a, s, d, p) {
    if (s && typeof s.line != "number" && typeof s.column != "number")
      throw new Error(
        "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values."
      );
    if (!(a && "line" in a && "column" in a && a.line > 0 && a.column >= 0 && !s && !d && !p)) {
      if (a && "line" in a && "column" in a && s && "line" in s && "column" in s && a.line > 0 && a.column >= 0 && s.line > 0 && s.column >= 0 && d)
        return;
      throw new Error("Invalid mapping: " + JSON.stringify({
        generated: a,
        source: d,
        original: s,
        name: p
      }));
    }
  }, r.prototype._serializeMappings = function() {
    for (var a = 0, s = 1, d = 0, p = 0, f = 0, h = 0, c = "", u, l, m, g, v = this._mappings.toArray(), _ = 0, x = v.length; _ < x; _++) {
      if (l = v[_], u = "", l.generatedLine !== s)
        for (a = 0; l.generatedLine !== s; )
          u += ";", s++;
      else if (_ > 0) {
        if (!t.compareByGeneratedPositionsInflated(l, v[_ - 1]))
          continue;
        u += ",";
      }
      u += e.encode(l.generatedColumn - a), a = l.generatedColumn, l.source != null && (g = this._sources.indexOf(l.source), u += e.encode(g - h), h = g, u += e.encode(l.originalLine - 1 - p), p = l.originalLine - 1, u += e.encode(l.originalColumn - d), d = l.originalColumn, l.name != null && (m = this._names.indexOf(l.name), u += e.encode(m - f), f = m)), c += u;
    }
    return c;
  }, r.prototype._generateSourcesContent = function(a, s) {
    return a.map(function(d) {
      if (!this._sourcesContents)
        return null;
      s != null && (d = t.relative(s, d));
      var p = t.toSetString(d);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, p) ? this._sourcesContents[p] : null;
    }, this);
  }, r.prototype.toJSON = function() {
    var a = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    return this._file != null && (a.file = this._file), this._sourceRoot != null && (a.sourceRoot = this._sourceRoot), this._sourcesContents && (a.sourcesContent = this._generateSourcesContent(a.sources, a.sourceRoot)), a;
  }, r.prototype.toString = function() {
    return JSON.stringify(this.toJSON());
  }, ao.SourceMapGenerator = r, ao;
}
var vr = {}, co = {}, sl;
function C$() {
  return sl || (sl = 1, (function(e) {
    e.GREATEST_LOWER_BOUND = 1, e.LEAST_UPPER_BOUND = 2;
    function t(n, i, r, o, a, s) {
      var d = Math.floor((i - n) / 2) + n, p = a(r, o[d], !0);
      return p === 0 ? d : p > 0 ? i - d > 1 ? t(d, i, r, o, a, s) : s == e.LEAST_UPPER_BOUND ? i < o.length ? i : -1 : d : d - n > 1 ? t(n, d, r, o, a, s) : s == e.LEAST_UPPER_BOUND ? d : n < 0 ? -1 : n;
    }
    e.search = function(i, r, o, a) {
      if (r.length === 0)
        return -1;
      var s = t(
        -1,
        r.length,
        i,
        r,
        o,
        a || e.GREATEST_LOWER_BOUND
      );
      if (s < 0)
        return -1;
      for (; s - 1 >= 0 && o(r[s], r[s - 1], !0) === 0; )
        --s;
      return s;
    };
  })(co)), co;
}
var fo = {}, ul;
function U$() {
  if (ul) return fo;
  ul = 1;
  function e(i, r, o) {
    var a = i[r];
    i[r] = i[o], i[o] = a;
  }
  function t(i, r) {
    return Math.round(i + Math.random() * (r - i));
  }
  function n(i, r, o, a) {
    if (o < a) {
      var s = t(o, a), d = o - 1;
      e(i, s, a);
      for (var p = i[a], f = o; f < a; f++)
        r(i[f], p) <= 0 && (d += 1, e(i, d, f));
      e(i, d + 1, f);
      var h = d + 1;
      n(i, r, o, h - 1), n(i, r, h + 1, a);
    }
  }
  return fo.quickSort = function(i, r) {
    n(i, r, 0, i.length - 1);
  }, fo;
}
var ll;
function R$() {
  if (ll) return vr;
  ll = 1;
  var e = Pr(), t = C$(), n = Jc().ArraySet, i = Hc(), r = U$().quickSort;
  function o(p, f) {
    var h = p;
    return typeof p == "string" && (h = e.parseSourceMapInput(p)), h.sections != null ? new d(h, f) : new a(h, f);
  }
  o.fromSourceMap = function(p, f) {
    return a.fromSourceMap(p, f);
  }, o.prototype._version = 3, o.prototype.__generatedMappings = null, Object.defineProperty(o.prototype, "_generatedMappings", {
    configurable: !0,
    enumerable: !0,
    get: function() {
      return this.__generatedMappings || this._parseMappings(this._mappings, this.sourceRoot), this.__generatedMappings;
    }
  }), o.prototype.__originalMappings = null, Object.defineProperty(o.prototype, "_originalMappings", {
    configurable: !0,
    enumerable: !0,
    get: function() {
      return this.__originalMappings || this._parseMappings(this._mappings, this.sourceRoot), this.__originalMappings;
    }
  }), o.prototype._charIsMappingSeparator = function(f, h) {
    var c = f.charAt(h);
    return c === ";" || c === ",";
  }, o.prototype._parseMappings = function(f, h) {
    throw new Error("Subclasses must implement _parseMappings");
  }, o.GENERATED_ORDER = 1, o.ORIGINAL_ORDER = 2, o.GREATEST_LOWER_BOUND = 1, o.LEAST_UPPER_BOUND = 2, o.prototype.eachMapping = function(f, h, c) {
    var u = h || null, l = c || o.GENERATED_ORDER, m;
    switch (l) {
      case o.GENERATED_ORDER:
        m = this._generatedMappings;
        break;
      case o.ORIGINAL_ORDER:
        m = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
    }
    var g = this.sourceRoot;
    m.map(function(v) {
      var _ = v.source === null ? null : this._sources.at(v.source);
      return _ = e.computeSourceURL(g, _, this._sourceMapURL), {
        source: _,
        generatedLine: v.generatedLine,
        generatedColumn: v.generatedColumn,
        originalLine: v.originalLine,
        originalColumn: v.originalColumn,
        name: v.name === null ? null : this._names.at(v.name)
      };
    }, this).forEach(f, u);
  }, o.prototype.allGeneratedPositionsFor = function(f) {
    var h = e.getArg(f, "line"), c = {
      source: e.getArg(f, "source"),
      originalLine: h,
      originalColumn: e.getArg(f, "column", 0)
    };
    if (c.source = this._findSourceIndex(c.source), c.source < 0)
      return [];
    var u = [], l = this._findMapping(
      c,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      e.compareByOriginalPositions,
      t.LEAST_UPPER_BOUND
    );
    if (l >= 0) {
      var m = this._originalMappings[l];
      if (f.column === void 0)
        for (var g = m.originalLine; m && m.originalLine === g; )
          u.push({
            line: e.getArg(m, "generatedLine", null),
            column: e.getArg(m, "generatedColumn", null),
            lastColumn: e.getArg(m, "lastGeneratedColumn", null)
          }), m = this._originalMappings[++l];
      else
        for (var v = m.originalColumn; m && m.originalLine === h && m.originalColumn == v; )
          u.push({
            line: e.getArg(m, "generatedLine", null),
            column: e.getArg(m, "generatedColumn", null),
            lastColumn: e.getArg(m, "lastGeneratedColumn", null)
          }), m = this._originalMappings[++l];
    }
    return u;
  }, vr.SourceMapConsumer = o;
  function a(p, f) {
    var h = p;
    typeof p == "string" && (h = e.parseSourceMapInput(p));
    var c = e.getArg(h, "version"), u = e.getArg(h, "sources"), l = e.getArg(h, "names", []), m = e.getArg(h, "sourceRoot", null), g = e.getArg(h, "sourcesContent", null), v = e.getArg(h, "mappings"), _ = e.getArg(h, "file", null);
    if (c != this._version)
      throw new Error("Unsupported version: " + c);
    m && (m = e.normalize(m)), u = u.map(String).map(e.normalize).map(function(x) {
      return m && e.isAbsolute(m) && e.isAbsolute(x) ? e.relative(m, x) : x;
    }), this._names = n.fromArray(l.map(String), !0), this._sources = n.fromArray(u, !0), this._absoluteSources = this._sources.toArray().map(function(x) {
      return e.computeSourceURL(m, x, f);
    }), this.sourceRoot = m, this.sourcesContent = g, this._mappings = v, this._sourceMapURL = f, this.file = _;
  }
  a.prototype = Object.create(o.prototype), a.prototype.consumer = o, a.prototype._findSourceIndex = function(p) {
    var f = p;
    if (this.sourceRoot != null && (f = e.relative(this.sourceRoot, f)), this._sources.has(f))
      return this._sources.indexOf(f);
    var h;
    for (h = 0; h < this._absoluteSources.length; ++h)
      if (this._absoluteSources[h] == p)
        return h;
    return -1;
  }, a.fromSourceMap = function(f, h) {
    var c = Object.create(a.prototype), u = c._names = n.fromArray(f._names.toArray(), !0), l = c._sources = n.fromArray(f._sources.toArray(), !0);
    c.sourceRoot = f._sourceRoot, c.sourcesContent = f._generateSourcesContent(
      c._sources.toArray(),
      c.sourceRoot
    ), c.file = f._file, c._sourceMapURL = h, c._absoluteSources = c._sources.toArray().map(function(O) {
      return e.computeSourceURL(c.sourceRoot, O, h);
    });
    for (var m = f._mappings.toArray().slice(), g = c.__generatedMappings = [], v = c.__originalMappings = [], _ = 0, x = m.length; _ < x; _++) {
      var y = m[_], $ = new s();
      $.generatedLine = y.generatedLine, $.generatedColumn = y.generatedColumn, y.source && ($.source = l.indexOf(y.source), $.originalLine = y.originalLine, $.originalColumn = y.originalColumn, y.name && ($.name = u.indexOf(y.name)), v.push($)), g.push($);
    }
    return r(c.__originalMappings, e.compareByOriginalPositions), c;
  }, a.prototype._version = 3, Object.defineProperty(a.prototype, "sources", {
    get: function() {
      return this._absoluteSources.slice();
    }
  });
  function s() {
    this.generatedLine = 0, this.generatedColumn = 0, this.source = null, this.originalLine = null, this.originalColumn = null, this.name = null;
  }
  a.prototype._parseMappings = function(f, h) {
    for (var c = 1, u = 0, l = 0, m = 0, g = 0, v = 0, _ = f.length, x = 0, y = {}, $ = {}, O = [], I = [], D, L, M, b, k; x < _; )
      if (f.charAt(x) === ";")
        c++, x++, u = 0;
      else if (f.charAt(x) === ",")
        x++;
      else {
        for (D = new s(), D.generatedLine = c, b = x; b < _ && !this._charIsMappingSeparator(f, b); b++)
          ;
        if (L = f.slice(x, b), M = y[L], M)
          x += L.length;
        else {
          for (M = []; x < b; )
            i.decode(f, x, $), k = $.value, x = $.rest, M.push(k);
          if (M.length === 2)
            throw new Error("Found a source, but no line and column");
          if (M.length === 3)
            throw new Error("Found a source and line, but no column");
          y[L] = M;
        }
        D.generatedColumn = u + M[0], u = D.generatedColumn, M.length > 1 && (D.source = g + M[1], g += M[1], D.originalLine = l + M[2], l = D.originalLine, D.originalLine += 1, D.originalColumn = m + M[3], m = D.originalColumn, M.length > 4 && (D.name = v + M[4], v += M[4])), I.push(D), typeof D.originalLine == "number" && O.push(D);
      }
    r(I, e.compareByGeneratedPositionsDeflated), this.__generatedMappings = I, r(O, e.compareByOriginalPositions), this.__originalMappings = O;
  }, a.prototype._findMapping = function(f, h, c, u, l, m) {
    if (f[c] <= 0)
      throw new TypeError("Line must be greater than or equal to 1, got " + f[c]);
    if (f[u] < 0)
      throw new TypeError("Column must be greater than or equal to 0, got " + f[u]);
    return t.search(f, h, l, m);
  }, a.prototype.computeColumnSpans = function() {
    for (var f = 0; f < this._generatedMappings.length; ++f) {
      var h = this._generatedMappings[f];
      if (f + 1 < this._generatedMappings.length) {
        var c = this._generatedMappings[f + 1];
        if (h.generatedLine === c.generatedLine) {
          h.lastGeneratedColumn = c.generatedColumn - 1;
          continue;
        }
      }
      h.lastGeneratedColumn = 1 / 0;
    }
  }, a.prototype.originalPositionFor = function(f) {
    var h = {
      generatedLine: e.getArg(f, "line"),
      generatedColumn: e.getArg(f, "column")
    }, c = this._findMapping(
      h,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      e.compareByGeneratedPositionsDeflated,
      e.getArg(f, "bias", o.GREATEST_LOWER_BOUND)
    );
    if (c >= 0) {
      var u = this._generatedMappings[c];
      if (u.generatedLine === h.generatedLine) {
        var l = e.getArg(u, "source", null);
        l !== null && (l = this._sources.at(l), l = e.computeSourceURL(this.sourceRoot, l, this._sourceMapURL));
        var m = e.getArg(u, "name", null);
        return m !== null && (m = this._names.at(m)), {
          source: l,
          line: e.getArg(u, "originalLine", null),
          column: e.getArg(u, "originalColumn", null),
          name: m
        };
      }
    }
    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  }, a.prototype.hasContentsOfAllSources = function() {
    return this.sourcesContent ? this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(f) {
      return f == null;
    }) : !1;
  }, a.prototype.sourceContentFor = function(f, h) {
    if (!this.sourcesContent)
      return null;
    var c = this._findSourceIndex(f);
    if (c >= 0)
      return this.sourcesContent[c];
    var u = f;
    this.sourceRoot != null && (u = e.relative(this.sourceRoot, u));
    var l;
    if (this.sourceRoot != null && (l = e.urlParse(this.sourceRoot))) {
      var m = u.replace(/^file:\/\//, "");
      if (l.scheme == "file" && this._sources.has(m))
        return this.sourcesContent[this._sources.indexOf(m)];
      if ((!l.path || l.path == "/") && this._sources.has("/" + u))
        return this.sourcesContent[this._sources.indexOf("/" + u)];
    }
    if (h)
      return null;
    throw new Error('"' + u + '" is not in the SourceMap.');
  }, a.prototype.generatedPositionFor = function(f) {
    var h = e.getArg(f, "source");
    if (h = this._findSourceIndex(h), h < 0)
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    var c = {
      source: h,
      originalLine: e.getArg(f, "line"),
      originalColumn: e.getArg(f, "column")
    }, u = this._findMapping(
      c,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      e.compareByOriginalPositions,
      e.getArg(f, "bias", o.GREATEST_LOWER_BOUND)
    );
    if (u >= 0) {
      var l = this._originalMappings[u];
      if (l.source === c.source)
        return {
          line: e.getArg(l, "generatedLine", null),
          column: e.getArg(l, "generatedColumn", null),
          lastColumn: e.getArg(l, "lastGeneratedColumn", null)
        };
    }
    return {
      line: null,
      column: null,
      lastColumn: null
    };
  }, vr.BasicSourceMapConsumer = a;
  function d(p, f) {
    var h = p;
    typeof p == "string" && (h = e.parseSourceMapInput(p));
    var c = e.getArg(h, "version"), u = e.getArg(h, "sections");
    if (c != this._version)
      throw new Error("Unsupported version: " + c);
    this._sources = new n(), this._names = new n();
    var l = {
      line: -1,
      column: 0
    };
    this._sections = u.map(function(m) {
      if (m.url)
        throw new Error("Support for url field in sections not implemented.");
      var g = e.getArg(m, "offset"), v = e.getArg(g, "line"), _ = e.getArg(g, "column");
      if (v < l.line || v === l.line && _ < l.column)
        throw new Error("Section offsets must be ordered and non-overlapping.");
      return l = g, {
        generatedOffset: {
          // The offset fields are 0-based, but we use 1-based indices when
          // encoding/decoding from VLQ.
          generatedLine: v + 1,
          generatedColumn: _ + 1
        },
        consumer: new o(e.getArg(m, "map"), f)
      };
    });
  }
  return d.prototype = Object.create(o.prototype), d.prototype.constructor = o, d.prototype._version = 3, Object.defineProperty(d.prototype, "sources", {
    get: function() {
      for (var p = [], f = 0; f < this._sections.length; f++)
        for (var h = 0; h < this._sections[f].consumer.sources.length; h++)
          p.push(this._sections[f].consumer.sources[h]);
      return p;
    }
  }), d.prototype.originalPositionFor = function(f) {
    var h = {
      generatedLine: e.getArg(f, "line"),
      generatedColumn: e.getArg(f, "column")
    }, c = t.search(
      h,
      this._sections,
      function(l, m) {
        var g = l.generatedLine - m.generatedOffset.generatedLine;
        return g || l.generatedColumn - m.generatedOffset.generatedColumn;
      }
    ), u = this._sections[c];
    return u ? u.consumer.originalPositionFor({
      line: h.generatedLine - (u.generatedOffset.generatedLine - 1),
      column: h.generatedColumn - (u.generatedOffset.generatedLine === h.generatedLine ? u.generatedOffset.generatedColumn - 1 : 0),
      bias: f.bias
    }) : {
      source: null,
      line: null,
      column: null,
      name: null
    };
  }, d.prototype.hasContentsOfAllSources = function() {
    return this._sections.every(function(f) {
      return f.consumer.hasContentsOfAllSources();
    });
  }, d.prototype.sourceContentFor = function(f, h) {
    for (var c = 0; c < this._sections.length; c++) {
      var u = this._sections[c], l = u.consumer.sourceContentFor(f, !0);
      if (l)
        return l;
    }
    if (h)
      return null;
    throw new Error('"' + f + '" is not in the SourceMap.');
  }, d.prototype.generatedPositionFor = function(f) {
    for (var h = 0; h < this._sections.length; h++) {
      var c = this._sections[h];
      if (c.consumer._findSourceIndex(e.getArg(f, "source")) !== -1) {
        var u = c.consumer.generatedPositionFor(f);
        if (u) {
          var l = {
            line: u.line + (c.generatedOffset.generatedLine - 1),
            column: u.column + (c.generatedOffset.generatedLine === u.line ? c.generatedOffset.generatedColumn - 1 : 0)
          };
          return l;
        }
      }
    }
    return {
      line: null,
      column: null
    };
  }, d.prototype._parseMappings = function(f, h) {
    this.__generatedMappings = [], this.__originalMappings = [];
    for (var c = 0; c < this._sections.length; c++)
      for (var u = this._sections[c], l = u.consumer._generatedMappings, m = 0; m < l.length; m++) {
        var g = l[m], v = u.consumer._sources.at(g.source);
        v = e.computeSourceURL(u.consumer.sourceRoot, v, this._sourceMapURL), this._sources.add(v), v = this._sources.indexOf(v);
        var _ = null;
        g.name && (_ = u.consumer._names.at(g.name), this._names.add(_), _ = this._names.indexOf(_));
        var x = {
          source: v,
          generatedLine: g.generatedLine + (u.generatedOffset.generatedLine - 1),
          generatedColumn: g.generatedColumn + (u.generatedOffset.generatedLine === g.generatedLine ? u.generatedOffset.generatedColumn - 1 : 0),
          originalLine: g.originalLine,
          originalColumn: g.originalColumn,
          name: _
        };
        this.__generatedMappings.push(x), typeof x.originalLine == "number" && this.__originalMappings.push(x);
      }
    r(this.__generatedMappings, e.compareByGeneratedPositionsDeflated), r(this.__originalMappings, e.compareByOriginalPositions);
  }, vr.IndexedSourceMapConsumer = d, vr;
}
var po = {}, cl;
function L$() {
  if (cl) return po;
  cl = 1;
  var e = Vc().SourceMapGenerator, t = Pr(), n = /(\r?\n)/, i = 10, r = "$$$isSourceNode$$$";
  function o(a, s, d, p, f) {
    this.children = [], this.sourceContents = {}, this.line = a ?? null, this.column = s ?? null, this.source = d ?? null, this.name = f ?? null, this[r] = !0, p != null && this.add(p);
  }
  return o.fromStringWithSourceMap = function(s, d, p) {
    var f = new o(), h = s.split(n), c = 0, u = function() {
      var _ = y(), x = y() || "";
      return _ + x;
      function y() {
        return c < h.length ? h[c++] : void 0;
      }
    }, l = 1, m = 0, g = null;
    return d.eachMapping(function(_) {
      if (g !== null)
        if (l < _.generatedLine)
          v(g, u()), l++, m = 0;
        else {
          var x = h[c] || "", y = x.substr(0, _.generatedColumn - m);
          h[c] = x.substr(_.generatedColumn - m), m = _.generatedColumn, v(g, y), g = _;
          return;
        }
      for (; l < _.generatedLine; )
        f.add(u()), l++;
      if (m < _.generatedColumn) {
        var x = h[c] || "";
        f.add(x.substr(0, _.generatedColumn)), h[c] = x.substr(_.generatedColumn), m = _.generatedColumn;
      }
      g = _;
    }, this), c < h.length && (g && v(g, u()), f.add(h.splice(c).join(""))), d.sources.forEach(function(_) {
      var x = d.sourceContentFor(_);
      x != null && (p != null && (_ = t.join(p, _)), f.setSourceContent(_, x));
    }), f;
    function v(_, x) {
      if (_ === null || _.source === void 0)
        f.add(x);
      else {
        var y = p ? t.join(p, _.source) : _.source;
        f.add(new o(
          _.originalLine,
          _.originalColumn,
          y,
          x,
          _.name
        ));
      }
    }
  }, o.prototype.add = function(s) {
    if (Array.isArray(s))
      s.forEach(function(d) {
        this.add(d);
      }, this);
    else if (s[r] || typeof s == "string")
      s && this.children.push(s);
    else
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + s
      );
    return this;
  }, o.prototype.prepend = function(s) {
    if (Array.isArray(s))
      for (var d = s.length - 1; d >= 0; d--)
        this.prepend(s[d]);
    else if (s[r] || typeof s == "string")
      this.children.unshift(s);
    else
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + s
      );
    return this;
  }, o.prototype.walk = function(s) {
    for (var d, p = 0, f = this.children.length; p < f; p++)
      d = this.children[p], d[r] ? d.walk(s) : d !== "" && s(d, {
        source: this.source,
        line: this.line,
        column: this.column,
        name: this.name
      });
  }, o.prototype.join = function(s) {
    var d, p, f = this.children.length;
    if (f > 0) {
      for (d = [], p = 0; p < f - 1; p++)
        d.push(this.children[p]), d.push(s);
      d.push(this.children[p]), this.children = d;
    }
    return this;
  }, o.prototype.replaceRight = function(s, d) {
    var p = this.children[this.children.length - 1];
    return p[r] ? p.replaceRight(s, d) : typeof p == "string" ? this.children[this.children.length - 1] = p.replace(s, d) : this.children.push("".replace(s, d)), this;
  }, o.prototype.setSourceContent = function(s, d) {
    this.sourceContents[t.toSetString(s)] = d;
  }, o.prototype.walkSourceContents = function(s) {
    for (var d = 0, p = this.children.length; d < p; d++)
      this.children[d][r] && this.children[d].walkSourceContents(s);
    for (var f = Object.keys(this.sourceContents), d = 0, p = f.length; d < p; d++)
      s(t.fromSetString(f[d]), this.sourceContents[f[d]]);
  }, o.prototype.toString = function() {
    var s = "";
    return this.walk(function(d) {
      s += d;
    }), s;
  }, o.prototype.toStringWithSourceMap = function(s) {
    var d = {
      code: "",
      line: 1,
      column: 0
    }, p = new e(s), f = !1, h = null, c = null, u = null, l = null;
    return this.walk(function(m, g) {
      d.code += m, g.source !== null && g.line !== null && g.column !== null ? ((h !== g.source || c !== g.line || u !== g.column || l !== g.name) && p.addMapping({
        source: g.source,
        original: {
          line: g.line,
          column: g.column
        },
        generated: {
          line: d.line,
          column: d.column
        },
        name: g.name
      }), h = g.source, c = g.line, u = g.column, l = g.name, f = !0) : f && (p.addMapping({
        generated: {
          line: d.line,
          column: d.column
        }
      }), h = null, f = !1);
      for (var v = 0, _ = m.length; v < _; v++)
        m.charCodeAt(v) === i ? (d.line++, d.column = 0, v + 1 === _ ? (h = null, f = !1) : f && p.addMapping({
          source: g.source,
          original: {
            line: g.line,
            column: g.column
          },
          generated: {
            line: d.line,
            column: d.column
          },
          name: g.name
        })) : d.column++;
    }), this.walkSourceContents(function(m, g) {
      p.setSourceContent(m, g);
    }), { code: d.code, map: p };
  }, po.SourceNode = o, po;
}
var dl;
function j$() {
  return dl || (dl = 1, gr.SourceMapGenerator = Vc().SourceMapGenerator, gr.SourceMapConsumer = R$().SourceMapConsumer, gr.SourceNode = L$().SourceNode), gr;
}
var fl;
function M$() {
  return fl || (fl = 1, (function(e, t) {
    t.__esModule = !0;
    var n = ke(), i = void 0;
    try {
      var r = j$();
      i = r.SourceNode;
    } catch {
    }
    i || (i = function(s, d, p, f) {
      this.src = "", f && this.add(f);
    }, i.prototype = {
      add: function(d) {
        n.isArray(d) && (d = d.join("")), this.src += d;
      },
      prepend: function(d) {
        n.isArray(d) && (d = d.join("")), this.src = d + this.src;
      },
      toStringWithSourceMap: function() {
        return { code: this.toString() };
      },
      toString: function() {
        return this.src;
      }
    });
    function o(s, d, p) {
      if (n.isArray(s)) {
        for (var f = [], h = 0, c = s.length; h < c; h++)
          f.push(d.wrap(s[h], p));
        return f;
      } else if (typeof s == "boolean" || typeof s == "number")
        return s + "";
      return s;
    }
    function a(s) {
      this.srcFile = s, this.source = [];
    }
    a.prototype = {
      isEmpty: function() {
        return !this.source.length;
      },
      prepend: function(d, p) {
        this.source.unshift(this.wrap(d, p));
      },
      push: function(d, p) {
        this.source.push(this.wrap(d, p));
      },
      merge: function() {
        var d = this.empty();
        return this.each(function(p) {
          d.add(["  ", p, `
`]);
        }), d;
      },
      each: function(d) {
        for (var p = 0, f = this.source.length; p < f; p++)
          d(this.source[p]);
      },
      empty: function() {
        var d = this.currentLocation || { start: {} };
        return new i(d.start.line, d.start.column, this.srcFile);
      },
      wrap: function(d) {
        var p = arguments.length <= 1 || arguments[1] === void 0 ? this.currentLocation || { start: {} } : arguments[1];
        return d instanceof i ? d : (d = o(d, this, p), new i(p.start.line, p.start.column, this.srcFile, d));
      },
      functionCall: function(d, p, f) {
        return f = this.generateList(f), this.wrap([d, p ? "." + p + "(" : "(", f, ")"]);
      },
      quotedString: function(d) {
        return '"' + (d + "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") + '"';
      },
      objectLiteral: function(d) {
        var p = this, f = [];
        Object.keys(d).forEach(function(c) {
          var u = o(d[c], p);
          u !== "undefined" && f.push([p.quotedString(c), ":", u]);
        });
        var h = this.generateList(f);
        return h.prepend("{"), h.add("}"), h;
      },
      generateList: function(d) {
        for (var p = this.empty(), f = 0, h = d.length; f < h; f++)
          f && p.add(","), p.add(o(d[f], this));
        return p;
      },
      generateArray: function(d) {
        var p = this.generateList(d);
        return p.prepend("["), p.add("]"), p;
      }
    }, t.default = a, e.exports = t.default;
  })(xn, xn.exports)), xn.exports;
}
var pl;
function Z$() {
  return pl || (pl = 1, (function(e, t) {
    t.__esModule = !0;
    function n(c) {
      return c && c.__esModule ? c : { default: c };
    }
    var i = Bo(), r = De(), o = n(r), a = ke(), s = M$(), d = n(s);
    function p(c) {
      this.value = c;
    }
    function f() {
    }
    f.prototype = {
      // PUBLIC API: You can override these methods in a subclass to provide
      // alternative compiled forms for name lookup and buffering semantics
      nameLookup: function(u, l) {
        return this.internalNameLookup(u, l);
      },
      depthedLookup: function(u) {
        return [this.aliasable("container.lookup"), "(depths, ", JSON.stringify(u), ")"];
      },
      compilerInfo: function() {
        var u = i.COMPILER_REVISION, l = i.REVISION_CHANGES[u];
        return [u, l];
      },
      appendToBuffer: function(u, l, m) {
        return a.isArray(u) || (u = [u]), u = this.source.wrap(u, l), this.environment.isSimple ? ["return ", u, ";"] : m ? ["buffer += ", u, ";"] : (u.appendToBuffer = !0, u);
      },
      initializeBuffer: function() {
        return this.quotedString("");
      },
      // END PUBLIC API
      internalNameLookup: function(u, l) {
        return this.lookupPropertyFunctionIsUsed = !0, ["lookupProperty(", u, ",", JSON.stringify(l), ")"];
      },
      lookupPropertyFunctionIsUsed: !1,
      compile: function(u, l, m, g) {
        this.environment = u, this.options = l, this.stringParams = this.options.stringParams, this.trackIds = this.options.trackIds, this.precompile = !g, this.name = this.environment.name, this.isChild = !!m, this.context = m || {
          decorators: [],
          programs: [],
          environments: []
        }, this.preamble(), this.stackSlot = 0, this.stackVars = [], this.aliases = {}, this.registers = { list: [] }, this.hashes = [], this.compileStack = [], this.inlineStack = [], this.blockParams = [], this.compileChildren(u, l), this.useDepths = this.useDepths || u.useDepths || u.useDecorators || this.options.compat, this.useBlockParams = this.useBlockParams || u.useBlockParams;
        var v = u.opcodes, _ = void 0, x = void 0, y = void 0, $ = void 0;
        for (y = 0, $ = v.length; y < $; y++)
          _ = v[y], this.source.currentLocation = _.loc, x = x || _.loc, this[_.opcode].apply(this, _.args);
        if (this.source.currentLocation = x, this.pushSource(""), this.stackSlot || this.inlineStack.length || this.compileStack.length)
          throw new o.default("Compile completed with content left on stack");
        this.decorators.isEmpty() ? this.decorators = void 0 : (this.useDecorators = !0, this.decorators.prepend(["var decorators = container.decorators, ", this.lookupPropertyFunctionVarDeclaration(), `;
`]), this.decorators.push("return fn;"), g ? this.decorators = Function.apply(this, ["fn", "props", "container", "depth0", "data", "blockParams", "depths", this.decorators.merge()]) : (this.decorators.prepend(`function(fn, props, container, depth0, data, blockParams, depths) {
`), this.decorators.push(`}
`), this.decorators = this.decorators.merge()));
        var O = this.createFunctionContext(g);
        if (this.isChild)
          return O;
        var I = {
          compiler: this.compilerInfo(),
          main: O
        };
        this.decorators && (I.main_d = this.decorators, I.useDecorators = !0);
        var D = this.context, L = D.programs, M = D.decorators;
        for (y = 0, $ = L.length; y < $; y++)
          I[y] = L[y], M[y] && (I[y + "_d"] = M[y], I.useDecorators = !0);
        return this.environment.usePartial && (I.usePartial = !0), this.options.data && (I.useData = !0), this.useDepths && (I.useDepths = !0), this.useBlockParams && (I.useBlockParams = !0), this.options.compat && (I.compat = !0), g ? I.compilerOptions = this.options : (I.compiler = JSON.stringify(I.compiler), this.source.currentLocation = { start: { line: 1, column: 0 } }, I = this.objectLiteral(I), l.srcName ? (I = I.toStringWithSourceMap({ file: l.destName }), I.map = I.map && I.map.toString()) : I = I.toString()), I;
      },
      preamble: function() {
        this.lastContext = 0, this.source = new d.default(this.options.srcName), this.decorators = new d.default(this.options.srcName);
      },
      createFunctionContext: function(u) {
        var l = this, m = "", g = this.stackVars.concat(this.registers.list);
        g.length > 0 && (m += ", " + g.join(", "));
        var v = 0;
        Object.keys(this.aliases).forEach(function(y) {
          var $ = l.aliases[y];
          $.children && $.referenceCount > 1 && (m += ", alias" + ++v + "=" + y, $.children[0] = "alias" + v);
        }), this.lookupPropertyFunctionIsUsed && (m += ", " + this.lookupPropertyFunctionVarDeclaration());
        var _ = ["container", "depth0", "helpers", "partials", "data"];
        (this.useBlockParams || this.useDepths) && _.push("blockParams"), this.useDepths && _.push("depths");
        var x = this.mergeSource(m);
        return u ? (_.push(x), Function.apply(this, _)) : this.source.wrap(["function(", _.join(","), `) {
  `, x, "}"]);
      },
      mergeSource: function(u) {
        var l = this.environment.isSimple, m = !this.forceBuffer, g = void 0, v = void 0, _ = void 0, x = void 0;
        return this.source.each(function(y) {
          y.appendToBuffer ? (_ ? y.prepend("  + ") : _ = y, x = y) : (_ && (v ? _.prepend("buffer += ") : g = !0, x.add(";"), _ = x = void 0), v = !0, l || (m = !1));
        }), m ? _ ? (_.prepend("return "), x.add(";")) : v || this.source.push('return "";') : (u += ", buffer = " + (g ? "" : this.initializeBuffer()), _ ? (_.prepend("return buffer + "), x.add(";")) : this.source.push("return buffer;")), u && this.source.prepend("var " + u.substring(2) + (g ? "" : `;
`)), this.source.merge();
      },
      lookupPropertyFunctionVarDeclaration: function() {
        return `
      lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }
    `.trim();
      },
      // [blockValue]
      //
      // On stack, before: hash, inverse, program, value
      // On stack, after: return value of blockHelperMissing
      //
      // The purpose of this opcode is to take a block of the form
      // `{{#this.foo}}...{{/this.foo}}`, resolve the value of `foo`, and
      // replace it on the stack with the result of properly
      // invoking blockHelperMissing.
      blockValue: function(u) {
        var l = this.aliasable("container.hooks.blockHelperMissing"), m = [this.contextName(0)];
        this.setupHelperArgs(u, 0, m);
        var g = this.popStack();
        m.splice(1, 0, g), this.push(this.source.functionCall(l, "call", m));
      },
      // [ambiguousBlockValue]
      //
      // On stack, before: hash, inverse, program, value
      // Compiler value, before: lastHelper=value of last found helper, if any
      // On stack, after, if no lastHelper: same as [blockValue]
      // On stack, after, if lastHelper: value
      ambiguousBlockValue: function() {
        var u = this.aliasable("container.hooks.blockHelperMissing"), l = [this.contextName(0)];
        this.setupHelperArgs("", 0, l, !0), this.flushInline();
        var m = this.topStack();
        l.splice(1, 0, m), this.pushSource(["if (!", this.lastHelper, ") { ", m, " = ", this.source.functionCall(u, "call", l), "}"]);
      },
      // [appendContent]
      //
      // On stack, before: ...
      // On stack, after: ...
      //
      // Appends the string value of `content` to the current buffer
      appendContent: function(u) {
        this.pendingContent ? u = this.pendingContent + u : this.pendingLocation = this.source.currentLocation, this.pendingContent = u;
      },
      // [append]
      //
      // On stack, before: value, ...
      // On stack, after: ...
      //
      // Coerces `value` to a String and appends it to the current buffer.
      //
      // If `value` is truthy, or 0, it is coerced into a string and appended
      // Otherwise, the empty string is appended
      append: function() {
        if (this.isInline())
          this.replaceStack(function(l) {
            return [" != null ? ", l, ' : ""'];
          }), this.pushSource(this.appendToBuffer(this.popStack()));
        else {
          var u = this.popStack();
          this.pushSource(["if (", u, " != null) { ", this.appendToBuffer(u, void 0, !0), " }"]), this.environment.isSimple && this.pushSource(["else { ", this.appendToBuffer("''", void 0, !0), " }"]);
        }
      },
      // [appendEscaped]
      //
      // On stack, before: value, ...
      // On stack, after: ...
      //
      // Escape `value` and append it to the buffer
      appendEscaped: function() {
        this.pushSource(this.appendToBuffer([this.aliasable("container.escapeExpression"), "(", this.popStack(), ")"]));
      },
      // [getContext]
      //
      // On stack, before: ...
      // On stack, after: ...
      // Compiler value, after: lastContext=depth
      //
      // Set the value of the `lastContext` compiler value to the depth
      getContext: function(u) {
        this.lastContext = u;
      },
      // [pushContext]
      //
      // On stack, before: ...
      // On stack, after: currentContext, ...
      //
      // Pushes the value of the current context onto the stack.
      pushContext: function() {
        this.pushStackLiteral(this.contextName(this.lastContext));
      },
      // [lookupOnContext]
      //
      // On stack, before: ...
      // On stack, after: currentContext[name], ...
      //
      // Looks up the value of `name` on the current context and pushes
      // it onto the stack.
      lookupOnContext: function(u, l, m, g) {
        var v = 0;
        !g && this.options.compat && !this.lastContext ? this.push(this.depthedLookup(u[v++])) : this.pushContext(), this.resolvePath("context", u, v, l, m);
      },
      // [lookupBlockParam]
      //
      // On stack, before: ...
      // On stack, after: blockParam[name], ...
      //
      // Looks up the value of `parts` on the given block param and pushes
      // it onto the stack.
      lookupBlockParam: function(u, l) {
        this.useBlockParams = !0, this.push(["blockParams[", u[0], "][", u[1], "]"]), this.resolvePath("context", l, 1);
      },
      // [lookupData]
      //
      // On stack, before: ...
      // On stack, after: data, ...
      //
      // Push the data lookup operator
      lookupData: function(u, l, m) {
        u ? this.pushStackLiteral("container.data(data, " + u + ")") : this.pushStackLiteral("data"), this.resolvePath("data", l, 0, !0, m);
      },
      resolvePath: function(u, l, m, g, v) {
        var _ = this;
        if (this.options.strict || this.options.assumeObjects) {
          this.push(h(this.options.strict && v, this, l, m, u));
          return;
        }
        for (var x = l.length, y = function(O) {
          _.replaceStack(function(I) {
            var D = _.nameLookup(I, l[O], u);
            return g ? [" && ", D] : [" != null ? ", D, " : ", I];
          });
        }, $ = m; $ < x; $++)
          y($);
      },
      // [resolvePossibleLambda]
      //
      // On stack, before: value, ...
      // On stack, after: resolved value, ...
      //
      // If the `value` is a lambda, replace it on the stack by
      // the return value of the lambda
      resolvePossibleLambda: function() {
        this.push([this.aliasable("container.lambda"), "(", this.popStack(), ", ", this.contextName(0), ")"]);
      },
      // [pushStringParam]
      //
      // On stack, before: ...
      // On stack, after: string, currentContext, ...
      //
      // This opcode is designed for use in string mode, which
      // provides the string value of a parameter along with its
      // depth rather than resolving it immediately.
      pushStringParam: function(u, l) {
        this.pushContext(), this.pushString(l), l !== "SubExpression" && (typeof u == "string" ? this.pushString(u) : this.pushStackLiteral(u));
      },
      emptyHash: function(u) {
        this.trackIds && this.push("{}"), this.stringParams && (this.push("{}"), this.push("{}")), this.pushStackLiteral(u ? "undefined" : "{}");
      },
      pushHash: function() {
        this.hash && this.hashes.push(this.hash), this.hash = { values: {}, types: [], contexts: [], ids: [] };
      },
      popHash: function() {
        var u = this.hash;
        this.hash = this.hashes.pop(), this.trackIds && this.push(this.objectLiteral(u.ids)), this.stringParams && (this.push(this.objectLiteral(u.contexts)), this.push(this.objectLiteral(u.types))), this.push(this.objectLiteral(u.values));
      },
      // [pushString]
      //
      // On stack, before: ...
      // On stack, after: quotedString(string), ...
      //
      // Push a quoted version of `string` onto the stack
      pushString: function(u) {
        this.pushStackLiteral(this.quotedString(u));
      },
      // [pushLiteral]
      //
      // On stack, before: ...
      // On stack, after: value, ...
      //
      // Pushes a value onto the stack. This operation prevents
      // the compiler from creating a temporary variable to hold
      // it.
      pushLiteral: function(u) {
        this.pushStackLiteral(u);
      },
      // [pushProgram]
      //
      // On stack, before: ...
      // On stack, after: program(guid), ...
      //
      // Push a program expression onto the stack. This takes
      // a compile-time guid and converts it into a runtime-accessible
      // expression.
      pushProgram: function(u) {
        u != null ? this.pushStackLiteral(this.programExpression(u)) : this.pushStackLiteral(null);
      },
      // [registerDecorator]
      //
      // On stack, before: hash, program, params..., ...
      // On stack, after: ...
      //
      // Pops off the decorator's parameters, invokes the decorator,
      // and inserts the decorator into the decorators list.
      registerDecorator: function(u, l) {
        var m = this.nameLookup("decorators", l, "decorator"), g = this.setupHelperArgs(l, u);
        this.decorators.push(["var decorator = ", m, ";"]), this.decorators.push(['if (typeof decorator !== "function") { throw new Error(', this.quotedString('Missing decorator: "' + l + '"'), "); }"]), this.decorators.push(["fn = ", this.decorators.functionCall("decorator", "", ["fn", "props", "container", g]), " || fn;"]);
      },
      // [invokeHelper]
      //
      // On stack, before: hash, inverse, program, params..., ...
      // On stack, after: result of helper invocation
      //
      // Pops off the helper's parameters, invokes the helper,
      // and pushes the helper's return value onto the stack.
      //
      // If the helper is not found, `helperMissing` is called.
      invokeHelper: function(u, l, m) {
        var g = this.popStack(), v = this.setupHelper(u, l), _ = [];
        m && _.push(v.name), _.push(g), this.options.strict || _.push(this.aliasable("container.hooks.helperMissing"));
        var x = ["(", this.itemsSeparatedBy(_, "||"), ")"], y = this.source.functionCall(x, "call", v.callParams);
        this.push(y);
      },
      itemsSeparatedBy: function(u, l) {
        var m = [];
        m.push(u[0]);
        for (var g = 1; g < u.length; g++)
          m.push(l, u[g]);
        return m;
      },
      // [invokeKnownHelper]
      //
      // On stack, before: hash, inverse, program, params..., ...
      // On stack, after: result of helper invocation
      //
      // This operation is used when the helper is known to exist,
      // so a `helperMissing` fallback is not required.
      invokeKnownHelper: function(u, l) {
        var m = this.setupHelper(u, l);
        this.push(this.source.functionCall(m.name, "call", m.callParams));
      },
      // [invokeAmbiguous]
      //
      // On stack, before: hash, inverse, program, params..., ...
      // On stack, after: result of disambiguation
      //
      // This operation is used when an expression like `{{foo}}`
      // is provided, but we don't know at compile-time whether it
      // is a helper or a path.
      //
      // This operation emits more code than the other options,
      // and can be avoided by passing the `knownHelpers` and
      // `knownHelpersOnly` flags at compile-time.
      invokeAmbiguous: function(u, l) {
        this.useRegister("helper");
        var m = this.popStack();
        this.emptyHash();
        var g = this.setupHelper(0, u, l), v = this.lastHelper = this.nameLookup("helpers", u, "helper"), _ = ["(", "(helper = ", v, " || ", m, ")"];
        this.options.strict || (_[0] = "(helper = ", _.push(" != null ? helper : ", this.aliasable("container.hooks.helperMissing"))), this.push(["(", _, g.paramsInit ? ["),(", g.paramsInit] : [], "),", "(typeof helper === ", this.aliasable('"function"'), " ? ", this.source.functionCall("helper", "call", g.callParams), " : helper))"]);
      },
      // [invokePartial]
      //
      // On stack, before: context, ...
      // On stack after: result of partial invocation
      //
      // This operation pops off a context, invokes a partial with that context,
      // and pushes the result of the invocation back.
      invokePartial: function(u, l, m) {
        var g = [], v = this.setupParams(l, 1, g);
        u && (l = this.popStack(), delete v.name), m && (v.indent = JSON.stringify(m)), v.helpers = "helpers", v.partials = "partials", v.decorators = "container.decorators", u ? g.unshift(l) : g.unshift(this.nameLookup("partials", l, "partial")), this.options.compat && (v.depths = "depths"), v = this.objectLiteral(v), g.push(v), this.push(this.source.functionCall("container.invokePartial", "", g));
      },
      // [assignToHash]
      //
      // On stack, before: value, ..., hash, ...
      // On stack, after: ..., hash, ...
      //
      // Pops a value off the stack and assigns it to the current hash
      assignToHash: function(u) {
        var l = this.popStack(), m = void 0, g = void 0, v = void 0;
        this.trackIds && (v = this.popStack()), this.stringParams && (g = this.popStack(), m = this.popStack());
        var _ = this.hash;
        m && (_.contexts[u] = m), g && (_.types[u] = g), v && (_.ids[u] = v), _.values[u] = l;
      },
      pushId: function(u, l, m) {
        u === "BlockParam" ? this.pushStackLiteral("blockParams[" + l[0] + "].path[" + l[1] + "]" + (m ? " + " + JSON.stringify("." + m) : "")) : u === "PathExpression" ? this.pushString(l) : u === "SubExpression" ? this.pushStackLiteral("true") : this.pushStackLiteral("null");
      },
      // HELPERS
      compiler: f,
      compileChildren: function(u, l) {
        for (var m = u.children, g = void 0, v = void 0, _ = 0, x = m.length; _ < x; _++) {
          g = m[_], v = new this.compiler();
          var y = this.matchExistingProgram(g);
          if (y == null) {
            var $ = this.context.programs.push("") - 1;
            g.index = $, g.name = "program" + $, this.context.programs[$] = v.compile(g, l, this.context, !this.precompile), this.context.decorators[$] = v.decorators, this.context.environments[$] = g, this.useDepths = this.useDepths || v.useDepths, this.useBlockParams = this.useBlockParams || v.useBlockParams, g.useDepths = this.useDepths, g.useBlockParams = this.useBlockParams;
          } else
            g.index = y.index, g.name = "program" + y.index, this.useDepths = this.useDepths || y.useDepths, this.useBlockParams = this.useBlockParams || y.useBlockParams;
        }
      },
      matchExistingProgram: function(u) {
        for (var l = 0, m = this.context.environments.length; l < m; l++) {
          var g = this.context.environments[l];
          if (g && g.equals(u))
            return g;
        }
      },
      programExpression: function(u) {
        var l = this.environment.children[u], m = [l.index, "data", l.blockParams];
        return (this.useBlockParams || this.useDepths) && m.push("blockParams"), this.useDepths && m.push("depths"), "container.program(" + m.join(", ") + ")";
      },
      useRegister: function(u) {
        this.registers[u] || (this.registers[u] = !0, this.registers.list.push(u));
      },
      push: function(u) {
        return u instanceof p || (u = this.source.wrap(u)), this.inlineStack.push(u), u;
      },
      pushStackLiteral: function(u) {
        this.push(new p(u));
      },
      pushSource: function(u) {
        this.pendingContent && (this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation)), this.pendingContent = void 0), u && this.source.push(u);
      },
      replaceStack: function(u) {
        var l = ["("], m = void 0, g = void 0, v = void 0;
        if (!this.isInline())
          throw new o.default("replaceStack on non-inline");
        var _ = this.popStack(!0);
        if (_ instanceof p)
          m = [_.value], l = ["(", m], v = !0;
        else {
          g = !0;
          var x = this.incrStack();
          l = ["((", this.push(x), " = ", _, ")"], m = this.topStack();
        }
        var y = u.call(this, m);
        v || this.popStack(), g && this.stackSlot--, this.push(l.concat(y, ")"));
      },
      incrStack: function() {
        return this.stackSlot++, this.stackSlot > this.stackVars.length && this.stackVars.push("stack" + this.stackSlot), this.topStackName();
      },
      topStackName: function() {
        return "stack" + this.stackSlot;
      },
      flushInline: function() {
        var u = this.inlineStack;
        this.inlineStack = [];
        for (var l = 0, m = u.length; l < m; l++) {
          var g = u[l];
          if (g instanceof p)
            this.compileStack.push(g);
          else {
            var v = this.incrStack();
            this.pushSource([v, " = ", g, ";"]), this.compileStack.push(v);
          }
        }
      },
      isInline: function() {
        return this.inlineStack.length;
      },
      popStack: function(u) {
        var l = this.isInline(), m = (l ? this.inlineStack : this.compileStack).pop();
        if (!u && m instanceof p)
          return m.value;
        if (!l) {
          if (!this.stackSlot)
            throw new o.default("Invalid stack pop");
          this.stackSlot--;
        }
        return m;
      },
      topStack: function() {
        var u = this.isInline() ? this.inlineStack : this.compileStack, l = u[u.length - 1];
        return l instanceof p ? l.value : l;
      },
      contextName: function(u) {
        return this.useDepths && u ? "depths[" + u + "]" : "depth" + u;
      },
      quotedString: function(u) {
        return this.source.quotedString(u);
      },
      objectLiteral: function(u) {
        return this.source.objectLiteral(u);
      },
      aliasable: function(u) {
        var l = this.aliases[u];
        return l ? (l.referenceCount++, l) : (l = this.aliases[u] = this.source.wrap(u), l.aliasable = !0, l.referenceCount = 1, l);
      },
      setupHelper: function(u, l, m) {
        var g = [], v = this.setupHelperArgs(l, u, g, m), _ = this.nameLookup("helpers", l, "helper"), x = this.aliasable(this.contextName(0) + " != null ? " + this.contextName(0) + " : (container.nullContext || {})");
        return {
          params: g,
          paramsInit: v,
          name: _,
          callParams: [x].concat(g)
        };
      },
      setupParams: function(u, l, m) {
        var g = {}, v = [], _ = [], x = [], y = !m, $ = void 0;
        y && (m = []), g.name = this.quotedString(u), g.hash = this.popStack(), this.trackIds && (g.hashIds = this.popStack()), this.stringParams && (g.hashTypes = this.popStack(), g.hashContexts = this.popStack());
        var O = this.popStack(), I = this.popStack();
        (I || O) && (g.fn = I || "container.noop", g.inverse = O || "container.noop");
        for (var D = l; D--; )
          $ = this.popStack(), m[D] = $, this.trackIds && (x[D] = this.popStack()), this.stringParams && (_[D] = this.popStack(), v[D] = this.popStack());
        return y && (g.args = this.source.generateArray(m)), this.trackIds && (g.ids = this.source.generateArray(x)), this.stringParams && (g.types = this.source.generateArray(_), g.contexts = this.source.generateArray(v)), this.options.data && (g.data = "data"), this.useBlockParams && (g.blockParams = "blockParams"), g;
      },
      setupHelperArgs: function(u, l, m, g) {
        var v = this.setupParams(u, l, m);
        return v.loc = JSON.stringify(this.source.currentLocation), v = this.objectLiteral(v), g ? (this.useRegister("options"), m.push("options"), ["options=", v]) : m ? (m.push(v), "") : v;
      }
    }, (function() {
      for (var c = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield await null true false".split(" "), u = f.RESERVED_WORDS = {}, l = 0, m = c.length; l < m; l++)
        u[c[l]] = !0;
    })(), f.isValidJavaScriptVariableName = function(c) {
      return !f.RESERVED_WORDS[c] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(c);
    };
    function h(c, u, l, m, g) {
      var v = u.popStack(), _ = l.length;
      c && _--;
      for (var x = m; x < _; x++)
        v = u.nameLookup(v, l[x], g);
      return c ? [u.aliasable("container.strict"), "(", v, ", ", u.quotedString(l[_]), ", ", JSON.stringify(u.source.currentLocation), " )"] : v;
    }
    t.default = f, e.exports = t.default;
  })(In, In.exports)), In.exports;
}
var hl;
function F$() {
  return hl || (hl = 1, (function(e, t) {
    t.__esModule = !0;
    function n(_) {
      return _ && _.__esModule ? _ : { default: _ };
    }
    var i = O$(), r = n(i), o = Bc(), a = n(o), s = T$(), d = z$(), p = Z$(), f = n(p), h = Gc(), c = n(h), u = Fc(), l = n(u), m = r.default.create;
    function g() {
      var _ = m();
      return _.compile = function(x, y) {
        return d.compile(x, y, _);
      }, _.precompile = function(x, y) {
        return d.precompile(x, y, _);
      }, _.AST = a.default, _.Compiler = d.Compiler, _.JavaScriptCompiler = f.default, _.Parser = s.parser, _.parse = s.parse, _.parseWithoutProcessing = s.parseWithoutProcessing, _;
    }
    var v = g();
    v.create = g, l.default(v), v.Visitor = c.default, v.default = v, t.default = v, e.exports = t.default;
  })(on, on.exports)), on.exports;
}
F$();
var Y = /* @__PURE__ */ ((e) => (e.ACTOR = "ACTOR", e.ADDRESS = "ADDRESS", e.ARRAY = "ARRAY", e.BOOLEAN = "BOOLEAN", e.CURRENCY = "CURRENCY", e.DATE = "DATE", e.DATE_TIME = "DATE_TIME", e.EMAILS = "EMAILS", e.FILES = "FILES", e.FULL_NAME = "FULL_NAME", e.LINKS = "LINKS", e.MORPH_RELATION = "MORPH_RELATION", e.MULTI_SELECT = "MULTI_SELECT", e.NUMBER = "NUMBER", e.NUMERIC = "NUMERIC", e.PHONES = "PHONES", e.POSITION = "POSITION", e.RATING = "RATING", e.RAW_JSON = "RAW_JSON", e.RELATION = "RELATION", e.RICH_TEXT = "RICH_TEXT", e.SELECT = "SELECT", e.TEXT = "TEXT", e.TS_VECTOR = "TS_VECTOR", e.UUID = "UUID", e))(Y || {}), P = /* @__PURE__ */ ((e) => (e.IS = "IS", e.IS_NOT_NULL = "IS_NOT_NULL", e.IS_NOT = "IS_NOT", e.LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL", e.GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL", e.IS_BEFORE = "IS_BEFORE", e.IS_AFTER = "IS_AFTER", e.CONTAINS = "CONTAINS", e.DOES_NOT_CONTAIN = "DOES_NOT_CONTAIN", e.IS_EMPTY = "IS_EMPTY", e.IS_NOT_EMPTY = "IS_NOT_EMPTY", e.IS_RELATIVE = "IS_RELATIVE", e.IS_IN_PAST = "IS_IN_PAST", e.IS_IN_FUTURE = "IS_IN_FUTURE", e.IS_TODAY = "IS_TODAY", e.VECTOR_SEARCH = "VECTOR_SEARCH", e))(P || {}), me = /* @__PURE__ */ ((e) => (e.Is = "is", e.IsNotNull = "isNotNull", e.IsNot = "isNot", e.LessThanOrEqual = "lessThan", e.GreaterThanOrEqual = "greaterThan", e.IsBefore = "isBefore", e.IsAfter = "isAfter", e.Contains = "contains", e.DoesNotContain = "doesNotContain", e.IsEmpty = "isEmpty", e.IsNotEmpty = "isNotEmpty", e.IsRelative = "isRelative", e.IsInPast = "isInPast", e.IsInFuture = "isInFuture", e.IsToday = "isToday", e))(me || {});
let Pn;
const B$ = new Uint8Array(16);
function G$() {
  if (!Pn && (Pn = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !Pn))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return Pn(B$);
}
const fe = [];
for (let e = 0; e < 256; ++e)
  fe.push((e + 256).toString(16).slice(1));
function H$(e, t = 0) {
  return fe[e[t + 0]] + fe[e[t + 1]] + fe[e[t + 2]] + fe[e[t + 3]] + "-" + fe[e[t + 4]] + fe[e[t + 5]] + "-" + fe[e[t + 6]] + fe[e[t + 7]] + "-" + fe[e[t + 8]] + fe[e[t + 9]] + "-" + fe[e[t + 10]] + fe[e[t + 11]] + fe[e[t + 12]] + fe[e[t + 13]] + fe[e[t + 14]] + fe[e[t + 15]];
}
const J$ = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), ml = {
  randomUUID: J$
};
function V$(e, t, n) {
  if (ml.randomUUID && !e)
    return ml.randomUUID();
  e = e || {};
  const i = e.random || (e.rng || G$)();
  return i[6] = i[6] & 15 | 64, i[8] = i[8] & 63 | 128, H$(i);
}
var So = /* @__PURE__ */ ((e) => (e.EMAIL = "EMAIL", e.CALENDAR = "CALENDAR", e.WORKFLOW = "WORKFLOW", e.AGENT = "AGENT", e.API = "API", e.IMPORT = "IMPORT", e.MANUAL = "MANUAL", e.SYSTEM = "SYSTEM", e.WEBHOOK = "WEBHOOK", e.APPLICATION = "APPLICATION", e))(So || {});
Y.ACTOR, Y.SELECT, Object.keys(So).map(
  (e, t) => ({
    id: V$(),
    // @ts-expect-error legacy noImplicitAny
    label: `${So[e].toLowerCase()}`,
    value: e,
    position: t
  })
), Y.UUID, Y.TEXT, Y.RAW_JSON;
var An = /* @__PURE__ */ ((e) => (e.MONDAY = "MONDAY", e.SUNDAY = "SUNDAY", e.SATURDAY = "SATURDAY", e))(An || {});
Y.CURRENCY + "", Y.EMAILS + "", Y.LINKS + "", Y.PHONES + "", Y.FULL_NAME + "", Y.ADDRESS + "", Y.ACTOR + "", Y.RICH_TEXT + "";
const q$ = {
  AED: { label: "UAE dirham" },
  AFN: { label: "Afghan afghani" },
  ALL: { label: "Albanian lek" },
  AMD: { label: "Armenian dram" },
  ANG: { label: "Netherlands Antillean guilder" },
  AOA: { label: "Angolan kwanza" },
  ARS: { label: "Argentine peso" },
  AUD: { label: "Australian dollar" },
  AWG: { label: "Aruban florin" },
  AZN: { label: "Azerbaijani manat" },
  BAM: { label: "Bosnia and Herzegovina mark" },
  BBD: { label: "Barbados dollar" },
  BDT: { label: "Bangladeshi taka" },
  BGN: { label: "Bulgarian lev" },
  BHD: { label: "Bahraini dinar" },
  BIF: { label: "Burundian franc" },
  BMD: { label: "Bermudian dollar" },
  BND: { label: "Brunei dollar" },
  BOB: { label: "Boliviano" },
  BRL: { label: "Brazilian real" },
  BSD: { label: "Bahamian dollar" },
  BTN: { label: "Bhutanese ngultrum" },
  BWP: { label: "Botswana pula" },
  BYN: { label: "Belarusian ruble" },
  BZD: { label: "Belize dollar" },
  CAD: { label: "Canadian dollar" },
  CDF: { label: "Congolese franc" },
  CHF: { label: "Swiss franc" },
  CLP: { label: "Chilean peso" },
  CLF: { label: "Unidad de Fomento" },
  CNY: { label: "Chinese yuan" },
  COP: { label: "Colombian peso" },
  CRC: { label: "Costa Rican colon" },
  CUP: { label: "Cuban peso" },
  CVE: { label: "Cape Verdean escudo" },
  CZK: { label: "Czech koruna" },
  DJF: { label: "Djiboutian franc" },
  DKK: { label: "Danish krone" },
  DOP: { label: "Dominican peso" },
  DZD: { label: "Algerian Dinar" },
  EGP: { label: "Egyptian pound" },
  ERN: { label: "Eritrean nakfa" },
  ETB: { label: "Ethiopian birr" },
  EUR: { label: "Euro" },
  FJD: { label: "Fiji dollar" },
  FKP: { label: "Falkland Islands pound" },
  GBP: { label: "British pound" },
  GEL: { label: "Georgian lari" },
  GHS: { label: "Ghanaian cedi" },
  GIP: { label: "Gibraltar pound" },
  GMD: { label: "Gambian dalasi" },
  GNF: { label: "Guinean franc" },
  GTQ: { label: "Guatemalan quetzal" },
  GYD: { label: "Guyanese dollar" },
  HKD: { label: "Hong Kong dollar" },
  HNL: { label: "Honduran lempira" },
  HTG: { label: "Haitian gourde" },
  HUF: { label: "Hungarian forint" },
  IDR: { label: "Indonesian rupiah" },
  ILS: { label: "Israeli shekel" },
  INR: { label: "Indian rupee" },
  IQD: { label: "Iraqi dinar" },
  IRR: { label: "Iranian rial" },
  ISK: { label: "Icelandic króna" },
  JMD: { label: "Jamaican dollar" },
  JOD: { label: "Jordanian dinar" },
  JPY: { label: "Japanese yen" },
  KES: { label: "Kenyan shilling" },
  KGS: { label: "Kyrgyzstani som" },
  KHR: { label: "Cambodian riel" },
  KMF: { label: "Comoro franc" },
  KPW: { label: "North Korean won" },
  KRW: { label: "South Korean won" },
  KWD: { label: "Kuwaiti dinar" },
  KYD: { label: "Cayman Islands dollar" },
  KZT: { label: "Kazakhstani tenge" },
  LAK: { label: "Lao kip" },
  LBP: { label: "Lebanese pound" },
  LKR: { label: "Sri Lankan rupee" },
  LRD: { label: "Liberian dollar" },
  LSL: { label: "Lesotho loti" },
  LYD: { label: "Libyan dinar" },
  MAD: { label: "Moroccan dirham" },
  MDL: { label: "Moldovan leu" },
  MGA: { label: "Malagasy ariary" },
  MKD: { label: "Macedonian denar" },
  MMK: { label: "Myanmar kyat" },
  MNT: { label: "Mongolian tögrög" },
  MOP: { label: "Macanese pataca" },
  MRU: { label: "Mauritanian ouguiya" },
  MUR: { label: "Mauritian rupee" },
  MVR: { label: "Maldivian rufiyaa" },
  MWK: { label: "Malawian kwacha" },
  MXN: { label: "Mexican peso" },
  MYR: { label: "Malaysian ringgit" },
  MZN: { label: "Mozambican metical" },
  NAD: { label: "Namibian dollar" },
  NGN: { label: "Nigerian naira" },
  NIO: { label: "Nicaraguan córdoba" },
  NOK: { label: "Norwegian krone" },
  NPR: { label: "Nepalese rupee" },
  NZD: { label: "New Zealand dollar" },
  OMR: { label: "Omani rial" },
  PAB: { label: "Panamanian balboa" },
  PEN: { label: "Peruvian sol" },
  PGK: { label: "Papua New Guinean kina" },
  PHP: { label: "Philippine peso" },
  PKR: { label: "Pakistani rupee" },
  PLN: { label: "Polish złoty" },
  PYG: { label: "Paraguayan guaraní" },
  QAR: { label: "Qatari riyal" },
  RON: { label: "Romanian leu" },
  RSD: { label: "Serbian dinar" },
  RUB: { label: "Russian ruble" },
  RWF: { label: "Rwandan franc" },
  SAR: { label: "Saudi riyal" },
  SBD: { label: "Solomon Islands dollar" },
  SCR: { label: "Seychelles rupee" },
  SDG: { label: "Sudanese pound" },
  SEK: { label: "Swedish krona" },
  SGD: { label: "Singapore dollar" },
  SHP: { label: "Saint Helena pound" },
  SLE: { label: "Sierra Leonean leone" },
  SOS: { label: "Somalian shilling" },
  SRD: { label: "Surinamese dollar" },
  SSP: { label: "South Sudanese pound" },
  STN: { label: "São Tomé and Príncipe dobra" },
  SVC: { label: "Salvadoran colón" },
  SYP: { label: "Syrian pound" },
  SZL: { label: "Swazi lilangeni" },
  THB: { label: "Thai Baht" },
  TJS: { label: "Tajikistani somoni" },
  TMT: { label: "Turkmenistan manat" },
  TND: { label: "Tunisian dinar" },
  TOP: { label: "Tongan paʻanga" },
  TRY: { label: "Turkish lira" },
  TTD: { label: "Trinidad and Tobago dollar" },
  TWD: { label: "Taiwanese dollar" },
  TZS: { label: "Tanzanian shilling" },
  UAH: { label: "Ukrainian hryvnia" },
  UGX: { label: "Ugandan shilling" },
  USD: { label: "United States dollar" },
  UYU: { label: "Uruguayan peso" },
  UZS: { label: "Uzbekistani sum" },
  VES: { label: "Venezuelan bolívar" },
  VND: { label: "Vietnamese đồng" },
  VUV: { label: "Vanuatu vatu" },
  WST: { label: "Samoan tala" },
  XOF: { label: "West African CFA franc" },
  XCD: { label: "East Caribbean dollar" },
  YER: { label: "Yemeni rial" },
  ZAR: { label: "South African rand" },
  ZMW: { label: "Zambian kwacha" },
  ZWG: { label: "Zimbabwe Gold" }
};
Y.TEXT, Y.FULL_NAME, Y.UUID;
var gl;
const Vt = /* @__PURE__ */ Object.freeze({
  status: "aborted"
});
function S(e, t, n) {
  function i(s, d) {
    if (s._zod || Object.defineProperty(s, "_zod", {
      value: {
        def: d,
        constr: a,
        traits: /* @__PURE__ */ new Set()
      },
      enumerable: !1
    }), s._zod.traits.has(e))
      return;
    s._zod.traits.add(e), t(s, d);
    const p = a.prototype, f = Object.keys(p);
    for (let h = 0; h < f.length; h++) {
      const c = f[h];
      c in s || (s[c] = p[c].bind(s));
    }
  }
  const r = n?.Parent ?? Object;
  class o extends r {
  }
  Object.defineProperty(o, "name", { value: e });
  function a(s) {
    var d;
    const p = n?.Parent ? new o() : this;
    i(p, s), (d = p._zod).deferred ?? (d.deferred = []);
    for (const f of p._zod.deferred)
      f();
    return p;
  }
  return Object.defineProperty(a, "init", { value: i }), Object.defineProperty(a, Symbol.hasInstance, {
    value: (s) => n?.Parent && s instanceof n.Parent ? !0 : s?._zod?.traits?.has(e)
  }), Object.defineProperty(a, "name", { value: e }), a;
}
const qc = /* @__PURE__ */ Symbol("zod_brand");
class It extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}
class li extends Error {
  constructor(t) {
    super(`Encountered unidirectional transform during encode: ${t}`), this.name = "ZodEncodeError";
  }
}
(gl = globalThis).__zod_globalConfig ?? (gl.__zod_globalConfig = {});
const Sr = globalThis.__zod_globalConfig;
function pe(e) {
  return e && Object.assign(Sr, e), Sr;
}
function W$(e) {
  return e;
}
function K$(e) {
  return e;
}
function Y$(e) {
}
function X$(e) {
  throw new Error("Unexpected value in exhaustive check");
}
function Q$(e) {
}
function Go(e) {
  const t = Object.values(e).filter((i) => typeof i == "number");
  return Object.entries(e).filter(([i, r]) => t.indexOf(+i) === -1).map(([i, r]) => r);
}
function T(e, t = "|") {
  return e.map((n) => j(n)).join(t);
}
function Vn(e, t) {
  return typeof t == "bigint" ? t.toString() : t;
}
function Nr(e) {
  return {
    get value() {
      {
        const t = e();
        return Object.defineProperty(this, "value", { value: t }), t;
      }
    }
  };
}
function Ct(e) {
  return e == null;
}
function ci(e) {
  const t = e.startsWith("^") ? 1 : 0, n = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(t, n);
}
function Wc(e, t) {
  const n = e / t, i = Math.round(n), r = Number.EPSILON * Math.max(Math.abs(n), 1);
  return Math.abs(n - i) < r ? 0 : n - i;
}
const vl = /* @__PURE__ */ Symbol("evaluating");
function J(e, t, n) {
  let i;
  Object.defineProperty(e, t, {
    get() {
      if (i !== vl)
        return i === void 0 && (i = vl, i = n()), i;
    },
    set(r) {
      Object.defineProperty(e, t, {
        value: r
        // configurable: true,
      });
    },
    configurable: !0
  });
}
function e4(e) {
  return Object.create(Object.getPrototypeOf(e), Object.getOwnPropertyDescriptors(e));
}
function ht(e, t, n) {
  Object.defineProperty(e, t, {
    value: n,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function Ve(...e) {
  const t = {};
  for (const n of e) {
    const i = Object.getOwnPropertyDescriptors(n);
    Object.assign(t, i);
  }
  return Object.defineProperties({}, t);
}
function t4(e) {
  return Ve(e._zod.def);
}
function r4(e, t) {
  return t ? t.reduce((n, i) => n?.[i], e) : e;
}
function n4(e) {
  const t = Object.keys(e), n = t.map((i) => e[i]);
  return Promise.all(n).then((i) => {
    const r = {};
    for (let o = 0; o < t.length; o++)
      r[t[o]] = i[o];
    return r;
  });
}
function i4(e = 10) {
  const t = "abcdefghijklmnopqrstuvwxyz";
  let n = "";
  for (let i = 0; i < e; i++)
    n += t[Math.floor(Math.random() * t.length)];
  return n;
}
function ko(e) {
  return JSON.stringify(e);
}
function Kc(e) {
  return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const Ho = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {
};
function Yt(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
const Yc = /* @__PURE__ */ Nr(() => {
  if (Sr.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare"))
    return !1;
  try {
    const e = Function;
    return new e(""), !0;
  } catch {
    return !1;
  }
});
function Ot(e) {
  if (Yt(e) === !1)
    return !1;
  const t = e.constructor;
  if (t === void 0 || typeof t != "function")
    return !0;
  const n = t.prototype;
  return !(Yt(n) === !1 || Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") === !1);
}
function di(e) {
  return Ot(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
function o4(e) {
  let t = 0;
  for (const n in e)
    Object.prototype.hasOwnProperty.call(e, n) && t++;
  return t;
}
const a4 = (e) => {
  const t = typeof e;
  switch (t) {
    case "undefined":
      return "undefined";
    case "string":
      return "string";
    case "number":
      return Number.isNaN(e) ? "nan" : "number";
    case "boolean":
      return "boolean";
    case "function":
      return "function";
    case "bigint":
      return "bigint";
    case "symbol":
      return "symbol";
    case "object":
      return Array.isArray(e) ? "array" : e === null ? "null" : e.then && typeof e.then == "function" && e.catch && typeof e.catch == "function" ? "promise" : typeof Map < "u" && e instanceof Map ? "map" : typeof Set < "u" && e instanceof Set ? "set" : typeof Date < "u" && e instanceof Date ? "date" : typeof File < "u" && e instanceof File ? "file" : "object";
    default:
      throw new Error(`Unknown data type: ${t}`);
  }
}, qn = /* @__PURE__ */ new Set(["string", "number", "symbol"]), Xc = /* @__PURE__ */ new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
  "undefined"
]);
function tt(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Ce(e, t, n) {
  const i = new e._zod.constr(t ?? e._zod.def);
  return (!t || n?.parent) && (i._zod.parent = e), i;
}
function N(e) {
  const t = e;
  if (!t)
    return {};
  if (typeof t == "string")
    return { error: () => t };
  if (t?.message !== void 0) {
    if (t?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    t.error = t.message;
  }
  return delete t.message, typeof t.error == "string" ? { ...t, error: () => t.error } : t;
}
function s4(e) {
  let t;
  return new Proxy({}, {
    get(n, i, r) {
      return t ?? (t = e()), Reflect.get(t, i, r);
    },
    set(n, i, r, o) {
      return t ?? (t = e()), Reflect.set(t, i, r, o);
    },
    has(n, i) {
      return t ?? (t = e()), Reflect.has(t, i);
    },
    deleteProperty(n, i) {
      return t ?? (t = e()), Reflect.deleteProperty(t, i);
    },
    ownKeys(n) {
      return t ?? (t = e()), Reflect.ownKeys(t);
    },
    getOwnPropertyDescriptor(n, i) {
      return t ?? (t = e()), Reflect.getOwnPropertyDescriptor(t, i);
    },
    defineProperty(n, i, r) {
      return t ?? (t = e()), Reflect.defineProperty(t, i, r);
    }
  });
}
function j(e) {
  return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
}
function Qc(e) {
  return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
const ed = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}, td = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function rd(e, t) {
  const n = e._zod.def, i = n.checks;
  if (i && i.length > 0)
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  const o = Ve(e._zod.def, {
    get shape() {
      const a = {};
      for (const s in t) {
        if (!(s in n.shape))
          throw new Error(`Unrecognized key: "${s}"`);
        t[s] && (a[s] = n.shape[s]);
      }
      return ht(this, "shape", a), a;
    },
    checks: []
  });
  return Ce(e, o);
}
function nd(e, t) {
  const n = e._zod.def, i = n.checks;
  if (i && i.length > 0)
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  const o = Ve(e._zod.def, {
    get shape() {
      const a = { ...e._zod.def.shape };
      for (const s in t) {
        if (!(s in n.shape))
          throw new Error(`Unrecognized key: "${s}"`);
        t[s] && delete a[s];
      }
      return ht(this, "shape", a), a;
    },
    checks: []
  });
  return Ce(e, o);
}
function id(e, t) {
  if (!Ot(t))
    throw new Error("Invalid input to extend: expected a plain object");
  const n = e._zod.def.checks;
  if (n && n.length > 0) {
    const o = e._zod.def.shape;
    for (const a in t)
      if (Object.getOwnPropertyDescriptor(o, a) !== void 0)
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  const r = Ve(e._zod.def, {
    get shape() {
      const o = { ...e._zod.def.shape, ...t };
      return ht(this, "shape", o), o;
    }
  });
  return Ce(e, r);
}
function od(e, t) {
  if (!Ot(t))
    throw new Error("Invalid input to safeExtend: expected a plain object");
  const n = Ve(e._zod.def, {
    get shape() {
      const i = { ...e._zod.def.shape, ...t };
      return ht(this, "shape", i), i;
    }
  });
  return Ce(e, n);
}
function ad(e, t) {
  if (e._zod.def.checks?.length)
    throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  const n = Ve(e._zod.def, {
    get shape() {
      const i = { ...e._zod.def.shape, ...t._zod.def.shape };
      return ht(this, "shape", i), i;
    },
    get catchall() {
      return t._zod.def.catchall;
    },
    checks: t._zod.def.checks ?? []
  });
  return Ce(e, n);
}
function sd(e, t, n) {
  const r = t._zod.def.checks;
  if (r && r.length > 0)
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  const a = Ve(t._zod.def, {
    get shape() {
      const s = t._zod.def.shape, d = { ...s };
      if (n)
        for (const p in n) {
          if (!(p in s))
            throw new Error(`Unrecognized key: "${p}"`);
          n[p] && (d[p] = e ? new e({
            type: "optional",
            innerType: s[p]
          }) : s[p]);
        }
      else
        for (const p in s)
          d[p] = e ? new e({
            type: "optional",
            innerType: s[p]
          }) : s[p];
      return ht(this, "shape", d), d;
    },
    checks: []
  });
  return Ce(t, a);
}
function ud(e, t, n) {
  const i = Ve(t._zod.def, {
    get shape() {
      const r = t._zod.def.shape, o = { ...r };
      if (n)
        for (const a in n) {
          if (!(a in o))
            throw new Error(`Unrecognized key: "${a}"`);
          n[a] && (o[a] = new e({
            type: "nonoptional",
            innerType: r[a]
          }));
        }
      else
        for (const a in r)
          o[a] = new e({
            type: "nonoptional",
            innerType: r[a]
          });
      return ht(this, "shape", o), o;
    }
  });
  return Ce(t, i);
}
function wt(e, t = 0) {
  if (e.aborted === !0)
    return !0;
  for (let n = t; n < e.issues.length; n++)
    if (e.issues[n]?.continue !== !0)
      return !0;
  return !1;
}
function ld(e, t = 0) {
  if (e.aborted === !0)
    return !0;
  for (let n = t; n < e.issues.length; n++)
    if (e.issues[n]?.continue === !1)
      return !0;
  return !1;
}
function Te(e, t) {
  return t.map((n) => {
    var i;
    return (i = n).path ?? (i.path = []), n.path.unshift(e), n;
  });
}
function _r(e) {
  return typeof e == "string" ? e : e?.message;
}
function xe(e, t, n) {
  const i = e.message ? e.message : _r(e.inst?._zod.def?.error?.(e)) ?? _r(t?.error?.(e)) ?? _r(n.customError?.(e)) ?? _r(n.localeError?.(e)) ?? "Invalid input", { inst: r, continue: o, input: a, ...s } = e;
  return s.path ?? (s.path = []), s.message = i, t?.reportInput && (s.input = a), s;
}
function fi(e) {
  return e instanceof Set ? "set" : e instanceof Map ? "map" : e instanceof File ? "file" : "unknown";
}
function pi(e) {
  return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function Z(e) {
  const t = typeof e;
  switch (t) {
    case "number":
      return Number.isNaN(e) ? "nan" : "number";
    case "object": {
      if (e === null)
        return "null";
      if (Array.isArray(e))
        return "array";
      const n = e;
      if (n && Object.getPrototypeOf(n) !== Object.prototype && "constructor" in n && n.constructor)
        return n.constructor.name;
    }
  }
  return t;
}
function Xt(...e) {
  const [t, n, i] = e;
  return typeof t == "string" ? {
    message: t,
    code: "custom",
    input: n,
    inst: i
  } : { ...t };
}
function u4(e) {
  return Object.entries(e).filter(([t, n]) => Number.isNaN(Number.parseInt(t, 10))).map((t) => t[1]);
}
function cd(e) {
  const t = atob(e), n = new Uint8Array(t.length);
  for (let i = 0; i < t.length; i++)
    n[i] = t.charCodeAt(i);
  return n;
}
function dd(e) {
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += String.fromCharCode(e[n]);
  return btoa(t);
}
function l4(e) {
  const t = e.replace(/-/g, "+").replace(/_/g, "/"), n = "=".repeat((4 - t.length % 4) % 4);
  return cd(t + n);
}
function c4(e) {
  return dd(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function d4(e) {
  const t = e.replace(/^0x/, "");
  if (t.length % 2 !== 0)
    throw new Error("Invalid hex string length");
  const n = new Uint8Array(t.length / 2);
  for (let i = 0; i < t.length; i += 2)
    n[i / 2] = Number.parseInt(t.slice(i, i + 2), 16);
  return n;
}
function f4(e) {
  return Array.from(e).map((t) => t.toString(16).padStart(2, "0")).join("");
}
class p4 {
  constructor(...t) {
  }
}
const fd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BIGINT_FORMAT_RANGES: td,
  Class: p4,
  NUMBER_FORMAT_RANGES: ed,
  aborted: wt,
  allowsEval: Yc,
  assert: Q$,
  assertEqual: W$,
  assertIs: Y$,
  assertNever: X$,
  assertNotEqual: K$,
  assignProp: ht,
  base64ToUint8Array: cd,
  base64urlToUint8Array: l4,
  cached: Nr,
  captureStackTrace: Ho,
  cleanEnum: u4,
  cleanRegex: ci,
  clone: Ce,
  cloneDef: t4,
  createTransparentProxy: s4,
  defineLazy: J,
  esc: ko,
  escapeRegex: tt,
  explicitlyAborted: ld,
  extend: id,
  finalizeIssue: xe,
  floatSafeRemainder: Wc,
  getElementAtPath: r4,
  getEnumValues: Go,
  getLengthableOrigin: pi,
  getParsedType: a4,
  getSizableOrigin: fi,
  hexToUint8Array: d4,
  isObject: Yt,
  isPlainObject: Ot,
  issue: Xt,
  joinValues: T,
  jsonStringifyReplacer: Vn,
  merge: ad,
  mergeDefs: Ve,
  normalizeParams: N,
  nullish: Ct,
  numKeys: o4,
  objectClone: e4,
  omit: nd,
  optionalKeys: Qc,
  parsedType: Z,
  partial: sd,
  pick: rd,
  prefixIssues: Te,
  primitiveTypes: Xc,
  promiseAllObject: n4,
  propertyKeyTypes: qn,
  randomString: i4,
  required: ud,
  safeExtend: od,
  shallowClone: di,
  slugify: Kc,
  stringifyPrimitive: j,
  uint8ArrayToBase64: dd,
  uint8ArrayToBase64url: c4,
  uint8ArrayToHex: f4,
  unwrapMessage: _r
}, Symbol.toStringTag, { value: "Module" })), pd = (e, t) => {
  e.name = "$ZodError", Object.defineProperty(e, "_zod", {
    value: e._zod,
    enumerable: !1
  }), Object.defineProperty(e, "issues", {
    value: t,
    enumerable: !1
  }), e.message = JSON.stringify(t, Vn, 2), Object.defineProperty(e, "toString", {
    value: () => e.message,
    enumerable: !1
  });
}, Jo = S("$ZodError", pd), Oe = S("$ZodError", pd, { Parent: Error });
function Vo(e, t = (n) => n.message) {
  const n = {}, i = [];
  for (const r of e.issues)
    r.path.length > 0 ? (n[r.path[0]] = n[r.path[0]] || [], n[r.path[0]].push(t(r))) : i.push(t(r));
  return { formErrors: i, fieldErrors: n };
}
function qo(e, t = (n) => n.message) {
  const n = { _errors: [] }, i = (r, o = []) => {
    for (const a of r.issues)
      if (a.code === "invalid_union" && a.errors.length)
        a.errors.map((s) => i({ issues: s }, [...o, ...a.path]));
      else if (a.code === "invalid_key")
        i({ issues: a.issues }, [...o, ...a.path]);
      else if (a.code === "invalid_element")
        i({ issues: a.issues }, [...o, ...a.path]);
      else {
        const s = [...o, ...a.path];
        if (s.length === 0)
          n._errors.push(t(a));
        else {
          let d = n, p = 0;
          for (; p < s.length; ) {
            const f = s[p];
            p === s.length - 1 ? (d[f] = d[f] || { _errors: [] }, d[f]._errors.push(t(a))) : d[f] = d[f] || { _errors: [] }, d = d[f], p++;
          }
        }
      }
  };
  return i(e), n;
}
function hd(e, t = (n) => n.message) {
  const n = { errors: [] }, i = (r, o = []) => {
    var a, s;
    for (const d of r.issues)
      if (d.code === "invalid_union" && d.errors.length)
        d.errors.map((p) => i({ issues: p }, [...o, ...d.path]));
      else if (d.code === "invalid_key")
        i({ issues: d.issues }, [...o, ...d.path]);
      else if (d.code === "invalid_element")
        i({ issues: d.issues }, [...o, ...d.path]);
      else {
        const p = [...o, ...d.path];
        if (p.length === 0) {
          n.errors.push(t(d));
          continue;
        }
        let f = n, h = 0;
        for (; h < p.length; ) {
          const c = p[h], u = h === p.length - 1;
          typeof c == "string" ? (f.properties ?? (f.properties = {}), (a = f.properties)[c] ?? (a[c] = { errors: [] }), f = f.properties[c]) : (f.items ?? (f.items = []), (s = f.items)[c] ?? (s[c] = { errors: [] }), f = f.items[c]), u && f.errors.push(t(d)), h++;
        }
      }
  };
  return i(e), n;
}
function md(e) {
  const t = [], n = e.map((i) => typeof i == "object" ? i.key : i);
  for (const i of n)
    typeof i == "number" ? t.push(`[${i}]`) : typeof i == "symbol" ? t.push(`[${JSON.stringify(String(i))}]`) : /[^\w$]/.test(i) ? t.push(`[${JSON.stringify(i)}]`) : (t.length && t.push("."), t.push(i));
  return t.join("");
}
function gd(e) {
  const t = [], n = [...e.issues].sort((i, r) => (i.path ?? []).length - (r.path ?? []).length);
  for (const i of n)
    t.push(`✖ ${i.message}`), i.path?.length && t.push(`  → at ${md(i.path)}`);
  return t.join(`
`);
}
const Tr = (e) => (t, n, i, r) => {
  const o = i ? { ...i, async: !1 } : { async: !1 }, a = t._zod.run({ value: n, issues: [] }, o);
  if (a instanceof Promise)
    throw new It();
  if (a.issues.length) {
    const s = new (r?.Err ?? e)(a.issues.map((d) => xe(d, o, pe())));
    throw Ho(s, r?.callee), s;
  }
  return a.value;
}, wo = /* @__PURE__ */ Tr(Oe), zr = (e) => async (t, n, i, r) => {
  const o = i ? { ...i, async: !0 } : { async: !0 };
  let a = t._zod.run({ value: n, issues: [] }, o);
  if (a instanceof Promise && (a = await a), a.issues.length) {
    const s = new (r?.Err ?? e)(a.issues.map((d) => xe(d, o, pe())));
    throw Ho(s, r?.callee), s;
  }
  return a.value;
}, Io = /* @__PURE__ */ zr(Oe), Ar = (e) => (t, n, i) => {
  const r = i ? { ...i, async: !1 } : { async: !1 }, o = t._zod.run({ value: n, issues: [] }, r);
  if (o instanceof Promise)
    throw new It();
  return o.issues.length ? {
    success: !1,
    error: new (e ?? Jo)(o.issues.map((a) => xe(a, r, pe())))
  } : { success: !0, data: o.value };
}, vd = /* @__PURE__ */ Ar(Oe), Dr = (e) => async (t, n, i) => {
  const r = i ? { ...i, async: !0 } : { async: !0 };
  let o = t._zod.run({ value: n, issues: [] }, r);
  return o instanceof Promise && (o = await o), o.issues.length ? {
    success: !1,
    error: new e(o.issues.map((a) => xe(a, r, pe())))
  } : { success: !0, data: o.value };
}, $d = /* @__PURE__ */ Dr(Oe), Wo = (e) => (t, n, i) => {
  const r = i ? { ...i, direction: "backward" } : { direction: "backward" };
  return Tr(e)(t, n, r);
}, h4 = /* @__PURE__ */ Wo(Oe), Ko = (e) => (t, n, i) => Tr(e)(t, n, i), m4 = /* @__PURE__ */ Ko(Oe), Yo = (e) => async (t, n, i) => {
  const r = i ? { ...i, direction: "backward" } : { direction: "backward" };
  return zr(e)(t, n, r);
}, g4 = /* @__PURE__ */ Yo(Oe), Xo = (e) => async (t, n, i) => zr(e)(t, n, i), v4 = /* @__PURE__ */ Xo(Oe), Qo = (e) => (t, n, i) => {
  const r = i ? { ...i, direction: "backward" } : { direction: "backward" };
  return Ar(e)(t, n, r);
}, $4 = /* @__PURE__ */ Qo(Oe), ea = (e) => (t, n, i) => Ar(e)(t, n, i), _4 = /* @__PURE__ */ ea(Oe), ta = (e) => async (t, n, i) => {
  const r = i ? { ...i, direction: "backward" } : { direction: "backward" };
  return Dr(e)(t, n, r);
}, y4 = /* @__PURE__ */ ta(Oe), ra = (e) => async (t, n, i) => Dr(e)(t, n, i), b4 = /* @__PURE__ */ ra(Oe), _d = /^[cC][0-9a-z]{6,}$/, yd = /^[0-9a-z]+$/, bd = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, Sd = /^[0-9a-vA-V]{20}$/, kd = /^[A-Za-z0-9]{27}$/, wd = /^[a-zA-Z0-9_-]{21}$/, Id = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, S4 = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, xd = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, Qt = (e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, k4 = /* @__PURE__ */ Qt(4), w4 = /* @__PURE__ */ Qt(6), I4 = /* @__PURE__ */ Qt(7), Od = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, x4 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, O4 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, Ed = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u, E4 = Ed, P4 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, N4 = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function Pd() {
  return new RegExp(N4, "u");
}
const Nd = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Td = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, zd = (e) => {
  const t = tt(e ?? ":");
  return new RegExp(`^(?:[0-9A-F]{2}${t}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${t}){5}[0-9a-f]{2}$`);
}, Ad = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, Dd = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Cd = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, na = /^[A-Za-z0-9_-]*$/, Ud = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/, Rd = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, ia = /^https?$/, Ld = /^\+[1-9]\d{6,14}$/, jd = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", Md = /* @__PURE__ */ new RegExp(`^${jd}$`);
function Zd(e) {
  const t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function Fd(e) {
  return new RegExp(`^${Zd(e)}$`);
}
function Bd(e) {
  const t = Zd({ precision: e.precision }), n = ["Z"];
  e.local && n.push(""), e.offset && n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const i = `${t}(?:${n.join("|")})`;
  return new RegExp(`^${jd}T(?:${i})$`);
}
const Gd = (e) => {
  const t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${t}$`);
}, Hd = /^-?\d+n?$/, Jd = /^-?\d+$/, oa = /^-?\d+(?:\.\d+)?$/, Vd = /^(?:true|false)$/i, qd = /^null$/i, Wd = /^undefined$/i, Kd = /^[^A-Z]*$/, Yd = /^[^a-z]*$/, Xd = /^[0-9a-fA-F]*$/;
function Cr(e, t) {
  return new RegExp(`^[A-Za-z0-9+/]{${e}}${t}$`);
}
function Ur(e) {
  return new RegExp(`^[A-Za-z0-9_-]{${e}}$`);
}
const T4 = /^[0-9a-fA-F]{32}$/, z4 = /* @__PURE__ */ Cr(22, "=="), A4 = /* @__PURE__ */ Ur(22), D4 = /^[0-9a-fA-F]{40}$/, C4 = /* @__PURE__ */ Cr(27, "="), U4 = /* @__PURE__ */ Ur(27), R4 = /^[0-9a-fA-F]{64}$/, L4 = /* @__PURE__ */ Cr(43, "="), j4 = /* @__PURE__ */ Ur(43), M4 = /^[0-9a-fA-F]{96}$/, Z4 = /* @__PURE__ */ Cr(64, ""), F4 = /* @__PURE__ */ Ur(64), B4 = /^[0-9a-fA-F]{128}$/, G4 = /* @__PURE__ */ Cr(86, "=="), H4 = /* @__PURE__ */ Ur(86), aa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  base64: Cd,
  base64url: na,
  bigint: Hd,
  boolean: Vd,
  browserEmail: P4,
  cidrv4: Ad,
  cidrv6: Dd,
  cuid: _d,
  cuid2: yd,
  date: Md,
  datetime: Bd,
  domain: Rd,
  duration: Id,
  e164: Ld,
  email: Od,
  emoji: Pd,
  extendedDuration: S4,
  guid: xd,
  hex: Xd,
  hostname: Ud,
  html5Email: x4,
  httpProtocol: ia,
  idnEmail: E4,
  integer: Jd,
  ipv4: Nd,
  ipv6: Td,
  ksuid: kd,
  lowercase: Kd,
  mac: zd,
  md5_base64: z4,
  md5_base64url: A4,
  md5_hex: T4,
  nanoid: wd,
  null: qd,
  number: oa,
  rfc5322Email: O4,
  sha1_base64: C4,
  sha1_base64url: U4,
  sha1_hex: D4,
  sha256_base64: L4,
  sha256_base64url: j4,
  sha256_hex: R4,
  sha384_base64: Z4,
  sha384_base64url: F4,
  sha384_hex: M4,
  sha512_base64: G4,
  sha512_base64url: H4,
  sha512_hex: B4,
  string: Gd,
  time: Fd,
  ulid: bd,
  undefined: Wd,
  unicodeEmail: Ed,
  uppercase: Yd,
  uuid: Qt,
  uuid4: k4,
  uuid6: w4,
  uuid7: I4,
  xid: Sd
}, Symbol.toStringTag, { value: "Module" })), ae = /* @__PURE__ */ S("$ZodCheck", (e, t) => {
  var n;
  e._zod ?? (e._zod = {}), e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), Qd = {
  number: "number",
  bigint: "bigint",
  object: "date"
}, sa = /* @__PURE__ */ S("$ZodCheckLessThan", (e, t) => {
  ae.init(e, t);
  const n = Qd[typeof t.value];
  e._zod.onattach.push((i) => {
    const r = i._zod.bag, o = (t.inclusive ? r.maximum : r.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    t.value < o && (t.inclusive ? r.maximum = t.value : r.exclusiveMaximum = t.value);
  }), e._zod.check = (i) => {
    (t.inclusive ? i.value <= t.value : i.value < t.value) || i.issues.push({
      origin: n,
      code: "too_big",
      maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
      input: i.value,
      inclusive: t.inclusive,
      inst: e,
      continue: !t.abort
    });
  };
}), ua = /* @__PURE__ */ S("$ZodCheckGreaterThan", (e, t) => {
  ae.init(e, t);
  const n = Qd[typeof t.value];
  e._zod.onattach.push((i) => {
    const r = i._zod.bag, o = (t.inclusive ? r.minimum : r.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    t.value > o && (t.inclusive ? r.minimum = t.value : r.exclusiveMinimum = t.value);
  }), e._zod.check = (i) => {
    (t.inclusive ? i.value >= t.value : i.value > t.value) || i.issues.push({
      origin: n,
      code: "too_small",
      minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
      input: i.value,
      inclusive: t.inclusive,
      inst: e,
      continue: !t.abort
    });
  };
}), ef = /* @__PURE__ */ S("$ZodCheckMultipleOf", (e, t) => {
  ae.init(e, t), e._zod.onattach.push((n) => {
    var i;
    (i = n._zod.bag).multipleOf ?? (i.multipleOf = t.value);
  }), e._zod.check = (n) => {
    if (typeof n.value != typeof t.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    (typeof n.value == "bigint" ? n.value % t.value === BigInt(0) : Wc(n.value, t.value) === 0) || n.issues.push({
      origin: typeof n.value,
      code: "not_multiple_of",
      divisor: t.value,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), tf = /* @__PURE__ */ S("$ZodCheckNumberFormat", (e, t) => {
  ae.init(e, t), t.format = t.format || "float64";
  const n = t.format?.includes("int"), i = n ? "int" : "number", [r, o] = ed[t.format];
  e._zod.onattach.push((a) => {
    const s = a._zod.bag;
    s.format = t.format, s.minimum = r, s.maximum = o, n && (s.pattern = Jd);
  }), e._zod.check = (a) => {
    const s = a.value;
    if (n) {
      if (!Number.isInteger(s)) {
        a.issues.push({
          expected: i,
          format: t.format,
          code: "invalid_type",
          continue: !1,
          input: s,
          inst: e
        });
        return;
      }
      if (!Number.isSafeInteger(s)) {
        s > 0 ? a.issues.push({
          input: s,
          code: "too_big",
          maximum: Number.MAX_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: i,
          inclusive: !0,
          continue: !t.abort
        }) : a.issues.push({
          input: s,
          code: "too_small",
          minimum: Number.MIN_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: i,
          inclusive: !0,
          continue: !t.abort
        });
        return;
      }
    }
    s < r && a.issues.push({
      origin: "number",
      input: s,
      code: "too_small",
      minimum: r,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    }), s > o && a.issues.push({
      origin: "number",
      input: s,
      code: "too_big",
      maximum: o,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    });
  };
}), rf = /* @__PURE__ */ S("$ZodCheckBigIntFormat", (e, t) => {
  ae.init(e, t);
  const [n, i] = td[t.format];
  e._zod.onattach.push((r) => {
    const o = r._zod.bag;
    o.format = t.format, o.minimum = n, o.maximum = i;
  }), e._zod.check = (r) => {
    const o = r.value;
    o < n && r.issues.push({
      origin: "bigint",
      input: o,
      code: "too_small",
      minimum: n,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    }), o > i && r.issues.push({
      origin: "bigint",
      input: o,
      code: "too_big",
      maximum: i,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    });
  };
}), nf = /* @__PURE__ */ S("$ZodCheckMaxSize", (e, t) => {
  var n;
  ae.init(e, t), (n = e._zod.def).when ?? (n.when = (i) => {
    const r = i.value;
    return !Ct(r) && r.size !== void 0;
  }), e._zod.onattach.push((i) => {
    const r = i._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    t.maximum < r && (i._zod.bag.maximum = t.maximum);
  }), e._zod.check = (i) => {
    const r = i.value;
    r.size <= t.maximum || i.issues.push({
      origin: fi(r),
      code: "too_big",
      maximum: t.maximum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), of = /* @__PURE__ */ S("$ZodCheckMinSize", (e, t) => {
  var n;
  ae.init(e, t), (n = e._zod.def).when ?? (n.when = (i) => {
    const r = i.value;
    return !Ct(r) && r.size !== void 0;
  }), e._zod.onattach.push((i) => {
    const r = i._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    t.minimum > r && (i._zod.bag.minimum = t.minimum);
  }), e._zod.check = (i) => {
    const r = i.value;
    r.size >= t.minimum || i.issues.push({
      origin: fi(r),
      code: "too_small",
      minimum: t.minimum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), af = /* @__PURE__ */ S("$ZodCheckSizeEquals", (e, t) => {
  var n;
  ae.init(e, t), (n = e._zod.def).when ?? (n.when = (i) => {
    const r = i.value;
    return !Ct(r) && r.size !== void 0;
  }), e._zod.onattach.push((i) => {
    const r = i._zod.bag;
    r.minimum = t.size, r.maximum = t.size, r.size = t.size;
  }), e._zod.check = (i) => {
    const r = i.value, o = r.size;
    if (o === t.size)
      return;
    const a = o > t.size;
    i.issues.push({
      origin: fi(r),
      ...a ? { code: "too_big", maximum: t.size } : { code: "too_small", minimum: t.size },
      inclusive: !0,
      exact: !0,
      input: i.value,
      inst: e,
      continue: !t.abort
    });
  };
}), sf = /* @__PURE__ */ S("$ZodCheckMaxLength", (e, t) => {
  var n;
  ae.init(e, t), (n = e._zod.def).when ?? (n.when = (i) => {
    const r = i.value;
    return !Ct(r) && r.length !== void 0;
  }), e._zod.onattach.push((i) => {
    const r = i._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    t.maximum < r && (i._zod.bag.maximum = t.maximum);
  }), e._zod.check = (i) => {
    const r = i.value;
    if (r.length <= t.maximum)
      return;
    const a = pi(r);
    i.issues.push({
      origin: a,
      code: "too_big",
      maximum: t.maximum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), uf = /* @__PURE__ */ S("$ZodCheckMinLength", (e, t) => {
  var n;
  ae.init(e, t), (n = e._zod.def).when ?? (n.when = (i) => {
    const r = i.value;
    return !Ct(r) && r.length !== void 0;
  }), e._zod.onattach.push((i) => {
    const r = i._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    t.minimum > r && (i._zod.bag.minimum = t.minimum);
  }), e._zod.check = (i) => {
    const r = i.value;
    if (r.length >= t.minimum)
      return;
    const a = pi(r);
    i.issues.push({
      origin: a,
      code: "too_small",
      minimum: t.minimum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), lf = /* @__PURE__ */ S("$ZodCheckLengthEquals", (e, t) => {
  var n;
  ae.init(e, t), (n = e._zod.def).when ?? (n.when = (i) => {
    const r = i.value;
    return !Ct(r) && r.length !== void 0;
  }), e._zod.onattach.push((i) => {
    const r = i._zod.bag;
    r.minimum = t.length, r.maximum = t.length, r.length = t.length;
  }), e._zod.check = (i) => {
    const r = i.value, o = r.length;
    if (o === t.length)
      return;
    const a = pi(r), s = o > t.length;
    i.issues.push({
      origin: a,
      ...s ? { code: "too_big", maximum: t.length } : { code: "too_small", minimum: t.length },
      inclusive: !0,
      exact: !0,
      input: i.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Rr = /* @__PURE__ */ S("$ZodCheckStringFormat", (e, t) => {
  var n, i;
  ae.init(e, t), e._zod.onattach.push((r) => {
    const o = r._zod.bag;
    o.format = t.format, t.pattern && (o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(t.pattern));
  }), t.pattern ? (n = e._zod).check ?? (n.check = (r) => {
    t.pattern.lastIndex = 0, !t.pattern.test(r.value) && r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: t.format,
      input: r.value,
      ...t.pattern ? { pattern: t.pattern.toString() } : {},
      inst: e,
      continue: !t.abort
    });
  }) : (i = e._zod).check ?? (i.check = () => {
  });
}), cf = /* @__PURE__ */ S("$ZodCheckRegex", (e, t) => {
  Rr.init(e, t), e._zod.check = (n) => {
    t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: n.value,
      pattern: t.pattern.toString(),
      inst: e,
      continue: !t.abort
    });
  };
}), df = /* @__PURE__ */ S("$ZodCheckLowerCase", (e, t) => {
  t.pattern ?? (t.pattern = Kd), Rr.init(e, t);
}), ff = /* @__PURE__ */ S("$ZodCheckUpperCase", (e, t) => {
  t.pattern ?? (t.pattern = Yd), Rr.init(e, t);
}), pf = /* @__PURE__ */ S("$ZodCheckIncludes", (e, t) => {
  ae.init(e, t);
  const n = tt(t.includes), i = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${n}` : n);
  t.pattern = i, e._zod.onattach.push((r) => {
    const o = r._zod.bag;
    o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(i);
  }), e._zod.check = (r) => {
    r.value.includes(t.includes, t.position) || r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: t.includes,
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), hf = /* @__PURE__ */ S("$ZodCheckStartsWith", (e, t) => {
  ae.init(e, t);
  const n = new RegExp(`^${tt(t.prefix)}.*`);
  t.pattern ?? (t.pattern = n), e._zod.onattach.push((i) => {
    const r = i._zod.bag;
    r.patterns ?? (r.patterns = /* @__PURE__ */ new Set()), r.patterns.add(n);
  }), e._zod.check = (i) => {
    i.value.startsWith(t.prefix) || i.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: t.prefix,
      input: i.value,
      inst: e,
      continue: !t.abort
    });
  };
}), mf = /* @__PURE__ */ S("$ZodCheckEndsWith", (e, t) => {
  ae.init(e, t);
  const n = new RegExp(`.*${tt(t.suffix)}$`);
  t.pattern ?? (t.pattern = n), e._zod.onattach.push((i) => {
    const r = i._zod.bag;
    r.patterns ?? (r.patterns = /* @__PURE__ */ new Set()), r.patterns.add(n);
  }), e._zod.check = (i) => {
    i.value.endsWith(t.suffix) || i.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: t.suffix,
      input: i.value,
      inst: e,
      continue: !t.abort
    });
  };
});
function $l(e, t, n) {
  e.issues.length && t.issues.push(...Te(n, e.issues));
}
const gf = /* @__PURE__ */ S("$ZodCheckProperty", (e, t) => {
  ae.init(e, t), e._zod.check = (n) => {
    const i = t.schema._zod.run({
      value: n.value[t.property],
      issues: []
    }, {});
    if (i instanceof Promise)
      return i.then((r) => $l(r, n, t.property));
    $l(i, n, t.property);
  };
}), vf = /* @__PURE__ */ S("$ZodCheckMimeType", (e, t) => {
  ae.init(e, t);
  const n = new Set(t.mime);
  e._zod.onattach.push((i) => {
    i._zod.bag.mime = t.mime;
  }), e._zod.check = (i) => {
    n.has(i.value.type) || i.issues.push({
      code: "invalid_value",
      values: t.mime,
      input: i.value.type,
      inst: e,
      continue: !t.abort
    });
  };
}), $f = /* @__PURE__ */ S("$ZodCheckOverwrite", (e, t) => {
  ae.init(e, t), e._zod.check = (n) => {
    n.value = t.tx(n.value);
  };
});
class _f {
  constructor(t = []) {
    this.content = [], this.indent = 0, this && (this.args = t);
  }
  indented(t) {
    this.indent += 1, t(this), this.indent -= 1;
  }
  write(t) {
    if (typeof t == "function") {
      t(this, { execution: "sync" }), t(this, { execution: "async" });
      return;
    }
    const i = t.split(`
`).filter((a) => a), r = Math.min(...i.map((a) => a.length - a.trimStart().length)), o = i.map((a) => a.slice(r)).map((a) => " ".repeat(this.indent * 2) + a);
    for (const a of o)
      this.content.push(a);
  }
  compile() {
    const t = Function, n = this?.args, r = [...(this?.content ?? [""]).map((o) => `  ${o}`)];
    return new t(...n, r.join(`
`));
  }
}
const yf = {
  major: 4,
  minor: 4,
  patch: 3
}, G = /* @__PURE__ */ S("$ZodType", (e, t) => {
  var n;
  e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = yf;
  const i = [...e._zod.def.checks ?? []];
  e._zod.traits.has("$ZodCheck") && i.unshift(e);
  for (const r of i)
    for (const o of r._zod.onattach)
      o(e);
  if (i.length === 0)
    (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
      e._zod.run = e._zod.parse;
    });
  else {
    const r = (a, s, d) => {
      let p = wt(a), f;
      for (const h of s) {
        if (h._zod.def.when) {
          if (ld(a) || !h._zod.def.when(a))
            continue;
        } else if (p)
          continue;
        const c = a.issues.length, u = h._zod.check(a);
        if (u instanceof Promise && d?.async === !1)
          throw new It();
        if (f || u instanceof Promise)
          f = (f ?? Promise.resolve()).then(async () => {
            await u, a.issues.length !== c && (p || (p = wt(a, c)));
          });
        else {
          if (a.issues.length === c)
            continue;
          p || (p = wt(a, c));
        }
      }
      return f ? f.then(() => a) : a;
    }, o = (a, s, d) => {
      if (wt(a))
        return a.aborted = !0, a;
      const p = r(s, i, d);
      if (p instanceof Promise) {
        if (d.async === !1)
          throw new It();
        return p.then((f) => e._zod.parse(f, d));
      }
      return e._zod.parse(p, d);
    };
    e._zod.run = (a, s) => {
      if (s.skipChecks)
        return e._zod.parse(a, s);
      if (s.direction === "backward") {
        const p = e._zod.parse({ value: a.value, issues: [] }, { ...s, skipChecks: !0 });
        return p instanceof Promise ? p.then((f) => o(f, a, s)) : o(p, a, s);
      }
      const d = e._zod.parse(a, s);
      if (d instanceof Promise) {
        if (s.async === !1)
          throw new It();
        return d.then((p) => r(p, i, s));
      }
      return r(d, i, s);
    };
  }
  J(e, "~standard", () => ({
    validate: (r) => {
      try {
        const o = vd(e, r);
        return o.success ? { value: o.data } : { issues: o.error?.issues };
      } catch {
        return $d(e, r).then((a) => a.success ? { value: a.data } : { issues: a.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  }));
}), Lr = /* @__PURE__ */ S("$ZodString", (e, t) => {
  G.init(e, t), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? Gd(e._zod.bag), e._zod.parse = (n, i) => {
    if (t.coerce)
      try {
        n.value = String(n.value);
      } catch {
      }
    return typeof n.value == "string" || n.issues.push({
      expected: "string",
      code: "invalid_type",
      input: n.value,
      inst: e
    }), n;
  };
}), ee = /* @__PURE__ */ S("$ZodStringFormat", (e, t) => {
  Rr.init(e, t), Lr.init(e, t);
}), bf = /* @__PURE__ */ S("$ZodGUID", (e, t) => {
  t.pattern ?? (t.pattern = xd), ee.init(e, t);
}), Sf = /* @__PURE__ */ S("$ZodUUID", (e, t) => {
  if (t.version) {
    const i = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    }[t.version];
    if (i === void 0)
      throw new Error(`Invalid UUID version: "${t.version}"`);
    t.pattern ?? (t.pattern = Qt(i));
  } else
    t.pattern ?? (t.pattern = Qt());
  ee.init(e, t);
}), kf = /* @__PURE__ */ S("$ZodEmail", (e, t) => {
  t.pattern ?? (t.pattern = Od), ee.init(e, t);
}), wf = /* @__PURE__ */ S("$ZodURL", (e, t) => {
  ee.init(e, t), e._zod.check = (n) => {
    try {
      const i = n.value.trim();
      if (!t.normalize && t.protocol?.source === ia.source && !/^https?:\/\//i.test(i)) {
        n.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid URL format",
          input: n.value,
          inst: e,
          continue: !t.abort
        });
        return;
      }
      const r = new URL(i);
      t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(r.hostname) || n.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid hostname",
        pattern: t.hostname.source,
        input: n.value,
        inst: e,
        continue: !t.abort
      })), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(r.protocol.endsWith(":") ? r.protocol.slice(0, -1) : r.protocol) || n.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid protocol",
        pattern: t.protocol.source,
        input: n.value,
        inst: e,
        continue: !t.abort
      })), t.normalize ? n.value = r.href : n.value = i;
      return;
    } catch {
      n.issues.push({
        code: "invalid_format",
        format: "url",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
}), If = /* @__PURE__ */ S("$ZodEmoji", (e, t) => {
  t.pattern ?? (t.pattern = Pd()), ee.init(e, t);
}), xf = /* @__PURE__ */ S("$ZodNanoID", (e, t) => {
  t.pattern ?? (t.pattern = wd), ee.init(e, t);
}), Of = /* @__PURE__ */ S("$ZodCUID", (e, t) => {
  t.pattern ?? (t.pattern = _d), ee.init(e, t);
}), Ef = /* @__PURE__ */ S("$ZodCUID2", (e, t) => {
  t.pattern ?? (t.pattern = yd), ee.init(e, t);
}), Pf = /* @__PURE__ */ S("$ZodULID", (e, t) => {
  t.pattern ?? (t.pattern = bd), ee.init(e, t);
}), Nf = /* @__PURE__ */ S("$ZodXID", (e, t) => {
  t.pattern ?? (t.pattern = Sd), ee.init(e, t);
}), Tf = /* @__PURE__ */ S("$ZodKSUID", (e, t) => {
  t.pattern ?? (t.pattern = kd), ee.init(e, t);
}), zf = /* @__PURE__ */ S("$ZodISODateTime", (e, t) => {
  t.pattern ?? (t.pattern = Bd(t)), ee.init(e, t);
}), Af = /* @__PURE__ */ S("$ZodISODate", (e, t) => {
  t.pattern ?? (t.pattern = Md), ee.init(e, t);
}), Df = /* @__PURE__ */ S("$ZodISOTime", (e, t) => {
  t.pattern ?? (t.pattern = Fd(t)), ee.init(e, t);
}), Cf = /* @__PURE__ */ S("$ZodISODuration", (e, t) => {
  t.pattern ?? (t.pattern = Id), ee.init(e, t);
}), Uf = /* @__PURE__ */ S("$ZodIPv4", (e, t) => {
  t.pattern ?? (t.pattern = Nd), ee.init(e, t), e._zod.bag.format = "ipv4";
}), Rf = /* @__PURE__ */ S("$ZodIPv6", (e, t) => {
  t.pattern ?? (t.pattern = Td), ee.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
    try {
      new URL(`http://[${n.value}]`);
    } catch {
      n.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
}), Lf = /* @__PURE__ */ S("$ZodMAC", (e, t) => {
  t.pattern ?? (t.pattern = zd(t.delimiter)), ee.init(e, t), e._zod.bag.format = "mac";
}), jf = /* @__PURE__ */ S("$ZodCIDRv4", (e, t) => {
  t.pattern ?? (t.pattern = Ad), ee.init(e, t);
}), Mf = /* @__PURE__ */ S("$ZodCIDRv6", (e, t) => {
  t.pattern ?? (t.pattern = Dd), ee.init(e, t), e._zod.check = (n) => {
    const i = n.value.split("/");
    try {
      if (i.length !== 2)
        throw new Error();
      const [r, o] = i;
      if (!o)
        throw new Error();
      const a = Number(o);
      if (`${a}` !== o)
        throw new Error();
      if (a < 0 || a > 128)
        throw new Error();
      new URL(`http://[${r}]`);
    } catch {
      n.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
});
function la(e) {
  if (e === "")
    return !0;
  if (/\s/.test(e) || e.length % 4 !== 0)
    return !1;
  try {
    return atob(e), !0;
  } catch {
    return !1;
  }
}
const Zf = /* @__PURE__ */ S("$ZodBase64", (e, t) => {
  t.pattern ?? (t.pattern = Cd), ee.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
    la(n.value) || n.issues.push({
      code: "invalid_format",
      format: "base64",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
});
function Ff(e) {
  if (!na.test(e))
    return !1;
  const t = e.replace(/[-_]/g, (i) => i === "-" ? "+" : "/"), n = t.padEnd(Math.ceil(t.length / 4) * 4, "=");
  return la(n);
}
const Bf = /* @__PURE__ */ S("$ZodBase64URL", (e, t) => {
  t.pattern ?? (t.pattern = na), ee.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
    Ff(n.value) || n.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Gf = /* @__PURE__ */ S("$ZodE164", (e, t) => {
  t.pattern ?? (t.pattern = Ld), ee.init(e, t);
});
function Hf(e, t = null) {
  try {
    const n = e.split(".");
    if (n.length !== 3)
      return !1;
    const [i] = n;
    if (!i)
      return !1;
    const r = JSON.parse(atob(i));
    return !("typ" in r && r?.typ !== "JWT" || !r.alg || t && (!("alg" in r) || r.alg !== t));
  } catch {
    return !1;
  }
}
const Jf = /* @__PURE__ */ S("$ZodJWT", (e, t) => {
  ee.init(e, t), e._zod.check = (n) => {
    Hf(n.value, t.alg) || n.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Vf = /* @__PURE__ */ S("$ZodCustomStringFormat", (e, t) => {
  ee.init(e, t), e._zod.check = (n) => {
    t.fn(n.value) || n.issues.push({
      code: "invalid_format",
      format: t.format,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), ca = /* @__PURE__ */ S("$ZodNumber", (e, t) => {
  G.init(e, t), e._zod.pattern = e._zod.bag.pattern ?? oa, e._zod.parse = (n, i) => {
    if (t.coerce)
      try {
        n.value = Number(n.value);
      } catch {
      }
    const r = n.value;
    if (typeof r == "number" && !Number.isNaN(r) && Number.isFinite(r))
      return n;
    const o = typeof r == "number" ? Number.isNaN(r) ? "NaN" : Number.isFinite(r) ? void 0 : "Infinity" : void 0;
    return n.issues.push({
      expected: "number",
      code: "invalid_type",
      input: r,
      inst: e,
      ...o ? { received: o } : {}
    }), n;
  };
}), qf = /* @__PURE__ */ S("$ZodNumberFormat", (e, t) => {
  tf.init(e, t), ca.init(e, t);
}), da = /* @__PURE__ */ S("$ZodBoolean", (e, t) => {
  G.init(e, t), e._zod.pattern = Vd, e._zod.parse = (n, i) => {
    if (t.coerce)
      try {
        n.value = !!n.value;
      } catch {
      }
    const r = n.value;
    return typeof r == "boolean" || n.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), fa = /* @__PURE__ */ S("$ZodBigInt", (e, t) => {
  G.init(e, t), e._zod.pattern = Hd, e._zod.parse = (n, i) => {
    if (t.coerce)
      try {
        n.value = BigInt(n.value);
      } catch {
      }
    return typeof n.value == "bigint" || n.issues.push({
      expected: "bigint",
      code: "invalid_type",
      input: n.value,
      inst: e
    }), n;
  };
}), Wf = /* @__PURE__ */ S("$ZodBigIntFormat", (e, t) => {
  rf.init(e, t), fa.init(e, t);
}), Kf = /* @__PURE__ */ S("$ZodSymbol", (e, t) => {
  G.init(e, t), e._zod.parse = (n, i) => {
    const r = n.value;
    return typeof r == "symbol" || n.issues.push({
      expected: "symbol",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), Yf = /* @__PURE__ */ S("$ZodUndefined", (e, t) => {
  G.init(e, t), e._zod.pattern = Wd, e._zod.values = /* @__PURE__ */ new Set([void 0]), e._zod.parse = (n, i) => {
    const r = n.value;
    return typeof r > "u" || n.issues.push({
      expected: "undefined",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), Xf = /* @__PURE__ */ S("$ZodNull", (e, t) => {
  G.init(e, t), e._zod.pattern = qd, e._zod.values = /* @__PURE__ */ new Set([null]), e._zod.parse = (n, i) => {
    const r = n.value;
    return r === null || n.issues.push({
      expected: "null",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), Qf = /* @__PURE__ */ S("$ZodAny", (e, t) => {
  G.init(e, t), e._zod.parse = (n) => n;
}), ep = /* @__PURE__ */ S("$ZodUnknown", (e, t) => {
  G.init(e, t), e._zod.parse = (n) => n;
}), tp = /* @__PURE__ */ S("$ZodNever", (e, t) => {
  G.init(e, t), e._zod.parse = (n, i) => (n.issues.push({
    expected: "never",
    code: "invalid_type",
    input: n.value,
    inst: e
  }), n);
}), rp = /* @__PURE__ */ S("$ZodVoid", (e, t) => {
  G.init(e, t), e._zod.parse = (n, i) => {
    const r = n.value;
    return typeof r > "u" || n.issues.push({
      expected: "void",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), np = /* @__PURE__ */ S("$ZodDate", (e, t) => {
  G.init(e, t), e._zod.parse = (n, i) => {
    if (t.coerce)
      try {
        n.value = new Date(n.value);
      } catch {
      }
    const r = n.value, o = r instanceof Date;
    return o && !Number.isNaN(r.getTime()) || n.issues.push({
      expected: "date",
      code: "invalid_type",
      input: r,
      ...o ? { received: "Invalid Date" } : {},
      inst: e
    }), n;
  };
});
function _l(e, t, n) {
  e.issues.length && t.issues.push(...Te(n, e.issues)), t.value[n] = e.value;
}
const ip = /* @__PURE__ */ S("$ZodArray", (e, t) => {
  G.init(e, t), e._zod.parse = (n, i) => {
    const r = n.value;
    if (!Array.isArray(r))
      return n.issues.push({
        expected: "array",
        code: "invalid_type",
        input: r,
        inst: e
      }), n;
    n.value = Array(r.length);
    const o = [];
    for (let a = 0; a < r.length; a++) {
      const s = r[a], d = t.element._zod.run({
        value: s,
        issues: []
      }, i);
      d instanceof Promise ? o.push(d.then((p) => _l(p, n, a))) : _l(d, n, a);
    }
    return o.length ? Promise.all(o).then(() => n) : n;
  };
});
function Wn(e, t, n, i, r, o) {
  const a = n in i;
  if (e.issues.length) {
    if (r && o && !a)
      return;
    t.issues.push(...Te(n, e.issues));
  }
  if (!a && !r) {
    e.issues.length || t.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: void 0,
      path: [n]
    });
    return;
  }
  e.value === void 0 ? a && (t.value[n] = void 0) : t.value[n] = e.value;
}
function op(e) {
  const t = Object.keys(e.shape);
  for (const i of t)
    if (!e.shape?.[i]?._zod?.traits?.has("$ZodType"))
      throw new Error(`Invalid element at key "${i}": expected a Zod schema`);
  const n = Qc(e.shape);
  return {
    ...e,
    keys: t,
    keySet: new Set(t),
    numKeys: t.length,
    optionalKeys: new Set(n)
  };
}
function ap(e, t, n, i, r, o) {
  const a = [], s = r.keySet, d = r.catchall._zod, p = d.def.type, f = d.optin === "optional", h = d.optout === "optional";
  for (const c in t) {
    if (c === "__proto__" || s.has(c))
      continue;
    if (p === "never") {
      a.push(c);
      continue;
    }
    const u = d.run({ value: t[c], issues: [] }, i);
    u instanceof Promise ? e.push(u.then((l) => Wn(l, n, c, t, f, h))) : Wn(u, n, c, t, f, h);
  }
  return a.length && n.issues.push({
    code: "unrecognized_keys",
    keys: a,
    input: t,
    inst: o
  }), e.length ? Promise.all(e).then(() => n) : n;
}
const sp = /* @__PURE__ */ S("$ZodObject", (e, t) => {
  if (G.init(e, t), !Object.getOwnPropertyDescriptor(t, "shape")?.get) {
    const s = t.shape;
    Object.defineProperty(t, "shape", {
      get: () => {
        const d = { ...s };
        return Object.defineProperty(t, "shape", {
          value: d
        }), d;
      }
    });
  }
  const i = Nr(() => op(t));
  J(e._zod, "propValues", () => {
    const s = t.shape, d = {};
    for (const p in s) {
      const f = s[p]._zod;
      if (f.values) {
        d[p] ?? (d[p] = /* @__PURE__ */ new Set());
        for (const h of f.values)
          d[p].add(h);
      }
    }
    return d;
  });
  const r = Yt, o = t.catchall;
  let a;
  e._zod.parse = (s, d) => {
    a ?? (a = i.value);
    const p = s.value;
    if (!r(p))
      return s.issues.push({
        expected: "object",
        code: "invalid_type",
        input: p,
        inst: e
      }), s;
    s.value = {};
    const f = [], h = a.shape;
    for (const c of a.keys) {
      const u = h[c], l = u._zod.optin === "optional", m = u._zod.optout === "optional", g = u._zod.run({ value: p[c], issues: [] }, d);
      g instanceof Promise ? f.push(g.then((v) => Wn(v, s, c, p, l, m))) : Wn(g, s, c, p, l, m);
    }
    return o ? ap(f, p, s, d, i.value, e) : f.length ? Promise.all(f).then(() => s) : s;
  };
}), up = /* @__PURE__ */ S("$ZodObjectJIT", (e, t) => {
  sp.init(e, t);
  const n = e._zod.parse, i = Nr(() => op(t)), r = (c) => {
    const u = new _f(["shape", "payload", "ctx"]), l = i.value, m = (x) => {
      const y = ko(x);
      return `shape[${y}]._zod.run({ value: input[${y}], issues: [] }, ctx)`;
    };
    u.write("const input = payload.value;");
    const g = /* @__PURE__ */ Object.create(null);
    let v = 0;
    for (const x of l.keys)
      g[x] = `key_${v++}`;
    u.write("const newResult = {};");
    for (const x of l.keys) {
      const y = g[x], $ = ko(x), O = c[x], I = O?._zod?.optin === "optional", D = O?._zod?.optout === "optional";
      u.write(`const ${y} = ${m(x)};`), I && D ? u.write(`
        if (${y}.issues.length) {
          if (${$} in input) {
            payload.issues = payload.issues.concat(${y}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${$}, ...iss.path] : [${$}]
            })));
          }
        }
        
        if (${y}.value === undefined) {
          if (${$} in input) {
            newResult[${$}] = undefined;
          }
        } else {
          newResult[${$}] = ${y}.value;
        }
        
      `) : I ? u.write(`
        if (${y}.issues.length) {
          payload.issues = payload.issues.concat(${y}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${$}, ...iss.path] : [${$}]
          })));
        }
        
        if (${y}.value === undefined) {
          if (${$} in input) {
            newResult[${$}] = undefined;
          }
        } else {
          newResult[${$}] = ${y}.value;
        }
        
      `) : u.write(`
        const ${y}_present = ${$} in input;
        if (${y}.issues.length) {
          payload.issues = payload.issues.concat(${y}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${$}, ...iss.path] : [${$}]
          })));
        }
        if (!${y}_present && !${y}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${$}]
          });
        }

        if (${y}_present) {
          if (${y}.value === undefined) {
            newResult[${$}] = undefined;
          } else {
            newResult[${$}] = ${y}.value;
          }
        }

      `);
    }
    u.write("payload.value = newResult;"), u.write("return payload;");
    const _ = u.compile();
    return (x, y) => _(c, x, y);
  };
  let o;
  const a = Yt, s = !Sr.jitless, p = s && Yc.value, f = t.catchall;
  let h;
  e._zod.parse = (c, u) => {
    h ?? (h = i.value);
    const l = c.value;
    return a(l) ? s && p && u?.async === !1 && u.jitless !== !0 ? (o || (o = r(t.shape)), c = o(c, u), f ? ap([], l, c, u, h, e) : c) : n(c, u) : (c.issues.push({
      expected: "object",
      code: "invalid_type",
      input: l,
      inst: e
    }), c);
  };
});
function yl(e, t, n, i) {
  for (const o of e)
    if (o.issues.length === 0)
      return t.value = o.value, t;
  const r = e.filter((o) => !wt(o));
  return r.length === 1 ? (t.value = r[0].value, r[0]) : (t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: e.map((o) => o.issues.map((a) => xe(a, i, pe())))
  }), t);
}
const hi = /* @__PURE__ */ S("$ZodUnion", (e, t) => {
  G.init(e, t), J(e._zod, "optin", () => t.options.some((i) => i._zod.optin === "optional") ? "optional" : void 0), J(e._zod, "optout", () => t.options.some((i) => i._zod.optout === "optional") ? "optional" : void 0), J(e._zod, "values", () => {
    if (t.options.every((i) => i._zod.values))
      return new Set(t.options.flatMap((i) => Array.from(i._zod.values)));
  }), J(e._zod, "pattern", () => {
    if (t.options.every((i) => i._zod.pattern)) {
      const i = t.options.map((r) => r._zod.pattern);
      return new RegExp(`^(${i.map((r) => ci(r.source)).join("|")})$`);
    }
  });
  const n = t.options.length === 1 ? t.options[0]._zod.run : null;
  e._zod.parse = (i, r) => {
    if (n)
      return n(i, r);
    let o = !1;
    const a = [];
    for (const s of t.options) {
      const d = s._zod.run({
        value: i.value,
        issues: []
      }, r);
      if (d instanceof Promise)
        a.push(d), o = !0;
      else {
        if (d.issues.length === 0)
          return d;
        a.push(d);
      }
    }
    return o ? Promise.all(a).then((s) => yl(s, i, e, r)) : yl(a, i, e, r);
  };
});
function bl(e, t, n, i) {
  const r = e.filter((o) => o.issues.length === 0);
  return r.length === 1 ? (t.value = r[0].value, t) : (r.length === 0 ? t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: e.map((o) => o.issues.map((a) => xe(a, i, pe())))
  }) : t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: [],
    inclusive: !1
  }), t);
}
const lp = /* @__PURE__ */ S("$ZodXor", (e, t) => {
  hi.init(e, t), t.inclusive = !1;
  const n = t.options.length === 1 ? t.options[0]._zod.run : null;
  e._zod.parse = (i, r) => {
    if (n)
      return n(i, r);
    let o = !1;
    const a = [];
    for (const s of t.options) {
      const d = s._zod.run({
        value: i.value,
        issues: []
      }, r);
      d instanceof Promise ? (a.push(d), o = !0) : a.push(d);
    }
    return o ? Promise.all(a).then((s) => bl(s, i, e, r)) : bl(a, i, e, r);
  };
}), cp = /* @__PURE__ */ S("$ZodDiscriminatedUnion", (e, t) => {
  t.inclusive = !1, hi.init(e, t);
  const n = e._zod.parse;
  J(e._zod, "propValues", () => {
    const r = {};
    for (const o of t.options) {
      const a = o._zod.propValues;
      if (!a || Object.keys(a).length === 0)
        throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(o)}"`);
      for (const [s, d] of Object.entries(a)) {
        r[s] || (r[s] = /* @__PURE__ */ new Set());
        for (const p of d)
          r[s].add(p);
      }
    }
    return r;
  });
  const i = Nr(() => {
    const r = t.options, o = /* @__PURE__ */ new Map();
    for (const a of r) {
      const s = a._zod.propValues?.[t.discriminator];
      if (!s || s.size === 0)
        throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(a)}"`);
      for (const d of s) {
        if (o.has(d))
          throw new Error(`Duplicate discriminator value "${String(d)}"`);
        o.set(d, a);
      }
    }
    return o;
  });
  e._zod.parse = (r, o) => {
    const a = r.value;
    if (!Yt(a))
      return r.issues.push({
        code: "invalid_type",
        expected: "object",
        input: a,
        inst: e
      }), r;
    const s = i.value.get(a?.[t.discriminator]);
    return s ? s._zod.run(r, o) : t.unionFallback || o.direction === "backward" ? n(r, o) : (r.issues.push({
      code: "invalid_union",
      errors: [],
      note: "No matching discriminator",
      discriminator: t.discriminator,
      options: Array.from(i.value.keys()),
      input: a,
      path: [t.discriminator],
      inst: e
    }), r);
  };
}), dp = /* @__PURE__ */ S("$ZodIntersection", (e, t) => {
  G.init(e, t), e._zod.parse = (n, i) => {
    const r = n.value, o = t.left._zod.run({ value: r, issues: [] }, i), a = t.right._zod.run({ value: r, issues: [] }, i);
    return o instanceof Promise || a instanceof Promise ? Promise.all([o, a]).then(([d, p]) => Sl(n, d, p)) : Sl(n, o, a);
  };
});
function xo(e, t) {
  if (e === t)
    return { valid: !0, data: e };
  if (e instanceof Date && t instanceof Date && +e == +t)
    return { valid: !0, data: e };
  if (Ot(e) && Ot(t)) {
    const n = Object.keys(t), i = Object.keys(e).filter((o) => n.indexOf(o) !== -1), r = { ...e, ...t };
    for (const o of i) {
      const a = xo(e[o], t[o]);
      if (!a.valid)
        return {
          valid: !1,
          mergeErrorPath: [o, ...a.mergeErrorPath]
        };
      r[o] = a.data;
    }
    return { valid: !0, data: r };
  }
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length)
      return { valid: !1, mergeErrorPath: [] };
    const n = [];
    for (let i = 0; i < e.length; i++) {
      const r = e[i], o = t[i], a = xo(r, o);
      if (!a.valid)
        return {
          valid: !1,
          mergeErrorPath: [i, ...a.mergeErrorPath]
        };
      n.push(a.data);
    }
    return { valid: !0, data: n };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function Sl(e, t, n) {
  const i = /* @__PURE__ */ new Map();
  let r;
  for (const s of t.issues)
    if (s.code === "unrecognized_keys") {
      r ?? (r = s);
      for (const d of s.keys)
        i.has(d) || i.set(d, {}), i.get(d).l = !0;
    } else
      e.issues.push(s);
  for (const s of n.issues)
    if (s.code === "unrecognized_keys")
      for (const d of s.keys)
        i.has(d) || i.set(d, {}), i.get(d).r = !0;
    else
      e.issues.push(s);
  const o = [...i].filter(([, s]) => s.l && s.r).map(([s]) => s);
  if (o.length && r && e.issues.push({ ...r, keys: o }), wt(e))
    return e;
  const a = xo(t.value, n.value);
  if (!a.valid)
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(a.mergeErrorPath)}`);
  return e.value = a.data, e;
}
const pa = /* @__PURE__ */ S("$ZodTuple", (e, t) => {
  G.init(e, t);
  const n = t.items;
  e._zod.parse = (i, r) => {
    const o = i.value;
    if (!Array.isArray(o))
      return i.issues.push({
        input: o,
        inst: e,
        expected: "tuple",
        code: "invalid_type"
      }), i;
    i.value = [];
    const a = [], s = kl(n, "optin"), d = kl(n, "optout");
    if (!t.rest) {
      if (o.length < s)
        return i.issues.push({
          code: "too_small",
          minimum: s,
          inclusive: !0,
          input: o,
          inst: e,
          origin: "array"
        }), i;
      o.length > n.length && i.issues.push({
        code: "too_big",
        maximum: n.length,
        inclusive: !0,
        input: o,
        inst: e,
        origin: "array"
      });
    }
    const p = new Array(n.length);
    for (let f = 0; f < n.length; f++) {
      const h = n[f]._zod.run({ value: o[f], issues: [] }, r);
      h instanceof Promise ? a.push(h.then((c) => {
        p[f] = c;
      })) : p[f] = h;
    }
    if (t.rest) {
      let f = n.length - 1;
      const h = o.slice(n.length);
      for (const c of h) {
        f++;
        const u = t.rest._zod.run({ value: c, issues: [] }, r);
        u instanceof Promise ? a.push(u.then((l) => wl(l, i, f))) : wl(u, i, f);
      }
    }
    return a.length ? Promise.all(a).then(() => Il(p, i, n, o, d)) : Il(p, i, n, o, d);
  };
});
function kl(e, t) {
  for (let n = e.length - 1; n >= 0; n--)
    if (e[n]._zod[t] !== "optional")
      return n + 1;
  return 0;
}
function wl(e, t, n) {
  e.issues.length && t.issues.push(...Te(n, e.issues)), t.value[n] = e.value;
}
function Il(e, t, n, i, r) {
  for (let o = 0; o < n.length; o++) {
    const a = e[o], s = o < i.length;
    if (a.issues.length) {
      if (!s && o >= r) {
        t.value.length = o;
        break;
      }
      t.issues.push(...Te(o, a.issues));
    }
    t.value[o] = a.value;
  }
  for (let o = t.value.length - 1; o >= i.length && (n[o]._zod.optout === "optional" && t.value[o] === void 0); o--)
    t.value.length = o;
  return t;
}
const fp = /* @__PURE__ */ S("$ZodRecord", (e, t) => {
  G.init(e, t), e._zod.parse = (n, i) => {
    const r = n.value;
    if (!Ot(r))
      return n.issues.push({
        expected: "record",
        code: "invalid_type",
        input: r,
        inst: e
      }), n;
    const o = [], a = t.keyType._zod.values;
    if (a) {
      n.value = {};
      const s = /* @__PURE__ */ new Set();
      for (const p of a)
        if (typeof p == "string" || typeof p == "number" || typeof p == "symbol") {
          s.add(typeof p == "number" ? p.toString() : p);
          const f = t.keyType._zod.run({ value: p, issues: [] }, i);
          if (f instanceof Promise)
            throw new Error("Async schemas not supported in object keys currently");
          if (f.issues.length) {
            n.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: f.issues.map((u) => xe(u, i, pe())),
              input: p,
              path: [p],
              inst: e
            });
            continue;
          }
          const h = f.value, c = t.valueType._zod.run({ value: r[p], issues: [] }, i);
          c instanceof Promise ? o.push(c.then((u) => {
            u.issues.length && n.issues.push(...Te(p, u.issues)), n.value[h] = u.value;
          })) : (c.issues.length && n.issues.push(...Te(p, c.issues)), n.value[h] = c.value);
        }
      let d;
      for (const p in r)
        s.has(p) || (d = d ?? [], d.push(p));
      d && d.length > 0 && n.issues.push({
        code: "unrecognized_keys",
        input: r,
        inst: e,
        keys: d
      });
    } else {
      n.value = {};
      for (const s of Reflect.ownKeys(r)) {
        if (s === "__proto__" || !Object.prototype.propertyIsEnumerable.call(r, s))
          continue;
        let d = t.keyType._zod.run({ value: s, issues: [] }, i);
        if (d instanceof Promise)
          throw new Error("Async schemas not supported in object keys currently");
        if (typeof s == "string" && oa.test(s) && d.issues.length) {
          const h = t.keyType._zod.run({ value: Number(s), issues: [] }, i);
          if (h instanceof Promise)
            throw new Error("Async schemas not supported in object keys currently");
          h.issues.length === 0 && (d = h);
        }
        if (d.issues.length) {
          t.mode === "loose" ? n.value[s] = r[s] : n.issues.push({
            code: "invalid_key",
            origin: "record",
            issues: d.issues.map((h) => xe(h, i, pe())),
            input: s,
            path: [s],
            inst: e
          });
          continue;
        }
        const f = t.valueType._zod.run({ value: r[s], issues: [] }, i);
        f instanceof Promise ? o.push(f.then((h) => {
          h.issues.length && n.issues.push(...Te(s, h.issues)), n.value[d.value] = h.value;
        })) : (f.issues.length && n.issues.push(...Te(s, f.issues)), n.value[d.value] = f.value);
      }
    }
    return o.length ? Promise.all(o).then(() => n) : n;
  };
}), pp = /* @__PURE__ */ S("$ZodMap", (e, t) => {
  G.init(e, t), e._zod.parse = (n, i) => {
    const r = n.value;
    if (!(r instanceof Map))
      return n.issues.push({
        expected: "map",
        code: "invalid_type",
        input: r,
        inst: e
      }), n;
    const o = [];
    n.value = /* @__PURE__ */ new Map();
    for (const [a, s] of r) {
      const d = t.keyType._zod.run({ value: a, issues: [] }, i), p = t.valueType._zod.run({ value: s, issues: [] }, i);
      d instanceof Promise || p instanceof Promise ? o.push(Promise.all([d, p]).then(([f, h]) => {
        xl(f, h, n, a, r, e, i);
      })) : xl(d, p, n, a, r, e, i);
    }
    return o.length ? Promise.all(o).then(() => n) : n;
  };
});
function xl(e, t, n, i, r, o, a) {
  e.issues.length && (qn.has(typeof i) ? n.issues.push(...Te(i, e.issues)) : n.issues.push({
    code: "invalid_key",
    origin: "map",
    input: r,
    inst: o,
    issues: e.issues.map((s) => xe(s, a, pe()))
  })), t.issues.length && (qn.has(typeof i) ? n.issues.push(...Te(i, t.issues)) : n.issues.push({
    origin: "map",
    code: "invalid_element",
    input: r,
    inst: o,
    key: i,
    issues: t.issues.map((s) => xe(s, a, pe()))
  })), n.value.set(e.value, t.value);
}
const hp = /* @__PURE__ */ S("$ZodSet", (e, t) => {
  G.init(e, t), e._zod.parse = (n, i) => {
    const r = n.value;
    if (!(r instanceof Set))
      return n.issues.push({
        input: r,
        inst: e,
        expected: "set",
        code: "invalid_type"
      }), n;
    const o = [];
    n.value = /* @__PURE__ */ new Set();
    for (const a of r) {
      const s = t.valueType._zod.run({ value: a, issues: [] }, i);
      s instanceof Promise ? o.push(s.then((d) => Ol(d, n))) : Ol(s, n);
    }
    return o.length ? Promise.all(o).then(() => n) : n;
  };
});
function Ol(e, t) {
  e.issues.length && t.issues.push(...e.issues), t.value.add(e.value);
}
const mp = /* @__PURE__ */ S("$ZodEnum", (e, t) => {
  G.init(e, t);
  const n = Go(t.entries), i = new Set(n);
  e._zod.values = i, e._zod.pattern = new RegExp(`^(${n.filter((r) => qn.has(typeof r)).map((r) => typeof r == "string" ? tt(r) : r.toString()).join("|")})$`), e._zod.parse = (r, o) => {
    const a = r.value;
    return i.has(a) || r.issues.push({
      code: "invalid_value",
      values: n,
      input: a,
      inst: e
    }), r;
  };
}), gp = /* @__PURE__ */ S("$ZodLiteral", (e, t) => {
  if (G.init(e, t), t.values.length === 0)
    throw new Error("Cannot create literal schema with no valid values");
  const n = new Set(t.values);
  e._zod.values = n, e._zod.pattern = new RegExp(`^(${t.values.map((i) => typeof i == "string" ? tt(i) : i ? tt(i.toString()) : String(i)).join("|")})$`), e._zod.parse = (i, r) => {
    const o = i.value;
    return n.has(o) || i.issues.push({
      code: "invalid_value",
      values: t.values,
      input: o,
      inst: e
    }), i;
  };
}), vp = /* @__PURE__ */ S("$ZodFile", (e, t) => {
  G.init(e, t), e._zod.parse = (n, i) => {
    const r = n.value;
    return r instanceof File || n.issues.push({
      expected: "file",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), $p = /* @__PURE__ */ S("$ZodTransform", (e, t) => {
  G.init(e, t), e._zod.optin = "optional", e._zod.parse = (n, i) => {
    if (i.direction === "backward")
      throw new li(e.constructor.name);
    const r = t.transform(n.value, n);
    if (i.async)
      return (r instanceof Promise ? r : Promise.resolve(r)).then((a) => (n.value = a, n.fallback = !0, n));
    if (r instanceof Promise)
      throw new It();
    return n.value = r, n.fallback = !0, n;
  };
});
function El(e, t) {
  return t === void 0 && (e.issues.length || e.fallback) ? { issues: [], value: void 0 } : e;
}
const ha = /* @__PURE__ */ S("$ZodOptional", (e, t) => {
  G.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", J(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, void 0]) : void 0), J(e._zod, "pattern", () => {
    const n = t.innerType._zod.pattern;
    return n ? new RegExp(`^(${ci(n.source)})?$`) : void 0;
  }), e._zod.parse = (n, i) => {
    if (t.innerType._zod.optin === "optional") {
      const r = n.value, o = t.innerType._zod.run(n, i);
      return o instanceof Promise ? o.then((a) => El(a, r)) : El(o, r);
    }
    return n.value === void 0 ? n : t.innerType._zod.run(n, i);
  };
}), _p = /* @__PURE__ */ S("$ZodExactOptional", (e, t) => {
  ha.init(e, t), J(e._zod, "values", () => t.innerType._zod.values), J(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (n, i) => t.innerType._zod.run(n, i);
}), yp = /* @__PURE__ */ S("$ZodNullable", (e, t) => {
  G.init(e, t), J(e._zod, "optin", () => t.innerType._zod.optin), J(e._zod, "optout", () => t.innerType._zod.optout), J(e._zod, "pattern", () => {
    const n = t.innerType._zod.pattern;
    return n ? new RegExp(`^(${ci(n.source)}|null)$`) : void 0;
  }), J(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (n, i) => n.value === null ? n : t.innerType._zod.run(n, i);
}), bp = /* @__PURE__ */ S("$ZodDefault", (e, t) => {
  G.init(e, t), e._zod.optin = "optional", J(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, i) => {
    if (i.direction === "backward")
      return t.innerType._zod.run(n, i);
    if (n.value === void 0)
      return n.value = t.defaultValue, n;
    const r = t.innerType._zod.run(n, i);
    return r instanceof Promise ? r.then((o) => Pl(o, t)) : Pl(r, t);
  };
});
function Pl(e, t) {
  return e.value === void 0 && (e.value = t.defaultValue), e;
}
const Sp = /* @__PURE__ */ S("$ZodPrefault", (e, t) => {
  G.init(e, t), e._zod.optin = "optional", J(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, i) => (i.direction === "backward" || n.value === void 0 && (n.value = t.defaultValue), t.innerType._zod.run(n, i));
}), kp = /* @__PURE__ */ S("$ZodNonOptional", (e, t) => {
  G.init(e, t), J(e._zod, "values", () => {
    const n = t.innerType._zod.values;
    return n ? new Set([...n].filter((i) => i !== void 0)) : void 0;
  }), e._zod.parse = (n, i) => {
    const r = t.innerType._zod.run(n, i);
    return r instanceof Promise ? r.then((o) => Nl(o, e)) : Nl(r, e);
  };
});
function Nl(e, t) {
  return !e.issues.length && e.value === void 0 && e.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: e.value,
    inst: t
  }), e;
}
const wp = /* @__PURE__ */ S("$ZodSuccess", (e, t) => {
  G.init(e, t), e._zod.parse = (n, i) => {
    if (i.direction === "backward")
      throw new li("ZodSuccess");
    const r = t.innerType._zod.run(n, i);
    return r instanceof Promise ? r.then((o) => (n.value = o.issues.length === 0, n)) : (n.value = r.issues.length === 0, n);
  };
}), Ip = /* @__PURE__ */ S("$ZodCatch", (e, t) => {
  G.init(e, t), e._zod.optin = "optional", J(e._zod, "optout", () => t.innerType._zod.optout), J(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, i) => {
    if (i.direction === "backward")
      return t.innerType._zod.run(n, i);
    const r = t.innerType._zod.run(n, i);
    return r instanceof Promise ? r.then((o) => (n.value = o.value, o.issues.length && (n.value = t.catchValue({
      ...n,
      error: {
        issues: o.issues.map((a) => xe(a, i, pe()))
      },
      input: n.value
    }), n.issues = [], n.fallback = !0), n)) : (n.value = r.value, r.issues.length && (n.value = t.catchValue({
      ...n,
      error: {
        issues: r.issues.map((o) => xe(o, i, pe()))
      },
      input: n.value
    }), n.issues = [], n.fallback = !0), n);
  };
}), xp = /* @__PURE__ */ S("$ZodNaN", (e, t) => {
  G.init(e, t), e._zod.parse = (n, i) => ((typeof n.value != "number" || !Number.isNaN(n.value)) && n.issues.push({
    input: n.value,
    inst: e,
    expected: "nan",
    code: "invalid_type"
  }), n);
}), ma = /* @__PURE__ */ S("$ZodPipe", (e, t) => {
  G.init(e, t), J(e._zod, "values", () => t.in._zod.values), J(e._zod, "optin", () => t.in._zod.optin), J(e._zod, "optout", () => t.out._zod.optout), J(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (n, i) => {
    if (i.direction === "backward") {
      const o = t.out._zod.run(n, i);
      return o instanceof Promise ? o.then((a) => Nn(a, t.in, i)) : Nn(o, t.in, i);
    }
    const r = t.in._zod.run(n, i);
    return r instanceof Promise ? r.then((o) => Nn(o, t.out, i)) : Nn(r, t.out, i);
  };
});
function Nn(e, t, n) {
  return e.issues.length ? (e.aborted = !0, e) : t._zod.run({ value: e.value, issues: e.issues, fallback: e.fallback }, n);
}
const ga = /* @__PURE__ */ S("$ZodCodec", (e, t) => {
  G.init(e, t), J(e._zod, "values", () => t.in._zod.values), J(e._zod, "optin", () => t.in._zod.optin), J(e._zod, "optout", () => t.out._zod.optout), J(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (n, i) => {
    if ((i.direction || "forward") === "forward") {
      const o = t.in._zod.run(n, i);
      return o instanceof Promise ? o.then((a) => Tn(a, t, i)) : Tn(o, t, i);
    } else {
      const o = t.out._zod.run(n, i);
      return o instanceof Promise ? o.then((a) => Tn(a, t, i)) : Tn(o, t, i);
    }
  };
});
function Tn(e, t, n) {
  if (e.issues.length)
    return e.aborted = !0, e;
  if ((n.direction || "forward") === "forward") {
    const r = t.transform(e.value, e);
    return r instanceof Promise ? r.then((o) => zn(e, o, t.out, n)) : zn(e, r, t.out, n);
  } else {
    const r = t.reverseTransform(e.value, e);
    return r instanceof Promise ? r.then((o) => zn(e, o, t.in, n)) : zn(e, r, t.in, n);
  }
}
function zn(e, t, n, i) {
  return e.issues.length ? (e.aborted = !0, e) : n._zod.run({ value: t, issues: e.issues }, i);
}
const Op = /* @__PURE__ */ S("$ZodPreprocess", (e, t) => {
  ma.init(e, t);
}), Ep = /* @__PURE__ */ S("$ZodReadonly", (e, t) => {
  G.init(e, t), J(e._zod, "propValues", () => t.innerType._zod.propValues), J(e._zod, "values", () => t.innerType._zod.values), J(e._zod, "optin", () => t.innerType?._zod?.optin), J(e._zod, "optout", () => t.innerType?._zod?.optout), e._zod.parse = (n, i) => {
    if (i.direction === "backward")
      return t.innerType._zod.run(n, i);
    const r = t.innerType._zod.run(n, i);
    return r instanceof Promise ? r.then(Tl) : Tl(r);
  };
});
function Tl(e) {
  return e.value = Object.freeze(e.value), e;
}
const Pp = /* @__PURE__ */ S("$ZodTemplateLiteral", (e, t) => {
  G.init(e, t);
  const n = [];
  for (const i of t.parts)
    if (typeof i == "object" && i !== null) {
      if (!i._zod.pattern)
        throw new Error(`Invalid template literal part, no pattern found: ${[...i._zod.traits].shift()}`);
      const r = i._zod.pattern instanceof RegExp ? i._zod.pattern.source : i._zod.pattern;
      if (!r)
        throw new Error(`Invalid template literal part: ${i._zod.traits}`);
      const o = r.startsWith("^") ? 1 : 0, a = r.endsWith("$") ? r.length - 1 : r.length;
      n.push(r.slice(o, a));
    } else if (i === null || Xc.has(typeof i))
      n.push(tt(`${i}`));
    else
      throw new Error(`Invalid template literal part: ${i}`);
  e._zod.pattern = new RegExp(`^${n.join("")}$`), e._zod.parse = (i, r) => typeof i.value != "string" ? (i.issues.push({
    input: i.value,
    inst: e,
    expected: "string",
    code: "invalid_type"
  }), i) : (e._zod.pattern.lastIndex = 0, e._zod.pattern.test(i.value) || i.issues.push({
    input: i.value,
    inst: e,
    code: "invalid_format",
    format: t.format ?? "template_literal",
    pattern: e._zod.pattern.source
  }), i);
}), Np = /* @__PURE__ */ S("$ZodFunction", (e, t) => (G.init(e, t), e._def = t, e._zod.def = t, e.implement = (n) => {
  if (typeof n != "function")
    throw new Error("implement() must be called with a function");
  return function(...i) {
    const r = e._def.input ? wo(e._def.input, i) : i, o = Reflect.apply(n, this, r);
    return e._def.output ? wo(e._def.output, o) : o;
  };
}, e.implementAsync = (n) => {
  if (typeof n != "function")
    throw new Error("implementAsync() must be called with a function");
  return async function(...i) {
    const r = e._def.input ? await Io(e._def.input, i) : i, o = await Reflect.apply(n, this, r);
    return e._def.output ? await Io(e._def.output, o) : o;
  };
}, e._zod.parse = (n, i) => typeof n.value != "function" ? (n.issues.push({
  code: "invalid_type",
  expected: "function",
  input: n.value,
  inst: e
}), n) : (e._def.output && e._def.output._zod.def.type === "promise" ? n.value = e.implementAsync(n.value) : n.value = e.implement(n.value), n), e.input = (...n) => {
  const i = e.constructor;
  return Array.isArray(n[0]) ? new i({
    type: "function",
    input: new pa({
      type: "tuple",
      items: n[0],
      rest: n[1]
    }),
    output: e._def.output
  }) : new i({
    type: "function",
    input: n[0],
    output: e._def.output
  });
}, e.output = (n) => {
  const i = e.constructor;
  return new i({
    type: "function",
    input: e._def.input,
    output: n
  });
}, e)), Tp = /* @__PURE__ */ S("$ZodPromise", (e, t) => {
  G.init(e, t), e._zod.parse = (n, i) => Promise.resolve(n.value).then((r) => t.innerType._zod.run({ value: r, issues: [] }, i));
}), zp = /* @__PURE__ */ S("$ZodLazy", (e, t) => {
  G.init(e, t), J(e._zod, "innerType", () => {
    const n = t;
    return n._cachedInner || (n._cachedInner = t.getter()), n._cachedInner;
  }), J(e._zod, "pattern", () => e._zod.innerType?._zod?.pattern), J(e._zod, "propValues", () => e._zod.innerType?._zod?.propValues), J(e._zod, "optin", () => e._zod.innerType?._zod?.optin ?? void 0), J(e._zod, "optout", () => e._zod.innerType?._zod?.optout ?? void 0), e._zod.parse = (n, i) => e._zod.innerType._zod.run(n, i);
}), Ap = /* @__PURE__ */ S("$ZodCustom", (e, t) => {
  ae.init(e, t), G.init(e, t), e._zod.parse = (n, i) => n, e._zod.check = (n) => {
    const i = n.value, r = t.fn(i);
    if (r instanceof Promise)
      return r.then((o) => zl(o, n, i, e));
    zl(r, n, i, e);
  };
});
function zl(e, t, n, i) {
  if (!e) {
    const r = {
      code: "custom",
      input: n,
      inst: i,
      // incorporates params.error into issue reporting
      path: [...i._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !i._zod.def.abort
      // params: inst._zod.def.params,
    };
    i._zod.def.params && (r.params = i._zod.def.params), t.issues.push(Xt(r));
  }
}
const J4 = () => {
  const e = {
    string: { unit: "حرف", verb: "أن يحوي" },
    file: { unit: "بايت", verb: "أن يحوي" },
    array: { unit: "عنصر", verb: "أن يحوي" },
    set: { unit: "عنصر", verb: "أن يحوي" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "مدخل",
    email: "بريد إلكتروني",
    url: "رابط",
    emoji: "إيموجي",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "تاريخ ووقت بمعيار ISO",
    date: "تاريخ بمعيار ISO",
    time: "وقت بمعيار ISO",
    duration: "مدة بمعيار ISO",
    ipv4: "عنوان IPv4",
    ipv6: "عنوان IPv6",
    cidrv4: "مدى عناوين بصيغة IPv4",
    cidrv6: "مدى عناوين بصيغة IPv6",
    base64: "نَص بترميز base64-encoded",
    base64url: "نَص بترميز base64url-encoded",
    json_string: "نَص على هيئة JSON",
    e164: "رقم هاتف بمعيار E.164",
    jwt: "JWT",
    template_literal: "مدخل"
  }, i = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `مدخلات غير مقبولة: يفترض إدخال instanceof ${r.expected}، ولكن تم إدخال ${s}` : `مدخلات غير مقبولة: يفترض إدخال ${o}، ولكن تم إدخال ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `مدخلات غير مقبولة: يفترض إدخال ${j(r.values[0])}` : `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? ` أكبر من اللازم: يفترض أن تكون ${r.origin ?? "القيمة"} ${o} ${r.maximum.toString()} ${a.unit ?? "عنصر"}` : `أكبر من اللازم: يفترض أن تكون ${r.origin ?? "القيمة"} ${o} ${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `أصغر من اللازم: يفترض لـ ${r.origin} أن يكون ${o} ${r.minimum.toString()} ${a.unit}` : `أصغر من اللازم: يفترض لـ ${r.origin} أن يكون ${o} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `نَص غير مقبول: يجب أن يبدأ بـ "${r.prefix}"` : o.format === "ends_with" ? `نَص غير مقبول: يجب أن ينتهي بـ "${o.suffix}"` : o.format === "includes" ? `نَص غير مقبول: يجب أن يتضمَّن "${o.includes}"` : o.format === "regex" ? `نَص غير مقبول: يجب أن يطابق النمط ${o.pattern}` : `${n[o.format] ?? r.format} غير مقبول`;
      }
      case "not_multiple_of":
        return `رقم غير مقبول: يجب أن يكون من مضاعفات ${r.divisor}`;
      case "unrecognized_keys":
        return `معرف${r.keys.length > 1 ? "ات" : ""} غريب${r.keys.length > 1 ? "ة" : ""}: ${T(r.keys, "، ")}`;
      case "invalid_key":
        return `معرف غير مقبول في ${r.origin}`;
      case "invalid_union":
        return "مدخل غير مقبول";
      case "invalid_element":
        return `مدخل غير مقبول في ${r.origin}`;
      default:
        return "مدخل غير مقبول";
    }
  };
};
function V4() {
  return {
    localeError: J4()
  };
}
const q4 = () => {
  const e = {
    string: { unit: "simvol", verb: "olmalıdır" },
    file: { unit: "bayt", verb: "olmalıdır" },
    array: { unit: "element", verb: "olmalıdır" },
    set: { unit: "element", verb: "olmalıdır" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  }, i = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Yanlış dəyər: gözlənilən instanceof ${r.expected}, daxil olan ${s}` : `Yanlış dəyər: gözlənilən ${o}, daxil olan ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Yanlış dəyər: gözlənilən ${j(r.values[0])}` : `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Çox böyük: gözlənilən ${r.origin ?? "dəyər"} ${o}${r.maximum.toString()} ${a.unit ?? "element"}` : `Çox böyük: gözlənilən ${r.origin ?? "dəyər"} ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Çox kiçik: gözlənilən ${r.origin} ${o}${r.minimum.toString()} ${a.unit}` : `Çox kiçik: gözlənilən ${r.origin} ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Yanlış mətn: "${o.prefix}" ilə başlamalıdır` : o.format === "ends_with" ? `Yanlış mətn: "${o.suffix}" ilə bitməlidir` : o.format === "includes" ? `Yanlış mətn: "${o.includes}" daxil olmalıdır` : o.format === "regex" ? `Yanlış mətn: ${o.pattern} şablonuna uyğun olmalıdır` : `Yanlış ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Yanlış ədəd: ${r.divisor} ilə bölünə bilən olmalıdır`;
      case "unrecognized_keys":
        return `Tanınmayan açar${r.keys.length > 1 ? "lar" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} daxilində yanlış açar`;
      case "invalid_union":
        return "Yanlış dəyər";
      case "invalid_element":
        return `${r.origin} daxilində yanlış dəyər`;
      default:
        return "Yanlış dəyər";
    }
  };
};
function W4() {
  return {
    localeError: q4()
  };
}
function Al(e, t, n, i) {
  const r = Math.abs(e), o = r % 10, a = r % 100;
  return a >= 11 && a <= 19 ? i : o === 1 ? t : o >= 2 && o <= 4 ? n : i;
}
const K4 = () => {
  const e = {
    string: {
      unit: {
        one: "сімвал",
        few: "сімвалы",
        many: "сімвалаў"
      },
      verb: "мець"
    },
    array: {
      unit: {
        one: "элемент",
        few: "элементы",
        many: "элементаў"
      },
      verb: "мець"
    },
    set: {
      unit: {
        one: "элемент",
        few: "элементы",
        many: "элементаў"
      },
      verb: "мець"
    },
    file: {
      unit: {
        one: "байт",
        few: "байты",
        many: "байтаў"
      },
      verb: "мець"
    }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "увод",
    email: "email адрас",
    url: "URL",
    emoji: "эмодзі",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO дата і час",
    date: "ISO дата",
    time: "ISO час",
    duration: "ISO працягласць",
    ipv4: "IPv4 адрас",
    ipv6: "IPv6 адрас",
    cidrv4: "IPv4 дыяпазон",
    cidrv6: "IPv6 дыяпазон",
    base64: "радок у фармаце base64",
    base64url: "радок у фармаце base64url",
    json_string: "JSON радок",
    e164: "нумар E.164",
    jwt: "JWT",
    template_literal: "увод"
  }, i = {
    nan: "NaN",
    number: "лік",
    array: "масіў"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Няправільны ўвод: чакаўся instanceof ${r.expected}, атрымана ${s}` : `Няправільны ўвод: чакаўся ${o}, атрымана ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Няправільны ўвод: чакалася ${j(r.values[0])}` : `Няправільны варыянт: чакаўся адзін з ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        if (a) {
          const s = Number(r.maximum), d = Al(s, a.unit.one, a.unit.few, a.unit.many);
          return `Занадта вялікі: чакалася, што ${r.origin ?? "значэнне"} павінна ${a.verb} ${o}${r.maximum.toString()} ${d}`;
        }
        return `Занадта вялікі: чакалася, што ${r.origin ?? "значэнне"} павінна быць ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        if (a) {
          const s = Number(r.minimum), d = Al(s, a.unit.one, a.unit.few, a.unit.many);
          return `Занадта малы: чакалася, што ${r.origin} павінна ${a.verb} ${o}${r.minimum.toString()} ${d}`;
        }
        return `Занадта малы: чакалася, што ${r.origin} павінна быць ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Няправільны радок: павінен пачынацца з "${o.prefix}"` : o.format === "ends_with" ? `Няправільны радок: павінен заканчвацца на "${o.suffix}"` : o.format === "includes" ? `Няправільны радок: павінен змяшчаць "${o.includes}"` : o.format === "regex" ? `Няправільны радок: павінен адпавядаць шаблону ${o.pattern}` : `Няправільны ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Няправільны лік: павінен быць кратным ${r.divisor}`;
      case "unrecognized_keys":
        return `Нераспазнаны ${r.keys.length > 1 ? "ключы" : "ключ"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Няправільны ключ у ${r.origin}`;
      case "invalid_union":
        return "Няправільны ўвод";
      case "invalid_element":
        return `Няправільнае значэнне ў ${r.origin}`;
      default:
        return "Няправільны ўвод";
    }
  };
};
function Y4() {
  return {
    localeError: K4()
  };
}
const X4 = () => {
  const e = {
    string: { unit: "символа", verb: "да съдържа" },
    file: { unit: "байта", verb: "да съдържа" },
    array: { unit: "елемента", verb: "да съдържа" },
    set: { unit: "елемента", verb: "да съдържа" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "вход",
    email: "имейл адрес",
    url: "URL",
    emoji: "емоджи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO време",
    date: "ISO дата",
    time: "ISO време",
    duration: "ISO продължителност",
    ipv4: "IPv4 адрес",
    ipv6: "IPv6 адрес",
    cidrv4: "IPv4 диапазон",
    cidrv6: "IPv6 диапазон",
    base64: "base64-кодиран низ",
    base64url: "base64url-кодиран низ",
    json_string: "JSON низ",
    e164: "E.164 номер",
    jwt: "JWT",
    template_literal: "вход"
  }, i = {
    nan: "NaN",
    number: "число",
    array: "масив"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Невалиден вход: очакван instanceof ${r.expected}, получен ${s}` : `Невалиден вход: очакван ${o}, получен ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Невалиден вход: очакван ${j(r.values[0])}` : `Невалидна опция: очаквано едно от ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Твърде голямо: очаква се ${r.origin ?? "стойност"} да съдържа ${o}${r.maximum.toString()} ${a.unit ?? "елемента"}` : `Твърде голямо: очаква се ${r.origin ?? "стойност"} да бъде ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Твърде малко: очаква се ${r.origin} да съдържа ${o}${r.minimum.toString()} ${a.unit}` : `Твърде малко: очаква се ${r.origin} да бъде ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        if (o.format === "starts_with")
          return `Невалиден низ: трябва да започва с "${o.prefix}"`;
        if (o.format === "ends_with")
          return `Невалиден низ: трябва да завършва с "${o.suffix}"`;
        if (o.format === "includes")
          return `Невалиден низ: трябва да включва "${o.includes}"`;
        if (o.format === "regex")
          return `Невалиден низ: трябва да съвпада с ${o.pattern}`;
        let a = "Невалиден";
        return o.format === "emoji" && (a = "Невалидно"), o.format === "datetime" && (a = "Невалидно"), o.format === "date" && (a = "Невалидна"), o.format === "time" && (a = "Невалидно"), o.format === "duration" && (a = "Невалидна"), `${a} ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Невалидно число: трябва да бъде кратно на ${r.divisor}`;
      case "unrecognized_keys":
        return `Неразпознат${r.keys.length > 1 ? "и" : ""} ключ${r.keys.length > 1 ? "ове" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Невалиден ключ в ${r.origin}`;
      case "invalid_union":
        return "Невалиден вход";
      case "invalid_element":
        return `Невалидна стойност в ${r.origin}`;
      default:
        return "Невалиден вход";
    }
  };
};
function Q4() {
  return {
    localeError: X4()
  };
}
const e3 = () => {
  const e = {
    string: { unit: "caràcters", verb: "contenir" },
    file: { unit: "bytes", verb: "contenir" },
    array: { unit: "elements", verb: "contenir" },
    set: { unit: "elements", verb: "contenir" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "entrada",
    email: "adreça electrònica",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "durada ISO",
    ipv4: "adreça IPv4",
    ipv6: "adreça IPv6",
    cidrv4: "rang IPv4",
    cidrv6: "rang IPv6",
    base64: "cadena codificada en base64",
    base64url: "cadena codificada en base64url",
    json_string: "cadena JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  }, i = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Tipus invàlid: s'esperava instanceof ${r.expected}, s'ha rebut ${s}` : `Tipus invàlid: s'esperava ${o}, s'ha rebut ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Valor invàlid: s'esperava ${j(r.values[0])}` : `Opció invàlida: s'esperava una de ${T(r.values, " o ")}`;
      case "too_big": {
        const o = r.inclusive ? "com a màxim" : "menys de", a = t(r.origin);
        return a ? `Massa gran: s'esperava que ${r.origin ?? "el valor"} contingués ${o} ${r.maximum.toString()} ${a.unit ?? "elements"}` : `Massa gran: s'esperava que ${r.origin ?? "el valor"} fos ${o} ${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? "com a mínim" : "més de", a = t(r.origin);
        return a ? `Massa petit: s'esperava que ${r.origin} contingués ${o} ${r.minimum.toString()} ${a.unit}` : `Massa petit: s'esperava que ${r.origin} fos ${o} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Format invàlid: ha de començar amb "${o.prefix}"` : o.format === "ends_with" ? `Format invàlid: ha d'acabar amb "${o.suffix}"` : o.format === "includes" ? `Format invàlid: ha d'incloure "${o.includes}"` : o.format === "regex" ? `Format invàlid: ha de coincidir amb el patró ${o.pattern}` : `Format invàlid per a ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Número invàlid: ha de ser múltiple de ${r.divisor}`;
      case "unrecognized_keys":
        return `Clau${r.keys.length > 1 ? "s" : ""} no reconeguda${r.keys.length > 1 ? "s" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Clau invàlida a ${r.origin}`;
      case "invalid_union":
        return "Entrada invàlida";
      // Could also be "Tipus d'unió invàlid" but "Entrada invàlida" is more general
      case "invalid_element":
        return `Element invàlid a ${r.origin}`;
      default:
        return "Entrada invàlida";
    }
  };
};
function t3() {
  return {
    localeError: e3()
  };
}
const r3 = () => {
  const e = {
    string: { unit: "znaků", verb: "mít" },
    file: { unit: "bajtů", verb: "mít" },
    array: { unit: "prvků", verb: "mít" },
    set: { unit: "prvků", verb: "mít" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "regulární výraz",
    email: "e-mailová adresa",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "datum a čas ve formátu ISO",
    date: "datum ve formátu ISO",
    time: "čas ve formátu ISO",
    duration: "doba trvání ISO",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    cidrv4: "rozsah IPv4",
    cidrv6: "rozsah IPv6",
    base64: "řetězec zakódovaný ve formátu base64",
    base64url: "řetězec zakódovaný ve formátu base64url",
    json_string: "řetězec ve formátu JSON",
    e164: "číslo E.164",
    jwt: "JWT",
    template_literal: "vstup"
  }, i = {
    nan: "NaN",
    number: "číslo",
    string: "řetězec",
    function: "funkce",
    array: "pole"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Neplatný vstup: očekáváno instanceof ${r.expected}, obdrženo ${s}` : `Neplatný vstup: očekáváno ${o}, obdrženo ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Neplatný vstup: očekáváno ${j(r.values[0])}` : `Neplatná možnost: očekávána jedna z hodnot ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Hodnota je příliš velká: ${r.origin ?? "hodnota"} musí mít ${o}${r.maximum.toString()} ${a.unit ?? "prvků"}` : `Hodnota je příliš velká: ${r.origin ?? "hodnota"} musí být ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Hodnota je příliš malá: ${r.origin ?? "hodnota"} musí mít ${o}${r.minimum.toString()} ${a.unit ?? "prvků"}` : `Hodnota je příliš malá: ${r.origin ?? "hodnota"} musí být ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Neplatný řetězec: musí začínat na "${o.prefix}"` : o.format === "ends_with" ? `Neplatný řetězec: musí končit na "${o.suffix}"` : o.format === "includes" ? `Neplatný řetězec: musí obsahovat "${o.includes}"` : o.format === "regex" ? `Neplatný řetězec: musí odpovídat vzoru ${o.pattern}` : `Neplatný formát ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Neplatné číslo: musí být násobkem ${r.divisor}`;
      case "unrecognized_keys":
        return `Neznámé klíče: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Neplatný klíč v ${r.origin}`;
      case "invalid_union":
        return "Neplatný vstup";
      case "invalid_element":
        return `Neplatná hodnota v ${r.origin}`;
      default:
        return "Neplatný vstup";
    }
  };
};
function n3() {
  return {
    localeError: r3()
  };
}
const i3 = () => {
  const e = {
    string: { unit: "tegn", verb: "havde" },
    file: { unit: "bytes", verb: "havde" },
    array: { unit: "elementer", verb: "indeholdt" },
    set: { unit: "elementer", verb: "indeholdt" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "e-mailadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslæt",
    date: "ISO-dato",
    time: "ISO-klokkeslæt",
    duration: "ISO-varighed",
    ipv4: "IPv4-område",
    ipv6: "IPv6-område",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodet streng",
    base64url: "base64url-kodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "input"
  }, i = {
    nan: "NaN",
    string: "streng",
    number: "tal",
    boolean: "boolean",
    array: "liste",
    object: "objekt",
    set: "sæt",
    file: "fil"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ugyldigt input: forventede instanceof ${r.expected}, fik ${s}` : `Ugyldigt input: forventede ${o}, fik ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ugyldig værdi: forventede ${j(r.values[0])}` : `Ugyldigt valg: forventede en af følgende ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin), s = i[r.origin] ?? r.origin;
        return a ? `For stor: forventede ${s ?? "value"} ${a.verb} ${o} ${r.maximum.toString()} ${a.unit ?? "elementer"}` : `For stor: forventede ${s ?? "value"} havde ${o} ${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin), s = i[r.origin] ?? r.origin;
        return a ? `For lille: forventede ${s} ${a.verb} ${o} ${r.minimum.toString()} ${a.unit}` : `For lille: forventede ${s} havde ${o} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Ugyldig streng: skal starte med "${o.prefix}"` : o.format === "ends_with" ? `Ugyldig streng: skal ende med "${o.suffix}"` : o.format === "includes" ? `Ugyldig streng: skal indeholde "${o.includes}"` : o.format === "regex" ? `Ugyldig streng: skal matche mønsteret ${o.pattern}` : `Ugyldig ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ugyldigt tal: skal være deleligt med ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Ukendte nøgler" : "Ukendt nøgle"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig nøgle i ${r.origin}`;
      case "invalid_union":
        return "Ugyldigt input: matcher ingen af de tilladte typer";
      case "invalid_element":
        return `Ugyldig værdi i ${r.origin}`;
      default:
        return "Ugyldigt input";
    }
  };
};
function o3() {
  return {
    localeError: i3()
  };
}
const a3 = () => {
  const e = {
    string: { unit: "Zeichen", verb: "zu haben" },
    file: { unit: "Bytes", verb: "zu haben" },
    array: { unit: "Elemente", verb: "zu haben" },
    set: { unit: "Elemente", verb: "zu haben" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "Eingabe",
    email: "E-Mail-Adresse",
    url: "URL",
    emoji: "Emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-Datum und -Uhrzeit",
    date: "ISO-Datum",
    time: "ISO-Uhrzeit",
    duration: "ISO-Dauer",
    ipv4: "IPv4-Adresse",
    ipv6: "IPv6-Adresse",
    cidrv4: "IPv4-Bereich",
    cidrv6: "IPv6-Bereich",
    base64: "Base64-codierter String",
    base64url: "Base64-URL-codierter String",
    json_string: "JSON-String",
    e164: "E.164-Nummer",
    jwt: "JWT",
    template_literal: "Eingabe"
  }, i = {
    nan: "NaN",
    number: "Zahl",
    array: "Array"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ungültige Eingabe: erwartet instanceof ${r.expected}, erhalten ${s}` : `Ungültige Eingabe: erwartet ${o}, erhalten ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ungültige Eingabe: erwartet ${j(r.values[0])}` : `Ungültige Option: erwartet eine von ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Zu groß: erwartet, dass ${r.origin ?? "Wert"} ${o}${r.maximum.toString()} ${a.unit ?? "Elemente"} hat` : `Zu groß: erwartet, dass ${r.origin ?? "Wert"} ${o}${r.maximum.toString()} ist`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Zu klein: erwartet, dass ${r.origin} ${o}${r.minimum.toString()} ${a.unit} hat` : `Zu klein: erwartet, dass ${r.origin} ${o}${r.minimum.toString()} ist`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Ungültiger String: muss mit "${o.prefix}" beginnen` : o.format === "ends_with" ? `Ungültiger String: muss mit "${o.suffix}" enden` : o.format === "includes" ? `Ungültiger String: muss "${o.includes}" enthalten` : o.format === "regex" ? `Ungültiger String: muss dem Muster ${o.pattern} entsprechen` : `Ungültig: ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ungültige Zahl: muss ein Vielfaches von ${r.divisor} sein`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Unbekannte Schlüssel" : "Unbekannter Schlüssel"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Ungültiger Schlüssel in ${r.origin}`;
      case "invalid_union":
        return "Ungültige Eingabe";
      case "invalid_element":
        return `Ungültiger Wert in ${r.origin}`;
      default:
        return "Ungültige Eingabe";
    }
  };
};
function s3() {
  return {
    localeError: a3()
  };
}
const u3 = () => {
  const e = {
    string: { unit: "χαρακτήρες", verb: "να έχει" },
    file: { unit: "bytes", verb: "να έχει" },
    array: { unit: "στοιχεία", verb: "να έχει" },
    set: { unit: "στοιχεία", verb: "να έχει" },
    map: { unit: "καταχωρήσεις", verb: "να έχει" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "είσοδος",
    email: "διεύθυνση email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO ημερομηνία και ώρα",
    date: "ISO ημερομηνία",
    time: "ISO ώρα",
    duration: "ISO διάρκεια",
    ipv4: "διεύθυνση IPv4",
    ipv6: "διεύθυνση IPv6",
    mac: "διεύθυνση MAC",
    cidrv4: "εύρος IPv4",
    cidrv6: "εύρος IPv6",
    base64: "συμβολοσειρά κωδικοποιημένη σε base64",
    base64url: "συμβολοσειρά κωδικοποιημένη σε base64url",
    json_string: "συμβολοσειρά JSON",
    e164: "αριθμός E.164",
    jwt: "JWT",
    template_literal: "είσοδος"
  }, i = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return typeof r.expected == "string" && /^[A-Z]/.test(r.expected) ? `Μη έγκυρη είσοδος: αναμενόταν instanceof ${r.expected}, λήφθηκε ${s}` : `Μη έγκυρη είσοδος: αναμενόταν ${o}, λήφθηκε ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Μη έγκυρη είσοδος: αναμενόταν ${j(r.values[0])}` : `Μη έγκυρη επιλογή: αναμενόταν ένα από ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Πολύ μεγάλο: αναμενόταν ${r.origin ?? "τιμή"} να έχει ${o}${r.maximum.toString()} ${a.unit ?? "στοιχεία"}` : `Πολύ μεγάλο: αναμενόταν ${r.origin ?? "τιμή"} να είναι ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Πολύ μικρό: αναμενόταν ${r.origin} να έχει ${o}${r.minimum.toString()} ${a.unit}` : `Πολύ μικρό: αναμενόταν ${r.origin} να είναι ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Μη έγκυρη συμβολοσειρά: πρέπει να ξεκινά με "${o.prefix}"` : o.format === "ends_with" ? `Μη έγκυρη συμβολοσειρά: πρέπει να τελειώνει με "${o.suffix}"` : o.format === "includes" ? `Μη έγκυρη συμβολοσειρά: πρέπει να περιέχει "${o.includes}"` : o.format === "regex" ? `Μη έγκυρη συμβολοσειρά: πρέπει να ταιριάζει με το μοτίβο ${o.pattern}` : `Μη έγκυρο: ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Μη έγκυρος αριθμός: πρέπει να είναι πολλαπλάσιο του ${r.divisor}`;
      case "unrecognized_keys":
        return `Άγνωστ${r.keys.length > 1 ? "α" : "ο"} κλειδ${r.keys.length > 1 ? "ιά" : "ί"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Μη έγκυρο κλειδί στο ${r.origin}`;
      case "invalid_union":
        return "Μη έγκυρη είσοδος";
      case "invalid_element":
        return `Μη έγκυρη τιμή στο ${r.origin}`;
      default:
        return "Μη έγκυρη είσοδος";
    }
  };
};
function l3() {
  return {
    localeError: u3()
  };
}
const c3 = () => {
  const e = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  }, i = {
    // Compatibility: "nan" -> "NaN" for display
    nan: "NaN"
    // All other type names omitted - they fall back to raw values via ?? operator
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return `Invalid input: expected ${o}, received ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Invalid input: expected ${j(r.values[0])}` : `Invalid option: expected one of ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Too big: expected ${r.origin ?? "value"} to have ${o}${r.maximum.toString()} ${a.unit ?? "elements"}` : `Too big: expected ${r.origin ?? "value"} to be ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Too small: expected ${r.origin} to have ${o}${r.minimum.toString()} ${a.unit}` : `Too small: expected ${r.origin} to be ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Invalid string: must start with "${o.prefix}"` : o.format === "ends_with" ? `Invalid string: must end with "${o.suffix}"` : o.format === "includes" ? `Invalid string: must include "${o.includes}"` : o.format === "regex" ? `Invalid string: must match pattern ${o.pattern}` : `Invalid ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${r.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${r.keys.length > 1 ? "s" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${r.origin}`;
      case "invalid_union":
        return r.options && Array.isArray(r.options) && r.options.length > 0 ? `Invalid discriminator value. Expected ${r.options.map((a) => `'${a}'`).join(" | ")}` : "Invalid input";
      case "invalid_element":
        return `Invalid value in ${r.origin}`;
      default:
        return "Invalid input";
    }
  };
};
function Dp() {
  return {
    localeError: c3()
  };
}
const d3 = () => {
  const e = {
    string: { unit: "karaktrojn", verb: "havi" },
    file: { unit: "bajtojn", verb: "havi" },
    array: { unit: "elementojn", verb: "havi" },
    set: { unit: "elementojn", verb: "havi" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "enigo",
    email: "retadreso",
    url: "URL",
    emoji: "emoĝio",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datotempo",
    date: "ISO-dato",
    time: "ISO-tempo",
    duration: "ISO-daŭro",
    ipv4: "IPv4-adreso",
    ipv6: "IPv6-adreso",
    cidrv4: "IPv4-rango",
    cidrv6: "IPv6-rango",
    base64: "64-ume kodita karaktraro",
    base64url: "URL-64-ume kodita karaktraro",
    json_string: "JSON-karaktraro",
    e164: "E.164-nombro",
    jwt: "JWT",
    template_literal: "enigo"
  }, i = {
    nan: "NaN",
    number: "nombro",
    array: "tabelo",
    null: "senvalora"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Nevalida enigo: atendiĝis instanceof ${r.expected}, riceviĝis ${s}` : `Nevalida enigo: atendiĝis ${o}, riceviĝis ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Nevalida enigo: atendiĝis ${j(r.values[0])}` : `Nevalida opcio: atendiĝis unu el ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Tro granda: atendiĝis ke ${r.origin ?? "valoro"} havu ${o}${r.maximum.toString()} ${a.unit ?? "elementojn"}` : `Tro granda: atendiĝis ke ${r.origin ?? "valoro"} havu ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Tro malgranda: atendiĝis ke ${r.origin} havu ${o}${r.minimum.toString()} ${a.unit}` : `Tro malgranda: atendiĝis ke ${r.origin} estu ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Nevalida karaktraro: devas komenciĝi per "${o.prefix}"` : o.format === "ends_with" ? `Nevalida karaktraro: devas finiĝi per "${o.suffix}"` : o.format === "includes" ? `Nevalida karaktraro: devas inkluzivi "${o.includes}"` : o.format === "regex" ? `Nevalida karaktraro: devas kongrui kun la modelo ${o.pattern}` : `Nevalida ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Nevalida nombro: devas esti oblo de ${r.divisor}`;
      case "unrecognized_keys":
        return `Nekonata${r.keys.length > 1 ? "j" : ""} ŝlosilo${r.keys.length > 1 ? "j" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Nevalida ŝlosilo en ${r.origin}`;
      case "invalid_union":
        return "Nevalida enigo";
      case "invalid_element":
        return `Nevalida valoro en ${r.origin}`;
      default:
        return "Nevalida enigo";
    }
  };
};
function f3() {
  return {
    localeError: d3()
  };
}
const p3 = () => {
  const e = {
    string: { unit: "caracteres", verb: "tener" },
    file: { unit: "bytes", verb: "tener" },
    array: { unit: "elementos", verb: "tener" },
    set: { unit: "elementos", verb: "tener" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "entrada",
    email: "dirección de correo electrónico",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "fecha y hora ISO",
    date: "fecha ISO",
    time: "hora ISO",
    duration: "duración ISO",
    ipv4: "dirección IPv4",
    ipv6: "dirección IPv6",
    cidrv4: "rango IPv4",
    cidrv6: "rango IPv6",
    base64: "cadena codificada en base64",
    base64url: "URL codificada en base64",
    json_string: "cadena JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  }, i = {
    nan: "NaN",
    string: "texto",
    number: "número",
    boolean: "booleano",
    array: "arreglo",
    object: "objeto",
    set: "conjunto",
    file: "archivo",
    date: "fecha",
    bigint: "número grande",
    symbol: "símbolo",
    undefined: "indefinido",
    null: "nulo",
    function: "función",
    map: "mapa",
    record: "registro",
    tuple: "tupla",
    enum: "enumeración",
    union: "unión",
    literal: "literal",
    promise: "promesa",
    void: "vacío",
    never: "nunca",
    unknown: "desconocido",
    any: "cualquiera"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Entrada inválida: se esperaba instanceof ${r.expected}, recibido ${s}` : `Entrada inválida: se esperaba ${o}, recibido ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entrada inválida: se esperaba ${j(r.values[0])}` : `Opción inválida: se esperaba una de ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin), s = i[r.origin] ?? r.origin;
        return a ? `Demasiado grande: se esperaba que ${s ?? "valor"} tuviera ${o}${r.maximum.toString()} ${a.unit ?? "elementos"}` : `Demasiado grande: se esperaba que ${s ?? "valor"} fuera ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin), s = i[r.origin] ?? r.origin;
        return a ? `Demasiado pequeño: se esperaba que ${s} tuviera ${o}${r.minimum.toString()} ${a.unit}` : `Demasiado pequeño: se esperaba que ${s} fuera ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Cadena inválida: debe comenzar con "${o.prefix}"` : o.format === "ends_with" ? `Cadena inválida: debe terminar en "${o.suffix}"` : o.format === "includes" ? `Cadena inválida: debe incluir "${o.includes}"` : o.format === "regex" ? `Cadena inválida: debe coincidir con el patrón ${o.pattern}` : `Inválido ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Número inválido: debe ser múltiplo de ${r.divisor}`;
      case "unrecognized_keys":
        return `Llave${r.keys.length > 1 ? "s" : ""} desconocida${r.keys.length > 1 ? "s" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Llave inválida en ${i[r.origin] ?? r.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido en ${i[r.origin] ?? r.origin}`;
      default:
        return "Entrada inválida";
    }
  };
};
function h3() {
  return {
    localeError: p3()
  };
}
const m3 = () => {
  const e = {
    string: { unit: "کاراکتر", verb: "داشته باشد" },
    file: { unit: "بایت", verb: "داشته باشد" },
    array: { unit: "آیتم", verb: "داشته باشد" },
    set: { unit: "آیتم", verb: "داشته باشد" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ورودی",
    email: "آدرس ایمیل",
    url: "URL",
    emoji: "ایموجی",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "تاریخ و زمان ایزو",
    date: "تاریخ ایزو",
    time: "زمان ایزو",
    duration: "مدت زمان ایزو",
    ipv4: "IPv4 آدرس",
    ipv6: "IPv6 آدرس",
    cidrv4: "IPv4 دامنه",
    cidrv6: "IPv6 دامنه",
    base64: "base64-encoded رشته",
    base64url: "base64url-encoded رشته",
    json_string: "JSON رشته",
    e164: "E.164 عدد",
    jwt: "JWT",
    template_literal: "ورودی"
  }, i = {
    nan: "NaN",
    number: "عدد",
    array: "آرایه"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `ورودی نامعتبر: می‌بایست instanceof ${r.expected} می‌بود، ${s} دریافت شد` : `ورودی نامعتبر: می‌بایست ${o} می‌بود، ${s} دریافت شد`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `ورودی نامعتبر: می‌بایست ${j(r.values[0])} می‌بود` : `گزینه نامعتبر: می‌بایست یکی از ${T(r.values, "|")} می‌بود`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `خیلی بزرگ: ${r.origin ?? "مقدار"} باید ${o}${r.maximum.toString()} ${a.unit ?? "عنصر"} باشد` : `خیلی بزرگ: ${r.origin ?? "مقدار"} باید ${o}${r.maximum.toString()} باشد`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `خیلی کوچک: ${r.origin} باید ${o}${r.minimum.toString()} ${a.unit} باشد` : `خیلی کوچک: ${r.origin} باید ${o}${r.minimum.toString()} باشد`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `رشته نامعتبر: باید با "${o.prefix}" شروع شود` : o.format === "ends_with" ? `رشته نامعتبر: باید با "${o.suffix}" تمام شود` : o.format === "includes" ? `رشته نامعتبر: باید شامل "${o.includes}" باشد` : o.format === "regex" ? `رشته نامعتبر: باید با الگوی ${o.pattern} مطابقت داشته باشد` : `${n[o.format] ?? r.format} نامعتبر`;
      }
      case "not_multiple_of":
        return `عدد نامعتبر: باید مضرب ${r.divisor} باشد`;
      case "unrecognized_keys":
        return `کلید${r.keys.length > 1 ? "های" : ""} ناشناس: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `کلید ناشناس در ${r.origin}`;
      case "invalid_union":
        return "ورودی نامعتبر";
      case "invalid_element":
        return `مقدار نامعتبر در ${r.origin}`;
      default:
        return "ورودی نامعتبر";
    }
  };
};
function g3() {
  return {
    localeError: m3()
  };
}
const v3 = () => {
  const e = {
    string: { unit: "merkkiä", subject: "merkkijonon" },
    file: { unit: "tavua", subject: "tiedoston" },
    array: { unit: "alkiota", subject: "listan" },
    set: { unit: "alkiota", subject: "joukon" },
    number: { unit: "", subject: "luvun" },
    bigint: { unit: "", subject: "suuren kokonaisluvun" },
    int: { unit: "", subject: "kokonaisluvun" },
    date: { unit: "", subject: "päivämäärän" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "säännöllinen lauseke",
    email: "sähköpostiosoite",
    url: "URL-osoite",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-aikaleima",
    date: "ISO-päivämäärä",
    time: "ISO-aika",
    duration: "ISO-kesto",
    ipv4: "IPv4-osoite",
    ipv6: "IPv6-osoite",
    cidrv4: "IPv4-alue",
    cidrv6: "IPv6-alue",
    base64: "base64-koodattu merkkijono",
    base64url: "base64url-koodattu merkkijono",
    json_string: "JSON-merkkijono",
    e164: "E.164-luku",
    jwt: "JWT",
    template_literal: "templaattimerkkijono"
  }, i = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Virheellinen tyyppi: odotettiin instanceof ${r.expected}, oli ${s}` : `Virheellinen tyyppi: odotettiin ${o}, oli ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Virheellinen syöte: täytyy olla ${j(r.values[0])}` : `Virheellinen valinta: täytyy olla yksi seuraavista: ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Liian suuri: ${a.subject} täytyy olla ${o}${r.maximum.toString()} ${a.unit}`.trim() : `Liian suuri: arvon täytyy olla ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Liian pieni: ${a.subject} täytyy olla ${o}${r.minimum.toString()} ${a.unit}`.trim() : `Liian pieni: arvon täytyy olla ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Virheellinen syöte: täytyy alkaa "${o.prefix}"` : o.format === "ends_with" ? `Virheellinen syöte: täytyy loppua "${o.suffix}"` : o.format === "includes" ? `Virheellinen syöte: täytyy sisältää "${o.includes}"` : o.format === "regex" ? `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${o.pattern}` : `Virheellinen ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Virheellinen luku: täytyy olla luvun ${r.divisor} monikerta`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return "Virheellinen avain tietueessa";
      case "invalid_union":
        return "Virheellinen unioni";
      case "invalid_element":
        return "Virheellinen arvo joukossa";
      default:
        return "Virheellinen syöte";
    }
  };
};
function $3() {
  return {
    localeError: v3()
  };
}
const _3 = () => {
  const e = {
    string: { unit: "caractères", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "éléments", verb: "avoir" },
    set: { unit: "éléments", verb: "avoir" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "entrée",
    email: "adresse e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date et heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "durée ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "chaîne encodée en base64",
    base64url: "chaîne encodée en base64url",
    json_string: "chaîne JSON",
    e164: "numéro E.164",
    jwt: "JWT",
    template_literal: "entrée"
  }, i = {
    string: "chaîne",
    number: "nombre",
    int: "entier",
    boolean: "booléen",
    bigint: "grand entier",
    symbol: "symbole",
    undefined: "indéfini",
    null: "null",
    never: "jamais",
    void: "vide",
    date: "date",
    array: "tableau",
    object: "objet",
    tuple: "tuple",
    record: "enregistrement",
    map: "carte",
    set: "ensemble",
    file: "fichier",
    nonoptional: "non-optionnel",
    nan: "NaN",
    function: "fonction"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Entrée invalide : instanceof ${r.expected} attendu, ${s} reçu` : `Entrée invalide : ${o} attendu, ${s} reçu`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entrée invalide : ${j(r.values[0])} attendu` : `Option invalide : une valeur parmi ${T(r.values, "|")} attendue`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Trop grand : ${i[r.origin] ?? "valeur"} doit ${a.verb} ${o}${r.maximum.toString()} ${a.unit ?? "élément(s)"}` : `Trop grand : ${i[r.origin] ?? "valeur"} doit être ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Trop petit : ${i[r.origin] ?? "valeur"} doit ${a.verb} ${o}${r.minimum.toString()} ${a.unit}` : `Trop petit : ${i[r.origin] ?? "valeur"} doit être ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Chaîne invalide : doit commencer par "${o.prefix}"` : o.format === "ends_with" ? `Chaîne invalide : doit se terminer par "${o.suffix}"` : o.format === "includes" ? `Chaîne invalide : doit inclure "${o.includes}"` : o.format === "regex" ? `Chaîne invalide : doit correspondre au modèle ${o.pattern}` : `${n[o.format] ?? r.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${r.divisor}`;
      case "unrecognized_keys":
        return `Clé${r.keys.length > 1 ? "s" : ""} non reconnue${r.keys.length > 1 ? "s" : ""} : ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${r.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${r.origin}`;
      default:
        return "Entrée invalide";
    }
  };
};
function y3() {
  return {
    localeError: _3()
  };
}
const b3 = () => {
  const e = {
    string: { unit: "caractères", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "éléments", verb: "avoir" },
    set: { unit: "éléments", verb: "avoir" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "entrée",
    email: "adresse courriel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date-heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "durée ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "chaîne encodée en base64",
    base64url: "chaîne encodée en base64url",
    json_string: "chaîne JSON",
    e164: "numéro E.164",
    jwt: "JWT",
    template_literal: "entrée"
  }, i = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Entrée invalide : attendu instanceof ${r.expected}, reçu ${s}` : `Entrée invalide : attendu ${o}, reçu ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entrée invalide : attendu ${j(r.values[0])}` : `Option invalide : attendu l'une des valeurs suivantes ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "≤" : "<", a = t(r.origin);
        return a ? `Trop grand : attendu que ${r.origin ?? "la valeur"} ait ${o}${r.maximum.toString()} ${a.unit}` : `Trop grand : attendu que ${r.origin ?? "la valeur"} soit ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? "≥" : ">", a = t(r.origin);
        return a ? `Trop petit : attendu que ${r.origin} ait ${o}${r.minimum.toString()} ${a.unit}` : `Trop petit : attendu que ${r.origin} soit ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Chaîne invalide : doit commencer par "${o.prefix}"` : o.format === "ends_with" ? `Chaîne invalide : doit se terminer par "${o.suffix}"` : o.format === "includes" ? `Chaîne invalide : doit inclure "${o.includes}"` : o.format === "regex" ? `Chaîne invalide : doit correspondre au motif ${o.pattern}` : `${n[o.format] ?? r.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${r.divisor}`;
      case "unrecognized_keys":
        return `Clé${r.keys.length > 1 ? "s" : ""} non reconnue${r.keys.length > 1 ? "s" : ""} : ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${r.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${r.origin}`;
      default:
        return "Entrée invalide";
    }
  };
};
function S3() {
  return {
    localeError: b3()
  };
}
const k3 = () => {
  const e = {
    string: { label: "מחרוזת", gender: "f" },
    number: { label: "מספר", gender: "m" },
    boolean: { label: "ערך בוליאני", gender: "m" },
    bigint: { label: "BigInt", gender: "m" },
    date: { label: "תאריך", gender: "m" },
    array: { label: "מערך", gender: "m" },
    object: { label: "אובייקט", gender: "m" },
    null: { label: "ערך ריק (null)", gender: "m" },
    undefined: { label: "ערך לא מוגדר (undefined)", gender: "m" },
    symbol: { label: "סימבול (Symbol)", gender: "m" },
    function: { label: "פונקציה", gender: "f" },
    map: { label: "מפה (Map)", gender: "f" },
    set: { label: "קבוצה (Set)", gender: "f" },
    file: { label: "קובץ", gender: "m" },
    promise: { label: "Promise", gender: "m" },
    NaN: { label: "NaN", gender: "m" },
    unknown: { label: "ערך לא ידוע", gender: "m" },
    value: { label: "ערך", gender: "m" }
  }, t = {
    string: { unit: "תווים", shortLabel: "קצר", longLabel: "ארוך" },
    file: { unit: "בייטים", shortLabel: "קטן", longLabel: "גדול" },
    array: { unit: "פריטים", shortLabel: "קטן", longLabel: "גדול" },
    set: { unit: "פריטים", shortLabel: "קטן", longLabel: "גדול" },
    number: { unit: "", shortLabel: "קטן", longLabel: "גדול" }
    // no unit
  }, n = (p) => p ? e[p] : void 0, i = (p) => {
    const f = n(p);
    return f ? f.label : p ?? e.unknown.label;
  }, r = (p) => `ה${i(p)}`, o = (p) => (n(p)?.gender ?? "m") === "f" ? "צריכה להיות" : "צריך להיות", a = (p) => p ? t[p] ?? null : null, s = {
    regex: { label: "קלט", gender: "m" },
    email: { label: "כתובת אימייל", gender: "f" },
    url: { label: "כתובת רשת", gender: "f" },
    emoji: { label: "אימוג'י", gender: "m" },
    uuid: { label: "UUID", gender: "m" },
    nanoid: { label: "nanoid", gender: "m" },
    guid: { label: "GUID", gender: "m" },
    cuid: { label: "cuid", gender: "m" },
    cuid2: { label: "cuid2", gender: "m" },
    ulid: { label: "ULID", gender: "m" },
    xid: { label: "XID", gender: "m" },
    ksuid: { label: "KSUID", gender: "m" },
    datetime: { label: "תאריך וזמן ISO", gender: "m" },
    date: { label: "תאריך ISO", gender: "m" },
    time: { label: "זמן ISO", gender: "m" },
    duration: { label: "משך זמן ISO", gender: "m" },
    ipv4: { label: "כתובת IPv4", gender: "f" },
    ipv6: { label: "כתובת IPv6", gender: "f" },
    cidrv4: { label: "טווח IPv4", gender: "m" },
    cidrv6: { label: "טווח IPv6", gender: "m" },
    base64: { label: "מחרוזת בבסיס 64", gender: "f" },
    base64url: { label: "מחרוזת בבסיס 64 לכתובות רשת", gender: "f" },
    json_string: { label: "מחרוזת JSON", gender: "f" },
    e164: { label: "מספר E.164", gender: "m" },
    jwt: { label: "JWT", gender: "m" },
    ends_with: { label: "קלט", gender: "m" },
    includes: { label: "קלט", gender: "m" },
    lowercase: { label: "קלט", gender: "m" },
    starts_with: { label: "קלט", gender: "m" },
    uppercase: { label: "קלט", gender: "m" }
  }, d = {
    nan: "NaN"
  };
  return (p) => {
    switch (p.code) {
      case "invalid_type": {
        const f = p.expected, h = d[f ?? ""] ?? i(f), c = Z(p.input), u = d[c] ?? e[c]?.label ?? c;
        return /^[A-Z]/.test(p.expected) ? `קלט לא תקין: צריך להיות instanceof ${p.expected}, התקבל ${u}` : `קלט לא תקין: צריך להיות ${h}, התקבל ${u}`;
      }
      case "invalid_value": {
        if (p.values.length === 1)
          return `ערך לא תקין: הערך חייב להיות ${j(p.values[0])}`;
        const f = p.values.map((u) => j(u));
        if (p.values.length === 2)
          return `ערך לא תקין: האפשרויות המתאימות הן ${f[0]} או ${f[1]}`;
        const h = f[f.length - 1];
        return `ערך לא תקין: האפשרויות המתאימות הן ${f.slice(0, -1).join(", ")} או ${h}`;
      }
      case "too_big": {
        const f = a(p.origin), h = r(p.origin ?? "value");
        if (p.origin === "string")
          return `${f?.longLabel ?? "ארוך"} מדי: ${h} צריכה להכיל ${p.maximum.toString()} ${f?.unit ?? ""} ${p.inclusive ? "או פחות" : "לכל היותר"}`.trim();
        if (p.origin === "number") {
          const l = p.inclusive ? `קטן או שווה ל-${p.maximum}` : `קטן מ-${p.maximum}`;
          return `גדול מדי: ${h} צריך להיות ${l}`;
        }
        if (p.origin === "array" || p.origin === "set") {
          const l = p.origin === "set" ? "צריכה" : "צריך", m = p.inclusive ? `${p.maximum} ${f?.unit ?? ""} או פחות` : `פחות מ-${p.maximum} ${f?.unit ?? ""}`;
          return `גדול מדי: ${h} ${l} להכיל ${m}`.trim();
        }
        const c = p.inclusive ? "<=" : "<", u = o(p.origin ?? "value");
        return f?.unit ? `${f.longLabel} מדי: ${h} ${u} ${c}${p.maximum.toString()} ${f.unit}` : `${f?.longLabel ?? "גדול"} מדי: ${h} ${u} ${c}${p.maximum.toString()}`;
      }
      case "too_small": {
        const f = a(p.origin), h = r(p.origin ?? "value");
        if (p.origin === "string")
          return `${f?.shortLabel ?? "קצר"} מדי: ${h} צריכה להכיל ${p.minimum.toString()} ${f?.unit ?? ""} ${p.inclusive ? "או יותר" : "לפחות"}`.trim();
        if (p.origin === "number") {
          const l = p.inclusive ? `גדול או שווה ל-${p.minimum}` : `גדול מ-${p.minimum}`;
          return `קטן מדי: ${h} צריך להיות ${l}`;
        }
        if (p.origin === "array" || p.origin === "set") {
          const l = p.origin === "set" ? "צריכה" : "צריך";
          if (p.minimum === 1 && p.inclusive) {
            const g = (p.origin === "set", "לפחות פריט אחד");
            return `קטן מדי: ${h} ${l} להכיל ${g}`;
          }
          const m = p.inclusive ? `${p.minimum} ${f?.unit ?? ""} או יותר` : `יותר מ-${p.minimum} ${f?.unit ?? ""}`;
          return `קטן מדי: ${h} ${l} להכיל ${m}`.trim();
        }
        const c = p.inclusive ? ">=" : ">", u = o(p.origin ?? "value");
        return f?.unit ? `${f.shortLabel} מדי: ${h} ${u} ${c}${p.minimum.toString()} ${f.unit}` : `${f?.shortLabel ?? "קטן"} מדי: ${h} ${u} ${c}${p.minimum.toString()}`;
      }
      case "invalid_format": {
        const f = p;
        if (f.format === "starts_with")
          return `המחרוזת חייבת להתחיל ב "${f.prefix}"`;
        if (f.format === "ends_with")
          return `המחרוזת חייבת להסתיים ב "${f.suffix}"`;
        if (f.format === "includes")
          return `המחרוזת חייבת לכלול "${f.includes}"`;
        if (f.format === "regex")
          return `המחרוזת חייבת להתאים לתבנית ${f.pattern}`;
        const h = s[f.format], c = h?.label ?? f.format, l = (h?.gender ?? "m") === "f" ? "תקינה" : "תקין";
        return `${c} לא ${l}`;
      }
      case "not_multiple_of":
        return `מספר לא תקין: חייב להיות מכפלה של ${p.divisor}`;
      case "unrecognized_keys":
        return `מפתח${p.keys.length > 1 ? "ות" : ""} לא מזוה${p.keys.length > 1 ? "ים" : "ה"}: ${T(p.keys, ", ")}`;
      case "invalid_key":
        return "שדה לא תקין באובייקט";
      case "invalid_union":
        return "קלט לא תקין";
      case "invalid_element":
        return `ערך לא תקין ב${r(p.origin ?? "array")}`;
      default:
        return "קלט לא תקין";
    }
  };
};
function w3() {
  return {
    localeError: k3()
  };
}
const I3 = () => {
  const e = {
    string: { unit: "znakova", verb: "imati" },
    file: { unit: "bajtova", verb: "imati" },
    array: { unit: "stavki", verb: "imati" },
    set: { unit: "stavki", verb: "imati" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "unos",
    email: "email adresa",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum i vrijeme",
    date: "ISO datum",
    time: "ISO vrijeme",
    duration: "ISO trajanje",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    cidrv4: "IPv4 raspon",
    cidrv6: "IPv6 raspon",
    base64: "base64 kodirani tekst",
    base64url: "base64url kodirani tekst",
    json_string: "JSON tekst",
    e164: "E.164 broj",
    jwt: "JWT",
    template_literal: "unos"
  }, i = {
    nan: "NaN",
    string: "tekst",
    number: "broj",
    boolean: "boolean",
    array: "niz",
    object: "objekt",
    set: "skup",
    file: "datoteka",
    date: "datum",
    bigint: "bigint",
    symbol: "simbol",
    undefined: "undefined",
    null: "null",
    function: "funkcija",
    map: "mapa"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Neispravan unos: očekuje se instanceof ${r.expected}, a primljeno je ${s}` : `Neispravan unos: očekuje se ${o}, a primljeno je ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Neispravna vrijednost: očekivano ${j(r.values[0])}` : `Neispravna opcija: očekivano jedno od ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin), s = i[r.origin] ?? r.origin;
        return a ? `Preveliko: očekivano da ${s ?? "vrijednost"} ima ${o}${r.maximum.toString()} ${a.unit ?? "elemenata"}` : `Preveliko: očekivano da ${s ?? "vrijednost"} bude ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin), s = i[r.origin] ?? r.origin;
        return a ? `Premalo: očekivano da ${s} ima ${o}${r.minimum.toString()} ${a.unit}` : `Premalo: očekivano da ${s} bude ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Neispravan tekst: mora započinjati s "${o.prefix}"` : o.format === "ends_with" ? `Neispravan tekst: mora završavati s "${o.suffix}"` : o.format === "includes" ? `Neispravan tekst: mora sadržavati "${o.includes}"` : o.format === "regex" ? `Neispravan tekst: mora odgovarati uzorku ${o.pattern}` : `Neispravna ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Neispravan broj: mora biti višekratnik od ${r.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznat${r.keys.length > 1 ? "i ključevi" : " ključ"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Neispravan ključ u ${i[r.origin] ?? r.origin}`;
      case "invalid_union":
        return "Neispravan unos";
      case "invalid_element":
        return `Neispravna vrijednost u ${i[r.origin] ?? r.origin}`;
      default:
        return "Neispravan unos";
    }
  };
};
function x3() {
  return {
    localeError: I3()
  };
}
const O3 = () => {
  const e = {
    string: { unit: "karakter", verb: "legyen" },
    file: { unit: "byte", verb: "legyen" },
    array: { unit: "elem", verb: "legyen" },
    set: { unit: "elem", verb: "legyen" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "bemenet",
    email: "email cím",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO időbélyeg",
    date: "ISO dátum",
    time: "ISO idő",
    duration: "ISO időintervallum",
    ipv4: "IPv4 cím",
    ipv6: "IPv6 cím",
    cidrv4: "IPv4 tartomány",
    cidrv6: "IPv6 tartomány",
    base64: "base64-kódolt string",
    base64url: "base64url-kódolt string",
    json_string: "JSON string",
    e164: "E.164 szám",
    jwt: "JWT",
    template_literal: "bemenet"
  }, i = {
    nan: "NaN",
    number: "szám",
    array: "tömb"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Érvénytelen bemenet: a várt érték instanceof ${r.expected}, a kapott érték ${s}` : `Érvénytelen bemenet: a várt érték ${o}, a kapott érték ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Érvénytelen bemenet: a várt érték ${j(r.values[0])}` : `Érvénytelen opció: valamelyik érték várt ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Túl nagy: ${r.origin ?? "érték"} mérete túl nagy ${o}${r.maximum.toString()} ${a.unit ?? "elem"}` : `Túl nagy: a bemeneti érték ${r.origin ?? "érték"} túl nagy: ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Túl kicsi: a bemeneti érték ${r.origin} mérete túl kicsi ${o}${r.minimum.toString()} ${a.unit}` : `Túl kicsi: a bemeneti érték ${r.origin} túl kicsi ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Érvénytelen string: "${o.prefix}" értékkel kell kezdődnie` : o.format === "ends_with" ? `Érvénytelen string: "${o.suffix}" értékkel kell végződnie` : o.format === "includes" ? `Érvénytelen string: "${o.includes}" értéket kell tartalmaznia` : o.format === "regex" ? `Érvénytelen string: ${o.pattern} mintának kell megfelelnie` : `Érvénytelen ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Érvénytelen szám: ${r.divisor} többszörösének kell lennie`;
      case "unrecognized_keys":
        return `Ismeretlen kulcs${r.keys.length > 1 ? "s" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Érvénytelen kulcs ${r.origin}`;
      case "invalid_union":
        return "Érvénytelen bemenet";
      case "invalid_element":
        return `Érvénytelen érték: ${r.origin}`;
      default:
        return "Érvénytelen bemenet";
    }
  };
};
function E3() {
  return {
    localeError: O3()
  };
}
function Dl(e, t, n) {
  return Math.abs(e) === 1 ? t : n;
}
function Gt(e) {
  if (!e)
    return "";
  const t = ["ա", "ե", "ը", "ի", "ո", "ու", "օ"], n = e[e.length - 1];
  return e + (t.includes(n) ? "ն" : "ը");
}
const P3 = () => {
  const e = {
    string: {
      unit: {
        one: "նշան",
        many: "նշաններ"
      },
      verb: "ունենալ"
    },
    file: {
      unit: {
        one: "բայթ",
        many: "բայթեր"
      },
      verb: "ունենալ"
    },
    array: {
      unit: {
        one: "տարր",
        many: "տարրեր"
      },
      verb: "ունենալ"
    },
    set: {
      unit: {
        one: "տարր",
        many: "տարրեր"
      },
      verb: "ունենալ"
    }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "մուտք",
    email: "էլ. հասցե",
    url: "URL",
    emoji: "էմոջի",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO ամսաթիվ և ժամ",
    date: "ISO ամսաթիվ",
    time: "ISO ժամ",
    duration: "ISO տևողություն",
    ipv4: "IPv4 հասցե",
    ipv6: "IPv6 հասցե",
    cidrv4: "IPv4 միջակայք",
    cidrv6: "IPv6 միջակայք",
    base64: "base64 ձևաչափով տող",
    base64url: "base64url ձևաչափով տող",
    json_string: "JSON տող",
    e164: "E.164 համար",
    jwt: "JWT",
    template_literal: "մուտք"
  }, i = {
    nan: "NaN",
    number: "թիվ",
    array: "զանգված"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Սխալ մուտքագրում․ սպասվում էր instanceof ${r.expected}, ստացվել է ${s}` : `Սխալ մուտքագրում․ սպասվում էր ${o}, ստացվել է ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Սխալ մուտքագրում․ սպասվում էր ${j(r.values[1])}` : `Սխալ տարբերակ․ սպասվում էր հետևյալներից մեկը՝ ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        if (a) {
          const s = Number(r.maximum), d = Dl(s, a.unit.one, a.unit.many);
          return `Չափազանց մեծ արժեք․ սպասվում է, որ ${Gt(r.origin ?? "արժեք")} կունենա ${o}${r.maximum.toString()} ${d}`;
        }
        return `Չափազանց մեծ արժեք․ սպասվում է, որ ${Gt(r.origin ?? "արժեք")} լինի ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        if (a) {
          const s = Number(r.minimum), d = Dl(s, a.unit.one, a.unit.many);
          return `Չափազանց փոքր արժեք․ սպասվում է, որ ${Gt(r.origin)} կունենա ${o}${r.minimum.toString()} ${d}`;
        }
        return `Չափազանց փոքր արժեք․ սպասվում է, որ ${Gt(r.origin)} լինի ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Սխալ տող․ պետք է սկսվի "${o.prefix}"-ով` : o.format === "ends_with" ? `Սխալ տող․ պետք է ավարտվի "${o.suffix}"-ով` : o.format === "includes" ? `Սխալ տող․ պետք է պարունակի "${o.includes}"` : o.format === "regex" ? `Սխալ տող․ պետք է համապատասխանի ${o.pattern} ձևաչափին` : `Սխալ ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Սխալ թիվ․ պետք է բազմապատիկ լինի ${r.divisor}-ի`;
      case "unrecognized_keys":
        return `Չճանաչված բանալի${r.keys.length > 1 ? "ներ" : ""}. ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Սխալ բանալի ${Gt(r.origin)}-ում`;
      case "invalid_union":
        return "Սխալ մուտքագրում";
      case "invalid_element":
        return `Սխալ արժեք ${Gt(r.origin)}-ում`;
      default:
        return "Սխալ մուտքագրում";
    }
  };
};
function N3() {
  return {
    localeError: P3()
  };
}
const T3 = () => {
  const e = {
    string: { unit: "karakter", verb: "memiliki" },
    file: { unit: "byte", verb: "memiliki" },
    array: { unit: "item", verb: "memiliki" },
    set: { unit: "item", verb: "memiliki" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "alamat email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tanggal dan waktu format ISO",
    date: "tanggal format ISO",
    time: "jam format ISO",
    duration: "durasi format ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "rentang alamat IPv4",
    cidrv6: "rentang alamat IPv6",
    base64: "string dengan enkode base64",
    base64url: "string dengan enkode base64url",
    json_string: "string JSON",
    e164: "angka E.164",
    jwt: "JWT",
    template_literal: "input"
  }, i = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Input tidak valid: diharapkan instanceof ${r.expected}, diterima ${s}` : `Input tidak valid: diharapkan ${o}, diterima ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Input tidak valid: diharapkan ${j(r.values[0])}` : `Pilihan tidak valid: diharapkan salah satu dari ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Terlalu besar: diharapkan ${r.origin ?? "value"} memiliki ${o}${r.maximum.toString()} ${a.unit ?? "elemen"}` : `Terlalu besar: diharapkan ${r.origin ?? "value"} menjadi ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Terlalu kecil: diharapkan ${r.origin} memiliki ${o}${r.minimum.toString()} ${a.unit}` : `Terlalu kecil: diharapkan ${r.origin} menjadi ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `String tidak valid: harus dimulai dengan "${o.prefix}"` : o.format === "ends_with" ? `String tidak valid: harus berakhir dengan "${o.suffix}"` : o.format === "includes" ? `String tidak valid: harus menyertakan "${o.includes}"` : o.format === "regex" ? `String tidak valid: harus sesuai pola ${o.pattern}` : `${n[o.format] ?? r.format} tidak valid`;
      }
      case "not_multiple_of":
        return `Angka tidak valid: harus kelipatan dari ${r.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali ${r.keys.length > 1 ? "s" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak valid di ${r.origin}`;
      case "invalid_union":
        return "Input tidak valid";
      case "invalid_element":
        return `Nilai tidak valid di ${r.origin}`;
      default:
        return "Input tidak valid";
    }
  };
};
function z3() {
  return {
    localeError: T3()
  };
}
const A3 = () => {
  const e = {
    string: { unit: "stafi", verb: "að hafa" },
    file: { unit: "bæti", verb: "að hafa" },
    array: { unit: "hluti", verb: "að hafa" },
    set: { unit: "hluti", verb: "að hafa" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "gildi",
    email: "netfang",
    url: "vefslóð",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dagsetning og tími",
    date: "ISO dagsetning",
    time: "ISO tími",
    duration: "ISO tímalengd",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded strengur",
    base64url: "base64url-encoded strengur",
    json_string: "JSON strengur",
    e164: "E.164 tölugildi",
    jwt: "JWT",
    template_literal: "gildi"
  }, i = {
    nan: "NaN",
    number: "númer",
    array: "fylki"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Rangt gildi: Þú slóst inn ${s} þar sem á að vera instanceof ${r.expected}` : `Rangt gildi: Þú slóst inn ${s} þar sem á að vera ${o}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Rangt gildi: gert ráð fyrir ${j(r.values[0])}` : `Ógilt val: má vera eitt af eftirfarandi ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Of stórt: gert er ráð fyrir að ${r.origin ?? "gildi"} hafi ${o}${r.maximum.toString()} ${a.unit ?? "hluti"}` : `Of stórt: gert er ráð fyrir að ${r.origin ?? "gildi"} sé ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Of lítið: gert er ráð fyrir að ${r.origin} hafi ${o}${r.minimum.toString()} ${a.unit}` : `Of lítið: gert er ráð fyrir að ${r.origin} sé ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Ógildur strengur: verður að byrja á "${o.prefix}"` : o.format === "ends_with" ? `Ógildur strengur: verður að enda á "${o.suffix}"` : o.format === "includes" ? `Ógildur strengur: verður að innihalda "${o.includes}"` : o.format === "regex" ? `Ógildur strengur: verður að fylgja mynstri ${o.pattern}` : `Rangt ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Röng tala: verður að vera margfeldi af ${r.divisor}`;
      case "unrecognized_keys":
        return `Óþekkt ${r.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Rangur lykill í ${r.origin}`;
      case "invalid_union":
        return "Rangt gildi";
      case "invalid_element":
        return `Rangt gildi í ${r.origin}`;
      default:
        return "Rangt gildi";
    }
  };
};
function D3() {
  return {
    localeError: A3()
  };
}
const C3 = () => {
  const e = {
    string: { unit: "caratteri", verb: "avere" },
    file: { unit: "byte", verb: "avere" },
    array: { unit: "elementi", verb: "avere" },
    set: { unit: "elementi", verb: "avere" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "indirizzo email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e ora ISO",
    date: "data ISO",
    time: "ora ISO",
    duration: "durata ISO",
    ipv4: "indirizzo IPv4",
    ipv6: "indirizzo IPv6",
    cidrv4: "intervallo IPv4",
    cidrv6: "intervallo IPv6",
    base64: "stringa codificata in base64",
    base64url: "URL codificata in base64",
    json_string: "stringa JSON",
    e164: "numero E.164",
    jwt: "JWT",
    template_literal: "input"
  }, i = {
    nan: "NaN",
    number: "numero",
    array: "vettore"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Input non valido: atteso instanceof ${r.expected}, ricevuto ${s}` : `Input non valido: atteso ${o}, ricevuto ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Input non valido: atteso ${j(r.values[0])}` : `Opzione non valida: atteso uno tra ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Troppo grande: ${r.origin ?? "valore"} deve avere ${o}${r.maximum.toString()} ${a.unit ?? "elementi"}` : `Troppo grande: ${r.origin ?? "valore"} deve essere ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Troppo piccolo: ${r.origin} deve avere ${o}${r.minimum.toString()} ${a.unit}` : `Troppo piccolo: ${r.origin} deve essere ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Stringa non valida: deve iniziare con "${o.prefix}"` : o.format === "ends_with" ? `Stringa non valida: deve terminare con "${o.suffix}"` : o.format === "includes" ? `Stringa non valida: deve includere "${o.includes}"` : o.format === "regex" ? `Stringa non valida: deve corrispondere al pattern ${o.pattern}` : `Input non valido: ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Numero non valido: deve essere un multiplo di ${r.divisor}`;
      case "unrecognized_keys":
        return `Chiav${r.keys.length > 1 ? "i" : "e"} non riconosciut${r.keys.length > 1 ? "e" : "a"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Chiave non valida in ${r.origin}`;
      case "invalid_union":
        return "Input non valido";
      case "invalid_element":
        return `Valore non valido in ${r.origin}`;
      default:
        return "Input non valido";
    }
  };
};
function U3() {
  return {
    localeError: C3()
  };
}
const R3 = () => {
  const e = {
    string: { unit: "文字", verb: "である" },
    file: { unit: "バイト", verb: "である" },
    array: { unit: "要素", verb: "である" },
    set: { unit: "要素", verb: "である" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "入力値",
    email: "メールアドレス",
    url: "URL",
    emoji: "絵文字",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO日時",
    date: "ISO日付",
    time: "ISO時刻",
    duration: "ISO期間",
    ipv4: "IPv4アドレス",
    ipv6: "IPv6アドレス",
    cidrv4: "IPv4範囲",
    cidrv6: "IPv6範囲",
    base64: "base64エンコード文字列",
    base64url: "base64urlエンコード文字列",
    json_string: "JSON文字列",
    e164: "E.164番号",
    jwt: "JWT",
    template_literal: "入力値"
  }, i = {
    nan: "NaN",
    number: "数値",
    array: "配列"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `無効な入力: instanceof ${r.expected}が期待されましたが、${s}が入力されました` : `無効な入力: ${o}が期待されましたが、${s}が入力されました`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `無効な入力: ${j(r.values[0])}が期待されました` : `無効な選択: ${T(r.values, "、")}のいずれかである必要があります`;
      case "too_big": {
        const o = r.inclusive ? "以下である" : "より小さい", a = t(r.origin);
        return a ? `大きすぎる値: ${r.origin ?? "値"}は${r.maximum.toString()}${a.unit ?? "要素"}${o}必要があります` : `大きすぎる値: ${r.origin ?? "値"}は${r.maximum.toString()}${o}必要があります`;
      }
      case "too_small": {
        const o = r.inclusive ? "以上である" : "より大きい", a = t(r.origin);
        return a ? `小さすぎる値: ${r.origin}は${r.minimum.toString()}${a.unit}${o}必要があります` : `小さすぎる値: ${r.origin}は${r.minimum.toString()}${o}必要があります`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `無効な文字列: "${o.prefix}"で始まる必要があります` : o.format === "ends_with" ? `無効な文字列: "${o.suffix}"で終わる必要があります` : o.format === "includes" ? `無効な文字列: "${o.includes}"を含む必要があります` : o.format === "regex" ? `無効な文字列: パターン${o.pattern}に一致する必要があります` : `無効な${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `無効な数値: ${r.divisor}の倍数である必要があります`;
      case "unrecognized_keys":
        return `認識されていないキー${r.keys.length > 1 ? "群" : ""}: ${T(r.keys, "、")}`;
      case "invalid_key":
        return `${r.origin}内の無効なキー`;
      case "invalid_union":
        return "無効な入力";
      case "invalid_element":
        return `${r.origin}内の無効な値`;
      default:
        return "無効な入力";
    }
  };
};
function L3() {
  return {
    localeError: R3()
  };
}
const j3 = () => {
  const e = {
    string: { unit: "სიმბოლო", verb: "უნდა შეიცავდეს" },
    file: { unit: "ბაიტი", verb: "უნდა შეიცავდეს" },
    array: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" },
    set: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "შეყვანა",
    email: "ელ-ფოსტის მისამართი",
    url: "URL",
    emoji: "ემოჯი",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "თარიღი-დრო",
    date: "თარიღი",
    time: "დრო",
    duration: "ხანგრძლივობა",
    ipv4: "IPv4 მისამართი",
    ipv6: "IPv6 მისამართი",
    cidrv4: "IPv4 დიაპაზონი",
    cidrv6: "IPv6 დიაპაზონი",
    base64: "base64-კოდირებული ველი",
    base64url: "base64url-კოდირებული ველი",
    json_string: "JSON ველი",
    e164: "E.164 ნომერი",
    jwt: "JWT",
    template_literal: "შეყვანა"
  }, i = {
    nan: "NaN",
    number: "რიცხვი",
    string: "ველი",
    boolean: "ბულეანი",
    function: "ფუნქცია",
    array: "მასივი"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `არასწორი შეყვანა: მოსალოდნელი instanceof ${r.expected}, მიღებული ${s}` : `არასწორი შეყვანა: მოსალოდნელი ${o}, მიღებული ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `არასწორი შეყვანა: მოსალოდნელი ${j(r.values[0])}` : `არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${T(r.values, "|")}-დან`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `ზედმეტად დიდი: მოსალოდნელი ${r.origin ?? "მნიშვნელობა"} ${a.verb} ${o}${r.maximum.toString()} ${a.unit}` : `ზედმეტად დიდი: მოსალოდნელი ${r.origin ?? "მნიშვნელობა"} იყოს ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `ზედმეტად პატარა: მოსალოდნელი ${r.origin} ${a.verb} ${o}${r.minimum.toString()} ${a.unit}` : `ზედმეტად პატარა: მოსალოდნელი ${r.origin} იყოს ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `არასწორი ველი: უნდა იწყებოდეს "${o.prefix}"-ით` : o.format === "ends_with" ? `არასწორი ველი: უნდა მთავრდებოდეს "${o.suffix}"-ით` : o.format === "includes" ? `არასწორი ველი: უნდა შეიცავდეს "${o.includes}"-ს` : o.format === "regex" ? `არასწორი ველი: უნდა შეესაბამებოდეს შაბლონს ${o.pattern}` : `არასწორი ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `არასწორი რიცხვი: უნდა იყოს ${r.divisor}-ის ჯერადი`;
      case "unrecognized_keys":
        return `უცნობი გასაღებ${r.keys.length > 1 ? "ები" : "ი"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `არასწორი გასაღები ${r.origin}-ში`;
      case "invalid_union":
        return "არასწორი შეყვანა";
      case "invalid_element":
        return `არასწორი მნიშვნელობა ${r.origin}-ში`;
      default:
        return "არასწორი შეყვანა";
    }
  };
};
function M3() {
  return {
    localeError: j3()
  };
}
const Z3 = () => {
  const e = {
    string: { unit: "តួអក្សរ", verb: "គួរមាន" },
    file: { unit: "បៃ", verb: "គួរមាន" },
    array: { unit: "ធាតុ", verb: "គួរមាន" },
    set: { unit: "ធាតុ", verb: "គួរមាន" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ទិន្នន័យបញ្ចូល",
    email: "អាសយដ្ឋានអ៊ីមែល",
    url: "URL",
    emoji: "សញ្ញាអារម្មណ៍",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "កាលបរិច្ឆេទ និងម៉ោង ISO",
    date: "កាលបរិច្ឆេទ ISO",
    time: "ម៉ោង ISO",
    duration: "រយៈពេល ISO",
    ipv4: "អាសយដ្ឋាន IPv4",
    ipv6: "អាសយដ្ឋាន IPv6",
    cidrv4: "ដែនអាសយដ្ឋាន IPv4",
    cidrv6: "ដែនអាសយដ្ឋាន IPv6",
    base64: "ខ្សែអក្សរអ៊ិកូដ base64",
    base64url: "ខ្សែអក្សរអ៊ិកូដ base64url",
    json_string: "ខ្សែអក្សរ JSON",
    e164: "លេខ E.164",
    jwt: "JWT",
    template_literal: "ទិន្នន័យបញ្ចូល"
  }, i = {
    nan: "NaN",
    number: "លេខ",
    array: "អារេ (Array)",
    null: "គ្មានតម្លៃ (null)"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ instanceof ${r.expected} ប៉ុន្តែទទួលបាន ${s}` : `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${o} ប៉ុន្តែទទួលបាន ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${j(r.values[0])}` : `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `ធំពេក៖ ត្រូវការ ${r.origin ?? "តម្លៃ"} ${o} ${r.maximum.toString()} ${a.unit ?? "ធាតុ"}` : `ធំពេក៖ ត្រូវការ ${r.origin ?? "តម្លៃ"} ${o} ${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `តូចពេក៖ ត្រូវការ ${r.origin} ${o} ${r.minimum.toString()} ${a.unit}` : `តូចពេក៖ ត្រូវការ ${r.origin} ${o} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${o.prefix}"` : o.format === "ends_with" ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${o.suffix}"` : o.format === "includes" ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${o.includes}"` : o.format === "regex" ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${o.pattern}` : `មិនត្រឹមត្រូវ៖ ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${r.divisor}`;
      case "unrecognized_keys":
        return `រកឃើញសោមិនស្គាល់៖ ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `សោមិនត្រឹមត្រូវនៅក្នុង ${r.origin}`;
      case "invalid_union":
        return "ទិន្នន័យមិនត្រឹមត្រូវ";
      case "invalid_element":
        return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${r.origin}`;
      default:
        return "ទិន្នន័យមិនត្រឹមត្រូវ";
    }
  };
};
function Cp() {
  return {
    localeError: Z3()
  };
}
function F3() {
  return Cp();
}
const B3 = () => {
  const e = {
    string: { unit: "문자", verb: "to have" },
    file: { unit: "바이트", verb: "to have" },
    array: { unit: "개", verb: "to have" },
    set: { unit: "개", verb: "to have" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "입력",
    email: "이메일 주소",
    url: "URL",
    emoji: "이모지",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO 날짜시간",
    date: "ISO 날짜",
    time: "ISO 시간",
    duration: "ISO 기간",
    ipv4: "IPv4 주소",
    ipv6: "IPv6 주소",
    cidrv4: "IPv4 범위",
    cidrv6: "IPv6 범위",
    base64: "base64 인코딩 문자열",
    base64url: "base64url 인코딩 문자열",
    json_string: "JSON 문자열",
    e164: "E.164 번호",
    jwt: "JWT",
    template_literal: "입력"
  }, i = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `잘못된 입력: 예상 타입은 instanceof ${r.expected}, 받은 타입은 ${s}입니다` : `잘못된 입력: 예상 타입은 ${o}, 받은 타입은 ${s}입니다`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `잘못된 입력: 값은 ${j(r.values[0])} 이어야 합니다` : `잘못된 옵션: ${T(r.values, "또는 ")} 중 하나여야 합니다`;
      case "too_big": {
        const o = r.inclusive ? "이하" : "미만", a = o === "미만" ? "이어야 합니다" : "여야 합니다", s = t(r.origin), d = s?.unit ?? "요소";
        return s ? `${r.origin ?? "값"}이 너무 큽니다: ${r.maximum.toString()}${d} ${o}${a}` : `${r.origin ?? "값"}이 너무 큽니다: ${r.maximum.toString()} ${o}${a}`;
      }
      case "too_small": {
        const o = r.inclusive ? "이상" : "초과", a = o === "이상" ? "이어야 합니다" : "여야 합니다", s = t(r.origin), d = s?.unit ?? "요소";
        return s ? `${r.origin ?? "값"}이 너무 작습니다: ${r.minimum.toString()}${d} ${o}${a}` : `${r.origin ?? "값"}이 너무 작습니다: ${r.minimum.toString()} ${o}${a}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `잘못된 문자열: "${o.prefix}"(으)로 시작해야 합니다` : o.format === "ends_with" ? `잘못된 문자열: "${o.suffix}"(으)로 끝나야 합니다` : o.format === "includes" ? `잘못된 문자열: "${o.includes}"을(를) 포함해야 합니다` : o.format === "regex" ? `잘못된 문자열: 정규식 ${o.pattern} 패턴과 일치해야 합니다` : `잘못된 ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `잘못된 숫자: ${r.divisor}의 배수여야 합니다`;
      case "unrecognized_keys":
        return `인식할 수 없는 키: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `잘못된 키: ${r.origin}`;
      case "invalid_union":
        return "잘못된 입력";
      case "invalid_element":
        return `잘못된 값: ${r.origin}`;
      default:
        return "잘못된 입력";
    }
  };
};
function G3() {
  return {
    localeError: B3()
  };
}
const $r = (e) => e.charAt(0).toUpperCase() + e.slice(1);
function Cl(e) {
  const t = Math.abs(e), n = t % 10, i = t % 100;
  return i >= 11 && i <= 19 || n === 0 ? "many" : n === 1 ? "one" : "few";
}
const H3 = () => {
  const e = {
    string: {
      unit: {
        one: "simbolis",
        few: "simboliai",
        many: "simbolių"
      },
      verb: {
        smaller: {
          inclusive: "turi būti ne ilgesnė kaip",
          notInclusive: "turi būti trumpesnė kaip"
        },
        bigger: {
          inclusive: "turi būti ne trumpesnė kaip",
          notInclusive: "turi būti ilgesnė kaip"
        }
      }
    },
    file: {
      unit: {
        one: "baitas",
        few: "baitai",
        many: "baitų"
      },
      verb: {
        smaller: {
          inclusive: "turi būti ne didesnis kaip",
          notInclusive: "turi būti mažesnis kaip"
        },
        bigger: {
          inclusive: "turi būti ne mažesnis kaip",
          notInclusive: "turi būti didesnis kaip"
        }
      }
    },
    array: {
      unit: {
        one: "elementą",
        few: "elementus",
        many: "elementų"
      },
      verb: {
        smaller: {
          inclusive: "turi turėti ne daugiau kaip",
          notInclusive: "turi turėti mažiau kaip"
        },
        bigger: {
          inclusive: "turi turėti ne mažiau kaip",
          notInclusive: "turi turėti daugiau kaip"
        }
      }
    },
    set: {
      unit: {
        one: "elementą",
        few: "elementus",
        many: "elementų"
      },
      verb: {
        smaller: {
          inclusive: "turi turėti ne daugiau kaip",
          notInclusive: "turi turėti mažiau kaip"
        },
        bigger: {
          inclusive: "turi turėti ne mažiau kaip",
          notInclusive: "turi turėti daugiau kaip"
        }
      }
    }
  };
  function t(r, o, a, s) {
    const d = e[r] ?? null;
    return d === null ? d : {
      unit: d.unit[o],
      verb: d.verb[s][a ? "inclusive" : "notInclusive"]
    };
  }
  const n = {
    regex: "įvestis",
    email: "el. pašto adresas",
    url: "URL",
    emoji: "jaustukas",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO data ir laikas",
    date: "ISO data",
    time: "ISO laikas",
    duration: "ISO trukmė",
    ipv4: "IPv4 adresas",
    ipv6: "IPv6 adresas",
    cidrv4: "IPv4 tinklo prefiksas (CIDR)",
    cidrv6: "IPv6 tinklo prefiksas (CIDR)",
    base64: "base64 užkoduota eilutė",
    base64url: "base64url užkoduota eilutė",
    json_string: "JSON eilutė",
    e164: "E.164 numeris",
    jwt: "JWT",
    template_literal: "įvestis"
  }, i = {
    nan: "NaN",
    number: "skaičius",
    bigint: "sveikasis skaičius",
    string: "eilutė",
    boolean: "loginė reikšmė",
    undefined: "neapibrėžta reikšmė",
    function: "funkcija",
    symbol: "simbolis",
    array: "masyvas",
    object: "objektas",
    null: "nulinė reikšmė"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Gautas tipas ${s}, o tikėtasi - instanceof ${r.expected}` : `Gautas tipas ${s}, o tikėtasi - ${o}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Privalo būti ${j(r.values[0])}` : `Privalo būti vienas iš ${T(r.values, "|")} pasirinkimų`;
      case "too_big": {
        const o = i[r.origin] ?? r.origin, a = t(r.origin, Cl(Number(r.maximum)), r.inclusive ?? !1, "smaller");
        if (a?.verb)
          return `${$r(o ?? r.origin ?? "reikšmė")} ${a.verb} ${r.maximum.toString()} ${a.unit ?? "elementų"}`;
        const s = r.inclusive ? "ne didesnis kaip" : "mažesnis kaip";
        return `${$r(o ?? r.origin ?? "reikšmė")} turi būti ${s} ${r.maximum.toString()} ${a?.unit}`;
      }
      case "too_small": {
        const o = i[r.origin] ?? r.origin, a = t(r.origin, Cl(Number(r.minimum)), r.inclusive ?? !1, "bigger");
        if (a?.verb)
          return `${$r(o ?? r.origin ?? "reikšmė")} ${a.verb} ${r.minimum.toString()} ${a.unit ?? "elementų"}`;
        const s = r.inclusive ? "ne mažesnis kaip" : "didesnis kaip";
        return `${$r(o ?? r.origin ?? "reikšmė")} turi būti ${s} ${r.minimum.toString()} ${a?.unit}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Eilutė privalo prasidėti "${o.prefix}"` : o.format === "ends_with" ? `Eilutė privalo pasibaigti "${o.suffix}"` : o.format === "includes" ? `Eilutė privalo įtraukti "${o.includes}"` : o.format === "regex" ? `Eilutė privalo atitikti ${o.pattern}` : `Neteisingas ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Skaičius privalo būti ${r.divisor} kartotinis.`;
      case "unrecognized_keys":
        return `Neatpažint${r.keys.length > 1 ? "i" : "as"} rakt${r.keys.length > 1 ? "ai" : "as"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return "Rastas klaidingas raktas";
      case "invalid_union":
        return "Klaidinga įvestis";
      case "invalid_element": {
        const o = i[r.origin] ?? r.origin;
        return `${$r(o ?? r.origin ?? "reikšmė")} turi klaidingą įvestį`;
      }
      default:
        return "Klaidinga įvestis";
    }
  };
};
function J3() {
  return {
    localeError: H3()
  };
}
const V3 = () => {
  const e = {
    string: { unit: "знаци", verb: "да имаат" },
    file: { unit: "бајти", verb: "да имаат" },
    array: { unit: "ставки", verb: "да имаат" },
    set: { unit: "ставки", verb: "да имаат" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "внес",
    email: "адреса на е-пошта",
    url: "URL",
    emoji: "емоџи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO датум и време",
    date: "ISO датум",
    time: "ISO време",
    duration: "ISO времетраење",
    ipv4: "IPv4 адреса",
    ipv6: "IPv6 адреса",
    cidrv4: "IPv4 опсег",
    cidrv6: "IPv6 опсег",
    base64: "base64-енкодирана низа",
    base64url: "base64url-енкодирана низа",
    json_string: "JSON низа",
    e164: "E.164 број",
    jwt: "JWT",
    template_literal: "внес"
  }, i = {
    nan: "NaN",
    number: "број",
    array: "низа"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Грешен внес: се очекува instanceof ${r.expected}, примено ${s}` : `Грешен внес: се очекува ${o}, примено ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Invalid input: expected ${j(r.values[0])}` : `Грешана опција: се очекува една ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Премногу голем: се очекува ${r.origin ?? "вредноста"} да има ${o}${r.maximum.toString()} ${a.unit ?? "елементи"}` : `Премногу голем: се очекува ${r.origin ?? "вредноста"} да биде ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Премногу мал: се очекува ${r.origin} да има ${o}${r.minimum.toString()} ${a.unit}` : `Премногу мал: се очекува ${r.origin} да биде ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Неважечка низа: мора да започнува со "${o.prefix}"` : o.format === "ends_with" ? `Неважечка низа: мора да завршува со "${o.suffix}"` : o.format === "includes" ? `Неважечка низа: мора да вклучува "${o.includes}"` : o.format === "regex" ? `Неважечка низа: мора да одгоара на патернот ${o.pattern}` : `Invalid ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Грешен број: мора да биде делив со ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Непрепознаени клучеви" : "Непрепознаен клуч"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Грешен клуч во ${r.origin}`;
      case "invalid_union":
        return "Грешен внес";
      case "invalid_element":
        return `Грешна вредност во ${r.origin}`;
      default:
        return "Грешен внес";
    }
  };
};
function q3() {
  return {
    localeError: V3()
  };
}
const W3 = () => {
  const e = {
    string: { unit: "aksara", verb: "mempunyai" },
    file: { unit: "bait", verb: "mempunyai" },
    array: { unit: "elemen", verb: "mempunyai" },
    set: { unit: "elemen", verb: "mempunyai" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "alamat e-mel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tarikh masa ISO",
    date: "tarikh ISO",
    time: "masa ISO",
    duration: "tempoh ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "julat IPv4",
    cidrv6: "julat IPv6",
    base64: "string dikodkan base64",
    base64url: "string dikodkan base64url",
    json_string: "string JSON",
    e164: "nombor E.164",
    jwt: "JWT",
    template_literal: "input"
  }, i = {
    nan: "NaN",
    number: "nombor"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Input tidak sah: dijangka instanceof ${r.expected}, diterima ${s}` : `Input tidak sah: dijangka ${o}, diterima ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Input tidak sah: dijangka ${j(r.values[0])}` : `Pilihan tidak sah: dijangka salah satu daripada ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Terlalu besar: dijangka ${r.origin ?? "nilai"} ${a.verb} ${o}${r.maximum.toString()} ${a.unit ?? "elemen"}` : `Terlalu besar: dijangka ${r.origin ?? "nilai"} adalah ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Terlalu kecil: dijangka ${r.origin} ${a.verb} ${o}${r.minimum.toString()} ${a.unit}` : `Terlalu kecil: dijangka ${r.origin} adalah ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `String tidak sah: mesti bermula dengan "${o.prefix}"` : o.format === "ends_with" ? `String tidak sah: mesti berakhir dengan "${o.suffix}"` : o.format === "includes" ? `String tidak sah: mesti mengandungi "${o.includes}"` : o.format === "regex" ? `String tidak sah: mesti sepadan dengan corak ${o.pattern}` : `${n[o.format] ?? r.format} tidak sah`;
      }
      case "not_multiple_of":
        return `Nombor tidak sah: perlu gandaan ${r.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak sah dalam ${r.origin}`;
      case "invalid_union":
        return "Input tidak sah";
      case "invalid_element":
        return `Nilai tidak sah dalam ${r.origin}`;
      default:
        return "Input tidak sah";
    }
  };
};
function K3() {
  return {
    localeError: W3()
  };
}
const Y3 = () => {
  const e = {
    string: { unit: "tekens", verb: "heeft" },
    file: { unit: "bytes", verb: "heeft" },
    array: { unit: "elementen", verb: "heeft" },
    set: { unit: "elementen", verb: "heeft" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "invoer",
    email: "emailadres",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum en tijd",
    date: "ISO datum",
    time: "ISO tijd",
    duration: "ISO duur",
    ipv4: "IPv4-adres",
    ipv6: "IPv6-adres",
    cidrv4: "IPv4-bereik",
    cidrv6: "IPv6-bereik",
    base64: "base64-gecodeerde tekst",
    base64url: "base64 URL-gecodeerde tekst",
    json_string: "JSON string",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "invoer"
  }, i = {
    nan: "NaN",
    number: "getal"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ongeldige invoer: verwacht instanceof ${r.expected}, ontving ${s}` : `Ongeldige invoer: verwacht ${o}, ontving ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ongeldige invoer: verwacht ${j(r.values[0])}` : `Ongeldige optie: verwacht één van ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin), s = r.origin === "date" ? "laat" : r.origin === "string" ? "lang" : "groot";
        return a ? `Te ${s}: verwacht dat ${r.origin ?? "waarde"} ${o}${r.maximum.toString()} ${a.unit ?? "elementen"} ${a.verb}` : `Te ${s}: verwacht dat ${r.origin ?? "waarde"} ${o}${r.maximum.toString()} is`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin), s = r.origin === "date" ? "vroeg" : r.origin === "string" ? "kort" : "klein";
        return a ? `Te ${s}: verwacht dat ${r.origin} ${o}${r.minimum.toString()} ${a.unit} ${a.verb}` : `Te ${s}: verwacht dat ${r.origin} ${o}${r.minimum.toString()} is`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Ongeldige tekst: moet met "${o.prefix}" beginnen` : o.format === "ends_with" ? `Ongeldige tekst: moet op "${o.suffix}" eindigen` : o.format === "includes" ? `Ongeldige tekst: moet "${o.includes}" bevatten` : o.format === "regex" ? `Ongeldige tekst: moet overeenkomen met patroon ${o.pattern}` : `Ongeldig: ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ongeldig getal: moet een veelvoud van ${r.divisor} zijn`;
      case "unrecognized_keys":
        return `Onbekende key${r.keys.length > 1 ? "s" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Ongeldige key in ${r.origin}`;
      case "invalid_union":
        return "Ongeldige invoer";
      case "invalid_element":
        return `Ongeldige waarde in ${r.origin}`;
      default:
        return "Ongeldige invoer";
    }
  };
};
function X3() {
  return {
    localeError: Y3()
  };
}
const Q3 = () => {
  const e = {
    string: { unit: "tegn", verb: "å ha" },
    file: { unit: "bytes", verb: "å ha" },
    array: { unit: "elementer", verb: "å inneholde" },
    set: { unit: "elementer", verb: "å inneholde" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "e-postadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslett",
    date: "ISO-dato",
    time: "ISO-klokkeslett",
    duration: "ISO-varighet",
    ipv4: "IPv4-område",
    ipv6: "IPv6-område",
    cidrv4: "IPv4-spekter",
    cidrv6: "IPv6-spekter",
    base64: "base64-enkodet streng",
    base64url: "base64url-enkodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "input"
  }, i = {
    nan: "NaN",
    number: "tall",
    array: "liste"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ugyldig input: forventet instanceof ${r.expected}, fikk ${s}` : `Ugyldig input: forventet ${o}, fikk ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ugyldig verdi: forventet ${j(r.values[0])}` : `Ugyldig valg: forventet en av ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `For stor(t): forventet ${r.origin ?? "value"} til å ha ${o}${r.maximum.toString()} ${a.unit ?? "elementer"}` : `For stor(t): forventet ${r.origin ?? "value"} til å ha ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `For lite(n): forventet ${r.origin} til å ha ${o}${r.minimum.toString()} ${a.unit}` : `For lite(n): forventet ${r.origin} til å ha ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Ugyldig streng: må starte med "${o.prefix}"` : o.format === "ends_with" ? `Ugyldig streng: må ende med "${o.suffix}"` : o.format === "includes" ? `Ugyldig streng: må inneholde "${o.includes}"` : o.format === "regex" ? `Ugyldig streng: må matche mønsteret ${o.pattern}` : `Ugyldig ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ugyldig tall: må være et multiplum av ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Ukjente nøkler" : "Ukjent nøkkel"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig nøkkel i ${r.origin}`;
      case "invalid_union":
        return "Ugyldig input";
      case "invalid_element":
        return `Ugyldig verdi i ${r.origin}`;
      default:
        return "Ugyldig input";
    }
  };
};
function e_() {
  return {
    localeError: Q3()
  };
}
const t_ = () => {
  const e = {
    string: { unit: "harf", verb: "olmalıdır" },
    file: { unit: "bayt", verb: "olmalıdır" },
    array: { unit: "unsur", verb: "olmalıdır" },
    set: { unit: "unsur", verb: "olmalıdır" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "giren",
    email: "epostagâh",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO hengâmı",
    date: "ISO tarihi",
    time: "ISO zamanı",
    duration: "ISO müddeti",
    ipv4: "IPv4 nişânı",
    ipv6: "IPv6 nişânı",
    cidrv4: "IPv4 menzili",
    cidrv6: "IPv6 menzili",
    base64: "base64-şifreli metin",
    base64url: "base64url-şifreli metin",
    json_string: "JSON metin",
    e164: "E.164 sayısı",
    jwt: "JWT",
    template_literal: "giren"
  }, i = {
    nan: "NaN",
    number: "numara",
    array: "saf",
    null: "gayb"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Fâsit giren: umulan instanceof ${r.expected}, alınan ${s}` : `Fâsit giren: umulan ${o}, alınan ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Fâsit giren: umulan ${j(r.values[0])}` : `Fâsit tercih: mûteberler ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Fazla büyük: ${r.origin ?? "value"}, ${o}${r.maximum.toString()} ${a.unit ?? "elements"} sahip olmalıydı.` : `Fazla büyük: ${r.origin ?? "value"}, ${o}${r.maximum.toString()} olmalıydı.`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Fazla küçük: ${r.origin}, ${o}${r.minimum.toString()} ${a.unit} sahip olmalıydı.` : `Fazla küçük: ${r.origin}, ${o}${r.minimum.toString()} olmalıydı.`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Fâsit metin: "${o.prefix}" ile başlamalı.` : o.format === "ends_with" ? `Fâsit metin: "${o.suffix}" ile bitmeli.` : o.format === "includes" ? `Fâsit metin: "${o.includes}" ihtivâ etmeli.` : o.format === "regex" ? `Fâsit metin: ${o.pattern} nakşına uymalı.` : `Fâsit ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Fâsit sayı: ${r.divisor} katı olmalıydı.`;
      case "unrecognized_keys":
        return `Tanınmayan anahtar ${r.keys.length > 1 ? "s" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} için tanınmayan anahtar var.`;
      case "invalid_union":
        return "Giren tanınamadı.";
      case "invalid_element":
        return `${r.origin} için tanınmayan kıymet var.`;
      default:
        return "Kıymet tanınamadı.";
    }
  };
};
function r_() {
  return {
    localeError: t_()
  };
}
const n_ = () => {
  const e = {
    string: { unit: "توکي", verb: "ولري" },
    file: { unit: "بایټس", verb: "ولري" },
    array: { unit: "توکي", verb: "ولري" },
    set: { unit: "توکي", verb: "ولري" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ورودي",
    email: "بریښنالیک",
    url: "یو آر ال",
    emoji: "ایموجي",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "نیټه او وخت",
    date: "نېټه",
    time: "وخت",
    duration: "موده",
    ipv4: "د IPv4 پته",
    ipv6: "د IPv6 پته",
    cidrv4: "د IPv4 ساحه",
    cidrv6: "د IPv6 ساحه",
    base64: "base64-encoded متن",
    base64url: "base64url-encoded متن",
    json_string: "JSON متن",
    e164: "د E.164 شمېره",
    jwt: "JWT",
    template_literal: "ورودي"
  }, i = {
    nan: "NaN",
    number: "عدد",
    array: "ارې"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `ناسم ورودي: باید instanceof ${r.expected} وای, مګر ${s} ترلاسه شو` : `ناسم ورودي: باید ${o} وای, مګر ${s} ترلاسه شو`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `ناسم ورودي: باید ${j(r.values[0])} وای` : `ناسم انتخاب: باید یو له ${T(r.values, "|")} څخه وای`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `ډیر لوی: ${r.origin ?? "ارزښت"} باید ${o}${r.maximum.toString()} ${a.unit ?? "عنصرونه"} ولري` : `ډیر لوی: ${r.origin ?? "ارزښت"} باید ${o}${r.maximum.toString()} وي`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `ډیر کوچنی: ${r.origin} باید ${o}${r.minimum.toString()} ${a.unit} ولري` : `ډیر کوچنی: ${r.origin} باید ${o}${r.minimum.toString()} وي`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `ناسم متن: باید د "${o.prefix}" سره پیل شي` : o.format === "ends_with" ? `ناسم متن: باید د "${o.suffix}" سره پای ته ورسيږي` : o.format === "includes" ? `ناسم متن: باید "${o.includes}" ولري` : o.format === "regex" ? `ناسم متن: باید د ${o.pattern} سره مطابقت ولري` : `${n[o.format] ?? r.format} ناسم دی`;
      }
      case "not_multiple_of":
        return `ناسم عدد: باید د ${r.divisor} مضرب وي`;
      case "unrecognized_keys":
        return `ناسم ${r.keys.length > 1 ? "کلیډونه" : "کلیډ"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `ناسم کلیډ په ${r.origin} کې`;
      case "invalid_union":
        return "ناسمه ورودي";
      case "invalid_element":
        return `ناسم عنصر په ${r.origin} کې`;
      default:
        return "ناسمه ورودي";
    }
  };
};
function i_() {
  return {
    localeError: n_()
  };
}
const o_ = () => {
  const e = {
    string: { unit: "znaków", verb: "mieć" },
    file: { unit: "bajtów", verb: "mieć" },
    array: { unit: "elementów", verb: "mieć" },
    set: { unit: "elementów", verb: "mieć" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "wyrażenie",
    email: "adres email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i godzina w formacie ISO",
    date: "data w formacie ISO",
    time: "godzina w formacie ISO",
    duration: "czas trwania ISO",
    ipv4: "adres IPv4",
    ipv6: "adres IPv6",
    cidrv4: "zakres IPv4",
    cidrv6: "zakres IPv6",
    base64: "ciąg znaków zakodowany w formacie base64",
    base64url: "ciąg znaków zakodowany w formacie base64url",
    json_string: "ciąg znaków w formacie JSON",
    e164: "liczba E.164",
    jwt: "JWT",
    template_literal: "wejście"
  }, i = {
    nan: "NaN",
    number: "liczba",
    array: "tablica"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Nieprawidłowe dane wejściowe: oczekiwano instanceof ${r.expected}, otrzymano ${s}` : `Nieprawidłowe dane wejściowe: oczekiwano ${o}, otrzymano ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Nieprawidłowe dane wejściowe: oczekiwano ${j(r.values[0])}` : `Nieprawidłowa opcja: oczekiwano jednej z wartości ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Za duża wartość: oczekiwano, że ${r.origin ?? "wartość"} będzie mieć ${o}${r.maximum.toString()} ${a.unit ?? "elementów"}` : `Zbyt duż(y/a/e): oczekiwano, że ${r.origin ?? "wartość"} będzie wynosić ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Za mała wartość: oczekiwano, że ${r.origin ?? "wartość"} będzie mieć ${o}${r.minimum.toString()} ${a.unit ?? "elementów"}` : `Zbyt mał(y/a/e): oczekiwano, że ${r.origin ?? "wartość"} będzie wynosić ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Nieprawidłowy ciąg znaków: musi zaczynać się od "${o.prefix}"` : o.format === "ends_with" ? `Nieprawidłowy ciąg znaków: musi kończyć się na "${o.suffix}"` : o.format === "includes" ? `Nieprawidłowy ciąg znaków: musi zawierać "${o.includes}"` : o.format === "regex" ? `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${o.pattern}` : `Nieprawidłow(y/a/e) ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Nieprawidłowa liczba: musi być wielokrotnością ${r.divisor}`;
      case "unrecognized_keys":
        return `Nierozpoznane klucze${r.keys.length > 1 ? "s" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Nieprawidłowy klucz w ${r.origin}`;
      case "invalid_union":
        return "Nieprawidłowe dane wejściowe";
      case "invalid_element":
        return `Nieprawidłowa wartość w ${r.origin}`;
      default:
        return "Nieprawidłowe dane wejściowe";
    }
  };
};
function a_() {
  return {
    localeError: o_()
  };
}
const s_ = () => {
  const e = {
    string: { unit: "caracteres", verb: "ter" },
    file: { unit: "bytes", verb: "ter" },
    array: { unit: "itens", verb: "ter" },
    set: { unit: "itens", verb: "ter" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "padrão",
    email: "endereço de e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "duração ISO",
    ipv4: "endereço IPv4",
    ipv6: "endereço IPv6",
    cidrv4: "faixa de IPv4",
    cidrv6: "faixa de IPv6",
    base64: "texto codificado em base64",
    base64url: "URL codificada em base64",
    json_string: "texto JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  }, i = {
    nan: "NaN",
    number: "número",
    null: "nulo"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Tipo inválido: esperado instanceof ${r.expected}, recebido ${s}` : `Tipo inválido: esperado ${o}, recebido ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entrada inválida: esperado ${j(r.values[0])}` : `Opção inválida: esperada uma das ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Muito grande: esperado que ${r.origin ?? "valor"} tivesse ${o}${r.maximum.toString()} ${a.unit ?? "elementos"}` : `Muito grande: esperado que ${r.origin ?? "valor"} fosse ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Muito pequeno: esperado que ${r.origin} tivesse ${o}${r.minimum.toString()} ${a.unit}` : `Muito pequeno: esperado que ${r.origin} fosse ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Texto inválido: deve começar com "${o.prefix}"` : o.format === "ends_with" ? `Texto inválido: deve terminar com "${o.suffix}"` : o.format === "includes" ? `Texto inválido: deve incluir "${o.includes}"` : o.format === "regex" ? `Texto inválido: deve corresponder ao padrão ${o.pattern}` : `${n[o.format] ?? r.format} inválido`;
      }
      case "not_multiple_of":
        return `Número inválido: deve ser múltiplo de ${r.divisor}`;
      case "unrecognized_keys":
        return `Chave${r.keys.length > 1 ? "s" : ""} desconhecida${r.keys.length > 1 ? "s" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Chave inválida em ${r.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido em ${r.origin}`;
      default:
        return "Campo inválido";
    }
  };
};
function u_() {
  return {
    localeError: s_()
  };
}
const l_ = () => {
  const e = {
    string: { unit: "caractere", verb: "să aibă" },
    file: { unit: "octeți", verb: "să aibă" },
    array: { unit: "elemente", verb: "să aibă" },
    set: { unit: "elemente", verb: "să aibă" },
    map: { unit: "intrări", verb: "să aibă" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "intrare",
    email: "adresă de email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "dată și oră ISO",
    date: "dată ISO",
    time: "oră ISO",
    duration: "durată ISO",
    ipv4: "adresă IPv4",
    ipv6: "adresă IPv6",
    mac: "adresă MAC",
    cidrv4: "interval IPv4",
    cidrv6: "interval IPv6",
    base64: "șir codat base64",
    base64url: "șir codat base64url",
    json_string: "șir JSON",
    e164: "număr E.164",
    jwt: "JWT",
    template_literal: "intrare"
  }, i = {
    nan: "NaN",
    string: "șir",
    number: "număr",
    boolean: "boolean",
    function: "funcție",
    array: "matrice",
    object: "obiect",
    undefined: "nedefinit",
    symbol: "simbol",
    bigint: "număr mare",
    void: "void",
    never: "never",
    map: "hartă",
    set: "set"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return `Intrare invalidă: așteptat ${o}, primit ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Intrare invalidă: așteptat ${j(r.values[0])}` : `Opțiune invalidă: așteptat una dintre ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Prea mare: așteptat ca ${r.origin ?? "valoarea"} ${a.verb} ${o}${r.maximum.toString()} ${a.unit ?? "elemente"}` : `Prea mare: așteptat ca ${r.origin ?? "valoarea"} să fie ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Prea mic: așteptat ca ${r.origin} ${a.verb} ${o}${r.minimum.toString()} ${a.unit}` : `Prea mic: așteptat ca ${r.origin} să fie ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Șir invalid: trebuie să înceapă cu "${o.prefix}"` : o.format === "ends_with" ? `Șir invalid: trebuie să se termine cu "${o.suffix}"` : o.format === "includes" ? `Șir invalid: trebuie să includă "${o.includes}"` : o.format === "regex" ? `Șir invalid: trebuie să se potrivească cu modelul ${o.pattern}` : `Format invalid: ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Număr invalid: trebuie să fie multiplu de ${r.divisor}`;
      case "unrecognized_keys":
        return `Chei nerecunoscute: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Cheie invalidă în ${r.origin}`;
      case "invalid_union":
        return "Intrare invalidă";
      case "invalid_element":
        return `Valoare invalidă în ${r.origin}`;
      default:
        return "Intrare invalidă";
    }
  };
};
function c_() {
  return {
    localeError: l_()
  };
}
function Ul(e, t, n, i) {
  const r = Math.abs(e), o = r % 10, a = r % 100;
  return a >= 11 && a <= 19 ? i : o === 1 ? t : o >= 2 && o <= 4 ? n : i;
}
const d_ = () => {
  const e = {
    string: {
      unit: {
        one: "символ",
        few: "символа",
        many: "символов"
      },
      verb: "иметь"
    },
    file: {
      unit: {
        one: "байт",
        few: "байта",
        many: "байт"
      },
      verb: "иметь"
    },
    array: {
      unit: {
        one: "элемент",
        few: "элемента",
        many: "элементов"
      },
      verb: "иметь"
    },
    set: {
      unit: {
        one: "элемент",
        few: "элемента",
        many: "элементов"
      },
      verb: "иметь"
    }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ввод",
    email: "email адрес",
    url: "URL",
    emoji: "эмодзи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO дата и время",
    date: "ISO дата",
    time: "ISO время",
    duration: "ISO длительность",
    ipv4: "IPv4 адрес",
    ipv6: "IPv6 адрес",
    cidrv4: "IPv4 диапазон",
    cidrv6: "IPv6 диапазон",
    base64: "строка в формате base64",
    base64url: "строка в формате base64url",
    json_string: "JSON строка",
    e164: "номер E.164",
    jwt: "JWT",
    template_literal: "ввод"
  }, i = {
    nan: "NaN",
    number: "число",
    array: "массив"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Неверный ввод: ожидалось instanceof ${r.expected}, получено ${s}` : `Неверный ввод: ожидалось ${o}, получено ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Неверный ввод: ожидалось ${j(r.values[0])}` : `Неверный вариант: ожидалось одно из ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        if (a) {
          const s = Number(r.maximum), d = Ul(s, a.unit.one, a.unit.few, a.unit.many);
          return `Слишком большое значение: ожидалось, что ${r.origin ?? "значение"} будет иметь ${o}${r.maximum.toString()} ${d}`;
        }
        return `Слишком большое значение: ожидалось, что ${r.origin ?? "значение"} будет ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        if (a) {
          const s = Number(r.minimum), d = Ul(s, a.unit.one, a.unit.few, a.unit.many);
          return `Слишком маленькое значение: ожидалось, что ${r.origin} будет иметь ${o}${r.minimum.toString()} ${d}`;
        }
        return `Слишком маленькое значение: ожидалось, что ${r.origin} будет ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Неверная строка: должна начинаться с "${o.prefix}"` : o.format === "ends_with" ? `Неверная строка: должна заканчиваться на "${o.suffix}"` : o.format === "includes" ? `Неверная строка: должна содержать "${o.includes}"` : o.format === "regex" ? `Неверная строка: должна соответствовать шаблону ${o.pattern}` : `Неверный ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Неверное число: должно быть кратным ${r.divisor}`;
      case "unrecognized_keys":
        return `Нераспознанн${r.keys.length > 1 ? "ые" : "ый"} ключ${r.keys.length > 1 ? "и" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Неверный ключ в ${r.origin}`;
      case "invalid_union":
        return "Неверные входные данные";
      case "invalid_element":
        return `Неверное значение в ${r.origin}`;
      default:
        return "Неверные входные данные";
    }
  };
};
function f_() {
  return {
    localeError: d_()
  };
}
const p_ = () => {
  const e = {
    string: { unit: "znakov", verb: "imeti" },
    file: { unit: "bajtov", verb: "imeti" },
    array: { unit: "elementov", verb: "imeti" },
    set: { unit: "elementov", verb: "imeti" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "vnos",
    email: "e-poštni naslov",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum in čas",
    date: "ISO datum",
    time: "ISO čas",
    duration: "ISO trajanje",
    ipv4: "IPv4 naslov",
    ipv6: "IPv6 naslov",
    cidrv4: "obseg IPv4",
    cidrv6: "obseg IPv6",
    base64: "base64 kodiran niz",
    base64url: "base64url kodiran niz",
    json_string: "JSON niz",
    e164: "E.164 številka",
    jwt: "JWT",
    template_literal: "vnos"
  }, i = {
    nan: "NaN",
    number: "število",
    array: "tabela"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Neveljaven vnos: pričakovano instanceof ${r.expected}, prejeto ${s}` : `Neveljaven vnos: pričakovano ${o}, prejeto ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Neveljaven vnos: pričakovano ${j(r.values[0])}` : `Neveljavna možnost: pričakovano eno izmed ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Preveliko: pričakovano, da bo ${r.origin ?? "vrednost"} imelo ${o}${r.maximum.toString()} ${a.unit ?? "elementov"}` : `Preveliko: pričakovano, da bo ${r.origin ?? "vrednost"} ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Premajhno: pričakovano, da bo ${r.origin} imelo ${o}${r.minimum.toString()} ${a.unit}` : `Premajhno: pričakovano, da bo ${r.origin} ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Neveljaven niz: mora se začeti z "${o.prefix}"` : o.format === "ends_with" ? `Neveljaven niz: mora se končati z "${o.suffix}"` : o.format === "includes" ? `Neveljaven niz: mora vsebovati "${o.includes}"` : o.format === "regex" ? `Neveljaven niz: mora ustrezati vzorcu ${o.pattern}` : `Neveljaven ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Neveljavno število: mora biti večkratnik ${r.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznan${r.keys.length > 1 ? "i ključi" : " ključ"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Neveljaven ključ v ${r.origin}`;
      case "invalid_union":
        return "Neveljaven vnos";
      case "invalid_element":
        return `Neveljavna vrednost v ${r.origin}`;
      default:
        return "Neveljaven vnos";
    }
  };
};
function h_() {
  return {
    localeError: p_()
  };
}
const m_ = () => {
  const e = {
    string: { unit: "tecken", verb: "att ha" },
    file: { unit: "bytes", verb: "att ha" },
    array: { unit: "objekt", verb: "att innehålla" },
    set: { unit: "objekt", verb: "att innehålla" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "reguljärt uttryck",
    email: "e-postadress",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datum och tid",
    date: "ISO-datum",
    time: "ISO-tid",
    duration: "ISO-varaktighet",
    ipv4: "IPv4-intervall",
    ipv6: "IPv6-intervall",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodad sträng",
    base64url: "base64url-kodad sträng",
    json_string: "JSON-sträng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "mall-literal"
  }, i = {
    nan: "NaN",
    number: "antal",
    array: "lista"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ogiltig inmatning: förväntat instanceof ${r.expected}, fick ${s}` : `Ogiltig inmatning: förväntat ${o}, fick ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ogiltig inmatning: förväntat ${j(r.values[0])}` : `Ogiltigt val: förväntade en av ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `För stor(t): förväntade ${r.origin ?? "värdet"} att ha ${o}${r.maximum.toString()} ${a.unit ?? "element"}` : `För stor(t): förväntat ${r.origin ?? "värdet"} att ha ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `För lite(t): förväntade ${r.origin ?? "värdet"} att ha ${o}${r.minimum.toString()} ${a.unit}` : `För lite(t): förväntade ${r.origin ?? "värdet"} att ha ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Ogiltig sträng: måste börja med "${o.prefix}"` : o.format === "ends_with" ? `Ogiltig sträng: måste sluta med "${o.suffix}"` : o.format === "includes" ? `Ogiltig sträng: måste innehålla "${o.includes}"` : o.format === "regex" ? `Ogiltig sträng: måste matcha mönstret "${o.pattern}"` : `Ogiltig(t) ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ogiltigt tal: måste vara en multipel av ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Okända nycklar" : "Okänd nyckel"}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Ogiltig nyckel i ${r.origin ?? "värdet"}`;
      case "invalid_union":
        return "Ogiltig input";
      case "invalid_element":
        return `Ogiltigt värde i ${r.origin ?? "värdet"}`;
      default:
        return "Ogiltig input";
    }
  };
};
function g_() {
  return {
    localeError: m_()
  };
}
const v_ = () => {
  const e = {
    string: { unit: "எழுத்துக்கள்", verb: "கொண்டிருக்க வேண்டும்" },
    file: { unit: "பைட்டுகள்", verb: "கொண்டிருக்க வேண்டும்" },
    array: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" },
    set: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "உள்ளீடு",
    email: "மின்னஞ்சல் முகவரி",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO தேதி நேரம்",
    date: "ISO தேதி",
    time: "ISO நேரம்",
    duration: "ISO கால அளவு",
    ipv4: "IPv4 முகவரி",
    ipv6: "IPv6 முகவரி",
    cidrv4: "IPv4 வரம்பு",
    cidrv6: "IPv6 வரம்பு",
    base64: "base64-encoded சரம்",
    base64url: "base64url-encoded சரம்",
    json_string: "JSON சரம்",
    e164: "E.164 எண்",
    jwt: "JWT",
    template_literal: "input"
  }, i = {
    nan: "NaN",
    number: "எண்",
    array: "அணி",
    null: "வெறுமை"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது instanceof ${r.expected}, பெறப்பட்டது ${s}` : `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${o}, பெறப்பட்டது ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${j(r.values[0])}` : `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${T(r.values, "|")} இல் ஒன்று`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${r.origin ?? "மதிப்பு"} ${o}${r.maximum.toString()} ${a.unit ?? "உறுப்புகள்"} ஆக இருக்க வேண்டும்` : `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${r.origin ?? "மதிப்பு"} ${o}${r.maximum.toString()} ஆக இருக்க வேண்டும்`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${r.origin} ${o}${r.minimum.toString()} ${a.unit} ஆக இருக்க வேண்டும்` : `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${r.origin} ${o}${r.minimum.toString()} ஆக இருக்க வேண்டும்`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `தவறான சரம்: "${o.prefix}" இல் தொடங்க வேண்டும்` : o.format === "ends_with" ? `தவறான சரம்: "${o.suffix}" இல் முடிவடைய வேண்டும்` : o.format === "includes" ? `தவறான சரம்: "${o.includes}" ஐ உள்ளடக்க வேண்டும்` : o.format === "regex" ? `தவறான சரம்: ${o.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்` : `தவறான ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `தவறான எண்: ${r.divisor} இன் பலமாக இருக்க வேண்டும்`;
      case "unrecognized_keys":
        return `அடையாளம் தெரியாத விசை${r.keys.length > 1 ? "கள்" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} இல் தவறான விசை`;
      case "invalid_union":
        return "தவறான உள்ளீடு";
      case "invalid_element":
        return `${r.origin} இல் தவறான மதிப்பு`;
      default:
        return "தவறான உள்ளீடு";
    }
  };
};
function $_() {
  return {
    localeError: v_()
  };
}
const __ = () => {
  const e = {
    string: { unit: "ตัวอักษร", verb: "ควรมี" },
    file: { unit: "ไบต์", verb: "ควรมี" },
    array: { unit: "รายการ", verb: "ควรมี" },
    set: { unit: "รายการ", verb: "ควรมี" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ข้อมูลที่ป้อน",
    email: "ที่อยู่อีเมล",
    url: "URL",
    emoji: "อิโมจิ",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "วันที่เวลาแบบ ISO",
    date: "วันที่แบบ ISO",
    time: "เวลาแบบ ISO",
    duration: "ช่วงเวลาแบบ ISO",
    ipv4: "ที่อยู่ IPv4",
    ipv6: "ที่อยู่ IPv6",
    cidrv4: "ช่วง IP แบบ IPv4",
    cidrv6: "ช่วง IP แบบ IPv6",
    base64: "ข้อความแบบ Base64",
    base64url: "ข้อความแบบ Base64 สำหรับ URL",
    json_string: "ข้อความแบบ JSON",
    e164: "เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",
    jwt: "โทเคน JWT",
    template_literal: "ข้อมูลที่ป้อน"
  }, i = {
    nan: "NaN",
    number: "ตัวเลข",
    array: "อาร์เรย์ (Array)",
    null: "ไม่มีค่า (null)"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น instanceof ${r.expected} แต่ได้รับ ${s}` : `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${o} แต่ได้รับ ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `ค่าไม่ถูกต้อง: ควรเป็น ${j(r.values[0])}` : `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "ไม่เกิน" : "น้อยกว่า", a = t(r.origin);
        return a ? `เกินกำหนด: ${r.origin ?? "ค่า"} ควรมี${o} ${r.maximum.toString()} ${a.unit ?? "รายการ"}` : `เกินกำหนด: ${r.origin ?? "ค่า"} ควรมี${o} ${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? "อย่างน้อย" : "มากกว่า", a = t(r.origin);
        return a ? `น้อยกว่ากำหนด: ${r.origin} ควรมี${o} ${r.minimum.toString()} ${a.unit}` : `น้อยกว่ากำหนด: ${r.origin} ควรมี${o} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${o.prefix}"` : o.format === "ends_with" ? `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${o.suffix}"` : o.format === "includes" ? `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${o.includes}" อยู่ในข้อความ` : o.format === "regex" ? `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${o.pattern}` : `รูปแบบไม่ถูกต้อง: ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${r.divisor} ได้ลงตัว`;
      case "unrecognized_keys":
        return `พบคีย์ที่ไม่รู้จัก: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `คีย์ไม่ถูกต้องใน ${r.origin}`;
      case "invalid_union":
        return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
      case "invalid_element":
        return `ข้อมูลไม่ถูกต้องใน ${r.origin}`;
      default:
        return "ข้อมูลไม่ถูกต้อง";
    }
  };
};
function y_() {
  return {
    localeError: __()
  };
}
const b_ = () => {
  const e = {
    string: { unit: "karakter", verb: "olmalı" },
    file: { unit: "bayt", verb: "olmalı" },
    array: { unit: "öğe", verb: "olmalı" },
    set: { unit: "öğe", verb: "olmalı" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "girdi",
    email: "e-posta adresi",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO tarih ve saat",
    date: "ISO tarih",
    time: "ISO saat",
    duration: "ISO süre",
    ipv4: "IPv4 adresi",
    ipv6: "IPv6 adresi",
    cidrv4: "IPv4 aralığı",
    cidrv6: "IPv6 aralığı",
    base64: "base64 ile şifrelenmiş metin",
    base64url: "base64url ile şifrelenmiş metin",
    json_string: "JSON dizesi",
    e164: "E.164 sayısı",
    jwt: "JWT",
    template_literal: "Şablon dizesi"
  }, i = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Geçersiz değer: beklenen instanceof ${r.expected}, alınan ${s}` : `Geçersiz değer: beklenen ${o}, alınan ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Geçersiz değer: beklenen ${j(r.values[0])}` : `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Çok büyük: beklenen ${r.origin ?? "değer"} ${o}${r.maximum.toString()} ${a.unit ?? "öğe"}` : `Çok büyük: beklenen ${r.origin ?? "değer"} ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Çok küçük: beklenen ${r.origin} ${o}${r.minimum.toString()} ${a.unit}` : `Çok küçük: beklenen ${r.origin} ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Geçersiz metin: "${o.prefix}" ile başlamalı` : o.format === "ends_with" ? `Geçersiz metin: "${o.suffix}" ile bitmeli` : o.format === "includes" ? `Geçersiz metin: "${o.includes}" içermeli` : o.format === "regex" ? `Geçersiz metin: ${o.pattern} desenine uymalı` : `Geçersiz ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Geçersiz sayı: ${r.divisor} ile tam bölünebilmeli`;
      case "unrecognized_keys":
        return `Tanınmayan anahtar${r.keys.length > 1 ? "lar" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} içinde geçersiz anahtar`;
      case "invalid_union":
        return "Geçersiz değer";
      case "invalid_element":
        return `${r.origin} içinde geçersiz değer`;
      default:
        return "Geçersiz değer";
    }
  };
};
function S_() {
  return {
    localeError: b_()
  };
}
const k_ = () => {
  const e = {
    string: { unit: "символів", verb: "матиме" },
    file: { unit: "байтів", verb: "матиме" },
    array: { unit: "елементів", verb: "матиме" },
    set: { unit: "елементів", verb: "матиме" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "вхідні дані",
    email: "адреса електронної пошти",
    url: "URL",
    emoji: "емодзі",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "дата та час ISO",
    date: "дата ISO",
    time: "час ISO",
    duration: "тривалість ISO",
    ipv4: "адреса IPv4",
    ipv6: "адреса IPv6",
    cidrv4: "діапазон IPv4",
    cidrv6: "діапазон IPv6",
    base64: "рядок у кодуванні base64",
    base64url: "рядок у кодуванні base64url",
    json_string: "рядок JSON",
    e164: "номер E.164",
    jwt: "JWT",
    template_literal: "вхідні дані"
  }, i = {
    nan: "NaN",
    number: "число",
    array: "масив"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Неправильні вхідні дані: очікується instanceof ${r.expected}, отримано ${s}` : `Неправильні вхідні дані: очікується ${o}, отримано ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Неправильні вхідні дані: очікується ${j(r.values[0])}` : `Неправильна опція: очікується одне з ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Занадто велике: очікується, що ${r.origin ?? "значення"} ${a.verb} ${o}${r.maximum.toString()} ${a.unit ?? "елементів"}` : `Занадто велике: очікується, що ${r.origin ?? "значення"} буде ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Занадто мале: очікується, що ${r.origin} ${a.verb} ${o}${r.minimum.toString()} ${a.unit}` : `Занадто мале: очікується, що ${r.origin} буде ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Неправильний рядок: повинен починатися з "${o.prefix}"` : o.format === "ends_with" ? `Неправильний рядок: повинен закінчуватися на "${o.suffix}"` : o.format === "includes" ? `Неправильний рядок: повинен містити "${o.includes}"` : o.format === "regex" ? `Неправильний рядок: повинен відповідати шаблону ${o.pattern}` : `Неправильний ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Неправильне число: повинно бути кратним ${r.divisor}`;
      case "unrecognized_keys":
        return `Нерозпізнаний ключ${r.keys.length > 1 ? "і" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Неправильний ключ у ${r.origin}`;
      case "invalid_union":
        return "Неправильні вхідні дані";
      case "invalid_element":
        return `Неправильне значення у ${r.origin}`;
      default:
        return "Неправильні вхідні дані";
    }
  };
};
function Up() {
  return {
    localeError: k_()
  };
}
function w_() {
  return Up();
}
const I_ = () => {
  const e = {
    string: { unit: "حروف", verb: "ہونا" },
    file: { unit: "بائٹس", verb: "ہونا" },
    array: { unit: "آئٹمز", verb: "ہونا" },
    set: { unit: "آئٹمز", verb: "ہونا" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ان پٹ",
    email: "ای میل ایڈریس",
    url: "یو آر ایل",
    emoji: "ایموجی",
    uuid: "یو یو آئی ڈی",
    uuidv4: "یو یو آئی ڈی وی 4",
    uuidv6: "یو یو آئی ڈی وی 6",
    nanoid: "نینو آئی ڈی",
    guid: "جی یو آئی ڈی",
    cuid: "سی یو آئی ڈی",
    cuid2: "سی یو آئی ڈی 2",
    ulid: "یو ایل آئی ڈی",
    xid: "ایکس آئی ڈی",
    ksuid: "کے ایس یو آئی ڈی",
    datetime: "آئی ایس او ڈیٹ ٹائم",
    date: "آئی ایس او تاریخ",
    time: "آئی ایس او وقت",
    duration: "آئی ایس او مدت",
    ipv4: "آئی پی وی 4 ایڈریس",
    ipv6: "آئی پی وی 6 ایڈریس",
    cidrv4: "آئی پی وی 4 رینج",
    cidrv6: "آئی پی وی 6 رینج",
    base64: "بیس 64 ان کوڈڈ سٹرنگ",
    base64url: "بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",
    json_string: "جے ایس او این سٹرنگ",
    e164: "ای 164 نمبر",
    jwt: "جے ڈبلیو ٹی",
    template_literal: "ان پٹ"
  }, i = {
    nan: "NaN",
    number: "نمبر",
    array: "آرے",
    null: "نل"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `غلط ان پٹ: instanceof ${r.expected} متوقع تھا، ${s} موصول ہوا` : `غلط ان پٹ: ${o} متوقع تھا، ${s} موصول ہوا`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `غلط ان پٹ: ${j(r.values[0])} متوقع تھا` : `غلط آپشن: ${T(r.values, "|")} میں سے ایک متوقع تھا`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `بہت بڑا: ${r.origin ?? "ویلیو"} کے ${o}${r.maximum.toString()} ${a.unit ?? "عناصر"} ہونے متوقع تھے` : `بہت بڑا: ${r.origin ?? "ویلیو"} کا ${o}${r.maximum.toString()} ہونا متوقع تھا`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `بہت چھوٹا: ${r.origin} کے ${o}${r.minimum.toString()} ${a.unit} ہونے متوقع تھے` : `بہت چھوٹا: ${r.origin} کا ${o}${r.minimum.toString()} ہونا متوقع تھا`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `غلط سٹرنگ: "${o.prefix}" سے شروع ہونا چاہیے` : o.format === "ends_with" ? `غلط سٹرنگ: "${o.suffix}" پر ختم ہونا چاہیے` : o.format === "includes" ? `غلط سٹرنگ: "${o.includes}" شامل ہونا چاہیے` : o.format === "regex" ? `غلط سٹرنگ: پیٹرن ${o.pattern} سے میچ ہونا چاہیے` : `غلط ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `غلط نمبر: ${r.divisor} کا مضاعف ہونا چاہیے`;
      case "unrecognized_keys":
        return `غیر تسلیم شدہ کی${r.keys.length > 1 ? "ز" : ""}: ${T(r.keys, "، ")}`;
      case "invalid_key":
        return `${r.origin} میں غلط کی`;
      case "invalid_union":
        return "غلط ان پٹ";
      case "invalid_element":
        return `${r.origin} میں غلط ویلیو`;
      default:
        return "غلط ان پٹ";
    }
  };
};
function x_() {
  return {
    localeError: I_()
  };
}
const O_ = () => {
  const e = {
    string: { unit: "belgi", verb: "bo‘lishi kerak" },
    file: { unit: "bayt", verb: "bo‘lishi kerak" },
    array: { unit: "element", verb: "bo‘lishi kerak" },
    set: { unit: "element", verb: "bo‘lishi kerak" },
    map: { unit: "yozuv", verb: "bo‘lishi kerak" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "kirish",
    email: "elektron pochta manzili",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO sana va vaqti",
    date: "ISO sana",
    time: "ISO vaqt",
    duration: "ISO davomiylik",
    ipv4: "IPv4 manzil",
    ipv6: "IPv6 manzil",
    mac: "MAC manzil",
    cidrv4: "IPv4 diapazon",
    cidrv6: "IPv6 diapazon",
    base64: "base64 kodlangan satr",
    base64url: "base64url kodlangan satr",
    json_string: "JSON satr",
    e164: "E.164 raqam",
    jwt: "JWT",
    template_literal: "kirish"
  }, i = {
    nan: "NaN",
    number: "raqam",
    array: "massiv"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Noto‘g‘ri kirish: kutilgan instanceof ${r.expected}, qabul qilingan ${s}` : `Noto‘g‘ri kirish: kutilgan ${o}, qabul qilingan ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Noto‘g‘ri kirish: kutilgan ${j(r.values[0])}` : `Noto‘g‘ri variant: quyidagilardan biri kutilgan ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Juda katta: kutilgan ${r.origin ?? "qiymat"} ${o}${r.maximum.toString()} ${a.unit} ${a.verb}` : `Juda katta: kutilgan ${r.origin ?? "qiymat"} ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Juda kichik: kutilgan ${r.origin} ${o}${r.minimum.toString()} ${a.unit} ${a.verb}` : `Juda kichik: kutilgan ${r.origin} ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Noto‘g‘ri satr: "${o.prefix}" bilan boshlanishi kerak` : o.format === "ends_with" ? `Noto‘g‘ri satr: "${o.suffix}" bilan tugashi kerak` : o.format === "includes" ? `Noto‘g‘ri satr: "${o.includes}" ni o‘z ichiga olishi kerak` : o.format === "regex" ? `Noto‘g‘ri satr: ${o.pattern} shabloniga mos kelishi kerak` : `Noto‘g‘ri ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Noto‘g‘ri raqam: ${r.divisor} ning karralisi bo‘lishi kerak`;
      case "unrecognized_keys":
        return `Noma’lum kalit${r.keys.length > 1 ? "lar" : ""}: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} dagi kalit noto‘g‘ri`;
      case "invalid_union":
        return "Noto‘g‘ri kirish";
      case "invalid_element":
        return `${r.origin} da noto‘g‘ri qiymat`;
      default:
        return "Noto‘g‘ri kirish";
    }
  };
};
function E_() {
  return {
    localeError: O_()
  };
}
const P_ = () => {
  const e = {
    string: { unit: "ký tự", verb: "có" },
    file: { unit: "byte", verb: "có" },
    array: { unit: "phần tử", verb: "có" },
    set: { unit: "phần tử", verb: "có" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "đầu vào",
    email: "địa chỉ email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ngày giờ ISO",
    date: "ngày ISO",
    time: "giờ ISO",
    duration: "khoảng thời gian ISO",
    ipv4: "địa chỉ IPv4",
    ipv6: "địa chỉ IPv6",
    cidrv4: "dải IPv4",
    cidrv6: "dải IPv6",
    base64: "chuỗi mã hóa base64",
    base64url: "chuỗi mã hóa base64url",
    json_string: "chuỗi JSON",
    e164: "số E.164",
    jwt: "JWT",
    template_literal: "đầu vào"
  }, i = {
    nan: "NaN",
    number: "số",
    array: "mảng"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Đầu vào không hợp lệ: mong đợi instanceof ${r.expected}, nhận được ${s}` : `Đầu vào không hợp lệ: mong đợi ${o}, nhận được ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Đầu vào không hợp lệ: mong đợi ${j(r.values[0])}` : `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Quá lớn: mong đợi ${r.origin ?? "giá trị"} ${a.verb} ${o}${r.maximum.toString()} ${a.unit ?? "phần tử"}` : `Quá lớn: mong đợi ${r.origin ?? "giá trị"} ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Quá nhỏ: mong đợi ${r.origin} ${a.verb} ${o}${r.minimum.toString()} ${a.unit}` : `Quá nhỏ: mong đợi ${r.origin} ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Chuỗi không hợp lệ: phải bắt đầu bằng "${o.prefix}"` : o.format === "ends_with" ? `Chuỗi không hợp lệ: phải kết thúc bằng "${o.suffix}"` : o.format === "includes" ? `Chuỗi không hợp lệ: phải bao gồm "${o.includes}"` : o.format === "regex" ? `Chuỗi không hợp lệ: phải khớp với mẫu ${o.pattern}` : `${n[o.format] ?? r.format} không hợp lệ`;
      }
      case "not_multiple_of":
        return `Số không hợp lệ: phải là bội số của ${r.divisor}`;
      case "unrecognized_keys":
        return `Khóa không được nhận dạng: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Khóa không hợp lệ trong ${r.origin}`;
      case "invalid_union":
        return "Đầu vào không hợp lệ";
      case "invalid_element":
        return `Giá trị không hợp lệ trong ${r.origin}`;
      default:
        return "Đầu vào không hợp lệ";
    }
  };
};
function N_() {
  return {
    localeError: P_()
  };
}
const T_ = () => {
  const e = {
    string: { unit: "字符", verb: "包含" },
    file: { unit: "字节", verb: "包含" },
    array: { unit: "项", verb: "包含" },
    set: { unit: "项", verb: "包含" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "输入",
    email: "电子邮件",
    url: "URL",
    emoji: "表情符号",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO日期时间",
    date: "ISO日期",
    time: "ISO时间",
    duration: "ISO时长",
    ipv4: "IPv4地址",
    ipv6: "IPv6地址",
    cidrv4: "IPv4网段",
    cidrv6: "IPv6网段",
    base64: "base64编码字符串",
    base64url: "base64url编码字符串",
    json_string: "JSON字符串",
    e164: "E.164号码",
    jwt: "JWT",
    template_literal: "输入"
  }, i = {
    nan: "NaN",
    number: "数字",
    array: "数组",
    null: "空值(null)"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `无效输入：期望 instanceof ${r.expected}，实际接收 ${s}` : `无效输入：期望 ${o}，实际接收 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `无效输入：期望 ${j(r.values[0])}` : `无效选项：期望以下之一 ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `数值过大：期望 ${r.origin ?? "值"} ${o}${r.maximum.toString()} ${a.unit ?? "个元素"}` : `数值过大：期望 ${r.origin ?? "值"} ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `数值过小：期望 ${r.origin} ${o}${r.minimum.toString()} ${a.unit}` : `数值过小：期望 ${r.origin} ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `无效字符串：必须以 "${o.prefix}" 开头` : o.format === "ends_with" ? `无效字符串：必须以 "${o.suffix}" 结尾` : o.format === "includes" ? `无效字符串：必须包含 "${o.includes}"` : o.format === "regex" ? `无效字符串：必须满足正则表达式 ${o.pattern}` : `无效${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `无效数字：必须是 ${r.divisor} 的倍数`;
      case "unrecognized_keys":
        return `出现未知的键(key): ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} 中的键(key)无效`;
      case "invalid_union":
        return "无效输入";
      case "invalid_element":
        return `${r.origin} 中包含无效值(value)`;
      default:
        return "无效输入";
    }
  };
};
function z_() {
  return {
    localeError: T_()
  };
}
const A_ = () => {
  const e = {
    string: { unit: "字元", verb: "擁有" },
    file: { unit: "位元組", verb: "擁有" },
    array: { unit: "項目", verb: "擁有" },
    set: { unit: "項目", verb: "擁有" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "輸入",
    email: "郵件地址",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO 日期時間",
    date: "ISO 日期",
    time: "ISO 時間",
    duration: "ISO 期間",
    ipv4: "IPv4 位址",
    ipv6: "IPv6 位址",
    cidrv4: "IPv4 範圍",
    cidrv6: "IPv6 範圍",
    base64: "base64 編碼字串",
    base64url: "base64url 編碼字串",
    json_string: "JSON 字串",
    e164: "E.164 數值",
    jwt: "JWT",
    template_literal: "輸入"
  }, i = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `無效的輸入值：預期為 instanceof ${r.expected}，但收到 ${s}` : `無效的輸入值：預期為 ${o}，但收到 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `無效的輸入值：預期為 ${j(r.values[0])}` : `無效的選項：預期為以下其中之一 ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `數值過大：預期 ${r.origin ?? "值"} 應為 ${o}${r.maximum.toString()} ${a.unit ?? "個元素"}` : `數值過大：預期 ${r.origin ?? "值"} 應為 ${o}${r.maximum.toString()}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `數值過小：預期 ${r.origin} 應為 ${o}${r.minimum.toString()} ${a.unit}` : `數值過小：預期 ${r.origin} 應為 ${o}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `無效的字串：必須以 "${o.prefix}" 開頭` : o.format === "ends_with" ? `無效的字串：必須以 "${o.suffix}" 結尾` : o.format === "includes" ? `無效的字串：必須包含 "${o.includes}"` : o.format === "regex" ? `無效的字串：必須符合格式 ${o.pattern}` : `無效的 ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `無效的數字：必須為 ${r.divisor} 的倍數`;
      case "unrecognized_keys":
        return `無法識別的鍵值${r.keys.length > 1 ? "們" : ""}：${T(r.keys, "、")}`;
      case "invalid_key":
        return `${r.origin} 中有無效的鍵值`;
      case "invalid_union":
        return "無效的輸入值";
      case "invalid_element":
        return `${r.origin} 中有無效的值`;
      default:
        return "無效的輸入值";
    }
  };
};
function D_() {
  return {
    localeError: A_()
  };
}
const C_ = () => {
  const e = {
    string: { unit: "àmi", verb: "ní" },
    file: { unit: "bytes", verb: "ní" },
    array: { unit: "nkan", verb: "ní" },
    set: { unit: "nkan", verb: "ní" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ẹ̀rọ ìbáwọlé",
    email: "àdírẹ́sì ìmẹ́lì",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "àkókò ISO",
    date: "ọjọ́ ISO",
    time: "àkókò ISO",
    duration: "àkókò tó pé ISO",
    ipv4: "àdírẹ́sì IPv4",
    ipv6: "àdírẹ́sì IPv6",
    cidrv4: "àgbègbè IPv4",
    cidrv6: "àgbègbè IPv6",
    base64: "ọ̀rọ̀ tí a kọ́ ní base64",
    base64url: "ọ̀rọ̀ base64url",
    json_string: "ọ̀rọ̀ JSON",
    e164: "nọ́mbà E.164",
    jwt: "JWT",
    template_literal: "ẹ̀rọ ìbáwọlé"
  }, i = {
    nan: "NaN",
    number: "nọ́mbà",
    array: "akopọ"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const o = i[r.expected] ?? r.expected, a = Z(r.input), s = i[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ìbáwọlé aṣìṣe: a ní láti fi instanceof ${r.expected}, àmọ̀ a rí ${s}` : `Ìbáwọlé aṣìṣe: a ní láti fi ${o}, àmọ̀ a rí ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ìbáwọlé aṣìṣe: a ní láti fi ${j(r.values[0])}` : `Àṣàyàn aṣìṣe: yan ọ̀kan lára ${T(r.values, "|")}`;
      case "too_big": {
        const o = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Tó pọ̀ jù: a ní láti jẹ́ pé ${r.origin ?? "iye"} ${a.verb} ${o}${r.maximum} ${a.unit}` : `Tó pọ̀ jù: a ní láti jẹ́ ${o}${r.maximum}`;
      }
      case "too_small": {
        const o = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Kéré ju: a ní láti jẹ́ pé ${r.origin} ${a.verb} ${o}${r.minimum} ${a.unit}` : `Kéré ju: a ní láti jẹ́ ${o}${r.minimum}`;
      }
      case "invalid_format": {
        const o = r;
        return o.format === "starts_with" ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú "${o.prefix}"` : o.format === "ends_with" ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ parí pẹ̀lú "${o.suffix}"` : o.format === "includes" ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ ní "${o.includes}"` : o.format === "regex" ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bá àpẹẹrẹ mu ${o.pattern}` : `Aṣìṣe: ${n[o.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Nọ́mbà aṣìṣe: gbọ́dọ̀ jẹ́ èyà pípín ti ${r.divisor}`;
      case "unrecognized_keys":
        return `Bọtìnì àìmọ̀: ${T(r.keys, ", ")}`;
      case "invalid_key":
        return `Bọtìnì aṣìṣe nínú ${r.origin}`;
      case "invalid_union":
        return "Ìbáwọlé aṣìṣe";
      case "invalid_element":
        return `Iye aṣìṣe nínú ${r.origin}`;
      default:
        return "Ìbáwọlé aṣìṣe";
    }
  };
};
function U_() {
  return {
    localeError: C_()
  };
}
const Rp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ar: V4,
  az: W4,
  be: Y4,
  bg: Q4,
  ca: t3,
  cs: n3,
  da: o3,
  de: s3,
  el: l3,
  en: Dp,
  eo: f3,
  es: h3,
  fa: g3,
  fi: $3,
  fr: y3,
  frCA: S3,
  he: w3,
  hr: x3,
  hu: E3,
  hy: N3,
  id: z3,
  is: D3,
  it: U3,
  ja: L3,
  ka: M3,
  kh: F3,
  km: Cp,
  ko: G3,
  lt: J3,
  mk: q3,
  ms: K3,
  nl: X3,
  no: e_,
  ota: r_,
  pl: a_,
  ps: i_,
  pt: u_,
  ro: c_,
  ru: f_,
  sl: h_,
  sv: g_,
  ta: $_,
  th: y_,
  tr: S_,
  ua: w_,
  uk: Up,
  ur: x_,
  uz: E_,
  vi: N_,
  yo: U_,
  zhCN: z_,
  zhTW: D_
}, Symbol.toStringTag, { value: "Module" }));
var Rl;
const Lp = /* @__PURE__ */ Symbol("ZodOutput"), jp = /* @__PURE__ */ Symbol("ZodInput");
class Mp {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
  }
  add(t, ...n) {
    const i = n[0];
    return this._map.set(t, i), i && typeof i == "object" && "id" in i && this._idmap.set(i.id, t), this;
  }
  clear() {
    return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
  }
  remove(t) {
    const n = this._map.get(t);
    return n && typeof n == "object" && "id" in n && this._idmap.delete(n.id), this._map.delete(t), this;
  }
  get(t) {
    const n = t._zod.parent;
    if (n) {
      const i = { ...this.get(n) ?? {} };
      delete i.id;
      const r = { ...i, ...this._map.get(t) };
      return Object.keys(r).length ? r : void 0;
    }
    return this._map.get(t);
  }
  has(t) {
    return this._map.has(t);
  }
}
function va() {
  return new Mp();
}
(Rl = globalThis).__zod_globalRegistry ?? (Rl.__zod_globalRegistry = va());
const ze = globalThis.__zod_globalRegistry;
// @__NO_SIDE_EFFECTS__
function Zp(e, t) {
  return new e({
    type: "string",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Fp(e, t) {
  return new e({
    type: "string",
    coerce: !0,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function $a(e, t) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Kn(e, t) {
  return new e({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function _a(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ya(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ba(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Sa(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function mi(e, t) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ka(e, t) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function wa(e, t) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ia(e, t) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function xa(e, t) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Oa(e, t) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ea(e, t) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Pa(e, t) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Na(e, t) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ta(e, t) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Bp(e, t) {
  return new e({
    type: "string",
    format: "mac",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function za(e, t) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Aa(e, t) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Da(e, t) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ca(e, t) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ua(e, t) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ra(e, t) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...N(t)
  });
}
const Gp = {
  Any: null,
  Minute: -1,
  Second: 0,
  Millisecond: 3,
  Microsecond: 6
};
// @__NO_SIDE_EFFECTS__
function Hp(e, t) {
  return new e({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Jp(e, t) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Vp(e, t) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function qp(e, t) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Wp(e, t) {
  return new e({
    type: "number",
    checks: [],
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Kp(e, t) {
  return new e({
    type: "number",
    coerce: !0,
    checks: [],
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Yp(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Xp(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float32",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Qp(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float64",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function eh(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "int32",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function th(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "uint32",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function rh(e, t) {
  return new e({
    type: "boolean",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function nh(e, t) {
  return new e({
    type: "boolean",
    coerce: !0,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ih(e, t) {
  return new e({
    type: "bigint",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function oh(e, t) {
  return new e({
    type: "bigint",
    coerce: !0,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ah(e, t) {
  return new e({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "int64",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function sh(e, t) {
  return new e({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "uint64",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function uh(e, t) {
  return new e({
    type: "symbol",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function lh(e, t) {
  return new e({
    type: "undefined",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ch(e, t) {
  return new e({
    type: "null",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function dh(e) {
  return new e({
    type: "any"
  });
}
// @__NO_SIDE_EFFECTS__
function fh(e) {
  return new e({
    type: "unknown"
  });
}
// @__NO_SIDE_EFFECTS__
function ph(e, t) {
  return new e({
    type: "never",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function hh(e, t) {
  return new e({
    type: "void",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function mh(e, t) {
  return new e({
    type: "date",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function gh(e, t) {
  return new e({
    type: "date",
    coerce: !0,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function vh(e, t) {
  return new e({
    type: "nan",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function lt(e, t) {
  return new sa({
    check: "less_than",
    ...N(t),
    value: e,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function Ae(e, t) {
  return new sa({
    check: "less_than",
    ...N(t),
    value: e,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function ct(e, t) {
  return new ua({
    check: "greater_than",
    ...N(t),
    value: e,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function be(e, t) {
  return new ua({
    check: "greater_than",
    ...N(t),
    value: e,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function La(e) {
  return /* @__PURE__ */ ct(0, e);
}
// @__NO_SIDE_EFFECTS__
function ja(e) {
  return /* @__PURE__ */ lt(0, e);
}
// @__NO_SIDE_EFFECTS__
function Ma(e) {
  return /* @__PURE__ */ Ae(0, e);
}
// @__NO_SIDE_EFFECTS__
function Za(e) {
  return /* @__PURE__ */ be(0, e);
}
// @__NO_SIDE_EFFECTS__
function er(e, t) {
  return new ef({
    check: "multiple_of",
    ...N(t),
    value: e
  });
}
// @__NO_SIDE_EFFECTS__
function lr(e, t) {
  return new nf({
    check: "max_size",
    ...N(t),
    maximum: e
  });
}
// @__NO_SIDE_EFFECTS__
function dt(e, t) {
  return new of({
    check: "min_size",
    ...N(t),
    minimum: e
  });
}
// @__NO_SIDE_EFFECTS__
function jr(e, t) {
  return new af({
    check: "size_equals",
    ...N(t),
    size: e
  });
}
// @__NO_SIDE_EFFECTS__
function Mr(e, t) {
  return new sf({
    check: "max_length",
    ...N(t),
    maximum: e
  });
}
// @__NO_SIDE_EFFECTS__
function Et(e, t) {
  return new uf({
    check: "min_length",
    ...N(t),
    minimum: e
  });
}
// @__NO_SIDE_EFFECTS__
function Zr(e, t) {
  return new lf({
    check: "length_equals",
    ...N(t),
    length: e
  });
}
// @__NO_SIDE_EFFECTS__
function gi(e, t) {
  return new cf({
    check: "string_format",
    format: "regex",
    ...N(t),
    pattern: e
  });
}
// @__NO_SIDE_EFFECTS__
function vi(e) {
  return new df({
    check: "string_format",
    format: "lowercase",
    ...N(e)
  });
}
// @__NO_SIDE_EFFECTS__
function $i(e) {
  return new ff({
    check: "string_format",
    format: "uppercase",
    ...N(e)
  });
}
// @__NO_SIDE_EFFECTS__
function _i(e, t) {
  return new pf({
    check: "string_format",
    format: "includes",
    ...N(t),
    includes: e
  });
}
// @__NO_SIDE_EFFECTS__
function yi(e, t) {
  return new hf({
    check: "string_format",
    format: "starts_with",
    ...N(t),
    prefix: e
  });
}
// @__NO_SIDE_EFFECTS__
function bi(e, t) {
  return new mf({
    check: "string_format",
    format: "ends_with",
    ...N(t),
    suffix: e
  });
}
// @__NO_SIDE_EFFECTS__
function Fa(e, t, n) {
  return new gf({
    check: "property",
    property: e,
    schema: t,
    ...N(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Si(e, t) {
  return new vf({
    check: "mime_type",
    mime: e,
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function nt(e) {
  return new $f({
    check: "overwrite",
    tx: e
  });
}
// @__NO_SIDE_EFFECTS__
function ki(e) {
  return /* @__PURE__ */ nt((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function wi() {
  return /* @__PURE__ */ nt((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Ii() {
  return /* @__PURE__ */ nt((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function xi() {
  return /* @__PURE__ */ nt((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function Oi() {
  return /* @__PURE__ */ nt((e) => Kc(e));
}
// @__NO_SIDE_EFFECTS__
function $h(e, t, n) {
  return new e({
    type: "array",
    element: t,
    // get element() {
    //   return element;
    // },
    ...N(n)
  });
}
// @__NO_SIDE_EFFECTS__
function R_(e, t, n) {
  return new e({
    type: "union",
    options: t,
    ...N(n)
  });
}
function L_(e, t, n) {
  return new e({
    type: "union",
    options: t,
    inclusive: !1,
    ...N(n)
  });
}
// @__NO_SIDE_EFFECTS__
function j_(e, t, n, i) {
  return new e({
    type: "union",
    options: n,
    discriminator: t,
    ...N(i)
  });
}
// @__NO_SIDE_EFFECTS__
function M_(e, t, n) {
  return new e({
    type: "intersection",
    left: t,
    right: n
  });
}
// @__NO_SIDE_EFFECTS__
function Z_(e, t, n, i) {
  const r = n instanceof G, o = r ? i : n, a = r ? n : null;
  return new e({
    type: "tuple",
    items: t,
    rest: a,
    ...N(o)
  });
}
// @__NO_SIDE_EFFECTS__
function F_(e, t, n, i) {
  return new e({
    type: "record",
    keyType: t,
    valueType: n,
    ...N(i)
  });
}
// @__NO_SIDE_EFFECTS__
function B_(e, t, n, i) {
  return new e({
    type: "map",
    keyType: t,
    valueType: n,
    ...N(i)
  });
}
// @__NO_SIDE_EFFECTS__
function G_(e, t, n) {
  return new e({
    type: "set",
    valueType: t,
    ...N(n)
  });
}
// @__NO_SIDE_EFFECTS__
function H_(e, t, n) {
  const i = Array.isArray(t) ? Object.fromEntries(t.map((r) => [r, r])) : t;
  return new e({
    type: "enum",
    entries: i,
    ...N(n)
  });
}
// @__NO_SIDE_EFFECTS__
function J_(e, t, n) {
  return new e({
    type: "enum",
    entries: t,
    ...N(n)
  });
}
// @__NO_SIDE_EFFECTS__
function V_(e, t, n) {
  return new e({
    type: "literal",
    values: Array.isArray(t) ? t : [t],
    ...N(n)
  });
}
// @__NO_SIDE_EFFECTS__
function _h(e, t) {
  return new e({
    type: "file",
    ...N(t)
  });
}
// @__NO_SIDE_EFFECTS__
function q_(e, t) {
  return new e({
    type: "transform",
    transform: t
  });
}
// @__NO_SIDE_EFFECTS__
function W_(e, t) {
  return new e({
    type: "optional",
    innerType: t
  });
}
// @__NO_SIDE_EFFECTS__
function K_(e, t) {
  return new e({
    type: "nullable",
    innerType: t
  });
}
// @__NO_SIDE_EFFECTS__
function Y_(e, t, n) {
  return new e({
    type: "default",
    innerType: t,
    get defaultValue() {
      return typeof n == "function" ? n() : di(n);
    }
  });
}
// @__NO_SIDE_EFFECTS__
function X_(e, t, n) {
  return new e({
    type: "nonoptional",
    innerType: t,
    ...N(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Q_(e, t) {
  return new e({
    type: "success",
    innerType: t
  });
}
// @__NO_SIDE_EFFECTS__
function e6(e, t, n) {
  return new e({
    type: "catch",
    innerType: t,
    catchValue: typeof n == "function" ? n : () => n
  });
}
// @__NO_SIDE_EFFECTS__
function t6(e, t, n) {
  return new e({
    type: "pipe",
    in: t,
    out: n
  });
}
// @__NO_SIDE_EFFECTS__
function r6(e, t) {
  return new e({
    type: "readonly",
    innerType: t
  });
}
// @__NO_SIDE_EFFECTS__
function n6(e, t, n) {
  return new e({
    type: "template_literal",
    parts: t,
    ...N(n)
  });
}
// @__NO_SIDE_EFFECTS__
function i6(e, t) {
  return new e({
    type: "lazy",
    getter: t
  });
}
// @__NO_SIDE_EFFECTS__
function o6(e, t) {
  return new e({
    type: "promise",
    innerType: t
  });
}
// @__NO_SIDE_EFFECTS__
function yh(e, t, n) {
  const i = N(n);
  return i.abort ?? (i.abort = !0), new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...i
  });
}
// @__NO_SIDE_EFFECTS__
function bh(e, t, n) {
  return new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...N(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Sh(e, t) {
  const n = /* @__PURE__ */ kh((i) => (i.addIssue = (r) => {
    if (typeof r == "string")
      i.issues.push(Xt(r, i.value, n._zod.def));
    else {
      const o = r;
      o.fatal && (o.continue = !1), o.code ?? (o.code = "custom"), o.input ?? (o.input = i.value), o.inst ?? (o.inst = n), o.continue ?? (o.continue = !n._zod.def.abort), i.issues.push(Xt(o));
    }
  }, e(i.value, i)), t);
  return n;
}
// @__NO_SIDE_EFFECTS__
function kh(e, t) {
  const n = new ae({
    check: "custom",
    ...N(t)
  });
  return n._zod.check = e, n;
}
// @__NO_SIDE_EFFECTS__
function wh(e) {
  const t = new ae({ check: "describe" });
  return t._zod.onattach = [
    (n) => {
      const i = ze.get(n) ?? {};
      ze.add(n, { ...i, description: e });
    }
  ], t._zod.check = () => {
  }, t;
}
// @__NO_SIDE_EFFECTS__
function Ih(e) {
  const t = new ae({ check: "meta" });
  return t._zod.onattach = [
    (n) => {
      const i = ze.get(n) ?? {};
      ze.add(n, { ...i, ...e });
    }
  ], t._zod.check = () => {
  }, t;
}
// @__NO_SIDE_EFFECTS__
function xh(e, t) {
  const n = N(t);
  let i = n.truthy ?? ["true", "1", "yes", "on", "y", "enabled"], r = n.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
  n.case !== "sensitive" && (i = i.map((u) => typeof u == "string" ? u.toLowerCase() : u), r = r.map((u) => typeof u == "string" ? u.toLowerCase() : u));
  const o = new Set(i), a = new Set(r), s = e.Codec ?? ga, d = e.Boolean ?? da, p = e.String ?? Lr, f = new p({ type: "string", error: n.error }), h = new d({ type: "boolean", error: n.error }), c = new s({
    type: "pipe",
    in: f,
    out: h,
    transform: ((u, l) => {
      let m = u;
      return n.case !== "sensitive" && (m = m.toLowerCase()), o.has(m) ? !0 : a.has(m) ? !1 : (l.issues.push({
        code: "invalid_value",
        expected: "stringbool",
        values: [...o, ...a],
        input: l.value,
        inst: c,
        continue: !1
      }), {});
    }),
    reverseTransform: ((u, l) => u === !0 ? i[0] || "true" : r[0] || "false"),
    error: n.error
  });
  return c;
}
// @__NO_SIDE_EFFECTS__
function Fr(e, t, n, i = {}) {
  const r = N(i), o = {
    ...N(i),
    check: "string_format",
    type: "string",
    format: t,
    fn: typeof n == "function" ? n : (s) => n.test(s),
    ...r
  };
  return n instanceof RegExp && (o.pattern = n), new e(o);
}
function tr(e) {
  let t = e?.target ?? "draft-2020-12";
  return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
    processors: e.processors ?? {},
    metadataRegistry: e?.metadata ?? ze,
    target: t,
    unrepresentable: e?.unrepresentable ?? "throw",
    override: e?.override ?? (() => {
    }),
    io: e?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    cycles: e?.cycles ?? "ref",
    reused: e?.reused ?? "inline",
    external: e?.external ?? void 0
  };
}
function Q(e, t, n = { path: [], schemaPath: [] }) {
  var i;
  const r = e._zod.def, o = t.seen.get(e);
  if (o)
    return o.count++, n.schemaPath.includes(e) && (o.cycle = n.path), o.schema;
  const a = { schema: {}, count: 1, cycle: void 0, path: n.path };
  t.seen.set(e, a);
  const s = e._zod.toJSONSchema?.();
  if (s)
    a.schema = s;
  else {
    const f = {
      ...n,
      schemaPath: [...n.schemaPath, e],
      path: n.path
    };
    if (e._zod.processJSONSchema)
      e._zod.processJSONSchema(t, a.schema, f);
    else {
      const c = a.schema, u = t.processors[r.type];
      if (!u)
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${r.type}`);
      u(e, t, c, f);
    }
    const h = e._zod.parent;
    h && (a.ref || (a.ref = h), Q(h, t, f), t.seen.get(h).isParent = !0);
  }
  const d = t.metadataRegistry.get(e);
  return d && Object.assign(a.schema, d), t.io === "input" && $e(e) && (delete a.schema.examples, delete a.schema.default), t.io === "input" && "_prefault" in a.schema && ((i = a.schema).default ?? (i.default = a.schema._prefault)), delete a.schema._prefault, t.seen.get(e).schema;
}
function rr(e, t) {
  const n = e.seen.get(t);
  if (!n)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const i = /* @__PURE__ */ new Map();
  for (const a of e.seen.entries()) {
    const s = e.metadataRegistry.get(a[0])?.id;
    if (s) {
      const d = i.get(s);
      if (d && d !== a[0])
        throw new Error(`Duplicate schema id "${s}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      i.set(s, a[0]);
    }
  }
  const r = (a) => {
    const s = e.target === "draft-2020-12" ? "$defs" : "definitions";
    if (e.external) {
      const h = e.external.registry.get(a[0])?.id, c = e.external.uri ?? ((l) => l);
      if (h)
        return { ref: c(h) };
      const u = a[1].defId ?? a[1].schema.id ?? `schema${e.counter++}`;
      return a[1].defId = u, { defId: u, ref: `${c("__shared")}#/${s}/${u}` };
    }
    if (a[1] === n)
      return { ref: "#" };
    const p = `#/${s}/`, f = a[1].schema.id ?? `__schema${e.counter++}`;
    return { defId: f, ref: p + f };
  }, o = (a) => {
    if (a[1].schema.$ref)
      return;
    const s = a[1], { ref: d, defId: p } = r(a);
    s.def = { ...s.schema }, p && (s.defId = p);
    const f = s.schema;
    for (const h in f)
      delete f[h];
    f.$ref = d;
  };
  if (e.cycles === "throw")
    for (const a of e.seen.entries()) {
      const s = a[1];
      if (s.cycle)
        throw new Error(`Cycle detected: #/${s.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (const a of e.seen.entries()) {
    const s = a[1];
    if (t === a[0]) {
      o(a);
      continue;
    }
    if (e.external) {
      const p = e.external.registry.get(a[0])?.id;
      if (t !== a[0] && p) {
        o(a);
        continue;
      }
    }
    if (e.metadataRegistry.get(a[0])?.id) {
      o(a);
      continue;
    }
    if (s.cycle) {
      o(a);
      continue;
    }
    if (s.count > 1 && e.reused === "ref") {
      o(a);
      continue;
    }
  }
}
function nr(e, t) {
  const n = e.seen.get(t);
  if (!n)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const i = (s) => {
    const d = e.seen.get(s);
    if (d.ref === null)
      return;
    const p = d.def ?? d.schema, f = { ...p }, h = d.ref;
    if (d.ref = null, h) {
      i(h);
      const u = e.seen.get(h), l = u.schema;
      if (l.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (p.allOf = p.allOf ?? [], p.allOf.push(l)) : Object.assign(p, l), Object.assign(p, f), s._zod.parent === h)
        for (const g in p)
          g === "$ref" || g === "allOf" || g in f || delete p[g];
      if (l.$ref && u.def)
        for (const g in p)
          g === "$ref" || g === "allOf" || g in u.def && JSON.stringify(p[g]) === JSON.stringify(u.def[g]) && delete p[g];
    }
    const c = s._zod.parent;
    if (c && c !== h) {
      i(c);
      const u = e.seen.get(c);
      if (u?.schema.$ref && (p.$ref = u.schema.$ref, u.def))
        for (const l in p)
          l === "$ref" || l === "allOf" || l in u.def && JSON.stringify(p[l]) === JSON.stringify(u.def[l]) && delete p[l];
    }
    e.override({
      zodSchema: s,
      jsonSchema: p,
      path: d.path ?? []
    });
  };
  for (const s of [...e.seen.entries()].reverse())
    i(s[0]);
  const r = {};
  if (e.target === "draft-2020-12" ? r.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? r.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? r.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
    const s = e.external.registry.get(t)?.id;
    if (!s)
      throw new Error("Schema is missing an `id` property");
    r.$id = e.external.uri(s);
  }
  Object.assign(r, n.def ?? n.schema);
  const o = e.metadataRegistry.get(t)?.id;
  o !== void 0 && r.id === o && delete r.id;
  const a = e.external?.defs ?? {};
  for (const s of e.seen.entries()) {
    const d = s[1];
    d.def && d.defId && (d.def.id === d.defId && delete d.def.id, a[d.defId] = d.def);
  }
  e.external || Object.keys(a).length > 0 && (e.target === "draft-2020-12" ? r.$defs = a : r.definitions = a);
  try {
    const s = JSON.parse(JSON.stringify(r));
    return Object.defineProperty(s, "~standard", {
      value: {
        ...t["~standard"],
        jsonSchema: {
          input: kr(t, "input", e.processors),
          output: kr(t, "output", e.processors)
        }
      },
      enumerable: !1,
      writable: !1
    }), s;
  } catch {
    throw new Error("Error converting schema to JSON.");
  }
}
function $e(e, t) {
  const n = t ?? { seen: /* @__PURE__ */ new Set() };
  if (n.seen.has(e))
    return !1;
  n.seen.add(e);
  const i = e._zod.def;
  if (i.type === "transform")
    return !0;
  if (i.type === "array")
    return $e(i.element, n);
  if (i.type === "set")
    return $e(i.valueType, n);
  if (i.type === "lazy")
    return $e(i.getter(), n);
  if (i.type === "promise" || i.type === "optional" || i.type === "nonoptional" || i.type === "nullable" || i.type === "readonly" || i.type === "default" || i.type === "prefault")
    return $e(i.innerType, n);
  if (i.type === "intersection")
    return $e(i.left, n) || $e(i.right, n);
  if (i.type === "record" || i.type === "map")
    return $e(i.keyType, n) || $e(i.valueType, n);
  if (i.type === "pipe")
    return e._zod.traits.has("$ZodCodec") ? !0 : $e(i.in, n) || $e(i.out, n);
  if (i.type === "object") {
    for (const r in i.shape)
      if ($e(i.shape[r], n))
        return !0;
    return !1;
  }
  if (i.type === "union") {
    for (const r of i.options)
      if ($e(r, n))
        return !0;
    return !1;
  }
  if (i.type === "tuple") {
    for (const r of i.items)
      if ($e(r, n))
        return !0;
    return !!(i.rest && $e(i.rest, n));
  }
  return !1;
}
const Oh = (e, t = {}) => (n) => {
  const i = tr({ ...n, processors: t });
  return Q(e, i), rr(i, e), nr(i, e);
}, kr = (e, t, n = {}) => (i) => {
  const { libraryOptions: r, target: o } = i ?? {}, a = tr({ ...r ?? {}, target: o, io: t, processors: n });
  return Q(e, a), rr(a, e), nr(a, e);
}, a6 = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
}, Eh = (e, t, n, i) => {
  const r = n;
  r.type = "string";
  const { minimum: o, maximum: a, format: s, patterns: d, contentEncoding: p } = e._zod.bag;
  if (typeof o == "number" && (r.minLength = o), typeof a == "number" && (r.maxLength = a), s && (r.format = a6[s] ?? s, r.format === "" && delete r.format, s === "time" && delete r.format), p && (r.contentEncoding = p), d && d.size > 0) {
    const f = [...d];
    f.length === 1 ? r.pattern = f[0].source : f.length > 1 && (r.allOf = [
      ...f.map((h) => ({
        ...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
        pattern: h.source
      }))
    ]);
  }
}, Ph = (e, t, n, i) => {
  const r = n, { minimum: o, maximum: a, format: s, multipleOf: d, exclusiveMaximum: p, exclusiveMinimum: f } = e._zod.bag;
  typeof s == "string" && s.includes("int") ? r.type = "integer" : r.type = "number";
  const h = typeof f == "number" && f >= (o ?? Number.NEGATIVE_INFINITY), c = typeof p == "number" && p <= (a ?? Number.POSITIVE_INFINITY), u = t.target === "draft-04" || t.target === "openapi-3.0";
  h ? u ? (r.minimum = f, r.exclusiveMinimum = !0) : r.exclusiveMinimum = f : typeof o == "number" && (r.minimum = o), c ? u ? (r.maximum = p, r.exclusiveMaximum = !0) : r.exclusiveMaximum = p : typeof a == "number" && (r.maximum = a), typeof d == "number" && (r.multipleOf = d);
}, Nh = (e, t, n, i) => {
  n.type = "boolean";
}, Th = (e, t, n, i) => {
  if (t.unrepresentable === "throw")
    throw new Error("BigInt cannot be represented in JSON Schema");
}, zh = (e, t, n, i) => {
  if (t.unrepresentable === "throw")
    throw new Error("Symbols cannot be represented in JSON Schema");
}, Ah = (e, t, n, i) => {
  t.target === "openapi-3.0" ? (n.type = "string", n.nullable = !0, n.enum = [null]) : n.type = "null";
}, Dh = (e, t, n, i) => {
  if (t.unrepresentable === "throw")
    throw new Error("Undefined cannot be represented in JSON Schema");
}, Ch = (e, t, n, i) => {
  if (t.unrepresentable === "throw")
    throw new Error("Void cannot be represented in JSON Schema");
}, Uh = (e, t, n, i) => {
  n.not = {};
}, Rh = (e, t, n, i) => {
}, Lh = (e, t, n, i) => {
}, jh = (e, t, n, i) => {
  if (t.unrepresentable === "throw")
    throw new Error("Date cannot be represented in JSON Schema");
}, Mh = (e, t, n, i) => {
  const r = e._zod.def, o = Go(r.entries);
  o.every((a) => typeof a == "number") && (n.type = "number"), o.every((a) => typeof a == "string") && (n.type = "string"), n.enum = o;
}, Zh = (e, t, n, i) => {
  const r = e._zod.def, o = [];
  for (const a of r.values)
    if (a === void 0) {
      if (t.unrepresentable === "throw")
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
    } else if (typeof a == "bigint") {
      if (t.unrepresentable === "throw")
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      o.push(Number(a));
    } else
      o.push(a);
  if (o.length !== 0) if (o.length === 1) {
    const a = o[0];
    n.type = a === null ? "null" : typeof a, t.target === "draft-04" || t.target === "openapi-3.0" ? n.enum = [a] : n.const = a;
  } else
    o.every((a) => typeof a == "number") && (n.type = "number"), o.every((a) => typeof a == "string") && (n.type = "string"), o.every((a) => typeof a == "boolean") && (n.type = "boolean"), o.every((a) => a === null) && (n.type = "null"), n.enum = o;
}, Fh = (e, t, n, i) => {
  if (t.unrepresentable === "throw")
    throw new Error("NaN cannot be represented in JSON Schema");
}, Bh = (e, t, n, i) => {
  const r = n, o = e._zod.pattern;
  if (!o)
    throw new Error("Pattern not found in template literal");
  r.type = "string", r.pattern = o.source;
}, Gh = (e, t, n, i) => {
  const r = n, o = {
    type: "string",
    format: "binary",
    contentEncoding: "binary"
  }, { minimum: a, maximum: s, mime: d } = e._zod.bag;
  a !== void 0 && (o.minLength = a), s !== void 0 && (o.maxLength = s), d ? d.length === 1 ? (o.contentMediaType = d[0], Object.assign(r, o)) : (Object.assign(r, o), r.anyOf = d.map((p) => ({ contentMediaType: p }))) : Object.assign(r, o);
}, Hh = (e, t, n, i) => {
  n.type = "boolean";
}, Jh = (e, t, n, i) => {
  if (t.unrepresentable === "throw")
    throw new Error("Custom types cannot be represented in JSON Schema");
}, Vh = (e, t, n, i) => {
  if (t.unrepresentable === "throw")
    throw new Error("Function types cannot be represented in JSON Schema");
}, qh = (e, t, n, i) => {
  if (t.unrepresentable === "throw")
    throw new Error("Transforms cannot be represented in JSON Schema");
}, Wh = (e, t, n, i) => {
  if (t.unrepresentable === "throw")
    throw new Error("Map cannot be represented in JSON Schema");
}, Kh = (e, t, n, i) => {
  if (t.unrepresentable === "throw")
    throw new Error("Set cannot be represented in JSON Schema");
}, Yh = (e, t, n, i) => {
  const r = n, o = e._zod.def, { minimum: a, maximum: s } = e._zod.bag;
  typeof a == "number" && (r.minItems = a), typeof s == "number" && (r.maxItems = s), r.type = "array", r.items = Q(o.element, t, {
    ...i,
    path: [...i.path, "items"]
  });
}, Xh = (e, t, n, i) => {
  const r = n, o = e._zod.def;
  r.type = "object", r.properties = {};
  const a = o.shape;
  for (const p in a)
    r.properties[p] = Q(a[p], t, {
      ...i,
      path: [...i.path, "properties", p]
    });
  const s = new Set(Object.keys(a)), d = new Set([...s].filter((p) => {
    const f = o.shape[p]._zod;
    return t.io === "input" ? f.optin === void 0 : f.optout === void 0;
  }));
  d.size > 0 && (r.required = Array.from(d)), o.catchall?._zod.def.type === "never" ? r.additionalProperties = !1 : o.catchall ? o.catchall && (r.additionalProperties = Q(o.catchall, t, {
    ...i,
    path: [...i.path, "additionalProperties"]
  })) : t.io === "output" && (r.additionalProperties = !1);
}, Ba = (e, t, n, i) => {
  const r = e._zod.def, o = r.inclusive === !1, a = r.options.map((s, d) => Q(s, t, {
    ...i,
    path: [...i.path, o ? "oneOf" : "anyOf", d]
  }));
  o ? n.oneOf = a : n.anyOf = a;
}, Qh = (e, t, n, i) => {
  const r = e._zod.def, o = Q(r.left, t, {
    ...i,
    path: [...i.path, "allOf", 0]
  }), a = Q(r.right, t, {
    ...i,
    path: [...i.path, "allOf", 1]
  }), s = (p) => "allOf" in p && Object.keys(p).length === 1, d = [
    ...s(o) ? o.allOf : [o],
    ...s(a) ? a.allOf : [a]
  ];
  n.allOf = d;
}, em = (e, t, n, i) => {
  const r = n, o = e._zod.def;
  r.type = "array";
  const a = t.target === "draft-2020-12" ? "prefixItems" : "items", s = t.target === "draft-2020-12" || t.target === "openapi-3.0" ? "items" : "additionalItems", d = o.items.map((c, u) => Q(c, t, {
    ...i,
    path: [...i.path, a, u]
  })), p = o.rest ? Q(o.rest, t, {
    ...i,
    path: [...i.path, s, ...t.target === "openapi-3.0" ? [o.items.length] : []]
  }) : null;
  t.target === "draft-2020-12" ? (r.prefixItems = d, p && (r.items = p)) : t.target === "openapi-3.0" ? (r.items = {
    anyOf: d
  }, p && r.items.anyOf.push(p), r.minItems = d.length, p || (r.maxItems = d.length)) : (r.items = d, p && (r.additionalItems = p));
  const { minimum: f, maximum: h } = e._zod.bag;
  typeof f == "number" && (r.minItems = f), typeof h == "number" && (r.maxItems = h);
}, tm = (e, t, n, i) => {
  const r = n, o = e._zod.def;
  r.type = "object";
  const a = o.keyType, d = a._zod.bag?.patterns;
  if (o.mode === "loose" && d && d.size > 0) {
    const f = Q(o.valueType, t, {
      ...i,
      path: [...i.path, "patternProperties", "*"]
    });
    r.patternProperties = {};
    for (const h of d)
      r.patternProperties[h.source] = f;
  } else
    (t.target === "draft-07" || t.target === "draft-2020-12") && (r.propertyNames = Q(o.keyType, t, {
      ...i,
      path: [...i.path, "propertyNames"]
    })), r.additionalProperties = Q(o.valueType, t, {
      ...i,
      path: [...i.path, "additionalProperties"]
    });
  const p = a._zod.values;
  if (p) {
    const f = [...p].filter((h) => typeof h == "string" || typeof h == "number");
    f.length > 0 && (r.required = f);
  }
}, rm = (e, t, n, i) => {
  const r = e._zod.def, o = Q(r.innerType, t, i), a = t.seen.get(e);
  t.target === "openapi-3.0" ? (a.ref = r.innerType, n.nullable = !0) : n.anyOf = [o, { type: "null" }];
}, nm = (e, t, n, i) => {
  const r = e._zod.def;
  Q(r.innerType, t, i);
  const o = t.seen.get(e);
  o.ref = r.innerType;
}, im = (e, t, n, i) => {
  const r = e._zod.def;
  Q(r.innerType, t, i);
  const o = t.seen.get(e);
  o.ref = r.innerType, n.default = JSON.parse(JSON.stringify(r.defaultValue));
}, om = (e, t, n, i) => {
  const r = e._zod.def;
  Q(r.innerType, t, i);
  const o = t.seen.get(e);
  o.ref = r.innerType, t.io === "input" && (n._prefault = JSON.parse(JSON.stringify(r.defaultValue)));
}, am = (e, t, n, i) => {
  const r = e._zod.def;
  Q(r.innerType, t, i);
  const o = t.seen.get(e);
  o.ref = r.innerType;
  let a;
  try {
    a = r.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  n.default = a;
}, sm = (e, t, n, i) => {
  const r = e._zod.def, o = r.in._zod.traits.has("$ZodTransform"), a = t.io === "input" ? o ? r.out : r.in : r.out;
  Q(a, t, i);
  const s = t.seen.get(e);
  s.ref = a;
}, um = (e, t, n, i) => {
  const r = e._zod.def;
  Q(r.innerType, t, i);
  const o = t.seen.get(e);
  o.ref = r.innerType, n.readOnly = !0;
}, lm = (e, t, n, i) => {
  const r = e._zod.def;
  Q(r.innerType, t, i);
  const o = t.seen.get(e);
  o.ref = r.innerType;
}, Ga = (e, t, n, i) => {
  const r = e._zod.def;
  Q(r.innerType, t, i);
  const o = t.seen.get(e);
  o.ref = r.innerType;
}, cm = (e, t, n, i) => {
  const r = e._zod.innerType;
  Q(r, t, i);
  const o = t.seen.get(e);
  o.ref = r;
}, Oo = {
  string: Eh,
  number: Ph,
  boolean: Nh,
  bigint: Th,
  symbol: zh,
  null: Ah,
  undefined: Dh,
  void: Ch,
  never: Uh,
  any: Rh,
  unknown: Lh,
  date: jh,
  enum: Mh,
  literal: Zh,
  nan: Fh,
  template_literal: Bh,
  file: Gh,
  success: Hh,
  custom: Jh,
  function: Vh,
  transform: qh,
  map: Wh,
  set: Kh,
  array: Yh,
  object: Xh,
  union: Ba,
  intersection: Qh,
  tuple: em,
  record: tm,
  nullable: rm,
  nonoptional: nm,
  default: im,
  prefault: om,
  catch: am,
  pipe: sm,
  readonly: um,
  promise: lm,
  optional: Ga,
  lazy: cm
};
function dm(e, t) {
  if ("_idmap" in e) {
    const i = e, r = tr({ ...t, processors: Oo }), o = {};
    for (const d of i._idmap.entries()) {
      const [p, f] = d;
      Q(f, r);
    }
    const a = {}, s = {
      registry: i,
      uri: t?.uri,
      defs: o
    };
    r.external = s;
    for (const d of i._idmap.entries()) {
      const [p, f] = d;
      rr(r, f), a[p] = nr(r, f);
    }
    if (Object.keys(o).length > 0) {
      const d = r.target === "draft-2020-12" ? "$defs" : "definitions";
      a.__shared = {
        [d]: o
      };
    }
    return { schemas: a };
  }
  const n = tr({ ...t, processors: Oo });
  return Q(e, n), rr(n, e), nr(n, e);
}
class s6 {
  /** @deprecated Access via ctx instead */
  get metadataRegistry() {
    return this.ctx.metadataRegistry;
  }
  /** @deprecated Access via ctx instead */
  get target() {
    return this.ctx.target;
  }
  /** @deprecated Access via ctx instead */
  get unrepresentable() {
    return this.ctx.unrepresentable;
  }
  /** @deprecated Access via ctx instead */
  get override() {
    return this.ctx.override;
  }
  /** @deprecated Access via ctx instead */
  get io() {
    return this.ctx.io;
  }
  /** @deprecated Access via ctx instead */
  get counter() {
    return this.ctx.counter;
  }
  set counter(t) {
    this.ctx.counter = t;
  }
  /** @deprecated Access via ctx instead */
  get seen() {
    return this.ctx.seen;
  }
  constructor(t) {
    let n = t?.target ?? "draft-2020-12";
    n === "draft-4" && (n = "draft-04"), n === "draft-7" && (n = "draft-07"), this.ctx = tr({
      processors: Oo,
      target: n,
      ...t?.metadata && { metadata: t.metadata },
      ...t?.unrepresentable && { unrepresentable: t.unrepresentable },
      ...t?.override && { override: t.override },
      ...t?.io && { io: t.io }
    });
  }
  /**
   * Process a schema to prepare it for JSON Schema generation.
   * This must be called before emit().
   */
  process(t, n = { path: [], schemaPath: [] }) {
    return Q(t, this.ctx, n);
  }
  /**
   * Emit the final JSON Schema after processing.
   * Must call process() first.
   */
  emit(t, n) {
    n && (n.cycles && (this.ctx.cycles = n.cycles), n.reused && (this.ctx.reused = n.reused), n.external && (this.ctx.external = n.external)), rr(this.ctx, t);
    const i = nr(this.ctx, t), { "~standard": r, ...o } = i;
    return o;
  }
}
const u6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" })), l6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $ZodAny: Qf,
  $ZodArray: ip,
  $ZodAsyncError: It,
  $ZodBase64: Zf,
  $ZodBase64URL: Bf,
  $ZodBigInt: fa,
  $ZodBigIntFormat: Wf,
  $ZodBoolean: da,
  $ZodCIDRv4: jf,
  $ZodCIDRv6: Mf,
  $ZodCUID: Of,
  $ZodCUID2: Ef,
  $ZodCatch: Ip,
  $ZodCheck: ae,
  $ZodCheckBigIntFormat: rf,
  $ZodCheckEndsWith: mf,
  $ZodCheckGreaterThan: ua,
  $ZodCheckIncludes: pf,
  $ZodCheckLengthEquals: lf,
  $ZodCheckLessThan: sa,
  $ZodCheckLowerCase: df,
  $ZodCheckMaxLength: sf,
  $ZodCheckMaxSize: nf,
  $ZodCheckMimeType: vf,
  $ZodCheckMinLength: uf,
  $ZodCheckMinSize: of,
  $ZodCheckMultipleOf: ef,
  $ZodCheckNumberFormat: tf,
  $ZodCheckOverwrite: $f,
  $ZodCheckProperty: gf,
  $ZodCheckRegex: cf,
  $ZodCheckSizeEquals: af,
  $ZodCheckStartsWith: hf,
  $ZodCheckStringFormat: Rr,
  $ZodCheckUpperCase: ff,
  $ZodCodec: ga,
  $ZodCustom: Ap,
  $ZodCustomStringFormat: Vf,
  $ZodDate: np,
  $ZodDefault: bp,
  $ZodDiscriminatedUnion: cp,
  $ZodE164: Gf,
  $ZodEmail: kf,
  $ZodEmoji: If,
  $ZodEncodeError: li,
  $ZodEnum: mp,
  $ZodError: Jo,
  $ZodExactOptional: _p,
  $ZodFile: vp,
  $ZodFunction: Np,
  $ZodGUID: bf,
  $ZodIPv4: Uf,
  $ZodIPv6: Rf,
  $ZodISODate: Af,
  $ZodISODateTime: zf,
  $ZodISODuration: Cf,
  $ZodISOTime: Df,
  $ZodIntersection: dp,
  $ZodJWT: Jf,
  $ZodKSUID: Tf,
  $ZodLazy: zp,
  $ZodLiteral: gp,
  $ZodMAC: Lf,
  $ZodMap: pp,
  $ZodNaN: xp,
  $ZodNanoID: xf,
  $ZodNever: tp,
  $ZodNonOptional: kp,
  $ZodNull: Xf,
  $ZodNullable: yp,
  $ZodNumber: ca,
  $ZodNumberFormat: qf,
  $ZodObject: sp,
  $ZodObjectJIT: up,
  $ZodOptional: ha,
  $ZodPipe: ma,
  $ZodPrefault: Sp,
  $ZodPreprocess: Op,
  $ZodPromise: Tp,
  $ZodReadonly: Ep,
  $ZodRealError: Oe,
  $ZodRecord: fp,
  $ZodRegistry: Mp,
  $ZodSet: hp,
  $ZodString: Lr,
  $ZodStringFormat: ee,
  $ZodSuccess: wp,
  $ZodSymbol: Kf,
  $ZodTemplateLiteral: Pp,
  $ZodTransform: $p,
  $ZodTuple: pa,
  $ZodType: G,
  $ZodULID: Pf,
  $ZodURL: wf,
  $ZodUUID: Sf,
  $ZodUndefined: Yf,
  $ZodUnion: hi,
  $ZodUnknown: ep,
  $ZodVoid: rp,
  $ZodXID: Nf,
  $ZodXor: lp,
  $brand: qc,
  $constructor: S,
  $input: jp,
  $output: Lp,
  Doc: _f,
  JSONSchema: u6,
  JSONSchemaGenerator: s6,
  NEVER: Vt,
  TimePrecision: Gp,
  _any: dh,
  _array: $h,
  _base64: Da,
  _base64url: Ca,
  _bigint: ih,
  _boolean: rh,
  _catch: e6,
  _check: kh,
  _cidrv4: za,
  _cidrv6: Aa,
  _coercedBigint: oh,
  _coercedBoolean: nh,
  _coercedDate: gh,
  _coercedNumber: Kp,
  _coercedString: Fp,
  _cuid: Ia,
  _cuid2: xa,
  _custom: yh,
  _date: mh,
  _decode: Ko,
  _decodeAsync: Xo,
  _default: Y_,
  _discriminatedUnion: j_,
  _e164: Ua,
  _email: $a,
  _emoji: ka,
  _encode: Wo,
  _encodeAsync: Yo,
  _endsWith: bi,
  _enum: H_,
  _file: _h,
  _float32: Xp,
  _float64: Qp,
  _gt: ct,
  _gte: be,
  _guid: Kn,
  _includes: _i,
  _int: Yp,
  _int32: eh,
  _int64: ah,
  _intersection: M_,
  _ipv4: Na,
  _ipv6: Ta,
  _isoDate: Jp,
  _isoDateTime: Hp,
  _isoDuration: qp,
  _isoTime: Vp,
  _jwt: Ra,
  _ksuid: Pa,
  _lazy: i6,
  _length: Zr,
  _literal: V_,
  _lowercase: vi,
  _lt: lt,
  _lte: Ae,
  _mac: Bp,
  _map: B_,
  _max: Ae,
  _maxLength: Mr,
  _maxSize: lr,
  _mime: Si,
  _min: be,
  _minLength: Et,
  _minSize: dt,
  _multipleOf: er,
  _nan: vh,
  _nanoid: wa,
  _nativeEnum: J_,
  _negative: ja,
  _never: ph,
  _nonnegative: Za,
  _nonoptional: X_,
  _nonpositive: Ma,
  _normalize: ki,
  _null: ch,
  _nullable: K_,
  _number: Wp,
  _optional: W_,
  _overwrite: nt,
  _parse: Tr,
  _parseAsync: zr,
  _pipe: t6,
  _positive: La,
  _promise: o6,
  _property: Fa,
  _readonly: r6,
  _record: F_,
  _refine: bh,
  _regex: gi,
  _safeDecode: ea,
  _safeDecodeAsync: ra,
  _safeEncode: Qo,
  _safeEncodeAsync: ta,
  _safeParse: Ar,
  _safeParseAsync: Dr,
  _set: G_,
  _size: jr,
  _slugify: Oi,
  _startsWith: yi,
  _string: Zp,
  _stringFormat: Fr,
  _stringbool: xh,
  _success: Q_,
  _superRefine: Sh,
  _symbol: uh,
  _templateLiteral: n6,
  _toLowerCase: Ii,
  _toUpperCase: xi,
  _transform: q_,
  _trim: wi,
  _tuple: Z_,
  _uint32: th,
  _uint64: sh,
  _ulid: Oa,
  _undefined: lh,
  _union: R_,
  _unknown: fh,
  _uppercase: $i,
  _url: mi,
  _uuid: _a,
  _uuidv4: ya,
  _uuidv6: ba,
  _uuidv7: Sa,
  _void: hh,
  _xid: Ea,
  _xor: L_,
  clone: Ce,
  config: pe,
  createStandardJSONSchemaMethod: kr,
  createToJSONSchemaMethod: Oh,
  decode: m4,
  decodeAsync: v4,
  describe: wh,
  encode: h4,
  encodeAsync: g4,
  extractDefs: rr,
  finalize: nr,
  flattenError: Vo,
  formatError: qo,
  globalConfig: Sr,
  globalRegistry: ze,
  initializeContext: tr,
  isValidBase64: la,
  isValidBase64URL: Ff,
  isValidJWT: Hf,
  locales: Rp,
  meta: Ih,
  parse: wo,
  parseAsync: Io,
  prettifyError: gd,
  process: Q,
  regexes: aa,
  registry: va,
  safeDecode: _4,
  safeDecodeAsync: b4,
  safeEncode: $4,
  safeEncodeAsync: y4,
  safeParse: vd,
  safeParseAsync: $d,
  toDotPath: md,
  toJSONSchema: dm,
  treeifyError: hd,
  util: fd,
  version: yf
}, Symbol.toStringTag, { value: "Module" })), c6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  endsWith: bi,
  gt: ct,
  gte: be,
  includes: _i,
  length: Zr,
  lowercase: vi,
  lt,
  lte: Ae,
  maxLength: Mr,
  maxSize: lr,
  mime: Si,
  minLength: Et,
  minSize: dt,
  multipleOf: er,
  negative: ja,
  nonnegative: Za,
  nonpositive: Ma,
  normalize: ki,
  overwrite: nt,
  positive: La,
  property: Fa,
  regex: gi,
  size: jr,
  slugify: Oi,
  startsWith: yi,
  toLowerCase: Ii,
  toUpperCase: xi,
  trim: wi,
  uppercase: $i
}, Symbol.toStringTag, { value: "Module" })), Ha = /* @__PURE__ */ S("ZodISODateTime", (e, t) => {
  zf.init(e, t), te.init(e, t);
});
function fm(e) {
  return /* @__PURE__ */ Hp(Ha, e);
}
const Ja = /* @__PURE__ */ S("ZodISODate", (e, t) => {
  Af.init(e, t), te.init(e, t);
});
function pm(e) {
  return /* @__PURE__ */ Jp(Ja, e);
}
const Va = /* @__PURE__ */ S("ZodISOTime", (e, t) => {
  Df.init(e, t), te.init(e, t);
});
function hm(e) {
  return /* @__PURE__ */ Vp(Va, e);
}
const qa = /* @__PURE__ */ S("ZodISODuration", (e, t) => {
  Cf.init(e, t), te.init(e, t);
});
function mm(e) {
  return /* @__PURE__ */ qp(qa, e);
}
const gm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ZodISODate: Ja,
  ZodISODateTime: Ha,
  ZodISODuration: qa,
  ZodISOTime: Va,
  date: pm,
  datetime: fm,
  duration: mm,
  time: hm
}, Symbol.toStringTag, { value: "Module" })), vm = (e, t) => {
  Jo.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
    format: {
      value: (n) => qo(e, n)
      // enumerable: false,
    },
    flatten: {
      value: (n) => Vo(e, n)
      // enumerable: false,
    },
    addIssue: {
      value: (n) => {
        e.issues.push(n), e.message = JSON.stringify(e.issues, Vn, 2);
      }
      // enumerable: false,
    },
    addIssues: {
      value: (n) => {
        e.issues.push(...n), e.message = JSON.stringify(e.issues, Vn, 2);
      }
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return e.issues.length === 0;
      }
      // enumerable: false,
    }
  });
}, d6 = /* @__PURE__ */ S("ZodError", vm), Ee = /* @__PURE__ */ S("ZodError", vm, {
  Parent: Error
}), $m = /* @__PURE__ */ Tr(Ee), _m = /* @__PURE__ */ zr(Ee), ym = /* @__PURE__ */ Ar(Ee), bm = /* @__PURE__ */ Dr(Ee), Sm = /* @__PURE__ */ Wo(Ee), km = /* @__PURE__ */ Ko(Ee), wm = /* @__PURE__ */ Yo(Ee), Im = /* @__PURE__ */ Xo(Ee), xm = /* @__PURE__ */ Qo(Ee), Om = /* @__PURE__ */ ea(Ee), Em = /* @__PURE__ */ ta(Ee), Pm = /* @__PURE__ */ ra(Ee), Ll = /* @__PURE__ */ new WeakMap();
function Br(e, t, n) {
  const i = Object.getPrototypeOf(e);
  let r = Ll.get(i);
  if (r || (r = /* @__PURE__ */ new Set(), Ll.set(i, r)), !r.has(t)) {
    r.add(t);
    for (const o in n) {
      const a = n[o];
      Object.defineProperty(i, o, {
        configurable: !0,
        enumerable: !1,
        get() {
          const s = a.bind(this);
          return Object.defineProperty(this, o, {
            configurable: !0,
            writable: !0,
            enumerable: !0,
            value: s
          }), s;
        },
        set(s) {
          Object.defineProperty(this, o, {
            configurable: !0,
            writable: !0,
            enumerable: !0,
            value: s
          });
        }
      });
    }
  }
}
const H = /* @__PURE__ */ S("ZodType", (e, t) => (G.init(e, t), Object.assign(e["~standard"], {
  jsonSchema: {
    input: kr(e, "input"),
    output: kr(e, "output")
  }
}), e.toJSONSchema = Oh(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.parse = (n, i) => $m(e, n, i, { callee: e.parse }), e.safeParse = (n, i) => ym(e, n, i), e.parseAsync = async (n, i) => _m(e, n, i, { callee: e.parseAsync }), e.safeParseAsync = async (n, i) => bm(e, n, i), e.spa = e.safeParseAsync, e.encode = (n, i) => Sm(e, n, i), e.decode = (n, i) => km(e, n, i), e.encodeAsync = async (n, i) => wm(e, n, i), e.decodeAsync = async (n, i) => Im(e, n, i), e.safeEncode = (n, i) => xm(e, n, i), e.safeDecode = (n, i) => Om(e, n, i), e.safeEncodeAsync = async (n, i) => Em(e, n, i), e.safeDecodeAsync = async (n, i) => Pm(e, n, i), Br(e, "ZodType", {
  check(...n) {
    const i = this.def;
    return this.clone(Ve(i, {
      checks: [
        ...i.checks ?? [],
        ...n.map((r) => typeof r == "function" ? { _zod: { check: r, def: { check: "custom" }, onattach: [] } } : r)
      ]
    }), { parent: !0 });
  },
  with(...n) {
    return this.check(...n);
  },
  clone(n, i) {
    return Ce(this, n, i);
  },
  brand() {
    return this;
  },
  register(n, i) {
    return n.add(this, i), this;
  },
  refine(n, i) {
    return this.check(js(n, i));
  },
  superRefine(n, i) {
    return this.check(Ms(n, i));
  },
  overwrite(n) {
    return this.check(/* @__PURE__ */ nt(n));
  },
  optional() {
    return xr(this);
  },
  exactOptional() {
    return ys(this);
  },
  nullable() {
    return Or(this);
  },
  nullish() {
    return xr(Or(this));
  },
  nonoptional(n) {
    return xs(this, n);
  },
  array() {
    return Rt(this);
  },
  or(n) {
    return qi([this, n]);
  },
  and(n) {
    return cs(this, n);
  },
  transform(n) {
    return Xn(this, Ki(n));
  },
  default(n) {
    return ks(this, n);
  },
  prefault(n) {
    return Is(this, n);
  },
  catch(n) {
    return Ps(this, n);
  },
  pipe(n) {
    return Xn(this, n);
  },
  readonly() {
    return As(this);
  },
  describe(n) {
    const i = this.clone();
    return ze.add(i, { description: n }), i;
  },
  meta(...n) {
    if (n.length === 0)
      return ze.get(this);
    const i = this.clone();
    return ze.add(i, n[0]), i;
  },
  isOptional() {
    return this.safeParse(void 0).success;
  },
  isNullable() {
    return this.safeParse(null).success;
  },
  apply(n) {
    return n(this);
  }
}), Object.defineProperty(e, "description", {
  get() {
    return ze.get(e)?.description;
  },
  configurable: !0
}), e)), Ei = /* @__PURE__ */ S("_ZodString", (e, t) => {
  Lr.init(e, t), H.init(e, t), e._zod.processJSONSchema = (i, r, o) => Eh(e, i, r);
  const n = e._zod.bag;
  e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null, Br(e, "_ZodString", {
    regex(...i) {
      return this.check(/* @__PURE__ */ gi(...i));
    },
    includes(...i) {
      return this.check(/* @__PURE__ */ _i(...i));
    },
    startsWith(...i) {
      return this.check(/* @__PURE__ */ yi(...i));
    },
    endsWith(...i) {
      return this.check(/* @__PURE__ */ bi(...i));
    },
    min(...i) {
      return this.check(/* @__PURE__ */ Et(...i));
    },
    max(...i) {
      return this.check(/* @__PURE__ */ Mr(...i));
    },
    length(...i) {
      return this.check(/* @__PURE__ */ Zr(...i));
    },
    nonempty(...i) {
      return this.check(/* @__PURE__ */ Et(1, ...i));
    },
    lowercase(i) {
      return this.check(/* @__PURE__ */ vi(i));
    },
    uppercase(i) {
      return this.check(/* @__PURE__ */ $i(i));
    },
    trim() {
      return this.check(/* @__PURE__ */ wi());
    },
    normalize(...i) {
      return this.check(/* @__PURE__ */ ki(...i));
    },
    toLowerCase() {
      return this.check(/* @__PURE__ */ Ii());
    },
    toUpperCase() {
      return this.check(/* @__PURE__ */ xi());
    },
    slugify() {
      return this.check(/* @__PURE__ */ Oi());
    }
  });
}), Gr = /* @__PURE__ */ S("ZodString", (e, t) => {
  Lr.init(e, t), Ei.init(e, t), e.email = (n) => e.check(/* @__PURE__ */ $a(Pi, n)), e.url = (n) => e.check(/* @__PURE__ */ mi(Hr, n)), e.jwt = (n) => e.check(/* @__PURE__ */ Ra(Gi, n)), e.emoji = (n) => e.check(/* @__PURE__ */ ka(Ni, n)), e.guid = (n) => e.check(/* @__PURE__ */ Kn(wr, n)), e.uuid = (n) => e.check(/* @__PURE__ */ _a(Be, n)), e.uuidv4 = (n) => e.check(/* @__PURE__ */ ya(Be, n)), e.uuidv6 = (n) => e.check(/* @__PURE__ */ ba(Be, n)), e.uuidv7 = (n) => e.check(/* @__PURE__ */ Sa(Be, n)), e.nanoid = (n) => e.check(/* @__PURE__ */ wa(Ti, n)), e.guid = (n) => e.check(/* @__PURE__ */ Kn(wr, n)), e.cuid = (n) => e.check(/* @__PURE__ */ Ia(zi, n)), e.cuid2 = (n) => e.check(/* @__PURE__ */ xa(Ai, n)), e.ulid = (n) => e.check(/* @__PURE__ */ Oa(Di, n)), e.base64 = (n) => e.check(/* @__PURE__ */ Da(Zi, n)), e.base64url = (n) => e.check(/* @__PURE__ */ Ca(Fi, n)), e.xid = (n) => e.check(/* @__PURE__ */ Ea(Ci, n)), e.ksuid = (n) => e.check(/* @__PURE__ */ Pa(Ui, n)), e.ipv4 = (n) => e.check(/* @__PURE__ */ Na(Ri, n)), e.ipv6 = (n) => e.check(/* @__PURE__ */ Ta(Li, n)), e.cidrv4 = (n) => e.check(/* @__PURE__ */ za(ji, n)), e.cidrv6 = (n) => e.check(/* @__PURE__ */ Aa(Mi, n)), e.e164 = (n) => e.check(/* @__PURE__ */ Ua(Bi, n)), e.datetime = (n) => e.check(fm(n)), e.date = (n) => e.check(pm(n)), e.time = (n) => e.check(hm(n)), e.duration = (n) => e.check(mm(n));
});
function Je(e) {
  return /* @__PURE__ */ Zp(Gr, e);
}
const te = /* @__PURE__ */ S("ZodStringFormat", (e, t) => {
  ee.init(e, t), Ei.init(e, t);
}), Pi = /* @__PURE__ */ S("ZodEmail", (e, t) => {
  kf.init(e, t), te.init(e, t);
});
function Nm(e) {
  return /* @__PURE__ */ $a(Pi, e);
}
const wr = /* @__PURE__ */ S("ZodGUID", (e, t) => {
  bf.init(e, t), te.init(e, t);
});
function Tm(e) {
  return /* @__PURE__ */ Kn(wr, e);
}
const Be = /* @__PURE__ */ S("ZodUUID", (e, t) => {
  Sf.init(e, t), te.init(e, t);
});
function zm(e) {
  return /* @__PURE__ */ _a(Be, e);
}
function Am(e) {
  return /* @__PURE__ */ ya(Be, e);
}
function Dm(e) {
  return /* @__PURE__ */ ba(Be, e);
}
function Cm(e) {
  return /* @__PURE__ */ Sa(Be, e);
}
const Hr = /* @__PURE__ */ S("ZodURL", (e, t) => {
  wf.init(e, t), te.init(e, t);
});
function Um(e) {
  return /* @__PURE__ */ mi(Hr, e);
}
function Rm(e) {
  return /* @__PURE__ */ mi(Hr, {
    protocol: ia,
    hostname: Rd,
    ...N(e)
  });
}
const Ni = /* @__PURE__ */ S("ZodEmoji", (e, t) => {
  If.init(e, t), te.init(e, t);
});
function Lm(e) {
  return /* @__PURE__ */ ka(Ni, e);
}
const Ti = /* @__PURE__ */ S("ZodNanoID", (e, t) => {
  xf.init(e, t), te.init(e, t);
});
function jm(e) {
  return /* @__PURE__ */ wa(Ti, e);
}
const zi = /* @__PURE__ */ S("ZodCUID", (e, t) => {
  Of.init(e, t), te.init(e, t);
});
function Mm(e) {
  return /* @__PURE__ */ Ia(zi, e);
}
const Ai = /* @__PURE__ */ S("ZodCUID2", (e, t) => {
  Ef.init(e, t), te.init(e, t);
});
function Zm(e) {
  return /* @__PURE__ */ xa(Ai, e);
}
const Di = /* @__PURE__ */ S("ZodULID", (e, t) => {
  Pf.init(e, t), te.init(e, t);
});
function Fm(e) {
  return /* @__PURE__ */ Oa(Di, e);
}
const Ci = /* @__PURE__ */ S("ZodXID", (e, t) => {
  Nf.init(e, t), te.init(e, t);
});
function Bm(e) {
  return /* @__PURE__ */ Ea(Ci, e);
}
const Ui = /* @__PURE__ */ S("ZodKSUID", (e, t) => {
  Tf.init(e, t), te.init(e, t);
});
function Gm(e) {
  return /* @__PURE__ */ Pa(Ui, e);
}
const Ri = /* @__PURE__ */ S("ZodIPv4", (e, t) => {
  Uf.init(e, t), te.init(e, t);
});
function Hm(e) {
  return /* @__PURE__ */ Na(Ri, e);
}
const Wa = /* @__PURE__ */ S("ZodMAC", (e, t) => {
  Lf.init(e, t), te.init(e, t);
});
function Jm(e) {
  return /* @__PURE__ */ Bp(Wa, e);
}
const Li = /* @__PURE__ */ S("ZodIPv6", (e, t) => {
  Rf.init(e, t), te.init(e, t);
});
function Vm(e) {
  return /* @__PURE__ */ Ta(Li, e);
}
const ji = /* @__PURE__ */ S("ZodCIDRv4", (e, t) => {
  jf.init(e, t), te.init(e, t);
});
function qm(e) {
  return /* @__PURE__ */ za(ji, e);
}
const Mi = /* @__PURE__ */ S("ZodCIDRv6", (e, t) => {
  Mf.init(e, t), te.init(e, t);
});
function Wm(e) {
  return /* @__PURE__ */ Aa(Mi, e);
}
const Zi = /* @__PURE__ */ S("ZodBase64", (e, t) => {
  Zf.init(e, t), te.init(e, t);
});
function Km(e) {
  return /* @__PURE__ */ Da(Zi, e);
}
const Fi = /* @__PURE__ */ S("ZodBase64URL", (e, t) => {
  Bf.init(e, t), te.init(e, t);
});
function Ym(e) {
  return /* @__PURE__ */ Ca(Fi, e);
}
const Bi = /* @__PURE__ */ S("ZodE164", (e, t) => {
  Gf.init(e, t), te.init(e, t);
});
function Xm(e) {
  return /* @__PURE__ */ Ua(Bi, e);
}
const Gi = /* @__PURE__ */ S("ZodJWT", (e, t) => {
  Jf.init(e, t), te.init(e, t);
});
function Qm(e) {
  return /* @__PURE__ */ Ra(Gi, e);
}
const cr = /* @__PURE__ */ S("ZodCustomStringFormat", (e, t) => {
  Vf.init(e, t), te.init(e, t);
});
function e1(e, t, n = {}) {
  return /* @__PURE__ */ Fr(cr, e, t, n);
}
function t1(e) {
  return /* @__PURE__ */ Fr(cr, "hostname", Ud, e);
}
function r1(e) {
  return /* @__PURE__ */ Fr(cr, "hex", Xd, e);
}
function n1(e, t) {
  const n = t?.enc ?? "hex", i = `${e}_${n}`, r = aa[i];
  if (!r)
    throw new Error(`Unrecognized hash format: ${i}`);
  return /* @__PURE__ */ Fr(cr, i, r, t);
}
const Jr = /* @__PURE__ */ S("ZodNumber", (e, t) => {
  ca.init(e, t), H.init(e, t), e._zod.processJSONSchema = (i, r, o) => Ph(e, i, r), Br(e, "ZodNumber", {
    gt(i, r) {
      return this.check(/* @__PURE__ */ ct(i, r));
    },
    gte(i, r) {
      return this.check(/* @__PURE__ */ be(i, r));
    },
    min(i, r) {
      return this.check(/* @__PURE__ */ be(i, r));
    },
    lt(i, r) {
      return this.check(/* @__PURE__ */ lt(i, r));
    },
    lte(i, r) {
      return this.check(/* @__PURE__ */ Ae(i, r));
    },
    max(i, r) {
      return this.check(/* @__PURE__ */ Ae(i, r));
    },
    int(i) {
      return this.check(Yn(i));
    },
    safe(i) {
      return this.check(Yn(i));
    },
    positive(i) {
      return this.check(/* @__PURE__ */ ct(0, i));
    },
    nonnegative(i) {
      return this.check(/* @__PURE__ */ be(0, i));
    },
    negative(i) {
      return this.check(/* @__PURE__ */ lt(0, i));
    },
    nonpositive(i) {
      return this.check(/* @__PURE__ */ Ae(0, i));
    },
    multipleOf(i, r) {
      return this.check(/* @__PURE__ */ er(i, r));
    },
    step(i, r) {
      return this.check(/* @__PURE__ */ er(i, r));
    },
    finite() {
      return this;
    }
  });
  const n = e._zod.bag;
  e.minValue = Math.max(n.minimum ?? Number.NEGATIVE_INFINITY, n.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, e.maxValue = Math.min(n.maximum ?? Number.POSITIVE_INFINITY, n.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, e.isInt = (n.format ?? "").includes("int") || Number.isSafeInteger(n.multipleOf ?? 0.5), e.isFinite = !0, e.format = n.format ?? null;
});
function Ka(e) {
  return /* @__PURE__ */ Wp(Jr, e);
}
const Ut = /* @__PURE__ */ S("ZodNumberFormat", (e, t) => {
  qf.init(e, t), Jr.init(e, t);
});
function Yn(e) {
  return /* @__PURE__ */ Yp(Ut, e);
}
function i1(e) {
  return /* @__PURE__ */ Xp(Ut, e);
}
function o1(e) {
  return /* @__PURE__ */ Qp(Ut, e);
}
function a1(e) {
  return /* @__PURE__ */ eh(Ut, e);
}
function s1(e) {
  return /* @__PURE__ */ th(Ut, e);
}
const Vr = /* @__PURE__ */ S("ZodBoolean", (e, t) => {
  da.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Nh(e, n, i);
});
function Ir(e) {
  return /* @__PURE__ */ rh(Vr, e);
}
const qr = /* @__PURE__ */ S("ZodBigInt", (e, t) => {
  fa.init(e, t), H.init(e, t), e._zod.processJSONSchema = (i, r, o) => Th(e, i), e.gte = (i, r) => e.check(/* @__PURE__ */ be(i, r)), e.min = (i, r) => e.check(/* @__PURE__ */ be(i, r)), e.gt = (i, r) => e.check(/* @__PURE__ */ ct(i, r)), e.gte = (i, r) => e.check(/* @__PURE__ */ be(i, r)), e.min = (i, r) => e.check(/* @__PURE__ */ be(i, r)), e.lt = (i, r) => e.check(/* @__PURE__ */ lt(i, r)), e.lte = (i, r) => e.check(/* @__PURE__ */ Ae(i, r)), e.max = (i, r) => e.check(/* @__PURE__ */ Ae(i, r)), e.positive = (i) => e.check(/* @__PURE__ */ ct(BigInt(0), i)), e.negative = (i) => e.check(/* @__PURE__ */ lt(BigInt(0), i)), e.nonpositive = (i) => e.check(/* @__PURE__ */ Ae(BigInt(0), i)), e.nonnegative = (i) => e.check(/* @__PURE__ */ be(BigInt(0), i)), e.multipleOf = (i, r) => e.check(/* @__PURE__ */ er(i, r));
  const n = e._zod.bag;
  e.minValue = n.minimum ?? null, e.maxValue = n.maximum ?? null, e.format = n.format ?? null;
});
function u1(e) {
  return /* @__PURE__ */ ih(qr, e);
}
const Hi = /* @__PURE__ */ S("ZodBigIntFormat", (e, t) => {
  Wf.init(e, t), qr.init(e, t);
});
function l1(e) {
  return /* @__PURE__ */ ah(Hi, e);
}
function c1(e) {
  return /* @__PURE__ */ sh(Hi, e);
}
const Ya = /* @__PURE__ */ S("ZodSymbol", (e, t) => {
  Kf.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => zh(e, n);
});
function d1(e) {
  return /* @__PURE__ */ uh(Ya, e);
}
const Xa = /* @__PURE__ */ S("ZodUndefined", (e, t) => {
  Yf.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Dh(e, n);
});
function f1(e) {
  return /* @__PURE__ */ lh(Xa, e);
}
const Qa = /* @__PURE__ */ S("ZodNull", (e, t) => {
  Xf.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Ah(e, n, i);
});
function es(e) {
  return /* @__PURE__ */ ch(Qa, e);
}
const ts = /* @__PURE__ */ S("ZodAny", (e, t) => {
  Qf.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Rh();
});
function p1() {
  return /* @__PURE__ */ dh(ts);
}
const rs = /* @__PURE__ */ S("ZodUnknown", (e, t) => {
  ep.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Lh();
});
function Pt() {
  return /* @__PURE__ */ fh(rs);
}
const ns = /* @__PURE__ */ S("ZodNever", (e, t) => {
  tp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Uh(e, n, i);
});
function Ji(e) {
  return /* @__PURE__ */ ph(ns, e);
}
const is = /* @__PURE__ */ S("ZodVoid", (e, t) => {
  rp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Ch(e, n);
});
function h1(e) {
  return /* @__PURE__ */ hh(is, e);
}
const Vi = /* @__PURE__ */ S("ZodDate", (e, t) => {
  np.init(e, t), H.init(e, t), e._zod.processJSONSchema = (i, r, o) => jh(e, i), e.min = (i, r) => e.check(/* @__PURE__ */ be(i, r)), e.max = (i, r) => e.check(/* @__PURE__ */ Ae(i, r));
  const n = e._zod.bag;
  e.minDate = n.minimum ? new Date(n.minimum) : null, e.maxDate = n.maximum ? new Date(n.maximum) : null;
});
function m1(e) {
  return /* @__PURE__ */ mh(Vi, e);
}
const os = /* @__PURE__ */ S("ZodArray", (e, t) => {
  ip.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Yh(e, n, i, r), e.element = t.element, Br(e, "ZodArray", {
    min(n, i) {
      return this.check(/* @__PURE__ */ Et(n, i));
    },
    nonempty(n) {
      return this.check(/* @__PURE__ */ Et(1, n));
    },
    max(n, i) {
      return this.check(/* @__PURE__ */ Mr(n, i));
    },
    length(n, i) {
      return this.check(/* @__PURE__ */ Zr(n, i));
    },
    unwrap() {
      return this.element;
    }
  });
});
function Rt(e, t) {
  return /* @__PURE__ */ $h(os, e, t);
}
function g1(e) {
  const t = e._zod.def.shape;
  return Wi(Object.keys(t));
}
const Wr = /* @__PURE__ */ S("ZodObject", (e, t) => {
  up.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Xh(e, n, i, r), J(e, "shape", () => t.shape), Br(e, "ZodObject", {
    keyof() {
      return Wi(Object.keys(this._zod.def.shape));
    },
    catchall(n) {
      return this.clone({ ...this._zod.def, catchall: n });
    },
    passthrough() {
      return this.clone({ ...this._zod.def, catchall: Pt() });
    },
    loose() {
      return this.clone({ ...this._zod.def, catchall: Pt() });
    },
    strict() {
      return this.clone({ ...this._zod.def, catchall: Ji() });
    },
    strip() {
      return this.clone({ ...this._zod.def, catchall: void 0 });
    },
    extend(n) {
      return id(this, n);
    },
    safeExtend(n) {
      return od(this, n);
    },
    merge(n) {
      return ad(this, n);
    },
    pick(n) {
      return rd(this, n);
    },
    omit(n) {
      return nd(this, n);
    },
    partial(...n) {
      return sd(Yi, this, n[0]);
    },
    required(...n) {
      return ud(Xi, this, n[0]);
    }
  });
});
function as(e, t) {
  const n = {
    type: "object",
    shape: e ?? {},
    ...N(t)
  };
  return new Wr(n);
}
function v1(e, t) {
  return new Wr({
    type: "object",
    shape: e,
    catchall: Ji(),
    ...N(t)
  });
}
function $1(e, t) {
  return new Wr({
    type: "object",
    shape: e,
    catchall: Pt(),
    ...N(t)
  });
}
const Kr = /* @__PURE__ */ S("ZodUnion", (e, t) => {
  hi.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Ba(e, n, i, r), e.options = t.options;
});
function qi(e, t) {
  return new Kr({
    type: "union",
    options: e,
    ...N(t)
  });
}
const ss = /* @__PURE__ */ S("ZodXor", (e, t) => {
  Kr.init(e, t), lp.init(e, t), e._zod.processJSONSchema = (n, i, r) => Ba(e, n, i, r), e.options = t.options;
});
function _1(e, t) {
  return new ss({
    type: "union",
    options: e,
    inclusive: !1,
    ...N(t)
  });
}
const us = /* @__PURE__ */ S("ZodDiscriminatedUnion", (e, t) => {
  Kr.init(e, t), cp.init(e, t);
});
function y1(e, t, n) {
  return new us({
    type: "union",
    options: t,
    discriminator: e,
    ...N(n)
  });
}
const ls = /* @__PURE__ */ S("ZodIntersection", (e, t) => {
  dp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Qh(e, n, i, r);
});
function cs(e, t) {
  return new ls({
    type: "intersection",
    left: e,
    right: t
  });
}
const ds = /* @__PURE__ */ S("ZodTuple", (e, t) => {
  pa.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => em(e, n, i, r), e.rest = (n) => e.clone({
    ...e._zod.def,
    rest: n
  });
});
function fs(e, t, n) {
  const i = t instanceof G, r = i ? n : t, o = i ? t : null;
  return new ds({
    type: "tuple",
    items: e,
    rest: o,
    ...N(r)
  });
}
const ir = /* @__PURE__ */ S("ZodRecord", (e, t) => {
  fp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => tm(e, n, i, r), e.keyType = t.keyType, e.valueType = t.valueType;
});
function ps(e, t, n) {
  return !t || !t._zod ? new ir({
    type: "record",
    keyType: Je(),
    valueType: e,
    ...N(t)
  }) : new ir({
    type: "record",
    keyType: e,
    valueType: t,
    ...N(n)
  });
}
function b1(e, t, n) {
  const i = Ce(e);
  return i._zod.values = void 0, new ir({
    type: "record",
    keyType: i,
    valueType: t,
    ...N(n)
  });
}
function S1(e, t, n) {
  return new ir({
    type: "record",
    keyType: e,
    valueType: t,
    mode: "loose",
    ...N(n)
  });
}
const hs = /* @__PURE__ */ S("ZodMap", (e, t) => {
  pp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Wh(e, n), e.keyType = t.keyType, e.valueType = t.valueType, e.min = (...n) => e.check(/* @__PURE__ */ dt(...n)), e.nonempty = (n) => e.check(/* @__PURE__ */ dt(1, n)), e.max = (...n) => e.check(/* @__PURE__ */ lr(...n)), e.size = (...n) => e.check(/* @__PURE__ */ jr(...n));
});
function k1(e, t, n) {
  return new hs({
    type: "map",
    keyType: e,
    valueType: t,
    ...N(n)
  });
}
const ms = /* @__PURE__ */ S("ZodSet", (e, t) => {
  hp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Kh(e, n), e.min = (...n) => e.check(/* @__PURE__ */ dt(...n)), e.nonempty = (n) => e.check(/* @__PURE__ */ dt(1, n)), e.max = (...n) => e.check(/* @__PURE__ */ lr(...n)), e.size = (...n) => e.check(/* @__PURE__ */ jr(...n));
});
function w1(e, t) {
  return new ms({
    type: "set",
    valueType: e,
    ...N(t)
  });
}
const or = /* @__PURE__ */ S("ZodEnum", (e, t) => {
  mp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (i, r, o) => Mh(e, i, r), e.enum = t.entries, e.options = Object.values(t.entries);
  const n = new Set(Object.keys(t.entries));
  e.extract = (i, r) => {
    const o = {};
    for (const a of i)
      if (n.has(a))
        o[a] = t.entries[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new or({
      ...t,
      checks: [],
      ...N(r),
      entries: o
    });
  }, e.exclude = (i, r) => {
    const o = { ...t.entries };
    for (const a of i)
      if (n.has(a))
        delete o[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new or({
      ...t,
      checks: [],
      ...N(r),
      entries: o
    });
  };
});
function Wi(e, t) {
  const n = Array.isArray(e) ? Object.fromEntries(e.map((i) => [i, i])) : e;
  return new or({
    type: "enum",
    entries: n,
    ...N(t)
  });
}
function I1(e, t) {
  return new or({
    type: "enum",
    entries: e,
    ...N(t)
  });
}
const gs = /* @__PURE__ */ S("ZodLiteral", (e, t) => {
  gp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Zh(e, n, i), e.values = new Set(t.values), Object.defineProperty(e, "value", {
    get() {
      if (t.values.length > 1)
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      return t.values[0];
    }
  });
});
function x1(e, t) {
  return new gs({
    type: "literal",
    values: Array.isArray(e) ? e : [e],
    ...N(t)
  });
}
const vs = /* @__PURE__ */ S("ZodFile", (e, t) => {
  vp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Gh(e, n, i), e.min = (n, i) => e.check(/* @__PURE__ */ dt(n, i)), e.max = (n, i) => e.check(/* @__PURE__ */ lr(n, i)), e.mime = (n, i) => e.check(/* @__PURE__ */ Si(Array.isArray(n) ? n : [n], i));
});
function O1(e) {
  return /* @__PURE__ */ _h(vs, e);
}
const $s = /* @__PURE__ */ S("ZodTransform", (e, t) => {
  $p.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => qh(e, n), e._zod.parse = (n, i) => {
    if (i.direction === "backward")
      throw new li(e.constructor.name);
    n.addIssue = (o) => {
      if (typeof o == "string")
        n.issues.push(Xt(o, n.value, t));
      else {
        const a = o;
        a.fatal && (a.continue = !1), a.code ?? (a.code = "custom"), a.input ?? (a.input = n.value), a.inst ?? (a.inst = e), n.issues.push(Xt(a));
      }
    };
    const r = t.transform(n.value, n);
    return r instanceof Promise ? r.then((o) => (n.value = o, n.fallback = !0, n)) : (n.value = r, n.fallback = !0, n);
  };
});
function Ki(e) {
  return new $s({
    type: "transform",
    transform: e
  });
}
const Yi = /* @__PURE__ */ S("ZodOptional", (e, t) => {
  ha.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Ga(e, n, i, r), e.unwrap = () => e._zod.def.innerType;
});
function xr(e) {
  return new Yi({
    type: "optional",
    innerType: e
  });
}
const _s = /* @__PURE__ */ S("ZodExactOptional", (e, t) => {
  _p.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Ga(e, n, i, r), e.unwrap = () => e._zod.def.innerType;
});
function ys(e) {
  return new _s({
    type: "optional",
    innerType: e
  });
}
const bs = /* @__PURE__ */ S("ZodNullable", (e, t) => {
  yp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => rm(e, n, i, r), e.unwrap = () => e._zod.def.innerType;
});
function Or(e) {
  return new bs({
    type: "nullable",
    innerType: e
  });
}
function E1(e) {
  return xr(Or(e));
}
const Ss = /* @__PURE__ */ S("ZodDefault", (e, t) => {
  bp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => im(e, n, i, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function ks(e, t) {
  return new Ss({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : di(t);
    }
  });
}
const ws = /* @__PURE__ */ S("ZodPrefault", (e, t) => {
  Sp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => om(e, n, i, r), e.unwrap = () => e._zod.def.innerType;
});
function Is(e, t) {
  return new ws({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : di(t);
    }
  });
}
const Xi = /* @__PURE__ */ S("ZodNonOptional", (e, t) => {
  kp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => nm(e, n, i, r), e.unwrap = () => e._zod.def.innerType;
});
function xs(e, t) {
  return new Xi({
    type: "nonoptional",
    innerType: e,
    ...N(t)
  });
}
const Os = /* @__PURE__ */ S("ZodSuccess", (e, t) => {
  wp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Hh(e, n, i), e.unwrap = () => e._zod.def.innerType;
});
function P1(e) {
  return new Os({
    type: "success",
    innerType: e
  });
}
const Es = /* @__PURE__ */ S("ZodCatch", (e, t) => {
  Ip.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => am(e, n, i, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function Ps(e, t) {
  return new Es({
    type: "catch",
    innerType: e,
    catchValue: typeof t == "function" ? t : () => t
  });
}
const Ns = /* @__PURE__ */ S("ZodNaN", (e, t) => {
  xp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Fh(e, n);
});
function N1(e) {
  return /* @__PURE__ */ vh(Ns, e);
}
const Yr = /* @__PURE__ */ S("ZodPipe", (e, t) => {
  ma.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => sm(e, n, i, r), e.in = t.in, e.out = t.out;
});
function Xn(e, t) {
  return new Yr({
    type: "pipe",
    in: e,
    out: t
    // ...util.normalizeParams(params),
  });
}
const Xr = /* @__PURE__ */ S("ZodCodec", (e, t) => {
  Yr.init(e, t), ga.init(e, t);
});
function T1(e, t, n) {
  return new Xr({
    type: "pipe",
    in: e,
    out: t,
    transform: n.decode,
    reverseTransform: n.encode
  });
}
function z1(e) {
  const t = e._zod.def;
  return new Xr({
    type: "pipe",
    in: t.out,
    out: t.in,
    transform: t.reverseTransform,
    reverseTransform: t.transform
  });
}
const Ts = /* @__PURE__ */ S("ZodPreprocess", (e, t) => {
  Yr.init(e, t), Op.init(e, t);
}), zs = /* @__PURE__ */ S("ZodReadonly", (e, t) => {
  Ep.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => um(e, n, i, r), e.unwrap = () => e._zod.def.innerType;
});
function As(e) {
  return new zs({
    type: "readonly",
    innerType: e
  });
}
const Ds = /* @__PURE__ */ S("ZodTemplateLiteral", (e, t) => {
  Pp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Bh(e, n, i);
});
function A1(e, t) {
  return new Ds({
    type: "template_literal",
    parts: e,
    ...N(t)
  });
}
const Cs = /* @__PURE__ */ S("ZodLazy", (e, t) => {
  zp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => cm(e, n, i, r), e.unwrap = () => e._zod.def.getter();
});
function Us(e) {
  return new Cs({
    type: "lazy",
    getter: e
  });
}
const Rs = /* @__PURE__ */ S("ZodPromise", (e, t) => {
  Tp.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => lm(e, n, i, r), e.unwrap = () => e._zod.def.innerType;
});
function D1(e) {
  return new Rs({
    type: "promise",
    innerType: e
  });
}
const Ls = /* @__PURE__ */ S("ZodFunction", (e, t) => {
  Np.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Vh(e, n);
});
function Qn(e) {
  return new Ls({
    type: "function",
    input: Array.isArray(e?.input) ? fs(e?.input) : e?.input ?? Rt(Pt()),
    output: e?.output ?? Pt()
  });
}
const Qr = /* @__PURE__ */ S("ZodCustom", (e, t) => {
  Ap.init(e, t), H.init(e, t), e._zod.processJSONSchema = (n, i, r) => Jh(e, n);
});
function C1(e) {
  const t = new ae({
    check: "custom"
    // ...util.normalizeParams(params),
  });
  return t._zod.check = e, t;
}
function U1(e, t) {
  return /* @__PURE__ */ yh(Qr, e ?? (() => !0), t);
}
function js(e, t = {}) {
  return /* @__PURE__ */ bh(Qr, e, t);
}
function Ms(e, t) {
  return /* @__PURE__ */ Sh(e, t);
}
const R1 = wh, L1 = Ih;
function j1(e, t = {}) {
  const n = new Qr({
    type: "custom",
    check: "custom",
    fn: (i) => i instanceof e,
    abort: !0,
    ...N(t)
  });
  return n._zod.bag.Class = e, n._zod.check = (i) => {
    i.value instanceof e || i.issues.push({
      code: "invalid_type",
      expected: e.name,
      input: i.value,
      inst: n,
      path: [...n._zod.def.path ?? []]
    });
  }, n;
}
const M1 = (...e) => /* @__PURE__ */ xh({
  Codec: Xr,
  Boolean: Vr,
  String: Gr
}, ...e);
function Z1(e) {
  const t = Us(() => qi([Je(e), Ka(), Ir(), es(), Rt(t), ps(Je(), t)]));
  return t;
}
function Zs(e, t) {
  return new Ts({
    type: "pipe",
    in: Ki(e),
    out: t
  });
}
const f6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ZodAny: ts,
  ZodArray: os,
  ZodBase64: Zi,
  ZodBase64URL: Fi,
  ZodBigInt: qr,
  ZodBigIntFormat: Hi,
  ZodBoolean: Vr,
  ZodCIDRv4: ji,
  ZodCIDRv6: Mi,
  ZodCUID: zi,
  ZodCUID2: Ai,
  ZodCatch: Es,
  ZodCodec: Xr,
  ZodCustom: Qr,
  ZodCustomStringFormat: cr,
  ZodDate: Vi,
  ZodDefault: Ss,
  ZodDiscriminatedUnion: us,
  ZodE164: Bi,
  ZodEmail: Pi,
  ZodEmoji: Ni,
  ZodEnum: or,
  ZodExactOptional: _s,
  ZodFile: vs,
  ZodFunction: Ls,
  ZodGUID: wr,
  ZodIPv4: Ri,
  ZodIPv6: Li,
  ZodIntersection: ls,
  ZodJWT: Gi,
  ZodKSUID: Ui,
  ZodLazy: Cs,
  ZodLiteral: gs,
  ZodMAC: Wa,
  ZodMap: hs,
  ZodNaN: Ns,
  ZodNanoID: Ti,
  ZodNever: ns,
  ZodNonOptional: Xi,
  ZodNull: Qa,
  ZodNullable: bs,
  ZodNumber: Jr,
  ZodNumberFormat: Ut,
  ZodObject: Wr,
  ZodOptional: Yi,
  ZodPipe: Yr,
  ZodPrefault: ws,
  ZodPreprocess: Ts,
  ZodPromise: Rs,
  ZodReadonly: zs,
  ZodRecord: ir,
  ZodSet: ms,
  ZodString: Gr,
  ZodStringFormat: te,
  ZodSuccess: Os,
  ZodSymbol: Ya,
  ZodTemplateLiteral: Ds,
  ZodTransform: $s,
  ZodTuple: ds,
  ZodType: H,
  ZodULID: Di,
  ZodURL: Hr,
  ZodUUID: Be,
  ZodUndefined: Xa,
  ZodUnion: Kr,
  ZodUnknown: rs,
  ZodVoid: is,
  ZodXID: Ci,
  ZodXor: ss,
  _ZodString: Ei,
  _default: ks,
  _function: Qn,
  any: p1,
  array: Rt,
  base64: Km,
  base64url: Ym,
  bigint: u1,
  boolean: Ir,
  catch: Ps,
  check: C1,
  cidrv4: qm,
  cidrv6: Wm,
  codec: T1,
  cuid: Mm,
  cuid2: Zm,
  custom: U1,
  date: m1,
  describe: R1,
  discriminatedUnion: y1,
  e164: Xm,
  email: Nm,
  emoji: Lm,
  enum: Wi,
  exactOptional: ys,
  file: O1,
  float32: i1,
  float64: o1,
  function: Qn,
  guid: Tm,
  hash: n1,
  hex: r1,
  hostname: t1,
  httpUrl: Rm,
  instanceof: j1,
  int: Yn,
  int32: a1,
  int64: l1,
  intersection: cs,
  invertCodec: z1,
  ipv4: Hm,
  ipv6: Vm,
  json: Z1,
  jwt: Qm,
  keyof: g1,
  ksuid: Gm,
  lazy: Us,
  literal: x1,
  looseObject: $1,
  looseRecord: S1,
  mac: Jm,
  map: k1,
  meta: L1,
  nan: N1,
  nanoid: jm,
  nativeEnum: I1,
  never: Ji,
  nonoptional: xs,
  null: es,
  nullable: Or,
  nullish: E1,
  number: Ka,
  object: as,
  optional: xr,
  partialRecord: b1,
  pipe: Xn,
  prefault: Is,
  preprocess: Zs,
  promise: D1,
  readonly: As,
  record: ps,
  refine: js,
  set: w1,
  strictObject: v1,
  string: Je,
  stringFormat: e1,
  stringbool: M1,
  success: P1,
  superRefine: Ms,
  symbol: d1,
  templateLiteral: A1,
  transform: Ki,
  tuple: fs,
  uint32: s1,
  uint64: c1,
  ulid: Fm,
  undefined: f1,
  union: qi,
  unknown: Pt,
  url: Um,
  uuid: zm,
  uuidv4: Am,
  uuidv6: Dm,
  uuidv7: Cm,
  void: h1,
  xid: Bm,
  xor: _1
}, Symbol.toStringTag, { value: "Module" })), p6 = {
  invalid_type: "invalid_type",
  too_big: "too_big",
  too_small: "too_small",
  invalid_format: "invalid_format",
  not_multiple_of: "not_multiple_of",
  unrecognized_keys: "unrecognized_keys",
  invalid_union: "invalid_union",
  invalid_key: "invalid_key",
  invalid_element: "invalid_element",
  invalid_value: "invalid_value",
  custom: "custom"
};
function h6(e) {
  pe({
    customError: e
  });
}
function m6() {
  return pe().customError;
}
var Eo;
Eo || (Eo = {});
const A = {
  ...f6,
  ...c6,
  iso: gm
}, g6 = /* @__PURE__ */ new Set([
  // Schema identification
  "$schema",
  "$ref",
  "$defs",
  "definitions",
  // Core schema keywords
  "$id",
  "id",
  "$comment",
  "$anchor",
  "$vocabulary",
  "$dynamicRef",
  "$dynamicAnchor",
  // Type
  "type",
  "enum",
  "const",
  // Composition
  "anyOf",
  "oneOf",
  "allOf",
  "not",
  // Object
  "properties",
  "required",
  "additionalProperties",
  "patternProperties",
  "propertyNames",
  "minProperties",
  "maxProperties",
  // Array
  "items",
  "prefixItems",
  "additionalItems",
  "minItems",
  "maxItems",
  "uniqueItems",
  "contains",
  "minContains",
  "maxContains",
  // String
  "minLength",
  "maxLength",
  "pattern",
  "format",
  // Number
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "multipleOf",
  // Already handled metadata
  "description",
  "default",
  // Content
  "contentEncoding",
  "contentMediaType",
  "contentSchema",
  // Unsupported (error-throwing)
  "unevaluatedItems",
  "unevaluatedProperties",
  "if",
  "then",
  "else",
  "dependentSchemas",
  "dependentRequired",
  // OpenAPI
  "nullable",
  "readOnly"
]);
function v6(e, t) {
  const n = e.$schema;
  return n === "https://json-schema.org/draft/2020-12/schema" ? "draft-2020-12" : n === "http://json-schema.org/draft-07/schema#" ? "draft-7" : n === "http://json-schema.org/draft-04/schema#" ? "draft-4" : t ?? "draft-2020-12";
}
function $6(e, t) {
  if (!e.startsWith("#"))
    throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
  const n = e.slice(1).split("/").filter(Boolean);
  if (n.length === 0)
    return t.rootSchema;
  const i = t.version === "draft-2020-12" ? "$defs" : "definitions";
  if (n[0] === i) {
    const r = n[1];
    if (!r || !t.defs[r])
      throw new Error(`Reference not found: ${e}`);
    return t.defs[r];
  }
  throw new Error(`Reference not found: ${e}`);
}
function F1(e, t) {
  if (e.not !== void 0) {
    if (typeof e.not == "object" && Object.keys(e.not).length === 0)
      return A.never();
    throw new Error("not is not supported in Zod (except { not: {} } for never)");
  }
  if (e.unevaluatedItems !== void 0)
    throw new Error("unevaluatedItems is not supported");
  if (e.unevaluatedProperties !== void 0)
    throw new Error("unevaluatedProperties is not supported");
  if (e.if !== void 0 || e.then !== void 0 || e.else !== void 0)
    throw new Error("Conditional schemas (if/then/else) are not supported");
  if (e.dependentSchemas !== void 0 || e.dependentRequired !== void 0)
    throw new Error("dependentSchemas and dependentRequired are not supported");
  if (e.$ref) {
    const r = e.$ref;
    if (t.refs.has(r))
      return t.refs.get(r);
    if (t.processing.has(r))
      return A.lazy(() => {
        if (!t.refs.has(r))
          throw new Error(`Circular reference not resolved: ${r}`);
        return t.refs.get(r);
      });
    t.processing.add(r);
    const o = $6(r, t), a = ge(o, t);
    return t.refs.set(r, a), t.processing.delete(r), a;
  }
  if (e.enum !== void 0) {
    const r = e.enum;
    if (t.version === "openapi-3.0" && e.nullable === !0 && r.length === 1 && r[0] === null)
      return A.null();
    if (r.length === 0)
      return A.never();
    if (r.length === 1)
      return A.literal(r[0]);
    if (r.every((a) => typeof a == "string"))
      return A.enum(r);
    const o = r.map((a) => A.literal(a));
    return o.length < 2 ? o[0] : A.union([o[0], o[1], ...o.slice(2)]);
  }
  if (e.const !== void 0)
    return A.literal(e.const);
  const n = e.type;
  if (Array.isArray(n)) {
    const r = n.map((o) => {
      const a = { ...e, type: o };
      return F1(a, t);
    });
    return r.length === 0 ? A.never() : r.length === 1 ? r[0] : A.union(r);
  }
  if (!n)
    return A.any();
  let i;
  switch (n) {
    case "string": {
      let r = A.string();
      if (e.format) {
        const o = e.format;
        o === "email" ? r = r.check(A.email()) : o === "uri" || o === "uri-reference" ? r = r.check(A.url()) : o === "uuid" || o === "guid" ? r = r.check(A.uuid()) : o === "date-time" ? r = r.check(A.iso.datetime()) : o === "date" ? r = r.check(A.iso.date()) : o === "time" ? r = r.check(A.iso.time()) : o === "duration" ? r = r.check(A.iso.duration()) : o === "ipv4" ? r = r.check(A.ipv4()) : o === "ipv6" ? r = r.check(A.ipv6()) : o === "mac" ? r = r.check(A.mac()) : o === "cidr" ? r = r.check(A.cidrv4()) : o === "cidr-v6" ? r = r.check(A.cidrv6()) : o === "base64" ? r = r.check(A.base64()) : o === "base64url" ? r = r.check(A.base64url()) : o === "e164" ? r = r.check(A.e164()) : o === "jwt" ? r = r.check(A.jwt()) : o === "emoji" ? r = r.check(A.emoji()) : o === "nanoid" ? r = r.check(A.nanoid()) : o === "cuid" ? r = r.check(A.cuid()) : o === "cuid2" ? r = r.check(A.cuid2()) : o === "ulid" ? r = r.check(A.ulid()) : o === "xid" ? r = r.check(A.xid()) : o === "ksuid" && (r = r.check(A.ksuid()));
      }
      typeof e.minLength == "number" && (r = r.min(e.minLength)), typeof e.maxLength == "number" && (r = r.max(e.maxLength)), e.pattern && (r = r.regex(new RegExp(e.pattern))), i = r;
      break;
    }
    case "number":
    case "integer": {
      let r = n === "integer" ? A.number().int() : A.number();
      typeof e.minimum == "number" && (r = r.min(e.minimum)), typeof e.maximum == "number" && (r = r.max(e.maximum)), typeof e.exclusiveMinimum == "number" ? r = r.gt(e.exclusiveMinimum) : e.exclusiveMinimum === !0 && typeof e.minimum == "number" && (r = r.gt(e.minimum)), typeof e.exclusiveMaximum == "number" ? r = r.lt(e.exclusiveMaximum) : e.exclusiveMaximum === !0 && typeof e.maximum == "number" && (r = r.lt(e.maximum)), typeof e.multipleOf == "number" && (r = r.multipleOf(e.multipleOf)), i = r;
      break;
    }
    case "boolean": {
      i = A.boolean();
      break;
    }
    case "null": {
      i = A.null();
      break;
    }
    case "object": {
      const r = {}, o = e.properties || {}, a = new Set(e.required || []);
      for (const [d, p] of Object.entries(o)) {
        const f = ge(p, t);
        r[d] = a.has(d) ? f : f.optional();
      }
      if (e.propertyNames) {
        const d = ge(e.propertyNames, t), p = e.additionalProperties && typeof e.additionalProperties == "object" ? ge(e.additionalProperties, t) : A.any();
        if (Object.keys(r).length === 0) {
          i = A.record(d, p);
          break;
        }
        const f = A.object(r).passthrough(), h = A.looseRecord(d, p);
        i = A.intersection(f, h);
        break;
      }
      if (e.patternProperties) {
        const d = e.patternProperties, p = Object.keys(d), f = [];
        for (const c of p) {
          const u = ge(d[c], t), l = A.string().regex(new RegExp(c));
          f.push(A.looseRecord(l, u));
        }
        const h = [];
        if (Object.keys(r).length > 0 && h.push(A.object(r).passthrough()), h.push(...f), h.length === 0)
          i = A.object({}).passthrough();
        else if (h.length === 1)
          i = h[0];
        else {
          let c = A.intersection(h[0], h[1]);
          for (let u = 2; u < h.length; u++)
            c = A.intersection(c, h[u]);
          i = c;
        }
        break;
      }
      const s = A.object(r);
      e.additionalProperties === !1 ? i = s.strict() : typeof e.additionalProperties == "object" ? i = s.catchall(ge(e.additionalProperties, t)) : i = s.passthrough();
      break;
    }
    case "array": {
      const r = e.prefixItems, o = e.items;
      if (r && Array.isArray(r)) {
        const a = r.map((d) => ge(d, t)), s = o && typeof o == "object" && !Array.isArray(o) ? ge(o, t) : void 0;
        s ? i = A.tuple(a).rest(s) : i = A.tuple(a), typeof e.minItems == "number" && (i = i.check(A.minLength(e.minItems))), typeof e.maxItems == "number" && (i = i.check(A.maxLength(e.maxItems)));
      } else if (Array.isArray(o)) {
        const a = o.map((d) => ge(d, t)), s = e.additionalItems && typeof e.additionalItems == "object" ? ge(e.additionalItems, t) : void 0;
        s ? i = A.tuple(a).rest(s) : i = A.tuple(a), typeof e.minItems == "number" && (i = i.check(A.minLength(e.minItems))), typeof e.maxItems == "number" && (i = i.check(A.maxLength(e.maxItems)));
      } else if (o !== void 0) {
        const a = ge(o, t);
        let s = A.array(a);
        typeof e.minItems == "number" && (s = s.min(e.minItems)), typeof e.maxItems == "number" && (s = s.max(e.maxItems)), i = s;
      } else
        i = A.array(A.any());
      break;
    }
    default:
      throw new Error(`Unsupported type: ${n}`);
  }
  return i;
}
function ge(e, t) {
  if (typeof e == "boolean")
    return e ? A.any() : A.never();
  let n = F1(e, t);
  const i = e.type || e.enum !== void 0 || e.const !== void 0;
  if (e.anyOf && Array.isArray(e.anyOf)) {
    const s = e.anyOf.map((p) => ge(p, t)), d = A.union(s);
    n = i ? A.intersection(n, d) : d;
  }
  if (e.oneOf && Array.isArray(e.oneOf)) {
    const s = e.oneOf.map((p) => ge(p, t)), d = A.xor(s);
    n = i ? A.intersection(n, d) : d;
  }
  if (e.allOf && Array.isArray(e.allOf))
    if (e.allOf.length === 0)
      n = i ? n : A.any();
    else {
      let s = i ? n : ge(e.allOf[0], t);
      const d = i ? 0 : 1;
      for (let p = d; p < e.allOf.length; p++)
        s = A.intersection(s, ge(e.allOf[p], t));
      n = s;
    }
  e.nullable === !0 && t.version === "openapi-3.0" && (n = A.nullable(n)), e.readOnly === !0 && (n = A.readonly(n)), e.default !== void 0 && (n = n.default(e.default));
  const r = {}, o = ["$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor"];
  for (const s of o)
    s in e && (r[s] = e[s]);
  const a = ["contentEncoding", "contentMediaType", "contentSchema"];
  for (const s of a)
    s in e && (r[s] = e[s]);
  for (const s of Object.keys(e))
    g6.has(s) || (r[s] = e[s]);
  return Object.keys(r).length > 0 && t.registry.add(n, r), e.description && (n = n.describe(e.description)), n;
}
function _6(e, t) {
  if (typeof e == "boolean")
    return e ? A.any() : A.never();
  let n;
  try {
    n = JSON.parse(JSON.stringify(e));
  } catch {
    throw new Error("fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas");
  }
  const i = v6(n, t?.defaultTarget), r = n.$defs || n.definitions || {}, o = {
    version: i,
    defs: r,
    refs: /* @__PURE__ */ new Map(),
    processing: /* @__PURE__ */ new Set(),
    rootSchema: n,
    registry: t?.registry ?? ze
  };
  return ge(n, o);
}
function y6(e) {
  return /* @__PURE__ */ Fp(Gr, e);
}
function b6(e) {
  return /* @__PURE__ */ Kp(Jr, e);
}
function S6(e) {
  return /* @__PURE__ */ nh(Vr, e);
}
function k6(e) {
  return /* @__PURE__ */ oh(qr, e);
}
function w6(e) {
  return /* @__PURE__ */ gh(Vi, e);
}
const I6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bigint: k6,
  boolean: S6,
  date: w6,
  number: b6,
  string: y6
}, Symbol.toStringTag, { value: "Module" }));
pe(Dp());
const Ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $brand: qc,
  $input: jp,
  $output: Lp,
  NEVER: Vt,
  TimePrecision: Gp,
  ZodAny: ts,
  ZodArray: os,
  ZodBase64: Zi,
  ZodBase64URL: Fi,
  ZodBigInt: qr,
  ZodBigIntFormat: Hi,
  ZodBoolean: Vr,
  ZodCIDRv4: ji,
  ZodCIDRv6: Mi,
  ZodCUID: zi,
  ZodCUID2: Ai,
  ZodCatch: Es,
  ZodCodec: Xr,
  ZodCustom: Qr,
  ZodCustomStringFormat: cr,
  ZodDate: Vi,
  ZodDefault: Ss,
  ZodDiscriminatedUnion: us,
  ZodE164: Bi,
  ZodEmail: Pi,
  ZodEmoji: Ni,
  ZodEnum: or,
  ZodError: d6,
  ZodExactOptional: _s,
  ZodFile: vs,
  get ZodFirstPartyTypeKind() {
    return Eo;
  },
  ZodFunction: Ls,
  ZodGUID: wr,
  ZodIPv4: Ri,
  ZodIPv6: Li,
  ZodISODate: Ja,
  ZodISODateTime: Ha,
  ZodISODuration: qa,
  ZodISOTime: Va,
  ZodIntersection: ls,
  ZodIssueCode: p6,
  ZodJWT: Gi,
  ZodKSUID: Ui,
  ZodLazy: Cs,
  ZodLiteral: gs,
  ZodMAC: Wa,
  ZodMap: hs,
  ZodNaN: Ns,
  ZodNanoID: Ti,
  ZodNever: ns,
  ZodNonOptional: Xi,
  ZodNull: Qa,
  ZodNullable: bs,
  ZodNumber: Jr,
  ZodNumberFormat: Ut,
  ZodObject: Wr,
  ZodOptional: Yi,
  ZodPipe: Yr,
  ZodPrefault: ws,
  ZodPreprocess: Ts,
  ZodPromise: Rs,
  ZodReadonly: zs,
  ZodRealError: Ee,
  ZodRecord: ir,
  ZodSet: ms,
  ZodString: Gr,
  ZodStringFormat: te,
  ZodSuccess: Os,
  ZodSymbol: Ya,
  ZodTemplateLiteral: Ds,
  ZodTransform: $s,
  ZodTuple: ds,
  ZodType: H,
  ZodULID: Di,
  ZodURL: Hr,
  ZodUUID: Be,
  ZodUndefined: Xa,
  ZodUnion: Kr,
  ZodUnknown: rs,
  ZodVoid: is,
  ZodXID: Ci,
  ZodXor: ss,
  _ZodString: Ei,
  _default: ks,
  _function: Qn,
  any: p1,
  array: Rt,
  base64: Km,
  base64url: Ym,
  bigint: u1,
  boolean: Ir,
  catch: Ps,
  check: C1,
  cidrv4: qm,
  cidrv6: Wm,
  clone: Ce,
  codec: T1,
  coerce: I6,
  config: pe,
  core: l6,
  cuid: Mm,
  cuid2: Zm,
  custom: U1,
  date: m1,
  decode: km,
  decodeAsync: Im,
  describe: R1,
  discriminatedUnion: y1,
  e164: Xm,
  email: Nm,
  emoji: Lm,
  encode: Sm,
  encodeAsync: wm,
  endsWith: bi,
  enum: Wi,
  exactOptional: ys,
  file: O1,
  flattenError: Vo,
  float32: i1,
  float64: o1,
  formatError: qo,
  fromJSONSchema: _6,
  function: Qn,
  getErrorMap: m6,
  globalRegistry: ze,
  gt: ct,
  gte: be,
  guid: Tm,
  hash: n1,
  hex: r1,
  hostname: t1,
  httpUrl: Rm,
  includes: _i,
  instanceof: j1,
  int: Yn,
  int32: a1,
  int64: l1,
  intersection: cs,
  invertCodec: z1,
  ipv4: Hm,
  ipv6: Vm,
  iso: gm,
  json: Z1,
  jwt: Qm,
  keyof: g1,
  ksuid: Gm,
  lazy: Us,
  length: Zr,
  literal: x1,
  locales: Rp,
  looseObject: $1,
  looseRecord: S1,
  lowercase: vi,
  lt,
  lte: Ae,
  mac: Jm,
  map: k1,
  maxLength: Mr,
  maxSize: lr,
  meta: L1,
  mime: Si,
  minLength: Et,
  minSize: dt,
  multipleOf: er,
  nan: N1,
  nanoid: jm,
  nativeEnum: I1,
  negative: ja,
  never: Ji,
  nonnegative: Za,
  nonoptional: xs,
  nonpositive: Ma,
  normalize: ki,
  null: es,
  nullable: Or,
  nullish: E1,
  number: Ka,
  object: as,
  optional: xr,
  overwrite: nt,
  parse: $m,
  parseAsync: _m,
  partialRecord: b1,
  pipe: Xn,
  positive: La,
  prefault: Is,
  preprocess: Zs,
  prettifyError: gd,
  promise: D1,
  property: Fa,
  readonly: As,
  record: ps,
  refine: js,
  regex: gi,
  regexes: aa,
  registry: va,
  safeDecode: Om,
  safeDecodeAsync: Pm,
  safeEncode: xm,
  safeEncodeAsync: Em,
  safeParse: ym,
  safeParseAsync: bm,
  set: w1,
  setErrorMap: h6,
  size: jr,
  slugify: Oi,
  startsWith: yi,
  strictObject: v1,
  string: Je,
  stringFormat: e1,
  stringbool: M1,
  success: P1,
  superRefine: Ms,
  symbol: d1,
  templateLiteral: A1,
  toJSONSchema: dm,
  toLowerCase: Ii,
  toUpperCase: xi,
  transform: Ki,
  treeifyError: hd,
  trim: wi,
  tuple: fs,
  uint32: s1,
  uint64: c1,
  ulid: Fm,
  undefined: f1,
  union: qi,
  unknown: Pt,
  uppercase: $i,
  url: Um,
  util: fd,
  uuid: zm,
  uuidv4: Am,
  uuidv6: Dm,
  uuidv7: Cm,
  void: h1,
  xid: Bm,
  xor: _1
}, Symbol.toStringTag, { value: "Module" })), x6 = (e) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e);
var ho, jl;
function O6() {
  if (jl) return ho;
  jl = 1;
  var e = "[object Symbol]", t = /[\\^$.*+?()[\]{}|]/g, n = RegExp(t.source), i = typeof st == "object" && st && st.Object === Object && st, r = typeof self == "object" && self && self.Object === Object && self, o = i || r || Function("return this")(), a = Object.prototype, s = a.toString, d = o.Symbol, p = d ? d.prototype : void 0, f = p ? p.toString : void 0;
  function h(g) {
    if (typeof g == "string")
      return g;
    if (u(g))
      return f ? f.call(g) : "";
    var v = g + "";
    return v == "0" && 1 / g == -1 / 0 ? "-0" : v;
  }
  function c(g) {
    return !!g && typeof g == "object";
  }
  function u(g) {
    return typeof g == "symbol" || c(g) && s.call(g) == e;
  }
  function l(g) {
    return g == null ? "" : h(g);
  }
  function m(g) {
    return g = l(g), g && n.test(g) ? g.replace(t, "\\$&") : g;
  }
  return ho = m, ho;
}
O6();
var mo, Ml;
function E6() {
  if (Ml) return mo;
  Ml = 1;
  var e = "[object Symbol]", t = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, n = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, i = "\\ud800-\\udfff", r = "\\u0300-\\u036f\\ufe20-\\ufe23", o = "\\u20d0-\\u20f0", a = "\\u2700-\\u27bf", s = "a-z\\xdf-\\xf6\\xf8-\\xff", d = "\\xac\\xb1\\xd7\\xf7", p = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", f = "\\u2000-\\u206f", h = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", c = "A-Z\\xc0-\\xd6\\xd8-\\xde", u = "\\ufe0e\\ufe0f", l = d + p + f + h, m = "['’]", g = "[" + i + "]", v = "[" + l + "]", _ = "[" + r + o + "]", x = "\\d+", y = "[" + a + "]", $ = "[" + s + "]", O = "[^" + i + l + x + a + s + c + "]", I = "\\ud83c[\\udffb-\\udfff]", D = "(?:" + _ + "|" + I + ")", L = "[^" + i + "]", M = "(?:\\ud83c[\\udde6-\\uddff]){2}", b = "[\\ud800-\\udbff][\\udc00-\\udfff]", k = "[" + c + "]", E = "\\u200d", z = "(?:" + $ + "|" + O + ")", R = "(?:" + k + "|" + O + ")", U = "(?:" + m + "(?:d|ll|m|re|s|t|ve))?", F = "(?:" + m + "(?:D|LL|M|RE|S|T|VE))?", X = D + "?", K = "[" + u + "]?", B = "(?:" + E + "(?:" + [L, M, b].join("|") + ")" + K + X + ")*", se = K + X + B, it = "(?:" + [y, M, b].join("|") + ")" + se, Pe = "(?:" + [L + _ + "?", _, M, b, g].join("|") + ")", qe = RegExp(m, "g"), ot = RegExp(_, "g"), we = RegExp(I + "(?=" + I + ")|" + Pe + se, "g"), mt = RegExp([
    k + "?" + $ + "+" + U + "(?=" + [v, k, "$"].join("|") + ")",
    R + "+" + F + "(?=" + [v, k + z, "$"].join("|") + ")",
    k + "?" + z + "+" + U,
    k + "+" + F,
    x,
    it
  ].join("|"), "g"), at = RegExp("[" + E + i + r + o + u + "]"), gt = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, jt = {
    // Latin-1 Supplement block.
    À: "A",
    Á: "A",
    Â: "A",
    Ã: "A",
    Ä: "A",
    Å: "A",
    à: "a",
    á: "a",
    â: "a",
    ã: "a",
    ä: "a",
    å: "a",
    Ç: "C",
    ç: "c",
    Ð: "D",
    ð: "d",
    È: "E",
    É: "E",
    Ê: "E",
    Ë: "E",
    è: "e",
    é: "e",
    ê: "e",
    ë: "e",
    Ì: "I",
    Í: "I",
    Î: "I",
    Ï: "I",
    ì: "i",
    í: "i",
    î: "i",
    ï: "i",
    Ñ: "N",
    ñ: "n",
    Ò: "O",
    Ó: "O",
    Ô: "O",
    Õ: "O",
    Ö: "O",
    Ø: "O",
    ò: "o",
    ó: "o",
    ô: "o",
    õ: "o",
    ö: "o",
    ø: "o",
    Ù: "U",
    Ú: "U",
    Û: "U",
    Ü: "U",
    ù: "u",
    ú: "u",
    û: "u",
    ü: "u",
    Ý: "Y",
    ý: "y",
    ÿ: "y",
    Æ: "Ae",
    æ: "ae",
    Þ: "Th",
    þ: "th",
    ß: "ss",
    // Latin Extended-A block.
    Ā: "A",
    Ă: "A",
    Ą: "A",
    ā: "a",
    ă: "a",
    ą: "a",
    Ć: "C",
    Ĉ: "C",
    Ċ: "C",
    Č: "C",
    ć: "c",
    ĉ: "c",
    ċ: "c",
    č: "c",
    Ď: "D",
    Đ: "D",
    ď: "d",
    đ: "d",
    Ē: "E",
    Ĕ: "E",
    Ė: "E",
    Ę: "E",
    Ě: "E",
    ē: "e",
    ĕ: "e",
    ė: "e",
    ę: "e",
    ě: "e",
    Ĝ: "G",
    Ğ: "G",
    Ġ: "G",
    Ģ: "G",
    ĝ: "g",
    ğ: "g",
    ġ: "g",
    ģ: "g",
    Ĥ: "H",
    Ħ: "H",
    ĥ: "h",
    ħ: "h",
    Ĩ: "I",
    Ī: "I",
    Ĭ: "I",
    Į: "I",
    İ: "I",
    ĩ: "i",
    ī: "i",
    ĭ: "i",
    į: "i",
    ı: "i",
    Ĵ: "J",
    ĵ: "j",
    Ķ: "K",
    ķ: "k",
    ĸ: "k",
    Ĺ: "L",
    Ļ: "L",
    Ľ: "L",
    Ŀ: "L",
    Ł: "L",
    ĺ: "l",
    ļ: "l",
    ľ: "l",
    ŀ: "l",
    ł: "l",
    Ń: "N",
    Ņ: "N",
    Ň: "N",
    Ŋ: "N",
    ń: "n",
    ņ: "n",
    ň: "n",
    ŋ: "n",
    Ō: "O",
    Ŏ: "O",
    Ő: "O",
    ō: "o",
    ŏ: "o",
    ő: "o",
    Ŕ: "R",
    Ŗ: "R",
    Ř: "R",
    ŕ: "r",
    ŗ: "r",
    ř: "r",
    Ś: "S",
    Ŝ: "S",
    Ş: "S",
    Š: "S",
    ś: "s",
    ŝ: "s",
    ş: "s",
    š: "s",
    Ţ: "T",
    Ť: "T",
    Ŧ: "T",
    ţ: "t",
    ť: "t",
    ŧ: "t",
    Ũ: "U",
    Ū: "U",
    Ŭ: "U",
    Ů: "U",
    Ű: "U",
    Ų: "U",
    ũ: "u",
    ū: "u",
    ŭ: "u",
    ů: "u",
    ű: "u",
    ų: "u",
    Ŵ: "W",
    ŵ: "w",
    Ŷ: "Y",
    ŷ: "y",
    Ÿ: "Y",
    Ź: "Z",
    Ż: "Z",
    Ž: "Z",
    ź: "z",
    ż: "z",
    ž: "z",
    Ĳ: "IJ",
    ĳ: "ij",
    Œ: "Oe",
    œ: "oe",
    ŉ: "'n",
    ſ: "ss"
  }, to = typeof st == "object" && st && st.Object === Object && st, W1 = typeof self == "object" && self && self.Object === Object && self, K1 = to || W1 || Function("return this")();
  function Y1(C, q, ne, We) {
    for (var _e = -1, tn = C ? C.length : 0; ++_e < tn; )
      ne = q(ne, C[_e], _e, C);
    return ne;
  }
  function X1(C) {
    return C.split("");
  }
  function Q1(C) {
    return C.match(t) || [];
  }
  function e2(C) {
    return function(q) {
      return C?.[q];
    };
  }
  var t2 = e2(jt);
  function Fs(C) {
    return at.test(C);
  }
  function r2(C) {
    return gt.test(C);
  }
  function n2(C) {
    return Fs(C) ? i2(C) : X1(C);
  }
  function i2(C) {
    return C.match(we) || [];
  }
  function o2(C) {
    return C.match(mt) || [];
  }
  var a2 = Object.prototype, s2 = a2.toString, Bs = K1.Symbol, Gs = Bs ? Bs.prototype : void 0, Hs = Gs ? Gs.toString : void 0;
  function u2(C, q, ne) {
    var We = -1, _e = C.length;
    q < 0 && (q = -q > _e ? 0 : _e + q), ne = ne > _e ? _e : ne, ne < 0 && (ne += _e), _e = q > ne ? 0 : ne - q >>> 0, q >>>= 0;
    for (var tn = Array(_e); ++We < _e; )
      tn[We] = C[We + q];
    return tn;
  }
  function l2(C) {
    if (typeof C == "string")
      return C;
    if (h2(C))
      return Hs ? Hs.call(C) : "";
    var q = C + "";
    return q == "0" && 1 / C == -1 / 0 ? "-0" : q;
  }
  function c2(C, q, ne) {
    var We = C.length;
    return ne = ne === void 0 ? We : ne, !q && ne >= We ? C : u2(C, q, ne);
  }
  function d2(C) {
    return function(q) {
      q = en(q);
      var ne = Fs(q) ? n2(q) : void 0, We = ne ? ne[0] : q.charAt(0), _e = ne ? c2(ne, 1).join("") : q.slice(1);
      return We[C]() + _e;
    };
  }
  function f2(C) {
    return function(q) {
      return Y1(_2(v2(q).replace(qe, "")), C, "");
    };
  }
  function p2(C) {
    return !!C && typeof C == "object";
  }
  function h2(C) {
    return typeof C == "symbol" || p2(C) && s2.call(C) == e;
  }
  function en(C) {
    return C == null ? "" : l2(C);
  }
  var m2 = f2(function(C, q, ne) {
    return q = q.toLowerCase(), C + (ne ? g2(q) : q);
  });
  function g2(C) {
    return $2(en(C).toLowerCase());
  }
  function v2(C) {
    return C = en(C), C && C.replace(n, t2).replace(ot, "");
  }
  var $2 = d2("toUpperCase");
  function _2(C, q, ne) {
    return C = en(C), q = q, q === void 0 ? r2(C) ? o2(C) : Q1(C) : C.match(q) || [];
  }
  return mo = m2, mo;
}
E6();
const P6 = {
  en: Ao,
  "pseudo-en": "pseudo-en",
  "af-ZA": "af-ZA",
  "ar-SA": "ar-SA",
  "ca-ES": "ca-ES",
  "cs-CZ": "cs-CZ",
  "da-DK": "da-DK",
  "de-DE": "de-DE",
  "el-GR": "el-GR",
  "es-ES": "es-ES",
  "fi-FI": "fi-FI",
  "fr-FR": "fr-FR",
  "he-IL": "he-IL",
  "hu-HU": "hu-HU",
  "it-IT": "it-IT",
  "ja-JP": "ja-JP",
  "ko-KR": "ko-KR",
  "nl-NL": "nl-NL",
  "no-NO": "no-NO",
  "pl-PL": "pl-PL",
  "pt-BR": "pt-BR",
  "pt-PT": "pt-PT",
  "ro-RO": "ro-RO",
  "ru-RU": "ru-RU",
  "sr-Cyrl": "sr-Cyrl",
  "sv-SE": "sv-SE",
  "tr-TR": "tr-TR",
  "uk-UA": "uk-UA",
  "vi-VN": "vi-VN",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW"
}, N6 = { version: 4, country_calling_codes: { 1: ["US", "AG", "AI", "AS", "BB", "BM", "BS", "CA", "DM", "DO", "GD", "GU", "JM", "KN", "KY", "LC", "MP", "MS", "PR", "SX", "TC", "TT", "VC", "VG", "VI"], 7: ["RU", "KZ"], 20: ["EG"], 27: ["ZA"], 30: ["GR"], 31: ["NL"], 32: ["BE"], 33: ["FR"], 34: ["ES"], 36: ["HU"], 39: ["IT", "VA"], 40: ["RO"], 41: ["CH"], 43: ["AT"], 44: ["GB", "GG", "IM", "JE"], 45: ["DK"], 46: ["SE"], 47: ["NO", "SJ"], 48: ["PL"], 49: ["DE"], 51: ["PE"], 52: ["MX"], 53: ["CU"], 54: ["AR"], 55: ["BR"], 56: ["CL"], 57: ["CO"], 58: ["VE"], 60: ["MY"], 61: ["AU", "CC", "CX"], 62: ["ID"], 63: ["PH"], 64: ["NZ"], 65: ["SG"], 66: ["TH"], 81: ["JP"], 82: ["KR"], 84: ["VN"], 86: ["CN"], 90: ["TR"], 91: ["IN"], 92: ["PK"], 93: ["AF"], 94: ["LK"], 95: ["MM"], 98: ["IR"], 211: ["SS"], 212: ["MA", "EH"], 213: ["DZ"], 216: ["TN"], 218: ["LY"], 220: ["GM"], 221: ["SN"], 222: ["MR"], 223: ["ML"], 224: ["GN"], 225: ["CI"], 226: ["BF"], 227: ["NE"], 228: ["TG"], 229: ["BJ"], 230: ["MU"], 231: ["LR"], 232: ["SL"], 233: ["GH"], 234: ["NG"], 235: ["TD"], 236: ["CF"], 237: ["CM"], 238: ["CV"], 239: ["ST"], 240: ["GQ"], 241: ["GA"], 242: ["CG"], 243: ["CD"], 244: ["AO"], 245: ["GW"], 246: ["IO"], 247: ["AC"], 248: ["SC"], 249: ["SD"], 250: ["RW"], 251: ["ET"], 252: ["SO"], 253: ["DJ"], 254: ["KE"], 255: ["TZ"], 256: ["UG"], 257: ["BI"], 258: ["MZ"], 260: ["ZM"], 261: ["MG"], 262: ["RE", "YT"], 263: ["ZW"], 264: ["NA"], 265: ["MW"], 266: ["LS"], 267: ["BW"], 268: ["SZ"], 269: ["KM"], 290: ["SH", "TA"], 291: ["ER"], 297: ["AW"], 298: ["FO"], 299: ["GL"], 350: ["GI"], 351: ["PT"], 352: ["LU"], 353: ["IE"], 354: ["IS"], 355: ["AL"], 356: ["MT"], 357: ["CY"], 358: ["FI", "AX"], 359: ["BG"], 370: ["LT"], 371: ["LV"], 372: ["EE"], 373: ["MD"], 374: ["AM"], 375: ["BY"], 376: ["AD"], 377: ["MC"], 378: ["SM"], 380: ["UA"], 381: ["RS"], 382: ["ME"], 383: ["XK"], 385: ["HR"], 386: ["SI"], 387: ["BA"], 389: ["MK"], 420: ["CZ"], 421: ["SK"], 423: ["LI"], 500: ["FK"], 501: ["BZ"], 502: ["GT"], 503: ["SV"], 504: ["HN"], 505: ["NI"], 506: ["CR"], 507: ["PA"], 508: ["PM"], 509: ["HT"], 590: ["GP", "BL", "MF"], 591: ["BO"], 592: ["GY"], 593: ["EC"], 594: ["GF"], 595: ["PY"], 596: ["MQ"], 597: ["SR"], 598: ["UY"], 599: ["CW", "BQ"], 670: ["TL"], 672: ["NF"], 673: ["BN"], 674: ["NR"], 675: ["PG"], 676: ["TO"], 677: ["SB"], 678: ["VU"], 679: ["FJ"], 680: ["PW"], 681: ["WF"], 682: ["CK"], 683: ["NU"], 685: ["WS"], 686: ["KI"], 687: ["NC"], 688: ["TV"], 689: ["PF"], 690: ["TK"], 691: ["FM"], 692: ["MH"], 850: ["KP"], 852: ["HK"], 853: ["MO"], 855: ["KH"], 856: ["LA"], 880: ["BD"], 886: ["TW"], 960: ["MV"], 961: ["LB"], 962: ["JO"], 963: ["SY"], 964: ["IQ"], 965: ["KW"], 966: ["SA"], 967: ["YE"], 968: ["OM"], 970: ["PS"], 971: ["AE"], 972: ["IL"], 973: ["BH"], 974: ["QA"], 975: ["BT"], 976: ["MN"], 977: ["NP"], 992: ["TJ"], 993: ["TM"], 994: ["AZ"], 995: ["GE"], 996: ["KG"], 998: ["UZ"] }, countries: { AC: ["247", "00", "(?:[01589]\\d|[46])\\d{4}", [5, 6]], AD: ["376", "00", "(?:1|6\\d)\\d{7}|[135-9]\\d{5}", [6, 8, 9], [["(\\d{3})(\\d{3})", "$1 $2", ["[135-9]"]], ["(\\d{4})(\\d{4})", "$1 $2", ["1"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]]]], AE: ["971", "00", "(?:[4-7]\\d|9[0-689])\\d{7}|800\\d{2,9}|[2-4679]\\d{7}", [5, 6, 7, 8, 9, 10, 11, 12], [["(\\d{3})(\\d{2,9})", "$1 $2", ["60|8"]], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[236]|[479][2-8]"], "0$1"], ["(\\d{3})(\\d)(\\d{5})", "$1 $2 $3", ["[479]"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["5"], "0$1"]], "0"], AF: ["93", "00", "[2-7]\\d{8}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-7]"], "0$1"]], "0"], AG: ["1", "011", "(?:268|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([457]\\d{6})$|1", "268$1", 0, "268"], AI: ["1", "011", "(?:264|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2457]\\d{6})$|1", "264$1", 0, "264"], AL: ["355", "00", "(?:700\\d\\d|900)\\d{3}|8\\d{5,7}|(?:[2-5]|6\\d)\\d{7}", [6, 7, 8, 9], [["(\\d{3})(\\d{3,4})", "$1 $2", ["80|9"], "0$1"], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["4[2-6]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2358][2-5]|4"], "0$1"], ["(\\d{3})(\\d{5})", "$1 $2", ["[23578]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["6"], "0$1"]], "0"], AM: ["374", "00", "(?:[1-489]\\d|55|60|77)\\d{6}", [8], [["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[89]0"], "0 $1"], ["(\\d{3})(\\d{5})", "$1 $2", ["2|3[12]"], "(0$1)"], ["(\\d{2})(\\d{6})", "$1 $2", ["1|47"], "(0$1)"], ["(\\d{2})(\\d{6})", "$1 $2", ["[3-9]"], "0$1"]], "0"], AO: ["244", "00", "[29]\\d{8}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[29]"]]]], AR: ["54", "00", "(?:11|[89]\\d\\d)\\d{8}|[2368]\\d{9}", [10, 11], [["(\\d{4})(\\d{2})(\\d{4})", "$1 $2-$3", ["2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9])", "2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8]))|2(?:2[24-9]|3[1-59]|47)", "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5[56][46]|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]", "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|58|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|54(?:4|5[13-7]|6[89])|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:454|85[56])[46]|3(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]"], "0$1", 1], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", ["1"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["[68]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2-$3", ["[23]"], "0$1", 1], ["(\\d)(\\d{4})(\\d{2})(\\d{4})", "$2 15-$3-$4", ["9(?:2[2-469]|3[3-578])", "9(?:2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9]))", "9(?:2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8])))|92(?:2[24-9]|3[1-59]|47)", "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5(?:[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]", "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|5(?:4(?:4|5[13-7]|6[89])|[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]"], "0$1", 0, "$1 $2 $3-$4"], ["(\\d)(\\d{2})(\\d{4})(\\d{4})", "$2 15-$3-$4", ["91"], "0$1", 0, "$1 $2 $3-$4"], ["(\\d{3})(\\d{3})(\\d{5})", "$1-$2-$3", ["8"], "0$1"], ["(\\d)(\\d{3})(\\d{3})(\\d{4})", "$2 15-$3-$4", ["9"], "0$1", 0, "$1 $2 $3-$4"]], "0", 0, "0?(?:(11|2(?:2(?:02?|[13]|2[13-79]|4[1-6]|5[2457]|6[124-8]|7[1-4]|8[13-6]|9[1267])|3(?:02?|1[467]|2[03-6]|3[13-8]|[49][2-6]|5[2-8]|[67])|4(?:7[3-578]|9)|6(?:[0136]|2[24-6]|4[6-8]?|5[15-8])|80|9(?:0[1-3]|[19]|2\\d|3[1-6]|4[02568]?|5[2-4]|6[2-46]|72?|8[23]?))|3(?:3(?:2[79]|6|8[2578])|4(?:0[0-24-9]|[12]|3[5-8]?|4[24-7]|5[4-68]?|6[02-9]|7[126]|8[2379]?|9[1-36-8])|5(?:1|2[1245]|3[237]?|4[1-46-9]|6[2-4]|7[1-6]|8[2-5]?)|6[24]|7(?:[069]|1[1568]|2[15]|3[145]|4[13]|5[14-8]|7[2-57]|8[126])|8(?:[01]|2[15-7]|3[2578]?|4[13-6]|5[4-8]?|6[1-357-9]|7[36-8]?|8[5-8]?|9[124])))15)?", "9$1"], AS: ["1", "011", "(?:[58]\\d\\d|684|900)\\d{7}", [10], 0, "1", 0, "([267]\\d{6})$|1", "684$1", 0, "684"], AT: ["43", "00", "1\\d{3,12}|2\\d{6,12}|43(?:(?:0\\d|5[02-9])\\d{3,9}|2\\d{4,5}|[3467]\\d{4}|8\\d{4,6}|9\\d{4,7})|5\\d{4,12}|8\\d{7,12}|9\\d{8,12}|(?:[367]\\d|4[0-24-9])\\d{4,11}", [4, 5, 6, 7, 8, 9, 10, 11, 12, 13], [["(\\d)(\\d{3,12})", "$1 $2", ["1(?:11|[2-9])"], "0$1"], ["(\\d{3})(\\d{2})", "$1 $2", ["517"], "0$1"], ["(\\d{2})(\\d{3,5})", "$1 $2", ["5[079]"], "0$1"], ["(\\d{3})(\\d{3,10})", "$1 $2", ["(?:31|4)6|51|6(?:5[0-3579]|[6-9])|7(?:20|32|8)|[89]"], "0$1"], ["(\\d{4})(\\d{3,9})", "$1 $2", ["[2-467]|5[2-6]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["5"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4,7})", "$1 $2 $3", ["5"], "0$1"]], "0"], AU: ["61", "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "1(?:[0-79]\\d{7}(?:\\d(?:\\d{2})?)?|8[0-24-9]\\d{7})|[2-478]\\d{8}|1\\d{4,7}", [5, 6, 7, 8, 9, 10, 12], [["(\\d{2})(\\d{3,4})", "$1 $2", ["16"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2,4})", "$1 $2 $3", ["16"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["14|4"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["[2378]"], "(0$1)"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:30|[89])"]]], "0", 0, "(183[12])|0", 0, 0, 0, [["(?:(?:(?:2(?:[0-26-9]\\d|3[0-8]|4[02-9]|5[0135-9])|7(?:[013-57-9]\\d|2[0-8]))\\d|3(?:(?:[0-3589]\\d|6[1-9]|7[0-35-9])\\d|4(?:[0-578]\\d|90)))\\d\\d|8(?:51(?:0(?:0[03-9]|[12479]\\d|3[2-9]|5[0-8]|6[1-9]|8[0-7])|1(?:[0235689]\\d|1[0-69]|4[0-589]|7[0-47-9])|2(?:0[0-79]|[18][13579]|2[14-9]|3[0-46-9]|[4-6]\\d|7[89]|9[0-4])|3\\d\\d)|(?:6[0-8]|[78]\\d)\\d{3}|9(?:[02-9]\\d{3}|1(?:(?:[0-58]\\d|6[0135-9])\\d|7(?:0[0-24-9]|[1-9]\\d)|9(?:[0-46-9]\\d|5[0-79])))))\\d{3}", [9]], ["4(?:79[01]|83[0-389]|94[0-4])\\d{5}|4(?:[0-36]\\d|4[047-9]|5[0-25-9]|7[02-8]|8[0-24-9]|9[0-37-9])\\d{6}", [9]], ["180(?:0\\d{3}|2)\\d{3}", [7, 10]], ["190[0-26]\\d{6}", [10]], 0, 0, 0, ["163\\d{2,6}", [5, 6, 7, 8, 9]], ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]], ["13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", [6, 8, 10, 12]]], "0011"], AW: ["297", "00", "(?:[25-79]\\d\\d|800)\\d{4}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[25-9]"]]]], AX: ["358", "00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))", "2\\d{4,9}|35\\d{4,5}|(?:60\\d\\d|800)\\d{4,6}|7\\d{5,11}|(?:[14]\\d|3[0-46-9]|50)\\d{4,8}", [5, 6, 7, 8, 9, 10, 11, 12], 0, "0", 0, 0, 0, 0, "18", 0, "00"], AZ: ["994", "00", "365\\d{6}|(?:[124579]\\d|60|88)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["90"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[28]|2|365|46", "1[28]|2|365[45]|46", "1[28]|2|365(?:4|5[02])|46"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[13-9]"], "0$1"]], "0"], BA: ["387", "00", "6\\d{8}|(?:[35689]\\d|49|70)\\d{6}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["6[1-3]|[7-9]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2-$3", ["[3-5]|6[56]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["6"], "0$1"]], "0"], BB: ["1", "011", "(?:246|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "246$1", 0, "246"], BD: ["880", "00", "[1-469]\\d{9}|8[0-79]\\d{7,8}|[2-79]\\d{8}|[2-9]\\d{7}|[3-9]\\d{6}|[57-9]\\d{5}", [6, 7, 8, 9, 10], [["(\\d{2})(\\d{4,6})", "$1-$2", ["31[5-8]|[459]1"], "0$1"], ["(\\d{3})(\\d{3,7})", "$1-$2", ["3(?:[67]|8[013-9])|4(?:6[168]|7|[89][18])|5(?:6[128]|9)|6(?:[15]|28|4[14])|7[2-589]|8(?:0[014-9]|[12])|9[358]|(?:3[2-5]|4[235]|5[2-578]|6[0389]|76|8[3-7]|9[24])1|(?:44|66)[01346-9]"], "0$1"], ["(\\d{4})(\\d{3,6})", "$1-$2", ["[13-9]|22"], "0$1"], ["(\\d)(\\d{7,8})", "$1-$2", ["2"], "0$1"]], "0"], BE: ["32", "00", "4\\d{8}|[1-9]\\d{7}", [8, 9], [["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:80|9)0"], "0$1"], ["(\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[239]|4[23]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[15-8]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4"], "0$1"]], "0"], BF: ["226", "00", "[025-7]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[025-7]"]]]], BG: ["359", "00", "00800\\d{7}|[2-7]\\d{6,7}|[89]\\d{6,8}|2\\d{5}", [6, 7, 8, 9, 12], [["(\\d)(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["2"], "0$1"], ["(\\d{3})(\\d{4})", "$1 $2", ["43[1-6]|70[1-9]"], "0$1"], ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["[356]|4[124-7]|7[1-9]|8[1-6]|9[1-7]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:70|8)0"], "0$1"], ["(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3", ["43[1-7]|7"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[48]|9[08]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1"]], "0"], BH: ["973", "00", "[136-9]\\d{7}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[13679]|8[02-4679]"]]]], BI: ["257", "00", "(?:[267]\\d|31)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2367]"]]]], BJ: ["229", "00", "[24-689]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[24-689]"]]]], BL: ["590", "00", "590\\d{6}|(?:69|80|9\\d)\\d{7}", [9], 0, "0", 0, 0, 0, 0, 0, [["590(?:2[7-9]|3[3-7]|5[12]|87)\\d{4}"], ["69(?:0\\d\\d|1(?:2[2-9]|3[0-5])|4(?:0[89]|1[2-6]|9\\d)|6(?:1[016-9]|5[0-4]|[67]\\d))\\d{4}"], ["80[0-5]\\d{6}"], 0, 0, 0, 0, 0, ["9(?:(?:39[5-7]|76[018])\\d|475[0-5])\\d{4}"]]], BM: ["1", "011", "(?:441|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "441$1", 0, "441"], BN: ["673", "00", "[2-578]\\d{6}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-578]"]]]], BO: ["591", "00(?:1\\d)?", "8001\\d{5}|(?:[2-467]\\d|50)\\d{6}", [8, 9], [["(\\d)(\\d{7})", "$1 $2", ["[235]|4[46]"]], ["(\\d{8})", "$1", ["[67]"]], ["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["8"]]], "0", 0, "0(1\\d)?"], BQ: ["599", "00", "(?:[34]1|7\\d)\\d{5}", [7], 0, 0, 0, 0, 0, 0, "[347]"], BR: ["55", "00(?:1[245]|2[1-35]|31|4[13]|[56]5|99)", "(?:[1-46-9]\\d\\d|5(?:[0-46-9]\\d|5[0-46-9]))\\d{8}|[1-9]\\d{9}|[3589]\\d{8}|[34]\\d{7}", [8, 9, 10, 11], [["(\\d{4})(\\d{4})", "$1-$2", ["300|4(?:0[02]|37)", "4(?:02|37)0|[34]00"]], ["(\\d{3})(\\d{2,3})(\\d{4})", "$1 $2 $3", ["(?:[358]|90)0"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", ["(?:[14689][1-9]|2[12478]|3[1-578]|5[13-5]|7[13-579])[2-57]"], "($1)"], ["(\\d{2})(\\d{5})(\\d{4})", "$1 $2-$3", ["[16][1-9]|[2-57-9]"], "($1)"]], "0", 0, "(?:0|90)(?:(1[245]|2[1-35]|31|4[13]|[56]5|99)(\\d{10,11}))?", "$2"], BS: ["1", "011", "(?:242|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([3-8]\\d{6})$|1", "242$1", 0, "242"], BT: ["975", "00", "[17]\\d{7}|[2-8]\\d{6}", [7, 8], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-68]|7[246]"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[67]|7"]]]], BW: ["267", "00", "(?:0800|(?:[37]|800)\\d)\\d{6}|(?:[2-6]\\d|90)\\d{5}", [7, 8, 10], [["(\\d{2})(\\d{5})", "$1 $2", ["90"]], ["(\\d{3})(\\d{4})", "$1 $2", ["[24-6]|3[15-9]"]], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[37]"]], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["0"]], ["(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3", ["8"]]]], BY: ["375", "810", "(?:[12]\\d|33|44|902)\\d{7}|8(?:0[0-79]\\d{5,7}|[1-7]\\d{9})|8(?:1[0-489]|[5-79]\\d)\\d{7}|8[1-79]\\d{6,7}|8[0-79]\\d{5}|8\\d{5}", [6, 7, 8, 9, 10, 11], [["(\\d{3})(\\d{3})", "$1 $2", ["800"], "8 $1"], ["(\\d{3})(\\d{2})(\\d{2,4})", "$1 $2 $3", ["800"], "8 $1"], ["(\\d{4})(\\d{2})(\\d{3})", "$1 $2-$3", ["1(?:5[169]|6[3-5]|7[179])|2(?:1[35]|2[34]|3[3-5])", "1(?:5[169]|6(?:3[1-3]|4|5[125])|7(?:1[3-9]|7[0-24-6]|9[2-7]))|2(?:1[35]|2[34]|3[3-5])"], "8 0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["1(?:[56]|7[467])|2[1-3]"], "8 0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[1-4]"], "8 0$1"], ["(\\d{3})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["[89]"], "8 $1"]], "8", 0, "0|80?", 0, 0, 0, 0, "8~10"], BZ: ["501", "00", "(?:0800\\d|[2-8])\\d{6}", [7, 11], [["(\\d{3})(\\d{4})", "$1-$2", ["[2-8]"]], ["(\\d)(\\d{3})(\\d{4})(\\d{3})", "$1-$2-$3-$4", ["0"]]]], CA: ["1", "011", "(?:[2-8]\\d|90)\\d{8}|3\\d{6}", [7, 10], 0, "1", 0, 0, 0, 0, 0, [["(?:2(?:04|[23]6|[48]9|50|63)|3(?:06|43|54|6[578]|82)|4(?:03|1[68]|[26]8|3[178]|50|74)|5(?:06|1[49]|48|79|8[147])|6(?:04|[18]3|39|47|72)|7(?:0[59]|42|53|78|8[02])|8(?:[06]7|19|25|7[39])|90[25])[2-9]\\d{6}", [10]], ["", [10]], ["8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", [10]], ["900[2-9]\\d{6}", [10]], ["52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|(?:5(?:00|2[125-9]|33|44|66|77|88)|622)[2-9]\\d{6}", [10]], 0, ["310\\d{4}", [7]], 0, ["600[2-9]\\d{6}", [10]]]], CC: ["61", "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "1(?:[0-79]\\d{8}(?:\\d{2})?|8[0-24-9]\\d{7})|[148]\\d{8}|1\\d{5,7}", [6, 7, 8, 9, 10, 12], 0, "0", 0, "([59]\\d{7})$|0", "8$1", 0, 0, [["8(?:51(?:0(?:02|31|60|89)|1(?:18|76)|223)|91(?:0(?:1[0-2]|29)|1(?:[28]2|50|79)|2(?:10|64)|3(?:[06]8|22)|4[29]8|62\\d|70[23]|959))\\d{3}", [9]], ["4(?:79[01]|83[0-389]|94[0-4])\\d{5}|4(?:[0-36]\\d|4[047-9]|5[0-25-9]|7[02-8]|8[0-24-9]|9[0-37-9])\\d{6}", [9]], ["180(?:0\\d{3}|2)\\d{3}", [7, 10]], ["190[0-26]\\d{6}", [10]], 0, 0, 0, 0, ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]], ["13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", [6, 8, 10, 12]]], "0011"], CD: ["243", "00", "[189]\\d{8}|[1-68]\\d{6}", [7, 9], [["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["88"], "0$1"], ["(\\d{2})(\\d{5})", "$1 $2", ["[1-6]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[89]"], "0$1"]], "0"], CF: ["236", "00", "(?:[27]\\d{3}|8776)\\d{4}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[278]"]]]], CG: ["242", "00", "222\\d{6}|(?:0\\d|80)\\d{7}", [9], [["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["8"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[02]"]]]], CH: ["41", "00", "8\\d{11}|[2-9]\\d{8}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8[047]|90"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-79]|81"], "0$1"], ["(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["8"], "0$1"]], "0"], CI: ["225", "00", "[02]\\d{9}", [10], [["(\\d{2})(\\d{2})(\\d)(\\d{5})", "$1 $2 $3 $4", ["2"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3 $4", ["0"]]]], CK: ["682", "00", "[2-578]\\d{4}", [5], [["(\\d{2})(\\d{3})", "$1 $2", ["[2-578]"]]]], CL: ["56", "(?:0|1(?:1[0-69]|2[02-5]|5[13-58]|69|7[0167]|8[018]))0", "12300\\d{6}|6\\d{9,10}|[2-9]\\d{8}", [9, 10, 11], [["(\\d{5})(\\d{4})", "$1 $2", ["219", "2196"], "($1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["44"]], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2[1-36]"], "($1)"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["9[2-9]"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["3[2-5]|[47]|5[1-3578]|6[13-57]|8(?:0[1-9]|[1-9])"], "($1)"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["60|8"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]], ["(\\d{3})(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["60"]]]], CM: ["237", "00", "[26]\\d{8}|88\\d{6,7}", [8, 9], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["88"]], ["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[26]|88"]]]], CN: ["86", "00|1(?:[12]\\d|79)\\d\\d00", "1[127]\\d{8,9}|2\\d{9}(?:\\d{2})?|[12]\\d{6,7}|86\\d{6}|(?:1[03-689]\\d|6)\\d{7,9}|(?:[3-579]\\d|8[0-57-9])\\d{6,9}", [7, 8, 9, 10, 11, 12], [["(\\d{2})(\\d{5,6})", "$1 $2", ["(?:10|2[0-57-9])[19]", "(?:10|2[0-57-9])(?:10|9[56])", "10(?:10|9[56])|2[0-57-9](?:100|9[56])"], "0$1"], ["(\\d{3})(\\d{5,6})", "$1 $2", ["3(?:[157]|35|49|9[1-68])|4(?:[17]|2[179]|6[47-9]|8[23])|5(?:[1357]|2[37]|4[36]|6[1-46]|80)|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])|(?:4[35]|59|85)[1-9]", "(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))[19]", "85[23](?:10|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:10|9[56])", "85[23](?:100|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:100|9[56])"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["(?:4|80)0"]], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["10|2(?:[02-57-9]|1[1-9])", "10|2(?:[02-57-9]|1[1-9])", "10[0-79]|2(?:[02-57-9]|1[1-79])|(?:10|21)8(?:0[1-9]|[1-9])"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["3(?:[3-59]|7[02-68])|4(?:[26-8]|3[3-9]|5[2-9])|5(?:3[03-9]|[468]|7[028]|9[2-46-9])|6|7(?:[0-247]|3[04-9]|5[0-4689]|6[2368])|8(?:[1-358]|9[1-7])|9(?:[013479]|5[1-5])|(?:[34]1|55|79|87)[02-9]"], "0$1", 1], ["(\\d{3})(\\d{7,8})", "$1 $2", ["9"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["80"], "0$1", 1], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["[3-578]"], "0$1", 1], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["1[3-9]"]], ["(\\d{2})(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["[12]"], "0$1", 1]], "0", 0, "(1(?:[12]\\d|79)\\d\\d)|0", 0, 0, 0, 0, "00"], CO: ["57", "00(?:4(?:[14]4|56)|[579])", "(?:60\\d\\d|9101)\\d{6}|(?:1\\d|3)\\d{9}", [10, 11], [["(\\d{3})(\\d{7})", "$1 $2", ["6"], "($1)"], ["(\\d{3})(\\d{7})", "$1 $2", ["3[0-357]|91"]], ["(\\d)(\\d{3})(\\d{7})", "$1-$2-$3", ["1"], "0$1", 0, "$1 $2 $3"]], "0", 0, "0([3579]|4(?:[14]4|56))?"], CR: ["506", "00", "(?:8\\d|90)\\d{8}|(?:[24-8]\\d{3}|3005)\\d{4}", [8, 10], [["(\\d{4})(\\d{4})", "$1 $2", ["[2-7]|8[3-9]"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["[89]"]]], 0, 0, "(19(?:0[0-2468]|1[09]|20|66|77|99))"], CU: ["53", "119", "(?:[2-7]|8\\d\\d)\\d{7}|[2-47]\\d{6}|[34]\\d{5}", [6, 7, 8, 10], [["(\\d{2})(\\d{4,6})", "$1 $2", ["2[1-4]|[34]"], "(0$1)"], ["(\\d)(\\d{6,7})", "$1 $2", ["7"], "(0$1)"], ["(\\d)(\\d{7})", "$1 $2", ["[56]"], "0$1"], ["(\\d{3})(\\d{7})", "$1 $2", ["8"], "0$1"]], "0"], CV: ["238", "0", "(?:[2-59]\\d\\d|800)\\d{4}", [7], [["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[2-589]"]]]], CW: ["599", "00", "(?:[34]1|60|(?:7|9\\d)\\d)\\d{5}", [7, 8], [["(\\d{3})(\\d{4})", "$1 $2", ["[3467]"]], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["9[4-8]"]]], 0, 0, 0, 0, 0, "[69]"], CX: ["61", "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "1(?:[0-79]\\d{8}(?:\\d{2})?|8[0-24-9]\\d{7})|[148]\\d{8}|1\\d{5,7}", [6, 7, 8, 9, 10, 12], 0, "0", 0, "([59]\\d{7})$|0", "8$1", 0, 0, [["8(?:51(?:0(?:01|30|59|88)|1(?:17|46|75)|2(?:22|35))|91(?:00[6-9]|1(?:[28]1|49|78)|2(?:09|63)|3(?:12|26|75)|4(?:56|97)|64\\d|7(?:0[01]|1[0-2])|958))\\d{3}", [9]], ["4(?:79[01]|83[0-389]|94[0-4])\\d{5}|4(?:[0-36]\\d|4[047-9]|5[0-25-9]|7[02-8]|8[0-24-9]|9[0-37-9])\\d{6}", [9]], ["180(?:0\\d{3}|2)\\d{3}", [7, 10]], ["190[0-26]\\d{6}", [10]], 0, 0, 0, 0, ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]], ["13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", [6, 8, 10, 12]]], "0011"], CY: ["357", "00", "(?:[279]\\d|[58]0)\\d{6}", [8], [["(\\d{2})(\\d{6})", "$1 $2", ["[257-9]"]]]], CZ: ["420", "00", "(?:[2-578]\\d|60)\\d{7}|9\\d{8,11}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-8]|9[015-7]"]], ["(\\d{2})(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3 $4", ["96"]], ["(\\d{2})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]], ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]]]], DE: ["49", "00", "[2579]\\d{5,14}|49(?:[34]0|69|8\\d)\\d\\d?|49(?:37|49|60|7[089]|9\\d)\\d{1,3}|49(?:2[024-9]|3[2-689]|7[1-7])\\d{1,8}|(?:1|[368]\\d|4[0-8])\\d{3,13}|49(?:[015]\\d|2[13]|31|[46][1-8])\\d{1,9}", [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [["(\\d{2})(\\d{3,13})", "$1 $2", ["3[02]|40|[68]9"], "0$1"], ["(\\d{3})(\\d{3,12})", "$1 $2", ["2(?:0[1-389]|1[124]|2[18]|3[14])|3(?:[35-9][15]|4[015])|906|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1", "2(?:0[1-389]|12[0-8])|3(?:[35-9][15]|4[015])|906|2(?:[13][14]|2[18])|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1"], "0$1"], ["(\\d{4})(\\d{2,11})", "$1 $2", ["[24-6]|3(?:[3569][02-46-9]|4[2-4679]|7[2-467]|8[2-46-8])|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]", "[24-6]|3(?:3(?:0[1-467]|2[127-9]|3[124578]|7[1257-9]|8[1256]|9[145])|4(?:2[135]|4[13578]|9[1346])|5(?:0[14]|2[1-3589]|6[1-4]|7[13468]|8[13568])|6(?:2[1-489]|3[124-6]|6[13]|7[12579]|8[1-356]|9[135])|7(?:2[1-7]|4[145]|6[1-5]|7[1-4])|8(?:21|3[1468]|6|7[1467]|8[136])|9(?:0[12479]|2[1358]|4[134679]|6[1-9]|7[136]|8[147]|9[1468]))|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]|3[68]4[1347]|3(?:47|60)[1356]|3(?:3[46]|46|5[49])[1246]|3[4579]3[1357]"], "0$1"], ["(\\d{3})(\\d{4})", "$1 $2", ["138"], "0$1"], ["(\\d{5})(\\d{2,10})", "$1 $2", ["3"], "0$1"], ["(\\d{3})(\\d{5,11})", "$1 $2", ["181"], "0$1"], ["(\\d{3})(\\d)(\\d{4,10})", "$1 $2 $3", ["1(?:3|80)|9"], "0$1"], ["(\\d{3})(\\d{7,8})", "$1 $2", ["1[67]"], "0$1"], ["(\\d{3})(\\d{7,12})", "$1 $2", ["8"], "0$1"], ["(\\d{5})(\\d{6})", "$1 $2", ["185", "1850", "18500"], "0$1"], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["7"], "0$1"], ["(\\d{4})(\\d{7})", "$1 $2", ["18[68]"], "0$1"], ["(\\d{4})(\\d{7})", "$1 $2", ["15[1279]"], "0$1"], ["(\\d{5})(\\d{6})", "$1 $2", ["15[03568]", "15(?:[0568]|31)"], "0$1"], ["(\\d{3})(\\d{8})", "$1 $2", ["18"], "0$1"], ["(\\d{3})(\\d{2})(\\d{7,8})", "$1 $2 $3", ["1(?:6[023]|7)"], "0$1"], ["(\\d{4})(\\d{2})(\\d{7})", "$1 $2 $3", ["15[279]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{8})", "$1 $2 $3", ["15"], "0$1"]], "0"], DJ: ["253", "00", "(?:2\\d|77)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[27]"]]]], DK: ["45", "00", "[2-9]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-9]"]]]], DM: ["1", "011", "(?:[58]\\d\\d|767|900)\\d{7}", [10], 0, "1", 0, "([2-7]\\d{6})$|1", "767$1", 0, "767"], DO: ["1", "011", "(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, 0, 0, 0, "8001|8[024]9"], DZ: ["213", "00", "(?:[1-4]|[5-79]\\d|80)\\d{7}", [8, 9], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[1-4]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["9"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-8]"], "0$1"]], "0"], EC: ["593", "00", "1\\d{9,10}|(?:[2-7]|9\\d)\\d{7}", [8, 9, 10, 11], [["(\\d)(\\d{3})(\\d{4})", "$1 $2-$3", ["[2-7]"], "(0$1)", 0, "$1-$2-$3"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["9"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1"]]], "0"], EE: ["372", "00", "8\\d{9}|[4578]\\d{7}|(?:[3-8]\\d|90)\\d{5}", [7, 8, 10], [["(\\d{3})(\\d{4})", "$1 $2", ["[369]|4[3-8]|5(?:[0-2]|5[0-478]|6[45])|7[1-9]|88", "[369]|4[3-8]|5(?:[02]|1(?:[0-8]|95)|5[0-478]|6(?:4[0-4]|5[1-589]))|7[1-9]|88"]], ["(\\d{4})(\\d{3,4})", "$1 $2", ["[45]|8(?:00|[1-49])", "[45]|8(?:00[1-9]|[1-49])"]], ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["7"]], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]]]], EG: ["20", "00", "[189]\\d{8,9}|[24-6]\\d{8}|[135]\\d{7}", [8, 9, 10], [["(\\d)(\\d{7,8})", "$1 $2", ["[23]"], "0$1"], ["(\\d{2})(\\d{6,7})", "$1 $2", ["1[35]|[4-6]|8[2468]|9[235-7]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"], ["(\\d{2})(\\d{8})", "$1 $2", ["1"], "0$1"]], "0"], EH: ["212", "00", "[5-8]\\d{8}", [9], 0, "0", 0, 0, 0, 0, "528[89]"], ER: ["291", "00", "[178]\\d{6}", [7], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[178]"], "0$1"]], "0"], ES: ["34", "00", "[5-9]\\d{8}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[89]00"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-9]"]]]], ET: ["251", "00", "(?:11|[2-579]\\d)\\d{7}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-579]"], "0$1"]], "0"], FI: ["358", "00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))", "[1-35689]\\d{4}|7\\d{10,11}|(?:[124-7]\\d|3[0-46-9])\\d{8}|[1-9]\\d{5,8}", [5, 6, 7, 8, 9, 10, 11, 12], [["(\\d{5})", "$1", ["20[2-59]"], "0$1"], ["(\\d{3})(\\d{3,7})", "$1 $2", ["(?:[1-3]0|[68])0|70[07-9]"], "0$1"], ["(\\d{2})(\\d{4,8})", "$1 $2", ["[14]|2[09]|50|7[135]"], "0$1"], ["(\\d{2})(\\d{6,10})", "$1 $2", ["7"], "0$1"], ["(\\d)(\\d{4,9})", "$1 $2", ["(?:1[49]|[2568])[1-8]|3(?:0[1-9]|[1-9])|9"], "0$1"]], "0", 0, 0, 0, 0, "1[03-79]|[2-9]", 0, "00"], FJ: ["679", "0(?:0|52)", "45\\d{5}|(?:0800\\d|[235-9])\\d{6}", [7, 11], [["(\\d{3})(\\d{4})", "$1 $2", ["[235-9]|45"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["0"]]], 0, 0, 0, 0, 0, 0, 0, "00"], FK: ["500", "00", "[2-7]\\d{4}", [5]], FM: ["691", "00", "(?:[39]\\d\\d|820)\\d{4}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[389]"]]]], FO: ["298", "00", "[2-9]\\d{5}", [6], [["(\\d{6})", "$1", ["[2-9]"]]], 0, 0, "(10(?:01|[12]0|88))"], FR: ["33", "00", "[1-9]\\d{8}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0 $1"], ["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[1-79]"], "0$1"]], "0"], GA: ["241", "00", "(?:[067]\\d|11)\\d{6}|[2-7]\\d{6}", [7, 8], [["(\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-7]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["11|[67]"], "0$1"]], 0, 0, "0(11\\d{6}|60\\d{6}|61\\d{6}|6[256]\\d{6}|7[467]\\d{6})", "$1"], GB: ["44", "00", "[1-357-9]\\d{9}|[18]\\d{8}|8\\d{6}", [7, 9, 10], [["(\\d{3})(\\d{4})", "$1 $2", ["800", "8001", "80011", "800111", "8001111"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["845", "8454", "84546", "845464"], "0$1"], ["(\\d{3})(\\d{6})", "$1 $2", ["800"], "0$1"], ["(\\d{5})(\\d{4,5})", "$1 $2", ["1(?:38|5[23]|69|76|94)", "1(?:(?:38|69)7|5(?:24|39)|768|946)", "1(?:3873|5(?:242|39[4-6])|(?:697|768)[347]|9467)"], "0$1"], ["(\\d{4})(\\d{5,6})", "$1 $2", ["1(?:[2-69][02-9]|[78])"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["[25]|7(?:0|6[02-9])", "[25]|7(?:0|6(?:[03-9]|2[356]))"], "0$1"], ["(\\d{4})(\\d{6})", "$1 $2", ["7"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1389]"], "0$1"]], "0", 0, 0, 0, 0, 0, [["(?:1(?:1(?:3(?:[0-58]\\d\\d|73[0-35])|4(?:(?:[0-5]\\d|70)\\d|69[7-9])|(?:(?:5[0-26-9]|[78][0-49])\\d|6(?:[0-4]\\d|50))\\d)|(?:2(?:(?:0[024-9]|2[3-9]|3[3-79]|4[1-689]|[58][02-9]|6[0-47-9]|7[013-9]|9\\d)\\d|1(?:[0-7]\\d|8[0-3]))|(?:3(?:0\\d|1[0-8]|[25][02-9]|3[02-579]|[468][0-46-9]|7[1-35-79]|9[2-578])|4(?:0[03-9]|[137]\\d|[28][02-57-9]|4[02-69]|5[0-8]|[69][0-79])|5(?:0[1-35-9]|[16]\\d|2[024-9]|3[015689]|4[02-9]|5[03-9]|7[0-35-9]|8[0-468]|9[0-57-9])|6(?:0[034689]|1\\d|2[0-35689]|[38][013-9]|4[1-467]|5[0-69]|6[13-9]|7[0-8]|9[0-24578])|7(?:0[0246-9]|2\\d|3[0236-8]|4[03-9]|5[0-46-9]|6[013-9]|7[0-35-9]|8[024-9]|9[02-9])|8(?:0[35-9]|2[1-57-9]|3[02-578]|4[0-578]|5[124-9]|6[2-69]|7\\d|8[02-9]|9[02569])|9(?:0[02-589]|[18]\\d|2[02-689]|3[1-57-9]|4[2-9]|5[0-579]|6[2-47-9]|7[0-24578]|9[2-57]))\\d)\\d)|2(?:0[013478]|3[0189]|4[017]|8[0-46-9]|9[0-2])\\d{3})\\d{4}|1(?:2(?:0(?:46[1-4]|87[2-9])|545[1-79]|76(?:2\\d|3[1-8]|6[1-6])|9(?:7(?:2[0-4]|3[2-5])|8(?:2[2-8]|7[0-47-9]|8[3-5])))|3(?:6(?:38[2-5]|47[23])|8(?:47[04-9]|64[0157-9]))|4(?:044[1-7]|20(?:2[23]|8\\d)|6(?:0(?:30|5[2-57]|6[1-8]|7[2-8])|140)|8(?:052|87[1-3]))|5(?:2(?:4(?:3[2-79]|6\\d)|76\\d)|6(?:26[06-9]|686))|6(?:06(?:4\\d|7[4-79])|295[5-7]|35[34]\\d|47(?:24|61)|59(?:5[08]|6[67]|74)|9(?:55[0-4]|77[23]))|7(?:26(?:6[13-9]|7[0-7])|(?:442|688)\\d|50(?:2[0-3]|[3-68]2|76))|8(?:27[56]\\d|37(?:5[2-5]|8[239])|843[2-58])|9(?:0(?:0(?:6[1-8]|85)|52\\d)|3583|4(?:66[1-8]|9(?:2[01]|81))|63(?:23|3[1-4])|9561))\\d{3}", [9, 10]], ["7(?:457[0-57-9]|700[01]|911[028])\\d{5}|7(?:[1-3]\\d\\d|4(?:[0-46-9]\\d|5[0-689])|5(?:0[0-8]|[13-9]\\d|2[0-35-9])|7(?:0[1-9]|[1-7]\\d|8[02-9]|9[0-689])|8(?:[014-9]\\d|[23][0-8])|9(?:[024-9]\\d|1[02-9]|3[0-689]))\\d{6}", [10]], ["80[08]\\d{7}|800\\d{6}|8001111"], ["(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[2-49]))\\d{7}|845464\\d", [7, 10]], ["70\\d{8}", [10]], 0, ["(?:3[0347]|55)\\d{8}", [10]], ["76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}", [10]], ["56\\d{8}", [10]]], 0, " x"], GD: ["1", "011", "(?:473|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "473$1", 0, "473"], GE: ["995", "00", "(?:[3-57]\\d\\d|800)\\d{6}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["70"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["32"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[57]"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[348]"], "0$1"]], "0"], GF: ["594", "00", "[56]94\\d{6}|(?:80|9\\d)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[56]|9[47]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[89]"], "0$1"]], "0"], GG: ["44", "00", "(?:1481|[357-9]\\d{3})\\d{6}|8\\d{6}(?:\\d{2})?", [7, 9, 10], 0, "0", 0, "([25-9]\\d{5})$|0", "1481$1", 0, 0, [["1481[25-9]\\d{5}", [10]], ["7(?:(?:781|839)\\d|911[17])\\d{5}", [10]], ["80[08]\\d{7}|800\\d{6}|8001111"], ["(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[0-3]))\\d{7}|845464\\d", [7, 10]], ["70\\d{8}", [10]], 0, ["(?:3[0347]|55)\\d{8}", [10]], ["76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}", [10]], ["56\\d{8}", [10]]]], GH: ["233", "00", "(?:[235]\\d{3}|800)\\d{5}", [8, 9], [["(\\d{3})(\\d{5})", "$1 $2", ["8"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[235]"], "0$1"]], "0"], GI: ["350", "00", "(?:[25]\\d|60)\\d{6}", [8], [["(\\d{3})(\\d{5})", "$1 $2", ["2"]]]], GL: ["299", "00", "(?:19|[2-689]\\d|70)\\d{4}", [6], [["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["19|[2-9]"]]]], GM: ["220", "00", "[2-9]\\d{6}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]]], GN: ["224", "00", "722\\d{6}|(?:3|6\\d)\\d{7}", [8, 9], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["3"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[67]"]]]], GP: ["590", "00", "590\\d{6}|(?:69|80|9\\d)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[569]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"]], "0", 0, 0, 0, 0, 0, [["590(?:0[1-68]|[14][0-24-9]|2[0-68]|3[1-9]|5[3-579]|[68][0-689]|7[08]|9\\d)\\d{4}"], ["69(?:0\\d\\d|1(?:2[2-9]|3[0-5])|4(?:0[89]|1[2-6]|9\\d)|6(?:1[016-9]|5[0-4]|[67]\\d))\\d{4}"], ["80[0-5]\\d{6}"], 0, 0, 0, 0, 0, ["9(?:(?:39[5-7]|76[018])\\d|475[0-5])\\d{4}"]]], GQ: ["240", "00", "222\\d{6}|(?:3\\d|55|[89]0)\\d{7}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235]"]], ["(\\d{3})(\\d{6})", "$1 $2", ["[89]"]]]], GR: ["30", "00", "5005000\\d{3}|8\\d{9,11}|(?:[269]\\d|70)\\d{8}", [10, 11, 12], [["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["21|7"]], ["(\\d{4})(\\d{6})", "$1 $2", ["2(?:2|3[2-57-9]|4[2-469]|5[2-59]|6[2-9]|7[2-69]|8[2-49])|5"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2689]"]], ["(\\d{3})(\\d{3,4})(\\d{5})", "$1 $2 $3", ["8"]]]], GT: ["502", "00", "80\\d{6}|(?:1\\d{3}|[2-7])\\d{7}", [8, 11], [["(\\d{4})(\\d{4})", "$1 $2", ["[2-8]"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]]]], GU: ["1", "011", "(?:[58]\\d\\d|671|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "671$1", 0, "671"], GW: ["245", "00", "[49]\\d{8}|4\\d{6}", [7, 9], [["(\\d{3})(\\d{4})", "$1 $2", ["40"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[49]"]]]], GY: ["592", "001", "(?:[2-8]\\d{3}|9008)\\d{3}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]]], HK: ["852", "00(?:30|5[09]|[126-9]?)", "8[0-46-9]\\d{6,7}|9\\d{4,7}|(?:[2-7]|9\\d{3})\\d{7}", [5, 6, 7, 8, 9, 11], [["(\\d{3})(\\d{2,5})", "$1 $2", ["900", "9003"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[2-7]|8[1-4]|9(?:0[1-9]|[1-8])"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]], ["(\\d{3})(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]]], 0, 0, 0, 0, 0, 0, 0, "00"], HN: ["504", "00", "8\\d{10}|[237-9]\\d{7}", [8, 11], [["(\\d{4})(\\d{4})", "$1-$2", ["[237-9]"]]]], HR: ["385", "00", "(?:[24-69]\\d|3[0-79])\\d{7}|80\\d{5,7}|[1-79]\\d{7}|6\\d{5,6}", [6, 7, 8, 9], [["(\\d{2})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["6[01]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["8"], "0$1"], ["(\\d)(\\d{4})(\\d{3})", "$1 $2 $3", ["1"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["6|7[245]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-57]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"], "0$1"]], "0"], HT: ["509", "00", "(?:[2-489]\\d|55)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[2-589]"]]]], HU: ["36", "00", "[235-7]\\d{8}|[1-9]\\d{7}", [8, 9], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "(06 $1)"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[27][2-9]|3[2-7]|4[24-9]|5[2-79]|6|8[2-57-9]|9[2-69]"], "(06 $1)"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-9]"], "06 $1"]], "06"], ID: ["62", "00[89]", "(?:(?:00[1-9]|8\\d)\\d{4}|[1-36])\\d{6}|00\\d{10}|[1-9]\\d{8,10}|[2-9]\\d{7}", [7, 8, 9, 10, 11, 12, 13], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["15"]], ["(\\d{2})(\\d{5,9})", "$1 $2", ["2[124]|[36]1"], "(0$1)"], ["(\\d{3})(\\d{5,7})", "$1 $2", ["800"], "0$1"], ["(\\d{3})(\\d{5,8})", "$1 $2", ["[2-79]"], "(0$1)"], ["(\\d{3})(\\d{3,4})(\\d{3})", "$1-$2-$3", ["8[1-35-9]"], "0$1"], ["(\\d{3})(\\d{6,8})", "$1 $2", ["1"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["804"], "0$1"], ["(\\d{3})(\\d)(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["80"], "0$1"], ["(\\d{3})(\\d{4})(\\d{4,5})", "$1-$2-$3", ["8"], "0$1"]], "0"], IE: ["353", "00", "(?:1\\d|[2569])\\d{6,8}|4\\d{6,9}|7\\d{8}|8\\d{8,9}", [7, 8, 9, 10], [["(\\d{2})(\\d{5})", "$1 $2", ["2[24-9]|47|58|6[237-9]|9[35-9]"], "(0$1)"], ["(\\d{3})(\\d{5})", "$1 $2", ["[45]0"], "(0$1)"], ["(\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["1"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2569]|4[1-69]|7[14]"], "(0$1)"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["70"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["81"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[78]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["4"], "(0$1)"], ["(\\d{2})(\\d)(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["8"], "0$1"]], "0"], IL: ["972", "0(?:0|1[2-9])", "1\\d{6}(?:\\d{3,5})?|[57]\\d{8}|[1-489]\\d{7}", [7, 8, 9, 10, 11, 12], [["(\\d{4})(\\d{3})", "$1-$2", ["125"]], ["(\\d{4})(\\d{2})(\\d{2})", "$1-$2-$3", ["121"]], ["(\\d)(\\d{3})(\\d{4})", "$1-$2-$3", ["[2-489]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[57]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1-$2-$3", ["12"]], ["(\\d{4})(\\d{6})", "$1-$2", ["159"]], ["(\\d)(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3-$4", ["1[7-9]"]], ["(\\d{3})(\\d{1,2})(\\d{3})(\\d{4})", "$1-$2 $3-$4", ["15"]]], "0"], IM: ["44", "00", "1624\\d{6}|(?:[3578]\\d|90)\\d{8}", [10], 0, "0", 0, "([25-8]\\d{5})$|0", "1624$1", 0, "74576|(?:16|7[56])24"], IN: ["91", "00", "(?:000800|[2-9]\\d\\d)\\d{7}|1\\d{7,12}", [8, 9, 10, 11, 12, 13], [["(\\d{8})", "$1", ["5(?:0|2[23]|3[03]|[67]1|88)", "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|888)", "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|8888)"], 0, 1], ["(\\d{4})(\\d{4,5})", "$1 $2", ["180", "1800"], 0, 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["140"], 0, 1], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["11|2[02]|33|4[04]|79[1-7]|80[2-46]", "11|2[02]|33|4[04]|79(?:[1-6]|7[19])|80(?:[2-4]|6[0-589])", "11|2[02]|33|4[04]|79(?:[124-6]|3(?:[02-9]|1[0-24-9])|7(?:1|9[1-6]))|80(?:[2-4]|6[0-589])"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1(?:2[0-249]|3[0-25]|4[145]|[68]|7[1257])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|5[12]|[78]1)|6(?:12|[2-4]1|5[17]|6[13]|80)|7(?:12|3[134]|4[47]|61|88)|8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91)|(?:43|59|75)[15]|(?:1[59]|29|67|72)[14]", "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|674|7(?:(?:2[14]|3[34]|5[15])[2-6]|61[346]|88[0-8])|8(?:70[2-6]|84[235-7]|91[3-7])|(?:1(?:29|60|8[06])|261|552|6(?:12|[2-47]1|5[17]|6[13]|80)|7(?:12|31|4[47])|8(?:16|2[014]|3[126]|6[136]|7[78]|83))[2-7]", "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|6(?:12(?:[2-6]|7[0-8])|74[2-7])|7(?:(?:2[14]|5[15])[2-6]|3171|61[346]|88(?:[2-7]|82))|8(?:70[2-6]|84(?:[2356]|7[19])|91(?:[3-6]|7[19]))|73[134][2-6]|(?:74[47]|8(?:16|2[014]|3[126]|6[136]|7[78]|83))(?:[2-6]|7[19])|(?:1(?:29|60|8[06])|261|552|6(?:[2-4]1|5[17]|6[13]|7(?:1|4[0189])|80)|7(?:12|88[01]))[2-7]"], "0$1", 1], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2[2457-9]|3[2-5]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1[013-9]|28|3[129]|4[1-35689]|5[29]|6[02-5]|70)|807", "1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2(?:[2457]|84|95)|3(?:[2-4]|55)|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1(?:[013-8]|9[6-9])|28[6-8]|3(?:17|2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4|5[0-367])|70[13-7])|807[19]", "1(?:[2-479]|5(?:[0236-9]|5[013-9]))|[2-5]|6(?:2(?:84|95)|355|83)|73179|807(?:1|9[1-3])|(?:1552|6(?:1[1358]|2[2457]|3[2-4]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[124-6])\\d|7(?:1(?:[013-8]\\d|9[6-9])|28[6-8]|3(?:2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]\\d|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4\\d|5[0-367])|70[13-7]))[2-7]"], "0$1", 1], ["(\\d{5})(\\d{5})", "$1 $2", ["[6-9]"], "0$1", 1], ["(\\d{4})(\\d{2,4})(\\d{4})", "$1 $2 $3", ["1(?:6|8[06])", "1(?:6|8[06]0)"], 0, 1], ["(\\d{4})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["18"], 0, 1]], "0"], IO: ["246", "00", "3\\d{6}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["3"]]]], IQ: ["964", "00", "(?:1|7\\d\\d)\\d{7}|[2-6]\\d{7,8}", [8, 9, 10], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-6]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"]], "0"], IR: ["98", "00", "[1-9]\\d{9}|(?:[1-8]\\d\\d|9)\\d{3,4}", [4, 5, 6, 7, 10], [["(\\d{4,5})", "$1", ["96"], "0$1"], ["(\\d{2})(\\d{4,5})", "$1 $2", ["(?:1[137]|2[13-68]|3[1458]|4[145]|5[1468]|6[16]|7[1467]|8[13467])[12689]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["[1-8]"], "0$1"]], "0"], IS: ["354", "00|1(?:0(?:01|[12]0)|100)", "(?:38\\d|[4-9])\\d{6}", [7, 9], [["(\\d{3})(\\d{4})", "$1 $2", ["[4-9]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["3"]]], 0, 0, 0, 0, 0, 0, 0, "00"], IT: ["39", "00", "0\\d{5,10}|1\\d{8,10}|3(?:[0-8]\\d{7,10}|9\\d{7,8})|(?:43|55|70)\\d{8}|8\\d{5}(?:\\d{2,4})?", [6, 7, 8, 9, 10, 11], [["(\\d{2})(\\d{4,6})", "$1 $2", ["0[26]"]], ["(\\d{3})(\\d{3,6})", "$1 $2", ["0[13-57-9][0159]|8(?:03|4[17]|9[2-5])", "0[13-57-9][0159]|8(?:03|4[17]|9(?:2|3[04]|[45][0-4]))"]], ["(\\d{4})(\\d{2,6})", "$1 $2", ["0(?:[13-579][2-46-8]|8[236-8])"]], ["(\\d{4})(\\d{4})", "$1 $2", ["894"]], ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[26]|5"]], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1(?:44|[679])|[378]|43"]], ["(\\d{3})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[13-57-9][0159]|14"]], ["(\\d{2})(\\d{4})(\\d{5})", "$1 $2 $3", ["0[26]"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["0"]], ["(\\d{3})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["3"]]], 0, 0, 0, 0, 0, 0, [["0669[0-79]\\d{1,6}|0(?:1(?:[0159]\\d|[27][1-5]|31|4[1-4]|6[1356]|8[2-57])|2\\d\\d|3(?:[0159]\\d|2[1-4]|3[12]|[48][1-6]|6[2-59]|7[1-7])|4(?:[0159]\\d|[23][1-9]|4[245]|6[1-5]|7[1-4]|81)|5(?:[0159]\\d|2[1-5]|3[2-6]|4[1-79]|6[4-6]|7[1-578]|8[3-8])|6(?:[0-57-9]\\d|6[0-8])|7(?:[0159]\\d|2[12]|3[1-7]|4[2-46]|6[13569]|7[13-6]|8[1-59])|8(?:[0159]\\d|2[3-578]|3[1-356]|[6-8][1-5])|9(?:[0159]\\d|[238][1-5]|4[12]|6[1-8]|7[1-6]))\\d{2,7}"], ["3[2-9]\\d{7,8}|(?:31|43)\\d{8}", [9, 10]], ["80(?:0\\d{3}|3)\\d{3}", [6, 9]], ["(?:0878\\d{3}|89(?:2\\d|3[04]|4(?:[0-4]|[5-9]\\d\\d)|5[0-4]))\\d\\d|(?:1(?:44|6[346])|89(?:38|5[5-9]|9))\\d{6}", [6, 8, 9, 10]], ["1(?:78\\d|99)\\d{6}", [9, 10]], 0, 0, 0, ["55\\d{8}", [10]], ["84(?:[08]\\d{3}|[17])\\d{3}", [6, 9]]]], JE: ["44", "00", "1534\\d{6}|(?:[3578]\\d|90)\\d{8}", [10], 0, "0", 0, "([0-24-8]\\d{5})$|0", "1534$1", 0, 0, [["1534[0-24-8]\\d{5}"], ["7(?:(?:(?:50|82)9|937)\\d|7(?:00[378]|97\\d))\\d{5}"], ["80(?:07(?:35|81)|8901)\\d{4}"], ["(?:8(?:4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|90(?:066[59]|1810|71(?:07|55)))\\d{4}"], ["701511\\d{4}"], 0, ["(?:3(?:0(?:07(?:35|81)|8901)|3\\d{4}|4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|55\\d{4})\\d{4}"], ["76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}"], ["56\\d{8}"]]], JM: ["1", "011", "(?:[58]\\d\\d|658|900)\\d{7}", [10], 0, "1", 0, 0, 0, 0, "658|876"], JO: ["962", "00", "(?:(?:[2689]|7\\d)\\d|32|53)\\d{6}", [8, 9], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2356]|87"], "(0$1)"], ["(\\d{3})(\\d{5,6})", "$1 $2", ["[89]"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["70"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["7"], "0$1"]], "0"], JP: ["81", "010", "00[1-9]\\d{6,14}|[257-9]\\d{9}|(?:00|[1-9]\\d\\d)\\d{6}", [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], [["(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3", ["(?:12|57|99)0"], "0$1"], ["(\\d{4})(\\d)(\\d{4})", "$1-$2-$3", ["1(?:26|3[79]|4[56]|5[4-68]|6[3-5])|499|5(?:76|97)|746|8(?:3[89]|47|51)|9(?:80|9[16])", "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:76|97)9|7468|8(?:3(?:8[7-9]|96)|477|51[2-9])|9(?:802|9(?:1[23]|69))|1(?:45|58)[67]", "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:769|979[2-69])|7468|8(?:3(?:8[7-9]|96[2457-9])|477|51[2-9])|9(?:802|9(?:1[23]|69))|1(?:45|58)[67]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["60"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1-$2-$3", ["[36]|4(?:2[09]|7[01])", "[36]|4(?:2(?:0|9[02-69])|7(?:0[019]|1))"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["1(?:1|5[45]|77|88|9[69])|2(?:2[1-37]|3[0-269]|4[59]|5|6[24]|7[1-358]|8[1369]|9[0-38])|4(?:[28][1-9]|3[0-57]|[45]|6[248]|7[2-579]|9[29])|5(?:2|3[0459]|4[0-369]|5[29]|8[02389]|9[0-389])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9[2-6])|8(?:2[124589]|3[26-9]|49|51|6|7[0-468]|8[68]|9[019])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9[1-489])", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2(?:[127]|3[014-9])|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9[19])|62|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|8[1-9]|9[29])|5(?:2|3(?:[045]|9[0-8])|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0-2469])|3(?:[29]|60)|49|51|6(?:[0-24]|36|5[0-3589]|7[23]|9[01459])|7[0-468]|8[68])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9(?:[1289]|3[34]|4[0178]))|(?:264|837)[016-9]|2(?:57|93)[015-9]|(?:25[0468]|422|838)[01]|(?:47[59]|59[89]|8(?:6[68]|9))[019]", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2[127]|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9(?:17|99))|6(?:2|4[016-9])|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|9[29])|5(?:2|3(?:[045]|9(?:[0-58]|6[4-9]|7[0-35689]))|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0169])|3(?:[29]|60|7(?:[017-9]|6[6-8]))|49|51|6(?:[0-24]|36[2-57-9]|5(?:[0-389]|5[23])|6(?:[01]|9[178])|7(?:2[2-468]|3[78])|9[0145])|7[0-468]|8[68])|9(?:4[15]|5[138]|7[156]|8[189]|9(?:[1289]|3(?:31|4[357])|4[0178]))|(?:8294|96)[1-3]|2(?:57|93)[015-9]|(?:223|8699)[014-9]|(?:25[0468]|422|838)[01]|(?:48|8292|9[23])[1-9]|(?:47[59]|59[89]|8(?:68|9))[019]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", ["[14]|[289][2-9]|5[3-9]|7[2-4679]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["800"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["[257-9]"], "0$1"]], "0", 0, "(000[259]\\d{6})$|(?:(?:003768)0?)|0", "$1"], KE: ["254", "000", "(?:[17]\\d\\d|900)\\d{6}|(?:2|80)0\\d{6,7}|[4-6]\\d{6,8}", [7, 8, 9, 10], [["(\\d{2})(\\d{5,7})", "$1 $2", ["[24-6]"], "0$1"], ["(\\d{3})(\\d{6})", "$1 $2", ["[17]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[89]"], "0$1"]], "0"], KG: ["996", "00", "8\\d{9}|[235-9]\\d{8}", [9, 10], [["(\\d{4})(\\d{5})", "$1 $2", ["3(?:1[346]|[24-79])"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235-79]|88"], "0$1"], ["(\\d{3})(\\d{3})(\\d)(\\d{2,3})", "$1 $2 $3 $4", ["8"], "0$1"]], "0"], KH: ["855", "00[14-9]", "1\\d{9}|[1-9]\\d{7,8}", [8, 9, 10], [["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-9]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]]], "0"], KI: ["686", "00", "(?:[37]\\d|6[0-79])\\d{6}|(?:[2-48]\\d|50)\\d{3}", [5, 8], 0, "0"], KM: ["269", "00", "[3478]\\d{6}", [7], [["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[3478]"]]]], KN: ["1", "011", "(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-7]\\d{6})$|1", "869$1", 0, "869"], KP: ["850", "00|99", "85\\d{6}|(?:19\\d|[2-7])\\d{7}", [8, 10], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"], "0$1"], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-7]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"]], "0"], KR: ["82", "00(?:[125689]|3(?:[46]5|91)|7(?:00|27|3|55|6[126]))", "00[1-9]\\d{8,11}|(?:[12]|5\\d{3})\\d{7}|[13-6]\\d{9}|(?:[1-6]\\d|80)\\d{7}|[3-6]\\d{4,5}|(?:00|7)0\\d{8}", [5, 6, 8, 9, 10, 11, 12, 13, 14], [["(\\d{2})(\\d{3,4})", "$1-$2", ["(?:3[1-3]|[46][1-4]|5[1-5])1"], "0$1"], ["(\\d{4})(\\d{4})", "$1-$2", ["1"]], ["(\\d)(\\d{3,4})(\\d{4})", "$1-$2-$3", ["2"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[36]0|8"], "0$1"], ["(\\d{2})(\\d{3,4})(\\d{4})", "$1-$2-$3", ["[1346]|5[1-5]"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["[57]"], "0$1"], ["(\\d{2})(\\d{5})(\\d{4})", "$1-$2-$3", ["5"], "0$1"]], "0", 0, "0(8(?:[1-46-8]|5\\d\\d))?"], KW: ["965", "00", "18\\d{5}|(?:[2569]\\d|41)\\d{6}", [7, 8], [["(\\d{4})(\\d{3,4})", "$1 $2", ["[169]|2(?:[235]|4[1-35-9])|52"]], ["(\\d{3})(\\d{5})", "$1 $2", ["[245]"]]]], KY: ["1", "011", "(?:345|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "345$1", 0, "345"], KZ: ["7", "810", "(?:33622|8\\d{8})\\d{5}|[78]\\d{9}", [10, 14], 0, "8", 0, 0, 0, 0, "33|7", 0, "8~10"], LA: ["856", "00", "[23]\\d{9}|3\\d{8}|(?:[235-8]\\d|41)\\d{6}", [8, 9, 10], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2[13]|3[14]|[4-8]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["30[0135-9]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["[23]"], "0$1"]], "0"], LB: ["961", "00", "[27-9]\\d{7}|[13-9]\\d{6}", [7, 8], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[13-69]|7(?:[2-57]|62|8[0-7]|9[04-9])|8[02-9]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[27-9]"]]], "0"], LC: ["1", "011", "(?:[58]\\d\\d|758|900)\\d{7}", [10], 0, "1", 0, "([2-8]\\d{6})$|1", "758$1", 0, "758"], LI: ["423", "00", "[68]\\d{8}|(?:[2378]\\d|90)\\d{5}", [7, 9], [["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[2379]|8(?:0[09]|7)", "[2379]|8(?:0(?:02|9)|7)"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["69"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]]], "0", 0, "(1001)|0"], LK: ["94", "00", "[1-9]\\d{8}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[1-689]"], "0$1"]], "0"], LR: ["231", "00", "(?:[245]\\d|33|77|88)\\d{7}|(?:2\\d|[4-6])\\d{6}", [7, 8, 9], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["4[67]|[56]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-578]"], "0$1"]], "0"], LS: ["266", "00", "(?:[256]\\d\\d|800)\\d{5}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[2568]"]]]], LT: ["370", "00", "(?:[3469]\\d|52|[78]0)\\d{6}", [8], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["52[0-7]"], "(0-$1)", 1], ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[7-9]"], "0 $1", 1], ["(\\d{2})(\\d{6})", "$1 $2", ["37|4(?:[15]|6[1-8])"], "(0-$1)", 1], ["(\\d{3})(\\d{5})", "$1 $2", ["[3-6]"], "(0-$1)", 1]], "0", 0, "[08]"], LU: ["352", "00", "35[013-9]\\d{4,8}|6\\d{8}|35\\d{2,4}|(?:[2457-9]\\d|3[0-46-9])\\d{2,9}", [4, 5, 6, 7, 8, 9, 10, 11], [["(\\d{2})(\\d{3})", "$1 $2", ["2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])"]], ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])"]], ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["20[2-689]"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4", ["2(?:[0367]|4[3-8])"]], ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["80[01]|90[015]"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["20"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4 $5", ["2(?:[0367]|4[3-8])"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{1,5})", "$1 $2 $3 $4", ["[3-57]|8[13-9]|9(?:0[89]|[2-579])|(?:2|80)[2-9]"]]], 0, 0, "(15(?:0[06]|1[12]|[35]5|4[04]|6[26]|77|88|99)\\d)"], LV: ["371", "00", "(?:[268]\\d|90)\\d{6}", [8], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[269]|8[01]"]]]], LY: ["218", "00", "[2-9]\\d{8}", [9], [["(\\d{2})(\\d{7})", "$1-$2", ["[2-9]"], "0$1"]], "0"], MA: ["212", "00", "[5-8]\\d{8}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["5[45]"], "0$1"], ["(\\d{4})(\\d{5})", "$1-$2", ["5(?:2[2-46-9]|3[3-9]|9)|8(?:0[89]|92)"], "0$1"], ["(\\d{2})(\\d{7})", "$1-$2", ["8"], "0$1"], ["(\\d{3})(\\d{6})", "$1-$2", ["[5-7]"], "0$1"]], "0", 0, 0, 0, 0, 0, [["5(?:2(?:[0-25-79]\\d|3[1-578]|4[02-46-8]|8[0235-7])|3(?:[0-47]\\d|5[02-9]|6[02-8]|8[014-9]|9[3-9])|(?:4[067]|5[03])\\d)\\d{5}"], ["(?:6(?:[0-79]\\d|8[0-247-9])|7(?:[0167]\\d|2[0-4]|5[01]|8[0-3]))\\d{6}"], ["80[0-7]\\d{6}"], ["89\\d{7}"], 0, 0, 0, 0, ["(?:592(?:4[0-2]|93)|80[89]\\d\\d)\\d{4}"]]], MC: ["377", "00", "(?:[3489]|6\\d)\\d{7}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["4"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[389]"]], ["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["6"], "0$1"]], "0"], MD: ["373", "00", "(?:[235-7]\\d|[89]0)\\d{6}", [8], [["(\\d{3})(\\d{5})", "$1 $2", ["[89]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["22|3"], "0$1"], ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[25-7]"], "0$1"]], "0"], ME: ["382", "00", "(?:20|[3-79]\\d)\\d{6}|80\\d{6,7}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-9]"], "0$1"]], "0"], MF: ["590", "00", "590\\d{6}|(?:69|80|9\\d)\\d{7}", [9], 0, "0", 0, 0, 0, 0, 0, [["590(?:0[079]|[14]3|[27][79]|3[03-7]|5[0-268]|87)\\d{4}"], ["69(?:0\\d\\d|1(?:2[2-9]|3[0-5])|4(?:0[89]|1[2-6]|9\\d)|6(?:1[016-9]|5[0-4]|[67]\\d))\\d{4}"], ["80[0-5]\\d{6}"], 0, 0, 0, 0, 0, ["9(?:(?:39[5-7]|76[018])\\d|475[0-5])\\d{4}"]]], MG: ["261", "00", "[23]\\d{8}", [9], [["(\\d{2})(\\d{2})(\\d{3})(\\d{2})", "$1 $2 $3 $4", ["[23]"], "0$1"]], "0", 0, "([24-9]\\d{6})$|0", "20$1"], MH: ["692", "011", "329\\d{4}|(?:[256]\\d|45)\\d{5}", [7], [["(\\d{3})(\\d{4})", "$1-$2", ["[2-6]"]]], "1"], MK: ["389", "00", "[2-578]\\d{7}", [8], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["2|34[47]|4(?:[37]7|5[47]|64)"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[347]"], "0$1"], ["(\\d{3})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[58]"], "0$1"]], "0"], ML: ["223", "00", "[24-9]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[24-9]"]]]], MM: ["95", "00", "1\\d{5,7}|95\\d{6}|(?:[4-7]|9[0-46-9])\\d{6,8}|(?:2|8\\d)\\d{5,8}", [6, 7, 8, 9, 10], [["(\\d)(\\d{2})(\\d{3})", "$1 $2 $3", ["16|2"], "0$1"], ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["[45]|6(?:0[23]|[1-689]|7[235-7])|7(?:[0-4]|5[2-7])|8[1-6]"], "0$1"], ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[12]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[4-7]|8[1-35]"], "0$1"], ["(\\d)(\\d{3})(\\d{4,6})", "$1 $2 $3", ["9(?:2[0-4]|[35-9]|4[137-9])"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"], ["(\\d)(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["92"], "0$1"], ["(\\d)(\\d{5})(\\d{4})", "$1 $2 $3", ["9"], "0$1"]], "0"], MN: ["976", "001", "[12]\\d{7,9}|[5-9]\\d{7}", [8, 9, 10], [["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[12]1"], "0$1"], ["(\\d{4})(\\d{4})", "$1 $2", ["[5-9]"]], ["(\\d{3})(\\d{5,6})", "$1 $2", ["[12]2[1-3]"], "0$1"], ["(\\d{4})(\\d{5,6})", "$1 $2", ["[12](?:27|3[2-8]|4[2-68]|5[1-4689])", "[12](?:27|3[2-8]|4[2-68]|5[1-4689])[0-3]"], "0$1"], ["(\\d{5})(\\d{4,5})", "$1 $2", ["[12]"], "0$1"]], "0"], MO: ["853", "00", "0800\\d{3}|(?:28|[68]\\d)\\d{6}", [7, 8], [["(\\d{4})(\\d{3})", "$1 $2", ["0"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[268]"]]]], MP: ["1", "011", "[58]\\d{9}|(?:67|90)0\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "670$1", 0, "670"], MQ: ["596", "00", "596\\d{6}|(?:69|80|9\\d)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[569]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"]], "0"], MR: ["222", "00", "(?:[2-4]\\d\\d|800)\\d{5}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-48]"]]]], MS: ["1", "011", "(?:[58]\\d\\d|664|900)\\d{7}", [10], 0, "1", 0, "([34]\\d{6})$|1", "664$1", 0, "664"], MT: ["356", "00", "3550\\d{4}|(?:[2579]\\d\\d|800)\\d{5}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[2357-9]"]]]], MU: ["230", "0(?:0|[24-7]0|3[03])", "(?:[57]|8\\d\\d)\\d{7}|[2-468]\\d{6}", [7, 8, 10], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-46]|8[013]"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[57]"]], ["(\\d{5})(\\d{5})", "$1 $2", ["8"]]], 0, 0, 0, 0, 0, 0, 0, "020"], MV: ["960", "0(?:0|19)", "(?:800|9[0-57-9]\\d)\\d{7}|[34679]\\d{6}", [7, 10], [["(\\d{3})(\\d{4})", "$1-$2", ["[34679]"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], MW: ["265", "00", "(?:[1289]\\d|31|77)\\d{7}|1\\d{6}", [7, 9], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["1[2-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[137-9]"], "0$1"]], "0"], MX: ["52", "0[09]", "[2-9]\\d{9}", [10], [["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["33|5[56]|81"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-9]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], MY: ["60", "00", "1\\d{8,9}|(?:3\\d|[4-9])\\d{7}", [8, 9, 10], [["(\\d)(\\d{3})(\\d{4})", "$1-$2 $3", ["[4-79]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1-$2 $3", ["1(?:[02469]|[378][1-9]|53)|8", "1(?:[02469]|[37][1-9]|53|8(?:[1-46-9]|5[7-9]))|8"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1-$2 $3", ["3"], "0$1"], ["(\\d)(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3-$4", ["1(?:[367]|80)"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2 $3", ["15"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2 $3", ["1"], "0$1"]], "0"], MZ: ["258", "00", "(?:2|8\\d)\\d{7}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2|8[2-79]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]]]], NA: ["264", "00", "[68]\\d{7,8}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["88"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["6"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["87"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"]], "0"], NC: ["687", "00", "(?:050|[2-57-9]\\d\\d)\\d{3}", [6], [["(\\d{2})(\\d{2})(\\d{2})", "$1.$2.$3", ["[02-57-9]"]]]], NE: ["227", "00", "[027-9]\\d{7}", [8], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["08"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[089]|2[013]|7[0467]"]]]], NF: ["672", "00", "[13]\\d{5}", [6], [["(\\d{2})(\\d{4})", "$1 $2", ["1[0-3]"]], ["(\\d)(\\d{5})", "$1 $2", ["[13]"]]], 0, 0, "([0-258]\\d{4})$", "3$1"], NG: ["234", "009", "2[0-24-9]\\d{8}|[78]\\d{10,13}|[7-9]\\d{9}|[1-9]\\d{7}|[124-7]\\d{6}", [7, 8, 10, 11, 12, 13, 14], [["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["78"], "0$1"], ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[12]|9(?:0[3-9]|[1-9])"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["[3-6]|7(?:0[0-689]|[1-79])|8[2-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[7-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["20[129]"], "0$1"], ["(\\d{4})(\\d{2})(\\d{4})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{3})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["[78]"], "0$1"], ["(\\d{3})(\\d{5})(\\d{5,6})", "$1 $2 $3", ["[78]"], "0$1"]], "0"], NI: ["505", "00", "(?:1800|[25-8]\\d{3})\\d{4}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[125-8]"]]]], NL: ["31", "00", "(?:[124-7]\\d\\d|3(?:[02-9]\\d|1[0-8]))\\d{6}|8\\d{6,9}|9\\d{6,10}|1\\d{4,5}", [5, 6, 7, 8, 9, 10, 11], [["(\\d{3})(\\d{4,7})", "$1 $2", ["[89]0"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["66"], "0$1"], ["(\\d)(\\d{8})", "$1 $2", ["6"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["1[16-8]|2[259]|3[124]|4[17-9]|5[124679]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-578]|91"], "0$1"], ["(\\d{3})(\\d{3})(\\d{5})", "$1 $2 $3", ["9"], "0$1"]], "0"], NO: ["47", "00", "(?:0|[2-9]\\d{3})\\d{4}", [5, 8], [["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["8"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-79]"]]], 0, 0, 0, 0, 0, "[02-689]|7[0-8]"], NP: ["977", "00", "(?:1\\d|9)\\d{9}|[1-9]\\d{7}", [8, 10, 11], [["(\\d)(\\d{7})", "$1-$2", ["1[2-6]"], "0$1"], ["(\\d{2})(\\d{6})", "$1-$2", ["1[01]|[2-8]|9(?:[1-59]|[67][2-6])"], "0$1"], ["(\\d{3})(\\d{7})", "$1-$2", ["9"]]], "0"], NR: ["674", "00", "(?:444|(?:55|8\\d)\\d|666)\\d{4}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[4-68]"]]]], NU: ["683", "00", "(?:[4-7]|888\\d)\\d{3}", [4, 7], [["(\\d{3})(\\d{4})", "$1 $2", ["8"]]]], NZ: ["64", "0(?:0|161)", "[1289]\\d{9}|50\\d{5}(?:\\d{2,3})?|[27-9]\\d{7,8}|(?:[34]\\d|6[0-35-9])\\d{6}|8\\d{4,6}", [5, 6, 7, 8, 9, 10], [["(\\d{2})(\\d{3,8})", "$1 $2", ["8[1-79]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["50[036-8]|8|90", "50(?:[0367]|88)|8|90"], "0$1"], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["24|[346]|7[2-57-9]|9[2-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2(?:10|74)|[589]"], "0$1"], ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["1|2[028]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,5})", "$1 $2 $3", ["2(?:[169]|7[0-35-9])|7"], "0$1"]], "0", 0, 0, 0, 0, 0, 0, "00"], OM: ["968", "00", "(?:1505|[279]\\d{3}|500)\\d{4}|800\\d{5,6}", [7, 8, 9], [["(\\d{3})(\\d{4,6})", "$1 $2", ["[58]"]], ["(\\d{2})(\\d{6})", "$1 $2", ["2"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[179]"]]]], PA: ["507", "00", "(?:00800|8\\d{3})\\d{6}|[68]\\d{7}|[1-57-9]\\d{6}", [7, 8, 10, 11], [["(\\d{3})(\\d{4})", "$1-$2", ["[1-57-9]"]], ["(\\d{4})(\\d{4})", "$1-$2", ["[68]"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]]]], PE: ["51", "00|19(?:1[124]|77|90)00", "(?:[14-8]|9\\d)\\d{7}", [8, 9], [["(\\d{3})(\\d{5})", "$1 $2", ["80"], "(0$1)"], ["(\\d)(\\d{7})", "$1 $2", ["1"], "(0$1)"], ["(\\d{2})(\\d{6})", "$1 $2", ["[4-8]"], "(0$1)"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"]]], "0", 0, 0, 0, 0, 0, 0, "00", " Anexo "], PF: ["689", "00", "4\\d{5}(?:\\d{2})?|8\\d{7,8}", [6, 8, 9], [["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["44"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4|8[7-9]"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]]]], PG: ["675", "00|140[1-3]", "(?:180|[78]\\d{3})\\d{4}|(?:[2-589]\\d|64)\\d{5}", [7, 8], [["(\\d{3})(\\d{4})", "$1 $2", ["18|[2-69]|85"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[78]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], PH: ["63", "00", "(?:[2-7]|9\\d)\\d{8}|2\\d{5}|(?:1800|8)\\d{7,9}", [6, 8, 9, 10, 11, 12, 13], [["(\\d)(\\d{5})", "$1 $2", ["2"], "(0$1)"], ["(\\d{4})(\\d{4,6})", "$1 $2", ["3(?:23|39|46)|4(?:2[3-6]|[35]9|4[26]|76)|544|88[245]|(?:52|64|86)2", "3(?:230|397|461)|4(?:2(?:35|[46]4|51)|396|4(?:22|63)|59[347]|76[15])|5(?:221|446)|642[23]|8(?:622|8(?:[24]2|5[13]))"], "(0$1)"], ["(\\d{5})(\\d{4})", "$1 $2", ["346|4(?:27|9[35])|883", "3469|4(?:279|9(?:30|56))|8834"], "(0$1)"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[3-7]|8[2-8]"], "(0$1)"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]], ["(\\d{4})(\\d{1,2})(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["1"]]], "0"], PK: ["92", "00", "122\\d{6}|[24-8]\\d{10,11}|9(?:[013-9]\\d{8,10}|2(?:[01]\\d\\d|2(?:[06-8]\\d|1[01]))\\d{7})|(?:[2-8]\\d{3}|92(?:[0-7]\\d|8[1-9]))\\d{6}|[24-9]\\d{8}|[89]\\d{7}", [8, 9, 10, 11, 12], [["(\\d{3})(\\d{3})(\\d{2,7})", "$1 $2 $3", ["[89]0"], "0$1"], ["(\\d{4})(\\d{5})", "$1 $2", ["1"]], ["(\\d{3})(\\d{6,7})", "$1 $2", ["2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:2[2-8]|3[27-9]|4[2-6]|6[3569]|9[25-8])", "9(?:2[3-8]|98)|(?:2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:22|3[27-9]|4[2-6]|6[3569]|9[25-7]))[2-9]"], "(0$1)"], ["(\\d{2})(\\d{7,8})", "$1 $2", ["(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]"], "(0$1)"], ["(\\d{5})(\\d{5})", "$1 $2", ["58"], "(0$1)"], ["(\\d{3})(\\d{7})", "$1 $2", ["3"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91"], "(0$1)"], ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["[24-9]"], "(0$1)"]], "0"], PL: ["48", "00", "(?:6|8\\d\\d)\\d{7}|[1-9]\\d{6}(?:\\d{2})?|[26]\\d{5}", [6, 7, 8, 9, 10], [["(\\d{5})", "$1", ["19"]], ["(\\d{3})(\\d{3})", "$1 $2", ["11|20|64"]], ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])1", "(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])19"]], ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["64"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["21|39|45|5[0137]|6[0469]|7[02389]|8(?:0[14]|8)"]], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[2-8]|[2-7]|8[1-79]|9[145]"]], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["8"]]]], PM: ["508", "00", "[45]\\d{5}|(?:708|80\\d)\\d{6}", [6, 9], [["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["[45]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["7"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"]], "0"], PR: ["1", "011", "(?:[589]\\d\\d|787)\\d{7}", [10], 0, "1", 0, 0, 0, 0, "787|939"], PS: ["970", "00", "[2489]2\\d{6}|(?:1\\d|5)\\d{8}", [8, 9, 10], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2489]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["5"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]]], "0"], PT: ["351", "00", "1693\\d{5}|(?:[26-9]\\d|30)\\d{7}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["2[12]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["16|[236-9]"]]]], PW: ["680", "01[12]", "(?:[24-8]\\d\\d|345|900)\\d{4}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]]], PY: ["595", "00", "59\\d{4,6}|9\\d{5,10}|(?:[2-46-8]\\d|5[0-8])\\d{4,7}", [6, 7, 8, 9, 10, 11], [["(\\d{3})(\\d{3,6})", "$1 $2", ["[2-9]0"], "0$1"], ["(\\d{2})(\\d{5})", "$1 $2", ["[26]1|3[289]|4[1246-8]|7[1-3]|8[1-36]"], "(0$1)"], ["(\\d{3})(\\d{4,5})", "$1 $2", ["2[279]|3[13-5]|4[359]|5|6(?:[34]|7[1-46-8])|7[46-8]|85"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2[14-68]|3[26-9]|4[1246-8]|6(?:1|75)|7[1-35]|8[1-36]"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["87"]], ["(\\d{3})(\\d{6})", "$1 $2", ["9(?:[5-79]|8[1-7])"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-8]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["9"]]], "0"], QA: ["974", "00", "800\\d{4}|(?:2|800)\\d{6}|(?:0080|[3-7])\\d{7}", [7, 8, 9, 11], [["(\\d{3})(\\d{4})", "$1 $2", ["2[16]|8"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[3-7]"]]]], RE: ["262", "00", "(?:26|[689]\\d)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2689]"], "0$1"]], "0", 0, 0, 0, 0, 0, [["26(?:2\\d\\d|3(?:0\\d|1[0-6]))\\d{4}"], ["69(?:2\\d\\d|3(?:[06][0-6]|1[013]|2[0-2]|3[0-39]|4\\d|5[0-5]|7[0-37]|8[0-8]|9[0-479]))\\d{4}"], ["80\\d{7}"], ["89[1-37-9]\\d{6}"], 0, 0, 0, 0, ["9(?:399[0-3]|479[0-5]|76(?:2[278]|3[0-37]))\\d{4}"], ["8(?:1[019]|2[0156]|84|90)\\d{6}"]]], RO: ["40", "00", "(?:[236-8]\\d|90)\\d{7}|[23]\\d{5}", [6, 9], [["(\\d{3})(\\d{3})", "$1 $2", ["2[3-6]", "2[3-6]\\d9"], "0$1"], ["(\\d{2})(\\d{4})", "$1 $2", ["219|31"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[23]1"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[236-9]"], "0$1"]], "0", 0, 0, 0, 0, 0, 0, 0, " int "], RS: ["381", "00", "38[02-9]\\d{6,9}|6\\d{7,9}|90\\d{4,8}|38\\d{5,6}|(?:7\\d\\d|800)\\d{3,9}|(?:[12]\\d|3[0-79])\\d{5,10}", [6, 7, 8, 9, 10, 11, 12], [["(\\d{3})(\\d{3,9})", "$1 $2", ["(?:2[389]|39)0|[7-9]"], "0$1"], ["(\\d{2})(\\d{5,10})", "$1 $2", ["[1-36]"], "0$1"]], "0"], RU: ["7", "810", "8\\d{13}|[347-9]\\d{9}", [10, 14], [["(\\d{4})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["7(?:1[0-8]|2[1-9])", "7(?:1(?:[0-356]2|4[29]|7|8[27])|2(?:1[23]|[2-9]2))", "7(?:1(?:[0-356]2|4[29]|7|8[27])|2(?:13[03-69]|62[013-9]))|72[1-57-9]2"], "8 ($1)", 1], ["(\\d{5})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["7(?:1[0-68]|2[1-9])", "7(?:1(?:[06][3-6]|[18]|2[35]|[3-5][3-5])|2(?:[13][3-5]|[24-689]|7[457]))", "7(?:1(?:0(?:[356]|4[023])|[18]|2(?:3[013-9]|5)|3[45]|43[013-79]|5(?:3[1-8]|4[1-7]|5)|6(?:3[0-35-9]|[4-6]))|2(?:1(?:3[178]|[45])|[24-689]|3[35]|7[457]))|7(?:14|23)4[0-8]|71(?:33|45)[1-79]"], "8 ($1)", 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "8 ($1)", 1], ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[349]|8(?:[02-7]|1[1-8])"], "8 ($1)", 1], ["(\\d{4})(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["8"], "8 ($1)"]], "8", 0, 0, 0, 0, "3[04-689]|[489]", 0, "8~10"], RW: ["250", "00", "(?:06|[27]\\d\\d|[89]00)\\d{6}", [8, 9], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[7-9]"], "0$1"]], "0"], SA: ["966", "00", "92\\d{7}|(?:[15]|8\\d)\\d{8}", [9, 10], [["(\\d{4})(\\d{5})", "$1 $2", ["9"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["5"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["81"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]]], "0"], SB: ["677", "0[01]", "[6-9]\\d{6}|[1-6]\\d{4}", [5, 7], [["(\\d{2})(\\d{5})", "$1 $2", ["6[89]|7|8[4-9]|9(?:[1-8]|9[0-8])"]]]], SC: ["248", "010|0[0-2]", "(?:[2489]\\d|64)\\d{5}", [7], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[246]|9[57]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], SD: ["249", "00", "[19]\\d{8}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[19]"], "0$1"]], "0"], SE: ["46", "00", "(?:[26]\\d\\d|9)\\d{9}|[1-9]\\d{8}|[1-689]\\d{7}|[1-4689]\\d{6}|2\\d{5}", [6, 7, 8, 9, 10], [["(\\d{2})(\\d{2,3})(\\d{2})", "$1-$2 $3", ["20"], "0$1", 0, "$1 $2 $3"], ["(\\d{3})(\\d{4})", "$1-$2", ["9(?:00|39|44|9)"], "0$1", 0, "$1 $2"], ["(\\d{2})(\\d{3})(\\d{2})", "$1-$2 $3", ["[12][136]|3[356]|4[0246]|6[03]|90[1-9]"], "0$1", 0, "$1 $2 $3"], ["(\\d)(\\d{2,3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["8"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{3})(\\d{2,3})(\\d{2})", "$1-$2 $3", ["1[2457]|2(?:[247-9]|5[0138])|3[0247-9]|4[1357-9]|5[0-35-9]|6(?:[125689]|4[02-57]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])"], "0$1", 0, "$1 $2 $3"], ["(\\d{3})(\\d{2,3})(\\d{3})", "$1-$2 $3", ["9(?:00|39|44)"], "0$1", 0, "$1 $2 $3"], ["(\\d{2})(\\d{2,3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["1[13689]|2[0136]|3[1356]|4[0246]|54|6[03]|90[1-9]"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["10|7"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d)(\\d{3})(\\d{3})(\\d{2})", "$1-$2 $3 $4", ["8"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["[13-5]|2(?:[247-9]|5[0138])|6(?:[124-689]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{3})", "$1-$2 $3 $4", ["9"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1-$2 $3 $4 $5", ["[26]"], "0$1", 0, "$1 $2 $3 $4 $5"]], "0"], SG: ["65", "0[0-3]\\d", "(?:(?:1\\d|8)\\d\\d|7000)\\d{7}|[3689]\\d{7}", [8, 10, 11], [["(\\d{4})(\\d{4})", "$1 $2", ["[369]|8(?:0[1-9]|[1-9])"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]], ["(\\d{4})(\\d{4})(\\d{3})", "$1 $2 $3", ["7"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]]]], SH: ["290", "00", "(?:[256]\\d|8)\\d{3}", [4, 5], 0, 0, 0, 0, 0, 0, "[256]"], SI: ["386", "00|10(?:22|66|88|99)", "[1-7]\\d{7}|8\\d{4,7}|90\\d{4,6}", [5, 6, 7, 8], [["(\\d{2})(\\d{3,6})", "$1 $2", ["8[09]|9"], "0$1"], ["(\\d{3})(\\d{5})", "$1 $2", ["59|8"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[37][01]|4[0139]|51|6"], "0$1"], ["(\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[1-57]"], "(0$1)"]], "0", 0, 0, 0, 0, 0, 0, "00"], SJ: ["47", "00", "0\\d{4}|(?:[489]\\d|79)\\d{6}", [5, 8], 0, 0, 0, 0, 0, 0, "79"], SK: ["421", "00", "[2-689]\\d{8}|[2-59]\\d{6}|[2-5]\\d{5}", [6, 7, 9], [["(\\d)(\\d{2})(\\d{3,4})", "$1 $2 $3", ["21"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["[3-5][1-8]1", "[3-5][1-8]1[67]"], "0$1"], ["(\\d)(\\d{3})(\\d{3})(\\d{2})", "$1/$2 $3 $4", ["2"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[689]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1/$2 $3 $4", ["[3-5]"], "0$1"]], "0"], SL: ["232", "00", "(?:[237-9]\\d|66)\\d{6}", [8], [["(\\d{2})(\\d{6})", "$1 $2", ["[236-9]"], "(0$1)"]], "0"], SM: ["378", "00", "(?:0549|[5-7]\\d)\\d{6}", [8, 10], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-7]"]], ["(\\d{4})(\\d{6})", "$1 $2", ["0"]]], 0, 0, "([89]\\d{5})$", "0549$1"], SN: ["221", "00", "(?:[378]\\d|93)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[379]"]]]], SO: ["252", "00", "[346-9]\\d{8}|[12679]\\d{7}|[1-5]\\d{6}|[1348]\\d{5}", [6, 7, 8, 9], [["(\\d{2})(\\d{4})", "$1 $2", ["8[125]"]], ["(\\d{6})", "$1", ["[134]"]], ["(\\d)(\\d{6})", "$1 $2", ["[15]|2[0-79]|3[0-46-8]|4[0-7]"]], ["(\\d)(\\d{7})", "$1 $2", ["(?:2|90)4|[67]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[348]|64|79|90"]], ["(\\d{2})(\\d{5,7})", "$1 $2", ["1|28|6[0-35-9]|77|9[2-9]"]]], "0"], SR: ["597", "00", "(?:[2-5]|68|[78]\\d)\\d{5}", [6, 7], [["(\\d{2})(\\d{2})(\\d{2})", "$1-$2-$3", ["56"]], ["(\\d{3})(\\d{3})", "$1-$2", ["[2-5]"]], ["(\\d{3})(\\d{4})", "$1-$2", ["[6-8]"]]]], SS: ["211", "00", "[19]\\d{8}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[19]"], "0$1"]], "0"], ST: ["239", "00", "(?:22|9\\d)\\d{5}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[29]"]]]], SV: ["503", "00", "[267]\\d{7}|(?:80\\d|900)\\d{4}(?:\\d{4})?", [7, 8, 11], [["(\\d{3})(\\d{4})", "$1 $2", ["[89]"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[267]"]], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["[89]"]]]], SX: ["1", "011", "7215\\d{6}|(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "(5\\d{6})$|1", "721$1", 0, "721"], SY: ["963", "00", "[1-39]\\d{8}|[1-5]\\d{7}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-5]"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1", 1]], "0"], SZ: ["268", "00", "0800\\d{4}|(?:[237]\\d|900)\\d{6}", [8, 9], [["(\\d{4})(\\d{4})", "$1 $2", ["[0237]"]], ["(\\d{5})(\\d{4})", "$1 $2", ["9"]]]], TA: ["290", "00", "8\\d{3}", [4], 0, 0, 0, 0, 0, 0, "8"], TC: ["1", "011", "(?:[58]\\d\\d|649|900)\\d{7}", [10], 0, "1", 0, "([2-479]\\d{6})$|1", "649$1", 0, "649"], TD: ["235", "00|16", "(?:22|[689]\\d|77)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[26-9]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], TG: ["228", "00", "[279]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[279]"]]]], TH: ["66", "00[1-9]", "(?:001800|[2-57]|[689]\\d)\\d{7}|1\\d{7,9}", [8, 9, 10, 13], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[13-9]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]]], "0"], TJ: ["992", "810", "[0-57-9]\\d{8}", [9], [["(\\d{6})(\\d)(\\d{2})", "$1 $2 $3", ["331", "3317"]], ["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["44[02-479]|[34]7"]], ["(\\d{4})(\\d)(\\d{4})", "$1 $2 $3", ["3(?:[1245]|3[12])"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[0-57-9]"]]], 0, 0, 0, 0, 0, 0, 0, "8~10"], TK: ["690", "00", "[2-47]\\d{3,6}", [4, 5, 6, 7]], TL: ["670", "00", "7\\d{7}|(?:[2-47]\\d|[89]0)\\d{5}", [7, 8], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-489]|70"]], ["(\\d{4})(\\d{4})", "$1 $2", ["7"]]]], TM: ["993", "810", "(?:[1-6]\\d|71)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["12"], "(8 $1)"], ["(\\d{3})(\\d)(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[1-5]"], "(8 $1)"], ["(\\d{2})(\\d{6})", "$1 $2", ["[67]"], "8 $1"]], "8", 0, 0, 0, 0, 0, 0, "8~10"], TN: ["216", "00", "[2-57-9]\\d{7}", [8], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-57-9]"]]]], TO: ["676", "00", "(?:0800|(?:[5-8]\\d\\d|999)\\d)\\d{3}|[2-8]\\d{4}", [5, 7], [["(\\d{2})(\\d{3})", "$1-$2", ["[2-4]|50|6[09]|7[0-24-69]|8[05]"]], ["(\\d{4})(\\d{3})", "$1 $2", ["0"]], ["(\\d{3})(\\d{4})", "$1 $2", ["[5-9]"]]]], TR: ["90", "00", "4\\d{6}|8\\d{11,12}|(?:[2-58]\\d\\d|900)\\d{7}", [7, 10, 12, 13], [["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["512|8[01589]|90"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["5(?:[0-59]|61)", "5(?:[0-59]|61[06])", "5(?:[0-59]|61[06]1)"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[24][1-8]|3[1-9]"], "(0$1)", 1], ["(\\d{3})(\\d{3})(\\d{6,7})", "$1 $2 $3", ["80"], "0$1", 1]], "0"], TT: ["1", "011", "(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-46-8]\\d{6})$|1", "868$1", 0, "868"], TV: ["688", "00", "(?:2|7\\d\\d|90)\\d{4}", [5, 6, 7], [["(\\d{2})(\\d{3})", "$1 $2", ["2"]], ["(\\d{2})(\\d{4})", "$1 $2", ["90"]], ["(\\d{2})(\\d{5})", "$1 $2", ["7"]]]], TW: ["886", "0(?:0[25-79]|19)", "[2-689]\\d{8}|7\\d{9,10}|[2-8]\\d{7}|2\\d{6}", [7, 8, 9, 10, 11], [["(\\d{2})(\\d)(\\d{4})", "$1 $2 $3", ["202"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[258]0"], "0$1"], ["(\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["[23568]|4(?:0[02-48]|[1-47-9])|7[1-9]", "[23568]|4(?:0[2-48]|[1-47-9])|(?:400|7)[1-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[49]"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["7"], "0$1"]], "0", 0, 0, 0, 0, 0, 0, 0, "#"], TZ: ["255", "00[056]", "(?:[25-8]\\d|41|90)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[24]"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["5"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[67]"], "0$1"]], "0"], UA: ["380", "00", "[89]\\d{9}|[3-9]\\d{8}", [9, 10], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6[12][29]|(?:3[1-8]|4[136-8]|5[12457]|6[49])2|(?:56|65)[24]", "6[12][29]|(?:35|4[1378]|5[12457]|6[49])2|(?:56|65)[24]|(?:3[1-46-8]|46)2[013-9]"], "0$1"], ["(\\d{4})(\\d{5})", "$1 $2", ["3[1-8]|4(?:[1367]|[45][6-9]|8[4-6])|5(?:[1-5]|6[0135689]|7[4-6])|6(?:[12][3-7]|[459])", "3[1-8]|4(?:[1367]|[45][6-9]|8[4-6])|5(?:[1-5]|6(?:[015689]|3[02389])|7[4-6])|6(?:[12][3-7]|[459])"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[3-7]|89|9[1-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[89]"], "0$1"]], "0", 0, 0, 0, 0, 0, 0, "0~0"], UG: ["256", "00[057]", "800\\d{6}|(?:[29]0|[347]\\d)\\d{7}", [9], [["(\\d{4})(\\d{5})", "$1 $2", ["202", "2024"], "0$1"], ["(\\d{3})(\\d{6})", "$1 $2", ["[27-9]|4(?:6[45]|[7-9])"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["[34]"], "0$1"]], "0"], US: ["1", "011", "[2-9]\\d{9}|3\\d{6}", [10], [["(\\d{3})(\\d{4})", "$1-$2", ["310"], 0, 1], ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", ["[2-9]"], 0, 1, "$1-$2-$3"]], "1", 0, 0, 0, 0, 0, [["(?:3052(?:0[0-8]|[1-9]\\d)|5056(?:[0-35-9]\\d|4[468])|7302[0-4]\\d)\\d{4}|(?:305[3-9]|472[24]|505[2-57-9]|7306|983[2-47-9])\\d{6}|(?:2(?:0[1-35-9]|1[02-9]|2[03-57-9]|3[1459]|4[08]|5[1-46]|6[0279]|7[0269]|8[13])|3(?:0[1-47-9]|1[02-9]|2[013569]|3[0-24679]|4[167]|5[0-2]|6[01349]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[023578]|58|6[349]|7[0589]|8[04])|5(?:0[1-47-9]|1[0235-8]|20|3[0149]|4[01]|5[179]|6[1-47]|7[0-5]|8[0256])|6(?:0[1-35-9]|1[024-9]|2[03689]|3[016]|4[0156]|5[01679]|6[0-279]|78|8[0-29])|7(?:0[1-46-8]|1[2-9]|2[04-8]|3[1247]|4[037]|5[47]|6[02359]|7[0-59]|8[156])|8(?:0[1-68]|1[02-8]|2[068]|3[0-2589]|4[03578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[0146-8]|4[01357-9]|5[12469]|7[0-389]|8[04-69]))[2-9]\\d{6}"], [""], ["8(?:00|33|44|55|66|77|88)[2-9]\\d{6}"], ["900[2-9]\\d{6}"], ["52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[125-9]|33|44|66|77|88)[2-9]\\d{6}"], 0, 0, 0, ["305209\\d{4}"]]], UY: ["598", "0(?:0|1[3-9]\\d)", "0004\\d{2,9}|[1249]\\d{7}|(?:[49]\\d|80)\\d{5}", [6, 7, 8, 9, 10, 11, 12, 13], [["(\\d{3})(\\d{3,4})", "$1 $2", ["0"]], ["(\\d{3})(\\d{4})", "$1 $2", ["[49]0|8"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1"], ["(\\d{4})(\\d{4})", "$1 $2", ["[124]"]], ["(\\d{3})(\\d{3})(\\d{2,4})", "$1 $2 $3", ["0"]], ["(\\d{3})(\\d{3})(\\d{3})(\\d{2,4})", "$1 $2 $3 $4", ["0"]]], "0", 0, 0, 0, 0, 0, 0, "00", " int. "], UZ: ["998", "00", "(?:20|33|[5-79]\\d|88)\\d{7}", [9], [["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[235-9]"]]]], VA: ["39", "00", "0\\d{5,10}|3[0-8]\\d{7,10}|55\\d{8}|8\\d{5}(?:\\d{2,4})?|(?:1\\d|39)\\d{7,8}", [6, 7, 8, 9, 10, 11], 0, 0, 0, 0, 0, 0, "06698"], VC: ["1", "011", "(?:[58]\\d\\d|784|900)\\d{7}", [10], 0, "1", 0, "([2-7]\\d{6})$|1", "784$1", 0, "784"], VE: ["58", "00", "[68]00\\d{7}|(?:[24]\\d|[59]0)\\d{8}", [10], [["(\\d{3})(\\d{7})", "$1-$2", ["[24-689]"], "0$1"]], "0"], VG: ["1", "011", "(?:284|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-578]\\d{6})$|1", "284$1", 0, "284"], VI: ["1", "011", "[58]\\d{9}|(?:34|90)0\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "340$1", 0, "340"], VN: ["84", "00", "[12]\\d{9}|[135-9]\\d{8}|[16]\\d{7}|[16-8]\\d{6}", [7, 8, 9, 10], [["(\\d{2})(\\d{5})", "$1 $2", ["80"], "0$1", 1], ["(\\d{4})(\\d{4,6})", "$1 $2", ["1"], 0, 1], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["6"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[357-9]"], "0$1", 1], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["2[48]"], "0$1", 1], ["(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3", ["2"], "0$1", 1]], "0"], VU: ["678", "00", "[57-9]\\d{6}|(?:[238]\\d|48)\\d{3}", [5, 7], [["(\\d{3})(\\d{4})", "$1 $2", ["[57-9]"]]]], WF: ["681", "00", "(?:40|72)\\d{4}|8\\d{5}(?:\\d{3})?", [6, 9], [["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["[478]"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]]]], WS: ["685", "0", "(?:[2-6]|8\\d{5})\\d{4}|[78]\\d{6}|[68]\\d{5}", [5, 6, 7, 10], [["(\\d{5})", "$1", ["[2-5]|6[1-9]"]], ["(\\d{3})(\\d{3,7})", "$1 $2", ["[68]"]], ["(\\d{2})(\\d{5})", "$1 $2", ["7"]]]], XK: ["383", "00", "2\\d{7,8}|3\\d{7,11}|(?:4\\d\\d|[89]00)\\d{5}", [8, 9, 10, 11, 12], [["(\\d{3})(\\d{5})", "$1 $2", ["[89]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-4]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["2|39"], "0$1"], ["(\\d{2})(\\d{7,10})", "$1 $2", ["3"], "0$1"]], "0"], YE: ["967", "00", "(?:1|7\\d)\\d{7}|[1-7]\\d{6}", [7, 8, 9], [["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-6]|7(?:[24-6]|8[0-7])"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["7"], "0$1"]], "0"], YT: ["262", "00", "(?:80|9\\d)\\d{7}|(?:26|63)9\\d{6}", [9], 0, "0", 0, 0, 0, 0, 0, [["269(?:0[0-467]|15|5[0-4]|6\\d|[78]0)\\d{4}"], ["639(?:0[0-79]|1[019]|[267]\\d|3[09]|40|5[05-9]|9[04-79])\\d{4}"], ["80\\d{7}"], 0, 0, 0, 0, 0, ["9(?:(?:39|47)8[01]|769\\d)\\d{4}"]]], ZA: ["27", "00", "[1-79]\\d{8}|8\\d{4,9}", [5, 6, 7, 8, 9, 10], [["(\\d{2})(\\d{3,4})", "$1 $2", ["8[1-4]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["8[1-4]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["860"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"]], "0"], ZM: ["260", "00", "800\\d{6}|(?:21|63|[79]\\d)\\d{7}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[28]"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["[79]"], "0$1"]], "0"], ZW: ["263", "00", "2(?:[0-57-9]\\d{6,8}|6[0-24-9]\\d{6,7})|[38]\\d{9}|[35-8]\\d{8}|[3-6]\\d{7}|[1-689]\\d{6}|[1-3569]\\d{5}|[1356]\\d{4}", [5, 6, 7, 8, 9, 10], [["(\\d{3})(\\d{3,5})", "$1 $2", ["2(?:0[45]|2[278]|[49]8)|3(?:[09]8|17)|6(?:[29]8|37|75)|[23][78]|(?:33|5[15]|6[68])[78]"], "0$1"], ["(\\d)(\\d{3})(\\d{2,4})", "$1 $2 $3", ["[49]"], "0$1"], ["(\\d{3})(\\d{4})", "$1 $2", ["80"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["24|8[13-59]|(?:2[05-79]|39|5[45]|6[15-8])2", "2(?:02[014]|4|[56]20|[79]2)|392|5(?:42|525)|6(?:[16-8]21|52[013])|8[13-59]"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2(?:1[39]|2[0157]|[378]|[56][14])|3(?:12|29)", "2(?:1[39]|2[0157]|[378]|[56][14])|3(?:123|29)"], "0$1"], ["(\\d{4})(\\d{6})", "$1 $2", ["8"], "0$1"], ["(\\d{2})(\\d{3,5})", "$1 $2", ["1|2(?:0[0-36-9]|12|29|[56])|3(?:1[0-689]|[24-6])|5(?:[0236-9]|1[2-4])|6(?:[013-59]|7[0-46-9])|(?:33|55|6[68])[0-69]|(?:29|3[09]|62)[0-79]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["29[013-9]|39|54"], "0$1"], ["(\\d{4})(\\d{3,5})", "$1 $2", ["(?:25|54)8", "258|5483"], "0$1"]], "0"] }, nonGeographic: { 800: ["800", 0, "(?:00|[1-9]\\d)\\d{6}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["\\d"]]], 0, 0, 0, 0, 0, 0, [0, 0, ["(?:00|[1-9]\\d)\\d{6}"]]], 808: ["808", 0, "[1-9]\\d{7}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[1-9]"]]], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, ["[1-9]\\d{7}"]]], 870: ["870", 0, "7\\d{11}|[35-7]\\d{8}", [9, 12], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[35-7]"]]], 0, 0, 0, 0, 0, 0, [0, ["(?:[356]|774[45])\\d{8}|7[6-8]\\d{7}"]]], 878: ["878", 0, "10\\d{10}", [12], [["(\\d{2})(\\d{5})(\\d{5})", "$1 $2 $3", ["1"]]], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, ["10\\d{10}"]]], 881: ["881", 0, "6\\d{9}|[0-36-9]\\d{8}", [9, 10], [["(\\d)(\\d{3})(\\d{5})", "$1 $2 $3", ["[0-37-9]"]], ["(\\d)(\\d{3})(\\d{5,6})", "$1 $2 $3", ["6"]]], 0, 0, 0, 0, 0, 0, [0, ["6\\d{9}|[0-36-9]\\d{8}"]]], 882: ["882", 0, "[13]\\d{6}(?:\\d{2,5})?|[19]\\d{7}|(?:[25]\\d\\d|4)\\d{7}(?:\\d{2})?", [7, 8, 9, 10, 11, 12], [["(\\d{2})(\\d{5})", "$1 $2", ["16|342"]], ["(\\d{2})(\\d{6})", "$1 $2", ["49"]], ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["1[36]|9"]], ["(\\d{2})(\\d{4})(\\d{3})", "$1 $2 $3", ["3[23]"]], ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["16"]], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["10|23|3(?:[15]|4[57])|4|51"]], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["34"]], ["(\\d{2})(\\d{4,5})(\\d{5})", "$1 $2 $3", ["[1-35]"]]], 0, 0, 0, 0, 0, 0, [0, ["342\\d{4}|(?:337|49)\\d{6}|(?:3(?:2|47|7\\d{3})|50\\d{3})\\d{7}", [7, 8, 9, 10, 12]], 0, 0, 0, 0, 0, 0, ["1(?:3(?:0[0347]|[13][0139]|2[035]|4[013568]|6[0459]|7[06]|8[15-8]|9[0689])\\d{4}|6\\d{5,10})|(?:345\\d|9[89])\\d{6}|(?:10|2(?:3|85\\d)|3(?:[15]|[69]\\d\\d)|4[15-8]|51)\\d{8}"]]], 883: ["883", 0, "(?:[1-4]\\d|51)\\d{6,10}", [8, 9, 10, 11, 12], [["(\\d{3})(\\d{3})(\\d{2,8})", "$1 $2 $3", ["[14]|2[24-689]|3[02-689]|51[24-9]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["510"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["21"]], ["(\\d{4})(\\d{4})(\\d{4})", "$1 $2 $3", ["51[13]"]], ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["[235]"]]], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, ["(?:2(?:00\\d\\d|10)|(?:370[1-9]|51\\d0)\\d)\\d{7}|51(?:00\\d{5}|[24-9]0\\d{4,7})|(?:1[0-79]|2[24-689]|3[02-689]|4[0-4])0\\d{5,9}"]]], 888: ["888", 0, "\\d{11}", [11], [["(\\d{3})(\\d{3})(\\d{5})", "$1 $2 $3"]], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, ["\\d{11}"]]], 979: ["979", 0, "[1359]\\d{8}", [9], [["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["[1359]"]]], 0, 0, 0, 0, 0, 0, [0, 0, 0, ["[1359]\\d{8}"]]] } };
function B1(e, t) {
  var n = Array.prototype.slice.call(t);
  return n.push(N6), e.apply(this, n);
}
function Zl(e, t) {
  e = e.split("-"), t = t.split("-");
  for (var n = e[0].split("."), i = t[0].split("."), r = 0; r < 3; r++) {
    var o = Number(n[r]), a = Number(i[r]);
    if (o > a) return 1;
    if (a > o) return -1;
    if (!isNaN(o) && isNaN(a)) return 1;
    if (isNaN(o) && !isNaN(a)) return -1;
  }
  return e[1] && t[1] ? e[1] > t[1] ? 1 : e[1] < t[1] ? -1 : 0 : !e[1] && t[1] ? 1 : e[1] && !t[1] ? -1 : 0;
}
var T6 = {}.constructor;
function go(e) {
  return e != null && e.constructor === T6;
}
function Po(e) {
  "@babel/helpers - typeof";
  return Po = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Po(e);
}
function Qi(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function z6(e, t) {
  for (var n = 0; n < t.length; n++) {
    var i = t[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
  }
}
function eo(e, t, n) {
  return t && z6(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
var A6 = "1.2.0", D6 = "1.7.35", Fl = " ext. ", C6 = /^\d+$/, G1 = /* @__PURE__ */ (function() {
  function e(t) {
    Qi(this, e), j6(t), this.metadata = t, H1.call(this, t);
  }
  return eo(e, [{
    key: "getCountries",
    value: function() {
      return Object.keys(this.metadata.countries).filter(function(n) {
        return n !== "001";
      });
    }
  }, {
    key: "getCountryMetadata",
    value: function(n) {
      return this.metadata.countries[n];
    }
  }, {
    key: "nonGeographic",
    value: function() {
      if (!(this.v1 || this.v2 || this.v3))
        return this.metadata.nonGeographic || this.metadata.nonGeographical;
    }
  }, {
    key: "hasCountry",
    value: function(n) {
      return this.getCountryMetadata(n) !== void 0;
    }
  }, {
    key: "hasCallingCode",
    value: function(n) {
      if (this.getCountryCodesForCallingCode(n))
        return !0;
      if (this.nonGeographic()) {
        if (this.nonGeographic()[n])
          return !0;
      } else {
        var i = this.countryCallingCodes()[n];
        if (i && i.length === 1 && i[0] === "001")
          return !0;
      }
    }
  }, {
    key: "isNonGeographicCallingCode",
    value: function(n) {
      return this.nonGeographic() ? !!this.nonGeographic()[n] : !this.getCountryCodesForCallingCode(n);
    }
    // Deprecated.
  }, {
    key: "country",
    value: function(n) {
      return this.selectNumberingPlan(n);
    }
  }, {
    key: "selectNumberingPlan",
    value: function(n, i) {
      if (n && C6.test(n) && (i = n, n = null), n && n !== "001") {
        if (!this.hasCountry(n))
          throw new Error("Unknown country: ".concat(n));
        this.numberingPlan = new Bl(this.getCountryMetadata(n), this);
      } else if (i) {
        if (!this.hasCallingCode(i))
          throw new Error("Unknown calling code: ".concat(i));
        this.numberingPlan = new Bl(this.getNumberingPlanMetadata(i), this);
      } else
        this.numberingPlan = void 0;
      return this;
    }
  }, {
    key: "getCountryCodesForCallingCode",
    value: function(n) {
      var i = this.countryCallingCodes()[n];
      if (i)
        return i.length === 1 && i[0].length === 3 ? void 0 : i;
    }
  }, {
    key: "getCountryCodeForCallingCode",
    value: function(n) {
      var i = this.getCountryCodesForCallingCode(n);
      if (i)
        return i[0];
    }
  }, {
    key: "getNumberingPlanMetadata",
    value: function(n) {
      var i = this.getCountryCodeForCallingCode(n);
      if (i)
        return this.getCountryMetadata(i);
      if (this.nonGeographic()) {
        var r = this.nonGeographic()[n];
        if (r)
          return r;
      } else {
        var o = this.countryCallingCodes()[n];
        if (o && o.length === 1 && o[0] === "001")
          return this.metadata.countries["001"];
      }
    }
    // Deprecated.
  }, {
    key: "countryCallingCode",
    value: function() {
      return this.numberingPlan.callingCode();
    }
    // Deprecated.
  }, {
    key: "IDDPrefix",
    value: function() {
      return this.numberingPlan.IDDPrefix();
    }
    // Deprecated.
  }, {
    key: "defaultIDDPrefix",
    value: function() {
      return this.numberingPlan.defaultIDDPrefix();
    }
    // Deprecated.
  }, {
    key: "nationalNumberPattern",
    value: function() {
      return this.numberingPlan.nationalNumberPattern();
    }
    // Deprecated.
  }, {
    key: "possibleLengths",
    value: function() {
      return this.numberingPlan.possibleLengths();
    }
    // Deprecated.
  }, {
    key: "formats",
    value: function() {
      return this.numberingPlan.formats();
    }
    // Deprecated.
  }, {
    key: "nationalPrefixForParsing",
    value: function() {
      return this.numberingPlan.nationalPrefixForParsing();
    }
    // Deprecated.
  }, {
    key: "nationalPrefixTransformRule",
    value: function() {
      return this.numberingPlan.nationalPrefixTransformRule();
    }
    // Deprecated.
  }, {
    key: "leadingDigits",
    value: function() {
      return this.numberingPlan.leadingDigits();
    }
    // Deprecated.
  }, {
    key: "hasTypes",
    value: function() {
      return this.numberingPlan.hasTypes();
    }
    // Deprecated.
  }, {
    key: "type",
    value: function(n) {
      return this.numberingPlan.type(n);
    }
    // Deprecated.
  }, {
    key: "ext",
    value: function() {
      return this.numberingPlan.ext();
    }
  }, {
    key: "countryCallingCodes",
    value: function() {
      return this.v1 ? this.metadata.country_phone_code_to_countries : this.metadata.country_calling_codes;
    }
    // Deprecated.
  }, {
    key: "chooseCountryByCountryCallingCode",
    value: function(n) {
      return this.selectNumberingPlan(n);
    }
  }, {
    key: "hasSelectedNumberingPlan",
    value: function() {
      return this.numberingPlan !== void 0;
    }
  }]), e;
})(), Bl = /* @__PURE__ */ (function() {
  function e(t, n) {
    Qi(this, e), this.globalMetadataObject = n, this.metadata = t, H1.call(this, n.metadata);
  }
  return eo(e, [{
    key: "callingCode",
    value: function() {
      return this.metadata[0];
    }
    // Formatting information for regions which share
    // a country calling code is contained by only one region
    // for performance reasons. For example, for NANPA region
    // ("North American Numbering Plan Administration",
    //  which includes USA, Canada, Cayman Islands, Bahamas, etc)
    // it will be contained in the metadata for `US`.
  }, {
    key: "getDefaultCountryMetadataForRegion",
    value: function() {
      return this.globalMetadataObject.getNumberingPlanMetadata(this.callingCode());
    }
    // Is always present.
  }, {
    key: "IDDPrefix",
    value: function() {
      if (!(this.v1 || this.v2))
        return this.metadata[1];
    }
    // Is only present when a country supports multiple IDD prefixes.
  }, {
    key: "defaultIDDPrefix",
    value: function() {
      if (!(this.v1 || this.v2))
        return this.metadata[12];
    }
  }, {
    key: "nationalNumberPattern",
    value: function() {
      return this.v1 || this.v2 ? this.metadata[1] : this.metadata[2];
    }
    // "possible length" data is always present in Google's metadata.
  }, {
    key: "possibleLengths",
    value: function() {
      if (!this.v1)
        return this.metadata[this.v2 ? 2 : 3];
    }
  }, {
    key: "_getFormats",
    value: function(n) {
      return n[this.v1 ? 2 : this.v2 ? 3 : 4];
    }
    // For countries of the same region (e.g. NANPA)
    // formats are all stored in the "main" country for that region.
    // E.g. "RU" and "KZ", "US" and "CA".
  }, {
    key: "formats",
    value: function() {
      var n = this, i = this._getFormats(this.metadata) || this._getFormats(this.getDefaultCountryMetadataForRegion()) || [];
      return i.map(function(r) {
        return new U6(r, n);
      });
    }
  }, {
    key: "nationalPrefix",
    value: function() {
      return this.metadata[this.v1 ? 3 : this.v2 ? 4 : 5];
    }
  }, {
    key: "_getNationalPrefixFormattingRule",
    value: function(n) {
      return n[this.v1 ? 4 : this.v2 ? 5 : 6];
    }
    // For countries of the same region (e.g. NANPA)
    // national prefix formatting rule is stored in the "main" country for that region.
    // E.g. "RU" and "KZ", "US" and "CA".
  }, {
    key: "nationalPrefixFormattingRule",
    value: function() {
      return this._getNationalPrefixFormattingRule(this.metadata) || this._getNationalPrefixFormattingRule(this.getDefaultCountryMetadataForRegion());
    }
  }, {
    key: "_nationalPrefixForParsing",
    value: function() {
      return this.metadata[this.v1 ? 5 : this.v2 ? 6 : 7];
    }
  }, {
    key: "nationalPrefixForParsing",
    value: function() {
      return this._nationalPrefixForParsing() || this.nationalPrefix();
    }
  }, {
    key: "nationalPrefixTransformRule",
    value: function() {
      return this.metadata[this.v1 ? 6 : this.v2 ? 7 : 8];
    }
  }, {
    key: "_getNationalPrefixIsOptionalWhenFormatting",
    value: function() {
      return !!this.metadata[this.v1 ? 7 : this.v2 ? 8 : 9];
    }
    // For countries of the same region (e.g. NANPA)
    // "national prefix is optional when formatting" flag is
    // stored in the "main" country for that region.
    // E.g. "RU" and "KZ", "US" and "CA".
  }, {
    key: "nationalPrefixIsOptionalWhenFormattingInNationalFormat",
    value: function() {
      return this._getNationalPrefixIsOptionalWhenFormatting(this.metadata) || this._getNationalPrefixIsOptionalWhenFormatting(this.getDefaultCountryMetadataForRegion());
    }
  }, {
    key: "leadingDigits",
    value: function() {
      return this.metadata[this.v1 ? 8 : this.v2 ? 9 : 10];
    }
  }, {
    key: "types",
    value: function() {
      return this.metadata[this.v1 ? 9 : this.v2 ? 10 : 11];
    }
  }, {
    key: "hasTypes",
    value: function() {
      return this.types() && this.types().length === 0 ? !1 : !!this.types();
    }
  }, {
    key: "type",
    value: function(n) {
      if (this.hasTypes() && Gl(this.types(), n))
        return new L6(Gl(this.types(), n), this);
    }
  }, {
    key: "ext",
    value: function() {
      return this.v1 || this.v2 ? Fl : this.metadata[13] || Fl;
    }
  }]), e;
})(), U6 = /* @__PURE__ */ (function() {
  function e(t, n) {
    Qi(this, e), this._format = t, this.metadata = n;
  }
  return eo(e, [{
    key: "pattern",
    value: function() {
      return this._format[0];
    }
  }, {
    key: "format",
    value: function() {
      return this._format[1];
    }
  }, {
    key: "leadingDigitsPatterns",
    value: function() {
      return this._format[2] || [];
    }
  }, {
    key: "nationalPrefixFormattingRule",
    value: function() {
      return this._format[3] || this.metadata.nationalPrefixFormattingRule();
    }
  }, {
    key: "nationalPrefixIsOptionalWhenFormattingInNationalFormat",
    value: function() {
      return !!this._format[4] || this.metadata.nationalPrefixIsOptionalWhenFormattingInNationalFormat();
    }
  }, {
    key: "nationalPrefixIsMandatoryWhenFormattingInNationalFormat",
    value: function() {
      return this.usesNationalPrefix() && !this.nationalPrefixIsOptionalWhenFormattingInNationalFormat();
    }
    // Checks whether national prefix formatting rule contains national prefix.
  }, {
    key: "usesNationalPrefix",
    value: function() {
      return !!(this.nationalPrefixFormattingRule() && // Check that national prefix formatting rule is not a "dummy" one.
      !R6.test(this.nationalPrefixFormattingRule()));
    }
  }, {
    key: "internationalFormat",
    value: function() {
      return this._format[5] || this.format();
    }
  }]), e;
})(), R6 = /^\(?\$1\)?$/, L6 = /* @__PURE__ */ (function() {
  function e(t, n) {
    Qi(this, e), this.type = t, this.metadata = n;
  }
  return eo(e, [{
    key: "pattern",
    value: function() {
      return this.metadata.v1 ? this.type : this.type[0];
    }
  }, {
    key: "possibleLengths",
    value: function() {
      if (!this.metadata.v1)
        return this.type[1] || this.metadata.possibleLengths();
    }
  }]), e;
})();
function Gl(e, t) {
  switch (t) {
    case "FIXED_LINE":
      return e[0];
    case "MOBILE":
      return e[1];
    case "TOLL_FREE":
      return e[2];
    case "PREMIUM_RATE":
      return e[3];
    case "PERSONAL_NUMBER":
      return e[4];
    case "VOICEMAIL":
      return e[5];
    case "UAN":
      return e[6];
    case "PAGER":
      return e[7];
    case "VOIP":
      return e[8];
    case "SHARED_COST":
      return e[9];
  }
}
function j6(e) {
  if (!e)
    throw new Error("[libphonenumber-js] `metadata` argument not passed. Check your arguments.");
  if (!go(e) || !go(e.countries))
    throw new Error("[libphonenumber-js] `metadata` argument was passed but it's not a valid metadata. Must be an object having `.countries` child object property. Got ".concat(go(e) ? "an object of shape: { " + Object.keys(e).join(", ") + " }" : "a " + M6(e) + ": " + e, "."));
}
var M6 = function(t) {
  return Po(t);
};
function Z6(e, t) {
  if (t = new G1(t), t.hasCountry(e))
    return t.country(e).countryCallingCode();
  throw new Error("Unknown country: ".concat(e));
}
function H1(e) {
  var t = e.version;
  typeof t == "number" ? (this.v1 = t === 1, this.v2 = t === 2, this.v3 = t === 3, this.v4 = t === 4) : t ? Zl(t, A6) === -1 ? this.v2 = !0 : Zl(t, D6) === -1 ? this.v3 = !0 : this.v4 = !0 : this.v1 = !0;
}
function F6(e) {
  return new G1(e).getCountries();
}
function J1() {
  return B1(F6, arguments);
}
function B6() {
  return B1(Z6, arguments);
}
Y.TEXT, Y.FULL_NAME, Y.EMAILS, Y.ADDRESS, Y.LINKS, Y.PHONES, Y.RICH_TEXT, Y.UUID;
Object.keys(P6).reduce((e, t) => {
  const n = t.split("-")[0].toLowerCase();
  return (!e[n] || t === Ao) && (e[n] = t), e;
}, {});
const G6 = /* @__PURE__ */ new Set([
  "__proto__",
  "constructor",
  "prototype"
]), V1 = (e, t) => {
  if (!He.isString(t))
    return;
  const n = t.split(".");
  let i = e;
  for (const r of n) {
    if (!Me(i) || !He.isObject(i) || G6.has(r) || !Object.prototype.hasOwnProperty.call(i, r))
      return;
    i = i[r];
  }
  return i;
}, Lt = (e, t) => (n, i) => He.isNonEmptyArray(n) ? n[e](
  (r) => t(V1(r, i))
) : !1, dr = (e, t) => (n, i, r) => He.isNonEmptyArray(n) ? n[e](
  (o) => t(V1(o, i), r)
) : !1, he = new Dt();
he.functions.isDefined = (e) => Me(e);
he.functions.isNonEmptyString = (e) => He.isNonEmptyString(e);
he.functions.includes = (e, t) => Array.isArray(e) && e.includes(t);
he.functions.arrayLength = (e) => Array.isArray(e) ? e.length : 0;
he.functions.every = Lt(
  "every",
  Boolean
);
he.functions.everyDefined = Lt(
  "every",
  Me
);
he.functions.some = Lt(
  "some",
  Boolean
);
he.functions.someDefined = Lt(
  "some",
  Me
);
he.functions.someNonEmptyString = Lt("some", He.isNonEmptyString);
he.functions.none = Lt(
  "every",
  (e) => !e
);
he.functions.noneDefined = Lt(
  "every",
  (e) => !Me(e)
);
he.functions.everyEquals = dr(
  "every",
  (e, t) => e === t
);
he.functions.someEquals = dr(
  "some",
  (e, t) => e === t
);
he.functions.noneEquals = dr(
  "every",
  (e, t) => e !== t
);
he.functions.includesEvery = dr(
  "every",
  (e, t) => Array.isArray(e) && e.includes(t)
);
he.functions.includesSome = dr(
  "some",
  (e, t) => Array.isArray(e) && e.includes(t)
);
he.functions.includesNone = dr(
  "every",
  (e, t) => Array.isArray(e) && !e.includes(t)
);
Y.NUMBER, Y.NUMERIC, Y.CURRENCY, Y.RATING, Y.POSITION;
Y.TEXT, Y.RICH_TEXT;
Object.entries(
  q$
).map(([e, { label: t }]) => ({
  value: e,
  label: `${t} (${e})`
}));
const Hl = [
  P.IS_EMPTY,
  P.IS_NOT_EMPTY
];
[
  P.IS,
  P.IS_NOT,
  ...Hl
], [
  P.GREATER_THAN_OR_EQUAL,
  P.LESS_THAN_OR_EQUAL,
  P.IS,
  P.IS_NOT,
  ...Hl
];
const ce = [
  P.IS_EMPTY,
  P.IS_NOT_EMPTY
];
P.IS, P.IS_NOT;
[
  P.CONTAINS,
  P.DOES_NOT_CONTAIN,
  ...ce
], [
  P.CONTAINS,
  P.DOES_NOT_CONTAIN,
  ...ce
], [
  P.CONTAINS,
  P.DOES_NOT_CONTAIN,
  ...ce
], [
  P.CONTAINS,
  P.DOES_NOT_CONTAIN,
  ...ce
], [
  P.CONTAINS,
  P.DOES_NOT_CONTAIN,
  ...ce
], [
  P.CONTAINS,
  P.DOES_NOT_CONTAIN,
  ...ce
], [
  P.GREATER_THAN_OR_EQUAL,
  P.LESS_THAN_OR_EQUAL,
  ...ce
], [
  P.IS,
  P.IS_NOT,
  P.GREATER_THAN_OR_EQUAL,
  P.LESS_THAN_OR_EQUAL,
  ...ce
], [
  P.CONTAINS,
  P.DOES_NOT_CONTAIN,
  ...ce
], [
  P.CONTAINS,
  P.DOES_NOT_CONTAIN,
  ...ce
], [
  P.IS,
  P.IS_RELATIVE,
  P.IS_IN_PAST,
  P.IS_IN_FUTURE,
  P.IS_TODAY,
  P.IS_BEFORE,
  P.IS_AFTER,
  ...ce
], [
  P.IS,
  P.IS_RELATIVE,
  P.IS_IN_PAST,
  P.IS_IN_FUTURE,
  P.IS_TODAY,
  P.IS_BEFORE,
  P.IS_AFTER,
  ...ce
], [
  P.IS,
  P.IS_NOT,
  P.GREATER_THAN_OR_EQUAL,
  P.LESS_THAN_OR_EQUAL,
  ...ce
], [
  P.CONTAINS,
  P.DOES_NOT_CONTAIN,
  ...ce
], [P.IS, P.IS_NOT, ...ce], [
  P.CONTAINS,
  P.DOES_NOT_CONTAIN,
  ...ce
], [
  P.CONTAINS,
  P.DOES_NOT_CONTAIN,
  ...ce
], P.IS, P.VECTOR_SEARCH, [P.IS, P.IS_NOT, ...ce];
P.IS, P.IS_NOT, P.IS_EMPTY, P.IS_NOT_EMPTY;
Je().transform((e) => e === "" ? [] : No(e) ? [e] : JSON.parse(e)).refine(
  (e) => Array.isArray(e) && e.every((t) => typeof t == "string"),
  {
    error: "Expected an array of strings"
  }
);
Zs(
  (e) => {
    try {
      if (typeof e == "string") {
        if (No(e))
          return [e];
        try {
          const t = JSON.parse(e);
          return Array.isArray(t) ? t : [t];
        } catch {
          return [e];
        }
      }
      return Array.isArray(e) ? e : [e];
    } catch {
      return [];
    }
  },
  Rt(
    Je().refine((e) => x6(e) || No(e), "Must be a valid UUID or a variable with {{ }} syntax")
  )
).catch([]);
const H6 = as({
  isCurrentWorkspaceMemberSelected: Ir().optional(),
  isCurrentRecordSelected: Ir().optional(),
  selectedRecordIds: Rt(Je())
});
Je().transform((e, t) => {
  try {
    return JSON.parse(e);
  } catch (n) {
    return t.addIssue({
      code: "custom",
      message: n.message
    }), Vt;
  }
}).pipe(H6);
const J6 = Ge.enum([
  An.MONDAY,
  An.SATURDAY,
  An.SUNDAY
]), V6 = Ge.union([Ge.coerce.number().int().positive(), Ge.literal("undefined")]).transform((e) => e === "undefined" ? void 0 : e), q6 = Ge.enum([
  "NEXT",
  "THIS",
  "PAST"
]), W6 = Ge.enum([
  "SECOND",
  "MINUTE",
  "HOUR",
  "DAY",
  "WEEK",
  "MONTH",
  "QUARTER",
  "YEAR"
]), K6 = Ge.object({
  direction: q6,
  amount: V6.nullish(),
  unit: W6,
  timezone: Ge.string().nullish(),
  firstDayOfTheWeek: J6.nullish()
}).refine((e) => !(e.amount === void 0 && e.direction !== "THIS"), {
  error: "Amount cannot be 'undefined' unless direction is 'THIS'"
}), Y6 = /((?:THIS)|(?:PAST)|(?:NEXT))_(\d*)_(DAY|MONTH|YEAR|WEEK|QUARTER|HOUR|MINUTE|SECOND)(?:(?:;;([^;;]*);;)?(?:(MONDAY|SUNDAY|SATURDAY);;)?)?/;
Ge.string().transform((e, t) => {
  const n = new RegExp(
    Y6
  ).exec(e);
  if (!He.isNonEmptyArray(n))
    return t.addIssue(
      `Cannot parse stringified inline relative date filter, value : "${e}"`
    ), Ge.NEVER;
  const [i, r, o, a, s, d] = n;
  return K6.parse({
    direction: r,
    amount: o,
    unit: a,
    timezone: s,
    firstDayOfTheWeek: d
  });
});
me.Is + "", P.IS, me.IsNotNull + "", P.IS_NOT_NULL, me.IsNot + "", P.IS_NOT, me.LessThanOrEqual + "", P.LESS_THAN_OR_EQUAL, me.GreaterThanOrEqual + "", P.GREATER_THAN_OR_EQUAL, me.IsBefore + "", P.IS_BEFORE, me.IsAfter + "", P.IS_AFTER, me.Contains + "", P.CONTAINS, me.DoesNotContain + "", P.DOES_NOT_CONTAIN, me.IsEmpty + "", P.IS_EMPTY, me.IsNotEmpty + "", P.IS_NOT_EMPTY, me.IsRelative + "", P.IS_RELATIVE, me.IsInPast + "", P.IS_IN_PAST, me.IsInFuture + "", P.IS_IN_FUTURE, me.IsToday + "", P.IS_TODAY, P.IS + "", P.IS, P.IS_NOT_NULL + "", P.IS_NOT_NULL, P.IS_NOT + "", P.IS_NOT, P.LESS_THAN_OR_EQUAL + "", P.LESS_THAN_OR_EQUAL, P.GREATER_THAN_OR_EQUAL + "", P.GREATER_THAN_OR_EQUAL, P.IS_BEFORE + "", P.IS_BEFORE, P.IS_AFTER + "", P.IS_AFTER, P.CONTAINS + "", P.CONTAINS, P.DOES_NOT_CONTAIN + "", P.DOES_NOT_CONTAIN, P.IS_EMPTY + "", P.IS_EMPTY, P.IS_NOT_EMPTY + "", P.IS_NOT_EMPTY, P.IS_RELATIVE + "", P.IS_RELATIVE, P.IS_IN_PAST + "", P.IS_IN_PAST, P.IS_IN_FUTURE + "", P.IS_IN_FUTURE, P.IS_TODAY + "", P.IS_TODAY, P.VECTOR_SEARCH + "", P.VECTOR_SEARCH;
const q1 = ({
  imageUrl: e,
  baseUrl: t
}) => e.startsWith("https:") || e.startsWith("http:") ? e : e.startsWith("/") ? new URL(`/files${e}`, t).toString() : new URL(`/files/${e}`, t).toString(), Fe = {
  BOLD: "bold",
  ITALIC: "italic",
  UNDERLINE: "underline",
  STRIKE: "strike",
  LINK: "link"
}, Xe = {
  PARAGRAPH: "paragraph",
  TEXT: "text",
  HEADING: "heading",
  VARIABLE_TAG: "variableTag",
  IMAGE: "image",
  BULLET_LIST: "bulletList",
  ORDERED_LIST: "orderedList",
  LIST_ITEM: "listItem",
  HARD_BREAK: "hardBreak"
}, Jl = [
  Fe.UNDERLINE,
  Fe.BOLD,
  Fe.ITALIC,
  Fe.STRIKE,
  Fe.LINK
], X6 = (e) => {
  const t = e.trim();
  return t.startsWith("http://") || t.startsWith("https://") || t.startsWith("HTTPS://") || t.startsWith("HTTP://") ? t : `https://${t}`;
}, Q6 = (e, t) => {
  const r = /^(((?!-))(xn--|_)?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.){1,10}(xn--)?([a-z0-9][a-z0-9-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$/.test(e), o = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(e), a = e === "localhost" || e === "127.0.0.1";
  return a && !1 || o && !1 ? !1 : r || a || o;
};
Je().transform((e, t) => {
  const n = e.trim(), i = X6(n), r = i.replace("https://", "").replace("http://", "").replace("HTTPS://", "").replace("HTTP://", "");
  if (/^\d+(?:\/[a-zA-Z]*)?$/.test(r))
    return t.addIssue({
      code: "custom",
      message: "domain is not a valid url"
    }), Vt;
  try {
    const o = new URL(i);
    return Q6(o.hostname) ? i : (t.addIssue({
      code: "custom",
      message: "domain is not a valid url"
    }), Vt);
  } catch {
    return t.addIssue({
      code: "custom",
      message: "domain is not a valid url"
    }), Vt;
  }
});
const No = (e) => /^{{[^{}]+}}$/.test(e), Vl = /* @__PURE__ */ new Map();
for (const e of J1()) {
  const t = B6(e), n = Vl.get(t);
  n ? n.push(e) : Vl.set(t, [e]);
}
new Set(J1());
const ey = ({ link: e, workspace: t, sender: n, serverUrl: i, locale: r }) => {
  const o = ft(r), a = t.logo ? q1({
    imageUrl: t.logo,
    baseUrl: i
  }) : null, s = Ac(n.firstName), d = n.email, p = t.name;
  return /* @__PURE__ */ ie(Nt, {
    width: 333,
    locale: r,
    children: [
      /* @__PURE__ */ w(zt, {
        value: o._("Join your team on Twenty")
      }),
      /* @__PURE__ */ ie(pt, {
        children: [
          /* @__PURE__ */ w(de, {
            id: "{senderName} (<0>{senderEmail}</0>) has invited you to join a workspace called <1>{workspaceName}</1>.",
            values: {
              senderName: s,
              senderEmail: d,
              workspaceName: p
            },
            components: {
              0: /* @__PURE__ */ w(kt, {
                href: `mailto:${d}`,
                value: d,
                color: V.font.colors.blue
              }),
              1: /* @__PURE__ */ w("b", {})
            }
          }),
          /* @__PURE__ */ w("br", {})
        ]
      }),
      /* @__PURE__ */ ie(Tc, {
        children: [
          a ? /* @__PURE__ */ w(ri, {
            src: a,
            width: 40,
            height: 40,
            alt: "Workspace logo"
          }) : /* @__PURE__ */ w(je, {}),
          t.name ? /* @__PURE__ */ w(zc, {
            value: t.name
          }) : /* @__PURE__ */ w(je, {}),
          /* @__PURE__ */ w(Tt, {
            href: e,
            value: o._("Accept invite")
          })
        ]
      }),
      /* @__PURE__ */ w(vv, {
        i18n: o
      })
    ]
  });
};
ey.PreviewProps = {
  link: "https://app.twenty.com/invite/123",
  workspace: {
    name: "Acme Inc.",
    logo: "https://fakeimg.pl/200x200/?text=ACME&font=lobster"
  },
  sender: {
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe"
  },
  serverUrl: "https://app.twenty.com",
  locale: "en"
};
const ty = "https://twentyhq.github.io/placeholder-images/workspaces/twenty-logo.png", ry = ({ link: e, domain: t, workspace: n, sender: i, serverUrl: r, locale: o }) => {
  const a = ft(o), s = n.logo ? q1({
    imageUrl: n.logo,
    baseUrl: r
  }) : null, d = Ac(i.firstName), p = i.email;
  return /* @__PURE__ */ ie(Nt, {
    width: 333,
    locale: o,
    children: [
      /* @__PURE__ */ w(zt, {
        value: a._("Validate domain")
      }),
      /* @__PURE__ */ ie(pt, {
        children: [
          /* @__PURE__ */ w(de, {
            id: "{senderName} (<0>{senderEmail}</0>): Please validate this domain to allow users with <1>@{domain}</1> email addresses to join your workspace without requiring an invitation.",
            values: {
              senderName: d,
              senderEmail: p,
              domain: t
            },
            components: {
              0: /* @__PURE__ */ w(kt, {
                href: `mailto:${p}`,
                value: p,
                color: V.font.colors.blue
              }),
              1: /* @__PURE__ */ w("b", {})
            }
          }),
          /* @__PURE__ */ w("br", {})
        ]
      }),
      /* @__PURE__ */ ie(Tc, {
        children: [
          /* @__PURE__ */ w(ri, {
            src: s ?? ty,
            width: 40,
            height: 40,
            alt: n.name ?? "Workspace logo"
          }),
          n.name ? /* @__PURE__ */ w(zc, {
            value: n.name
          }) : /* @__PURE__ */ w(je, {}),
          /* @__PURE__ */ w(Tt, {
            href: e,
            value: a._("Validate domain")
          })
        ]
      }),
      /* @__PURE__ */ w("br", {})
    ]
  });
};
ry.PreviewProps = {
  link: "https://app.twenty.com/validate-domain",
  domain: "example.com",
  workspace: {
    name: "Acme Inc.",
    logo: "https://fakeimg.pl/200x200/?text=ACME&font=lobster"
  },
  sender: {
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe"
  },
  serverUrl: "https://app.twenty.com",
  locale: "en"
};
const ny = ({ daysSinceInactive: e, inactiveDaysBeforeDelete: t, userName: n, workspaceDisplayName: i, locale: r }) => {
  const o = ft(r), a = t - e, s = a > 1 ? "days" : "day", d = a > 0 ? a : 0;
  return /* @__PURE__ */ ie(Nt, {
    width: 333,
    locale: r,
    children: [
      /* @__PURE__ */ w(zt, {
        value: o._("Suspended Workspace")
      }),
      /* @__PURE__ */ ie(pt, {
        children: [
          n?.length > 1 ? /* @__PURE__ */ w(de, {
            id: "Dear {userName},",
            values: {
              userName: n
            }
          }) : /* @__PURE__ */ w(de, {
            id: "Hello,"
          }),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w(de, {
            id: "It appears that your workspace <0>{workspaceDisplayName}</0> has been suspended for {daysSinceInactive} days.",
            values: {
              workspaceDisplayName: i,
              daysSinceInactive: e
            },
            components: {
              0: /* @__PURE__ */ w("b", {})
            }
          }),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w(de, {
            id: "The workspace will be deactivated in {remainingDays} {dayOrDays}, and all its data will be deleted.",
            values: {
              remainingDays: d,
              dayOrDays: s
            }
          }),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w("br", {}),
          /* @__PURE__ */ w(de, {
            id: "If you wish to continue using Twenty, please update your subscription within the next {remainingDays} {dayOrDays}.",
            values: {
              remainingDays: d,
              dayOrDays: s
            }
          })
        ]
      }),
      /* @__PURE__ */ w("br", {}),
      /* @__PURE__ */ w(Tt, {
        href: "https://app.twenty.com/settings/billing",
        value: o._("Update your subscription")
      }),
      /* @__PURE__ */ w("br", {}),
      /* @__PURE__ */ w("br", {})
    ]
  });
};
ny.PreviewProps = {
  daysSinceInactive: 10,
  inactiveDaysBeforeDelete: 14,
  userName: "John Doe",
  workspaceDisplayName: "Acme Inc.",
  locale: "en"
};
const iy = (e) => /* @__PURE__ */ w("ul", {
  style: {
    marginBottom: "16px",
    lineHeight: "1.5"
  },
  children: fr(e)
}), oy = (e) => /* @__PURE__ */ w("br", {}), ql = {
  1: {
    element: "h1",
    fontSize: "32px"
  },
  2: {
    element: "h2",
    fontSize: "24px"
  },
  3: {
    element: "h3",
    fontSize: "16px"
  }
}, ay = (e) => {
  const { level: t } = e?.attrs || {};
  if (!Me(t) || !ql[t])
    return null;
  const n = fr(e), { element: i, fontSize: r } = ql[t];
  return /* @__PURE__ */ w(ti, {
    as: i,
    style: {
      fontSize: r
    },
    children: n
  });
}, sy = (e) => {
  const { src: t, alt: n, align: i = "left", width: r } = e?.attrs || {};
  return Me(t) ? /* @__PURE__ */ w(ni, {
    children: /* @__PURE__ */ w(St, {
      align: i,
      children: /* @__PURE__ */ w("img", {
        src: t,
        alt: n,
        style: {
          width: Me(r) ? r : "auto",
          height: "auto",
          maxWidth: "100%",
          outline: "none",
          border: "none",
          textDecoration: "none",
          display: "block"
        }
      })
    })
  }) : null;
}, uy = (e) => /* @__PURE__ */ w("li", {
  style: {
    marginBottom: "8px",
    lineHeight: "1.5"
  },
  children: fr(e)
}), ly = (e) => /* @__PURE__ */ w("ol", {
  style: {
    marginBottom: "16px",
    lineHeight: "1.5"
  },
  children: fr(e)
}), cy = (e) => {
  const t = fr(e);
  return /* @__PURE__ */ w(Er, {
    style: {
      lineHeight: "1.5",
      margin: "0",
      padding: "0"
    },
    children: t.length === 0 ? /* @__PURE__ */ w(je, {
      children: " "
    }) : t
  });
}, dy = (e, t) => /* @__PURE__ */ w("strong", {
  children: t
}), fy = (e, t) => /* @__PURE__ */ w("em", {
  children: t
}), py = (e, t) => {
  const { href: n, target: i = "_blank", rel: r = "noopener noreferrer" } = e.attrs || {};
  return /* @__PURE__ */ w("a", {
    href: n,
    target: i,
    rel: r,
    style: {
      textDecoration: "underline"
    },
    children: t
  });
}, hy = (e, t) => /* @__PURE__ */ w("span", {
  style: {
    textDecoration: "line-through"
  },
  children: t
}), my = (e, t) => /* @__PURE__ */ w("span", {
  style: {
    textDecoration: "underline"
  },
  children: t
}), gy = {
  [Fe.BOLD]: dy,
  [Fe.ITALIC]: fy,
  [Fe.UNDERLINE]: my,
  [Fe.STRIKE]: hy,
  [Fe.LINK]: py
}, vy = (e) => {
  const t = e?.text || /* @__PURE__ */ w(je, {
    children: " "
  }), n = e?.marks || [];
  return n.sort((i, r) => Jl.indexOf(i.type) - Jl.indexOf(r.type)), n.reduce((i, r) => {
    const o = gy[r.type];
    return o ? o(r, i) : i;
  }, t);
}, $y = (e) => {
  if (Me(e?.marks))
    return vy(e);
  const { text: t } = e;
  return Me(t) ? /* @__PURE__ */ w(je, {
    children: t
  }) : /* @__PURE__ */ w(je, {
    children: " "
  });
}, _y = (e) => {
  const { variable: t } = e?.attrs || {};
  return Me(t) ? /* @__PURE__ */ w(je, {
    children: t
  }) : /* @__PURE__ */ w(je, {
    children: " "
  });
}, yy = {
  [Xe.PARAGRAPH]: cy,
  [Xe.TEXT]: $y,
  [Xe.HEADING]: ay,
  [Xe.VARIABLE_TAG]: _y,
  [Xe.IMAGE]: sy,
  [Xe.BULLET_LIST]: iy,
  [Xe.ORDERED_LIST]: ly,
  [Xe.LIST_ITEM]: uy,
  [Xe.HARD_BREAK]: oy
}, by = (e) => {
  const t = yy[e.type];
  return t ? t(e) : null;
}, fr = (e) => (e.content || []).map((n, i) => {
  const r = by(n);
  return r ? /* @__PURE__ */ w(y2, {
    children: r
  }, i) : null;
}).filter((n) => n !== null), rb = (e) => {
  if (typeof e == "string")
    return e;
  const t = fr(e);
  return /* @__PURE__ */ ie(zo, {
    children: [
      /* @__PURE__ */ w(To, {
        children: /* @__PURE__ */ w("style", {
          dangerouslySetInnerHTML: {
            __html: "blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}"
          }
        })
      }),
      /* @__PURE__ */ w(ec, {
        children: t
      })
    ]
  });
};
export {
  lv as CleanSuspendedWorkspaceEmail,
  cv as PasswordResetLinkEmail,
  dv as PasswordUpdateNotifyEmail,
  ry as SendApprovedAccessDomainValidation,
  fv as SendEmailVerificationLinkEmail,
  ey as SendInviteLinkEmail,
  ny as WarnSuspendedWorkspaceEmail,
  rb as reactMarkupFromJSON
};
