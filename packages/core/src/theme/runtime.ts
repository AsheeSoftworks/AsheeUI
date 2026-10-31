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

import { isPortableColor } from "../color/parse";
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

/** One invalid thing in a runtime theme map. */
interface ThemeValidationIssue {
  /** Where the issue is: `themes.ocean.primary`, `themes.ocean.extends`, … */
  path: string;
  /** A sentence describing the problem and the accepted form. */
  message: string;
}

/**
 * Find every invalid name, colour or `extends` target in a runtime theme map.
 *
 * This is the editor's validator: it reports all issues rather than throwing on the first one,
 * so a form can point at each field. {@link mergeRuntimeThemes} calls it and throws the first
 * issue, which is what a provider that receives an invalid prop should do.
 *
 * @param themes - The runtime definitions.
 * @param config - The configured map, so an `extends` may name a configured theme.
 * @returns Every issue, in declaration order; an empty array means the map is valid.
 */
export function validateRuntimeThemes(
  themes: ExternalColorConfig,
  config?: ExternalConfig,
): ThemeValidationIssue[] {
  if (
    themes === null ||
    typeof themes !== "object" ||
    Array.isArray(themes)
  ) {
    return [
      {
        path: "themes",
        message:
          "`themes` must be an object keyed by theme name, with each value a partial palette.",
      },
    ];
  }

  const issues: ThemeValidationIssue[] = [];
  const declared = new Set([
    "light",
    "dark",
    ...Object.keys(config?.color ?? {}),
    ...Object.keys(themes),
  ]);

  for (const [name, variant] of Object.entries(themes)) {
    const path = `themes.${name}`;

    if (!RUNTIME_THEME_NAME.test(name)) {
      issues.push({
        path,
        message: `runtime theme ${JSON.stringify(name)} is not a valid name: use a lowercase slug that starts with a letter and contains letters, digits and hyphens (for example "ocean").`,
      });
      continue;
    }

    if (name === "system") {
      issues.push({
        path,
        message:
          "`system` is the selection that follows the platform, not a theme name; choose another runtime name.",
      });
      continue;
    }

    if (name === "light" || name === "dark") {
      issues.push({
        path,
        message: `"${name}" is a built-in theme. Runtime themes are additions; retune the built-ins in \`config.color\`, where they are part of the application's configuration.`,
      });
      continue;
    }

    if (
      variant === null ||
      typeof variant !== "object" ||
      Array.isArray(variant)
    ) {
      issues.push({
        path,
        message: `runtime theme "${name}" must be an object of palette roles.`,
      });
      continue;
    }

    if (variant.extends !== undefined) {
      if (variant.extends === name) {
        issues.push({
          path: `${path}.extends`,
          message: `runtime theme "${name}" cannot extend itself.`,
        });
      } else if (!declared.has(variant.extends)) {
        issues.push({
          path: `${path}.extends`,
          message: `runtime theme "${name}" extends "${variant.extends}", which this configuration does not declare. Declared: ${[...declared].join(", ")}.`,
        });
      }
    }

    for (const [role, value] of Object.entries(variant)) {
      if (role === "extends") continue;
      if (!isPortableColor(value)) {
        issues.push({
          path: `${path}.${role}`,
          message: `runtime theme "${name}" states "${role}" as ${JSON.stringify(value)}, which a device cannot apply. A runtime theme accepts a hex colour (#rgb, #rrggbb, #rrggbbaa) or rgb()/rgba(); the alpha of rgba() is ignored because the framework's classes carry their own.`,
        });
      }
    }
  }

  return issues;
}

/**
 * Throw the first issue a runtime theme map has.
 *
 * @param themes - The runtime definitions.
 * @param config - The configured map, so an `extends` may name a configured theme.
 */
function assertRuntimeThemes(
  themes: ExternalColorConfig,
  config: ExternalConfig | undefined,
): void {
  const [issue] = validateRuntimeThemes(themes, config);
  if (issue) throw new Error(`[AsheeUI] ${issue.message}`);
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
