/**
 * Behaviour tests for the Footer pattern.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { Footer } from "./Footer";

const GROUPS = [
  {
    title: "Product",
    links: [{ label: "Campaigns", href: "/campaigns" }],
  },
  {
    title: "Company",
    links: [{ label: "About", href: "/about" }],
  },
];

describe("Footer", () => {
  it("renders a contentinfo landmark with a named navigation per group", () => {
    const { getByRole } = renderWithProvider(<Footer groups={GROUPS} />);

    expect(getByRole("contentinfo")).toBeDefined();
    expect(getByRole("navigation", { name: "Product" })).toBeDefined();
    expect(getByRole("navigation", { name: "Company" })).toBeDefined();
  });

  it("renders the brand, the description and the copyright line", () => {
    const { getByText } = renderWithProvider(
      <Footer
        brand="Ashee SMS"
        description="Campaign messaging for growing teams."
        copyright="Ashee Softworks"
      />,
    );

    expect(getByText("Ashee SMS")).toBeDefined();
    expect(getByText("Campaign messaging for growing teams.")).toBeDefined();
    expect(getByText("Ashee Softworks")).toBeDefined();
  });

  it("renders the legal and social rows as named landmarks", () => {
    const { getByRole } = renderWithProvider(
      <Footer
        legal={[{ label: "Privacy", href: "/privacy" }]}
        social={[{ label: "Mastodon", href: "https://example.social/@ashee" }]}
      />,
    );

    expect(getByRole("navigation", { name: "Legal" })).toBeDefined();
    expect(getByRole("navigation", { name: "Social" })).toBeDefined();
  });

  it("renders an action area in the brand column", () => {
    const { getByText } = renderWithProvider(
      <Footer brand="Ashee SMS" newsletter={<span>Newsletter signup</span>} />,
    );

    expect(getByText("Newsletter signup")).toBeDefined();
  });

  it("renders nothing it was not given", () => {
    const { container } = renderWithProvider(<Footer copyright="Ashee" />);

    expect(container.querySelectorAll("nav")).toHaveLength(0);
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<Footer groups={GROUPS} />, {
      config: makeComponentConfig("footer", {
        variant: "muted",
        spacing: "sm",
        containerSize: "xl",
      }),
    });
    const footer = container.querySelector("footer") as HTMLElement;

    expect(footer.className).toContain("bg-secondary/50");
    expect(footer.className).toContain("py-6");
    expect(container.querySelector(".max-w-7xl")).not.toBeNull();
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <Footer brand="Ashee SMS" groups={GROUPS} copyright="Ashee Softworks" />,
    );

    expect(html).toContain("<footer");
    expect(html).toContain('aria-label="Product"');
    expectHydrationClean(<Footer brand="Ashee SMS" groups={GROUPS} />);
  });
});
