/**
 * Text component configuration for the native package.
 *
 * The options are the ones the framework's text contract names, so a role means the same
 * thing here as it does on the web: the platform decides how it renders one, and the
 * vocabulary is shared.
 *
 * **The section is `components.typography` on both renderers.** This package used to
 * register `components.text`, which was the platform's own key; B15 registers the shared
 * name and keeps reading the old one for one minor, with a warning when a consumer's value
 * differs from the registered default. A shared `asheeui.config.ts` therefore configures
 * text once, and a native-only file keeps working.
 */

import type {
  TypographyConfig,
  TypographyRole,
  TypographyTone,
} from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export type { TypographyConfig } from "@asheeui/core";

/**
 * The semantic typography roles the framework states.
 *
 * **The shared union, not a copy of it.** It used to be a second list that happened to match the web's, which is a
 * drift waiting for the day one renderer gains a role: `page-title` was added for a shared page frame and the
 * platform's list did not know it, so the native `Text` refused the role the umbrella was handing it. Naming
 * `@asheeui/core`'s union is what makes a role a role on both platforms by construction.
 */
export type NativeTextRole = TypographyRole;

/**
 * The tone of a piece of text.
 * The shared union, including the two relative tones and `none`.
 */
export type NativeTextTone = TypographyTone;

/**
 * Configuration options for the native Text.
 *
 * It is the shared section, so `roles`, the four token overrides and `as` are understood
 * the same way they are on the web; what a device cannot draw is an element, which B15
 * accepts and warns about rather than ignoring.
 */
export type NativeTextConfig = TypographyConfig;

/**
 * The defaults the Text registers with the native registry.
 *
 * @deprecated Use {@link defaultTextConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeTextConfig: NativeTextConfig = {
  role: "body-md",
  tone: "default",
  truncate: false,
};

/**
 * The defaults the shared `components.typography` section registers.
 *
 * Empty on purpose: the role and the tone have framework fallbacks, and registering a
 * value here would outrank the web's identical section in a shared configuration.
 */
export const defaultNativeTypographyConfig: TypographyConfig = {};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    text: NativeTextConfig;
    typography: TypographyConfig;
  }
}

registerNativeComponentDefaults("text", defaultNativeTextConfig);
registerNativeComponentDefaults("typography", defaultNativeTypographyConfig);

/**
 * The values the text falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_TEXT_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_TEXT_CONFIG = {
  role: "body-md",
  tone: "default",
  align: "left",
  truncate: false,
} satisfies NativeTextConfig;
