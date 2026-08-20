import { join } from "node:path";
import * as p from "@clack/prompts";
import { detectPackageManager, readJson } from "./file-utils.js";
import type { PackageManager } from "./types.js";

export interface DependencyInfo {
  packageManager: PackageManager;
  missingDependencies: string[];
  hasAsheeDependencies: boolean;
}

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
