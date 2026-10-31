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

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { evaluateMatrixCoverage } from "../../../scripts/lib/matrix-coverage.mjs";
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

  it("covers every public component the web package publishes", () => {
    // F13's coverage check, shared with the parity guard so the two readers cannot
    // disagree: the web package's `"."` and `"./section-kit"` entries must have no public
    // component without a matrix entry or a declared alias. A component the matrix misses
    // is a platform decision nobody made, which is exactly what a new component used to be
    // able to ship as.
    const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
    const coverage = evaluateMatrixCoverage({ root });

    expect(coverage.uncovered).toEqual([]);
    expect(coverage.unknownAliases).toEqual([]);
    expect(coverage.staleAliases).toEqual([]);
    // The matrix is read as data by both readers, so an entry one of them cannot see
    // promises nothing; the source order is the one the guard reports.
    expect(coverage.entries.map((entry) => entry.module)).toEqual(
      COMPONENT_SUPPORT.map((entry) => entry.module),
    );
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
