---
"@asheeui/core": minor
---

`deprecateMany` and `deprecatedAlias`: the one mechanism a rename uses to keep the old name
alive, so the naming work in the coming releases cannot invent a second one.

A rename has three parts that must not ship apart — the canonical name, the alias that keeps a
consumer's code compiling, and the warning that says which release moved it. The first two are the
easy half; the third is where a codebase rots, because "warn the consumer" is easy to write forty
times and impossible to read forty times. So the warning is deliberately narrow: **once per process,
once per module, in development only**, and it lists every name a module moved as one decision
rather than four. Production stays silent: a consumer cannot act on the message there, and it would
cost a string on every import. A module that moved nothing calls the helper with an empty list and
says nothing, which keeps every call site the same shape.

`deprecatedAlias` returns its argument unchanged, so the old export **is** the new one —
`AsheeNativeProvider === AsheeUIProvider` — and the identity test that proves an alias is an alias
can be written at all. A forwarding wrapper would satisfy the compiler and fail that test, and the
two would drift the first time one gained a property the other lacked.

Nothing prints a deprecation except this module, which is what makes the next major mechanical: the
codemod searches one symbol, and the migration guide's list is the argument the aliases already
carry.
