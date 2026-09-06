import { join } from "node:path";
import { discoverConfig } from "@asheeui/utils/node";
import { firstExisting, readTextFile } from "../lib/common/file-utils";

/**
 * Shared audit utilities.
 *
 * These helpers are the single source of truth for *verifying* whether an
 * `asheeui` setup element already exists on disk. They are consumed by the
 * `doctor` command (reporting), the `fix` command (repairing) and the `init`
 * command (guarding against duplicate writes/edits).
 */

// Markers.

/** Substring that identifies an `asheeui` stylesheet import in a CSS file. */
export const STYLES_IMPORT_MARKER = "asheeui/styles";

/** Matches `@import "asheeui/styles"` / `@import 'asheeui/styles.css';` etc. */
export const STYLES_IMPORT_PATTERN =
  /@import\s+["']asheeui\/styles(?:\.css)?["']\s*;?/;

/** Matches a bare tailwind v4 import. */
export const TAILWIND_IMPORT_PATTERN = /@import\s+["']tailwindcss["']\s*;?/;

/** Provider tag used when wrapping application roots. */
export const PROVIDER_TAG = "AsheeUIProvider";

/**
 * Global stylesheet candidates, ordered by conventional priority across
 * Vite, Next.js and TanStack Start templates.
 */
export const GLOBAL_CSS_CANDIDATES = [
  "src/styles.css",
  "src/index.css",
  "src/globals.css",
  "src/app.css",
  "src/app/globals.css",
  "src/style.css",
  "app/app.css",
  "app/globals.css",
] as const;

/** Entry files that may hold the root provider. */
export const ENTRYPOINT_CANDIDATES = [
  "src/main.tsx",
  "src/index.tsx",
  "src/App.tsx",
  "src/app/layout.tsx",
  "app/layout.tsx",
] as const;

// Content checks.

/**
 * Test whether `content` already contains an `asheeui/styles` import.
 *
 * @param content - File source to scan.
 * @returns `true` when a matching `@import` statement is detected.
 */
export function containsStylesImport(content: string): boolean {
  return STYLES_IMPORT_PATTERN.test(content);
}

/**
 * Test whether `content` already references the root provider, either by
 * rendering `<AsheeUIProvider>` or by importing from `asheeui/config`.
 *
 * @param content - File source to scan.
 * @returns `true` when a root provider reference is detected.
 */
export function containsRootProvider(content: string): boolean {
  return (
    content.includes("asheeui/config") || content.includes(`<${PROVIDER_TAG}`)
  );
}

// File discovery.

/**
 * Return the absolute path of the first conventional global CSS file,
 * or `null` when none exist.
 *
 * @param directory - Project directory to scan.
 * @returns Absolute path of the first matching CSS file, or `null`.
 */
export async function findGlobalCssFile(
  directory: string,
): Promise<string | null> {
  const candidate = await firstExisting(directory, GLOBAL_CSS_CANDIDATES);
  return candidate ? join(directory, candidate) : null;
}

/**
 * Return the absolute path of the first CSS file that already imports
 * `asheeui/styles`, or `null` when no such file exists.
 *
 * @param directory - Project directory to scan.
 * @returns Absolute path of the first matching CSS file, or `null`.
 */
export async function findCssFileWithStylesImport(
  directory: string,
): Promise<string | null> {
  for (const candidate of GLOBAL_CSS_CANDIDATES) {
    const full = join(directory, candidate);
    const content = await readTextFile(full);
    if (content !== null && containsStylesImport(content)) return full;
  }
  return null;
}

/**
 * Return the absolute path of the first conventional root entry file,
 * or `null` when none exist.
 *
 * @param directory - Project directory to scan.
 * @returns Absolute path of the first matching entry file, or `null`.
 */
export async function findEntryFile(directory: string): Promise<string | null> {
  return firstExisting(directory, ENTRYPOINT_CANDIDATES);
}

/**
 * Return the absolute path of an `asheeui` config file in `directory`
 * or `directory/src/`, or `null` when none exists.
 *
 * @param directory - Project directory to scan.
 * @returns Absolute path of the first matching config file, or `null`.
 */
export function findAsheeConfigFile(directory: string): string | null {
  const root = discoverConfig(directory);
  if (root) return root;
  return discoverConfig(join(directory, "src")) ?? null;
}

/**
 * Read a file and return its contents, or `null` if missing.
 *
 * @param file - Absolute path of the file to read.
 * @returns File contents, or `null` if the file does not exist.
 */
export async function readFileContent(file: string): Promise<string | null> {
  return readTextFile(file);
}
