/**
 * A controlled editor for one runtime theme.
 *
 * The application owns `themes` and its persistence; this component edits a draft and emits a new
 * map. It deliberately does not call `setTheme` except through `onApply`, and it never reaches the
 * provider or storage. That keeps the editor usable in a settings drawer, a docs demo or a test
 * without changing the running application until the reader asks.
 */

import {
  type ColorVariant,
  type ExternalColorConfig,
  type ExternalConfig,
  PALETTE_ROLES,
  type ThemeName,
  validateRuntimeThemes,
} from "@asheeui/core";
import {
  Button,
  Card,
  ColorSwatch,
  Dropmenu,
  Grid,
  HStack,
  Input,
  Typography,
  VStack,
  useAsheeConfig,
} from "asheeui";
import { useEffect, useState } from "react";
import { ContrastBadge } from "./ContrastBadge";
import { ColorField } from "./ColorField";
import { ThemeCard } from "./ThemeCard";
import { isReservedThemeName, slugify } from "../lib/slug";

export interface ThemeEditorProps {
  /** The runtime themes the application currently has. */
  themes: ExternalColorConfig;

  /** Emit the next map; the application persists it. */
  onChange(next: ExternalColorConfig): void;

  /** The runtime theme to edit; omit to create a new one. */
  initialTheme?: ThemeName;

  /** The active theme, for the preview card. */
  activeTheme?: ThemeName;

  /** Save and apply the edited theme. */
  onApply?(slug: ThemeName): void;

  /** Close the editor. */
  onCancel?(): void;
}

/** The title a new draft starts with. */
const DEFAULT_NAME = "My theme";

/** Display a slug as a human-readable name. */
function titleCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Edit one runtime theme, or create a new one.
 *
 * @param props - The current map, the emit callback and optional apply/cancel hooks.
 */
