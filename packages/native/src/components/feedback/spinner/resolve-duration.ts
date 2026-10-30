/**
 * Reading the configured spinner speed as the duration a platform animator counts.
 *
 * The web states a duration in the units CSS understands — `"0.75s"`, `"500ms"` — and passes it
 * straight to the animation. A platform animator needs a number of milliseconds, so this is where
 * the two meet, and it is the platform's own step: the browser never parses the value, the
 * renderer hands it to CSS.
 *
 * The speed itself is shared (`SPINNER_FALLBACK_SPEED`, and the `speed` option of
 * `components.spinner`), which is why this module imports it from `@asheeui/core` rather than
 * stating a second one. It moved out of core in C1 with the rest of the platform's layer.
 */

import { SPINNER_FALLBACK_SPEED } from "@asheeui/core";

/**
 * Read a CSS duration as the milliseconds a platform animator counts.
 *
 * A value that is not a duration is a typo, and a typo falls back to
 * {@link SPINNER_FALLBACK_SPEED} rather than to a zero-duration spin: a spinner that does not
 * spin is a worse answer to a typo than a spinner that spins at the documented speed.
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
