/**
 * Behaviour tests for the native Switch.
 *
 * The tests state the component's contract: the control announces itself as a switch
 * with the platform's own state, it reports the next state when it is pressed, it keeps
 * its own state when the consumer does not own it and leaves it alone when the consumer
 * does, it refuses to move when it is unavailable, it shows its label, its description
 * and its required marker, and every option resolves through the configuration cascade.
 */

import {
  FIELD_REQUIRED_MARKER_CLASS,
  NATIVE_SWITCH_THUMB_CLASS,
  NATIVE_SWITCH_THUMB_SIZE_CLASS,
  NATIVE_SWITCH_THUMB_TRAVEL,
} from "@asheeui/core";
import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Switch } from "./Switch";

/**
 * Render a field inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderSwitch(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Press the control, and wait for the state it sets to be flushed.
 *
 * A press that changes the control's own state is read back after the update has been
 * applied, which is what the platform's renderer requires.
 *
 * @param view - The rendered tree.
 */
async function press(view: RenderResult) {
  await act(async () => {
    fireEvent.press(view.getByTestId("switch"));
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
 * Find the first class string in the rendered tree that mentions a value.
 *
 * The knob is the animator's own view, so it is reached by walking what was rendered
 * rather than by an identifier the component would have had to invent for the sake of
 * a test.
 *
 * @param node - A rendered node, or a list of them.
 * @param mentions - The value the wanted class string contains.
 * @returns The class string, or undefined when nothing carries it.
 */
function findClassMentioning(
  node: unknown,
  mentions: string,
): string | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findClassMentioning(child, mentions);
      if (found) return found;
    }
    return undefined;
  }

  if (!node || typeof node !== "object") return undefined;

  const element = node as {
    props?: { className?: string };
    children?: unknown;
  };
  const className = element.props?.className;

  if (typeof className === "string" && className.includes(mentions)) {
    return className;
  }

  return findClassMentioning(element.children, mentions);
}

describe("Native Switch", () => {
  it("announces itself as a switch with its own state", async () => {
    const view = await renderSwitch(
      <Switch
        testID="switch"
        label="Weekly digest"
        description="Every Monday"
      />,
    );
    const control = view.getByTestId("switch");

    expect(control.props.accessibilityRole).toBe("switch");
    expect(control.props.accessibilityLabel).toBe("Weekly digest");
    expect(control.props.accessibilityHint).toBe("Every Monday");
    expect(control.props.accessibilityState.checked).toBe(false);
    expect(view.getByText("Weekly digest")).toBeTruthy();
    expect(view.getByText("Every Monday")).toBeTruthy();
  });

  it("reports the next state when it is pressed", async () => {
    const onChange = jest.fn();
    const view = await renderSwitch(
      <Switch testID="switch" label="Weekly digest" onChange={onChange} />,
    );

    await press(view);

    expect(onChange).toHaveBeenCalledWith(true);
    expect(view.getByTestId("switch").props.accessibilityState.checked).toBe(
      true,
    );
  });

  it("leaves the state to the consumer when the consumer owns it", async () => {
    const onChange = jest.fn();
    const view = await renderSwitch(
      <Switch
        testID="switch"
        label="Digest"
        checked={false}
        onChange={onChange}
      />,
    );

    await press(view);

    // The consumer's value has not changed, so the control still reports it: a
    // controlled switch does not move itself.
    expect(view.getByTestId("switch").props.accessibilityState.checked).toBe(
      false,
    );
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("refuses to move when it is unavailable", async () => {
    const onChange = jest.fn();
    const view = await renderSwitch(
      <Switch testID="switch" label="Digest" isDisabled onChange={onChange} />,
    );

    await press(view);

    expect(onChange).not.toHaveBeenCalled();
    expect(view.getByTestId("switch").props.accessibilityState.disabled).toBe(
      true,
    );
  });

  it("shows the required marker beside its label", async () => {
    const view = await renderSwitch(
      <Switch testID="switch" label="Digest" required />,
    );

    expect(view.getByText("*").props.className).toContain(
      FIELD_REQUIRED_MARKER_CLASS,
    );
  });

  it("sizes the knob from the resolved density", async () => {
    const view = await renderSwitch(
      <Switch testID="switch" label="Digest" size="lg" />,
    );

    expect(
      findClassMentioning(view.toJSON(), NATIVE_SWITCH_THUMB_CLASS),
    ).toContain(NATIVE_SWITCH_THUMB_SIZE_CLASS.lg);
    // The distance the platform animates is derived from the proportions, so it grows
    // with the density rather than being a number a renderer invented.
    expect(NATIVE_SWITCH_THUMB_TRAVEL.lg).toBeGreaterThan(
      NATIVE_SWITCH_THUMB_TRAVEL.sm,
    );
  });

  it("resolves its defaults through configuration", async () => {
    const view = await renderSwitch(<Switch testID="switch" label="Digest" />, {
      components: { switch: { isDisabled: true, required: true } },
    });

    expect(view.getByTestId("switch").props.accessibilityState.disabled).toBe(
      true,
    );
    expect(view.getByText("*")).toBeTruthy();
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderSwitch(
      <Switch testID="switch" label="Digest" className="mb-2" />,
    );

    expect(classesOf(view, "switch").endsWith("mb-2")).toBe(true);
  });
});
