/**
 * Text component configuration for the native package.
 *
 * The options are the ones the framework's text contract names, so a role means
 * the same thing here as it does on the web: the platform decides how it renders
 * one, and the vocabulary is shared.
 */

import type { ColorRole, Size } from "@asheeui/shared";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * The semantic typography roles the framework states.
 * They match the roles the web typography system uses, so a role is a role on
 * either platform.
 */
export type NativeTextRole =
  | "display"
  | "heading-xl"
  | "heading-lg"
  | "heading-md"
  | "heading-sm"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "label"
  | "caption"
  | "overline";

/**
 * The tone of a piece of text.
 * A colour role, or one of the two relative tones the framework adds.
 */
export type NativeTextTone = ColorRole | "muted" | "default";

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

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    text: NativeTextConfig;
  }
}

registerNativeComponentDefaults("text", defaultNativeTextConfig);

/**
 * The values the text falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_TEXT_CONFIG: Required<NativeTextConfig> = {
  role: "body-md",
  tone: "default",
  align: "left",
  truncate: false,
};
