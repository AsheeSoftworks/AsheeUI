import type { NextConfig } from "next";

export interface AsheeUIConfigOverrides {
  /**
   * Override the directory to look for `asheeui.config.*` in.
   * Defaults to the project root (the directory containing `next.config.*`).
   */
  root?: string;
  /**
   * Extra packages appended to `transpilePackages` (deduped against the
   * built-in AsheeUI package list).
   */
  transpilePackages?: string[];
}

/** The config object accepted by `withAsheeUI`: a `NextConfig` + AsheeUI overrides. */
export type WithAsheeUIConfig = NextConfig & AsheeUIConfigOverrides;

export interface WebpackConfigPatch {
  resolve?: {
    alias?: Record<string, string>;
  };
  plugins?: WebpackPluginLike[];
}

/** Structural view of the compilation object passed to `afterCompile`. */
export interface WebpackCompilationLike {
  missingDependencies: { add: (path: string) => void };
}

export interface WebpackPluginLike {
  apply: (compiler: {
    hooks: {
      beforeCompile: {
        tap: (name: string, callback: () => void) => void;
      };
      afterCompile: {
        tap: (
          name: string,
          callback: (compilation: WebpackCompilationLike) => void,
        ) => void;
      };
    };
  }) => void;
}

export interface WebpackContextLike {
  dev: boolean;
}
