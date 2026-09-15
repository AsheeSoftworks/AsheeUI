import { describe, expect, it, vi } from "vitest";
import { createUser, pressKey, renderWithProvider } from "../../test";
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
    expect(row).toHaveAttribute("aria-selected", "false");
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

  it("exposes the selected row", () => {
    const { getByText } = renderWithProvider(
      <Table
        data={DATA}
        columns={COLUMNS}
        rowKeyAccessor={(row: Row) => row.id}
        isClickable
        selectedRowKey="2"
      />,
    );

    expect(getByText("Linus").closest("tr")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(getByText("Ada").closest("tr")).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });
});
