/**
 * Shared test setup for the UI package.
 *
 * Registered through `vitest.config.ts` for every test file. It adds the
 * accessibility-oriented DOM matchers, guarantees cleanup between tests, and
 * installs deterministic stand-ins for browser APIs that jsdom does not
 * implement. Stand-ins are limited to boundaries jsdom cannot provide, which
 * keeps component logic under test rather than mocked (`TEST-019`).
 */

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  if (typeof document !== "undefined") {
    cleanup();
  }
});

/** Minimal `ResizeObserver` stand-in; jsdom does not implement it. */
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

/** Minimal `IntersectionObserver` stand-in; jsdom does not implement it. */
class IntersectionObserverStub {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): [] {
    return [];
  }
}

const globalWithObservers = globalThis as typeof globalThis & {
  ResizeObserver?: typeof ResizeObserver;
  IntersectionObserver?: typeof IntersectionObserver;
};

globalWithObservers.ResizeObserver ??=
  ResizeObserverStub as unknown as typeof ResizeObserver;
globalWithObservers.IntersectionObserver ??=
  IntersectionObserverStub as unknown as typeof IntersectionObserver;

if (
  typeof window !== "undefined" &&
  typeof window.matchMedia !== "function"
) {
  const matchMediaStub = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;

  window.matchMedia = matchMediaStub as unknown as typeof window.matchMedia;
}

if (
  typeof Element !== "undefined" &&
  typeof Element.prototype.scrollIntoView !== "function"
) {
  Element.prototype.scrollIntoView = () => {};
}
