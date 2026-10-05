---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the feedback and state family, and the rules those five share are stated
once in `@asheeui/core`.

- `@asheeui/native` implements `Alert`, `EmptyState`, `ErrorState`, `LoadingState` and
  the toast system (`ToastProvider`, `useToast`, `ToastItem`) with the platform's own
  mechanisms rather than a web one with the browser removed. A decoration is a character
  rather than a drawing, because the package ships no icon set and its other components
  already draw their affordances from text. The toast stacks its messages in a layer of
  its own, anchored to the bottom centre by default, because the platform's own snackbar
  cannot carry the title, the action or the dismissal the contract names — the same
  argument that keeps the native spinner a themed ring rather than an activity indicator.
  An `EmptyState` has no `as` prop, because the platform has one container, and the
  technical detail of an `ErrorState` is opened from the component's own state, because
  the platform has no `details` element.
- `@asheeui/core` gains the five modules those components share with the web: the
  configuration both platforms agree on and the class strings each renderer compiles,
  native and web side by side. It also gains the two rules the family would otherwise
  have stated four times: `NATIVE_ANNOUNCEMENT_LIVE_REGION` with
  `resolveNativeAnnouncementRole`, which says how the framework's two levels of
  announcement are made on a platform that has no `status` role, and
  `NATIVE_MESSAGE_SURFACE_CLASS` with `NATIVE_MESSAGE_TEXT_CLASS`, which say what a
  message surface wears in each colour role. The alert and the toast read the same pair,
  so retuning one retunes the other. The toast's fallback timeout and queue depth live
  there too, because they are decisions about a reader's attention rather than about a
  platform.
- `@asheeui/web` points its alert, empty state, error state, loading state and toast at
  those shared maps, and reads the shared queue limits. The rendered markup and the public
  props are unchanged.
- The compatibility matrix's `Toast` entry now states what the platform actually does,
  and `scripts/native-parity.json` records `toast` in its overrides: the native
  counterpart of the web's toast module is published as `ToastProvider`, which is the
  component the matrix's guard looks for. The parity queue drops from 34 to 29.
