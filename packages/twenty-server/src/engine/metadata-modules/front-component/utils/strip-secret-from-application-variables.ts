import { isNonEmptyString } from '@sniptt/guards';

import { isEncryptedString } from 'src/engine/core-modules/secret-encryption/branded-strings/is-encrypted-string.util';
import { type SecretEncryptionService } from 'src/engine/core-modules/secret-encryption/secret-encryption.service';
import { type FlatApplicationVariable } from 'src/engine/metadata-modules/flat-application-variable/types/flat-application-variable.type';

// Builds the variable map handed to a front component: secrets are dropped (a
// front component runs client-side and must never receive them) and non-secret
// values are decrypted, since every value is stored encrypted at rest. This
// mirrors `buildEnvVar` on the logic-function path — without the decrypt step
// the client receives the raw `enc:v2:` ciphertext instead of the value.
export const stripSecretFromApplicationVariables = (
  flatApplicationVariables: FlatApplicationVariable[],
  secretEncryptionService: SecretEncryptionService,
): Record<string, string> => {
  return flatApplicationVariables.reduce<Record<string, string>>(
    (acc, flatApplicationVariable) => {
      if (flatApplicationVariable.isSecret) {
        return acc;
      }

      const value = String(flatApplicationVariable.value ?? '');

      // TODO: After 2-9 slow instance command has run everywhere, turn
      // the else branch into an invariant violation for non-empty values.
      acc[flatApplicationVariable.key] =
        isNonEmptyString(value) && isEncryptedString(value)
          ? secretEncryptionService.decryptVersioned(value, {
              workspaceId: flatApplicationVariable.workspaceId,
            })
          : value;

      return acc;
    },
    {},
  );
};
