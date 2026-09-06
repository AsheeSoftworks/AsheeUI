import type { Dirent } from "node:fs";
import { promises as fs } from "node:fs";
import { basename, dirname, join, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pathExists, readJson } from "../common/file-utils";

/**
 * Conventional directory names that may contain component source code
 * inside an `asheeui` package.
 */
export const COMPONENT_SOURCE_DIRS = [
  "src/components",
  "components",
  "dist/components",
] as const;

/** File extensions considered source for the purpose of component discovery. */
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];

/** Options accepted by {@link resolveAsheeuiPackage}. */
export interface ResolvePackageOptions {
  /** Current working directory used as the search anchor. */
  cwd: string;
  /** Optional direct path to an asheeui package (or components folder). */
  explicitPath?: string;
}

/**
 * Test whether `p` is an existing directory.
 *
 * @param p - Absolute path to test.
 * @returns `true` when the path is a directory, `false` otherwise.
 */
async function isDirectory(p: string): Promise<boolean> {
  try {
    return (await fs.stat(p)).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Test whether `directory` contains at least one file with a recognised
 * source extension.
 *
 * @param directory - Directory to scan.
 * @returns `true` when a source file is present, `false` otherwise.
 */
async function containsSourceFiles(directory: string): Promise<boolean> {
  let entries: Dirent[];
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch {
    return false;
  }
  return entries.some(
    (entry) =>
      entry.isFile() &&
      SOURCE_EXTENSIONS.some((ext) => entry.name.endsWith(ext)),
  );
}

/**
 * Test whether `p` points at the root of a package whose name is
 * exactly `asheeui`.
 *
 * @param p - Candidate package directory.
 * @returns `true` when a matching `package.json` is found.
 */
async function isAsheeuiPackageRoot(p: string): Promise<boolean> {
  if (!(await pathExists(p))) return false;
  const pkg = await readJson(join(p, "package.json"));
  return pkg?.name === "asheeui";
}

/**
 * Return the absolute path of the `components` directory inside a
 * package root, or `null` if none of the conventional locations exist.
 *
 * If `packageRoot` already points at a directory named `components`,
 * it is returned as-is.
 *
 * @param packageRoot - Absolute path of an `asheeui` package root.
 * @returns Absolute path of the components directory, or `null`.
 */
export async function resolveComponentsDirectory(
  packageRoot: string,
): Promise<string | null> {
  if (
    basename(packageRoot) === "components" &&
    (await isDirectory(packageRoot))
  ) {
    return packageRoot;
  }
  for (const candidate of COMPONENT_SOURCE_DIRS) {
    const full = join(packageRoot, candidate);
    if (await isDirectory(full)) return full;
  }
  return null;
}

/**
 * Discover component folder names by scanning the components directory
 * of an installed/local `asheeui` package.
 *
 * Only directories that actually contain source files
 * (`.ts`/`.tsx`/`.js`/`.jsx`/`.mjs`/`.cjs`) are reported. The result is
 * sorted alphabetically.
 *
 * @param packageRoot - Absolute path of an `asheeui` package root.
 * @returns Sorted array of component folder names.
 *
 * @example
 * ```ts
 * const components = await discoverComponentFolders("/proj/node_modules/asheeui");
 * console.log(components); // ["Accordian", "Button", "Card", ...]
 * ```
 */
export async function discoverComponentFolders(
  packageRoot: string,
): Promise<string[]> {
  const componentsDir = await resolveComponentsDirectory(packageRoot);
  if (!componentsDir) return [];

  const components: string[] = [];
  let entries: Dirent[];
  try {
    entries = await fs.readdir(componentsDir, { withFileTypes: true });
  } catch {
    return components;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (await containsSourceFiles(join(componentsDir, entry.name))) {
      components.push(entry.name);
    }
  }
  return components.sort();
}

/**
 * Resolve the root of the `asheeui` package that should be scanned.
 *
 * Resolution order:
 * 1. `explicitPath` when provided (points at a package root or components dir).
 * 2. An installed `asheeui` package inside `cwd`/`node_modules`
 *    (walking up parent directories).
 * 3. The `asheeui` package source in the same monorepo as this CLI
 *    (`packages/ui` or a local `node_modules/asheeui`).
 *
 * @param options - {@link ResolvePackageOptions} for the lookup.
 * @returns Absolute path of the located package root, or `null`.
 */
export async function resolveAsheeuiPackage(
  options: ResolvePackageOptions,
): Promise<string | null> {
  const { cwd, explicitPath } = options;

  if (explicitPath) {
    const resolved = resolve(cwd, explicitPath);
    if (await isDirectory(resolved)) return resolved;
  }

  // Walk up from the project directory looking for an installed asheeui pkg.
  let current = resolve(cwd);
  const { root } = parse(current);
  while (current !== root) {
    const candidate = join(current, "node_modules", "asheeui");
    if (await isAsheeuiPackageRoot(candidate)) return candidate;
    current = dirname(current);
  }

  // Fall back to the asheeui package inside this CLI's own monorepo.
  const cliDir = dirname(fileURLToPath(import.meta.url));
  let anchor = cliDir;
  while (anchor !== dirname(anchor)) {
    const workspacePkg = join(anchor, "packages", "ui");
    if (await isAsheeuiPackageRoot(workspacePkg)) return workspacePkg;
    const localNodeModules = join(anchor, "node_modules", "asheeui");
    if (await isAsheeuiPackageRoot(localNodeModules)) return localNodeModules;
    anchor = dirname(anchor);
  }

  return null;
}

const COLUMN_GAP = 2;
const MAX_COLUMNS = 4;

/**
 * Render a component name list as a clean, aligned terminal grid.
 *
 * Columns wrap to a new row when {@link MAX_COLUMNS} is reached. Names
 * are padded so columns line up. Returns a `"No components found."`
 * placeholder when the input is empty.
 *
 * @param components - Component names to render.
 * @returns A multi-line string ready to print to the terminal.
 */
export function renderComponentList(components: string[]): string {
  if (components.length === 0) {
    return "No components found.";
  }

  const columnWidth = Math.max(...components.map((name) => name.length));
  const columns = Math.min(MAX_COLUMNS, components.length);
  const rows = Math.ceil(components.length / columns);
  const lines: string[] = [];

  for (let row = 0; row < rows; row++) {
    const cells: string[] = [];
    for (let col = 0; col < columns; col++) {
      const index = col * rows + row;
      if (index < components.length) {
        cells.push(components[index].padEnd(columnWidth));
      }
    }
    lines.push(cells.join(" ".repeat(COLUMN_GAP)).trimEnd());
  }

  return lines.join("\n");
}
