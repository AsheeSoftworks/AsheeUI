import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getComponentDefaults, registerComponentDefaults } from "@asheeui/core";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectAccessibleName,
  expectDescribedBy,
  expectHydrationClean,
  expectState,
  fireEvent,
  makeComponentConfig,
  makeConfig,
  pressKey,
  renderToServerString,
  renderWithProvider,
  screen,
  typeahead,
  userEvent,
  waitFor,
  within,
} from "../../test";
import { Autocomplete } from "./autocomplete/Autocomplete";
import { Button } from "./button/Button";
import { Calendar } from "./calendar/Calendar";
import { Dropdown } from "./dropmenu/Dropdown";
import { Dropmenu } from "./dropmenu/Dropmenu";
import { FileUpload } from "./file-upload/FileUpload";
import {
  describeRejectedFiles,
  formatFileSize,
} from "./file-upload/file-upload.helpers";
import { Form } from "./form/Form";
import { Input } from "./input/Input";
import { defaultInputConfig } from "./input/input-config";
import { MultiSelect } from "./multi-select/MultiSelect";
import { PinInput, sanitizePinValue } from "./pin-input/PinInput";
import { Radio, RadioGroup } from "./radio";
import { SearchInput } from "./search-input/SearchInput";
import { Stepper } from "./stepper/Stepper";
import { Switch } from "./switch/Switch";
import { Textarea } from "./textarea/Textarea";

describe("Autocomplete", () => {
  const OPTIONS = [
    { label: "Alpha", value: "alpha" },
    { label: "Beta", value: "beta" },
    { label: "Gamma", value: "gamma" },
  ];
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

    expect(activeId).toBe(options[0]!.id);
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

    expect(input.getAttribute("aria-activedescendant")).toBe(options[1]!.id);

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

  // A documentation example is copy-paste code, so an example that passes a prop
  // the component does not have hands the reader a type error. `isClearable`
  // belongs to Calendar and Dropmenu: this field has no clear control, so the
  // example must not offer one. Adding a clear control here means adding it to
  // the example, the props and this test together.
  it("keeps its documented example to props the component accepts", async () => {
    // The suite runs from the package root (`packages/web`), which is where the
    // component's source sits.
    const source = await readFile(
      join(process.cwd(), "src/components/forms/autocomplete/Autocomplete.tsx"),
      "utf8",
    );
    const examples = source.slice(source.indexOf("@example"));

    expect(examples).toContain("<Autocomplete");
    expect(examples).not.toContain("isClearable");
  });
});

