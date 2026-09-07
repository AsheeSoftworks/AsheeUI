/**
 * Integration helpers for AsheeUI CLI.
 * This module provides utility functions for building relative import
 * specifiers used by the integration builders.
 */

import { relative } from "node:path";

/**
 * Build a relative import specifier from `fromFile` to `toFile`.
 *
 * The result is always `./`-prefixed and has no file extension, so it
 * can be embedded directly in `import` statements emitted by the
 * integration builders.
 *
 * @param fromFile - Absolute path of the importing file.
 * @param toFile - Absolute or package-rooted target of the import.
 * @returns A relative module specifier suitable for `import "..."`.
 *
 * @example
 * ```ts
 * relativeImport(
 *   "/proj/src/components/Provider.tsx",
 *   "/proj/asheeui.config.ts",
 * );
 * // -> "../asheeui.config"
 * ```
 */
export function relativeImport(fromFile: string, toFile: string): string {
  const fromDir = fromFile.replace(/\/[^/]+$/, "");
  let rel = relative(fromDir, toFile).replaceAll("\\", "/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  if (!rel.endsWith("/")) rel = rel.replace(/\.\w+$/, "");
  return rel;
}

/**
 * Convenience wrapper that returns the import specifier for the
 * generated `asheeui.config.*` file relative to `fromFile`.
 *
 * @param fromFile - Absolute path of the importing file.
 * @returns A relative module specifier pointing at the config module.
 */
export function buildConfigImport(fromFile: string): string {
  return relativeImport(fromFile, "asheeui-config.ts");
}
