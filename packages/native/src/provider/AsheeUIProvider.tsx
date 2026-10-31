/**
 * The native provider and configuration context.
 *
 * The provider resolves the configuration once and hands it to every component, and it
 * **paints the palette** the configuration states. The web renderer does that by writing
 * `--ashee-*` custom properties on the document and letting the stylesheet read them; the
 * platform has no document, but it has the same mechanism through NativeWind: the compiled
 * classes name their colour as `rgb(var(--ashee-primary) / <alpha-value>)`, so a view that
 * states those variables paints its whole subtree with them. The provider is that view.
 *
 * Three consequences are worth stating rather than discovering:
 *
 * - **The palette is the application's, once.** `color` and `defaultTheme` are the same
 *   configuration the web renderer accepts, resolved by the same `resolveColorConfig`, so a
 *   device and a browser paint one design language from one object rather than two copies
 *   that drift.
 * - **`defaultTheme: "system"` follows the device.** The provider reads the platform's colour
 *   scheme and re-paints when it changes, so a phone that switches to dark mode switches the
 *   application with it. A named theme is painted as stated.
 * - **The provider claims the height it is given** (`flex-1`), because a screen's shell grows
 *   into the screen. It is meant to be mounted at the root, which is where the documentation
 *   puts it.
 *
 * It also says so, in development only, when the styling pipeline is not connected. A screen
 * whose classes are all ignored renders with the right copy and no style at all, which reads
 * as a theme problem rather than a setup problem; the check in `nativewind-doctor` turns that
 * into one warning naming the cause. It costs nothing in a production bundle, because the
 * gate is `NODE_ENV`.
 *
 * **One name, on both renderers.** The provider, its props, its context and its hook are the
 * names `@asheeui/web` publishes — `AsheeUIProvider`, `AsheeUIProviderProps`,
 * `AsheeConfigContext`, `useAsheeConfig` — because a shared component writes one root and
 * reads one configuration, and a name that changes between platforms is what stops it being
 * shared. The platform-suffixed spellings this module used to declare are kept at the bottom
 * as deprecated aliases of the same references, so a consumer's existing import keeps
 * working and keeps warning.
 */

import {
  deprecatedAlias,
  deprecateMany,
  type ExternalColorConfig,
  mergeRuntimeThemes,
  selectTheme,
  type ThemeStorage,
} from "@asheeui/core";
import { vars } from "nativewind";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { useColorScheme, View } from "react-native";
import {
  type NativeConfig,
  type NativeExternalConfig,
  resolveNativeConfig,
} from "../config/resolve-config";
import { auditUnsupportedConfig } from "../config/unsupported-config";
import {
  setThemeStorage,
  themeController,
} from "../theme/controller";
import { paletteVariables } from "../theme/palette";
import { warnWhenStylingIsDisconnected } from "./nativewind-doctor";

/**
 * The configuration context.
 * `null` means the application did not wrap its tree, which the hook reports as a
 * mistake rather than silently defaulting.
 */
export const AsheeConfigContext = createContext<NativeConfig | null>(null);

/**
 * Props for the native provider.
 */
export interface AsheeUIProviderProps {
  /**
   * The application's configuration, if it has one.
   *
   * The same object a web host passes to `AsheeUIProvider`: the axes, the palette, the
   * theme and the per-component sections.
   */
  config?: NativeExternalConfig;

  /**
   * Themes the application added while it was running.
   *
   * The same definitions the web provider accepts: partial palettes that extend a built-in, a
   * configured theme or another runtime theme. They are merged over `config.color` before
   * resolution, so inheritance and validation are shared. `light` and `dark` are reserved; retune
   * them in `config.color`. Removing a runtime name removes it from the picker and repaints from
   * the configured definition, if one exists.
   */
  themes?: ExternalColorConfig;

  /**
   * An optional adapter the theme selection is persisted through.
   *
   * The framework installs no storage package: persistence is the application's dependency,
   * not the library's. An adapter is any object with `get`, `set` and `remove` (an
   * AsyncStorage wrapper, an Expo key-value store), and without one the selection lasts for
   * the session.
   *
   * ```tsx
   * <AsheeUIProvider persistTheme={asyncStorageAdapter}>
   *   <App />
   * </AsheeUIProvider>
   * ```
   */
  persistTheme?: ThemeStorage;

  /** The application tree. */
  children: ReactNode;
}

/**
 * Provide the resolved configuration and the painted palette to every component below.
 *
 * @param props - The configuration and the tree.
 * @returns The provider element.
 *
 * @example
 * ```tsx
 * import { AsheeUIProvider } from "@asheeui/native";
 *
 * <AsheeUIProvider
 *   config={{
 *     color: { light: { primary: "#047857" } },
 *     defaultTheme: "system",
 *     defaultVariant: "bordered",
 *     defaultRadius: "sm",
 *   }}>
 *   <App />
 * </AsheeUIProvider>;
 * ```
 */
