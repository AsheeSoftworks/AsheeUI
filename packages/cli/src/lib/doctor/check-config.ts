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
 * Returns `pass` when {@link findAsheeConfigFile} locates one; `fail`
 * otherwise (with a `fix` hint pointing at `npx asheeui init`).
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
    status: "fail",
    message:
      "No asheeui.config.ts or asheeui.config.js found in project root or src/.",
    fix: "Run `npx asheeui init` to generate an Ashee UI configuration file.",
  };
}
