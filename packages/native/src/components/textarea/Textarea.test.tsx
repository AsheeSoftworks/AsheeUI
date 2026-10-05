/**
 * Behaviour tests for the native Textarea.
 *
 * The tests state the component's contract: the field is named for the platform's
 * screen reader, it reports what the reader types, it shows its label, its description
 * and its message, it reports an invalid state, it accepts several lines and starts at
 * the height its rows option states, and every option resolves through the
 * configuration cascade.
 */

import {
  NATIVE_TEXTAREA_ROW_HEIGHT,
  NATIVE_TEXTAREA_SIZE_CLASS,
} from "@asheeui/core";
import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Textarea } from "./Textarea";

/**
 * Render a field inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderTextarea(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
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
 * Read the minimum height a rendered field starts from.
 *
 * @param view - The rendered tree.
 * @param testID - The element's test identifier.
 * @returns Its minimum height in pixels, or undefined when it states none.
 */
function minHeightOf(view: RenderResult, testID: string): number | undefined {
  const style = view.getByTestId(testID).props.style as
    | { minHeight?: number }
    | Array<{ minHeight?: number } | undefined>
    | undefined;

  const entries = Array.isArray(style) ? style : [style];

  for (const entry of entries) {
    if (entry?.minHeight !== undefined) return entry.minHeight;
  }

  return undefined;
}

describe("Native Textarea", () => {
  it("names the field for the platform's screen reader", async () => {
    const view = await renderTextarea(
      <Textarea
        testID="textarea"
        label="Notes"
        description="Shown to the team"
      />,
    );

    expect(view.getByTestId("textarea").props.accessibilityLabel).toBe("Notes");
    expect(view.getByTestId("textarea").props.accessibilityHint).toBe(
      "Shown to the team",
    );
    expect(view.getByText("Notes")).toBeTruthy();
    expect(view.getByText("Shown to the team")).toBeTruthy();
  });

  it("reports what the reader types", async () => {
    const onChangeText = jest.fn();
    const view = await renderTextarea(
      <Textarea testID="textarea" label="Notes" onChangeText={onChangeText} />,
    );

    fireEvent.changeText(view.getByTestId("textarea"), "Two lines\nof notes");

    expect(onChangeText).toHaveBeenCalledWith("Two lines\nof notes");
  });

  it("accepts several lines and starts at the height its rows state", async () => {
    const view = await renderTextarea(
      <Textarea testID="textarea" label="Notes" rows={6} />,
    );

    expect(view.getByTestId("textarea").props.multiline).toBe(true);
    expect(minHeightOf(view, "textarea")).toBe(6 * NATIVE_TEXTAREA_ROW_HEIGHT);
  });

  it("shows its message and reports an invalid field", async () => {
    const view = await renderTextarea(
      <Textarea
        testID="textarea"
        label="Notes"
        status="error"
        message="That is too long"
      />,
    );

    expect(view.getByText("That is too long")).toBeTruthy();
    expect(view.getByTestId("textarea").props["aria-invalid"]).toBe(true);
    expect(classesOf(view, "textarea")).toContain("border-danger");
  });

  it("shows a visible edge while it has focus", async () => {
    const view = await renderTextarea(
      <Textarea testID="textarea" label="Notes" color="primary" />,
    );

    expect(classesOf(view, "textarea")).toContain("border-border");

    await act(async () => {
      fireEvent(view.getByTestId("textarea"), "focus");
    });

    expect(classesOf(view, "textarea")).toContain("border-primary");
  });

  it("resolves its defaults through configuration", async () => {
    const view = await renderTextarea(
      <Textarea testID="textarea" label="Notes" />,
      { components: { textarea: { rows: 10, size: "lg" } } },
    );

    expect(minHeightOf(view, "textarea")).toBe(10 * NATIVE_TEXTAREA_ROW_HEIGHT);
    expect(classesOf(view, "textarea")).toContain(
      NATIVE_TEXTAREA_SIZE_CLASS.lg,
    );
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderTextarea(
      <Textarea testID="textarea" label="Notes" className="mb-2" />,
    );

    expect(classesOf(view, "textarea").endsWith("mb-2")).toBe(true);
  });
});
