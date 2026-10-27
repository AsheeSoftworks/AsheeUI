/**
 * Configuration resolution for the native package.
 *
 * A consumer configures the native framework with the same shape it uses on the web:
 * platform-wide defaults plus per-component sections. Resolution goes through the
 * shared cascade, so the precedence rule is one rule rather than two that happen to
 * agree today.
 */

import {
  type ColorRole,
  type ExternalColorConfig,
  mergeObject,
  type Radius,
  resolveConfigCascade,
  type Size,
  type ThemeName,
  type Variant,
} from "@asheeui/core";
import {
  getNativeComponentDefaults,
  type NativeComponentConfigRegistry,
} from "./registry";

/**
 * The platform-wide defaults a native application can set.
 */
export interface NativePlatformConfig {
  /** The default visual treatment for components that have one. */
  defaultVariant?: Variant;

  /** The default colour role for components that resolve one. */
  defaultColor?: ColorRole;

  /** The default density for components that have one. */
  defaultSize?: Size;

  /** The default corner rounding for components that have one. */
  defaultRadius?: Radius;
}

/**
 * A consumer's configuration, with every field optional.
 *
 * The palette and the theme are stated exactly as the web renderer states them, because
 * the device paints the same eight roles from the same `ColorVariant`: the provider turns
 * the selected theme into the CSS variables the compiled classes read. A configuration
 * written once therefore describes both renderers — the axes, the component sections and
 * the palette — and `AsheeConfig` is the name to import when the file is shared.
 */
export interface NativeExternalConfig extends NativePlatformConfig {
  /**
   * The palettes, per theme name.
   *
   * The same object `@asheeui/web` accepts: `light` and `dark` override the framework's
   * built-in palettes in place, and any other key is a theme of its own (optionally
   * extending another with `extends`).
   */
  color?: ExternalColorConfig;

  /**
   * The theme to paint.
   *
   * `"system"` — and stating nothing — follows the device's colour scheme, so a phone in
   * dark mode gets the dark palette without the application doing anything. Any other name
   * must be a theme the `color` object declares; a name no palette answers is an error
   * rather than a silent fall back to light.
   */
  defaultTheme?: ThemeName | "system";

  /** Per-component overrides, keyed by component name. */
  components?: {
    [K in keyof NativeComponentConfigRegistry]?: Partial<
      NativeComponentConfigRegistry[K]
    >;
  };
}

/**
 * The configuration type of the renderer this import resolved to.
 *
 * `asheeui` routes an import to a renderer, so a configuration file that names this type
 * compiles on both: on the web it is `@asheeui/web`'s `ExternalConfig`, on a device this
 * interface. An option that only one platform honours is refused by the other, which is the
 * point — the alternative is a key that is accepted and silently does nothing.
 */
export type AsheeConfig = NativeExternalConfig;

/**
 * The resolved configuration a component reads.
 */
export interface NativeConfig extends Required<NativePlatformConfig> {
  /** Per-component options, deep-merged over the registered defaults. */
  components: Partial<NativeComponentConfigRegistry>;
}

/**
 * The values the framework falls back to when nothing else provides one.
 *
 * `defaultVariant` is the web's `faded` (see `defaultConfig` in `@asheeui/core`), not a
 * platform-only value: an axis the global tier answers must answer the same way on both
 * platforms, or a component that honours the cascade renders a different treatment
 * depending on where it runs. The other two baselines are the platform's own — the web has
 * no global `defaultSize`, and the platform's radius baseline is `md` against the web's
 * `xs` — so they are not parity claims.
 */
export const NATIVE_FALLBACK_CONFIG = {
  defaultVariant: "faded",
  defaultColor: "primary",
  defaultSize: "md",
  defaultRadius: "md",
} satisfies NativePlatformConfig;

/**
 * Resolve a consumer's configuration into the configuration components read.
 *
 * @param external - The consumer's configuration, if any.
 * @param registered - The registered component defaults, which the provider reads
 * from the registry.
 * @returns The resolved configuration.
 */
export function resolveNativeConfig(
  external: NativeExternalConfig = {},
  registered: Partial<NativeComponentConfigRegistry> = getNativeComponentDefaults(),
): NativeConfig {
  const platform = resolveConfigCascade<
    NativePlatformConfig,
    Required<NativePlatformConfig>
  >(
    {
      defaultVariant: external.defaultVariant,
      defaultColor: external.defaultColor,
      defaultSize: external.defaultSize,
      defaultRadius: external.defaultRadius,
    },
    undefined,
    NATIVE_FALLBACK_CONFIG,
  );

  // Merge each component's section the way the web renderer does — with `mergeObject`,
  // not a shallow spread. A section is a description of one component, and a consumer is
  // entitled to state a single nested key (`components.sidebar.options.active.variant`)
  // without restating the rest: `sidebar-config.ts` promises that `components.sidebar`
  // means the same thing on every platform, which a shallow merge would break on a device
  // by replacing the whole registered `options` object and losing `options.inactive`.
  //
  // A component configured by a consumer but absent from the registry still resolves:
  // `mergeObject` keeps a key it has no default for as the consumer stated it, and the
  // component's own fallback supplies the values the section leaves out.
  const components = mergeObject(
    registered as Record<string, unknown>,
    external.components as Record<string, unknown> | undefined,
  ) as Partial<NativeComponentConfigRegistry>;

  return {
    ...platform,
    components,
  };
}
