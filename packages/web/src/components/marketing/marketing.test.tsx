import { describe, expect, it } from "vitest";
import {
  expectAccessibleName,
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { CTA } from "./cta/CTA";
import { FeatureGrid } from "./feature-grid/FeatureGrid";
import { Hero } from "./hero/Hero";
import { PricingCard } from "./pricing-card/PricingCard";
import { Testimonials } from "./testimonials/Testimonials";

/**
 * Behaviour tests for the CTA pattern.
 */
describe("CTA", () => {
  it("renders a named section landmark with its headline and description", () => {
    const { getByRole, getByText } = renderWithProvider(
      <CTA title="Send your first campaign" description="No card required." />,
    );

    // A band is a section of a page rather than the page's own title, so its
    // headline is a level two heading and the band names itself with it.
    expect(
      getByRole("heading", { level: 2, name: "Send your first campaign" })
        .tagName,
    ).toBe("H2");
    expect(
      getByRole("region", { name: "Send your first campaign" }).tagName,
    ).toBe("SECTION");
    expect(getByText("No card required.")).toBeDefined();
  });

  it("can raise its headline when the band is the page's only heading", () => {
    const { getByRole } = renderWithProvider(
      <CTA title="Send your first campaign" titleAs="h1" />,
    );

    expect(
      getByRole("heading", { level: 1, name: "Send your first campaign" })
        .tagName,
    ).toBe("H1");
  });

  it("panelises its content by default and can be told not to", () => {
    const { container: bordered } = renderWithProvider(<CTA title="Go" />);
    expect(bordered.querySelector(".border-border")).not.toBeNull();

    const { container: plain } = renderWithProvider(
      <CTA title="Go" panel="plain" />,
    );

    expect(plain.querySelector(".border-border")).toBeNull();
  });

  it("renders configured actions, and none when they are absent", () => {
    const { getByRole } = renderWithProvider(
      <CTA
        title="Go"
        primaryAction={{ label: "Create an account", href: "/signup" }}
      />,
    );
    expect(getByRole("link", { name: "Create an account" })).toBeDefined();
  });

  it("renders no control when it has no actions", () => {
    const { container, queryByRole } = renderWithProvider(<CTA title="Go" />);

    expect(queryByRole("link")).toBeNull();
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  it("centres its content by default", () => {
    const { container } = renderWithProvider(<CTA title="Go" />);

    expect(container.querySelector(".items-center")).not.toBeNull();
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<CTA title="Go" />, {
      config: makeComponentConfig("cta", {
        align: "start",
        panel: "muted",
        background: "tinted",
      }),
    });

    expect(container.querySelector(".items-center")).toBeNull();
    expect(container.querySelector(".bg-secondary\\/50")).not.toBeNull();
    expect(container.querySelector("section")?.className).toContain(
      "bg-primary/5",
    );
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(<CTA title="Send your first campaign" />);

    expect(html).toContain("Send your first campaign");
    expectHydrationClean(<CTA title="Send your first campaign" />);
  });
});

/**
 * Behaviour tests for the FeatureGrid pattern.
 */
describe("FeatureGrid", () => {
  const ITEMS = [
    { title: "Templates", description: "Reusable messages." },
    { title: "Scheduling", description: "Send at the right time." },
    { title: "Reporting", description: "See what landed." },
  ];

  it("renders one card per feature inside a list", () => {
    const { container, getByRole } = renderWithProvider(
      <FeatureGrid title="Everything the campaign needs" items={ITEMS} />,
    );

    expect(container.querySelectorAll("ul > li")).toHaveLength(3);
    expect(getByRole("heading", { level: 3, name: "Templates" })).toBeDefined();
    expect(
      getByRole("heading", { level: 2, name: "Everything the campaign needs" }),
    ).toBeDefined();
  });

  it("names the band with its heading, so the section is a region", () => {
    const { getByRole } = renderWithProvider(
      <FeatureGrid title="Everything the campaign needs" items={ITEMS} />,
    );

    expect(
      getByRole("region", { name: "Everything the campaign needs" }).tagName,
    ).toBe("SECTION");
  });

  it("leaves the band unnamed when it has no heading to be named by", () => {
    const { container } = renderWithProvider(<FeatureGrid items={ITEMS} />);

    expect(
      container.querySelector("section")?.hasAttribute("aria-labelledby"),
    ).toBe(false);
  });

  it("takes the heading's level and size from its props", () => {
    const { getByRole } = renderWithProvider(
      <FeatureGrid
        title="Everything the campaign needs"
        items={ITEMS}
        titleAs="h3"
        headingSize="xl"
      />,
    );
    const heading = getByRole("heading", {
      level: 3,
      name: "Everything the campaign needs",
    });

    expect(heading.tagName).toBe("H3");
    expect(heading.className).toContain("text-3xl");
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

  it("lets a router name the destination with mapProps", () => {
    // A router that calls its destination `to` cannot use the default `href`
    // injection, and the adapter belongs with the consumer that knows the router.
    const RouterLink = ({ to, ...rest }: { to?: string }) => (
      <a data-router="true" href={to} {...rest} />
    );

    const { getByRole } = renderWithProvider(
      <FeatureGrid
        items={[
          { title: "Templates", href: "/templates" },
          { title: "Reporting", href: "/reporting" },
        ]}
        link={{
          component: RouterLink,
          mapProps: (item) => ({ to: item.href }),
        }}
      />,
    );
    const link = getByRole("link", { name: /Templates/ });

    expect(link.getAttribute("data-router")).toBe("true");
    expect(link.getAttribute("href")).toBe("/templates");
    expect(link.hasAttribute("to")).toBe(false);
  });

  it("merges the link's own classes into each card's classes", () => {
    // `link.props` is documented as additional props, so a class there is
    // additive rather than a replacement for the card's surface.
    const { getByRole } = renderWithProvider(
      <FeatureGrid
        items={[{ title: "Templates", href: "/templates" }]}
        link={{ props: { className: "feature-link" } }}
      />,
    );
    const link = getByRole("link", { name: /Templates/ });

    expect(link.className).toContain("feature-link");
    expect(link.className).toContain("border-border");
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

/**
 * Behaviour tests for the Hero pattern.
 */
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

/**
 * Behaviour tests for the PricingCard pattern.
 */
describe("PricingCard", () => {
  const FEATURES = [
    { label: "10,000 messages" },
    { label: "Audit log", included: false },
  ];

  it("renders the plan, its amount and its feature lines", () => {
    const { getByRole, getByText } = renderWithProvider(
      <PricingCard
        name="Growth"
        price="$29"
        period="/month"
        features={FEATURES}
      />,
    );

    expect(getByRole("heading", { level: 3, name: "Growth" })).toBeDefined();
    expect(getByText("$29")).toBeDefined();
    expect(getByText("/month")).toBeDefined();
    expect(getByText("10,000 messages")).toBeDefined();
  });

  it("forwards the plan name's heading level through titleAs", () => {
    const { getByRole } = renderWithProvider(
      <PricingCard name="Growth" price="$29" titleAs="h4" />,
    );

    expect(getByRole("heading", { level: 4, name: "Growth" }).tagName).toBe(
      "H4",
    );
  });

  it("says which lines are not included, in wording as well as in style", () => {
    const { getByText } = renderWithProvider(
      <PricingCard name="Growth" price="$29" features={FEATURES} />,
    );

    expect(getByText(/Audit log/).textContent).toContain("(not included)");
  });

  it("badges a recommended plan and takes the badge from its props", () => {
    const { getByText, container } = renderWithProvider(
      <PricingCard
        name="Growth"
        price="$29"
        badge="Most popular"
        highlighted
      />,
    );

    expect(getByText("Most popular")).toBeDefined();
    expect(container.innerHTML).toContain("ring-primary");
  });

  it("recommends only the plan that says it is recommended", () => {
    // `highlighted` used to resolve through the cascade, so a theme that set it
    // recommended every plan. It is an instance prop now.
    const { container } = renderWithProvider(
      <>
        <PricingCard id="plain" name="Starter" price="$9" />
        <PricingCard id="recommended" name="Growth" price="$29" highlighted />
      </>,
    );

    expect(
      (container.querySelector("#recommended") as HTMLElement).className,
    ).toContain("ring-primary");
    expect(
      (container.querySelector("#plain") as HTMLElement).className,
    ).not.toContain("ring-primary");
  });

  it("renders configured actions through the framework Button", () => {
    const { getByRole } = renderWithProvider(
      <PricingCard
        name="Growth"
        price="$29"
        primaryAction={{ label: "Choose Growth", href: "/signup" }}
      />,
    );

    expect(getByRole("link", { name: "Choose Growth" })).toBeDefined();
  });

  it("resolves its surface and density through configuration", () => {
    const { container } = renderWithProvider(
      <PricingCard name="Growth" price="$29" />,
      {
        config: makeComponentConfig("pricingcard", {
          variant: "elevated",
          size: "sm",
        }),
      },
    );

    expect(container.innerHTML).toContain("shadow-md");
    expect(container.querySelector(".p-4")).not.toBeNull();
    // The recommendation is not a configuration option, so the theme cannot
    // mark every plan it renders as the recommended one.
    expect(container.innerHTML).not.toContain("ring-primary");
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <PricingCard name="Growth" price="$29" features={FEATURES} />,
    );

    expect(html).toContain("Growth");
    expect(html).toContain("10,000 messages");
    expectHydrationClean(
      <PricingCard name="Growth" price="$29" features={FEATURES} />,
    );
  });
});

/**
 * Behaviour tests for the Testimonials pattern.
 */
describe("Testimonials", () => {
  const QUOTES = [
    {
      quote: "We cut campaign setup from hours to minutes.",
      name: "Ama Boateng",
      role: "Head of Growth, Kora Retail",
    },
    { quote: "The reporting is what sold us.", name: "Luis Ortega" },
  ];

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