describe("Button", () => {
  /** Match a utility as a complete class, not as a substring of a variant. */
  const hasClass = (className: string, utility: string): boolean =>
    new RegExp(`(?:^|\\s)${utility}(?:\\s|$)`).test(className);
  it("renders an accessible button and activates it on click", async () => {
    const user = createUser();
    const onClick = vi.fn();
    const { getByRole } = renderWithProvider(
      <Button onClick={onClick}>Save</Button>,
    );
    const button = getByRole("button", { name: "Save" });

    expectAccessibleName(button, "Save");

    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("answers the platform's activation name as well as the DOM's", async () => {
    // A shared component cannot pass `onClick` on a device or `onPress` in a browser, so the
    // DOM button accepts both names and both routes reach the same guarded handler.
    const user = createUser();
    const onPress = vi.fn();
    const onClick = vi.fn();
    const { getByRole } = renderWithProvider(
      <Button onClick={onClick} onPress={onPress}>
        Save
      </Button>,
    );

    await user.click(getByRole("button", { name: "Save" }));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
    // The platform's name is consumed here rather than forwarded to the DOM element, where
    // React would report it as an unknown attribute.
    expect(getByRole("button", { name: "Save" }).hasAttribute("onPress")).toBe(
      false,
    );
  });

  it("activates with the keyboard and shows focus", async () => {
    const user = createUser();
    const onClick = vi.fn();
    const { getByRole } = renderWithProvider(
      <Button onClick={onClick}>Save</Button>,
    );
    const button = getByRole("button", { name: "Save" });

    await user.tab();
    expect(button).toHaveFocus();

    await pressKey(user, "Enter");
    expect(onClick).toHaveBeenCalledTimes(1);

    await pressKey(user, " ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("applies an explicit variant over the global default", () => {
    const { getByRole } = renderWithProvider(
      <Button variant="ghost">Ghost</Button>,
      { config: makeConfig({ defaultVariant: "solid" }) },
    );

    expect(hasClass(getByRole("button").className, "bg-transparent")).toBe(
      true,
    );
  });

  it("inherits the global default variant when no prop is given", () => {
    const { getByRole } = renderWithProvider(<Button>Default</Button>, {
      config: makeConfig({ defaultVariant: "solid", defaultColor: "primary" }),
    });

    expect(hasClass(getByRole("button").className, "bg-primary")).toBe(true);
  });

  it("lets component configuration override the global default", () => {
    const { getByRole } = renderWithProvider(<Button>Configured</Button>, {
      config: makeConfig({
        defaultVariant: "ghost",
        components: { button: { variant: "solid" } },
      }),
    });

    expect(hasClass(getByRole("button").className, "bg-primary")).toBe(true);
  });

  it("lets consumer classes win over framework classes", () => {
    const { getByRole } = renderWithProvider(
      <Button className="bg-danger">Danger</Button>,
    );

    expect(hasClass(getByRole("button").className, "bg-danger")).toBe(true);
    expect(hasClass(getByRole("button").className, "bg-primary")).toBe(false);
  });

  it("honours the animate option", () => {
    const animated = renderWithProvider(<Button>Animated</Button>);
    const staticButton = renderWithProvider(
      <Button animate={false}>Static</Button>,
    );

    expect(
      animated.getByRole("button", { name: "Animated" }).className,
    ).toContain("motion-safe:transition-transform");
    expect(
      staticButton.getByRole("button", { name: "Static" }).className,
    ).not.toContain("motion-safe:transition-transform");
  });

  it("does not interact when disabled", async () => {
    const user = createUser();
    const onClick = vi.fn();
    const { getByRole } = renderWithProvider(
      <Button isDisabled onClick={onClick}>
        Disabled
      </Button>,
    );
    const button = getByRole("button");

    expectState(button, { disabled: true });
    expect(button).toHaveAttribute("aria-disabled", "true");

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("exposes a busy state, keeps its name and blocks interaction while loading", async () => {
    const user = createUser();
    const onClick = vi.fn();
    const { getByRole, queryByText } = renderWithProvider(
      <Button isLoading onClick={onClick}>
        Save
      </Button>,
    );
    const button = getByRole("button");

    expect(button).toHaveAttribute("aria-busy", "true");
    // The label stays in the accessible name while the control is busy, so a
    // reader still hears which action is running.
    expect(button).toHaveAccessibleName(/Save/);
    expect(queryByText("Loading")).not.toBeNull();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("draws its busy ring at the button's density", () => {
    const large = renderWithProvider(
      <Button isLoading size="lg">
        Save
      </Button>,
    );
    const largeRing = large.getByRole("button").querySelector("svg");

    // The ring is a `Spinner` sized by token, not a class the token was pasted
    // into: a large control gets a large ring, and no meaningless class is emitted.
    expect(largeRing?.getAttribute("class")).toContain("w-5");
    expect(largeRing?.getAttribute("class")).not.toContain("w-4");
    large.unmount();

    const small = renderWithProvider(
      <Button isLoading size="sm">
        Save
      </Button>,
    );

    expect(
      small.getByRole("button").querySelector("svg")?.getAttribute("class"),
    ).toContain("w-3.5");
  });

  it("renders as a link when an href is provided", () => {
    const { getByRole } = renderWithProvider(
      <Button href="/docs">Documentation</Button>,
    );
    const link = getByRole("link", { name: "Documentation" });

    expect(link).toHaveAttribute("href", "/docs");
  });

  // A button is not prose. When `href` makes it an anchor, a page that underlines its links declares the rule
  // for its own anchors (the documentation body states `.page-prose a`), so the base classes state the opposite
  // and leave the ink to the variant.
  it("draws no underline through a link button's label", () => {
    const { getByRole } = renderWithProvider(
      <Button href="/docs">Documentation</Button>,
    );

    expect(hasClass(getByRole("link").className, "no-underline")).toBe(true);
  });

  it("keeps a solid button's label in the ink that reads against its fill", () => {
    const { getByRole } = renderWithProvider(
      <Button variant="solid" color="primary">
        Pay
      </Button>,
    );

    expect(hasClass(getByRole("button").className, "text-on-solid")).toBe(true);
  });
});

describe("Calendar", () => {
  /** Click the first enabled day button in the rendered calendar grid. */
  async function clickFirstDay(user: ReturnType<typeof createUser>) {
    const dayButtons = screen
      .getAllByRole("button")
      .filter((button) => /^\d{1,2}$/.test(button.textContent ?? ""));

    expect(dayButtons.length).toBeGreaterThan(0);
    await user.click(dayButtons[0]!);
  }
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

  // The default placeholder names the field's own task rather than the surface
  // that hosts it, so a reader is told what will be collected in each mode.
  it("names the field's task in its default placeholder", () => {
    const date = renderWithProvider(<Calendar label="Date" />);

    expect(date.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Select a date",
    );
    date.unmount();

    const time = renderWithProvider(<Calendar label="Time" mode="time" />);

    expect(time.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Select a time",
    );
    time.unmount();

    const dateAndTime = renderWithProvider(
      <Calendar label="Date and time" mode="datetime" />,
    );

    expect(dateAndTime.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Select a date and time",
    );
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

  // A month grid is a grid of weeks, so Home and End move within the row the
  // reader is on rather than to the ends of the month.
  it("moves to the ends of the focused week with Home and End", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Calendar
        label="Date"
        mode="datetime"
        selected={new Date(2026, 4, 14)}
      />,
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

    // 14 May 2026 is a Thursday, so its week runs from Sunday the 10th to
    // Saturday the 16th.
    const start = navigatedDay();

    expect(start).toHaveAccessibleName("14 May 2026");
    start?.focus();

    await pressKey(user, "Home");

    expect(navigatedDay()).toHaveAccessibleName("10 May 2026");
    expect(navigatedDay()).toHaveFocus();

    await pressKey(user, "End");

    expect(navigatedDay()).toHaveAccessibleName("16 May 2026");
    expect(navigatedDay()).toHaveFocus();
  });
});

describe("Dropmenu", () => {
  const OPTIONS = [
    { label: "One", value: "one" },
    { label: "Two", value: "two" },
    { label: "Three", value: "three" },
  ];
  // The documentation names the component `Dropdown`, and the alias is the same component rather than a
  // second implementation: one element, one set of props, one configuration section.
  it("is also exported as Dropdown, the documented name", () => {
    expect(Dropdown).toBe(Dropmenu);
  });

  it("states the documented name in its default placeholder", () => {
    const { getByRole } = renderWithProvider(
      <Dropdown label="Choice" options={OPTIONS} />,
    );

    expect(getByRole("combobox")).toHaveTextContent("Dropdown...");
  });

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

describe("FileUpload", () => {
  /**
   * Behaviour tests for the file field.
   *
   * The tests state the field's contract: it names the picker, it reports the
   * files the reader chose or dropped, it leaves out a file over the size limit and
   * says so, it lists the chosen files with a remove control that says what it
   * removes, and it shares the field contract with the other fields.
   */

  /**
   * Build a file of a known size.
   *
   * @param name - The file's name.
   * @param bytes - Its size in bytes.
   * @returns The file.
   */
  function makeFile(name: string, bytes: number): File {
    return new File(["x".repeat(bytes)], name, {
      type: "application/pdf",
      lastModified: 1,
    });
  }
  it("names the picker and passes the picker's own rules through", () => {
    const { getByLabelText } = renderWithProvider(
      <FileUpload
        label="Attachments"
        accept="application/pdf"
        multiple
        onFilesSelected={() => undefined}
      />,
    );
    const input = getByLabelText("Attachments") as HTMLInputElement;

    expect(input.type).toBe("file");
    expect(input).toHaveAttribute("accept", "application/pdf");
    expect(input).toHaveAttribute("multiple");
  });

  it("reports the files the reader chose", () => {
    const onFilesSelected = vi.fn();
    const { getByLabelText } = renderWithProvider(
      <FileUpload label="Attachments" onFilesSelected={onFilesSelected} />,
    );
    const invoice = makeFile("invoice.pdf", 10);

    fireEvent.change(getByLabelText("Attachments"), {
      target: { files: [invoice] },
    });

    expect(onFilesSelected).toHaveBeenCalledWith([invoice]);
  });

  it("reports the files the reader dropped", () => {
    const onFilesSelected = vi.fn();
    const { getByText } = renderWithProvider(
      <FileUpload label="Attachments" onFilesSelected={onFilesSelected} />,
    );
    const invoice = makeFile("invoice.pdf", 10);
    const zone = getByText("Choose files").closest("label") as HTMLElement;

    fireEvent.drop(zone, { dataTransfer: { files: [invoice] } });

    expect(onFilesSelected).toHaveBeenCalledWith([invoice]);
  });

  it("leaves out a file over the size limit and says so", () => {
    const onFilesSelected = vi.fn();
    const { getByLabelText, getByRole, getByText } = renderWithProvider(
      <FileUpload
        label="Attachments"
        maxSize={5}
        onFilesSelected={onFilesSelected}
      />,
    );

    fireEvent.change(getByLabelText("Attachments"), {
      target: { files: [makeFile("big.pdf", 10)] },
    });

    expect(onFilesSelected).not.toHaveBeenCalled();
    expect(getByText(/larger than 5 B/)).toBeTruthy();
    expect(getByRole("alert")).toBeTruthy();
  });

  it("keeps the files within the limit and reports the rest", () => {
    const onFilesSelected = vi.fn();
    const { getByLabelText, getByText } = renderWithProvider(
      <FileUpload
        label="Attachments"
        maxSize={5}
        multiple
        onFilesSelected={onFilesSelected}
      />,
    );
    const small = makeFile("small.pdf", 3);
    const big = makeFile("big.pdf", 10);

    fireEvent.change(getByLabelText("Attachments"), {
      target: { files: [small, big] },
    });

    expect(onFilesSelected).toHaveBeenCalledWith([small]);
    expect(getByText(/larger than 5 B/)).toBeTruthy();
  });

  it("lists the chosen files and removes one through a named control", async () => {
    const onRemove = vi.fn();
    const invoice = makeFile("invoice.pdf", 10);
    const { getByRole, getAllByRole } = renderWithProvider(
      <FileUpload
        label="Attachments"
        files={[invoice]}
        onRemove={onRemove}
        onFilesSelected={() => undefined}
      />,
    );
    const user = userEvent.setup();

    expect(getAllByRole("listitem")[0]).toHaveTextContent("invoice.pdf");

    await user.click(getByRole("button", { name: "Remove invoice.pdf" }));

    expect(onRemove).toHaveBeenCalledWith(invoice);
  });

  it("draws no remove control when the field cannot remove anything", () => {
    const { queryByRole } = renderWithProvider(
      <FileUpload
        label="Attachments"
        files={[makeFile("invoice.pdf", 10)]}
        onFilesSelected={() => undefined}
      />,
    );

    expect(queryByRole("button")).toBeNull();
  });

  it("refuses the picker and the drop when it is unavailable", () => {
    const onFilesSelected = vi.fn();
    const { getByLabelText, getByText } = renderWithProvider(
      <FileUpload
        label="Attachments"
        isDisabled
        onFilesSelected={onFilesSelected}
      />,
    );

    expect(getByLabelText("Attachments")).toBeDisabled();

    fireEvent.drop(getByText("Choose files").closest("label") as HTMLElement, {
      dataTransfer: { files: [makeFile("invoice.pdf", 10)] },
    });

    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it("takes its wording and its density from configuration", () => {
    const { getByText } = renderWithProvider(
      <FileUpload label="Attachments" onFilesSelected={() => undefined} />,
      {
        config: makeComponentConfig("fileupload", {
          buttonLabel: "Upload a receipt",
          hint: "Drop it here",
          size: "sm",
        }),
      },
    );

    expect(getByText("Upload a receipt")).toBeTruthy();
    expect(getByText(/Drop it here/i)).toBeTruthy();
    expect(getByText("Upload a receipt").closest("label")?.className).toContain(
      "px-4",
    );
  });

  it("shows the consumer's own message and status", () => {
    const { getByRole, getByText } = renderWithProvider(
      <FileUpload
        label="Attachments"
        message="This file type is not supported."
        status="error"
        onFilesSelected={() => undefined}
      />,
    );

    expect(getByRole("alert")).toHaveTextContent(
      "This file type is not supported.",
    );
    expect(getByText("This file type is not supported.")).toBeTruthy();
  });

  it("forwards its ref to the picker", () => {
    const ref = createRef<HTMLInputElement>();
    const { getByLabelText } = renderWithProvider(
      <FileUpload
        label="Attachments"
        ref={ref}
        onFilesSelected={() => undefined}
      />,
    );

    expect(ref.current).toBe(getByLabelText("Attachments"));
  });

  it("states the requirement on the picker as well as on the label", () => {
    const required = renderWithProvider(
      <FileUpload
        label="Attachments"
        required
        onFilesSelected={() => undefined}
      />,
    );
    const requiredInput = required.getByLabelText(/Attachments/);

    // The marker and the attribute come from the same prop, so the field cannot
    // look required while the browser accepts an empty submission.
    expect(requiredInput).toBeRequired();
    expect(required.getByText("*")).toBeTruthy();
    required.unmount();

    const optional = renderWithProvider(
      <FileUpload label="Attachments" onFilesSelected={() => undefined} />,
    );

    expect(optional.getByLabelText("Attachments")).not.toBeRequired();
    expect(optional.queryByText("*")).toBeNull();
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const markup = renderToServerString(
      <FileUpload label="Attachments" onFilesSelected={() => undefined} />,
    );

    expect(markup).toContain('type="file"');
    expect(markup).toContain("Choose files");
    expectHydrationClean(
      <FileUpload
        label="Attachments"
        files={[makeFile("invoice.pdf", 10)]}
        onFilesSelected={() => undefined}
      />,
    );
  });
});

describe("file size descriptions", () => {
  it("describes a size in the reader's terms", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5 MB");
  });

  it("describes one file left out differently from several", () => {
    expect(describeRejectedFiles(1, 1024)).toContain("One file was");
    expect(describeRejectedFiles(2, 1024)).toContain("2 files were");
  });
});

describe("Form", () => {
  it("preserves the native form contract", () => {
    const { container } = renderWithProvider(
      <Form
        id="invoice-form"
        action="/invoices"
        method="post"
        noValidate
        aria-label="Invoice details">
        <input name="reference" />
      </Form>,
    );
    const form = container.querySelector("#invoice-form") as HTMLFormElement;

    expect(form.tagName).toBe("FORM");
    expect(form).toHaveAttribute("action", "/invoices");
    expect(form).toHaveAttribute("method", "post");
    expect(form).toHaveAttribute("novalidate");
  });

  it("reaches the native element through the forwarded ref", () => {
    const ref = createRef<HTMLFormElement>();

    renderWithProvider(
      <Form ref={ref} aria-label="Invoice details">
        <input name="reference" />
      </Form>,
    );

    expect(ref.current).toBeInstanceOf(HTMLFormElement);
    expect(ref.current?.tagName).toBe("FORM");
  });

  it("groups its fields under the legend", () => {
    const { getByRole } = renderWithProvider(
      <Form legend="Invoice details">
        <input name="reference" />
      </Form>,
    );

    expect(getByRole("group", { name: "Invoice details" })).toBeInTheDocument();
  });

  it("reports a submission through the native event", () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) =>
      event.preventDefault(),
    );
    const { container } = renderWithProvider(
      <Form onSubmit={onSubmit} aria-label="Invoice details">
        <input name="reference" />
      </Form>,
    );
    const form = container.querySelector("form") as HTMLFormElement;

    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]![0]).toHaveProperty("type", "submit");
  });

  it("submits from the control it renders", async () => {
    const user = createUser();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) =>
      event.preventDefault(),
    );
    const { getByRole } = renderWithProvider(
      <Form submitLabel="Save" onSubmit={onSubmit} aria-label="Invoice details">
        <input name="reference" />
      </Form>,
    );

    await user.click(getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows a pending submission on the submit control it renders", () => {
    const { getByRole } = renderWithProvider(
      <Form submitLabel="Save" isPending aria-label="Invoice details">
        <input name="reference" />
      </Form>,
    );
    const submit = getByRole("button", { name: /Save/ });

    expect(submit).toBeDisabled();
    expect(submit).toHaveAttribute("aria-busy", "true");
    expect(submit).toHaveAccessibleName(/Save/);
  });

  it("does not move focus when it renders or when a submission is rejected", () => {
    const { container } = renderWithProvider(
      <Form
        submitLabel="Save"
        onSubmit={(event) => event.preventDefault()}
        aria-label="Invoice details">
        <input name="reference" aria-label="Reference" />
      </Form>,
    );

    expect(document.activeElement).toBe(document.body);

    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    expect(document.activeElement).toBe(document.body);
  });

  it("resolves the submit control's tokens from configuration", () => {
    const { getByRole } = renderWithProvider(
      <Form submitLabel="Save" aria-label="Invoice details">
        <input name="reference" />
      </Form>,
      {
        config: makeComponentConfig("form", {
          submitColor: "danger",
          submitVariant: "bordered",
        }),
      },
    );

    expect(getByRole("button", { name: "Save" }).className).toContain("danger");
  });

  it("appends consumer classes to the form element", () => {
    const { container } = renderWithProvider(
      <Form className="flex flex-col gap-4" aria-label="Invoice details">
        <input name="reference" />
      </Form>,
    );

    expect(container.querySelector("form")?.className).toContain(
      "flex flex-col gap-4",
    );
  });

  it("hydrates its server markup without a mismatch", () => {
    expectHydrationClean(
      <Form legend="Invoice details" submitLabel="Save" action="/invoices">
        <input name="reference" />
      </Form>,
    );
  });
});

describe("Input", () => {
  it("associates its label and accepts typing", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" onChange={onChange} />,
    );
    const input = getByLabelText("Email") as HTMLInputElement;

    await user.type(input, "hello");

    expect(input.value).toBe("hello");
    expect(onChange).toHaveBeenCalled();
  });

  it("forwards native input attributes", () => {
    const { getByLabelText } = renderWithProvider(
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="you@example.com"
      />,
    );
    const input = getByLabelText("Email");

    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("placeholder", "you@example.com");
  });

  it("links its description and error message and marks the field invalid", () => {
    const { getByLabelText, getByText } = renderWithProvider(
      <Input
        label="Email"
        description="We never share it"
        message="Enter a valid address"
        status="error"
      />,
    );
    const input = getByLabelText("Email");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expectDescribedBy(input, getByText("We never share it"));
    expectDescribedBy(input, getByText("Enter a valid address"));
  });

  it("does not mark a non-error status as invalid", () => {
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" message="Looks good" status="success" />,
    );

    expect(getByLabelText("Email")).toHaveAttribute("aria-invalid", "false");
  });

  it("is disabled and rejects typing", async () => {
    const user = createUser();
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" disabled />,
    );
    const input = getByLabelText("Email") as HTMLInputElement;

    expect(input).toBeDisabled();

    await user.type(input, "hello");

    expect(input.value).toBe("");
  });

  it("renders its start and end content", () => {
    const { getByText } = renderWithProvider(
      <Input
        label="Search"
        startContent={<span>start-slot</span>}
        endContent={<span>end-slot</span>}
      />,
    );

    expect(getByText("start-slot")).toBeInTheDocument();
    expect(getByText("end-slot")).toBeInTheDocument();
  });

  it("reports a change through the field contract's handler as well as the DOM's", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const onChangeText = vi.fn();
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" onChange={onChange} onChangeText={onChangeText} />,
    );
    const input = getByLabelText("Email") as HTMLInputElement;

    await user.type(input, "hi");

    expect(onChangeText).toHaveBeenLastCalledWith("hi");
    expect(onChange).toHaveBeenCalled();
  });

  it("reports through the contract's handler on its own, without a DOM handler", async () => {
    const user = createUser();
    const onChangeText = vi.fn();
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" onChangeText={onChangeText} />,
    );
    const input = getByLabelText("Email") as HTMLInputElement;

    await user.type(input, "a");

    expect(onChangeText).toHaveBeenLastCalledWith("a");
    expect(input.value).toBe("a");
  });

  it("does not leak the contract's handler onto the input element", () => {
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" onChangeText={() => {}} />,
    );

    expect(getByLabelText("Email")).not.toHaveAttribute("onChangeText");
  });

  it("marks a required field", () => {
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" required />,
    );

    expect(getByLabelText(/Email/)).toBeRequired();
  });

  it("honours a full radius, as the field family does", () => {
    const { getByLabelText } = renderWithProvider(
      <Input label="Email" radius="full" />,
    );

    expect(getByLabelText("Email").className).toContain("rounded-full");
  });

  it("does not take its surface from the application's defaultVariant", () => {
    // The field family states its own surface: the registered `bordered` and the
    // family fallback answer, so a button-oriented global default never restyles a
    // control. Input passes `undefined` at the global tier for exactly this reason.
    const { getByLabelText } = renderWithProvider(<Input label="Email" />, {
      config: { defaultVariant: "solid" },
    });
    const input = getByLabelText("Email");

    expect(input.className).toContain("bg-transparent");
    expect(input.className).not.toContain("bg-primary ");
  });

  it("still takes a variant stated for the input itself", () => {
    const { getByLabelText } = renderWithProvider(<Input label="Email" />, {
      config: { components: { input: { variant: "solid" } } },
    });

    expect(getByLabelText("Email").className).toContain("bg-primary ");
  });

  it("keeps the family's surface when no registration states a variant", () => {
    // Pins the reason the global tier is `undefined` (F-191). A field still does
    // not read `defaultVariant` when the registered variant is absent, because the
    // family's fallback is the field's surface, not the application's control
    // treatment. The registry has no unregister API, so restore what was there.
    const registered = getComponentDefaults("input");
    registerComponentDefaults("input", {
      ...defaultInputConfig,
      variant: undefined,
    });

    try {
      const { getByLabelText } = renderWithProvider(<Input label="Email" />, {
        config: { defaultVariant: "solid" },
      });
      const input = getByLabelText("Email");

      expect(input.className).toContain("bg-transparent");
      expect(input.className).not.toContain("bg-primary ");
    } finally {
      if (registered) registerComponentDefaults("input", registered);
    }
  });

  it("fills its column by default and sizes to its content when told not to", () => {
    const full = renderWithProvider(<Input label="Email" />);

    expect(full.container.firstElementChild).toHaveClass("w-full");
    full.unmount();

    const inline = renderWithProvider(
      <Input label="Email" fullWidth={false} />,
    );

    expect(inline.container.firstElementChild).toHaveClass("inline-block");
    expect(inline.container.firstElementChild).not.toHaveClass("w-full");
  });

  it("takes its width from configuration", () => {
    const { container } = renderWithProvider(<Input label="Email" />, {
      config: makeComponentConfig("input", { fullWidth: false }),
    });

    expect(container.firstElementChild).toHaveClass("inline-block");
  });
});

