import { describe, expect, it } from "vitest";
import {
  resolveAnimate,
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "./resolve-token";

describe("resolveCascade", () => {
  it("prefers the instance value", () => {
    expect(resolveCascade("ghost", "solid", "faded", "bordered")).toBe("ghost");
  });

  it("falls back through component config, global default and hard fallback", () => {
    expect(resolveCascade(undefined, "solid", "faded", "bordered")).toBe("solid");
    expect(resolveCascade(undefined, undefined, "faded", "bordered")).toBe(
      "faded",
    );
    expect(resolveCascade(undefined, undefined, undefined, "bordered")).toBe(
      "bordered",
    );
  });

  it("keeps explicit falsy values instead of falling through", () => {
    expect(resolveCascade(false, true, true, true)).toBe(false);
    expect(resolveCascade(0, 8, 8, 8)).toBe(0);
    expect(resolveCascade("", "md", "md", "md")).toBe("");
  });
});

describe("resolveAnimate", () => {
  it("resolves without a global default tier", () => {
    expect(resolveAnimate(undefined, undefined, true)).toBe(true);
    expect(resolveAnimate(undefined, true, false)).toBe(true);
    expect(resolveAnimate(false, true, true)).toBe(false);
  });
});

describe("resolveRadiusKey", () => {
  it("uses the full cascade", () => {
    expect(resolveRadiusKey("lg", "sm", "xs")).toBe("lg");
    expect(resolveRadiusKey(undefined, "sm", "xs")).toBe("sm");
    expect(resolveRadiusKey(undefined, undefined, "xs")).toBe("xs");
  });

  it("defaults to md when nothing is configured", () => {
    expect(resolveRadiusKey(undefined, undefined, undefined)).toBe("md");
  });

  it("accepts a custom hard fallback", () => {
    expect(resolveRadiusKey(undefined, undefined, undefined, "none")).toBe(
      "none",
    );
  });
});

describe("resolveClassKey", () => {
  const CLASS_MAP = { sm: "text-sm", lg: "text-lg" };

  it("returns the mapped class", () => {
    expect(resolveClassKey<string>("lg", CLASS_MAP, "sm")).toBe("text-lg");
  });

  it("falls back to the fallback key for an unknown key", () => {
    expect(resolveClassKey<string>("xl", CLASS_MAP, "sm")).toBe("text-sm");
  });

  it("returns an empty string when neither key exists in the map", () => {
    expect(resolveClassKey<string>("xl", {}, "sm")).toBe("");
  });
});
