import type { NextConfig } from "next";

/**
 * AsheeUI-specific overrides that can be spread into a `NextConfig`
 * when calling {@link withAsheeUI}.
 */
export interface AsheeUIConfigOverrides {
  /**
   * Override the directory to look for `asheeui.config.*` in.
   *
   * Defaults to the project root (the directory containing
   * `next.config.*`).
   */
  root?: string;
  /**
   * Extra packages appended to `transpilePackages`, deduped against the
   * built-in AsheeUI package list.
   */
  transpilePackages?: string[];
}

/**
 * The config object accepted by `withAsheeUI`: a standard `NextConfig`
 * merged with AsheeUI overrides.
 */
export type WithAsheeUIConfig = NextConfig & AsheeUIConfigOverrides;

/**
 * Structural view of the webpack config sections that AsheeUI patches.
 *
 * Kept deliberately minimal so this package does not need a webpack
 * type dependency.
 */
export interface WebpackConfigPatch {
  /** Webpack resolution options. */
  resolve?: {
    /** Module alias map. */
    alias?: Record<string, string>;
  };
  /** Webpack plugins to append to. */
  plugins?: WebpackPluginLike[];
}

/**
 * Structural view of the compilation object passed to webpack's
 * `afterCompile` hook.
 */
export interface WebpackCompilationLike {
  /** Collector for files webpack should watch even when missing. */
  missingDependencies: { add: (path: string) => void };
}

/**
 * Minimal structural view of a webpack plugin used by this package.
 *
 * Only the `apply` method and the `beforeCompile`/`afterCompile` hooks
 * are modelled.
 */
export interface WebpackPluginLike {
  /** Install the plugin onto the compiler. */
  apply: (compiler: {
    hooks: {
      /** Fired before each compilation begins. */
      beforeCompile: {
        tap: (name: string, callback: () => void) => void;
      };
      /** Fired after each compilation finishes. */
      afterCompile: {
        tap: (
          name: string,
          callback: (compilation: WebpackCompilationLike) => void,
        ) => void;
      };
    };
  }) => void;
}

/**
 * Minimal structural view of the webpack context object passed to the
 * `webpack` config function by Next.
 */
export interface WebpackContextLike {
  /** `true` when Next is running a development build. */
  dev: boolean;
}
