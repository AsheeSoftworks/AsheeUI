/**
 * The theme model: the colour configuration a consumer writes and the defaults
 * it falls back to. Applying a theme is each platform's own business, so the
 * controller that touches the document and browser storage stays with the web
 * renderer rather than here — but the *reading* of a palette is shared, because
 * the eight roles, the palette and the theme selection are one contract.
 */

export * from "./color";
export * from "./palette";
