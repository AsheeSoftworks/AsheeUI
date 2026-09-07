/**
 * Theme augmentation check for AsheeUI CLI doctor command.
 * This module provides the checkThemeAugmentation function that detects
 * optional custom theme registry declaration files.
 */

import type { Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathExists, readTextFile, toRelativePath } from "../common/file-utils";

/**
 * Detect an optional custom theme registry (`.d.ts` files declaring the
 * `"asheeui"` module or `AsheeThemeNameRegistry`).
 *
 * Always informational: this check never fails the project. It is
 * useful for projects that need custom theme tokens.
 *
 * @param cwd - Project directory to scan.
 * @returns A {@link DoctorCheckResult} with status `"info"`.
 */
export async function checkThemeAugmentation(cwd: string) {
  const dtsFiles: string[] = [];

  for (const directory of [cwd, join(cwd, "src")]) {
    if (!(await pathExists(directory))) continue;
    let entries: Dirent[];
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".d.ts")) continue;
      dtsFiles.push(join(directory, entry.name));
    }
  }

  for (const file of dtsFiles) {
    const content = await readTextFile(file);
    if (content === null) continue;
    const declaresAsheeUi =
      content.includes('declare module "asheeui"') ||
      content.includes("declare module 'asheeui'");
    if (declaresAsheeUi || content.includes("AsheeThemeNameRegistry")) {
      return {
        id: "theme-augmentation",
        title: "Theme augmentation",
        status: "info" as const,
        message: `Custom theme registry detected (${toRelativePath(cwd, file)}).`,
      };
    }
  }

  return {
    id: "theme-augmentation",
    title: "Theme augmentation",
    status: "info" as const,
    message:
      "No theme augmentation file detected. This is optional and can be skipped unless you need custom theme tokens.",
  };
}
