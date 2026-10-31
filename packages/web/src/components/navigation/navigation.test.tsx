import { createRef, type ComponentProps, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { FOOTER_BOTTOM_LINKS_CLASS } from "../../styles/footer";
import { NAVBAR_BRAND_CLASS } from "../../styles/navbar";
import { NAVBAR_BRAND_TEXT_CLASS } from "../../styles/portable";
import {
  createUser,
  expectFocused,
  expectHydrationClean,
  expectState,
  fireEvent,
  makeComponentConfig,
  makeConfig,
  pressArrow,
  pressKey,
  renderToServerString,
  renderWithProvider,
  userEvent,
  within,
} from "../../test";
import { Breadcrumb } from "./breadcrumb/Breadcrumb";
import { Footer } from "./footer/Footer";
import { Link } from "./link/Link";
import { Navbar } from "./navbar/Navbar";
import { Pagination } from "./pagination/Pagination";
import { getPaginationRange } from "./pagination/pagination.helpers";
import { Sidebar } from "./sidebar/Sidebar";
import { useSidebarCollapse } from "./sidebar/sidebar-collapse";
import { Tabs } from "./tabs/Tabs";

describe("Breadcrumb", () => {
  const TRAIL = [
    { label: "Invoices", href: "/invoices" },
    { label: "March", href: "/invoices/2026-03" },
    { label: "INV-0042" },
  ];

  /** Stand-in router link, the shape a consumer substitutes for the anchor. */
  function RouterLink({
    href,
    className,
    children,
  }: {
    href?: string | undefined;
    className?: string | undefined;
    children?: ReactNode | undefined;
  }) {
    return (
      <a data-router-link="true" href={href} className={className}>
        {children}
      </a>
    );
  }

  /** The gap utilities an element's class list declares. */
  function gapsOf(element: HTMLElement): string[] {
    return element.className
      .split(/\s+/)
      .filter((className) => /^gap-/.test(className))
      .sort();
  }

  it("is a named navigation landmark over an ordered list", () => {
    const { getByRole, container } = renderWithProvider(
      <Breadcrumb items={TRAIL} />,
    );
    const nav = getByRole("navigation", { name: "Breadcrumb" });

    expect(within(nav).getByRole("list")).toBeInTheDocument();
    expect(container.querySelectorAll("ol > li")).toHaveLength(3);
  });

  it("links every step but the current location", () => {
    const { getAllByRole, getByText } = renderWithProvider(
      <Breadcrumb items={TRAIL} />,
    );

    expect(getAllByRole("link")).toHaveLength(2);
    expect(getByText("Invoices").closest("a")).toHaveAttribute(
      "href",
      "/invoices",
    );
  });

  it("presents the current location as the page rather than as a link", () => {
    const { getByText } = renderWithProvider(<Breadcrumb items={TRAIL} />);
    const current = getByText("INV-0042");

    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.closest("a")).toBeNull();
  });

  it("accepts an explicit current location", () => {
    const { getByText } = renderWithProvider(
      <Breadcrumb
        items={[
          { label: "Root", href: "/" },
          { label: "Section", href: "/section", isCurrent: true },
          { label: "Leaf", href: "/leaf" },
        ]}
      />,
    );
    const current = getByText("Section");

    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.closest("a")).toBeNull();
    expect(getByText("Leaf").closest("a")).toHaveAttribute("href", "/leaf");
  });

  it("keeps the separators out of the accessibility tree", () => {
    const { getAllByRole, container } = renderWithProvider(
      <Breadcrumb items={TRAIL} />,
    );

    expect(getAllByRole("listitem")).toHaveLength(3);
    expect(getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Invoices",
      "March",
    ]);
    expect(container.querySelectorAll('span[aria-hidden="true"]').length).toBe(
      2,
    );
  });

  it("accepts a separator of its own", () => {
    const { getAllByText } = renderWithProvider(
      <Breadcrumb items={TRAIL} separator={<span>/</span>} />,
    );

    expect(getAllByText("/")).toHaveLength(2);
  });

  it("passes a router link component through", () => {
    const { container } = renderWithProvider(
      <Breadcrumb
        items={[
          { label: "Home", href: "/", component: RouterLink },
          { label: "Leaf" },
        ]}
      />,
    );

    expect(container.querySelector('[data-router-link="true"]')).not.toBeNull();
  });

  // The trail-level substitution was documented but did not exist: a consumer that keeps
  // a router had to repeat `component` on every step. It is offered once for the trail,
  // as the Navbar and the Footer offer it.
  it("applies a trail-level link substitution to every linked step", () => {
    const { container } = renderWithProvider(
      <Breadcrumb
        link={{ component: RouterLink }}
        items={[
          { label: "Home", href: "/" },
          { label: "Invoices", href: "/invoices" },
          { label: "INV-0042" },
        ]}
      />,
    );

    expect(
      container.querySelectorAll('[data-router-link="true"]'),
    ).toHaveLength(2);
  });

  it("lets a step's own component win over the trail's substitution", () => {
    function StepLink({
      href,
      className,
      children,
    }: {
      href?: string | undefined;
      className?: string | undefined;
      children?: ReactNode | undefined;
    }) {
      return (
        <a data-step-link="true" href={href} className={className}>
          {children}
        </a>
      );
    }

    const { container } = renderWithProvider(
      <Breadcrumb
        link={{ component: RouterLink }}
        items={[
          { label: "Home", href: "/" },
          { label: "Invoices", href: "/invoices", component: StepLink },
          { label: "INV-0042" },
        ]}
      />,
    );

    expect(
      container.querySelectorAll('[data-router-link="true"]'),
    ).toHaveLength(1);
    expect(container.querySelectorAll('[data-step-link="true"]')).toHaveLength(
      1,
    );
  });

  // The current location was drawn with a bare icon and a fixed gap, so at most one
  // density matched its neighbours. It now uses Link's own icon slot and Link's own size
  // map — the gap and the icon box a linked step beside it gets.
  it("gives the current step's icon the same slot and gap as a linked step", () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const { container, unmount } = renderWithProvider(
        <Breadcrumb
          size={size}
          items={[
            { label: "Invoices", href: "/invoices", icon: <span>mark</span> },
            { label: "INV-0042", icon: <span>mark</span> },
          ]}
        />,
      );

      const linked = container.querySelector("a") as HTMLElement;
      const current = container.querySelector(
        '[aria-current="page"]',
      ) as HTMLElement;
      const linkedSlot = linked.firstElementChild as HTMLElement;
      const currentSlot = current.firstElementChild as HTMLElement;

      expect(currentSlot.className).toBe(linkedSlot.className);
      expect(gapsOf(current)).toEqual(gapsOf(linked));

      unmount();
    }
  });

  it("resolves the configured scale and colour", () => {
    const { getByRole } = renderWithProvider(<Breadcrumb items={TRAIL} />, {
      config: makeComponentConfig("breadcrumb", {
        size: "lg",
        color: "danger",
      }),
    });
    const nav = getByRole("navigation");

    expect(nav.className).toContain("text-base");
    expect(nav.innerHTML).toContain("danger");
  });

  it("hydrates its server markup without a mismatch", () => {
    expectHydrationClean(<Breadcrumb items={TRAIL} />);
    expectHydrationClean(
      <Breadcrumb items={TRAIL} separator={<span>/</span>} />,
    );
  });
});

