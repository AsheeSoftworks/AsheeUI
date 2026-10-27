import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useBreakpoint } from "./use-breakpoint";

/**
 * Sets the window width the hook measures.
 *
 * jsdom reports one width to everything, so a test that wants another has to state it, and
 * stating it in one place keeps the assertions about the *rule* rather than about jsdom.
 *
 * @param width - The width to report, in pixels.
 */
function setWindowWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
}

/**
 * Renders the hook and prints its state as `breakpoint:width:isAtLeast(lg)`.
 *
 * The hook is read through a component because that is how it is used, and the rendered text
 * is what the assertions read.
 *
 * @returns The rendered tree.
 */
function Probe() {
  const { width, breakpoint, isAtLeast } = useBreakpoint();

  return (
    <span data-testid="state">{`${breakpoint}:${width}:${isAtLeast("lg")}`}</span>
  );
}

describe("useBreakpoint", () => {
  it("resolves the shared breakpoint names from the window", () => {
    setWindowWidth(1440);

    const view = render(<Probe />);

    // 1440 is past `xl` (1280), which is the largest breakpoint the framework states.
    expect(view.getByTestId("state")).toHaveTextContent("xl:1440:true");
  });

  it("reports the largest breakpoint reached, not the nearest below", () => {
    setWindowWidth(1100);

    const view = render(<Probe />);

    expect(view.getByTestId("state")).toHaveTextContent("lg:1100:true");
  });

  it("reports base below the smallest breakpoint", () => {
    setWindowWidth(390);

    const view = render(<Probe />);

    expect(view.getByTestId("state")).toHaveTextContent("base:390:false");
  });

  it("follows a resize", () => {
    setWindowWidth(390);

    const view = render(<Probe />);

    setWindowWidth(800);
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(view.getByTestId("state")).toHaveTextContent("md:800:false");
  });

  it("uses the same width the platform's hook reports, in pixels", () => {
    setWindowWidth(768);

    const view = render(<Probe />);

    expect(view.getByTestId("state")).toHaveTextContent("md:768:false");
  });
});
