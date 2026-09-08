/**
 * Tooltip component for AsheeUI.
 * This file provides the main Tooltip component implementation, which renders
 * a floating tooltip that appears on hover or focus of a child element. It
 * supports configurable placement, delay, offset, radius, arrow, and styling
 * through the standard AsheeUI cascade system. The component uses Floating UI
 * for positioning and accessibility.
 */
"use client";

import {
  arrow,
  autoUpdate,
  FloatingArrow,
  FloatingPortal,
  flip,
  offset as floatingOffset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import {
  type Color,
  RADIUS_CLASS,
  resolveVariantClass,
  type Variant,
} from "../../shared";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  FALLBACK_TOOLTIP_CONFIG,
  type TooltipConfig,
  type TooltipPlacement,
  type TooltipSizeKey,
} from "./tooltip-config";
import {
  TOOLTIP_FONT_CLASS,
  TOOLTIP_PADDING_X_CLASS,
  TOOLTIP_PADDING_Y_CLASS,
} from "./tooltip-styles";

type BaseTooltipProps = TooltipConfig;

/**
 * Configuration options for the Tooltip component.
 */
export interface TooltipProps extends BaseTooltipProps {
  /**
   * The content to display inside the tooltip.
   * When empty or null, the tooltip is not shown.
   */
  content: ReactNode;

  /**
   * The child element that triggers the tooltip.
   * Can be any React element or a string.
   */
  children: ReactElement | ReactNode;

  /**
   * Whether the tooltip is disabled.
   * When true, the tooltip does not appear on hover or focus.
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Extra classes applied to every tooltip instance.
   *
   * @default ""
   */
  className?: string;

  /**
   * Whether to render the tooltip in a Floating UI portal.
   * When true, the tooltip is rendered at the document body level,
   * escaping any parent DOM hierarchy. Defaults to true.
   */
  portal?: boolean;
}

