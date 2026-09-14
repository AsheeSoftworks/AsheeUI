---
"asheeui": patch
---

Keep a busy control's name.

A button that is loading used to replace its label with the word "Loading", so assistive technology announced
"Loading" without saying which action was running. The label now stays in the accessible name while the control is
busy, and the busy state is carried by `aria-busy`.
