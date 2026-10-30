/**
 * Button component configuration for the native package.
 *
 * The options are the ones the framework's button contract names, with native
 * defaults: a button is dense enough for a pointer on the web and large enough for a
 * thumb here, which is why the default size is `lg` rather than the web's `md`.
 */

import type { ButtonConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

/**
 * Configuration options for the native Button.
 *
 * The axes are the shared ones, so `components.button` is configured the same way on
 * both platforms. `animate` joined them in B13: the platform's `Pressable` still supplies
 * its own press feedback, and the framework's press scale is drawn on top of it when the
 * reader has not asked for less motion.
 *
 * The differences between the two renderers are in the *defaults* rather than in the
 * shape — a native button is density `lg` because a thumb needs the room, where the
 * web's `md` is sized for a pointer — and those live in `defaultNativeButtonConfig`.
 *
 * @deprecated Use {@link ButtonConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeButtonConfig = ButtonConfig;

/**
 * The defaults the Button registers with the native registry.
 *
 * `variant`, `color` and `radius` are deliberately absent so they inherit from the
 * platform's configuration rather than pinning a value.
 *
 * @deprecated Use {@link defaultButtonConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeButtonConfig: NativeButtonConfig = {
  size: "lg",
  fullWidth: false,
  animate: true,
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    button: NativeButtonConfig;
  }
}

registerNativeComponentDefaults("button", defaultNativeButtonConfig);

/**
 * The values the button falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_BUTTON_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_BUTTON_CONFIG = {
  variant: "solid",
  color: "primary",
  size: "lg",
  radius: "md",
  fullWidth: false,
  animate: true,
} satisfies NativeButtonConfig;