describe("MultiSelect", () => {
  const OPTIONS = [
    { label: "One", value: "one" },
    { label: "Two", value: "two" },
    { label: "Three", value: "three" },
  ];
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
    )[1]!;

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

describe("PinInput", () => {
  /**
   * Behaviour tests for the PinInput field.
   *
   * The checks cover the behaviour the component owns: typing, keyboard
   * navigation, deletion, paste distribution, completion reporting, the
   * controlled and uncontrolled forms, and the field contract's accessibility
   * wiring.
   */

  /** The boxes of a rendered PIN field, in order. */
  function boxes(container: HTMLElement): HTMLInputElement[] {
    return Array.from(container.querySelectorAll("input[type='text']"));
  }
  describe("sanitizePinValue", () => {
    it("keeps only the characters the mode accepts", () => {
      expect(sanitizePinValue("12a3", "numeric")).toBe("123");
      expect(sanitizePinValue("12a3-", "alphanumeric")).toBe("12a3");
      expect(sanitizePinValue("ab c", "text")).toBe("abc");
    });
  });
  it("renders one named group with one box per character", () => {
    const { container, getByRole } = renderWithProvider(
      <PinInput length={6} />,
    );

    expect(getByRole("group", { name: "Verification code" })).toBeDefined();
    expect(boxes(container)).toHaveLength(6);
  });

  it("wires the field contract to the group", () => {
    const { container, getByRole, getByText } = renderWithProvider(
      <PinInput
        label="Verification code"
        description="The six digits we sent."
        message="That code has expired."
        status="error"
        required
      />,
    );
    const group = getByRole("group", { name: "Verification code" });

    expectDescribedBy(group, getByText("The six digits we sent."));
    expect(group.getAttribute("aria-describedby")).toContain("-message");
    expect(getByText("That code has expired.")).toBeDefined();
    expect(container.querySelector("label")?.textContent).toContain("*");
  });

  it("types a numeric code, moves focus and reports completion once", async () => {
    const user = userEvent.setup();
    const values: string[] = [];
    const completions: string[] = [];
    const { container } = renderWithProvider(
      <PinInput
        length={4}
        onValueChange={(value) => {
          values.push(value);
        }}
        onComplete={(value) => {
          completions.push(value);
        }}
      />,
    );

    await user.type(boxes(container)[0]!, "1234");

    expect(values).toEqual(["1", "12", "123", "1234"]);
    expect(completions).toEqual(["1234"]);
    expect(document.activeElement).toBe(boxes(container)[3]);
  });

  it("ignores characters the mode does not accept", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProvider(<PinInput mode="numeric" />);

    await user.type(boxes(container)[0]!, "1a2");

    expect(boxes(container)[0]!.value).toBe("1");
    expect(boxes(container)[1]!.value).toBe("2");
  });

  it("deletes backwards and packs the remaining characters together", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProvider(<PinInput defaultValue="1234" />);

    boxes(container)[3]!.focus();
    await user.keyboard("{Backspace}");
    expect(boxes(container).map((box) => box.value)).toEqual([
      "1",
      "2",
      "3",
      "",
    ]);

    boxes(container)[0]!.focus();
    await user.keyboard("{Backspace}");
    expect(boxes(container).map((box) => box.value)).toEqual([
      "2",
      "3",
      "",
      "",
    ]);
  });
  describe("PinInput interaction and configuration", () => {
    it("fills the boxes from the start when the whole code is pasted", () => {
      const { container } = renderWithProvider(<PinInput length={6} />);
      const input = boxes(container)[2]!;

      fireEvent.paste(input, {
        clipboardData: { getData: () => "9876" },
      });

      expect(boxes(container).map((box) => box.value)).toEqual([
        "9",
        "8",
        "7",
        "6",
        "",
        "",
      ]);
    });

    it("replaces from the caret when the pasted code lands among characters", () => {
      const { container } = renderWithProvider(
        <PinInput length={4} defaultValue="12" />,
      );
      const input = boxes(container)[1]!;

      fireEvent.paste(input, {
        clipboardData: { getData: () => "987" },
      });

      expect(boxes(container).map((box) => box.value)).toEqual([
        "1",
        "9",
        "8",
        "7",
      ]);
    });

    it("distributes a code that arrives in one box, as an autofill does", () => {
      const { container } = renderWithProvider(<PinInput length={4} />);
      const input = boxes(container)[0]!;

      fireEvent.change(input, { target: { value: "1234" } });

      expect(boxes(container).map((box) => box.value)).toEqual([
        "1",
        "2",
        "3",
        "4",
      ]);
    });

    it("moves between the boxes with the arrow keys and the ends", async () => {
      const user = userEvent.setup();
      const { container } = renderWithProvider(<PinInput length={4} />);
      const input = boxes(container);

      input[1]!.focus();
      await user.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(input[2]);

      await user.keyboard("{ArrowLeft}");
      expect(document.activeElement).toBe(input[1]);

      await user.keyboard("{End}");
      expect(document.activeElement).toBe(input[3]);

      await user.keyboard("{Home}");
      expect(document.activeElement).toBe(input[0]);
    });

    it("takes a controlled value and reports the change without owning it", async () => {
      const user = userEvent.setup();

      function Controlled() {
        const [value, setValue] = useState("");
        return <PinInput value={value} onValueChange={setValue} length={4} />;
      }

      const { container } = renderWithProvider(<Controlled />);
      await user.type(boxes(container)[0]!, "12");

      expect(boxes(container).map((box) => box.value)).toEqual([
        "1",
        "2",
        "",
        "",
      ]);
    });

    it("marks an invalid value on the boxes and the group", () => {
      const { container, getByRole } = renderWithProvider(
        <PinInput isInvalid label="Code" />,
      );

      expect(getByRole("group", { name: "Code" })).toBeDefined();
      expect(container.innerHTML).toContain("border-danger");
      for (const box of boxes(container)) {
        expect(box.getAttribute("aria-invalid")).toBe("true");
      }
    });

    it("disables every box and reports the group as disabled", () => {
      const { container, getByRole } = renderWithProvider(
        <PinInput isDisabled label="Code" />,
      );

      expect(
        getByRole("group", { name: "Code" }).getAttribute("data-disabled"),
      ).toBe("true");
      for (const box of boxes(container)) {
        expect(box.disabled).toBe(true);
      }
      expect(container.innerHTML).toContain("bg-secondary/40");
    });

    it("masks the characters when it is asked to", () => {
      const { container } = renderWithProvider(<PinInput masked length={4} />);

      expect(container.querySelectorAll("input[type='password']")).toHaveLength(
        4,
      );
    });

    it("submits the code through a named hidden field", () => {
      const { container } = renderWithProvider(
        <PinInput name="code" defaultValue="1234" />,
      );
      const hidden = container.querySelector(
        "input[type='hidden']",
      ) as HTMLInputElement;

      expect(hidden.name).toBe("code");
      expect(hidden.value).toBe("1234");
    });

    it("groups the boxes visually when a separator is asked for", () => {
      const { container } = renderWithProvider(
        <PinInput length={6} separatorAfter={3} />,
      );

      expect(container.textContent).toContain("-");
    });

    it("resolves its defaults through configuration", () => {
      const { container } = renderWithProvider(<PinInput />, {
        config: makeComponentConfig("pininput", { length: 6, size: "lg" }),
      });

      expect(boxes(container)).toHaveLength(6);
      expect(boxes(container)[0]!.className).toContain("h-14");
    });

    it("renders on the server and hydrates without a mismatch", () => {
      const html = renderToServerString(<PinInput length={4} label="Code" />);

      expect(html).toContain("<fieldset");
      expect(html).toContain("character 1 of 4");
      expectHydrationClean(<PinInput length={4} label="Code" />);
    });
  });
});

