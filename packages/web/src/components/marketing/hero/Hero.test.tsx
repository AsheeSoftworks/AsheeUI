/**
 * Behaviour tests for the Hero pattern.
 */

import { describe, expect, it } from "vitest";
import {
  expectAccessibleName,
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../../test";
import { CTA } from "../cta/CTA";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the eyebrow, headline and description", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Hero
        eyebrow="Everything in one place"
        title="Run your campaigns here"
        description="Messages, templates and results."
      />,
    );

    expectAccessibleName(
      getByRole("heading", { level: 2 }),
      "Run your campaigns here",
    );
    expect(getByText("Everything in one place")).toBeDefined();
    expect(getByText("Messages, templates and results.")).toBeDefined();
  });

  it("is a named region, so a reader navigating by region hears the headline", () => {
    const { getByRole } = renderWithProvider(
      <Hero title="Run your campaigns here" />,
    );

    expect(
      getByRole("region", { name: "Run your campaigns here" }).tagName,
    ).toBe("SECTION");
  });

  it("can raise its headline when the hero is the page's own title", () => {
    const { getByRole } = renderWithProvider(
      <Hero title="Run your campaigns here" titleAs="h1" />,
    );

    expect(
      getByRole("heading", { level: 1, name: "Run your campaigns here" })
        .tagName,
    ).toBe("H1");
  });

  it("keeps one h1 on a page composed of a hero and a call to action", () => {
    // The docs' own marketing exemplar composes the two, which is what made the
    // two level-one headings reachable in the first place.
    const { container, getByRole } = renderWithProvider(
      <>
        <Hero title="Run your campaigns here" />
        <CTA title="Send your first campaign" />
      </>,
    );

    expect(
      getByRole("heading", { level: 2, name: "Run your campaigns here" }),
    ).toBeDefined();
    expect(
      getByRole("heading", { level: 2, name: "Send your first campaign" }),
    ).toBeDefined();
    expect(container.querySelectorAll("h1")).toHaveLength(0);
  });

  it("leaves its text column as wide as the container asks when it has no media", () => {
    // A measure on the column capped the headline and the action row too, which
    // made `containerSize` unobservable. The description keeps its own measure.
    const { container, getByText } = renderWithProvider(
      <Hero
        title="Headline"
        description="Supporting sentence."
        containerSize="xl"
      />,
    );
    const description = getByText("Supporting sentence.");
    const column = description.parentElement?.parentElement as HTMLElement;

    expect(container.querySelector(".max-w-7xl")).not.toBeNull();
    expect(column.className).not.toContain("max-w-2xl");
    expect(description.className).toContain("max-w-2xl");
  });

  it("renders configured actions through the framework Button", () => {
    const { getByRole } = renderWithProvider(
      <Hero
        title="Headline"
        primaryAction={{ label: "Start free", href: "/signup" }}
        secondaryAction={{ label: "Book a demo", href: "/demo" }}
      />,
    );

    expect(getByRole("link", { name: "Start free" }).getAttribute("href")).toBe(
      "/signup",
    );
    expect(getByRole("link", { name: "Book a demo" })).toBeDefined();
  });

  it("places media beside the text and can put it first", () => {
    const { container } = renderWithProvider(
      <Hero title="Headline" media={<span>Shot</span>} mediaPosition="start" />,
    );

    expect(container.querySelector(".lg\\:grid-cols-2")).not.toBeNull();
    expect(container.querySelector(".lg\\:order-first")).not.toBeNull();
  });

  it("does not add a media column when there is no media", () => {
    const { container } = renderWithProvider(<Hero title="Headline" />);

    expect(container.querySelector(".lg\\:order-first")).toBeNull();
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<Hero title="Headline" />, {
      config: makeComponentConfig("hero", {
        align: "center",
        background: "muted",
        spacing: "sm",
      }),
    });
    const section = container.querySelector("section") as HTMLElement;

    expect(section.className).toContain("py-6");
    expect(section.className).toContain("bg-secondary/50");
    expect(container.querySelector(".items-center")).not.toBeNull();
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <Hero
        title="Headline"
        description="Supporting sentence."
        primaryAction={{ label: "Start free", href: "/signup" }}
      />,
    );

    expect(html).toContain("Headline");
    expect(html).toContain('href="/signup"');
    expectHydrationClean(<Hero title="Headline" />);
  });
});
