/**
 * The built-in close control for a dismissible layer.
 *
 * `Modal` and `Drawer` draw this control themselves so that an open layer
 * always has a visible way out: a keyboard reader who cannot aim a pointer at
 * the backdrop still has a control inside the dialog, and a layer whose two
 * dismissal switches are both off is still closable. Sharing one component
 * keeps the two layers' control identical, including its place in the tab
 * order.
 */

"use client";

import { CloseIcon } from "../icons/CloseIcon";

/**
 * The close control's own classes.
 *
 * It is positioned over the surface's top-right corner rather than taking a row
 * of its own, so the layer's content still fills the surface as documented.
 * Drawing it is the component's job; where the reader's content begins is
 * still the consumer's.
 */
export const OVERLAY_CLOSE_CONTROL_CLASS =
  "absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

/** Props for the built-in close control. */
export interface OverlayCloseControlProps {
  /** Accessible name for the control, for example "Close dialog". */
  label: string;

  /** Called when the reader activates the control. */
  onClose: () => void;
}

/**
 * Renders the layer's built-in close control.
 *
 * The control is the first focusable element inside the dialog, because it is
 * rendered before the consumer's content. A reader who opens a layer can leave
 * it with one <kbd>Tab</kbd> and <kbd>Enter</kbd>, without hunting for a
 * control the consumer may not have drawn, and without relying on the pointer.
 *
 * @param props - The accessible name and the dismissal callback.
 * @returns The rendered button.
 */
export function OverlayCloseControl({
  label,
  onClose,
}: OverlayCloseControlProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClose}
      className={OVERLAY_CLOSE_CONTROL_CLASS}>
      <CloseIcon className="size-4" />
    </button>
  );
}
