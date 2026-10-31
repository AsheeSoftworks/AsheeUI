import { describe, expect, it } from "vitest";
import {
  TYPOGRAPHY_ALIGN_VALUES,
  TYPOGRAPHY_LEADING_VALUES,
  TYPOGRAPHY_ROLE_TOKEN,
  TYPOGRAPHY_SIZE_VALUES,
  TYPOGRAPHY_TONE_VALUES,
  TYPOGRAPHY_TRACKING_VALUES,
  TYPOGRAPHY_WEIGHT_VALUES,
  type TypographyRole,
} from "./typography";

const _ROLES: TypographyRole[] = [
  "display",
  "page-title",
  "heading-xl",
  "heading-lg",
  "heading-md",
  "heading-sm",
  "body-lg",
  "body-md",
  "body-sm",
  "label",
  "caption",
  "overline",
];

/** Raw Tailwind palette utilities, which typography must never emit. */
const _RAW_PALETTE_CLASS =
  /\b(?:text|bg|border|ring)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|grey|zinc|neutral|stone|black|white)-\d{2,3}\b/;

const ALL_MAPS: Array<[string, Record<string, string>]> = [
  ["size", TYPOGRAPHY_SIZE_VALUES],
  ["weight", TYPOGRAPHY_WEIGHT_VALUES],
  ["leading", TYPOGRAPHY_LEADING_VALUES],
  ["tracking", TYPOGRAPHY_TRACKING_VALUES],
  ["tone", TYPOGRAPHY_TONE_VALUES],
  ["align", TYPOGRAPHY_ALIGN_VALUES],
];

describe("typography token maps", () => {
  it("maps every token to a complete, static class string", () => {
    for (const [axis, map] of ALL_MAPS) {
      for (const value of Object.values(map)) {
        expect(value.length, `${axis} value`).toBeGreaterThan(0);
        expect(value, `${axis} value`).not.toContain("${");
        expect(value, `${axis} value`).not.toContain("undefined");
      }
    }
  });

  it("gives a page's own title the treatment heading-lg states", () => {
    // The role exists so a shared page frame can say "this is the title" without choosing between the wrong element
    // and the wrong size. The element it renders as is the web's table, asserted in `@asheeui/web` beside the classes.
    expect(TYPOGRAPHY_ROLE_TOKEN["page-title"]).toEqual(
      TYPOGRAPHY_ROLE_TOKEN["heading-lg"],
    );
  });

  it("keeps display and heading roles at heading weights", () => {
    expect(TYPOGRAPHY_ROLE_TOKEN.display.weight).toBe("semibold");
    expect(TYPOGRAPHY_ROLE_TOKEN["heading-md"].weight).toBe("semibold");
    expect(TYPOGRAPHY_ROLE_TOKEN["body-md"].weight).toBe("normal");
  });
});
