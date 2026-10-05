/**
 * Behaviour tests for the native LoadingState.
 *
 * The tests state the component's contract: the region says what is loading, it
 * announces itself politely rather than interrupting, it claims room so the screen
 * does not jump, it keeps the framework's spinner out of assistive technology because
 * the region already carries the news, and the label, the density and the room all
 * resolve through the configuration cascade.
 */

import { render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { View } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { LoadingState } from "./LoadingState";

/**
 * Render a loading region inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderLoading(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Read the classes the rendered region carries.
 *
 * @param view - The rendered tree.
 * @param testID - The region's test identifier.
 * @returns Its class string.
 */
function classesOf(view: ReturnType<typeof render>, testID: string): string {
  return (view.getByTestId(testID).props as { className?: string })
    .className as string;
}

describe("Native LoadingState", () => {
  it("says what is loading, rather than only that something is", async () => {
    const view = await renderLoading(
      <LoadingState
        testID="state"
        label="Loading invoices"
        description="This usually takes a moment."
      />,
    );

    expect(view.getByText("Loading invoices")).toBeTruthy();
    expect(view.getByText("This usually takes a moment.")).toBeTruthy();
  });

  it("announces that something is in progress, without interrupting", async () => {
    const view = await renderLoading(<LoadingState testID="state" />);

    expect(view.getByTestId("state").props.accessible).toBe(true);
    expect(view.getByTestId("state").props.accessibilityLiveRegion).toBe(
      "polite",
    );
    expect(view.getByTestId("state").props.accessibilityRole).toBeUndefined();
  });

  it("claims room so the screen does not jump when the content arrives", async () => {
    const view = await renderLoading(<LoadingState testID="state" />);

    expect(classesOf(view, "state")).toContain("min-h-24");
  });

  it("keeps the framework's spinner out of assistive technology, because the region carries the news", async () => {
    const view = await renderLoading(<LoadingState testID="state" />);

    expect(view.queryByRole("progressbar")).toBeNull();
  });

  it("accepts a consumer's own indicator in place of the spinner", async () => {
    const view = await renderLoading(
      <LoadingState
        testID="state"
        indicator={<View testID="own-indicator" />}
      />,
    );

    expect(view.getByTestId("own-indicator")).toBeTruthy();
  });

  it("resolves its label, density, room and panel through the cascade", async () => {
    const view = await renderLoading(<LoadingState testID="state" />, {
      components: {
        loadingstate: {
          label: "Fetching",
          size: "lg",
          minHeight: "xs",
          panel: true,
        },
      },
    });

    expect(view.getByText("Fetching")).toBeTruthy();
    expect(classesOf(view, "state")).toContain("py-12");
    expect(classesOf(view, "state")).toContain("min-h-16");
    expect(classesOf(view, "state")).toContain("bg-background");
  });

  it("lets an instance prop win over the configured value, and the consumer's classes win last", async () => {
    const view = await renderLoading(
      <LoadingState
        testID="state"
        size="sm"
        label="Loading"
        className="mt-2"
      />,
      { components: { loadingstate: { size: "lg", label: "Fetching" } } },
    );

    expect(view.getByText("Loading")).toBeTruthy();
    expect(classesOf(view, "state")).toContain("py-4");
    expect(classesOf(view, "state").endsWith("mt-2")).toBe(true);
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<LoadingState />)).rejects.toThrow(
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
