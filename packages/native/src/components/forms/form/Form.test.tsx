/**
 * Behaviour tests for the native Form.
 *
 * The tests state the component's contract: the form groups its fields, it names the group when
 * it is asked to, it submits from the control it renders, a pending form reports its wait and
 * refuses to submit twice, and the submit control resolves through the configuration cascade.
 */

import { act, fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AccessibilityInfo } from "react-native";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import { Input } from "../input/Input";
import { Form } from "./Form";

/** Render the form inside the framework provider. */
async function renderForm(ui: ReactElement, config?: object) {
  return render(<AsheeUIProvider config={config}>{ui}</AsheeUIProvider>);
}

describe("Native Form", () => {
  it("groups its fields and names the group", async () => {
    const view = await renderForm(
      <Form legend="Shipping">
        <Input testID="street" label="Street" />
      </Form>,
    );

    expect(view.getByText("Shipping")).toBeTruthy();
    expect(view.getByText("Street")).toBeTruthy();
  });

  it("submits from the control it renders", async () => {
    const onSubmit = jest.fn();
    const view = await renderForm(
      <Form submitLabel="Continue" submitTestID="submit" onSubmit={onSubmit}>
        <Input testID="street" label="Street" />
      </Form>,
    );

    await act(async () => {
      fireEvent.press(view.getByTestId("submit"));
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders no control when it has no submit label", async () => {
    const view = await renderForm(
      <Form>
        <Input testID="street" label="Street" />
      </Form>,
    );

    expect(view.queryByRole("button")).toBeNull();
  });

  it("reports its wait and refuses to submit while it is pending", async () => {
    const onSubmit = jest.fn();
    const view = await renderForm(
      <Form
        submitLabel="Continue"
        submitTestID="submit"
        isPending
        onSubmit={onSubmit}>
        <Input testID="street" label="Street" />
      </Form>,
    );

    await act(async () => {
      fireEvent.press(view.getByTestId("submit"));
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(view.getByTestId("submit").props.accessibilityState.disabled).toBe(
      true,
    );
  });

  it("resolves the submit control's accent through configuration", async () => {
    const view = await renderForm(
      <Form submitLabel="Continue" submitTestID="submit">
        <Input testID="street" label="Street" />
      </Form>,
      { components: { form: { submitColor: "danger" } } },
    );

    expect(view.getByTestId("submit").props.className as string).toContain(
      "bg-danger",
    );
  });

  it("announces and focuses the form when the submission is refused", async () => {
    // A refused submit is the moment a reader most needs to be placed at the form: the
    // press happened somewhere, and the reason is here.
    const announceSpy = jest
      .spyOn(AccessibilityInfo, "announceForAccessibility")
      .mockImplementation(() => {});
    const nodeSpy = jest
      .spyOn(require("react-native"), "findNodeHandle")
      .mockReturnValue(42 as never);
    const focusSpy = jest
      .spyOn(AccessibilityInfo, "setAccessibilityFocus")
      .mockImplementation(() => {});

    const view = await renderForm(
      <Form
        submitLabel="Continue"
        submitTestID="submit"
        onSubmit={() => false}>
        <Input testID="street" label="Street" />
      </Form>,
    );

    await act(async () => {
      fireEvent.press(view.getByTestId("submit"));
    });

    expect(announceSpy).toHaveBeenCalledWith(
      "The form could not be submitted.",
    );
    expect(focusSpy).toHaveBeenCalledWith(42);

    focusSpy.mockRestore();
    nodeSpy.mockRestore();
    announceSpy.mockRestore();
  });
});
