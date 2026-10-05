import { describe, expect, it } from "vitest";
import { mergeObject } from "./merge-object";

describe("mergeObject", () => {
  it("returns the defaults when no override is supplied", () => {
    const defaults = { theme: { radius: "md" } };

    expect(mergeObject(defaults)).toBe(defaults);
  });

  it("deep merges nested plain objects", () => {
    const merged = mergeObject(
      { theme: { radius: "md", color: "primary" } },
      { theme: { radius: "lg" } },
    );

    expect(merged).toEqual({ theme: { radius: "lg", color: "primary" } });
  });

  it("replaces arrays and scalar values instead of merging them", () => {
    const merged = mergeObject(
      { themes: ["light", "dark"], count: 1 },
      { themes: ["custom"], count: 2 },
    );

    expect(merged).toEqual({ themes: ["custom"], count: 2 });
  });

  it("ignores undefined overrides so defaults survive", () => {
    const merged = mergeObject(
      { radius: "md", color: "primary" },
      { radius: undefined },
    );

    expect(merged.radius).toBe("md");
  });

  it("preserves falsy overrides such as false, 0 and an empty string", () => {
    const merged = mergeObject(
      { animated: true, delay: 10, label: "default" },
      { animated: false, delay: 0, label: "" },
    );

    expect(merged).toEqual({ animated: false, delay: 0, label: "" });
  });

  it("does not mutate the defaults object", () => {
    const defaults = { theme: { radius: "md" } };

    mergeObject(defaults, { theme: { radius: "full" } });

    expect(defaults).toEqual({ theme: { radius: "md" } });
  });
});
