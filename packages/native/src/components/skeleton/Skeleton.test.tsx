/**
 * Behaviour tests for the native Skeleton.
 *
 * The tests state the component's contract: a placeholder is decoration unless it is
 * declared busy, its corners resolve through the configuration cascade, its size comes
 * from the classes the consumer writes, and its pulse is optional. Renders are awaited
 * and queries come from the rendered view, as the platform's renderer requires.
 *
 * The pulse is asserted through the wrapper the animator owns rather than through a
 * class, because that is the platform's mechanism: a class cannot animate here, so a
 * test that looked for one would be testing something the platform never runs.
 */

import { type RenderResult, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Skeleton } from "./Skeleton";

/**
 * Render a placeholder inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderSkeleton(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Find the rendered placeholder surface.
 *
 * The hidden-element flag is not incidental: the placeholder is hidden from assistive
 * technology by default, exactly as the web skeleton is, so asking for visible
 * elements only would be asking for something the component never claims.
 *
 * @param view - The rendered tree.
 * @param testID - The surface's test identifier.
 * @returns The surface's props.
 */
function surfaceOf(view: RenderResult, testID: string) {
  return view.getByTestId(testID, { includeHiddenElements: true }).props;
}

/**
 * Read the classes the rendered surface carries.
 *
 * @param view - The rendered tree.
 * @param testID - The surface's test identifier.
 * @returns Its class string.
 */
function classesOf(view: RenderResult, testID: string): string {
  return (surfaceOf(view, testID) as { className?: string })
    .className as string;
}

describe("Native Skeleton", () => {
  it("renders a placeholder, and keeps it out of assistive technology by default", async () => {
    const view = await renderSkeleton(
      <Skeleton testID="skeleton" className="h-4 w-40" />,
    );
    const surface = surfaceOf(view, "skeleton");

    expect(classesOf(view, "skeleton")).toContain("bg-secondary/60");
    expect(surface.accessibilityElementsHidden).toBe(true);
    expect(surface.importantForAccessibility).toBe("no-hide-descendants");
    expect(view.queryByRole("progressbar")).toBeNull();
  });

  it("takes its shape from the classes the consumer writes", async () => {
    const view = await renderSkeleton(
      <Skeleton testID="skeleton" className="h-4 w-40" />,
    );

    expect(classesOf(view, "skeleton")).toContain("h-4");
    expect(classesOf(view, "skeleton")).toContain("w-40");
  });

  it("becomes a labelled busy status when it stands in for loading", async () => {
    const view = await renderSkeleton(
      <Skeleton testID="skeleton" isBusy label="Loading invoices" />,
    );
    const status = view.getByRole("progressbar", {
      name: "Loading invoices",
    });

    expect(status.props.accessibilityState).toMatchObject({ busy: true });
    expect(
      surfaceOf(view, "skeleton").accessibilityElementsHidden,
    ).toBeUndefined();
  });

  it('names the wait "Loading" when the consumer does not', async () => {
    const view = await renderSkeleton(<Skeleton isBusy />);

    expect(view.getByRole("progressbar", { name: "Loading" })).toBeTruthy();
  });

  it("resolves its corners through the cascade", async () => {
    const view = await renderSkeleton(<Skeleton testID="skeleton" />, {
      defaultRadius: "full",
      components: { skeleton: { radius: "lg" } },
    });

    expect(classesOf(view, "skeleton")).toContain("rounded-lg");
    expect(classesOf(view, "skeleton")).not.toContain("rounded-full");
  });

  it("lets an instance prop win over the configured value", async () => {
    const view = await renderSkeleton(
      <Skeleton testID="skeleton" radius="full" />,
      { components: { skeleton: { radius: "lg" } } },
    );

    expect(classesOf(view, "skeleton")).toContain("rounded-full");
    expect(classesOf(view, "skeleton")).not.toContain("rounded-lg");
  });

  it("breathes by default, and stops when asked", async () => {
    const animated = await renderSkeleton(<Skeleton testID="skeleton" />);

    expect(
      animated.getByTestId("skeleton", { includeHiddenElements: true }).parent
        ?.props.style,
    ).toBeDefined();

    await animated.unmount();

    const still = await renderSkeleton(
      <Skeleton testID="skeleton" isAnimated={false} />,
    );

    expect(
      still.getByTestId("skeleton", { includeHiddenElements: true }).parent
        ?.props.style,
    ).toBeUndefined();
  });

  it("keeps the consumer's own classes last, so they win", async () => {
    const view = await renderSkeleton(
      <Skeleton testID="skeleton" className="mt-2" />,
    );

    expect(classesOf(view, "skeleton").endsWith("mt-2")).toBe(true);
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<Skeleton />)).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
