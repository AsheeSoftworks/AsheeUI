import { describe, expect, it } from "vitest";
import { type GridColumnOptions, resolveGridColumns } from "./grid";

/** A grid that states one count per breakpoint. */
const THREE_STEPS: GridColumnOptions = {
  columns: 1,
  columnsMd: 2,
  columnsLg: 3,
};

describe("how many columns a grid shows", () => {
  it("states a count for the width it is drawn at", () => {
    expect(resolveGridColumns(THREE_STEPS, "base")).toBe(1);
    expect(resolveGridColumns(THREE_STEPS, "md")).toBe(2);
    expect(resolveGridColumns(THREE_STEPS, "lg")).toBe(3);
    expect(resolveGridColumns(THREE_STEPS, "xl")).toBe(3);
  });

  it("inherits the count below when a larger breakpoint states none", () => {
    // A grid that never changes shape states only `columns`, and every wider width
    // keeps it. A count stated at `md` carries to `lg` and beyond.
    expect(resolveGridColumns({ columns: 2 }, "xl")).toBe(2);
    expect(resolveGridColumns({ columns: 1, columnsMd: 3 }, "lg")).toBe(3);
  });

  it("shows one column when the configuration states nothing", () => {
    // The fallback is a rule, not a number the caller has to pass.
    expect(resolveGridColumns({}, "lg")).toBe(1);
  });

  it("prefers the widest count that is stated", () => {
    expect(
      resolveGridColumns({ columns: 1, columnsMd: 2, columnsLg: 4 }, "lg"),
    ).toBe(4);
  });
});
