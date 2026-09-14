import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectDescribedBy,
  renderWithProvider,
  screen,
  waitFor,
} from "../../test";
import { Dropmenu } from "./Dropmenu";

const OPTIONS = [
  { label: "One", value: "one" },
  { label: "Two", value: "two" },
  { label: "Three", value: "three" },
];

describe("Dropmenu", () => {
  it("starts closed with its placeholder and advertises a popup", () => {
    const { getByRole, queryByText } = renderWithProvider(
      <Dropmenu label="Choice" options={OPTIONS} />,
    );
    const trigger = getByRole("combobox");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(queryByText("One")).toBeNull();
  });

  it("opens the option list and reports the chosen value", async () => {
    const user = createUser();
    const onValueChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Dropmenu label="Choice" options={OPTIONS} onValueChange={onValueChange} />,
    );
    const trigger = getByRole("combobox");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByText("Two"));

    expect(onValueChange).toHaveBeenCalledWith("two");

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("links its description and message to the trigger", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Dropmenu
        label="Choice"
        options={OPTIONS}
        description="Pick one option"
        message="Required field"
      />,
    );
    const trigger = getByRole("combobox");

    expectDescribedBy(trigger, getByText("Pick one option"));
  });

  // Defect register (M1, D-30): only the description is linked through
  // `aria-describedby`; the validation message id is omitted, unlike Input and
  // Textarea which link both.
  it.todo(
    "links its validation message to the trigger (defect register D-30)",
  );

  it("filters options when search is enabled", async () => {
    const user = createUser();
    const { getByRole, getByPlaceholderText } = renderWithProvider(
      <Dropmenu label="Choice" options={OPTIONS} isSearch />,
    );

    await user.click(getByRole("combobox"));
    await user.type(getByPlaceholderText("Search options..."), "thr");

    expect(screen.getByText("Three")).toBeInTheDocument();
    expect(screen.queryByText("Two")).toBeNull();
  });

  it("does not open while disabled", async () => {
    const user = createUser();
    const { getByRole, queryByText } = renderWithProvider(
      <Dropmenu label="Choice" options={OPTIONS} disabled />,
    );
    const trigger = getByRole("combobox");

    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(queryByText("One")).toBeNull();
  });

  // Defect register (M1, D-28): `FieldShell` renders `label for="<field id>"`,
  // but the trigger never receives that id, so the field label is associated
  // with a non-existent element and the trigger's accessible name is empty.
  it.todo(
    "takes its accessible name from the field label (defect register D-28)",
  );

  // Defect register (M1, D-23): the trigger advertises `aria-haspopup="listbox"`
  // but the shared menu helper renders no `listbox`, `option`, `aria-selected`
  // or `aria-activedescendant` semantics, so the option list has no
  // accessibility structure at all.
  it.todo(
    "exposes listbox and option semantics for its option list (defect register D-23)",
  );

  // Defect register (M1, D-26): there is no keyboard interaction anywhere in
  // the selection family. Arrow navigation, Enter selection, Escape dismissal
  // and typeahead are all absent, so the control is pointer-only.
  it.todo(
    "opens, navigates, selects and dismisses with the keyboard (defect register D-26)",
  );
});
