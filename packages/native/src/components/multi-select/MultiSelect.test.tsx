/**
 * Behaviour tests for the native MultiSelect.
 *
 * The tests state the component's contract: the field says what it says while nothing is
 * picked, the surface stays open while the reader picks several values, each picked value
 * is drawn as a chip that can be removed, a controlled field keeps the consumer's values,
 * an unavailable field refuses to open, and the family's label block is drawn.
 */

import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { MultiSelect } from "./MultiSelect";

// The first surface this file opens loads the platform's modal machinery, which costs far
// more than the interaction it precedes; the timeout is raised for the file rather than for
// whichever test happens to be first.
jest.setTimeout(20000);

const OPTIONS = [
  { value: "urgent", label: "Urgent" },
  { value: "billing", label: "Billing" },
];

/** Render the field inside the framework provider. */
async function renderMulti(ui: ReactElement, config?: object) {
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

describe("Native MultiSelect", () => {
  it("says what it says while nothing is picked", async () => {
    const view = await renderMulti(
      <MultiSelect
        testID="tags"
        label="Tags"
        placeholder="Pick tags"
        options={OPTIONS}
      />,
    );

    expect(view.getByText("Pick tags")).toBeTruthy();
    expect(view.getByTestId("tags").props.accessibilityRole).toBe("combobox");
  });

  it("picks several values and stays open while it does", async () => {
    const onChange = jest.fn();
    const view = await renderMulti(
      <MultiSelect
        testID="tags"
        optionTestID="option"
        label="Tags"
        options={OPTIONS}
        onChange={onChange}
      />,
    );

    await press(view, "tags");
    await press(view, "option-urgent");

    expect(onChange).toHaveBeenLastCalledWith(["urgent"]);
    // The surface stays open, because picking several values in one visit is what the
    // field is for.
    expect(view.getByText("Billing")).toBeTruthy();

    await press(view, "option-billing");

    expect(onChange).toHaveBeenLastCalledWith(["urgent", "billing"]);
  });

  it("draws a chip per picked value, and removes one from its own control", async () => {
    const onChange = jest.fn();
    const view = await renderMulti(
      <MultiSelect
        testID="tags"
        label="Tags"
        options={OPTIONS}
        defaultValue={["urgent", "billing"]}
        onChange={onChange}
      />,
    );

    expect(view.getByText("Urgent")).toBeTruthy();
    expect(view.getByText("Billing")).toBeTruthy();

    await act(async () => {
      fireEvent.press(view.getByLabelText("Remove Urgent"));
    });

    expect(onChange).toHaveBeenCalledWith(["billing"]);
    expect(view.queryByText("Urgent")).toBeNull();
  });

  it("keeps the values the consumer owns", async () => {
    const view = await renderMulti(
      <MultiSelect
        testID="tags"
        optionTestID="option"
        label="Tags"
        options={OPTIONS}
        value={["urgent"]}
      />,
    );

    await press(view, "tags");
    await press(view, "option-billing");

    // The consumer's values have not changed, so the surface still reports the ones it
    // was given: a controlled field does not select itself.
    expect(
      view.getByTestId("option-urgent").props.accessibilityState.checked,
    ).toBe(true);
    expect(
      view.getByTestId("option-billing").props.accessibilityState.checked,
    ).toBe(false);
  });

  it("refuses to open when it is unavailable", async () => {
    const view = await renderMulti(
      <MultiSelect
        testID="tags"
        optionTestID="option"
        label="Tags"
        options={OPTIONS}
        isDisabled
      />,
    );

    await press(view, "tags");

    expect(view.getByTestId("tags").props.accessibilityState.disabled).toBe(
      true,
    );
    expect(view.queryByText("Urgent")).toBeNull();
  });

  it("draws the family's label block", async () => {
    const view = await renderMulti(
      <MultiSelect
        testID="tags"
        label="Tags"
        description="How it is triaged"
        message="Pick at least one"
        status="warning"
        options={OPTIONS}
      />,
    );

    expect(view.getByText("Tags")).toBeTruthy();
    expect(view.getByText("How it is triaged")).toBeTruthy();
    expect(view.getByText("Pick at least one")).toBeTruthy();
  });
});
