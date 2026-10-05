/**
 * Behaviour tests for the native Autocomplete.
 *
 * The tests state the component's contract: the suggestions belong to the field's own layout
 * and appear as the reader types, they match the text rather than the whole list, picking
 * reports the value and shows the option's label, the text is reported separately, a custom
 * value may stand as the value when the consumer allows it, and the family's label block is
 * drawn.
 */

import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Autocomplete } from "./Autocomplete";

const OPTIONS = [
  { value: "nbo", label: "Nairobi" },
  { value: "mba", label: "Mombasa" },
  { value: "kis", label: "Kisumu" },
];

/** Render the field inside the framework provider. */
async function renderField(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/** Type into the field and wait for the state it sets to be flushed. */
async function type(view: RenderResult, text: string) {
  await act(async () => {
    fireEvent(view.getByTestId("city"), "focus");
  });
  await act(async () => {
    fireEvent.changeText(view.getByTestId("city"), text);
  });
}

describe("Native Autocomplete", () => {
  it("suggests only what matches the text", async () => {
    const view = await renderField(
      <Autocomplete
        testID="city"
        optionTestID="option"
        label="City"
        options={OPTIONS}
      />,
    );

    await type(view, "mom");

    expect(view.getByText("Mombasa")).toBeTruthy();
    expect(view.queryByText("Nairobi")).toBeNull();
  });

  it("says so when nothing matches", async () => {
    const view = await renderField(
      <Autocomplete testID="city" label="City" options={OPTIONS} />,
    );

    await type(view, "zzz");

    expect(view.getByText("No matches")).toBeTruthy();
  });

  it("reports the value it picked and shows the option's label", async () => {
    const onValueChange = jest.fn();
    const view = await renderField(
      <Autocomplete
        testID="city"
        optionTestID="option"
        label="City"
        options={OPTIONS}
        onValueChange={onValueChange}
      />,
    );

    await type(view, "kis");
    await act(async () => {
      fireEvent.press(view.getByTestId("option-kis"));
    });

    expect(onValueChange).toHaveBeenCalledWith(
      "kis",
      expect.objectContaining({ label: "Kisumu" }),
    );
    expect((view.getByTestId("city").props as { value?: string }).value).toBe(
      "Kisumu",
    );
  });

  it("reports the text as the reader types", async () => {
    const onInputChange = jest.fn();
    const view = await renderField(
      <Autocomplete
        testID="city"
        label="City"
        options={OPTIONS}
        onInputChange={onInputChange}
      />,
    );

    await type(view, "na");

    expect(onInputChange).toHaveBeenLastCalledWith("na");
  });

  it("lets the typed text stand as the value when the consumer allows it", async () => {
    const onValueChange = jest.fn();
    const view = await renderField(
      <Autocomplete
        testID="city"
        label="City"
        options={OPTIONS}
        allowCustomValue
        onValueChange={onValueChange}
      />,
    );

    await type(view, "Eldoret");

    expect(onValueChange).toHaveBeenLastCalledWith("Eldoret");
  });

  it("shows the label of the value it was given", async () => {
    const view = await renderField(
      <Autocomplete testID="city" label="City" value="mba" options={OPTIONS} />,
    );

    expect((view.getByTestId("city").props as { value?: string }).value).toBe(
      "Mombasa",
    );
  });

  it("draws the family's label block and reports an invalid field", async () => {
    const view = await renderField(
      <Autocomplete
        testID="city"
        label="City"
        description="Where it ships"
        status="error"
        message="Pick a city we serve"
        options={OPTIONS}
      />,
    );

    expect(view.getByText("Where it ships")).toBeTruthy();
    expect(view.getByText("Pick a city we serve")).toBeTruthy();
    expect(view.getByTestId("city").props["aria-invalid"]).toBe(true);
  });
});
