// Production stub for sdk-client-package-dirname. The real file calls
// require.resolve('twenty-client-sdk/core') in dev mode and falls back to
// ASSET_PATH in built mode. The bundle has no node_modules at runtime, so
// require.resolve fails. The bundle is always "built mode", so collapse to
// the ASSET_PATH branch.
import path from 'path';
import { getModuleDirname } from 'src/utils/get-module-dirname';

// Mirror ASSET_PATH's built-mode resolution without re-importing assets-path
// (which has its own dev-mode branch we don't need here).
export const SDK_CLIENT_PACKAGE_DIRNAME = path.join(
  getModuleDirname(),
  'assets',
  'twenty-client-sdk',
);
