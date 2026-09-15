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
  type Radius,
  resolveConfigCascade,
  type Size,
  type Variant,
} from "@asheeui/shared";
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
 */
export interface NativeExternalConfig extends NativePlatformConfig {
  /** Per-component overrides, keyed by component name. */
  components?: {
    [K in keyof NativeComponentConfigRegistry]?: Partial<
      NativeComponentConfigRegistry[K]
    >;
  };
}

/**
 * The resolved configuration a component reads.
 */
export interface NativeConfig extends Required<NativePlatformConfig> {
  /** Per-component options, with the registered defaults merged in. */
  components: Partial<NativeComponentConfigRegistry>;
}

/**
 * The values the framework falls back to when nothing else provides one.
 */
export const NATIVE_FALLBACK_CONFIG: Required<NativePlatformConfig> = {
  defaultVariant: "solid",
  defaultColor: "primary",
  defaultSize: "md",
  defaultRadius: "md",
};

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

  const components: Record<string, unknown> = {};

  for (const [name, defaults] of Object.entries(registered)) {
    components[name] = {
      ...(defaults as Record<string, unknown>),
      ...((external.components as Record<string, unknown> | undefined)?.[
        name
      ] ?? {}),
    };
  }

  // A component configured by a consumer but absent from the registry still
  // resolves: its own fallback is what supplies the missing values.
  for (const [name, override] of Object.entries(external.components ?? {})) {
    components[name] = { ...(components[name] as object), ...override };
  }

  return {
    ...platform,
    components: components as Partial<NativeComponentConfigRegistry>,
  };
}
