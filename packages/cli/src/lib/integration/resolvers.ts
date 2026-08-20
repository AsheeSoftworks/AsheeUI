import { join } from "node:path";
import { pathExists } from "../file-utils";
import type { SupportedFramework } from "../types";

const GLOBAL_CSS_CANDIDATES = [
  "src/styles.css",
  "src/app.css",
  "app/app.css",
  "app/globals.css",
  "src/globals.css",
  "src/index.css",
] as const;

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
 * @returns the absolute path of the first matching file, or `null`.
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
 * @returns the absolute path of the first matching file, or `null`.
 */
export async function resolveViteOrAppConfig(
  directory: string,
): Promise<string | null> {
  return firstExisting(directory, CONFIG_CANDIDATES);
}

/**
 * Locate the router/layout/entry point for the given framework.
 *
 * - `tanstack-start`: `src/routes/__root.tsx`, `app/routes/__root.tsx`,
 *   `src/router.tsx`, `app/router.tsx`
 * - `next`: `app/layout.tsx`, `pages/_app.tsx`
 * - `vite-react`: `src/main.tsx`
 *
 * @returns the absolute path of the first matching file, or `null`.
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
