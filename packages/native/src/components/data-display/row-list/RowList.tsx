/**
 * RowList component for the native package.
 *
 * The component renders the framework's table contract the way a platform reads a
 * collection: as rows rather than as a grid of cells. A table is not a native reading
 * pattern — a phone cannot lay out columns side by side and read them as a row — so each row
 * becomes the framework's own `Card`, and each column becomes a labelled line inside it: the
 * column's header names the value, and the column's cell renders it.
 *
 * It renders the data-table contract at the same time, because the furniture around a
 * collection is the same on both platforms: a heading, a search field when the list knows
 * what to search, the rows, an empty presentation when there is nothing to show, a count of
 * what is showing, and a way to the next page. Each of those pieces is the framework's own
 * component — `SearchInput`, `EmptyState`, `LoadingState`, `Pagination`, `Card`, `Text` — so
 * a consumer that restyles one of them restyles the list too.
 *
 * An empty presentation that answers a query is a result, and is announced as one; a list that
 * is empty in the page's first markup is not a change, so it is shown without being announced.
 *
 * Three things the platform states rather than draws. The web gives a table a caption, a
 * header row and row-scoped semantics that let a reader jump between cells; the platform has
 * neither a header row nor cell semantics, so a column's header is stated as the label of
 * the line it names, which is what a reader hears. The web's double-press handler has no
 * counterpart, because a phone has no double-click, so the list takes a single row press.
 * And the web's `headerClassName` applies to a row the platform does not draw; it resolves
 * through the shared contract and changes nothing here.
 */

