import { getModuleDirname } from 'src/utils/get-module-dirname';
import path from 'path';

// If the code is built through the testing module, assets are not output to the dist/assets directory.
const IS_BUILT_THROUGH_TESTING_MODULE = !getModuleDirname().includes('/dist/');

export const ASSET_PATH = IS_BUILT_THROUGH_TESTING_MODULE
  ? path.resolve(getModuleDirname(), `../`)
  : path.resolve(getModuleDirname(), `../assets`);
