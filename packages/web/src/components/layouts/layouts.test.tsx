import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectHydrationClean,
  fireEvent,
  makeComponentConfig,
  makeConfig,
  pressArrow,
  pressKey,
  renderToServerString,
  renderWithProvider,
  within,
} from "../../test";
import { AuthLayout } from "./auth-layout/AuthLayout";
import { Centered } from "./centered/Centered";
import { Container } from "./container/Container";
import { DocsLayout } from "./docs-layout/DocsLayout";
import { Grid } from "./grid/Grid";
import { MarketingLayout } from "./marketing-layout/MarketingLayout";
import { Page, PageContent, PageFooter, PageHeader } from "./page/Page";
import { ResizableScreen } from "./resizable-screen/ResizableScreen";
import { Section } from "./section/Section";
import { ActionGroup } from "./section-kit/ActionGroup";
import { SectionHeading } from "./section-kit/SectionHeading";
import { SidebarLayout } from "./sidebar-layout/SidebarLayout";
import { Sidebar } from "../navigation/sidebar/Sidebar";
import { Split } from "./split/Split";
import { HStack, Stack, VStack } from "./stack/Stack";

/**
 * Behaviour tests for the AuthLayout page shell.
 */
describe("AuthLayout", () => {
  it("renders the brand, the heading and the form", () => {
    const { getByRole, getByText } = renderWithProvider(
      <AuthLayout
        brand="Ashee SMS"
        title="Sign in"
        description="Use your email.">
        <form aria-label="Sign in form" />
      </AuthLayout>,
    );

    expect(getByText("Ashee SMS")).toBeDefined();
    expect(getByRole("heading", { name: "Sign in" })).toBeDefined();
    expect(getByRole("form", { name: "Sign in form" })).toBeDefined();
  });

  it("panelises the form by default and can be told not to", () => {
    const { container: panel } = renderWithProvider(
      <AuthLayout>form</AuthLayout>,
    );
    expect(panel.querySelector(".border-border")).not.toBeNull();

    const { container: plain } = renderWithProvider(
      <AuthLayout panel={false}>form</AuthLayout>,
    );

    expect(plain.querySelector(".border-border")).toBeNull();
  });

  it("rounds the panel with the application's defaultRadius", () => {
    const { container: byDefault } = renderWithProvider(
      <AuthLayout>form</AuthLayout>,
    );

    // The framework's default radius is `xs`; the panel is a surface like any
    // other, so it follows it rather than pinning a corner of its own.
    expect(byDefault.querySelector(".rounded-xs")).not.toBeNull();

    const { container: rounded } = renderWithProvider(
      <AuthLayout>form</AuthLayout>,
      { config: makeConfig({ defaultRadius: "lg" }) },
    );

    expect(rounded.querySelector(".rounded-lg")).not.toBeNull();
    expect(rounded.querySelector(".rounded-xs")).toBeNull();
  });

  it("renders the footer slot under the form", () => {
    const { getByText } = renderWithProvider(
      <AuthLayout footer={<span>Forgot your password?</span>}>form</AuthLayout>,
    );

    expect(getByText("Forgot your password?")).toBeDefined();
  });

  it("adds a media column only when there is media, on the side it is asked for", () => {
    const { container: single } = renderWithProvider(
      <AuthLayout>form</AuthLayout>,
    );
    expect(single.querySelector(".min-h-48")).toBeNull();

    const { container: split } = renderWithProvider(
      <AuthLayout media={<span>Shot</span>} mediaPosition="start">
        form
      </AuthLayout>,
    );

    expect(split.querySelector(".min-h-48")).not.toBeNull();
    expect(split.querySelector(".lg\\:order-first")).not.toBeNull();
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<AuthLayout>form</AuthLayout>, {
      config: makeComponentConfig("authlayout", {
        panel: false,
        contentSize: "md",
      }),
    });

    expect(container.querySelector(".max-w-lg")).not.toBeNull();
    expect(container.querySelector(".border-border")).toBeNull();
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <AuthLayout title="Sign in">form</AuthLayout>,
    );

    expect(html).toContain("Sign in");
    expect(html).toContain("min-h-dvh");
    expectHydrationClean(<AuthLayout title="Sign in">form</AuthLayout>);
  });
});

/**
 * Behaviour tests for the Centered layout primitive.
 *
 * The primitive has one job, so the tests state that job: the axis it centres on,
 * the room it reserves before centring, the container it optionally holds its
 * content in, and that it never assembles a class name at runtime.
 */
