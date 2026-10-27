---
"asheeui": minor
"@asheeui/web": minor
"@asheeui/core": minor
"@asheeui/native": minor
---

One name for text, one for activation, and a page-title role: the three pieces of parity a component shared by both
renderers needs.

**`Text` on both branches of the umbrella.** The renderers call the same component by different names — the DOM package
exports `Typography`, the platform package exports `Text` — and each name is right for its own ecosystem. That is a real
difference between the packages and an artificial one for an application, whose shared components are the whole point of
the umbrella: a component that had to write `Typography` on the web and `Text` on a device could not be shared at all.
`asheeui` now states `Text` for both: this is `Typography` on the web branch, already `Text` on the native one. Nothing
is renamed inside the renderers — `Typography` and `Text` both stay exported, with the same props — which makes it an
alias rather than an adapter.

**`Button` accepts `onPress` on the web.** `onClick` is the DOM's event and `onPress` is React Native's, and they are the
same act: the button's guarded handler already refuses a disabled control and already runs on keyboard activation, so
both names reach the same place. A shared component cannot pass both from its own code — one of the two props does not
exist on the other renderer — so the DOM button now accepts the platform's name as well. When both are given, both run,
`onClick` first. The prop is consumed by the button rather than forwarded to the element, so React does not report it as
an unknown attribute.

**A `page-title` typography role.** A shared page frame has to state "this is the page's own title" once, and there was
no way to say it: on the web the title must be an `h1` (the document outline, and the element a host stylesheet sets the
display face on) while `heading-lg` renders `h2`, and only `heading-xl` reaches `h1` — which is a size, not a meaning.
`page-title` carries `heading-lg`'s treatment with `h1` as its default element, so a page adopting it does not change
size. The platform's `Text` states its own heading treatment for it, exactly as it does for every other role.

**One typography-role union.** `@asheeui/native`'s `NativeTextRole` was a second list that happened to match the web's,
and `page-title` is what that cost: the platform's copy did not know the new role, so the native `Text` refused the role
the umbrella was handing it. It is now `@asheeui/core`'s `TypographyRole`, so a role added for one renderer cannot exist
without the other compiling it.
