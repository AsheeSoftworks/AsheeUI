/**
 * Behaviour tests for the native Radio and RadioGroup.
 *
 * The tests state the contract of the pair: the group owns the selection, a controlled
 * group keeps the selection the consumer gives it, an uncontrolled group selects from its
 * own default, every option reports its state to the platform's screen reader, the group
 * shows the family's label block, the disabled option refuses to be picked, and the
 * options resolve their density, treatment and validation status through the cascade.
 */

import {
  NATIVE_RADIO_CARD_CLASS,
  NATIVE_RADIO_OUTER_SIZE_CLASS,
} from "@asheeui/core";
import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Radio } from "./Radio";
import { RadioGroup } from "./RadioGroup";

/** Render options inside the framework provider. */
async function renderGroup(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/** Pick an option and wait for the state it sets to be flushed. */
async function pick(view: RenderResult, testID: string) {
  await act(async () => {
    fireEvent.press(view.getByTestId(testID));
  });
}

/** The classes an element carries. */
function classesOf(view: RenderResult, testID: string): string {
  return (view.getByTestId(testID).props as { className?: string })
    .className as string;
}

/**
 * The class string of the first element whose classes mention a value.
 *
 * The circle is drawn by the component rather than named by the consumer, so it is
 * reached by walking what was rendered instead of by an identifier the component would
 * have had to invent for the sake of a test.
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

describe("Native RadioGroup", () => {
  it("announces the group and lets an option be picked", async () => {
    const onChange = jest.fn();
    const view = await renderGroup(
      <RadioGroup
        label="Plan"
        description="Change it any time"
        onChange={onChange}>
        <Radio testID="starter" value="starter" label="Starter" />
        <Radio testID="growth" value="growth" label="Growth" />
      </RadioGroup>,
    );

    expect(view.getByTestId("starter").props.accessibilityRole).toBe("radio");
    expect(view.getByTestId("starter").props.accessibilityState.checked).toBe(
      false,
    );
    expect(view.getByText("Plan")).toBeTruthy();
    expect(view.getByText("Change it any time")).toBeTruthy();

    await pick(view, "growth");

    expect(onChange).toHaveBeenCalledWith("growth");
    expect(view.getByTestId("growth").props.accessibilityState.checked).toBe(
      true,
    );
  });

  it("selects from its own default when the consumer does not own it", async () => {
    const view = await renderGroup(
      <RadioGroup defaultValue="starter">
        <Radio testID="starter" value="starter" label="Starter" />
        <Radio testID="growth" value="growth" label="Growth" />
      </RadioGroup>,
    );

    expect(view.getByTestId("starter").props.accessibilityState.checked).toBe(
      true,
    );
  });

  it("keeps the selection the consumer owns", async () => {
    const view = await renderGroup(
      <RadioGroup value="growth">
        <Radio testID="starter" value="starter" label="Starter" />
        <Radio testID="growth" value="growth" label="Growth" />
      </RadioGroup>,
    );

    await pick(view, "starter");

    expect(view.getByTestId("growth").props.accessibilityState.checked).toBe(
      true,
    );
    expect(view.getByTestId("starter").props.accessibilityState.checked).toBe(
      false,
    );
  });

  it("refuses to pick a disabled option", async () => {
    const onChange = jest.fn();
    const view = await renderGroup(
      <RadioGroup onChange={onChange} isDisabled>
        <Radio testID="starter" value="starter" label="Starter" />
      </RadioGroup>,
    );

    await pick(view, "starter");

    expect(onChange).not.toHaveBeenCalled();
    expect(view.getByTestId("starter").props.accessibilityState.disabled).toBe(
      true,
    );
  });

  it("sizes the circle from the density the group shares", async () => {
    const view = await renderGroup(
      <RadioGroup size="lg">
        <Radio testID="starter" value="starter" label="Starter" />
      </RadioGroup>,
    );

    expect(
      findClassMentioning(view.toJSON(), NATIVE_RADIO_OUTER_SIZE_CLASS.lg),
    ).toContain(NATIVE_RADIO_OUTER_SIZE_CLASS.lg);
  });

  it("draws a card when the group asks for one", async () => {
    const view = await renderGroup(
      <RadioGroup variant="card">
        <Radio testID="starter" value="starter" label="Starter" />
      </RadioGroup>,
    );

    expect(classesOf(view, "starter")).toContain(
      NATIVE_RADIO_CARD_CLASS.split(" ")[0],
    );
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderGroup(
      <RadioGroup className="mt-2">
        <Radio testID="starter" value="starter" label="Starter" />
      </RadioGroup>,
    );

    // The group's own classes come first and the consumer's last, so the class that
    // mentions the consumer's value is the one that also states the arrangement.
    const groupClasses = findClassMentioning(view.toJSON(), "mt-2");

    expect(groupClasses).toContain("flex-col");
    expect(groupClasses?.endsWith("mt-2")).toBe(true);
  });
});