describe("Centered", () => {
  it("centres its content on both axes and in the text direction", () => {
    const { container } = renderWithProvider(<Centered>Sign in</Centered>);
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("flex");
    expect(className).toContain("items-center");
    expect(className).toContain("justify-center");
    expect(className).toContain("text-center");
  });

  it("centres on the axis it is asked for", () => {
    const { container } = renderWithProvider(
      <Centered axis="horizontal">Heading</Centered>,
    );
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("items-center");
    expect(className).not.toContain("justify-center");
    expect(className).not.toContain("text-center");
  });

  it("reserves vertical room before centring", () => {
    const { container } = renderWithProvider(
      <Centered minHeight="lg">Sign in</Centered>,
    );

    expect((container.firstElementChild as HTMLElement).className).toContain(
      "min-h-72",
    );
  });

  it("reserves no height unless it is asked to", () => {
    const { container } = renderWithProvider(<Centered>Sign in</Centered>);

    expect(
      (container.firstElementChild as HTMLElement).className,
    ).not.toContain("min-h-");
  });

  it("holds its content in a container when asked, and not otherwise", () => {
    const { container } = renderWithProvider(
      <Centered contained containerSize="sm">
        Sign in
      </Centered>,
    );
    const outer = container.firstElementChild as HTMLElement;
    const inner = outer.firstElementChild as HTMLElement;

    expect(outer.className).toContain("max-w-2xl");
    expect(outer.className).toContain("mx-auto");
    expect(inner.className).toContain("items-center");

    const { container: bare } = renderWithProvider(
      <Centered>Sign in</Centered>,
    );

    expect((bare.firstElementChild as HTMLElement).className).not.toContain(
      "mx-auto",
    );
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<Centered>Sign in</Centered>, {
      config: makeComponentConfig("centered", {
        axis: "vertical",
        minHeight: "sm",
        contained: true,
      }),
    });
    // A contained block renders its container first, so the block itself is the
    // container's only child.
    const block = container.firstElementChild?.firstElementChild as HTMLElement;

    expect(block.className).toContain("justify-center");
    expect(block.className).not.toContain("items-center");
    expect(block.className).toContain("min-h-24");
  });

  it("lets an instance prop win over the configured value", () => {
    const { container } = renderWithProvider(
      <Centered axis="horizontal">Sign in</Centered>,
      { config: makeComponentConfig("centered", { axis: "vertical" }) },
    );

    expect((container.firstElementChild as HTMLElement).className).toContain(
      "items-center",
    );
  });

  it("renders the element it is asked for and forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderWithProvider(
      <Centered as="section" ref={ref}>
        Sign in
      </Centered>,
    );

    expect(container.firstElementChild?.tagName).toBe("SECTION");
    expect(ref.current).toBe(container.firstElementChild);
  });

  it("carries the consumer's class last, so it wins", () => {
    const { container } = renderWithProvider(
      <Centered className="items-start">Sign in</Centered>,
    );
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className.endsWith("items-start")).toBe(true);
  });

  it("renders on the server and hydrates without a mismatch", () => {
    expect(
      renderToServerString(<Centered minHeight="sm">x</Centered>),
    ).toContain("min-h-24");
    expectHydrationClean(
      <Centered contained>
        <span>x</span>
      </Centered>,
    );
  });
});

/**
 * Behaviour tests for the Container layout primitive.
 *
 * The checks state the contract rather than the markup: a container is a
 * centred, capped column with a gutter, configuration restyles it, and it
 * renders on the server and hydrates without a mismatch.
 */
describe("Container", () => {
  it("caps the width, centres the content and reserves a gutter", () => {
    const { container } = renderWithProvider(<Container>x</Container>);
    const element = container.firstElementChild as HTMLElement;

    expect(element.className).toContain("max-w-6xl");
    expect(element.className).toContain("mx-auto");
    expect(element.className).toContain("px-4");
  });

  it("changes its width with the size prop", () => {
    const { container } = renderWithProvider(
      <Container size="sm">x</Container>,
    );

    expect((container.firstElementChild as HTMLElement).className).toContain(
      "max-w-2xl",
    );
  });

  it("lets a consumer remove the gutter, the cap and the centring", () => {
    const { container } = renderWithProvider(
      <Container size="full" gutter={false} centered={false}>
        x
      </Container>,
    );
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("max-w-none");
    expect(className).not.toContain("mx-auto");
    expect(className).not.toContain("px-4");
  });

  it("renders through the element named by the as prop", () => {
    const { getByRole } = renderWithProvider(
      <Container as="section" aria-label="Featured">
        x
      </Container>,
    );

    expect(getByRole("region", { name: "Featured" })).toBeDefined();
  });

  it("takes its width from configuration when the prop is absent", () => {
    const { container } = renderWithProvider(<Container>x</Container>, {
      config: makeComponentConfig("container", { size: "xl" }),
    });

    expect((container.firstElementChild as HTMLElement).className).toContain(
      "max-w-7xl",
    );
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(<Container>x</Container>);

    expect(html).toContain("max-w-6xl");
    expectHydrationClean(
      <Container>
        <span>Content</span>
      </Container>,
    );
  });
});

