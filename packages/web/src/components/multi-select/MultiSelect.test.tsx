import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  pressKey,
  renderWithProvider,
  screen,
  waitFor,
  within,
} from "../../test";
import { MultiSelect } from "./MultiSelect";

const OPTIONS = [
  { label: "One", value: "one" },
  { label: "Two", value: "two" },
  { label: "Three", value: "three" },
];

describe("MultiSelect", () => {
  it("starts closed and advertises a popup", () => {
    const { getByRole, queryByText } = renderWithProvider(
      <MultiSelect label="Choices" options={OPTIONS} />,
    );
    const trigger = getByRole("combobox");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(queryByText("One")).toBeNull();
  });

  it("selects several options and reports the collected values", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <MultiSelect label="Choices" options={OPTIONS} onChange={onChange} />,
    );

    await user.click(getByRole("combobox"));

    await user.click(screen.getByText("One"));
    await user.click(screen.getByText("Three"));

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls.at(-1)?.[0] as unknown[];
    expect(lastCall).toContain("three");
  });

  // Defect register (M1, D-29): in uncontrolled usage the component reported only
  // the newly toggled value instead of the accumulated selection.
  it("accumulates the selection when uncontrolled", async () => {
    const user = createUser();
    const onChange = vi.fn();
    renderWithProvider(
      <MultiSelect label="Choices" options={OPTIONS} onChange={onChange} />,
    );

    await user.click(screen.getByRole("combobox"));

    await user.click(screen.getByText("One"));
    await user.click(screen.getByText("Three"));

    expect(onChange).toHaveBeenLastCalledWith(["one", "three"]);
    expect(screen.getByText("2 selected")).toBeInTheDocument();
  });

  it("toggles an option off again when uncontrolled", async () => {
    const user = createUser();
    const onChange = vi.fn();
    renderWithProvider(
      <MultiSelect label="Choices" options={OPTIONS} onChange={onChange} />,
    );

    await user.click(screen.getByRole("combobox"));

    const option = within(screen.getByRole("listbox")).getAllByRole(
      "option",
    )[1];

    await user.click(option);
    await user.click(option);

    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("shows the selection as chips", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <MultiSelect
        label="Choices"
        options={OPTIONS}
        value={["two"]}
        onChange={() => {}}
      />,
    );

    expect(getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();

    await user.tab();
    await waitFor(() => {
      expect(document.body.textContent).toContain("Two");
    });
  });

  it("filters options with the search field", async () => {
    const user = createUser();
    const { getByRole, getByPlaceholderText } = renderWithProvider(
      <MultiSelect label="Choices" options={OPTIONS} />,
    );

    await user.click(getByRole("combobox"));
    await user.type(getByPlaceholderText("Search..."), "two");

    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(screen.queryByText("One")).toBeNull();
  });

  it("does not open while disabled", async () => {
    const user = createUser();
    const { getByRole, queryByText } = renderWithProvider(
      <MultiSelect label="Choices" options={OPTIONS} disabled />,
    );

    await user.click(getByRole("combobox"));

    expect(queryByText("One")).toBeNull();
  });

  // Defect register (M1, D-28): shared with Dropmenu. The field label is now
  // associated with the combobox trigger, so the trigger has an accessible name.
  it("takes its accessible name from the field label", () => {
    const { getByRole } = renderWithProvider(
      <MultiSelect label="Choices" options={OPTIONS} />,
    );

    expect(getByRole("combobox", { name: "Choices" })).toBeInTheDocument();
  });

  // Defect register (M1, D-23): shared with Dropmenu. The option list now
  // carries listbox and option semantics, and reports that it accepts more than
  // one selection.
  it("exposes listbox and option semantics for its option list", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <MultiSelect label="Choices" options={OPTIONS} value={["two"]} />,
    );
    const trigger = getByRole("combobox");

    await user.click(trigger);

    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");

    expect(listbox).toHaveAttribute("aria-multiselectable", "true");
    expect(trigger).toHaveAttribute("aria-controls", listbox.id);
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    expect(options[0]).toHaveAttribute("aria-selected", "false");
  });

  // Defect register (M1, D-26): shared with Dropmenu. Only chip removal handled
  // a key; opening, navigating, selecting and dismissing the menu did not.
  it("opens, navigates, selects and dismisses with the keyboard", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <MultiSelect label="Choices" options={OPTIONS} onChange={onChange} />,
    );
    const trigger = getByRole("combobox");

    trigger.focus();
    await pressKey(user, "ArrowDown");

    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const options = within(screen.getByRole("listbox")).getAllByRole("option");

    await pressKey(user, "ArrowDown");

    await waitFor(() => {
      expect(options[0]).toHaveFocus();
    });

    await pressKey(user, "ArrowDown");

    await waitFor(() => {
      expect(options[1]).toHaveFocus();
    });

    await pressKey(user, "Enter");

    expect(onChange).toHaveBeenLastCalledWith(["two"]);

    await pressKey(user, "Escape");

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("removes a selection with the keyboard", async () => {
    const user = createUser();
    const onChange = vi.fn();
    renderWithProvider(
      <MultiSelect
        label="Choices"
        options={OPTIONS}
        value={["two"]}
        onChange={onChange}
      />,
    );

    const removeButton = screen.getByRole("button", { name: "Remove Two" });

    removeButton.focus();
    await pressKey(user, "Enter");

    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});
