import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderWithProvider,
  within,
} from "../../test";
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
  href?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a data-router-link="true" href={href} className={className}>
      {children}
    </a>
  );
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
    expect(
      container.querySelectorAll('span[aria-hidden="true"]').length,
    ).toBe(2);
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
          { label: "Home", href: "/", linkComponent: RouterLink },
          { label: "Leaf" },
        ]}
      />,
    );

    expect(container.querySelector('[data-router-link="true"]')).not.toBeNull();
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
