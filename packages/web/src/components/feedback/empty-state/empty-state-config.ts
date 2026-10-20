/**
 * EmptyState component configuration for AsheeUI.
 * This file registers the values the EmptyState pattern defaults to on the web, so
 * the component-level fallback tier of the theme cascade has a value to resolve.
 * The options themselves, and the type that names them, live in `@asheeui/core`:
 * they are the framework's empty-region contract rather than a web renderer's, and
 * the native renderer reads the same ones from the same place.
 */

import {
  type EmptyStateConfig,
  registerComponentDefaults,
} from "@asheeui/core";

export type {
  EmptyStateConfig,
  EmptyStateRole,
  EmptyStateType,
} from "@asheeui/core";

/**
 * Default config values registered for the EmptyState component.
 *
 * `role` is registered as `"none"` because an empty state is silent by default:
 * one that was part of the page's first markup was not a change, and announcing it
 * would describe something that never happened. A product whose empty states answer
 * a query states `status` once, here.
 */
export const defaultEmptyStateConfig: EmptyStateConfig = {
  type: "info",
  size: "md",
  panel: false,
  role: "none",
};

registerComponentDefaults("emptystate", defaultEmptyStateConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_EMPTY_STATE_CONFIG = {
  type: "info",
  size: "md",
  panel: false,
  role: "none",
} satisfies EmptyStateConfig;
