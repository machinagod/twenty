import { getRecordScopingColumns } from 'src/engine/metadata-modules/record-scoping-rule/utils/get-record-scoping-columns.util';

import {
  buildFlatEntityMaps,
  OPPORTUNITY_FIELDS,
  OPPORTUNITY_OBJECT,
  WORKSPACE_MEMBER_ID,
} from 'src/engine/metadata-modules/record-scoping-rule/utils/__tests__/record-scoping-rule-fixtures';

describe('getRecordScopingColumns', () => {
  const columns = getRecordScopingColumns({
    flatObjectMetadata: OPPORTUNITY_OBJECT,
    flatFieldMetadataMaps: buildFlatEntityMaps(OPPORTUNITY_FIELDS),
    workspaceMemberObjectMetadataId: WORKSPACE_MEMBER_ID,
  });

  it('maps many-to-one relations to their join column', () => {
    expect(columns.get('ownerId')).toEqual({
      column: 'ownerId',
      valueKind: 'WORKSPACE_MEMBER',
    });
    expect(columns.get('companyId')).toEqual({
      column: 'companyId',
      valueKind: 'UUID',
    });
  });

  it('maps the actor to its workspace member column', () => {
    expect(columns.get('createdByWorkspaceMemberId')).toEqual({
      column: 'createdByWorkspaceMemberId',
      valueKind: 'WORKSPACE_MEMBER',
    });
  });

  it('keeps comparable scalars, with select options', () => {
    expect(columns.get('name')?.valueKind).toBe('TEXT');
    expect(columns.get('externalId')?.valueKind).toBe('UUID');
    expect(columns.get('probability')?.valueKind).toBe('NUMBER');
    expect(columns.get('isWon')?.valueKind).toBe('BOOLEAN');
    expect(columns.get('stage')).toEqual({
      column: 'stage',
      valueKind: 'SELECT',
      selectOptionValues: ['NEW', 'WON'],
    });
  });

  it('drops one-to-many relations, unsupported types and system scalars', () => {
    expect([...columns.keys()].sort()).toEqual([
      'companyId',
      'createdByWorkspaceMemberId',
      'externalId',
      'isWon',
      'name',
      'ownerId',
      'probability',
      'stage',
    ]);
  });

  it('treats every relation as a plain id without a workspace member object', () => {
    const withoutMembers = getRecordScopingColumns({
      flatObjectMetadata: OPPORTUNITY_OBJECT,
      flatFieldMetadataMaps: buildFlatEntityMaps(OPPORTUNITY_FIELDS),
      workspaceMemberObjectMetadataId: undefined,
    });

    expect(withoutMembers.get('ownerId')?.valueKind).toBe('UUID');
  });

  it('treats a select without options as having no valid values', () => {
    const stageWithoutOptions = OPPORTUNITY_FIELDS.map((field) =>
      field.name === 'stage' ? { ...field, options: null } : field,
    );
    const result = getRecordScopingColumns({
      flatObjectMetadata: OPPORTUNITY_OBJECT,
      flatFieldMetadataMaps: buildFlatEntityMaps(stageWithoutOptions as never),
      workspaceMemberObjectMetadataId: WORKSPACE_MEMBER_ID,
    });

    expect(result.get('stage')?.selectOptionValues).toEqual([]);
  });
});
