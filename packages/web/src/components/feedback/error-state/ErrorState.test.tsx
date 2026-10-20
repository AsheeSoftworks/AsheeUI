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
  makeConfig,
  renderToServerString,
  renderWithProvider,
  userEvent,
} from "../../../test";
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

  it("stays silent under a configured empty-state announcement", () => {
    // A failure stated as `none` is a deliberate silence, so it must not inherit a
    // `components.emptystate.role` the empty presentation would resolve.
    const { queryByRole, getByText } = renderWithProvider(
      <ErrorState title="Page not found" role="none" />,
      {
        config: makeConfig({
          components: { emptystate: { role: "status" } },
        }),
      },
    );

    expect(queryByRole("status")).toBeNull();
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

  it("keeps the configured actions ahead of the retry, in the documented order", () => {
    const { getAllByRole } = renderWithProvider(
      <ErrorState
        title="Failed"
        primaryAction={{ label: "Go to invoices" }}
        secondaryAction={{ label: "Read the docs" }}
        onRetry={() => undefined}
      />,
    );

    // The configured pair is the consumer's statement of where the reader can go
    // and leads the row; the retry is the framework's recovery path and follows.
    // When nothing is configured, the retry is the only control and therefore first.
    const names = getAllByRole("button").map((button) => button.textContent);

    expect(names).toEqual(["Go to invoices", "Read the docs", "Try again"]);
  });

  it("takes a node as its retry label, so the control can carry an icon", () => {
    const { getByRole } = renderWithProvider(
      <ErrorState
        title="Failed"
        onRetry={() => undefined}
        retryLabel={
          <>
            <span aria-hidden="true">↻</span> Reload invoices
          </>
        }
      />,
    );

    expect(
      getByRole("button", { name: /Reload invoices/ }),
    ).toBeInTheDocument();
  });

  it("takes a node as its disclosure label", () => {
    const { getByText } = renderWithProvider(
      <ErrorState
        title="Failed"
        detail="detail"
        detailLabel={<em>What went wrong</em>}
      />,
    );

    expect(getByText("What went wrong").tagName).toBe("EM");
  });

  it("renders its title at the outline level it is asked for", () => {
    const first = renderWithProvider(<ErrorState title="Failed" />);

    expect(first.getByText("Failed").tagName).toBe("H2");
    first.unmount();

    const nested = renderWithProvider(
      <ErrorState title="Failed" titleAs="h4" />,
    );

    expect(nested.getByText("Failed").tagName).toBe("H4");
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
