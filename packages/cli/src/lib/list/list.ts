import { promises as fs } from "node:fs";
import { dirname, join, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pathExists, readJson } from "../common/file-utils";

/** Directory that holds AsheeUI component modules. */
const COMPONENTS_DIRECTORY = "components";

/**
 * `package.json` fields consulted for the public entry module, in priority
 * order. `exports` is handled separately because it may be a conditional map.
 */
const ENTRY_FIELDS = ["exports", "types", "module", "main"] as const;

/**
 * Entry module locations tried when `package.json` declares no usable entry.
 */
const FALLBACK_ENTRY_PATHS = [
  "src/index.ts",
  "src/index.tsx",
  "dist/index.js",
  "dist/index.mjs",
] as const;

/** Extensions tried when resolving an extension-less module path. */
const RESOLVABLE_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
] as const;

/**
 * Matches a re-export statement and captures whether it is type-only plus
 * the module specifier it re-exports.
 */
const EXPORT_FROM_PATTERN =
  /export\s+(type\s+)?(?:\*|\{[\s\S]*?\})\s*from\s*["']([^"']+)["']/g;

/**
 * Matches an import statement and captures whether it is type-only plus the
 * module specifier it imports.
 *
 * Used only as a fallback for a built entry module, where re-exports are
 * emitted as one local `export { ... }` statement with no module specifier.
 */
const IMPORT_FROM_PATTERN = /import\s+(type\s+)?[^;]*?from\s*["']([^"']+)["']/g;

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
 * Collect the candidate entry-module paths declared by a parsed
 * `package.json`.
 *
 * Only the root entry (`exports["."]`) is considered, because the public
 * component surface is exposed there. Subpath exports such as `./styles.css`
 * are intentionally ignored.
 *
 * @param pkg - Parsed `package.json` contents.
 * @returns Candidate paths relative to the package root, in priority order.
 */
function collectEntryCandidates(pkg: Record<string, unknown>): string[] {
  const candidates: string[] = [];

  const pushModulePaths = (value: unknown): void => {
    if (typeof value === "string") {
      candidates.push(value);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) pushModulePaths(item);
      return;
    }
    if (value && typeof value === "object") {
      for (const item of Object.values(value)) pushModulePaths(item);
    }
  };

  const exportsField = pkg.exports;
  if (Array.isArray(exportsField)) {
    pushModulePaths(exportsField);
  } else if (typeof exportsField === "string") {
    pushModulePaths(exportsField);
  } else if (exportsField && typeof exportsField === "object") {
    pushModulePaths((exportsField as Record<string, unknown>)["."]);
  }

  for (const field of ENTRY_FIELDS) {
    if (field === "exports") continue;
    pushModulePaths(pkg[field]);
  }

  for (const fallback of FALLBACK_ENTRY_PATHS) candidates.push(fallback);

  return candidates;
}

/**
 * Resolve the first existing file for a candidate module path, tolerating
 * extension-less paths and directory entry points.
 *
 * @param packageRoot - Absolute path of the package root.
 * @param candidate - Module path declared by `package.json` or a fallback.
 * @returns Absolute file path, or `null` when nothing resolves.
 */
async function resolveModulePath(
  packageRoot: string,
  candidate: string,
): Promise<string | null> {
  const base = resolve(packageRoot, candidate);
  const attempts = [
    base,
    ...RESOLVABLE_EXTENSIONS.map((ext) => `${base}${ext}`),
    ...RESOLVABLE_EXTENSIONS.map((ext) => join(base, `index${ext}`)),
  ];

  for (const attempt of attempts) {
    try {
      if ((await fs.stat(attempt)).isFile()) return attempt;
    } catch {
      // Not a file; try the next candidate.
    }
  }

  return null;
}

/**
 * Resolve the public entry module of an `asheeui` package.
 *
 * @param packageRoot - Absolute path of an `asheeui` package root.
 * @returns Absolute path of the entry module, or `null` when none exists.
 */
