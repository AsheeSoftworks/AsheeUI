/**
 * The `K` ledger's warning mechanism.
 *
 * The properties a consumer relies on are that a warning fires once per (component, prop),
 * that it names a substitute rather than only a refusal, that it stays silent when the prop
 * was not written, and that production has no warning at all.
 */

import { warnUnsupportedProp } from "./unsupported-prop";

describe("warnUnsupportedProp", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    process.env.NODE_ENV = "test";
  });

  it("warns once per component and prop, naming the substitute", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    warnUnsupportedProp(
      "LedgerProbe",
      "as",
      "the component's role is carried by accessibilityRole",
    );
    warnUnsupportedProp(
      "LedgerProbe",
      "as",
      "the component's role is carried by accessibilityRole",
    );

    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain("LedgerProbe.as");
    expect(String(warn.mock.calls[0]?.[0])).toContain("accessibilityRole");
  });

  it("treats the same prop on another component as its own warning", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    warnUnsupportedProp("LedgerProbeA", "titleAs", "no heading elements");
    warnUnsupportedProp("LedgerProbeB", "titleAs", "no heading elements");

    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("says nothing in production", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    process.env.NODE_ENV = "production";

    warnUnsupportedProp("LedgerProbeProduction", "zIndex", "no z-axis");

    expect(warn).not.toHaveBeenCalled();
  });
});
