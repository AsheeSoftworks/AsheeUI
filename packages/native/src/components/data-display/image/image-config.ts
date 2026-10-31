/**
 * Image component configuration for the native package.
 *
 * The options are the ones the framework's image contract names, so `components.image`
 * is configured the same way on both platforms, and the type is re-exported from
 * `@asheeui/core` rather than restated here. What stays with the renderer is the value
 * each option defaults to on the platform, and the registration that puts it in the
 * native registry.
 *
 * One option of the shared contract is absent, and it is absent on purpose rather than
 * ignored: `loading` asks the *browser* when to fetch a picture, while a native picture
 * is fetched when its view mounts — and a native list mounts a row when it scrolls into
 * view, so the platform supplies the laziness the option states. A renderer that cannot
 * act on an option does not offer it, which is the same rule that keeps `underlined`
 * out of a native label's treatments.
 */

import type { ImageConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export type { ImageConfig, ImageFit, ImageRatioKey } from "@asheeui/core";

/**
 * Configuration options for the native Image.
 *
 * `fit`, `ratio`, `radius` and `showSkeleton` carry the meanings the shared image
 * contract gives them.
 *
 * @deprecated Use {@link ImageConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeImageConfig = Omit<ImageConfig, "loading">;

/**
 * The defaults the Image registers with the native registry.
 *
 * They are the web's own values: a picture fills its frame on both platforms, keeps its
 * source's proportions unless the consumer states a ratio and claims its space while it
 * loads.
 *
 * `radius` is deliberately not registered. Registering a value here would make the component
 * tier always answer, and the application's `defaultRadius` would never reach the picture.
 * That is a per-component choice, not a rule: a component that registers a radius keeps it,
 * and the application's default cannot reach it; one that leaves the radius unregistered —
 * this one — inherits `defaultRadius`. Several other components do register a radius on
 * purpose, which is why their rounding ignores the application's default.
 * {@link FALLBACK_NATIVE_IMAGE_CONFIG} still states `md` for the case where no tier answers at
 * all.
 *
 * @deprecated Use {@link defaultImageConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeImageConfig: NativeImageConfig = {
  fit: "cover",
  ratio: "auto",
  showSkeleton: true,
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    image: NativeImageConfig;
  }
}

registerNativeComponentDefaults("image", defaultNativeImageConfig);

/**
 * The values the picture falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_IMAGE_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_IMAGE_CONFIG = {
  fit: "cover",
  ratio: "auto",
  radius: "md",
  showSkeleton: true,
} satisfies NativeImageConfig;
