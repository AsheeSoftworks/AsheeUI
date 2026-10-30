/**
 * Behaviour tests for the native DataTable.
 *
 * The tests state the component's contract: it is `RowList` under the web renderer's name, so it
 * draws through the same list rather than composing a second one, it reports a row press through
 * the web's handler name while keeping the platform's own spelling, and it keeps the data table's
 * furniture — the search, the count of what is showing, and the paging.
 */

import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import { DataTable } from "./DataTable";

/** One invoice, which is what a row of the test table is. */
interface Invoice {
  id: string;
  customer: string;
  total: string;
}

/** The rows the table shows. */
const INVOICES: Invoice[] = [
  { id: "INV-1", customer: "Kora Retail", total: "$29" },
  { id: "INV-2", customer: "Nia Foods", total: "$48" },
];

/** The columns, which become the labelled lines of each row. */
const COLUMNS = [
  { header: "Customer", cell: (invoice: Invoice) => invoice.customer },
  { header: "Total", cell: (invoice: Invoice) => invoice.total },
];

/**
 * Render a table inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderTable(ui: ReactElement, config?: object) {
  return render(<AsheeUIProvider config={config}>{ui}</AsheeUIProvider>);
}

/**
 * The first row's pressable element.
 *
 * @param view - The rendered table.
 * @returns The control a reader presses to activate the first row.
 */
function firstRow(view: RenderResult) {
  return view.getByRole("button", { name: /Kora Retail/ });
}

describe("Native DataTable", () => {
  it("reports a row press through the web renderer's handler name", async () => {
    const onRowClick = jest.fn();
    const view = await renderTable(
      <DataTable
        data={INVOICES}
        columns={COLUMNS}
        rowKeyAccessor={(invoice) => invoice.id}
        onRowClick={onRowClick}
      />,
    );

    // The rows are the list's own: a data table composes, it does not render a second time.
    expect(view.getAllByTestId("row-list-row")).toHaveLength(2);

    await act(async () => {
      fireEvent.press(firstRow(view));
    });

    expect(onRowClick).toHaveBeenCalledWith(INVOICES[0]);
  });

  it("keeps the platform's spelling working, and prefers the web's name", async () => {
    const onRowPress = jest.fn();
    const pressed = await renderTable(
      <DataTable data={INVOICES} columns={COLUMNS} onRowPress={onRowPress} />,
    );

    await act(async () => {
      fireEvent.press(firstRow(pressed));
    });

    expect(onRowPress).toHaveBeenCalledWith(INVOICES[0]);

    // Two spellings of one handler is a rename, so the canonical name wins when both are given:
    // a consumer cannot have written both on purpose, and silently calling both would report one
    // press twice.
    const onRowClick = jest.fn();
    const both = jest.fn();
    const resolved = await renderTable(
      <DataTable
        data={INVOICES}
        columns={COLUMNS}
        onRowClick={onRowClick}
        onRowPress={both}
      />,
    );

    await act(async () => {
      fireEvent.press(firstRow(resolved));
    });

    expect(onRowClick).toHaveBeenCalledWith(INVOICES[0]);
    expect(both).not.toHaveBeenCalled();
  });

  it("draws the list's furniture: the search and the count", async () => {
    const view = await renderTable(
      <DataTable
        data={INVOICES}
        columns={COLUMNS}
        searchAccessor={(invoice) => invoice.customer}
      />,
    );

    expect(view.getByLabelText("Search")).toBeTruthy();
    expect(view.getByText("Showing 1 to 2 of 2")).toBeTruthy();
  });

  it("pages the rows, because a data table's collection is paged", async () => {
    const onPageChange = jest.fn();
    const view = await renderTable(
      <DataTable
        data={INVOICES}
        columns={COLUMNS}
        pageSize={1}
        onPageChange={onPageChange}
      />,
    );

    expect(view.getAllByTestId("row-list-row")).toHaveLength(1);

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Load more" }));
    });

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      render(<DataTable data={INVOICES} columns={COLUMNS} />),
    ).rejects.toThrow(/AsheeUIProvider/);

    silence.mockRestore();
  });
});
