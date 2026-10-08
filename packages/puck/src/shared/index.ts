/**
 * The shared layer of the Puck integration.
 *
 * Everything in this module is true on both platforms: the field vocabulary, the block
 * specs, the adapters that turn a builder value into a component prop, and the contract
 * a stored page is read through. It imports no renderer and nothing from the editor, so
 * it is the same code in a browser bundle and on a device — which is the whole reason
 * the package is split this way.
 */

export * from "./adapters";
export * from "./blocks";
export * from "./fields";
export * from "./types";