export function AsheeUIProvider({
  config,
  themes,
  persistTheme,
  children,
}: AsheeUIProviderProps) {
  // One resolution, handed to the context below and painted from here: the palette is part of the
  // resolved configuration (`color`), so this provider does not resolve the theme a second time and
  // a component that reads `config.color` reads the same palettes the screen was painted with.
  const value = useMemo(() => {
    // Runtime themes take the same path as configured ones: merge, validate, resolve. The merge
    // keeps the native configuration's platform-only fields (`defaultSize`).
    const merged = mergeRuntimeThemes(config, themes);

    // The ledger's config half: an option only the web can honour is accepted and said out
    // loud here, once per option for the process.
    auditUnsupportedConfig(merged as NativeExternalConfig);
    return resolveNativeConfig(merged);
  }, [config, themes]);

  // The platform's own answer, which is what "system" means. A platform that reports nothing
  // is a light platform until it says otherwise.
  const scheme = useColorScheme() ?? "light";

  // Whether the controller has been configured. It is a ref rather than state because it is
  // read during the same render that sets it: the effect configures the controller and the
  // controller's own notification re-renders this provider, so the flag only decides which
  // source answers the *first* paint.
  const isConfigured = useRef(false);

  // One stable token per provider instance. It lets a changed `themes` prop replace this
  // provider's contribution, so a removed runtime theme leaves the picker instead of
  // accumulating as a name no palette answers.
  const owner = useRef<object>({});

  useEffect(() => {
    // The application's storage, installed before the controller reads it. Without an
    // adapter the controller keeps the choice in memory for the session.
    setThemeStorage(persistTheme);

    themeController.configure({
      defaultTheme: value.defaultTheme,
      themes: Object.keys(value.color),
      ownsDocument: true,
      owner: owner.current,
    });

    isConfigured.current = true;
  }, [value, persistTheme]);

  // A provider that unmounts releases its contribution, so a nested demo's runtime theme
  // does not remain selectable after the demo is gone.
  useEffect(
    () => () => {
      themeController.releaseThemes(owner.current);
    },
    [],
  );

  // The controller is the source of truth after configuration: `setTheme`, the operating
  // system's scheme and the stored selection all reach the screen through this snapshot.
  const resolvedTheme = useSyncExternalStore(
    themeController.subscribe,
    themeController.getResolvedTheme,
    () => "light" as const,
  );

  // The first render happens before the effect above, so the configuration's own theme
  // answers it rather than the controller's initial "light" — otherwise a device configured
  // for dark would paint one light frame before the effect corrected it.
  const initialTheme = useMemo(
    () => selectTheme(value.color, value.defaultTheme, scheme).name,
    [value.color, value.defaultTheme, scheme],
  );

  const activeTheme = isConfigured.current ? resolvedTheme : initialTheme;

  // The controller's available list only grows, so it can resolve a theme another provider
  // added while this configuration does not declare it. That theme is paintable inside the
  // provider that declared it, not here; falling back to this configuration's own theme is
  // better than a crash over a palette this provider cannot supply.
  const paintableTheme = value.color[activeTheme] ? activeTheme : initialTheme;

  const palette = useMemo(
    () =>
      paletteVariables(selectTheme(value.color, paintableTheme, scheme).palette),
    [value.color, paintableTheme, scheme],
  );

  // A new style object per palette, which is what tells the styling runtime to re-read the
  // variables rather than keep the previous theme's values.
  const painted = useMemo(() => vars(palette), [palette]);

  // After the first paint rather than during it: a warning is not a reason to render, and
  // the screen the reader is looking at is the evidence the message is about.
  useEffect(() => {
    warnWhenStylingIsDisconnected();
  }, []);

  return (
    <AsheeConfigContext.Provider value={value}>
      <View className="flex-1" style={painted}>
        {children}
      </View>
    </AsheeConfigContext.Provider>
  );
}

/**
 * Read the resolved native configuration.
 *
 * The shape is core's `Config` plus this platform's density, so a shared component reads
 * `config.defaultTheme`, `config.color` and `config.defaultVariant` here and on the web.
 *
 * @returns The configuration provided by {@link AsheeUIProvider}.
 * @throws When a component is rendered outside the provider, because a missing
 * provider is a setup mistake and defaulting silently would hide it.
 */
export function useAsheeConfig(): NativeConfig {
  const config = useContext(AsheeConfigContext);

  if (!config) {
    throw new Error(
      "useAsheeConfig must be used within an AsheeUIProvider - wrap your app root with <AsheeUIProvider>.",
    );
  }

  return config;
}

/**
 * The configuration hook under the shorter name both renderers publish.
 *
 * The web renderer has always published this alias; a shared component that writes `useAshee()`
 * meant the web alone until now.
 */
export const useAshee = useAsheeConfig;

// ─── Deprecated: the platform-suffixed spellings, removed in the next major ───
//
// The four names are announced together, once per process and only outside a production
// bundle: a consumer reading the message sees one decision ("this module moved four names")
// rather than four decisions to weigh separately.

deprecateMany("@asheeui/native/provider", [
  { from: "AsheeNativeProvider", to: "AsheeUIProvider", since: "2.8.0" },
  {
    from: "AsheeNativeProviderProps",
    to: "AsheeUIProviderProps",
    since: "2.8.0",
  },
  {
    from: "AsheeNativeConfigContext",
    to: "AsheeConfigContext",
    since: "2.8.0",
  },
  { from: "useAsheeNativeConfig", to: "useAsheeConfig", since: "2.8.0" },
]);

/** The provider under its platform-suffixed spelling. */
export const AsheeNativeProvider = deprecatedAlias(AsheeUIProvider);

/** The provider's props under their platform-suffixed spelling. */
export type AsheeNativeProviderProps = AsheeUIProviderProps;

/** The configuration context under its platform-suffixed spelling. */
export const AsheeNativeConfigContext = deprecatedAlias(AsheeConfigContext);

/** The configuration hook under its platform-suffixed spelling. */
export const useAsheeNativeConfig = deprecatedAlias(useAsheeConfig);
