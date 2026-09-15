/**
 * Behaviour tests for the native Button.
 *
 * The native implementation is tested on its own terms. Two differences from the web
 * suite are deliberate, and both are properties of the platform rather than
 * preferences:
 *
 * 1. The React Native Testing Library renders asynchronously, because React renders
 *    concurrently on the platform's renderer, so every render and interaction is
 *    awaited.
 * 2. The assertions are about the platform's roles and states rather than about a
 *    DOM. A native button is found by its accessibility role, and its disabled and
 *    busy conditions are announced through `accessibilityState`, which is what a
 *    screen reader on the device receives.
 */

import { fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Button } from "./Button";

/**
 * Render a component inside the provider, as an application would.
 *
 * @param ui - The element to render.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderWithProvider(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

describe("Native Button", () => {
  it("renders its label as a button a screen reader can find", async () => {
    const view = await renderWithProvider(<Button>Save invoice</Button>);

    expect(view.getByRole("button", { name: "Save invoice" })).toBeTruthy();
  });

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn();
    const view = await renderWithProvider(
      <Button onPress={onPress}>Save</Button>,
    );

    await fireEvent.press(view.getByRole("button", { name: "Save" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("blocks the press and reports the state when disabled", async () => {
    const onPress = jest.fn();
    const view = await renderWithProvider(
      <Button isDisabled onPress={onPress}>
        Save
      </Button>,
    );
    const button = view.getByRole("button", { name: "Save" });

    await fireEvent.press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button.props.accessibilityState).toMatchObject({ disabled: true });
  });

  it("shows a pending state, blocks the press and announces busy", async () => {
    const onPress = jest.fn();
    const view = await renderWithProvider(
      <Button isLoading onPress={onPress}>
        Save
      </Button>,
    );
    const button = view.getByRole("button", { name: "Save" });

    await fireEvent.press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button.props.accessibilityState).toMatchObject({
      busy: true,
      disabled: true,
    });
    // The pending affordance is present, and it does not rename the control: the
    // spinner is hidden from assistive technology, which is why the query has to ask
    // for hidden elements, and the busy state carries the news instead.
    expect(
      view.getByTestId("button-spinner", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(view.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("resolves its treatment through the configuration cascade", async () => {
    const view = await renderWithProvider(<Button>Save</Button>, {
      defaultVariant: "ghost",
      defaultRadius: "full",
      components: { button: { size: "sm" } },
    });
    const className = view.getByRole("button", { name: "Save" }).props
      .className;

    expect(className).toContain("bg-transparent");
    expect(className).toContain("rounded-full");
    expect(className).toContain("px-3");
  });

  it("lets an instance prop override the configuration", async () => {
    const view = await renderWithProvider(
      <Button variant="bordered">Save</Button>,
      { defaultVariant: "solid" },
    );
    const className = view.getByRole("button", { name: "Save" }).props
      .className;

    expect(className).toContain("border");
    // The solid treatment's marker is absent, which is what an override means.
    expect(className).toContain("bg-transparent");
    expect(className).not.toContain("active:opacity-80");
  });

  it("keeps every button at a height a thumb can reach", async () => {
    const view = await renderWithProvider(<Button size="sm">Save</Button>);

    expect(
      view.getByRole("button", { name: "Save" }).props.className,
    ).toContain("min-h-[44px]");
  });

  it("stretches to the container when asked, and not otherwise", async () => {
    const full = await renderWithProvider(<Button fullWidth>Save</Button>);

    expect(
      full.getByRole("button", { name: "Save" }).props.className,
    ).toContain("w-full");

    await full.unmount();

    const inline = await renderWithProvider(<Button>Save</Button>);

    expect(
      inline.getByRole("button", { name: "Save" }).props.className,
    ).not.toContain("w-full");
  });

  it("keeps the consumer's own classes last, so they win", async () => {
    const view = await renderWithProvider(
      <Button className="mt-4">Save</Button>,
    );
    const className = view.getByRole("button", { name: "Save" }).props
      .className;

    expect(className.endsWith("mt-4")).toBe(true);
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<Button>Save</Button>)).rejects.toThrow(
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
