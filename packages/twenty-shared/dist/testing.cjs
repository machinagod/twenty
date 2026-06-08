"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const r=e=>{const t=e.filter(n=>n.only===!0);return process.env.CI&&t.length>0?(console.warn(`Should never push tests cases with an only to true, only to use in dev env
 returning the whole test suite anyway`),e):t.length>0?t:e};exports.eachTestingContextFilter=r;