/**
 * Behaviour tests for the Footer pattern.
 */
describe("Footer", () => {
  const GROUPS = [
    {
      title: "Product",
      links: [{ label: "Campaigns", href: "/campaigns" }],
    },
    {
      title: "Company",
      links: [{ label: "About", href: "/about" }],
    },
  ];

  it("renders a contentinfo landmark with a named navigation per group", () => {
    const { getByRole } = renderWithProvider(<Footer groups={GROUPS} />);

    expect(getByRole("contentinfo")).toBeDefined();
    expect(getByRole("navigation", { name: "Product" })).toBeDefined();
    expect(getByRole("navigation", { name: "Company" })).toBeDefined();
  });

  it("renders the brand, the description and the copyright line", () => {
    const { getByText } = renderWithProvider(
      <Footer
        brand="Ashee SMS"
        description="Campaign messaging for growing teams."
        copyright="Ashee Softworks"
      />,
    );

    expect(getByText("Ashee SMS")).toBeDefined();
    expect(getByText("Campaign messaging for growing teams.")).toBeDefined();
    expect(getByText("Ashee Softworks")).toBeDefined();
  });

  it("renders the legal and social rows as named landmarks", () => {
    const { getByRole } = renderWithProvider(
      <Footer
        legal={[{ label: "Privacy", href: "/privacy" }]}
        social={[{ label: "Mastodon", href: "https://example.social/@ashee" }]}
      />,
    );

    expect(getByRole("navigation", { name: "Legal" })).toBeDefined();
    expect(getByRole("navigation", { name: "Social" })).toBeDefined();
  });

  // The legal row's layout is the footer's own row class. The literal it used to carry
  // duplicated that constant verbatim, so the two could drift apart silently.
  it("lays the legal row out with the footer's own row class", () => {
    const { getByRole } = renderWithProvider(
      <Footer legal={[{ label: "Privacy", href: "/privacy" }]} />,
    );
    const nav = getByRole("navigation", { name: "Legal" });
    const list = nav.querySelector("ul") as HTMLElement;

    expect(list.className).toBe(FOOTER_BOTTOM_LINKS_CLASS);
  });

  // A landmark's name is consumer-facing text: "Legal" and "Social" are the defaults a
  // consumer gets, not names it is stuck with.
  it("takes the legal and social landmark names from props", () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <Footer
        legal={[{ label: "Privacidad", href: "/privacidad" }]}
        social={[{ label: "Mastodon", href: "https://example.social/@ashee" }]}
        legalLabel="Aviso legal"
        socialLabel="Redes sociales"
      />,
    );

    expect(getByRole("navigation", { name: "Aviso legal" })).toBeDefined();
    expect(getByRole("navigation", { name: "Redes sociales" })).toBeDefined();
    expect(queryByRole("navigation", { name: "Legal" })).toBeNull();
    expect(queryByRole("navigation", { name: "Social" })).toBeNull();
  });

  it("forwards the native title attribute like every other element attribute", () => {
    const { getByRole } = renderWithProvider(
      <Footer copyright="Ashee" title="Site footer" />,
    );

    expect(getByRole("contentinfo").getAttribute("title")).toBe("Site footer");
  });

  it("renders an action area in the brand column", () => {
    const { getByText } = renderWithProvider(
      <Footer brand="Ashee SMS" newsletter={<span>Newsletter signup</span>} />,
    );

    expect(getByText("Newsletter signup")).toBeDefined();
  });

  it("renders nothing it was not given", () => {
    const { container } = renderWithProvider(<Footer copyright="Ashee" />);

    expect(container.querySelectorAll("nav")).toHaveLength(0);
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<Footer groups={GROUPS} />, {
      config: makeComponentConfig("footer", {
        variant: "muted",
        spacing: "sm",
        containerSize: "xl",
      }),
    });
    const footer = container.querySelector("footer") as HTMLElement;

    expect(footer.className).toContain("bg-secondary/50");
    expect(footer.className).toContain("py-6");
    expect(container.querySelector(".max-w-7xl")).not.toBeNull();
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <Footer brand="Ashee SMS" groups={GROUPS} copyright="Ashee Softworks" />,
    );

    expect(html).toContain("<footer");
    expect(html).toContain('aria-label="Product"');
    expectHydrationClean(<Footer brand="Ashee SMS" groups={GROUPS} />);
  });
});

