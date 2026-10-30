/**
 * Configuration resolution for the native package.
 *
 * A consumer configures the native framework with the same shape it uses on the web:
 * platform-wide defaults plus per-component sections. Resolution goes through the
 * shared cascade, so the precedence rule is one rule rather than two that happen to
 * agree today.
 *
 * **What this file shares with the web's resolver, and what it does not.** The shared half is the
 * cascade (`resolveConfigCascade`), the merge (`mergeObject`), the palette
 * (`resolveColorConfig`, with the same "a custom theme with no `extends` inherits the configured
 * theme family" rule) and the validation (`assertValidConfig`, which the web's provider calls and
 * this one now calls too — a shared configuration object that is invalid must fail the same way on
 * both platforms). What differs is the values: the platform's density baseline, its radius baseline,
 * and `defaultSize`, which the web has no equivalent for. Those are stated once, here, in
 * `NATIVE_FALLBACK_CONFIG`.
 */

import {
  assertValidConfig,
  type ColorConfig,
  type Color,
  defaultColorConfig,
  type ExternalConfig,
  mergeObject,
  type Radius,
  resolveColorConfig,
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
  defaultColor?: Color;

  /** The default density for components that have one. */
  defaultSize?: Size;

  /** The default corner rounding for components that have one. */
  defaultRadius?: Radius;
}

/**
 * The component sections this renderer registers, keyed by the name they are stated under.
 *
 * @deprecated Use {@link ComponentsConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeComponentsConfig = {
  [K in keyof NativeComponentConfigRegistry]?: Partial<
    NativeComponentConfigRegistry[K]
  >;
};

/**
 * The sections only this renderer declares.
 *
 * A section the shared configuration already carries is typed by it, so a configuration the
 * web renderer types is accepted here unchanged. What is left is what only a device knows:
 * the sections the web renderer declares in its own package rather than in the core, which an
 * installation of `@asheeui/native` alone never sees.
 */
type NativeOnlyComponents = Omit<
  NativeComponentsConfig,
  keyof NonNullable<ExternalConfig["components"]>
>;

/**
 * A consumer's configuration, with every field optional.
 *
 * It is **the web renderer's configuration**, plus the one axis only this platform has:
 * `NativeExternalConfig` extends the `ExternalConfig` that `@asheeui/core` states, so the
 * axes, the palette, the theme and the sections the shared configuration carries are one type
 * rather than two that happen to look alike. A configuration typed by `ExternalConfig` â€” a
 * file the web renderer also reads â€” is therefore accepted here unchanged.
 *
 * The palette is honoured on the device: the provider turns the selected theme into the CSS
 * variables the compiled classes read. `defaultSize` is the platform-only part, because the
 * web has no global density and a thumb needs a different baseline from a pointer; stating it
 * in a shared file is harmless on the web, which has no such property, so a shared file should
 * state it only when the file is the device's.
 *
 * @deprecated Use {@link ExternalConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export interface NativeExternalConfig
  extends Omit<ExternalConfig, "components"> {
  /**
   * The default density, which only this platform states globally.
   *
   * The web renderer has no equivalent â€” its components name their own density â€” so a device
   * that states it does not diverge from a web host that states nothing.
   */
  defaultSize?: Size;

  /**
   * Per-component overrides, keyed by component name.
   *
   * The shared sections are the web renderer's, and the sections only this renderer declares
   * are added: a component the framework has on both platforms is configured by the same
   * object, and a component the web's package declares still has a section on the device.
   */
  components?:
    | (NonNullable<ExternalConfig["components"]> & NativeOnlyComponents)
    | undefined;
}

/**
 * The configuration type of the renderer this import resolved to.
 *
 * `asheeui` routes an import to a renderer, so a configuration file that names this type
 * compiles on both: on the web it is `@asheeui/web`'s `ExternalConfig`, on a device this
 * interface, which extends that same `ExternalConfig` â€” the same axes, the same palette and
 * the same theme, with the platform-only density.
 */
export type AsheeConfig = NativeExternalConfig;

/**
 * The resolved configuration a component reads.
 *
 * It is **core's `Config` plus the platform's density**. Every field a shared component reads —
 * `color`, `defaultTheme`, `defaultVariant`, `defaultColor`, `defaultRadius`, `components` — is the
 * one the web renderer's resolved configuration carries, so `useAsheeConfig()` returns the same shape
 * on both platforms and a component written once reads it once. `defaultSize` is the platform-only
 * addition: the web has no global density, because a pointer and a thumb want different baselines.
 *
 * The palette is the *resolved* one (`resolveColorConfig`), not the consumer's partial override, so a
 * component that reads a theme's colours does not have to resolve inheritance itself.
 *
 * @deprecated Use {@link Config} from `@asheeui/core` — the name both renderers
 * publish.
 */
export interface NativeConfig extends Required<NativePlatformConfig> {
  /** The resolved palettes, every theme filled in from the one it extends. */
  color: ColorConfig;

  /** The theme the configuration asks for, before the platform's colour scheme resolves "system". */
  defaultTheme: ThemeName | "system";

  /** Per-component options, deep-merged over the registered defaults. */
  components: Partial<NativeComponentConfigRegistry>;
}

/**
 * The values the framework falls back to when nothing else provides one.
 *
 * `defaultVariant` is the web's `faded` (see `defaultConfig` in `@asheeui/core`), not a
 * platform-only value: an axis the global tier answers must answer the same way on both
 * platforms, or a component that honours the cascade renders a different treatment
 * depending on where it runs. The other two baselines are the platform's own â€” the web has
 * no global `defaultSize`, and the platform's radius baseline is `md` against the web's
 * `xs` â€” so they are not parity claims.
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
 * The object a device resolves is a superset of the one the web renderer resolves: the same six
 * fields, with `defaultSize` added, and it is computed *once* — the provider hands this object to the
 * context and paints the palette from it, rather than resolving the theme a second time.
 *
 * @param external - The consumer's configuration, if any.
 * @param registered - The registered component defaults, which the provider reads
 * from the registry.
 * @returns The resolved configuration.
 * @throws When the configuration contains invalid values — at mount, listing every problem, exactly
 * as the web provider does.
 */
export function resolveNativeConfig(
  external: NativeExternalConfig = {},
  registered: Partial<NativeComponentConfigRegistry> = getNativeComponentDefaults(),
): NativeConfig {
  // One validation, the shared one. `defaultSize` is the platform's own key rather than a shared
  // one, so it is taken out before the shared validator sees the object — otherwise a consumer
  // stating the density it is entitled to state would be told it is an unknown key.
  const { defaultSize: _platformDensity, ...shared } = external;
  assertValidConfig(shared as ExternalConfig);

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

  // The palette is resolved here, once, by the rule the web renderer's resolver applies — including
  // the family a custom theme with no `extends` inherits: an application that defaults to dark must
  // not get a light-based custom theme. The provider paints this object instead of resolving again.
  const color = resolveColorConfig(
    defaultColorConfig,
    external.color,
    external.defaultTheme === "dark" ? "dark" : "light",
  );

  // Merge each component's section the way the web renderer does â€” with `mergeObject`,
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
    color,
    defaultTheme: external.defaultTheme ?? "system",
    components,
  };
}
