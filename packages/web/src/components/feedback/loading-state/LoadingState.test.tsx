/**
 * Behaviour tests for the loading presentation.
 *
 * The tests state the pattern's contract: the region announces itself as a
 * status, it says what is loading, it claims room so the page does not jump, and
 * every option resolves through the configuration cascade.
 */

import {
  LOADING_STATE_CLASS,
  LOADING_STATE_SIZE_CLASS,
  SPACE_MIN_HEIGHT_CLASS,
  SPINNER_SIZE_CLASS,
} from "@asheeui/core";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../../test";
import { LoadingState, type LoadingStateProps } from "./LoadingState";
import { defaultLoadingStateConfig } from "./loading-state-config";

/** One Tailwind spacing step, in rem: the scale counts four steps to a rem. */
const spacingStepRem = (steps: number): number => steps / 4;

/** The vertical padding a `py-*` utility adds above and below, in rem. */
function verticalPaddingRem(utility: string): number {
  const step = /^py-(\d+(?:\.\d+)?)$/.exec(utility)?.[1];

  if (!step) {
    throw new Error(`not a vertical padding utility: ${utility}`);
  }

  return spacingStepRem(Number(step)) * 2;
}

/** The height an `h-*`/`w-*` utility asks for, in rem. */
function squareRem(utility: string): number {
  const step = /^w-(\d+(?:\.\d+)?)/.exec(utility)?.[1];

  if (!step) {
    throw new Error(`not a square size utility: ${utility}`);
  }

  return spacingStepRem(Number(step));
}

/** The line height `Typography role="body-sm"` resolves to: `text-sm` at
 * `leading-normal`, which is 0.875rem × 1.5. */
const LABEL_LINE_HEIGHT_REM = 0.875 * 1.5;

describe("LoadingState", () => {
  it("announces itself as a status and says what is loading", () => {
    const { getByRole } = renderWithProvider(
      <LoadingState label="Loading invoices" />,
    );
    const status = getByRole("status");

    expect(status).toHaveTextContent("Loading invoices");
  });

  it("says it is loading when it is given nothing else to say", () => {
    const { getByRole } = renderWithProvider(<LoadingState />);

    expect(getByRole("status")).toHaveTextContent("Loading");
  });

  it("claims room by default, so the page does not jump", () => {
    const { getByRole, container } = renderWithProvider(<LoadingState />);

    expect(getByRole("status").className).toContain("min-h-48");
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("claims a floor taller than the content it holds at the default density", () => {
    // The registered pairing is what an application that states nothing gets, so
    // the floor it resolves to has to bind above the padding, the indicator and the
    // label the same defaults draw. A claim under that height reserves nothing.
    const floorToken = defaultLoadingStateConfig.minHeight ?? "md";
    const density = defaultLoadingStateConfig.size ?? "md";

    const floor = spacingStepRem(
      Number(/^min-h-(\d+)$/.exec(SPACE_MIN_HEIGHT_CLASS[floorToken])?.[1]),
    );
    const gap = spacingStepRem(
      Number(/gap-(\d+)/.exec(LOADING_STATE_CLASS)?.[1]),
    );
    const content =
      verticalPaddingRem(LOADING_STATE_SIZE_CLASS[density]) +
      squareRem(SPINNER_SIZE_CLASS[density]) +
      gap +
      LABEL_LINE_HEIGHT_REM;

    expect(floor).toBeGreaterThan(content);
  });

  it("owns its announcement, so an instance cannot turn the wait into an alert", () => {
    // The state draws `role="status"` itself. The ARIA role is omitted from the
    // inherited attributes for the same reason `Typography` omits it, so this does
    // not compile; the rendered region is asserted by the first test.
    // @ts-expect-error - `role` belongs to the component, not to the consumer
    const props: LoadingStateProps = { role: "alert" };

    expect(props).toBeDefined();
  });

  it("takes a node as its label, so the sentence can carry a glyph", () => {
    const { getByRole } = renderWithProvider(
      <LoadingState
        label={
          <>
            <span aria-hidden="true">↻</span> Loading invoices
          </>
        }
      />,
    );

    expect(getByRole("status")).toHaveTextContent("Loading invoices");
  });

  it("takes the room, the density and the wording from its props", () => {
    const { getByRole } = renderWithProvider(
      <LoadingState
        label="Fetching"
        description="This takes a moment."
        size="lg"
        minHeight="lg"
        panel
      />,
    );
    const status = getByRole("status");

    expect(status).toHaveTextContent("Fetching");
    expect(status).toHaveTextContent("This takes a moment.");
    expect(status.className).toContain("min-h-72");
    expect(status.className).toContain("py-12");
    expect(status.className).toContain("border-border");
  });

  it("shows the consumer's own indicator in place of the spinner", () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <LoadingState indicator={<span>43 percent</span>} />,
    );

    expect(getByRole("status")).toHaveTextContent("43 percent");
    expect(queryByRole("status")?.querySelector("svg")).toBeNull();
  });

  it("resolves its defaults through configuration", () => {
    const { getByRole } = renderWithProvider(<LoadingState />, {
      config: makeComponentConfig("loadingstate", {
        label: "Fetching invoices",
        panel: true,
        minHeight: "md",
        size: "sm",
      }),
    });
    const status = getByRole("status");

    expect(status).toHaveTextContent("Fetching invoices");
    expect(status.className).toContain("border-border");
    expect(status.className).toContain("min-h-48");
  });

  it("lets an instance prop win over the configured value", () => {
    const { getByRole } = renderWithProvider(
      <LoadingState label="Fetching" />,
      {
        config: makeComponentConfig("loadingstate", { label: "Loading" }),
      },
    );

    expect(getByRole("status")).toHaveTextContent("Fetching");
    expect(getByRole("status")).not.toHaveTextContent("Loading");
  });

  it("renders the element it is asked for, carries the consumer's class and forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { getByRole } = renderWithProvider(
      <LoadingState as="section" ref={ref} className="border" />,
    );
    const status = getByRole("status");

    expect(status.tagName).toBe("SECTION");
    expect(status.className).toContain("border");
    expect(ref.current).toBe(status);
  });

  it("renders on the server and hydrates without a mismatch", () => {
    expect(renderToServerString(<LoadingState label="Loading" />)).toContain(
      "status",
    );
    expectHydrationClean(<LoadingState label="Loading invoices" />);
  });
});