/**
 * A floating tooltip that appears on hover or focus of a child element.
 *
 * Tooltip renders a floating popup with additional information that appears
 * when the user hovers or focuses the trigger element. It supports configurable
 * placement, delay, offset, radius, arrow, and styling through the standard
 * AsheeUI cascade system.
 *
 * The component uses Floating UI for positioning and accessibility, and
 * automatically handles viewport edge detection and flipping. It is fully
 * accessible with keyboard focus support.
 *
 * By default, the tooltip uses FloatingPortal to render at the document body
 * level. This ensures the tooltip escapes CSS containment, overflow clipping,
 * and stacking context issues. The portal can be disabled via the `portal` prop
 * or `components.tooltip.portal` in the config if the tooltip needs to stay
 * within a specific parent container.
 *
 * @param props - Tooltip configuration options.
 * @param props.content - The content to display inside the tooltip.
 * @param props.children - The child element that triggers the tooltip.
 * @param props.isDisabled - Whether the tooltip is disabled. Defaults to false.
 * @param props.variant - Visual style variant. Defaults to "solid".
 * @param props.color - Theme accent color. Defaults to "secondary".
 * @param props.size - Size scale. Defaults to "md".
 * @param props.placement - Placement relative to the trigger. Defaults to "top".
 * @param props.delay - Delay before showing/hiding. Defaults to 200.
 * @param props.offset - Offset from the trigger. Defaults to 8.
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.showArrow - Whether to show a pointer arrow. Defaults to false.
 * @param props.portal - Whether to render the tooltip in a portal. Defaults to true.
 * @param props.className - Extra classes for the tooltip.
 *
 * @example
 * ```tsx
 * import { Tooltip, Button } from "asheeui";
 *
 * export function Example() {
 *   return (
 *     <Tooltip content="This is a tooltip">
 *       <Button>Hover me</Button>
 *     </Tooltip>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom placement and arrow
 * <Tooltip
 *   content="Delete this item"
 *   placement="bottom"
 *   showArrow
 *   color="danger"
 * >
 *   <TrashIcon />
 * </Tooltip>
 * ```
 *
 * @see TooltipConfig - The configuration type for component defaults.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      variant,
      color,
      size,
      placement,
      delay,
      offset: offsetProp,
      radius,
      showArrow,
      isDisabled = false,
      className,
      portal: portalProp,
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.tooltip;
    const arrowRef = useRef<SVGSVGElement>(null);

    const [isOpen, setIsOpen] = useState(false);

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<TooltipSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_TOOLTIP_CONFIG.size,
    );

    const resolvedPlacement = resolveCascade<TooltipPlacement>(
      placement,
      sectionConfig?.placement,
      undefined,
      FALLBACK_TOOLTIP_CONFIG.placement,
    );

    const resolvedVariantKey = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_TOOLTIP_CONFIG.variant,
    );

    const resolvedColorKey = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_TOOLTIP_CONFIG.color,
    );

    const resolvedDelay = resolveCascade<
      number | { open?: number; close?: number }
    >(delay, sectionConfig?.delay, undefined, FALLBACK_TOOLTIP_CONFIG.delay);

    const resolvedOffset = resolveCascade<number>(
      offsetProp,
      sectionConfig?.offset,
      undefined,
      FALLBACK_TOOLTIP_CONFIG.offset,
    );

    const resolvedShowArrow = resolveCascade<boolean>(
      showArrow,
      sectionConfig?.showArrow,
      undefined,
      FALLBACK_TOOLTIP_CONFIG.showArrow,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_TOOLTIP_CONFIG.radius,
    );

    const resolvedPortal = resolveCascade<boolean>(
      portalProp,
      sectionConfig?.portal,
      undefined,
      FALLBACK_TOOLTIP_CONFIG.portal,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const paddingXClass = resolveClassKey(
      resolvedSizeKey,
      TOOLTIP_PADDING_X_CLASS,
      FALLBACK_TOOLTIP_CONFIG.size,
    );

    const paddingYClass = resolveClassKey(
      resolvedSizeKey,
      TOOLTIP_PADDING_Y_CLASS,
      FALLBACK_TOOLTIP_CONFIG.size,
    );

    const fontClass = resolveClassKey(
      resolvedSizeKey,
      TOOLTIP_FONT_CLASS,
      FALLBACK_TOOLTIP_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey,
      RADIUS_CLASS,
      FALLBACK_TOOLTIP_CONFIG.radius,
    );

    // ─── Floating UI Setup ───────────────────────────────────────────────────

    const middleware = [
      floatingOffset(resolvedOffset),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
    ];

    if (resolvedShowArrow) {
      middleware.push(arrow({ element: arrowRef }));
    }

    const { refs, floatingStyles, context } = useFloating({
      open: isOpen && !isDisabled,
      onOpenChange: setIsOpen,
      placement: resolvedPlacement,
      whileElementsMounted: autoUpdate,
      middleware,
    });

    const hover = useHover(context, {
      delay: resolvedDelay,
      enabled: !isDisabled,
    });
    const focus = useFocus(context, { enabled: !isDisabled });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "tooltip" });

    const { getReferenceProps, getFloatingProps } = useInteractions([
      hover,
      focus,
      dismiss,
      role,
    ]);

    const trigger = isValidElement(children) ? (
      cloneElement(
        children,
        getReferenceProps({
          ref: refs.setReference,
          ...(children.props as Record<string, unknown>),
        }),
      )
    ) : (
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className="inline-flex">
        {children}
      </span>
    );

    if (!content || isDisabled) {
      return <>{children}</>;
    }

    // ─── Render Tooltip Content ─────────────────────────────────────────────

    const tooltipContent = (
      <div
        ref={(node) => {
          refs.setFloating(node);
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        style={floatingStyles}
        className="z-50 pointer-events-none"
        {...getFloatingProps()}>
        <div
          className={cn(
            "font-medium border whitespace-nowrap select-none bg-background shadow-md transition-all duration-150 ease-out animate-in fade-in-0 zoom-in-95",
            paddingXClass,
            paddingYClass,
            fontClass,
            radiusClass,
            resolveVariantClass(resolvedVariantKey, resolvedColorKey),
            className,
          )}>
          {content}
          {resolvedShowArrow && (
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="fill-current text-border"
            />
          )}
        </div>
      </div>
    );

    return (
      <>
        {trigger}
        {resolvedPortal ? (
          <FloatingPortal>{tooltipContent}</FloatingPortal>
        ) : (
          tooltipContent
        )}
      </>
    );
  },
);

Tooltip.displayName = "Tooltip";
