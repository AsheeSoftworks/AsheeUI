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
  defaultColorConfig,
  deprecatedAlias,
  deprecateMany,
  resolveColorConfig,
  selectTheme,
} from "@asheeui/core";
import { vars } from "nativewind";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useColorScheme, View } from "react-native";
import {
  type NativeConfig,
  type NativeExternalConfig,
  resolveNativeConfig,
} from "../config/resolve-config";
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
export function AsheeUIProvider({ config, children }: AsheeUIProviderProps) {
  const value = useMemo(() => resolveNativeConfig(config), [config]);

  // The platform's own answer, which is what "system" means. A platform that reports nothing
  // is a light platform until it says otherwise.
  const scheme = useColorScheme() ?? "light";

  const palette = useMemo(() => {
    const palettes = resolveColorConfig(defaultColorConfig, config?.color);
    const { palette: active } = selectTheme(
      palettes,
      config?.defaultTheme,
      scheme,
    );

    return paletteVariables(active);
  }, [config?.color, config?.defaultTheme, scheme]);

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
