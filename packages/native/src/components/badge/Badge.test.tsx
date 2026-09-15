/**
 * Behaviour tests for the native Badge.
 *
 * The tests state the component's contract: it renders one compact label, it
 * resolves the treatment and the colour together, and every option resolves
 * through the configuration cascade.
 */

import { type RenderResult, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Badge } from "./Badge";

/**
 * Render a badge inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderBadge(ui: ReactElement, config?: object) {
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

describe("Native Badge", () => {
  it("renders its label as a compact token", async () => {
    const view = await renderBadge(<Badge testID="badge">Paid</Badge>);

    expect(view.getByText("Paid")).toBeTruthy();
    expect(classesOf(view, "badge")).toContain("bg-primary/10");
    expect(classesOf(view, "badge")).toContain("rounded-full");
  });

  it("resolves the treatment and the colour together", async () => {
    const view = await renderBadge(
      <Badge testID="badge" variant="solid" color="danger">
        Overdue
      </Badge>,
    );

    expect(classesOf(view, "badge")).toContain("bg-danger");
    expect(
      (view.getByText("Overdue").props as { className?: string }).className,
    ).toContain("text-background");
  });

  it("takes its density and its radius from its props", async () => {
    const view = await renderBadge(
      <Badge testID="badge" size="lg" radius="md">
        Paid
      </Badge>,
    );

    expect(classesOf(view, "badge")).toContain("rounded-md");
    expect(
      (view.getByText("Paid").props as { className?: string }).className,
    ).toContain("text-base");
  });

  it("resolves its defaults through configuration", async () => {
    const view = await renderBadge(<Badge testID="badge">Paid</Badge>, {
      components: { badge: { variant: "solid", color: "success" } },
    });

    expect(classesOf(view, "badge")).toContain("bg-success");
  });

  it("lets an instance prop win over the configured value", async () => {
    const view = await renderBadge(
      <Badge testID="badge" color="warning">
        Due soon
      </Badge>,
      { components: { badge: { color: "danger" } } },
    );

    expect(classesOf(view, "badge")).toContain("bg-warning/10");
    expect(classesOf(view, "badge")).not.toContain("bg-danger/10");
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderBadge(
      <Badge testID="badge" className="self-end">
        Paid
      </Badge>,
    );

    expect(classesOf(view, "badge").endsWith("self-end")).toBe(true);
  });
});
