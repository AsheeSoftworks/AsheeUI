/**
 * Browser-environment stand-ins for the playground end-to-end tests.
 *
 * jsdom implements the DOM but not these boundaries, so a playground that runs
 * its end-to-end test in a browser environment installs the same stand-ins the
 * framework's own component tests use (`TEST-019`): they cover only what the
 * environment cannot provide, and nothing about a component is mocked. A
 * playground imports this module as `@asheeui/e2e-gallery/setup`.
 */

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

if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
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

if (typeof window !== "undefined") {
  // jsdom defines `scrollTo` but reports it as unimplemented, so restoring a
  // scroll position would produce console noise instead of a no-op.
  window.scrollTo = () => {};
}