/**
 * Behaviour tests for the documentation composition.
 *
 * The tests state what the composition promises: a named navigation column, an
 * article the skip link leads to, an optional contents landmark, the regions
 * around them, and that every option resolves through the configuration cascade.
 */
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

  it("keeps the navigation column in view by default", () => {
    const { getByRole } = renderWithProvider(
      <DocsLayout navigation={<span>Sections</span>}>
        <p>Layout</p>
      </DocsLayout>,
    );

    expect(
      getByRole("complementary", { name: "Documentation" }).className,
    ).toContain("lg:sticky");
  });

  it("lets a page stop the navigation column sticking", () => {
    const { getByRole } = renderWithProvider(
      <DocsLayout navigation={<span>Sections</span>} stickyNavigation={false}>
        <p>Layout</p>
      </DocsLayout>,
    );

    expect(
      getByRole("complementary", { name: "Documentation" }).className,
    ).not.toContain("lg:sticky");
  });

  it("takes the navigation stickiness from configuration", () => {
    const { getByRole } = renderWithProvider(
      <DocsLayout navigation={<span>Sections</span>}>
        <p>Layout</p>
      </DocsLayout>,
      {
        config: makeComponentConfig("docslayout", { stickyNavigation: false }),
      },
    );

    expect(
      getByRole("complementary", { name: "Documentation" }).className,
    ).not.toContain("lg:sticky");
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

/**
 * Behaviour tests for the Grid layout primitive.
 */
describe("Grid", () => {
  it("is a single-column grid by default", () => {
    const { container } = renderWithProvider(<Grid>x</Grid>);
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("grid");
    expect(className).toContain("grid-cols-1");
    expect(className).toContain("gap-4");
    expect(className).toContain("items-stretch");
  });

  it("states its column count per breakpoint", () => {
    const { container } = renderWithProvider(
      <Grid columns={1} columnsMd={2} columnsLg={4} gap="lg">
        x
      </Grid>,
    );
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("grid-cols-1");
    expect(className).toContain("md:grid-cols-2");
    expect(className).toContain("lg:grid-cols-4");
    expect(className).toContain("gap-6");
  });

  it("leaves a breakpoint out rather than forcing a column count", () => {
    const { container } = renderWithProvider(<Grid columns={2}>x</Grid>);
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).not.toContain("md:grid-cols-");
    expect(className).not.toContain("lg:grid-cols-");
  });

  it("renders a list when it is given list items", () => {
    const { container } = renderWithProvider(
      <Grid as="ul" columns={2} columnsLg={3}>
        <li>a</li>
      </Grid>,
    );

    expect((container.firstElementChild as HTMLElement).tagName).toBe("UL");
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<Grid>x</Grid>, {
      config: makeComponentConfig("grid", {
        columns: 3,
        columnsLg: 6,
        align: "start",
      }),
    });
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("grid-cols-3");
    expect(className).toContain("lg:grid-cols-6");
    expect(className).toContain("items-start");
  });

  it("renders on the server and hydrates without a mismatch", () => {
    expect(renderToServerString(<Grid columns={2}>x</Grid>)).toContain(
      "grid-cols-2",
    );
    expectHydrationClean(
      <Grid columns={1} columnsLg={3}>
        <span>a</span>
        <span>b</span>
      </Grid>,
    );
  });
});

/**
 * Behaviour tests for the marketing page composition.
 *
 * The tests state what the composition promises: the regions appear in the order
 * a page reads, the sections are inside a main landmark, a skip link leads to
 * that landmark and is the first focusable element, and every option resolves
 * through the configuration cascade.
 */
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
    expect(regions).toHaveLength(4);
    expect(regions[0]!.tagName).toBe("A");
    expect(regions[1]!.textContent).toBe("Navigation");
    expect(regions[2]!.tagName).toBe("MAIN");
    expect(regions[3]!.textContent).toBe("Footer");
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

/**
 * Behaviour tests for the four page parts.
 *
 * The checks state the shell's contract: the header is a banner landmark that
 * can stick, the content is the `main` landmark and fills the height, the footer
 * closes the page, and configuration restyles all four at once.
 */
describe("Page", () => {
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
          <PageHeader
            contained
            containerSize="xl"
            sticky={false}
            divider={false}>
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
});

