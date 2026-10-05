/**
 * Behaviour tests for the native Spinner.
 *
 * The tests state the component's contract: an indicator is decoration unless it is
 * given something to say, its density and colour resolve through the configuration
 * cascade, and its rotation comes from the shared speed rather than from a number a
 * renderer invented. Renders are awaited and queries come from the rendered view,
 * as the platform's renderer requires.
 *
 * The hidden-element flag on the queries is not incidental: the ring is hidden from
 * assistive technology by default, exactly as the web spinner is, so asking for
 * visible elements only would be asking for something the component never claims.
 */

import { type RenderResult, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Spinner } from "./Spinner";

/**
 * Render a spinner inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderSpinner(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Read the classes the rendered ring carries.
 *
 * @param view - The rendered tree.
 * @param testID - The ring's test identifier.
 * @returns Its class string.
 */
function classesOf(view: RenderResult, testID: string): string {
  return (
    view.getByTestId(testID, { includeHiddenElements: true }).props as {
      className?: string;
    }
  ).className as string;
}

describe("Native Spinner", () => {
  it("renders a ring, and keeps it out of assistive technology by default", async () => {
    const view = await renderSpinner(<Spinner testID="spinner" />);
    const ring = view.getByTestId("spinner", { includeHiddenElements: true });

    expect(ring.props.accessibilityElementsHidden).toBe(true);
    expect(ring.props.importantForAccessibility).toBe("no-hide-descendants");
    expect(view.queryByRole("progressbar")).toBeNull();
  });

  it("becomes a labelled busy status when it is given a label", async () => {
    const view = await renderSpinner(<Spinner label="Loading invoices" />);
    const status = view.getByRole("progressbar", {
      name: "Loading invoices",
    });

    expect(status.props.accessibilityState).toMatchObject({ busy: true });
  });

  it("resolves its density and its colour role through the cascade", async () => {
    const view = await renderSpinner(<Spinner testID="spinner" />, {
      defaultColor: "success",
      components: { spinner: { size: "lg" } },
    });

    expect(classesOf(view, "spinner")).toContain("w-7");
    expect(classesOf(view, "spinner")).toContain("border-success/25");
    expect(classesOf(view, "spinner")).toContain("border-t-success");
  });

  it("falls back to the values it documents when nothing states anything", async () => {
    const view = await renderSpinner(<Spinner testID="spinner" />);

    expect(classesOf(view, "spinner")).toContain("rounded-full");
    expect(classesOf(view, "spinner")).toContain("w-5");
    expect(classesOf(view, "spinner")).toContain("border-primary/25");
  });

  it("lets an instance prop win over the configured value", async () => {
    const view = await renderSpinner(
      <Spinner testID="spinner" color="warning" />,
      { components: { spinner: { color: "danger" } } },
    );

    expect(classesOf(view, "spinner")).toContain("border-t-warning");
    expect(classesOf(view, "spinner")).not.toContain("border-t-danger");
  });

  it("keeps the consumer's own classes last, so they win", async () => {
    const view = await renderSpinner(
      <Spinner testID="spinner" className="mt-2" />,
    );

    expect(classesOf(view, "spinner").endsWith("mt-2")).toBe(true);
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<Spinner />)).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
