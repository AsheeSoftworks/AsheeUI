/**
 * Dependency inspection utilities for AsheeUI CLI.
 * This module provides functions for inspecting a project's dependencies,
 * detecting the package manager, and determining which required packages
 * are missing.
 */

import { join } from "node:path";
import * as p from "@clack/prompts";
import { detectPackageManager, readJson } from "./file-utils";
import type { PackageManager } from "./types";

/**
 * Result of a dependency inspection pass.
 */
export interface DependencyInfo {
  /** Package manager that was detected for the project. */
  packageManager: PackageManager;
  /** Substring of required packages that are not installed yet. */
  missingDependencies: string[];
  /** True when at least one required package is already installed. */
  hasAsheeDependencies: boolean;
}

/**
 * Inspect a project's `package.json` to determine which of the supplied
 * required packages are missing and which package manager should be
 * used to install them.
 *
 * When `silent` is `false`, human-readable status lines are printed via
 * `@clack/prompts`. When `silent` is `true`, the function only returns
 * the structured {@link DependencyInfo}.
 *
 * @param directory - Project directory containing `package.json`.
 * @param requiredPackages - Package names the project must include.
 * @param silent - When `true`, suppress informational CLI output.
 * @returns A {@link DependencyInfo} describing the install state.
 *
 * @example
 * ```ts
 * const info = await inspectDependencies(process.cwd(), [
 *   "asheeui",
 * ], true);
 * if (info.missingDependencies.length > 0) {
 *   // install them with info.packageManager
 * }
 * ```
 */
export async function inspectDependencies(
  directory: string,
  requiredPackages: string[],
  silent = false,
): Promise<DependencyInfo> {
  const packageManager = await detectPackageManager(directory);
  const pkg = await readJson(join(directory, "package.json"));

  if (!pkg) {
    if (!silent) {
      p.log.warn("No package.json found in target directory.");
    }
    return {
      packageManager,
      missingDependencies: requiredPackages,
      hasAsheeDependencies: false,
    };
  }

  const deps: Record<string, string> = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };

  const installed = requiredPackages.filter((p) => deps[p]);
  const missing = requiredPackages.filter((p) => !deps[p]);

  if (!silent) {
    p.log.info(`Detected package manager: ${packageManager}`);
    if (installed.length > 0) {
      p.log.step(`Already installed: ${installed.join(", ")}`);
    }
    if (missing.length > 0) {
      p.log.step(`Missing packages to install: ${missing.join(", ")}`);
    }
  }

  return {
    packageManager,
    missingDependencies: missing,
    hasAsheeDependencies: installed.length > 0,
  };
}
