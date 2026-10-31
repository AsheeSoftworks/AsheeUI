/**
 * Clipboard component configuration for the native package.
 *
 * The options are the ones the framework's clipboard contract names, so
 * `components.clipboard` is configured the same way on both platforms, and the types are
 * re-exported from `@asheeui/core` rather than restated here. What stays with the renderer
 * is the value each option defaults to on the platform, and the registration that puts it
 * in the native registry.
 */

import type { ClipboardConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export type { ClipboardConfig } from "@asheeui/core";

/**
 * Configuration options for the native clipboard pair.
 *
 * @deprecated Use {@link ClipboardConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeClipboardConfig = ClipboardConfig;

/**
 * The defaults the clipboard pair registers with the native registry.
 *
 * They are the web's own values: a copy control is a small control beside the value it
 * copies, so it is dense, bordered and unobtrusive, and the copied state lasts long enough
 * to be read. The platform's button density is a touch target rather than a pointer one,
 * but this control is explicitly asked for the framework's smallest step, which is what
 * makes it sit inside a row of data.
 *
 * `radius` is intentionally absent, as it is on the web, so the control inherits the
 * application's `defaultRadius` — the fallback below is only the last tier of the cascade.
 *
 * @deprecated Use {@link defaultClipboardConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeClipboardConfig: NativeClipboardConfig = {
  timeout: 2000,
  label: "Copy",
  copiedLabel: "Copied",
  variant: "bordered",
  color: "primary",
  size: "sm",
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    clipboard: NativeClipboardConfig;
  }
}

registerNativeComponentDefaults("clipboard", defaultNativeClipboardConfig);

/**
 * The values the clipboard pair falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_CLIPBOARD_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_CLIPBOARD_CONFIG = {
  timeout: 2000,
  label: "Copy",
  copiedLabel: "Copied",
  variant: "bordered",
  color: "primary",
  size: "sm",
  radius: "sm",
} satisfies NativeClipboardConfig;
