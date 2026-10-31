/**
 * One saved theme as a card.
 *
 * The card is a palette preview rather than a live themed subtree: a strip of the roles a reader
 * recognises, the base it inherits and its active state. The actions are the caller's, so the same
 * card works in a switcher, a gallery and an editor's preview.
 */

import type { ColorVariant, ThemeName } from "@asheeui/core";
import {
  Badge,
  Button,
  Card,
  ColorSwatch,
  HStack,
  VStack,
} from "asheeui";

/** The roles a card shows, in the order a palette is usually read. */
const PREVIEW_ROLES: readonly (keyof ColorVariant)[] = [
  "background",
  "foreground",
  "primary",
  "secondary",
  "border",
  "success",
  "warning",
  "danger",
];

export interface ThemeCardProps {
  /** The name shown to the reader. */
  name: string;

  /** The theme's key, when it differs from the display name. */
  slug?: string;

  /** The theme it extends. */
  base?: ThemeName;

  /** The resolved palette to preview. */
  colors: Partial<ColorVariant>;

  /** Whether this is the active selection. */
  active?: boolean;

  /** Select this theme. */
  onSelect?: () => void;

  /** Open the editor for this theme. */
  onEdit?: () => void;

  /** Delete this theme. */
  onDelete?: () => void;
}

/**
 * A theme preview with its name, base and optional actions.
 *
 * @param props - The palette and the actions.
 */
export function ThemeCard({
  name,
  slug,
  base,
  colors,
  active = false,
  onSelect,
  onEdit,
  onDelete,
}: ThemeCardProps) {
  const hasActions = Boolean(onSelect || onEdit || onDelete);

  return (
    <Card
      variant={active ? "bordered" : "elevated"}
      size="sm"
      title={name}
      description={slug}
      footer={
        hasActions ? (
          <HStack gap="sm" wrap>
            {onSelect && (
              <Button size="sm" variant="solid" onPress={onSelect}>
                Use
              </Button>
            )}
            {onEdit && (
              <Button size="sm" variant="bordered" onPress={onEdit}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="ghost" onPress={onDelete}>
                Delete
              </Button>
            )}
          </HStack>
        ) : undefined
      }
    >
      <VStack gap="sm">
        <HStack gap="sm" wrap>
          {active && (
            <Badge color="primary" variant="faded" size="sm">
              Active
            </Badge>
          )}
          {base && (
            <Badge color="secondary" variant="bordered" size="sm">
              {`extends ${base}`}
            </Badge>
          )}
        </HStack>
        <HStack gap="xs" wrap>
          {PREVIEW_ROLES.map((role) => (
            <ColorSwatch
              key={role}
              color={colors[role] ?? "transparent"}
              size="sm"
              label={`${role}: ${colors[role] ?? "transparent"}`}
            />
          ))}
        </HStack>
      </VStack>
    </Card>
  );
}
