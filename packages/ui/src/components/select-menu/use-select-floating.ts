// useSelectFloating.ts

/**
 * Shared Floating UI positioning and interaction hook for dropdowns and
 * menus. This file provides a reusable hook that configures Floating UI
 * for dropdown components like Select, MultiSelect, and Autocomplete.
 * It handles positioning, flipping, shifting, size management, and the
 * standard click/dismiss/role interaction wiring, with consistent
 * defaults across the library.
 */

"use client";

import type { UseInteractionsReturn } from "@floating-ui/react";
import {
  autoUpdate,
  flip,
  offset,
  type Placement,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";

/**
 * Configuration options for the useSelectFloating hook.
 * Controls the floating element's behavior, positioning, size, and
 * interaction wiring (click-to-open, dismiss, and ARIA role).
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
   * When true, the floating element does not open and click interaction
   * is disabled.
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

  /**
   * ARIA role applied to the floating element via useRole.
   * "listbox" fits Select/MultiSelect/Autocomplete; a component like
   * DatePicker reusing this hook can pass "dialog" instead.
   *
   * @default "listbox"
   */
  role?: "listbox" | "menu" | "dialog" | "tooltip" | "grid" | "tree";
}

/**
 * Return value of useSelectFloating. Combines Floating UI's positioning
 * context with the resolved interaction prop-getters, so consumers don't
 * need to wire useClick/useDismiss/useRole/useInteractions themselves.
 */
export interface UseSelectFloatingReturn<T extends HTMLElement> {
  refs: ReturnType<typeof useFloating<T>>["refs"];
  context: ReturnType<typeof useFloating<T>>["context"];
  floatingStyles: React.CSSProperties;
  isPositioned: boolean;
  getReferenceProps: UseInteractionsReturn["getReferenceProps"];
  getFloatingProps: UseInteractionsReturn["getFloatingProps"];
}

/**
 * Shared Floating UI positioning and interaction hook for dropdowns and
 * menus. Generic `T` allows passing `HTMLButtonElement`, `HTMLInputElement`,
 * etc.
 *
 * This hook configures Floating UI with sensible defaults for dropdown
 * components: viewport edge detection via flip and shift middleware,
 * optional width matching of the reference element, and the standard
 * click-to-open / dismiss / ARIA role interaction set via useInteractions.
 * Consumers get back ready-to-spread `getReferenceProps`/`getFloatingProps`
 * instead of wiring useClick/useDismiss/useRole themselves.
 *
 * @param props - Configuration options for the floating element.
 * @param props.isOpen - Whether the floating element is open.
 * @param props.onOpenChange - Callback fired when open state changes.
 * @param props.disabled - Whether the floating element is disabled. Defaults to false.
 * @param props.placement - Preferred placement. Defaults to "bottom-start".
 * @param props.offsetDistance - Distance from reference in pixels. Defaults to 4.
 * @param props.padding - Viewport padding for shift middleware. Defaults to 8.
 * @param props.matchReferenceWidth - Whether to match reference width. Defaults to true.
 * @param props.role - ARIA role for the floating element. Defaults to "listbox".
 * @returns Floating UI refs/context/styles plus `isPositioned` and the
 * resolved `getReferenceProps`/`getFloatingProps` prop-getters.
 *
 * @example
 * ```tsx
 * const { refs, context, floatingStyles, getReferenceProps, getFloatingProps } =
 *   useSelectFloating({
 *     isOpen,
 *     onOpenChange: setIsOpen,
 *     disabled: props.disabled,
 *   });
 *
 * return (
 *   <>
 *     <button ref={refs.setReference} {...getReferenceProps()}>Toggle</button>
 *     {isOpen && (
 *       <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
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
  role = "listbox",
}: UseSelectFloatingProps): UseSelectFloatingReturn<T> {
  const floating = useFloating<T>({
    open: isOpen,
    onOpenChange: (open) => !disabled && onOpenChange(open),
    placement,
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetDistance),
      flip(),
      shift({ padding }),
      size({
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

  const { context } = floating;

  const click = useClick(context, { enabled: !disabled });
  const dismiss = useDismiss(context);
  const roleInteraction = useRole(context, { role });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    roleInteraction,
  ]);

  return {
    refs: floating.refs,
    context,
    floatingStyles: floating.floatingStyles,
    isPositioned: floating.isPositioned,
    getReferenceProps,
    getFloatingProps,
  };
}
