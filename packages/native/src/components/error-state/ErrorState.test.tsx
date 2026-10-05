/**
 * Behaviour tests for the native ErrorState.
 *
 * The tests state the component's contract: the state composes the framework's empty
 * presentation with the error tone, it offers a retry only when a reader can actually
 * retry, it keeps the technical detail behind a disclosure a reader opens, it is
 * announced as an alert by default and not announced at all when it is part of the
 * screen from the start, and its wording resolves through the configuration cascade.
 */

import { fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { ErrorState } from "./ErrorState";

/**
 * Render a failed region inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderError(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

describe("Native ErrorState", () => {
  it("says what failed and what a reader can do about it", async () => {
    const view = await renderError(
      <ErrorState
        testID="state"
        title="Invoices could not be loaded"
        description="The request timed out."
      />,
    );

    expect(view.getByText("Invoices could not be loaded")).toBeTruthy();
    expect(view.getByText("The request timed out.")).toBeTruthy();
  });

  it("takes the error tone from the framework rather than from the consumer", async () => {
    const view = await renderError(
      <ErrorState testID="state" title="Failed" icon={undefined} />,
    );

    expect(
      (view.getByTestId("state").props as { className?: string }).className,
    ).toContain("bg-background");
  });

  it("offers a retry only when there is something to retry", async () => {
    const onRetry = jest.fn();
    const offer = await renderError(
      <ErrorState testID="state" title="Failed" onRetry={onRetry} />,
    );

    await fireEvent.press(offer.getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("draws no retry control when the way out is not a retry", async () => {
    const view = await renderError(
      <ErrorState
        testID="state"
        title="Failed"
        primaryAction={{ label: "Go home" }}
      />,
    );

    expect(view.queryByRole("button", { name: "Try again" })).toBeNull();
    expect(view.getByRole("button", { name: "Go home" })).toBeTruthy();
  });

  it("keeps the technical detail behind a disclosure a reader opens", async () => {
    const view = await renderError(
      <ErrorState testID="state" title="Failed" detail="Request failed: 504" />,
    );

    expect(view.queryByText("Request failed: 504")).toBeNull();

    const disclosure = view.getByRole("button", { name: "Technical details" });

    expect(disclosure.props.accessibilityState).toMatchObject({
      expanded: false,
    });

    await fireEvent.press(disclosure);

    expect(view.getByText("Request failed: 504")).toBeTruthy();
    expect(
      view.getByRole("button", { name: "Technical details" }).props
        .accessibilityState,
    ).toMatchObject({ expanded: true });
  });

  it("says the disclosure in the consumer's words", async () => {
    const view = await renderError(
      <ErrorState testID="state" title="Failed" detail="504" />,
      { components: { errorstate: { detailLabel: "What went wrong" } } },
    );

    expect(view.getByRole("button", { name: "What went wrong" })).toBeTruthy();
  });

  it("announces itself as an alert by default", async () => {
    const view = await renderError(
      <ErrorState testID="state" title="Failed" />,
    );

    expect(view.getByTestId("state").props.accessibilityRole).toBe("alert");
    expect(view.getByTestId("state").props.accessibilityLiveRegion).toBe(
      "assertive",
    );
  });

  it("stays out of the announcement when the failure was part of the screen", async () => {
    const view = await renderError(
      <ErrorState testID="state" title="Not found" role="none" />,
    );

    expect(view.getByTestId("state").props.accessibilityRole).toBeUndefined();
    expect(
      view.getByTestId("state").props.accessibilityLiveRegion,
    ).toBeUndefined();
  });

  it("resolves its density, panel and wording through the cascade", async () => {
    const view = await renderError(
      <ErrorState testID="state" title="Failed" onRetry={() => {}} />,
      {
        components: {
          errorstate: {
            size: "lg",
            panel: false,
            retryLabel: "Reload",
          },
        },
      },
    );

    const classes = (view.getByTestId("state").props as { className?: string })
      .className as string;

    expect(classes).toContain("p-10");
    expect(classes).not.toContain("bg-background");
    expect(view.getByRole("button", { name: "Reload" })).toBeTruthy();
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<ErrorState title="Failed" />)).rejects.toThrow(
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
