/**
 * The official playgrounds' configuration.
 *
 * It is deliberately empty. AsheeUI owns its defaults: the theme, the variant,
 * the colour, the radius, the spacing scale and every component's registered
 * defaults are the framework's, and a consumer states only what it wants to
 * change. The playground overrides nothing, so running it is the proof that the
 * framework works from its internal defaults alone.
 *
 * Do not copy the internal defaults into this object. A playground that restated
 * them would test the values it restated rather than the framework's own, and it
 * would go stale the moment a default changed.
 *
 * @see docs/configuration.md for the documented baseline these defaults resolve to.
 */

import type { ExternalConfig } from "asheeui";

/**
 * The playground's configuration: nothing.
 */
export const playgroundConfig: ExternalConfig = {};