describe("Link", () => {
  it("renders an anchor with its destination and accessible name", () => {
    const { getByRole } = renderWithProvider(<Link href="/docs">Docs</Link>);
    const link = getByRole("link", { name: "Docs" });

    expect(link).toHaveAttribute("href", "/docs");
  });

  it("forwards native target and rel attributes", () => {
    const { getByRole } = renderWithProvider(
      <Link
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer">
        External
      </Link>,
    );
    const link = getByRole("link", { name: "External" });

    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("supports substituting the underlying link implementation", () => {
    function CustomLink({
      href,
      children,
    }: {
      href?: string | undefined;
      children?: ReactNode | undefined;
    }) {
      return (
        <a data-testid="custom-link" href={href}>
          {children}
        </a>
      );
    }

    const { getByTestId } = renderWithProvider(
      <Link href="/docs" component={CustomLink}>
        Docs
      </Link>,
    );

    expect(getByTestId("custom-link")).toHaveAttribute("href", "/docs");
  });

  // TanStack Router and React Router name a destination `to`. Before this, a project using either had to
  // write <Link href={...} component={RouterLink} componentProps={{ to: ... }} /> at every call site.
  it("accepts `to` as a destination for a router component", () => {
    function RouterLink({
      to,
      children,
    }: {
      to?: string | undefined;
      children?: ReactNode | undefined;
    }) {
      return (
        <a data-testid="router-link" href={to}>
          {children}
        </a>
      );
    }

    const { getByTestId } = renderWithProvider(
      <Link to="/concepts/cascade" component={RouterLink}>
        The cascade
      </Link>,
    );

    expect(getByTestId("router-link")).toHaveAttribute(
      "href",
      "/concepts/cascade",
    );
  });

  it("treats `to` as the href when no router component is given", () => {
    const { getByRole } = renderWithProvider(
      <Link to="/components">Components</Link>,
    );

    expect(getByRole("link", { name: "Components" })).toHaveAttribute(
      "href",
      "/components",
    );
  });

  // A disabled link used to drop its `href`, which turned the anchor into a generic
  // element: the link role and the tab stop went with it, so `aria-disabled` stopped
  // meaning "disabled link" and a keyboard user could never reach it. The element keeps
  // its destination and its role, and the press is refused in the click handler instead
  // — the same contract the rest of the library applies to a disabled control.
  it("keeps a disabled link reachable and announced, and refuses its press", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { getByRole } = renderWithProvider(
      <Link href="/docs" disabled onClick={onClick}>
        Docs
      </Link>,
    );
    const link = getByRole("link", { name: "Docs" });

    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveAttribute("aria-disabled", "true");

    await user.tab();
    expectFocused(link);

    // `fireEvent.click` reports whether the event's default action survived.
    expect(fireEvent.click(link)).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
  });

  // The colour is the last tier of the cascade: the global default resolves before the
  // component's own fallback, which is what the documentation now states.
  it("resolves its colour through the global default before the fallback", () => {
    const { getByRole } = renderWithProvider(<Link href="/docs">Docs</Link>, {
      config: makeConfig({ defaultColor: "danger" }),
    });

    expect(getByRole("link", { name: "Docs" }).className).toContain(
      "text-danger",
    );
  });

  it("renders leading and trailing content around the label", () => {
    const { getByRole } = renderWithProvider(
      <Link
        href="/docs"
        startIcon={<span>start-icon</span>}
        endIcon={<span>end-icon</span>}>
        Docs
      </Link>,
    );
    const link = getByRole("link", { name: /Docs/ });

    expect(link.textContent).toContain("start-icon");
    expect(link.textContent).toContain("end-icon");
  });
});

/**
 * Behaviour tests for the Navbar pattern.
 *
 * The mobile panel is a disclosure: the control names itself, reports its state
 * with `aria-expanded`, points at the panel with `aria-controls` only while that
 * panel exists, and Escape closes the open panel and returns focus to the
 * control. Escape anywhere else in the bar is not the bar's to take.
 */
describe("Navbar", () => {
  const LINKS = [
    { label: "Campaigns", href: "/campaigns", isActive: true },
    { label: "Contacts", href: "/contacts" },
  ];

  it("renders a named navigation landmark inside a banner landmark", () => {
    const { getByRole } = renderWithProvider(<Navbar links={LINKS} />);

    expect(getByRole("banner")).toBeDefined();
    expect(getByRole("navigation", { name: "Main" })).toBeDefined();
  });

  it("marks the current page on the link rather than styling it alone", () => {
    const { getAllByRole } = renderWithProvider(<Navbar links={LINKS} />);
    const [campaigns, contacts] = getAllByRole("link");

    expect(campaigns!.getAttribute("aria-current")).toBe("page");
    expect(contacts!.getAttribute("aria-current")).toBeNull();
  });

  it("renders the brand as a link when it has a destination", () => {
    const { getByRole } = renderWithProvider(
      <Navbar brand="Ashee SMS" brandHref="/" links={LINKS} />,
    );

    expect(getByRole("link", { name: "Ashee SMS" }).getAttribute("href")).toBe(
      "/",
    );
  });

  // The brand's layout and its typography are two decisions. Stating the whole string on
  // the wrapper and again on the link inside it repeated the same layout classes on two
  // nested elements, so the layout stays on the wrapper and the type goes on the link.
  it("splits the brand's layout from its typographic treatment", () => {
    const { getByRole } = renderWithProvider(
      <Navbar brand="Ashee SMS" brandHref="/" links={LINKS} />,
    );
    const link = getByRole("link", { name: "Ashee SMS" });
    const wrapper = link.parentElement as HTMLElement;

    expect(NAVBAR_BRAND_CLASS).toContain("shrink-0");
    expect(NAVBAR_BRAND_CLASS).not.toContain("font-semibold");
    expect(NAVBAR_BRAND_TEXT_CLASS).toContain("font-semibold");

    expect(wrapper.className).toBe(NAVBAR_BRAND_CLASS);
    expect(link.className).toContain(NAVBAR_BRAND_TEXT_CLASS);
  });

  it("forwards the native title attribute like every other element attribute", () => {
    const { getByRole } = renderWithProvider(
      <Navbar links={LINKS} title="Primary navigation" />,
    );

    expect(getByRole("banner").getAttribute("title")).toBe(
      "Primary navigation",
    );
  });

  // A bar with more destinations than room used to let the links run over the action
  // region. The list can shrink and its links wrap, so the bar degrades instead.
  it("keeps the link list shrinkable and wrapping rather than colliding", () => {
    const many = Array.from({ length: 12 }, (_, index) => ({
      label: `Destination ${index + 1}`,
      href: `/destination-${index + 1}`,
    }));
    const { container } = renderWithProvider(
      <Navbar links={many} actions={<span>Sign in</span>} />,
    );
    const list = container.querySelector(
      'nav[aria-label="Main"] > ul',
    ) as HTMLElement;

    expect(list.className).toContain("min-w-0");
    expect(list.className).toContain("flex-wrap");
  });

  it("opens and closes the mobile panel from a labelled control", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProvider(
      <Navbar links={LINKS} mobileLabel="Open navigation" />,
    );
    const toggle = getByRole("button", { name: "Open navigation" });

    expectState(toggle, { expanded: false });
    expect(getByRole("navigation", { name: "Main" })).toBeDefined();

    await user.click(toggle);

    expectState(toggle, { expanded: true });

    await user.click(toggle);

    expectState(toggle, { expanded: false });
  });

  // `aria-controls` may only name an element that exists. The panel is rendered while it
  // is open, so the attribute is only present while it resolves — it used to name an id
  // that nothing carried whenever the panel was closed.
  it("points its control at the panel only while the panel exists", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProvider(
      <Navbar links={LINKS} mobileLabel="Open navigation" />,
    );
    const toggle = getByRole("button", { name: "Open navigation" });

    expect(toggle).not.toHaveAttribute("aria-controls");

    await user.click(toggle);

    const controls = toggle.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    expect(document.getElementById(controls ?? "")).not.toBeNull();

    await user.click(toggle);

    expect(toggle).not.toHaveAttribute("aria-controls");
  });

  it("closes the mobile panel on Escape and restores focus to the control", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProvider(<Navbar links={LINKS} />);
    const toggle = getByRole("button", { name: "Menu" });

    await user.click(toggle);
    expectState(toggle, { expanded: true });

    await user.keyboard("{Escape}");

    expectState(toggle, { expanded: false });
    expect(document.activeElement).toBe(toggle);
  });

  // Escape used to be the bar's key: whatever was being typed in the second row lost
  // focus to the toggle, even with the panel closed.
  it("leaves Escape inside the second row to the field that owns it", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProvider(
      <Navbar
        links={LINKS}
        secondary={<input type="search" aria-label="Search destinations" />}
      />,
    );
    const toggle = getByRole("button", { name: "Menu" });
    const search = getByRole("searchbox", { name: "Search destinations" });

    // With the panel closed the bar does nothing at all.
    await user.click(search);
    await user.keyboard("campaigns");
    await user.keyboard("{Escape}");

    expectFocused(search);

    // With the panel open the field is still outside it, so the key is still the field's.
    await user.click(toggle);
    expectState(toggle, { expanded: true });
    await user.click(search);
    await user.keyboard("{Escape}");

    expectFocused(search);
    expectState(toggle, { expanded: true });
  });

  it("leaves the panel open state to a consumer that owns it", async () => {
    const user = userEvent.setup();
    const seen: boolean[] = [];
    const { getByRole } = renderWithProvider(
      <Navbar
        links={LINKS}
        mobileOpen={false}
        onMobileOpenChange={(next) => seen.push(next)}
      />,
    );
    const toggle = getByRole("button", { name: "Menu" });

    await user.click(toggle);

    expect(seen).toEqual([true]);
    expectState(toggle, { expanded: false });
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<Navbar links={LINKS} />, {
      config: makeComponentConfig("navbar", {
        position: "static",
        variant: "bordered",
        containerSize: "xl",
      }),
    });
    const header = container.querySelector("header") as HTMLElement;

    expect(header.className).not.toContain("sticky");
    expect(header.className).toContain("border-b");
    expect(container.querySelector(".max-w-7xl")).not.toBeNull();
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <Navbar brand="Ashee SMS" links={LINKS} actions={<span>Sign in</span>} />,
    );

    expect(html).toContain('aria-current="page"');
    expect(html).toContain("Sign in");
    expectHydrationClean(<Navbar brand="Ashee SMS" links={LINKS} />);
  });
});

