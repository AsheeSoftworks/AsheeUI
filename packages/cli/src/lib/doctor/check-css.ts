import { join } from "node:path";
import {
  containsStylesImport,
  findCssFileWithStylesImport,
  GLOBAL_CSS_CANDIDATES,
} from "../../utils/audit";
import { firstExisting, readTextFile } from "../common/file-utils";
import type { DoctorCheckResult, DoctorOptions } from "./types";

export {
  GLOBAL_CSS_CANDIDATES as CSS_FILE_CANDIDATES,
  STYLES_IMPORT_PATTERN,
} from "../../utils/audit";

/**
 * Validate that `@import "asheeui/styles"` is present in a CSS entry file.
 *
 * Three outcomes are possible:
 * - `pass`: a global stylesheet already imports asheeui styles.
 * - `fail`: a global stylesheet exists but does not yet import them,
 *   or no stylesheet could be located at all.
 *
 * @param options - {@link DoctorOptions} containing the working directory.
 * @returns A {@link DoctorCheckResult} describing the outcome.
 */
export async function checkCssImport(
  options: DoctorOptions,
): Promise<DoctorCheckResult> {
  const cwd = options.cwd;

  const foundWithImport = await findCssFileWithStylesImport(cwd);
  if (foundWithImport) {
    return {
      id: "css",
      title: "CSS styles import",
      status: "pass",
      message: `@import "asheeui/styles" found in ${relativeTo(cwd, foundWithImport)}`,
    };
  }

  // No CSS file has the import yet; report the first existing CSS entry so
  // the fix can target the right file.
  const existingFile = await firstExisting(cwd, GLOBAL_CSS_CANDIDATES);
  if (existingFile) {
    const content = await readTextFile(join(cwd, existingFile));
    if (content !== null && !containsStylesImport(content)) {
      return {
        id: "css",
        title: "CSS styles import",
        status: "fail",
        message: `No @import "asheeui/styles" found in ${existingFile}.`,
        fix: `Add @import "asheeui/styles"; to ${existingFile} to ensure component styles render correctly.`,
      };
    }
  }

  return {
    id: "css",
    title: "CSS styles import",
    status: "fail",
    message:
      "No common CSS entry file found (src/index.css, src/globals.css, app/globals.css, etc.).",
    fix: 'Create src/index.css containing `@import "tailwindcss";` and `@import "asheeui/styles";` and import it from your entrypoint.',
  };
}

/**
 * Strip the `cwd/` prefix from an absolute path to produce a
 * project-relative path for CLI output.
 *
 * @param cwd - Project directory prefix to strip.
 * @param file - Absolute file path.
 * @returns A project-relative path string.
 */
function relativeTo(cwd: string, file: string): string {
  return file.replace(`${cwd}/`, "");
}
