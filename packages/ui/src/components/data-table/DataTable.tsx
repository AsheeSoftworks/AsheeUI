/**
 * DataTable component for AsheeUI.
 *
 * This file provides the `DataTable` composition: the table a list page is built
 * from, with the search control, the row count, the paging and the empty
 * presentation around the framework's `Table`. It composes `SearchInput`,
 * `Table`, `Pagination`, `EmptyState` and `LoadingState` rather than
 * reimplementing any of them, so a consumer that restyles one of those
 * components restyles the table too.
 */

"use client";

import {
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { EmptyState } from "../empty-state/EmptyState";
import { LoadingState } from "../loading-state/LoadingState";
import { Pagination } from "../pagination/Pagination";
import { SearchInput } from "../search-input/SearchInput";
import { SectionHeading } from "../section-kit/SectionHeading";
import { Table } from "../table/Table";
import type { ColumnDef, TableConfig } from "../table/table-config";
import { Typography } from "../typography/Typography";
import {
  type DataTableConfig,
  FALLBACK_DATA_TABLE_CONFIG,
} from "./data-table-config";
import {
  DATA_TABLE_CLASS,
  DATA_TABLE_FOOTER_CLASS,
  DATA_TABLE_HEADING_CLASS,
  DATA_TABLE_REGION_CLASS,
  DATA_TABLE_SEARCH_CLASS,
  DATA_TABLE_TOOLBAR_CLASS,
  DATA_TABLE_TOOLBAR_GROUP_CLASS,
} from "./data-table-styles";

/**
 * Props for the DataTable component.
 */
export interface DataTableProps<TData>
  extends DataTableConfig,
    Pick<TableConfig, "variant" | "size" | "color" | "radius">,
    Omit<HTMLAttributes<HTMLDivElement>, "color" | "onClick" | "title"> {
  /**
   * The rows the table shows, in the order the consumer gives them.
   * The table does not sort, because an order is a decision about the data and
   * the consumer already has one.
   */
  data: TData[];

  /**
   * The columns, in order.
   */
  columns: ColumnDef<TData>[];

  /**
   * Heading above the toolbar.
   */
  title?: ReactNode;

  /**
   * Sentence under the heading.
   */
  description?: ReactNode;

  /**
   * Reads the text a row is searched by.
   * Without it, and without `onSearchChange`, the search control is not
   * rendered, because a field that cannot search would be a control that does
   * nothing.
   */
  searchAccessor?: (row: TData) => string;

  /**
   * Called with the query whenever it changes.
   * Supplying it is what a consumer that searches on the server does: the table
   * then reports the query and leaves the filtering to the consumer.
   */
  onSearchChange?: (query: string) => void;

  /**
   * The page, for a consumer that owns it.
   */
  page?: number;

  /**
   * The page to open first, for a consumer that does not.
   *
   * @default 1
   */
  defaultPage?: number;

  /**
   * Called with the page the reader asked for.
   */
  onPageChange?: (page: number) => void;

  /**
   * Identifies a row, so the table can keep its rows stable as they change.
   */
  rowKeyAccessor?: (row: TData) => string | number;

  /**
   * Called when a row is activated, which also makes the rows interactive.
   */
  onRowClick?: (row: TData) => void;

  /**
   * Whether the rows are still loading.
   * While they are, the table is replaced by a loading region rather than shown
   * empty, because an empty table would say the wrong thing.
   *
   * @default false
   */
  isLoading?: boolean;

  /**
   * Controls the consumer places beside the search control.
   */
  toolbar?: ReactNode;

  /**
   * Element to render the wrapper as.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType;
}

/**
 * A table a list page is built from.
 *
 * DataTable composes the framework's parts around `Table`: a search control, a
 * row count that is announced when it changes, pagination, a loading region and
 * an empty presentation. Nothing about the table itself is reimplemented, so a
 * consumer that restyles `Table`, `Pagination`, `EmptyState`, `LoadingState` or
 * `SearchInput` restyles the table too.
 *
 * Searching is client-side when `searchAccessor` is given and the consumer's own
 * when `onSearchChange` is given; the two may be combined, with the consumer
 * replacing the rows. A new query starts at the first page, because a query is a
 * new result set.
 *
 * @param props - DataTable configuration options and element attributes.
 * @param props.data - The rows, in the order they are shown.
 * @param props.columns - The columns, in order.
 * @param props.title - Heading above the toolbar.
 * @param props.description - Sentence under the heading.
 * @param props.searchAccessor - Reads the text a row is searched by.
 * @param props.onSearchChange - Called with the query as it changes.
 * @param props.page - The page, for a controlled consumer.
 * @param props.defaultPage - The page to open first. Defaults to 1.
 * @param props.onPageChange - Called with the page the reader asked for.
 * @param props.pageSize - How many rows a page holds. Defaults to 10.
 * @param props.paginated - Divide the rows into pages. Defaults to true.
 * @param props.showRowCount - Report how many rows are shown. Defaults to true.
 * @param props.isLoading - Replace the rows with a loading region. Defaults to
 * false.
 * @param props.toolbar - Controls placed beside the search control.
 * @param props.emptyTitle - What the table says when it has nothing to show.
 * @param props.emptyDescription - The sentence under that title.
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered table.
 *
 * @example
 * ```tsx
 * <DataTable
 *   title="Invoices"
 *   description="Everything issued this quarter."
 *   data={invoices}
 *   columns={columns}
 *   searchAccessor={(invoice) => `${invoice.number} ${invoice.customer}`}
 *   rowKeyAccessor={(invoice) => invoice.id}
 *   onRowClick={(invoice) => open(invoice.id)}
 *   pageSize={20}
 * />
 * ```
 *
 * @see Table - The table itself, without the search, the count or the paging.
 * @see EmptyState - The presentation the table uses when it has no rows.
 */
export function DataTable<TData>({
  data,
  columns,
  title,
  description,
  searchAccessor,
  onSearchChange,
  page,
  defaultPage = 1,
  onPageChange,
  rowKeyAccessor,
  onRowClick,
  pageSize,
  paginated,
  searchable,
  searchLabel,
  showRowCount,
  emptyTitle,
  emptyDescription,
  isLoading = false,
  toolbar,
  variant,
  size,
  color,
  radius,
  as,
  className,
  ...rest
}: DataTableProps<TData>) {
  const config = useAsheeConfig();

  const resolved = resolveConfigCascade<
    DataTableConfig,
    Required<DataTableConfig>
  >(
    {
      searchable,
      searchLabel,
      paginated,
      pageSize,
      showRowCount,
      emptyTitle,
      emptyDescription,
    },
    config.components?.datatable,
    FALLBACK_DATA_TABLE_CONFIG,
  );

  const [query, setQuery] = useState("");
  const [internalPage, setInternalPage] = useState(defaultPage);
  const currentPage = page ?? internalPage;

  const searchEnabled =
    resolved.searchable && Boolean(searchAccessor || onSearchChange);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!searchEnabled || !searchAccessor || !needle) {
      return data;
    }

    return data.filter((row) =>
      searchAccessor(row).toLowerCase().includes(needle),
    );
  }, [data, query, searchAccessor, searchEnabled]);

  const rowsPerPage = Math.max(1, resolved.pageSize);
  const pageCount = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const activePage = Math.min(Math.max(1, currentPage), pageCount);

  const visibleRows = resolved.paginated
    ? rows.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
    : rows;

  const firstRow = rows.length === 0 ? 0 : (activePage - 1) * rowsPerPage + 1;
  const lastRow = resolved.paginated
    ? Math.min(activePage * rowsPerPage, rows.length)
    : rows.length;
  const rowCountText = `Showing ${firstRow} to ${lastRow} of ${rows.length}`;

  const handleSearch = (next: string) => {
    setQuery(next);

    // A query is a new result set, so the reader starts at its first page.
    if (activePage !== 1) {
      if (page === undefined) {
        setInternalPage(1);
      }

      onPageChange?.(1);
    }

    onSearchChange?.(next);
  };

  const handlePageChange = (next: number) => {
    if (page === undefined) {
      setInternalPage(next);
    }

    onPageChange?.(next);
  };

  const Component: ElementType = as ?? "div";
  const hasHeading = Boolean(title || description);

  return (
    <Component className={cn(DATA_TABLE_CLASS, className)} {...rest}>
      {hasHeading && (
        <div className={DATA_TABLE_HEADING_CLASS}>
          <SectionHeading title={title} description={description} />
        </div>
      )}

      {(searchEnabled || toolbar) && (
        <div className={DATA_TABLE_TOOLBAR_CLASS}>
          <div className={DATA_TABLE_TOOLBAR_GROUP_CLASS}>
            {searchEnabled && (
              <SearchInput
                className={DATA_TABLE_SEARCH_CLASS}
                label={resolved.searchLabel}
                placeholder={resolved.searchLabel}
                onValueChange={handleSearch}
              />
            )}
            {toolbar}
          </div>
        </div>
      )}

      <div className={DATA_TABLE_REGION_CLASS}>
        {isLoading ? (
          <LoadingState />
        ) : visibleRows.length === 0 ? (
          <EmptyState
            panel
            title={resolved.emptyTitle}
            description={resolved.emptyDescription}
          />
        ) : (
          <Table
            data={visibleRows}
            columns={columns}
            variant={variant}
            size={size}
            color={color}
            radius={radius}
            rowKeyAccessor={rowKeyAccessor}
            handleClick={onRowClick}
            isClickable={Boolean(onRowClick)}
          />
        )}
      </div>

      {!isLoading && (resolved.showRowCount || resolved.paginated) && (
        <div className={DATA_TABLE_FOOTER_CLASS}>
          {resolved.showRowCount && (
            // The count is a status region, so a reader who searches or pages is
            // told how many rows are left rather than having to find out.
            <div role="status">
              <Typography role="caption" tone="muted">
                {rowCountText}
              </Typography>
            </div>
          )}
          {resolved.paginated && pageCount > 1 && (
            <Pagination
              page={activePage}
              pageCount={pageCount}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </Component>
  );
}

DataTable.displayName = "DataTable";
