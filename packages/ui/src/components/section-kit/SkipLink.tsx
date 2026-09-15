/**
 * Skip link helper for AsheeUI.
 *
 * This file provides the internal `SkipLink` component: the first focusable
 * element of a page composition, which lets a keyboard reader pass repeated
 * navigation and land in the content. It is shared by the page compositions so
 * the behaviour (and the classes that hide it until it is focused) are written
 * once. It is an internal helper and is not part of the public component
 * inventory.
 */

import { cn } from "../../utils";

/**
 * Classes of the skip link.
 *
 * The link is visually hidden until it receives focus, which is the arrangement
 * a keyboard reader needs: it is the first thing Tab reaches, and it is
 * invisible to a pointer user until then.
 */
export const SKIP_LINK_CLASS =
  "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-primary";

/**
 * Props for the internal SkipLink helper.
 */
export interface SkipLinkProps {
  /**
   * Identifier of the region the link leads to.
   * The region is expected to be focusable (`tabIndex={-1}`), so following the
   * link moves the reader into the content rather than only scrolling to it.
   */
  targetId: string;

  /**
   * Wording of the link, which is also its accessible name.
   */
  label: string;

  /**
   * Additional classes for the anchor.
   */
  className?: string;
}

/**
 * Renders the skip link of a page composition.
 *
 * @param props - The destination, the wording and any extra classes.
 * @returns The rendered anchor.
 *
 * @example
 * ```tsx
 * <SkipLink targetId="main-content" label="Skip to content" />
 * ```
 */
export function SkipLink({ targetId, label, className }: SkipLinkProps) {
  return (
    <a href={`#${targetId}`} className={cn(SKIP_LINK_CLASS, className)}>
      {label}
    </a>
  );
}
