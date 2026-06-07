import{O as g,vz as s,G0 as A,k8 as u,jQ as f,yx as d,tE as n,fA as j,Az as i,tb as y,DU as S,E2 as _,jo as C,jm as T,jl as I,k as M,fC as b,qf as h,cu as m}from"./index-DrA-SXmV.js";import{A as k}from"./AiAdminPath-B5WwcZT2.js";import{u as v}from"./useApolloAdminClient-BZ077ZFn.js";const E=i("div")({name:"StyledMessagesContainer",class:"sj1j6u0",propsAsIs:!1}),L=()=>({isUser:e})=>e?"flex-end":"flex-start",P=i("div")({name:"StyledMessageBubble",class:"sycb02g",propsAsIs:!1,vars:{"sycb02g-0":[L()]}}),R=()=>({isUser:e})=>e?d.background.tertiary:"transparent",w=()=>({isUser:e})=>e?d.font.color.secondary:d.font.color.primary,D=()=>({isUser:e})=>e?500:400,U=()=>({isUser:e})=>e?`0 ${d.spacing[2]}`:"0",z=()=>({isUser:e})=>e?"pre-wrap":"normal",N=()=>({isUser:e})=>e?"fit-content":"100%",x=i("div")({name:"StyledMessageContent",class:"s3lggd9",propsAsIs:!1,vars:{"s3lggd9-0":[R()],"s3lggd9-1":[w()],"s3lggd9-2":[D()],"s3lggd9-3":[U()],"s3lggd9-4":[z()],"s3lggd9-5":[N()]}}),G=i("span")({name:"StyledRoleLabel",class:"skse7t4",propsAsIs:!1}),$=i("span")({name:"StyledTimestamp",class:"s15re5tp",propsAsIs:!1}),q=({messages:e})=>{const o=e.filter(a=>a.role!==g.SYSTEM);return o.length===0?s.jsx(A,{rounded:!0,children:s.jsx(u,{gridTemplateColumns:"1fr",children:s.jsx(f,{color:d.font.color.tertiary,align:"center",children:n._({id:"IohPnt"})})})}):s.jsx(E,{children:o.map(a=>{const l=a.role===g.USER,r=a.parts.filter(t=>t.type==="text"&&t.textContent!==null).map(t=>t.textContent).join(`
`),c=a.parts.filter(t=>t.type==="tool-call"&&t.toolName!==null);return r.length===0&&c.length===0?null:s.jsxs(P,{isUser:l,children:[s.jsx(G,{children:a.role}),r.length>0&&s.jsx(x,{isUser:l,children:l?r:s.jsx(j,{text:r})}),c.map((t,p)=>s.jsx(x,{isUser:!1,children:n._({id:"tfaidv",values:{0:t.toolName}})},p)),s.jsx($,{children:new Date(a.createdAt).toLocaleString()})]},a.id)})})},H=y`
  query GetAdminChatThreadMessages($threadId: UUID!) {
    getAdminChatThreadMessages(threadId: $threadId) {
      thread {
        id
        title
        totalInputTokens
        totalOutputTokens
        conversationSize
        createdAt
        updatedAt
      }
      messages {
        id
        role
        parts {
          type
          textContent
          toolName
        }
        createdAt
      }
    }
  }
`,W=()=>{const{workspaceId:e,threadId:o}=S(),a=v(),{data:l,loading:r}=_(H,{client:a,variables:{threadId:o},skip:!o}),c=l?.getAdminChatThreadMessages?.thread,t=l?.getAdminChatThreadMessages?.messages??[],p=c?.title||n._({id:"wja8aL"});return r?s.jsx(C,{}):s.jsx(T,{links:[{children:n._({id:"/IX/7x"}),href:h(m.AdminPanel)},{children:n._({id:"05jO4l"}),href:k},{children:n._({id:"pmUArF"}),href:h(m.AdminPanelWorkspaceDetail,{workspaceId:e??""})},{children:p}],children:s.jsx(I,{children:s.jsxs(M,{children:[s.jsx(b,{title:p,description:n._({id:"eKz2ln"})}),s.jsx(q,{messages:t})]})})})};export{W as SettingsAdminWorkspaceChatThread};
