import { join } from "node:path";
import { firstExisting, readTextFile } from "../common/file-utils";
import type { DoctorCheckResult, DoctorOptions } from "./types";

export const ENTRYPOINT_CANDIDATES = [
  "src/main.tsx",
  "src/index.tsx",
  "src/App.tsx",
  "src/app/layout.tsx",
  "app/layout.tsx",
];

/**
 * Validates that the root entrypoint wraps the app with AsheeUIProvider
 * or imports from "asheeui/config".
 */
export async function checkRootProvider(
  options: DoctorOptions,
): Promise<DoctorCheckResult> {
  const cwd = options.cwd;
  for (const candidate of ENTRYPOINT_CANDIDATES) {
    const content = await readTextFile(join(cwd, candidate));
    if (content === null) continue;
    if (
      content.includes("asheeui/config") ||
      content.includes("<AsheeUIProvider")
    ) {
      return {
        id: "provider",
        title: "Root provider",
        status: "pass",
        message: content.includes("<AsheeUIProvider")
          ? `<AsheeUIProvider> found in ${candidate}`
          : `asheeui/config import found in ${candidate}`,
      };
    }
  }

  const entry = await firstExisting(cwd, ENTRYPOINT_CANDIDATES);
  return {
    id: "provider",
    title: "Root provider",
    status: "fail",
    message: entry
      ? `No AsheeUIProvider or asheeui/config import found in ${entry}.`
      : "No common application entrypoint found (src/main.tsx, src/App.tsx, app/layout.tsx, etc.).",
    fix: entry
      ? `Wrap your application root with <AsheeUIProvider> in ${entry}. See the Ashee UI docs for setup instructions.`
      : "Create an entrypoint (e.g. src/main.tsx) and wrap the root with <AsheeUIProvider>.",
  };
}
