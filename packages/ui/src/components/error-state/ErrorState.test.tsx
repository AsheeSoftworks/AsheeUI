/**
 * Behaviour tests for the failed-region presentation.
 *
 * The tests state the pattern's contract: what failed is announced, the reader
 * is offered a way to try again, the technical detail stays behind a disclosure,
 * and every option resolves through the configuration cascade.
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
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("announces the failure as an alert", () => {
    const { getByRole } = renderWithProvider(
      <ErrorState
        title="Invoices could not be loaded"
        description="The request timed out."
      />,
    );
    const alert = getByRole("alert");

    expect(alert).toHaveTextContent("Invoices could not be loaded");
    expect(alert).toHaveTextContent("The request timed out.");
  });

  it("stays silent when it is part of the page rather than a change to it", () => {
    const { queryByRole, getByText } = renderWithProvider(
      <ErrorState title="Page not found" role="none" />,
    );

    expect(queryByRole("alert")).toBeNull();
    expect(getByText("Page not found")).toBeTruthy();
  });

  it("offers a retry control that runs the handler", async () => {
    const onRetry = vi.fn();
    const { getByRole, queryByRole } = renderWithProvider(
      <ErrorState title="Failed" onRetry={onRetry} />,
    );
    const user = userEvent.setup();

    expect(queryByRole("button", { name: "Try again" })).toBeTruthy();
    await user.click(getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("offers no retry control when there is nothing to run", () => {
    const { queryByRole } = renderWithProvider(<ErrorState title="Failed" />);

    expect(queryByRole("button", { name: "Try again" })).toBeNull();
  });

  it("keeps the technical message behind a disclosure", () => {
    const { getByText, queryByText } = renderWithProvider(
      <ErrorState title="Failed" detail="ECONNRESET at 10.0.0.4" />,
    );

    const summary = getByText("Technical details");
    expect(summary.tagName).toBe("SUMMARY");
    expect(summary.closest("details")).toBeTruthy();
    expect(queryByText("ECONNRESET at 10.0.0.4")).toBeTruthy();
  });

  it("renders no disclosure when there is no detail", () => {
    const { queryByText } = renderWithProvider(<ErrorState title="Failed" />);

    expect(queryByText("Technical details")).toBeNull();
  });

  it("takes its wording, its density and its announcement from configuration", () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <ErrorState title="Failed" detail="detail" onRetry={() => undefined} />,
      {
        config: makeComponentConfig("errorstate", {
          retryLabel: "Reload",
          detailLabel: "What went wrong",
          role: "status",
          panel: false,
        }),
      },
    );

    expect(getByRole("button", { name: "Reload" })).toBeTruthy();
    expect(getByRole("status")).toHaveTextContent("Failed");
    expect(queryByRole("alert")).toBeNull();
    expect(getByRole("status").className).not.toContain("border-border");
  });

  it("lets an instance prop win over the configured value", () => {
    const { getByRole } = renderWithProvider(
      <ErrorState title="Failed" role="alert" />,
      { config: makeComponentConfig("errorstate", { role: "none" }) },
    );

    expect(getByRole("alert")).toBeTruthy();
  });

  it("renders the element it is asked for, carries the consumer's class and forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { container, getByRole } = renderWithProvider(
      <ErrorState
        as="section"
        ref={ref}
        className="bg-primary"
        title="Failed"
      />,
    );

    expect(container.firstElementChild?.tagName).toBe("SECTION");
    expect(getByRole("alert").className).toContain("bg-primary");
    expect(ref.current).toBe(container.firstElementChild);
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const markup = renderToServerString(
      <ErrorState title="Failed" detail="detail" onRetry={() => undefined} />,
    );

    expect(markup).toContain("Failed");
    expect(markup).toContain("Technical details");
    expectHydrationClean(<ErrorState title="Failed" />);
  });
});
