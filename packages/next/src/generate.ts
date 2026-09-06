import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { CANDIDATES, discoverConfig } from "@asheeui/utils/node";

/**
 * The import specifier used across AsheeUI for the config module.
 *
 * @example
 * ```ts
 * import config from "virtual:ashee-config";
 * ```
 */
export const VIRTUAL_ID = "virtual:ashee-config";

/**
 * Location of the generated shim, relative to the project root.
 *
 * Deliberately kept outside `node_modules`: package managers and CI
 * treat `node_modules` as fully disposable, and a shim the dev server
 * depends on should not live somewhere that can vanish out from under
 * it.
 */
export const SHIM_RELATIVE_PATH = ".ashee/generated-config.mjs";

/**
 * Resolve the absolute path of the generated shim for a project root.
 *
 * @param root - Project root directory. Defaults to `process.cwd()`.
 * @returns Absolute path of the shim file.
 */
export function resolveShimPath(root?: string): string {
  return resolve(root ?? process.cwd(), SHIM_RELATIVE_PATH);
}

/**
 * Resolve every candidate config filename to an absolute path under
 * `root`, whether or not the files currently exist.
 *
 * These paths are registered as webpack "missing dependencies" so that
 * creating a config file for the first time triggers a rebuild.
 *
 * @param root - Project root directory. Defaults to `process.cwd()`.
 * @returns Absolute paths for every known config filename.
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
 *
 * @param fromFile - Absolute path of the importing file.
 * @param toFile - Absolute path of the imported file.
 * @returns A `./`-prefixed relative specifier.
 */
function toRelativeSpecifier(fromFile: string, toFile: string): string {
  const rel = relative(dirname(fromFile), toFile).replaceAll("\\", "/");
  return rel.startsWith(".") ? rel : `./${rel}`;
}

/**
 * Regenerate the config shim, mirroring `@asheeui/vite`'s virtual module:
 * if a config file exists we re-export its default export, otherwise we
 * export `undefined`.
 *
 * The write is skipped when the content is unchanged, so webpack's
 * `beforeCompile` hook does not churn the file (or Turbopack's watcher)
 * on every rebuild.
 *
 * @param root - Project root directory. Defaults to `process.cwd()`.
 * @returns The absolute path of the regenerated shim file.
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
