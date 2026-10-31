/**
 * Behaviour tests for the native Table.
 *
 * The tests state the component's contract: it is the web renderer's name for a table, drawn
 * through the platform's own list rather than by a second implementation, and each web prop is
 * resolved the way this platform can honour it — the caption names the collection, a handler
 * makes a row a control that reports the row and its key, a double tap is a double press, an
 * empty table states one line, and a table draws every row it is given instead of paging at ten.
 */

import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import type { TestInstance } from "test-renderer";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import { Table } from "./Table";

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
 * Read the classes a node carries, as separate class names.
 *
 * @param node - The node to read.
 * @returns The class names, or an empty list for a node that carries none.
 */
function classesOf(node: TestInstance | null): string[] {
  const className = (node?.props as { className?: string } | undefined)
    ?.className;

  return String(className ?? "")
    .split(" ")
    .filter(Boolean);
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

describe("Native Table", () => {
  it("draws the rows through the list rather than a second table implementation", async () => {
    const view = await renderTable(<Table data={INVOICES} columns={COLUMNS} />);

    // The rows are the list's own, which is what proves this component is a name rather than
    // another renderer: a second table would carry a test id of its own.
    expect(view.getAllByTestId("row-list-row")).toHaveLength(2);
    expect(view.getAllByText("Customer")).toHaveLength(2);
    expect(view.getByText("Kora Retail")).toBeTruthy();
    expect(view.getByText("$48")).toBeTruthy();
  });

  it("states the caption as the name of the collection", async () => {
    const view = await renderTable(
      <Table caption="Invoices" data={INVOICES} columns={COLUMNS} />,
    );

    // The web draws the caption as the table's `<caption>`; the platform has no table to
    // caption, so the name is carried by the heading a reader meets the rows with.
    expect(view.getByText("Invoices")).toBeTruthy();
  });

  it("reports a press with the row and its key", async () => {
    const handleClick = jest.fn();
    const view = await renderTable(
      <Table
        data={INVOICES}
        columns={COLUMNS}
        rowKeyAccessor={(invoice) => invoice.id}
        handleClick={handleClick}
      />,
    );

    await act(async () => {
      fireEvent.press(firstRow(view));
    });

    expect(handleClick).toHaveBeenCalledWith(INVOICES[0], "INV-1");
  });

  it("reports a row's position as its key when nothing identifies it", async () => {
    const handleClick = jest.fn();
    const view = await renderTable(
      <Table data={INVOICES} columns={COLUMNS} handleClick={handleClick} />,
    );

    await act(async () => {
      fireEvent.press(firstRow(view));
    });

    // Without an accessor a row has no identity beyond where it sits, which is the key the
    // list itself falls back to.
    expect(handleClick).toHaveBeenCalledWith(INVOICES[0], 0);
  });

  it("reports a double tap as a press and then a double press", async () => {
    const handleClick = jest.fn();
    const handleDoubleClick = jest.fn();

    // The gesture is time, so the clock is the input: two presses 200 ms apart are one double
    // tap, and reading the real clock would make the test depend on how fast the machine is.
    const clock = jest.spyOn(Date, "now");

    try {
      const view = await renderTable(
        <Table
          data={INVOICES}
          columns={COLUMNS}
          rowKeyAccessor={(invoice) => invoice.id}
          handleClick={handleClick}
          handleDoubleClick={handleDoubleClick}
        />,
      );
      const row = firstRow(view);

      clock.mockReturnValue(1_000);
      await act(async () => {
        fireEvent.press(row);
      });

      clock.mockReturnValue(1_200);
      await act(async () => {
        fireEvent.press(row);
      });
    } finally {
      clock.mockRestore();
    }

    // A browser reports the press on each click and the double click after the second, and a
    // consumer's two handlers see the same sequence here.
    expect(handleClick).toHaveBeenCalledTimes(2);
    expect(handleDoubleClick).toHaveBeenCalledTimes(1);
    expect(handleDoubleClick).toHaveBeenCalledWith(INVOICES[0], "INV-1");
  });

  it("keeps two presses outside the window apart", async () => {
    const handleDoubleClick = jest.fn();
    const clock = jest.spyOn(Date, "now");

    try {
      const view = await renderTable(
        <Table
          data={INVOICES}
          columns={COLUMNS}
          handleClick={() => undefined}
          handleDoubleClick={handleDoubleClick}
        />,
      );
      const row = firstRow(view);

      clock.mockReturnValue(1_000);
      await act(async () => {
        fireEvent.press(row);
      });

      clock.mockReturnValue(1_401);
      await act(async () => {
        fireEvent.press(row);
      });
    } finally {
      clock.mockRestore();
    }

    expect(handleDoubleClick).not.toHaveBeenCalled();
  });

  it("leaves a row a surface when there is nothing to report", async () => {
    const surface = await renderTable(
      <Table data={INVOICES} columns={COLUMNS} />,
    );

    expect(surface.queryByRole("button")).toBeNull();

    // A platform announces a control as a button, so a row that is asked to look clickable
    // without anything to do is still a surface: a button that does nothing is worse than a
    // row that never claimed to be one.
    const clickable = await renderTable(
      <Table data={INVOICES} columns={COLUMNS} isClickable />,
    );

    expect(clickable.queryByRole("button")).toBeNull();
  });

  it("keeps the rows inert when the consumer says they are not clickable", async () => {
    const view = await renderTable(
      <Table
        data={INVOICES}
        columns={COLUMNS}
        isClickable={false}
        handleClick={() => undefined}
      />,
    );

    expect(view.queryByRole("button")).toBeNull();
  });

  it("states one line when it has nothing to show", async () => {
    const empty = await renderTable(<Table data={[]} columns={COLUMNS} />);

    expect(empty.getByText("No items available")).toBeTruthy();
    // The data table's empty region is a result with a reason and explains itself; a table
    // states the message and stops.
    expect(
      empty.queryByText(
        "Try a different search, or clear it to see everything.",
      ),
    ).toBeNull();

    const stated = await renderTable(
      <Table data={[]} columns={COLUMNS} emptyMessage="Nothing here yet" />,
    );

    expect(stated.getByText("Nothing here yet")).toBeTruthy();
  });

  it("draws every row it is given, without paging or counting them", async () => {
    const many = Array.from({ length: 25 }, (_, index) => ({
      id: `INV-${index + 1}`,
      customer: `Customer ${index + 1}`,
      total: "$10",
    }));

    const view = await renderTable(<Table data={many} columns={COLUMNS} />);

    // The list's registered defaults would page at ten rows and report the count; both are the
    // data table's furniture, and a table draws what it was given.
    expect(view.getAllByTestId("row-list-row")).toHaveLength(25);
    expect(view.queryByText(/Showing/)).toBeNull();
  });

  it("applies the row and cell classes the consumer states", async () => {
    const view = await renderTable(
      <Table
        data={INVOICES}
        columns={COLUMNS}
        rowClassName="bg-accent"
        cellClassName="bg-overlay"
      />,
    );

    expect(classesOf(view.getAllByTestId("row-list-row")[0])).toContain(
      "bg-accent",
    );
    // A cell is the labelled line a column becomes, so the override lands on the line and not
    // on the value inside it.
    expect(classesOf(view.getAllByText("Customer")[0].parent)).toContain(
      "bg-overlay",
    );
  });

  it("resolves the table's treatment through the configuration cascade", async () => {
    const view = await renderTable(
      <Table data={INVOICES} columns={COLUMNS} />,
      { components: { table: { variant: "ghost", size: "sm" } } },
    );

    const classes = classesOf(view.getAllByTestId("row-list-row")[0]);

    expect(classes).toContain("bg-transparent");
    expect(classes).toContain("p-3");
  });
});
