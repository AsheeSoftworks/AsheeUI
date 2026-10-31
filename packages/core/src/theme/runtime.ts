/**
 * Runtime themes: the application's own palettes, merged over the configured ones.
 *
 * The configuration is static, but a product may let a reader create a palette while the
 * application runs. The provider accepts those definitions as one more `color` map; this module
 * is the one place the merge is stated, so both renderers apply the same precedence:
 *
 * - a runtime theme overrides a configured theme with the same name;
 * - a runtime theme may extend a built-in, a configured theme or another runtime theme;
 * - removing a runtime theme restores the configured theme it overrode, if there is one.
 *
 * The merge happens **before** `resolveConfig`, so inheritance, validation and the resolved
 * palettes are the same pipeline a theme written in the configuration goes through. The function
 * keeps the configuration's own type: a native configuration's platform-only fields survive a
 * merge.
 */

import type { ExternalConfig } from "../config/config";
import type { ExternalColorConfig } from "./color";

/**
 * A runtime theme name that is safe as a CSS class and as a storage value.
 *
 * Configured themes keep their historical freedom; a name the application creates while it runs
 * is stricter because it becomes `.theme-<name>` on the document and `classList.add` cannot take
 * whitespace.
 */
const RUNTIME_THEME_NAME = /^[a-z][a-z0-9-]{0,63}$/;

/** The colours a device can apply, which are also the portable subset. */
const HEX_COLOR = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_COLOR = /^rgba?\(\s*[0-9.%\s,/]+\)$/i;

/**
 * Whether a value is a colour both renderers can apply.
 *
 * A browser accepts names, `oklch()` and `var()`; the platform reads channels and accepts only
 * the hex and `rgb()`/`rgba()` forms. A runtime palette is portable, so it states the intersection
 * rather than discovering the difference when a device paints it.
 */
function isPortableColor(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (HEX_COLOR.test(value.trim()) || RGB_COLOR.test(value.trim()))
  );
}

/**
 * Validate the names and colours of a runtime theme map before it is merged.
 *
 * @param themes - The runtime definitions.
 * @param config - The configured map, so an `extends` may name a configured theme.
 * @throws When a name is not a slug, a colour is outside the portable set, or `extends` names
 *   nothing declared.
 */
function assertRuntimeThemes(
  themes: ExternalColorConfig,
  config: ExternalConfig | undefined,
): void {
  if (
    themes === null ||
    typeof themes !== "object" ||
    Array.isArray(themes)
  ) {
    throw new Error(
      "[AsheeUI] `themes` must be an object keyed by theme name, with each value a partial palette.",
    );
  }

  const declared = new Set([
    "light",
    "dark",
    ...Object.keys(config?.color ?? {}),
    ...Object.keys(themes),
  ]);

  for (const [name, variant] of Object.entries(themes)) {
    if (!RUNTIME_THEME_NAME.test(name)) {
      throw new Error(
        `[AsheeUI] runtime theme ${JSON.stringify(name)} is not a valid name: use a lowercase slug that starts with a letter and contains letters, digits and hyphens (for example "ocean").`,
      );
    }

    if (name === "system") {
      throw new Error(
        '`system` is the selection that follows the platform, not a theme name; choose another runtime name.',
      );
    }

    if (name === "light" || name === "dark") {
      throw new Error(
        `[AsheeUI] "${name}" is a built-in theme. Runtime themes are additions; retune the built-ins in \`config.color\`, where they are part of the application's configuration.`,
      );
    }

    if (variant === null || typeof variant !== "object") {
      throw new Error(
        `[AsheeUI] runtime theme "${name}" must be an object of palette roles.`,
      );
    }

    if (variant.extends !== undefined) {
      if (variant.extends === name) {
        throw new Error(
          `[AsheeUI] runtime theme "${name}" cannot extend itself.`,
        );
      }
      if (!declared.has(variant.extends)) {
        throw new Error(
          `[AsheeUI] runtime theme "${name}" extends "${variant.extends}", which this configuration does not declare. Declared: ${[...declared].join(", ")}.`,
        );
      }
    }

    for (const [role, value] of Object.entries(variant)) {
      if (role === "extends") continue;
      if (!isPortableColor(value)) {
        throw new Error(
          `[AsheeUI] runtime theme "${name}" states "${role}" as ${JSON.stringify(value)}, which a device cannot apply. A runtime theme accepts a hex colour (#rgb, #rrggbb, #rrggbbaa) or rgb()/rgba(); the alpha of rgba() is ignored because the framework's classes carry their own.`,
        );
      }
    }
  }
}

/**
 * Merge runtime theme definitions over a configuration's `color` map.
 *
 * @param config - The application's configuration, if it has one.
 * @param themes - The runtime definitions, if any.
 * @returns A configuration whose `color` map includes both, runtime last.
 * @throws When a runtime name, colour or `extends` target is not valid.
 *
 * @example
 * ```ts
 * const config = mergeRuntimeThemes(
 *   { defaultTheme: "dark" },
 *   { ocean: { extends: "dark", primary: "#0ea5e9" } },
 * );
 * // config.color.ocean is the runtime definition
 * ```
 */
export function mergeRuntimeThemes<TConfig extends ExternalConfig>(
  config: TConfig | undefined,
  themes: ExternalColorConfig | undefined,
): TConfig {
  if (themes === undefined) return (config ?? {}) as TConfig;

  assertRuntimeThemes(themes, config);

  return {
    ...(config ?? {}),
    color: {
      ...config?.color,
      ...themes,
    },
  } as TConfig;
}
