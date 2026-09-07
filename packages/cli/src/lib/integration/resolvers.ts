/**
 * File resolution utilities for AsheeUI CLI integration builders.
 * This module provides functions for resolving global CSS files,
 * framework config files, and router/entry point files.
 */

import { join } from "node:path";
import { GLOBAL_CSS_CANDIDATES } from "../../utils/audit";
import { pathExists } from "../common/file-utils";
import type { SupportedFramework } from "../common/types";

const CONFIG_CANDIDATES = [
  "vite.config.ts",
  "vite.config.js",
  "app.config.ts",
  "app.config.js",
  "next.config.ts",
  "next.config.js",
  "next.config.mjs",
] as const;

/**
 * Locate the project's global stylesheet, following the conventional
 * order used by Vite, Next.js and TanStack Start templates.
 *
 * @param directory - Project directory to scan.
 * @returns The absolute path of the first matching file, or `null`.
 *
 * @example
 * ```ts
 * const css = await resolveGlobalCss(process.cwd());
 * if (css) {
 *   // inject @import "asheeui/styles"; into css
 * }
 * ```
 */
export async function resolveGlobalCss(
  directory: string,
): Promise<string | null> {
  return firstExisting(directory, GLOBAL_CSS_CANDIDATES);
}

/**
 * Locate the bundler/framework config file (Vite, TanStack Start's
 * `app.config`, or Next.js config).
 *
 * @param directory - Project directory to scan.
 * @returns The absolute path of the first matching file, or `null`.
 */
export async function resolveViteOrAppConfig(
  directory: string,
): Promise<string | null> {
  return firstExisting(directory, CONFIG_CANDIDATES);
}

/**
 * Locate the router/layout/entry point for the given framework.
 *
 * Candidate paths, by framework:
 * - `tanstack-start`: `src/routes/__root.tsx`, `app/routes/__root.tsx`,
 *   `src/router.tsx`, `app/router.tsx`.
 * - `next`: `app/layout.tsx`, `app/layout.jsx`, `pages/_app.tsx`,
 *   `pages/_app.jsx`.
 * - `vite-react`: `src/main.tsx`, `src/main.jsx`, `src/main.ts`,
 *   `src/main.js`.
 *
 * @param directory - Project directory to scan.
 * @param framework - Framework the project is using.
 * @returns The absolute path of the first matching file, or `null`.
 */
export async function resolveRouterOrEntryPoint(
  directory: string,
  framework: SupportedFramework,
): Promise<string | null> {
  let candidates: readonly string[];

  switch (framework) {
    case "tanstack-start":
      candidates = [
        "src/routes/__root.tsx",
        "app/routes/__root.tsx",
        "src/router.tsx",
        "app/router.tsx",
      ];
      break;
    case "next":
      candidates = [
        "app/layout.tsx",
        "app/layout.jsx",
        "pages/_app.tsx",
        "pages/_app.jsx",
      ];
      break;
    case "vite-react":
      candidates = [
        "src/main.tsx",
        "src/main.jsx",
        "src/main.ts",
        "src/main.js",
      ];
      break;
  }

  return firstExisting(directory, candidates);
}

/**
 * Local helper: return the first candidate that exists relative to
 * `directory`, or `null` when none do.
 *
 * @param directory - Base directory for resolving candidates.
 * @param candidates - Candidate relative paths to check, in order.
 * @returns The first candidate that exists, or `null`.
 */
async function firstExisting(
  directory: string,
  candidates: readonly string[],
): Promise<string | null> {
  for (const candidate of candidates) {
    const fullPath = join(directory, candidate);
    if (await pathExists(fullPath)) return fullPath;
  }
  return null;
}
