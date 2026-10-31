/**
 * SearchInput configuration for the native package.
 *
 * The options are the ones the framework's search field names, so a search field on native
 * and on the web are configured the same way. The two visual axes and the two naming
 * decisions are taken from the shared configuration rather than restated, and what follows
 * is native's own: the platform names the unavailable state itself.
 */

import type { SearchInputConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

/**
 * Configuration options for the native SearchInput.
 *
 * `size`, `color`, `clearable`, `label` and `hideLabel` carry the meanings the shared
 * search field gives them.
 *
 * @deprecated Use {@link SearchInputConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export interface NativeSearchInputConfig
  extends Pick<
    SearchInputConfig,
    "size" | "color" | "clearable" | "label" | "hideLabel"
  > {
  /** Whether the field is unavailable. Defaults to false. */
  isDisabled?: boolean;
}

/**
 * The defaults the SearchInput registers with the native registry.
 * The name is stated and hidden, because a field whose name is empty is announced as
 * "search" and nothing else.
 *
 * @deprecated Use {@link defaultSearchInputConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeSearchInputConfig: NativeSearchInputConfig = {
  size: "md",
  color: "primary",
  clearable: true,
  label: "Search",
  hideLabel: true,
  isDisabled: false,
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    searchinput: NativeSearchInputConfig;
  }
}

registerNativeComponentDefaults("searchinput", defaultNativeSearchInputConfig);

/**
 * The values the field falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_SEARCH_INPUT_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_SEARCH_INPUT_CONFIG = {
  size: "md",
  color: "primary",
  clearable: true,
  label: "Search",
  hideLabel: true,
  isDisabled: false,
} satisfies NativeSearchInputConfig;
