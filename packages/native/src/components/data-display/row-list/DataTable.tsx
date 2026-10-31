/**
 * DataTable component for the native package.
 *
 * The platform name for the table a list page is built from: the rows, the heading, the search
 * control, the count of what is showing and the paging. All of that is `RowList`, which is the
 * platform's renderer of the same two contracts, so this module is the name and the web's
 * handler spelling rather than a second composition.
 *
 * `onRowClick` is the name the web renderer uses for "a reader activated this row", and it is
 * the canonical one here. `onRowPress` is the platform's own spelling of the same thing and
 * stays accepted, because it is what a native screen has written since the list shipped; the
 * canonical name wins when a consumer passes both, exactly as the drawer resolves its two
 * spellings of the same option.
 *
 * The collection is named by `title`, the heading above the rows, on both this component and
 * `Table`, whose `caption` becomes the same heading: a platform names a collection with the
 * heading a reader arrives at it through, not with a second name beside it.
 */

import type { RowListProps } from "./RowList";
import { RowList } from "./RowList";

/**
 * Props for the native DataTable.
 *
 * It is the list's props, because the list is what renders: `data`, `columns`, the search and
 * paging options, and the empty and loading wording all resolve the way they always have.
 */
export interface DataTableProps<TData> extends RowListProps<TData> {
  /**
   * Called when a reader activates a row, which is the name the web renderer uses.
   *
   * `onRowPress` is the platform's own spelling of the same handler and is still accepted.
   */
  onRowClick?: (row: TData) => void;
}

/**
 * A table a list page is built from, drawn as the platform reads a collection.
 *
 * @param props - The list's options and the web renderer's row handler.
 * @param props.onRowClick - Called when a reader activates a row.
 * @returns The rendered table.
 *
 * @example
 * ```tsx
 * <DataTable
 *   title="Invoices"
 *   data={invoices}
 *   columns={columns}
 *   rowKeyAccessor={(invoice) => invoice.id}
 *   searchAccessor={(invoice) => invoice.customer}
 *   onRowClick={(invoice) => open(invoice.id)}
 * />
 * ```
 *
 * @see RowList - The renderer, and the place every option is documented.
 * @see Table - The same rows without the search, the count or the paging.
 */
export function DataTable<TData>({
  onRowClick,
  onRowPress,
  ...rest
}: DataTableProps<TData>) {
  return <RowList {...rest} onRowPress={onRowClick ?? onRowPress} />;
}
