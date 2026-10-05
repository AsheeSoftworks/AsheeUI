import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectDescribedBy,
  expectState,
  pressKey,
  renderWithProvider,
} from "../../test";
import { Radio, RadioGroup } from ".";

/**
 * Controlled harness, which is the usage the component documents.
 */
function ControlledGroup({ onChange }: { onChange?: (value: string) => void }) {
  const [value, setValue] = useState("basic");

  return (
    <RadioGroup
      label="Plan"
      name="plan"
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}>
      <Radio value="basic" label="Basic" />
      <Radio value="pro" label="Pro" />
    </RadioGroup>
  );
}

describe("Radio", () => {
  it("exposes the group and its labelled radios", () => {
    const { getByRole, getByText } = renderWithProvider(<ControlledGroup />);

    expect(getByRole("radiogroup")).toBeInTheDocument();
    expect(getByText("Plan")).toBeInTheDocument();
    expect(getByRole("radio", { name: "Basic" })).toBeChecked();
    expect(getByRole("radio", { name: "Pro" })).not.toBeChecked();
  });

  it("selects on click and reports the new value", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <ControlledGroup onChange={onChange} />,
    );

    await user.click(getByRole("radio", { name: "Pro" }));

    expect(onChange).toHaveBeenCalledWith("pro");
    expect(getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(getByRole("radio", { name: "Basic" })).not.toBeChecked();
  });

  it("selects with the Space key", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<ControlledGroup />);
    const pro = getByRole("radio", { name: "Pro" });

    pro.focus();
    await pressKey(user, " ");

    expect(pro).toBeChecked();
  });

  it("does not select a disabled radio", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <RadioGroup label="Plan" name="plan">
        <Radio value="basic" label="Basic" />
        <Radio value="pro" label="Pro" disabled />
      </RadioGroup>,
    );
    const pro = getByRole("radio", { name: "Pro" });

    expectState(pro, { disabled: true });

    await user.click(pro);

    expect(pro).not.toBeChecked();
  });

  it("respects a controlled value", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <RadioGroup label="Plan" name="plan" value="basic" onChange={onChange}>
        <Radio value="basic" label="Basic" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>,
    );

    await user.click(getByRole("radio", { name: "Pro" }));

    expect(onChange).toHaveBeenCalledWith("pro");
    expect(getByRole("radio", { name: "Pro" })).not.toBeChecked();
    expect(getByRole("radio", { name: "Basic" })).toBeChecked();
  });

  // Defect register (M1, D-16): `defaultValue` is documented as the
  // uncontrolled initial value, and the group now keeps the selection itself.
  it("selects from an uncontrolled defaultValue without a controlled parent", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <RadioGroup
        label="Plan"
        name="plan"
        defaultValue="basic"
        onChange={onChange}>
        <Radio value="basic" label="Basic" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>,
    );

    expect(getByRole("radio", { name: "Basic" })).toBeChecked();

    await user.click(getByRole("radio", { name: "Pro" }));

    expect(onChange).toHaveBeenCalledWith("pro");
    expect(getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(getByRole("radio", { name: "Basic" })).not.toBeChecked();

    await user.click(getByRole("radio", { name: "Basic" }));

    expect(getByRole("radio", { name: "Basic" })).toBeChecked();
  });

  // Defect register (M1, D-15): the group label is rendered by `FieldShell` as a
  // `label` element, and the `radiogroup` container now references it.
  // Note also that arrow-key navigation between radios is not asserted here:
  // jsdom does not implement native radio group arrow navigation, which is a
  // DOM-emulator limitation rather than a framework behaviour (`TEST-031`).
  it("exposes the group label as the radiogroup accessible name", () => {
    const { getByRole, getByText } = renderWithProvider(
      <RadioGroup
        label="Plan"
        name="plan"
        description="Choose a plan"
        message="Required">
        <Radio value="basic" label="Basic" />
      </RadioGroup>,
    );
    const group = getByRole("radiogroup");

    expect(group).toHaveAccessibleName("Plan");
    expectDescribedBy(group, getByText("Choose a plan"));
    expectDescribedBy(group, getByText("Required"));
  });
});
