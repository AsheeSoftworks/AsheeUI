/**
 * Behaviour tests for the documentation composition.
 *
 * The tests state what the composition promises: a named navigation column, an
 * article the skip link leads to, an optional contents landmark, the regions
 * around them, and that every option resolves through the configuration cascade.
 */

import { createRef } from "react";
import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { DocsLayout } from "./DocsLayout";

describe("DocsLayout", () => {
  it("renders the navigation as a named landmark beside the article", () => {
    const { getByRole } = renderWithProvider(
      <DocsLayout navigation={<span>Sections</span>}>
        <p>Layout</p>
      </DocsLayout>,
    );

    expect(getByRole("complementary", { name: "Documentation" })).toBeTruthy();
    expect(getByRole("main")).toBeTruthy();
  });

  it("leads to the article with a skip link", () => {
    const { getByRole, container } = renderWithProvider(
      <DocsLayout navigation={<span>Sections</span>}>
        <p>Layout</p>
      </DocsLayout>,
    );
    const link = getByRole("link", { name: "Skip to content" });

    expect(link).toHaveAttribute("href", "#main-content");
    expect(getByRole("main")).toHaveAttribute("id", "main-content");
    expect((container.firstElementChild as HTMLElement).firstElementChild).toBe(
      link,
    );
  });

  it("names the article region after the consumer's identifier", () => {
    const { getByRole } = renderWithProvider(
      <DocsLayout navigation={<span>Sections</span>} mainId="article">
        <p>Layout</p>
      </DocsLayout>,
    );

    expect(getByRole("main")).toHaveAttribute("id", "article");
  });

  it("renders the contents in their own landmark when they are supplied", () => {
    const { getByRole } = renderWithProvider(
      <DocsLayout
        navigation={<span>Sections</span>}
        toc={<span>Getting started</span>}>
        <p>Layout</p>
      </DocsLayout>,
    );

    expect(getByRole("complementary", { name: "On this page" })).toBeTruthy();
  });

  it("renders no contents landmark when none is supplied", () => {
    const { queryByRole } = renderWithProvider(
      <DocsLayout navigation={<span>Sections</span>}>
        <p>Layout</p>
      </DocsLayout>,
    );

    expect(queryByRole("complementary", { name: "On this page" })).toBeNull();
  });

  it("keeps the contents out of the way on a narrow screen and in view on a wide one", () => {
    const { getByRole } = renderWithProvider(
      <DocsLayout
        navigation={<span>Sections</span>}
        toc={<span>Getting started</span>}>
        <p>Layout</p>
      </DocsLayout>,
    );
    const contents = getByRole("complementary", { name: "On this page" });

    expect(contents.className).toContain("hidden");
    expect(contents.className).toContain("xl:block");
    expect(contents.className).toContain("xl:sticky");
  });

  it("leaves the contents unstuck when stickiness is turned off", () => {
    const { getByRole } = renderWithProvider(
      <DocsLayout
        navigation={<span>Sections</span>}
        toc={<span>Getting started</span>}
        stickyToc={false}>
        <p>Layout</p>
      </DocsLayout>,
    );

    expect(
      getByRole("complementary", { name: "On this page" }).className,
    ).not.toContain("xl:sticky");
  });

  it("puts the header and the footer outside the columns", () => {
    const { getByRole } = renderWithProvider(
      <DocsLayout
        navigation={<span>Sections</span>}
        header={<header>Site</header>}
        footer={<footer>Legal</footer>}>
        <p>Layout</p>
      </DocsLayout>,
    );

    expect(getByRole("banner")).toBeTruthy();
    expect(getByRole("contentinfo")).toBeTruthy();
  });

  it("takes its wording, its width and its skip link from configuration", () => {
    const { getByRole, queryByRole, container } = renderWithProvider(
      <DocsLayout navigation={<span>Sections</span>}>
        <p>Layout</p>
      </DocsLayout>,
      {
        config: makeComponentConfig("docslayout", {
          navigationLabel: "Guides",
          navigationWidth: "sm",
          skipLink: false,
        }),
      },
    );

    expect(getByRole("complementary", { name: "Guides" })).toBeTruthy();
    expect(queryByRole("link")).toBeNull();
    expect(container.querySelector("aside")?.className as string).toContain(
      "lg:w-56",
    );
  });

  it("lets an instance prop win over the configured value", () => {
    const { queryByRole } = renderWithProvider(
      <DocsLayout navigation={<span>Sections</span>} skipLink={false}>
        <p>Layout</p>
      </DocsLayout>,
      { config: makeComponentConfig("docslayout", { skipLink: true }) },
    );

    expect(queryByRole("link")).toBeNull();
  });

  it("renders the element it is asked for and forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderWithProvider(
      <DocsLayout as="article" ref={ref} navigation={<span>Sections</span>}>
        <p>Layout</p>
      </DocsLayout>,
    );

    expect(container.firstElementChild?.tagName).toBe("ARTICLE");
    expect(ref.current).toBe(container.firstElementChild);
  });

  it("carries the consumer's class last, so it wins", () => {
    const { container } = renderWithProvider(
      <DocsLayout className="bg-primary" navigation={<span>Sections</span>}>
        <p>Layout</p>
      </DocsLayout>,
    );

    expect((container.firstElementChild as HTMLElement).className).toContain(
      "bg-primary",
    );
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const markup = renderToServerString(
      <DocsLayout
        navigation={<span>Sections</span>}
        toc={<span>Getting started</span>}>
        <p>Layout</p>
      </DocsLayout>,
    );

    expect(markup).toContain("Documentation");
    expect(markup).toContain("On this page");
    expect(markup).toContain("<main");
    expectHydrationClean(
      <DocsLayout navigation={<span>Sections</span>}>
        <p>Layout</p>
      </DocsLayout>,
    );
  });
});
