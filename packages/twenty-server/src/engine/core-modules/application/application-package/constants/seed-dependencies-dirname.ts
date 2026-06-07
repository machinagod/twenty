import { getModuleDirname } from 'src/utils/get-module-dirname';
import path from 'path';

import { ASSET_PATH } from 'src/constants/assets-path';

export const SEED_DEPENDENCIES_DIRNAME = path.resolve(
  getModuleDirname(),
  path.join(
    ASSET_PATH,
    'engine/core-modules/application/application-package/constants/seed-dependencies',
  ),
);
