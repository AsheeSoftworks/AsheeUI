/**
 * The theme model and its state machine.
 *
 * The colour configuration a consumer writes, the defaults it falls back to, and the
 * controller that turns a selection into a resolved theme name are shared: one set of rules,
 * one storage key. *Painting* is not shared — a browser writes a class on the document and a
 * device hands `vars()` to NativeWind — so the controller takes a host, and each renderer
 * supplies its own.
 */

export * from "./color";
export * from "./controller";
export * from "./palette";
export * from "./runtime";