describe("ResizableScreen", () => {
  const PANELS = [
    <div key="primary">Primary</div>,
    <div key="secondary">Secondary</div>,
  ];

  it("exposes a focusable separator with its value range", () => {
    const { getByRole } = renderWithProvider(
      <ResizableScreen>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const separator = getByRole("separator", { name: "Resize panel split" });

    expect(separator).toHaveAttribute("tabindex", "0");
    expect(separator).toHaveAttribute("aria-valuenow", "50");
    expect(separator).toHaveAttribute("aria-valuemin", "20");
    expect(separator).toHaveAttribute("aria-valuemax", "80");
  });

  it("reports the orientation of the divider, not of the panes' axis", () => {
    const horizontal = renderWithProvider(
      <ResizableScreen>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );

    // Side-by-side panes are divided by a vertical separator.
    expect(horizontal.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );

    const vertical = renderWithProvider(
      <ResizableScreen orientation="vertical">
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );

    // Stacked panes are divided by a horizontal separator.
    expect(within(vertical.container).getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });

  it("resizes with the keyboard by the configured step", async () => {
    const user = createUser();
    const onSizeChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <ResizableScreen step={5} onSizeChange={onSizeChange}>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const separator = getByRole("separator");

    separator.focus();
    await pressArrow(user, "ArrowRight");
    expect(separator).toHaveAttribute("aria-valuenow", "55");

    await pressArrow(user, "ArrowLeft");
    expect(separator).toHaveAttribute("aria-valuenow", "50");

    expect(onSizeChange).toHaveBeenCalled();
  });

  it("clamps keyboard resizing to the maximum size", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <ResizableScreen maxSize={60}>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const separator = getByRole("separator");

    separator.focus();
    await pressArrow(user, "ArrowRight", 10);

    expect(separator).toHaveAttribute("aria-valuenow", "60");
  });

  it("uses vertical keys when the orientation is vertical", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <ResizableScreen orientation="vertical">
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const separator = getByRole("separator");

    separator.focus();
    await pressArrow(user, "ArrowDown");
    expect(separator).toHaveAttribute("aria-valuenow", "52");

    await pressArrow(user, "ArrowUp");
    expect(separator).toHaveAttribute("aria-valuenow", "50");
  });

  it("renders both panels", () => {
    const { getByText } = renderWithProvider(
      <ResizableScreen>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );

    expect(getByText("Primary")).toBeInTheDocument();
    expect(getByText("Secondary")).toBeInTheDocument();
  });

  it("resizes by the pointer's travel, so the grab point does not shift the split", () => {
    const onSizeChange = vi.fn();
    const { container, getByRole } = renderWithProvider(
      <ResizableScreen onSizeChange={onSizeChange}>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const root = container.firstElementChild as HTMLElement;
    root.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 400,
        bottom: 300,
        width: 400,
        height: 300,
        toJSON: () => ({}),
      }) as DOMRect;

    const separator = getByRole("separator");

    // The pointer goes down inside the handle, away from the boundary; nothing
    // moves yet, so the split must not jump to the pointer.
    fireEvent.pointerDown(separator, { pointerId: 1, clientX: 210 });
    fireEvent.pointerMove(separator, { pointerId: 1, clientX: 210 });
    expect(onSizeChange).toHaveBeenLastCalledWith(50);

    // 40 px of travel on a 400 px container is ten percentage points.
    fireEvent.pointerMove(separator, { pointerId: 1, clientX: 250 });
    expect(onSizeChange).toHaveBeenLastCalledWith(60);

    fireEvent.pointerUp(separator, { pointerId: 1, clientX: 250 });
  });

  it("resolves the container minimums through configuration", () => {
    const { container } = renderWithProvider(
      <ResizableScreen>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
      {
        config: makeComponentConfig("resizableScreen", {
          minContainerWidth: 320,
          minContainerHeight: 240,
        }),
      },
    );
    const root = container.firstElementChild as HTMLElement;

    expect(root.style.minWidth).toBe("320px");
    expect(root.style.minHeight).toBe("240px");
  });

  it("lets an instance minimum win over the configured one", () => {
    const { container } = renderWithProvider(
      <ResizableScreen minContainerWidth={280}>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
      {
        config: makeComponentConfig("resizableScreen", {
          minContainerWidth: 320,
        }),
      },
    );
    const root = container.firstElementChild as HTMLElement;

    expect(root.style.minWidth).toBe("280px");
  });

  it("grows the second panel into the room the first one leaves", () => {
    const { container } = renderWithProvider(
      <ResizableScreen>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const root = container.firstElementChild as HTMLElement;
    const secondary = root.lastElementChild as HTMLElement;

    expect(secondary.style.flexGrow).toBe("1");
    expect(secondary.style.width).toBe("");
    expect(secondary.style.height).toBe("");
  });

  it("warns about an inverted size range and treats it as a range", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <ResizableScreen minSize={80} maxSize={20}>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const separator = getByRole("separator");

    expect(separator).toHaveAttribute("aria-valuemin", "20");
    expect(separator).toHaveAttribute("aria-valuemax", "80");
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("minSize (80) is greater than maxSize (20)"),
    );

    separator.focus();
    await pressKey(user, "Home");
    expect(separator).toHaveAttribute("aria-valuenow", "20");

    await pressKey(user, "End");
    expect(separator).toHaveAttribute("aria-valuenow", "80");

    warn.mockRestore();
  });
});

