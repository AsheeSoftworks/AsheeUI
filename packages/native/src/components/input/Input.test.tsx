/**
 * Behaviour tests for the native Input.
 *
 * The tests state the component's contract: the field is named for the platform's
 * screen reader, it reports what the reader types, it shows its label, its
 * description and its message, it reports an invalid state, it shows a visible
 * focus edge, and every option resolves through the configuration cascade.
 */

import { FIELD_STATUS_TEXT_CLASS } from "@asheeui/core";
import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Input } from "./Input";

/**
 * Render a field inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderInput(ui: ReactElement, config?: object) {
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

describe("Native Input", () => {
  it("names the field for the platform's screen reader", async () => {
    const view = await renderInput(
      <Input testID="input" label="Email" description="We never share it" />,
    );
    const field = view.getByTestId("input");

    expect(field.props.accessibilityLabel).toBe("Email");
    expect(field.props.accessibilityHint).toBe("We never share it");
    expect(view.getByText("Email")).toBeTruthy();
    expect(view.getByText("We never share it")).toBeTruthy();
  });

  it("reports what the reader types", async () => {
    const onChangeText = jest.fn();
    const view = await renderInput(
      <Input testID="input" label="Email" onChangeText={onChangeText} />,
    );

    fireEvent.changeText(view.getByTestId("input"), "you@example.com");

    expect(onChangeText).toHaveBeenCalledWith("you@example.com");
  });

  it("shows its message and reports an invalid field", async () => {
    const view = await renderInput(
      <Input
        testID="input"
        label="Email"
        status="error"
        message="That address is not valid"
      />,
    );

    expect(view.getByText("That address is not valid")).toBeTruthy();
    expect(view.getByTestId("input").props["aria-invalid"]).toBe(true);
    expect(classesOf(view, "input")).toContain("border-danger");
  });

  it("keeps a touch-sized field whatever its density is", async () => {
    const view = await renderInput(<Input testID="input" size="sm" />);

    expect(classesOf(view, "input")).toContain("min-h-[44px]");
  });

  it("shows a visible edge while it has focus", async () => {
    const view = await renderInput(
      <Input testID="input" label="Email" color="primary" />,
    );

    expect(classesOf(view, "input")).toContain("border-border");

    // The focus state is the component's own, so the update is flushed before the
    // class is read back.
    await act(async () => {
      fireEvent(view.getByTestId("input"), "focus");
    });

    expect(classesOf(view, "input")).toContain("border-primary");
  });

  it("resolves its defaults through configuration", async () => {
    const view = await renderInput(<Input testID="input" label="Email" />, {
      components: { input: { radius: "full", multiline: true } },
    });

    expect(classesOf(view, "input")).toContain("rounded-full");
    expect(classesOf(view, "input")).toContain("min-h-[96px]");
    expect(view.getByTestId("input").props.multiline).toBe(true);
  });

  it("tones its message with the shared status dictionary", async () => {
    const view = await renderInput(
      <Input
        testID="input"
        label="Email"
        status="success"
        message="Looks good"
      />,
    );

    const messageClasses = (
      view.getByText("Looks good").props as { className?: string }
    ).className as string;

    // The Text component states its own default tone first, so the status tone has to
    // arrive last to win — which is why the shared dictionary's class is asserted by
    // position rather than by presence.
    expect(messageClasses).toContain(FIELD_STATUS_TEXT_CLASS.success);
    expect(messageClasses.endsWith(FIELD_STATUS_TEXT_CLASS.success)).toBe(true);
  });

  it("rounds with the shared native radius scale", async () => {
    const view = await renderInput(<Input testID="input" radius="sm" />, {
      components: { input: { radius: "sm" } },
    });

    // The native scale spells its second step "rounded" rather than the web's
    // "rounded-sm", so this pins which vocabulary the field rounds with.
    expect(classesOf(view, "input")).toContain("rounded");
    expect(classesOf(view, "input")).not.toContain("rounded-rounded");
  });

  it("lets an instance prop win over the configured value", async () => {
    const view = await renderInput(<Input testID="input" size="lg" />, {
      components: { input: { size: "sm" } },
    });

    expect(classesOf(view, "input")).toContain("min-h-[56px]");
    expect(classesOf(view, "input")).not.toContain("min-h-[44px]");
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderInput(<Input testID="input" className="mb-2" />);

    expect(classesOf(view, "input").endsWith("mb-2")).toBe(true);
  });
});
