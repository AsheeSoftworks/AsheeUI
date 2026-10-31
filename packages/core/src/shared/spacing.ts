/**
 * The spacing vocabulary, and where the class maps that used to live here went.
 *
 * The token names are not declared here. They come from `SPACING_STEP` in `../tokens`, which owns
 * the scale; `Space` is re-exported from there, so a layout component imports its vocabulary from
 * one place and a step added to the token map is a type error in every map that has to state it.
 *
 * The `Record<Space, string>` maps that turned a step into a class — `SPACE_GAP_CLASS`,
 * `SPACE_BLOCK_CLASS`, `SPACE_PADDING_Y_CLASS`, `SPACE_MIN_HEIGHT_CLASS` — are class strings, and
 * a class string belongs to the renderer that compiles it: Tailwind on the web, NativeWind on the
 * platform. C2 duplicated them into `packages/web/src/styles/portable.ts` and
 * `packages/native/src/styles/portable.ts` and deleted them from core, and
 * `shared/style-parity.test.ts` reads the two copies as text so the pairs it lists cannot drift.
 * That is why this module is one export and holds no class at all — the vocabulary, without the
 * strings.
 */

import type { Space } from "../tokens";

/**
 * The available spacing tokens.
 * Derived from `SPACING_STEP` in `../tokens`.
 */
export type { Space };
