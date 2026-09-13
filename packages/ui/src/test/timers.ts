/**
 * Timer helper (`TEST-023`, `TEST-032`).
 *
 * Gives tests deterministic control over timers for auto-dismissing
 * components (toast, tooltip) so no test ever relies on an arbitrary sleep.
 */

import { act } from "@testing-library/react";
import { vi } from "vitest";

/** Deterministic timer control returned by {@link useFakeTimers}. */
export interface TimerControl {
  /** Advance fake time and flush the resulting React updates. */
  advance: (milliseconds: number) => void;
  /** Restore real timers. */
  restore: () => void;
}

/**
 * Install fake timers for the current test.
 *
 * When the test also drives user-event, pass
 * `createUser({ advanceTimers: vi.advanceTimersByTime })`, because user-event
 * needs to advance the same fake clock.
 *
 * @returns A {@link TimerControl} for advancing and restoring time.
 */
export function useFakeTimers(): TimerControl {
  vi.useFakeTimers();

  return {
    advance(milliseconds: number): void {
      act(() => {
        vi.advanceTimersByTime(milliseconds);
      });
    },
    restore(): void {
      vi.useRealTimers();
    },
  };
}
