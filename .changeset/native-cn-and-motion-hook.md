---
"@asheeui/native": minor
"asheeui": patch
---

`cn` on native: one class merge for the device, and `usePrefersReducedMotion` beside the platform's
own name for the motion preference.

**`cn` is the native renderer's own merge.** The web composes classes with `tailwind-merge`, which is
a model of Tailwind's *scales* — it knows that `p-2` and `p-4` hold different values, and rewrites
the survivor. That model is wrong on a device: a different value per platform is the framework's
promise (`p-2` is 8 dp here and 0.5 rem in a browser), so the merge compares property **families**
only: the same property, the last one wins, and no value is ever touched. A variant is part of the
identity, so `active:opacity-90` and `opacity-100` both survive. A class the table does not model is
kept rather than dropped, which is what makes an incomplete table cost bytes instead of styles.
Families that share a prefix are kept apart, because they are different declarations: `text-sm` is a
size where `text-primary` is a colour, `border` is a width where `border-border` is a colour, and
`bg-linear-to-r` is an image where `bg-primary` is a colour.

`classNames` is now `deprecatedAlias(cn)` — the same function under the name this package published
before 2.8, announced once per process in development. It is not a second implementation, and a
component that composes through it produces what the merge produces.

Because the alias *is* the merge, composition changed immediately: superseded classes are no longer
carried in the string. One test noticed: a bordered card's accent colour had always overridden the
variant's `border-border` (the surface and the accent are deliberately separate maps), and the string
used to contain the losing class as well. The test asserted the class that never took effect; it now
asserts the surface that won.

**The umbrella's native branch stopped re-exporting core's `cn`.** With the renderer exporting its
own, that re-export published the name twice and would have failed the build. The web branch is
unchanged: `cn` reaches it from core until the web renderer's own merge moves into `@asheeui/web`.

**`usePrefersReducedMotion` exists on native.** `@asheeui/web` publishes that name and
`useReduceMotion` too; the platform published only its own. A shared component reads one name and
gets the renderer's answer, so the platform now exports both, the same function rather than a second
implementation.
