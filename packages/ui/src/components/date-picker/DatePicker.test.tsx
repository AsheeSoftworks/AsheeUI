import { describe, expect, it, vi } from "vitest";
import { createUser, renderWithProvider, screen, waitFor } from "../../test";
import { DatePicker } from "./DatePicker";

/** Click the first enabled day button in the rendered calendar grid. */
async function clickFirstDay(user: ReturnType<typeof createUser>) {
  const dayButtons = screen
    .getAllByRole("button")
    .filter((button) => /^\d{1,2}$/.test(button.textContent ?? ""));

  expect(dayButtons.length).toBeGreaterThan(0);
  await user.click(dayButtons[0]);
}

describe("DatePicker", () => {
  it("starts closed and advertises a popup", () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <DatePicker label="Date" />,
    );
    const input = getByRole("textbox");

    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveAttribute("aria-haspopup", "dialog");
    expect(queryByRole("button", { name: "Next month" })).toBeNull();
  });

  it("opens a calendar with month navigation", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<DatePicker label="Date" />);

    await user.click(getByRole("textbox"));

    expect(screen.getByRole("button", { name: "Previous month" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next month" })).toBeInTheDocument();
  });

  it("reports the selected day and closes", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <DatePicker label="Date" onChange={onChange} />,
    );

    await user.click(getByRole("textbox"));
    await clickFirstDay(user);

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)?.[0]).toBeInstanceOf(Date);

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Next month" }),
      ).toBeNull();
    });
  });

  it("does not open while disabled", async () => {
    const user = createUser();
    const { getByRole, queryByRole } = renderWithProvider(
      <DatePicker label="Date" disabled />,
    );
    const input = getByRole("textbox");

    expect(input).toBeDisabled();

    await user.click(input);

    expect(queryByRole("button", { name: "Next month" })).toBeNull();
  });

  // Defect register (M1, D-24): the calendar grid has no `grid` or `gridcell`
  // roles, so its structure is not conveyed to assistive technology.
  it.todo(
    "exposes the calendar grid structure for assistive technology (defect register D-24)",
  );

  // Defect register (M1, D-25): day buttons have no accessible label and no
  // `aria-selected` or `aria-current`, so today and the selected day are
  // conveyed by classes alone.
  it.todo(
    "exposes the selected and current day states (defect register D-25)",
  );

  // Defect register (M1, D-26): shared with the selection family. The calendar
  // has no keyboard navigation (day, week or month movement) and Escape does
  // not close it.
  it.todo(
    "navigates the calendar grid with the keyboard and dismisses with Escape (defect register D-26)",
  );
});
