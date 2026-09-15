/**
 * Behaviour tests for the CTA pattern.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { CTA } from "./CTA";

describe("CTA", () => {
  it("renders a section landmark with its headline and description", () => {
    const { getByRole, getByText } = renderWithProvider(
      <CTA title="Send your first campaign" description="No card required." />,
    );

    expect(
      getByRole("heading", { name: "Send your first campaign" }),
    ).toBeDefined();
    expect(getByText("No card required.")).toBeDefined();
  });

  it("panelises its content by default and can be told not to", () => {
    const { container: bordered } = renderWithProvider(<CTA title="Go" />);
    expect(bordered.querySelector(".border-border")).not.toBeNull();

    const { container: plain } = renderWithProvider(
      <CTA title="Go" panel="plain" />,
    );

    expect(plain.querySelector(".border-border")).toBeNull();
  });

  it("renders configured actions, and none when they are absent", () => {
    const { getByRole } = renderWithProvider(
      <CTA
        title="Go"
        primaryAction={{ label: "Create an account", href: "/signup" }}
      />,
    );
    expect(getByRole("link", { name: "Create an account" })).toBeDefined();
  });

  it("renders no control when it has no actions", () => {
    const { container, queryByRole } = renderWithProvider(<CTA title="Go" />);

    expect(queryByRole("link")).toBeNull();
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  it("centres its content by default", () => {
    const { container } = renderWithProvider(<CTA title="Go" />);

    expect(container.querySelector(".items-center")).not.toBeNull();
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<CTA title="Go" />, {
      config: makeComponentConfig("cta", {
        align: "start",
        panel: "muted",
        background: "tinted",
      }),
    });

    expect(container.querySelector(".items-center")).toBeNull();
    expect(container.querySelector(".bg-secondary\\/50")).not.toBeNull();
    expect(container.querySelector("section")?.className).toContain(
      "bg-primary/5",
    );
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(<CTA title="Send your first campaign" />);

    expect(html).toContain("Send your first campaign");
    expectHydrationClean(<CTA title="Send your first campaign" />);
  });
});
