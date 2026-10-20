/**
 * Behaviour tests for the EmptyState pattern.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../../test";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders its title, description and action", () => {
    const { getByText, getByRole } = renderWithProvider(
      <EmptyState
        title="No campaigns match that filter"
        description="Try a different name."
        primaryAction={{ label: "Clear filters" }}
      />,
    );

    expect(getByText("No campaigns match that filter")).toBeDefined();
    expect(getByText("Try a different name.")).toBeDefined();
    expect(getByRole("button", { name: "Clear filters" })).toBeDefined();
  });

  it("keeps its live-region role off until it is asked for one", () => {
    const { container: silent } = renderWithProvider(
      <EmptyState title="Empty" />,
    );
    expect(silent.firstElementChild?.getAttribute("role")).toBeNull();

    const { container: live } = renderWithProvider(
      <EmptyState title="Failed" role="alert" />,
    );

    expect(live.firstElementChild?.getAttribute("role")).toBe("alert");
  });

  it("takes its announcement from configuration, the way ErrorState does", () => {
    const { container } = renderWithProvider(<EmptyState title="Empty" />, {
      config: makeComponentConfig("emptystate", { role: "status" }),
    });

    expect(container.firstElementChild?.getAttribute("role")).toBe("status");
  });

  it("lets an instance announcement win over the configured one", () => {
    const { container } = renderWithProvider(
      <EmptyState title="Empty" role="alert" />,
      { config: makeComponentConfig("emptystate", { role: "status" }) },
    );

    expect(container.firstElementChild?.getAttribute("role")).toBe("alert");
  });

  it("renders its title as an h2 by default and at the level it is asked for", () => {
    const first = renderWithProvider(<EmptyState title="Empty" />);

    expect(first.getByText("Empty").tagName).toBe("H2");
    first.unmount();

    const nested = renderWithProvider(
      <EmptyState title="Empty" titleAs="h4" />,
    );

    expect(nested.getByText("Empty").tagName).toBe("H4");
  });

  it("colours its icon badge by tone", () => {
    const { container } = renderWithProvider(
      <EmptyState title="Failed" type="error" icon={<span>!</span>} />,
    );

    expect(container.innerHTML).toContain("bg-danger/10");
  });

  it("draws a panel only when it is asked to", () => {
    const { container: plain } = renderWithProvider(
      <EmptyState title="Empty" />,
    );
    expect(plain.firstElementChild?.className).not.toContain("border-border");

    const { container: panel } = renderWithProvider(
      <EmptyState title="Empty" panel />,
    );

    expect(panel.firstElementChild?.className).toContain("border-border");
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(
      <EmptyState title="Empty" icon={<span>?</span>} />,
      {
        config: makeComponentConfig("emptystate", {
          type: "warning",
          size: "lg",
          panel: true,
        }),
      },
    );

    expect(container.innerHTML).toContain("bg-warning/10");
    expect(container.firstElementChild?.className).toContain("p-10");
    expect(container.firstElementChild?.className).toContain("border-border");
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <EmptyState title="Nothing here yet" role="status" />,
    );

    expect(html).toContain('role="status"');
    expect(html).toContain("Nothing here yet");
    expectHydrationClean(<EmptyState title="Nothing here yet" panel />);
  });
});
