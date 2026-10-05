/**
 * Isomorphic layout effect hook for AsheeUI.
 * This file provides a hook that safely uses useLayoutEffect on the client
 * and useEffect on the server (or during SSR). This prevents hydration
 * warnings and ensures DOM-measuring effects only run in the browser.
 */

import { useEffect, useLayoutEffect } from "react";

/**
 * A hook that resolves to useLayoutEffect in browser environments
 * and useEffect in server environments.
 * This is useful for effects that need to measure or manipulate the DOM
 * but must also work during server-side rendering.
 *
 * @example
 * ```tsx
 * useIsomorphicLayoutEffect(() => {
 *   // This will run synchronously in the browser but safely on the server
 *   const element = ref.current;
 *   if (element) {
 *     const height = element.offsetHeight;
 *     // Do something with the measurement
 *   }
 * }, [ref]);
 * ```
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
