---
"@asheeui/cli": patch
---

Fix the generated configuration file, and stop implying that the CLI is needed.

`asheeui init` generated provider wiring that imports the config as a default
export, but wrote a config file with only a named export, and the JavaScript
variant was not valid JavaScript at all (`export default const config = {`).
Both variants now export the configuration object as a default export, and the
JavaScript variant carries the JSDoc type the documentation promised.

`asheeui doctor` reported a missing `asheeui.config.*` as a failure and told
you to run `asheeui init`. That file is optional: the provider falls back to the
library defaults, and an inline config object works too. The check is now
informational, so a project configured by hand no longer looks broken.

`asheeui doctor` now exits with code `1` when a check fails, and `asheeui fix`
exits with code `1` when something still fails after fixing, so both can gate a
script or a CI job. A command that fails prints one line instead of a stack
trace.
