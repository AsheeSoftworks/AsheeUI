/**
 * Integration helpers for AsheeUI CLI.
 * This module provides utility functions for building relative import
 * specifiers used by the integration builders.
 */

import { dirname, relative } from "node:path";

/**
 * Build a relative import specifier from `fromFile` to `toFile`.
 *
 * The result is always `./`-prefixed and has no file extension, so it
 * can be embedded directly in `import` statements emitted by the
 * integration builders.
 *
 * The importing file's directory is derived with `dirname`, so a path
 * written with either separator resolves the same way: a Windows path is
 * not treated as a directory of its own.
 *
 * @param fromFile - Absolute path of the importing file.
 * @param toFile - Absolute path of the target module.
 * @returns A relative module specifier suitable for `import "..."`.
 *
 * @example
 * ```ts
 * relativeImport("/proj/src/main.tsx", "/proj/asheeui.config.ts");
 * // -> "../asheeui.config"
 * ```
 */
export function relativeImport(fromFile: string, toFile: string): string {
  let rel = relative(dirname(fromFile), toFile).replaceAll("\\", "/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  if (!rel.endsWith("/")) rel = rel.replace(/\.\w+$/, "");
  return rel;
}
