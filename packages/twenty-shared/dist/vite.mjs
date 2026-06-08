const S = /@linaria/, _ = "import { styled } from '@linaria/react';\nconst StyledDiv = styled.div`color: red;`;\n", $ = (t, i) => {
  const h = i?.devSlowThresholdMs ?? 200, y = i?.topSlowFilesCount ?? 10, g = i?.warmupThresholdMs ?? 500;
  let c = 0, a = 0, w = 0, m = !1, f = `${process.cwd()}/src/__wyw_warmup__.tsx`;
  const d = [], p = t.transform;
  return {
    ...t,
    enforce: "pre",
    configResolved(e) {
      m = e.command === "serve", f = `${e.root}/src/__wyw_warmup__.tsx`, typeof t.configResolved == "function" && t.configResolved.call(this, e);
    },
    async buildStart() {
      console.log("[linaria/wyw] Starting CSS pre-build");
      const e = performance.now();
      try {
        const o = p.call(
          this,
          _,
          f
        );
        o !== null && typeof o == "object" && "then" in o && await o;
      } catch {
      }
      const r = performance.now() - e, n = r > g ? " ⚠️  slow" : "";
      console.log(
        `[linaria/wyw] Pre-warm: ${r.toFixed(0)}ms${n}`
      );
    },
    transform(e, r, ...n) {
      if (!S.test(e))
        return w++, null;
      const o = performance.now(), s = p.call(
        this,
        e,
        r,
        ...n
      ), u = (l) => {
        c += l, a++, d.push({ id: r, ms: l }), m && l > h && console.log(
          `[linaria/wyw] slow: ${r.replace(process.cwd(), "")} ${l.toFixed(0)}ms`
        );
      };
      return s && typeof s == "object" && "then" in s ? s.then((l) => (u(performance.now() - o), l)) : (u(performance.now() - o), s);
    },
    closeBundle: () => {
      const e = a > 0 ? c / a : 0, r = Math.round(10 * e), n = d.filter((o) => o.ms > r);
      console.log(`
[linaria/wyw] ===== CSS PRE-BUILD SUMMARY =====`), console.log(`[linaria/wyw] Files transformed: ${a}`), console.log(`[linaria/wyw] Files skipped (no @linaria): ${w}`), console.log(`[linaria/wyw] Transform time: ${c.toFixed(0)}ms`), console.log(
        `[linaria/wyw] Avg per transformed file: ${e.toFixed(1)}ms`
      ), n.length > 0 && (console.log(
        `[linaria/wyw] Slow files (>10x avg = ${r}ms):`
      ), n.sort((o, s) => s.ms - o.ms).slice(0, y).forEach(
        (o) => console.log(
          `[linaria/wyw]   ${o.ms.toFixed(0)}ms ${o.id.replace(process.cwd(), "")}`
        )
      )), console.log(`[linaria/wyw] ==========================================
`);
    }
  };
};
export {
  $ as createWywProfilingPlugin
};
