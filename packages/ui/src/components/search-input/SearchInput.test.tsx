/**
 * Behaviour tests for the search field.
 *
 * The tests state the component's contract: the field is a named search region
 * and a named searchbox, the query is reported while it is typed and when it is
 * submitted, the clear control empties the field and returns focus, and every
 * option resolves through the configuration cascade.
 */

import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  expectHydrationClean,
  fireEvent,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
  userEvent,
} from "../../test";
import { SearchInput } from "./SearchInput";

/**
 * Read the field's search landmark.
 *
 * The landmark is queried by element rather than by role, because the test DOM's
 * role mapping does not yet know the `search` element; every current browser
 * does, and the name is what the component promises.
 *
 * @param container - The render result's container.
 * @returns The search landmark.
 */
function searchRegion(container: HTMLElement): HTMLElement {
  return container.querySelector("search") as HTMLElement;
}

describe("SearchInput", () => {
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