export function ThemeEditor({
  themes,
  onChange,
  initialTheme,
  activeTheme,
  onApply,
  onCancel,
}: ThemeEditorProps) {
  const config = useAsheeConfig();
  const existing = initialTheme ? themes[initialTheme] : undefined;

  const [name, setName] = useState(
    initialTheme ? titleCase(initialTheme) : DEFAULT_NAME,
  );
  const [base, setBase] = useState<ThemeName>(
    existing?.extends ?? "dark",
  );
  const [colors, setColors] = useState<Partial<ColorVariant>>(
    existing ? extractColors(existing) : {},
  );
  const [submitted, setSubmitted] = useState(false);

  // Opening a different theme resets the draft; typing does not touch `themes`.
  useEffect(() => {
    const initial = initialTheme ? themes[initialTheme] : undefined;
    setName(initialTheme ? titleCase(initialTheme) : DEFAULT_NAME);
    setBase(initial?.extends ?? "dark");
    setColors(initial ? extractColors(initial) : {});
    setSubmitted(false);
  }, [initialTheme, themes]);

  const baseNames = Object.keys(config.color);
  const basePalette = config.color[base] ?? config.color.light;
  const slug = slugify(name);
  const definition = { extends: base, ...colors };
  const issues = validateRuntimeThemes(
    slug ? { [slug]: definition } : {},
    { color: config.color } as ExternalConfig,
  );

  if (isReservedThemeName(slug)) {
    issues.unshift({
      path: "themes.name",
      message: `"${slug}" is reserved. Choose another name.`,
    });
  }

  if (slug && themes[slug] && slug !== initialTheme) {
    issues.unshift({
      path: "themes.name",
      message: `A runtime theme named "${slug}" already exists.`,
    });
  }

  if (slug && config.color[slug] && slug !== initialTheme) {
    issues.unshift({
      path: "themes.name",
      message: `"${slug}" is a configured theme. Choose another name rather than overriding it at runtime.`,
    });
  }

  if (!slug) {
    issues.unshift({
      path: "themes.name",
      message: "A theme needs a name that contains at least one letter or digit.",
    });
  }

  const resolved: Partial<ColorVariant> = { ...basePalette, ...colors };

  const save = (apply: boolean) => {
    setSubmitted(true);
    if (issues.length > 0) return;

    const next: ExternalColorConfig = { ...themes };
    if (initialTheme && initialTheme !== slug) delete next[initialTheme];
    next[slug] = definition;
    onChange(next);
    if (apply) onApply?.(slug);
  };

  const remove = () => {
    if (!initialTheme || !themes[initialTheme]) return;
    const next = { ...themes };
    delete next[initialTheme];
    onChange(next);
  };

  return (
    <VStack gap="lg">
      <VStack gap="md">
        <Input
          label="Name"
          description={
            slug
              ? `Stored as "${slug}". Lowercase letters, digits and hyphens.`
              : "A name is needed before the theme can be saved."
          }
          value={name}
          status={submitted && !slug ? "error" : "default"}
          onChange={(event) => setName(event.target.value)}
        />

        <Dropmenu
          label="Base theme"
          options={baseNames.map((entry) => ({ label: entry, value: entry }))}
          value={base}
          onValueChange={(value) => setBase(String(value) as ThemeName)}
        />
      </VStack>

      <Grid columns={1} columnsMd={2} gap="md">
        {PALETTE_ROLES.map((role) => (
          <ColorField
            key={role}
            label={role.charAt(0).toUpperCase() + role.slice(1)}
            value={colors[role] ?? basePalette[role]}
            onChange={(next) =>
              setColors((current) => ({ ...current, [role]: next }))
            }
          />
        ))}
      </Grid>

      <Card variant="bordered" size="sm" title="Contrast">
        <VStack gap="sm">
          <ContrastBadge
            label="Body text"
            foreground={resolved.foreground ?? basePalette.foreground}
            background={resolved.background ?? basePalette.background}
          />
          <ContrastBadge
            label="Primary action"
            foreground="#ffffff"
            background={resolved.primary ?? basePalette.primary}
          />
          <HStack gap="xs" wrap>
            {(resolved.background || basePalette.background) && (
              <ColorSwatch
                color={resolved.background ?? basePalette.background}
                size="sm"
                label="Background"
              />
            )}
            {resolved.primary && (
              <ColorSwatch
                color={resolved.primary}
                size="sm"
                label="Primary"
              />
            )}
            {resolved.foreground && (
              <ColorSwatch
                color={resolved.foreground}
                size="sm"
                label="Foreground"
              />
            )}
          </HStack>
        </VStack>
      </Card>

      <ThemeCard
        name={name || "New theme"}
        slug={slug || undefined}
        base={base}
        colors={resolved}
        active={Boolean(activeTheme && activeTheme === slug)}
      />

      {submitted && issues.length > 0 && (
        <VStack gap="xs">
          <Typography role="label" tone="danger">
            Fix these before saving:
          </Typography>
          {issues.map((issue) => (
            <Typography key={`${issue.path}-${issue.message}`} role="caption" tone="danger">
              {issue.message}
            </Typography>
          ))}
        </VStack>
      )}

      <HStack gap="sm" wrap>
        <Button variant="solid" onPress={() => save(false)}>
          Save theme
        </Button>
        <Button variant="bordered" onPress={() => save(true)}>
          Save & apply
        </Button>
        {initialTheme && themes[initialTheme] && (
          <Button variant="ghost" onPress={remove}>
            Delete
          </Button>
        )}
        {onCancel && (
          <Button variant="ghost" onPress={onCancel}>
            Cancel
          </Button>
        )}
      </HStack>
    </VStack>
  );
}

/** A stored runtime definition without its `extends`, for the draft's overrides. */
function extractColors(
  definition: ExternalColorConfig[string],
): Partial<ColorVariant> {
  const { extends: _extends, ...colors } = definition;
  return colors;
}
