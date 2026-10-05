/**
 * Tabs configuration for the native package.
 *
 * The options are the ones the framework's tabs contract names, so `components.tabs` is
 * configured the same way on both platforms, and the types are re-exported from
 * `@asheeui/core` rather than restated here. What stays with the renderer is the value each
 * option defaults to on the platform, and the registration that puts it in the native
 * registry.
 *
 * The defaults are the web's, which is worth stating: a tab bar's documented default is an
 * underlined bar with a filled selected trigger, and a density is the same decision on
 * either platform. The platform's own answer is in the class dictionaries — a trigger is
 * never shorter than a touch target, and the bar scrolls with the platform's scroll view.
 */

import type { TabsConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  TabItem,
  TabsActiveOptionConfig,
  TabsConfig,
  TabsInactiveOptionConfig,
  TabsOptionsConfig,
  TabsVariant,
} from "@asheeui/core";

/**
 * Configuration options for the native Tabs.
 */
export type NativeTabsConfig = TabsConfig;

/**
 * The defaults the Tabs register with the native registry.
 */
export const defaultNativeTabsConfig: NativeTabsConfig = {
  size: "md",
  variant: "underline",
  radius: "md",
  options: {
    active: { radius: "md" },
  },
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    tabs: NativeTabsConfig;
  }
}

registerNativeComponentDefaults("tabs", defaultNativeTabsConfig);

/**
 * The values the tabs fall back to when no tier provides one.
 */
export const FALLBACK_NATIVE_TABS_CONFIG = {
  size: "md",
  variant: "underline",
  radius: "md",
  options: {
    active: { radius: "md", variant: "solid", color: "primary" },
    inactive: { radius: "md", variant: "ghost", color: "none" },
  },
} as const;
