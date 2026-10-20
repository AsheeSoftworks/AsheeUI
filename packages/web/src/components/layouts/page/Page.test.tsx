/**
 * Behaviour tests for the four page parts.
 *
 * The checks state the shell's contract: the header is a banner landmark that
 * can stick, the content is the `main` landmark and fills the height, the footer
 * closes the page, and configuration restyles all four at once.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../../test";
import { Page, PageContent, PageFooter, PageHeader } from "./Page";

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it("puts className on the landmark and innerClassName on the column", () => {
    const { getByRole, getByText } = renderWithProvider(
      <PageContent className="bg-muted" innerClassName="gap-2">
        Body
      </PageContent>,
    );
    const main = getByRole("main");
    const column = getByText("Body");

    expect(main.className).toContain("bg-muted");
    expect(main.className).toContain("flex-1");
    expect(column.className).toContain("gap-2");
    expect(column.className).toContain("py-8");
    expect(column.className).not.toContain("bg-muted");
  });

  it("consumes the shared options its part owns instead of forwarding them", () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const parts = [
      [
        "PageHeader",
        <PageHeader
          key="header"
          contained
          containerSize="xl"
          sticky={false}
          divider={false}
          data-testid="part"
        />,
      ],
      [
        "PageContent",
        <PageContent
          key="content"
          contained
          containerSize="xl"
          spacing="lg"
          data-testid="part"
        />,
      ],
      [
        "PageFooter",
        <PageFooter
          key="footer"
          contained
          containerSize="xl"
          divider={false}
          data-testid="part"
        />,
      ],
    ] as const;

    for (const [name, element] of parts) {
      const { container } = renderWithProvider(element);
      const root = container.firstElementChild as HTMLElement;

      // None of the page options is a DOM attribute: React would warn about an
      // unknown prop and the browser would expose the configuration in the markup.
      expect(
        errors,
        `${name} warned about a configuration prop`,
      ).not.toHaveBeenCalled();
      expect(root.getAttribute("contained"), name).toBeNull();
      expect(root.getAttribute("containersize"), name).toBeNull();
      expect(root.getAttribute("spacing"), name).toBeNull();
      expect(root.getAttribute("sticky"), name).toBeNull();
      expect(root.getAttribute("divider"), name).toBeNull();

      // A real element attribute still reaches the DOM.
      expect(root.getAttribute("data-testid"), name).toBe("part");

      errors.mockClear();
    }
  });

  it("does not offer a part's options on the shell", () => {
    // @ts-expect-error — stickiness is PageHeader's option, not the shell's.
    const shell = <Page sticky />;
    // @ts-expect-error — rhythm is PageContent's option, not the footer's.
    const footer = <PageFooter spacing="xl" />;

    expect(shell).toBeDefined();
    expect(footer).toBeDefined();
  });

  it("resolves every shared option to the classes of the part that owns it", () => {
    const { getByRole } = renderWithProvider(
      <Page>
        <PageHeader contained containerSize="xl" sticky={false} divider={false}>
          Invoices
        </PageHeader>
        <PageContent contained={false} spacing="lg">
          Body
        </PageContent>
        <PageFooter contained containerSize="sm" divider={false}>
          Version 1.1.0
        </PageFooter>
      </Page>,
    );

    const header = getByRole("banner");
    expect(header.className).not.toContain("sticky");
    expect(header.className).not.toContain("border-b");
    expect(header.querySelector(".max-w-7xl")).not.toBeNull();

    const content = getByRole("main");
    expect(content.querySelector(".max-w-7xl")).toBeNull();
    expect(content.querySelector(".py-12")).not.toBeNull();

    const footer = getByRole("contentinfo");
    expect(footer.className).not.toContain("border-t");
    expect(footer.querySelector(".max-w-2xl")).not.toBeNull();
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
