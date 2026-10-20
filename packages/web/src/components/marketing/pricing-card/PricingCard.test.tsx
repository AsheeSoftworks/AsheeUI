/**
 * Behaviour tests for the PricingCard pattern.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../../test";
import { PricingCard } from "./PricingCard";

const FEATURES = [
  { label: "10,000 messages" },
  { label: "Audit log", included: false },
];

describe("PricingCard", () => {
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