describe("Radio", () => {
  /**
   * Controlled harness, which is the usage the component documents.
   */
  function ControlledGroup({
    onChange,
  }: {
    onChange?: (value: string) => void;
  }) {
    const [value, setValue] = useState("basic");

    return (
      <RadioGroup
        label="Plan"
        name="plan"
        value={value}
        onChange={(next) => {
          setValue(next);
          onChange?.(next);
        }}>
        <Radio value="basic" label="Basic" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>
    );
  }
  it("exposes the group and its labelled radios", () => {
    const { getByRole, getByText } = renderWithProvider(<ControlledGroup />);

    expect(getByRole("radiogroup")).toBeInTheDocument();
    expect(getByText("Plan")).toBeInTheDocument();
    expect(getByRole("radio", { name: "Basic" })).toBeChecked();
    expect(getByRole("radio", { name: "Pro" })).not.toBeChecked();
  });

  it("selects on click and reports the new value", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <ControlledGroup onChange={onChange} />,
    );

    await user.click(getByRole("radio", { name: "Pro" }));

    expect(onChange).toHaveBeenCalledWith("pro");
    expect(getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(getByRole("radio", { name: "Basic" })).not.toBeChecked();
  });

  it("selects with the Space key", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<ControlledGroup />);
    const pro = getByRole("radio", { name: "Pro" });

    pro.focus();
    await pressKey(user, " ");

    expect(pro).toBeChecked();
  });

  it("does not select a disabled radio", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <RadioGroup label="Plan" name="plan">
        <Radio value="basic" label="Basic" />
        <Radio value="pro" label="Pro" disabled />
      </RadioGroup>,
    );
    const pro = getByRole("radio", { name: "Pro" });

    expectState(pro, { disabled: true });

    await user.click(pro);

    expect(pro).not.toBeChecked();
  });

  it("respects a controlled value", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <RadioGroup label="Plan" name="plan" value="basic" onChange={onChange}>
        <Radio value="basic" label="Basic" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>,
    );

    await user.click(getByRole("radio", { name: "Pro" }));

    expect(onChange).toHaveBeenCalledWith("pro");
    expect(getByRole("radio", { name: "Pro" })).not.toBeChecked();
    expect(getByRole("radio", { name: "Basic" })).toBeChecked();
  });

  // Defect register (M1, D-16): `defaultValue` is documented as the
  // uncontrolled initial value, and the group now keeps the selection itself.
  it("selects from an uncontrolled defaultValue without a controlled parent", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <RadioGroup
        label="Plan"
        name="plan"
        defaultValue="basic"
        onChange={onChange}>
        <Radio value="basic" label="Basic" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>,
    );

    expect(getByRole("radio", { name: "Basic" })).toBeChecked();

    await user.click(getByRole("radio", { name: "Pro" }));

    expect(onChange).toHaveBeenCalledWith("pro");
    expect(getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(getByRole("radio", { name: "Basic" })).not.toBeChecked();

    await user.click(getByRole("radio", { name: "Basic" }));

    expect(getByRole("radio", { name: "Basic" })).toBeChecked();
  });

  // Defect register (M1, D-15): the group label is rendered by `FieldShell` as a
  // `label` element, and the `radiogroup` container now references it.
  // Note also that arrow-key navigation between radios is not asserted here:
  // jsdom does not implement native radio group arrow navigation, which is a
  // DOM-emulator limitation rather than a framework behaviour (`TEST-031`).
  it("exposes the group label as the radiogroup accessible name", () => {
    const { getByRole, getByText } = renderWithProvider(
      <RadioGroup
        label="Plan"
        name="plan"
        description="Choose a plan"
        message="Required">
        <Radio value="basic" label="Basic" />
      </RadioGroup>,
    );
    const group = getByRole("radiogroup");

    expect(group).toHaveAccessibleName("Plan");
    expectDescribedBy(group, getByText("Choose a plan"));
    expectDescribedBy(group, getByText("Required"));
  });
});

