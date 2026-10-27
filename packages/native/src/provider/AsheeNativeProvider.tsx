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
 */

import {
  defaultColorConfig,
  paletteVariables,
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
import { warnWhenStylingIsDisconnected } from "./nativewind-doctor";

/**
 * The configuration context.
 * `null` means the application did not wrap its tree, which the hook reports as a
 * mistake rather than silently defaulting.
 */
export const AsheeNativeConfigContext = createContext<NativeConfig | null>(
  null,
);

/**
 * Props for the native provider.
 */
export interface AsheeNativeProviderProps {
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
export function AsheeNativeProvider({
  config,
  children,
}: AsheeNativeProviderProps) {
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
    <AsheeNativeConfigContext.Provider value={value}>
      <View className="flex-1" style={painted}>
        {children}
      </View>
    </AsheeNativeConfigContext.Provider>
  );
}

/**
 * The provider under the name the umbrella's web branch uses.
 *
 * An application that installs `asheeui` writes one root and one configuration for both
 * platforms, so the provider has to answer to one name on both. This is that name; the
 * native-specific spelling stays exported beside it, and they are the same component.
 */
export const AsheeUIProvider = AsheeNativeProvider;

/** The props of {@link AsheeUIProvider}, under the umbrella's name for them. */
export type AsheeUIProviderProps = AsheeNativeProviderProps;

/**
 * Read the resolved native configuration.
 *
 * @returns The configuration provided by {@link AsheeNativeProvider}.
 * @throws When a component is rendered outside the provider, because a missing
 * provider is a setup mistake and defaulting silently would hide it.
 */
export function useAsheeNativeConfig(): NativeConfig {
  const config = useContext(AsheeNativeConfigContext);

  if (!config) {
    throw new Error(
      "useAsheeNativeConfig must be used within an AsheeNativeProvider - wrap your app root with <AsheeNativeProvider>.",
    );
  }

  return config;
}

/**
 * The configuration hook under the name the umbrella's web branch uses.
 *
 * `@asheeui/web` publishes `useAsheeConfig`; a shared component that reads the configuration
 * imports this name and gets the renderer's own answer.
 */
export const useAsheeConfig = useAsheeNativeConfig;
