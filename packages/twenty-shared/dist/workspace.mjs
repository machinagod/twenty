var N = /* @__PURE__ */ ((E) => (E.ONGOING_CREATION = "ONGOING_CREATION", E.PENDING_CREATION = "PENDING_CREATION", E.ACTIVE = "ACTIVE", E.INACTIVE = "INACTIVE", E.SUSPENDED = "SUSPENDED", E))(N || {});
const I = (E) => E?.activationStatus === N.ACTIVE || E?.activationStatus === N.SUSPENDED;
export {
  N as WorkspaceActivationStatus,
  I as isWorkspaceActiveOrSuspended
};
