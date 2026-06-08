import { isNonEmptyString as u, isObject as o } from "@sniptt/guards";
import { i as p } from "./isDefined-BAmzg2fZ.mjs";
const a = {
  type: "object",
  properties: {}
}, i = (e) => {
  const t = { type: "unknown" };
  switch (e.type) {
    case "string":
      t.type = "string";
      break;
    case "number":
    case "integer":
      t.type = "number";
      break;
    case "boolean":
      t.type = "boolean";
      break;
    case "array":
      t.type = "array", e.items && (t.items = i(e.items));
      break;
    case "object":
      t.type = "object", e.properties && (t.properties = Object.fromEntries(
        Object.entries(e.properties).map(([r, n]) => [
          r,
          i(n)
        ])
      ));
      break;
    default:
      t.type = "unknown";
  }
  return Array.isArray(e.enum) && (t.enum = e.enum.filter(
    (r) => typeof r == "string"
  )), e.multiline === !0 && (t.multiline = !0), u(e.label) && (t.label = e.label), t;
}, c = (e) => [i(e)], T = {
  inputSchema: c({
    type: "object",
    properties: {
      a: { type: "string" },
      b: { type: "number" }
    }
  })
}, A = async (e) => {
  const { getFunctionInputSchema: t } = await import("./get-function-input-schema-DTlcRJz3.mjs"), n = t(e)[0];
  return n?.type === "object" && p(n.properties) ? {
    type: "object",
    properties: n.properties
  } : a;
}, b = (e) => !p(e) || e === null ? "unknown" : typeof e == "string" ? "string" : typeof e == "number" ? "number" : typeof e == "boolean" ? "boolean" : Array.isArray(e) ? "array" : "unknown", y = (e) => e ? Object.entries(e).reduce(
  (t, [r, n]) => (o(n) && !Array.isArray(n) ? t[r] = {
    isLeaf: !1,
    type: "object",
    label: r,
    value: y(n)
  } : t[r] = {
    isLeaf: !0,
    value: n,
    type: b(n),
    label: r
  }, t),
  {}
) : {}, f = [
  "string",
  "number",
  "boolean",
  "array",
  "unknown"
], l = (e) => f.includes(e), m = (e, t) => {
  const r = t.label ?? e;
  return t.type === "object" ? {
    isLeaf: !1,
    type: "object",
    label: r,
    value: o(t.properties) ? s(t.properties) : {}
  } : {
    isLeaf: !0,
    type: l(t.type) ? t.type : "unknown",
    label: r,
    value: null
  };
}, s = (e) => Object.entries(e).reduce(
  (t, [r, n]) => (t[r] = m(r, n), t),
  {}
), E = (e) => {
  const t = e[0];
  return t?.type !== "object" || !o(t.properties) ? {} : s(t.properties);
};
export {
  a as DEFAULT_TOOL_INPUT_SCHEMA,
  T as SEED_WORKFLOW_ACTION_TRIGGER_SETTINGS,
  A as getInputSchemaFromSourceCode,
  y as getOutputSchemaFromValue,
  E as inputSchemaToOutputSchema,
  c as jsonSchemaToInputSchema
};
