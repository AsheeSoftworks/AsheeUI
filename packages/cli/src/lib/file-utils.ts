import { promises as fs } from "node:fs";
import { dirname, join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import type { FileEdit, FileWrite, IntegrityCheck } from "./types";

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
  } catch {
    return null;
  }
}

export async function writeFileWithDirs(
  p: string,
  content: string,
): Promise<void> {
  await fs.mkdir(dirname(p), { recursive: true });
  await fs.writeFile(p, content, "utf8");
}

export async function readTextFile(p: string): Promise<string | null> {
  try {
    return await fs.readFile(p, "utf8");
  } catch {
    return null;
  }
}

export async function tryImport<T>(p: string): Promise<T | null> {
  const url = pathToFileURL(p).href;
  try {
    const mod = await import(url);
    return (mod.default ?? mod) as T;
  } catch {
    return null;
  }
}

export async function detectPackageManager(
  directory: string,
): Promise<"pnpm" | "yarn" | "npm"> {
  if (await pathExists(join(directory, "pnpm-lock.yaml"))) return "pnpm";
  if (await pathExists(join(directory, "yarn.lock"))) return "yarn";
  return "npm";
}

export function toRelativePath(directory: string, file: string): string {
  const rel = relative(directory, file).replaceAll("\\", "/");
  return rel.startsWith(".") ? rel : `./${rel}`;
}

export async function applyEdit(edit: FileEdit): Promise<void> {
  const content = await readTextFile(edit.path);
  if (content === null) {
    throw new Error(
      edit.notFoundMessage ?? `Could not read file to edit: ${edit.path}`,
    );
  }

  if (!content.includes(edit.search)) {
    throw new Error(
      edit.notFoundMessage ?? `Could not find match in ${edit.path}`,
    );
  }

  const updated = edit.all
    ? content.split(edit.search).join(edit.replace)
    : content.replace(edit.search, edit.replace);

  await fs.writeFile(edit.path, updated, "utf8");
}

export async function applyWrite(write: FileWrite): Promise<void> {
  await writeFileWithDirs(write.path, write.content);
}

export async function verifyEdits(check: IntegrityCheck): Promise<boolean> {
  const content = await readTextFile(check.projectRelativeFile);
  if (content === null || !content.includes(check.pattern)) {
    console.warn(`⚠  ${check.message}`);
    return false;
  }
  return true;
}
