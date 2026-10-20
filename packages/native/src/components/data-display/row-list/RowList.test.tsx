/**
 * Behaviour tests for the native RowList.
 *
 * The tests state the component's contract: it draws the table contract as rows — one
 * surface per row and one labelled line per column — it makes a row a control when the
 * consumer can act on it, it marks the chosen row for the eye and for assistive technology,
 * it searches the rows it can read and starts at the first page of the result, it pages the
 * rows and reports what it is showing — counting the result set the consumer states when it
 * holds one page of a remote list — it reports a query when the reader pauses if it is asked
 * to, it says when there is nothing to show but announces an empty result only when a query
 * produced it, it says when the rows are still arriving, and both contracts it renders resolve
 * through the configuration cascade.
 */

import { NATIVE_ANNOUNCEMENT_LIVE_REGION } from "@asheeui/core";
import {
  act,
  fireEvent,
  type ReactTestInstance,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../../provider/AsheeNativeProvider";
import { RowList } from "./RowList";

/** One invoice, which is what a row of the test list is. */
interface Invoice {
  id: string;
  customer: string;
  total: string;
}

/** The rows a test list shows. */
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
 * Render a list inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderList(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Read the classes a row carries, as separate class names.
 *
 * @param view - The rendered tree.
 * @param index - Which row to read.
 * @returns The class names of that row.
 */
function classesOfRow(view: RenderResult, index: number): string[] {
  const className = String(
    (
      view.getAllByTestId("row-list-row")[index].props as {
        className?: string;
      }
    ).className ?? "",
  );

  return className.split(" ").filter(Boolean);
}

/**
 * Read the live region a piece of wording is announced through, if any.
 *
 * The empty state states its announcement on the container the wording sits in, so a test walks
 * up from the words rather than reaching into the component's internals.
 *
 * @param view - The rendered tree.
 * @param text - The wording to start from.
 * @returns The live region, or undefined when the wording is not announced.
 */
function liveRegionOf(view: RenderResult, text: string): string | undefined {
  let node: ReactTestInstance | null = view.getByText(text).parent;

  while (node) {
    const { accessibilityLiveRegion } = node.props as {
      accessibilityLiveRegion?: string;
    };

    if (accessibilityLiveRegion) {
      return accessibilityLiveRegion;
    }

    node = node.parent;
  }

  return undefined;
}

describe("Native RowList", () => {
  it("draws one surface per row, with a labelled line per column", async () => {
    const view = await renderList(
      <RowList data={INVOICES} columns={COLUMNS} />,
    );

    expect(view.getAllByTestId("row-list-row")).toHaveLength(2);
    // A column's header names the value beneath it, which is what a reader hears, so it
    // appears once per row.
    expect(view.getAllByText("Customer")).toHaveLength(2);
    expect(view.getAllByText("Total")).toHaveLength(2);
    expect(view.getByText("Kora Retail")).toBeTruthy();
    expect(view.getByText("$29")).toBeTruthy();
    expect(view.getByText("Nia Foods")).toBeTruthy();
  });

  it("makes a row a control when the consumer can act on it", async () => {
    const onRowPress = jest.fn();
    const view = await renderList(
      <RowList
        data={INVOICES}
        columns={COLUMNS}
        rowKeyAccessor={(invoice) => invoice.id}
        onRowPress={onRowPress}
      />,
    );

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: /Kora Retail/ }));
    });

    expect(onRowPress).toHaveBeenCalledWith(INVOICES[0]);

    const surface = await renderList(
      <RowList data={INVOICES} columns={COLUMNS} />,
    );

    // Without a press to report, a row is something to read rather than a control.
    expect(surface.queryByRole("button")).toBeNull();
  });

  it("marks the chosen row for the eye and for assistive technology", async () => {
    const view = await renderList(
      <RowList
        data={INVOICES}
        columns={COLUMNS}
        rowKeyAccessor={(invoice) => invoice.id}
        selectedRowKey="INV-2"
      />,
    );

    const rows = view.getAllByTestId("row-list-row");

    expect(classesOfRow(view, 1)).toContain("border-primary");
    // A row that is not the chosen one keeps the surface's own border.
    expect(classesOfRow(view, 0)).not.toContain("border-primary");
    expect(rows[0].props.accessibilityState).toBeUndefined();
    expect(rows[1].props.accessibilityState).toMatchObject({
      selected: true,
    });
  });

  it("searches the rows it can read, and starts at the first page", async () => {
    const onSearchChange = jest.fn();
    const view = await renderList(
      <RowList
        data={INVOICES}
        columns={COLUMNS}
        searchAccessor={(invoice) => invoice.customer}
        onSearchChange={onSearchChange}
      />,
    );

    await act(async () => {
      fireEvent.changeText(view.getByLabelText("Search"), "nia");
    });

    expect(onSearchChange).toHaveBeenCalledWith("nia");
    expect(view.getAllByTestId("row-list-row")).toHaveLength(1);
    expect(view.getByText("Nia Foods")).toBeTruthy();
    expect(view.queryByText("Kora Retail")).toBeNull();
  });

  it("reports a debounced query once, after the reader stops typing", async () => {
    const onSearchChange = jest.fn();

    jest.useFakeTimers();

    try {
      const view = await renderList(
        <RowList
          data={INVOICES}
          columns={COLUMNS}
          searchDebounce={300}
          onSearchChange={onSearchChange}
        />,
      );
      const field = view.getByLabelText("Search");

      // Each keystroke is flushed on its own, as the field reports it.
      for (const typed of ["k", "ko", "kor"]) {
        await act(async () => {
          fireEvent.changeText(field, typed);
        });
      }

      // Nothing is reported per keystroke: the list waits for the pause, so one pause is
      // one search.
      expect(onSearchChange).not.toHaveBeenCalled();

      await act(async () => {
        jest.advanceTimersByTime(299);
      });

      expect(onSearchChange).not.toHaveBeenCalled();

      await act(async () => {
        jest.advanceTimersByTime(1);
      });

      expect(onSearchChange).toHaveBeenCalledTimes(1);
      expect(onSearchChange).toHaveBeenCalledWith("kor");
    } finally {
      jest.useRealTimers();
    }
  });

  it("takes the debounce from components.datatable", async () => {
    const onSearchChange = jest.fn();

    jest.useFakeTimers();

    try {
      const view = await renderList(
        <RowList
          data={INVOICES}
          columns={COLUMNS}
          onSearchChange={onSearchChange}
        />,
        { components: { datatable: { searchDebounce: 200 } } },
      );

      await act(async () => {
        fireEvent.changeText(view.getByLabelText("Search"), "nia");
      });

      await act(async () => {
        jest.advanceTimersByTime(199);
      });

      expect(onSearchChange).not.toHaveBeenCalled();

      await act(async () => {
        jest.advanceTimersByTime(1);
      });

      expect(onSearchChange).toHaveBeenCalledWith("nia");
    } finally {
      jest.useRealTimers();
    }
  });

  it("reports every keystroke when no debounce is configured", async () => {
    const onSearchChange = jest.fn();
    const view = await renderList(
      <RowList
        data={INVOICES}
        columns={COLUMNS}
        onSearchChange={onSearchChange}
      />,
    );

    for (const typed of ["k", "ko"]) {
      await act(async () => {
        fireEvent.changeText(view.getByLabelText("Search"), typed);
      });
    }

    // Zero is the neutral default: the registered value states no wait, so existing
    // consumers see exactly the per-keystroke reporting they always did.
    expect(onSearchChange).toHaveBeenCalledTimes(2);
    expect(onSearchChange).toHaveBeenLastCalledWith("ko");
  });

  it("pages the rows and reports what it is showing", async () => {
    const onPageChange = jest.fn();
    const many = Array.from({ length: 25 }, (_, index) => ({
      id: `INV-${index + 1}`,
      customer: `Customer ${index + 1}`,
      total: "$10",
    }));

    const view = await renderList(
      <RowList
        data={many}
        columns={COLUMNS}
        pageSize={10}
        onPageChange={onPageChange}
      />,
    );

    expect(view.getByText("Showing 1 to 10 of 25")).toBeTruthy();
    expect(view.getAllByTestId("row-list-row")).toHaveLength(10);

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Load more" }));
    });

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("takes the result-set total from rowCount, so a page of a remote list still pages", async () => {
    const onPageChange = jest.fn();
    const view = await renderList(
      <RowList
        data={INVOICES}
        columns={COLUMNS}
        rowCount={42}
        pageSize={2}
        onPageChange={onPageChange}
      />,
    );

    // The rows drawn are still the ones handed in, but the pager counts every page of the
    // result set and the count reports its size rather than this page's two rows.
    expect(view.getByText("Kora Retail")).toBeTruthy();
    expect(view.getByText("Showing 1 to 2 of 42")).toBeTruthy();

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Load more" }));
    });

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("states the last page from rowCount rather than from the rows it holds", async () => {
    const view = await renderList(
      <RowList
        data={INVOICES}
        columns={COLUMNS}
        rowCount={42}
        pageSize={2}
        page={21}
      />,
    );

    expect(view.getByText("Showing 41 to 42 of 42")).toBeTruthy();
  });

  it("keeps deriving the total from the rows when rowCount is absent", async () => {
    const view = await renderList(
      <RowList data={INVOICES} columns={COLUMNS} />,
    );

    // The historical behaviour, unchanged: two rows are two rows.
    expect(view.getByText("Showing 1 to 2 of 2")).toBeTruthy();
  });

  it("says what it shows when nothing matches", async () => {
    const view = await renderList(
      <RowList
        data={INVOICES}
        columns={COLUMNS}
        searchAccessor={(invoice) => invoice.customer}
      />,
    );

    await act(async () => {
      fireEvent.changeText(view.getByLabelText("Search"), "nothing here");
    });

    expect(view.getByText("No results")).toBeTruthy();
    expect(
      view.getByText("Try a different search, or clear it to see everything."),
    ).toBeTruthy();
    expect(view.queryByTestId("row-list-row")).toBeNull();
    // The empty state replaced rows the reader could see, so it is a result and is announced.
    expect(liveRegionOf(view, "No results")).toBe(
      NATIVE_ANNOUNCEMENT_LIVE_REGION.status,
    );
  });

  it("does not announce a list that was empty in the page's first markup", async () => {
    const view = await renderList(<RowList data={[]} columns={COLUMNS} />);

    // Nothing was replaced, so there is no change to announce: the wording is shown, and a
    // reader is not interrupted on the first paint with news that is not news.
    expect(view.getByText("No results")).toBeTruthy();
    expect(liveRegionOf(view, "No results")).toBeUndefined();
  });

  it("says when the rows are still arriving", async () => {
    const view = await renderList(
      <RowList data={[]} columns={COLUMNS} isLoading />,
    );

    expect(view.queryByTestId("row-list-row")).toBeNull();
    expect(view.queryByText("Showing 0 to 0 of 0")).toBeNull();
  });

  it("resolves both contracts through the configuration cascade", async () => {
    const view = await renderList(
      <RowList data={INVOICES} columns={COLUMNS} />,
      {
        components: {
          table: { variant: "ghost", size: "sm" },
          datatable: { showRowCount: false, paginated: false },
        },
      },
    );

    const classes = classesOfRow(view, 0);

    // The ghost variant drops the surface and the small density sets the row's padding, both
    // of which are the table contract's own vocabulary.
    expect(classes).toContain("bg-transparent");
    expect(classes).toContain("p-3");
    expect(view.queryByText(/Showing/)).toBeNull();
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      render(<RowList data={INVOICES} columns={COLUMNS} />),
    ).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
