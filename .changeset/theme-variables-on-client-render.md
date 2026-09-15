---
"asheeui": patch
---

Apply the theme variables on a client-only render.

The pre-paint theme script applies the theme before the first paint, but a
browser only runs a script that arrives with the server markup. In a
client-rendered application the element was inert, so the theme CSS variables
were never injected and every component that resolves its colours through them
fell back to nothing.

The provider now applies the variables before the first paint in that case, and
it no longer renders the script where it could not run. That last part also
removes the React warning about a script rendered on the client.
