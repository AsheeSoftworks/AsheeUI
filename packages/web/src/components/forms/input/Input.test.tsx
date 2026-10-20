import { getComponentDefaults, registerComponentDefaults } from "@asheeui/core";
import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectDescribedBy,
  makeComponentConfig,
  renderWithProvider,
} from "../../../test";
import { Input } from "./Input";
import { defaultInputConfig } from "./input-config";

describe("Input", () => {
  it("associates its label and accepts typing", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" onChange={onChange} />,
    );
    const input = getByLabelText("Email") as HTMLInputElement;

    await user.type(input, "hello");

    expect(input.value).toBe("hello");
    expect(onChange).toHaveBeenCalled();
  });

  it("forwards native input attributes", () => {
    const { getByLabelText } = renderWithProvider(
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="you@example.com"
      />,
    );
    const input = getByLabelText("Email");

    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("placeholder", "you@example.com");
  });

  it("links its description and error message and marks the field invalid", () => {
    const { getByLabelText, getByText } = renderWithProvider(
      <Input
        label="Email"
        description="We never share it"
        message="Enter a valid address"
        status="error"
      />,
    );
    const input = getByLabelText("Email");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expectDescribedBy(input, getByText("We never share it"));
    expectDescribedBy(input, getByText("Enter a valid address"));
  });

  it("does not mark a non-error status as invalid", () => {
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" message="Looks good" status="success" />,
    );

    expect(getByLabelText("Email")).toHaveAttribute("aria-invalid", "false");
  });

  it("is disabled and rejects typing", async () => {
    const user = createUser();
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" disabled />,
    );
    const input = getByLabelText("Email") as HTMLInputElement;

    expect(input).toBeDisabled();

    await user.type(input, "hello");

    expect(input.value).toBe("");
  });

  it("renders its start and end content", () => {
    const { getByText } = renderWithProvider(
      <Input
        label="Search"
        startContent={<span>start-slot</span>}
        endContent={<span>end-slot</span>}
      />,
    );

    expect(getByText("start-slot")).toBeInTheDocument();
    expect(getByText("end-slot")).toBeInTheDocument();
  });

  it("reports a change through the field contract's handler as well as the DOM's", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const onChangeText = vi.fn();
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" onChange={onChange} onChangeText={onChangeText} />,
    );
    const input = getByLabelText("Email") as HTMLInputElement;

    await user.type(input, "hi");

    expect(onChangeText).toHaveBeenLastCalledWith("hi");
    expect(onChange).toHaveBeenCalled();
  });

  it("reports through the contract's handler on its own, without a DOM handler", async () => {
    const user = createUser();
    const onChangeText = vi.fn();
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" onChangeText={onChangeText} />,
    );
    const input = getByLabelText("Email") as HTMLInputElement;

    await user.type(input, "a");

    expect(onChangeText).toHaveBeenLastCalledWith("a");
    expect(input.value).toBe("a");
  });

  it("does not leak the contract's handler onto the input element", () => {
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" onChangeText={() => {}} />,
    );

    expect(getByLabelText("Email")).not.toHaveAttribute("onChangeText");
  });

  it("marks a required field", () => {
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" required />,
    );

    expect(getByLabelText(/Email/)).toBeRequired();
  });

  it("honours a full radius, as the field family does", () => {
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" radius="full" />,
    );

    expect(getByLabelText("Email").className).toContain("rounded-full");
  });

  it("does not take its surface from the application's defaultVariant", () => {
    // The field family states its own surface: the registered `bordered` and the
    // family fallback answer, so a button-oriented global default never restyles a
    // control. Input passes `undefined` at the global tier for exactly this reason.
    const { getByLabelText } = renderWithProvider(<Input label="Email" />, {
      config: { defaultVariant: "solid" },
    });
    const input = getByLabelText("Email");

    expect(input.className).toContain("bg-transparent");
    expect(input.className).not.toContain("bg-primary ");
  });

  it("still takes a variant stated for the input itself", () => {
    const { getByLabelText } = renderWithProvider(<Input label="Email" />, {
      config: { components: { input: { variant: "solid" } } },
    });

    expect(getByLabelText("Email").className).toContain("bg-primary ");
  });

  it("keeps the family's surface when no registration states a variant", () => {
    // Pins the reason the global tier is `undefined` (F-191). A field still does
    // not read `defaultVariant` when the registered variant is absent, because the
    // family's fallback is the field's surface, not the application's control
    // treatment. The registry has no unregister API, so restore what was there.
    const registered = getComponentDefaults("input");
    registerComponentDefaults("input", {
      ...defaultInputConfig,
      variant: undefined,
    });

    try {
      const { getByLabelText } = renderWithProvider(<Input label="Email" />, {
        config: { defaultVariant: "solid" },
      });
      const input = getByLabelText("Email");

      expect(input.className).toContain("bg-transparent");
      expect(input.className).not.toContain("bg-primary ");
    } finally {
      if (registered) registerComponentDefaults("input", registered);
    }
  });

  it("fills its column by default and sizes to its content when told not to", () => {
    const full = renderWithProvider(<Input label="Email" />);

    expect(full.container.firstElementChild).toHaveClass("w-full");
    full.unmount();

    const inline = renderWithProvider(
      <Input label="Email" fullWidth={false} />,
    );

    expect(inline.container.firstElementChild).toHaveClass("inline-block");
    expect(inline.container.firstElementChild).not.toHaveClass("w-full");
  });

  it("takes its width from configuration", () => {
    const { container } = renderWithProvider(<Input label="Email" />, {
      config: makeComponentConfig("input", { fullWidth: false }),
    });

    expect(container.firstElementChild).toHaveClass("inline-block");
  });
});
