/**
 * The Spinner's configuration face, shared by both platforms.
 *
 * A spinner is a promise that something is happening, and the promise is the same
 * on both platforms: it has a density, it takes the colour of whatever it reports
 * about, and it turns at a speed the consumer chooses. Those three options are
 * named here, once, so `components.spinner` means the same thing in a web
 * application and in a native one, and so a renderer that forgets one of them
 * fails to compile rather than quietly ignoring it.
 *
 * What stays with each renderer is the mechanism, not the vocabulary: the web
 * turns a ring with a CSS animation, native turns one with the platform's own
 * animator. Both read the speed stated here — and because the web states a speed
 * as a CSS duration (`"0.75s"`) while the platform's animator counts milliseconds,
 * the conversion is a rule of the contract too, so the two renderers cannot
 * disagree about what `"2s"` means.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `spinner` here is what makes `components.spinner` a known
 * configuration section without either renderer restating it.
 */

import type { Size } from "../../shared/radius";
import type { Color } from "../../shared/variant";

/**
 * Configuration options for the Spinner.
 *
 * Set under `components.spinner` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface SpinnerConfig {
  /**
   * Diameter of the ring.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Colour role the ring takes.
   * It is the role of whatever the spinner reports about, so a spinner inside a
   * destructive action reads `danger` rather than the application's accent.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * How long one full rotation takes, as a CSS duration.
   *
   * @default "0.75s"
   */
  speed?: string;

  /**
   * Extra classes appended last, so a consumer's own classes win.
   */
  className?: string;
}

/**
 * How long one rotation takes when nothing states otherwise.
 *
 * The value is stated once and read by both renderers: the web writes it into the
 * animation, and native parses it into the duration its animator counts. A consumer
 * who finds it too brisk changes one option rather than two behaviours.
 */
export const SPINNER_FALLBACK_SPEED = "0.75s";

/**
 * Read a CSS duration as the milliseconds a platform animator counts.
 *
 * The web states a duration in the units CSS understands — `"0.75s"`, `"500ms"` —
 * and passes it straight to the animation. A platform animator needs a number, so
 * this is where the two meet. A value that is not a duration is a typo, and a typo
 * falls back to {@link SPINNER_FALLBACK_SPEED} rather than to a zero-duration spin:
 * a spinner that does not spin is a worse answer to a typo than a spinner that
 * spins at the documented speed.
 *
 * @param speed - The configured speed, as a CSS duration.
 * @returns The duration of one rotation in milliseconds.
 *
 * @example
 * ```ts
 * resolveSpinnerDurationMs("0.75s"); // 750
 * resolveSpinnerDurationMs("500ms"); // 500
 * resolveSpinnerDurationMs("nonsense"); // 750
 * ```
 */
export function resolveSpinnerDurationMs(speed: string): number {
  const fallback = Number.parseFloat(SPINNER_FALLBACK_SPEED) * 1000;
  const stated = speed.trim().toLowerCase();

  // The whole value has to be a duration: a number, optionally followed by the unit
  // CSS understands. Reading a number out of a sentence would turn `"0.75s per
  // turn"` into three quarters of a millisecond — a duration nothing would animate.
  const duration = /^(\d*\.?\d+)(ms|s)?$/.exec(stated)?.[1];
  const value = duration ? Number.parseFloat(duration) : Number.NaN;

  if (Number.isNaN(value) || value <= 0) {
    return fallback;
  }

  // A duration without a unit is read as milliseconds, which is how a consumer who
  // writes `"750"` wrote it.
  return stated.endsWith("s") && !stated.endsWith("ms") ? value * 1000 : value;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    spinner: SpinnerConfig;
  }
}