/**
 * Behaviour tests for the Section layout component.
 */
describe("Section", () => {
  it("is a section landmark with the framework rhythm and no background", () => {
    const { container } = renderWithProvider(<Section>x</Section>);
    const element = container.firstElementChild as HTMLElement;

    expect(element.tagName).toBe("SECTION");
    expect(element.className).toContain("py-12");
    expect(element.className).not.toContain("bg-secondary/50");
  });

  it("takes its rhythm, background and separator from its props", () => {
    const { container } = renderWithProvider(
      <Section spacing="xl" background="muted" divider>
        x
      </Section>,
    );
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("py-16");
    expect(className).toContain("bg-secondary/50");
    expect(className).toContain("border-t");
  });

  it("does not own the width until it is asked to", () => {
    const { container: plain } = renderWithProvider(<Section>x</Section>);
    expect(plain.querySelector(".max-w-6xl")).toBeNull();

    const { container: contained } = renderWithProvider(
      <Section contained containerSize="xl">
        x
      </Section>,
    );

    expect(contained.querySelector(".max-w-7xl")).not.toBeNull();
  });

  it("renders through the element named by the as prop", () => {
    const { container } = renderWithProvider(<Section as="div">x</Section>);

    expect((container.firstElementChild as HTMLElement).tagName).toBe("DIV");
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<Section>x</Section>, {
      config: makeComponentConfig("section", {
        spacing: "sm",
        background: "tinted",
      }),
    });
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("py-6");
    expect(className).toContain("bg-primary/5");
  });

  it("renders on the server and hydrates without a mismatch", () => {
    expect(renderToServerString(<Section spacing="lg">x</Section>)).toContain(
      "py-12",
    );
    expectHydrationClean(
      <Section background="muted">
        <span>Content</span>
      </Section>,
    );
  });
});

/**
 * Behaviour tests for the section kit's action group.
 *
 * The group is the row a band's actions sit in. These tests state what the
 * component's own comment promises: configured actions and any `children` land
 * in that row, and a group with neither renders nothing.
 */
describe("ActionGroup", () => {
  it("renders configured actions through the framework Button", () => {
    const { getByRole } = renderWithProvider(
      <ActionGroup
        primaryAction={{ label: "Start free", href: "/signup" }}
        secondaryAction={{ label: "Read the docs", href: "/docs" }}
      />,
    );

    expect(getByRole("link", { name: "Start free" })).toBeDefined();
    expect(getByRole("link", { name: "Read the docs" })).toBeDefined();
  });

  it("renders children inside its row, after the configured actions", () => {
    // This is the placement the component documents: a handler-carrying button
    // passed here lands in the same row as the configured actions. The bands
    // place their own children below the row instead, and say so on their own
    // props.
    const { container, getByText } = renderWithProvider(
      <ActionGroup primaryAction={{ label: "Start free", href: "/signup" }}>
        <button type="button">Talk to us</button>
      </ActionGroup>,
    );
    const row = container.querySelector(".gap-3") as HTMLElement;

    expect(row.contains(getByText("Talk to us"))).toBe(true);
    expect(row.querySelectorAll("a, button")).toHaveLength(2);
  });

  it("renders nothing when it has neither actions nor children", () => {
    const { container } = renderWithProvider(<ActionGroup />);

    expect(container.innerHTML).toBe("");
  });
});

/**
 * Behaviour tests for the section kit's heading block.
 *
 * The heading's element is the contract these tests exist for: a band is a
 * section of a page, so a heading block never claims the page's `h1` on its own
 * — at any size — and `titleAs` is the one way to raise it.
 */
