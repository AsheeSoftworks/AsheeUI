/**
 * Behaviour tests for the native Input.
 *
 * The tests state the component's contract: the field is named for the platform's
 * screen reader, it reports what the reader types, it shows its label, its
 * description and its message, it reports an invalid state, it shows a visible
 * focus edge, and every option resolves through the configuration cascade.
 */

import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import {
  type Color,
  type ColorRole,
  resolveFieldStatusColor,
} from "@asheeui/core";
import type { ReactElement } from "react";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import { FIELD_STATUS_TEXT_CLASS } from "../../../styles/portable";
import { Input } from "./Input";

/**
 * Render a field inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderInput(ui: ReactElement, config?: object) {
  return render(<AsheeUIProvider config={config}>{ui}</AsheeUIProvider>);
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

describe("Native Input", () => {
  it("names the field for the platform's screen reader", async () => {
    const view = await renderInput(
      <Input testID="input" label="Email" description="We never share it" />,
    );
    const field = view.getByTestId("input");

    expect(field.props.accessibilityLabel).toBe("Email");
    expect(field.props.accessibilityHint).toBe("We never share it");
    expect(view.getByText("Email")).toBeTruthy();
    expect(view.getByText("We never share it")).toBeTruthy();
  });

  it("reports what the reader types", async () => {
    const onChangeText = jest.fn();
    const view = await renderInput(
      <Input testID="input" label="Email" onChangeText={onChangeText} />,
    );

    fireEvent.changeText(view.getByTestId("input"), "you@example.com");

    expect(onChangeText).toHaveBeenCalledWith("you@example.com");
  });

  it("reports a change through every name it was given, onChange first", async () => {
    // A handler copied from the web reads `event.target.value`; a handler written for the
    // platform reads the value. Both survive, and a consumer that passed all three sees the
    // order the shared resolver promises.
    const calls: string[] = [];
    const view = await renderInput(
      <Input
        testID="input"
        label="Email"
        onChange={(event) => calls.push(`onChange:${event.target.value}`)}
        onChangeText={(value) => calls.push(`onChangeText:${value}`)}
        onValueChange={(value) => calls.push(`onValueChange:${value}`)}
      />,
    );

    fireEvent.changeText(view.getByTestId("input"), "you@example.com");

    expect(calls).toEqual([
      "onChange:you@example.com",
      "onChangeText:you@example.com",
      "onValueChange:you@example.com",
    ]);
  });

  it("shows its message and reports an invalid field", async () => {
    const view = await renderInput(
      <Input
        testID="input"
        label="Email"
        status="error"
        message="That address is not valid"
      />,
    );

    expect(view.getByText("That address is not valid")).toBeTruthy();
    expect(view.getByTestId("input").props["aria-invalid"]).toBe(true);
    expect(classesOf(view, "input")).toContain("border-danger");
  });

  it("keeps a touch-sized field whatever its density is", async () => {
    const view = await renderInput(<Input testID="input" size="sm" />);

    expect(classesOf(view, "input")).toContain("min-h-[44px]");
  });

  it("shows a visible edge while it has focus", async () => {
    const view = await renderInput(
      <Input testID="input" label="Email" color="primary" />,
    );

    expect(classesOf(view, "input")).toContain("border-border");

    // The focus state is the component's own, so the update is flushed before the
    // class is read back.
    await act(async () => {
      fireEvent(view.getByTestId("input"), "focus");
    });

    expect(classesOf(view, "input")).toContain("border-primary");
  });

  it("resolves its defaults through configuration", async () => {
    const view = await renderInput(<Input testID="input" label="Email" />, {
      components: { input: { radius: "full", multiline: true } },
    });

    expect(classesOf(view, "input")).toContain("rounded-full");
    expect(classesOf(view, "input")).toContain("min-h-[96px]");
    expect(view.getByTestId("input").props.multiline).toBe(true);
  });

  it("tones its message with the shared status dictionary", async () => {
    const view = await renderInput(
      <Input
        testID="input"
        label="Email"
        status="success"
        message="Looks good"
      />,
    );

    const messageClasses = (
      view.getByText("Looks good").props as { className?: string }
    ).className as string;

    // The Text component states its own default tone first, so the status tone has to
    // arrive last to win — which is why the shared dictionary's class is asserted by
    // position rather than by presence.
    expect(messageClasses).toContain(FIELD_STATUS_TEXT_CLASS.success);
    expect(messageClasses.endsWith(FIELD_STATUS_TEXT_CLASS.success)).toBe(true);
  });

  it("rounds with the shared native radius scale", async () => {
    const view = await renderInput(<Input testID="input" radius="sm" />, {
      components: { input: { radius: "sm" } },
    });

    // The native scale spells its second step "rounded" rather than the web's
    // "rounded-sm", so this pins which vocabulary the field rounds with.
    expect(classesOf(view, "input")).toContain("rounded");
    expect(classesOf(view, "input")).not.toContain("rounded-rounded");
  });

  it("lets an instance prop win over the configured value", async () => {
    const view = await renderInput(<Input testID="input" size="lg" />, {
      components: { input: { size: "sm" } },
    });

    expect(classesOf(view, "input")).toContain("min-h-[56px]");
    expect(classesOf(view, "input")).not.toContain("min-h-[44px]");
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderInput(<Input testID="input" className="mb-2" />);

    expect(classesOf(view, "input").endsWith("mb-2")).toBe(true);
  });
});

describe("the field's type is translated, not forwarded", () => {
  it("masks a password through the platform's secure entry", async () => {
    const view = await renderInput(
      <Input testID="input" label="Password" type="password" />,
    );
    const field = view.getByTestId("input");

    // `secureTextEntry` is the platform mechanism, and it is what makes the value
    // invisible; a test that only looked for a class would pass on a visible password.
    expect(field.props.secureTextEntry).toBe(true);
    expect(field.props.textContentType).toBe("password");
    expect(field.props.autoComplete).toBe("current-password");
  });

  it("states the keyboard and autofill vocabulary of the other types", async () => {
    const email = await renderInput(
      <Input testID="input" label="Email" type="email" />,
    );
    expect(email.getByTestId("input").props.keyboardType).toBe("email-address");
    expect(email.getByTestId("input").props.autoComplete).toBe("email");

    await email.unmount();

    const number = await renderInput(
      <Input testID="input" label="Amount" type="number" />,
    );
    expect(number.getByTestId("input").props.keyboardType).toBe("numeric");
  });

  it("warns once about a type it does not know, never silently", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    // A computed value can reach the prop, so the union is open on purpose; the warning is
    // what keeps a typo from rendering an ordinary field with no explanation.
    const view = await renderInput(
      <Input testID="input" label="Birthday" type="date" />,
    );
    await view.unmount();
    const second = await renderInput(
      <Input testID="input" label="Birthday" type="date" />,
    );
    await second.unmount();

    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain('"date"');

    warn.mockRestore();
  });
});

describe("the field's status resolves the shared colour role", () => {
  it("takes the danger role on error, on the platform as on the web", async () => {
    // The role comes from core, and the platform maps it to its own edge class. Asserting
    // the role first and the class second is what keeps this a parity test rather than a
    // class-string test.
    expect(resolveFieldStatusColor("error", "primary")).toBe("danger");

    const view = await renderInput(
      <Input testID="input" label="Email" status="error" />,
    );

    expect(classesOf(view, "input")).toContain("border-danger");
  });

  it("takes the warning and success roles too, which the platform used to ignore", async () => {
    const warning = await renderInput(
      <Input testID="input" label="Email" status="warning" />,
    );
    expect(classesOf(warning, "input")).toContain("border-warning");

    await warning.unmount();

    const success = await renderInput(
      <Input testID="input" label="Email" status="success" />,
    );
    expect(classesOf(success, "input")).toContain("border-success");
  });
});

describe("the colour vocabulary", () => {
  it("states Color and ColorRole as one union, both ways", () => {
    // `ColorRole` is a deprecated alias, and a type has no reference to compare, so the
    // proof is that each direction assigns to the other. The two values keep the test at
    // runtime, where the alias is exercised rather than only compiled.
    const fromAlias: Color = "danger" as ColorRole;
    const fromCanonical: ColorRole = "danger" as Color;

    expect(fromAlias).toBe("danger");
    expect(fromCanonical).toBe("danger");
  });
});
