/**
 * Tests for the shared layer stack (`F-140`).
 *
 * The bug: every layer answered Escape from its own window listener, so one
 * press closed a confirmation modal *and* the drawer it was opened from. These
 * tests pin the correction — one listener, the last registered layer only, and
 * the event marked handled — at the stack itself; the component tests cover the
 * drawer-with-a-modal-above-it case end to end.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "../test";
import { registerLayer, useLayerEscape } from "./layer-stack";

/** Unregister functions for layers a test registered outside a component. */
const unregisters: Array<() => void> = [];

/**
 * Register a layer and remember its unregister function for cleanup.
 *
 * @param onEscape - What the layer does when it is topmost.
 * @returns The unregister function.
 */
function openLayer(onEscape: () => void): () => void {
  const unregister = registerLayer(onEscape);
  unregisters.push(unregister);
  return unregister;
}

/**
 * Dispatch an Escape keydown on the window.
 *
 * @param init - Optional event overrides.
 * @returns The dispatched event, so the test can read `defaultPrevented`.
 */
function pressEscape(init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent("keydown", {
    key: "Escape",
    bubbles: true,
    cancelable: true,
    ...init,
  });
  window.dispatchEvent(event);
  return event;
}

beforeEach(() => {
  unregisters.length = 0;
});

afterEach(() => {
  while (unregisters.length > 0) {
    unregisters.pop()?.();
  }
});

describe("the shared layer stack", () => {
  it("offers Escape to the topmost layer only, and marks it handled", () => {
    const below = vi.fn();
    const above = vi.fn();
    openLayer(below);
    openLayer(above);

    const event = pressEscape();

    expect(above).toHaveBeenCalledTimes(1);
    expect(below).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });

  it("falls back to the layer below when the top layer closes", () => {
    const below = vi.fn();
    const above = vi.fn();
    openLayer(below);
    const unregisterAbove = openLayer(above);

    unregisterAbove();
    pressEscape();

    expect(above).not.toHaveBeenCalled();
    expect(below).toHaveBeenCalledTimes(1);
  });

  it("claims Escape for the top layer even when it does not close", () => {
    // A modal with Escape switched off must not hand the press to the drawer
    // underneath it: that is still one press closing a layer the reader was not
    // looking at.
    const below = vi.fn();
    openLayer(below);
    openLayer(() => {});

    pressEscape();

    expect(below).not.toHaveBeenCalled();
  });

  it("ignores an Escape another handler already handled", () => {
    const layer = vi.fn();
    openLayer(layer);

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    event.preventDefault();
    window.dispatchEvent(event);

    expect(layer).not.toHaveBeenCalled();
  });

  it("ignores keys other than Escape", () => {
    const layer = vi.fn();
    openLayer(layer);

    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(layer).not.toHaveBeenCalled();
  });
});

describe("useLayerEscape", () => {
  it("registers while active and unregisters when it is not", () => {
    const layer = vi.fn();
    const { rerender } = renderHook(
      ({ active }) => useLayerEscape(active, layer),
      { initialProps: { active: false } },
    );

    pressEscape();
    expect(layer).not.toHaveBeenCalled();

    rerender({ active: true });
    pressEscape();
    expect(layer).toHaveBeenCalledTimes(1);
  });

  it("keeps its place in the stack when the handler identity changes", () => {
    // A consumer's `onClose` is usually an inline arrow, so it is a new
    // function every render. Re-registering on that identity would move the
    // layer above a newer one and let it answer Escape again.
    const below = vi.fn();
    const above = vi.fn();
    const first = vi.fn();
    const second = vi.fn();

    openLayer(below);

    const { rerender } = renderHook(
      ({ onEscape }) => useLayerEscape(true, onEscape),
      { initialProps: { onEscape: first } },
    );

    openLayer(above);

    rerender({ onEscape: second });

    pressEscape();

    expect(above).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
    expect(first).not.toHaveBeenCalled();
    expect(below).not.toHaveBeenCalled();
  });
});
