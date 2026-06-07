import{tb as N,Dc as ue,DE as pe,E2 as R,vz as e,jn as se,k as f,fC as E,fq as me,cr as V,xe as i,jT as Q,jU as o,Gl as ne,Go as ge,ey as Ie,lM as Ae,m9 as Y,G6 as O,l9 as X,nQ as w,rd as re,jA as xe,Az as B,gC as Se,ag as D,BL as he,pu as ie,DU as je,BH as _e,n9 as ke,BM as F,pq as fe,nU as Ee,oj as ye,EI as be,Dp as Ce,kW as Te,ed as Pe,fs as Ue,oB as ve,gD as we,tE as r,jo as De,jm as Fe,jl as Le,k4 as Re,jP as M,k8 as j,jR as x,jQ as g,yx as L,wK as Ne,md as Be,hw as $e,ku as We,qf as G,cu as K,B5 as Oe,G0 as Me}from"./index-DrA-SXmV.js";import{A as Ge}from"./AiAdminPath-B5WwcZT2.js";import{u as le}from"./useApolloAdminClient-BZ077ZFn.js";import{S as Z}from"./SettingsTableCard-BmnS-pKN.js";import{P as Ke}from"./PlansTags-BcOzp1Ta.js";import{u as qe,S as He}from"./useHandleImpersonate-C4hShmuW.js";import{S as J}from"./TableBody-CWwyNlJi.js";import"./getUpgradeHealthStatusBadge-D27zP7fB.js";const ze=N`
  query WorkspaceBillingAdminPanel($workspaceId: UUID!) {
    workspaceBillingAdminPanel(workspaceId: $workspaceId) {
      stripeCustomerId
      creditBalance
      subscription {
        stripeSubscriptionId
        status
        interval
        currency
        planKey
        currentPeriodStart
        currentPeriodEnd
        trialStart
        trialEnd
        cancelAt
        canceledAt
        cancelAtPeriodEnd
        items {
          productName
          productKey
          stripePriceId
          quantity
          unitAmount
          includedCredits
        }
      }
    }
  }
`,Ve="https://dashboard.stripe.com",Qe="BASE_PRODUCT",Ye="RESOURCE_CREDIT",q="—",H=B("div")({name:"StyledContainer",class:"s1hgnhrg",propsAsIs:!1}),Xe=B("a")({name:"StyledExternalLink",class:"s19t4op2",propsAsIs:!1}),Ze=B("span")({name:"StyledMono",class:"spfurqs",propsAsIs:!1}),Je=B("div")({name:"StyledItemValue",class:"spsfm74",propsAsIs:!1}),ea={[o.Active]:"green",[o.Trialing]:"blue",[o.PastDue]:"orange",[o.Canceled]:"red",[o.Unpaid]:"red",[o.Paused]:"gray",[o.Incomplete]:"gray",[o.IncompleteExpired]:"gray"},aa={[o.Active]:"Active",[o.Trialing]:"Trialing",[o.PastDue]:"Past Due",[o.Canceled]:"Canceled",[o.Unpaid]:"Unpaid",[o.Paused]:"Paused",[o.Incomplete]:"Incomplete",[o.IncompleteExpired]:"Incomplete Expired"},ta=(t,a)=>{const _=a.toUpperCase();try{return new Intl.NumberFormat("en-US",{style:"currency",currency:_}).format(t/100)}catch{return`${(t/100).toFixed(2)} ${_}`}},sa=t=>t===D.PRO?D.PRO:t===D.ENTERPRISE?D.ENTERPRISE:null,ee=({path:t,id:a})=>e.jsxs(Xe,{href:`${Ve}/${t}/${a}`,target:"_blank",rel:"noopener noreferrer",children:[e.jsx(Ze,{children:a}),e.jsx(Se,{size:12})]}),na=({workspaceId:t})=>{const{i18n:a,_}=ue(),{formatNumber:p}=pe(),k=le(),{data:b,loading:I}=R(ze,{client:k,variables:{workspaceId:t},skip:!t});if(I)return e.jsx(H,{children:e.jsx(se,{rowCount:6})});const C=b?.workspaceBillingAdminPanel??null;if(!C)return e.jsx(H,{children:e.jsx(f,{children:e.jsx(E,{title:a._({id:"R+w/Va"}),description:a._({id:"8whThc"})})})});const{stripeCustomerId:T,creditBalance:y,subscription:n}=C,$=[{Icon:me,label:a._({id:"zHJ27S"}),value:i(T)?e.jsx(ee,{path:"customers",id:T}):q},{Icon:V,label:a._({id:"3hkXRB"}),value:i(y)?`${p(y,{abbreviate:!0,decimals:2})} ${a._({id:"UQ4Hjl"})}`:q}],P=n?.interval===Q.Month?a._({id:"+8Nek/"}):n?.interval===Q.Year?a._({id:"zkWmBh"}):null,U=(l,m)=>`${w(l)} → ${w(m)}`,v=i(n?.planKey)?sa(n.planKey):null,d=n?.status===o.Trialing,A=l=>{const m=[];return i(l.quantity)&&m.push(`${p(l.quantity)} ${a._({id:"MpFIca"})}`),i(l.includedCredits)&&m.push(`${p(l.includedCredits,{abbreviate:!0,decimals:2})} ${a._({id:"5oMPMN"})}`),i(l.unitAmount)&&i(n)&&m.push(ta(l.unitAmount,n.currency)),m.length>0?m.join(" · "):q},W=n?[{Icon:ne,label:a._({id:"Yiplcx"}),value:e.jsx(ee,{path:"subscriptions",id:n.stripeSubscriptionId})},{Icon:ge,label:a._({id:"uAQUqI"}),value:e.jsx(X,{color:ea[n.status],text:aa[n.status]})},...i(v)?[{Icon:Ie,label:a._({id:"GdgCoi"}),value:e.jsx(Ke,{plan:v,isTrialPeriod:d})}]:[],...i(P)?[{Icon:Ae,label:a._({id:"nJGwRf"}),value:P}]:[],{Icon:Y,label:a._({id:"nSK0mT"}),value:U(n.currentPeriodStart,n.currentPeriodEnd)},...i(n.trialStart)&&i(n.trialEnd)?[{Icon:Y,label:a._({id:"67waeA"}),value:U(n.trialStart,n.trialEnd)}]:[],...n.cancelAtPeriodEnd?[{Icon:O,label:a._({id:"2CAby/"}),value:a._({id:"l75CjT"})}]:[],...i(n.cancelAt)?[{Icon:O,label:a._({id:"zbbpgB"}),value:w(n.cancelAt)}]:[],...i(n.canceledAt)?[{Icon:O,label:a._({id:"dC0BTo"}),value:w(n.canceledAt)}]:[],...n.items.map(l=>({Icon:l.productKey===Qe?re:l.productKey===Ye?V:xe,label:l.productName||a._({id:"a3Hy65"}),value:e.jsxs(Je,{children:[e.jsx("span",{children:A(l)}),i(l.productKey)&&e.jsx(X,{color:"gray",text:l.productKey})]})}))]:[];return e.jsxs(H,{children:[e.jsxs(f,{children:[e.jsx(E,{title:a._({id:"876pfE"}),description:a._({id:"Zk8585"})}),e.jsx(Z,{rounded:!0,items:$,gridAutoColumns:"3fr 8fr"})]}),e.jsxs(f,{children:[e.jsx(E,{title:a._({id:"WVzGc2"}),description:n?a._({id:"C6vAhD"}):a._({id:"glQp+P"})}),n&&e.jsx(Z,{rounded:!0,items:W,gridAutoColumns:"3fr 8fr"})]})]})},ra=N`
  query GetAdminWorkspaceChatThreads($workspaceId: UUID!) {
    getAdminWorkspaceChatThreads(workspaceId: $workspaceId) {
      id
      title
      totalInputTokens
      totalOutputTokens
      conversationSize
      createdAt
      updatedAt
    }
  }
`,ia=N`
  fragment UserInfoFragment on UserInfo {
    id
    email
    firstName
    lastName
    createdAt
  }
`,ae=N`
  ${ia}
  query WorkspaceLookupAdminPanel($workspaceId: UUID!) {
    workspaceLookupAdminPanel(workspaceId: $workspaceId) {
      user {
        ...UserInfoFragment
      }
      workspaces {
        id
        name
        allowImpersonation
        logo
        totalUsers
        activationStatus
        createdAt
        workspaceUrls {
          customUrl
          subdomainUrl
        }
        users {
          id
          email
          firstName
          lastName
          avatarUrl
        }
        featureFlags {
          key
          value
        }
      }
    }
  }
`,la=()=>{const[t,a]=he(ie);return{updateFeatureFlagState:(p,k,b)=>{i(t)&&t.id===p&&a({...t,featureFlags:t.featureFlags?.map(I=>I.key===k?{...I,value:b}:I)})}}},te="settings-admin-workspace-detail-tabs",c={INFO:"info",BILLING:"billing",MEMBERS:"members",FEATURE_FLAGS:"feature-flags",CHATS:"chats"},Aa=()=>{const{workspaceId:t}=je(),a=le(),_=_e(ke,te),p=F(fe),k=F(ie),I=F(Ee)?.isBillingEnabled??!1,C=F(ye),{enqueueErrorSnackBar:T}=be(),{updateFeatureFlagState:y}=la(),{handleImpersonate:n,impersonatingUserId:$}=qe(),[P]=Ce(Te,{client:a,refetchQueries:[{query:ae,variables:{workspaceId:t}}]}),{data:U,loading:v}=R(ae,{client:a,variables:{workspaceId:t},skip:!t}),d=U?.workspaceLookupAdminPanel?.workspaces?.[0],A=_||c.INFO,{data:W,loading:l}=R(ra,{client:a,variables:{workspaceId:t},skip:!t||!d?.allowImpersonation||A!==c.CHATS}),{data:m}=R(Pe,{client:a,variables:{workspaceIds:t?[t]:[]},skip:!t,fetchPolicy:"network-only"}),z=W?.getAdminWorkspaceChatThreads??[],oe=async(s,u)=>{if(!t)return;const S=d?.featureFlags?.find(h=>h.key===s)?.value;y(t,s,u),await P({variables:{workspaceId:t,featureFlag:s,value:u},onError:h=>{i(S)&&y(t,s,S),T({message:`Failed to update feature flag. ${h.message}`})}})},de=[{id:c.INFO,title:r._({id:"CE+M2e"}),Icon:Ue},...I?[{id:c.BILLING,title:r._({id:"R+w/Va"}),Icon:ne}]:[],...p?.canImpersonate?[{id:c.MEMBERS,title:r._({id:"wlQNTg"}),Icon:re}]:[],...C?[{id:c.FEATURE_FLAGS,title:r._({id:"+ZqAYI"}),Icon:ve}]:[],...d?.allowImpersonation?[{id:c.CHATS,title:r._({id:"8Q+lLG"}),Icon:we}]:[]],ce=d?.name||t||"";return v?e.jsx(De,{}):e.jsx(Fe,{links:[{children:r._({id:"/IX/7x"}),href:G(K.AdminPanel)},{children:r._({id:"05jO4l"}),href:Ge},{children:ce}],children:e.jsxs(Le,{children:[e.jsx(Re,{tabs:de,behaveAsLinks:!1,componentInstanceId:te}),A===c.INFO&&d&&e.jsx(He,{activeWorkspace:d,workspaceUpgradeStatus:m?.getUpgradeStatus?.find(s=>s?.workspaceId===t)}),A===c.BILLING&&I&&t&&e.jsx(na,{workspaceId:t}),A===c.MEMBERS&&d&&e.jsxs(f,{children:[e.jsx(E,{title:r._({id:"wlQNTg"}),description:r._({id:"wtxjAY"})}),e.jsx(M,{children:e.jsxs(J,{children:[e.jsxs(j,{gridTemplateColumns:"1fr 2fr 100px",children:[e.jsx(x,{children:r._({id:"6YtxFj"})}),e.jsx(x,{children:r._({id:"O3oNi5"})}),e.jsx(x,{align:"right",children:r._({id:"7L01XJ"})})]}),d.users?.map(s=>{const u=s.id;return i(u)?e.jsxs(j,{gridTemplateColumns:"1fr 2fr 100px",to:G(K.AdminPanelUserDetail,{userId:u}),children:[e.jsxs(g,{color:L.font.color.primary,gap:L.spacing[2],overflow:"hidden",children:[e.jsx(Ne,{avatarUrl:s.avatarUrl,placeholder:`${s.firstName||""} ${s.lastName||""}`.trim()||s.email,placeholderColorSeed:s.id,size:"md",type:"rounded"}),e.jsx(Be,{text:`${s.firstName||""} ${s.lastName||""}`.trim()||"—"})]}),e.jsx(g,{children:s.email}),e.jsx(g,{align:"right",children:d.allowImpersonation&&i(p?.id)&&u!==p.id&&e.jsx($e,{Icon:We,variant:"secondary",size:"small",title:r._({id:"tSVr6t"}),onClick:S=>{S.preventDefault(),S.stopPropagation(),n(u,t)},disabled:$===u})})]},u):null})]})})]}),A===c.FEATURE_FLAGS&&d&&e.jsxs(f,{children:[e.jsx(E,{title:r._({id:"+ZqAYI"}),description:r._({id:"Dt05oz"})}),e.jsx(M,{children:e.jsxs(J,{children:[e.jsxs(j,{gridAutoColumns:"1fr 100px",mobileGridAutoColumns:"1fr 80px",children:[e.jsx(x,{children:r._({id:"YXjpZx"})}),e.jsx(x,{align:"right",children:r._({id:"uAQUqI"})})]}),d.featureFlags?.map(s=>{const S=(k?.id===t?k?.featureFlags?.find(h=>h.key===s.key)?.value:void 0)??s.value;return e.jsxs(j,{gridAutoColumns:"1fr 100px",mobileGridAutoColumns:"1fr 80px",children:[e.jsx(g,{children:s.key}),e.jsx(g,{align:"right",children:i(s.key)&&e.jsx(Oe,{value:S,onChange:h=>oe(s.key,h)})})]},s.key)})]})})]}),A===c.CHATS&&e.jsxs(f,{children:[e.jsx(E,{title:r._({id:"jTS+KY"}),description:r._({id:"qiD/6r"})}),l?e.jsx(se,{}):z.length===0?e.jsx(Me,{rounded:!0,children:e.jsx(j,{gridTemplateColumns:"1fr",children:e.jsx(g,{color:L.font.color.tertiary,align:"center",children:r._({id:"NjIy4U"})})})}):e.jsxs(M,{children:[e.jsxs(j,{gridTemplateColumns:"1fr 120px 120px",children:[e.jsx(x,{children:r._({id:"MHrjPM"})}),e.jsx(x,{align:"right",children:r._({id:"t7TeQU"})}),e.jsx(x,{align:"right",children:r._({id:"+b7T3G"})})]}),z.map(s=>e.jsxs(j,{gridTemplateColumns:"1fr 120px 120px",to:G(K.AdminPanelWorkspaceChatThread,{workspaceId:t??"",threadId:s.id}),children:[e.jsx(g,{color:L.font.color.primary,children:s.title||r._({id:"wja8aL"})}),e.jsx(g,{align:"right",children:s.conversationSize}),e.jsx(g,{align:"right",children:new Date(s.updatedAt).toLocaleDateString()})]},s.id))]})]})]})})};export{Aa as SettingsAdminWorkspaceDetail};
