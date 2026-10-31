/**
 * Colour parsing shared by both renderers and by tooling.
 *
 * A device reads a palette as RGB channels; a browser accepts a much larger colour grammar.
 * The framework's portable set is the intersection: the hex forms and `rgb()`/`rgba()`. Every
 * other form (`oklch()`, `var()`, a named colour) is a browser-only value and is rejected where
 * a palette is validated or painted.
 *
 * Alpha is parsed and then dropped: a palette role is opaque, and the framework's classes carry
 * their own alpha (`bg-secondary/40`).
 */

/** One RGB colour, with channels clamped to 0–255. */
interface ParsedColor {
  r: number;
  g: number;
  b: number;
}

/** Clamp one channel the way CSS does. */
function channel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

/** Read one `rgb()` argument: a number or a percentage. */
function readChannel(argument: string): number | undefined {
  if (argument.endsWith("%")) {
    const share = Number.parseFloat(argument.slice(0, -1));
    if (Number.isNaN(share)) return undefined;
    return channel((share / 100) * 255);
  }

  const value = Number.parseFloat(argument);
  return Number.isNaN(value) ? undefined : channel(value);
}

/**
 * Read a colour in one of the portable forms.
 *
 * @param value - The candidate colour.
 * @returns Its channels, or `undefined` when the value is outside the portable set.
 *
 * @example
 * ```ts
 * parseColor("#047857");           // { r: 4, g: 120, b: 87 }
 * parseColor("rgb(4 120 87)");     // { r: 4, g: 120, b: 87 }
 * parseColor("oklch(0.7 0.1 150)"); // undefined
 * ```
 */
export function parseColor(value: string): ParsedColor | undefined {
  if (typeof value !== "string") return undefined;

  const colour = value.trim();

  const hex = /^#([0-9a-f]{3,8})$/i.exec(colour);
  if (hex) {
    const digits = hex[1] as string;

    if (digits.length === 3 || digits.length === 4) {
      return {
        r: Number.parseInt((digits[0] as string).repeat(2), 16),
        g: Number.parseInt((digits[1] as string).repeat(2), 16),
        b: Number.parseInt((digits[2] as string).repeat(2), 16),
      };
    }

    if (digits.length === 6 || digits.length === 8) {
      return {
        r: Number.parseInt(digits.slice(0, 2), 16),
        g: Number.parseInt(digits.slice(2, 4), 16),
        b: Number.parseInt(digits.slice(4, 6), 16),
      };
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
  if (channels.some((value) => value === undefined)) return undefined;

  return {
    r: channels[0] as number,
    g: channels[1] as number,
    b: channels[2] as number,
  };
}

/**
 * Whether a value is a colour both renderers can apply.
 *
 * @param value - The candidate value.
 * @returns `true` for the hex and rgb() forms.
 */
export function isPortableColor(value: unknown): value is string {
  return typeof value === "string" && parseColor(value) !== undefined;
}

/**
 * Normalise a portable colour to lowercase `#rrggbb`.
 *
 * A field that lets a reader type `rgb()` or `#FFF` stores the same canonical value, so two
 * edits that mean the same colour do not produce two dictionary entries.
 *
 * @param value - A portable colour.
 * @returns The canonical value, or `undefined` when it is not portable.
 */
export function normalizeColor(value: string): string | undefined {
  const parsed = parseColor(value);
  if (!parsed) return undefined;

  return `#${[parsed.r, parsed.g, parsed.b]
    .map((part) => part.toString(16).padStart(2, "0"))
    .join("")}`;
}
