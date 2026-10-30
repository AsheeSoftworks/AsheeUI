---
"@asheeui/native": minor
"@asheeui/core": minor
---

Native typography resolves the shared role table, accepts the four token overrides and the per-role
retuning, and reads `components.typography` — the section both renderers publish.

**One role table, not two.** B15 deleted the platform's private `TEXT_ROLE_CLASS`. A role now
resolves through core's `TYPOGRAPHY_ROLE_TOKEN` — the table the web renderer reads — and the
platform maps those tokens to its own utilities. The divergence `CORE-MIGRATION-REPORT.md` §5 row 6
records is closed, and the test walks every role and asserts the rendered size, weight, tracking and
line height are the shared token's.

**`size`, `weight`, `leading`, `tracking` and `roles`.** A consumer can override any part of a
role's treatment on an instance or under `components.typography.roles`, in the web's order: the
instance prop wins over the configured retuning, which wins over the role table. `leading` is the one
conversion the platform must make: a unitless multiplier on the web becomes `lineHeight` in
density-independent pixels (`TYPOGRAPHY_LEADING_MULTIPLIER` in core, multiplied by the platform's
font size), which is impossibility report I4-3.

**`as` is accepted and warned, and does nothing.** A device has no elements; every role draws the
platform's `Text` and the meaning reaches assistive technology through the accessibility role. The
warning is once per process and names the reason, which is the same contract `Card.titleAs` will
state in B17.

**The section is `components.typography`.** It is registered on both renderers now. A native-only
configuration that still writes `components.text` keeps working and warns once, but only when its
value differs from what this renderer registers — a default is not a consumer's choice, and warning
about it would fire on every application.
