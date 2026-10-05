/**
 * Behaviour tests for the native Accordion.
 *
 * The tests state the component's contract: the items are drawn in order with their
 * triggers, an item opens and closes, only one stays open unless the consumer asks
 * otherwise, a consumer who owns the open state is told about every change and decides
 * what happens, a disabled item responds to nothing and says so, a closed panel is not in
 * the tree at all, and the treatment, the density and the rounding resolve through the
 * configuration cascade.
 */

import { fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Accordion } from "./Accordion";

/** The sections the tests open and close. */
const ITEMS = [
  { id: "plan", title: "Which plan suits me?", content: "The standard plan." },
  {
    id: "refund",
    title: "Can I get a refund?",
    subtitle: "Within thirty days",
    content: "Within thirty days of purchase.",
  },
  {
    id: "support",
    title: "How do I reach support?",
    content: "Support replies within a day.",
  },
];

/**
 * Render an accordion inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderAccordion(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

describe("Native Accordion", () => {
  it("draws every item's trigger, with its supporting line", async () => {
    const view = await renderAccordion(
      <Accordion testID="faq" items={ITEMS} />,
    );

    expect(view.getByText("Which plan suits me?")).toBeTruthy();
    expect(view.getByText("Can I get a refund?")).toBeTruthy();
    expect(view.getByText("Within thirty days")).toBeTruthy();
    expect(view.getByText("How do I reach support?")).toBeTruthy();
  });

  it("opens an item when its trigger is pressed", async () => {
    const view = await renderAccordion(
      <Accordion testID="faq" items={ITEMS} />,
    );

    expect(view.queryByText("The standard plan.")).toBeNull();

    await fireEvent.press(
      view.getByRole("button", { name: "Which plan suits me?" }),
    );

    expect(view.getByText("The standard plan.")).toBeTruthy();
    expect(
      view.getByRole("button", { name: "Which plan suits me?" }).props
        .accessibilityState,
    ).toMatchObject({ expanded: true });
  });

  it("closes the item that was open when another one is opened", async () => {
    const view = await renderAccordion(
      <Accordion testID="faq" items={ITEMS} />,
    );

    await fireEvent.press(
      view.getByRole("button", { name: "Which plan suits me?" }),
    );
    await fireEvent.press(
      view.getByRole("button", { name: /Can I get a refund\?/ }),
    );

    expect(view.queryByText("The standard plan.")).toBeNull();
    expect(view.getByText("Within thirty days of purchase.")).toBeTruthy();
  });

  it("keeps every open item open when the consumer allows more than one", async () => {
    const view = await renderAccordion(
      <Accordion testID="faq" items={ITEMS} allowMultiple />,
    );

    await fireEvent.press(
      view.getByRole("button", { name: "Which plan suits me?" }),
    );
    await fireEvent.press(
      view.getByRole("button", { name: /Can I get a refund\?/ }),
    );

    expect(view.getByText("The standard plan.")).toBeTruthy();
    expect(view.getByText("Within thirty days of purchase.")).toBeTruthy();
  });

  it("reports every change to a consumer who owns the open state, and decides nothing itself", async () => {
    const onValueChange = jest.fn();
    const view = await renderAccordion(
      <Accordion
        testID="faq"
        items={ITEMS}
        value={[]}
        onValueChange={onValueChange}
      />,
    );

    await fireEvent.press(
      view.getByRole("button", { name: "How do I reach support?" }),
    );

    expect(onValueChange).toHaveBeenCalledWith(["support"]);
    // The consumer owns the state, so the panel stays closed until they say otherwise.
    expect(view.queryByText("Support replies within a day.")).toBeNull();
  });

  it("opens the items it was told to open at first", async () => {
    const view = await renderAccordion(
      <Accordion testID="faq" items={ITEMS} defaultValue="plan" />,
    );

    expect(view.getByText("The standard plan.")).toBeTruthy();
  });

  it("responds to nothing and reports itself disabled when an item is disabled", async () => {
    const onValueChange = jest.fn();
    const view = await renderAccordion(
      <Accordion
        testID="faq"
        items={[{ ...ITEMS[0], disabled: true }]}
        value={[]}
        onValueChange={onValueChange}
      />,
    );
    const trigger = view.getByRole("button", {
      name: "Which plan suits me?",
    });

    await fireEvent.press(trigger);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger.props.accessibilityState).toMatchObject({ disabled: true });
  });

  it("takes a closed panel out of the tree rather than hiding it", async () => {
    const view = await renderAccordion(
      <Accordion testID="faq" items={ITEMS} />,
    );

    // A panel that is drawn but invisible would still be reachable by a screen reader,
    // which is what the web's `inert` prevents; here the panel is not drawn at all.
    expect(
      view.queryByText("The standard plan.", { includeHiddenElements: true }),
    ).toBeNull();
  });

  it("resolves its treatment, density and rounding through the cascade", async () => {
    const view = await renderAccordion(
      <Accordion testID="faq" items={ITEMS} />,
      {
        components: { accordion: { variant: "bordered", size: "lg" } },
      },
    );
    const container = (view.getByTestId("faq").props as { className?: string })
      .className as string;
    const trigger = view.getByRole("button", {
      name: "Which plan suits me?",
    });

    expect(container).toContain("border");
    expect((trigger.props as { className?: string }).className).toContain(
      "px-6",
    );
  });

  it("resolves a treatment the accordion has none for to the one it documents", async () => {
    const view = await renderAccordion(
      <Accordion testID="faq" items={ITEMS} />,
      {
        defaultVariant: "solid",
      },
    );
    const container = (view.getByTestId("faq").props as { className?: string })
      .className as string;

    expect(container).toContain("gap-3");
    expect(container).not.toContain("solid");
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<Accordion items={ITEMS} />)).rejects.toThrow(
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
