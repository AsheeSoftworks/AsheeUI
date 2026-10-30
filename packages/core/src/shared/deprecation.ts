/**
 * The one way a renamed name is kept alive.
 *
 * A rename in this framework has two halves that cannot ship apart: the canonical
 * name, which every document and every example states, and the old name, which a
 * consumer's code still writes. Shipping only the new one breaks them; shipping both
 * without a warning leaves two spellings of one concept forever.
 *
 * The warning is the third half, and it is deliberately quiet: once per process, once
 * per module, in development only, listing every name the module moved *together*.
 * The alternative — a warning per alias, or per render — is a warning consumers learn to
 * filter, which is the same as no warning at all. Production is silent because the
 * consumer cannot act on it there and the message costs a string on every import.
 *
 * This module is the only mechanism; nothing else prints a deprecation. That is what
 * lets a later release find every alias: the codemod searches for `deprecatedAlias`, and
 * the migration guide is generated from `deprecateMany`'s argument.
 */

/**
 * The modules that have already warned in this process.
 *
 * The unit is the module rather than the name because the message lists the names as a
 * group: a consumer reading it sees one decision ("this module moved four names"),
 * instead of four decisions to weigh separately.
 */
const warnedModules = new Set<string>();

/**
 * One name that moved, and the release that moved it.
 *
 * The `since` field is part of the message rather than of this module's logic: a
 * consumer who skips a release needs to know which one told them.
 */
export type MovedName = {
  /** The name a consumer writes today. */
  from: string;
  /** The name the framework answers to from the next release on. */
  to: string;
  /** The version that introduced the new name, e.g. `"2.8.0"`. */
  since: string;
};

/**
 * Announce the names a module moved, once per process, in development only.
 *
 * @param module - The module that holds the aliases, named as a consumer imports it.
 * @param moved - Every name this module moved; an empty list says nothing.
 *
 * @example
 * ```ts
 * deprecateMany("@asheeui/native/provider", [
 *   { from: "AsheeNativeProvider", to: "AsheeUIProvider", since: "2.8.0" },
 * ]);
 * ```
 */
export function deprecateMany(
  module: string,
  moved: ReadonlyArray<MovedName>,
): void {
  // Nothing moved, so there is nothing to announce: a module that only declares
  // canonical names calls this with an empty list and stays silent.
  if (moved.length === 0) return;

  if (process.env.NODE_ENV === "production") return;

  if (warnedModules.has(module)) return;
  warnedModules.add(module);

  const names = moved
    .map(({ from, to, since }) => `  ${from} → ${to} (since ${since})`)
    .join("\n");

  console.warn(
    `[@asheeui] ${module} moved ${moved.length} ${
      moved.length === 1 ? "name" : "names"
    }:\n${names}\n` +
      "The old names are aliases of the new ones and keep working;\n" +
      "they are removed in the next major release.",
  );
}

/**
 * The value itself, so an alias is the same reference as its canonical name.
 *
 * A wrapper that forwarded the call would let the two drift the moment one of them
 * gained a property the other lacked, and it would make `Alias === Canonical` false —
 * the one assertion that proves an alias is an alias. Returning the value unchanged
 * costs nothing at runtime and makes the call site read as a deliberate decision
 * rather than as a variable that happens to hold the same thing.
 *
 * @param value - The canonical implementation.
 * @returns The same value, unchanged.
 *
 * @example
 * ```ts
 * export const AsheeNativeProvider = deprecatedAlias(AsheeUIProvider);
 * ```
 */
export function deprecatedAlias<T>(value: T): T {
  return value;
}
