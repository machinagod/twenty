// Non-throwing stub for external modules. NestJS DI / TypeORM may construct
// these as constructors during module instantiation even when the methods
// never actually run in deno-mode (e.g. bullmq's Queue/Worker get `new`'d
// by the BullMQ driver's class body even when MESSAGE_QUEUE_DRIVER_TYPE=pg
// selects the PG driver instead). Throwing in apply/construct breaks the
// DI graph; returning a stub-proxy lets construction succeed and only fails
// if a method is actually called.

const makeStub = () =>
  new Proxy(function () {}, {
    get(_t, prop) {
      if (prop === Symbol.toPrimitive) return () => '<external-stub>';
      if (prop === '__esModule') return true;
      if (prop === 'default') return moduleStub;
      if (prop === 'then') return undefined; // Promise-detection edge case
      return makeStub();
    },
    apply: () => makeStub(),
    construct: () => makeStub(),
  });

const moduleStub = makeStub();
module.exports = moduleStub;
