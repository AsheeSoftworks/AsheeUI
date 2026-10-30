/**
 * Table component for the native package.
 *
 * `RowList` is the platform's renderer of the table contract, and `Table` is the name both
 * renderers publish, so a shared screen writes `<Table data={…} columns={…} />` once and
 * gets a table in a browser and the platform's reading of one on a device. This module adds
 * no second renderer: it maps the web's props onto the list that already draws the rows, and
 * every part of the mapping exists because the platform reads a collection differently.
 *
 * - `caption` names the table. The web draws it as a `<caption>`; the platform has no table to
 *   caption, so the name is stated as the heading above the rows, which is where a reader meets
 *   the collection.
 * - `handleDoubleClick` is a double tap. A device has no `dblclick`, so two presses on the same
 *   row inside {@link DOUBLE_TAP_MS} are the gesture. A browser reports a press on each click
 *   and then the double click, so this reports the press on every tap and the double tap after
 *   the second: a consumer's two handlers see the same sequence they see on the web.
 * - `isClickable` still decides whether a row is a control, but a platform announces a control
 *   as a button and a button that does nothing is worse than a plain row. With no handler to
 *   report, a row stays a surface and nothing is announced.
 * - `emptyMessage` is the sentence an empty table states. It is a string because the native
 *   empty presentation's wording is configuration, and a sentence a product can translate once
 *   is more useful than a node that shadows the configured one. The data table's empty region is
 *   a result with a reason and states a title and an explanation; a table states one line.
 * - Every row is drawn. Paging and the row count are the data table's furniture, and the list
 *   would otherwise apply its registered defaults and page a table at ten rows.
 */

import type { ColumnDef, TableConfig } from "@asheeui/core";
import { type ReactNode, useRef } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { RowList } from "./RowList";

/**
 * How long two presses on the same row have to be apart to be the two taps of one gesture.
 *
 * It is the browser's own double-click interval and it is shorter than the platform's long
 * press, so a reader who holds a row gets the long press and a reader who taps twice gets the
 * double tap.
 */
const DOUBLE_TAP_MS = 300;

/**
 * Props for the native Table.
 *
 * The names are the web renderer's, so a shared table description compiles against both. The
 * table's own treatment (`size`, `variant`, `color`, `radius` and the class overrides) is the
 * shared `TableConfig`.
 */
export interface TableProps<TData>
  extends TableConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The rows the table shows, in the order the consumer gives them. */
  data: TData[];

  /** The columns, in order, each becoming one labelled line of a row. */
  columns: ColumnDef<TData>[];

  /**
   * Names the table, stated as the heading above the rows.
   *
   * The web draws this as the table's `<caption>`; the platform has no table to caption, so the
   * name is carried by the heading a reader meets the collection with.
   */
  caption?: ReactNode;

  /**
   * Identifies a row, so the list keeps its rows stable as they change and a press can report
   * which row it was.
   */
  rowKeyAccessor?: (row: TData) => string | number;

  /** The key of the row that is currently chosen, which the list marks. */
  selectedRowKey?: string | number;

  /**
   * Whether the rows are controls.
   *
   * A row is a control only when there is a handler to report: a platform announces a control
   * as a button, so a row that does nothing is left as a surface rather than announced as a
   * button that does nothing. `false` keeps the rows inert even when a handler is given.
   */
  isClickable?: boolean;

  /**
   * What the table says when it has nothing to show.
   *
   * A string rather than a node: the platform's empty presentation states a configured sentence,
   * and a node would shadow the configuration a product translates once.
   *
   * @default "No items available"
   */
  emptyMessage?: string;

  /** Called when a reader presses a row, with the row and its key. */
  handleClick?: (data: TData, rowId?: string | number) => void;

  /** Called when a reader taps a row twice inside {@link DOUBLE_TAP_MS}, with the row and its key. */
  handleDoubleClick?: (data: TData, rowId?: string | number) => void;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A table, drawn as the platform reads one: rows of labelled lines.
 *
 * @param props - The table's options and the platform's view props.
 * @param props.data - The rows to show.
 * @param props.columns - The columns, each becoming one labelled line.
 * @param props.caption - Names the table, stated as the heading above the rows.
 * @param props.rowKeyAccessor - Identifies a row.
 * @param props.selectedRowKey - The key of the chosen row.
 * @param props.isClickable - Whether the rows are controls. Defaults to whether a handler was given.
 * @param props.emptyMessage - What the table says when it has nothing to show.
 * @param props.handleClick - Called when a reader presses a row.
 * @param props.handleDoubleClick - Called when a reader taps a row twice.
 * @param props.size - Density of each row. Defaults to the configured value.
 * @param props.variant - Surface each row is drawn on. Defaults to the configured value.
 * @param props.color - Accent of a chosen row. Defaults to the configured value.
 * @param props.radius - Corner rounding of each row. Defaults to the configured value.
 * @param props.rowClassName - Extra classes applied to each row.
 * @param props.cellClassName - Extra classes applied to each labelled line.
 * @param props.className - Extra classes applied to the container, appended last.
 * @returns The rendered table.
 *
 * @example
 * ```tsx
 * <Table
 *   caption="Invoices"
 *   data={invoices}
 *   rowKeyAccessor={(invoice) => invoice.id}
 *   handleClick={(invoice) => open(invoice.id)}
 *   handleDoubleClick={(invoice) => rename(invoice.id)}
 *   columns={[
 *     { header: "Customer", cell: (invoice) => invoice.customer },
 *     { header: "Amount", cell: (invoice) => invoice.total },
 *   ]}
 * />
 * ```
 *
 * @see RowList - The renderer this table draws through, which is the platform's own.
 * @see DataTable - The same rows with the search, the count and the paging around them.
 */
