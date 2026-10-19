/**
 * Tabs component configuration for AsheeUI.
 * This file registers the values the Tabs component defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 * The options themselves, and the types that name them, live in `@asheeui/core`:
 * they are the framework's tabs contract rather than a web renderer's, and the native
 * renderer reads the same ones from the same place.
 */

import { registerComponentDefaults, type TabsConfig } from "@asheeui/core";

export type {
  TabItem,
  TabsActiveOptionConfig,
  TabsConfig,
  TabsInactiveOptionConfig,
  TabsOptionsConfig,
  TabsVariant,
} from "@asheeui/core";

/**
 * Default config values registered for the Tabs component.
 */
export const defaultTabsConfig: TabsConfig = {
  size: "md",
  variant: "underline",
  radius: "md",
  options: {
    active: { radius: "md" },
  },
};

registerComponentDefaults("tabs", defaultTabsConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_TABS_CONFIG = {
  size: "md",
  variant: "underline",
  radius: "md",
  options: {
    active: { radius: "md", variant: "solid", color: "primary" },
    inactive: { radius: "md", variant: "ghost", color: "none" },
  },
} as const;
