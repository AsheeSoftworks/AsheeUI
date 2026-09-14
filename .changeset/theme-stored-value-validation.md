---
"asheeui": patch
---

Ignore a stored theme the configuration does not define.

The pre-paint theme script applied whatever theme name it found in local storage, even when the configuration
defined no CSS block for it, which could leave the page unstyled until the theme controller corrected it after
hydration. The script now validates the stored value against the configured themes and never applies a theme class
that has no generated CSS. The theme controller already behaved this way.
