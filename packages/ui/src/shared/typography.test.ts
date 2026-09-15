import { describe, expect, it } from "vitest";
import { cn } from "../utils";
import {
  TYPOGRAPHY_ALIGN_CLASS,
  TYPOGRAPHY_LEADING_CLASS,
  TYPOGRAPHY_ROLE_CLASS,
  TYPOGRAPHY_ROLE_DEFAULT_ELEMENT,
  TYPOGRAPHY_ROLE_TOKEN,
  TYPOGRAPHY_SIZE_CLASS,
  TYPOGRAPHY_TONE_CLASS,
  TYPOGRAPHY_TRACKING_CLASS,
  TYPOGRAPHY_WEIGHT_CLASS,
  type TypographyRole,
} from "./typography";

const ROLES: TypographyRole[] = [
  "display",
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
const RAW_PALETTE_CLASS =
  /\b(?:text|bg|border|ring)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|grey|zinc|neutral|stone|black|white)-\d{2,3}\b/;

const ALL_MAPS: Array<[string, Record<string, string>]> = [
  ["size", TYPOGRAPHY_SIZE_CLASS],
  ["weight", TYPOGRAPHY_WEIGHT_CLASS],
  ["leading", TYPOGRAPHY_LEADING_CLASS],
  ["tracking", TYPOGRAPHY_TRACKING_CLASS],
  ["tone", TYPOGRAPHY_TONE_CLASS],
  ["align", TYPOGRAPHY_ALIGN_CLASS],
];

describe("typography token maps", () => {
  it("covers every token of every axis", () => {
    expect(Object.keys(TYPOGRAPHY_SIZE_CLASS).sort()).toEqual(
      ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"].sort(),
    );
    expect(Object.keys(TYPOGRAPHY_WEIGHT_CLASS).sort()).toEqual(
      ["normal", "medium", "semibold", "bold"].sort(),
    );
    expect(Object.keys(TYPOGRAPHY_LEADING_CLASS).sort()).toEqual(
      ["tight", "snug", "normal", "relaxed", "loose"].sort(),
    );
    expect(Object.keys(TYPOGRAPHY_TRACKING_CLASS).sort()).toEqual(
      ["tighter", "tight", "normal", "wide", "wider", "widest"].sort(),
    );
    expect(Object.keys(TYPOGRAPHY_TONE_CLASS).sort()).toEqual(
      [
        "default",
        "muted",
        "disabled",
        "primary",
        "secondary",
        "danger",
        "warning",
        "success",
        "none",
      ].sort(),
    );
    expect(Object.keys(TYPOGRAPHY_ALIGN_CLASS).sort()).toEqual(
      ["left", "center", "right", "justify"].sort(),
    );
  });

  it("maps every token to a complete, static class string", () => {
    for (const [axis, map] of ALL_MAPS) {
      for (const value of Object.values(map)) {
        expect(value.length, `${axis} value`).toBeGreaterThan(0);
        expect(value, `${axis} value`).not.toContain("${");
        expect(value, `${axis} value`).not.toContain("undefined");
      }
    }
  });

  it("uses framework colour tokens rather than raw palette colours for tones", () => {
    for (const value of Object.values(TYPOGRAPHY_TONE_CLASS)) {
      expect(value).not.toMatch(RAW_PALETTE_CLASS);
    }
  });
});

describe("typography roles", () => {
  it("defines a class, a token entry and a default element for every role", () => {
    expect(Object.keys(TYPOGRAPHY_ROLE_CLASS).sort()).toEqual(
      [...ROLES].sort(),
    );
    expect(Object.keys(TYPOGRAPHY_ROLE_TOKEN).sort()).toEqual(
      [...ROLES].sort(),
    );
    expect(Object.keys(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT).sort()).toEqual(
      [...ROLES].sort(),
    );
  });

  it("keeps the literal role classes identical to their token composition", () => {
    for (const role of ROLES) {
      const tokens = TYPOGRAPHY_ROLE_TOKEN[role];

      expect(TYPOGRAPHY_ROLE_CLASS[role], role).toBe(
        cn(
          TYPOGRAPHY_SIZE_CLASS[tokens.size],
          TYPOGRAPHY_WEIGHT_CLASS[tokens.weight],
          TYPOGRAPHY_LEADING_CLASS[tokens.leading],
          TYPOGRAPHY_TRACKING_CLASS[tokens.tracking],
        ),
      );
    }
  });

  it("renders headings as headings and body copy as paragraphs", () => {
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT["heading-lg"]).toBe("h2");
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT["body-md"]).toBe("p");
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT.label).toBe("span");
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT.display).toBe("h1");
  });

  it("keeps display and heading roles at heading weights", () => {
    expect(TYPOGRAPHY_ROLE_TOKEN.display.weight).toBe("semibold");
    expect(TYPOGRAPHY_ROLE_TOKEN["heading-md"].weight).toBe("semibold");
    expect(TYPOGRAPHY_ROLE_TOKEN["body-md"].weight).toBe("normal");
  });
});
