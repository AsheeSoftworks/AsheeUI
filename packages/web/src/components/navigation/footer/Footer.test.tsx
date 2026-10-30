/**
 * Behaviour tests for the Footer pattern.
 */

import { describe, expect, it } from "vitest";
import { FOOTER_BOTTOM_LINKS_CLASS } from "../../../styles/footer";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../../test";
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

  // The legal row's layout is the footer's own row class. The literal it used to carry
  // duplicated that constant verbatim, so the two could drift apart silently.
  it("lays the legal row out with the footer's own row class", () => {
    const { getByRole } = renderWithProvider(
      <Footer legal={[{ label: "Privacy", href: "/privacy" }]} />,
    );
    const nav = getByRole("navigation", { name: "Legal" });
    const list = nav.querySelector("ul") as HTMLElement;

    expect(list.className).toBe(FOOTER_BOTTOM_LINKS_CLASS);
  });

  // A landmark's name is consumer-facing text: "Legal" and "Social" are the defaults a
  // consumer gets, not names it is stuck with.
  it("takes the legal and social landmark names from props", () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <Footer
        legal={[{ label: "Privacidad", href: "/privacidad" }]}
        social={[{ label: "Mastodon", href: "https://example.social/@ashee" }]}
        legalLabel="Aviso legal"
        socialLabel="Redes sociales"
      />,
    );

    expect(getByRole("navigation", { name: "Aviso legal" })).toBeDefined();
    expect(getByRole("navigation", { name: "Redes sociales" })).toBeDefined();
    expect(queryByRole("navigation", { name: "Legal" })).toBeNull();
    expect(queryByRole("navigation", { name: "Social" })).toBeNull();
  });

  it("forwards the native title attribute like every other element attribute", () => {
    const { getByRole } = renderWithProvider(
      <Footer copyright="Ashee" title="Site footer" />,
    );

    expect(getByRole("contentinfo").getAttribute("title")).toBe("Site footer");
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
