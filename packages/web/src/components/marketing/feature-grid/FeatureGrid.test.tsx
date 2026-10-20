/**
 * Behaviour tests for the FeatureGrid pattern.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../../test";
import { FeatureGrid } from "./FeatureGrid";

const ITEMS = [
  { title: "Templates", description: "Reusable messages." },
  { title: "Scheduling", description: "Send at the right time." },
  { title: "Reporting", description: "See what landed." },
];

describe("FeatureGrid", () => {
  it("renders one card per feature inside a list", () => {
    const { container, getByRole } = renderWithProvider(
      <FeatureGrid title="Everything the campaign needs" items={ITEMS} />,
    );

    expect(container.querySelectorAll("ul > li")).toHaveLength(3);
    expect(getByRole("heading", { level: 3, name: "Templates" })).toBeDefined();
    expect(
      getByRole("heading", { level: 2, name: "Everything the campaign needs" }),
    ).toBeDefined();
  });

  it("names the band with its heading, so the section is a region", () => {
    const { getByRole } = renderWithProvider(
      <FeatureGrid title="Everything the campaign needs" items={ITEMS} />,
    );

    expect(
      getByRole("region", { name: "Everything the campaign needs" }).tagName,
    ).toBe("SECTION");
  });

  it("leaves the band unnamed when it has no heading to be named by", () => {
    const { container } = renderWithProvider(<FeatureGrid items={ITEMS} />);

    expect(
      container.querySelector("section")?.hasAttribute("aria-labelledby"),
    ).toBe(false);
  });

  it("takes the heading's level and size from its props", () => {
    const { getByRole } = renderWithProvider(
      <FeatureGrid
        title="Everything the campaign needs"
        items={ITEMS}
        titleAs="h3"
        headingSize="xl"
      />,
    );
    const heading = getByRole("heading", {
      level: 3,
      name: "Everything the campaign needs",
    });

    expect(heading.tagName).toBe("H3");
    expect(heading.className).toContain("text-3xl");
  });

  it("states its column count per breakpoint and takes it from props", () => {
    const { container } = renderWithProvider(
      <FeatureGrid items={ITEMS} columns={1} columnsMd={2} columnsLg={4} />,
    );
    const grid = container.querySelector("ul") as HTMLElement;

    expect(grid.className).toContain("md:grid-cols-2");
    expect(grid.className).toContain("lg:grid-cols-4");
  });

  it("makes a feature a link when it has a destination, through the substitution", () => {
    const RouterLink = ({ href, ...rest }: { href?: string }) => (
      <a data-router="true" href={href} {...rest} />
    );

    const { getByRole } = renderWithProvider(
      <FeatureGrid
        items={[{ title: "Templates", href: "/templates" }]}
        link={{ component: RouterLink }}
      />,
    );
    const link = getByRole("link", { name: /Templates/ });

    expect(link.getAttribute("data-router")).toBe("true");
    expect(link.getAttribute("href")).toBe("/templates");
  });

  it("renders no link when no feature has a destination", () => {
    const { queryByRole } = renderWithProvider(
      <FeatureGrid items={[{ title: "Templates" }]} />,
    );

    expect(queryByRole("link")).toBeNull();
  });

  it("lets a router name the destination with mapProps", () => {
    // A router that calls its destination `to` cannot use the default `href`
    // injection, and the adapter belongs with the consumer that knows the router.
    const RouterLink = ({ to, ...rest }: { to?: string }) => (
      <a data-router="true" href={to} {...rest} />
    );

    const { getByRole } = renderWithProvider(
      <FeatureGrid
        items={[
          { title: "Templates", href: "/templates" },
          { title: "Reporting", href: "/reporting" },
        ]}
        link={{
          component: RouterLink,
          mapProps: (item) => ({ to: item.href }),
        }}
      />,
    );
    const link = getByRole("link", { name: /Templates/ });

    expect(link.getAttribute("data-router")).toBe("true");
    expect(link.getAttribute("href")).toBe("/templates");
    expect(link.hasAttribute("to")).toBe(false);
  });

  it("merges the link's own classes into each card's classes", () => {
    // `link.props` is documented as additional props, so a class there is
    // additive rather than a replacement for the card's surface.
    const { getByRole } = renderWithProvider(
      <FeatureGrid
        items={[{ title: "Templates", href: "/templates" }]}
        link={{ props: { className: "feature-link" } }}
      />,
    );
    const link = getByRole("link", { name: /Templates/ });

    expect(link.className).toContain("feature-link");
    expect(link.className).toContain("border-border");
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(
      <FeatureGrid items={ITEMS} title="Heading" />,
      {
        config: makeComponentConfig("featuregrid", {
          columnsLg: 2,
          align: "start",
          gap: "sm",
        }),
      },
    );

    expect((container.querySelector("ul") as HTMLElement).className).toContain(
      "lg:grid-cols-2",
    );
    expect(container.querySelector(".items-center")).toBeNull();
    expect((container.querySelector("ul") as HTMLElement).className).toContain(
      "gap-2",
    );
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <FeatureGrid title="Everything" items={ITEMS} />,
    );

    expect(html).toContain("Templates");
    expect(html).toContain("<li");
    expectHydrationClean(<FeatureGrid title="Everything" items={ITEMS} />);
  });
});
