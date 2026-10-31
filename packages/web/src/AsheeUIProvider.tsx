/**
 * Root provider component for AsheeUI.
 * This file provides the AsheeUIProvider component that wraps the application
 * and initializes the theming system, configuration context, and pre-paint
 * theme script. It resolves the user-provided configuration against defaults
 * and component-registered defaults, then makes the configuration available
 * throughout the component tree via React context.
 */
"use client";

import type {
  ExternalColorConfig,
  ExternalConfig,
} from "@asheeui/core";
import {
  assertValidConfig,
  mergeRuntimeThemes,
  resolveConfig,
} from "@asheeui/core";
import {
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { AsheeConfigContext } from "./libs/context";
import { useIsomorphicLayoutEffect } from "./libs/use-isomorphic-layout-effect";
import {
  AsheeThemeScript,
  ensureThemeVarsStyle,
  unregisterThemeBlock,
} from "./scripts/AsheeThemeScript";
import { themeController } from "./theme/controller";

/**
 * Props for the AsheeUIProvider component.
 */
export interface AsheeUIProviderProps {
  /**
   * Optional partial runtime config merged over the library defaults.
   *
   * Pass the object exported by an `asheeui.config.*` file (or any
   * inline {@link ExternalConfig}) to customize colors, radius, theme
   * defaults and per-component options at runtime.
   */
  config?: ExternalConfig | undefined;

  /**
   * Themes the application added while it was running.
   *
   * The definitions are the same shape as `config.color`, and they are merged over it before
   * resolution, so a runtime theme may extend a built-in, a configured theme or another runtime
   * theme. `light` and `dark` are reserved: the built-ins are retuned in `config.color`, never
   * by a runtime definition. Removing a name from this object removes it from the picker (and
   * from the stylesheet) and restores the configured definition of that name, if there is one.
   *
   * The application owns this state and its persistence: load the definitions before the
   * provider's first render when a stored selection may name one, otherwise the controller
   * correctly treats that selection as stale and drops it.
   */
  themes?: ExternalColorConfig | undefined;

  /**
   * The child components to render within the provider context.
   */
  children: ReactNode;
}

/**
 * No-op subscription for {@link useRendersServerOutput}: the value it reads only
 * differs between the server and the client, so nothing can change it later.
 */
const subscribeToHydration = () => () => {};

/**
 * Whether React is producing the server output, or hydrating that output,
 * rather than mounting into a client that has no server markup behind it.
 *
 * React uses the server snapshot for both of those, so this is the signal the
 * pre-paint theme script needs: a browser runs that script while it parses the
 * server markup, and it is inert anywhere else.
 *
 * @returns `true` while rendering on the server or hydrating, `false` after
 *   hydration completes and on a client-only mount.
 */
function useRendersServerOutput(): boolean {
  return useSyncExternalStore(
    subscribeToHydration,
    () => false,
    () => true,
  );
}

/**
 * Runtime configuration provider.
 *
 * Resolves {@link AsheeUIProviderProps.config} against the library
 * defaults and exposes the resulting config through React context
 * (consumed via `useAsheeConfig` / `useAshee`). Theme controller
 * setup and the pre-paint theme script are wired automatically.
 *
 * This component must wrap the root of your application to enable
 * all AsheeUI features. It sets up the theme system, config context,
 * and ensures the theme is applied before the initial paint.
 *
 * @param props - The component props.
 * @param props.config - Optional custom configuration.
 * @param props.children - The child elements.
 * @returns The provider component with theme and configuration context.
 *
 * @example
 * ```tsx
 * import { AsheeUIProvider } from "@asheeui/web";
 * import config from "./asheeui.config";
 *
 * export function Providers({ children }) {
 *   return <AsheeUIProvider config={config}>{children}</AsheeUIProvider>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Inline configuration
 * <AsheeUIProvider
 *   config={{
 *     defaultTheme: 'dark',
 *     defaultVariant: 'ghost',
 *     components: {
 *       // The key is the component's registration name, in lowercase: `button`, not `Button`.
 *       button: { radius: 'lg' }
 *     }
 *   }}
 * >
 *   <App />
 * </AsheeUIProvider>
 * ```
 *
 * @see useAsheeConfig - Hook for accessing the resolved configuration.
 * @see AsheeThemeScript - Component that applies theme class before paint.
 */
export function AsheeUIProvider({
  config = {},
  themes,
  children,
}: AsheeUIProviderProps) {
  const resolvedConfig = useMemo(() => {
    // Runtime definitions take the same pipeline as the configured ones: merged first, then
    // validated and resolved, so `extends`, inheritance and the palette are one code path.
    const merged = mergeRuntimeThemes(config, themes);

    // Validated once per configuration object (M3, `U-4`): invalid values throw
    // while rendering the provider, unknown keys warn in development only.
    assertValidConfig(merged);
    return resolveConfig(merged);
  }, [config, themes]);

  // A provider rendered inside another one does not own the document: the application's
  // provider does. Both decisions that depend on ownership — which provider's default theme
  // the controller keeps, and which provider emits the pre-paint script — read this.
  const hasAncestorProvider = useContext(AsheeConfigContext) !== null;

  // The controller's owner token. It is stable for this provider instance, so a `themes`
  // prop that loses a name replaces this provider's contribution instead of accumulating it.
  const owner = useRef<object>({});

  // The runtime names this provider's stylesheet contributed last time. A name that is no
  // longer contributed and is not a configured theme has its CSS block removed; a name that
  // still exists in the configuration is re-registered by `ensureThemeVarsStyle` instead.
  const previousThemes = useRef<ReadonlySet<string>>(new Set());

  useIsomorphicLayoutEffect(() => {
    themeController.configure({
      defaultTheme: resolvedConfig.defaultTheme ?? "system",
      themes: Object.keys(resolvedConfig.color),
      ownsDocument: !hasAncestorProvider,
      owner: owner.current,
    });

    // The pre-paint script injects the theme variables while the server HTML is
    // parsed. A client-only render never runs it, so they are applied here
    // instead, still before the first paint. This is a no-op once the script has
    // done it.
    ensureThemeVarsStyle(resolvedConfig);

    const current = new Set(Object.keys(themes ?? {}));
    for (const name of previousThemes.current) {
      if (!current.has(name) && !(name in resolvedConfig.color)) {
        unregisterThemeBlock(name);
      }
    }
    previousThemes.current = current;
  }, [resolvedConfig, hasAncestorProvider, themes]);

  // A provider that unmounts releases its contribution; a nested demo's runtime theme must
  // not remain selectable after the demo is gone.
  useEffect(
    () => () => {
      themeController.releaseThemes(owner.current);
    },
    [],
  );

  // The pre-paint script only pays off where the HTML it sits in is parsed by a
  // browser, which is the server output and the hydration of that output. A
  // client-only render cannot run a script React creates, so the element would
  // be dead markup and React warns about it.
  //
  // It is emitted by the provider that owns the document, and only by that one. Every
  // provider used to emit one carrying *its* theme list and *its* default theme, so a page
  // that mounts a provider of its own — a docs demo, a preview panel — had its script run
  // last and paint that provider's default until the controller's effect corrected it: the
  // same failure the controller's union rule prevents for the stylesheet. A nested
  // provider's configuration still reaches the controller and the stylesheet from its
  // layout effect, which is enough for the themes it adds.
  const renderPrePaintScript = useRendersServerOutput() && !hasAncestorProvider;

  return (
    <AsheeConfigContext.Provider value={resolvedConfig}>
      {renderPrePaintScript && <AsheeThemeScript config={resolvedConfig} />}
      {children}
    </AsheeConfigContext.Provider>
  );
}
