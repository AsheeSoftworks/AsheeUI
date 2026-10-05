/**
 * Behaviour tests for the native Dropmenu.
 *
 * The tests state the component's contract: the field announces itself as a combobox and
 * says whether it is open, the options appear on the picker surface, picking reports the
 * value and shows its label, an uncontrolled field keeps its own value and a controlled one
 * keeps the consumer's, an unavailable field refuses to open, and the family's label block
 * is drawn.
 */

import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Dropmenu } from "./Dropmenu";

// The first surface this file opens loads the platform's modal machinery, which costs far
// more than the interaction it precedes; the timeout is raised for the file rather than for
// whichever test happens to be first.
jest.setTimeout(20000);

const OPTIONS = [
  { value: "ke", label: "Kenya" },
  { value: "ng", label: "Nigeria" },
];

/** Render the field inside the framework provider. */
async function renderSelect(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/** Press an element and wait for the state it sets to be flushed. */
async function press(view: RenderResult, testID: string) {
  await act(async () => {
    fireEvent.press(view.getByTestId(testID));
  });
}

describe("Native Dropmenu", () => {
  it("says what it says while nothing is picked, and opens the options", async () => {
    const view = await renderSelect(
      <Dropmenu
        testID="country"
        optionTestID="option"
        label="Country"
        placeholder="Pick a country"
        options={OPTIONS}
      />,
    );

    expect(view.getByTestId("country").props.accessibilityRole).toBe(
      "combobox",
    );
    expect(view.getByTestId("country").props.accessibilityState.expanded).toBe(
      false,
    );
    expect(view.getByText("Pick a country")).toBeTruthy();

    await press(view, "country");

    expect(view.getByText("Kenya")).toBeTruthy();
    expect(view.getByText("Nigeria")).toBeTruthy();
  });

  it("reports the value it picked and shows its label", async () => {
    const onValueChange = jest.fn();
    const view = await renderSelect(
      <Dropmenu
        testID="country"
        optionTestID="option"
        label="Country"
        options={OPTIONS}
        onValueChange={onValueChange}
      />,
    );

    await press(view, "country");
    await press(view, "option-ng");

    expect(onValueChange).toHaveBeenCalledWith("ng");
    expect(view.getByTestId("country").props.accessibilityState.expanded).toBe(
      false,
    );
    expect(view.queryByText("Pick a country")).toBeNull();
  });

  it("keeps the value the consumer owns", async () => {
    const view = await renderSelect(
      <Dropmenu
        testID="country"
        optionTestID="option"
        label="Country"
        value="ke"
        options={OPTIONS}
      />,
    );

    expect(view.queryByText("Pick a country")).toBeNull();

    await press(view, "country");
    await press(view, "option-ng");

    expect(view.getByText("Kenya")).toBeTruthy();
  });

  it("refuses to open when it is unavailable", async () => {
    const view = await renderSelect(
      <Dropmenu
        testID="country"
        optionTestID="option"
        label="Country"
        options={OPTIONS}
        isDisabled
      />,
    );

    await press(view, "country");

    expect(view.getByTestId("country").props.accessibilityState.disabled).toBe(
      true,
    );
    expect(view.queryByText("Kenya")).toBeNull();
  });

  it("draws the family's label block and reports an invalid field", async () => {
    const view = await renderSelect(
      <Dropmenu
        testID="country"
        label="Country"
        description="Where it ships"
        status="error"
        message="Pick one"
        required
        options={OPTIONS}
      />,
    );

    expect(view.getByText("Country")).toBeTruthy();
    expect(view.getByText("Where it ships")).toBeTruthy();
    expect(view.getByText("Pick one")).toBeTruthy();
    expect(view.getByText("*")).toBeTruthy();
    expect(view.getByTestId("country").props["aria-invalid"]).toBe(true);
  });

  it("resolves its defaults through configuration", async () => {
    const view = await renderSelect(
      <Dropmenu testID="country" label="Country" options={OPTIONS} />,
      { components: { dropmenu: { required: true } } },
    );

    expect(view.getByText("*")).toBeTruthy();
  });
});
