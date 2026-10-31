/**
 * The `K` options a configuration may carry, and what to do instead.
 *
 * A web application's `asheeui.config.ts` is one file for both platforms, so it may state an
 * option only the web can honour: a toast's portal, a calendar's floating picker, a sticky
 * column. The platform accepts the section and ignores the option, and this audit is where
 * it says so — once per option for the process, in development only.
 *
 * The audit reads the consumer's configuration rather than the resolved one because a
 * registered default is not a decision the consumer made; warning about one would fire on
 * every application. What is left of the resolved configuration is the default, and a default
 * is not a prop.
 */

import type { ExternalConfig } from "@asheeui/core";
import { warnUnsupportedProp } from "../utils/unsupported-prop";

/** One option a section may state, with what a device offers instead. */
interface UnsupportedOption {
  /** The section the option is read from, as a consumer writes it. */
  section: string;

  /** The option's name in that section. */
  prop: string;

  /** What to do instead. */
  substitute: string;
}

/**
 * Every option the ledger keeps and the platform cannot honour.
 *
 * The list is data rather than a chain of `if`s so a reader can compare it with the
 * impossibility report's table.
 */
const UNSUPPORTED_OPTIONS: readonly UnsupportedOption[] = [
  {
    section: "toast",
    prop: "portal",
    substitute:
      "the native layer already paints above the screen; place the provider at the root",
  },
  {
    section: "toast",
    prop: "portalTarget",
    substitute:
      "the native layer is positioned against the provider; wrap the screen you want it above",
  },
  {
    section: "calendar",
    prop: "picker",
    substitute: "the month opens as a surface; there is no panel to float beside the field",
  },
  {
    section: "calendar",
    prop: "portal",
    substitute: "the month is already presented above the screen",
  },
  {
    section: "calendar",
    prop: "lockScroll",
    substitute: "there is no page to lock; the month's surface takes the input itself",
  },
  {
    section: "tooltip",
    prop: "zIndex",
    substitute: "render the hint later in the tree; there is no z-axis",
  },
  {
    section: "image",
    prop: "loading",
    substitute:
      "a native picture is fetched when its view mounts; a list mounts a row as it scrolls",
  },
  {
    section: "searchinput",
    prop: "shortcut",
    substitute: "bind the shortcut in the application; a device has no keyboard",
  },
  {
    section: "textarea",
    prop: "enableVirtualKeyboard",
    substitute: "the system keyboard is the one that appears",
  },
  {
    section: "dropmenu",
    prop: "name",
    substitute: "read the field's value from state; a form name is a DOM concept",
  },
  {
    section: "dropmenu",
    prop: "searchInputName",
    substitute: "the picker's search field is internal; it has no form name",
  },
  {
    section: "navbar",
    prop: "mobileOpen",
    substitute: "the bar scrolls rather than disclosing; every destination stays in the row",
  },
  {
    section: "navbar",
    prop: "onMobileOpenChange",
    substitute: "there is no disclosure to report; the destinations are always reachable",
  },
  {
    section: "navbar",
    prop: "mobileLabel",
    substitute: "there is no disclosure control to name",
  },
  {
    section: "page",
    prop: "stickyNavigation",
    substitute: "place the navigation outside the scrolling container",
  },
  {
    section: "page",
    prop: "stickySidebar",
    substitute: "place the sidebar outside the scrolling container",
  },
  {
    section: "page",
    prop: "stickyEnd",
    substitute: "place the end region outside the scrolling container",
  },
  {
    section: "docslayout",
    prop: "stickyNavigation",
    substitute: "place the navigation outside the scrolling container",
  },
  {
    section: "docslayout",
    prop: "stickyToc",
    substitute: "place the contents outside the scrolling container",
  },
  {
    section: "sidebarlayout",
    prop: "stickySidebar",
    substitute: "place the sidebar outside the scrolling container",
  },
  {
    section: "split",
    prop: "sticky",
    substitute: "place the region outside the scrolling container",
  },
];

/**
 * Warn about every `K` option the application's configuration states.
 *
 * @param config - The consumer's configuration, before defaults are merged.
 */
export function auditUnsupportedConfig(config: ExternalConfig): void {
  const components = config.components as
    | Record<string, Record<string, unknown>>
    | undefined;

  if (!components) return;

  for (const { section, prop, substitute } of UNSUPPORTED_OPTIONS) {
    const value = components[section]?.[prop];

    // A section key is written in camelCase by the configuration, and the matrix uses the
    // hyphenated component name; the audit names the configuration key a consumer wrote.
    if (value !== undefined) {
      warnUnsupportedProp(section, prop, substitute);
    }
  }
}
