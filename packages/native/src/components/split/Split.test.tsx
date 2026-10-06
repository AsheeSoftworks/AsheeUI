/**
 * Behaviour tests for the native Split.
 *
 * The tests state the primitive's contract: the panes stack while the window is below
 * the chosen breakpoint and sit side by side above it, the width divides by the ratio,
 * the rule between the panes follows the direction the window produced, neither pane is
 * ever unmounted, and every option resolves through the configuration cascade.
 */

import {
  type ReactTestInstance,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Dimensions, Text } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Split } from "./Split";

/**
 * Render a split inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderSplit(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Report a window width to the platform.
 * The primitive reads the window rather than a media query, so a test states the width
 * the device is reporting and the component decides from it.
 *
 * @param width - The width in density-independent pixels.
 * @returns The spy, so a test can put the window back.
 */
function reportWidth(width: number) {
  return jest.spyOn(Dimensions, "get").mockReturnValue({
    width,
    height: 844,
    scale: 2,
    fontScale: 2,
  });
}

/**
 * Read the classes a rendered element carries.
 *
 * @param view - The rendered tree.
 * @param testID - The element's test identifier.
 * @returns Its class string.
 */
function classesOf(view: RenderResult, testID: string): string {
  return (view.getByTestId(testID).props as { className?: string })
    .className as string;
}

/**
 * Read the classes of the pane a piece of content sits in.
 * The panes are not public, so they carry no test identifier; a test reaches the pane
 * from the content it put in it.
 *
 * @param view - The rendered tree.
 * @param testID - The test identifier of the content.
 * @returns The classes of the pane wrapping it.
 */
function paneClassesOf(view: RenderResult, testID: string): string {
  const pane = view.getByTestId(testID).parent as ReactTestInstance | null;

  return String((pane?.props as { className?: string })?.className ?? "");
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Native Split", () => {
  it("stacks its panes while the window is below the breakpoint", async () => {
    reportWidth(390);

    const view = await renderSplit(
      <Split
        testID="split"
        start={<Text testID="a">a</Text>}
        end={<Text testID="b">b</Text>}
      />,
    );

    expect(classesOf(view, "split")).toContain("flex-col");
    expect(classesOf(view, "split")).toContain("gap-6");
    expect(classesOf(view, "split")).toContain("items-stretch");
    expect(paneClassesOf(view, "a")).toContain("w-full");
    expect(paneClassesOf(view, "b")).toContain("w-full");
  });

  it("puts the panes side by side once the window has reached the breakpoint", async () => {
    reportWidth(1024);

    const view = await renderSplit(
      <Split
        testID="split"
        start={<Text testID="a">a</Text>}
        end={<Text testID="b">b</Text>}
      />,
    );

    expect(classesOf(view, "split")).toContain("flex-row");
    expect(paneClassesOf(view, "a")).toContain("w-[50%]");
    expect(paneClassesOf(view, "b")).toContain("w-[50%]");
  });

  it("divides the width by the ratio it is given", async () => {
    reportWidth(1024);

    const view = await renderSplit(
      <Split
        testID="split"
        ratio="start"
        start={<Text testID="a">a</Text>}
        end={<Text testID="b">b</Text>}
      />,
    );

    expect(paneClassesOf(view, "a")).toContain("w-[66%]");
    expect(paneClassesOf(view, "b")).toContain("w-[33%]");
  });

  it("keeps both panes in the tree when the window is narrow", async () => {
    reportWidth(390);

    const view = await renderSplit(
      <Split
        start={<Text testID="a">a</Text>}
        end={<Text testID="b">b</Text>}
      />,
    );

    // Stacking is a change of direction rather than a reason to hide a pane, which is the
    // same promise the web makes by leaving both panes in the document.
    expect(view.getByText("a")).toBeTruthy();
    expect(view.getByText("b")).toBeTruthy();
  });

  it("draws the rule on the second pane and follows the direction", async () => {
    reportWidth(1024);

    const wide = await renderSplit(
      <Split
        divider
        start={<Text testID="a">a</Text>}
        end={<Text testID="b">b</Text>}
      />,
    );

    expect(paneClassesOf(wide, "b")).toContain("border-l");
    expect(paneClassesOf(wide, "a")).not.toContain("border-l");

    jest.restoreAllMocks();
    reportWidth(390);

    const narrow = await renderSplit(
      <Split
        divider
        start={<Text testID="a">a</Text>}
        end={<Text testID="b">b</Text>}
      />,
    );

    expect(paneClassesOf(narrow, "b")).toContain("border-t");
  });

  it("leaves the rule out until it is asked for", async () => {
    reportWidth(1024);

    const view = await renderSplit(
      <Split
        start={<Text testID="a">a</Text>}
        end={<Text testID="b">b</Text>}
      />,
    );

    expect(paneClassesOf(view, "b")).not.toContain("border-l");
  });

  it("renders one pane when the layout has one", async () => {
    reportWidth(390);

    const view = await renderSplit(<Split start={<Text testID="a">a</Text>} />);

    expect(view.getByText("a")).toBeTruthy();
    expect(view.queryByTestId("b")).toBeNull();
  });

  it("resolves its breakpoint, ratio, gap and alignment through the cascade", async () => {
    reportWidth(800);

    const view = await renderSplit(
      <Split
        testID="split"
        start={<Text testID="a">a</Text>}
        end={<Text testID="b">b</Text>}
      />,
      {
        components: {
          split: {
            stackAt: "md",
            ratio: "end",
            gap: "xl",
            align: "center",
            divider: true,
          },
        },
      },
    );

    // The window is past `md`, so the configured breakpoint is what the component acts on.
    expect(classesOf(view, "split")).toContain("flex-row");
    expect(classesOf(view, "split")).toContain("items-center");
    expect(classesOf(view, "split")).toContain("gap-8");
    expect(paneClassesOf(view, "a")).toContain("w-[33%]");
    expect(paneClassesOf(view, "b")).toContain("w-[66%]");
    expect(paneClassesOf(view, "b")).toContain("border-l");
  });
});