describe("SectionHeading", () => {
  it.each(["md", "lg", "xl"] as const)(
    "renders its title as a level two heading at size %s",
    (size) => {
      const { getByRole } = renderWithProvider(
        <SectionHeading title="Workflow" size={size} />,
      );

      expect(getByRole("heading", { level: 2, name: "Workflow" }).tagName).toBe(
        "H2",
      );
    },
  );

  it("raises the title to h1 through titleAs when the block is the page title", () => {
    const { getByRole } = renderWithProvider(
      <SectionHeading title="Run your campaigns" titleAs="h1" size="xl" />,
    );

    expect(
      getByRole("heading", { level: 1, name: "Run your campaigns" }).tagName,
    ).toBe("H1");
  });

  it("lowers the title through titleAs for a band nested in an existing section", () => {
    const { getByRole } = renderWithProvider(
      <SectionHeading title="Nested" titleAs="h3" />,
    );

    expect(getByRole("heading", { level: 3, name: "Nested" }).tagName).toBe(
      "H3",
    );
  });

  it("keeps the size's visual step independent of the element", () => {
    // `xl` still asks for the display role; only the element recorded in the
    // outline is held below `h1`.
    const { getByRole } = renderWithProvider(
      <SectionHeading title="Big" size="xl" />,
    );

    expect(getByRole("heading", { level: 2 }).className).toContain("text-3xl");
  });

  it("names its title so a band can point at it", () => {
    const { getByRole } = renderWithProvider(
      <section aria-labelledby="workflow-heading">
        <SectionHeading title="Workflow" titleId="workflow-heading" />
      </section>,
    );

    expect(getByRole("region", { name: "Workflow" })).toBeDefined();
  });

  it("renders its eyebrow and description", () => {
    const { getByText } = renderWithProvider(
      <SectionHeading
        eyebrow="Workflow"
        title="Everything a campaign needs"
        description="Segment, schedule and measure."
      />,
    );

    expect(getByText("Workflow")).toBeDefined();
    expect(getByText("Segment, schedule and measure.")).toBeDefined();
  });

  it("renders nothing when it has nothing to show", () => {
    const { container } = renderWithProvider(<SectionHeading />);

    expect(container.innerHTML).toBe("");
  });
});

/**
 * Behaviour tests for the SidebarLayout application shell.
 */
describe("SidebarLayout", () => {
  it("renders the sidebar as a named complementary landmark", () => {
    const { getByRole } = renderWithProvider(
      <SidebarLayout sidebar={<span>Navigation</span>}>
        <main>Body</main>
      </SidebarLayout>,
    );

    expect(getByRole("complementary", { name: "Sidebar" })).toBeDefined();
  });

  it("adds one complementary landmark and one navigation landmark for a Sidebar", () => {
    const { container, getAllByRole } = renderWithProvider(
      <SidebarLayout
        sidebar={
          <Sidebar items={[{ id: "home", label: "Home" }]} activeKey="home" />
        }>
        <main>Body</main>
      </SidebarLayout>,
    );

    // The column is the complementary landmark; the Sidebar inside it renders
    // no second `aside`, so the two complementary landmarks do not nest.
    const complementary = getAllByRole("complementary");
    expect(complementary).toHaveLength(1);
    expect(complementary[0]).toHaveAccessibleName("Sidebar");
    expect(container.querySelectorAll("aside")).toHaveLength(1);

    const navigation = getAllByRole("navigation");
    expect(navigation).toHaveLength(1);
    expect(navigation[0]).toHaveAccessibleName("Sidebar navigation");
  });

  it("puts the header and the footer outside the two columns", () => {
    const { getByRole } = renderWithProvider(
      <SidebarLayout
        header={<header>Bar</header>}
        footer={<footer>Legal</footer>}
        sidebar={<span>Navigation</span>}>
        <main>Body</main>
      </SidebarLayout>,
    );

    expect(getByRole("banner")).toBeDefined();
    expect(getByRole("contentinfo")).toBeDefined();
    expect(getByRole("main")).toBeDefined();
  });

  it("stacks the sidebar above the content and sticks it on a wide screen", () => {
    const { container } = renderWithProvider(
      <SidebarLayout sidebar={<span>Navigation</span>}>
        <main>Body</main>
      </SidebarLayout>,
    );
    const shell = container.firstElementChild as HTMLElement;
    const row = shell.firstElementChild as HTMLElement;
    const aside = container.querySelector("aside") as HTMLElement;

    // The shell stays a column at every width, so the header and the footer span
    // the page; the row inside it is what becomes two columns.
    expect(shell.className).toContain("flex-col");
    expect(shell.className).not.toContain("lg:flex-row");
    expect(row.className).toContain("flex-col");
    expect(row.className).toContain("lg:flex-row");
    expect(aside.className).toContain("lg:w-64");
    expect(aside.className).toContain("lg:sticky");
    expect(aside.className).toContain("lg:border-r");
  });

  it("takes the side, the width and the stickiness from its props", () => {
    const { container } = renderWithProvider(
      <SidebarLayout
        sidebar={<span>Navigation</span>}
        side="end"
        sidebarWidth="lg"
        stickySidebar={false}>
        <main>Body</main>
      </SidebarLayout>,
    );
    const aside = container.querySelector("aside") as HTMLElement;

    expect(aside.className).toContain("lg:order-last");
    expect(aside.className).toContain("lg:w-80");
    expect(aside.className).toContain("lg:border-l");
    expect(aside.className).not.toContain("lg:sticky");
  });

  it("names the landmark from its own prop", () => {
    const { getByRole } = renderWithProvider(
      <SidebarLayout sidebar={<span>Navigation</span>} sidebarLabel="Workspace">
        <main>Body</main>
      </SidebarLayout>,
    );

    expect(getByRole("complementary", { name: "Workspace" })).toBeDefined();
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(
      <SidebarLayout sidebar={<span>Navigation</span>}>
        <main>Body</main>
      </SidebarLayout>,
      { config: makeComponentConfig("sidebarlayout", { sidebarWidth: "sm" }) },
    );

    expect(
      (container.querySelector("aside") as HTMLElement).className,
    ).toContain("lg:w-56");
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <SidebarLayout sidebar={<span>Navigation</span>}>
        <main>Body</main>
      </SidebarLayout>,
    );

    expect(html).toContain("<aside");
    expect(html).toContain('aria-label="Sidebar"');
    expectHydrationClean(
      <SidebarLayout sidebar={<span>Navigation</span>}>
        <main>Body</main>
      </SidebarLayout>,
    );
  });
});

