import { resolve } from "node:path";
import { CANDIDATES, discoverConfig } from "@asheeui/utils/node";
import type { Plugin, ViteDevServer } from "vite";

/**
 * Public specifier that application code imports to access the
 * resolved AsheeUI config.
 *
 * @example
 * ```ts
 * import config from "virtual:ashee-config";
 * ```
 */
const VIRTUAL_ID = "virtual:ashee-config";

/** Vite-internal, `\0`-prefixed id used after `resolveId`. */
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_ID}`;

/** Options accepted by the {@link asheeui} plugin factory. */
export interface AsheeConfigPluginOptions {
  /**
   * Override the directory to look for `asheeui.config.*` in.
   *
   * Defaults to Vite's configured root.
   */
  root?: string;
}

/**
 * Create the Vite plugin that exposes the AsheeUI config as the
 * `virtual:ashee-config` module.
 *
 * Responsibilities:
 * - Resolves the virtual id to an internal, `\0`-prefixed id.
 * - Loads the module by discovering `asheeui.config.*` at the project
 *   root and re-exporting its `default`/`config` export (or
 *   `undefined` when no config exists).
 * - Watches for config file creation, deletion, and edits during dev,
 *   invalidating the module and forcing a full reload.
 *
 * @param options - Plugin options.
 * @param options.root - Override directory for config discovery.
 * @returns A Vite plugin object.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from "vite";
 * import { asheeui } from "@asheeui/vite";
 *
 * export default defineConfig({
 *   plugins: [asheeui()],
 * });
 * ```
 */
export function asheeui(options: AsheeConfigPluginOptions = {}): Plugin {
  let root: string;

  const isConfigFile = (file: string) =>
    CANDIDATES.some((f) => resolve(root, f) === file);

  const invalidateAndReload = (server: ViteDevServer) => {
    const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
    if (mod) server.moduleGraph.invalidateModule(mod);
    server.ws.send({ type: "full-reload" });
  };

  return {
    name: "ashee:config",
    enforce: "pre",
    configResolved(resolved) {
      root = options.root ?? resolved.root;
    },
    configureServer(server) {
      // Creating or deleting the config file is not a "change" to an
      // existing module, so `handleHotUpdate` below will not see it.
      // Watch raw filesystem events for both cases.
      server.watcher.on("add", (file) => {
        if (isConfigFile(file)) invalidateAndReload(server);
      });
      server.watcher.on("unlink", (file) => {
        if (isConfigFile(file)) invalidateAndReload(server);
      });
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
    },
    load(id) {
      if (id !== RESOLVED_VIRTUAL_ID) return;

      const match = discoverConfig(root);
      if (!match) {
        return "const config = undefined;\nexport default config;";
      }

      return [
        `import * as mod from ${JSON.stringify(match)};`,
        `const exports = { ...mod };`,
        `const config = exports.default ?? exports.config ?? exports;`,
        `export default config;`,
      ].join("\n");
    },
    handleHotUpdate({ file, server }) {
      if (!isConfigFile(file)) return;
      invalidateAndReload(server);
      return []; // stop this file's own update from propagating separately
    },
  };
}
