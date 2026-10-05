import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  pressKey,
  renderWithProvider,
  screen,
  waitFor,
  within,
} from "../../test";
import { Calendar } from "./Calendar";

/** Click the first enabled day button in the rendered calendar grid. */
async function clickFirstDay(user: ReturnType<typeof createUser>) {
  const dayButtons = screen
    .getAllByRole("button")
    .filter((button) => /^\d{1,2}$/.test(button.textContent ?? ""));

  expect(dayButtons.length).toBeGreaterThan(0);
  await user.click(dayButtons[0]);
}

describe("Calendar", () => {
  it("starts closed and advertises a popup", () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <Calendar label="Date" />,
    );
    const input = getByRole("textbox");

    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveAttribute("aria-haspopup", "dialog");
    expect(queryByRole("button", { name: "Next month" })).toBeNull();
  });

  it("opens a calendar with month navigation", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Calendar label="Date" />);

    await user.click(getByRole("textbox"));

    expect(
      screen.getByRole("button", { name: "Previous month" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next month" }),
    ).toBeInTheDocument();
  });

  it("reports the selected day and closes", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Calendar label="Date" onChange={onChange} />,
    );

    await user.click(getByRole("textbox"));
    await clickFirstDay(user);

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)?.[0]).toBeInstanceOf(Date);

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Next month" })).toBeNull();
    });
  });

  it("does not open while disabled", async () => {
    const user = createUser();
    const { getByRole, queryByRole } = renderWithProvider(
      <Calendar label="Date" disabled />,
    );
    const input = getByRole("textbox");

    expect(input).toBeDisabled();

    await user.click(input);

    expect(queryByRole("button", { name: "Next month" })).toBeNull();
  });

  // Defect register (M1, D-24): the calendar grid had no `grid` or `gridcell`
  // roles, so its structure was not conveyed to assistive technology.
  it("exposes the calendar grid structure", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Calendar label="Date" />);

    await user.click(getByRole("textbox"));

    const grid = screen.getByRole("grid");

    expect(within(grid).getAllByRole("columnheader")).toHaveLength(7);
    expect(within(grid).getAllByRole("row").length).toBeGreaterThan(1);
    expect(within(grid).getAllByRole("gridcell").length).toBeGreaterThanOrEqual(
      28,
    );
    expect(grid).toHaveAccessibleName(
      new RegExp(String(new Date().getFullYear())),
    );
  });

  // Defect register (M1, D-25): day buttons had no accessible label and no
  // `aria-selected` or `aria-current`, so today and the selected day were
  // conveyed by classes alone.
  it("exposes the selected day and labels every day it renders", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Calendar
        label="Date"
        mode="datetime"
        selected={new Date(2026, 4, 14)}
      />,
    );

    await user.click(getByRole("textbox"));

    const selectedCell = screen.getByRole("gridcell", { selected: true });

    expect(selectedCell).toHaveAttribute("aria-selected", "true");
    expect(within(selectedCell).getByRole("button")).toHaveAccessibleName(
      "14 May 2026",
    );

    for (const button of within(screen.getByRole("grid")).getAllByRole(
      "button",
    )) {
      expect(button).toHaveAccessibleName(/^\d{1,2} [A-Za-z]+ \d{4}$/);
    }
  });

  it("marks today with aria-current when today is in the rendered month", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Calendar label="Date" />);

    await user.click(getByRole("textbox"));

    const today = new Date();
    const todayCell = screen.getByRole("gridcell", { current: "date" });

    expect(todayCell).toHaveAttribute("aria-current", "date");
    expect(within(todayCell).getByRole("button")).toHaveAccessibleName(
      new RegExp(`^${today.getDate()} `),
    );
  });

  // Defect register (M1, D-26): shared with the selection family. The calendar
  // had no keyboard navigation (day, week or month movement) and Escape did not
  // close it.
  it("navigates the grid with the keyboard and dismisses with Escape", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Calendar label="Date" mode="datetime" />,
    );

    await user.click(getByRole("textbox"));

    const grid = screen.getByRole("grid");

    /** The day the grid's keyboard navigation is currently on. */
    function navigatedDay(): HTMLButtonElement | null {
      for (const cell of within(grid).getAllByRole("gridcell")) {
        const button = cell.querySelector("button");

        if (button?.tabIndex === 0) return button;
      }

      return null;
    }

    const start = navigatedDay();

    expect(start).not.toBeNull();
    start?.focus();
    expect(start).toHaveFocus();

    const startLabel = start?.getAttribute("aria-label");

    await pressKey(user, "ArrowRight");

    const nextDay = navigatedDay();

    expect(nextDay?.getAttribute("aria-label")).not.toBe(startLabel);
    expect(nextDay).toHaveFocus();

    await pressKey(user, "Escape");

    await waitFor(() => {
      expect(screen.queryByRole("grid")).toBeNull();
    });
  });
});
