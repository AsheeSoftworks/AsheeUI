/**
 * The component configuration registry, and the sections B08 brought into core.
 *
 * A consumer writes `components.<name>` and expects it to be typed on both platforms. That promise is
 * a `declare module` augmentation per component: the module that states a section's shape is the one
 * that teaches the registry the key. This test states the two halves of that promise — every shared
 * section declares itself, and the registry a component writes to is the one the resolvers read.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  getAllComponentDefaults,
  getComponentDefaults,
  registerComponentDefaults,
} from "./registry";

/**
 * The eight sections the shared contract states, with the module that declares each.
 *
 * Seven arrived in B08 — Card, Typography and the five layout primitives — and `field` is here
 * because it is the family the others are written against: if the field's section stops declaring
 * itself, the rest of the promise is not worth much.
 */
const SECTIONS: readonly [name: string, file: string][] = [
  ["field", "./components/forms/field/field-config.ts"],
  ["card", "./components/data-display/card/card-config.ts"],
  ["typography", "./components/typography/typography-config.ts"],
  ["centered", "./components/layouts/centered/centered-config.ts"],
  ["container", "./components/layouts/container/container-config.ts"],
  ["grid", "./components/layouts/grid/grid-config.ts"],
  ["section", "./components/layouts/section/section-config.ts"],
  ["stack", "./components/layouts/stack/stack-config.ts"],
];

/** A component module's source, read from beside this test. */
function source(name: string): string {
  return readFileSync(fileURLToPath(new URL(name, import.meta.url)), "utf8");
}

describe("the shared configuration sections", () => {
  it("declares every one in core's registry, so components.<name> is typed on both platforms", () => {
    for (const [name, file] of SECTIONS) {
      const text = source(file);

      expect(text, `${name} declares its section`).toMatch(
        /declare module "[^"]*registry"/,
      );
      expect(text, `${name} augments ComponentTypeConfigRegistry`).toMatch(
        new RegExp(`[\\s\\S]{0,200}\\b${name}:`),
      );
    }
  });

  it("keeps one map, so what a renderer registers is what the resolvers read", () => {
    // A registration is what a renderer does at import time, and the registry is one map: the lookup
    // and the "everything registered" view return the same object, which is what makes a consumer's
    // one `components.<name>` object resolve on either platform instead of from two tables.
    const probe = { size: "md" } as const;

    registerComponentDefaults("card", probe);

    expect(getComponentDefaults("card")).toBe(probe);
    expect(getAllComponentDefaults().card).toBe(probe);
  });
});
