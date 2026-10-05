/**
 * Avatar helpers for AsheeUI.
 * This file provides the small pure helpers the Avatar component needs, kept
 * apart from the component so they can be reasoned about and tested on their
 * own.
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
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  const first = words[0];
  const last = words[words.length - 1];

  return `${first[0]}${last[0]}`.toUpperCase();
}
