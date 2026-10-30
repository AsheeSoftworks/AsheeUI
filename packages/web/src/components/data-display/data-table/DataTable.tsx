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

import { formatRowCountLabel, resolveConfigCascade } from "@asheeui/core";
import {
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import {
  DATA_TABLE_CLASS,
  DATA_TABLE_FOOTER_CLASS,
  DATA_TABLE_HEADING_CLASS,
  DATA_TABLE_REGION_CLASS,
  DATA_TABLE_SEARCH_CLASS,
  DATA_TABLE_TOOLBAR_CLASS,
  DATA_TABLE_TOOLBAR_GROUP_CLASS,
} from "../../../styles/data-table";
import { cn } from "../../../utils/cn";
import { EmptyState } from "../../feedback/empty-state/EmptyState";
import { LoadingState } from "../../feedback/loading-state/LoadingState";
import { SearchInput } from "../../forms/search-input/SearchInput";
import { SectionHeading } from "../../layouts/section-kit/SectionHeading";
import { Pagination } from "../../navigation/pagination/Pagination";
import { Typography } from "../../typography/Typography";
import { Table } from "../table/Table";
import type { ColumnDef, TableConfig } from "../table/table-config";
import {
  type DataTableConfig,
  FALLBACK_DATA_TABLE_CONFIG,
} from "./data-table-config";

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
  title?: ReactNode | undefined;

  /**
   * Sentence under the heading.
   */
  description?: ReactNode | undefined;

  /**
   * Reads the text a row is searched by.
   * Without it, and without `onSearchChange`, the search control is not
   * rendered, because a field that cannot search would be a control that does
   * nothing.
   */
  searchAccessor?: ((row: TData) => string) | undefined;

  /**
   * Called with the query whenever it changes.
   * Supplying it is what a consumer that searches on the server does: the table
   * then reports the query and leaves the filtering to the consumer.
   */
  onSearchChange?: ((query: string) => void) | undefined;

  /**
   * The page, for a consumer that owns it.
   */
  page?: number | undefined;

  /**
   * The page to open first, for a consumer that does not.
   *
   * @default 1
   */
  defaultPage?: number | undefined;

  /**
   * Called with the page the reader asked for.
   */
  onPageChange?: ((page: number) => void) | undefined;

  /**
   * How many rows there are in all, for a consumer that holds one page of them.
   *
   * The page count and the count sentence are derived from `data`, so a consumer holding
   * one page of a remote list would get one page in the pager and a count of that page
   * alone — even though `page` and `onPageChange` exist for exactly that consumer. Stating
   * the total here makes the pager draw every page and the sentence report the size of the
   * result set, while the rows shown are still the `data` that was handed in.
   *
   * Without it the rows are the whole list, which is what a table that filters its own
   * rows has always done. A consumer that searches on the server should state the total
   * of the current query, because a query is a new result set.
   */
  rowCount?: number | undefined;

  /**
   * Identifies a row, so the table can keep its rows stable as they change.
   */
  rowKeyAccessor?: ((row: TData) => string | number) | undefined;

  /**
   * The key of the row that is currently chosen.
   * The table marks that row as chosen for the eye, with the accent, and for
   * assistive technology, with `aria-current`.
   */
  selectedRowKey?: string | number | undefined;

  /**
   * Names the table, rendered as its `<caption>`.
   *
   * Without it, the table is named by the `title` above it through
   * `aria-labelledby`, so the heading names the structure it belongs to rather
   * than floating above it. Supply it to name the table something other than
   * the heading says, or to name a table that has no heading.
   */
  caption?: ReactNode | undefined;

  /**
   * Called when a row is activated, which also makes the rows interactive.
   */
  onRowClick?: ((row: TData) => void) | undefined;

  /**
   * Whether the rows are still loading.
   * While they are, the table is replaced by a loading region rather than shown
   * empty, because an empty table would say the wrong thing.
   *
   * @default false
   */
  isLoading?: boolean | undefined;

  /**
   * Controls the consumer places beside the search control.
   */
  toolbar?: ReactNode | undefined;

  /**
   * Element to render the wrapper as.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType | undefined;
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
 * The table is named in the accessibility tree: by `caption` when the consumer
 * gives one, and otherwise by the `title` above it, which is wired to the table
 * with `aria-labelledby` rather than left floating over it. An empty result is a
 * live region while it is the answer to a query, so the sentence that explains
 * the empty table is announced rather than only the count.
 *
 * Searching is client-side when `searchAccessor` is given and the consumer's own
 * when `onSearchChange` is given; the two may be combined, with the consumer
 * replacing the rows. A new query starts at the first page, because a query is a
 * new result set. `searchDebounce` waits for the reader to pause before it reports
 * the query, which is what a consumer that searches on the server wants; its
 * default of `0` reports every keystroke.
 *
 * @param props - DataTable configuration options and element attributes.
 * @param props.data - The rows, in the order they are shown.
 * @param props.columns - The columns, in order.
 * @param props.title - Heading above the toolbar, which names the table when no
 * caption is given.
 * @param props.description - Sentence under the heading.
 * @param props.caption - Names the table, rendered as its `<caption>`.
 * @param props.searchAccessor - Reads the text a row is searched by.
 * @param props.onSearchChange - Called with the query as it changes.
 * @param props.searchDebounce - How long to wait after typing stops before reporting the
 * query. Defaults to 0.
 * @param props.page - The page, for a controlled consumer.
 * @param props.defaultPage - The page to open first. Defaults to 1.
 * @param props.onPageChange - Called with the page the reader asked for.
 * @param props.rowCount - How many rows there are in all, when the consumer holds one page.
 * @param props.rowKeyAccessor - Identifies a row.
 * @param props.selectedRowKey - The key of the row that is currently chosen.
 * @param props.pageSize - How many rows a page holds. Defaults to 10.
 * @param props.paginated - Divide the rows into pages. Defaults to true.
 * @param props.showRowCount - Report how many rows are shown. Defaults to true.
 * @param props.rowCountLabel - The sentence the count is stated with. Defaults to
 * "Showing {first} to {last} of {total}".
 * @param props.isLoading - Replace the rows with a loading region. Defaults to
 * false.
 * @param props.loadingLabel - What the loading region says while the rows arrive.
 * Defaults to "Loading results".
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
  caption,
  searchAccessor,
  onSearchChange,
  searchDebounce,
  page,
  defaultPage = 1,
  onPageChange,
  rowCount,
  rowKeyAccessor,
  selectedRowKey,
  onRowClick,
  pageSize,
  paginated,
  searchable,
  searchLabel,
  showRowCount,
  rowCountLabel,
  loadingLabel,
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
      searchDebounce,
      paginated,
      pageSize,
      showRowCount,
      rowCountLabel,
      loadingLabel,
      emptyTitle,
      emptyDescription,
    },
    config.components?.datatable,
    FALLBACK_DATA_TABLE_CONFIG,
  );

  // The heading's id, so the table can be named by the heading it sits under
  // instead of the two being unrelated elements.
  const headingId = useId();

  const [query, setQuery] = useState("");
  const [internalPage, setInternalPage] = useState(defaultPage);
  const currentPage = page ?? internalPage;

  // A debounced query is a timer, so it is owned here rather than in the search field: the
  // field reports what the reader typed, and the table decides when that becomes a search.
  // A zero wait is the historical behaviour and takes the synchronous path below.
  const searchDebounceMs = Math.max(0, resolved.searchDebounce ?? 0);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingQuery = useRef<string | null>(null);

  const cancelPendingSearch = () => {
    if (searchTimer.current !== null) {
      clearTimeout(searchTimer.current);
      searchTimer.current = null;
    }

    pendingQuery.current = null;
  };

  // The pending query is dropped on unmount: there is no table left to report it to.
  useEffect(
    () => () => {
      if (searchTimer.current !== null) {
        clearTimeout(searchTimer.current);
        searchTimer.current = null;
      }

      pendingQuery.current = null;
    },
    [],
  );

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
  // How large the result set is. A consumer holding one page of a remote list states it with
  // `rowCount`; otherwise the rows it was handed are the whole list, which is what every
  // table did before the prop existed.
  const totalRows = rowCount ?? rows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const activePage = Math.min(Math.max(1, currentPage), pageCount);

  const visibleRows = resolved.paginated
    ? rows.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
    : rows;

  const firstRow = totalRows === 0 ? 0 : (activePage - 1) * rowsPerPage + 1;
  const lastRow = resolved.paginated
    ? Math.min(activePage * rowsPerPage, totalRows)
    : rows.length;
  // The count is a sentence, so it is written by a template rather than by the
  // component: the default says what the component has always said, and another
  // template says it in another language or shape.
  const rowCountText = formatRowCountLabel(resolved.rowCountLabel, {
    first: firstRow,
    last: lastRow,
    total: totalRows,
  });

  // An empty presentation that answers a query is a result, and results are
  // announced; one that is part of the page's first markup is not.
  const isQueryResult = query.trim().length > 0;

  // What a query does once it takes effect: it becomes the filter, the reader goes back to
  // the first page of the new result set, and the consumer is told.
  const commitSearch = (next: string) => {
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

  // The timer fires outside React's render, so it reaches the latest commit through a ref
  // rather than through the closure that scheduled it.
  const commitSearchRef = useRef(commitSearch);
  useEffect(() => {
    commitSearchRef.current = commitSearch;
  });

  const handleSearch = (next: string) => {
    if (searchDebounceMs === 0) {
      commitSearch(next);
      return;
    }

    // Each keystroke restarts the wait, so only the query the reader stopped on is reported.
    cancelPendingSearch();
    pendingQuery.current = next;
    searchTimer.current = setTimeout(() => {
      searchTimer.current = null;
      const pending = pendingQuery.current;
      pendingQuery.current = null;

      if (pending !== null) {
        commitSearchRef.current(pending);
      }
    }, searchDebounceMs);
  };

  const handlePageChange = (next: number) => {
    if (page === undefined) {
      setInternalPage(next);
    }

    onPageChange?.(next);
  };

  const Component: ElementType = as ?? "div";
  const hasHeading = Boolean(title || description);
  const hasTitle = Boolean(title);
  const hasCaption = caption !== undefined && caption !== null;

  return (
    <Component className={cn(DATA_TABLE_CLASS, className)} {...rest}>
      {hasHeading && (
        <div className={DATA_TABLE_HEADING_CLASS}>
          <SectionHeading
            title={title}
            description={description}
            titleId={hasTitle ? headingId : undefined}
          />
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
          // The table knows what is loading, so the region that reports the wait
          // names it rather than announcing the generic sentence.
          <LoadingState label={resolved.loadingLabel} />
        ) : visibleRows.length === 0 ? (
          <EmptyState
            panel
            // The sentence that explains an empty result is announced only when
            // the result replaced other rows. A table that is empty in the
            // page's first markup is not a change, and is not announced as one —
            // stated as `none` rather than left unset, so a configured
            // `components.emptystate.role` cannot turn the first paint into an
            // announcement the table did not have.
            role={isQueryResult ? "status" : "none"}
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
            selectedRowKey={selectedRowKey}
            caption={caption}
            // A caption names the table, so the heading is wired in only when
            // there is no caption to name it instead.
            aria-labelledby={!hasCaption && hasTitle ? headingId : undefined}
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
