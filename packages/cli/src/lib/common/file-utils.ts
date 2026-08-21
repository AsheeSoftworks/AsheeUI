import { promises as fs } from "node:fs";
import { dirname, join, parse, relative } from "node:path";
import { pathToFileURL } from "node:url";
import type {
  FileEdit,
  FileWrite,
  IntegrityCheck,
  PackageManager,
} from "./types";

export interface EditResult {
  success: boolean;
  path: string;
  actionDescription: string;
  error?: string;
}

export function toRelativePath(directory: string, file: string): string {
  const rel = relative(directory, file).replaceAll("\\", "/");
  return rel.startsWith(".") ? rel : `./${rel}`;
}

export async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

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
 */
export async function firstExisting(
  directory: string,
  candidates: string[],
): Promise<string | null> {
  for (const candidate of candidates) {
    if (await pathExists(join(directory, candidate))) return candidate;
  }
  return null;
}

export async function tryImport<T>(p: string): Promise<T | null> {
  try {
    const url = pathToFileURL(p).href;
    const mod = await import(url);
    return (mod.default ?? mod) as T;
  } catch {
    return null;
  }
}

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
