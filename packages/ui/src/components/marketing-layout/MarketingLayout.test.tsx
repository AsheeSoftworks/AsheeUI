/**
 * Behaviour tests for the marketing page composition.
 *
 * The tests state what the composition promises: the regions appear in the order
 * a page reads, the sections are inside a main landmark, a skip link leads to
 * that landmark and is the first focusable element, and every option resolves
 * through the configuration cascade.
 */

import { createRef } from "react";
import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { MarketingLayout } from "./MarketingLayout";

describe("MarketingLayout", () => {
  it("places navigation, the main region and the footer in reading order", () => {
    const { container } = renderWithProvider(
      <MarketingLayout
        navigation={<header>Navigation</header>}
        footer={<footer>Footer</footer>}>
        <section>Hero</section>
      </MarketingLayout>,
    );
    const regions = Array.from(
      (container.firstElementChild as HTMLElement).children,
    ) as HTMLElement[];

    // The skip link is the first child, so it is the first thing Tab reaches.
    expect(regions[0].tagName).toBe("A");
    expect(regions[1].textContent).toBe("Navigation");
    expect(regions[2].tagName).toBe("MAIN");
    expect(regions[3].textContent).toBe("Footer");
  });

  it("puts the sections inside the main landmark", () => {
    const { getByRole } = renderWithProvider(
      <MarketingLayout>
        <section>Hero</section>
        <section>Features</section>
      </MarketingLayout>,
    );
    const main = getByRole("main");

    expect(main.textContent).toBe("HeroFeatures");
    // The landmark is focusable, so following the skip link moves the reader
    // into the content rather than only scrolling to it.
    expect(main).toHaveAttribute("tabindex", "-1");
  });

  it("leads to the main region with a skip link", () => {
    const { getByRole } = renderWithProvider(
      <MarketingLayout>Content</MarketingLayout>,
    );
    const link = getByRole("link", { name: "Skip to content" });

    expect(link).toHaveAttribute("href", "#main-content");
    expect(getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("names the main region after the consumer's identifier", () => {
    const { getByRole } = renderWithProvider(
      <MarketingLayout mainId="landing">Content</MarketingLayout>,
    );

    expect(getByRole("main")).toHaveAttribute("id", "landing");
    expect(getByRole("link")).toHaveAttribute("href", "#landing");
  });

  it("leaves the skip link out when it is turned off", () => {
    const { queryByRole, getByRole } = renderWithProvider(
      <MarketingLayout skipLink={false}>Content</MarketingLayout>,
    );

    expect(queryByRole("link")).toBeNull();
    expect(getByRole("main")).toBeTruthy();
  });

  it("takes its wording, its skip link and its background from configuration", () => {
    const { getByRole, container } = renderWithProvider(
      <MarketingLayout>Content</MarketingLayout>,
      {
        config: makeComponentConfig("marketinglayout", {
          skipLinkLabel: "Skip to the offer",
          background: "muted",
        }),
      },
    );

    expect(getByRole("link", { name: "Skip to the offer" })).toBeTruthy();
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "bg-secondary/40",
    );
  });

  it("lets an instance prop win over the configured value", () => {
    const { queryByRole } = renderWithProvider(
      <MarketingLayout skipLink={false}>Content</MarketingLayout>,
      { config: makeComponentConfig("marketinglayout", { skipLink: true }) },
    );

    expect(queryByRole("link")).toBeNull();
  });

  it("renders the element it is asked for and forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderWithProvider(
      <MarketingLayout as="article" ref={ref}>
        Content
      </MarketingLayout>,
    );

    expect(container.firstElementChild?.tagName).toBe("ARTICLE");
    expect(ref.current).toBe(container.firstElementChild);
  });

  it("carries the consumer's class last, so it wins", () => {
    const { container } = renderWithProvider(
      <MarketingLayout className="bg-primary">Content</MarketingLayout>,
    );

    expect((container.firstElementChild as HTMLElement).className).toContain(
      "bg-primary",
    );
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const markup = renderToServerString(
      <MarketingLayout navigation={<header>Nav</header>}>
        <section>Hero</section>
      </MarketingLayout>,
    );

    expect(markup).toContain("Skip to content");
    expect(markup).toContain("<main");
    expectHydrationClean(
      <MarketingLayout>
        <section>Hero</section>
      </MarketingLayout>,
    );
  });
});
