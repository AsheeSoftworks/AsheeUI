/**
 * The SearchInput's configuration face, shared by both platforms.
 *
 * A search field is a field family member whose value drives a result list, so its
 * configuration is the family's two visual axes it needs — density and accent — plus the
 * three decisions only a search field has: whether it dismisses its own text, what it is
 * named, and whether that name is visible.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `searchinput` here is what makes `components.searchinput` a
 * known configuration section, on every platform, without each renderer restating it.
 */

import type { Color } from "../../shared/variant";
import type { Size } from "../../tokens";

/**
 * Theme configuration options for the SearchInput component.
 *
 * Set under `components.searchinput` in the AsheeUI config.
 */
export interface SearchInputConfig {
  /**
   * Density of the field and of the control that dismisses its text.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Accent colour of the field's focus ring.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Whether the field offers a control that empties it.
   *
   * @default true
   */
  clearable?: boolean;

  /**
   * Visible name of the field.
   * A search field is often named only for assistive technology, so the name can be
   * hidden from view with `hideLabel`.
   *
   * @default "Search"
   */
  label?: string;

  /**
   * Whether the name is available to assistive technology only.
   *
   * @default true
   */
  hideLabel?: boolean;
}

/**
 * The values a search field falls back to when no tier provides one.
 *
 * The name is stated rather than left empty, because a field whose name is empty is
 * announced as "search" and nothing else.
 */
export const FALLBACK_SEARCH_INPUT_CONFIG: Required<SearchInputConfig> = {
  size: "md",
  color: "primary",
  clearable: true,
  label: "Search",
  hideLabel: true,
};

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    searchinput: SearchInputConfig;
  }
}
