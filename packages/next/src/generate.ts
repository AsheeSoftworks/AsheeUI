import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { CANDIDATES, discoverConfig } from "@ashee/utils/node";

/** The import specifier used across AsheeUI for the config module. */
export const VIRTUAL_ID = "virtual:ashee-config";

/**
 * Location of the generated shim, relative to the project root.
 * Deliberately kept outside node_modules — package managers and CI treat
 * node_modules as fully disposable, and a shim the dev server depends on
 * shouldn't live somewhere that can vanish out from under it.
 */
export const SHIM_RELATIVE_PATH = ".ashee/generated-config.mjs";

/** Absolute path of the generated shim for a given project root. */
export function resolveShimPath(root?: string): string {
  return resolve(root ?? process.cwd(), SHIM_RELATIVE_PATH);
}

/**
 * Absolute paths of every candidate config filename under `root`, whether or
 * not they currently exist. Used to register them as webpack "missing
 * dependencies" so creating one for the first time is actually detected.
 */
export function resolveCandidatePaths(root?: string): string[] {
  const base = root ?? process.cwd();
  return CANDIDATES.map((file) => resolve(base, file));
}

/**
 * Build an import specifier for `toFile` relative to `fromFile`'s directory.
 *
 * Turbopack rejects absolute ("server-relative") import specifiers, so the
 * shim must reference the discovered config with a path relative to itself.
 */
function toRelativeSpecifier(fromFile: string, toFile: string): string {
  const rel = relative(dirname(fromFile), toFile).replaceAll("\\", "/");
  return rel.startsWith(".") ? rel : `./${rel}`;
}

/**
 * Regenerate the config shim, mirroring @ashee/vite's virtual module: if a
 * config file exists we re-export its default export, otherwise we export
 * `undefined`. Returns the shim's absolute path.
 *
 * The write is skipped when the content is unchanged, so webpack's
 * `beforeCompile` hook doesn't churn the file (or Turbopack's watcher) on
 * every rebuild.
 */
export function generateShim(root?: string): string {
  const shimPath = resolveShimPath(root);
  const configPath = discoverConfig(root);

  const content = configPath
    ? `export { default } from ${JSON.stringify(
        toRelativeSpecifier(shimPath, configPath),
      )};\n`
    : "export default undefined;\n";

  if (!existsSync(shimPath) || readFileSync(shimPath, "utf8") !== content) {
    mkdirSync(dirname(shimPath), { recursive: true });
    writeFileSync(shimPath, content, "utf8");
  }

  return shimPath;
}
