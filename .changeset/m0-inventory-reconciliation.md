---
"asheeui": minor
"@asheeui/cli": patch
---

The public component inventory is now derived from the public export surface.

`asheeui`: the internal form-field helper (`field`, including `FieldShell`) and the internal `MenuOption` type
from the menu helper are no longer re-exported from the package entry point. They were always implementation details
shared by the components that use them, and exposing them made internal building blocks look like public components.
This is a breaking change for code that imported them from `asheeui`. Migration: stop importing internal helpers and
use the public components instead (`Input`, `Textarea`, `Radio`, `Switch`, `MultiSelect`, `Dropmenu`,
`Autocomplete`). This is a pre-1.0 breaking change and no compatibility alias is provided.

`@asheeui/cli`: `asheeui list` now derives the component inventory from the package's public export surface instead
of scanning the `components/` directory tree. Internal helpers can no longer appear, and the `scrollbar`
configuration module is no longer reported as a component. The reported inventory follows the public export
surface. Both a source entry module and a built entry module are supported.
