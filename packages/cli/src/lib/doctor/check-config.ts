/**
 * Config file check for AsheeUI CLI doctor command.
 * This module provides the checkConfigFile function that validates
 * whether an asheeui configuration file exists in the project.
 */

import { findAsheeConfigFile } from "../../utils/audit";
import { toRelativePath } from "../common/file-utils";
import type { DoctorCheckResult, DoctorOptions } from "./types";

/**
 * Validate that an asheeui configuration file exists in the
 * project root or in `src/`.
 *
 * The file is optional: the provider falls back to the library defaults, and
 * an inline config object works just as well, so a project without one is not
 * broken. Returns `pass` when {@link findAsheeConfigFile} locates one and
 * `info` otherwise.
 *
 * @param options - {@link DoctorOptions} containing the working directory.
 * @returns A {@link DoctorCheckResult} describing the outcome.
 */
export async function checkConfigFile(
  options: DoctorOptions,
): Promise<DoctorCheckResult> {
  const cwd = options.cwd;

  const configPath = findAsheeConfigFile(cwd);

  if (configPath) {
    return {
      id: "config",
      title: "Configuration file",
      status: "pass",
      message: `Found ${toRelativePath(cwd, configPath)}`,
    };
  }

  return {
    id: "config",
    title: "Configuration file",
    status: "info",
    message:
      "No asheeui.config.ts or asheeui.config.js found. This file is optional: without it the provider uses the library defaults, and an inline config object works too. Create one to keep your settings in a single place, or run `npx asheeui init` to scaffold it.",
  };
}
