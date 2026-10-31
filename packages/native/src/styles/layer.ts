/**
 * The platform's class dictionary for the built-in layer close control.
 *
 * The control is the same inside a modal and inside a drawer — the web shares one component
 * between the two for the same reason — so the strings live here rather than in either
 * layer's dictionary.
 */

/**
 * The control's box, over the surface's top-right corner.
 *
 * It is positioned rather than laid out in a row so the layer's content still fills the
 * surface; a thumb target is what the padding buys.
 */
export const NATIVE_LAYER_CLOSE_CLASS =
  "absolute right-3 top-3 z-10 items-center justify-center p-2";

/** The glyph the control draws, because this package ships no icon set. */
export const NATIVE_LAYER_CLOSE_GLYPH = "×";
