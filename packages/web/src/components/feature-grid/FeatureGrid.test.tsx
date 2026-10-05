/**
 * Behaviour tests for the FeatureGrid pattern.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
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
    expect(getByRole("heading", { level: 2 })).toBeDefined();
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
