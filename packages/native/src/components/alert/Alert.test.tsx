/**
 * Behaviour tests for the native Alert.
 *
 * The tests state the component's contract: an intent decides the colour and the
 * urgency, the decoration is hidden from assistive technology rather than read out,
 * the dismiss control exists only when the alert can be dismissed and knows what to
 * do, and the treatment, the radius and the wording all resolve through the
 * configuration cascade. Renders and interactions are awaited and queries are about
 * the platform's roles and states, as the platform's renderer requires.
 */

import { fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { View } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Alert } from "./Alert";

/**
 * Render an alert inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderAlert(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Read the classes the rendered alert carries.
 *
 * @param view - The rendered tree.
 * @param testID - The alert's test identifier.
 * @returns Its class string.
 */
function classesOf(view: ReturnType<typeof render>, testID: string): string {
  return (view.getByTestId(testID).props as { className?: string })
    .className as string;
}

describe("Native Alert", () => {
  it("renders its title and its message", async () => {
    const view = await renderAlert(
      <Alert testID="alert" title="Payment failed">
        The card was declined.
      </Alert>,
    );

    expect(view.getByText("Payment failed")).toBeTruthy();
    expect(view.getByText("The card was declined.")).toBeTruthy();
  });

  it("keeps the intent's decoration out of assistive technology", async () => {
    const view = await renderAlert(
      <Alert testID="alert" type="success" title="Saved" />,
    );

    // The character is drawn for the eye only: the message carries the news, so
    // reading the alert does not start with a symbol.
    expect(view.queryByText("✓")).toBeNull();
    expect(view.getByText("✓", { includeHiddenElements: true })).toBeTruthy();
  });

  it("lets a consumer replace the intent's character", async () => {
    const view = await renderAlert(
      <Alert
        testID="alert"
        type="success"
        title="Saved"
        icon={<View testID="own-icon" />}
      />,
    );

    expect(
      view.getByTestId("own-icon", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(view.queryByText("✓", { includeHiddenElements: true })).toBeNull();
  });

  it("announces an interrupting intent as an alert, and an acknowledgement politely", async () => {
    const error = await renderAlert(
      <Alert testID="alert" type="error" title="Failed" />,
    );
    const info = await renderAlert(
      <Alert testID="alert" type="info" title="Note" />,
    );

    expect(error.getByTestId("alert").props.accessibilityRole).toBe("alert");
    expect(error.getByTestId("alert").props.accessibilityLiveRegion).toBe(
      "assertive",
    );
    // The platform has no `status` role, so a message that waits takes no role and
    // says so through the live region instead.
    expect(info.getByTestId("alert").props.accessibilityRole).toBeUndefined();
    expect(info.getByTestId("alert").props.accessibilityLiveRegion).toBe(
      "polite",
    );
  });

  it("colours the message by its intent", async () => {
    const view = await renderAlert(
      <Alert testID="alert" type="warning" title="Slow" />,
    );

    expect(classesOf(view, "alert")).toContain("border-warning/20");
    expect(classesOf(view, "alert")).toContain("bg-warning/10");
    expect(
      (view.getByText("Slow").props as { className?: string }).className,
    ).toContain("text-warning");
  });

  it("dismisses only when the alert can be dismissed and knows what to do", async () => {
    const onClose = jest.fn();
    const view = await renderAlert(
      <Alert testID="alert" title="Saved" isClosable onClose={onClose} />,
    );

    await fireEvent.press(view.getByRole("button", { name: "Dismiss alert" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("draws no dismiss control when the alert can be dismissed but has nothing to do", async () => {
    const view = await renderAlert(
      <Alert testID="alert" title="Saved" isClosable />,
    );

    expect(view.queryByRole("button")).toBeNull();
  });

  it("names the dismiss control in the consumer's words", async () => {
    const view = await renderAlert(
      <Alert title="Saved" isClosable onClose={() => {}} closeLabel="Hide" />,
    );

    expect(view.getByRole("button", { name: "Hide" })).toBeTruthy();
  });

  it("resolves its intent, treatment and rounding through the cascade", async () => {
    const view = await renderAlert(<Alert testID="alert" title="Slow" />, {
      components: {
        alert: { type: "warning", radius: "full", variant: "solid" },
      },
    });

    expect(classesOf(view, "alert")).toContain("bg-warning");
    expect(classesOf(view, "alert")).toContain("rounded-full");
    // A filled surface paints its text on the fill rather than in the role's own
    // colour, which would be invisible there.
    expect(
      (view.getByText("Slow").props as { className?: string }).className,
    ).toContain("text-background");
  });

  it("keeps its own treatment when the platform's default is a filled one, because a message is not a block", async () => {
    const view = await renderAlert(
      <Alert testID="alert" type="warning" title="Slow" />,
      { defaultVariant: "solid" },
    );

    expect(classesOf(view, "alert")).toContain("bg-warning/10");
    expect(
      (view.getByText("Slow").props as { className?: string }).className,
    ).toContain("text-warning");
  });

  it("lets an instance prop win over the configured value, and the consumer's classes win last", async () => {
    const view = await renderAlert(
      <Alert testID="alert" type="warning" variant="ghost" className="mt-2" />,
      { components: { alert: { variant: "faded", type: "success" } } },
    );

    expect(classesOf(view, "alert")).toContain("bg-warning/10");
    expect(classesOf(view, "alert")).not.toContain("bg-success/10");
    expect(classesOf(view, "alert").endsWith("mt-2")).toBe(true);
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<Alert title="Saved" />)).rejects.toThrow(
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
