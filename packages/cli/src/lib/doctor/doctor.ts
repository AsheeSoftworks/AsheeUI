import { checkConfigFile } from "./check-config.js";
import { checkCssImport } from "./check-css.js";
import { checkPeerDependencies } from "./check-deps.js";
import { checkRootProvider } from "./check-provider.js";
import { checkThemeAugmentation } from "./check-theme.js";

import type { DoctorCheckResult, DoctorOptions } from "./types.js";

export async function runDoctorChecks(
  options: DoctorOptions,
): Promise<DoctorCheckResult[]> {
  const cwd = options.cwd;
  return [
    await checkConfigFile({ cwd }),
    await checkCssImport({ cwd }),
    await checkPeerDependencies({ cwd }),
    await checkRootProvider({ cwd }),
    await checkThemeAugmentation(cwd),
  ];
}