/**
 * Behaviour tests for the Split layout primitive.
 *
 * The tests state the primitive's contract: panes stack below the chosen
 * breakpoint and sit side by side above it, the width divides by the ratio, the
 * panes are never hidden, and every option resolves through the configuration
 * cascade.
 */
describe("Split", () => {
  /**
   * Read a split's root element and its panes.
   *
   * @param container - The render result's container.
   * @returns The root and the panes it rendered.
   */
  function readSplit(container: HTMLElement) {
    const root = container.firstElementChild as HTMLElement;
    const panes = Array.from(root.children) as HTMLElement[];

    return { root, panes };
  }

  it("stacks its panes on a narrow screen and splits them on a wide one", () => {
    const { root, panes } = readSplit(
      renderWithProvider(<Split start={<span>a</span>} end={<span>b</span>} />)
        .container,
    );

    expect(root.className).toContain("flex-col");
    expect(root.className).toContain("lg:flex-row");
    expect(root.className).toContain("gap-6");
    expect(root.className).toContain("items-stretch");
    expect(panes[0]!.className).toContain("lg:basis-1/2");
    expect(panes[1]!.className).toContain("lg:basis-1/2");
  });

  it("divides the width by the ratio it is given", () => {
    const { panes } = readSplit(
      renderWithProvider(
        <Split
          stackAt="md"
          ratio="end"
          start={<span>a</span>}
          end={<span>b</span>}
        />,
      ).container,
    );

    expect(panes[0]!.className).toContain("md:basis-1/3");
    expect(panes[1]!.className).toContain("md:basis-2/3");
  });

  it("draws a divider between the panes, following the flex direction", () => {
    const { root } = readSplit(
      renderWithProvider(
        <Split divider start={<span>a</span>} end={<span>b</span>} />,
      ).container,
    );

    expect(root.className).toContain("divide-y");
    expect(root.className).toContain("divide-border");
    expect(root.className).toContain("lg:divide-x");
  });

  it("keeps the second pane in view when asked", () => {
    const { panes } = readSplit(
      renderWithProvider(
        <Split stickyEnd start={<span>a</span>} end={<span>b</span>} />,
      ).container,
    );

    expect(panes[1]!.className).toContain("sticky");
    expect(panes[0]!.className).not.toContain("sticky");
  });

  it("renders one pane when the layout has one", () => {
    const { panes } = readSplit(
      renderWithProvider(<Split start={<span>a</span>} />).container,
    );

    expect(panes).toHaveLength(1);
  });

  it("renders both panes in order, so the reading order is the written order", () => {
    const { panes } = readSplit(
      renderWithProvider(
        <Split start={<span>first</span>} end={<span>second</span>} />,
      ).container,
    );

    expect(panes[0]!.textContent).toBe("first");
    expect(panes[1]!.textContent).toBe("second");
  });

  it("resolves its defaults through configuration", () => {
    const { root, panes } = readSplit(
      renderWithProvider(
        <Split start={<span>a</span>} end={<span>b</span>} />,
        {
          config: makeComponentConfig("split", {
            stackAt: "sm",
            ratio: "start",
            gap: "sm",
            divider: true,
          }),
        },
      ).container,
    );

    expect(root.className).toContain("sm:flex-row");
    expect(root.className).toContain("gap-2");
    expect(root.className).toContain("sm:divide-x");
    expect(panes[0]!.className).toContain("sm:basis-2/3");
    expect(panes[1]!.className).toContain("sm:basis-1/3");
  });

  it("lets an instance prop win over the configured value", () => {
    const { root } = readSplit(
      renderWithProvider(
        <Split stackAt="xl" start={<span>a</span>} end={<span>b</span>} />,
        { config: makeComponentConfig("split", { stackAt: "sm" }) },
      ).container,
    );

    expect(root.className).toContain("xl:flex-row");
    expect(root.className).not.toContain("sm:flex-row");
  });

  it("renders the element it is asked for and forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { root } = readSplit(
      renderWithProvider(
        <Split as="section" ref={ref} start={<span>a</span>} />,
      ).container,
    );

    expect(root.tagName).toBe("SECTION");
    expect(ref.current).toBe(root);
  });

  it("carries the consumer's class last, so it wins", () => {
    const { root } = readSplit(
      renderWithProvider(
        <Split className="gap-0" start={<span>a</span>} end={<span>b</span>} />,
      ).container,
    );

    expect(root.className.endsWith("gap-0")).toBe(true);
  });

  it("renders on the server and hydrates without a mismatch", () => {
    expect(
      renderToServerString(
        <Split stackAt="md" start={<span>a</span>} end={<span>b</span>} />,
      ),
    ).toContain("md:flex-row");
    expectHydrationClean(<Split start={<span>a</span>} end={<span>b</span>} />);
  });
});

