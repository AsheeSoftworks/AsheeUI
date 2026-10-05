import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectDescribedBy,
  pressKey,
  renderWithProvider,
  screen,
  typeahead,
  waitFor,
  within,
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
      <Dropmenu
        label="Choice"
        options={OPTIONS}
        onValueChange={onValueChange}
      />,
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
  // `aria-describedby`; the validation message id was omitted, unlike Input and
  // Textarea which link both.
  it("links its validation message to the trigger", () => {
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
    expectDescribedBy(trigger, getByText("Required field"));
  });

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
  // but the trigger never receives that id, so the field label was associated
  // with a non-existent element and the trigger's accessible name was empty.
  it("takes its accessible name from the field label", () => {
    const { getByRole } = renderWithProvider(
      <Dropmenu label="Choice" options={OPTIONS} />,
    );

    expect(getByRole("combobox", { name: "Choice" })).toBeInTheDocument();
  });

  // Defect register (M1, D-23): the trigger advertises `aria-haspopup="listbox"`
  // and the option list now carries the matching structure.
  it("exposes listbox and option semantics for its option list", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Dropmenu label="Choice" options={OPTIONS} value="two" />,
    );
    const trigger = getByRole("combobox");

    await user.click(trigger);

    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");

    expect(options).toHaveLength(OPTIONS.length);
    expect(trigger).toHaveAttribute("aria-controls", listbox.id);

    for (const option of options) {
      expect(option).toHaveAttribute("id");
    }

    expect(options[1]).toHaveAttribute("aria-selected", "true");
    expect(options[0]).toHaveAttribute("aria-selected", "false");
  });

  it("skips a disabled option while navigating and marks it as disabled", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Dropmenu
        label="Choice"
        options={[
          { label: "One", value: "one" },
          { label: "Two", value: "two", disabled: true },
          { label: "Three", value: "three" },
        ]}
      />,
    );

    await user.click(getByRole("combobox"));

    const options = within(screen.getByRole("listbox")).getAllByRole("option");

    expect(options[1]).toHaveAttribute("aria-disabled", "true");

    await waitFor(() => {
      expect(options[0]).toHaveFocus();
    });

    await pressKey(user, "ArrowDown");

    await waitFor(() => {
      expect(options[2]).toHaveFocus();
    });

    await pressKey(user, "ArrowDown");

    await waitFor(() => {
      expect(options[0]).toHaveFocus();
    });
  });

  // Defect register (M1, D-26): there was no keyboard interaction anywhere in
  // the selection family, so the control was pointer-only.
  it("opens, navigates, selects and dismisses with the keyboard", async () => {
    const user = createUser();
    const onValueChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Dropmenu
        label="Choice"
        options={OPTIONS}
        onValueChange={onValueChange}
      />,
    );
    const trigger = getByRole("combobox");

    trigger.focus();
    await pressKey(user, "ArrowDown");

    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const options = within(screen.getByRole("listbox")).getAllByRole("option");

    await waitFor(() => {
      expect(options[0]).toHaveFocus();
    });

    await pressKey(user, "ArrowDown");

    await waitFor(() => {
      expect(options[1]).toHaveFocus();
    });

    await typeahead(user, "thr");

    await waitFor(() => {
      expect(options[2]).toHaveFocus();
    });

    await pressKey(user, "Enter");

    expect(onValueChange).toHaveBeenCalledWith("three");

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("dismisses with Escape and returns focus to the trigger", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Dropmenu label="Choice" options={OPTIONS} />,
    );
    const trigger = getByRole("combobox");

    trigger.focus();
    await pressKey(user, "ArrowDown");

    await waitFor(() => {
      expect(
        within(screen.getByRole("listbox")).getAllByRole("option")[0],
      ).toHaveFocus();
    });

    await pressKey(user, "Escape");

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });
});
