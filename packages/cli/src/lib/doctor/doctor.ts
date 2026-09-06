import { checkConfigFile } from "./check-config";
import { checkCssImport } from "./check-css";
import { checkPeerDependencies } from "./check-deps";
import { checkRootProvider } from "./check-provider";
import { checkThemeAugmentation } from "./check-theme";

import type { DoctorCheckResult, DoctorOptions } from "./types";

/**
 * Run every doctor check against the project at `options.cwd`.
 *
 * The checks run sequentially in a fixed order:
 * 1. {@link checkConfigFile}
 * 2. {@link checkCssImport}
 * 3. {@link checkPeerDependencies}
 * 4. {@link checkRootProvider}
 * 5. {@link checkThemeAugmentation}
 *
 * @param options - {@link DoctorOptions} containing the working directory.
 * @returns An array of {@link DoctorCheckResult} values, one per check.
 *
 * @example
 * ```ts
 * const results = await runDoctorChecks({ cwd: process.cwd() });
 * const failed = results.filter((r) => r.status === "fail");
 * if (failed.length > 0) {
 *   // suggest running `asheeui fix`
 * }
 * ```
 */
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
