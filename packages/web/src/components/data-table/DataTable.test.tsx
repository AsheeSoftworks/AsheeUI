/**
 * Behaviour tests for the table composition.
 *
 * The tests state what the composition promises: it renders the rows it is
 * given, it searches and pages them through the components it composes, it says
 * how many rows are left, it shows a loading region while the rows are on their
 * way and an empty presentation when there are none.
 */

import { describe, expect, it, vi } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
  userEvent,
} from "../../test";
import { DataTable } from "./DataTable";

interface Invoice {
  id: string;
  number: string;
  customer: string;
}

const invoices: Invoice[] = [
  { id: "1", number: "INV-001", customer: "Ashee" },
  { id: "2", number: "INV-002", customer: "Northwind" },
  { id: "3", number: "INV-003", customer: "Contoso" },
];

const columns = [
  {
    id: "number",
    header: "Number",
    cell: (row: Invoice) => row.number,
  },
  {
    id: "customer",
    header: "Customer",
    cell: (row: Invoice) => row.customer,
  },
];

describe("DataTable", () => {
  it("renders the rows, the columns and the count", () => {
    const { getByText } = renderWithProvider(
      <DataTable
        title="Invoices"
        data={invoices}
        columns={columns}
        rowKeyAccessor={(row) => row.id}
      />,
    );

    expect(getByText("Invoices")).toBeTruthy();
    expect(getByText("Number")).toBeTruthy();
    expect(getByText("INV-001")).toBeTruthy();
    expect(getByText("INV-003")).toBeTruthy();
    expect(getByText("Showing 1 to 3 of 3")).toBeTruthy();
  });

  it("tells a reader how many rows are left, as a status", () => {
    const { getByRole } = renderWithProvider(
      <DataTable data={invoices} columns={columns} />,
    );

    expect(getByRole("status")).toHaveTextContent("Showing 1 to 3 of 3");
  });

  it("searches the rows through the accessor it is given", async () => {
    const { getByRole, getByText, queryByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        searchAccessor={(row) => `${row.number} ${row.customer}`}
      />,
    );
    const user = userEvent.setup();

    await user.type(getByRole("searchbox"), "north");

    expect(getByText("INV-002")).toBeTruthy();
    expect(queryByText("INV-001")).toBeNull();
    expect(getByText("Showing 1 to 1 of 1")).toBeTruthy();
  });

  it("reports the query, and leaves the search to the consumer when it is told to", async () => {
    const onSearchChange = vi.fn();
    const { getByRole, getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        onSearchChange={onSearchChange}
      />,
    );
    const user = userEvent.setup();

    await user.type(getByRole("searchbox"), "in");
    await user.clear(getByRole("searchbox"));
    await user.type(getByRole("searchbox"), "north");

    expect(onSearchChange).toHaveBeenLastCalledWith("north");
    // Without an accessor the table does not filter: the consumer replaced the rows.
    expect(getByText("INV-001")).toBeTruthy();
  });

  it("shows the empty presentation when nothing matches", async () => {
    const { getByRole, getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        searchAccessor={(row) => row.customer}
      />,
    );
    const user = userEvent.setup();

    await user.type(getByRole("searchbox"), "nothing");

    expect(getByText("No results")).toBeTruthy();
    expect(getByText("Showing 0 to 0 of 0")).toBeTruthy();
    // The search control stays, so the reader can undo the query.
    expect(getByRole("searchbox")).toBeTruthy();
  });

  it("pages the rows and starts at the first page of a new query", async () => {
    const { getByRole, getByText, queryByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        pageSize={2}
        searchAccessor={(row) => row.customer}
      />,
    );
    const user = userEvent.setup();

    expect(getByText("INV-001")).toBeTruthy();
    expect(queryByText("INV-003")).toBeNull();

    await user.click(getByRole("button", { name: "Page 2" }));
    expect(getByText("INV-003")).toBeTruthy();

    // "o" matches Northwind and Contoso, and the search starts at the first page.
    await user.type(getByRole("searchbox"), "o");
    expect(getByText("Showing 1 to 2 of 2")).toBeTruthy();
  });

  it("reports the page a reader asked for", async () => {
    const onPageChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        pageSize={1}
        onPageChange={onPageChange}
      />,
    );
    const user = userEvent.setup();

    await user.click(getByRole("button", { name: "Page 2" }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("shows a loading region while the rows are on their way", () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <DataTable data={[]} columns={columns} isLoading />,
    );

    expect(getByRole("status")).toHaveTextContent("Loading");
    expect(queryByRole("table")).toBeNull();
  });

  it("reports the row a reader activates", async () => {
    const onRowClick = vi.fn();
    const { getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        rowKeyAccessor={(row) => row.id}
        onRowClick={onRowClick}
      />,
    );
    const user = userEvent.setup();

    await user.click(getByText("INV-002"));

    expect(onRowClick).toHaveBeenCalledWith(invoices[1], "2");
  });

  it("takes its paging, its search and its wording from configuration", () => {
    const { getByRole, getByText, queryByRole, queryByText } =
      renderWithProvider(
        <DataTable
          data={invoices}
          columns={columns}
          searchAccessor={(row) => row.customer}
        />,
        {
          config: makeComponentConfig("datatable", {
            pageSize: 1,
            showRowCount: false,
            searchLabel: "Find an invoice",
            emptyTitle: "Nothing here",
          }),
        },
      );

    expect(getByText("INV-001")).toBeTruthy();
    expect(queryByText("INV-002")).toBeNull();
    expect(getByRole("searchbox")).toHaveAccessibleName("Find an invoice");
    expect(queryByRole("status")).toBeNull();
  });

  it("leaves the search control out when the table cannot search", () => {
    const { queryByRole } = renderWithProvider(
      <DataTable data={invoices} columns={columns} />,
    );

    expect(queryByRole("searchbox")).toBeNull();
  });

  it("lets an instance prop win over the configured value", () => {
    const { getAllByRole } = renderWithProvider(
      <DataTable data={invoices} columns={columns} pageSize={2} />,
      { config: makeComponentConfig("datatable", { pageSize: 3 }) },
    );

    // Two rows and a header row.
    expect(getAllByRole("row")).toHaveLength(3);
  });

  it("renders the element it is asked for and carries the consumer's class", () => {
    const { container } = renderWithProvider(
      <DataTable
        as="section"
        className="bg-primary"
        data={invoices}
        columns={columns}
      />,
    );

    expect(container.firstElementChild?.tagName).toBe("SECTION");
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "bg-primary",
    );
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const markup = renderToServerString(
      <DataTable
        title="Invoices"
        data={invoices}
        columns={columns}
        searchAccessor={(row) => row.customer}
      />,
    );

    expect(markup).toContain("INV-001");
    expect(markup).toContain("Showing 1 to 3 of 3");
    expectHydrationClean(
      <DataTable data={invoices} columns={columns} pageSize={2} />,
    );
  });
});
