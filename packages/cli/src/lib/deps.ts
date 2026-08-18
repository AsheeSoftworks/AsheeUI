import { join } from "node:path";
import { detectPackageManager, readJson } from "./file-utils";
import type { PackageManager } from "./types";

export interface DependencyInfo {
  packageManager: PackageManager;
  missingDependencies: string[];
  hasAsheeDependencies: boolean;
}

const ASHEE_PACKAGES = [
  "asheeui",
  "asheeui",
  "@asheeui/settings",
  "@asheeui/utils",
];

export async function inspectDependencies(
  directory: string,
): Promise<DependencyInfo> {
  const packageManager = await detectPackageManager(directory);
  const pkg = await readJson(join(directory, "package.json"));
  if (!pkg) {
    return {
      packageManager,
      missingDependencies: [...ASHEE_PACKAGES],
      hasAsheeDependencies: false,
    };
  }

  const deps: Record<string, string> = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };

  const installed = ASHEE_PACKAGES.filter((p) => deps[p]);
  return {
    packageManager,
    missingDependencies: ASHEE_PACKAGES.filter((p) => !deps[p]),
    hasAsheeDependencies: installed.length > 0,
  };
}
