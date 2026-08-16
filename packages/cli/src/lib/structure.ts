import { join } from "node:path";
import { pathExists, readJson } from "./file-utils";
import type { Language, NextRouter, ProjectStructure } from "./types";

export interface StructureOptions {
  cwd: string;
  framework: "next" | "vite-react" | "tanstack-start";
}

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

async function detectLanguage(cwd: string): Promise<Language> {
  const hasTsConfig = await pathExists(join(cwd, "tsconfig.json"));
  const hasTypeScriptFiles = await anyExists([
    join(cwd, "src", "vite-env.d.ts"),
    join(cwd, "next-env.d.ts"),
    join(cwd, "env.d.ts"),
  ]);
  return hasTsConfig || hasTypeScriptFiles ? "typescript" : "javascript";
}

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

async function firstExisting(paths: string[]): Promise<string | null> {
  for (const p of paths) {
    if (await pathExists(p)) return p;
  }
  return null;
}

async function anyExists(paths: string[]): Promise<boolean> {
  return (await firstExisting(paths)) !== null;
}
