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
} from "../../test";
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
      getByRole("heading", { level: 1 }),
      "Run your campaigns here",
    );
    expect(getByText("Everything in one place")).toBeDefined();
    expect(getByText("Messages, templates and results.")).toBeDefined();
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
