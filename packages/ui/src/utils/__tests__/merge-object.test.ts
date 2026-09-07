import { describe, expect, it } from "vitest";
import { mergeObject } from "../merge-object";

describe("mergeObject", () => {
  it("returns the defaults untouched when no user config is given", () => {
    const defaults = { a: 1, b: { c: 2 } };
    expect(mergeObject(defaults)).toBe(defaults);
  });

  it("recursively merges nested plain objects", () => {
    const result = mergeObject(
      { theme: { color: "primary", radius: "md" }, size: "md" },
      { theme: { radius: "lg" } },
    );
    expect(result).toEqual({
      theme: { color: "primary", radius: "lg" },
      size: "md",
    });
  });

  it("skips keys whose user value is undefined", () => {
    const result = mergeObject({ a: 1, b: 2 }, { a: undefined, b: 3 });
    expect(result).toEqual({ a: 1, b: 3 });
  });

  it("replaces arrays and scalars outright", () => {
    const result = mergeObject(
      { list: [1, 2, 3], name: "a" },
      { list: [9], name: "b" },
    );
    expect(result).toEqual({ list: [9], name: "b" });
  });

  it("does not mutate the defaults object", () => {
    const defaults = { nested: { value: 1 }, list: [1] };
    mergeObject(defaults, { nested: { value: 2 } });
    expect(defaults).toEqual({ nested: { value: 1 }, list: [1] });
  });
});
