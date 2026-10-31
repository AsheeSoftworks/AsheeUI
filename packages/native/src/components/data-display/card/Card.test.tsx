/**
 * Behaviour tests for the native Card.
 *
 * The tests state the component's contract: it renders its headline and its
 * supporting text, it places its header and its footer around the body, it
 * becomes a control when it is pressable, and every option resolves through the
 * configuration cascade.
 */

import { resolveCardVariant as sharedResolveCardVariant } from "@asheeui/core";
import {
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import { Card } from "./Card";
import { resolveNativeCardVariant } from "./card-config";

/**
 * Render a card inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderCard(ui: ReactElement, config?: object) {
  return render(<AsheeUIProvider config={config}>{ui}</AsheeUIProvider>);
}

/**
 * Read the classes a rendered element carries.
 *
 * @param view - The rendered tree.
 * @param testID - The element's test identifier.
 * @returns Its class string.
 */
function classesOf(view: RenderResult, testID: string): string {
  return (view.getByTestId(testID).props as { className?: string })
    .className as string;
}

describe("Native Card", () => {
  it("renders its headline and its supporting text", async () => {
    const view = await renderCard(
      <Card testID="card" title="Inbox" description="12 unread" />,
    );

    expect(view.getByText("Inbox")).toBeTruthy();
    expect(view.getByText("12 unread")).toBeTruthy();
    expect(classesOf(view, "card")).toContain("p-4");
  });

  it("places the header, the body and the footer around the headline", async () => {
    const view = await renderCard(
      <Card
        testID="card"
        title="Inbox"
        header={<Text>Accent</Text>}
        footer={<Text>Open</Text>}>
        <Text>Body</Text>
      </Card>,
    );

    expect(view.getByText("Accent")).toBeTruthy();
    expect(view.getByText("Body")).toBeTruthy();
    expect(view.getByText("Open")).toBeTruthy();
  });

  it("announces itself as a control when it is pressable", async () => {
    const view = await renderCard(
      <Card
        testID="card"
        title="Inbox"
        isPressable
        onPress={() => undefined}
      />,
    );

    expect(view.getByRole("button", { name: "Inbox" })).toBeTruthy();
  });

  it("stays a plain surface when it is not pressable", async () => {
    const view = await renderCard(<Card testID="card" title="Inbox" />);

    expect(view.queryByRole("button")).toBeNull();
  });

  it("takes its treatment and its density from its props", async () => {
    const view = await renderCard(
      <Card
        testID="card"
        title="Inbox"
        variant="ghost"
        size="sm"
        radius="lg"
      />,
    );

    expect(classesOf(view, "card")).toContain("bg-transparent");
    expect(classesOf(view, "card")).toContain("p-3");
    expect(classesOf(view, "card")).toContain("rounded-lg");
    expect(classesOf(view, "card")).not.toContain("border-primary/40");
  });

  it("resolves its defaults through configuration", async () => {
    const view = await renderCard(<Card testID="card" title="Inbox" />, {
      components: { card: { variant: "faded", size: "lg", isPressable: true } },
    });

    expect(classesOf(view, "card")).toContain("bg-secondary/40");
    expect(classesOf(view, "card")).toContain("p-6");
    expect(view.getByRole("button", { name: "Inbox" })).toBeTruthy();
  });

  it("inherits the application's default treatment when no tier names one", async () => {
    const view = await renderCard(<Card testID="card" title="Inbox" />, {
      defaultVariant: "ghost",
    });

    // The registered defaults must not pin a treatment, or the application's default
    // would never reach the card.
    expect(classesOf(view, "card")).toContain("bg-transparent");
    expect(classesOf(view, "card")).not.toContain("border-border");
  });

  it("lets the card's component section win over the application default", async () => {
    const view = await renderCard(<Card testID="card" title="Inbox" />, {
      defaultVariant: "ghost",
      components: { card: { variant: "bordered" } },
    });

    // The section's surface wins, so the application's `ghost` background is gone. The
    // border's *colour* is the accent's either way — the two maps are deliberately separate
    // — so the class that says `border-border` is the one the merge drops, and the surface
    // is what this asserts.
    expect(classesOf(view, "card")).toContain("bg-background");
    expect(classesOf(view, "card")).not.toContain("bg-transparent");
  });

  it("lets an instance prop win over the configured value", async () => {
    const view = await renderCard(
      <Card testID="card" title="Inbox" size="sm" />,
      { components: { card: { size: "lg" } } },
    );

    expect(classesOf(view, "card")).toContain("p-3");
    expect(classesOf(view, "card")).not.toContain("p-6");
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderCard(
      <Card testID="card" title="Inbox" className="w-full" />,
    );

    expect(classesOf(view, "card").endsWith("w-full")).toBe(true);
  });

  it("resolves its surface through the rule both renderers read", () => {
    // The platform's spelling is a reference to the shared rule, not a second table: a
    // surface name that leaks across from the web resolves the same way on both.
    expect(resolveNativeCardVariant).toBe(sharedResolveCardVariant);
  });

  it("draws the picture the web card draws, with its alternative text", async () => {
    const view = await renderCard(
      <Card
        testID="card"
        title="Campaign"
        image={{ src: "https://example.com/cover.jpg", alt: "Campaign cover" }}
      />,
    );

    expect(view.getByLabelText("Campaign cover")).toBeTruthy();
  });

  it("accepts src and alt beside image, and body beside children", async () => {
    const view = await renderCard(
      <Card
        testID="card"
        title="Campaign"
        src="https://example.com/cover.jpg"
        alt="Campaign cover"
        body={<Text>Body copy</Text>}>
        <Text>Not rendered</Text>
      </Card>,
    );

    expect(view.getByLabelText("Campaign cover")).toBeTruthy();
    expect(view.getByText("Body copy")).toBeTruthy();
    expect(view.queryByText("Not rendered")).toBeNull();
  });

  it("refuses the press and reports the state when disabled", async () => {
    const onPress = jest.fn();
    const view = await renderCard(
      <Card
        testID="card"
        title="Inbox"
        isClickable
        isDisabled
        onPress={onPress}
      />,
    );
    const card = view.getByTestId("card");

    await fireEvent.press(card);

    expect(onPress).not.toHaveBeenCalled();
    expect(card.props.accessibilityState).toMatchObject({ disabled: true });
  });
});
