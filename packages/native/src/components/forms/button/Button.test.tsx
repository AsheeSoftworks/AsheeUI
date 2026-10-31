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
import { Linking, Text } from "react-native";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import { Form } from "../form/Form";
import { Button } from "./Button";

/**
 * Render a component inside the provider, as an application would.
 *
 * @param ui - The element to render.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderWithProvider(ui: ReactElement, config?: object) {
  return render(<AsheeUIProvider config={config}>{ui}</AsheeUIProvider>);
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

  it("lets a consumer's own class win over the component's", async () => {
    // `cn` merges on property families: a background stated by the consumer replaces the
    // background the variant stated, rather than being emitted beside it and losing to
    // source order in a stylesheet the device does not have.
    const view = await renderWithProvider(
      <Button color="primary" className="bg-danger">
        Save
      </Button>,
    );
    const className = view.getByRole("button", { name: "Save" }).props
      .className;
    const tokens = String(className).split(/\s+/);

    expect(tokens).toContain("bg-danger");
    // The variant's own background is gone; its `active:` state is a different declaration
    // and survives, which is the family rule stated in `utils/cn.ts`.
    expect(tokens).not.toContain("bg-primary");
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
      /AsheeUIProvider/,
    );

    silence.mockRestore();
  });

  it("accepts the web's onClick name and runs it on a press", async () => {
    const onClick = jest.fn();
    const view = await renderWithProvider(
      <Button onClick={onClick}>Save</Button>,
    );

    await fireEvent.press(view.getByRole("button", { name: "Save" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("runs both names when both are given, onClick first", async () => {
    // The order is what a consumer that passes both sees, and the web button documents
    // `onClick` first. A handler that only ever ran one of the two would still pass a test
    // that asserted "the press happened".
    const calls: string[] = [];
    const view = await renderWithProvider(
      <Button
        onClick={() => calls.push("onClick")}
        onPress={() => calls.push("onPress")}>
        Save
      </Button>,
    );

    await fireEvent.press(view.getByRole("button", { name: "Save" }));

    expect(calls).toEqual(["onClick", "onPress"]);
  });

  it("renders content on both sides of its label", async () => {
    const view = await renderWithProvider(
      <Button
        startContent={<Text>←</Text>}
        endContent={<Text>→</Text>}>
        Save
      </Button>,
    );

    expect(view.getByText("←")).toBeTruthy();
    expect(view.getByText("Save")).toBeTruthy();
    expect(view.getByText("→")).toBeTruthy();
  });

  it("takes a square from the size axis when it is icon-only", async () => {
    const view = await renderWithProvider(
      <Button icon size="md" aria-label="Refresh">
        <Text>↻</Text>
      </Button>,
    );

    const className = view.getByRole("button", { name: "Refresh" }).props
      .className as string;
    expect(className).toContain("w-11");
    expect(className).toContain("h-11");
  });

  it("submits the enclosing form when its type says so", async () => {
    // The platform has no submit event, so the form states what submitting means in a
    // context and the button asks it. A button outside a form does nothing form-related.
    const onSubmit = jest.fn();
    const onReset = jest.fn();
    const view = await renderWithProvider(
      <Form onSubmit={onSubmit} onReset={onReset}>
        <Button type="submit">Send</Button>
        <Button type="reset">Clear</Button>
      </Form>,
    );

    await fireEvent.press(view.getByRole("button", { name: "Send" }));
    await fireEvent.press(view.getByRole("button", { name: "Clear" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("follows href through the platform's URL handler when no handler is given", async () => {
    const openURL = jest
      .spyOn(Linking, "openURL")
      .mockResolvedValue(true as never);

    const view = await renderWithProvider(
      <Button href="https://asheesoftworks.com">Docs</Button>,
    );
    await fireEvent.press(view.getByRole("button", { name: "Docs" }));

    expect(openURL).toHaveBeenCalledWith("https://asheesoftworks.com");
    openURL.mockRestore();
  });
});
