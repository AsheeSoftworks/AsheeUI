import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Ensure DOM is cleaned up between tests even if globals are disabled later.
afterEach(() => {
  cleanup();
});

/**
 * happy-dom lacks a few browser APIs used by the theme controller,
 * floating-ui and component effects. These stubs keep unit/integration
 * tests focused on behavior instead of environment gaps.
 */

if (typeof window !== "undefined") {
  // window.matchMedia (used by the theme controller for system theme)
  if (typeof window.matchMedia !== "function") {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }

  // window.requestAnimationFrame
  if (typeof window.requestAnimationFrame !== "function") {
    window.requestAnimationFrame = ((cb: FrameRequestCallback) =>
      window.setTimeout(
        () => cb(performance.now()),
        16,
      )) as unknown as typeof window.requestAnimationFrame;
  }
  if (typeof window.cancelAnimationFrame !== "function") {
    window.cancelAnimationFrame = ((handle: number) =>
      window.clearTimeout(
        handle,
      )) as unknown as typeof window.cancelAnimationFrame;
  }

  // window.ResizeObserver (used by floating-ui autoUpdate)
  if (typeof window.ResizeObserver !== "function") {
    class ResizeObserverStub {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
    Object.defineProperty(window, "ResizeObserver", {
      writable: true,
      value: ResizeObserverStub,
    });
  }

  // Element.prototype.scrollIntoView
  if (typeof Element.prototype.scrollIntoView !== "function") {
    Element.prototype.scrollIntoView = () => {};
  }
}
