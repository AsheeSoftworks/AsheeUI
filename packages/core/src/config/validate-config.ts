/**
 * Configuration validation for AsheeUI.
 *
 * Configuration is validated once per `AsheeUIProvider` mount. Invalid values
 * throw, so a mistake is never
 * silently replaced by a default; unknown keys warn in development and stay
 * silent in production, because a stray key is usually a typo rather than a
 * reason to take a running application down.
 *
 * Only enumerations the framework can state exhaustively are checked. Component
 * names are deliberately not checked here: component defaults register as their
 * modules are evaluated, so the registry is intentionally incomplete at mount
 * time and an unknown name cannot be distinguished from a not-yet-imported one.
 */

import {
  TYPOGRAPHY_ALIGN_VALUES,
  TYPOGRAPHY_LEADING_VALUES,
  TYPOGRAPHY_ROLE_TOKEN,
  TYPOGRAPHY_SIZE_VALUES,
  TYPOGRAPHY_TONE_VALUES,
  TYPOGRAPHY_TRACKING_VALUES,
  TYPOGRAPHY_WEIGHT_VALUES,
  type Variant,
} from "../shared";
import { defaultColorConfig } from "../theme";
import { RADIUS_STEP } from "../tokens";
import type { Config, ExternalConfig } from "./config";

/** How severe a configuration problem is. */
export type ConfigIssueSeverity = "error" | "warning";

/** A single configuration problem, located by its dotted path. */
export type ConfigIssue = {
  /** Path to the offending value, for example `components.button.variant`. */
  path: string;
  /** What is wrong, including accepted values where they are enumerable. */
  message: string;
  severity: ConfigIssueSeverity;
};

/**
 * Compile-time guard: a top-level `Config` key cannot be added or renamed
 * without this map failing to compile, which keeps the validator in sync.
 */
const CONFIG_KEY_COVERAGE: Record<keyof Config, true> = {
  color: true,
  defaultTheme: true,
  defaultVariant: true,
  defaultColor: true,
  defaultRadius: true,
  components: true,
};

/** Compile-time guard: a `Variant` cannot be added without an entry here. */
const VARIANT_COVERAGE: Record<Variant, true> = {
  solid: true,
  ghost: true,
  bordered: true,
  faded: true,
  underlined: true,
};

const TOP_LEVEL_KEYS = Object.keys(CONFIG_KEY_COVERAGE);
const VARIANTS = Object.keys(VARIANT_COVERAGE) as Variant[];
const RADII = Object.keys(RADIUS_STEP);
const TYPOGRAPHY_ROLES = Object.keys(TYPOGRAPHY_ROLE_TOKEN);

/** Keys accepted on a typography role override, beyond the role's own tokens. */
const ROLE_OVERRIDE_EXTRA_KEYS = ["tone", "align", "className"];

/**
 * Every token list a typography role override may draw from.
 *
 * The lists are the design language's own (`shared/typography.ts`), not one renderer's class
 * maps: a value is valid because the framework names it, not because some stylesheet compiled it.
 * Until C2 the validator read them off the web class maps, which is why it could only run in a
 * package that held a renderer's strings.
 */
const ROLE_TOKEN_VALUES: Record<string, readonly string[]> = {
  size: TYPOGRAPHY_SIZE_VALUES,
  weight: TYPOGRAPHY_WEIGHT_VALUES,
  leading: TYPOGRAPHY_LEADING_VALUES,
  tracking: TYPOGRAPHY_TRACKING_VALUES,
  tone: TYPOGRAPHY_TONE_VALUES,
  align: TYPOGRAPHY_ALIGN_VALUES,
};

/** Keys accepted on `components.typography`. */
const TYPOGRAPHY_CONFIG_KEYS = [
  "role",
  "tone",
  "align",
  "truncate",
  "roles",
  "className",
];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Render a value for an error message. */
function show(value: unknown): string {
  return typeof value === "string" ? `"${value}"` : String(value);
}

/** Render an accepted-value list for an error message. */
function list(values: readonly string[]): string {
  return values.map((value) => `"${value}"`).join(", ");
}

/** Record an invalid value for an enumerable option. */
function checkEnum(
  issues: ConfigIssue[],
  path: string,
  value: unknown,
  allowed: readonly string[],
): void {
  if (value === undefined) return;
  if (typeof value === "string" && allowed.includes(value)) return;

  issues.push({
    path,
    message: `${show(value)} is not a valid value (expected one of ${list(allowed)})`,
    severity: "error",
  });
}

/** Record an unrecognised key. */
function checkUnknownKey(
  issues: ConfigIssue[],
  path: string,
  key: string,
  allowed: readonly string[],
): void {
  if (allowed.includes(key)) return;

  issues.push({
    path: path === "" ? key : `${path}.${key}`,
    message: `unknown key (expected one of ${list(allowed)})`,
    severity: "warning",
  });
}

