/**
 * Shared Floating UI positioning hook for dropdowns and menus.
 * This file provides a reusable hook that configures Floating UI for
 * dropdown components like Select, MultiSelect, and Autocomplete.
 * It handles positioning, flipping, shifting, and size management
 * with consistent defaults across the library.
 */

"use client";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  size as floatingSize,
  useFloating,
  type Placement,
  type UseFloatingReturn,
} from "@floating-ui/react";

/**
 * Configuration options for the useSelectFloating hook.
 * Controls the floating element's behavior, positioning, and size.
 */
export interface UseSelectFloatingProps {
  /**
   * Whether the floating element is open.
   * Controls visibility and triggers positioning calculations.
   */
  isOpen: boolean;

  /**
   * Callback fired when the open state changes.
   * Receives the new open state.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Whether the floating element is disabled.
   * When true, the floating element does not open.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Preferred placement of the floating element relative to the reference.
   * Floating UI will flip this automatically if there is insufficient space.
   *
   * @default "bottom-start"
   */
  placement?: Placement;

  /**
   * Distance in pixels between the reference and floating elements.
   *
   * @default 4
   */
  offsetDistance?: number;

  /**
   * Padding in pixels applied to the shift middleware.
   * Prevents the floating element from touching the viewport edges.
   *
   * @default 8
   */
  padding?: number;

  /**
   * Whether the floating element should match the width of the reference element.
   * When true, the floating element's width is set to the reference's width.
   *
   * @default true
   */
  matchReferenceWidth?: boolean;
}

/**
 * Shared Floating UI positioning hook for dropdowns and menus.
 * Generic `T` allows passing `HTMLButtonElement`, `HTMLInputElement`, etc.
 *
 * This hook configures Floating UI with sensible defaults for dropdown
 * components. It handles automatic position updates, viewport edge detection
 * via flip and shift middleware, and optional width matching of the
 * reference element.
 *
 * @param props - Configuration options for the floating element.
 * @param props.isOpen - Whether the floating element is open.
 * @param props.onOpenChange - Callback fired when open state changes.
 * @param props.disabled - Whether the floating element is disabled. Defaults to false.
 * @param props.placement - Preferred placement. Defaults to "bottom-start".
 * @param props.offsetDistance - Distance from reference in pixels. Defaults to 4.
 * @param props.padding - Viewport padding for shift middleware. Defaults to 8.
 * @param props.matchReferenceWidth - Whether to match reference width. Defaults to true.
 * @returns The Floating UI context including refs, styles, and middleware.
 *
 * @example
 * ```tsx
 * const { refs, floatingStyles, context } = useSelectFloating({
 *   isOpen,
 *   onOpenChange: setIsOpen,
 *   disabled: props.disabled,
 * });
 *
 * return (
 *   <>
 *     <button ref={refs.setReference}>Toggle</button>
 *     {isOpen && (
 *       <div ref={refs.setFloating} style={floatingStyles}>
 *         Content
 *       </div>
 *     )}
 *   </>
 * );
 * ```
 *
 * @see useFloating - The underlying Floating UI hook.
 * @see Select - The select component that uses this hook.
 */
export function useSelectFloating<T extends HTMLElement = HTMLElement>({
  isOpen,
  onOpenChange,
  disabled = false,
  placement = "bottom-start",
  offsetDistance = 4,
  padding = 8,
  matchReferenceWidth = true,
}: UseSelectFloatingProps): UseFloatingReturn<T> {
  return useFloating<T>({
    open: isOpen,
    onOpenChange: (open) => !disabled && onOpenChange(open),
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetDistance),
      flip(),
      shift({ padding }),
      floatingSize({
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            ...(matchReferenceWidth && {
              width: `${elements.reference.getBoundingClientRect().width}px`,
            }),
          });
        },
      }),
    ],
  });
}
