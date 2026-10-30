/**
 * Spacing token definitions for AsheeUI.
 *
 * This file provides the shared spacing scale that the layout components use
 * for gaps, vertical rhythm and section padding. Every entry is a complete,
 * static Tailwind class string, so the scale never assembles a utility name at
 * runtime (Hard Rule 5) and a layout component can resolve spacing through the
 * standard configuration cascade.
 *
 * The token names are not declared here. They come from `SPACING_STEP` in
 * `../tokens`, which owns the scale, and every map below is a `Record<Space,
 * string>`: adding a step to the token map is a type error until each map states
 * its class, so the token scale and the class maps cannot silently disagree.
 */

import type { Space } from "../tokens";

/**
 * The available spacing tokens.
 * Derived from `SPACING_STEP` in `../tokens`.
 */
export type { Space };
