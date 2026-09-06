import { promises as fs } from "node:fs";
import { dirname, join, parse, relative } from "node:path";
import { pathToFileURL } from "node:url";
import type {
  FileEdit,
  FileWrite,
  IntegrityCheck,
  PackageManager,
} from "./types";

/**
 * Outcome of an {@link applyEdit} or {@link applyWrite} call.
 */
export interface EditResult {
  /** True when the operation succeeded or was intentionally skipped. */
  success: boolean;
  /** Absolute path of the file that was targeted. */
  path: string;
  /** Short description of the operation, suitable for CLI output. */
  actionDescription: string;
  /** Human-readable error description, when `success` is `false`. */
  error?: string;
  /** True when the edit was skipped because the content already existed. */
  skipped?: boolean;
}

/**
 * Build a forward-slash relative path from `directory` to `file`,
 * prefixed with `./` when needed.
 *
 * @param directory - Base directory.
 * @param file - Absolute or relative target file path.
 * @returns A normalised relative path string.
 */
export function toRelativePath(directory: string, file: string): string {
  const rel = relative(directory, file).replaceAll("\\", "/");
  return rel.startsWith(".") ? rel : `./${rel}`;
}

/**
 * Cheap `fs.access`-backed existence check.
 *
 * @param p - Absolute path to test.
 * @returns `true` when the path is accessible, `false` otherwise.
 */
export async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read a JSON file and parse it into a generic object.
 *
 * Missing files resolve to `null`. Malformed JSON rethrows as a
 * descriptive `Error` so callers can surface a useful CLI message.
 *
 * @param p - Absolute path of the JSON file.
 * @returns The parsed object, or `null` when the file does not exist.
 * @throws Error when the file exists but is not valid JSON.
 *
 * @example
 * ```ts
 * const pkg = await readJson(join(cwd, "package.json"));
 * if (!pkg) throw new Error("missing package.json");
 * ```
 */
export async function readJson(
  p: string,
): Promise<Record<string, unknown> | null> {
  try {
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    if (err instanceof SyntaxError) {
      throw new Error(`Invalid JSON syntax in file: ${p}`);
    }
    throw new Error(
      `Failed to read JSON file at ${p}: ${(err as Error).message}`,
    );
  }
}

/**
 * Write UTF-8 content to `p`, creating any missing parent directories.
 *
 * @param p - Absolute path of the file to write.
 * @param content - File contents to write.
 * @throws Error when the write fails for any reason other than ENOENT.
 */
export async function writeFileWithDirs(
  p: string,
  content: string,
): Promise<void> {
  try {
    await fs.mkdir(dirname(p), { recursive: true });
    await fs.writeFile(p, content, "utf8");
  } catch (err) {
    throw new Error(`Failed to write file at ${p}: ${(err as Error).message}`);
  }
}

/**
 * Read a UTF-8 text file, or `null` if it does not exist.
 *
 * @param p - Absolute path of the file.
 * @returns The file contents, or `null` when the file is missing.
 * @throws Error when the read fails for any reason other than ENOENT.
 */
export async function readTextFile(p: string): Promise<string | null> {
  try {
    return await fs.readFile(p, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw new Error(
      `Failed to read text file at ${p}: ${(err as Error).message}`,
    );
  }
}

/**
 * Returns the first candidate path (relative to `directory`) that exists on
 * disk, or `null` if none do.
 *
 * @param directory - Base directory for resolving candidates.
 * @param candidates - Candidate paths to check, in priority order.
 * @returns The first candidate that exists, or `null`.
 *
 * @example
 * ```ts
 * const entry = await firstExisting(cwd, ["src/main.tsx", "src/main.ts"]);
 * if (entry) {
 *   // edit or read it
 * }
 * ```
 */
export async function firstExisting(
  directory: string,
  candidates: readonly string[],
): Promise<string | null> {
  for (const candidate of candidates) {
    if (await pathExists(join(directory, candidate))) return candidate;
  }
  return null;
}

/**
 * Dynamically import a TypeScript/JavaScript module and return its default
 * export (or the module namespace when there is no default export).
 *
 * @param p - Absolute path of the module to import.
 * @returns The imported value, or `null` if the module cannot be loaded.
 *
 * @example
 * ```ts
 * const config = await tryImport<{ defaultTheme: string }>(
 *   join(cwd, "asheeui.config.ts"),
 * );
 * if (config) {
 *   // use config.defaultTheme
 * }
 * ```
 */
export async function tryImport<T>(p: string): Promise<T | null> {
  try {
    const url = pathToFileURL(p).href;
    const mod = await import(url);
    return (mod.default ?? mod) as T;
  } catch {
    return null;
  }
}

/**
 * Detect which JavaScript package manager is being used in `directory`.
 *
 * Resolution order:
 * 1. `npm_config_user_agent` (highest signal, set by most package managers).
 * 2. The closest lockfile found while walking up parent directories
 *    (`pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`/`bun.lock`,
 *    `package-lock.json`).
 * 3. `"npm"` as a final fallback.
 *
 * @param directory - Project directory to scan.
 * @returns The detected {@link PackageManager}.
 */
export async function detectPackageManager(
  directory: string,
): Promise<PackageManager> {
  // 1. Detect from the environment running the CLI (highest precision)
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent) {
    if (userAgent.startsWith("pnpm")) return "pnpm";
    if (userAgent.startsWith("bun")) return "bun";
    if (userAgent.startsWith("yarn")) return "yarn";
    if (userAgent.startsWith("npm")) return "npm";
  }

  // 2. Traverse up parent directories to find monorepo root lockfiles
  let currentDir = directory;
  const { root } = parse(directory);

  while (currentDir !== root) {
    if (await pathExists(join(currentDir, "pnpm-lock.yaml"))) return "pnpm";
    if (await pathExists(join(currentDir, "yarn.lock"))) return "yarn";
    if (
      (await pathExists(join(currentDir, "bun.lockb"))) ||
      (await pathExists(join(currentDir, "bun.lock")))
    )
      return "bun";
    if (await pathExists(join(currentDir, "package-lock.json"))) return "npm";

    currentDir = dirname(currentDir);
  }

  // 3. Fallback
  return "npm";
}

