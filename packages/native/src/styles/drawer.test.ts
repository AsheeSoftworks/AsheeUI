/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import type { DrawerPlacement, DrawerSize } from "@asheeui/core";
import {
  NATIVE_DRAWER_BACKDROP_CLASS,
  NATIVE_DRAWER_SHEET_EDGE,
  NATIVE_DRAWER_SIZE_CLASS,
} from "./drawer";

/** The amounts of screen a drawer can take. */
const SIZES: DrawerSize[] = ["sm", "md", "lg", "full"];

/** The edges a drawer can come from. */
const PLACEMENTS: DrawerPlacement[] = ["right", "left", "top", "bottom"];

describe("how much of the screen a drawer takes", () => {
  it("describes every size on both platforms", () => {
    expect(Object.keys(NATIVE_DRAWER_SIZE_CLASS).sort()).toEqual(
      [...SIZES].sort(),
    );
  });

  it("lets the largest size take the whole screen on both platforms", () => {
    expect(NATIVE_DRAWER_SIZE_CLASS.full).toBe("h-full");
  });
});

describe("the edge a drawer comes from", () => {
  it("describes every edge the platform's sheet comes from", () => {
    expect(Object.keys(NATIVE_DRAWER_SHEET_EDGE).sort()).toEqual(
      [...PLACEMENTS].sort(),
    );
  });

  it("resolves a side panel to the sheet the platform uses, and keeps a top placement at its edge", () => {
    // A panel at the side of a phone has nowhere to be, so a side resolves to the sheet; a
    // top or bottom placement is already the edge a sheet comes from.
    expect(NATIVE_DRAWER_SHEET_EDGE.right).toBe("bottom");
    expect(NATIVE_DRAWER_SHEET_EDGE.left).toBe("bottom");
    expect(NATIVE_DRAWER_SHEET_EDGE.bottom).toBe("bottom");
    expect(NATIVE_DRAWER_SHEET_EDGE.top).toBe("top");
  });
});

describe("the drawer's layer", () => {
  it("dims the screen behind the sheet, so it is clear what is being dealt with", () => {
    expect(NATIVE_DRAWER_BACKDROP_CLASS).toContain("bg-foreground/30");
  });
});
