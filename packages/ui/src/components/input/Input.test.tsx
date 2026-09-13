import { describe, expect, it, vi } from "vitest";
import { createUser, expectDescribedBy, renderWithProvider } from "../../test";
import { Input } from "./Input";

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

  it("marks a required field", () => {
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" required />,
    );

    expect(getByLabelText(/Email/)).toBeRequired();
  });
});
