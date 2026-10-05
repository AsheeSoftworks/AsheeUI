/**
 * Behaviour tests for the native Calendar.
 *
 * The tests state the component's contract: the field announces itself as a combobox and
 * says whether the surface is open, the month the shared helpers describe is the month the
 * surface draws, a day the reader picks is written into the field the way both platforms
 * write it, the time columns step and apply what they stepped to, a field that refuses
 * future days refuses the month after today's with them, the value can be emptied from the
 * field, an uncontrolled field keeps its own value and a controlled one keeps the consumer's,
 * and the family's label block is drawn.
 */

import { getDefaultPlaceholder, MONTHS } from "@asheeui/core";
import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Calendar } from "./Calendar";

// The first surface this file opens loads the platform's modal machinery, which costs far
// more than the interaction it precedes; the timeout is raised for the file rather than for
// whichever test happens to be first.
jest.setTimeout(20000);

/** A date the tests can state in full, so a month heading is never the month the suite runs in. */
const JAN = new Date(2026, 0, 15, 9, 30, 5);

/** Render the field inside the framework provider. */
async function renderCalendar(ui: ReactElement, config?: object) {
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

describe("Native Calendar", () => {
  it("says what it collects while nothing is chosen, and opens the month", async () => {
    const view = await renderCalendar(
      <Calendar testID="date" sheetTestID="sheet" label="Start" />,
    );

    expect(view.getByTestId("date").props.accessibilityRole).toBe("combobox");
    expect(view.getByTestId("date").props.accessibilityState.expanded).toBe(
      false,
    );
    // What the field says while it holds nothing is the shared vocabulary's, not the
    // renderer's own.
    expect(view.getByText(getDefaultPlaceholder("date"))).toBeTruthy();

    await press(view, "date");

    expect(view.getByTestId("date").props.accessibilityState.expanded).toBe(
      true,
    );
    expect(view.getByText("Su")).toBeTruthy();
    // A field that holds nothing opens on today, so the surface is never a month the
    // reader has to find their way back from.
    const today = new Date();
    expect(
      view.getByText(`${MONTHS[today.getMonth()]} ${today.getFullYear()}`),
    ).toBeTruthy();
  });

  it("reports the day it picked in the format both platforms write", async () => {
    const onChange = jest.fn();
    const view = await renderCalendar(
      <Calendar
        testID="date"
        sheetTestID="sheet"
        label="Start"
        defaultValue={JAN}
        onChange={onChange}
      />,
    );

    expect(view.getByText("15/01/2026")).toBeTruthy();

    await press(view, "date");
    await press(view, "sheet-day-20");

    const picked = onChange.mock.calls[0][0] as Date;
    expect(picked.getFullYear()).toBe(2026);
    expect(picked.getMonth()).toBe(0);
    expect(picked.getDate()).toBe(20);
    // The time the field held is kept by the day the reader picked, because the family's
    // value is one value.
    expect(picked.getHours()).toBe(9);
    // A field that collects a day is answered the moment the day is picked.
    expect(view.getByTestId("date").props.accessibilityState.expanded).toBe(
      false,
    );
    expect(view.getByText("20/01/2026")).toBeTruthy();
  });

  it("moves between months from the surface's own controls", async () => {
    const view = await renderCalendar(
      <Calendar
        testID="date"
        sheetTestID="sheet"
        label="Start"
        defaultValue={JAN}
      />,
    );

    await press(view, "date");
    await press(view, "sheet-next");

    expect(view.getByText("February 2026")).toBeTruthy();

    await press(view, "sheet-previous");

    expect(view.getByText("January 2026")).toBeTruthy();
  });

  it("keeps the value the consumer owns", async () => {
    const onChange = jest.fn();
    const view = await renderCalendar(
      <Calendar
        testID="date"
        sheetTestID="sheet"
        label="Start"
        value={JAN}
        onChange={onChange}
      />,
    );

    await press(view, "date");
    await press(view, "sheet-day-20");

    expect(onChange).toHaveBeenCalled();
    expect(view.getByText("15/01/2026")).toBeTruthy();
  });

  it("steps the time and applies every step", async () => {
    const onChange = jest.fn();
    const view = await renderCalendar(
      <Calendar
        testID="start"
        sheetTestID="sheet"
        label="Start"
        mode="time"
        value={new Date(2026, 0, 15, 9, 0, 5)}
        onChange={onChange}
      />,
    );

    await press(view, "start");

    expect(view.getByText("HH")).toBeTruthy();
    expect(view.getByText("MM")).toBeTruthy();
    expect(view.getByText("SS")).toBeTruthy();
    // A field that collects a time shows no month, because a day is not what it collects.
    expect(view.queryByTestId("sheet-day-15")).toBeNull();

    await press(view, "sheet-hours-increment");

    const stepped = onChange.mock.calls[0][0] as Date;
    expect(stepped.getHours()).toBe(10);
    expect(stepped.getMinutes()).toBe(0);

    // The last value wraps back to the first rather than stopping at the end of the column.
    await press(view, "sheet-minutes-decrement");

    const wrapped = onChange.mock.calls[1][0] as Date;
    expect(wrapped.getMinutes()).toBe(59);
  });

  it("refuses the month after today's when it refuses future days", async () => {
    const view = await renderCalendar(
      <Calendar
        testID="date"
        sheetTestID="sheet"
        label="Start"
        value={new Date()}
        disableFuture
      />,
    );

    await press(view, "date");

    expect(
      view.getByTestId("sheet-next").props.accessibilityState.disabled,
    ).toBe(true);
  });

  it("empties the field from its own control", async () => {
    const onChange = jest.fn();
    const view = await renderCalendar(
      <Calendar
        testID="date"
        label="Start"
        defaultValue={JAN}
        isClearable
        onChange={onChange}
      />,
    );

    await press(view, "date-clear");

    expect(onChange).toHaveBeenCalledWith(null);
    expect(view.queryByText("15/01/2026")).toBeNull();
    expect(view.getByText(getDefaultPlaceholder("date"))).toBeTruthy();
  });

  it("draws the family's label block and reports an invalid field", async () => {
    const view = await renderCalendar(
      <Calendar
        testID="date"
        label="Start"
        description="When it starts"
        status="error"
        message="Pick a day"
        required
      />,
    );

    expect(view.getByText("Start")).toBeTruthy();
    expect(view.getByText("When it starts")).toBeTruthy();
    expect(view.getByText("Pick a day")).toBeTruthy();
    expect(view.getByText("*")).toBeTruthy();
    expect(view.getByTestId("date").props["aria-invalid"]).toBe(true);
  });

  it("opens the surface its configuration states", async () => {
    const view = await renderCalendar(
      <Calendar testID="start" sheetTestID="sheet" label="Start" />,
      { components: { calendar: { mode: "datetime", required: true } } },
    );

    expect(view.getByText("*")).toBeTruthy();

    await press(view, "start");

    expect(view.getByText("HH")).toBeTruthy();
    // A field that collects both keeps the surface open until the reader is finished.
    expect(view.getByText("Done")).toBeTruthy();
  });
});
