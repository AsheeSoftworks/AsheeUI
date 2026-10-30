---
"@asheeui/core": minor
"@asheeui/native": minor
---

`Table` and `DataTable` exist on the platform under the names the web renderer publishes, the
overlay part types are spelled the same on both renderers, and the compatibility matrix says so.

**Two names, one renderer.** `Table` and `DataTable` were web-only names: the platform published
`RowList`, the component that draws the table contract the way a phone reads a collection. A shared
screen therefore could not describe a table at all — `Table` was `undefined` under Expo while the
same file compiled under TanStack. Native now publishes both names, each one a thin component over
`RowList` rather than a second table implementation: `Table` maps the web's props (`caption`,
`rowKeyAccessor`, `selectedRowKey`, `isClickable`, `emptyMessage`, `handleClick`) onto the list,
and `DataTable` is the list itself with `onRowClick` as the web's handler name. `RowList` stays
exported and is documented as native-only, as does `TabBar`.

**The web's props, resolved the way a platform can.** Four of them mean something else on a device,
and say so where they are declared. `caption` names the collection and is stated as the heading above
the rows, because a platform has no `<caption>`. `handleDoubleClick` is a double tap: two presses on
the same row inside 300 ms, reported after the press on each tap, which is the sequence a browser
gives a consumer's two handlers. `isClickable` cannot make a row a button that does nothing — with no
handler to report, the row stays a surface. `emptyMessage` is a string, because the platform's empty
presentation states a configured sentence a product can translate once. And a table draws every row it
is given: paging and the row count are the data table's furniture.

**The four overlay part types are the shared spelling.** `ModalOverlayProps`, `ModalContentProps`,
`DrawerOverlayProps` and `DrawerContentProps` are now published by both renderers; native's
`ModalPartOverride` and `DrawerPartOverride` are deprecated aliases of the same shapes, so a shared
description of a modal's or a drawer's parts is written once. `@asheeui/web` needs no bump here: it
already published all four.

**The matrix tells the truth again.** `Table`, `DataTable` and `Typography` name themselves as their
native equivalents instead of naming `RowList` and `Text`, the stale entries for those three modules
leave `scripts/native-parity.json`, and `RowList` and `TabBar` are classified `native-only` — the
first two entries of that class. The promised count stays at **58**, because a native-only component
is promised to nobody; the matrix's own test now reads its count from the source the parity guard
parses instead of stating `61`.

This is the last rename batch. `C1` next month **moves** code and is a core major.
