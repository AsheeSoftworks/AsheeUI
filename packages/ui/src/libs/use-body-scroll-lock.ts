/**
 * Body scroll lock for overlay components.
 *
 * Overlays that cover the page (modal dialogs, drawers, dropdown menus) stop
 * the page behind them from scrolling. The lock is reference counted, so
 * overlays that are open at the same time share one lock: the body styles
 * captured when the first overlay opens are restored only after the last one
 * closes. An overlay therefore never captures the styles of an already locked
 * body, and never restores them while another overlay is still open.
 */

"use client";

import { useEffect } from "react";

/** Number of overlays currently holding the lock. */
let holders = 0;

/** Restores the body styles captured when the first overlay took the lock. */
let release: (() => void) | null = null;

/**
 * Applies the scroll lock and returns the function that undoes it.
 *
 * The page position is captured first, because fixing the body discards the
 * page's scroll position: without compensating with `top`, the page would jump
 * to the top as the lock applies. A floating element anchored to a trigger
 * that jumped would then be left visibly detached from it.
 *
 * @returns A function that restores the captured body styles and position.
 */
function acquire(): () => void {
  const scrollY = window.scrollY;
  const { style } = document.body;
  const captured = {
    position: style.position,
    top: style.top,
    left: style.left,
    right: style.right,
    width: style.width,
    overflow: style.overflow,
  };

  style.position = "fixed";
  style.top = `-${scrollY}px`;
  style.left = "0";
  style.right = "0";
  style.width = "100%";
  style.overflow = "hidden";

  return () => {
    style.position = captured.position;
    style.top = captured.top;
    style.left = captured.left;
    style.right = captured.right;
    style.width = captured.width;
    style.overflow = captured.overflow;
    // Clearing the styles above leaves the browser at the position the fixed
    // body visually occupied, so the captured page position is restored.
    window.scrollTo(0, scrollY);
  };
}

/**
 * Locks body scroll while `active` is true.
 *
 * The lock is shared by every caller: it applies on the first overlay that
 * becomes active and is released when the last one stops being active. The
 * lock is applied from an effect, so server rendering is unaffected.
 *
 * @param active - Whether the calling overlay currently covers the page.
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof document === "undefined" || !document.body) return;

    if (holders === 0) release = acquire();
    holders += 1;

    return () => {
      holders -= 1;
      if (holders === 0) {
        release?.();
        release = null;
      }
    };
  }, [active]);
}
