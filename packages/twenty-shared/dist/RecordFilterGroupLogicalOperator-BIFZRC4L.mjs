import { v4 as a } from "uuid";
import { F as s } from "./FieldMetadataType-CPAdLk1i.mjs";
var o = /* @__PURE__ */ ((e) => (e.Verify = "/verify", e.VerifyEmail = "/verify-email", e.SignInUp = "/welcome", e.Invite = "/invite/:workspaceInviteHash", e.ResetPassword = "/reset-password/:passwordResetToken", e.CreateWorkspace = "/create/workspace", e.CreateProfile = "/create/profile", e.SyncEmails = "/sync/emails", e.InviteTeam = "/invite-team", e.PlanRequired = "/plan-required", e.PlanRequiredSuccess = "/plan-required/payment-success", e.BookCallDecision = "/book-call-decision", e.BookCall = "/book-call", e.Index = "/", e.TasksPage = "/objects/tasks", e.OpportunitiesPage = "/objects/opportunities", e.RecordIndexPage = "/objects/:objectNamePlural", e.RecordShowPage = "/object/:objectNameSingular/:objectRecordId", e.PageLayoutPage = "/page/:pageLayoutId", e.Settings = "settings", e.SettingsCatchAll = "/settings/*", e.Developers = "developers", e.DevelopersCatchAll = "/developers/*", e.Authorize = "/authorize", e.NotFoundWildcard = "*", e.NotFound = "/not-found", e))(o || {}), n = /* @__PURE__ */ ((e) => (e.EMAIL = "EMAIL", e.CALENDAR = "CALENDAR", e.WORKFLOW = "WORKFLOW", e.AGENT = "AGENT", e.API = "API", e.IMPORT = "IMPORT", e.MANUAL = "MANUAL", e.SYSTEM = "SYSTEM", e.WEBHOOK = "WEBHOOK", e.APPLICATION = "APPLICATION", e))(n || {});
const R = {
  type: s.ACTOR,
  properties: [
    {
      name: "source",
      type: s.SELECT,
      hidden: !1,
      isRequired: !0,
      options: Object.keys(n).map(
        (e, i) => ({
          id: a(),
          // @ts-expect-error legacy noImplicitAny
          label: `${n[e].toLowerCase()}`,
          value: e,
          position: i
        })
      )
    },
    {
      name: "workspaceMemberId",
      type: s.UUID,
      hidden: "input",
      isRequired: !1
    },
    {
      name: "name",
      type: s.TEXT,
      hidden: "input",
      isRequired: !0
    },
    {
      name: "context",
      type: s.RAW_JSON,
      hidden: !1,
      isRequired: !1
    }
  ]
};
var r = /* @__PURE__ */ ((e) => (e.MONDAY = "MONDAY", e.SUNDAY = "SUNDAY", e.SATURDAY = "SATURDAY", e))(r || {}), t = /* @__PURE__ */ ((e) => (e.AND = "AND", e.OR = "OR", e))(t || {});
export {
  o as A,
  n as F,
  t as R,
  r as a,
  R as b
};
