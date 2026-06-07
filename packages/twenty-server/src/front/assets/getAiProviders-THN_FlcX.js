import{tb as e}from"./index-DrA-SXmV.js";const d=e`
  query GetAdminAiModels {
    getAdminAiModels {
      defaultSmartModelId
      defaultFastModelId
      models {
        modelId
        label
        modelFamily
        sdkPackage
        isAvailable
        isAdminEnabled
        isDeprecated
        isRecommended
        contextWindowTokens
        maxOutputTokens
        inputCostPerMillionTokens
        outputCostPerMillionTokens
        providerName
        providerLabel
        name
        dataResidency
      }
    }
  }
`,i=e`
  query GetAiProviders {
    getAiProviders
  }
`;export{d as G,i as a};
