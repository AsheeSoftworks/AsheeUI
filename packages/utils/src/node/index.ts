import { existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Conventional AsheeUI config filenames, checked in order.
 *
 * Supports both `asheeui.config.*` and `asheeui-config.*` spellings
 * across the TypeScript and JavaScript module extensions.
 */
export const CANDIDATES = [
  "asheeui.config.ts",
  "asheeui.config.mts",
  "asheeui.config.js",
  "asheeui.config.mjs",
  "asheeui-config.ts",
  "asheeui-config.mts",
  "asheeui-config.js",
  "asheeui-config.mjs",
] as const;

/**
 * Discover an existing AsheeUI config file inside `root`.
 *
 * Returns the first of {@link CANDIDATES} that exists on disk, walking
 * the list in priority order.
 *
 * @param root - Directory to search. Defaults to `process.cwd()`.
 * @returns Absolute path of the first matching config file, or
 *   `undefined` when no config exists.
 *
 * @example
 * ```ts
 * const configPath = discoverConfig(process.cwd());
 * if (configPath) {
 *   // load and apply the user's config
 * }
 * ```
 */
export function discoverConfig(root?: string): string | undefined {
  const base = root ?? process.cwd();
  return CANDIDATES.map((file) => resolve(base, file)).find(existsSync);
}
