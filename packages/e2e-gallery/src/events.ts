/**
 * Interaction helpers used by the gallery contract.
 *
 * A playground's end-to-end test drives the same interactions that a consumer
 * performs, so they live beside the contract rather than in each application.
 * The helpers use native DOM events and React's `act`, which every framework's
 * hydrated tree responds to, instead of a testing framework's simulation layer.
 */

import { act } from "@testing-library/react";

/**
 * Lets React finish the work a dispatched event started.
 *
 * @returns A promise that resolves after pending microtasks and timers.
 */
export async function settle(): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

/**
 * Clicks an element the way a consumer does.
 *
 * @param element - Element to click.
 */
export async function click(element: Element): Promise<void> {
  await act(async () => {
    (element as HTMLElement).click();
  });
  await settle();
}

/**
 * Focuses an element the way a consumer does.
 *
 * Focusing matters for controls that reveal content on focus, such as a
 * tooltip, so the helper dispatches the focus that React listens for.
 *
 * @param element - Element to focus.
 */
export async function focus(element: Element): Promise<void> {
  await act(async () => {
    (element as HTMLElement).focus();
  });
  await settle();
}

/**
 * Presses a key the way a consumer does.
 *
 * The event is dispatched on the document body, which is where a keyboard event
 * originates and which bubbles to the document and the window, so a control that
 * listens on any of those three receives it. Dialogs listen on the window,
 * because the focus trap moves focus while they are open.
 *
 * @param key - Keyboard key to press.
 */
export async function press(key: string): Promise<void> {
  await act(async () => {
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true }),
    );
  });
  await settle();
}

/**
 * Waits for content that appears asynchronously, such as a floating element
 * positioned after an animation frame.
 *
 * @param read - Returns the value once it exists.
 * @param description - What is being waited for, used in the problem message.
 * @returns The value, or a description of the timeout.
 */
export async function waitFor<T>(
  read: () => T | null | undefined,
  description: string,
  timeoutMs = 1000,
): Promise<T | string> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const value = read();

    if (value) return value;

    await settle();
  }

  return `timed out waiting for ${description}`;
}
