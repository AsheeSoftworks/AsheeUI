/**
 * Root provider check for AsheeUI CLI doctor command.
 * This module provides the checkRootProvider function that validates
 * whether the application root is wrapped with AsheeUIProvider.
 */

import { join } from "node:path";
import {
  containsRootProvider,
  ENTRYPOINT_CANDIDATES,
  PROVIDER_TAG,
} from "../../utils/audit";
import { firstExisting, readTextFile } from "../common/file-utils";
import type { DoctorCheckResult, DoctorOptions } from "./types";

export { ENTRYPOINT_CANDIDATES } from "../../utils/audit";

/**
 * Validate that the root entrypoint wraps the app with `AsheeUIProvider`
 * (or imports from `"asheeui"`).
 *
 * Scans each candidate in {@link ENTRYPOINT_CANDIDATES} and reports
 * `pass` on the first one that contains a root-provider reference;
 * otherwise returns `fail` with a `fix` describing the expected
 * wrapping.
 *
 * @param options - {@link DoctorOptions} containing the working directory.
 * @returns A {@link DoctorCheckResult} describing the outcome.
 */
export async function checkRootProvider(
  options: DoctorOptions,
): Promise<DoctorCheckResult> {
  const cwd = options.cwd;
  for (const candidate of ENTRYPOINT_CANDIDATES) {
    const content = await readTextFile(join(cwd, candidate));
    if (content === null) continue;
    if (containsRootProvider(content)) {
      return {
        id: "provider",
        title: "Root provider",
        status: "pass",
        message: content.includes(`<${PROVIDER_TAG}`)
          ? `<${PROVIDER_TAG}> found in ${candidate}`
          : `asheeui import found in ${candidate}`,
      };
    }
  }

  const entry = await firstExisting(cwd, ENTRYPOINT_CANDIDATES);
  return {
    id: "provider",
    title: "Root provider",
    status: "fail",
    message: entry
      ? `No AsheeUIProvider or asheeui import found in ${entry}.`
      : "No common application entrypoint found (src/main.tsx, src/App.tsx, app/layout.tsx, etc.).",
    fix: entry
      ? `Wrap your application root with <AsheeUIProvider> in ${entry}. See the Ashee UI docs for setup instructions.`
      : "Create an entrypoint (e.g. src/main.tsx) and wrap the root with <AsheeUIProvider>.",
  };
}
