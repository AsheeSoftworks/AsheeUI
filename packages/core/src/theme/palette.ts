/**
 * The palette model both renderers share.
 *
 * A theme is a set of eight colour roles. The web applies it by writing custom properties on
 * the document; the platform converts the same palette into the channels NativeWind reads. The
 * *roles*, the *shape* of a palette and the *choice* of theme are shared, so they live here:
 * `PALETTE_ROLES`, `PaletteRole`, `PaletteVariable`, `ColorScheme` and `selectTheme`.
 *
 * The conversion itself — the `#047857` → `4 120 87` step, which exists only because a device
 * reads a theme as channels while a browser resolves alpha itself — is native's, and moved to
 * `@asheeui/native` in C1 with the rest of the platform's layer.
 *
 * Two decisions are stated rather than implied:
 *
 * 1. **A custom theme is chosen by name, and a name that does not exist is an error.** A typo
 *    in `defaultTheme` is a setup mistake; painting light instead is how a theme silently
 *    stops working.
 * 2. **"system" means the platform's own colour scheme**, which is what `defaultTheme`'s
 *    default asks for on both renderers.
 */

import type { ColorConfig, ColorVariant, ThemeName } from "./color";

/**
 * The colour roles a class can name, in the order the documentation lists them.
 *
 * They are the eight the components reference (`bg-background`, `text-foreground`,
 * `bg-primary`, `border-border` and the rest) and the same eight `@asheeui/web` exposes as
 * `--color-*` in its `@theme` block, so one palette describes both renderers.
 */
export const PALETTE_ROLES = [
  "background",
  "foreground",
  "primary",
  "secondary",
  "border",
  "danger",
  "warning",
  "success",
] as const;

/** One of the eight roles a palette states. */
export type PaletteRole = (typeof PALETTE_ROLES)[number];

/** The custom property a role is applied as, for example `--ashee-primary`. */
export type PaletteVariable = `--ashee-${PaletteRole}`;

/** The colour scheme a platform reports, which "system" resolves to. */
export type ColorScheme = "light" | "dark";

/**
 * Which theme to paint, and the palette it names.
 *
 * `"system"` â€” and a configuration that states no theme at all â€” resolves to the platform's
 * own colour scheme, which is what `defaultTheme`'s default means on both renderers. A name
 * that no palette answers is an error rather than a fallback, because a typo that painted
 * light would look like a theme that stopped working.
 *
 * @param palettes - The resolved palettes, keyed by theme name.
 * @param requested - The theme the configuration states, if any.
 * @param scheme - The colour scheme the platform reports.
 * @returns The theme's name and its palette.
 * @throws When `requested` names a theme the configuration does not declare.
 *
 * @example
 * ```ts
 * selectTheme(palettes, "system", "dark"); // { name: "dark", palette: ... }
 * selectTheme(palettes, "midnight", "light"); // { name: "midnight", palette: ... }
 * ```
 */
export function selectTheme(
  palettes: ColorConfig,
  requested: ThemeName | "system" | undefined,
  scheme: ColorScheme,
): { name: string; palette: ColorVariant } {
  if (requested !== undefined && requested !== "system") {
    const palette = palettes[requested];

    if (!palette) {
      throw new Error(
        `[AsheeUI] defaultTheme names "${requested}", which this configuration does not declare. Declared: ${Object.keys(palettes).join(", ")}. State the theme under \`color\`, or use "system" to follow the platform.`,
      );
    }

    return { name: requested, palette };
  }

  const palette = palettes[scheme];
  if (!palette) {
    throw new Error(
      `[AsheeUI] the configuration declares no "${scheme}" palette, which every theme falls back to.`,
    );
  }

  return { name: scheme, palette };
}