/**
 * Report a cycle in the `extends` chain among the declared themes.
 *
 * The resolver terminates on a cycle by starting each theme in it from the application's
 * default family, so a cycle is not a crash. It is still a mistake worth reporting: no theme
 * in the circle can name a base, and the palette that reaches the screen is not the one the
 * configuration describes. It is a warning rather than an error because the configuration
 * resolves, and rejecting it here would newly fail an application that works today.
 *
 * @param issues - The issue list to append to.
 * @param color - The theme map, already checked for shape and unknown keys.
 * @param builtInThemes - The theme names the library always provides.
 */
function checkExtendsCycles(
  issues: ConfigIssue[],
  color: Record<string, unknown>,
  builtInThemes: readonly string[],
): void {
  /** One custom theme's `extends` target, for the edges that stay among declared themes. */
  const edges = new Map<string, string>();

  for (const [themeName, theme] of Object.entries(color)) {
    if (builtInThemes.includes(themeName) || !isPlainObject(theme)) continue;

    const base = theme.extends;
    if (typeof base !== "string" || builtInThemes.includes(base)) continue;
    if (!Object.hasOwn(color, base)) continue;

    edges.set(themeName, base);
  }

  /** Themes already reported as part of a circle. */
  const reported = new Set<string>();

  for (const start of edges.keys()) {
    if (reported.has(start)) continue;

    /** The walk so far, and where each theme on it sits. */
    const walk: string[] = [];
    const positions = new Map<string, number>();
    let current: string | undefined = start;

    while (current !== undefined && !reported.has(current)) {
      const at = positions.get(current);

      if (at !== undefined) {
        const cycle = walk.slice(at);
        for (const name of cycle) reported.add(name);
        issues.push({
          path: `color.${cycle[0]}.extends`,
          message: `the extends chain is circular (${[...cycle, cycle[0]].join(" → ")}); each theme in it starts from the default family instead of the base it names`,
          severity: "warning",
        });
        break;
      }

      positions.set(current, walk.length);
      walk.push(current);
      current = edges.get(current);
    }
  }
}

/** Validate the theme map: theme entries, colour names, colour values, and `extends`. */
function checkColor(
  issues: ConfigIssue[],
  color: ExternalConfig["color"],
  colourNames: readonly string[],
  builtInThemes: readonly string[],
): void {
  if (color === undefined) return;

  if (!isPlainObject(color)) {
    issues.push({
      path: "color",
      message: `expected an object of themes, received ${show(color)}`,
      severity: "error",
    });
    return;
  }

  // `extends` may name any theme declared in this same object, not just the built-ins: a
  // custom theme extending another custom theme is resolved as a dependency graph, so the
  // declaration order does not matter and the name only has to be declared. A name that is
  // neither built in nor declared is a real mistake, because nothing can resolve it.
  const themeNames = [...builtInThemes];
  for (const themeName of Object.keys(color)) {
    if (!themeNames.includes(themeName)) themeNames.push(themeName);
  }

  for (const [themeName, theme] of Object.entries(color)) {
    const path = `color.${themeName}`;
    if (!isPlainObject(theme)) {
      issues.push({
        path,
        message: `expected a theme object, received ${show(theme)}`,
        severity: "error",
      });
      continue;
    }

    // A custom theme may state the theme it extends. The built-in themes
    // cannot: they are the palettes everything else inherits, so `extends` there has
    // no meaning and is reported rather than silently ignored.
    const isBuiltIn = themeName === "light" || themeName === "dark";
    const allowed = isBuiltIn ? colourNames : [...colourNames, "extends"];

    for (const [colourName, value] of Object.entries(theme)) {
      if (!allowed.includes(colourName)) {
        checkUnknownKey(issues, path, colourName, allowed);
        continue;
      }

      if (colourName === "extends") {
        if (typeof value !== "string" || !themeNames.includes(value)) {
          issues.push({
            path: `${path}.extends`,
            message: `expected a built-in or declared theme (one of ${list(themeNames)}), received ${show(value)}`,
            severity: "error",
          });
        }
        continue;
      }

      if (typeof value !== "string") {
        issues.push({
          path: `${path}.${colourName}`,
          message: `expected a colour value, received ${show(value)}`,
          severity: "error",
        });
      }
    }
  }

  checkExtendsCycles(issues, color, builtInThemes);
}

