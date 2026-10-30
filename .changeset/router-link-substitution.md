---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

A consumer's router link plugs into `Button`, `Card`, `Form`, `Footer`, `Pagination` and `Sidebar`,
through one substitution contract in core.

**The contract.** `Substitution<P>` and `LinkSubstitution<P>` state what the framework has always
done ad hoc on `Link`, `Image` and `Navbar`: a `component` replaces the framework's element, a
`componentProps` object is spread last so it wins, and a link also accepts the `to` a router
understands. It is a type, not a dependency — the substitute is the consumer's, and no navigation
package is installed.

**The six components.** `Button` accepts `link` (and the `component`/`componentProps` pair) and hands
the substitute its destination, press, classes, style and accessibility state. `Card` renders its root
as the substitute and reports itself as a link. `Form` renders its container as the substitute while
the form context still reaches the controls. `Footer` applies its `link` to every link it renders.
`Pagination` renders its "load more" control as the substitute and uses `hrefForPage` for the
destination. `Sidebar` already passed its `link` to every row; the row type now has the web's name.

**One shape on both renderers.** `FeatureGridLink`, `FooterLink`, `PaginationLink` and
`SidebarLinkProps` are importable from both packages. The first three use the web's `component`/`props`
keys rather than core's `componentProps`, so one object works where it was written; the native
components map one to the other.

**Native `Link` accepts `to`.** A substitute receives `to` when it was given and `href` otherwise,
which is the web link's rule; a platform link with no router follows `href ?? to` through its URL
handler, so a call site works before and after a router exists.

Web's code did not need to change — it already published the four types and the `link` shape — so its
patch records the contract rather than a fix.
