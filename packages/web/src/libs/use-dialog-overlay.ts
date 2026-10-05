/**
 * Focus wiring for the dialog overlays.
 *
 * `Modal` and `Drawer` are both modal dialogs: they render outside the caller's
 * subtree, move focus into the dialog when it opens, keep focus inside it while
 * it is open, and return focus to whatever was focused before it opened.
 * Floating UI's root context and focus manager provide that behaviour
 * (`COMP-009`), and both dialogs obtain it from this one hook so their focus
 * behaviour cannot drift apart (`COMP-035`, `COMP-036`).
 */

"use client";

import {
  type FloatingRootContext,
  useFloatingRootContext,
} from "@floating-ui/react";
import { type RefCallback, useCallback, useState } from "react";

/** The focus wiring a dialog overlay needs. */
export interface DialogOverlayWiring {
  /** Context consumed by `FloatingFocusManager`. */
  context: FloatingRootContext;
  /** Registers the dialog element as the focus scope root. */
  setDialogRef: RefCallback<HTMLElement>;
}

/**
 * Wires a dialog overlay to the shared focus management.
 *
 * The dialog element is held in state rather than a ref so that the root
 * context exposes it on the render after it mounts: the focus manager ignores a
 * context whose floating element is still unknown.
 *
 * @param isOpen - Whether the dialog is open.
 * @returns The focus context and the dialog ref setter.
 */
export function useDialogOverlay(isOpen: boolean): DialogOverlayWiring {
  const [dialog, setDialog] = useState<HTMLElement | null>(null);

  // The dialogs own their closing behaviour: the Escape key, a backdrop press
  // and the consumer's own controls all call `onClose`. Focus cannot leave an
  // open modal dialog, so the focus manager must never close one on its own.
  const handleOpenChange = useCallback(() => {}, []);

  const context = useFloatingRootContext({
    open: isOpen,
    onOpenChange: handleOpenChange,
    elements: { reference: null, floating: dialog },
  });

  return { context, setDialogRef: setDialog };
}
