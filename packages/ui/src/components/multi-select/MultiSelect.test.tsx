import { describe, expect, it, vi } from "vitest";
import { createUser, renderWithProvider, screen, waitFor } from "../../test";
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

  // Defect register (M1, D-29): in uncontrolled usage the component reports only
  // the newly toggled value instead of the accumulated selection, so a consumer
  // must own the value and merge it (the same class of gap as D-12 and D-16).
  it.todo(
    "accumulates the selection when uncontrolled (defect register D-29)",
  );

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

  // Defect register (M1, D-28): shared with Select. The field label is not
  // associated with the combobox trigger, so the trigger has no accessible name.
  it.todo(
    "takes its accessible name from the field label (defect register D-28)",
  );

  // Defect register (M1, D-23): shared with Select. The menu has no listbox or
  // option semantics.
  it.todo(
    "exposes listbox and option semantics for its option list (defect register D-23)",
  );

  // Defect register (M1, D-26): shared with Select. Only chip removal handles a
  // key (Enter or Space); opening, navigating, selecting and dismissing the menu
  // have no keyboard path.
  it.todo(
    "opens, navigates, selects and dismisses with the keyboard (defect register D-26)",
  );
});
