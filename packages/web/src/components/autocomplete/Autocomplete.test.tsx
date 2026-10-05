import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  pressKey,
  renderWithProvider,
  screen,
  waitFor,
  within,
} from "../../test";
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
    const { getByRole } = renderWithProvider(
      <Autocomplete options={OPTIONS} />,
    );
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

  // Defect register (M1, D-23): shared with Dropmenu. The suggestion list now
  // carries listbox and option semantics, and the input reports the current
  // suggestion through `aria-activedescendant`.
  it("exposes listbox, option and active-suggestion semantics", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Autocomplete options={OPTIONS} />,
    );
    const input = getByRole("combobox");

    await user.click(input);
    await pressKey(user, "ArrowDown");

    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");

    expect(options).toHaveLength(OPTIONS.length);
    expect(input).toHaveAttribute("aria-controls", listbox.id);
    expect(input).toHaveAttribute("aria-autocomplete", "list");

    const activeId = input.getAttribute("aria-activedescendant");

    expect(activeId).toBe(options[0].id);
    expect(document.getElementById(activeId as string)).toBe(options[0]);
  });

  // Defect register (M1, D-26): shared with Dropmenu. There was no arrow
  // navigation, Enter selection or Escape dismissal.
  it("navigates and selects suggestions with the keyboard", async () => {
    const user = createUser();
    const onValueChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Autocomplete options={OPTIONS} onValueChange={onValueChange} />,
    );
    const input = getByRole("combobox");

    await user.click(input);
    await user.type(input, "a");

    await pressKey(user, "ArrowDown");
    await pressKey(user, "ArrowDown");

    const options = within(screen.getByRole("listbox")).getAllByRole("option");

    expect(input.getAttribute("aria-activedescendant")).toBe(options[1].id);

    await pressKey(user, "Enter");

    expect(onValueChange).toHaveBeenCalledWith(
      "beta",
      expect.objectContaining({ value: "beta" }),
    );
    expect(input).toHaveValue("Beta");
  });

  it("dismisses the suggestions with Escape and keeps the typed text", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Autocomplete options={OPTIONS} />,
    );
    const input = getByRole("combobox");

    await user.click(input);
    await user.type(input, "be");

    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await pressKey(user, "Escape");

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
    });

    expect(input).toHaveValue("be");
  });

  // Defect register (M1, D-27): there was no empty or no-results state to
  // announce when a query matched nothing (`COMP-128`, `TEST-011`).
  it("announces clearly when a query matches no suggestions", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Autocomplete options={OPTIONS} />,
    );
    const input = getByRole("combobox");

    await user.click(input);
    await user.type(input, "zzz");

    expect(screen.queryByRole("option")).toBeNull();

    const status = screen.getByRole("status");

    expect(status).toHaveTextContent("No options found");
  });
});