/** Validate the typography component configuration and its role overrides. */
function checkTypographyConfig(
  issues: ConfigIssue[],
  path: string,
  value: Record<string, unknown>,
): void {
  for (const key of Object.keys(value)) {
    checkUnknownKey(issues, path, key, TYPOGRAPHY_CONFIG_KEYS);
  }

  checkEnum(issues, `${path}.role`, value.role, TYPOGRAPHY_ROLES);
  checkEnum(issues, `${path}.tone`, value.tone, TYPOGRAPHY_TONE_VALUES);
  checkEnum(issues, `${path}.align`, value.align, TYPOGRAPHY_ALIGN_VALUES);

  if (value.truncate !== undefined && typeof value.truncate !== "boolean") {
    issues.push({
      path: `${path}.truncate`,
      message: `expected a boolean, received ${show(value.truncate)}`,
      severity: "error",
    });
  }

  if (value.roles === undefined) return;
  if (!isPlainObject(value.roles)) {
    issues.push({
      path: `${path}.roles`,
      message: `expected an object of role overrides, received ${show(value.roles)}`,
      severity: "error",
    });
    return;
  }

  for (const [role, tokens] of Object.entries(value.roles)) {
    const rolePath = `${path}.roles.${role}`;
    if (!TYPOGRAPHY_ROLES.includes(role)) {
      issues.push({
        path: rolePath,
        message: `unknown role (expected one of ${list(TYPOGRAPHY_ROLES)})`,
        severity: "warning",
      });
      continue;
    }
    if (!isPlainObject(tokens)) {
      issues.push({
        path: rolePath,
        message: `expected an object of tokens, received ${show(tokens)}`,
        severity: "error",
      });
      continue;
    }

    const acceptedKeys = [
      ...Object.keys(
        TYPOGRAPHY_ROLE_TOKEN[role as keyof typeof TYPOGRAPHY_ROLE_TOKEN],
      ),
      ...ROLE_OVERRIDE_EXTRA_KEYS,
    ];

    for (const [token, tokenValue] of Object.entries(tokens)) {
      checkUnknownKey(issues, rolePath, token, acceptedKeys);
      const values = ROLE_TOKEN_VALUES[token];
      if (values) {
        checkEnum(issues, `${rolePath}.${token}`, tokenValue, values);
      }
    }
  }
}

/** Validate every entry of `components`, including the typography entry. */
function checkComponents(
  issues: ConfigIssue[],
  components: ExternalConfig["components"],
): void {
  if (components === undefined) return;

  if (!isPlainObject(components)) {
    issues.push({
      path: "components",
      message: `expected an object of component overrides, received ${show(components)}`,
      severity: "error",
    });
    return;
  }

  // Per-component option enums are intentionally not checked: they differ per
  // component (the accordion's `variant: "separated"` is not a shared `Variant`)
  // and the registry that defines them is only complete after their modules are
  // evaluated, so a check here would reject valid configuration.
  for (const [name, value] of Object.entries(components)) {
    const path = `components.${name}`;
    if (!isPlainObject(value)) {
      issues.push({
        path,
        message: `expected an object of overrides, received ${show(value)}`,
        severity: "error",
      });
      continue;
    }

    // Component configs are a union of per-component shapes, so the runtime
    // check reads through a loose view rather than relying on a shared member.
    const overrides = value as Record<string, unknown>;

    if (
      overrides.className !== undefined &&
      typeof overrides.className !== "string"
    ) {
      issues.push({
        path: `${path}.className`,
        message: `expected a string, received ${show(overrides.className)}`,
        severity: "error",
      });
    }

    if (name === "typography") {
      checkTypographyConfig(issues, path, overrides);
    }
  }
}

/**
 * Validate an external configuration object.
 *
 * @param config - The configuration passed to `AsheeUIProvider`.
 * @returns Every problem found, with errors before warnings.
 */
export function validateConfig(config: ExternalConfig): ConfigIssue[] {
  const issues: ConfigIssue[] = [];
  const source = config as Record<string, unknown>;
  const builtInThemes = Object.keys(defaultColorConfig);
  const colourNames = Object.keys(defaultColorConfig.light);

  for (const key of Object.keys(source)) {
    checkUnknownKey(issues, "", key, TOP_LEVEL_KEYS);
  }

  checkEnum(issues, "defaultTheme", source.defaultTheme, [
    "system",
    ...builtInThemes,
    ...Object.keys(isPlainObject(source.color) ? source.color : {}),
  ]);
  checkEnum(issues, "defaultVariant", source.defaultVariant, VARIANTS);
  checkEnum(issues, "defaultColor", source.defaultColor, colourNames);
  checkEnum(issues, "defaultRadius", source.defaultRadius, RADII);

  checkColor(issues, config.color, colourNames, builtInThemes);
  checkComponents(issues, config.components);

  return issues;
}

/** Render one issue as `path: message`. */
function formatIssue(issue: ConfigIssue): string {
  return `${issue.path}: ${issue.message}`;
}

/**
 * Validate a configuration object and act on the result.
 *
 * Invalid values throw a single error listing every problem, so a misconfigured
 * application fails visibly at the provider instead of rendering silently with
 * defaults. Unknown keys are reported through `console.warn` in development and
 * ignored in production.
 *
 * @param config - The configuration passed to `AsheeUIProvider`.
 * @param options - Optional `warn` sink, used by tests to capture warnings.
 * @throws {Error} When the configuration contains invalid values.
 */
export function assertValidConfig(
  config: ExternalConfig,
  options: { warn?: (message: string) => void } = {},
): void {
  const issues = validateConfig(config);
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");

  if (warnings.length > 0 && process.env.NODE_ENV !== "production") {
    const warn = options.warn ?? ((message: string) => console.warn(message));
    for (const issue of warnings) {
      warn(`[asheeui] ${formatIssue(issue)}`);
    }
  }

  if (errors.length > 0) {
    const details = errors.map((issue) => `- ${formatIssue(issue)}`).join("\n");
    throw new Error(
      `[asheeui] Invalid configuration:\n${details}\nSee the configuration reference for the accepted values.`,
    );
  }
}
