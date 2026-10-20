import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectDescribedBy,
  makeComponentConfig,
  renderWithProvider,
} from "../../../test";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("associates its label and accepts multi-line typing", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByLabelText } = renderWithProvider(
      <Textarea label="Notes" onChange={onChange} />,
    );
    const textarea = getByLabelText("Notes") as HTMLTextAreaElement;

    await user.type(textarea, "first line");

    expect(textarea.value).toBe("first line");
    expect(onChange).toHaveBeenCalled();
  });

  it("uses the documented number of visible rows", () => {
    const { getByLabelText } = renderWithProvider(<Textarea label="Notes" />);

    expect(getByLabelText("Notes")).toHaveAttribute("rows", "4");
  });

  it("honours an explicit rows value", () => {
    const { getByLabelText } = renderWithProvider(
      <Textarea label="Notes" rows={8} />,
    );

    expect(getByLabelText("Notes")).toHaveAttribute("rows", "8");
  });

  it("links its description and error message and marks the field invalid", () => {
    const { getByLabelText, getByText } = renderWithProvider(
      <Textarea
        label="Notes"
        description="Optional"
        message="Too long"
        status="error"
      />,
    );
    const textarea = getByLabelText("Notes");

    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expectDescribedBy(textarea, getByText("Optional"));
    expectDescribedBy(textarea, getByText("Too long"));
  });

  it("is disabled and rejects typing", async () => {
    const user = createUser();
    const { getByLabelText } = renderWithProvider(
      <Textarea label="Notes" disabled />,
    );
    const textarea = getByLabelText("Notes") as HTMLTextAreaElement;

    expect(textarea).toBeDisabled();

    await user.type(textarea, "hello");

    expect(textarea.value).toBe("");
  });

  it("forwards native textarea attributes", () => {
    const { getByLabelText } = renderWithProvider(
      <Textarea label="Notes" name="notes" placeholder="Write here" />,
    );
    const textarea = getByLabelText("Notes");

    expect(textarea).toHaveAttribute("name", "notes");
    expect(textarea).toHaveAttribute("placeholder", "Write here");
  });

  // The box and the single-line field are the same field family, so they round
  // the same way: `full` is a pill in both rather than a value one of them
  // silently rewrites.
  it("honours a full radius, as the Input does", () => {
    const { getByLabelText } = renderWithProvider(
      <Textarea label="Notes" radius="full" />,
    );
    const textarea = getByLabelText("Notes");

    expect(textarea.className).toContain("rounded-full");
    expect(textarea.className).not.toContain("rounded-xl");
  });

  it("fills its column by default and sizes to its content when told not to", () => {
    const full = renderWithProvider(<Textarea label="Notes" />);

    expect(full.container.firstElementChild).toHaveClass("w-full");
    full.unmount();

    const inline = renderWithProvider(
      <Textarea label="Notes" fullWidth={false} />,
    );

    expect(inline.container.firstElementChild).toHaveClass("inline-block");
    expect(inline.container.firstElementChild).not.toHaveClass("w-full");
  });

  it("takes its width from configuration", () => {
    const { container } = renderWithProvider(<Textarea label="Notes" />, {
      config: makeComponentConfig("textarea", { fullWidth: false }),
    });

    expect(container.firstElementChild).toHaveClass("inline-block");
  });
});
