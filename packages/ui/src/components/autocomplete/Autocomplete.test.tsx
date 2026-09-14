import { describe, expect, it, vi } from "vitest";
import { createUser, renderWithProvider, screen } from "../../test";
import { Autocomplete } from "./Autocomplete";

const OPTIONS = [
  { label: "Alpha", value: "alpha" },
  { label: "Beta", value: "beta" },
  { label: "Gamma", value: "gamma" },
];

describe("Autocomplete", () => {
  it("starts closed and advertises a popup", () => {
    const { getByRole, queryByText } = renderWithProvider(
      <Autocomplete options={OPTIONS} />,
    );
    const input = getByRole("combobox");

    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(queryByText("Alpha")).toBeNull();
  });

  it("filters suggestions as the user types", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Autocomplete options={OPTIONS} />);
    const input = getByRole("combobox");

    await user.click(input);
    await user.type(input, "be");

    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.queryByText("Alpha")).toBeNull();
  });

  it("reports the chosen suggestion", async () => {
    const user = createUser();
    const onValueChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Autocomplete options={OPTIONS} onValueChange={onValueChange} />,
    );
    const input = getByRole("combobox");

    await user.click(input);
    await user.type(input, "gam");
    await user.click(screen.getByText("Gamma"));

    expect(onValueChange).toHaveBeenCalledWith(
      "gamma",
      expect.objectContaining({ value: "gamma" }),
    );
  });

  it("reports raw input changes to the consumer", async () => {
    const user = createUser();
    const onInputChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Autocomplete options={OPTIONS} onInputChange={onInputChange} />,
    );

    await user.type(getByRole("combobox"), "a");

    expect(onInputChange).toHaveBeenCalled();
  });

  // Defect register (M1, D-23): shared with Select. The suggestion list has no
  // listbox or option semantics, and the input exposes no
  // `aria-activedescendant`, so the active suggestion is not conveyed.
  it.todo(
    "exposes listbox, option and active-suggestion semantics (defect register D-23)",
  );

  // Defect register (M1, D-26): shared with Select. No arrow navigation, Enter
  // selection or Escape dismissal exists.
  it.todo(
    "navigates and selects suggestions with the keyboard (defect register D-26)",
  );

  // Defect register (M1, D-27): there is no empty or no-results state to
  // announce when a query matches nothing (`COMP-128`, `TEST-011`).
  it.todo(
    "announces clearly when a query matches no suggestions (defect register D-27)",
  );
});
