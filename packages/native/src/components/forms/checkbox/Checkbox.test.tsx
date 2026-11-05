/**
 * Behaviour tests for the native Checkbox and CheckboxGroup.
 *
 * The tests state the contract of the pair: the group owns the selected values, a
 * controlled group keeps the set the consumer gives it, an uncontrolled group
 * selects from its own default, every option reports its state to the platform's
 * screen reader, the group shows the family's label block, a disabled option
 * refuses to be ticked, and the options resolve their density through the
 * cascade.
 */

import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import {
  NATIVE_CHECKBOX_OUTER_SIZE_CLASS,
  NATIVE_CHECKBOX_STATUS_BORDER_CLASS,
} from "../../../styles/checkbox";
import { Checkbox } from "./Checkbox";
import { CheckboxGroup } from "./CheckboxGroup";

/** Render options inside the framework provider. */
async function renderGroup(ui: ReactElement, config?: object) {
  return render(<AsheeUIProvider config={config}>{ui}</AsheeUIProvider>);
}

/** Tick or untick an option and wait for the state it sets to be flushed. */
async function tick(view: RenderResult, testID: string) {
  await act(async () => {
    fireEvent.press(view.getByTestId(testID));
  });
}

/**
 * The class string of the first element whose classes mention a value.
 *
 * The square is drawn by the component rather than named by the consumer, so it
 * is reached by walking what was rendered instead of by an identifier the
 * component would have had to invent for the sake of a test.
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

describe("Native CheckboxGroup", () => {
  it("announces the group's checkboxes and reports the values that are ticked", async () => {
    const onChange = jest.fn();
    const view = await renderGroup(
      <CheckboxGroup
        label="Interests"
        description="Choose as many as you like"
        onChange={onChange}>
        <Checkbox testID="news" value="news" label="News" />
        <Checkbox testID="sport" value="sport" label="Sport" />
      </CheckboxGroup>,
    );

    expect(view.getByTestId("news").props.accessibilityRole).toBe("checkbox");
    expect(view.getByTestId("news").props.accessibilityState.checked).toBe(
      false,
    );
    expect(view.getByText("Interests")).toBeTruthy();
    expect(view.getByText("Choose as many as you like")).toBeTruthy();

    await tick(view, "sport");

    expect(onChange).toHaveBeenCalledWith(["sport"]);
    expect(view.getByTestId("sport").props.accessibilityState.checked).toBe(
      true,
    );
  });

  it("unticks a value that was already ticked", async () => {
    const onChange = jest.fn();
    const view = await renderGroup(
      <CheckboxGroup defaultValue={["news"]} onChange={onChange}>
        <Checkbox testID="news" value="news" label="News" />
      </CheckboxGroup>,
    );

    await tick(view, "news");

    expect(onChange).toHaveBeenCalledWith([]);
    expect(view.getByTestId("news").props.accessibilityState.checked).toBe(
      false,
    );
  });

  it("ticks from its own default when the consumer does not own it", async () => {
    const view = await renderGroup(
      <CheckboxGroup defaultValue={["news"]}>
        <Checkbox testID="news" value="news" label="News" />
        <Checkbox testID="sport" value="sport" label="Sport" />
      </CheckboxGroup>,
    );

    expect(view.getByTestId("news").props.accessibilityState.checked).toBe(
      true,
    );
    expect(view.getByTestId("sport").props.accessibilityState.checked).toBe(
      false,
    );
  });

  it("keeps the set the consumer owns", async () => {
    const view = await renderGroup(
      <CheckboxGroup value={["news"]}>
        <Checkbox testID="news" value="news" label="News" />
        <Checkbox testID="sport" value="sport" label="Sport" />
      </CheckboxGroup>,
    );

    await tick(view, "sport");

    expect(view.getByTestId("news").props.accessibilityState.checked).toBe(
      true,
    );
    expect(view.getByTestId("sport").props.accessibilityState.checked).toBe(
      false,
    );
  });

  it("refuses to tick a disabled option", async () => {
    const onChange = jest.fn();
    const view = await renderGroup(
      <CheckboxGroup onChange={onChange} isDisabled>
        <Checkbox testID="news" value="news" label="News" />
      </CheckboxGroup>,
    );

    await tick(view, "news");

    expect(onChange).not.toHaveBeenCalled();
    expect(view.getByTestId("news").props.accessibilityState.disabled).toBe(
      true,
    );
  });

  it("sizes the square from the density the group shares", async () => {
    const view = await renderGroup(
      <CheckboxGroup size="lg">
        <Checkbox testID="news" value="news" label="News" />
      </CheckboxGroup>,
    );

    expect(
      findClassMentioning(view.toJSON(), NATIVE_CHECKBOX_OUTER_SIZE_CLASS.lg),
    ).toContain(NATIVE_CHECKBOX_OUTER_SIZE_CLASS.lg);
  });

  it("paints the validation status on an unchecked square", async () => {
    const view = await renderGroup(
      <CheckboxGroup status="error">
        <Checkbox testID="news" value="news" label="News" />
      </CheckboxGroup>,
    );

    expect(
      findClassMentioning(
        view.toJSON(),
        NATIVE_CHECKBOX_STATUS_BORDER_CLASS.error,
      ),
    ).toContain(NATIVE_CHECKBOX_STATUS_BORDER_CLASS.error);
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderGroup(
      <CheckboxGroup className="mt-2">
        <Checkbox testID="news" value="news" label="News" />
      </CheckboxGroup>,
    );

    // The group's own classes come first and the consumer's last, so the class
    // that mentions the consumer's value is the one that also states the
    // arrangement.
    const groupClasses = findClassMentioning(view.toJSON(), "mt-2");

    expect(groupClasses).toContain("flex-col");
    expect(groupClasses?.endsWith("mt-2")).toBe(true);
  });
});

describe("Native Checkbox", () => {
  it("keeps its own state when it stands alone", async () => {
    const view = await renderGroup(
      <Checkbox testID="terms" value="terms" label="Accept terms" />,
    );

    expect(view.getByTestId("terms").props.accessibilityState.checked).toBe(
      false,
    );

    await tick(view, "terms");

    expect(view.getByTestId("terms").props.accessibilityState.checked).toBe(
      true,
    );
  });

  it("keeps a controlled checkbox the consumer owns", async () => {
    const onChange = jest.fn();
    const view = await renderGroup(
      <Checkbox
        testID="terms"
        value="terms"
        label="Accept terms"
        checked={false}
        onChange={onChange}
      />,
    );

    await tick(view, "terms");

    expect(onChange).toHaveBeenCalledWith(true, "terms");
    expect(view.getByTestId("terms").props.accessibilityState.checked).toBe(
      false,
    );
  });

  it("lets an instance prop win over the configured density", async () => {
    const view = await renderGroup(
      <Checkbox testID="news" value="news" label="News" size="sm" />,
      { components: { checkbox: { size: "lg" } } },
    );

    expect(
      findClassMentioning(view.toJSON(), NATIVE_CHECKBOX_OUTER_SIZE_CLASS.sm),
    ).toContain(NATIVE_CHECKBOX_OUTER_SIZE_CLASS.sm);
    expect(
      findClassMentioning(view.toJSON(), NATIVE_CHECKBOX_OUTER_SIZE_CLASS.lg),
    ).toBeUndefined();
  });
});
