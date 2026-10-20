/**
 * Behaviour tests for the table composition.
 *
 * The tests state what the composition promises: it renders the rows it is
 * given, it searches and pages them through the components it composes, it says
 * how many rows are left — counting the result set the consumer states when it
 * holds one page of a remote list — it reports a query when the reader pauses if
 * it is asked to, it shows a loading region while the rows are on their way and
 * an empty presentation when there are none.
 */

import { describe, expect, it, vi } from "vitest";
import {
  expectHydrationClean,
  fireEvent,
  makeComponentConfig,
  makeConfig,
  renderToServerString,
  renderWithProvider,
  useFakeTimers,
  userEvent,
} from "../../../test";
import { DataTable } from "./DataTable";
import type { ColumnDef } from "./index";

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

  it("names the table after the heading above it", () => {
    const { getByRole, getByText } = renderWithProvider(
      <DataTable
        title="Invoices"
        description="Everything issued this quarter."
        data={invoices}
        columns={columns}
      />,
    );

    const heading = getByText("Invoices");
    const table = getByRole("table");

    expect(heading.id).toBeTruthy();
    expect(table).toHaveAttribute("aria-labelledby", heading.id);
    expect(table).toHaveAccessibleName("Invoices");
  });

  it("names the table with a caption when one is given", () => {
    const { getByRole, getByText } = renderWithProvider(
      <DataTable
        title="Invoices"
        caption="Invoices issued this quarter"
        data={invoices}
        columns={columns}
      />,
    );

    const table = getByRole("table");

    // The consumer's caption is the table's name, so the heading is not also
    // wired to it.
    expect(getByText("Invoices issued this quarter").tagName).toBe("CAPTION");
    expect(table).toHaveAccessibleName("Invoices issued this quarter");
    expect(table).not.toHaveAttribute("aria-labelledby");
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

  it("reports a debounced query once, after the reader stops typing", () => {
    const timers = useFakeTimers();

    try {
      const onSearchChange = vi.fn();
      const { getByRole } = renderWithProvider(
        <DataTable
          data={invoices}
          columns={columns}
          searchDebounce={300}
          onSearchChange={onSearchChange}
        />,
      );
      const searchbox = getByRole("searchbox");

      fireEvent.change(searchbox, { target: { value: "n" } });
      fireEvent.change(searchbox, { target: { value: "no" } });
      fireEvent.change(searchbox, { target: { value: "nor" } });

      // The field shows what the reader typed, but nothing is reported per keystroke: the
      // table waits for the pause so one pause is one search.
      expect(searchbox).toHaveValue("nor");
      expect(onSearchChange).not.toHaveBeenCalled();

      timers.advance(299);
      expect(onSearchChange).not.toHaveBeenCalled();

      timers.advance(1);
      expect(onSearchChange).toHaveBeenCalledTimes(1);
      expect(onSearchChange).toHaveBeenCalledWith("nor");
    } finally {
      timers.restore();
    }
  });

  it("takes the debounce from components.datatable", () => {
    const timers = useFakeTimers();

    try {
      const onSearchChange = vi.fn();
      const { getByRole } = renderWithProvider(
        <DataTable
          data={invoices}
          columns={columns}
          onSearchChange={onSearchChange}
        />,
        { config: makeComponentConfig("datatable", { searchDebounce: 200 }) },
      );

      fireEvent.change(getByRole("searchbox"), {
        target: { value: "north" },
      });

      timers.advance(199);
      expect(onSearchChange).not.toHaveBeenCalled();

      timers.advance(1);
      expect(onSearchChange).toHaveBeenCalledWith("north");
    } finally {
      timers.restore();
    }
  });

  it("reports every keystroke when no debounce is configured", () => {
    const onSearchChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        onSearchChange={onSearchChange}
      />,
    );
    const searchbox = getByRole("searchbox");

    fireEvent.change(searchbox, { target: { value: "n" } });
    fireEvent.change(searchbox, { target: { value: "no" } });

    // Zero is the neutral default: the registered value states no wait, so existing
    // consumers see exactly the per-keystroke reporting they always did.
    expect(onSearchChange).toHaveBeenCalledTimes(2);
    expect(onSearchChange).toHaveBeenLastCalledWith("no");
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

  it("announces an empty result, not only its count", async () => {
    const { getAllByRole, getByRole, getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        searchAccessor={(row) => row.customer}
      />,
    );
    const user = userEvent.setup();

    await user.type(getByRole("searchbox"), "nothing");

    const statuses = getAllByRole("status");

    // The count is announced, and so is the sentence that explains it.
    expect(statuses).toHaveLength(2);
    expect(
      statuses.some((status) => status.textContent?.includes("No results")),
    ).toBe(true);
    expect(getByText("Showing 0 to 0 of 0")).toBeTruthy();
  });

  it("does not announce an empty table that is part of the first markup", () => {
    const { getByText } = renderWithProvider(
      <DataTable data={[]} columns={columns} />,
    );

    // Nothing replaced anything, so the empty presentation is not a change.
    expect(getByText("No results").closest('[role="status"]')).toBeNull();
  });

  it("keeps a first-paint empty table silent under a configured announcement", () => {
    // The table states `none` explicitly on the first paint, so a configured
    // `components.emptystate.role` cannot turn a page load into an announcement.
    const { getByText } = renderWithProvider(
      <DataTable data={[]} columns={columns} />,
      {
        config: makeConfig({
          components: { emptystate: { role: "status" } },
        }),
      },
    );

    expect(getByText("No results").closest('[role="status"]')).toBeNull();
  });

  it("marks the row it is told is chosen", () => {
    const { getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        rowKeyAccessor={(row) => row.id}
        selectedRowKey="2"
      />,
    );

    expect(getByText("INV-002").closest("tr")).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(getByText("INV-001").closest("tr")).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("states the count with the configured template", () => {
    const { getByText } = renderWithProvider(
      <DataTable data={invoices} columns={columns} />,
      {
        config: makeComponentConfig("datatable", {
          rowCountLabel: "Rows {first}–{last} of {total}",
        }),
      },
    );

    expect(getByText("Rows 1–3 of 3")).toBeTruthy();
    // The default wording is gone, rather than used as well.
    expect(() => getByText("Showing 1 to 3 of 3")).toThrow();
  });

  it("lets an instance row-count template win over the configured one", () => {
    const { getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        rowCountLabel="{total} invoices, showing {first} to {last}"
      />,
      {
        config: makeComponentConfig("datatable", {
          rowCountLabel: "Rows {first}–{last} of {total}",
        }),
      },
    );

    expect(getByText("3 invoices, showing 1 to 3")).toBeTruthy();
  });

  it("publishes the column type its props are declared with", () => {
    const viaDataTable: ColumnDef<Invoice>[] = columns;

    expect(viaDataTable).toHaveLength(2);
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

  it("takes the result-set total from rowCount, so a page of a remote list still pages", async () => {
    const onPageChange = vi.fn();
    const { getByRole, getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        rowCount={42}
        pageSize={3}
        onPageChange={onPageChange}
      />,
    );

    // The rows shown are still the ones handed in, but the pager counts every page of the
    // result set and the sentence reports its size rather than this page's three rows.
    expect(getByText("INV-001")).toBeTruthy();
    expect(getByText("Showing 1 to 3 of 42")).toBeTruthy();
    expect(getByRole("button", { name: "Page 14" })).toBeTruthy();

    const user = userEvent.setup();
    await user.click(getByRole("button", { name: "Page 2" }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("states the last page from rowCount rather than from the rows it holds", () => {
    const { getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        rowCount={42}
        pageSize={3}
        page={14}
      />,
    );

    expect(getByText("Showing 40 to 42 of 42")).toBeTruthy();
  });

  it("keeps deriving the total from the rows when rowCount is absent", () => {
    const { getByText } = renderWithProvider(
      <DataTable data={invoices} columns={columns} />,
    );

    // The historical behaviour, unchanged: three rows are three rows.
    expect(getByText("Showing 1 to 3 of 3")).toBeTruthy();
  });

  it("names what is loading while the rows are on their way", () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <DataTable data={[]} columns={columns} isLoading />,
    );

    // The table knows what it is loading, so it says so rather than announcing the
    // generic sentence.
    expect(getByRole("status")).toHaveTextContent("Loading results");
    expect(queryByRole("table")).toBeNull();
  });

  it("takes the loading wording from configuration and from the instance", () => {
    const configured = renderWithProvider(
      <DataTable data={[]} columns={columns} isLoading />,
      {
        config: makeComponentConfig("datatable", {
          loadingLabel: "Loading invoices",
        }),
      },
    );

    expect(configured.getByRole("status")).toHaveTextContent(
      "Loading invoices",
    );
    configured.unmount();

    const stated = renderWithProvider(
      <DataTable
        data={[]}
        columns={columns}
        isLoading
        loadingLabel="Opening the ledger"
      />,
      {
        config: makeComponentConfig("datatable", {
          loadingLabel: "Loading invoices",
        }),
      },
    );

    expect(stated.getByRole("status")).toHaveTextContent("Opening the ledger");
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
    // The heading's id is generated on the server and used by the table, so the
    // naming survives a server render.
    expect(markup).toContain("aria-labelledby=");
    expectHydrationClean(
      <DataTable data={invoices} columns={columns} pageSize={2} />,
    );
  });
});
