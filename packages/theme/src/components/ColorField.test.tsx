import { AsheeUIProvider } from "asheeui";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ColorField } from "./ColorField";

/** The field needs a provider for the configuration cascade. */
function renderField(ui: React.ReactElement) {
  return render(<AsheeUIProvider>{ui}</AsheeUIProvider>);
}

describe("ColorField", () => {
  it("shows the current colour in the input", () => {
    renderField(
      <ColorField label="Primary" value="#047857" onChange={() => {}} />,
    );

    expect(screen.getByLabelText("Primary")).toHaveValue("#047857");
  });

  it("normalises a valid value on blur", () => {
    const onChange = vi.fn();
    renderField(
      <ColorField label="Primary" value="#111111" onChange={onChange} />,
    );

    const input = screen.getByLabelText("Primary");
    fireEvent.change(input, { target: { value: "rgb(4, 120, 87)" } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith("#047857");
  });

  it("rejects a colour the device cannot apply", () => {
    const onChange = vi.fn();
    renderField(
      <ColorField label="Primary" value="#047857" onChange={onChange} />,
    );

    const input = screen.getByLabelText("Primary");
    fireEvent.change(input, { target: { value: "oklch(0.7 0.1 150)" } });
    fireEvent.blur(input);

    expect(screen.getByText(/Use a hex colour/i)).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders presets as pressable swatches", () => {
    renderField(
      <ColorField
        label="Primary"
        value="#047857"
        onChange={() => {}}
        presets={["#0ea5e9", "#8b5cf6"]}
      />,
    );

    expect(screen.getByLabelText("#0ea5e9")).toBeTruthy();
    expect(screen.getByLabelText("#8b5cf6")).toBeTruthy();
  });
});
