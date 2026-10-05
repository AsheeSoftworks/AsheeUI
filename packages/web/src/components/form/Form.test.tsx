import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectHydrationClean,
  fireEvent,
  makeComponentConfig,
  renderWithProvider,
} from "../../test";
import { Form } from "./Form";

describe("Form", () => {
  it("preserves the native form contract", () => {
    const { container } = renderWithProvider(
      <Form
        id="invoice-form"
        action="/invoices"
        method="post"
        noValidate
        aria-label="Invoice details">
        <input name="reference" />
      </Form>,
    );
    const form = container.querySelector("#invoice-form") as HTMLFormElement;

    expect(form.tagName).toBe("FORM");
    expect(form).toHaveAttribute("action", "/invoices");
    expect(form).toHaveAttribute("method", "post");
    expect(form).toHaveAttribute("novalidate");
  });

  it("reaches the native element through the forwarded ref", () => {
    const ref = createRef<HTMLFormElement>();

    renderWithProvider(
      <Form ref={ref} aria-label="Invoice details">
        <input name="reference" />
      </Form>,
    );

    expect(ref.current).toBeInstanceOf(HTMLFormElement);
    expect(ref.current?.tagName).toBe("FORM");
  });

  it("groups its fields under the legend", () => {
    const { getByRole } = renderWithProvider(
      <Form legend="Invoice details">
        <input name="reference" />
      </Form>,
    );

    expect(getByRole("group", { name: "Invoice details" })).toBeInTheDocument();
  });

  it("reports a submission through the native event", () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) =>
      event.preventDefault(),
    );
    const { container } = renderWithProvider(
      <Form onSubmit={onSubmit} aria-label="Invoice details">
        <input name="reference" />
      </Form>,
    );
    const form = container.querySelector("form") as HTMLFormElement;

    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toHaveProperty("type", "submit");
  });

  it("submits from the control it renders", async () => {
    const user = createUser();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) =>
      event.preventDefault(),
    );
    const { getByRole } = renderWithProvider(
      <Form submitLabel="Save" onSubmit={onSubmit} aria-label="Invoice details">
        <input name="reference" />
      </Form>,
    );

    await user.click(getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows a pending submission on the submit control it renders", () => {
    const { getByRole } = renderWithProvider(
      <Form submitLabel="Save" isPending aria-label="Invoice details">
        <input name="reference" />
      </Form>,
    );
    const submit = getByRole("button", { name: /Save/ });

    expect(submit).toBeDisabled();
    expect(submit).toHaveAttribute("aria-busy", "true");
    expect(submit).toHaveAccessibleName(/Save/);
  });

  it("does not move focus when it renders or when a submission is rejected", () => {
    const { container } = renderWithProvider(
      <Form
        submitLabel="Save"
        onSubmit={(event) => event.preventDefault()}
        aria-label="Invoice details">
        <input name="reference" aria-label="Reference" />
      </Form>,
    );

    expect(document.activeElement).toBe(document.body);

    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    expect(document.activeElement).toBe(document.body);
  });

  it("resolves the submit control's tokens from configuration", () => {
    const { getByRole } = renderWithProvider(
      <Form submitLabel="Save" aria-label="Invoice details">
        <input name="reference" />
      </Form>,
      {
        config: makeComponentConfig("form", {
          submitColor: "danger",
          submitVariant: "bordered",
        }),
      },
    );

    expect(getByRole("button", { name: "Save" }).className).toContain("danger");
  });

  it("appends consumer classes to the form element", () => {
    const { container } = renderWithProvider(
      <Form className="flex flex-col gap-4" aria-label="Invoice details">
        <input name="reference" />
      </Form>,
    );

    expect(container.querySelector("form")?.className).toContain(
      "flex flex-col gap-4",
    );
  });

  it("hydrates its server markup without a mismatch", () => {
    expectHydrationClean(
      <Form legend="Invoice details" submitLabel="Save" action="/invoices">
        <input name="reference" />
      </Form>,
    );
  });
});
