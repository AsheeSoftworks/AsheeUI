/**
 * Behaviour tests for the native PricingCard pattern.
 *
 * The tests state the pattern's contract: the plan, its amount and its feature lines are
 * rendered in the framework's own card, the plan's name heads the card so a reader can move
 * between plans, an excluded line is stated in words as well as in style, a recommended
 * plan is marked by the card's own accent, configured actions render through the
 * framework's button and follow their destination, and the three options resolve through
 * the configuration cascade.
 */

import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { openDestination } from "../../utils/open-destination";
import { Text } from "../text/Text";
import { PricingCard } from "./PricingCard";

jest.mock("../../utils/open-destination", () => ({
  openDestination: jest.fn(),
}));

/** The plan a test card describes. */
const FEATURES = [
  { label: "10,000 messages" },
  { label: "Audit log", included: false },
];

/**
 * A piece of the consumer's own content, standing in for a footnote below the actions.
 *
 * @returns The rendered note.
 */
function Fees() {
  return (
    <Text role="caption" tone="muted">
      Prices exclude VAT
    </Text>
  );
}

/**
 * Render a pricing card inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderCard(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Read the classes a rendered element carries, as separate class names.
 *
 * @param view - The rendered tree.
 * @param testID - The element's test identifier.
 * @returns Its class names.
 */
function classesOf(view: RenderResult, testID: string): string[] {
  const className = String(
    (view.getByTestId(testID).props as { className?: string }).className ?? "",
  );

  return className.split(" ").filter(Boolean);
}

describe("Native PricingCard", () => {
  it("renders the plan, its amount and its feature lines", async () => {
    const view = await renderCard(
      <PricingCard
        name="Growth"
        price="$29"
        period="/month"
        features={FEATURES}
      />,
    );

    // The plan's name heads the card, so a reader can move from plan to plan.
    expect(view.getByRole("header", { name: "Growth" })).toBeTruthy();
    expect(view.getByText("$29")).toBeTruthy();
    expect(view.getByText("/month")).toBeTruthy();
    expect(view.getByText("10,000 messages")).toBeTruthy();
    expect(view.getByText("✓", { includeHiddenElements: true })).toBeTruthy();
  });

  it("states an excluded line in words as well as in style", async () => {
    const view = await renderCard(
      <PricingCard name="Growth" price="$29" features={FEATURES} />,
    );

    expect(view.getByText("✕", { includeHiddenElements: true })).toBeTruthy();
    expect(
      view.getByText(/not included/, { includeHiddenElements: true }),
    ).toBeTruthy();
    // An included line says nothing of the sort.
    expect(
      view.queryByText(/10,000 messages \(not included\)/, {
        includeHiddenElements: true,
      }),
    ).toBeNull();
  });

  it("badges a recommended plan and marks it with the card's own accent", async () => {
    const plain = await renderCard(
      <PricingCard testID="plain" name="Growth" price="$29" />,
    );
    const recommended = await renderCard(
      <PricingCard
        testID="recommended"
        name="Growth"
        price="$29"
        badge="Most popular"
        highlighted
      />,
    );

    expect(recommended.getByText("Most popular")).toBeTruthy();
    // The mark is the card's accent rather than a colour of the pattern's own, so the
    // token is the exact class the accent adds.
    expect(classesOf(recommended, "recommended")).toContain("border-primary");
    expect(classesOf(plain, "plain")).not.toContain("border-primary");
  });

  it("renders configured actions through the framework's button", async () => {
    const view = await renderCard(
      <PricingCard
        name="Growth"
        price="$29"
        primaryAction={{
          label: "Choose Growth",
          href: "https://example.com/signup",
        }}
        secondaryAction={{ label: "Talk to sales" }}
      />,
    );

    expect(view.getByRole("button", { name: "Choose Growth" })).toBeTruthy();
    expect(view.getByRole("button", { name: "Talk to sales" })).toBeTruthy();

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Choose Growth" }));
    });

    expect(openDestination).toHaveBeenCalledWith("https://example.com/signup");
  });

  it("resolves its treatment, density and recommendation through the cascade", async () => {
    const view = await renderCard(
      <PricingCard testID="plan" name="Growth" price="$29" />,
      {
        components: {
          pricingcard: { variant: "elevated", size: "sm", highlighted: true },
        },
      },
    );

    const classes = classesOf(view, "plan");

    // An elevated plan keeps the raised surface's colour, which is the platform's filled
    // surface: the platform's card paints no shadow.
    expect(classes).toContain("bg-secondary");
    expect(classes).toContain("p-3");
    expect(classes).toContain("border-primary");
  });

  it("renders with only a plan and an amount", async () => {
    const view = await renderCard(<PricingCard name="Free" price="$0" />);

    expect(view.getByRole("header", { name: "Free" })).toBeTruthy();
    expect(view.getByText("$0")).toBeTruthy();
    expect(view.queryByText("✓", { includeHiddenElements: true })).toBeNull();
  });

  it("renders content it is given below the actions", async () => {
    const view = await renderCard(
      <PricingCard name="Growth" price="$29">
        <Fees />
      </PricingCard>,
    );

    expect(view.getByText("Prices exclude VAT")).toBeTruthy();
  });
});