describe("Pagination", () => {
  it("is a named navigation landmark over an ordered list", () => {
    const { getByRole } = renderWithProvider(
      <Pagination page={1} pageCount={3} />,
    );
    const nav = getByRole("navigation", { name: "Pagination" });

    expect(within(nav).getByRole("list")).toBeInTheDocument();
  });

  it("marks the current page and leaves the others unmarked", () => {
    const { getByRole } = renderWithProvider(
      <Pagination page={2} pageCount={3} />,
    );

    expect(getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(getByRole("button", { name: "Page 3" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("reports the chosen page and ignores the current one", async () => {
    const user = createUser();
    const onPageChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Pagination page={2} pageCount={5} onPageChange={onPageChange} />,
    );

    await user.click(getByRole("button", { name: "Page 3" }));

    expect(onPageChange).toHaveBeenCalledWith(3);

    await user.click(getByRole("button", { name: "Page 2" }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it("moves with the previous and next controls and disables them at the edges", async () => {
    const user = createUser();
    const onPageChange = vi.fn();
    const first = renderWithProvider(
      <Pagination page={1} pageCount={5} onPageChange={onPageChange} />,
    );

    expect(
      within(first.container).getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();

    await user.click(
      within(first.container).getByRole("button", { name: "Next page" }),
    );

    expect(onPageChange).toHaveBeenCalledWith(2);

    const last = renderWithProvider(
      <Pagination page={5} pageCount={5} onPageChange={onPageChange} />,
    );

    expect(
      within(last.container).getByRole("button", { name: "Next page" }),
    ).toBeDisabled();
  });

  it("collapses a long range and keeps the gaps out of the accessibility tree", () => {
    const { container, getByRole, queryByRole } = renderWithProvider(
      <Pagination page={5} pageCount={20} />,
    );
    const gaps = container.querySelectorAll('span[aria-hidden="true"]');

    expect(gaps).toHaveLength(2);
    expect(gaps[0]?.textContent).toBe("\u2026");

    expect(queryByRole("button", { name: "Page 7" })).toBeNull();
    expect(getByRole("button", { name: "Page 20" })).toBeInTheDocument();
  });

  it("renders links when destinations are supplied", () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <Pagination
        page={2}
        pageCount={3}
        hrefForPage={(target) => `/invoices?page=${target}`}
      />,
    );

    expect(getByRole("link", { name: "Page 3" })).toHaveAttribute(
      "href",
      "/invoices?page=3",
    );
    expect(getByRole("link", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(getByRole("link", { name: "Previous page" })).toHaveAttribute(
      "href",
      "/invoices?page=1",
    );
    expect(queryByRole("button", { name: /Page/ })).toBeNull();
  });

  // The link branch used a fixed `min-w-8 h-8` control box, so `size` (and
  // `components.pagination.size`) only reached the button branch. The link
  // controls now read the same resolved size through a static class map.
  it("applies the size prop to link controls", () => {
    const { getByRole } = renderWithProvider(
      <Pagination
        page={2}
        pageCount={3}
        size="lg"
        hrefForPage={(target) => `/invoices?page=${target}`}
      />,
    );

    expect(getByRole("link", { name: "Page 3" }).className).toContain("h-10");
  });

  it("applies the configured size to link controls", () => {
    const { getByRole } = renderWithProvider(
      <Pagination
        page={2}
        pageCount={3}
        hrefForPage={(target) => `/invoices?page=${target}`}
      />,
      { config: makeComponentConfig("pagination", { size: "sm" }) },
    );

    expect(getByRole("link", { name: "Page 3" }).className).toContain("h-7");
  });

  // An unavailable link kept its `href`, so keyboard activation still went to a
  // page the collection does not have. It now has no destination and no tab stop.
  it("drops the destination and tab stop of an unavailable link", () => {
    const { getByLabelText } = renderWithProvider(
      <Pagination
        page={1}
        pageCount={5}
        hrefForPage={(target) => `/invoices?page=${target}`}
      />,
    );
    // Without a destination the element is no longer a link, which is the
    // point: it is announced as unavailable and cannot be focused or followed.
    const previous = getByLabelText("Previous page");

    expect(previous.tagName).toBe("A");
    expect(previous).not.toHaveAttribute("href");
    expect(previous).toHaveAttribute("aria-disabled", "true");
    expect(previous).toHaveAttribute("tabindex", "-1");
  });

  // Link mode had no press handler, so `onPageChange` was dead there. Both modes
  // now report the chosen page; the link still follows its destination.
  it("reports the chosen page from a link control as well", async () => {
    const user = createUser();
    const onPageChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Pagination
        page={2}
        pageCount={5}
        onPageChange={onPageChange}
        hrefForPage={(target) => `/invoices?page=${target}`}
      />,
    );

    const pageThree = getByRole("link", { name: "Page 3" });
    // Keep jsdom from attempting the navigation the anchor would perform.
    pageThree.addEventListener("click", (event) => event.preventDefault());
    await user.click(pageThree);

    expect(onPageChange).toHaveBeenCalledWith(3);

    const pageTwo = getByRole("link", { name: "Page 2" });
    pageTwo.addEventListener("click", (event) => event.preventDefault());
    await user.click(pageTwo);

    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  // The link branch rendered `Link` with no substitution, so a paginated
  // collection with real addresses could not keep its router.
  it("substitutes the link component for every control", () => {
    function RouterLink({
      href,
      ...rest
    }: ComponentProps<"span"> & { href?: string }) {
      return <span data-router-href={href} {...rest} />;
    }

    const { getByLabelText, queryByRole } = renderWithProvider(
      <Pagination
        page={2}
        pageCount={3}
        hrefForPage={(target) => `/invoices?page=${target}`}
        link={{ component: RouterLink, props: { "data-router": "true" } }}
      />,
    );

    const pageThree = getByLabelText("Page 3");

    expect(pageThree).toHaveAttribute("data-router-href", "/invoices?page=3");
    expect(pageThree).toHaveAttribute("data-router", "true");
    expect(queryByRole("link")).toBeNull();
  });

  it("offers first and last controls when asked", () => {
    const { queryByRole } = renderWithProvider(
      <Pagination page={2} pageCount={3} />,
    );

    expect(queryByRole("button", { name: "First page" })).toBeNull();

    const withEdges = renderWithProvider(
      <Pagination page={2} pageCount={3} showEdges />,
    );

    expect(
      within(withEdges.container).getByRole("button", { name: "First page" }),
    ).toBeInTheDocument();
    expect(
      within(withEdges.container).getByRole("button", { name: "Last page" }),
    ).toBeInTheDocument();
  });

  it("calculates a range around the current page", () => {
    expect(getPaginationRange(1, 10)).toEqual([1, 2, "ellipsis", 10]);
    expect(getPaginationRange(5, 10)).toEqual([
      1,
      "ellipsis",
      4,
      5,
      6,
      "ellipsis",
      10,
    ]);
    expect(getPaginationRange(10, 10)).toEqual([1, "ellipsis", 9, 10]);
    expect(getPaginationRange(2, 4)).toEqual([1, 2, 3, 4]);
    expect(getPaginationRange(1, 1)).toEqual([1]);
    expect(getPaginationRange(1, 0)).toEqual([]);
  });

  it("resolves the configured control tokens", () => {
    const { getByRole } = renderWithProvider(
      <Pagination page={1} pageCount={3} />,
      {
        config: makeComponentConfig("pagination", {
          color: "danger",
          variant: "solid",
        }),
      },
    );

    expect(getByRole("button", { name: "Page 2" }).className).toContain(
      "danger",
    );
  });

  it("hydrates its server markup without a mismatch", () => {
    expectHydrationClean(<Pagination page={5} pageCount={20} />);
    expectHydrationClean(
      <Pagination
        page={2}
        pageCount={3}
        hrefForPage={(target) => `/invoices?page=${target}`}
      />,
    );
  });
});

describe("Sidebar", () => {
  const ITEMS = [
    { id: "home", label: "Home" },
    { id: "settings", label: "Settings" },
  ];

  /**
   * The application's own control, built from the state the column publishes.
   *
   * It stands in for the button a consumer draws — in the footer, or anywhere else inside the column — which is
   * what replaced the control the framework used to render itself.
   */
  function ConsumerControl({
    onChange,
  }: {
    onChange?: (value: boolean) => void;
  }) {
    const { isCollapsed, collapsible, toggleCollapse } = useSidebarCollapse();

    onChange?.(isCollapsed);

    return (
      <button type="button" disabled={!collapsible} onClick={toggleCollapse}>
        {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      </button>
    );
  }

  const ITEMS_WITH_HREF = [
    { id: "home", label: "Home", href: "/home" },
    { id: "settings", label: "Settings", href: "/settings" },
  ];

  const DISABLED_SECTION = [
    {
      id: "main",
      label: "Main",
      disabled: true,
      items: [{ id: "home", label: "Home", href: "/home" }],
    },
  ];

  it("renders a navigation landmark with its title and items", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Sidebar items={ITEMS} title="Workspace" />,
    );

    expect(getByRole("navigation")).toBeInTheDocument();
    expect(getByText("Workspace")).toBeInTheDocument();
    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Settings")).toBeInTheDocument();
  });

  it("reports the selected item key", async () => {
    const user = createUser();
    const onSelect = vi.fn();
    const { getByText } = renderWithProvider(
      <Sidebar items={ITEMS} onSelect={onSelect} />,
    );

    await user.click(getByText("Home"));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "home" }),
    );
  });

  // The column states its collapse state and draws no control of its own: the button belongs to the
  // application, which builds it from `useSidebarCollapse` (or from the controlled props).
  it("draws no collapse control of its own", () => {
    const { container } = renderWithProvider(
      <Sidebar items={ITEMS} title="Workspace" />,
    );

    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  // The column used to draw its own "Collapse sidebar" button. The control belongs to the application now,
  // and the column publishes the state that control reads.
  it("reports a collapse request from the application's own control", async () => {
    const user = createUser();
    const onCollapseChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Sidebar
        items={ITEMS}
        onCollapseChange={onCollapseChange}
        footer={<ConsumerControl />}
      />,
    );

    await user.click(getByRole("button", { name: "Collapse sidebar" }));

    expect(onCollapseChange).toHaveBeenCalledWith(true);
  });

  // Defect register (M1, D-12): when `onCollapseChange` is provided without a
  // controlled `isCollapsed`, the control reported the request but the sidebar
  // never updated its own state.
  it("updates its own collapsed state when a change callback is provided without a controlled value", async () => {
    const user = createUser();
    const onCollapseChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Sidebar
        items={ITEMS}
        onCollapseChange={onCollapseChange}
        footer={<ConsumerControl />}
      />,
    );

    await user.click(getByRole("button", { name: "Collapse sidebar" }));

    expect(onCollapseChange).toHaveBeenCalledWith(true);
    // The column followed its own state, so the control now offers to expand.
    expect(getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
  });

  it("honours a controlled collapsed state", () => {
    const { getByRole } = renderWithProvider(
      <Sidebar items={ITEMS} isCollapsed footer={<ConsumerControl />} />,
    );

    expect(getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
  });

  it("reports header back navigation", async () => {
    const user = createUser();
    const onBack = vi.fn();
    const { getByRole } = renderWithProvider(
      <Sidebar items={ITEMS} title="Workspace" onBack={onBack} />,
    );

    await user.click(getByRole("button", { name: "Go back" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // A folded column hides its title, so a header that held nothing else was an empty band with a dashed rule
  // under it. Nothing to show means no header; a back control is something to show.
  it("draws no header when a folded column has only a title, and keeps it while expanded", () => {
    const expanded = renderWithProvider(
      <Sidebar items={ITEMS} title="Workspace" />,
    );
    const collapsed = renderWithProvider(
      <Sidebar items={ITEMS} title="Workspace" isCollapsed />,
    );

    expect(expanded.container.querySelector("aside > div")).not.toBeNull();
    expect(collapsed.container.querySelector("aside > div")).toBeNull();
    expect(collapsed.container.querySelector("aside > nav")).not.toBeNull();
  });

  it("refuses to fold, and says so, when collapse is disabled", async () => {
    const user = createUser();
    const onCollapseChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Sidebar
        items={ITEMS}
        collapsible={false}
        onCollapseChange={onCollapseChange}
        footer={<ConsumerControl />}
      />,
    );
    const control = getByRole("button", { name: "Collapse sidebar" });

    // The control reads `collapsible` and disables itself rather than offering an action the column refuses.
    expect(control).toBeDisabled();

    await user.click(control);

    expect(onCollapseChange).not.toHaveBeenCalled();
  });

  it("publishes a state that cannot move outside a column, and says so once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const onChange = vi.fn();

    try {
      const { getByRole } = renderWithProvider(
        <ConsumerControl onChange={onChange} />,
      );
      const control = getByRole("button", { name: "Collapse sidebar" });

      expect(control).toBeDisabled();
      expect(onChange).toHaveBeenCalledWith(false);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("no Sidebar was found"),
      );
    } finally {
      warn.mockRestore();
    }
  });

  // Defect register (M1, D-11): the active item was marked only by classes.
  // `COMP-044` requires the active-item state to be exposed, and the testing
  // matrix expects `aria-current` on the active navigation item.
  it("exposes the active item with aria-current", () => {
    const { getByRole } = renderWithProvider(
      <Sidebar
        items={[
          { id: "home", label: "Home", href: "/home" },
          { id: "settings", label: "Settings", href: "/settings" },
        ]}
        title="Workspace"
        activeKey="settings"
      />,
    );

    expect(getByRole("link", { name: "Settings" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  // A collapsed row rendered only its icon, and the tooltip was
  // `aria-describedby` — a description, not a name — so the row was unnamed.
  it("keeps an accessible name on a collapsed row", () => {
    const { getByRole } = renderWithProvider(
      <Sidebar items={ITEMS_WITH_HREF} isCollapsed />,
    );
    const home = getByRole("link", { name: "Home" });

    expect(home.querySelector(".sr-only")?.textContent).toBe("Home");
  });

  // `animated` was registered and documented but the width transition was
  // hard-coded, so `components.sidebar.animated: false` did nothing.
  it("emits the width transition only when animated", () => {
    const animated = renderWithProvider(<Sidebar items={ITEMS} />);
    expect(animated.container.querySelector("aside")?.className).toContain(
      "transition-all",
    );

    const still = renderWithProvider(
      <Sidebar items={ITEMS} animated={false} />,
    );
    expect(still.container.querySelector("aside")?.className).not.toContain(
      "transition-all",
    );
  });

  it("reads the configured animated flag", () => {
    const { container } = renderWithProvider(<Sidebar items={ITEMS} />, {
      config: makeComponentConfig("sidebar", { animated: false }),
    });

    expect(container.querySelector("aside")?.className).not.toContain(
      "transition-all",
    );
  });

  // `SidebarSection.disabled` was declared and documented, and ignored: every
  // row of a disabled section still acted.
  it("disables every row of a disabled section", async () => {
    const user = createUser();
    const onSelect = vi.fn();
    const { getByText } = renderWithProvider(
      <Sidebar items={DISABLED_SECTION} onSelect={onSelect} />,
    );
    const home = getByText("Home").closest("a");

    expect(home).not.toBeNull();
    expect(home).not.toHaveAttribute("href");
    expect(home).toHaveAttribute("aria-disabled", "true");

    await user.click(home as HTMLElement);

    expect(onSelect).not.toHaveBeenCalled();
  });

  // The footer lived inside the collapse-button branches, so with `collapsible={false}` neither branch ran and
  // the footer disappeared. It belongs to the consumer, and it is drawn whatever the collapse settings are.
  it("renders the footer when collapse is disabled", () => {
    const { getByText } = renderWithProvider(
      <Sidebar
        items={ITEMS}
        collapsible={false}
        footer={<span>Account</span>}
      />,
    );

    expect(getByText("Account")).toBeInTheDocument();
  });

  // A control in the footer is how a collapsed column is unfolded again, so the footer cannot be hidden with
  // the labels: it is drawn in both states, and the control keeps its place.
  it("keeps the footer, and the control in it, while the column is collapsed", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Sidebar
        items={ITEMS}
        isCollapsed
        footer={
          <div>
            <span>Account</span>
            <ConsumerControl />
          </div>
        }
      />,
    );

    expect(getByText("Account")).toBeInTheDocument();
    expect(getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
  });

  // The `aria-label` prop lands on the aside, and the inner `nav` had no name,
  // so two sidebars were indistinguishable in a landmark list.
  it("names the navigation landmark", () => {
    const { getByRole } = renderWithProvider(
      <Sidebar items={ITEMS} navLabel="Workspace navigation" />,
    );

    expect(
      getByRole("navigation", { name: "Workspace navigation" }),
    ).toBeInTheDocument();
  });

  it("names the navigation landmark by default", () => {
    const { getByRole } = renderWithProvider(<Sidebar items={ITEMS} />);

    expect(
      getByRole("navigation", { name: "Sidebar navigation" }),
    ).toBeInTheDocument();
  });

  // Sidebar was the only navigation component that was not a `forwardRef`.
  it("forwards its ref to the aside and keeps its display name", () => {
    const ref = createRef<HTMLElement>();
    const { container } = renderWithProvider(
      <Sidebar ref={ref} items={ITEMS} />,
    );

    expect(ref.current).toBe(container.querySelector("aside"));
    expect(Sidebar.displayName).toBe("Sidebar");
  });
});

describe("Tabs", () => {
  const TABS = [
    { id: "first", label: "First", content: <p>First panel</p> },
    { id: "second", label: "Second", content: <p>Second panel</p> },
  ];

  it("exposes tablist, tab and tabpanel semantics", () => {
    const { getByRole } = renderWithProvider(<Tabs tabs={TABS} />);

    expect(getByRole("tablist")).toBeInTheDocument();
    expect(getByRole("tabpanel")).toBeInTheDocument();
  });

  it("selects the first tab by default and keeps only it focusable", () => {
    const { getByRole, getAllByRole } = renderWithProvider(
      <Tabs tabs={TABS} />,
    );
    const first = getByRole("tab", { name: "First" });
    const second = getByRole("tab", { name: "Second" });

    expect(first).toHaveAttribute("aria-selected", "true");
    expect(first).toHaveAttribute("tabindex", "0");
    expect(second).toHaveAttribute("aria-selected", "false");
    expect(second).toHaveAttribute("tabindex", "-1");
    expect(getAllByRole("tab")).toHaveLength(2);
  });

  it("switches the active panel on click and reports the change", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole, getByText, queryByText } = renderWithProvider(
      <Tabs tabs={TABS} onChange={onChange} />,
    );

    expect(getByText("First panel")).toBeInTheDocument();
    expect(queryByText("Second panel")).toBeNull();

    await user.click(getByRole("tab", { name: "Second" }));

    expect(onChange).toHaveBeenCalledWith("second");
    expect(getByRole("tab", { name: "Second" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(getByText("Second panel")).toBeInTheDocument();
    expect(queryByText("First panel")).toBeNull();
  });

  it("moves between tabs with arrow keys and jumps with Home and End", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Tabs tabs={TABS} />);
    const first = getByRole("tab", { name: "First" });
    const second = getByRole("tab", { name: "Second" });

    first.focus();
    await pressArrow(user, "ArrowRight");
    expect(second).toHaveAttribute("aria-selected", "true");

    await pressKey(user, "Home");
    expect(first).toHaveAttribute("aria-selected", "true");

    await pressKey(user, "End");
    expect(second).toHaveAttribute("aria-selected", "true");

    // Arrow navigation wraps around the ends of the tab list.
    await pressArrow(user, "ArrowRight");
    expect(first).toHaveAttribute("aria-selected", "true");

    await pressArrow(user, "ArrowLeft");
    expect(second).toHaveAttribute("aria-selected", "true");
  });

  it("respects a controlled active tab", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Tabs tabs={TABS} activeId="first" onChange={onChange} />,
    );
    const second = getByRole("tab", { name: "Second" });

    await user.click(second);

    expect(onChange).toHaveBeenCalledWith("second");
    expect(second).toHaveAttribute("aria-selected", "false");
  });

  // Only the selected panel is mounted, so a trigger pointing at any other
  // panel named an element that was never rendered.
  it("points only the selected trigger at the mounted panel", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Tabs tabs={TABS} />);
    const first = getByRole("tab", { name: "First" });
    const second = getByRole("tab", { name: "Second" });

    expect(first).toHaveAttribute("aria-controls", getByRole("tabpanel").id);
    expect(second).not.toHaveAttribute("aria-controls");

    await user.click(second);

    expect(second).toHaveAttribute("aria-controls", getByRole("tabpanel").id);
    expect(first).not.toHaveAttribute("aria-controls");
  });

  // A controlled `activeId` naming no tab used to leave every trigger
  // `aria-selected="false"` and `tabIndex={-1}`: the bar had no reachable tab,
  // while the panel fell back to the first tab. Selection now falls back too.
  it("falls back to the first tab when activeId names no tab", () => {
    const { getByRole } = renderWithProvider(
      <Tabs tabs={TABS} activeId="missing" />,
    );

    expect(getByRole("tab", { name: "First" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(getByRole("tab", { name: "First" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(getByRole("tab", { name: "Second" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(getByRole("tabpanel")).toHaveTextContent("First panel");
  });
});
