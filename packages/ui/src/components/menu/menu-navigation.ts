/**
 * Keyboard navigation over a menu option list.
 *
 * The menu helper and the components that keep focus in their own trigger need
 * the same answer to "which option is next", so the arithmetic lives here once:
 * disabled options are skipped, and movement wraps around the ends of the list.
 */

import type { MenuOption } from "./menu-config";

/**
 * Positions of the options that can be reached by keyboard navigation.
 *
 * @param options - The rendered option list, in display order.
 * @returns The indexes of the options that are not disabled.
 */
export function enabledOptionIndexes(options: MenuOption[]): number[] {
  return options.reduce<number[]>((indexes, option, index) => {
    if (!option.disabled) indexes.push(index);
    return indexes;
  }, []);
}

/**
 * Resolves the option that a movement key lands on.
 *
 * Movement starts at the first option when nothing is current yet: forward
 * movement lands on the first enabled option and backward movement on the last
 * one. Once an option is current, movement wraps around the ends of the list.
 *
 * @param options - The rendered option list, in display order.
 * @param currentIndex - The current option, or `null` when none is current.
 * @param delta - Movement direction: `1` forward, `-1` backward.
 * @returns The index to make current, or `null` when no option is reachable.
 */
export function nextOptionIndex(
  options: MenuOption[],
  currentIndex: number | null,
  delta: number,
): number | null {
  const reachable = enabledOptionIndexes(options);
  if (reachable.length === 0) return null;

  const position = currentIndex === null ? -1 : reachable.indexOf(currentIndex);
  const nextPosition =
    position === -1
      ? delta > 0
        ? 0
        : reachable.length - 1
      : (position + delta + reachable.length) % reachable.length;

  return reachable[nextPosition];
}

/**
 * Resolves the first or last reachable option.
 *
 * @param options - The rendered option list, in display order.
 * @param edge - Which end of the list to resolve.
 * @returns The index to make current, or `null` when no option is reachable.
 */
export function edgeOptionIndex(
  options: MenuOption[],
  edge: "first" | "last",
): number | null {
  const reachable = enabledOptionIndexes(options);
  if (reachable.length === 0) return null;

  return edge === "first" ? reachable[0] : reachable[reachable.length - 1];
}

/**
 * Resolves the first reachable option whose label starts with `prefix`.
 *
 * @param options - The rendered option list, in display order.
 * @param prefix - Characters typed so far, matched case insensitively.
 * @returns The index to make current, or `null` when nothing matches.
 */
export function matchingOptionIndex(
  options: MenuOption[],
  prefix: string,
): number | null {
  const match = enabledOptionIndexes(options).find((index) =>
    options[index].label.toLowerCase().startsWith(prefix.toLowerCase()),
  );

  return match ?? null;
}
