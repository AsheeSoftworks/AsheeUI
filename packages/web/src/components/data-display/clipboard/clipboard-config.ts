/**
 * Clipboard and CopyButton component configuration for AsheeUI.
 *
 * This file registers the values the clipboard pair defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve. The options
 * themselves, and the types that name them, live in `@asheeui/core`: they are the
 * framework's clipboard contract rather than a web renderer's, and the native renderer
 * reads the same ones from the same place. What stays here is the web default values and
 * the registration that puts them in the web registry.
 */

import { type ClipboardConfig, registerComponentDefaults } from "@asheeui/core";

export type { ClipboardConfig };

/**
 * Default config values registered for the clipboard components.
 */
export const defaultClipboardConfig: ClipboardConfig = {
  timeout: 2000,
  label: "Copy",
  copiedLabel: "Copied",
  variant: "bordered",
  color: "primary",
  size: "sm",
};

registerComponentDefaults("clipboard", defaultClipboardConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_CLIPBOARD_CONFIG: Required<ClipboardConfig> = {
  timeout: 2000,
  label: "Copy",
  copiedLabel: "Copied",
  variant: "bordered",
  color: "primary",
  size: "sm",
  radius: "sm",
};
