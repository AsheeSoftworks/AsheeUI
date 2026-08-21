import { join } from "node:path";
import { firstExisting, readTextFile } from "../common/file-utils";
import type { DoctorCheckResult, DoctorOptions } from "./types";

export const CSS_FILE_CANDIDATES = [
  "src/index.css",
  "src/globals.css",
  "src/app.css",
  "src/app/globals.css",
  "src/style.css",
  "app/globals.css",
];

export const STYLES_IMPORT_PATTERN =
  /@import\s+["']asheeui\/styles(?:\.css)?["']\s*;?/;

/**
 * Validates that `@import "asheeui/styles"` is present in a CSS entry file.
 */
export async function checkCssImport(
  options: DoctorOptions,
): Promise<DoctorCheckResult> {
  const cwd = options.cwd;
  const foundIn: string[] = [];
  for (const candidate of CSS_FILE_CANDIDATES) {
    const content = await readTextFile(join(cwd, candidate));
    if (content === null) continue;
    if (STYLES_IMPORT_PATTERN.test(content)) foundIn.push(candidate);
  }

  if (foundIn.length > 0) {
    return {
      id: "css",
      title: "CSS styles import",
      status: "pass",
      message: `@import "asheeui/styles" found in ${foundIn[0]}`,
    };
  }

  const existingFile = await firstExisting(cwd, CSS_FILE_CANDIDATES);
  return {
    id: "css",
    title: "CSS styles import",
    status: "fail",
    message: existingFile
      ? `No @import "asheeui/styles" found in ${existingFile}.`
      : "No common CSS entry file found (src/index.css, src/globals.css, app/globals.css, etc.).",
    fix: `Add @import "asheeui/styles"; to ${
      existingFile ?? "src/index.css"
    } (create the file if needed) to ensure component styles render correctly.`,
  };
}
