import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  expectFocused,
  fireEvent,
  makeConfig,
  renderWithProvider,
  userEvent,
} from "../../../test";
import { Link } from "./Link";

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