describe("SearchInput", () => {
  /**
   * Behaviour tests for the search field.
   *
   * The tests state the component's contract: the field is a named search region
   * and a named searchbox, the query is reported while it is typed and when it is
   * submitted, the clear control empties the field and returns focus, and every
   * option resolves through the configuration cascade.
   */

  /**
   * Read the field's search landmark.
   *
   * @param container - The render result's container.
   * @returns The search landmark.
   */
  function searchRegion(container: HTMLElement): HTMLElement {
    return container.querySelector('[role="search"]') as HTMLElement;
  }
  it("announces itself as a named search region with a named field", () => {
    const { container, getByRole } = renderWithProvider(<SearchInput />);

    expect(searchRegion(container)).toHaveAccessibleName("Search");
    expect(getByRole("searchbox")).toHaveAccessibleName("Search");
  });

  it("reports the query while it is typed", async () => {
    const onValueChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <SearchInput onValueChange={onValueChange} />,
    );
    const user = userEvent.setup();

    await user.type(getByRole("searchbox"), "invoices");

    expect(onValueChange).toHaveBeenLastCalledWith("invoices");
  });

  it("reports the query when it is submitted", () => {
    const onSearch = vi.fn();
    const { getByRole, container } = renderWithProvider(
      <SearchInput onSearch={onSearch} />,
    );
    const input = getByRole("searchbox");

    fireEvent.change(input, { target: { value: "invoices" } });
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    expect(onSearch).toHaveBeenCalledWith("invoices");
  });

  it("empties the field and returns focus to it", async () => {
    const onValueChange = vi.fn();
    const { getByRole, queryByRole } = renderWithProvider(
      <SearchInput onValueChange={onValueChange} />,
    );
    const user = userEvent.setup();
    const input = getByRole("searchbox");

    expect(queryByRole("button", { name: "Clear search" })).toBeNull();

    await user.type(input, "invoices");
    await user.click(getByRole("button", { name: "Clear search" }));

    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(queryByRole("button", { name: "Clear search" })).toBeNull();
  });

  it("offers no clear control when the field cannot be cleared", async () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <SearchInput clearable={false} />,
    );
    const user = userEvent.setup();

    await user.type(getByRole("searchbox"), "invoices");

    expect(queryByRole("button", { name: "Clear search" })).toBeNull();
  });

  it("leaves a controlled field to its owner", async () => {
    const onValueChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <SearchInput value="invoices" onValueChange={onValueChange} />,
    );
    const user = userEvent.setup();
    const input = getByRole("searchbox");

    await user.type(input, "s");

    expect(onValueChange).toHaveBeenCalled();
    // The owner decides the value, so the field still shows what the owner gave.
    expect(input).toHaveValue("invoices");
  });

  it("shows the shortcut a consumer has bound", () => {
    const { container } = renderWithProvider(<SearchInput shortcut="Cmd K" />);
    const hint = container.querySelector("kbd") as HTMLElement;

    expect(hint.textContent).toBe("Cmd K");
  });

  it("reports a search in progress as busy", () => {
    const { getByRole } = renderWithProvider(<SearchInput isLoading />);

    expect(getByRole("searchbox")).toHaveAttribute("aria-busy", "true");
  });

  it("takes its name, its visibility and its clear control from configuration", () => {
    const { container, getByText, queryByRole } = renderWithProvider(
      <SearchInput defaultValue="invoices" />,
      {
        config: makeComponentConfig("searchinput", {
          label: "Find",
          hideLabel: false,
          clearable: false,
        }),
      },
    );

    expect(searchRegion(container)).toHaveAccessibleName("Find");
    expect(getByText("Find")).toBeTruthy();
    expect(queryByRole("button", { name: "Clear search" })).toBeNull();
  });

  it("lets an instance prop win over the configured value", () => {
    const { container } = renderWithProvider(<SearchInput label="Look up" />, {
      config: makeComponentConfig("searchinput", { label: "Find" }),
    });

    expect(searchRegion(container)).toHaveAccessibleName("Look up");
  });

  it("forwards its ref to the field it renders", () => {
    const ref = createRef<HTMLInputElement>();
    const { getByRole } = renderWithProvider(<SearchInput ref={ref} />);

    expect(ref.current).toBe(getByRole("searchbox"));
  });

  it("carries the consumer's class on the region, appended last", () => {
    const { container } = renderWithProvider(
      <SearchInput className="max-w-sm" />,
    );

    expect(searchRegion(container).className.endsWith("max-w-sm")).toBe(true);
  });

  it("renders on the server and hydrates without a mismatch", () => {
    expect(renderToServerString(<SearchInput />)).toContain('type="search"');
    expectHydrationClean(<SearchInput defaultValue="invoices" />);
  });
});

