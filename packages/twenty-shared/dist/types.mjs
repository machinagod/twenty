import { b as T } from "./RecordFilterGroupLogicalOperator-BIFZRC4L.mjs";
import { A as fE, F as UE, a as ME, R as wE } from "./RecordFilterGroupLogicalOperator-BIFZRC4L.mjs";
import { F as I } from "./FieldMetadataType-CPAdLk1i.mjs";
import { z as r } from "zod";
import { O as bE } from "./ObjectRecordGroupByDateGranularity-CRLEKT03.mjs";
import { S as WE } from "./StepFilters-Cml3Z3gd.mjs";
import { registerDecorator as i } from "class-validator";
import { V as VE, a as BE } from "./ViewFilterOperandDeprecated-C9y0ExQo.mjs";
const nE = [
  "addressStreet1",
  "addressStreet2",
  "addressCity",
  "addressState",
  "addressPostcode",
  "addressCountry",
  "addressLat",
  "addressLng"
];
var o = /* @__PURE__ */ ((E) => (E.MIN = "MIN", E.MAX = "MAX", E.AVG = "AVG", E.SUM = "SUM", E.COUNT = "COUNT", E.COUNT_UNIQUE_VALUES = "COUNT_UNIQUE_VALUES", E.COUNT_EMPTY = "COUNT_EMPTY", E.COUNT_NOT_EMPTY = "COUNT_NOT_EMPTY", E.COUNT_TRUE = "COUNT_TRUE", E.COUNT_FALSE = "COUNT_FALSE", E.PERCENTAGE_EMPTY = "PERCENTAGE_EMPTY", E.PERCENTAGE_NOT_EMPTY = "PERCENTAGE_NOT_EMPTY", E))(o || {}), s = /* @__PURE__ */ ((E) => (E.Auth = "/auth", E.Settings = "/settings", E.Root = "/", E))(s || {}), a = /* @__PURE__ */ ((E) => (E.AS_PARTICIPANT_AND_ORGANIZER = "AS_PARTICIPANT_AND_ORGANIZER", E.AS_PARTICIPANT = "AS_PARTICIPANT", E.AS_ORGANIZER = "AS_ORGANIZER", E.NONE = "NONE", E))(a || {}), p = /* @__PURE__ */ ((E) => (E.PENDING_CONFIGURATION = "PENDING_CONFIGURATION", E.CALENDAR_EVENT_LIST_FETCH_PENDING = "CALENDAR_EVENT_LIST_FETCH_PENDING", E.CALENDAR_EVENT_LIST_FETCH_SCHEDULED = "CALENDAR_EVENT_LIST_FETCH_SCHEDULED", E.CALENDAR_EVENT_LIST_FETCH_ONGOING = "CALENDAR_EVENT_LIST_FETCH_ONGOING", E.CALENDAR_EVENTS_IMPORT_PENDING = "CALENDAR_EVENTS_IMPORT_PENDING", E.CALENDAR_EVENTS_IMPORT_SCHEDULED = "CALENDAR_EVENTS_IMPORT_SCHEDULED", E.CALENDAR_EVENTS_IMPORT_ONGOING = "CALENDAR_EVENTS_IMPORT_ONGOING", E.FAILED = "FAILED", E))(p || {}), d = /* @__PURE__ */ ((E) => (E.NOT_SYNCED = "NOT_SYNCED", E.ONGOING = "ONGOING", E.ACTIVE = "ACTIVE", E.FAILED_INSUFFICIENT_PERMISSIONS = "FAILED_INSUFFICIENT_PERMISSIONS", E.FAILED_UNKNOWN = "FAILED_UNKNOWN", E))(d || {}), R = /* @__PURE__ */ ((E) => (E.METADATA = "METADATA", E.SHARE_EVERYTHING = "SHARE_EVERYTHING", E))(R || {}), n = /* @__PURE__ */ ((E) => (E.GLOBAL = "GLOBAL", E.INDEX_PAGE_BULK_SELECTION = "INDEX_PAGE_BULK_SELECTION", E.INDEX_PAGE_SINGLE_RECORD_SELECTION = "INDEX_PAGE_SINGLE_RECORD_SELECTION", E.INDEX_PAGE_NO_SELECTION = "INDEX_PAGE_NO_SELECTION", E.SHOW_PAGE = "SHOW_PAGE", E.PAGE_EDIT_MODE = "PAGE_EDIT_MODE", E))(n || {});
const D = {
  type: I.ADDRESS,
  properties: [
    {
      name: "addressStreet1",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1
    },
    {
      name: "addressStreet2",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1
    },
    {
      name: "addressCity",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1
    },
    {
      name: "addressPostcode",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1
    },
    {
      name: "addressState",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1
    },
    {
      name: "addressCountry",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1
    },
    {
      name: "addressLat",
      type: I.NUMERIC,
      hidden: !1,
      isRequired: !1
    },
    {
      name: "addressLng",
      type: I.NUMERIC,
      hidden: !1,
      isRequired: !1
    }
  ]
}, l = {
  type: I.CURRENCY,
  properties: [
    {
      name: "amountMicros",
      type: I.NUMERIC,
      hidden: !1,
      isRequired: !1
    },
    {
      name: "currencyCode",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1
    }
  ]
}, t = {
  type: I.EMAILS,
  properties: [
    {
      name: "primaryEmail",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1,
      isIncludedInUniqueConstraint: !0
    },
    {
      name: "additionalEmails",
      type: I.RAW_JSON,
      hidden: !1,
      isRequired: !1
    }
  ]
}, O = {
  type: I.FULL_NAME,
  properties: [
    {
      name: "firstName",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1,
      isIncludedInUniqueConstraint: !1
    },
    {
      name: "lastName",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1,
      isIncludedInUniqueConstraint: !1
    }
  ]
}, c = {
  type: I.LINKS,
  properties: [
    {
      name: "primaryLinkLabel",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1
    },
    {
      name: "primaryLinkUrl",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1,
      isIncludedInUniqueConstraint: !0
    },
    {
      name: "secondaryLinks",
      type: I.RAW_JSON,
      hidden: !1,
      isRequired: !1
    }
  ]
}, L = {
  type: I.PHONES,
  properties: [
    {
      name: "primaryPhoneNumber",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1,
      isIncludedInUniqueConstraint: !0
    },
    {
      name: "primaryPhoneCountryCode",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1,
      isIncludedInUniqueConstraint: !0
    },
    {
      name: "primaryPhoneCallingCode",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1,
      isIncludedInUniqueConstraint: !0
    },
    {
      name: "additionalPhones",
      type: I.RAW_JSON,
      hidden: !1,
      isRequired: !1
    }
  ]
}, m = {
  type: I.RICH_TEXT,
  properties: [
    {
      name: "blocknote",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1
    },
    {
      name: "markdown",
      type: I.TEXT,
      hidden: !1,
      isRequired: !1
    }
  ]
}, DE = r.object({
  blocknote: r.string().nullable().optional(),
  markdown: r.string().nullable()
}), lE = /* @__PURE__ */ new Map([
  [I.LINKS, c],
  [I.CURRENCY, l],
  [I.FULL_NAME, O],
  [I.ADDRESS, D],
  [I.ACTOR, T],
  [I.EMAILS, t],
  [I.PHONES, L],
  [I.RICH_TEXT, m]
]);
var u = /* @__PURE__ */ ((E) => (E.GOOGLE = "google", E.MICROSOFT = "microsoft", E.IMAP_SMTP_CALDAV = "imap_smtp_caldav", E.OIDC = "oidc", E.SAML = "saml", E.EMAIL_GROUP = "email_group", E.APP = "app", E))(u || {}), C = /* @__PURE__ */ ((E) => (E.Index = "INDEX_PAGE", E.Record = "RECORD_PAGE", E.Standalone = "STANDALONE_PAGE", E.Settings = "SETTINGS_PAGE", E))(C || {}), G = /* @__PURE__ */ ((E) => (E.Activity = "activity", E.ActivityTarget = "activityTarget", E.ApiKey = "apiKey", E.Attachment = "attachment", E.Blocklist = "blocklist", E.CalendarChannel = "calendarChannel", E.CalendarEvent = "calendarEvent", E.Comment = "comment", E.Company = "company", E.Dashboard = "dashboard", E.TimelineActivity = "timelineActivity", E.Message = "message", E.MessageChannel = "messageChannel", E.MessageParticipant = "messageParticipant", E.MessageFolder = "messageFolder", E.MessageThread = "messageThread", E.Note = "note", E.NoteTarget = "noteTarget", E.Opportunity = "opportunity", E.Person = "person", E.Task = "task", E.TaskTarget = "taskTarget", E.Webhook = "webhook", E.WorkspaceMember = "workspaceMember", E.MessageThreadSubscriber = "messageThreadSubscriber", E.Workflow = "workflow", E.MessageChannelMessageAssociation = "messageChannelMessageAssociation", E.WorkflowVersion = "workflowVersion", E.WorkflowRun = "workflowRun", E))(G || {}), S = /* @__PURE__ */ ((E) => (E.CREATE = "CREATE", E.UPDATE = "UPDATE", E.DELETE = "DELETE", E.RESTORE = "RESTORE", E.DESTROY = "DESTROY", E))(S || {}), f = /* @__PURE__ */ ((E) => (E.WORKSPACE_EVENT = "WORKSPACE_EVENT", E.PAGEVIEW = "PAGEVIEW", E.OBJECT_EVENT = "OBJECT_EVENT", E.USAGE_EVENT = "USAGE_EVENT", E.APPLICATION_LOG = "APPLICATION_LOG", E))(f || {}), U = /* @__PURE__ */ ((E) => (E.IS_UNIQUE_INDEXES_ENABLED = "IS_UNIQUE_INDEXES_ENABLED", E.IS_JSON_FILTER_ENABLED = "IS_JSON_FILTER_ENABLED", E.IS_MARKETPLACE_SETTING_TAB_VISIBLE = "IS_MARKETPLACE_SETTING_TAB_VISIBLE", E.IS_PUBLIC_DOMAIN_ENABLED = "IS_PUBLIC_DOMAIN_ENABLED", E.IS_EMAIL_GROUP_ENABLED = "IS_EMAIL_GROUP_ENABLED", E.IS_JUNCTION_RELATIONS_ENABLED = "IS_JUNCTION_RELATIONS_ENABLED", E.IS_REST_METADATA_API_NEW_FORMAT_DIRECT = "IS_REST_METADATA_API_NEW_FORMAT_DIRECT", E.IS_LOGIC_FUNCTION_PREBUILT_MODE_ENABLED = "IS_LOGIC_FUNCTION_PREBUILT_MODE_ENABLED", E.IS_SETTINGS_DISCOVERY_HERO_ENABLED = "IS_SETTINGS_DISCOVERY_HERO_ENABLED", E.IS_CALL_RECORDING_ENABLED = "IS_CALL_RECORDING_ENABLED", E.IS_WORKFLOW_RUN_STEP_LOGS_ENABLED = "IS_WORKFLOW_RUN_STEP_LOGS_ENABLED", E))(U || {});
const tE = {
  UUID: "uuid",
  NOW: "now"
};
var M = /* @__PURE__ */ ((E) => (E.COPY = "COPY", E.OPEN_LINK = "OPEN_LINK", E.OPEN_IN_APP = "OPEN_IN_APP", E))(M || {});
class w {
}
class OE extends w {
}
var k = /* @__PURE__ */ ((E) => (E.FLOAT = "float", E.INT = "int", E.BIGINT = "bigint", E))(k || {}), b = /* @__PURE__ */ ((E) => (E.RELATIVE = "RELATIVE", E.USER_SETTINGS = "USER_SETTINGS", E.CUSTOM = "CUSTOM", E))(b || {});
const cE = {
  ARCHIVE: "ARCHIVE",
  AUDIO: "AUDIO",
  IMAGE: "IMAGE",
  PRESENTATION: "PRESENTATION",
  SPREADSHEET: "SPREADSHEET",
  TEXT_DOCUMENT: "TEXT_DOCUMENT",
  VIDEO: "VIDEO",
  OTHER: "OTHER"
};
var v = /* @__PURE__ */ ((E) => (E.ProfilePicture = "profile-picture", E.WorkspaceLogo = "workspace-logo", E.Attachment = "attachment", E.PersonPicture = "person-picture", E.CorePicture = "core-picture", E.File = "file", E.AgentChat = "agent-chat", E.BuiltLogicFunction = "built-logic-function", E.BuiltFrontComponent = "built-front-component", E.PublicAsset = "public-asset", E.Source = "source", E.FilesField = "files-field", E.Dependencies = "dependencies", E.Workflow = "workflow", E.EmailAttachment = "email-attachment", E.AppTarball = "app-tarball", E.GeneratedSdkClient = "generated-sdk-client", E))(v || {});
const LE = [
  "TEXT",
  "PHONES",
  "EMAILS",
  "DATE_TIME",
  "DATE",
  "NUMBER",
  "CURRENCY",
  "FULL_NAME",
  "LINKS",
  "RELATION",
  "ADDRESS",
  "SELECT",
  "RATING",
  "MULTI_SELECT",
  "ACTOR",
  "ARRAY",
  "RAW_JSON",
  "FILES",
  "BOOLEAN",
  "UUID"
];
var W = /* @__PURE__ */ ((E) => (E.GET = "GET", E.POST = "POST", E.PUT = "PUT", E.PATCH = "PATCH", E.DELETE = "DELETE", E))(W || {});
const F = "__twentyHttpResponse", V = (E) => typeof E == "number" && Number.isInteger(E) && E >= 100 && E <= 599, B = (E) => typeof E == "object" && E !== null && !Array.isArray(E) && Object.values(E).every((_) => typeof _ == "string"), mE = (E) => {
  if (typeof E != "object" || E === null)
    return !1;
  const _ = E;
  return _[F] === !0 && (_.status === void 0 || V(_.status)) && (_.headers === void 0 || B(_.headers));
};
var H = /* @__PURE__ */ ((E) => (E.SENT_AND_RECEIVED = "SENT_AND_RECEIVED", E.SENT = "SENT", E.NONE = "NONE", E))(H || {}), Y = /* @__PURE__ */ ((E) => (E.GROUP_EMAILS_DELETION = "GROUP_EMAILS_DELETION", E.GROUP_EMAILS_IMPORT = "GROUP_EMAILS_IMPORT", E.NONE = "NONE", E))(Y || {}), y = /* @__PURE__ */ ((E) => (E.PENDING_CONFIGURATION = "PENDING_CONFIGURATION", E.MESSAGE_LIST_FETCH_PENDING = "MESSAGE_LIST_FETCH_PENDING", E.MESSAGE_LIST_FETCH_SCHEDULED = "MESSAGE_LIST_FETCH_SCHEDULED", E.MESSAGE_LIST_FETCH_ONGOING = "MESSAGE_LIST_FETCH_ONGOING", E.MESSAGES_IMPORT_PENDING = "MESSAGES_IMPORT_PENDING", E.MESSAGES_IMPORT_SCHEDULED = "MESSAGES_IMPORT_SCHEDULED", E.MESSAGES_IMPORT_ONGOING = "MESSAGES_IMPORT_ONGOING", E.FAILED = "FAILED", E))(y || {}), X = /* @__PURE__ */ ((E) => (E.NOT_SYNCED = "NOT_SYNCED", E.ONGOING = "ONGOING", E.ACTIVE = "ACTIVE", E.FAILED_INSUFFICIENT_PERMISSIONS = "FAILED_INSUFFICIENT_PERMISSIONS", E.FAILED_UNKNOWN = "FAILED_UNKNOWN", E))(X || {}), q = /* @__PURE__ */ ((E) => (E.EMAIL = "EMAIL", E.SMS = "SMS", E.EMAIL_GROUP = "EMAIL_GROUP", E))(q || {}), K = /* @__PURE__ */ ((E) => (E.METADATA = "METADATA", E.SUBJECT = "SUBJECT", E.SHARE_EVERYTHING = "SHARE_EVERYTHING", E))(K || {}), x = /* @__PURE__ */ ((E) => (E.ALL_FOLDERS = "ALL_FOLDERS", E.SELECTED_FOLDERS = "SELECTED_FOLDERS", E))(x || {}), J = /* @__PURE__ */ ((E) => (E.FOLDER_DELETION = "FOLDER_DELETION", E.NONE = "NONE", E))(J || {}), Q = /* @__PURE__ */ ((E) => (E.FROM = "FROM", E.TO = "TO", E.CC = "CC", E.BCC = "BCC", E))(Q || {}), Z = /* @__PURE__ */ ((E) => (E.VIEW = "VIEW", E.FOLDER = "FOLDER", E.LINK = "LINK", E.OBJECT = "OBJECT", E.RECORD = "RECORD", E.PAGE_LAYOUT = "PAGE_LAYOUT", E))(Z || {}), z = /* @__PURE__ */ ((E) => (E.AscNullsFirst = "AscNullsFirst", E.AscNullsLast = "AscNullsLast", E.DescNullsFirst = "DescNullsFirst", E.DescNullsLast = "DescNullsLast", E))(z || {}), j = /* @__PURE__ */ ((E) => (E.GRID = "GRID", E.VERTICAL_LIST = "VERTICAL_LIST", E.CANVAS = "CANVAS", E))(j || {}), $ = /* @__PURE__ */ ((E) => (E.CASCADE = "CASCADE", E.RESTRICT = "RESTRICT", E.SET_NULL = "SET_NULL", E.NO_ACTION = "NO_ACTION", E))($ || {}), P = /* @__PURE__ */ ((E) => (E.MANY_TO_ONE = "MANY_TO_ONE", E.ONE_TO_MANY = "ONE_TO_MANY", E))(P || {}), h = /* @__PURE__ */ ((E) => (E.AND = "AND", E.OR = "OR", E))(h || {}), g = /* @__PURE__ */ ((E) => (E.IS = "IS", E.IS_NOT_NULL = "IS_NOT_NULL", E.IS_NOT = "IS_NOT", E.LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL", E.GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL", E.IS_BEFORE = "IS_BEFORE", E.IS_AFTER = "IS_AFTER", E.CONTAINS = "CONTAINS", E.DOES_NOT_CONTAIN = "DOES_NOT_CONTAIN", E.IS_EMPTY = "IS_EMPTY", E.IS_NOT_EMPTY = "IS_NOT_EMPTY", E.IS_RELATIVE = "IS_RELATIVE", E.IS_IN_PAST = "IS_IN_PAST", E.IS_IN_FUTURE = "IS_IN_FUTURE", E.IS_TODAY = "IS_TODAY", E.VECTOR_SEARCH = "VECTOR_SEARCH", E))(g || {});
const uE = "__SerializedRelationBrand__";
var EE = /* @__PURE__ */ ((E) => (E.ProfilePage = "profile", E.TwoFactorAuthenticationStrategyConfig = "profile/two-factor-authentication/:twoFactorAuthenticationStrategy", E.Experience = "experience", E.Accounts = "accounts", E.NewAccount = "accounts/new", E.AccountsConfiguration = "accounts/configuration/:connectedAccountId", E.AccountsCalendars = "accounts/calendars", E.AccountsEmails = "accounts/emails", E.NewImapSmtpCaldavConnection = "accounts/new-imap-smtp-caldav-connection", E.EditImapSmtpCaldavConnection = "accounts/edit-imap-smtp-caldav-connection/:connectedAccountId", E.Billing = "billing", E.Usage = "billing/usage", E.UsageUserDetail = "billing/usage/user/:userWorkspaceId", E.Enterprise = "enterprise", E.Objects = "objects", E.ObjectOverview = "objects/overview", E.ObjectDetail = "objects/:objectNamePlural", E.ObjectNewFieldSelect = "objects/:objectNamePlural/new-field/select", E.ObjectNewFieldConfigure = "objects/:objectNamePlural/new-field/configure", E.ObjectNewIndex = "objects/:objectNamePlural/new-index", E.ObjectFieldEdit = "objects/:objectNamePlural/:fieldName", E.NewObject = "objects/new", E.Layout = "layout", E.WorkspaceMembersPage = "members", E.WorkspaceMemberPage = "members/:workspaceMemberId", E.General = "general", E.Subdomain = "general/subdomain", E.CustomDomain = "general/custom-domain", E.WorkspaceEmail = "email", E.EmailGroupChannelDetail = "email/email-group/:messageChannelId", E.NewEmailGroupChannel = "email/new-email-group", E.PublicDomain = "applications/public-domain", E.NewApprovedAccessDomain = "security/approved-access-domain/new", E.NewEmailingDomain = "email/emailing-domain/new", E.EmailingDomainDetail = "email/emailing-domain/:domainId", E.Community = "community", E.AI = "ai", E.AiUsageUserDetail = "ai/usage/user/:userWorkspaceId", E.AiPrompts = "ai/prompts", E.AiNewAgent = "ai/new-agent", E.AiAgentDetail = "ai/agents/:agentId", E.AiAgentTurnDetail = "ai/agents/:agentId/turns/:turnId", E.AiNewSkill = "ai/new-skill", E.AiSkillDetail = "ai/skills/:skillId", E.AiToolDetail = "ai/tools/:toolIdentifier", E.Applications = "applications", E.ApplicationDetail = "applications/:applicationId", E.ApplicationConnectionDetail = "applications/:applicationId/connections/:connectedAccountId", E.ApplicationLogicFunctionDetail = "applications/:applicationId/logicFunctions/:logicFunctionId", E.ApplicationFrontComponentDetail = "applications/:applicationId/frontComponents/:frontComponentId", E.ApplicationCommandMenuItemDetail = "applications/:applicationId/commandMenuItems/:commandMenuItemId", E.ApplicationViewDetail = "applications/:applicationId/views/:viewUniversalIdentifier", E.ApplicationPageLayoutDetail = "applications/:applicationId/pageLayouts/:pageLayoutUniversalIdentifier", E.AvailableApplicationDetail = "applications/available/:availableApplicationId", E.ApplicationRegistrationDetail = "applications/registrations/:applicationRegistrationId", E.ApplicationRegistrationConfigVariableDetails = "applications/registrations/:applicationRegistrationId/config-variables/:variableKey", E.LogicFunctions = "functions", E.NewLogicFunction = "functions/new", E.LogicFunctionDetail = "functions/:logicFunctionId", E.ApiWebhooks = "api-webhooks", E.RestPlayground = "playground/rest/:schema", E.GraphQLPlayground = "playground/graphql/:schema", E.NewApiKey = "api-webhooks/apis/new", E.ApiKeyDetail = "api-webhooks/apis/:apiKeyId", E.NewWebhook = "api-webhooks/webhooks/new", E.WebhookDetail = "api-webhooks/webhooks/:webhookId", E.Integrations = "integrations", E.Security = "general#security", E.Logs = "general#logs", E.NewSSOIdentityProvider = "security/sso/new", E.AdminPanel = "admin-panel", E.AdminPanelEnterprise = "admin-panel#enterprise", E.AdminPanelHealthStatus = "admin-panel#health-status", E.AdminPanelIndicatorHealthStatus = "admin-panel/health-status/:indicatorId", E.AdminPanelInferredVersion = "admin-panel/health-status/inferred-version", E.AdminPanelInstanceStatus = "admin-panel/health-status/instance-status", E.AdminPanelWorkspacesStatus = "admin-panel/health-status/workspaces-status", E.AdminPanelQueueDetail = "admin-panel/health-status/queue/:queueName", E.AdminPanelConfigVariableDetails = "admin-panel/config-variables/:variableName", E.AdminPanelNewAiProvider = "admin-panel/ai/new-provider", E.AdminPanelAiProviderDetail = "admin-panel/ai/providers/:providerName", E.AdminPanelNewAiModel = "admin-panel/ai/providers/:providerName/new-model", E.AdminPanelUserDetail = "admin-panel/users/:userId", E.AdminPanelWorkspaceDetail = "admin-panel/workspaces/:workspaceId", E.AdminPanelApplicationRegistrationDetail = "admin-panel/applications/registrations/:applicationRegistrationId", E.AdminPanelApplicationRegistrationConfigVariableDetails = "admin-panel/applications/registrations/:applicationRegistrationId/config-variables/:variableKey", E.AdminPanelWorkspaceChatThread = "admin-panel/workspaces/:workspaceId/threads/:threadId", E.Roles = "members/roles", E.RoleCreate = "members/roles/create", E.RoleDetail = "members/roles/:roleId", E.RoleObjectLevel = "members/roles/:roleId/object/:objectMetadataId", E.RoleAddObjectLevel = "members/roles/:roleId/add-object-permission", E))(EE || {}), IE = /* @__PURE__ */ ((E) => (E.CommandMenuDisplay = "command-menu-display", E.ViewRecord = "view-record", E.MergeRecords = "merge-records", E.UpdateRecords = "update-records", E.ViewCalendarEvent = "view-calendar-event", E.EditRichText = "edit-rich-text", E.Copilot = "copilot", E.WorkflowTriggerSelectType = "workflow-trigger-select-type", E.WorkflowStepCreate = "workflow-step-create", E.WorkflowStepEditType = "workflow-step-edit-type", E.WorkflowStepView = "workflow-step-view", E.WorkflowStepEdit = "workflow-step-edit", E.WorkflowRunStepView = "workflow-run-step-view", E.SearchRecords = "search-records", E.AskAI = "ask-ai", E.ViewPreviousAiChats = "view-previous-ai-chats", E.PageLayoutDashboardWidgetTypeSelect = "page-layout-dashboard-widget-type-select", E.PageLayoutTabSettings = "page-layout-tab-settings", E.DashboardChartSettings = "dashboard-chart-settings", E.DashboardIframeSettings = "dashboard-iframe-settings", E.DashboardRecordTableSettings = "dashboard-record-table-settings", E.RecordPageFieldsSettings = "record-page-fields-settings", E.RecordPageFieldSettings = "record-page-field-settings", E.ViewFrontComponent = "view-front-component", E.NavigationMenuItemEdit = "navigation-menu-item-edit", E.NavigationMenuAddItem = "navigation-menu-add-item", E.CommandMenuEdit = "command-menu-edit", E.PageLayoutRecordPageWidgetTypeSelect = "page-layout-record-page-widget-type-select", E.ComposeEmail = "compose-email", E))(IE || {}), _E = /* @__PURE__ */ ((E) => (E.TOTP = "TOTP", E))(_E || {}), eE = /* @__PURE__ */ ((E) => (E.UP_TO_DATE = "UP_TO_DATE", E.BEHIND = "BEHIND", E.FAILED = "FAILED", E))(eE || {});
const A = /^[_A-Za-z][_0-9A-Za-z]*$/, CE = (E) => (_, N) => {
  i({
    name: "isValidGraphQLEnumName",
    target: _.constructor,
    propertyName: N,
    options: E,
    validator: {
      validate: (e) => typeof e == "string" && A.test(e),
      defaultMessage: (e) => `${e.property} must match the ${A} format`
    }
  });
};
var rE = /* @__PURE__ */ ((E) => (E.DAY = "DAY", E.WEEK = "WEEK", E.MONTH = "MONTH", E))(rE || {}), AE = /* @__PURE__ */ ((E) => (E.AND = "AND", E.OR = "OR", E.NOT = "NOT", E))(AE || {}), NE = /* @__PURE__ */ ((E) => (E.INDEX = "INDEX", E))(NE || {}), TE = /* @__PURE__ */ ((E) => (E.SIDE_PANEL = "SIDE_PANEL", E.RECORD_PAGE = "RECORD_PAGE", E))(TE || {}), iE = /* @__PURE__ */ ((E) => (E.ASC = "ASC", E.DESC = "DESC", E))(iE || {}), oE = /* @__PURE__ */ ((E) => (E.TABLE = "TABLE", E.KANBAN = "KANBAN", E.CALENDAR = "CALENDAR", E.FIELDS_WIDGET = "FIELDS_WIDGET", E.TABLE_WIDGET = "TABLE_WIDGET", E))(oE || {}), sE = /* @__PURE__ */ ((E) => (E.WORKSPACE = "WORKSPACE", E.UNLISTED = "UNLISTED", E))(sE || {});
export {
  nE as ALLOWED_ADDRESS_SUBFIELDS,
  o as AggregateOperations,
  s as AppBasePath,
  fE as AppPath,
  a as CalendarChannelContactAutoCreationPolicy,
  p as CalendarChannelSyncStage,
  d as CalendarChannelSyncStatus,
  R as CalendarChannelVisibility,
  n as CommandMenuItemViewType,
  u as ConnectedAccountProvider,
  C as ContextStorePageType,
  G as CoreObjectNameSingular,
  S as CrudOperationType,
  b as DateDisplayFormat,
  f as EventLogTable,
  cE as FILE_CATEGORIES,
  LE as FILTERABLE_FIELD_TYPES,
  U as FeatureFlagKey,
  UE as FieldActorSource,
  OE as FieldMetadataComplexOption,
  w as FieldMetadataDefaultOption,
  M as FieldMetadataSettingsOnClickAction,
  I as FieldMetadataType,
  v as FileFolder,
  ME as FirstDayOfTheWeek,
  W as HTTPMethod,
  CE as IsValidGraphQLEnumName,
  F as LOGIC_FUNCTION_HTTP_RESPONSE_MARKER,
  H as MessageChannelContactAutoCreationPolicy,
  Y as MessageChannelPendingGroupEmailsAction,
  y as MessageChannelSyncStage,
  X as MessageChannelSyncStatus,
  q as MessageChannelType,
  K as MessageChannelVisibility,
  x as MessageFolderImportPolicy,
  J as MessageFolderPendingSyncAction,
  Q as MessageParticipantRole,
  Z as NavigationMenuItemType,
  k as NumberDataType,
  bE as ObjectRecordGroupByDateGranularity,
  z as OrderByDirection,
  j as PageLayoutTabLayoutMode,
  wE as RecordFilterGroupLogicalOperator,
  $ as RelationOnDeleteAction,
  P as RelationType,
  h as RowLevelPermissionPredicateGroupLogicalOperator,
  g as RowLevelPermissionPredicateOperand,
  uE as SERIALIZED_RELATION_BRAND,
  EE as SettingsPath,
  IE as SidePanelPages,
  WE as StepLogicalOperator,
  _E as TwoFactorAuthenticationStrategy,
  eE as UpgradeHealthEnum,
  rE as ViewCalendarLayout,
  AE as ViewFilterGroupLogicalOperator,
  VE as ViewFilterOperand,
  BE as ViewFilterOperandDeprecated,
  NE as ViewKey,
  TE as ViewOpenRecordIn,
  iE as ViewSortDirection,
  oE as ViewType,
  sE as ViewVisibility,
  T as actorCompositeType,
  D as addressCompositeType,
  lE as compositeTypeDefinitions,
  l as currencyCompositeType,
  t as emailsCompositeType,
  tE as fieldMetadataDefaultValueFunctionName,
  O as fullNameCompositeType,
  mE as isLogicFunctionHttpResponse,
  c as linksCompositeType,
  L as phonesCompositeType,
  m as richTextCompositeType,
  DE as richTextValueSchema
};
