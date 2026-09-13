/**
 * Interaction helpers (`TEST-023`).
 *
 * Keyboard entry, focus assertions, and typeahead entry used by behavioural
 * tests. Real key events are dispatched on the rendered element rather than
 * calling internal handlers (`TEST-029`), and focus assertions check the
 * observable focus location after a transition (`TEST-030`).
 */

import userEvent, { type UserEvent } from "@testing-library/user-event";
import { expect } from "vitest";

/** Arrow key names supported by {@link pressArrow}. */
export type ArrowKey = "ArrowDown" | "ArrowUp" | "ArrowLeft" | "ArrowRight";

/**
 * Create a user-event instance for a test.
 *
 * @param options - Optional user-event setup overrides (for example
 *   `advanceTimers` when the test uses fake timers).
 * @returns A configured user-event instance.
 */
export function createUser(
  options: Parameters<typeof userEvent.setup>[0] = {},
): UserEvent {
  return userEvent.setup(options);
}

/**
 * Press a named key, for example `Escape` or `Enter`.
 *
 * @param user - User-event instance.
 * @param key - Key name as understood by user-event.
 */
export async function pressKey(user: UserEvent, key: string): Promise<void> {
  await user.keyboard(`{${key}}`);
}

/**
 * Press an arrow key one or more times.
 *
 * @param user - User-event instance.
 * @param direction - Arrow key to press.
 * @param times - Number of presses.
 */
export async function pressArrow(
  user: UserEvent,
  direction: ArrowKey,
  times = 1,
): Promise<void> {
  for (let index = 0; index < times; index += 1) {
    await user.keyboard(`{${direction}}`);
  }
}

/**
 * Enter typeahead text one character at a time.
 *
 * @param user - User-event instance.
 * @param text - Characters to type.
 */
export async function typeahead(user: UserEvent, text: string): Promise<void> {
  for (const character of text) {
    await user.keyboard(character);
  }
}

/**
 * Assert the observable focus location.
 *
 * @param element - Expected focused element, or `null` when nothing should be
 *   focused.
 */
export function expectFocused(element: Element | null): void {
  expect(element).toHaveFocus();
}
