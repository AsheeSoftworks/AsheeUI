/**
 * Framework detection utilities for AsheeUI CLI.
 * This module provides functions for detecting which framework a project
 * is using (Next.js, Vite + React, TanStack Start, or unknown) based on
 * dependencies and file structure.
 */

import { join } from "node:path";
import { pathExists, readJson } from "./file-utils";
import type {
  Framework,
  FrameworkConfidence,
  FrameworkDetection,
} from "./types";

interface Pkg {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/** Options accepted by {@link detectFramework}. */
export interface DetectOptions {
  /** Directory whose `package.json` and source tree will be inspected. */
  cwd: string;
}

/**
 * Detect the framework used by the project at `cwd`.
 *
 * Detection priority order:
 * 1. `@tanstack/react-start` plus an `app.config.*` or router file.
 * 2. `next` plus an `app/`, `pages/` or `next.config.*` file.
 * 3. `vite` together with `react`/`react-dom` plus a `vite.config.*` or
 *    conventional `src/main.*` entry.
 *
 * If none of the above match, returns a `Framework` of `"unknown"` with
 * `confidence` set to `"low"`.
 *
 * @param options - Detection options containing the working directory.
 * @returns A {@link FrameworkDetection} summarising what was found.
 *
 * @example
 * ```ts
 * const { framework, confidence } = await detectFramework({ cwd: process.cwd() });
 * if (framework === "unknown") {
 *   // prompt the user to pick a framework manually
 * }
 * ```
 */
export async function detectFramework(
  options: DetectOptions,
): Promise<FrameworkDetection> {
  const { cwd } = options;

  const pkg = (await readJson(join(cwd, "package.json"))) as Pkg;
  const deps: Record<string, string> = {
    ...(pkg?.dependencies as Record<string, string> | undefined),
    ...(pkg?.devDependencies as Record<string, string> | undefined),
  };

  const has = (name: string) => Boolean(deps[name]);

  const evidence: string[] = [];

  // TanStack Start
  if (has("@tanstack/react-start")) {
    evidence.push("found @tanstack/react-start dependency");

    const hasConfig = await findTanStackConfig(cwd);
    if (hasConfig) {
      evidence.push("found TanStack configuration file");
      return {
        framework: "tanstack-start",
        confidence: "high",
        evidence,
      };
    }

    return {
      framework: "tanstack-start",
      confidence: "medium",
      evidence,
    };
  }

  // Next.js
  if (has("next")) {
    evidence.push("found next dependency");

    const appDir = await pathExists(join(cwd, "app"));
    const pagesDir = await pathExists(join(cwd, "pages"));

    if (appDir || pagesDir) {
      evidence.push(appDir ? "found app/ directory" : "found pages/ directory");
      return {
        framework: "next",
        confidence: "high",
        evidence,
      };
    }

    const hasNextConfig =
      (await pathExists(join(cwd, "next.config.js"))) ||
      (await pathExists(join(cwd, "next.config.mjs"))) ||
      (await pathExists(join(cwd, "next.config.ts")));

    if (hasNextConfig) {
      evidence.push("found next config file");
      return {
        framework: "next",
        confidence: "high",
        evidence,
      };
    }

    return {
      framework: "next",
      confidence: "medium",
      evidence,
    };
  }

  // Vite + React
  if (has("vite") && (has("react") || has("react-dom"))) {
    evidence.push("found vite + react dependencies");

    const viteConfig = await findViteConfig(cwd);
    if (viteConfig) {
      evidence.push(`found ${viteConfig}`);
      return {
        framework: "vite-react",
        confidence: "high",
        evidence,
      };
    }

    const entry = await findViteEntry(cwd);
    if (entry) {
      evidence.push(`found ${entry}`);
      return {
        framework: "vite-react",
        confidence: "medium",
        evidence,
      };
    }

    return {
      framework: "vite-react",
      confidence: "low",
      evidence,
    };
  }

  return {
    framework: "unknown",
    confidence: "low",
    evidence: [],
  };
}

/**
 * Locate a Vite config file in `cwd`, checking each conventional name.
 *
 * @param cwd - Directory to scan.
 * @returns The config file name, or `null` when none exists.
 */
async function findViteConfig(cwd: string): Promise<string | null> {
  const candidates = [
    "vite.config.ts",
    "vite.config.mts",
    "vite.config.cts",
    "vite.config.js",
    "vite.config.mjs",
    "vite.config.cjs",
  ];
  for (const file of candidates) {
    if (await pathExists(join(cwd, file))) return file;
  }
  return null;
}

/**
 * Locate a conventional Vite entry point (`src/main.*` or `index.html`).
 *
 * @param cwd - Directory to scan.
 * @returns The entry file name, or `null` when none exists.
 */
async function findViteEntry(cwd: string): Promise<string | null> {
  const candidates = [
    "src/main.tsx",
    "src/main.jsx",
    "src/main.ts",
    "src/main.js",
    "index.html",
  ];
  for (const file of candidates) {
    if (await pathExists(join(cwd, file))) return file;
  }
  return null;
}

/**
 * Locate a TanStack Start config or router file in `cwd`.
 *
 * @param cwd - Directory to scan.
 * @returns The config/router file name, or `null` when none exists.
 */
async function findTanStackConfig(cwd: string): Promise<string | null> {
  const candidates = [
    "app.config.ts",
    "app.config.js",
    "app/router.tsx",
    "app/router.ts",
    "app.config.mts",
    "app.config.cts",
    "src/router.tsx",
    "src/router.ts",
  ];
  for (const file of candidates) {
    if (await pathExists(join(cwd, file))) return file;
  }
  return null;
}

/**
 * Convert a {@link Framework} identifier into a human-readable label.
 *
 * @param framework - The framework identifier to format.
 * @returns A short display name suitable for CLI output.
 */
export function frameworkLabel(framework: Framework): string {
  switch (framework) {
    case "next":
      return "Next.js";
    case "vite-react":
      return "Vite + React";
    case "tanstack-start":
      return "TanStack Start";
    case "unknown":
      return "Unknown";
  }
}

export type { Framework, FrameworkConfidence };
