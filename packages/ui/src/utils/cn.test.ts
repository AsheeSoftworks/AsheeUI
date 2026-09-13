import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("returns an empty string when nothing is provided", () => {
    expect(cn()).toBe("");
  });

  it("joins class names", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });

  it("drops falsy values", () => {
    expect(cn("flex", false, undefined, null, "")).toBe("flex");
  });

  it("supports conditional objects and arrays", () => {
    expect(cn(["flex", { "items-center": true, "justify-between": false }])).toBe(
      "flex items-center",
    );
  });

  it("treats utilities in the same group as conflicting, last one wins", () => {
    expect(cn("flex", "hidden")).toBe("hidden");
  });

  it("resolves conflicting utilities deterministically with the last value winning", () => {
    expect(cn("px-2 p-4", "rounded-md")).toBe("p-4 rounded-md");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
    expect(cn("bg-primary", "bg-danger")).toBe("bg-danger");
  });

  it("lets a consumer class override a framework class", () => {
    expect(cn("w-full", "w-1/2")).toBe("w-1/2");
  });
});
