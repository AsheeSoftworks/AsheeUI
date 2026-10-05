/**
 * Pausable timeout hook for AsheeUI.
 * This file provides the usePausableTimeout hook that allows pausing
 * and resuming a timeout callback. Used by ToastItem to pause auto-dismissal
 * when the user hovers over a toast.
 */
"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Hook that creates a pausable timeout.
 *
 * usePausableTimeout returns pause and resume functions that control
 * a timeout callback. This is useful for scenarios like toast notifications
 * where the auto-dismiss timer should pause when the user hovers over the
 * element and resume when they leave.
 *
 * @param callback - The function to call when the timeout completes.
 * @param delay - The delay in milliseconds before the callback is called.
 *                If 0 or negative, the timeout is disabled.
 * @returns An object with pause and resume functions.
 *
 * @example
 * ```tsx
 * const { pause, resume } = usePausableTimeout(() => {
 *   console.log('Timeout completed!');
 * }, 3000);
 *
 * return (
 *   <div
 *     onMouseEnter={pause}
 *     onMouseLeave={resume}
 *   >
 *     Hover to pause the timeout
 *   </div>
 * );
 * ```
 */
export function usePausableTimeout(callback: () => void, delay?: number) {
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const remainingRef = useRef<number>(delay ?? 0);

  const pause = useCallback(() => {
    if (!delay || delay <= 0) return;
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
      remainingRef.current -= Date.now() - startRef.current;
    }
  }, [delay]);

  const resume = useCallback(() => {
    if (!delay || delay <= 0 || remainingRef.current <= 0) return;
    startRef.current = Date.now();
    timerRef.current = window.setTimeout(callback, remainingRef.current);
  }, [callback, delay]);

  useEffect(() => {
    if (delay && delay > 0) {
      resume();
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [resume, delay]);

  return { pause, resume };
}
