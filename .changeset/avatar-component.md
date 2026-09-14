---
"asheeui": minor
---

Add the `Avatar` component.

Avatar represents a person or an entity with a picture, and falls back to that entity's initials when there is no
picture or the picture fails to load. The picture is rendered through the framework's `Image` primitive, so a
consumer keeps its own image component by passing `component`. The avatar carries the entity's name as a single
labelled image role, and is hidden from assistive technology when it names nothing. Diameter, radius and the fallback
colour resolve through the framework cascade.
