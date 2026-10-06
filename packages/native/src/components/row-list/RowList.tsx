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
import { type ReactNode, useMemo, useState } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Card } from "../card/Card";
import { EmptyState } from "../empty-state/EmptyState";
import { LoadingState } from "../loading-state/LoadingState";
import { Pagination } from "../pagination/Pagination";
import { SearchInput } from "../search-input/SearchInput";
import { SectionHeading } from "../section-kit/SectionHeading";
import { Text } from "../text/Text";
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
 * @param props.page - The page, for a consumer that owns it.
 * @param props.defaultPage - The page to open first. Defaults to 1.
 * @param props.onPageChange - Called with the page the reader asked for.
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
  page,
  defaultPage = 1,
  onPageChange,
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
  emptyTitle,
  emptyDescription,
  className,
  style,
  ...rest
}: RowListProps<TData>) {
  const config = useAsheeNativeConfig();

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
      paginated,
      pageSize,
      showRowCount,
      emptyTitle,
      emptyDescription,
    },
    config.components.datatable,
    FALLBACK_NATIVE_DATA_TABLE_CONFIG,
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
          <LoadingState />
        ) : visibleRows.length === 0 ? (
          <EmptyState
            role="status"
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
