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
