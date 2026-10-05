/**
 * Behaviour tests for the Split layout primitive.
 *
 * The tests state the primitive's contract: panes stack below the chosen
 * breakpoint and sit side by side above it, the width divides by the ratio, the
 * panes are never hidden, and every option resolves through the configuration
 * cascade.
 */

import { createRef } from "react";
import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { Split } from "./Split";

/**
 * Read a split's root element and its panes.
 *
 * @param container - The render result's container.
 * @returns The root and the panes it rendered.
 */
function readSplit(container: HTMLElement) {
  const root = container.firstElementChild as HTMLElement;
  const panes = Array.from(root.children) as HTMLElement[];

  return { root, panes };
}

describe("Split", () => {
  it("stacks its panes on a narrow screen and splits them on a wide one", () => {
    const { root, panes } = readSplit(
      renderWithProvider(<Split start={<span>a</span>} end={<span>b</span>} />)
        .container,
    );

    expect(root.className).toContain("flex-col");
    expect(root.className).toContain("lg:flex-row");
    expect(root.className).toContain("gap-6");
    expect(root.className).toContain("items-stretch");
    expect(panes[0].className).toContain("lg:basis-1/2");
    expect(panes[1].className).toContain("lg:basis-1/2");
  });

  it("divides the width by the ratio it is given", () => {
    const { panes } = readSplit(
      renderWithProvider(
        <Split
          stackAt="md"
          ratio="end"
          start={<span>a</span>}
          end={<span>b</span>}
        />,
      ).container,
    );

    expect(panes[0].className).toContain("md:basis-1/3");
    expect(panes[1].className).toContain("md:basis-2/3");
  });

  it("draws a divider between the panes, following the flex direction", () => {
    const { root } = readSplit(
      renderWithProvider(
        <Split divider start={<span>a</span>} end={<span>b</span>} />,
      ).container,
    );

    expect(root.className).toContain("divide-y");
    expect(root.className).toContain("divide-border");
    expect(root.className).toContain("lg:divide-x");
  });

  it("keeps the second pane in view when asked", () => {
    const { panes } = readSplit(
      renderWithProvider(
        <Split stickyEnd start={<span>a</span>} end={<span>b</span>} />,
      ).container,
    );

    expect(panes[1].className).toContain("sticky");
    expect(panes[0].className).not.toContain("sticky");
  });

  it("renders one pane when the layout has one", () => {
    const { panes } = readSplit(
      renderWithProvider(<Split start={<span>a</span>} />).container,
    );

    expect(panes).toHaveLength(1);
  });

  it("renders both panes in order, so the reading order is the written order", () => {
    const { panes } = readSplit(
      renderWithProvider(
        <Split start={<span>first</span>} end={<span>second</span>} />,
      ).container,
    );

    expect(panes[0].textContent).toBe("first");
    expect(panes[1].textContent).toBe("second");
  });

  it("resolves its defaults through configuration", () => {
    const { root, panes } = readSplit(
      renderWithProvider(
        <Split start={<span>a</span>} end={<span>b</span>} />,
        {
          config: makeComponentConfig("split", {
            stackAt: "sm",
            ratio: "start",
            gap: "sm",
            divider: true,
          }),
        },
      ).container,
    );

    expect(root.className).toContain("sm:flex-row");
    expect(root.className).toContain("gap-2");
    expect(root.className).toContain("sm:divide-x");
    expect(panes[0].className).toContain("sm:basis-2/3");
    expect(panes[1].className).toContain("sm:basis-1/3");
  });

  it("lets an instance prop win over the configured value", () => {
    const { root } = readSplit(
      renderWithProvider(
        <Split stackAt="xl" start={<span>a</span>} end={<span>b</span>} />,
        { config: makeComponentConfig("split", { stackAt: "sm" }) },
      ).container,
    );

    expect(root.className).toContain("xl:flex-row");
    expect(root.className).not.toContain("sm:flex-row");
  });

  it("renders the element it is asked for and forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { root } = readSplit(
      renderWithProvider(
        <Split as="section" ref={ref} start={<span>a</span>} />,
      ).container,
    );

    expect(root.tagName).toBe("SECTION");
    expect(ref.current).toBe(root);
  });

  it("carries the consumer's class last, so it wins", () => {
    const { root } = readSplit(
      renderWithProvider(
        <Split className="gap-0" start={<span>a</span>} end={<span>b</span>} />,
      ).container,
    );

    expect(root.className.endsWith("gap-0")).toBe(true);
  });

  it("renders on the server and hydrates without a mismatch", () => {
    expect(
      renderToServerString(
        <Split stackAt="md" start={<span>a</span>} end={<span>b</span>} />,
      ),
    ).toContain("md:flex-row");
    expectHydrationClean(<Split start={<span>a</span>} end={<span>b</span>} />);
  });
});
