/**
 * Behaviour tests for the native Text.
 *
 * The tests state the component's contract: a role resolves a whole treatment, a
 * tone resolves a semantic colour, alignment and truncation are options, and every
 * option resolves through the configuration cascade. Renders are awaited and
 * queries come from the rendered view, as the platform's renderer requires.
 */

import { type RenderResult, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Text } from "./Text";

/**
 * Render text inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderText(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
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

describe("Native Text", () => {
  it("renders its content with the default role", async () => {
    const view = await renderText(
      <Text testID="text">Updated a moment ago</Text>,
    );

    expect(view.getByTestId("text")).toHaveTextContent("Updated a moment ago");
    expect(classesOf(view, "text")).toContain("text-base");
    expect(classesOf(view, "text")).toContain("text-foreground");
  });

  it("resolves a role to a whole treatment", async () => {
    const view = await renderText(
      <Text testID="text" role="heading-lg">
        Campaigns
      </Text>,
    );

    expect(classesOf(view, "text")).toContain("text-2xl");
    expect(classesOf(view, "text")).toContain("font-semibold");
  });

  it("resolves a tone to a semantic colour", async () => {
    const view = await renderText(
      <Text testID="text" role="body-sm" tone="muted">
        Nothing yet
      </Text>,
    );

    expect(classesOf(view, "text")).toContain("text-foreground/60");
  });

  it("aligns and truncates the way the platform does", async () => {
    const view = await renderText(
      <Text testID="text" align="center" truncate>
        A very long label
      </Text>,
    );

    expect(classesOf(view, "text")).toContain("text-center");
    expect(view.getByTestId("text").props.numberOfLines).toBe(1);
  });

  it("resolves its defaults through configuration", async () => {
    const view = await renderText(<Text testID="text">Save</Text>, {
      components: { text: { role: "label", tone: "primary" } },
    });

    expect(classesOf(view, "text")).toContain("text-sm");
    expect(classesOf(view, "text")).toContain("font-medium");
    expect(classesOf(view, "text")).toContain("text-primary");
  });

  it("lets an instance prop win over the configured value", async () => {
    const view = await renderText(
      <Text testID="text" role="body-sm">
        Save
      </Text>,
      { components: { text: { role: "heading-xl" } } },
    );

    expect(classesOf(view, "text")).toContain("text-sm");
    expect(classesOf(view, "text")).not.toContain("text-3xl");
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderText(
      <Text testID="text" className="mb-2">
        Save
      </Text>,
    );

    expect(classesOf(view, "text").endsWith("mb-2")).toBe(true);
  });
});
