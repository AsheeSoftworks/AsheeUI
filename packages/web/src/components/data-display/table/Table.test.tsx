import { describe, expect, it, vi } from "vitest";
import { createUser, pressKey, renderWithProvider } from "../../../test";
import type { ColumnDef } from "../table/table-config";
import { Table } from "./Table";

interface Row {
  id: string;
  name: string;
  role: string;
}

const COLUMNS = [
  { id: "name", header: "Name", cell: (row: Row) => row.name },
  { id: "role", header: "Role", cell: (row: Row) => row.role },
];

const DATA: Row[] = [
  { id: "1", name: "Ada", role: "Engineer" },
  { id: "2", name: "Linus", role: "Maintainer" },
];

describe("Table", () => {
  it("renders a semantic table with header association", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Table
        data={DATA}
        columns={COLUMNS}
        rowKeyAccessor={(row: Row) => row.id}
      />,
    );

    expect(getByRole("table")).toBeInTheDocument();
    expect(getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(getByRole("columnheader", { name: "Role" })).toBeInTheDocument();
    expect(getByText("Ada")).toBeInTheDocument();
    expect(getByText("Maintainer")).toBeInTheDocument();
  });

  it("shows an explicit empty state", () => {
    const { getByText } = renderWithProvider(
      <Table
        data={[]}
        columns={COLUMNS}
        rowKeyAccessor={(row: Row) => row.id}
        emptyMessage="No records"
      />,
    );

    expect(getByText("No records")).toBeInTheDocument();
  });

  it("keeps rows inert unless they are interactive", () => {
    const { getByText } = renderWithProvider(
      <Table
        data={DATA}
        columns={COLUMNS}
        rowKeyAccessor={(row: Row) => row.id}
      />,
    );
    const row = getByText("Ada").closest("tr");

    expect(row).toHaveAttribute("tabindex", "-1");
    // A row of a plain table is not a selected option, so it states nothing.
    expect(row).not.toHaveAttribute("aria-current");
  });

  it("activates a clickable row with the pointer and the keyboard", async () => {
    const user = createUser();
    const handleClick = vi.fn();
    const { getByText } = renderWithProvider(
      <Table
        data={DATA}
        columns={COLUMNS}
        rowKeyAccessor={(row: Row) => row.id}
        isClickable
        handleClick={handleClick}
      />,
    );
    const row = getByText("Ada").closest("tr") as HTMLElement;

    expect(row).toHaveAttribute("tabindex", "0");

    await user.click(row);
    expect(handleClick).toHaveBeenCalledTimes(1);

    row.focus();
    await pressKey(user, "Enter");
    expect(handleClick).toHaveBeenCalledTimes(2);

    await pressKey(user, " ");
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it("exposes the selected row as the current one", () => {
    const { getByText } = renderWithProvider(
      <Table
        data={DATA}
        columns={COLUMNS}
        rowKeyAccessor={(row: Row) => row.id}
        isClickable
        selectedRowKey="2"
      />,
    );

    // `aria-current` is announced on any element; `aria-selected` belongs to a
    // grid and would say nothing here.
    expect(getByText("Linus").closest("tr")).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(getByText("Ada").closest("tr")).not.toHaveAttribute("aria-current");
  });

  it("scrolls inside its own box, so the header sticks to the table", () => {
    const { getByRole } = renderWithProvider(
      <Table data={DATA} columns={COLUMNS} />,
    );
    const container = getByRole("table").parentElement as HTMLElement;

    // No `scrollable` utility exists in this package, so the container states
    // the scroll with Tailwind's own class.
    expect(container.className).toContain("overflow-auto");
    expect(container.className).not.toContain("scrollable");
  });

  it("merges the consumer's grid classes onto the table, last", () => {
    const { getByRole } = renderWithProvider(
      <Table data={DATA} columns={COLUMNS} gridClasses="table-fixed w-auto" />,
    );
    const table = getByRole("table");

    expect(table.className).toContain("table-fixed");
    // The consumer's width wins over the table's own `w-full`.
    expect(table.className).toContain("w-auto");
    expect(table.className).not.toContain("w-full");
  });

  it("names the table with a caption", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Table data={DATA} columns={COLUMNS} caption="Team members" />,
    );

    expect(getByRole("table")).toHaveAccessibleName("Team members");
    expect(getByText("Team members").tagName).toBe("CAPTION");
  });

  it("names the table with the attributes it is given", () => {
    const { getByRole } = renderWithProvider(
      <Table data={DATA} columns={COLUMNS} aria-label="Team" />,
    );

    // The name belongs to the table, not to the element around it.
    expect(getByRole("table")).toHaveAccessibleName("Team");
  });

  it("states a column's sort order on its header cell", () => {
    const sortedColumns: ColumnDef<Row>[] = [
      {
        id: "name",
        header: "Name",
        cell: (row) => row.name,
        sortDirection: "ascending",
      },
      { id: "role", header: "Role", cell: (row) => row.role },
    ];
    const { getByRole } = renderWithProvider(
      <Table data={DATA} columns={sortedColumns} />,
    );

    expect(getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    // A column that states no order says nothing rather than "none".
    expect(getByRole("columnheader", { name: "Role" })).not.toHaveAttribute(
      "aria-sort",
    );
  });

  it("keys two identically labelled columns apart", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const duplicateColumns: ColumnDef<Row>[] = [
      { header: "Value", cell: (row) => row.name },
      { header: "Value", cell: (row) => row.role },
    ];

    const { getAllByRole, getByText, rerender } = renderWithProvider(
      <Table data={DATA} columns={duplicateColumns} />,
    );

    expect(getAllByRole("columnheader", { name: "Value" })).toHaveLength(2);
    expect(getByText("Ada")).toBeInTheDocument();

    // A reorder must not re-use a key for a different column.
    rerender(<Table data={DATA} columns={[...duplicateColumns].reverse()} />);

    expect(getAllByRole("columnheader", { name: "Value" })).toHaveLength(2);
    // Keys come from the column's position, so there is no duplicate-key warning.
    expect(error).not.toHaveBeenCalled();

    error.mockRestore();
  });
});