import {
  type ColumnDef,
  formatRowCountLabel,
  NATIVE_ANNOUNCEMENT_LIVE_REGION,
  NATIVE_ROW_LIST_CLASS,
  NATIVE_ROW_LIST_COUNT_CLASS,
  NATIVE_ROW_LIST_FIELD_CLASS,
  NATIVE_ROW_LIST_FOOTER_CLASS,
  NATIVE_ROW_LIST_HEADING_CLASS,
  NATIVE_ROW_LIST_REGION_CLASS,
  NATIVE_ROW_LIST_ROW_CLASS,
  NATIVE_ROW_LIST_SELECTED_CLASS,
  NATIVE_ROW_LIST_SURFACE,
  NATIVE_ROW_LIST_TOOLBAR_CLASS,
  NATIVE_ROW_LIST_TOOLBAR_GROUP_CLASS,
  NATIVE_ROW_LIST_VALUE_CLASS,
  NATIVE_ROW_LIST_WRAPPER_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import { classNames } from "../../../utils/class-names";
import { EmptyState } from "../../feedback/empty-state/EmptyState";
import { LoadingState } from "../../feedback/loading-state/LoadingState";
import { SearchInput } from "../../forms/search-input/SearchInput";
import { SectionHeading } from "../../layouts/section-kit/SectionHeading";
import { Pagination } from "../../navigation/pagination/Pagination";
import { Text } from "../../typography/text/Text";
import { Card } from "../card/Card";
import {
  FALLBACK_NATIVE_DATA_TABLE_CONFIG,
  FALLBACK_NATIVE_TABLE_CONFIG,
  type NativeDataTableConfig,
  type NativeTableConfig,
} from "./row-list-config";

/**
 * Props for the native RowList.
 */
export interface RowListProps<TData>
  extends NativeDataTableConfig,
    Pick<NativeTableConfig, "size" | "variant" | "color" | "radius">,
    Omit<ViewProps, "children" | "style"> {
  /** The rows the list shows, in the order the consumer gives them. */
  data: TData[];

  /** The columns, in order, each becoming one labelled line of a row. */
  columns: ColumnDef<TData>[];

  /** Heading above the toolbar. */
  title?: ReactNode;

  /** Sentence under the heading. */
  description?: ReactNode;

  /**
   * Identifies a row, so the list keeps its rows stable as they change.
   */
  rowKeyAccessor?: (row: TData) => string | number;

  /**
   * Called when a reader presses a row.
   * With it, a row is a control; without it, a row is a surface that is read.
   */
  onRowPress?: (row: TData) => void;

  /** The key of the row that is currently chosen, which the list marks. */
  selectedRowKey?: string | number;

  /**
   * Reads the text a row is searched by.
   * Without it, and without `onSearchChange`, the search control is not rendered.
   */
  searchAccessor?: (row: TData) => string;

  /**
   * Called with the query whenever it changes.
   * Supplying it is what a consumer that searches on the server does: the list then reports
   * the query and leaves the filtering to the consumer.
   */
  onSearchChange?: (query: string) => void;

  /** The page, for a consumer that owns it. */
  page?: number;

  /** The page to open first, for a consumer that does not. @default 1 */
  defaultPage?: number;

  /** Called with the page the reader asked for. */
  onPageChange?: (page: number) => void;

  /**
   * How many rows there are in all, for a consumer that holds one page of them.
   *
   * The page count and the count sentence are derived from `data`, so a consumer holding one
   * page of a remote list would get one page in the pager and a count of that page alone —
   * even though `page` and `onPageChange` exist for exactly that consumer. Stating the total
   * here makes the pager count every page and the sentence report the size of the result set,
   * while the rows drawn are still the `data` that was handed in.
   *
   * Without it the rows are the whole list, which is what a list that searches its own rows
   * has always done. A consumer that searches on the server should state the total of the
   * current query, because a query is a new result set.
   */
  rowCount?: number;

  /** Whether the rows are still arriving, which the list states rather than hiding. */
  isLoading?: boolean;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A collection of rows, with the furniture a list page needs.
 *
 * Each row is a surface holding one labelled line per column, so a reader hears what each
 * value means rather than a sequence of values. A row a consumer can act on is a control
 * that reports its press; a chosen row carries the accent, and it is marked as chosen for
 * assistive technology as well as for the eye. Nothing is sorted here: an order is a
 * decision about the data, and the consumer already has one.
 *
 * @param props - The list's options and the platform's view props.
 * @param props.data - The rows to show.
 * @param props.columns - The columns, each becoming one labelled line.
 * @param props.title - Heading above the toolbar.
 * @param props.description - Sentence under the heading.
 * @param props.rowKeyAccessor - Identifies a row.
 * @param props.onRowPress - Called when a reader presses a row.
 * @param props.selectedRowKey - The key of the chosen row.
 * @param props.searchAccessor - Reads the text a row is searched by.
 * @param props.onSearchChange - Called with the query whenever it changes.
 * @param props.searchDebounce - How long to wait after typing stops before reporting the
 * query. Defaults to 0.
 * @param props.page - The page, for a consumer that owns it.
 * @param props.defaultPage - The page to open first. Defaults to 1.
 * @param props.onPageChange - Called with the page the reader asked for.
 * @param props.rowCount - How many rows there are in all, when the consumer holds one page.
 * @param props.isLoading - Whether the rows are still arriving.
 * @param props.variant - Surface each row is drawn on. Defaults to "grid".
 * @param props.size - Density of each row. Defaults to "md".
 * @param props.color - Accent of a chosen row. Defaults to "primary".
 * @param props.radius - Corner rounding of each row. Defaults to "md".
 * @returns The rendered list.
 *
 * @example
 * ```tsx
 * <RowList
 *   title="Invoices"
 *   data={invoices}
 *   rowKeyAccessor={(invoice) => invoice.id}
 *   searchAccessor={(invoice) => invoice.customer}
 *   onRowPress={(invoice) => open(invoice.id)}
 *   columns={[
 *     { header: "Customer", cell: (invoice) => invoice.customer },
 *     { header: "Amount", cell: (invoice) => invoice.total },
 *   ]}
 * />
 * ```
 *
 * @see Card - The surface each row renders in.
 * @see Pagination - The way to the next page.
 */
export function RowList<TData>({
  data,
  columns,
  title,
  description,
  rowKeyAccessor,
  onRowPress,
  selectedRowKey,
  searchAccessor,
  onSearchChange,
  searchDebounce,
  page,
  defaultPage = 1,
  onPageChange,
  rowCount,
  isLoading = false,
  size,
  variant,
  color,
  radius,
  searchable,
  searchLabel,
  paginated,
  pageSize,
  showRowCount,
  rowCountLabel,
  loadingLabel,
  emptyTitle,
  emptyDescription,
  className,
  style,
  ...rest
}: RowListProps<TData>) {
  const config = useAsheeConfig();

  const resolvedTable = resolveConfigCascade<
    NativeTableConfig,
    Required<NativeTableConfig>
  >(
    { size, variant, color, radius },
    config.components.table,
    FALLBACK_NATIVE_TABLE_CONFIG,
  );

  const resolved = resolveConfigCascade<
    NativeDataTableConfig,
    Required<NativeDataTableConfig>
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
    config.components.datatable,
    FALLBACK_NATIVE_DATA_TABLE_CONFIG,
  );

  const [query, setQuery] = useState("");
  const [internalPage, setInternalPage] = useState(defaultPage);
  const currentPage = page ?? internalPage;

  // A debounced query is a timer, so the list owns it: the field reports what the reader
  // typed, and the list decides when that becomes a search. A zero wait is the historical
  // behaviour and takes the synchronous path below.
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

  // The pending query is dropped on unmount: there is no list left to report it to.
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
  // `rowCount`; otherwise the rows it was handed are the whole list, which is what every list
  // did before the prop existed.
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
  const rowCountText = formatRowCountLabel(resolved.rowCountLabel, {
    first: firstRow,
    last: lastRow,
    total: totalRows,
  });

  // An empty presentation that answers a query is a result, and results are announced; one that
  // is part of the page's first markup is not a change, and is not announced as one.
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

  const hasHeading = Boolean(title || description);

  return (
    <View
      className={classNames(NATIVE_ROW_LIST_WRAPPER_CLASS, className)}
      style={style}
      {...rest}>
      {hasHeading ? (
        <View className={NATIVE_ROW_LIST_HEADING_CLASS}>
          <SectionHeading title={title} description={description} />
        </View>
      ) : null}

      {searchEnabled ? (
        <View className={NATIVE_ROW_LIST_TOOLBAR_CLASS}>
          <View className={NATIVE_ROW_LIST_TOOLBAR_GROUP_CLASS}>
            <SearchInput
              label={resolved.searchLabel}
              onValueChange={handleSearch}
            />
          </View>
        </View>
      ) : null}

      <View className={NATIVE_ROW_LIST_REGION_CLASS}>
        {isLoading ? (
          <LoadingState label={resolved.loadingLabel} />
        ) : visibleRows.length === 0 ? (
          <EmptyState
            // The sentence that explains an empty result is announced only when the result
            // replaced other rows. A list that is empty in the page's first markup is not a
            // change, and is not announced as one.
            role={isQueryResult ? "status" : undefined}
            title={resolved.emptyTitle}
            description={resolved.emptyDescription}
          />
        ) : (
          <View
            testID="row-list"
            className={classNames(
              NATIVE_ROW_LIST_CLASS,
              resolvedTable.className,
            )}>
            {visibleRows.map((row, index) => {
              const key = rowKeyAccessor ? rowKeyAccessor(row) : index;
              const isSelected =
                selectedRowKey !== undefined && selectedRowKey === key;

              return (
                <Card
                  key={key}
                  testID="row-list-row"
                  variant={NATIVE_ROW_LIST_SURFACE[resolvedTable.variant]}
                  radius={resolvedTable.radius}
                  size={resolvedTable.size}
                  className={classNames(
                    "w-full",
                    resolvedTable.rowClassName,
                    // The chosen row states the accent fully, and it is applied last so it
                    // is what the row's border resolves to.
                    isSelected &&
                      NATIVE_ROW_LIST_SELECTED_CLASS[resolvedTable.color],
                  )}
                  isPressable={Boolean(onRowPress)}
                  onPress={onRowPress ? () => onRowPress(row) : undefined}
                  accessibilityState={
                    isSelected ? { selected: true } : undefined
                  }>
                  <View className={NATIVE_ROW_LIST_ROW_CLASS}>
                    {columns.map((column, columnIndex) => {
                      const value = column.cell(row);

                      return (
                        <View
                          key={column.id ?? columnIndex}
                          className={classNames(
                            NATIVE_ROW_LIST_FIELD_CLASS,
                            resolvedTable.cellClassName,
                          )}>
                          <Text role="caption" tone="muted">
                            {column.header}
                          </Text>
                          <View className={NATIVE_ROW_LIST_VALUE_CLASS}>
                            {/* The platform renders text inside a text element, so a
                                cell that states a value as text is wrapped and one that
                                renders an element is placed as it is. */}
                            {typeof value === "string" ||
                            typeof value === "number" ? (
                              <Text role="body-sm">{value}</Text>
                            ) : (
                              value
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </View>

      {!isLoading && (resolved.showRowCount || resolved.paginated) ? (
        <View className={NATIVE_ROW_LIST_FOOTER_CLASS}>
          {resolved.showRowCount ? (
            // The count is a status region, so a reader who searches or pages is told how
            // many rows are left rather than having to find out.
            <Text
              role="caption"
              tone="muted"
              className={NATIVE_ROW_LIST_COUNT_CLASS}
              accessibilityLiveRegion={NATIVE_ANNOUNCEMENT_LIVE_REGION.status}>
              {rowCountText}
            </Text>
          ) : null}

          {resolved.paginated && pageCount > 1 ? (
            <Pagination
              page={activePage}
              pageCount={pageCount}
              onPageChange={handlePageChange}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
