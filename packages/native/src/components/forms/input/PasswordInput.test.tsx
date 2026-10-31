/**
 * Behaviour tests for the native PasswordInput.
 *
 * The component's one security-relevant act is the masking, so that is what the tests
 * assert: the field starts `secureTextEntry`, the reveal control removes it, and the
 * control carries the accessible name and selected state a screen reader reads. The
 * default icons are words, so their text is queryable; a consumer's own icons are still
 * supported and are not what these tests depend on.
 */

import { act, fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Typography } from "../../typography/text/Text";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import { PasswordInput } from "./PasswordInput";

/**
 * Render a field inside the provider, as an application would.
 *
 * @param ui - The element under test.
 * @returns The rendered tree and its queries.
 */
async function renderField(ui: ReactElement) {
  return render(<AsheeUIProvider>{ui}</AsheeUIProvider>);
}

describe("Native PasswordInput", () => {
  it("masks the value through the platform's secure entry", async () => {
    const view = await renderField(
      <PasswordInput testID="password" label="Password" />,
    );

    expect(view.getByTestId("password").props.secureTextEntry).toBe(true);
  });

  it("reveals the value when the reveal control is pressed", async () => {
    const view = await renderField(
      <PasswordInput testID="password" label="Password" />,
    );

    await act(async () => {
      fireEvent.press(view.getByLabelText("Show password"));
    });

    expect(view.getByTestId("password").props.secureTextEntry).toBe(false);
    // The control now offers the opposite act, and it says so.
    expect(view.getByLabelText("Hide password")).toBeTruthy();
  });

  it("hides the value again when the revealed control is pressed", async () => {
    const view = await renderField(
      <PasswordInput testID="password" label="Password" />,
    );

    await act(async () => {
      fireEvent.press(view.getByLabelText("Show password"));
    });
    await act(async () => {
      fireEvent.press(view.getByLabelText("Hide password"));
    });

    expect(view.getByTestId("password").props.secureTextEntry).toBe(true);
  });

  it("names the control through toggleAriaLabel and reports the revealed state", async () => {
    const view = await renderField(
      <PasswordInput
        testID="password"
        label="Password"
        toggleAriaLabel={(show) => (show ? "Conceal" : "Reveal")}
      />,
    );

    const control = view.getByLabelText("Reveal");
    expect(control.props.accessibilityState).toMatchObject({ selected: false });

    await act(async () => {
      fireEvent.press(control);
    });

    expect(view.getByLabelText("Conceal").props.accessibilityState).toMatchObject(
      { selected: true },
    );
  });

  it("accepts the consumer's own icons", async () => {
    const view = await renderField(
      <PasswordInput
        testID="password"
        label="Password"
        onIcon={<Typography role="label">Open eye</Typography>}
        offIcon={<Typography role="label">Closed eye</Typography>}
      />,
    );

    expect(view.getByText("Open eye")).toBeTruthy();

    await act(async () => {
      fireEvent.press(view.getByLabelText("Show password"));
    });

    expect(view.getByText("Closed eye")).toBeTruthy();
  });
});
