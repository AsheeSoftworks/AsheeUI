/**
 * Behaviour tests for the CTA pattern.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../../test";
import { CTA } from "./CTA";

describe("CTA", () => {
  it("renders a named section landmark with its headline and description", () => {
    const { getByRole, getByText } = renderWithProvider(
      <CTA title="Send your first campaign" description="No card required." />,
    );

    // A band is a section of a page rather than the page's own title, so its
    // headline is a level two heading and the band names itself with it.
    expect(
      getByRole("heading", { level: 2, name: "Send your first campaign" })
        .tagName,
    ).toBe("H2");
    expect(
      getByRole("region", { name: "Send your first campaign" }).tagName,
    ).toBe("SECTION");
    expect(getByText("No card required.")).toBeDefined();
  });

  it("can raise its headline when the band is the page's only heading", () => {
    const { getByRole } = renderWithProvider(
      <CTA title="Send your first campaign" titleAs="h1" />,
    );

    expect(
      getByRole("heading", { level: 1, name: "Send your first campaign" })
        .tagName,
    ).toBe("H1");
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