describe("Stepper", () => {
  /**
   * Behaviour tests for the stepper.
   *
   * The tests state the pattern's contract: the sequence is an ordered list, each
   * step reports its state in words as well as in colour, the current step is
   * marked for assistive technology, and a step the reader can reach is a control
   * while one they cannot is not.
   */

  const steps = [
    { key: "cart", label: "Cart" },
    { key: "address", label: "Address", description: "Where it ships" },
    { key: "payment", label: "Payment" },
  ];
  it("renders the steps as an ordered list", () => {
    const { getByRole, getAllByRole } = renderWithProvider(
      <Stepper steps={steps} currentStep={1} label="Checkout" />,
    );

    expect(getByRole("list")).toHaveAccessibleName("Checkout");
    expect(getAllByRole("listitem")).toHaveLength(3);
  });

  it("marks the current step and states every step's state in words", () => {
    const { getAllByRole } = renderWithProvider(
      <Stepper steps={steps} currentStep={1} />,
    );
    const [cart, address, payment] = getAllByRole("listitem");

    expect(cart).toHaveTextContent("Completed:");
    expect(address).toHaveAttribute("aria-current", "step");
    expect(address).toHaveTextContent("Current step:");
    expect(payment).toHaveTextContent("Not started:");
    expect(cart).not.toHaveAttribute("aria-current");
  });

  it("shows each step's label and description", () => {
    const { getByText } = renderWithProvider(
      <Stepper steps={steps} currentStep={0} />,
    );

    expect(getByText("Cart")).toBeTruthy();
    expect(getByText("Where it ships")).toBeTruthy();
  });

  it("leaves the descriptions out when they are turned off", () => {
    const { queryByText } = renderWithProvider(
      <Stepper steps={steps} currentStep={0} showDescriptions={false} />,
    );

    expect(queryByText("Where it ships")).toBeNull();
  });

  it("reports the step a reader asks for", async () => {
    const onStepChange = vi.fn();
    const { getByRole, getAllByRole } = renderWithProvider(
      <Stepper steps={steps} currentStep={1} onStepChange={onStepChange} />,
    );
    const user = userEvent.setup();

    await user.click(getByRole("button", { name: /Payment/ }));

    expect(onStepChange).toHaveBeenCalledWith(2);
    // The step the reader is on is not a control, because there is nowhere to go.
    expect(getAllByRole("listitem")[1]!.querySelector("button")).toBeNull();
  });

  it("reports progress only when it is given nothing to change", () => {
    const { queryByRole } = renderWithProvider(
      <Stepper steps={steps} currentStep={1} />,
    );

    expect(queryByRole("button")).toBeNull();
  });

  it("arranges the steps for the breakpoint by default", () => {
    const { getByRole } = renderWithProvider(
      <Stepper steps={steps} currentStep={0} />,
    );

    expect(getByRole("list").className).toContain("flex-col");
    expect(getByRole("list").className).toContain("md:flex-row");
  });

  it("takes its arrangement, its density and its descriptions from configuration", () => {
    const { getByRole, queryByText } = renderWithProvider(
      <Stepper steps={steps} currentStep={0} />,
      {
        config: makeComponentConfig("stepper", {
          orientation: "vertical",
          size: "sm",
          showDescriptions: false,
        }),
      },
    );

    expect(getByRole("list").className).not.toContain("md:flex-row");
    expect(getByRole("list").querySelector(".size-6")).toBeTruthy();
    expect(queryByText("Where it ships")).toBeNull();
  });

  it("scales the step labels with the density as well as the markers", () => {
    const small = renderWithProvider(
      <Stepper steps={steps} currentStep={0} size="sm" />,
    );

    expect(small.getByText("Cart")).toHaveClass("text-xs");
    small.unmount();

    const medium = renderWithProvider(
      <Stepper steps={steps} currentStep={0} />,
    );

    expect(medium.getByText("Cart")).toHaveClass("text-sm");
    medium.unmount();

    const large = renderWithProvider(
      <Stepper steps={steps} currentStep={0} size="lg" />,
    );

    expect(large.getByText("Cart")).toHaveClass("text-base");
  });

  it("lets an instance prop win over the configured value", () => {
    const { getByRole } = renderWithProvider(
      <Stepper steps={steps} currentStep={0} orientation="vertical" />,
      { config: makeComponentConfig("stepper", { orientation: "horizontal" }) },
    );

    expect(getByRole("list").className).not.toContain("md:flex-row");
  });

  it("renders the element it is asked for, carries the consumer's class and forwards its ref", () => {
    const ref = createRef<HTMLOListElement>();
    const { getByRole } = renderWithProvider(
      <Stepper
        as="ul"
        ref={ref}
        className="border"
        steps={steps}
        currentStep={0}
      />,
    );

    expect(getByRole("list").tagName).toBe("UL");
    expect(getByRole("list").className).toContain("border");
    expect(ref.current).toBe(getByRole("list"));
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const markup = renderToServerString(
      <Stepper steps={steps} currentStep={1} label="Checkout" />,
    );

    expect(markup).toContain("Checkout");
    expect(markup).toContain('aria-current="step"');
    expectHydrationClean(<Stepper steps={steps} currentStep={1} />);
  });
});

