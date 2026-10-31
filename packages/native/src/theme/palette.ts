/**
 * Turning a palette into what a React Native view can read.
 *
 * The web applies a theme by writing custom properties on the document (`--ashee-primary` and
 * its siblings) and letting the stylesheet read them. The platform has no document and no
 * stylesheet, but NativeWind can do the same thing: a Tailwind colour stated as
 * `rgb(var(--ashee-primary) / <alpha-value>)` compiles to a value that reads a CSS variable at
 * render time, and `vars()` provides that variable for a subtree. What is missing is the step in
 * between — a `ColorVariant` holds colours (`#047857`), and a variable in that position has to
 * hold **channels** (`4 120 87`), because the class supplies the alpha.
 *
 * The browser resolves alpha itself (`bg-primary/40` becomes `color-mix(...)`), so the web never
 * needs channels and this conversion is the platform's own. It moved out of `@asheeui/core` in
 * C1 with the rest of the platform's layer. The palette *model* stays shared: `PALETTE_ROLES`,
 * `PaletteRole`, `PaletteVariable`, `ColorScheme` and `selectTheme` are core's, because the two
 * renderers read one palette and choose one theme.
 *
 * One decision is stated rather than implied: **a role is opaque.** The alpha of an `rgba()`
 * value is ignored, and a colour that has no channels is an error rather than a silently
 * invisible surface. The framework's own classes carry their alpha (`bg-secondary/40`), so a
 * role that is itself translucent has nowhere to put it.
 */

import {
  type ColorVariant,
  ON_SOLID_CHANNELS,
  type OnSolidVariable,
  PALETTE_ROLES,
  type PaletteVariable,
  parseColor,
} from "@asheeui/core";

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
  const colour = parseColor(value);
  if (!colour) return undefined;

  return `${colour.r} ${colour.g} ${colour.b}`;
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
): Record<PaletteVariable | OnSolidVariable, string> {
  const variables = {} as Record<PaletteVariable | OnSolidVariable, string>;

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

  // The ninth token is not a palette role: it is the ink over a saturated fill, the same in
  // every theme, and it comes from core so both renderers emit one value rather than two that
  // happen to look alike. It is stated as channels like every other variable here.
  variables["--ashee-on-solid"] = ON_SOLID_CHANNELS;

  return variables;
}
