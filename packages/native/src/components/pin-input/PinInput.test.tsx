/**
 * Behaviour tests for the native PinInput.
 *
 * The tests state the component's contract: the field is named for the platform's screen
 * reader, only the characters its mode accepts are kept and no more of them than it
 * collects, the code is reported as it changes and once when it is complete, the
 * characters can be hidden, the boxes say what the field holds, and every option resolves
 * through the configuration cascade.
 */

import {
  NATIVE_PIN_INPUT_BOX_INVALID_CLASS,
  sanitizePinValue,
} from "@asheeui/core";
import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { PinInput } from "./PinInput";

/** Render the field inside the framework provider. */
async function renderPin(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/** Type into the field behind the boxes and wait for the update to be flushed. */
async function type(view: RenderResult, text: string) {
  await act(async () => {
    fireEvent.changeText(view.getByTestId("pin"), text);
  });
}

/** The class string of the first element whose classes mention a value. */
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

describe("Native PinInput", () => {
  it("names the field and shows its label", async () => {
    const view = await renderPin(
      <PinInput testID="pin" label="Verification code" />,
    );

    expect(view.getByTestId("pin").props.accessibilityLabel).toBe(
      "Verification code",
    );
    expect(view.getByText("Verification code")).toBeTruthy();
  });

  it("keeps the characters its mode accepts and no more than it collects", async () => {
    const view = await renderPin(<PinInput testID="pin" label="Code" />);

    await type(view, "12a3456");

    expect((view.getByTestId("pin").props as { value?: string }).value).toBe(
      "1234",
    );
    expect(view.getByText("1")).toBeTruthy();
    expect(view.getByText("4")).toBeTruthy();
  });

  it("reports the code as it changes and once when it is complete", async () => {
    const onValueChange = jest.fn();
    const onComplete = jest.fn();
    const view = await renderPin(
      <PinInput
        testID="pin"
        label="Code"
        onValueChange={onValueChange}
        onComplete={onComplete}
      />,
    );

    await type(view, "12");

    expect(onComplete).not.toHaveBeenCalled();

    await type(view, "1234");

    expect(onValueChange).toHaveBeenLastCalledWith("1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("hides the characters when the configured field is masked", async () => {
    const view = await renderPin(
      <PinInput testID="pin" label="Code" defaultValue="1234" />,
      { components: { pininput: { masked: true } } },
    );

    expect(view.getByTestId("pin").props.secureTextEntry).toBe(true);
    expect(view.queryByText("1")).toBeNull();
    expect(view.getAllByText("•")).toHaveLength(4);
  });

  it("reports an invalid field and colours the boxes", async () => {
    const view = await renderPin(
      <PinInput testID="pin" label="Code" isInvalid />,
    );

    expect(view.getByTestId("pin").props["aria-invalid"]).toBe(true);
    expect(findClassMentioning(view.toJSON(), "border-danger")).toContain(
      NATIVE_PIN_INPUT_BOX_INVALID_CLASS,
    );
  });

  it("draws a separator after the group it was told to", async () => {
    const view = await renderPin(
      <PinInput testID="pin" label="Code" length={6} separatorAfter={3} />,
    );

    expect(view.getByText("-")).toBeTruthy();
  });

  it("resolves its length through configuration", async () => {
    const view = await renderPin(<PinInput testID="pin" label="Code" />, {
      components: { pininput: { length: 2 } },
    });

    await type(view, "1234");

    expect((view.getByTestId("pin").props as { value?: string }).value).toBe(
      "12",
    );
  });

  it("reads the rule it shares with the web from the core layer", () => {
    expect(sanitizePinValue("12a3", "numeric")).toBe("123");
    expect(sanitizePinValue("12a3-", "alphanumeric")).toBe("12a3");
    expect(sanitizePinValue("ab c", "text")).toBe("abc");
    expect(sanitizePinValue("12345", "numeric", 4)).toBe("1234");
  });
});
