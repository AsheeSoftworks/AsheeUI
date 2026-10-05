/**
 * Behaviour tests for the native EmptyState.
 *
 * The tests state the component's contract: the state draws its heading and its
 * supporting line, the badge exists only to hold an icon, the tone colours it, a
 * configured action follows its destination through the platform's URL handler, and
 * the tone, the density and the panel resolve through the configuration cascade.
 */

import { fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { openDestination } from "../../utils/open-destination";
import { EmptyState } from "./EmptyState";

jest.mock("../../utils/open-destination", () => ({
  openDestination: jest.fn(),
}));

/**
 * Render a state inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderState(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Read the classes the rendered state carries.
 *
 * @param view - The rendered tree.
 * @param testID - The state's test identifier.
 * @returns Its class string.
 */
function classesOf(view: ReturnType<typeof render>, testID: string): string {
  return (view.getByTestId(testID).props as { className?: string })
    .className as string;
}

describe("Native EmptyState", () => {
  it("renders what the region is and what a reader can do about it", async () => {
    const view = await renderState(
      <EmptyState
        testID="state"
        title="No campaigns match that filter"
        description="Try a different name."
      />,
    );

    expect(view.getByText("No campaigns match that filter")).toBeTruthy();
    expect(view.getByText("Try a different name.")).toBeTruthy();
  });

  it("draws the badge only when it has an icon to hold", async () => {
    const withoutIcon = await renderState(
      <EmptyState testID="state" title="Nothing here yet" />,
    );

    expect(classesOf(withoutIcon, "state")).not.toContain("rounded-full");
  });

  it("colours the badge by the state's tone", async () => {
    const view = await renderState(
      <EmptyState
        testID="state"
        type="warning"
        title="Nothing here yet"
        icon={<Text>!</Text>}
      />,
    );

    const badge = view.getByText("!").parent?.props as
      | { className?: string }
      | undefined;

    expect(badge?.className).toContain("bg-warning/10");
    expect(badge?.className).toContain("text-warning");
  });

  it("stays out of the announcement unless it replaces content", async () => {
    const quiet = await renderState(
      <EmptyState testID="state" title="Nothing here yet" />,
    );
    const announced = await renderState(
      <EmptyState testID="state" title="Nothing here yet" role="status" />,
    );

    expect(quiet.getByTestId("state").props.accessibilityRole).toBeUndefined();
    expect(
      quiet.getByTestId("state").props.accessibilityLiveRegion,
    ).toBeUndefined();
    // A state that waits takes no role on the platform; its live region is what
    // tells assistive technology that there is something new to read.
    expect(
      announced.getByTestId("state").props.accessibilityRole,
    ).toBeUndefined();
    expect(announced.getByTestId("state").props.accessibilityLiveRegion).toBe(
      "polite",
    );
  });

  it("announces a state that interrupts as an alert", async () => {
    const view = await renderState(
      <EmptyState testID="state" title="Nothing here yet" role="alert" />,
    );

    expect(view.getByTestId("state").props.accessibilityRole).toBe("alert");
    expect(view.getByTestId("state").props.accessibilityLiveRegion).toBe(
      "assertive",
    );
  });

  it("follows a configured action's destination through the platform", async () => {
    const view = await renderState(
      <EmptyState
        testID="state"
        title="No campaigns yet"
        primaryAction={{ label: "Create one", href: "https://example.com/new" }}
      />,
    );

    await fireEvent.press(view.getByRole("button", { name: "Create one" }));

    expect(openDestination).toHaveBeenCalledWith("https://example.com/new");
  });

  it("draws a supporting action as a control the framework marks as secondary", async () => {
    const view = await renderState(
      <EmptyState
        testID="state"
        title="No campaigns yet"
        secondaryAction={{ label: "Read the guide" }}
      />,
    );

    const secondary = view.getByRole("button", { name: "Read the guide" });

    expect((secondary.props as { className?: string }).className).toContain(
      "border",
    );
  });

  it("resolves its tone, density and panel through the cascade", async () => {
    const view = await renderState(
      <EmptyState testID="state" title="Nothing here yet" />,
      {
        components: { emptystate: { type: "error", size: "lg", panel: true } },
      },
    );

    expect(classesOf(view, "state")).toContain("p-10");
    expect(classesOf(view, "state")).toContain("bg-background");
    expect(classesOf(view, "state")).toContain("rounded-md");
  });

  it("lets an instance prop win over the configured value, and the consumer's classes win last", async () => {
    const view = await renderState(
      <EmptyState
        testID="state"
        title="Nothing here yet"
        size="sm"
        className="mt-2"
      />,
      { components: { emptystate: { size: "lg" } } },
    );

    expect(classesOf(view, "state")).toContain("p-4");
    expect(classesOf(view, "state")).not.toContain("p-10");
    expect(classesOf(view, "state").endsWith("mt-2")).toBe(true);
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      render(<EmptyState title="Nothing here yet" />),
    ).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