export function Table<TData>({
  data = [],
  columns = [],
  caption,
  rowKeyAccessor,
  selectedRowKey,
  isClickable,
  emptyMessage = "No items available",
  handleClick,
  handleDoubleClick,
  size,
  variant,
  color,
  radius,
  headerClassName,
  rowClassName,
  cellClassName,
  className,
  style,
  ...rest
}: TableProps<TData>) {
  // The last press, so a second one on the same row can be recognised as a double tap. It is a
  // ref rather than state: recognising a gesture must not redraw the table.
  const lastPress = useRef<{ rowId: string | number; at: number } | null>(null);

  // The key a press reports is the one the list keys the row by, so a consumer's selection and
  // its press handling name the same row. A row with no accessor has no identity beyond where it
  // sits, which is what the list falls back to as well.
  const rowIdOf = (row: TData): string | number =>
    rowKeyAccessor ? rowKeyAccessor(row) : data.indexOf(row);

  const reportsPresses = Boolean(handleClick || handleDoubleClick);

  // A row is a control only when there is something to report and the consumer did not say
  // otherwise. `isClickable` is left out by most consumers, so the presence of a handler decides;
  // an explicit `false` keeps the rows inert even when one is given.
  const isPressable = reportsPresses && (isClickable ?? reportsPresses);

  const pressRow = (row: TData) => {
    const rowId = rowIdOf(row);
    const now = Date.now();
    const previous = lastPress.current;

    handleClick?.(row, rowId);

    if (
      previous !== null &&
      previous.rowId === rowId &&
      now - previous.at <= DOUBLE_TAP_MS
    ) {
      // The pair is spent, so a third tap begins another one rather than completing a triple.
      lastPress.current = null;
      handleDoubleClick?.(row, rowId);
      return;
    }

    lastPress.current = { rowId, at: now };
  };

  return (
    <RowList
      data={data}
      columns={columns}
      // The caption names the collection, and a platform names a collection with the heading a
      // reader arrives at it through.
      title={caption}
      rowKeyAccessor={rowKeyAccessor}
      selectedRowKey={selectedRowKey}
      onRowPress={isPressable ? pressRow : undefined}
      emptyTitle={emptyMessage}
      // A table states one line when it is empty. The explanation under it belongs to the data
      // table, whose empty region answers a query; an empty string keeps a configured
      // explanation from appearing beneath a message that already says everything.
      emptyDescription=""
      // A table draws every row it is given. The list's registered defaults would otherwise
      // page it at ten rows and count them, which is the data table's furniture rather than a
      // table's.
      paginated={false}
      showRowCount={false}
      size={size}
      variant={variant}
      color={color}
      radius={radius}
      headerClassName={headerClassName}
      rowClassName={rowClassName}
      cellClassName={cellClassName}
      className={className}
      style={style}
      {...rest}
    />
  );
}
