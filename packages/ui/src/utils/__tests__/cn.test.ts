import { describe, expect, it } from "vitest";
import { cn } from "../cn";

describe("cn (class name merger)", () => {
  it("joins plain class names with a space", () => {
    expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
  });

  it("ignores falsy conditional values", () => {
    expect(cn("a", false && "b", null, undefined, 0, "", "c")).toBe("a c");
  });

  it("supports conditional objects", () => {
    expect(cn({ active: true, hidden: false, solid: 1 })).toBe("active solid");
  });

  it("supports nested arrays", () => {
    expect(cn(["a", ["b", "c"]], "d")).toBe("a b c d");
  });

  it("resolves conflicting Tailwind utilities in favor of the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    expect(cn("p-2", "px-2", "p-4")).toBe("p-4");
  });

  it("keeps non-conflicting utilities", () => {
    expect(cn("px-2", "py-1", "rounded-md")).toBe("px-2 py-1 rounded-md");
  });

  it("returns an empty string when every input is falsy", () => {
    expect(cn(null, undefined, false)).toBe("");
  });
});
