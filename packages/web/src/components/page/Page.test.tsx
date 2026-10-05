/**
 * Behaviour tests for the four page parts.
 *
 * The checks state the shell's contract: the header is a banner landmark that
 * can stick, the content is the `main` landmark and fills the height, the footer
 * closes the page, and configuration restyles all four at once.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { Page, PageContent, PageFooter, PageHeader } from "./Page";

describe("Page parts", () => {
  it("renders a full-height shell that owns the theme background", () => {
    const { container } = renderWithProvider(<Page>x</Page>);
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("min-h-dvh");
    expect(className).toContain("flex-col");
    expect(className).toContain("bg-background");
  });

  it("renders the header as a sticky banner landmark", () => {
    const { container, getByRole } = renderWithProvider(
      <Page>
        <PageHeader>Invoices</PageHeader>
      </Page>,
    );

    expect(getByRole("banner")).toBeDefined();
    expect(container.querySelector("header")?.className).toContain("sticky");
    expect(container.querySelector("header")?.className).toContain("border-b");
  });

  it("turns stickiness off when it is asked to", () => {
    const { container } = renderWithProvider(
      <PageHeader sticky={false}>Invoices</PageHeader>,
    );

    expect(container.querySelector("header")?.className).not.toContain(
      "sticky",
    );
  });

  it("renders the content as the main landmark inside the framework width", () => {
    const { container, getByRole } = renderWithProvider(
      <PageContent>Body</PageContent>,
    );

    expect(getByRole("main")).toBeDefined();
    expect(container.querySelector(".max-w-6xl")).not.toBeNull();
    expect(getByRole("main").className).toContain("flex-1");
  });

  it("renders the footer as the contentinfo landmark with a separator", () => {
    const { getByRole } = renderWithProvider(
      <PageFooter>Version 1.1.0</PageFooter>,
    );
    const footer = getByRole("contentinfo");

    expect(footer.className).toContain("border-t");
    expect(footer.textContent).toContain("Version 1.1.0");
  });

  it("resolves the shared page options from one configuration entry", () => {
    const config = makeComponentConfig("page", {
      containerSize: "xl",
      contained: false,
      sticky: false,
    });

    const { container } = renderWithProvider(
      <PageHeader>Invoices</PageHeader>,
      { config },
    );
    const className = container.querySelector("header")?.className ?? "";

    expect(className).not.toContain("sticky");
    expect(container.querySelector(".max-w-7xl")).toBeNull();
  });

  it("renders the shell on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <Page>
        <PageHeader>Invoices</PageHeader>
        <PageContent>Body</PageContent>
        <PageFooter>Version 1.1.0</PageFooter>
      </Page>,
    );

    expect(html).toContain("<main");
    expect(html).toContain("<header");
    expect(html).toContain("<footer");
    expectHydrationClean(
      <Page>
        <PageHeader>Invoices</PageHeader>
        <PageContent>Body</PageContent>
      </Page>,
    );
  });
});
