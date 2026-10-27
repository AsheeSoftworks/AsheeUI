/**
 * Turning a palette into what a React Native view can read.
 *
 * The web renderer applies a theme by writing custom properties on the document
 * (`--ashee-primary` and its siblings) and letting the stylesheet read them. The platform
 * has no document and no stylesheet, but NativeWind can do the same thing: a Tailwind colour
 * stated as `rgb(var(--ashee-primary) / <alpha-value>)` compiles to a value that reads a CSS
 * variable at render time, and `vars()` provides that variable for a subtree. What is missing
 * is the step in between — a `ColorVariant` holds colours (`#047857`), and a variable in that
 * position has to hold **channels** (`4 120 87`), because the class supplies the alpha.
 *
 * That conversion is a pure function and belongs here rather than in a renderer: it is the
 * same eight roles, the same palette and the same theme selection the web applies, and two
 * renderers that read one palette is the whole point of {@link ColorVariant} living in this
 * package.
 *
 * Three decisions are stated rather than implied:
 *
 * 1. **A role is opaque.** The alpha of an `rgba()` value is ignored, and a colour that has no
 *    channels is an error rather than a silently invisible surface. The framework's own
 *    classes carry their alpha (`bg-secondary/40`), so a role that is itself translucent has
 *    nowhere to put it.
 * 2. **A custom theme is chosen by name, and a name that does not exist is an error.** A typo
 *    in `defaultTheme` is a setup mistake; painting light instead is how a theme silently
 *    stops working.
 * 3. **"system" means the platform's own colour scheme**, which is what `defaultTheme`'s
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
 * Read a colour as an `r g b` channel string.
 *
 * Accepted forms are the ones a palette reasonably states: `#rgb`, `#rgba`, `#rrggbb`,
 * `#rrggbbaa`, `rgb(...)` and `rgba(...)`, with commas or spaces and with numbers or
 * percentages. The alpha, if any, is dropped — see the note at the top of this module.
 *
 * @param value - The colour a palette states.
 * @returns The channels as `"4 120 87"`, or `undefined` when the value is not a colour this
 *   platform can express.
 *
 * @example
 * ```ts
 * colorChannels("#047857"); // "4 120 87"
 * colorChannels("rgb(4 120 87)"); // "4 120 87"
 * colorChannels("var(--brand)"); // undefined
 * ```
 */
export function colorChannels(value: string): string | undefined {
  const colour = value.trim();

  const hex = /^#([0-9a-f]{3,8})$/i.exec(colour);
  if (hex) {
    const digits = hex[1] as string;

    if (digits.length === 3 || digits.length === 4) {
      // #rgb / #rgba: each digit is doubled, which is what a browser does.
      return digits
        .slice(0, 3)
        .split("")
        .map((digit) => Number.parseInt(digit + digit, 16))
        .join(" ");
    }

    if (digits.length === 6 || digits.length === 8) {
      return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6)]
        .map((pair) => Number.parseInt(pair, 16))
        .join(" ");
    }

    return undefined;
  }

  const functional = /^rgba?\((.*)\)$/i.exec(colour);
  if (!functional) return undefined;

  const arguments_ = (functional[1] as string)
    .split(/[\s,/]+/)
    .filter(Boolean)
    .slice(0, 3);

  if (arguments_.length !== 3) return undefined;

  const channels = arguments_.map(readChannel);
  if (channels.some((channel) => channel === undefined)) return undefined;

  return channels.join(" ");
}

/**
 * Read one channel of an `rgb()` colour.
 *
 * @param argument - A number, or a percentage, as CSS writes them.
 * @returns The channel as an integer from 0 to 255, or `undefined` when it is neither.
 */
function readChannel(argument: string): number | undefined {
  if (argument.endsWith("%")) {
    const share = Number.parseFloat(argument.slice(0, -1));
    if (Number.isNaN(share)) return undefined;
    return Math.max(0, Math.min(255, Math.round((share / 100) * 255)));
  }

  const channel = Number.parseFloat(argument);
  if (Number.isNaN(channel)) return undefined;

  return Math.max(0, Math.min(255, Math.round(channel)));
}

/**
 * Turn a palette into the custom properties a subtree is painted with.
 *
 * @param variant - The palette the active theme resolved to.
 * @returns One `--ashee-<role>` property per role, holding channels.
 * @throws When a role is not a colour this platform can express. A role that silently
 *   painted nothing would be a screen with a missing surface, which is the failure this
 *   module exists to prevent.
 *
 * @example
 * ```ts
 * const variables = paletteVariables({ ...palette });
 * // { "--ashee-background": "255 255 255", "--ashee-primary": "4 120 87", ... }
 * ```
 */
export function paletteVariables(
  variant: ColorVariant,
): Record<PaletteVariable, string> {
  const variables = {} as Record<PaletteVariable, string>;

  for (const role of PALETTE_ROLES) {
    const value = variant[role];
    const channels = colorChannels(value);

    if (channels === undefined) {
      throw new Error(
        `[AsheeUI] the "${role}" colour of this theme is ${JSON.stringify(value)}, which this platform cannot apply: a device reads a theme as channels, so a role must be a hex colour (#047857), an #rgb/#rgba form, or rgb()/rgba(). A role is opaque — the alpha of an rgba() value is ignored, because the framework's classes carry their own (bg-secondary/40).`,
      );
    }

    variables[`--ashee-${role}` as PaletteVariable] = channels;
  }

  return variables;
}

/**
 * Which theme to paint, and the palette it names.
 *
 * `"system"` — and a configuration that states no theme at all — resolves to the platform's
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
