/**
 * Behaviour tests for the Testimonials pattern.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../../test";
import { Testimonials } from "./Testimonials";

const QUOTES = [
  {
    quote: "We cut campaign setup from hours to minutes.",
    name: "Ama Boateng",
    role: "Head of Growth, Kora Retail",
  },
  { quote: "The reporting is what sold us.", name: "Luis Ortega" },
];

describe("Testimonials", () => {
  it("renders each quote as a figure with its attribution", () => {
    const { container } = renderWithProvider(
      <Testimonials title="Teams send more" items={QUOTES} />,
    );
    const figures = container.querySelectorAll("figure");

    expect(figures).toHaveLength(2);
    expect(figures[0]?.querySelector("figcaption")?.textContent).toContain(
      "Ama Boateng",
    );
    expect(container.querySelector("blockquote")?.textContent).toContain(
      "hours to minutes",
    );
  });

  it("announces each person once, through the caption rather than the picture", () => {
    // The avatar carries a role="img" and a label, and the caption prints the
    // same name: naming both would read the person twice. The picture is
    // decoration instead, while the initials still derive from the name.
    const { container, getByText, queryByRole } = renderWithProvider(
      <Testimonials
        items={[{ quote: "Fast.", name: "Ama Boateng", avatarSrc: "/ama.png" }]}
      />,
    );

    expect(queryByRole("img")).toBeNull();
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "/ama.png",
    );
    expect(getByText("Ama Boateng")).toBeDefined();
    // The avatar keeps its initials fallback; it is hidden from assistive
    // technology rather than deleted from the markup.
    expect(
      container.querySelector('[role="img"]')?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("names the band with its heading, so the section is a region", () => {
    const { getByRole } = renderWithProvider(
      <Testimonials title="Teams send more" items={QUOTES} />,
    );

    expect(getByRole("region", { name: "Teams send more" }).tagName).toBe(
      "SECTION",
    );
  });

  it("leaves the band unnamed when it has no heading to be named by", () => {
    const { container } = renderWithProvider(<Testimonials items={QUOTES} />);

    expect(
      container.querySelector("section")?.hasAttribute("aria-labelledby"),
    ).toBe(false);
  });

  it("takes the heading's level and size from its props", () => {
    const { getByRole } = renderWithProvider(
      <Testimonials
        title="Teams send more"
        items={QUOTES}
        titleAs="h3"
        headingSize="lg"
      />,
    );
    const heading = getByRole("heading", { level: 3, name: "Teams send more" });

    expect(heading.tagName).toBe("H3");
    expect(heading.className).toContain("text-2xl");
  });

  it("renders an attribution without a role", () => {
    const { getByText } = renderWithProvider(
      <Testimonials items={[{ quote: "Fast.", name: "Luis Ortega" }]} />,
    );

    expect(getByText("Luis Ortega")).toBeDefined();
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(
      <Testimonials title="Heading" items={QUOTES} />,
      {
        config: makeComponentConfig("testimonials", {
          columnsLg: 2,
          align: "start",
        }),
      },
    );

    expect((container.querySelector("ul") as HTMLElement).className).toContain(
      "lg:grid-cols-2",
    );
    // The heading block is the only part alignment applies to, so an inverted
    // alignment would show up on its wrapper.
    expect(
      (container.querySelector("h2") as HTMLElement).parentElement?.className,
    ).not.toContain("items-center");
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <Testimonials title="Teams send more" items={QUOTES} />,
    );

    expect(html).toContain("<figure");
    expect(html).toContain("<blockquote");
    expectHydrationClean(
      <Testimonials title="Teams send more" items={QUOTES} />,
    );
  });
});
