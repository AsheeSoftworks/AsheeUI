/**
 * Text component configuration for the native package.
 *
 * The options are the ones the framework's text contract names, so a role means
 * the same thing here as it does on the web: the platform decides how it renders
 * one, and the vocabulary is shared.
 *
 * The shared *section* — `components.typography`, with the role table overrides — is
 * `@asheeui/core`'s, declared in `packages/core/src/components/typography/typography-config.ts`,
 * and this package re-exports its type. `components.text` stays this renderer's own key: it is the
 * section a native consumer already writes, and renaming it would be a key change rather than a
 * shape one.
 */

import type { Color, Size, TypographyRole } from "@asheeui/core";
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
 * A colour role, or one of the two relative tones the framework adds.
 */
export type NativeTextTone = Color | "muted" | "default";

/**
 * Configuration options for the native Text.
 */
export interface NativeTextConfig {
  /** Semantic typography role. Defaults to "body-md". */
  role?: NativeTextRole;

  /** Tone of the text. Defaults to "default". */
  tone?: NativeTextTone;

  /** Horizontal alignment. Left by default. */
  align?: "left" | "center" | "right";

  /** Whether the text truncates to one line. Defaults to false. */
  truncate?: boolean;
}

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
 * The density steps the native text scale uses.
 * The web states the same steps through Tailwind's font sizes; the platform maps
 * them to its own scaled pixels, which is why the step is shared and the value is
 * not.
 */
export const NATIVE_TEXT_SIZE: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    text: NativeTextConfig;
  }
}

registerNativeComponentDefaults("text", defaultNativeTextConfig);

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
