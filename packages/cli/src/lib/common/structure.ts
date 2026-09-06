import { join } from "node:path";
import { pathExists, readJson } from "./file-utils";
import type { Language, NextRouter, ProjectStructure } from "./types";

/** Options accepted by {@link detectProjectStructure}. */
export interface StructureOptions {
  /** Project directory to inspect. */
  cwd: string;
  /** Framework the project is using; drives which entry point is searched. */
  framework: "next" | "vite-react" | "tanstack-start";
}

/**
 * Inspect a project to build a {@link ProjectStructure} snapshot.
 *
 * Looks for the framework-specific entry/layout file, detects whether
 * the project uses TypeScript or JavaScript, whether Tailwind is
 * installed, and whether a conventional global stylesheet exists.
 *
 * @param options - Structure detection options.
 * @returns A populated {@link ProjectStructure}.
 *
 * @example
 * ```ts
 * const structure = await detectProjectStructure({
 *   cwd: process.cwd(),
 *   framework: "next",
 * });
 * if (structure.hasGlobalCss) {
 *   // safe to inject styles imports
 * }
 * ```
 */
export async function detectProjectStructure(
  options: StructureOptions,
): Promise<ProjectStructure> {
  const { cwd, framework } = options;

  const language = await detectLanguage(cwd);

  let entryPoint: string | null = null;
  let nextRouter: NextRouter | null = null;

  if (framework === "next") {
    const appRouterFile = await firstExisting([
      join(cwd, "app", "layout.tsx"),
      join(cwd, "app", "layout.jsx"),
    ]);
    const pagesRouterFile = await firstExisting([
      join(cwd, "pages", "_app.tsx"),
      join(cwd, "pages", "_app.jsx"),
    ]);

    if (appRouterFile) {
      entryPoint = appRouterFile;
      nextRouter = "app";
    } else if (pagesRouterFile) {
      entryPoint = pagesRouterFile;
      nextRouter = "pages";
    }
  } else if (framework === "vite-react") {
    entryPoint = await firstExisting([
      join(cwd, "src", "main.tsx"),
      join(cwd, "src", "main.jsx"),
      join(cwd, "src", "main.ts"),
      join(cwd, "src", "main.js"),
    ]);
  } else {
    // tanstack-start
    entryPoint = await firstExisting([
      join(cwd, "app", "router.tsx"),
      join(cwd, "src", "router.tsx"),
      join(cwd, "app", "routes", "__root.tsx"),
      join(cwd, "src", "routes", "__root.tsx"),
    ]);
  }

  const hasTailwind = await detectTailwind(cwd);
  const cssFile = await findGlobalCss(cwd, language);
  const hasGlobalCss = cssFile !== null;

  return {
    entryPoint,
    language,
    nextRouter,
    hasTailwind,
    hasGlobalCss,
  };
}

/**
 * Detect whether the project at `cwd` primarily uses TypeScript or
 * JavaScript.
 *
 * A `tsconfig.json` or a conventional ambient type declaration file
 * is treated as a TypeScript signal.
 *
 * @param cwd - Project directory to scan.
 * @returns The detected {@link Language}.
 */
async function detectLanguage(cwd: string): Promise<Language> {
  const hasTsConfig = await pathExists(join(cwd, "tsconfig.json"));
  const hasTypeScriptFiles = await anyExists([
    join(cwd, "src", "vite-env.d.ts"),
    join(cwd, "next-env.d.ts"),
    join(cwd, "env.d.ts"),
  ]);
  return hasTsConfig || hasTypeScriptFiles ? "typescript" : "javascript";
}

/**
 * Detect whether the project at `cwd` has Tailwind installed, either as
 * a dependency or via a conventional config file.
 *
 * @param cwd - Project directory to scan.
 * @returns `true` when a Tailwind signal is found.
 */
async function detectTailwind(cwd: string): Promise<boolean> {
  const pkg = await readJson(join(cwd, "package.json"));
  const deps: Record<string, string> = {
    ...(pkg?.dependencies as Record<string, string> | undefined),
    ...(pkg?.devDependencies as Record<string, string> | undefined),
  };
  if (deps.tailwindcss) return true;

  return anyExists([
    join(cwd, "tailwind.config.ts"),
    join(cwd, "tailwind.config.js"),
    join(cwd, "tailwind.config.cjs"),
    join(cwd, "tailwind.config.mjs"),
    join(cwd, "tailwind.config.cts"),
  ]);
}

/**
 * Locate a conventional global stylesheet (or entry source file) for
 * the detected language.
 *
 * @param cwd - Project directory to scan.
 * @param language - Detected project language, used to add entry files
 *   to the candidate list.
 * @returns The absolute path of the first match, or `null`.
 */
async function findGlobalCss(
  cwd: string,
  language: Language,
): Promise<string | null> {
  const candidates = [
    join(cwd, "src", "index.css"),
    join(cwd, "src", "globals.css"),
    join(cwd, "src", "styles.css"),
    join(cwd, "styles", "globals.css"),
    join(cwd, "app", "globals.css"),
    join(cwd, "index.css"),
    join(cwd, "globals.css"),
    ...(language === "typescript"
      ? [join(cwd, "src", "index.ts"), join(cwd, "src", "main.ts")]
      : [join(cwd, "src", "index.js"), join(cwd, "src", "main.js")]),
  ];
  for (const file of candidates) {
    if (await pathExists(file)) return file;
  }
  return null;
}

/**
 * Return the first path in `paths` that exists, or `null`.
 *
 * @param paths - Absolute paths to check, in priority order.
 * @returns The first existing path, or `null`.
 */
async function firstExisting(paths: string[]): Promise<string | null> {
  for (const p of paths) {
    if (await pathExists(p)) return p;
  }
  return null;
}

/**
 * Test whether at least one of the supplied paths exists.
 *
 * @param paths - Absolute paths to check.
 * @returns `true` when any path exists.
 */
async function anyExists(paths: string[]): Promise<boolean> {
  return (await firstExisting(paths)) !== null;
}
