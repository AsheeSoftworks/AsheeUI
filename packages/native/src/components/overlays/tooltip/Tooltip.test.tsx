/**
 * Behaviour tests for the native Tooltip.
 *
 * The tests state the component's contract: the hint is stated as the trigger's accessibility
 * hint when it is a string — node content has no string to state, and is read when the hint is
 * open instead; a long press reveals it and the closing delay hides it, so a press that ends
 * does not blink it out; a placement that names a side resolves to the vertical direction it
 * reads from, at the distance the offset states; the arrow is drawn when it is asked for; a
 * disabled hint never appears; and the treatment, the colour and the size resolve through the
 * configuration cascade.
 */

import { act, fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { AsheeNativeProvider } from "../../../provider/AsheeNativeProvider";
import { Tooltip } from "./Tooltip";

/**
 * Render a hint inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderTooltip(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/** A trigger that is text, so the tests can press it by name. */
const TRIGGER = <Text>Archived</Text>;

/**
 * The style the platform positioned the hint with.
 *
 * @param view - The rendered tree.
 * @returns The distance the hint was placed at, on the edge it was placed on.
 */
function hintStyle(view: ReturnType<typeof render>): {
  bottom?: number;
  top?: number;
} {
  const bubble = view.getByText("Kept for seven years").parent;
  const container = bubble?.parent;

  if (!container) {
    throw new Error("the hint was not drawn in a layer");
  }

  const { style } = container.props as {
    style?: { bottom?: number; top?: number };
  };

  return style ?? {};
}

/**
 * The classes the hint's surface carries.
 *
 * @param view - The rendered tree.
 * @returns Its class string.
 */
function bubbleClasses(view: ReturnType<typeof render>): string {
  const bubble = view.getByText("Kept for seven years").parent;

  if (!bubble) {
    throw new Error("the hint was not drawn");
  }

  return (bubble.props as { className?: string }).className as string;
}

describe("Native Tooltip", () => {
  it("states the hint as the trigger's own hint, so it can be read without the gesture", async () => {
    const view = await renderTooltip(
      <Tooltip content="Kept for seven years">{TRIGGER}</Tooltip>,
    );

    expect(view.getByText("Archived").parent?.props.accessibilityHint).toBe(
      "Kept for seven years",
    );
  });

  it("reads node content once the hint is open, because the platform's hint is text", async () => {
    const view = await renderTooltip(
      <Tooltip content={<Text>Kept for seven years</Text>}>{TRIGGER}</Tooltip>,
    );

    // A node has no string to state on the trigger, and the module says so rather than
    // claiming a statement the platform cannot make.
    expect(
      view.getByText("Archived").parent?.props.accessibilityHint,
    ).toBeUndefined();

    await fireEvent(view.getByText("Archived").parent, "longPress");

    expect(view.getByText("Kept for seven years")).toBeTruthy();
  });

  it("says nothing until the reader rests on the trigger", async () => {
    const view = await renderTooltip(
      <Tooltip content="Kept for seven years">{TRIGGER}</Tooltip>,
    );

    expect(view.queryByText("Kept for seven years")).toBeNull();

    await fireEvent(view.getByText("Archived").parent, "longPress");

    expect(view.getByText("Kept for seven years")).toBeTruthy();
  });

  it("keeps the hint up for the closing delay and then puts it away", async () => {
    jest.useFakeTimers();

    const view = await renderTooltip(
      <Tooltip content="Kept for seven years" delay={{ open: 300, close: 150 }}>
        {TRIGGER}
      </Tooltip>,
    );

    // The opening half is the platform's long press, so it waits the stated time; the test
    // cannot read that timer back from the tree, and the closing half is what it observes.
    await fireEvent(view.getByText("Archived").parent, "longPress");
    await fireEvent(view.getByText("Archived").parent, "pressOut");

    await act(async () => {
      jest.advanceTimersByTime(149);
    });

    expect(view.getByText("Kept for seven years")).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(view.queryByText("Kept for seven years")).toBeNull();

    jest.useRealTimers();
  });

  it("calls the hide off when the reader presses again before it elapses", async () => {
    jest.useFakeTimers();

    const view = await renderTooltip(
      <Tooltip content="Kept for seven years" delay={{ open: 200, close: 100 }}>
        {TRIGGER}
      </Tooltip>,
    );

    await fireEvent(view.getByText("Archived").parent, "longPress");
    await fireEvent(view.getByText("Archived").parent, "pressOut");

    // The reader comes back inside the closing window, so the pending hide is called off and
    // the hint stays up rather than vanishing from underneath them.
    await fireEvent(view.getByText("Archived").parent, "longPress");

    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    expect(view.getByText("Kept for seven years")).toBeTruthy();

    jest.useRealTimers();
  });

  it("reads a number as both halves of the wait, as the shared contract states", async () => {
    jest.useFakeTimers();

    const view = await renderTooltip(
      <Tooltip content="Kept for seven years" delay={250}>
        {TRIGGER}
      </Tooltip>,
    );

    await fireEvent(view.getByText("Archived").parent, "longPress");
    await fireEvent(view.getByText("Archived").parent, "pressOut");

    await act(async () => {
      jest.advanceTimersByTime(249);
    });

    expect(view.getByText("Kept for seven years")).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(view.queryByText("Kept for seven years")).toBeNull();

    jest.useRealTimers();
  });

  it("places the hint above its trigger for a placement that reads from the top", async () => {
    const view = await renderTooltip(
      <Tooltip content="Kept for seven years" placement="top" offset={8}>
        {TRIGGER}
      </Tooltip>,
    );

    await fireEvent(view.getByText("Archived").parent, "longPress");

    // The trigger has not been laid out in a test, so the distance is the offset alone.
    expect(hintStyle(view).bottom).toBe(8);
    expect(hintStyle(view).top).toBeUndefined();
  });

  it("places the hint below its trigger for a placement that reads from the bottom", async () => {
    const view = await renderTooltip(
      <Tooltip content="Kept for seven years" placement="bottom" offset={12}>
        {TRIGGER}
      </Tooltip>,
    );

    await fireEvent(view.getByText("Archived").parent, "longPress");

    expect(hintStyle(view).top).toBe(12);
    expect(hintStyle(view).bottom).toBeUndefined();
  });

  it("resolves a side placement to the direction it reads from, because a hint beside a control has nowhere to be", async () => {
    const view = await renderTooltip(
      <Tooltip content="Kept for seven years" placement="left" offset={8}>
        {TRIGGER}
      </Tooltip>,
    );

    await fireEvent(view.getByText("Archived").parent, "longPress");

    expect(hintStyle(view).bottom).toBe(8);
  });

  it("draws the pointer towards the trigger when it is asked for", async () => {
    const view = await renderTooltip(
      <Tooltip content="Kept for seven years" showArrow>
        {TRIGGER}
      </Tooltip>,
    );

    await fireEvent(view.getByText("Archived").parent, "longPress");

    const bubble = view.getByText("Kept for seven years").parent;

    if (!bubble) {
      throw new Error("the hint was not drawn");
    }

    const pointer = bubble.children.find(
      (child) =>
        typeof child === "object" &&
        child !== null &&
        (child.props as { className?: string }).className?.includes(
          "rotate-45",
        ) === true,
    );

    expect(pointer).toBeTruthy();
  });

  it("never appears when the hint is switched off", async () => {
    const view = await renderTooltip(
      <Tooltip content="Kept for seven years" isDisabled>
        {TRIGGER}
      </Tooltip>,
    );

    await fireEvent(view.getByText("Archived").parent, "longPress");

    expect(view.queryByText("Kept for seven years")).toBeNull();
    expect(
      view.getByText("Archived").parent?.props.accessibilityHint,
    ).toBeUndefined();
  });

  it("resolves its treatment, colour and size through the cascade", async () => {
    const view = await renderTooltip(
      <Tooltip content="Kept for seven years">{TRIGGER}</Tooltip>,
      {
        components: {
          tooltip: { color: "danger", size: "lg", radius: "full" },
        },
      },
    );

    await fireEvent(view.getByText("Archived").parent, "longPress");

    const classes = bubbleClasses(view);

    expect(classes).toContain("bg-danger");
    expect(classes).toContain("px-4");
    expect(classes).toContain("rounded-full");
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      render(<Tooltip content="Kept for seven years">{TRIGGER}</Tooltip>),
    ).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
