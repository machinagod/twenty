import{tb as A,vz as t,aI as a,Az as C,Dp as b,fC as d,tE as n,G0 as j,xZ as v}from"./index-DrA-SXmV.js";import{S as x,a as l}from"./SettingsAccountsVisibilityIcon-q9CVcldb.js";import{a as y}from"./SettingsOptionCardContentToggle-CHCaKnMc.js";import{S as c}from"./index-B8LxJDfd.js";const S=A`
  mutation UpdateCalendarChannel($input: UpdateCalendarChannelInput!) {
    updateCalendarChannel(input: $input) {
      id
      visibility
      isContactAutoCreationEnabled
      contactAutoCreationPolicy
    }
  }
`,r=C("div")({name:"StyledCardMediaContainer",class:"s13a7ob6",propsAsIs:!1}),g=[{title:{id:"wqF3jl"},description:{id:"MHLapp"},value:a.SHARE_EVERYTHING,cardMedia:t.jsx(r,{children:t.jsx(l,{subject:"active",body:"active"})})},{title:{id:"6GBt0m"},description:{id:"zii2Qj"},value:a.METADATA,cardMedia:t.jsx(r,{children:t.jsx(l,{subject:"active",body:"inactive"})})}],h=({onChange:i,value:s=a.SHARE_EVERYTHING})=>t.jsx(x,{name:"event-visibility",options:g,value:s,onChange:i}),E=C("div")({name:"StyledDetailsContainer",class:"sxvfjl",propsAsIs:!1}),M=({calendarChannel:i})=>{const[s]=b(S),o=e=>{s({variables:{input:{id:i.id,update:e}}})},p=e=>{o({visibility:e})},u=e=>{o({isContactAutoCreationEnabled:e})};return t.jsxs(E,{children:[t.jsxs(c,{children:[t.jsx(d,{title:n._({id:"poC90w"}),description:n._({id:"bQkkFU"})}),t.jsx(h,{value:i.visibility,onChange:p})]}),t.jsxs(c,{children:[t.jsx(d,{title:n._({id:"Y2y0mC"}),description:n._({id:"YRT7ZW"})}),t.jsx(j,{rounded:!0,children:t.jsx(y,{Icon:v,title:n._({id:"2zJkmL"}),description:n._({id:"lgw3U4"}),checked:i.isContactAutoCreationEnabled,onChange:()=>{u(!i.isContactAutoCreationEnabled)}})})]})]})};export{M as S};
