/**
 * Button component configuration for the native package.
 *
 * The options are the ones the framework's button contract names, with native
 * defaults: a button is dense enough for a pointer on the web and large enough for a
 * thumb here, which is why the default size is `lg` rather than the web's `md`.
 */

import type { ButtonConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Button.
 *
 * The axes are the shared ones, so `components.button` is configured the same way on
 * both platforms. `animate` is the one option left out: the press feedback belongs to
 * the platform's own `Pressable`, so a native button has no scale animation to switch
 * on rather than a scale animation that is switched off.
 *
 * The differences between the two renderers are in the *defaults* rather than in the
 * shape — a native button is density `lg` because a thumb needs the room, where the
 * web's `md` is sized for a pointer — and those live in `defaultNativeButtonConfig`.
 */
export type NativeButtonConfig = Omit<ButtonConfig, "animate">;

/**
 * The defaults the Button registers with the native registry.
 *
 * `variant`, `color` and `radius` are deliberately absent so they inherit from the
 * platform's configuration rather than pinning a value.
 */
export const defaultNativeButtonConfig: NativeButtonConfig = {
  size: "lg",
  fullWidth: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    button: NativeButtonConfig;
  }
}

registerNativeComponentDefaults("button", defaultNativeButtonConfig);

/**
 * The values the button falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_BUTTON_CONFIG: Required<NativeButtonConfig> = {
  variant: "solid",
  color: "primary",
  size: "lg",
  radius: "md",
  fullWidth: false,
};
