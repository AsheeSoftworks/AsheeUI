/**
 * The portrait ratio's documentation.
 *
 * The ratio type states the shape in prose, because a class string and a number cannot express
 * it together, so the prose is the only place the two renderers' values are related. The test
 * reads the module's source rather than its values: a comment is what it asserts.
 *
 * It stayed in core in C1 while the class dictionaries moved, because `image-config.ts` — the
 * file it reads — did not move.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("the image ratio's documentation", () => {
  it("describes the portrait ratio as the 3 / 4 shape both renderers draw", () => {
    const source = readFileSync(new URL("./image-config.ts", import.meta.url), {
      encoding: "utf8",
    });

    expect(source).toContain("`portrait`: 3 / 4");
    expect(source).not.toContain("4 / 5");
  });
});
