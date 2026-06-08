const r = (e) => {
  const n = e.filter((t) => t.only === !0);
  return process.env.CI && n.length > 0 ? (console.warn(
    `Should never push tests cases with an only to true, only to use in dev env
 returning the whole test suite anyway`
  ), e) : n.length > 0 ? n : e;
};
export {
  r as eachTestingContextFilter
};
