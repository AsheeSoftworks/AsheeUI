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
