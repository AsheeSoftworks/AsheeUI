/**
 * Reduced-motion preference for AsheeUI.
 *
 * Continuous or automatic motion (a marquee loop, carousel autoplay and
 * transitions) must yield to the operating system's reduced-motion preference
 * (`REQ-089`). Components read the preference through this hook instead of each
 * one querying the media query themselves, so the behaviour is defined once and
 * is observable in a test.
 */

"use client";

import { useEffect, useState } from "react";

/** Media query that reports the user's reduced-motion preference. */
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Reports whether the user asked for reduced motion.
 *
 * The preference is read after mount, so server rendering always produces the
 * motion-safe markup and hydration never mismatches. Without a `matchMedia`
 * implementation the preference is reported as `false`, which keeps the
 * component's own behaviour unchanged.
 *
 * @returns `true` while the user prefers reduced motion.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const query = window.matchMedia(REDUCED_MOTION_QUERY);

    setPrefersReducedMotion(query.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    query.addEventListener("change", handleChange);

    return () => query.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
