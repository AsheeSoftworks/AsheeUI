/**
 * The theme state machine, ported out of the web renderer so both renderers run one.
 *
 * The theme system has an engine and a state. The engine — the palette model, the roles and
 * the resolution of a theme name — is core's already; the state — which theme the reader
 * chose, whether it is stored, what "system" resolves to and how a picker cycles — lived in
 * `@asheeui/web` and existed nowhere on a device. That is not a rendering difference: a
 * selection, a stored preference and an operating-system scheme are the same three facts on
 * both platforms, and a second implementation on a device would drift the first time one of
 * the six rules below changed on the other.
 *
 * What is a platform difference is where the facts come from, so the controller takes a
 * **host**: the platform's colour scheme, an optional synchronous storage, and a paint
 * callback. Core touches no `window`, no `document` and no `Appearance`; the web host paints
 * a class on the document, the native host lets the provider paint the palette with
 * `vars()`, and neither is visible here.
 *
 * The six rules are carried over verbatim, because each was learned the hard way:
 *
 * 1. **The available-theme list only grows.** One controller serves the whole application,
 *    and a provider may be mounted *inside* another (a docs demo, a preview panel). Its list
 *    is usually just the built-ins, so letting it replace the list made the application's
 *    custom theme invalid: selecting it silently fell back to the default, which looks like
 *    "my theme does not work".
 * 2. **The default theme belongs to the provider that owns the document.** A nested
 *    provider's `defaultTheme` describes its own subtree for the pre-paint script, not what a
 *    first visit shows. Writing it here made every reader with no stored choice land on the
 *    demo's theme.
 * 3. **A stale stored value self-heals.** A name the configuration no longer declares is a
 *    leftover; it is dropped rather than applied, without a warning on every load.
 * 4. **Only `setTheme` persists.** `configure` reads and may remove, never writes: mounting a
 *    provider is not a choice the reader made.
 * 5. **`toggleTheme` cycles names, never `"system"`.** A picker with no themes does nothing
 *    rather than selecting `undefined`.
 * 6. **`"system"` resolves through the host and re-resolves when the host reports a change**,
 *    and only while `"system"` is the selection: a reader who chose a name keeps it when the
 *    operating system switches.
 */

import type { ThemeName } from "./color";
import type { ColorScheme } from "./palette";

/**
 * What a consumer selects: a theme name, or `"system"` to follow the platform.
 */
export type ThemeSelection = ThemeName | "system";

/**
 * The key an explicit selection is stored under, on every platform.
 *
 * Stated once here so the web renderer's `localStorage` entry, a device's injected storage
 * and a migration written by an application all name the same key.
 */
export const THEME_STORAGE_KEY = "ashee-theme";

/**
 * Synchronous storage, as a platform supplies it.
 *
 * It is storage rather than a promise because the selection has to be readable while a
 * render is decided: a theme that arrives after a frame is a flash. A platform whose storage
 * is asynchronous (React Native's common case) supplies an in-memory adapter and hydrates it
 * once at startup; the controller's contract stays synchronous either way.
 */
export interface ThemeStorage {
  /** The stored selection, or `null` when nothing is stored. */
  get(): string | null;

  /** Store a selection. Called only by `setTheme`. */
  set(value: string): void;

  /** Remove a stored selection. Called only by the stale-value rule. */
  remove(): void;
}

/**
 * What a platform must provide for the controller to work.
 */
export interface ThemeHost {
  /** The platform's own scheme, which `"system"` resolves to. */
  systemScheme(): ColorScheme;

  /**
   * Subscribe to the platform's scheme changes, returning an unsubscribe.
   *
   * Optional, because a host that cannot observe the scheme simply never re-resolves.
   */
  onSystemChange?(listener: () => void): () => void;

  /** Read and write the stored selection. Absent means session-only. */
  storage?: ThemeStorage;

  /**
   * Paint a resolved theme name.
   *
   * The controller decides *which* theme; how a platform shows it is the platform's
   * business. The web host applies the theme class and the browser's `color-scheme`; a
   * native host may leave this out and let its provider repaint from the subscription.
   */
  paint?(resolved: ThemeName): void;
}

/**
 * The configuration a provider hands the controller.
 */
export interface ThemeConfigInput {
  /** The default theme, which only the document's owner may replace. */
  defaultTheme: ThemeSelection;

  /** The theme names the provider knows about. The list only grows. */
  themes: readonly ThemeName[];

