---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains `RowList`, the platform's rendering of the `Table` and `DataTable` contracts,
and both contracts are stated once in `@asheeui/core`.

- `@asheeui/native` reads a collection the way a phone does: one surface per row, and one
  labelled line per column, so a reader hears what each value means rather than a sequence of
  values. A table is not a native reading pattern — columns cannot be laid out side by side
  and read as a row on a phone — which is why the two contracts land on one component.
- It renders the data table's furniture at the same time, through the framework's own
  components: a heading, a search field when the list knows what to search, the rows, an
  empty presentation when nothing matches, a count of what is showing (a live region, so a
  reader who searches or pages is told), and the platform's own collection footer to move to
  the next page. A consumer that restyles one of those restyles the list.
- A row a consumer can act on is a control that reports its press; a chosen row states the
  accent at full weight and is marked as chosen for assistive technology as well as for the
  eye. The web's double-press handler has no counterpart, because a phone has no
  double-click, so the list takes a single row press.
- The table's variants resolve to the surface each row is drawn on — a defined surface for
  the variants that separate cells with an edge, the framework's tinted surface for the
  striped one, and no surface for the ghost one — and `headerClassName` names a row the
  platform does not draw, so it resolves through the contract and changes nothing here.
- `@asheeui/core` gains the table contract (`components.table`, with the `ColumnDef` a column
  is described by) and the data-table contract (`components.datatable`), plus one module per
  contract holding the class strings both renderers read.
- `@asheeui/web` points its table and its data table at those shared modules and their own
  styles files are removed. The rendered markup and the public props are unchanged.
- The parity queue drops from 8 to 6: 52 of the 58 components the matrix promises for native
  are implemented, and the remaining six are the navigation furniture and the layout shells.
