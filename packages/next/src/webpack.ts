import { VIRTUAL_ID } from "./generate";
import type {
  WebpackConfigPatch,
  WebpackContextLike,
  WebpackPluginLike,
} from "./types";

/**
 * Exact-match alias key ($-suffixed) so a hypothetical future
 * `virtual:ashee-config/foo` import doesn't also resolve through this alias.
 */
const EXACT_VIRTUAL_ID = `${VIRTUAL_ID}$`;

/**
 * Point `virtual:ashee-config` at the generated shim so app code keeps using
 * the same import specifier as Vite.
 */
export function addAsheeConfigAlias(
  config: WebpackConfigPatch,
  shimPath: string,
): WebpackConfigPatch {
  config.resolve ??= {};
  config.resolve.alias ??= {};
  config.resolve.alias[EXACT_VIRTUAL_ID] = shimPath;
  return config;
}

/**
 * Dev-only plugin: regenerate the shim before every compile so editing an
 * existing config file always picks up. Also registers every candidate
 * filename as a webpack "missing dependency" — the shim has no reference to
 * a file that doesn't exist yet, so without this, *creating* the config file
 * for the first time would never trigger a rebuild on its own. Writes are
 * skipped when content is unchanged, keeping rebuilds cheap.
 */
export function createBeforeCompilePlugin(
  regenerate: () => void,
  candidatePaths: string[],
): WebpackPluginLike {
  return {
    apply(compiler) {
      compiler.hooks.beforeCompile.tap("ashee:virtual-config", () => {
        regenerate();
      });
      compiler.hooks.afterCompile.tap("ashee:virtual-config", (compilation) => {
        for (const path of candidatePaths) {
          compilation.missingDependencies.add(path);
        }
      });
    },
  };
}

/**
 * Create the webpack hook Next invokes: it always adds the config alias, and
 * in dev it installs the beforeCompile regeneration + missing-dependency
 * plugin.
 */
export function createWebpackHook(options: {
  shimPath: string;
  candidatePaths: string[];
  root?: string;
  regenerate: (root?: string) => string;
}): (
  config: WebpackConfigPatch,
  context: WebpackContextLike,
) => WebpackConfigPatch {
  const { shimPath, candidatePaths, regenerate, root } = options;

  return (config, context) => {
    addAsheeConfigAlias(config, shimPath);

    if (context.dev) {
      config.plugins ??= [];
      config.plugins.push(
        createBeforeCompilePlugin(() => regenerate(root), candidatePaths),
      );
    }

    return config;
  };
}
