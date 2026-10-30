---
"@asheeui/native": minor
---

The native package publishes the shared type vocabulary and the configuration sections under the names
`@asheeui/core` declares, so a consumer writes one import on both renderers.

**The shared vocabulary.** `ActionConfig`, `AsheeColorRegistry`, `Color`, `ColorConfig`,
`ColorVariant`, `DefaultColorConfig`, `ExternalConfig`, `Radius`, `Size`, `Space`, `ThemeName`,
`TypographyAlign`, `TypographyRole`, `TypographyTone` and `Variant` are re-exported from
`@asheeui/native`, in one alphabetised block commented as the shared vocabulary. They are the types a
consumer actually writes — the design language's tokens, the palette's roles, the typography roles and
the configuration shape a shared `asheeui.config.ts` exports — and `@asheeui/web` publishes the same
list, so a file that imports one of them compiles against either renderer instead of reaching into
core.

**The configuration sections.** Fifty `*Config` types — `ButtonConfig`, `InputConfig`, `AccordionConfig`
and the rest — are re-exported for the same reason: `components.button` is configured by
`ButtonConfig` on both platforms, so the name a consumer's configuration file imports does not depend
on the renderer it is compiled against.

**The platform spellings stay, and say where to go.** `NativeButtonConfig` and the other fifty
declarations are still exported — a public type is not deleted — and each now carries a
`@deprecated` tag naming the shared type and the reason: the platform's spelling is the renderer's
*narrowing* of the same contract (a native button is `Omit<ButtonConfig, "animate">`, because the press
feedback belongs to the platform's own `Pressable`), not a second contract. A type has no runtime
identity, so this is the one deprecation the helper cannot announce: an editor strikes it through, and
the compiler accepts both spellings.

The umbrella shows the effect: names both branches offer went from **258 to 284**, and the public
web-only list from **75 to 63**. Three of the new re-exports are still native-only — `TypographyRole`,
`TypographyTone` and `TypographyAlign` — because `@asheeui/web` declares its own typography types
rather than re-exporting core's; that is the typography parity step, not this one.
