import { resolve } from "node:path";
import { CANDIDATES, discoverConfig } from "@ashee/utils/node";
import type { Plugin, ViteDevServer } from "vite";

const VIRTUAL_ID = "virtual:ashee-config";
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_ID}`;

export interface AsheeConfigPluginOptions {
  /** Override the directory to look for asheeui.config.* in. Defaults to Vite's root. */
  root?: string;
}

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
      // Creating/deleting the config file isn't a "change" to an existing
      // module, so handleHotUpdate below won't see it — watch raw fs events.
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
      if (!match) return "export default undefined;";

      return `export { default } from ${JSON.stringify(match)};`;
    },
    handleHotUpdate({ file, server }) {
      if (!isConfigFile(file)) return;
      invalidateAndReload(server);
      return []; // stop this file's own update from propagating separately
    },
  };
}
