/**
 * Tests for the design tokens and the compatibility matrix.
 *
 * Two properties matter. The design language must be complete and ordered, because
 * both platforms map it and a missing step would silently become a platform
 * difference. The matrix must cover every public component with exactly one
 * classification, because it is the statement of what the framework promises on each
 * platform, and a component that is missing from it is a component whose platform
 * support nobody has decided.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  COMPONENT_SUPPORT,
  findComponentSupport,
  PLATFORM_SUPPORT_LABEL,
} from "./matrix";
import {
  BREAKPOINT,
  COLOR_ROLE,
  ELEVATION_LEVEL,
  FONT_SIZE_STEP,
  FONT_WEIGHT_STEP,
  MIN_TOUCH_TARGET,
  RADIUS_STEP,
  SIZE,
  SPACING_STEP,
  VARIANT,
} from "./tokens";

/**
 * Where the matrix's array literal begins in its source file.
 *
 * It is `scripts/check-native-parity.mjs`'s own pattern, and it is repeated here on purpose: the
 * guard reads the matrix as *data* rather than importing it, so that it never verifies a stale
 * build, and a component is only promised anything if that reader can see it.
 */
const MATRIX_ARRAY = /COMPONENT_SUPPORT[^=]*=\s*\[([\s\S]*?)\n\];/;

/**
 * Read the classified module of every entry the parity guard would see.
 *
 * @returns The modules, in source order.
 */
function modulesInMatrixSource(): string[] {
  const source = readFileSync(
    fileURLToPath(new URL("./matrix.ts", import.meta.url)),
    "utf8",
  );
  const array = source.match(MATRIX_ARRAY)?.[1] ?? "";

  return [...array.matchAll(/\{([^{}]*)\}/g)]
    .map((match) => /module:\s*"([^"]*)"/.exec(match[1])?.[1])
    .filter((module): module is string => module !== undefined);
}

describe("the design language", () => {
  it("orders the spacing scale from the smallest step to the largest", () => {
    const steps = Object.values(SPACING_STEP);

    expect(steps[0]).toBe(0);
    expect([...steps]).toEqual([...steps].sort((a, b) => a - b));
    expect(new Set(steps).size).toBe(steps.length);
  });

  it("orders the elevation scale and starts it at no elevation", () => {
    expect(ELEVATION_LEVEL.none).toBe(0);
    expect(ELEVATION_LEVEL.lg).toBeGreaterThan(ELEVATION_LEVEL.sm);
  });

  it("orders the breakpoints and the font sizes", () => {
    expect(BREAKPOINT.sm).toBeLessThan(BREAKPOINT.md);
    expect(BREAKPOINT.md).toBeLessThan(BREAKPOINT.lg);
    expect(BREAKPOINT.lg).toBeLessThan(BREAKPOINT.xl);
    expect(Object.keys(FONT_SIZE_STEP)).toEqual([
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "3xl",
    ]);
  });

  it("holds a touch target a thumb can hit", () => {
    expect(MIN_TOUCH_TARGET).toBeGreaterThanOrEqual(44);
  });

  it("names the shared vocabulary once", () => {
    expect(Object.values(VARIANT)).toEqual([
      "solid",
      "faded",
      "bordered",
      "ghost",
      "underlined",
    ]);
    expect(Object.keys(COLOR_ROLE)).toContain("primary");
    expect(Object.keys(SIZE)).toEqual(["sm", "md", "lg"]);
    expect(Object.keys(RADIUS_STEP)).toContain("full");
    expect(Object.keys(FONT_WEIGHT_STEP)).toContain("semibold");
  });
});

describe("the compatibility matrix", () => {
  it("classifies every component exactly once", () => {
    const names = COMPONENT_SUPPORT.map((entry) => entry.name);
    const modules = COMPONENT_SUPPORT.map((entry) => entry.module);

    expect(new Set(names).size).toBe(names.length);
    expect(new Set(modules).size).toBe(modules.length);
  });

  it("covers the component inventory", () => {
    // The number is not stated here any more: it is read from the same source the parity guard
    // reads, so the two readers cannot disagree about how many components the framework
    // classifies, and an entry the guard's reader cannot see fails this test instead of quietly
    // shrinking what the guard promises. B24 replaces this with the coverage check
    // `NATIVE-PARITY-REPORT.md` F13 describes, which asks the web package's entry points instead.
    const classified = modulesInMatrixSource();

    expect(COMPONENT_SUPPORT).toHaveLength(classified.length);
    expect(classified).toEqual(COMPONENT_SUPPORT.map((entry) => entry.module));
  });

  it("uses a classification the vocabulary explains", () => {
    for (const entry of COMPONENT_SUPPORT) {
      expect(
        PLATFORM_SUPPORT_LABEL[entry.support],
        `${entry.name} has a labelled classification`,
      ).toBeTruthy();
    }
  });

  it("names the native equivalent wherever the implementation differs", () => {
    for (const entry of COMPONENT_SUPPORT) {
      if (entry.support === "shared-api") {
        expect(
          entry.native,
          `${entry.name} names its native equivalent`,
        ).toBeTruthy();
      }
      if (entry.support === "web-only" || entry.support === "not-applicable") {
        expect(entry.note, `${entry.name} explains why`).toBeTruthy();
      }
    }
  });

  it("finds a component by its exported name", () => {
    expect(findComponentSupport("Drawer")?.support).toBe("shared-api");
    expect(findComponentSupport("Keyboard")?.support).toBe("not-applicable");
    expect(findComponentSupport("Nothing")).toBeUndefined();
  });

  it("states the platform support of the components the native package ships", () => {
    for (const name of ["Button", "Card", "Badge", "Input", "Stack"]) {
      const entry = findComponentSupport(name);

      expect(entry?.support, `${name} is shared`).toBe("shared");
    }
  });
});
