---
"asheeui": minor
---

Add the `Form` component.

Form is a deliberately thin wrapper over the native form element, in the same way `Link` wraps the anchor and `Image`
wraps the picture. It preserves native submission and validation: `action`, `method`, `encType`, `target`,
`noValidate` and the submit event pass through unchanged, and the forwarded ref reaches the element itself, so a form
library binds to it exactly as it binds to a plain form. A `legend` groups the fields, and `submitLabel` renders an
AsheeUI `Button` as the submit control, with `isPending` showing a submission in progress. The component introduces no
form state of its own, and the substitution API for a framework-specific form is left to the decision that resolves
it.
