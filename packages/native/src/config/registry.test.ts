/**
 * The native renderer's configuration registry, after B08 made it core's.
 *
 * Two things were true before this batch and must stay true for a native consumer: every component
 * registers its own defaults, and the values are the platform's (`NEW`-density decisions, a touch
 * target's spacing). What changed is *where* they are written: the native registry is core's registry
 * now, so the assertions below are the proof that the move did not move a value — and that the two
 * reader functions answer from one table.
 */

import { getAllComponentDefaults } from "@asheeui/core";
import "../components/data-display/card/card-config";
import "../components/forms/button/button-config";
import "../components/typography/text/text-config";
import "../layout/layout-config";
import {
  getNativeComponentDefaults,
  registerNativeComponentDefaults,
} from "./registry";

describe("the native configuration registry", () => {
  it("has not moved a value: every section this batch touched registers what it did", () => {
    const defaults = getNativeComponentDefaults();

    expect(defaults.card).toEqual({ size: "md", isPressable: false });
    expect(defaults.text).toEqual({
      role: "body-md",
      tone: "default",
      truncate: false,
    });
    expect(defaults.button).toEqual({ size: "lg", fullWidth: false });
    expect(defaults.container).toEqual({ size: "lg", gutter: true });
    expect(defaults.stack).toEqual({
      direction: "column",
      gap: "md",
      align: "stretch",
      justify: "start",
      wrap: false,
    });
    expect(defaults.grid).toEqual({ columns: 1, gap: "md" });
    expect(defaults.section).toEqual({ spacing: "md", background: "none" });
    expect(defaults.centered).toEqual({ axis: "both", minHeight: "none" });
  });

  it("writes the one registry core's resolver reads", () => {
    registerNativeComponentDefaults("clipboard", { timeout: 1500 });

    expect(getNativeComponentDefaults().clipboard).toEqual({ timeout: 1500 });
    expect(getAllComponentDefaults().clipboard).toEqual({ timeout: 1500 });
  });

  it("agrees with core on the key set, because there is one map", () => {
    expect(Object.keys(getNativeComponentDefaults()).sort()).toEqual(
      Object.keys(getAllComponentDefaults()).sort(),
    );
  });
});