describe("Switch", () => {
  /**
   * The visual track is the first `div` inside the label wrapper, which also
   * contains the visually hidden input and the thumb. The wrapper itself is the
   * label's first `div`, so the track is the wrapper's first `div` child.
   */
  function getTrack(control: HTMLElement): HTMLElement | null {
    const wrapper = control.closest("label")?.querySelector("div");
    return wrapper?.querySelector("div") ?? null;
  }
  it("exposes switch semantics with the label as its accessible name", () => {
    const { getByRole } = renderWithProvider(<Switch label="Notifications" />);
    const control = getByRole("switch");

    expectAccessibleName(control, "Notifications");
    expectState(control, { checked: false });
  });

  it("toggles on pointer activation and reports the new state", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" onChange={onChange} />,
    );
    const control = getByRole("switch");

    await user.click(control);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0]).toBe(true);
    expectState(control, { checked: true });
  });

  it("toggles with the Space key from the tab order", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" onChange={onChange} />,
    );
    const control = getByRole("switch");

    await user.tab();
    expect(control).toHaveFocus();

    await pressKey(user, " ");

    expect(onChange).toHaveBeenCalledTimes(1);
    expectState(control, { checked: true });
  });

  it("does not self-update when controlled", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" checked onChange={onChange} />,
    );
    const control = getByRole("switch");

    await user.click(control);

    expect(onChange).toHaveBeenCalledTimes(1);
    expectState(control, { checked: true });
  });

  it("does not interact when disabled", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" disabled onChange={onChange} />,
    );
    const control = getByRole("switch");

    expectState(control, { disabled: true });

    await user.click(control);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("exposes a busy and disabled state while loading", () => {
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" isLoading />,
    );
    const control = getByRole("switch");

    expectState(control, { disabled: true });
    expect(control).toHaveAttribute("aria-busy", "true");
  });

  it("applies the configured colour to the checked track", () => {
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" defaultChecked />,
      { config: makeComponentConfig("switch", { color: "danger" }) },
    );
    const track = getTrack(getByRole("switch"));

    expect(track).not.toBeNull();
    expect(track?.className).toContain("bg-danger");
  });

  it("uses the registered switch radius by default", () => {
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" defaultChecked />,
    );
    const track = getTrack(getByRole("switch"));

    expect(track).not.toBeNull();
    expect(track?.className).toContain("rounded-full");
  });

  // Defect register (M1): `FieldShell` renders the description element, and the
  // control now links it with `aria-describedby`, as Input, Textarea, Dropmenu
  // and MultiSelect do. Switch exposes no validation message to link.
  it("associates its description with the control", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Switch label="Notifications" description="Send me a digest" />,
    );
    const control = getByRole("switch");

    expectDescribedBy(control, getByText("Send me a digest"));
  });
});

