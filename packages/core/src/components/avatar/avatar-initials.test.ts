import { describe, expect, it } from "vitest";
import { getInitials } from "./avatar-initials";

describe("getInitials", () => {
  it("takes the first two characters of a single word", () => {
    expect(getInitials("Ashee")).toBe("AS");
    expect(getInitials("a")).toBe("A");
  });

  it("takes the first character of the first and last word of a longer name", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL");
    expect(getInitials("Grace Brewster Murray Hopper")).toBe("GH");
  });

  it("ignores the spacing a name is written with", () => {
    expect(getInitials("  Ada   Lovelace  ")).toBe("AL");
  });

  it("uppercases what it derives", () => {
    expect(getInitials("ada lovelace")).toBe("AL");
  });

  it("derives nothing from a name that holds nothing", () => {
    expect(getInitials("")).toBe("");
    expect(getInitials("   ")).toBe("");
  });
});