async function resolvePublicEntry(packageRoot: string): Promise<string | null> {
  const pkg = await readJson(join(packageRoot, "package.json"));
  const candidates = pkg
    ? collectEntryCandidates(pkg)
    : [...FALLBACK_ENTRY_PATHS];

  for (const candidate of candidates) {
    const resolved = await resolveModulePath(packageRoot, candidate);
    if (resolved) return resolved;
  }

  return null;
}

/**
 * Derive a component name from a module specifier that re-exports a
 * component, for example `"./components/date-picker"` to `"date-picker"`.
 *
 * @param specifier - Module specifier taken from an export statement.
 * @returns The component name, or `null` when the specifier does not
 *   reference a module inside the `components/` directory.
 */
export function componentNameFromSpecifier(specifier: string): string | null {
  const normalized = specifier.replaceAll("\\", "/");
  const marker = `/${COMPONENTS_DIRECTORY}/`;
  const markerIndex = normalized.lastIndexOf(marker);
  if (markerIndex === -1) return null;

  const remainder = normalized.slice(markerIndex + marker.length);
  const name = remainder.split("/")[0];
  if (!name || name === "." || name === "..") return null;
  return name;
}

/**
 * Add every component name referenced by the matches of `pattern` to
 * `names`, skipping type-only statements.
 *
 * @param pattern - Global pattern with `specifier` in the second capture.
 * @param source - Source text to scan.
 * @param names - Accumulator of component names.
 */
function collectComponentNames(
  pattern: RegExp,
  source: string,
  names: Set<string>,
): void {
  pattern.lastIndex = 0;

  let match = pattern.exec(source);
  while (match !== null) {
    const isTypeOnly = Boolean(match[1]);
    const name = componentNameFromSpecifier(match[2]);
    if (!isTypeOnly && name) {
      names.add(name);
    }
    match = pattern.exec(source);
  }
}

/**
 * Extract the public component names declared by the source of a package
 * entry module.
 *
 * A component is public only when the entry module exposes it at runtime. For
 * a source entry module that means a runtime re-export (`export * from ...` or
 * `export { X } from ...`). A built entry module instead imports each
 * component chunk and emits a single local `export { ... }` statement with no
 * module specifier, so for that shape the runtime imports are the faithful
 * representation of the public surface. Type-only statements never contribute
 * a component, and modules outside `components/` are not components.
 *
 * @param entrySource - Source text of the public entry module.
 * @returns Sorted, de-duplicated component names.
 */
export function parsePublicComponentNames(entrySource: string): string[] {
  const names = new Set<string>();
  collectComponentNames(EXPORT_FROM_PATTERN, entrySource, names);

  if (names.size === 0) {
    collectComponentNames(IMPORT_FROM_PATTERN, entrySource, names);
  }

  return [...names].sort();
}

/**
 * Discover the public component names of an installed or local `asheeui`
 * package.
 *
 * The inventory is derived from the package's public export surface, not from
 * the `components/` directory tree. A component appears in the list only when
 * the package entry module exposes it at runtime, so internal helpers are
 * excluded by construction and a non-component configuration module (such as
 * `scrollbar`) can never be reported as a component. Both a source entry
 * module and a built entry module are supported.
 *
 * @param packageRoot - Absolute path of an `asheeui` package root.
 * @returns Sorted array of public component names.
 *
 * @example
 * ```ts
 * const components = await discoverPublicComponents("/proj/node_modules/asheeui");
 * console.log(components); // ["accordion", "autocomplete", "button", ...]
 * ```
 */
export async function discoverPublicComponents(
  packageRoot: string,
): Promise<string[]> {
  const entry = await resolvePublicEntry(packageRoot);
  if (!entry) return [];

  try {
    const source = await fs.readFile(entry, "utf8");
    return parsePublicComponentNames(source);
  } catch {
    return [];
  }
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
