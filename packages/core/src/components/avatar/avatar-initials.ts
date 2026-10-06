/**
 * The initials an avatar falls back to, for both renderers.
 *
 * The rule is a decision about the identity the framework presents rather than about a
 * platform, so it lives in the shared layer and both renderers read it: an avatar shows
 * the same initials on a phone as it does in a browser, and there is one place to change
 * what "the initials" means.
 */

/**
 * Derives the initials shown when an avatar has no picture.
 *
 * A single word contributes its first two characters, and a longer name
 * contributes the first character of its first and last word, which is what
 * identifies a person in most name orders.
 *
 * @param name - The represented entity's name.
 * @returns One or two uppercase characters, or an empty string when there is
 * nothing to derive them from.
 *
 * @example
 * ```ts
 * getInitials("Ada Lovelace"); // "AL"
 * getInitials("Ashee"); // "AS"
 * getInitials(""); // ""
 * ```
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  const first = words[0];
  const last = words[words.length - 1];

  return `${first[0]}${last[0]}`.toUpperCase();
}
