/**
 * Execution of a playground distribution plan.
 *
 * The executor is deliberately the only part that touches the file system, and it
 * writes nothing until it knows every write is allowed: an existing project without
 * `--force` stops the copy before the first byte, so a client is never left with
 * half a project and never loses a file the user did not agree to replace.
 */

import { promises as fs } from "node:fs";
import { join, relative } from "node:path";
import { pathExists, readJson, writeFileWithDirs } from "../common/file-utils";
import type { PlaygroundPlan } from "./plan";

/**
 * What a distribution did.
 */
export interface PlaygroundCopyResult {
  /** Paths written, relative to the destination project, in write order. */
  copied: string[];

  /** Everything that prevented the copy, in plain language. */
  problems: string[];
}

/**
 * List every file inside a directory, as paths relative to it.
 *
 * @param root - Absolute path of the directory to walk.
 * @returns The relative file paths, sorted, so a plan is deterministic.
 */
export async function listTemplateFiles(root: string): Promise<string[]> {
  const found: string[] = [];

  /**
   * Walk one directory.
   *
   * @param current - Absolute path of the directory to read.
   */
  async function walk(current: string): Promise<void> {
    const entries = await fs.readdir(current, { withFileTypes: true });

    for (const entry of entries) {
      const full = join(current, entry.name);

      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile()) {
        found.push(relative(root, full).replaceAll("\\", "/"));
      }
    }
  }

  await walk(root);

  return found.sort();
}

/**
 * Read the node package metadata a copied project should carry.
 *
 * The copied project keeps the template's scripts and dependencies, and takes the
 * name of the directory it was created in. Everything else is the template's, so a
 * copied playground is a project rather than a fragment of one.
 *
 * @param content - The template's `package.json` content.
 * @param packageName - The name to write into it.
 * @returns The content to write, with a trailing newline.
 */
export function renameProject(content: string, packageName: string): string {
  const metadata = JSON.parse(content) as Record<string, unknown>;
  metadata.name = packageName;

  return `${JSON.stringify(metadata, null, 2)}\n`;
}

/**
 * Copy a planned playground into the destination the user chose.
 *
 * @param plan - The plan built by `buildPlaygroundPlan`.
 * @returns What was written, and why nothing was when nothing was.
 *
 * @example
 * ```ts
 * const result = await executePlaygroundPlan(plan);
 * if (result.problems.length > 0) process.exitCode = 1;
 * ```
 */
export async function executePlaygroundPlan(
  plan: PlaygroundPlan,
): Promise<PlaygroundCopyResult> {
  if (plan.problems.length > 0) {
    return { copied: [], problems: plan.problems };
  }

  const problems: string[] = [];

  if (!(await pathExists(plan.templateRoot))) {
    return {
      copied: [],
      problems: [
        `The ${plan.target.label} playground template is missing from the installed CLI (${plan.templateRoot}).`,
      ],
    };
  }

  const files = await listTemplateFiles(plan.templateRoot);
  const destinationExists = await pathExists(plan.destinationRoot);
  const conflicts: string[] = [];

  if (destinationExists && !plan.force) {
    for (const file of files) {
      if (await pathExists(join(plan.destinationRoot, file))) {
        conflicts.push(file);
      }
    }
  }

  if (conflicts.length > 0) {
    return {
      copied: [],
      problems: [
        `${conflicts.length} file(s) already exist in ${plan.destinationRoot} (for example ${conflicts[0]}).`,
        "Choose an empty directory, or pass --force to replace the files this playground owns.",
      ],
    };
  }

  const copied: string[] = [];

  for (const file of files) {
    const source = join(plan.templateRoot, file);
    const target = join(plan.destinationRoot, file);
    const content = await fs.readFile(source, "utf8");

    try {
      await writeFileWithDirs(
        target,
        file === "package.json"
          ? renameProject(content, plan.packageName)
          : content,
      );
      copied.push(file);
    } catch (error) {
      problems.push(`Failed to write ${file}: ${(error as Error).message}`);
    }
  }

  return { copied, problems };
}

/**
 * Read a template's `package.json`, which the command reports before copying.
 *
 * @param templateRoot - Absolute path of the template directory.
 * @returns The parsed metadata, or null when the template has none.
 */
export async function readTemplateManifest(
  templateRoot: string,
): Promise<Record<string, unknown> | null> {
  return readJson(join(templateRoot, "package.json"));
}
