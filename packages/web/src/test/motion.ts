/**
 * Reduced-motion helper (`TEST-023`, `TEST-033`).
 *
 * Components that must yield to the reduced-motion preference read it through
 * `matchMedia`. This helper installs a stand-in that reports the preference the
 * test asks for, so the behaviour is proven without depending on the settings
 * of the machine running the tests.
 */

import { vi } from "vitest";

/**
 * Report `prefersReducedMotion` from `window.matchMedia` for one test.
 *
 * @param prefersReducedMotion - Whether the platform should report the
 *   reduced-motion preference.
 */
export function stubReducedMotion(prefersReducedMotion: boolean): void {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: query.includes("prefers-reduced-motion")
          ? prefersReducedMotion
          : false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  );
}
