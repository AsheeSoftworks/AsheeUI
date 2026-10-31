/**
 * Types for the matrix coverage evaluator.
 *
 * `scripts/lib/matrix-coverage.mjs` is plain Node ESM because the parity guard and the
 * matrix's suite both call it. This declaration is what lets TypeScript read its result
 * without `any` or a suppression.
 */

/** One row of the compatibility matrix, as the guard reads it. */
export interface MatrixEntry {
  name: string;
  module: string;
  support: string;
  native?: string;
  subpath?: string;
  note?: string;
}

/** What the coverage check found. */
export interface MatrixCoverage {
  /** The matrix entries, in source order. */
  entries: MatrixEntry[];

  /** Every matrix name, sorted. */
  matrixNames: string[];

  /** The public components the web entries publish, sorted. */
  publicComponents: string[];

  /** `export name -> matrix name` for the parts and aliases of a module. */
  aliases: Record<string, string>;

  /** Public components neither named nor aliased by the matrix. */
  uncovered: string[];

  /** Aliases whose target is not a matrix name. */
  unknownAliases: string[];

  /** Aliases whose export the web package no longer publishes. */
  staleAliases: string[];
}

/**
 * Evaluate the matrix against the web package's public entries.
 *
 * @param options - The repository root; defaults to the working directory.
 * @returns The matrix names, the public components, and the disagreements.
 */
export function evaluateMatrixCoverage(options?: {
  root?: string;
}): MatrixCoverage;
