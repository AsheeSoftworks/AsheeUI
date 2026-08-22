import { checkConfigFile } from "./check-config";
import { checkCssImport } from "./check-css";
import { checkPeerDependencies } from "./check-deps";
import { checkRootProvider } from "./check-provider";
import { checkThemeAugmentation } from "./check-theme";

import type { DoctorCheckResult, DoctorOptions } from "./types";

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
