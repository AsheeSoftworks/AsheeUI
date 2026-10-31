/**
 * Turning a reader's display name into a runtime theme slug.
 *
 * The slug is the key in `ExternalColorConfig` and the web's `.theme-<slug>` class, so it is the
 * stricter form: lowercase, letters/digits/hyphens, starts with a letter, at most 64 characters.
 * The editor shows both the name the reader typed and the slug that is actually stored.
 */

/** Reserved names a runtime theme cannot use. */
export const RESERVED_THEME_NAMES = new Set(["light", "dark", "system"]);

/**
 * Turn a display name into a valid runtime theme slug.
 *
 * @param value - What the reader typed.
 * @returns A lowercase slug, possibly empty when the input has no usable characters.
 *
 * @example
 * ```ts
 * slugify("Coastal blue"); // "coastal-blue"
 * slugify("2026 brand");   // "t-2026-brand"
 * ```
 */
export function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  if (slug === "") return "";
  return /^[a-z]/.test(slug) ? slug : `t-${slug}`.slice(0, 64);
}

/** Whether a slug is reserved and therefore cannot be a runtime theme name. */
export function isReservedThemeName(slug: string): boolean {
  return RESERVED_THEME_NAMES.has(slug);
}
