/**
 * Floating z-index hook for AsheeUI.
 * This file provides a hook that derives a portaled floating element's
 * `z-index` from its trigger's stacking context, so anchored popups layer
 * correctly against both AsheeUI components and arbitrary client components.
 */

"use client";

import { useState } from "react";
import { resolveBaseZIndex } from "../utils/stacking";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

/**
 * Derives the `z-index` a portaled floating element should use so it renders
 * above its trigger's stacking context without outranking unrelated app
 * chrome such as a custom navbar.
 *
 * The base value is measured in a layout effect, so the corrected z-index is
 * applied before the browser paints and the floating element never flashes at
 * the wrong layer.
 *
 * @param reference - Ref to the trigger element. Floating UI virtual elements
 * are ignored, since they have no DOM ancestors to inspect.
 * @param isOpen - Whether the floating element is open.
 * @param layerDelta - The component's layer delta from `ASHEE_LAYER`.
 * @returns The derived `z-index` for the floating element.
 *
 * @example
 * ```tsx
 * const zIndex = useFloatingZIndex(refs.reference, isOpen, ASHEE_LAYER.tooltip);
 * ```
 *
 * @see resolveBaseZIndex - The underlying stacking-context resolution.
 */
export function useFloatingZIndex(
  reference: { readonly current: unknown },
  isOpen: boolean,
  layerDelta: number,
): number {
  const [baseZIndex, setBaseZIndex] = useState(0);

  useIsomorphicLayoutEffect(() => {
    if (!isOpen) {
      return;
    }
    const element = reference.current;
    setBaseZIndex(
      resolveBaseZIndex(element instanceof Element ? element : null),
    );
  }, [isOpen, reference]);

  return baseZIndex + layerDelta;
}
