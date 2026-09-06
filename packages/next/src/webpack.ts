import { VIRTUAL_ID } from "./generate";
import type {
  WebpackConfigPatch,
  WebpackContextLike,
  WebpackPluginLike,
} from "./types";

/**
 * Exact-match alias key (`$`-suffixed) so a hypothetical future
 * `virtual:ashee-config/foo` import does not also resolve through this
 * alias.
 */
const EXACT_VIRTUAL_ID = `${VIRTUAL_ID}$`;

/**
 * Point `virtual:ashee-config` at the generated shim so app code keeps
 * using the same import specifier as Vite.
 *
 * @param config - Webpack config section to patch (mutated in place).
 * @param shimPath - Absolute path of the generated shim.
 * @returns The same `config` object, with the alias registered.
 *
 * @example
 * ```ts
 * const config = addAsheeConfigAlias(
 *   { resolve: { alias: {} } },
 *   "/proj/.ashee/generated-config.mjs",
 * );
 * ```
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
 * Create a dev-only webpack plugin that regenerates the shim before
 * every compile so edits to an existing config file are always picked
 * up.
 *
 * The plugin also registers every candidate filename as a webpack
 * "missing dependency": the shim has no reference to a file that does
 * not exist yet, so without this, *creating* the config file for the
 * first time would never trigger a rebuild on its own. Writes are
 * skipped when content is unchanged, keeping rebuilds cheap.
 *
 * @param regenerate - Callback that rewrites the shim file.
 * @param candidatePaths - Absolute candidate config paths to watch as
 *   missing dependencies.
 * @returns A webpack plugin object.
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
 * Create the webpack hook that Next invokes when building.
 *
 * The returned hook always adds the config alias; in dev mode it also
 * installs the `beforeCompile` regeneration plugin and the
 * missing-dependency watcher.
 *
 * @param options - Hook options.
 * @param options.shimPath - Absolute path of the generated shim.
 * @param options.candidatePaths - Absolute candidate config paths.
 * @param options.root - Project root used when regenerating the shim.
 * @param options.regenerate - Function that regenerates the shim for a
 *   given root directory.
 * @returns A webpack config hook matching Next's `webpack` signature.
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
