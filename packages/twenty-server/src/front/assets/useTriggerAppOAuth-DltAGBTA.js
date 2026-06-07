import{tb as d,E2 as u,Br as l,dL as A,A$ as C,Dp as P,dQ as T,Eb as h,yE as g,hD as E}from"./index-DrA-SXmV.js";const f=d`
  query ApplicationConnectionProviders($applicationId: UUID!) {
    applicationConnectionProviders(applicationId: $applicationId) {
      id
      applicationId
      type
      name
      displayName
      oauth {
        scopes
        isClientCredentialsConfigured
      }
    }
  }
`,I=t=>{const{data:n,loading:a,refetch:e}=u(f,{skip:!t,variables:{applicationId:t??""},fetchPolicy:"cache-first"});return{connectionProviders:n?.applicationConnectionProviders??[],loading:a,refetch:e}},_=()=>{const t=l(),{data:n,loading:a,refetch:e}=u(A,{client:t,fetchPolicy:"cache-and-network"});return{accounts:(n?.myConnectedAccounts??[]).filter(o=>o.provider===C.APP),loading:a,refetch:e}},N=()=>{const[t]=P(T),{redirect:n}=h();return{triggerAppOAuth:g.useCallback(async({applicationId:e,providerName:i,visibility:o,reconnectingConnectedAccountId:r,redirectLocation:c})=>{const p=(await t()).data?.generateTransientToken.transientToken.token;if(!p)return;const s=new URLSearchParams({applicationId:e,providerName:i,transientToken:p,visibility:o});r&&s.set("reconnectingConnectedAccountId",r),c&&s.set("redirectLocation",c),n(`${E}/apps/oauth/authorize?${s.toString()}`)},[t,n])}};export{_ as a,N as b,I as u};
