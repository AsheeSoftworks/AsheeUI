/**
 * The umbrella's section kit, web branch.
 *
 * The composition vocabulary both platforms share: the heading block and the configured action
 * group. It is its own subpath — `asheeui/section-kit` — rather than part of the package entry
 * point, because it is the vocabulary a page composition writes rather than the component
 * inventory it draws with.
 *
 * `SkipLink` is deliberately absent. It compensates for a browser's tab order, so it has no
 * native counterpart and no place on a surface that must resolve on both branches. A web
 * application that wants it imports `SkipLink` from `@asheeui/web/section-kit`; the showcase
 * does exactly that, and says why at the import.
 */

export { ActionGroup, SectionHeading } from "@asheeui/web/section-kit";
