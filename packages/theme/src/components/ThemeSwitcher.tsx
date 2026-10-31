/**
 * A theme picker that knows about runtime themes.
 *
 * It reads the controller for the selection and the resolved configuration for the palettes, so a
 * theme the application added after it started appears here with no extra registration. The two
 * variants are the same choice at different densities: a select for a settings row, cards for an
 * appearance gallery.
 */

import type { ThemeSelection } from "@asheeui/core";
import {
  Button,
  Dropmenu,
  Grid,
  HStack,
  VStack,
  useAsheeConfig,
  useTheme,
} from "asheeui";
import { ThemeCard } from "./ThemeCard";

/** A readable label for a slug: `lagoon` becomes `Lagoon`, `sunrise-2` becomes `Sunrise 2`. */
function labelFor(name: string): string {
  return name
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export interface ThemeSwitcherProps {
  /** Show the “system” choice. Defaults to true. */
  showSystem?: boolean;

  /** A label above the control. */
  label?: string;

  /**
   * `"select"` is a settings row; `"cards"` is a small gallery of the themes.
   *
   * @default "select"
   */
  variant?: "select" | "cards";

  /** Called after the controller's selection changes. */
  onValueChange?: (selection: ThemeSelection) => void;
}

/**
 * Pick the active theme from the themes the application declared.
 *
 * @param props - Presentation options and an optional change callback.
 */
export function ThemeSwitcher({
  showSystem = true,
  label = "Theme",
  variant = "select",
  onValueChange,
}: ThemeSwitcherProps) {
  const { theme, availableThemes, setTheme } = useTheme();
  const config = useAsheeConfig();

  const choose = (selection: ThemeSelection) => {
    setTheme(selection);
    onValueChange?.(selection);
  };

  if (variant === "cards") {
    return (
      <VStack gap="md">
        {showSystem && (
          <Button
            variant={theme === "system" ? "solid" : "bordered"}
            onPress={() => choose("system")}
          >
            Follow the system
          </Button>
        )}

        <Grid columns={1} columnsMd={2} gap="md">
          {availableThemes.map((name) => (
            <ThemeCard
              key={name}
              name={labelFor(name)}
              colors={config.color[name] ?? {}}
              active={theme === name}
              onSelect={() => choose(name)}
            />
          ))}
        </Grid>
      </VStack>
    );
  }

  const options = [
    ...(showSystem ? [{ label: "System", value: "system" }] : []),
    ...availableThemes.map((name) => ({ label: labelFor(name), value: name })),
  ];

  return (
    <VStack gap="xs">
      <Dropmenu
        label={label}
        options={options}
        value={theme}
        onValueChange={(value) => choose(String(value) as ThemeSelection)}
      />
      <HStack gap="xs" wrap>
        {availableThemes.slice(0, 6).map((name) => (
          <Button
            key={name}
            size="sm"
            variant={theme === name ? "faded" : "ghost"}
            onPress={() => choose(name)}
          >
            {labelFor(name)}
          </Button>
        ))}
      </HStack>
    </VStack>
  );
}