/**
 * Behaviour tests for the Stack layout primitive and its presets.
 */
describe("Stack", () => {
  it("lays its children out in a column with a token gap", () => {
    const { container } = renderWithProvider(<Stack>x</Stack>);
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("flex-col");
    expect(className).toContain("gap-4");
    expect(className).toContain("items-stretch");
  });

  it("takes direction, alignment and wrapping from its props", () => {
    const { container } = renderWithProvider(
      <Stack direction="row" align="center" justify="between" gap="xl" wrap>
        x
      </Stack>,
    );
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("flex-row");
    expect(className).toContain("items-center");
    expect(className).toContain("justify-between");
    expect(className).toContain("gap-8");
    expect(className).toContain("flex-wrap");
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<Stack>x</Stack>, {
      config: makeComponentConfig("stack", { gap: "sm", direction: "row" }),
    });
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("gap-2");
    expect(className).toContain("flex-row");
  });

  it("renders the presets with their own defaults and the shared options", () => {
    const { container } = renderWithProvider(
      <>
        <HStack gap="lg">a</HStack>
        <VStack gap="sm">b</VStack>
      </>,
    );
    const stacks = Array.from(container.children) as HTMLElement[];
    const row = stacks[0]!;
    const column = stacks[1]!;

    expect(row.className).toContain("flex-row");
    expect(row.className).toContain("items-center");
    expect(row.className).toContain("gap-6");
    expect(column.className).toContain("flex-col");
    expect(column.className).toContain("items-stretch");
    expect(column.className).toContain("gap-2");
  });

  it("lets configuration override a preset's direction and alignment", () => {
    const { container } = renderWithProvider(
      <>
        <HStack>a</HStack>
        <VStack>b</VStack>
      </>,
      {
        config: makeComponentConfig("stack", {
          direction: "column",
          align: "end",
        }),
      },
    );
    const stacks = Array.from(container.children) as HTMLElement[];
    const row = stacks[0]!;
    const column = stacks[1]!;

    // The preset's row/centre values sit below the component configuration, so
    // `components.stack` reaches both presets.
    expect(row.className).toContain("flex-col");
    expect(row.className).toContain("items-end");
    expect(column.className).toContain("flex-col");
    expect(column.className).toContain("items-end");
  });

  it("lets an instance alignment win over the preset and the configuration", () => {
    const { container } = renderWithProvider(<HStack align="start">a</HStack>, {
      config: makeComponentConfig("stack", { align: "end" }),
    });

    expect((container.firstElementChild as HTMLElement).className).toContain(
      "items-start",
    );
  });

  it("carries the consumer's class last, so it wins", () => {
    const { container } = renderWithProvider(
      <Stack className="gap-0">x</Stack>,
    );

    expect((container.firstElementChild as HTMLElement).className).toContain(
      "gap-0",
    );
  });

  it("renders on the server and hydrates without a mismatch", () => {
    expect(renderToServerString(<Stack gap="lg">x</Stack>)).toContain("gap-6");
    expectHydrationClean(
      <HStack gap="sm">
        <span>a</span>
        <span>b</span>
      </HStack>,
    );
  });
});
