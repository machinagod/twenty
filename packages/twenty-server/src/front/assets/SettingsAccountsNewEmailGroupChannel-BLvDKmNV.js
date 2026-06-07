import{tb as m,Dp as h,dL as _,dM as g,Dc as S,Dv as G,EI as x,yE as u,qj as y,cu as l,vz as e,jm as j,jl as v,k as N,fC as f,jp as A,j5 as b,qf as d}from"./index-DrA-SXmV.js";const L=m`
  mutation CreateEmailGroupChannel($input: CreateEmailGroupChannelInput!) {
    createEmailGroupChannel(input: $input) {
      messageChannel {
        id
        handle
        visibility
        type
        isSyncEnabled
        excludeGroupEmails
        contactAutoCreationPolicy
      }
      forwardingAddress
    }
  }
`,k=()=>{const[a,{loading:r,error:n}]=h(L,{refetchQueries:[{query:_},{query:g}]});return{createEmailGroupChannel:s=>a({variables:{input:{handle:s}}}),loading:r,error:n}},M=()=>{const{i18n:a,_:r}=S(),n=G(),{enqueueErrorSnackBar:o}=x(),{createEmailGroupChannel:s,loading:t}=k(),[i,E]=u.useState(""),p=y().safeParse(i).success&&!t,C=u.useCallback(async()=>{try{const c=(await s(i)).data?.createEmailGroupChannel.messageChannel.id;c&&n(l.EmailGroupChannelDetail,{messageChannelId:c})}catch{o({message:a._({id:"L9UnOU"})})}},[s,i,n,o,r]);return e.jsx(j,{title:a._({id:"VJZNJt"}),links:[{children:a._({id:"pmUArF"}),href:d(l.General)},{children:a._({id:"O3oNi5"}),href:d(l.WorkspaceEmail)},{children:a._({id:"VJZNJt"})}],actionButton:e.jsx(b,{isSaveDisabled:!p,isCancelDisabled:t,isLoading:t,onCancel:()=>n(l.WorkspaceEmail),onSave:C}),children:e.jsx(v,{children:e.jsxs(N,{children:[e.jsx(f,{title:a._({id:"hzKQCy"}),description:a._({id:"Z4WP0F"})}),e.jsx(A,{instanceId:"email-group-source",label:a._({id:"5f1fxa"}),placeholder:"support@mycompany.com",value:i,onChange:E,disabled:t})]})})})};export{M as SettingsAccountsNewEmailGroupChannel};