describe("Textarea", () => {
  it("associates its label and accepts multi-line typing", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByLabelText } = renderWithProvider(
      <Textarea label="Notes" onChange={onChange} />,
    );
    const textarea = getByLabelText("Notes") as HTMLTextAreaElement;

    await user.type(textarea, "first line");

    expect(textarea.value).toBe("first line");
    expect(onChange).toHaveBeenCalled();
  });

  it("uses the documented number of visible rows", () => {
    const { getByLabelText } = renderWithProvider(<Textarea label="Notes" />);

    expect(getByLabelText("Notes")).toHaveAttribute("rows", "4");
  });

  it("honours an explicit rows value", () => {
    const { getByLabelText } = renderWithProvider(
      <Textarea label="Notes" rows={8} />,
    );

    expect(getByLabelText("Notes")).toHaveAttribute("rows", "8");
  });

  it("links its description and error message and marks the field invalid", () => {
    const { getByLabelText, getByText } = renderWithProvider(
      <Textarea
        label="Notes"
        description="Optional"
        message="Too long"
        status="error"
      />,
    );
    const textarea = getByLabelText("Notes");

    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expectDescribedBy(textarea, getByText("Optional"));
    expectDescribedBy(textarea, getByText("Too long"));
  });

  it("is disabled and rejects typing", async () => {
    const user = createUser();
    const { getByLabelText } = renderWithProvider(
      <Textarea label="Notes" disabled />,
    );
    const textarea = getByLabelText("Notes") as HTMLTextAreaElement;

    expect(textarea).toBeDisabled();

    await user.type(textarea, "hello");

    expect(textarea.value).toBe("");
  });

  it("forwards native textarea attributes", () => {
    const { getByLabelText } = renderWithProvider(
      <Textarea label="Notes" name="notes" placeholder="Write here" />,
    );
    const textarea = getByLabelText("Notes");

    expect(textarea).toHaveAttribute("name", "notes");
    expect(textarea).toHaveAttribute("placeholder", "Write here");
  });

  // The box and the single-line field are the same field family, so they round
  // the same way: `full` is a pill in both rather than a value one of them
  // silently rewrites.
  it("honours a full radius, as the Input does", () => {
    const { getByLabelText } = renderWithProvider(
      <Textarea label="Notes" radius="full" />,
    );
    const textarea = getByLabelText("Notes");

    expect(textarea.className).toContain("rounded-full");
    expect(textarea.className).not.toContain("rounded-xl");
  });

  it("fills its column by default and sizes to its content when told not to", () => {
    const full = renderWithProvider(<Textarea label="Notes" />);

    expect(full.container.firstElementChild).toHaveClass("w-full");
    full.unmount();

    const inline = renderWithProvider(
      <Textarea label="Notes" fullWidth={false} />,
    );

    expect(inline.container.firstElementChild).toHaveClass("inline-block");
    expect(inline.container.firstElementChild).not.toHaveClass("w-full");
  });

  it("takes its width from configuration", () => {
    const { container } = renderWithProvider(<Textarea label="Notes" />, {
      config: makeComponentConfig("textarea", { fullWidth: false }),
    });

    expect(container.firstElementChild).toHaveClass("inline-block");
  });
});
