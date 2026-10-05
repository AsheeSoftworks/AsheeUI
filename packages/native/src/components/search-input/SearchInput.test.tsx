/**
 * Behaviour tests for the native SearchInput.
 *
 * The tests state the component's contract: the region and the field are named for the
 * platform's screen reader, the name can be hidden from view without being hidden from
 * assistive technology, the query is reported as it changes and when it is submitted, the
 * dismiss control empties the field, and the options resolve through the configuration
 * cascade.
 */

import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { SearchInput } from "./SearchInput";

/** Render the field inside the framework provider. */
async function renderSearch(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/** Type into the field and wait for the state it sets to be flushed. */
async function type(view: RenderResult, text: string) {
  await act(async () => {
    fireEvent.changeText(view.getByLabelText("Search invoices"), text);
  });
}

describe("Native SearchInput", () => {
  it("names the field for the platform's screen reader", async () => {
    const view = await renderSearch(<SearchInput label="Search invoices" />);

    expect(view.getByRole("search", { name: "Search invoices" })).toBeTruthy();
  });

  it("hides the name from view but not from assistive technology", async () => {
    const view = await renderSearch(<SearchInput label="Search invoices" />);

    // The default is a named field with no caption, so the name is not drawn.
    expect(view.queryByText("Search invoices")).toBeNull();
    expect(view.getByLabelText("Search invoices")).toBeTruthy();
  });

  it("reports the query as it changes", async () => {
    const onValueChange = jest.fn();
    const view = await renderSearch(
      <SearchInput label="Search invoices" onValueChange={onValueChange} />,
    );

    await type(view, "overdue");

    expect(onValueChange).toHaveBeenCalledWith("overdue");
    expect(
      (view.getByLabelText("Search invoices").props as { value?: string })
        .value,
    ).toBe("overdue");
  });

  it("reports the query when it is submitted", async () => {
    const onSearch = jest.fn();
    const view = await renderSearch(
      <SearchInput label="Search invoices" onSearch={onSearch} />,
    );

    await type(view, "overdue");
    await act(async () => {
      fireEvent(view.getByLabelText("Search invoices"), "submitEditing");
    });

    expect(onSearch).toHaveBeenCalledWith("overdue");
  });

  it("empties the field from its dismiss control", async () => {
    const onValueChange = jest.fn();
    const view = await renderSearch(
      <SearchInput label="Search invoices" onValueChange={onValueChange} />,
    );

    await type(view, "overdue");

    const clear = view.getByLabelText("Clear search");

    await act(async () => {
      fireEvent.press(clear);
    });

    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(
      (view.getByLabelText("Search invoices").props as { value?: string })
        .value,
    ).toBe("");
  });

  it("offers no dismiss control when the configured field is not clearable", async () => {
    const view = await renderSearch(<SearchInput label="Search invoices" />, {
      components: { searchinput: { clearable: false } },
    });

    await type(view, "overdue");

    expect(view.queryByLabelText("Clear search")).toBeNull();
  });

  it("shows its message and reports an invalid field", async () => {
    const view = await renderSearch(
      <SearchInput
        label="Search invoices"
        status="error"
        message="That query is not valid"
      />,
    );

    expect(view.getByText("That query is not valid")).toBeTruthy();
    expect(
      (
        view.getByLabelText("Search invoices").props as {
          "aria-invalid"?: boolean;
        }
      )["aria-invalid"],
    ).toBe(true);
  });
});
