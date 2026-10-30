---
"@asheeui/native": minor
---

Every prop the web accepts and a device cannot honour now says so, once, and names what to do
instead.

**One mechanism.** `warnUnsupportedProp(component, prop, substitute)` is the ledger's voice: once per
`(component, prop)` for the process, in development only, and always with a substitute rather than only
a refusal (`NATIVE-IMPOSSIBLE-REPORT.md` R2). `useUnsupportedProps` runs the same check from a
component's destructured props, and `useUnsupportedElementProps` states the element family's four
substitutes once.

**The configuration half is an audit.** `auditUnsupportedConfig` reads the consumer's configuration
before defaults are merged — a registered default is not a decision the consumer made — and warns for
every `K` option a shared `asheeui.config.ts` may carry: a toast's portal, a calendar's picker, a
tooltip's `zIndex`, an image's `loading`, a layout's `sticky*`, and the field options that are DOM
concepts (`name`, `searchInputName`, `shortcut`, `enableVirtualKeyboard`).

**The prop half is at the point the prop is accepted.** `Image.loading`, `Dropmenu.name` and
`searchInputName`, `SearchInput.shortcut`, `Textarea.enableVirtualKeyboard`, `ToastProvider.portal`
and `portalTarget`, `Calendar.picker`/`portal`/`lockScroll`, `Tooltip.zIndex`, `Navbar.mobile*`,
`Page`/`SidebarLayout`/`DocsLayout`/`Split`'s sticky options, `SectionHeading.titleId`/`targetId`,
and `as`/`titleAs` on the layout, feedback and marketing components all warn when they are written.
Absence never warns, and a prop that is implemented never warns.

**The matrix says it per component.** The affected entries carry a note naming the options that are
accepted and warn, which is what B24's docs page reads.

`Typography.as` keeps its B15 warning; it is the same rule and the same wording.
