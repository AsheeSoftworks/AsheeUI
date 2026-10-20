import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderWithProvider,
  within,
} from "../../../test";
import { Breadcrumb } from "./Breadcrumb";

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

describe("Breadcrumb", () => {
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
