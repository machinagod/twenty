import { getModuleDirname } from 'src/utils/get-module-dirname';
import { promises as fs } from 'fs';
import { resolve, join } from 'path';

import { ASSET_PATH } from 'src/constants/assets-path';

const BUILDER_FILE_PATH = resolve(
  getModuleDirname(),
  join(
    ASSET_PATH,
    'engine/core-modules/logic-function/logic-function-drivers/constants/builder',
  ),
);

export const copyBuilder = async (buildDirectory: string) => {
  await fs.mkdir(buildDirectory, { recursive: true });
  await fs.cp(BUILDER_FILE_PATH, buildDirectory, { recursive: true });
};