  /**
   * Whether this caller is the outermost provider — the one that owns the document.
   *
   * @default true
   */
  ownsDocument?: boolean | undefined;

  /**
   * The provider instance that contributes these names, when it can change them.
   *
   * A provider that only ever adds themes may omit this: repeated `configure` calls are a
   * union, which is the nested-provider rule. A provider whose list can *shrink* — the root
   * provider carrying a `themes` prop — passes a stable object so its next configuration
   * replaces its own contribution rather than accumulating names the application removed.
   */
  owner?: object | undefined;
}

/**
 * The theme controller both renderers use.
 *
 * Every method is a property rather than a prototype method so it can be passed to
 * `useSyncExternalStore` unbound, which is how the hooks subscribe.
 */
export interface ThemeController {
  /** Seed the controller with a provider's configuration and paint the result. */
  configure(input: ThemeConfigInput): void;

  /**
   * Seed the default theme only.
   *
   * @deprecated Use {@link ThemeController.configure} instead: it also validates the stored
   * selection against the available themes.
   */
  setDefault(theme: ThemeSelection): void;

  /** The reader's selection, which may be `"system"`. */
  getSelection(): ThemeSelection;

  /** The theme name after resolving `"system"` through the host. */
  getResolvedTheme(): ThemeName;

  /** The available theme names, in the order they were first configured. */
  getAvailableThemes(): readonly ThemeName[];

  /** Choose a theme. This is the only method that writes to storage. */
  setTheme(selection: ThemeSelection): void;

  /**
   * Choose the next theme in the available list, skipping `"system"`.
   *
   * Does nothing when no themes are configured.
   */
  toggleTheme(): void;

  /** Observe theme changes; returns the unsubscribe. */
  subscribe(listener: () => void): () => void;

  /**
   * Remove one provider's contributed themes.
   *
   * The provider that contributed the names calls this when it unmounts. A name another
   * contribution still states, or a built-in, stays available.
   *
   * @param owner - The object the provider passed to {@link ThemeController.configure}.
   */
  releaseThemes(owner: object): void;
}

/** One theme-change listener. */
type Listener = () => void;

/**
 * The theme class the web host applies, stated here so the adapter and the pre-paint script
 * cannot disagree about the prefix. It is a class *name*, not a class string: the class is
 * `theme-<resolved>`.
 */
export const THEME_CLASS_PREFIX = "theme-";

/**
 * Create a controller for one platform.
 *
 * @param host - The platform's scheme, storage and paint callback.
 * @returns The controller, independent of any other instance.
 *
 * @example
 * ```ts
 * const controller = createThemeController({
 *   systemScheme: () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
 *   storage: { get, set, remove },
 *   paint: (theme) => document.documentElement.className = `theme-${theme}`,
 * });
 * ```
 */
