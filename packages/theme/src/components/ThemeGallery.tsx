/**
 * The saved runtime themes as a gallery.
 *
 * A thin composition over `ThemeCard`: the application passes its map and the actions it already
 * owns, and the gallery renders the palettes it can resolve. The child never reads storage or the
 * controller; the caller decides what a selection means.
 */

import type { ExternalColorConfig, ThemeName } from "@asheeui/core";
import { Button, Grid, Typography, VStack, useAsheeConfig } from "asheeui";
import { ThemeCard } from "./ThemeCard";

export interface ThemeGalleryProps {
  /** The runtime themes the application has. */
  themes: ExternalColorConfig;

  /** The active selection. */
  activeTheme?: ThemeName;

  /** Select a theme. */
  onSelect?(slug: ThemeName): void;

  /** Edit a theme. */
  onEdit?(slug: ThemeName): void;

  /** Delete a theme. */
  onDelete?(slug: ThemeName): void;

  /** Open the editor for a new theme. */
  onCreate?(): void;
}

/**
 * A grid of saved themes with a create action.
 *
 * @param props - The map and the actions the application owns.
 */
export function ThemeGallery({
  themes,
  activeTheme,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
}: ThemeGalleryProps) {
  const config = useAsheeConfig();
  const entries = Object.entries(themes);

  if (entries.length === 0) {
    return (
      <VStack gap="md" align="start">
        <Typography role="body-sm" tone="muted">
          No custom themes yet. Create one from a base theme and eight colours.
        </Typography>
        {onCreate && (
          <Button variant="solid" onPress={onCreate}>
            Create a theme
          </Button>
        )}
      </VStack>
    );
  }

  return (
    <VStack gap="md">
      <Grid columns={1} columnsMd={2} gap="md">
        {entries.map(([slug, definition]) => {
          const base = definition.extends ?? "light";
          const palette = {
            ...config.color[base],
            ...definition,
          };

          return (
            <ThemeCard
              key={slug}
              name={slug}
              slug={slug}
              base={base}
              colors={palette}
              active={activeTheme === slug}
              onSelect={onSelect ? () => onSelect(slug) : undefined}
              onEdit={onEdit ? () => onEdit(slug) : undefined}
              onDelete={onDelete ? () => onDelete(slug) : undefined}
            />
          );
        })}
      </Grid>

      {onCreate && (
        <Button variant="bordered" onPress={onCreate}>
          Create another theme
        </Button>
      )}
    </VStack>
  );
}
