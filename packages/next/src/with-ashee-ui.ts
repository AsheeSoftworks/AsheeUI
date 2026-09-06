import type { NextConfig } from "next";
import {
  generateShim,
  resolveCandidatePaths,
  resolveShimPath,
  SHIM_RELATIVE_PATH,
  VIRTUAL_ID,
} from "./generate";
import type { TurbopackPatch } from "./turbopack";
import { addAsheeConfigResolveAlias } from "./turbopack";
import type {
  WebpackConfigPatch,
  WebpackContextLike,
  WithAsheeUIConfig,
} from "./types";
import { createWebpackHook } from "./webpack";

/**
 * AsheeUI packages that ship TypeScript source and must be compiled by
 * Next.
 *
 * `transpilePackages` takes npm package names, deduped against any the
 * consumer provides.
 */
const ASHEE_TRANSPILE_PACKAGES = ["asheeui"];

type NextWebpack = NonNullable<NextConfig["webpack"]>;

/**
 * Structural superset of `NextConfig` used to reach legacy keys.
 *
 * Next 15 kept `transpilePackages` on `NextConfig` and Turbopack behind
 * `experimental.turbo`; Next 16 removed both (Turbopack is the default).
 * This superset lets one code path type-check against either major
 * version of the peer dependency.
 */
type LegacyNextConfig = NextConfig & {
  transpilePackages?: string[];
  experimental?: {
    turbo?: unknown;
  };
};

/**
 * Wrap a `next.config.mjs`/`next.config.ts` object with AsheeUI
 * integration.
 *
 * The wrapper:
 * 1. Generates a config shim at `.ashee/generated-config.mjs` (same
 *    resolution as `@asheeui/vite`'s `virtual:ashee-config`).
 * 2. Adds a `virtual:ashee-config` alias for Webpack and Turbopack so
 *    app code uses the identical import specifier in both bundlers.
 *    Webpack gets an absolute path (it resolves against its own
 *    context, not the `root` override), Turbopack gets a
 *    project-root-relative one (it rejects absolute targets).
 * 3. Merges `transpilePackages` so AsheeUI's source-shipping packages
 *    are compiled by Next.
 *
 * @param config - Next config to wrap. AsheeUI override keys (`root`,
 *   `transpilePackages`) are consumed and stripped from the returned
 *   `NextConfig`. Defaults to `{}`.
 * @returns A plain `NextConfig` with the AsheeUI integration applied.
 *
 * @example
 * ```ts
 * // next.config.ts
 * import { withAsheeUI } from "@asheeui/next";
 *
 * export default withAsheeUI({
 *   transpilePackages: ["@my-org/ui"],
 * });
 * ```
 */
export function withAsheeUI(config: WithAsheeUIConfig = {}): NextConfig {
  const {
    root,
    transpilePackages: extraTranspilePackages,
    ...nextConfig
  } = config;

  const baseDir = root ?? process.cwd();

  // Read-only access to config keys that only exist on Next 15.
  const legacyConfig = nextConfig as LegacyNextConfig;

  generateShim(baseDir);

  const absoluteShimPath = resolveShimPath(baseDir);
  const relativeShimPath = `./${SHIM_RELATIVE_PATH}`;
  const candidatePaths = resolveCandidatePaths(baseDir);

  const transpilePackages = [
    ...new Set([
      ...ASHEE_TRANSPILE_PACKAGES,
      ...(legacyConfig.transpilePackages ?? []),
      ...(extraTranspilePackages ?? []),
    ]),
  ];

  const userWebpack = nextConfig.webpack;

  const webpack: NextWebpack = ((config, context) => {
    const patchConfig = config as unknown as WebpackConfigPatch;
    const patchContext = context as unknown as WebpackContextLike;

    const hook = createWebpackHook({
      shimPath: absoluteShimPath,
      candidatePaths,
      root: baseDir,
      regenerate: generateShim,
    });

    if (userWebpack) {
      const userResult = userWebpack(
        patchConfig as never,
        patchContext as never,
      );
      return hook(userResult as WebpackConfigPatch, patchContext) as never;
    }

    return hook(patchConfig, patchContext) as never;
  }) as NextWebpack;

  // Turbopack: patch the stable key, and also the experimental fallback
  // if the consumer configured it on an older Next 15.x.
  const turbopackResolveAlias: Record<string, string> = {
    ...(nextConfig.turbopack?.resolveAlias ?? {}),
    [VIRTUAL_ID]: relativeShimPath,
  };

  const turbopack = {
    ...nextConfig.turbopack,
    resolveAlias: turbopackResolveAlias,
  };

  const patchedConfig: NextConfig = {
    ...nextConfig,
    transpilePackages,
    webpack,
    turbopack,
  };

  if (legacyConfig.experimental?.turbo) {
    const turboPatch = addAsheeConfigResolveAlias(
      legacyConfig.experimental.turbo as TurbopackPatch,
      relativeShimPath,
    ) as never;
    patchedConfig.experimental = {
      ...nextConfig.experimental,
      turbo: turboPatch,
    } as NextConfig["experimental"];
  }

  return patchedConfig;
}
