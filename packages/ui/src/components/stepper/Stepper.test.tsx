/**
 * Behaviour tests for the stepper.
 *
 * The tests state the pattern's contract: the sequence is an ordered list, each
 * step reports its state in words as well as in colour, the current step is
 * marked for assistive technology, and a step the reader can reach is a control
 * while one they cannot is not.
 */

import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
  userEvent,
} from "../../test";
import { Stepper } from "./Stepper";

const steps = [
  { key: "cart", label: "Cart" },
  { key: "address", label: "Address", description: "Where it ships" },
  { key: "payment", label: "Payment" },
];

describe("Stepper", () => {
  it("renders the steps as an ordered list", () => {
    const { getByRole, getAllByRole } = renderWithProvider(
      <Stepper steps={steps} currentStep={1} label="Checkout" />,
    );

    expect(getByRole("list")).toHaveAccessibleName("Checkout");
    expect(getAllByRole("listitem")).toHaveLength(3);
  });

  it("marks the current step and states every step's state in words", () => {
    const { getAllByRole } = renderWithProvider(
      <Stepper steps={steps} currentStep={1} />,
    );
    const [cart, address, payment] = getAllByRole("listitem");

    expect(cart).toHaveTextContent("Completed:");
    expect(address).toHaveAttribute("aria-current", "step");
    expect(address).toHaveTextContent("Current step:");
    expect(payment).toHaveTextContent("Not started:");
    expect(cart).not.toHaveAttribute("aria-current");
  });

  it("shows each step's label and description", () => {
    const { getByText } = renderWithProvider(
      <Stepper steps={steps} currentStep={0} />,
    );

    expect(getByText("Cart")).toBeTruthy();
    expect(getByText("Where it ships")).toBeTruthy();
  });

  it("leaves the descriptions out when they are turned off", () => {
    const { queryByText } = renderWithProvider(
      <Stepper steps={steps} currentStep={0} showDescriptions={false} />,
    );

    expect(queryByText("Where it ships")).toBeNull();
  });

  it("reports the step a reader asks for", async () => {
    const onStepChange = vi.fn();
    const { getByRole, getAllByRole } = renderWithProvider(
      <Stepper steps={steps} currentStep={1} onStepChange={onStepChange} />,
    );
    const user = userEvent.setup();

    await user.click(getByRole("button", { name: /Payment/ }));

    expect(onStepChange).toHaveBeenCalledWith(2);
    // The step the reader is on is not a control, because there is nowhere to go.
    expect(getAllByRole("listitem")[1].querySelector("button")).toBeNull();
  });

  it("reports progress only when it is given nothing to change", () => {
    const { queryByRole } = renderWithProvider(
      <Stepper steps={steps} currentStep={1} />,
    );

    expect(queryByRole("button")).toBeNull();
  });

  it("arranges the steps for the breakpoint by default", () => {
    const { getByRole } = renderWithProvider(
      <Stepper steps={steps} currentStep={0} />,
    );

    expect(getByRole("list").className).toContain("flex-col");
    expect(getByRole("list").className).toContain("md:flex-row");
  });

  it("takes its arrangement, its density and its descriptions from configuration", () => {
    const { getByRole, queryByText } = renderWithProvider(
      <Stepper steps={steps} currentStep={0} />,
      {
        config: makeComponentConfig("stepper", {
          orientation: "vertical",
          size: "sm",
          showDescriptions: false,
        }),
      },
    );

    expect(getByRole("list").className).not.toContain("md:flex-row");
    expect(getByRole("list").querySelector(".size-6")).toBeTruthy();
    expect(queryByText("Where it ships")).toBeNull();
  });

  it("lets an instance prop win over the configured value", () => {
    const { getByRole } = renderWithProvider(
      <Stepper steps={steps} currentStep={0} orientation="vertical" />,
      { config: makeComponentConfig("stepper", { orientation: "horizontal" }) },
    );

    expect(getByRole("list").className).not.toContain("md:flex-row");
  });

  it("renders the element it is asked for, carries the consumer's class and forwards its ref", () => {
    const ref = createRef<HTMLOListElement>();
    const { getByRole } = renderWithProvider(
      <Stepper
        as="ul"
        ref={ref}
        className="border"
        steps={steps}
        currentStep={0}
      />,
    );

    expect(getByRole("list").tagName).toBe("UL");
    expect(getByRole("list").className).toContain("border");
    expect(ref.current).toBe(getByRole("list"));
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const markup = renderToServerString(
      <Stepper steps={steps} currentStep={1} label="Checkout" />,
    );

    expect(markup).toContain("Checkout");
    expect(markup).toContain('aria-current="step"');
    expectHydrationClean(<Stepper steps={steps} currentStep={1} />);
  });
});
