import { z as e } from "zod";
import { i as y } from "./isValidUuid-CKnAJUCa.mjs";
import { S as E } from "./StepFilters-Cml3Z3gd.mjs";
import { V as j, a as A } from "./ViewFilterOperandDeprecated-C9y0ExQo.mjs";
import { F as p } from "./FieldMetadataType-CPAdLk1i.mjs";
import { i as l } from "./isDefined-BAmzg2fZ.mjs";
const T = /{{([^{}]+)}}/g, Pe = {
  rawJson: "application/json",
  formData: "multipart/form-data",
  keyValue: "application/x-www-form-urlencoded",
  text: "text/plain",
  none: ""
}, ve = {
  IF: {
    x: -200,
    y: 120
  },
  ELSE: {
    x: 200,
    y: 120
  }
}, R = [
  "workflow",
  "workflowVersion",
  "workflowRun",
  "workflowAutomatedTrigger",
  "workspaceMember",
  "dashboard",
  "message",
  "messageThread",
  "messageChannelMessageAssociation",
  "messageParticipant",
  "calendarEvent",
  "calendarEventParticipant",
  "calendarChannelEventAssociation"
], Me = "trigger", s = e.object({
  input: e.looseObject({}).describe(
    "Input data for the workflow action. Structure depends on the action type."
  ),
  outputSchema: e.looseObject({}).describe(
    "Schema defining the output data structure. This data can be referenced in subsequent steps using {{stepId.fieldName}}."
  ),
  errorHandlingOptions: e.object({
    retryOnFailure: e.object({
      value: e.boolean().describe("Whether to retry the action if it fails.")
    }),
    continueOnFailure: e.object({
      value: e.boolean().describe("Whether to continue to the next step if this action fails.")
    })
  })
}), k = s.extend({
  input: e.object({
    agentId: e.string().optional(),
    prompt: e.string().optional()
  })
}), a = e.object({
  id: e.string().describe(
    "Unique identifier for the workflow step. Must be unique within the workflow."
  ),
  name: e.string().describe(
    "Human-readable name for the workflow step. Should clearly describe what the step does."
  ),
  valid: e.boolean().describe(
    "Whether the step configuration is valid. Set to true when all required fields are properly configured."
  ),
  nextStepIds: e.array(e.string()).optional().nullable().describe(
    "Array of step IDs that this step connects to. Leave empty or null for the final step."
  ),
  position: e.object({ x: e.number(), y: e.number() }).optional().nullable().describe("Position coordinates for the step in the workflow diagram.")
}), O = a.extend({
  type: e.literal("AI_AGENT"),
  settings: k
}), u = e.object({
  name: e.string().optional().describe(
    "Human-readable name for the trigger. Optional but recommended for clarity."
  ),
  type: e.enum(["DATABASE_EVENT", "MANUAL", "CRON", "WEBHOOK"]).describe(
    "Type of trigger. DATABASE_EVENT for record changes, MANUAL for user-initiated, CRON for scheduled, WEBHOOK for external calls."
  ),
  position: e.object({ x: e.number(), y: e.number() }).optional().nullable().describe(
    "Position coordinates for the trigger in the workflow diagram. Use (0, 0) for the trigger step."
  ),
  nextStepIds: e.array(e.string()).optional().nullable().describe(
    "Array of step IDs that the trigger connects to. These are the first steps in the workflow."
  )
}), I = s.extend({
  input: e.object({
    logicFunctionId: e.string().describe(
      "The ID of the logic function that holds the code. This is auto-generated when a CODE step is created via create_workflow_version_step — do NOT set this manually."
    ),
    logicFunctionInput: e.record(e.string(), e.any()).describe(
      "Key-value map of input parameters to pass to the logic function at runtime."
    )
  })
}), D = a.extend({
  type: e.literal("CODE"),
  settings: I
}), m = e.record(e.string(), e.any()).describe(
  `Record data object. Use nested objects for relationships (e.g., "company": {"id": "{{reference}}"}). Common patterns:
- Person: {"name": {"firstName": "John", "lastName": "Doe"}, "emails": {"primaryEmail": "john@example.com"}, "company": {"id": "{{trigger.object.id}}"}}
- Company: {"name": "Acme Corp", "domainName": {"primaryLinkUrl": "https://acme.com"}}
- Task: {"title": "Follow up", "status": "TODO", "assignee": {"id": "{{user.id}}"}}`
), N = s.extend({
  input: e.object({
    objectName: e.string().describe(
      'The name of the object to create a record in. Must be lowercase (e.g., "person", "company", "task").'
    ),
    objectRecord: m.describe("The record data to create.")
  })
}), x = a.extend(
  {
    type: e.literal("CREATE_RECORD"),
    settings: N
  }
), F = u.extend({
  type: e.literal("CRON"),
  settings: e.discriminatedUnion("type", [
    e.object({
      type: e.literal("DAYS"),
      schedule: e.object({
        day: e.number().min(1),
        hour: e.number().min(0).max(23),
        minute: e.number().min(0).max(59)
      }),
      outputSchema: e.looseObject({})
    }),
    e.object({
      type: e.literal("HOURS"),
      schedule: e.object({
        hour: e.number().min(1),
        minute: e.number().min(0).max(59)
      }),
      outputSchema: e.looseObject({})
    }),
    e.object({
      type: e.literal("MINUTES"),
      schedule: e.object({ minute: e.number().min(1).max(60) }),
      outputSchema: e.looseObject({})
    }),
    e.object({
      type: e.literal("CUSTOM"),
      pattern: e.string(),
      outputSchema: e.looseObject({})
    })
  ])
}), C = u.extend({
  type: e.literal("DATABASE_EVENT"),
  settings: e.object({
    eventName: e.string().regex(
      /^[a-z][a-zA-Z0-9_]*\.(created|updated|deleted|upserted)$/,
      'Event name must follow the pattern: objectName.action (e.g., "company.created", "person.updated", "company.upserted")'
    ).describe(
      'Event name in format: objectName.action (e.g., "company.created", "person.updated", "task.deleted", "company.upserted"). Use lowercase object names.'
    ),
    input: e.looseObject({}).optional(),
    outputSchema: e.looseObject({}).describe(
      "Schema defining the output data structure. For database events, this includes the record that triggered the workflow accessible via {{trigger.object.fieldName}}."
    ),
    objectType: e.string().optional(),
    fields: e.array(e.string()).optional().nullable()
  })
}).describe(
  "Database event trigger that fires when a record is created, updated, deleted, or upserted. The triggered record is accessible in workflow steps via {{trigger.object.fieldName}}."
), L = s.extend({
  input: e.object({
    objectName: e.string(),
    objectRecordId: e.string()
  })
}), _ = a.extend(
  {
    type: e.literal("DELETE_RECORD"),
    settings: L
  }
), U = e.object({
  id: e.string().refine((t) => y(t)),
  name: e.string(),
  size: e.number(),
  type: e.string(),
  createdAt: e.string()
}), g = s.extend({
  input: e.object({
    connectedAccountId: e.string(),
    recipients: e.object({
      to: e.string().optional().default(""),
      cc: e.string().optional().default(""),
      bcc: e.string().optional().default("")
    }),
    subject: e.string().optional(),
    body: e.string().optional(),
    files: e.array(U).optional().default([]),
    inReplyTo: e.string().trim().optional()
  })
}), P = a.extend({
  type: e.literal("DRAFT_EMAIL"),
  settings: g
}), v = s.extend({
  input: e.object({})
}), M = a.extend({
  type: e.literal("EMPTY"),
  settings: v
}), b = e.object({
  id: e.string(),
  logicalOperator: e.enum(E),
  parentStepFilterGroupId: e.string().optional(),
  positionInStepFilterGroup: e.number().optional()
}), h = e.object({
  id: e.string(),
  type: e.string(),
  stepOutputKey: e.string(),
  operand: e.enum(j).or(e.enum(A)),
  value: e.string(),
  stepFilterGroupId: e.string(),
  positionInStepFilterGroup: e.number().optional(),
  fieldMetadataId: e.string().optional(),
  compositeFieldSubFieldName: e.string().optional()
}), B = s.extend({
  input: e.object({
    stepFilterGroups: e.array(b),
    stepFilters: e.array(h)
  })
}), G = a.extend({
  type: e.literal("FILTER"),
  settings: B
}), H = s.extend({
  input: e.object({
    objectName: e.string(),
    limit: e.number().optional(),
    filter: e.object({
      recordFilterGroups: e.array(e.any()).optional(),
      recordFilters: e.array(e.any()).optional(),
      gqlOperationFilter: e.any().optional().nullable()
    }).optional(),
    orderBy: e.object({
      recordSorts: e.array(e.any()).optional(),
      gqlOperationOrderBy: e.array(e.record(e.string(), e.any())).optional()
    }).optional()
  })
}), V = a.extend({
  type: e.literal("FIND_RECORDS"),
  settings: H
}), W = s.extend({
  input: e.array(
    e.object({
      id: e.string(),
      name: e.string(),
      label: e.string(),
      type: e.union([
        e.literal(p.TEXT),
        e.literal(p.NUMBER),
        e.literal(p.DATE),
        e.literal(p.SELECT),
        e.literal(p.MULTI_SELECT),
        e.literal("RECORD")
      ]),
      placeholder: e.string().optional(),
      settings: e.record(e.string(), e.any()).optional(),
      value: e.any().optional()
    })
  )
}), K = a.extend({
  type: e.literal("FORM"),
  settings: W
}), q = s.extend({
  input: e.object({
    url: e.string(),
    method: e.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    headers: e.record(e.string(), e.string()).optional(),
    body: e.record(
      e.string(),
      e.union([
        e.string(),
        e.number(),
        e.boolean(),
        e.null(),
        e.array(e.union([e.string(), e.number(), e.boolean(), e.null()]))
      ])
    ).or(e.string()).optional()
  })
}), J = a.extend({
  type: e.literal("HTTP_REQUEST"),
  settings: q
}), Y = e.object({
  id: e.string(),
  nextStepIds: e.array(e.string()),
  filterGroupId: e.string().optional()
}), z = s.extend({
  input: e.object({
    stepFilterGroups: e.array(b),
    stepFilters: e.array(h),
    branches: e.array(Y)
  })
}), Q = a.extend({
  type: e.literal("IF_ELSE"),
  settings: z
}), $ = s.extend({
  input: e.object({
    items: e.union([
      e.array(
        e.union([
          e.string(),
          e.number(),
          e.boolean(),
          e.null(),
          e.record(e.string(), e.any()),
          e.any()
        ])
      ),
      e.string()
    ]).optional(),
    initialLoopStepIds: e.array(e.string()).optional(),
    shouldContinueOnIterationFailure: e.boolean().optional()
  })
}), X = a.extend({
  type: e.literal("ITERATOR"),
  settings: $
}), Z = s.extend({
  input: e.object({
    logicFunctionId: e.string(),
    logicFunctionInput: e.record(e.string(), e.any())
  })
}), ee = a.extend({
  type: e.literal("LOGIC_FUNCTION"),
  settings: Z
}), te = u.extend({
  type: e.literal("MANUAL"),
  settings: e.object({
    objectType: e.string().optional(),
    outputSchema: e.looseObject({}).describe(
      "Schema defining the output data structure. When a record is selected, it is accessible via {{trigger.record.fieldName}}. When no record is selected, no data is available."
    ),
    icon: e.string().optional(),
    isPinned: e.boolean().optional(),
    availability: e.discriminatedUnion("type", [
      e.object({
        type: e.literal("GLOBAL"),
        locations: e.array(e.string()).optional()
      }),
      e.object({
        type: e.literal("SINGLE_RECORD"),
        objectNameSingular: e.string()
      }),
      e.object({
        type: e.literal("BULK_RECORDS"),
        objectNameSingular: e.string()
      })
    ]).optional().nullable()
  })
}).describe(
  "Manual trigger that can be launched by the user. If a record is selected when launched, it is accessible via {{trigger.record.fieldName}}. If no record is selected, no data context is available."
), oe = a.extend({
  type: e.literal("SEND_EMAIL"),
  settings: g
}), ne = s.extend({
  input: e.object({
    objectName: e.string(),
    objectRecord: m,
    objectRecordId: e.string(),
    fieldsToUpdate: e.array(e.string())
  })
}), re = a.extend(
  {
    type: e.literal("UPDATE_RECORD"),
    settings: ne
  }
), ie = s.extend({
  input: e.object({
    objectName: e.string(),
    objectRecord: m
  })
}), ae = a.extend(
  {
    type: e.literal("UPSERT_RECORD"),
    settings: ie
  }
), se = u.extend({
  type: e.literal("WEBHOOK"),
  settings: e.discriminatedUnion("httpMethod", [
    e.object({
      outputSchema: e.looseObject({}),
      httpMethod: e.literal("GET"),
      authentication: e.literal("API_KEY").nullable()
    }),
    e.object({
      outputSchema: e.looseObject({}),
      httpMethod: e.literal("POST"),
      expectedBody: e.looseObject({}),
      authentication: e.literal("API_KEY").nullable()
    })
  ])
}), ce = s.extend({
  input: e.object({
    delayType: e.enum(["SCHEDULED_DATE", "DURATION"]),
    scheduledDateTime: e.string().nullable().optional(),
    duration: e.object({
      days: e.union([e.number().min(0), e.string()]).optional(),
      hours: e.union([e.number().min(0), e.string()]).optional(),
      minutes: e.union([e.number().min(0), e.string()]).optional(),
      seconds: e.union([e.number().min(0), e.string()]).optional()
    }).optional()
  })
}), le = a.extend({
  type: e.literal("DELAY"),
  settings: ce
}), pe = e.discriminatedUnion("type", [
  D,
  ee,
  oe,
  P,
  x,
  re,
  _,
  ae,
  V,
  K,
  J,
  O,
  G,
  Q,
  X,
  le,
  M
]);
var f = /* @__PURE__ */ ((t) => (t.NOT_STARTED = "NOT_STARTED", t.RUNNING = "RUNNING", t.SUCCESS = "SUCCESS", t.STOPPED = "STOPPED", t.FAILED = "FAILED", t.FAILED_SAFELY = "FAILED_SAFELY", t.PENDING = "PENDING", t.SKIPPED = "SKIPPED", t))(f || {});
const ue = e.enum(f), S = e.object({
  result: e.any().optional(),
  error: e.any().optional(),
  status: ue,
  get history() {
    return e.array(
      S.pick({
        result: !0,
        status: !0,
        error: !0
      })
    ).optional();
  }
}), de = e.record(
  e.string(),
  S
), me = e.discriminatedUnion("type", [
  C,
  te,
  F,
  se
]), ge = e.object({
  flow: e.object({
    trigger: me,
    steps: e.array(pe)
  }),
  stepInfos: de,
  workflowRunError: e.any().optional()
}), be = e.enum([
  "NOT_STARTED",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "ENQUEUED",
  "STOPPING",
  "STOPPED"
]), he = e.object({
  timestamp: e.string(),
  level: e.enum(["debug", "info", "warn", "error"]),
  message: e.string()
}), fe = e.object({
  toolName: e.string(),
  toolCallId: e.string(),
  providerExecuted: e.boolean().optional(),
  input: e.unknown().optional(),
  output: e.unknown().optional(),
  errorMessage: e.string().optional(),
  state: e.enum(["started", "success", "error", "awaiting-approval"])
}), Se = e.object({
  type: e.literal("AI_AGENT"),
  modelId: e.string(),
  usage: e.object({
    inputTokens: e.number(),
    outputTokens: e.number(),
    reasoningTokens: e.number().optional(),
    cacheReadTokens: e.number().optional(),
    cacheCreationTokens: e.number().optional(),
    totalTokens: e.number()
  }),
  cost: e.object({
    totalCostInDollars: e.number(),
    creditsUsedMicro: e.number()
  }),
  nativeWebSearchCallCount: e.number(),
  toolCalls: e.array(fe),
  durationMs: e.number()
}), we = e.object({
  type: e.literal("CODE"),
  durationMs: e.number(),
  status: e.enum(["SUCCESS", "ERROR"]),
  error: e.object({
    type: e.string(),
    message: e.string(),
    stackTrace: e.string().optional()
  }).nullable().optional()
}), ye = e.object({
  type: e.literal("HTTP_REQUEST"),
  request: e.object({
    method: e.string(),
    url: e.string(),
    headers: e.record(e.string(), e.string()),
    body: e.string().optional(),
    bodyBytes: e.number().optional(),
    bodyTruncated: e.boolean().optional()
  }),
  // `response` is absent for transport-level failures (DNS, timeout, TLS,
  // etc.) — only `error` is set in that case.
  response: e.object({
    status: e.number(),
    statusText: e.string().optional(),
    headers: e.record(e.string(), e.string()),
    body: e.string().optional(),
    bodyBytes: e.number().optional(),
    bodyTruncated: e.boolean().optional()
  }).optional(),
  error: e.string().optional(),
  durationMs: e.number()
}), Ee = e.object({
  type: e.literal("EMAIL"),
  mode: e.enum(["SEND", "DRAFT"]),
  status: e.enum(["SUCCESS", "ERROR"]),
  recipients: e.object({
    to: e.array(e.string()),
    cc: e.array(e.string()).optional(),
    bcc: e.array(e.string()).optional()
  }),
  subject: e.string().optional(),
  bodyPreview: e.string().optional(),
  bodyBytes: e.number().optional(),
  bodyTruncated: e.boolean().optional(),
  connectedAccountId: e.string().optional(),
  attachmentCount: e.number().optional(),
  inReplyTo: e.string().optional(),
  error: e.string().optional(),
  durationMs: e.number()
}), je = e.discriminatedUnion("type", [
  Se,
  we,
  ye,
  Ee
]), Be = e.object({
  details: je,
  entries: e.array(he),
  truncated: e.object({
    droppedEntries: e.number(),
    droppedBytes: e.number()
  }).optional(),
  sizeBytes: e.number()
}), Ae = e.record(e.string(), e.unknown()), Ge = e.looseObject({
  __typename: e.literal("WorkflowRun"),
  id: e.string(),
  workflowVersionId: e.string(),
  workflowId: e.string(),
  state: ge.nullable(),
  stepLogs: Ae.nullable().optional(),
  status: be,
  createdAt: e.string(),
  deletedAt: e.string().nullable(),
  endedAt: e.string().nullable(),
  name: e.string()
}), He = ({
  nameSingular: t
}) => !R.includes(
  t
), Ve = ({
  rawVariableName: t,
  part: o
}) => {
  const r = t.replace(
    T,
    (c, w) => w
  ).split("."), i = o === "stepId" ? r[0] : o === "selectedField" ? r[r.length - 1] : null;
  if (!l(i))
    throw new Error("Expected to find at least one splitted chunk.");
  return i;
}, Te = (t) => t.map((o) => {
  if (l(o.type) && ["string", "number", "boolean"].includes(o.type))
    return o.enum && o.enum.length > 0 ? o.enum[0] : null;
  if (o.type === "object") {
    const n = {};
    return l(o.properties) && Object.entries(o.properties).forEach(([r, i]) => {
      n[r] = Te([i])[0];
    }), n;
  } else if (o.type === "array" && l(o.items))
    return [];
  return null;
}), We = (t) => Object.fromEntries(
  Object.entries(t).filter(([, o]) => l(o?.result)).map(([o, n]) => [o, n?.result])
), Ke = (t) => t === "true" ? !0 : t === "false" ? !1 : t, Re = (t) => {
  let o = t;
  if (typeof t == "string")
    try {
      o = JSON.parse(t);
    } catch {
      o = t;
    }
  return new URLSearchParams(o).toString();
}, ke = (t) => {
  const o = new FormData();
  if (typeof t == "string")
    try {
      const n = JSON.parse(t);
      Object.entries(n).forEach(
        ([r, i]) => o.append(r, String(i))
      );
    } catch {
      throw new Error("String data for FormData must be valid JSON");
    }
  else
    Object.entries(t).forEach(([n, r]) => o.append(n, r));
  return o;
}, d = (t) => typeof t == "string" ? t : JSON.stringify(t), Oe = (t) => typeof t == "string" ? t : Object.entries(t).map(([o, n]) => `${o}=${n}`).join(`
`), qe = (t, o) => {
  if (o === void 0)
    return d(t);
  switch (o) {
    case "application/x-www-form-urlencoded":
      return Re(t);
    case "multipart/form-data":
      return ke(t);
    case "application/json":
      return d(t);
    case "text/plain":
      return Oe(t);
    default:
      return d(t);
  }
}, Ie = /[\s[]/, De = (t) => Ie.test(t), Ne = (t) => De(t) ? `[${t}]` : t, Je = (t) => t.map(Ne).join("."), Ye = (t) => {
  const o = [];
  let n = "", r = !1, i = 0;
  for (; i < t.length; ) {
    const c = t[i];
    if (c === "[" && !r) {
      n.length > 0 && (o.push(n), n = ""), r = !0, i++;
      continue;
    }
    if (c === "]" && r) {
      o.push(n), n = "", r = !1, i++, i < t.length && t[i] === "." && i++;
      continue;
    }
    if (c === "." && !r) {
      n.length > 0 && (o.push(n), n = ""), i++;
      continue;
    }
    n += c, i++;
  }
  return n.length > 0 && o.push(n), o;
}, ze = ({
  schema: t,
  propertyPath: o
}) => {
  if (o.length === 0)
    return;
  let n = t, r;
  for (const i of o) {
    if (r = n[i], !l(r))
      return;
    if (r.isLeaf)
      return i === o[o.length - 1] ? r : void 0;
    n = r.value;
  }
  return r;
};
export {
  T as CAPTURE_ALL_VARIABLE_TAG_INNER_REGEX,
  Pe as CONTENT_TYPE_VALUES_HTTP_REQUEST,
  ve as IF_ELSE_BRANCH_POSITION_OFFSETS,
  R as OBJECTS_BLOCKED_FROM_AUTOMATION,
  f as StepStatus,
  Me as TRIGGER_STEP_ID,
  u as baseTriggerSchema,
  a as baseWorkflowActionSchema,
  s as baseWorkflowActionSettingsSchema,
  He as canObjectBeManagedByAutomation,
  Ne as escapePathSegment,
  Ve as extractRawVariableNamePart,
  Te as getFunctionInputFromInputSchema,
  We as getWorkflowRunContext,
  Je as joinVariablePath,
  ze as navigateOutputSchemaProperty,
  De as needsEscaping,
  m as objectRecordSchema,
  Ke as parseBooleanFromStringValue,
  qe as parseDataFromContentType,
  Ye as parseVariablePath,
  b as stepFilterGroupSchema,
  h as stepFilterSchema,
  Y as stepIfElseBranchSchema,
  pe as workflowActionSchema,
  O as workflowAiAgentActionSchema,
  k as workflowAiAgentActionSettingsSchema,
  D as workflowCodeActionSchema,
  I as workflowCodeActionSettingsSchema,
  x as workflowCreateRecordActionSchema,
  N as workflowCreateRecordActionSettingsSchema,
  F as workflowCronTriggerSchema,
  C as workflowDatabaseEventTriggerSchema,
  le as workflowDelayActionSchema,
  ce as workflowDelayActionSettingsSchema,
  _ as workflowDeleteRecordActionSchema,
  L as workflowDeleteRecordActionSettingsSchema,
  P as workflowDraftEmailActionSchema,
  M as workflowEmptyActionSchema,
  v as workflowEmptyActionSettingsSchema,
  U as workflowFileSchema,
  G as workflowFilterActionSchema,
  B as workflowFilterActionSettingsSchema,
  V as workflowFindRecordsActionSchema,
  H as workflowFindRecordsActionSettingsSchema,
  K as workflowFormActionSchema,
  W as workflowFormActionSettingsSchema,
  J as workflowHttpRequestActionSchema,
  q as workflowHttpRequestActionSettingsSchema,
  Q as workflowIfElseActionSchema,
  z as workflowIfElseActionSettingsSchema,
  X as workflowIteratorActionSchema,
  $ as workflowIteratorActionSettingsSchema,
  ee as workflowLogicFunctionActionSchema,
  Z as workflowLogicFunctionActionSettingsSchema,
  te as workflowManualTriggerSchema,
  Ge as workflowRunSchema,
  ge as workflowRunStateSchema,
  S as workflowRunStateStepInfoSchema,
  de as workflowRunStateStepInfosSchema,
  be as workflowRunStatusSchema,
  Be as workflowRunStepLogSchema,
  Ae as workflowRunStepLogsSchema,
  ue as workflowRunStepStatusSchema,
  oe as workflowSendEmailActionSchema,
  g as workflowSendEmailActionSettingsSchema,
  me as workflowTriggerSchema,
  re as workflowUpdateRecordActionSchema,
  ne as workflowUpdateRecordActionSettingsSchema,
  ae as workflowUpsertRecordActionSchema,
  ie as workflowUpsertRecordActionSettingsSchema,
  se as workflowWebhookTriggerSchema
};
