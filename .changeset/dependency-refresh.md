---
"@asheeui/core": patch
"@asheeui/web": patch
"@asheeui/native": patch
"@asheeui/cli": patch
"@asheeui/theme": patch
"asheeui": patch
---

Refresh the workspace dependencies. The runtime changes are `tailwind-merge`
3.7.1 in `@asheeui/web` and `@clack/prompts` 1.9 / `commander` 15.1 in the CLI;
the rest of the packages only move their development and test toolchain
(TypeScript types, Vitest, jsdom, React Native and Expo). There are no API
changes.
