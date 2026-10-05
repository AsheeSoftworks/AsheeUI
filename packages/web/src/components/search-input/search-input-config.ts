/**
 * SearchInput configuration for the web renderer.
 *
 * The search field's options are shared, so the contract lives in `@asheeui/core` and is
 * re-exported here: a consumer configures `components.searchinput` with the same keys on
 * both platforms, and the component reads the same shape its native counterpart does.
 *
 * What stays with the renderer is the value each option *defaults to* on the web, and the
 * registration itself.
 */

import {
  registerComponentDefaults,
  type SearchInputConfig,
} from "@asheeui/core";

export type { SearchInputConfig } from "@asheeui/core";
export { FALLBACK_SEARCH_INPUT_CONFIG } from "@asheeui/core";

/**
 * Default config values registered for the SearchInput component.
 * The label is named and hidden rather than absent, because a field whose name is empty is
 * announced as "search" and nothing else.
 */
export const defaultSearchInputConfig: SearchInputConfig = {
  size: "md",
  color: "primary",
  clearable: true,
  label: "Search",
  hideLabel: true,
};

registerComponentDefaults("searchinput", defaultSearchInputConfig);
