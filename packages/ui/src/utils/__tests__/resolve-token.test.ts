import { describe, expect, it } from "vitest";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../resolve-token";

describe("resolve-token helpers", () => {
  it("resolveCascade prefers instance, then section, then global default", () => {
    expect(resolveCascade("instance", "section", "global", "fallback")).toBe(
      "instance",
    );
    expect(resolveCascade(undefined, "section", "global", "fallback")).toBe(
      "section",
    );
    expect(resolveCascade(undefined, undefined, "global", "fallback")).toBe(
      "global",
    );
    expect(resolveCascade(undefined, undefined, undefined, "fallback")).toBe(
      "fallback",
    );
  });

  it("resolveRadiusKey falls back to the hard-coded md token", () => {
    expect(resolveRadiusKey("lg", undefined, "sm", "md")).toBe("lg");
    expect(resolveRadiusKey(undefined, "xl", "sm", "md")).toBe("xl");
    expect(resolveRadiusKey(undefined, undefined, "sm", "md")).toBe("sm");
    expect(resolveRadiusKey(undefined, undefined, undefined)).toBe("md");
  });

  it("resolveClassKey maps tokens and falls back safely", () => {
    const map = { sm: "w-4", md: "w-6", lg: "w-8" };
    expect(resolveClassKey("lg", map, "md")).toBe("w-8");
    expect(resolveClassKey("unknown" as "sm", map, "md")).toBe("w-6");
  });
});
