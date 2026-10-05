/**
 * Behaviour tests for the PricingCard pattern.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
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

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(
      <PricingCard name="Growth" price="$29" />,
      {
        config: makeComponentConfig("pricingcard", {
          variant: "elevated",
          size: "sm",
          highlighted: true,
        }),
      },
    );

    expect(container.innerHTML).toContain("shadow-md");
    expect(container.innerHTML).toContain("ring-primary");
    expect(container.querySelector(".p-4")).not.toBeNull();
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
