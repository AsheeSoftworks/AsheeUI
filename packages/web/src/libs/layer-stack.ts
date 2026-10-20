/**
 * The shared layer stack for dismissible overlays.
 *
 * Every layer that answers Escape used to add its own `window` keydown
 * listener. Nothing told the listeners which layer was on top, so one press
 * closed every open layer at once: a confirmation modal opened from a drawer
 * dismissed the modal *and* the drawer. This module replaces those listeners
 * with one window listener and an ordered stack. A layer registers when it
 * opens and unregisters when it closes, and Escape is offered to the last
 * registered layer only — the one painted on top. That layer marks the event
 * handled whether or not it closes, so a layer with Escape switched off does
 * not hand the press to the layer it covers.
 */

"use client";

import { useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

/** What a registered layer runs when it is the topmost layer and Escape is pressed. */
export type LayerEscapeHandler = (event: KeyboardEvent) => void;

/** One open layer in the stack. */
interface RegisteredLayer {
  /**
   * Identity for the unregister call. Comparing functions is not enough: two
   * layers can register the same handler, and removing "the handler" would then
   * remove the wrong layer.
   */
  handle: symbol;
  onEscape: LayerEscapeHandler;
}

/** The open layers in registration order; the last one is the topmost. */
let layers: RegisteredLayer[] = [];

/** Whether the shared window listener is installed. */
let listening = false;

/**
 * Routes one keydown to the topmost layer.
 *
 * An event another handler already dealt with is left alone, so two libraries
 * that both mark Escape as handled cannot both act on it.
 *
 * @param event - The keydown event the shared listener received.
 */
function handleKeyDown(event: KeyboardEvent): void {
  if (event.key !== "Escape" || event.defaultPrevented) return;

  const top = layers[layers.length - 1];
  if (!top) return;

  // Claim the press before running the handler: the topmost layer owns this
  // Escape even when its own dismissal is switched off, and `defaultPrevented`
  // is the signal another window listener can check.
  event.preventDefault();
  top.onEscape(event);
}

/** Installs the shared listener on the first open layer. */
function listen(): void {
  if (listening || typeof window === "undefined") return;
  window.addEventListener("keydown", handleKeyDown);
  listening = true;
}

/** Removes the shared listener once the last layer has closed. */
function unlistenWhenEmpty(): void {
  if (!listening || layers.length > 0 || typeof window === "undefined") return;
  window.removeEventListener("keydown", handleKeyDown);
  listening = false;
}

/**
 * Registers an open layer as the topmost one.
 *
 * @param onEscape - What the layer does when it is the topmost layer and
 *   Escape is pressed. The stack marks the event handled already.
 * @returns The unregister function; call it when the layer closes.
 */
export function registerLayer(onEscape: LayerEscapeHandler): () => void {
  const layer: RegisteredLayer = { handle: Symbol("ashee-layer"), onEscape };
  layers = [...layers, layer];
  listen();

  return () => {
    layers = layers.filter((entry) => entry.handle !== layer.handle);
    unlistenWhenEmpty();
  };
}

/**
 * Registers the calling layer while `active` is true.
 *
 * The handler is kept in a ref, so a consumer's inline `onClose` arrow does not
 * re-register the layer on every render. Keying the registration on the
 * callback would move a layer back to the top whenever its parent re-rendered,
 * even with a newer layer open above it.
 *
 * Registration runs from an effect, so server rendering is unaffected.
 *
 * @param active - Whether the layer is open.
 * @param onEscape - What the layer does when it is the topmost layer and
 *   Escape is pressed.
 */
export function useLayerEscape(
  active: boolean,
  onEscape: LayerEscapeHandler,
): void {
  const handlerRef = useRef(onEscape);

  useIsomorphicLayoutEffect(() => {
    handlerRef.current = onEscape;
  });

  useEffect(() => {
    if (!active) return;
    return registerLayer((event) => handlerRef.current(event));
  }, [active]);
}
