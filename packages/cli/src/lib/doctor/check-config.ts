import { join } from "node:path";
import { discoverConfig } from "@asheeui/utils/node";
import { toRelativePath } from "../common/file-utils";
import type { DoctorCheckResult, DoctorOptions } from "./types";

/**
 * Validates that an asheeui configuration file exists in the
 * project root or in src/.
 */
export async function checkConfigFile(
  options: DoctorOptions,
): Promise<DoctorCheckResult> {
  const cwd = options.cwd;

  // Use discoverConfig helper to check both root and src/ directories
  const rootConfig = discoverConfig(cwd);
  const srcConfig = discoverConfig(join(cwd, "src"));

  const found = [rootConfig, srcConfig].filter((path): path is string =>
    Boolean(path),
  );

  if (found.length > 0) {
    return {
      id: "config",
      title: "Configuration file",
      status: "pass",
      message: `Found ${found.map((path) => toRelativePath(cwd, path)).join(", ")}`,
    };
  }

  return {
    id: "config",
    title: "Configuration file",
    status: "fail",
    message:
      "No asheeui.config.ts or asheeui.config.js found in project root or src/.",
    fix: "Run `npx asheeui init` to generate an Ashee UI configuration file.",
  };
}
