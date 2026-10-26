/**
 * The section kit for AsheeUI.
 *
 * The kit holds the parts the framework's patterns share: the heading block
 * (`SectionHeading`), the configured action group (`ActionGroup`) and the skip
 * link the page compositions lead with (`SkipLink`). It is public, and it is
 * public through its own subpath — `@asheeui/web/section-kit` — rather than the
 * package entry point, because it is the composition vocabulary rather than the
 * component inventory; `https://www.asheeui.com/components/layouts/section` documents it
 * under "The section kit". Import from that subpath in application code.
 */

export * from "./ActionGroup";
export * from "./SectionHeading";
export * from "./SkipLink";
