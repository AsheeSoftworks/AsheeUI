import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderWithProvider,
} from "../../test";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders a decorative placeholder hidden from assistive technology", () => {
    const { container } = renderWithProvider(
      <Skeleton id="placeholder" className="h-4 w-40" />,
    );
    const placeholder = container.querySelector("#placeholder") as HTMLElement;

    expect(placeholder).toHaveAttribute("aria-hidden", "true");
    expect(placeholder).not.toHaveAttribute("role");
    expect(placeholder).not.toHaveAttribute("aria-busy");
  });

  it("exposes a labelled busy status when it stands in for a loading region", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Skeleton isBusy label="Loading invoices" />,
    );
    const status = getByRole("status");

    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).not.toHaveAttribute("aria-hidden");
    expect(getByText("Loading invoices")).toBeInTheDocument();
  });

  it("shimmers only through the reduced-motion-safe class", () => {
    const animated = renderWithProvider(
      <Skeleton id="animated" />,
    );
    const still = renderWithProvider(
      <Skeleton id="still" isAnimated={false} />,
    );
    const animatedClass = (
      animated.container.querySelector("#animated") as HTMLElement
    ).className;
    const stillClass = (still.container.querySelector("#still") as HTMLElement)
      .className;

    expect(animatedClass).toContain("motion-safe:animate-pulse");
    expect(animatedClass).not.toMatch(/(^|\s)animate-pulse/);
    expect(stillClass).not.toContain("animate-pulse");
  });

  it("honours the configured animation setting", () => {
    const { container } = renderWithProvider(<Skeleton id="configured" />, {
      config: makeComponentConfig("skeleton", { isAnimated: false }),
    });
    const placeholder = container.querySelector(
      "#configured",
    ) as HTMLElement;

    expect(placeholder.className).not.toContain("animate-pulse");
  });

  it("uses the registered radius and honours a radius override", () => {
    const { container } = renderWithProvider(
      <>
        <Skeleton id="default-radius" />
        <Skeleton id="round" radius="full" />
      </>,
    );

    expect(container.querySelector("#default-radius")?.className).toContain(
      "rounded-sm",
    );
    expect(container.querySelector("#round")?.className).toContain(
      "rounded-full",
    );
  });

  it("composes with consumer sizing classes", () => {
    const { container } = renderWithProvider(
      <Skeleton id="sized" className="h-24 w-64" />,
    );
    const placeholder = container.querySelector("#sized") as HTMLElement;

    expect(placeholder.className).toContain("h-24");
    expect(placeholder.className).toContain("w-64");
  });

  it("hydrates its server markup without a mismatch", () => {
    expectHydrationClean(<Skeleton className="h-4 w-40" />);
    expectHydrationClean(<Skeleton isBusy label="Loading invoices" />);
  });
});