/**
 * Apply a search/replace edit to a file described by {@link FileEdit}.
 *
 * Honours `skipIfContentIncludes` for idempotency and respects `all` to
 * replace either the first occurrence or every occurrence.
 *
 * @param edit - Edit descriptor.
 * @returns An {@link EditResult} describing the outcome.
 */
export async function applyEdit(edit: FileEdit): Promise<EditResult> {
  const description = edit.description ?? `Edit ${edit.path}`;
  const content = await readTextFile(edit.path);

  if (content === null) {
    return {
      success: false,
      path: edit.path,
      actionDescription: description,
      error:
        edit.notFoundMessage ??
        `File does not exist or could not be read: ${edit.path}`,
    };
  }

  // Idempotency: skip the edit when the desired content is already present.
  if (
    edit.skipIfContentIncludes &&
    content.includes(edit.skipIfContentIncludes)
  ) {
    return {
      success: true,
      skipped: true,
      path: edit.path,
      actionDescription: description,
    };
  }

  if (!content.includes(edit.search)) {
    return {
      success: false,
      path: edit.path,
      actionDescription: description,
      error:
        edit.notFoundMessage ??
        `Could not find search pattern "${edit.search}" in ${edit.path}`,
    };
  }

  try {
    const updated = edit.all
      ? content.split(edit.search).join(edit.replace)
      : content.replace(edit.search, edit.replace);

    await fs.writeFile(edit.path, updated, "utf8");
    return {
      success: true,
      path: edit.path,
      actionDescription: description,
    };
  } catch (err) {
    return {
      success: false,
      path: edit.path,
      actionDescription: description,
      error: `Failed to save edits to ${edit.path}: ${(err as Error).message}`,
    };
  }
}

/**
 * Write a new file to disk, creating any missing parent directories.
 *
 * @param write - File write descriptor including absolute path and content.
 * @returns An {@link EditResult} describing the outcome.
 */
export async function applyWrite(write: FileWrite): Promise<EditResult> {
  const description = write.description ?? `Write ${write.path}`;
  try {
    await writeFileWithDirs(write.path, write.content);
    return {
      success: true,
      path: write.path,
      actionDescription: description,
    };
  } catch (err) {
    return {
      success: false,
      path: write.path,
      actionDescription: description,
      error: `Failed writing file to ${write.path}: ${(err as Error).message}`,
    };
  }
}

/**
 * Verify that a project file contains an expected snippet.
 *
 * Issues a `console.warn` for every failure so that CLI users can see
 * what went wrong without needing to inspect a log file.
 *
 * @param check - Integrity check descriptor.
 * @returns `true` when the pattern is present, `false` otherwise.
 */
export async function verifyEdits(check: IntegrityCheck): Promise<boolean> {
  try {
    const content = await readTextFile(check.projectRelativeFile);
    if (content === null) {
      console.warn(
        `⚠ Missing integrity target file: ${check.projectRelativeFile}`,
      );
      return false;
    }

    if (!content.includes(check.pattern)) {
      console.warn(
        `⚠ Verification pattern missing in ${check.projectRelativeFile}: ${check.message}`,
      );
      return false;
    }

    return true;
  } catch (err) {
    console.warn(
      `⚠ Failed during integrity check on ${check.projectRelativeFile}: ${(err as Error).message}`,
    );
    return false;
  }
}
