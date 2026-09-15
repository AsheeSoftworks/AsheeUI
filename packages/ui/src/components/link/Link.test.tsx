import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { queryOverlay, renderWithProvider } from "../../test";
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
        rel="noopener noreferrer"
      >
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
      href?: string;
      children?: ReactNode;
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

  it("removes the destination and exposes a disabled state", () => {
    const { getByText } = renderWithProvider(
      <Link href="/docs" disabled>
        Docs
      </Link>,
    );
    const anchor = getByText("Docs").closest("a");

    expect(anchor).not.toBeNull();
    expect(anchor).not.toHaveAttribute("href");
    expect(anchor).toHaveAttribute("aria-disabled", "true");
    expect(queryOverlay("link")).toBeNull();
  });

  it("renders leading and trailing content around the label", () => {
    const { getByRole } = renderWithProvider(
      <Link
        href="/docs"
        startIcon={<span>start-icon</span>}
        endIcon={<span>end-icon</span>}
      >
        Docs
      </Link>,
    );
    const link = getByRole("link", { name: /Docs/ });

    expect(link.textContent).toContain("start-icon");
    expect(link.textContent).toContain("end-icon");
  });
});