export function createThemeController(host: ThemeHost): ThemeController {
  let selection: ThemeSelection = "light";
  let resolved: ThemeName = "light";
  let defaultTheme: ThemeSelection = "light";
  let availableThemes: readonly ThemeName[] = [];

  /**
   * The names each ownable provider contributes.
   *
   * Rule 1 (a nested provider only adds) is preserved for callers that pass no owner, and is
   * still how a nested provider behaves. The owner is what lets the root provider's `themes`
   * prop shrink: its next contribution replaces the previous one, while the union of every
   * contribution is what the picker and the controller see.
   */
  const contributions = new Map<object, readonly ThemeName[]>();
  let legacyThemes: readonly ThemeName[] = [];

  const listeners = new Set<Listener>();

  /** Recompute the union of every contribution, preserving first-seen order. */
  const rebuildAvailable = (): void => {
    const next: ThemeName[] = [];

    for (const names of contributions.values()) {
      for (const name of names) {
        if (!next.includes(name)) next.push(name);
      }
    }

    for (const name of legacyThemes) {
      if (!next.includes(name)) next.push(name);
    }

    availableThemes = next;
  };

  const isValid = (candidate: ThemeSelection): boolean => {
    if (candidate === "system") return true;
    if (availableThemes.length > 0)
      return availableThemes.includes(candidate);
    return true;
  };

  const sanitize = (candidate: ThemeSelection): ThemeSelection => {
    if (isValid(candidate)) return candidate;
    if (isValid(defaultTheme)) return defaultTheme;
    return availableThemes[0] ?? defaultTheme;
  };

  /** Adopt the stored selection, or the default when there is none. */
  const settleSelection = (): void => {
    const stored = host.storage?.get() ?? null;
    const hasValidStored =
      stored !== null && isValid(stored as ThemeSelection);

    if (!hasValidStored && stored !== null) {
      // Rule 3: a value that names no available theme is a leftover. Dropping it is the
      // self-healing path; warning on every load would train the reader to ignore it.
      host.storage?.remove();
    }

    // Rule 4: seeded, never written. A nested provider has just declined to replace the
    // default, so the selection is the application's, whichever provider mounted first.
    selection = hasValidStored
      ? (stored as ThemeSelection)
      : sanitize(defaultTheme);
  };

  const resolve = (candidate: ThemeSelection): ThemeName =>
    candidate === "system" ? host.systemScheme() : candidate;

  const notify = (): void => {
    for (const listener of listeners) listener();
  };

  const applySelection = (): void => {
    const chosen = sanitize(selection);
    let next = resolve(chosen);

    // Guard: never apply a theme name no palette answers. A platform scheme the
    // configuration does not declare, or a provider that knows fewer themes, lands on the
    // default theme rather than on a class with no variables behind it.
    if (availableThemes.length > 0 && !availableThemes.includes(next)) {
      const fallback = availableThemes.includes(defaultTheme)
        ? defaultTheme
        : availableThemes[0];
      next = fallback ?? next;
    }

    resolved = next;
    host.paint?.(next);
  };

  const handleSystemChange = (): void => {
    // A reader who chose a name keeps it when the platform's scheme changes; only
    // "system" follows, which is what the choice means.
    if (selection !== "system") return;
    applySelection();
    notify();
  };

  host.onSystemChange?.(handleSystemChange);

  const configure = (input: ThemeConfigInput): void => {
    const {
      defaultTheme: nextDefault,
      themes,
      ownsDocument = true,
      owner,
    } = input;

    // Rule 1: a nested provider may add a theme, never remove one. The root provider's
    // `themes` prop is the exception that needs removal, so its contribution replaces the
    // previous one; every contribution is still unioned before the list is published.
    if (owner) {
      contributions.set(owner, themes);
    } else {
      legacyThemes = [...new Set([...legacyThemes, ...themes])];
    }
    rebuildAvailable();

    // Rule 2: only the document's owner may state what a first visit shows. A default theme
    // the owner removed is not a default any more; the first remaining theme is.
    if (ownsDocument) {
      defaultTheme = isValid(nextDefault)
        ? nextDefault
        : (availableThemes[0] ?? nextDefault);
    }

    settleSelection();
    applySelection();
    notify();
  };

  const releaseThemes = (owner: object): void => {
    if (!contributions.delete(owner)) return;

    rebuildAvailable();

    if (!isValid(defaultTheme)) {
      defaultTheme = availableThemes[0] ?? defaultTheme;
    }

    // Deliberately do not touch storage: React StrictMode runs an effect's cleanup and then the
    // effect again, and a stored selection may name a theme this contribution just withdrew. The
    // next `configure` reads it back; a real unmount leaves it for the next mount to validate.
    if (!isValid(selection)) {
      selection = sanitize(defaultTheme);
    }

    applySelection();
    notify();
  };

  const setDefault = (theme: ThemeSelection): void => {
    configure({ defaultTheme: theme, themes: availableThemes });
  };

  const setTheme = (next: ThemeSelection): void => {
    const sanitized = sanitize(next);
    selection = sanitized;
    host.storage?.set(sanitized);
    applySelection();
    notify();
  };

  const toggleTheme = (): void => {
    const uniqueThemes = Array.from(new Set(availableThemes)).filter(
      (theme) => theme !== "system",
    );

    const currentIndex = uniqueThemes.indexOf(selection);
    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + 1) % uniqueThemes.length;
    const next = uniqueThemes[nextIndex];

    // Rule 5: no themes means there is no next theme. Selecting `undefined` would
    // sanitize to `undefined` and leave the controller with no selection at all.
    if (next === undefined) return;
    setTheme(next);
  };

  const subscribe = (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    configure,
    setDefault,
    getSelection: () => selection,
    getResolvedTheme: () => resolved,
    getAvailableThemes: () => availableThemes,
    setTheme,
    toggleTheme,
    subscribe,
    releaseThemes,
  };
}
