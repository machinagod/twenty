import{tb as P,Dp as g,BK as j,Ez as D,a3 as J,a4 as X,kX as H,yg as Z,o3 as ee,EN as se,yE as te,u4 as ae,bf as oe,kN as ie,l2 as re,l1 as ne,l0 as ce,cO as G,sy as A,xe as d}from"./index-DrA-SXmV.js";import{s as F,a as N}from"./SettingsRolesQueryEffect-BqZK-pMH.js";const k=P`
  fragment RowLevelPermissionPredicateFragment on RowLevelPermissionPredicate {
    id
    fieldMetadataId
    objectMetadataId
    operand
    subFieldName
    workspaceMemberFieldMetadataId
    workspaceMemberSubFieldName
    rowLevelPermissionPredicateGroupId
    positionInRowLevelPermissionPredicateGroup
    roleId
    value
  }
`,K=P`
  fragment RowLevelPermissionPredicateGroupFragment on RowLevelPermissionPredicateGroup {
    id
    parentRowLevelPermissionPredicateGroupId
    logicalOperator
    positionInRowLevelPermissionPredicateGroup
    roleId
    objectMetadataId
  }
`,de=P`
  ${k}
  ${K}
  mutation UpsertRowLevelPermissionPredicates(
    $input: UpsertRowLevelPermissionPredicatesInput!
  ) {
    upsertRowLevelPermissionPredicates(input: $input) {
      predicates {
        ...RowLevelPermissionPredicateFragment
      }
      predicateGroups {
        ...RowLevelPermissionPredicateGroupFragment
      }
    }
  }
`,le=()=>g(de),pe=P`
  fragment AgentFields on Agent {
    id
    name
    label
    description
    icon
    prompt
    modelId
    responseFormat
    roleId
    isCustom
    modelConfiguration
    evaluationInputs
    applicationId
    createdAt
    updatedAt
  }
`,me=P`
  fragment ApiKeyForRoleFragment on ApiKeyForRole {
    id
    name
    expiresAt
    revokedAt
  }
`,Re=P`
  fragment FieldPermissionFragment on FieldPermission {
    objectMetadataId
    fieldMetadataId
    canReadFieldValue
    canUpdateFieldValue
    id
    roleId
  }
`,ue=P`
  fragment ObjectPermissionFragment on ObjectPermission {
    objectMetadataId
    canReadObjectRecords
    canUpdateObjectRecords
    canSoftDeleteObjectRecords
    canDestroyObjectRecords
    restrictedFields
    rowLevelPermissionPredicates {
      ...RowLevelPermissionPredicateFragment
    }
    rowLevelPermissionPredicateGroups {
      ...RowLevelPermissionPredicateGroupFragment
    }
  }
  ${k}
  ${K}
`,Pe=P`
  fragment RolePermissionFlagFragment on RolePermissionFlag {
    id
    flag
    roleId
  }
`,be=P`
  fragment RoleFragment on Role {
    id
    label
    description
    icon
    canUpdateAllSettings
    canAccessAllTools
    isEditable
    canReadAllObjectRecords
    canUpdateAllObjectRecords
    canSoftDeleteAllObjectRecords
    canDestroyAllObjectRecords
    canBeAssignedToUsers
    canBeAssignedToAgents
    canBeAssignedToApiKeys
  }
`,Ae=P`
  fragment PartialWorkspaceMemberQueryFragment on WorkspaceMember {
    id
    name {
      firstName
      lastName
    }
    avatarUrl
    userEmail
    userWorkspaceId
  }
`,f=P`
  ${Ae}
  ${be}
  ${pe}
  ${me}
  ${Pe}
  ${ue}
  ${Re}
  ${k}
  ${K}
  query GetRoles {
    getRoles {
      ...RoleFragment
      workspaceMembers {
        ...PartialWorkspaceMemberQueryFragment
      }
      agents {
        ...AgentFields
      }
      apiKeys {
        ...ApiKeyForRoleFragment
      }
      permissionFlags {
        ...RolePermissionFlagFragment
      }
      objectPermissions {
        ...ObjectPermissionFragment
      }
      fieldPermissions {
        ...FieldPermissionFragment
      }
      rowLevelPermissionPredicates {
        ...RowLevelPermissionPredicateFragment
      }
      rowLevelPermissionPredicateGroups {
        ...RowLevelPermissionPredicateGroupFragment
      }
    }
  }
`,fe=e=>{const n=j(F,e),a=D(F,e),[r]=g(J);return{addAgentToRoleAndUpdateState:async({agentId:p})=>{const{data:c}=await r({variables:{agentId:p,roleId:e},awaitRefetchQueries:!0,refetchQueries:["GetRoles"]});return c?.assignRoleToAgent},updateAgentRoleDraftState:({agent:p})=>{a({...n,agents:[...n.agents,p]})},addAgentsToRole:async({roleId:p,agentIds:c})=>{await Promise.all(c.map(u=>r({variables:{roleId:p,agentId:u}})))}}},ge=e=>{const n=j(F,e),a=D(F,e),[r]=g(X);return{addApiKeyToRoleAndUpdateState:async({apiKeyId:p})=>{const{data:c}=await r({variables:{apiKeyId:p,roleId:e},awaitRefetchQueries:!0,refetchQueries:["GetRoles"]});return c?.assignRoleToApiKey},updateApiKeyRoleDraftState:({apiKey:p})=>{a({...n,apiKeys:[...n.apiKeys,p]})},addApiKeysToRole:async({roleId:p,apiKeyIds:c})=>{await Promise.all(c.map(u=>r({variables:{roleId:p,apiKeyId:u}})))}}},Fe=e=>{const n=D(N,e),a=j(F,e),r=D(F,e),[l]=g(H);return{addWorkspaceMemberToRoleAndUpdateState:async({workspaceMemberId:c})=>{const{data:u}=await l({variables:{workspaceMemberId:c,roleId:e}});if(u?.updateWorkspaceMemberRole!==void 0){const I=u.updateWorkspaceMemberRole,E=[...a.workspaceMembers,{id:I.id,name:I.name,colorScheme:I.colorScheme,userEmail:I.userEmail}],O={...a,workspaceMembers:E};n(O),r(O)}return u?.updateWorkspaceMemberRole},updateWorkspaceMemberRoleDraftState:({workspaceMember:c})=>{r({...a,workspaceMembers:[...a.workspaceMembers,{id:c.id,name:c.name,userEmail:c.userEmail,avatarUrl:c.avatarUrl}]})},addWorkspaceMembersToRole:async({roleId:c,workspaceMemberIds:u})=>{await Promise.all(u.map(I=>l({variables:{roleId:c,workspaceMemberId:I}})))}}},Ie=(e,n)=>Z(e,a=>{if(!ee.isNonEmptyArray(a.fieldPermissions))return;const r=a.fieldPermissions.findIndex(l=>l.fieldMetadataId===n);return r>-1&&a.fieldPermissions.splice(r,1),a}),we=()=>{const e=se();return{removeFieldPermissionInDraftRole:te.useCallback((a,r)=>{const l=e.get(F.atomFamily(a)),b=Ie(l,r);e.set(F.atomFamily(a),b)},[e])}},Me=(e,n)=>{const a=n?.find(r=>r.fieldMetadataId===e.fieldMetadataId);return a?e.canReadFieldValue!==a.canReadFieldValue||e.canUpdateFieldValue!==a.canUpdateFieldValue:!0},Oe=(e,n)=>{if(!n)return Object.fromEntries(Object.entries(e).filter(([,l])=>l!==void 0));const a={},r=new Set([...Object.keys(e),...Object.keys(n)]);for(const l of r){const b=e[l],M=n[l];ae(b,M)||(a[l]=b)}return a},ve=["label","description","icon","canUpdateAllSettings","canAccessAllTools","canReadAllObjectRecords","canUpdateAllObjectRecords","canSoftDeleteAllObjectRecords","canDestroyAllObjectRecords","canBeAssignedToUsers","canBeAssignedToAgents","canBeAssignedToApiKeys"],De=({roleId:e,isCreateMode:n,onSuccess:a})=>{const[r]=g(oe),[l]=g(ie),[b]=g(re),[M]=g(ne),[p]=g(ce),[c]=le(),{addWorkspaceMembersToRole:u}=Fe(e),{addAgentsToRole:I}=fe(e),{addApiKeysToRole:E}=ge(e),O=j(N,e),s=j(F,e),m=Oe(s,O),U=s.fieldPermissions?.filter(t=>{const o=!O?.fieldPermissions?.some(T=>T.fieldMetadataId===t.fieldMetadataId);return t.canReadFieldValue!==!1&&t.canUpdateFieldValue!==!1&&o}),y=(m.fieldPermissions?.filter(t=>!U?.some(o=>t.fieldMetadataId===o.fieldMetadataId))??[]).filter(t=>Me(t,O?.fieldPermissions)),{removeFieldPermissionInDraftRole:W}=we(),h=()=>{if(G(U)===!0)for(const t of U)W(e,t.fieldMetadataId)},V=async()=>{const{data:t}=await r({variables:{createRoleInput:{id:e,label:s.label,description:s.description,icon:s.icon,canUpdateAllSettings:s.canUpdateAllSettings,canAccessAllTools:s.canAccessAllTools,canReadAllObjectRecords:s.canReadAllObjectRecords,canUpdateAllObjectRecords:s.canUpdateAllObjectRecords,canSoftDeleteAllObjectRecords:s.canSoftDeleteAllObjectRecords,canDestroyAllObjectRecords:s.canDestroyAllObjectRecords,canBeAssignedToUsers:s.canBeAssignedToUsers,canBeAssignedToAgents:s.canBeAssignedToAgents,canBeAssignedToApiKeys:s.canBeAssignedToApiKeys}},refetchQueries:[A(f)??""]});if(!t)return;const o=t.createOneRole.id;await $(o),await x(o),d(a)&&await a(o)},Q=async()=>{d(m.permissionFlags)&&await b({variables:{upsertPermissionFlagsInput:{roleId:e,permissionFlagKeys:s.permissionFlags?.map(t=>t.flag)??[]}},refetchQueries:[A(f)??""]}),ve.some(t=>t in m)&&await l({variables:{updateRoleInput:{id:e,update:{label:s.label,description:s.description,icon:s.icon,canUpdateAllSettings:s.canUpdateAllSettings,canAccessAllTools:s.canAccessAllTools,canReadAllObjectRecords:s.canReadAllObjectRecords,canUpdateAllObjectRecords:s.canUpdateAllObjectRecords,canSoftDeleteAllObjectRecords:s.canSoftDeleteAllObjectRecords,canDestroyAllObjectRecords:s.canDestroyAllObjectRecords,canBeAssignedToUsers:s.canBeAssignedToUsers,canBeAssignedToAgents:s.canBeAssignedToAgents,canBeAssignedToApiKeys:s.canBeAssignedToApiKeys}}},refetchQueries:[A(f)??""]}),d(m.objectPermissions)&&await M({variables:{upsertObjectPermissionsInput:{roleId:e,objectPermissions:s.objectPermissions?.map(t=>({objectMetadataId:t.objectMetadataId,canReadObjectRecords:t.canReadObjectRecords,canUpdateObjectRecords:t.canUpdateObjectRecords,canSoftDeleteObjectRecords:t.canSoftDeleteObjectRecords,canDestroyObjectRecords:t.canDestroyObjectRecords}))??[]}},refetchQueries:[A(f)??""]}),G(y)===!0&&await p({variables:{upsertFieldPermissionsInput:{roleId:e,fieldPermissions:y.map(t=>({objectMetadataId:t.objectMetadataId,fieldMetadataId:t.fieldMetadataId,canReadFieldValue:t.canReadFieldValue,canUpdateFieldValue:t.canUpdateFieldValue}))??[]}},refetchQueries:[A(f)??""]}),(d(m.rowLevelPermissionPredicates)||d(m.rowLevelPermissionPredicateGroups))&&await _(e)},_=async t=>{const o=s.rowLevelPermissionPredicates??[],T=s.rowLevelPermissionPredicateGroups??[],L=o.reduce((R,v)=>{const w=v.objectMetadataId;return d(R[w])||(R[w]=[]),R[w].push(v),R},{}),C=O?.rowLevelPermissionPredicates??[],Y=new Set(C.map(R=>R.objectMetadataId));for(const R of Y)d(L[R])||(L[R]=[]);for(const[R,v]of Object.entries(L)){const w=new Set(v.map(i=>i.rowLevelPermissionPredicateGroupId).filter(d)),B=i=>{const S=T.find(z=>z.id===i);d(S?.parentRowLevelPermissionPredicateGroupId)&&!w.has(S.parentRowLevelPermissionPredicateGroupId)&&(w.add(S.parentRowLevelPermissionPredicateGroupId),B(S.parentRowLevelPermissionPredicateGroupId))};for(const i of w)B(i);const q=T.filter(i=>w.has(i.id));await c({variables:{input:{roleId:t,objectMetadataId:R,predicates:v.map(i=>({id:i.id,fieldMetadataId:i.fieldMetadataId,operand:i.operand,value:i.value,subFieldName:i.subFieldName,workspaceMemberFieldMetadataId:i.workspaceMemberFieldMetadataId,workspaceMemberSubFieldName:i.workspaceMemberSubFieldName,rowLevelPermissionPredicateGroupId:i.rowLevelPermissionPredicateGroupId,positionInRowLevelPermissionPredicateGroup:i.positionInRowLevelPermissionPredicateGroup})),predicateGroups:q.map(i=>({id:i.id,objectMetadataId:R,parentRowLevelPermissionPredicateGroupId:i.parentRowLevelPermissionPredicateGroupId,logicalOperator:i.logicalOperator,positionInRowLevelPermissionPredicateGroup:i.positionInRowLevelPermissionPredicateGroup}))}},refetchQueries:[A(f)??""],awaitRefetchQueries:!0})}},$=async t=>{d(m.permissionFlags)&&await b({variables:{upsertPermissionFlagsInput:{roleId:t,permissionFlagKeys:s.permissionFlags?.map(o=>o.flag)??[]}},refetchQueries:[A(f)??""]}),d(m.objectPermissions)&&await M({variables:{upsertObjectPermissionsInput:{roleId:t,objectPermissions:s.objectPermissions?.map(o=>({objectMetadataId:o.objectMetadataId,canReadObjectRecords:o.canReadObjectRecords,canUpdateObjectRecords:o.canUpdateObjectRecords,canSoftDeleteObjectRecords:o.canSoftDeleteObjectRecords,canDestroyObjectRecords:o.canDestroyObjectRecords}))??[]}},refetchQueries:[A(f)??""]}),G(y)===!0&&await p({variables:{upsertFieldPermissionsInput:{roleId:t,fieldPermissions:y.map(o=>({objectMetadataId:o.objectMetadataId,fieldMetadataId:o.fieldMetadataId,canReadFieldValue:o.canReadFieldValue,canUpdateFieldValue:o.canUpdateFieldValue}))??[]}},refetchQueries:[A(f)??""]}),(d(m.rowLevelPermissionPredicates)||d(m.rowLevelPermissionPredicateGroups))&&await _(t)},x=async t=>{d(m.workspaceMembers)&&s.canBeAssignedToUsers&&await u({roleId:t,workspaceMemberIds:s.workspaceMembers.map(o=>o.id)}),d(m.agents)&&s.canBeAssignedToAgents&&await I({roleId:t,agentIds:s.agents.map(o=>o.id)}),d(m.apiKeys)&&s.canBeAssignedToApiKeys&&await E({roleId:t,apiKeyIds:s.apiKeys.map(o=>o.id)}),d(a)&&await a(e)};return{saveDraftRoleToDB:async()=>{h(),n?await V():await Q()}}};export{f as G,fe as a,ge as b,Fe as c,Oe as g,De as u};
