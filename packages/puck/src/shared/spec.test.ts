/**
 * The shared block specs' contract.
 *
 * What is worth testing here is not that a block draws — that is each platform's own
 * suite — but that the description the two platforms read is complete and honest: every
 * name has a spec, every spec has a label and fields, every field is a type a builder
 * understands, every category names blocks that exist and files each of them once, and
 * every default value survives a JSON round trip so nothing in a saved page depends on
 * runtime state.
 *
 * These are the assertions that keep the two registries from drifting, because both of
 * them read exactly this.
 */

import { describe, expect, it } from "vitest";
import {
  type AsheeField,
  PUCK_BLOCK_NAMES,
  PUCK_CATEGORIES,
  PUCK_SPECS,
} from "../shared";

/** The field types a builder understands. */
const FIELD_TYPES = new Set([
  "text",
  "textarea",
  "number",
  "select",
  "radio",
  "array",
  "object",
  "richtext",
  "external",
  "custom",
  "slot",
]);

/**
 * Collect a field's type and the types of any fields nested inside it.
 *
 * @param field - The field definition.
 * @param found - The types collected so far.
 * @returns Every type the field uses.
 */
function collectFieldTypes(field: AsheeField, found: string[] = []): string[] {
  const definition = field as {
    type?: string;
    arrayFields?: Record<string, AsheeField>;
    objectFields?: Record<string, AsheeField>;
  };

  if (definition.type) found.push(definition.type);

  for (const nested of Object.values(definition.arrayFields ?? {})) {
    collectFieldTypes(nested, found);
  }
  for (const nested of Object.values(definition.objectFields ?? {})) {
    collectFieldTypes(nested, found);
  }

  return found;
}

describe("the shared block specs", () => {
  it("describes exactly the blocks the registry is declared to hold", () => {
    expect(Object.keys(PUCK_SPECS).sort()).toEqual(
      [...PUCK_BLOCK_NAMES].sort(),
    );
  });

  it("gives every block a label and fields", () => {
    for (const [name, spec] of Object.entries(PUCK_SPECS)) {
      expect(spec.label, `${name} is labelled`).toBeTruthy();
      expect(spec.fields, `${name} has fields`).toBeDefined();
    }
  });

  it("uses only field types the builder understands", () => {
    for (const [name, spec] of Object.entries(PUCK_SPECS)) {
      for (const [field, definition] of Object.entries(spec.fields)) {
        for (const type of collectFieldTypes(definition)) {
          expect(FIELD_TYPES.has(type), `${name}.${field} uses ${type}`).toBe(
            true,
          );
        }
      }
    }
  });

  it("gives every select and radio field the options it needs", () => {
    for (const [name, spec] of Object.entries(PUCK_SPECS)) {
      for (const [field, definition] of Object.entries(spec.fields)) {
        const typed = definition as { type?: string; options?: unknown[] };

        if (typed.type === "select" || typed.type === "radio") {
          expect(
            typed.options?.length,
            `${name}.${field} options`,
          ).toBeGreaterThan(0);
        }
      }
    }
  });

  it("files every block under exactly one category, and names only real blocks", () => {
    const names = Object.keys(PUCK_SPECS);
    const filed: string[] = [];

    for (const [category, definition] of Object.entries(PUCK_CATEGORIES)) {
      for (const component of definition.components) {
        expect(names, `${category} names a real block`).toContain(component);
        filed.push(component);
      }
    }

    expect(filed.sort()).toEqual([...names].sort());
  });

  it("keeps every default value serializable and free of functions", () => {
    for (const [name, spec] of Object.entries(PUCK_SPECS)) {
      const defaults = spec.defaultProps ?? {};

      expect(
        JSON.parse(JSON.stringify(defaults)),
        `${name} survives a round trip`,
      ).toEqual(defaults);

      for (const [field, value] of Object.entries(defaults)) {
        expect(typeof value, `${name}.${field}`).not.toBe("function");
      }
    }
  });

  it("declares its drop zones as slot fields, and only the blocks that hold blocks", () => {
    const slots = (name: keyof typeof PUCK_SPECS) =>
      Object.entries(PUCK_SPECS[name].fields)
        .filter(([, field]) => field.type === "slot")
        .map(([key]) => key)
        .sort();

    expect(slots("Section")).toEqual(["content"]);
    expect(slots("Columns")).toEqual(["end", "start"]);
    expect(slots("Hero")).toEqual([]);
  });
});
