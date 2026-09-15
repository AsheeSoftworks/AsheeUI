---
"asheeui": minor
---

Give `Link`, `Image` and `Form` the same substitution API.

The substitution capability is now decided once and applied identically to the
three primitives: `component` names the component that replaces the native
element, and `componentProps` carries the props it needs. The previous names
differed per component.

| Before | After | Migration |
| --- | --- | --- |
| `Link`: `linkComponent`, `linkProps` | `component`, `componentProps` | Rename both props. |
| `Image`: `props` | `componentProps` | Rename the prop. `component` is unchanged. |
| `Avatar`: `imageProps` | `componentProps` | Rename the prop. `component` is unchanged. |
| `Breadcrumb` step: `linkComponent`, `linkProps` | `component`, `componentProps` | Rename both keys on the step. |
| `Card` image and link config: `props` | `componentProps` | Rename the key. `component` is unchanged. |
| `Form` | `component`, `componentProps` | New. A framework form primitive can replace the native element. |

These are pre-1.0 breaking changes, so no compatibility alias is provided.
