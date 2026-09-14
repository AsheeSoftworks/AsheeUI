---
"asheeui": minor
---

Add the `Breadcrumb` component.

Breadcrumb renders a hierarchical navigation trail as a named navigation landmark over an ordered list. The current
location is presented as text with `aria-current` rather than as a link, separators are decoration, and the linked
steps are rendered through the framework's `Link` primitive, so a consumer keeps its router link. The trail's scale
and link colour resolve through the framework cascade.
