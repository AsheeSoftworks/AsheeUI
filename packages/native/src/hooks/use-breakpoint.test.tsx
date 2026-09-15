/**
 * Tests for the native breakpoint hook.
 *
 * The hook's rule is a pure function, so the boundaries are tested directly
 * rather than through a device, and the hook itself is tested for the one thing
 * it adds: reading the window the platform reports.
 */

import { BREAKPOINT } from "@asheeui/shared";
import { render } from "@testing-library/react-native";
import { Dimensions, Text } from "react-native";
import { resolveBreakpoint, useBreakpoint } from "./use-breakpoint";

/**
 * A component that prints what the hook reports.
 *
 * @returns The probe element.
 */
function Probe() {
  const { width, breakpoint, isAtLeast } = useBreakpoint();

  return (
    <Text testID="probe">
      {`${width}|${breakpoint}|${isAtLeast("md") ? "md" : "below-md"}`}
    </Text>
  );
}

describe("resolveBreakpoint", () => {
  it("reports base below the smallest breakpoint", () => {
    expect(resolveBreakpoint(320)).toBe("base");
    expect(resolveBreakpoint(BREAKPOINT.sm - 1)).toBe("base");
  });

  it("reports the largest breakpoint the width reached", () => {
    expect(resolveBreakpoint(BREAKPOINT.sm)).toBe("sm");
    expect(resolveBreakpoint(BREAKPOINT.md - 1)).toBe("sm");
    expect(resolveBreakpoint(BREAKPOINT.md)).toBe("md");
    expect(resolveBreakpoint(BREAKPOINT.lg)).toBe("lg");
    expect(resolveBreakpoint(BREAKPOINT.xl)).toBe("xl");
    expect(resolveBreakpoint(BREAKPOINT.xl + 2000)).toBe("xl");
  });
});

describe("useBreakpoint", () => {
  it("reads the window the platform reports", async () => {
    const { width } = Dimensions.get("window");
    const view = await render(<Probe />);

    expect(view.getByTestId("probe")).toHaveTextContent(
      `${width}|${resolveBreakpoint(width)}|${
        width >= BREAKPOINT.md ? "md" : "below-md"
      }`,
    );
  });
});
