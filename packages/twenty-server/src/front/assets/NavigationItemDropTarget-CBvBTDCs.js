import{Cl as m,y6 as v,vz as g,Az as I,yx as s,yE as l,gc as x,xe as b,t as _}from"./index-DrA-SXmV.js";import{g as f,c as S}from"./getDndKitDropTargetId-bYffzgds.js";import{N as O}from"./openNavigationMenuItemFolderIdsState-xu1yMzeO.js";const T=()=>({$empty:r})=>r?`min-height: ${s.spacing[2]};`:"",y=I("div")({name:"StyledSlotWrapper",class:"s4u41xg",propsAsIs:!1,vars:{"s4u41xg-0":[T()]}}),$=1,P=4,h=({droppableId:r,index:t,children:o,disabled:e=!1,collisionPriority:a=$})=>{const n=f(r,t),i={droppableId:r,index:t},{ref:p}=m({id:n,disabled:e,collisionPriority:a,collisionDetector:v,data:i}),d=o==null||Array.isArray(o)&&o.length===0;return g.jsx(y,{ref:p,$empty:d,children:o})},F=r=>{const{sourceDroppableId:t}=l.useContext(x);return b(t)?t===_?!r:S({navigationMenuItemSection:"workspace",droppableId:t})!==r:!1},N=()=>({$compact:r})=>r?0:s.spacing[2],A=()=>({$highlightPosition:r})=>r==="top"?`
      top: 0;
      border-radius: 0 0 ${s.border.radius.sm}
        ${s.border.radius.sm};
      `:`
      bottom: 0;
      border-radius: ${s.border.radius.sm}
        ${s.border.radius.sm} 0 0;
      `,E=I("div")({name:"StyledDropTarget",class:"snnr98n",propsAsIs:!1,vars:{"snnr98n-0":[N()],"snnr98n-1":[A()]}}),j=({folderId:r,index:t,sectionId:o,children:e,compact:a=!1,dropTargetIdOverride:n,highlightPosition:i="bottom"})=>{const{activeDropTargetId:p,forbiddenDropTargetId:d}=l.useContext(O),c=n??`${o}-${r??"orphan"}-${t}`,D=p===c,u=d===c;return g.jsx(E,{$compact:a,$highlightPosition:i,"data-drag-over":D&&!u?"true":void 0,"data-drop-forbidden":u?"true":void 0,children:e})};export{P as F,j as N,h as a,F as u};
