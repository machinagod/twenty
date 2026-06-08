import { i as a } from "./isDefined-BAmzg2fZ.mjs";
const k = {
  "@ai-sdk/openai": "OpenAI",
  "@ai-sdk/anthropic": "Anthropic",
  "@ai-sdk/google": "Google",
  "@ai-sdk/mistral": "Mistral",
  "@ai-sdk/xai": "xAI",
  "@ai-sdk/amazon-bedrock": "AWS Bedrock",
  "@ai-sdk/openai-compatible": "OpenAI-Compatible",
  "@ai-sdk/azure": "Azure OpenAI"
}, A = [
  "@ai-sdk/openai",
  "@ai-sdk/anthropic",
  "@ai-sdk/google",
  "@ai-sdk/mistral",
  "@ai-sdk/xai",
  "@ai-sdk/amazon-bedrock",
  "@ai-sdk/openai-compatible",
  "@ai-sdk/azure"
], s = [
  "us",
  "eu",
  "global",
  "uk",
  "ap",
  "jp",
  "au",
  "ca",
  "de",
  "fr"
], e = [
  "openai",
  "anthropic",
  "google",
  "mistral",
  "xai"
];
var n = /* @__PURE__ */ ((i) => (i.DATABASE_CRUD = "DATABASE_CRUD", i.ACTION = "ACTION", i.WORKFLOW = "WORKFLOW", i.METADATA = "METADATA", i.VIEW = "VIEW", i.DASHBOARD = "DASHBOARD", i.NAVIGATION_MENU_ITEM = "NAVIGATION_MENU_ITEM", i.WEBHOOK = "WEBHOOK", i.LOGIC_FUNCTION = "LOGIC_FUNCTION", i))(n || {});
const I = (i) => i.type === "file" && a(i.fileId) && a(i.url) && a(i.mediaType), c = (i) => e.includes(i) ? `@ai-sdk/${i}` : "@ai-sdk/openai-compatible", O = (i) => A.includes(i), E = (i) => s.includes(i);
export {
  A as AI_SDK_PACKAGES,
  k as AI_SDK_PACKAGE_LABELS,
  s as DATA_RESIDENCY_KEYS,
  e as NATIVE_AI_SDK_PROVIDER_IDS,
  n as ToolCategory,
  c as inferAiSdkPackage,
  O as isAiSdkPackage,
  E as isDataResidency,
  I as isExtendedFileUIPart
};
