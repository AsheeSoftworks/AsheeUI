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

/** Options for {@link useFakeTimers}. */
export interface FakeTimerOptions {
  /**
   * Let fake time advance with the real clock. Required when the test also
   * awaits testing-library utilities while fake timers are installed,
   * otherwise those awaits wait on a clock only the test advances.
   */
  shouldAdvanceTime?: boolean;
}

/**
 * Install fake timers for the current test.
 *
 * When the test also drives user-event, pass
 * `createUser({ advanceTimers: vi.advanceTimersByTime })`, because user-event
 * needs to advance the same fake clock.
 *
 * @param options - Fake timer options.
 * @returns A {@link TimerControl} for advancing and restoring time.
 */
export function useFakeTimers(options: FakeTimerOptions = {}): TimerControl {
  vi.useFakeTimers({
    shouldAdvanceTime: options.shouldAdvanceTime ?? false,
  });

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
