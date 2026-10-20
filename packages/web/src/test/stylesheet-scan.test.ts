// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The stylesheet is where the utility classes are discovered. Tailwind generates a class
 * only when its scan finds the name, and the component class names are split across two
 * packages: `@asheeui/web`'s own TSX, and the style maps in `@asheeui/core`. A stylesheet
 * that scans only its own folder generates half the classes, and the failure is silent —
 * components render without their padding and spacing rather than failing a build.
 *
 * These assertions are cheap and state the requirement, because the symptom (some styles
 * simply not applying) is otherwise very hard to trace back to a missing scan pattern.
 */
const stylesheet = readFileSync(
  new URL("../index.css", import.meta.url),
  "utf8",
);

describe("the stylesheet's class scan", () => {
  it("scans the core package, whose style maps carry most of the classes", () => {
    // From source, in this repository and through a workspace link.
    expect(stylesheet).toContain('@source "../../core/src/**/*.{ts,tsx}"');
    // From the installed package, where core is compiled.
    expect(stylesheet).toContain('@source "../../core/dist/**/*.js"');
  });

  it("scans the compiled output, which is what a published consumer receives", () => {
    expect(stylesheet).toContain('@source "./**/*.js"');
  });

  it("keeps scanning its own sources for the workspace shape", () => {
    expect(stylesheet).toContain('@source "./**/*.{ts,tsx}"');
  });
});

describe("the stylesheet's own colours", () => {
  // A stable gutter on `*` reserves scrollbar space inside every clipping box, which shrank the Avatar's
  // 40px circle to a 30px content box and clipped its contents into a flat-edged "D". The gutter belongs on
  // the page, so this asserts it was not put back on the universal selector.
  it("reserves the scrollbar gutter on the page, not on every element", () => {
    expect(stylesheet).toMatch(/html\s*{[^}]*scrollbar-gutter/);
    expect(stylesheet).not.toMatch(/\*\s*{[^}]*scrollbar-gutter/);
  });

  it("derives the disabled field background from a theme token", () => {
    // A hard-coded hex ignores light, dark and custom palettes, and the palette
    // scanner only reads `.ts`/`.tsx`, so CSS has no other guard.
    expect(stylesheet).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(stylesheet).toMatch(
      /input:disabled[\s\S]*background-color:\s*color-mix\(\s*in oklab,\s*var\(--ashee-foreground\)/,
    );
  });
});
