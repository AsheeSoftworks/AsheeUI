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
  RADIUS_CLASS,
  TYPOGRAPHY_ALIGN_CLASS,
  TYPOGRAPHY_LEADING_CLASS,
  TYPOGRAPHY_ROLE_TOKEN,
  TYPOGRAPHY_SIZE_CLASS,
  TYPOGRAPHY_TONE_CLASS,
  TYPOGRAPHY_TRACKING_CLASS,
  TYPOGRAPHY_WEIGHT_CLASS,
  type Variant,
} from "../shared";
import { defaultColorConfig } from "../theme";
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
const RADII = Object.keys(RADIUS_CLASS);
const TYPOGRAPHY_ROLES = Object.keys(TYPOGRAPHY_ROLE_TOKEN);

/** Keys accepted on a typography role override, beyond the role's own tokens. */
const ROLE_OVERRIDE_EXTRA_KEYS = ["tone", "align", "className"];

/** Every token map a typography role override may draw from. */
const ROLE_TOKEN_MAPS: Record<string, Record<string, string>> = {
  size: TYPOGRAPHY_SIZE_CLASS,
  weight: TYPOGRAPHY_WEIGHT_CLASS,
  leading: TYPOGRAPHY_LEADING_CLASS,
  tracking: TYPOGRAPHY_TRACKING_CLASS,
  tone: TYPOGRAPHY_TONE_CLASS,
  align: TYPOGRAPHY_ALIGN_CLASS,
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

/** Validate the theme map: theme entries, colour names, and colour values. */
function checkColor(
  issues: ConfigIssue[],
  color: ExternalConfig["color"],
  colourNames: readonly string[],
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

    for (const [colourName, value] of Object.entries(theme)) {
      if (!colourNames.includes(colourName)) {
        checkUnknownKey(issues, path, colourName, colourNames);
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
  checkEnum(
    issues,
    `${path}.tone`,
    value.tone,
    Object.keys(TYPOGRAPHY_TONE_CLASS),
  );
  checkEnum(
    issues,
    `${path}.align`,
    value.align,
    Object.keys(TYPOGRAPHY_ALIGN_CLASS),
  );

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
      const map = ROLE_TOKEN_MAPS[token];
      if (map) {
        checkEnum(issues, `${rolePath}.${token}`, tokenValue, Object.keys(map));
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

  checkColor(issues, config.color, colourNames);
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
