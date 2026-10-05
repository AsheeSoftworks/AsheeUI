/**
 * Behaviour tests for the Testimonials pattern.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
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
    expect(figures[0].querySelector("figcaption")?.textContent).toContain(
      "Ama Boateng",
    );
    expect(container.querySelector("blockquote")?.textContent).toContain(
      "hours to minutes",
    );
  });

  it("gives every quote a picture through the framework Avatar", () => {
    const { container, getByRole } = renderWithProvider(
      <Testimonials
        items={[{ quote: "Fast.", name: "Ama Boateng", avatarSrc: "/ama.png" }]}
      />,
    );

    expect(getByRole("img", { name: "Ama Boateng" })).toBeDefined();
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "/ama.png",
    );
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
