import { type EncryptedString } from 'src/engine/core-modules/secret-encryption/branded-strings/encrypted-string.type';
import { type SecretEncryptionService } from 'src/engine/core-modules/secret-encryption/secret-encryption.service';
import { type FlatApplicationVariable } from 'src/engine/metadata-modules/flat-application-variable/types/flat-application-variable.type';
import { stripSecretFromApplicationVariables } from 'src/engine/metadata-modules/front-component/utils/strip-secret-from-application-variables';

const makeFlatVariable = (
  overrides: Partial<FlatApplicationVariable>,
): FlatApplicationVariable => ({
  id: '1',
  key: 'KEY',
  value: 'value' as EncryptedString,
  description: '',
  isSecret: false,
  applicationId: 'app-1',
  workspaceId: '00000000-0000-0000-0000-000000000000',
  universalIdentifier: '00000000-0000-0000-0000-000000000000',
  applicationUniversalIdentifier: '00000000-0000-0000-0000-000000000000',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

const makeSecretEncryptionServiceMock = () =>
  ({
    decryptVersioned: jest.fn(
      (value: string) => `decrypted(${value})`,
    ),
  }) as unknown as SecretEncryptionService;

describe('stripSecretFromApplicationVariables', () => {
  it('should return empty object for empty array', () => {
    expect(
      stripSecretFromApplicationVariables(
        [],
        makeSecretEncryptionServiceMock(),
      ),
    ).toEqual({});
  });

  it('should include non-secret variables', () => {
    const variables = [
      makeFlatVariable({
        key: 'PUBLIC_URL',
        value: 'https://example.com' as EncryptedString,
      }),
      makeFlatVariable({
        id: '2',
        key: 'DEBUG',
        value: 'true' as EncryptedString,
      }),
    ];

    expect(
      stripSecretFromApplicationVariables(
        variables,
        makeSecretEncryptionServiceMock(),
      ),
    ).toEqual({
      PUBLIC_URL: 'https://example.com',
      DEBUG: 'true',
    });
  });

  it('should exclude secret variables', () => {
    const variables = [
      makeFlatVariable({
        key: 'PUBLIC_URL',
        value: 'https://example.com' as EncryptedString,
      }),
      makeFlatVariable({
        id: '2',
        key: 'API_SECRET',
        value: 'encrypted_secret' as EncryptedString,
        isSecret: true,
      }),
      makeFlatVariable({
        id: '3',
        key: 'DEBUG',
        value: 'true' as EncryptedString,
      }),
    ];

    const result = stripSecretFromApplicationVariables(
      variables,
      makeSecretEncryptionServiceMock(),
    );

    expect(result).toEqual({
      PUBLIC_URL: 'https://example.com',
      DEBUG: 'true',
    });
    expect(result).not.toHaveProperty('API_SECRET');
  });

  it('should decrypt non-secret encrypted values', () => {
    const secretEncryptionService = makeSecretEncryptionServiceMock();
    const variables = [
      makeFlatVariable({
        key: 'MAPBOX_PUBLIC_TOKEN',
        value: 'enc:v2:55d67060:abcdef' as EncryptedString,
      }),
    ];

    expect(
      stripSecretFromApplicationVariables(variables, secretEncryptionService),
    ).toEqual({
      MAPBOX_PUBLIC_TOKEN: 'decrypted(enc:v2:55d67060:abcdef)',
    });
    expect(secretEncryptionService.decryptVersioned).toHaveBeenCalledWith(
      'enc:v2:55d67060:abcdef',
      { workspaceId: '00000000-0000-0000-0000-000000000000' },
    );
  });

  it('should not attempt to decrypt non-encrypted values', () => {
    const secretEncryptionService = makeSecretEncryptionServiceMock();
    const variables = [
      makeFlatVariable({
        key: 'PUBLIC_URL',
        value: 'https://example.com' as EncryptedString,
      }),
    ];

    stripSecretFromApplicationVariables(variables, secretEncryptionService);

    expect(secretEncryptionService.decryptVersioned).not.toHaveBeenCalled();
  });

  it('should handle null and undefined values', () => {
    const variables = [
      makeFlatVariable({
        key: 'NULL_VALUE',
        value: null as unknown as EncryptedString | '',
      }),
      makeFlatVariable({
        id: '2',
        key: 'UNDEFINED_VALUE',
        value: undefined as unknown as EncryptedString | '',
      }),
    ];

    expect(
      stripSecretFromApplicationVariables(
        variables,
        makeSecretEncryptionServiceMock(),
      ),
    ).toEqual({
      NULL_VALUE: '',
      UNDEFINED_VALUE: '',
    });
  });

  it('should convert non-string values to strings', () => {
    const variables = [
      makeFlatVariable({
        key: 'NUMBER_VALUE',
        value: 123 as unknown as EncryptedString | '',
      }),
    ];

    expect(
      stripSecretFromApplicationVariables(
        variables,
        makeSecretEncryptionServiceMock(),
      ),
    ).toEqual({
      NUMBER_VALUE: '123',
    });
  });

  it('should return empty object when all variables are secret', () => {
    const variables = [
      makeFlatVariable({
        key: 'SECRET_1',
        value: 'val1' as EncryptedString,
        isSecret: true,
      }),
      makeFlatVariable({
        id: '2',
        key: 'SECRET_2',
        value: 'val2' as EncryptedString,
        isSecret: true,
      }),
    ];

    expect(
      stripSecretFromApplicationVariables(
        variables,
        makeSecretEncryptionServiceMock(),
      ),
    ).toEqual({});
  });
});
