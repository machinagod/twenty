import { createSourceFile as u, ScriptTarget as p, SyntaxKind as t } from "typescript";
import { i as c } from "./isDefined-BAmzg2fZ.mjs";
const o = (n) => {
  switch (n.kind) {
    case t.NumberKeyword:
      return { type: "number" };
    case t.StringKeyword:
      return { type: "string" };
    case t.BooleanKeyword:
      return { type: "boolean" };
    case t.ArrayType:
      return {
        type: "array",
        items: o(n.elementType)
      };
    case t.TypeReference: {
      const i = n, e = i.typeName.kind === t.Identifier ? i.typeName.text : void 0;
      if (e === "Array" || e === "ReadonlyArray") {
        const r = i.typeArguments?.[0];
        return {
          type: "array",
          items: c(r) ? o(r) : {}
        };
      }
      return {};
    }
    case t.ObjectKeyword:
      return { type: "object" };
    case t.TypeLiteral: {
      const i = {};
      return n.members.forEach((e) => {
        if (c(e.name) && c(e.type)) {
          const r = e.name.text;
          i[r] = o(e.type);
        }
      }), { type: "object", properties: i };
    }
    case t.UnionType: {
      const i = n, e = [];
      let r = !0;
      return i.types.forEach((s) => {
        if (s.kind === t.LiteralType) {
          const a = s.literal;
          a.kind === t.StringLiteral ? e.push(a.text) : r = !1;
        } else
          r = !1;
      }), r ? { type: "string", enum: e } : {};
    }
    default:
      return {};
  }
}, l = (n, i) => n.parameters.reduce((r, s) => {
  const a = s.type;
  return c(a) ? [...r, o(a)] : [...r, {}];
}, i), y = (n) => n.kind === t.FunctionDeclaration ? [n] : n.kind === t.VariableStatement ? n.declarationList.declarations.filter(
  (e) => c(e.initializer) && e.initializer.kind === t.ArrowFunction
).map((e) => e.initializer) : [], d = (n) => {
  const i = u(
    "temp.ts",
    n,
    p.ESNext,
    !0
  );
  let e = [];
  return i.forEachChild((r) => {
    (r.kind === t.FunctionDeclaration || r.kind === t.VariableStatement) && y(r).forEach((a) => {
      e = l(a, e);
    });
  }), e;
};
export {
  d as getFunctionInputSchema
};
