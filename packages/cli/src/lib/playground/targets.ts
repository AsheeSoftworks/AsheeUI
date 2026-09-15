/**
 * The official playground targets the CLI can distribute.
 *
 * A target is a project the framework ships; the CLI copies it to a client's
 * computer so the client starts from a working AsheeUI application instead of an
 * empty directory. The registry states which targets are ready and which are
 * deliberately not, so the command can answer honestly rather than offer a
 * project that does not exist yet.
 */

/**
 * Status of a playground target.
 *
 * - `ready`: the target ships with the CLI and can be copied.
 * - `deferred`: the target is planned and named here, so a request for it is
 *   answered with the reason instead of a missing directory.
 */
export type PlaygroundTargetStatus = "ready" | "deferred";

/**
 * One playground target.
 */
export interface PlaygroundTarget {
  /** Identifier the command accepts, for example `next`. */
  id: string;

  /** Human-readable name, used in the command's output. */
  label: string;

  /** Status of the target. */
  status: PlaygroundTargetStatus;

  /**
   * Directory inside the CLI package that holds the project, relative to the
   * package root. Absent for a deferred target.
   */
  template?: string;

  /** Why the target is not ready, for a deferred one. */
  reason?: string;
}

/**
 * Every target the command knows, ready or deferred.
 *
 * The three web targets are ready. Expo is deferred on purpose: the native
 * package is not published yet, so a copied Expo project could not install the
 * framework it demonstrates.
 */
export const PLAYGROUND_TARGETS: readonly PlaygroundTarget[] = [
  { id: "next", label: "Next.js", status: "ready", template: "next" },
  { id: "vite", label: "Vite", status: "ready", template: "vite" },
  {
    id: "tanstack",
    label: "TanStack Start",
    status: "ready",
    template: "tanstack",
  },
  {
    id: "expo",
    label: "Expo",
    status: "deferred",
    reason:
      "the React Native package is not published yet, so a copied Expo project could not install the framework it demonstrates",
  },
];

/**
 * Find a target by the identifier a user typed.
 *
 * @param id - Identifier from the command line.
 * @returns The target, or `undefined` when no target has that identifier.
 */
export function findPlaygroundTarget(id: string): PlaygroundTarget | undefined {
  return PLAYGROUND_TARGETS.find((target) => target.id === id);
}

/**
 * The identifiers the command accepts, for its help text and its error message.
 *
 * @returns The identifiers, in registry order.
 */
export function playgroundTargetIds(): string[] {
  return PLAYGROUND_TARGETS.map((target) => target.id);
}

/**
 * The targets that can actually be copied.
 *
 * @returns The ready targets, in registry order.
 */
export function readyPlaygroundTargets(): PlaygroundTarget[] {
  return PLAYGROUND_TARGETS.filter((target) => target.status === "ready");
}
