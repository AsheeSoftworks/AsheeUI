/**
 * Behaviour tests for the native Stepper.
 *
 * The tests state the component's contract: the steps are drawn in order with the state each
 * one is in, the step the reader is on is the one the platform reports as selected, moving
 * between steps is reported, the descriptions can be hidden, and the arrangement resolves
 * through the configuration cascade.
 */

import { NATIVE_STEPPER_LIST_CLASS } from "@asheeui/core";
import { act, fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Stepper } from "./Stepper";

const STEPS = [
  { key: "cart", label: "Cart" },
  { key: "pay", label: "Payment", description: "Card details" },
  { key: "done", label: "Done" },
];

/** Render the sequence inside the framework provider. */
async function renderStepper(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

describe("Native Stepper", () => {
  it("draws the completed steps as ticks and the rest as numbers", async () => {
    const view = await renderStepper(
      <Stepper label="Checkout" steps={STEPS} currentStep={1} />,
    );

    expect(view.getByText("Cart")).toBeTruthy();
    expect(view.getByText("Payment")).toBeTruthy();
    expect(view.getByText("Done")).toBeTruthy();
    // The first step is behind the reader, so it is a tick; the others carry their number.
    expect(view.getByText("✓")).toBeTruthy();
    expect(view.getByText("3")).toBeTruthy();
  });

  it("reports the step a reader moved to", async () => {
    const onStepChange = jest.fn();
    const view = await renderStepper(
      <Stepper
        testID="step"
        label="Checkout"
        steps={STEPS}
        currentStep={0}
        onStepChange={onStepChange}
      />,
    );

    expect(
      view.getByTestId("step-cart").props.accessibilityState.selected,
    ).toBe(true);

    await act(async () => {
      fireEvent.press(view.getByTestId("step-pay"));
    });

    expect(onStepChange).toHaveBeenCalledWith(1);
  });

  it("draws the steps as rows when nobody can move between them", async () => {
    const view = await renderStepper(
      <Stepper testID="step" label="Checkout" steps={STEPS} currentStep={2} />,
    );

    expect(view.queryByRole("button")).toBeNull();
    expect(view.getByTestId("step-done")).toBeTruthy();
  });

  it("shows the descriptions unless the consumer hides them", async () => {
    const view = await renderStepper(
      <Stepper testID="step" label="Checkout" steps={STEPS} currentStep={1} />,
      { components: { stepper: { showDescriptions: false } } },
    );

    expect(view.queryByText("Card details")).toBeNull();
  });

  it("arranges the steps in a row when the consumer asks for one", async () => {
    const view = await renderStepper(
      <Stepper testID="step" label="Checkout" steps={STEPS} currentStep={0} />,
      { components: { stepper: { orientation: "horizontal" } } },
    );

    const classes = (
      view.getByLabelText("Checkout").props as {
        className?: string;
      }
    ).className as string;

    expect(classes).toContain("flex-row");
    expect(classes).toContain(
      NATIVE_STEPPER_LIST_CLASS.horizontal.split(" ")[1],
    );
  });
});
