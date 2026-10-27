/**
 * The AsheeUI umbrella package.
 *
 * One entry point, two renderers. An application installs `asheeui`, imports the
 * components it needs and writes the same import specifiers whether it runs in a browser
 * or on a device; the resolver decides which implementation answers:
 *
 * - On the web, the resolver reads `main` (and the `import` condition) and reaches the
 *   DOM implementation in `@asheeui/web`.
 * - Under Expo and Metro, it reads the manifest's `react-native` field, then the
 *   `react-native` condition of the exports map, and finally Metro's platform extension
 *   (`.native.ts` next to `.ts`), and reaches the React Native implementation in
 *   `@asheeui/native`.
 *
 * The routing is a property of the file name and the manifest rather than a runtime
 * check, which is what keeps a browser bundle free of React Native and a native bundle
 * free of the DOM: this module is the web branch, and it imports no native renderer.
 * The native branch is the sibling `./index.native`, which exports the other renderer
 * and the same helpers.
 *
 * The helpers exported after the renderer belong to neither platform: the class-name
 * composition and the cascade every component resolves through are the parts of the
 * framework an application uses directly, and they come from `@asheeui/core` so both
 * branches offer exactly the same ones.
 */

import type { ExternalConfig } from "@asheeui/web";

export {
  cn,
  mergeObject,
  resolveAnimate,
  resolveCascade,
  resolveClassKey,
  resolveConfigCascade,
  resolveRadiusKey,
} from "@asheeui/core";
export * from "@asheeui/web";

/**
 * The renderer's semantic text, under the name both branches answer to.
 *
 * The two renderers call the same component by different names: the DOM package exports
 * `Typography` and the platform package exports `Text`, because each name is the one its own
 * ecosystem uses. That is a real difference between the packages and an artificial one for an
 * application, whose shared components are the whole point of the umbrella: a component that
 * had to write `Typography` on the web and `Text` on a device could not be shared at all,
 * which is what the shared kit met first.
 *
 * So the umbrella states the one name a shared component can rely on. This branch points it at
 * `Typography`; the sibling `./index.native` already receives `Text` from `@asheeui/native`,
 * so the same import compiles and renders on both platforms. Nothing is renamed inside the
 * renderers - `Typography` and `Text` both stay exported, with the same props (role, tone,
 * align, truncate) - which is what makes this an alias rather than an adapter.
 */
export { Typography as Text } from "@asheeui/web";

/** The props of {@link Text}, which are `Typography`'s on the web. */
export type { TypographyProps as TextProps } from "@asheeui/web";

/**
 * The configuration type of the renderer this import resolved to.
 *
 * A configuration file that both platforms read names this type, so one object describes
 * both: on the web it is `@asheeui/web`'s `ExternalConfig`, and the sibling `./index.native`
 * exports `@asheeui/native`'s `AsheeConfig` under the same name — the same axes, the same
 * palette and the same theme, with the options that only the platform has. An option one
 * platform cannot honour is refused by the other, which is the point: the alternative is a
 * key that is accepted and silently does nothing.
 */
export type AsheeConfig = ExternalConfig;
