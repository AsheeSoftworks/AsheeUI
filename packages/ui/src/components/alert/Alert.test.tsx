import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectHydrationClean,
  makeComponentConfig,
  renderWithProvider,
  within,
} from "../../test";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders its title and message", () => {
    const { getByText } = renderWithProvider(
      <Alert title="Payment failed">
        The card was declined.
      </Alert>,
    );

    expect(getByText("Payment failed")).toBeInTheDocument();
    expect(getByText("The card was declined.")).toBeInTheDocument();
  });

  it("announces an error urgently and an informational message politely", () => {
    const error = renderWithProvider(
      <Alert type="error" title="Failed">
        Declined
      </Alert>,
    );
    const info = renderWithProvider(
      <Alert type="info" title="Update">
        A new version is available.
      </Alert>,
    );

    expect(within(error.container).getByRole("alert")).toBeInTheDocument();
    expect(within(info.container).getByRole("status")).toBeInTheDocument();
  });

  it("lets the consumer override the announcement role", () => {
    const { container } = renderWithProvider(
      <Alert type="error" role="status">
        Declined
      </Alert>,
    );

    expect(within(container).getByRole("status")).toBeInTheDocument();
    expect(within(container).queryByRole("alert")).toBeNull();
  });

  it("does not take focus and adds no focusable control of its own", () => {
    const { container } = renderWithProvider(
      <Alert title="Note">Something to read.</Alert>,
    );
    const alert = within(container).getByRole("status");

    expect(alert).not.toHaveFocus();
    expect(document.activeElement).toBe(document.body);
    expect(alert.querySelector("button")).toBeNull();
  });

  it("offers a labelled dismiss control only when it is closable", async () => {
    const user = createUser();
    const onClose = vi.fn();
    const closable = renderWithProvider(
      <Alert isClosable onClose={onClose} title="Update">
        A new version is available.
      </Alert>,
    );
    const plain = renderWithProvider(<Alert title="Update">Read only</Alert>);

    const dismiss = within(closable.container).getByRole("button", {
      name: "Dismiss alert",
    });

    expect(within(plain.container).queryByRole("button")).toBeNull();

    await user.click(dismiss);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("takes the dismiss control's name from the consumer", () => {
    const { getByRole } = renderWithProvider(
      <Alert isClosable onClose={() => {}} closeLabel="Dismiss update notice">
        A new version is available.
      </Alert>,
    );

    expect(
      getByRole("button", { name: "Dismiss update notice" }),
    ).toBeInTheDocument();
  });

  it("resolves the configured intent and honours a prop override", () => {
    const configured = renderWithProvider(<Alert>Body</Alert>, {
      config: makeComponentConfig("alert", { type: "warning" }),
    });
    const overridden = renderWithProvider(<Alert type="success">Body</Alert>, {
      config: makeComponentConfig("alert", { type: "warning" }),
    });

    expect(within(configured.container).getByRole("alert")).toBeInTheDocument();
    expect(within(overridden.container).getByRole("status")).toBeInTheDocument();
  });

  it("uses the registered radius and honours a radius override", () => {
    const { container } = renderWithProvider(
      <>
        <Alert id="default-radius">Body</Alert>
        <Alert id="square" radius="none">
          Body
        </Alert>
      </>,
    );

    expect(container.querySelector("#default-radius")?.className).toContain(
      "rounded-md",
    );
    expect(container.querySelector("#square")?.className).toContain(
      "rounded-none",
    );
  });

  it("hydrates its server markup without a mismatch", () => {
    expectHydrationClean(
      <Alert type="error" title="Payment failed">
        The card was declined.
      </Alert>,
    );
    expectHydrationClean(
      <Alert isClosable onClose={() => {}} title="Update">
        A new version is available.
      </Alert>,
    );
  });
});
