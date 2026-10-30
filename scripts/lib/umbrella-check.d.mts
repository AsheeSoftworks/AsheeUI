/**
 * Types for the umbrella guard's shared evaluator.
 *
 * `scripts/lib/umbrella-check.mjs` is plain Node ESM because two callers that are not
 * TypeScript compile it: the CLI and, through Vite, the umbrella's suite. This declaration
 * is what lets the suite import it without `any` or a suppression.
 */

/** What an assertion says. `pending` is work another batch owns, not a failure. */
export type UmbrellaStatus = "pass" | "fail" | "pending";

/** One of the six assertions `UMBRELLA-REPORT.md` §6 states. */
export interface UmbrellaAssertion {
  /** The assertion's number, 1–6. */
  id: number;

  /** What it asserts, in the report's words. */
  title: string;

  /** The outcome. */
  status: UmbrellaStatus;

  /** The measurement behind the outcome. */
  detail: string;

  /** The names or paths that explain a failure. */
  offending: string[];

  /** The batch that owns the work, for a pending assertion. */
  owner?: string;
}

/** The two branch surfaces and the sets derived from them. */
export interface UmbrellaSurfaces {
  web: number;
  native: number;
  shared: number;
  webOnly: number;
  nativeOnly: number;
  publicWebOnly: number;
  publicNativeOnly: number;
  webNames: string[];
  nativeNames: string[];
  sharedNames: string[];
  publicWebOnlyNames: string[];
  internalWebOnly: number;
  internalNativeOnly: number;
}

/** The declared portable surface, summarized. */
export interface UmbrellaPortable {
  size: number;
  core: number;
  renderer: number;
  pending: number;
  names: string[];
}

/** Everything the guard found. */
export interface UmbrellaSummary {
  root: string;
  surfaces: UmbrellaSurfaces;
  portable: UmbrellaPortable | null;
  assertions: UmbrellaAssertion[];
}

/**
 * Evaluate the umbrella against the declared portable surface.
 *
 * @param options - The repository root; defaults to the working directory.
 * @returns The summary, including the six assertions.
 */
export function evaluateUmbrella(options?: {
  root?: string;
}): UmbrellaSummary;
