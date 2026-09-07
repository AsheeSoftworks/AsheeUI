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
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../shared/variant";
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

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement | ReactNode;
  variant?: Variant;
  color?: Color;
  size?: TooltipSizeKey;
  placement?: TooltipPlacement;
  delay?: number | { open?: number; close?: number };
  offset?: number;
  radius?: Radius;
  showArrow?: boolean;
  isDisabled?: boolean;
  className?: string;
}

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
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.tooltip as
      | TooltipConfig
      | undefined;
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

    const resolvedVariant = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant as Variant | undefined,
      FALLBACK_TOOLTIP_CONFIG.variant,
    );

    const resolvedColor = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor as Color | undefined,
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
      config.defaultRadius as Radius,
      FALLBACK_TOOLTIP_CONFIG.radius,
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

    return (
      <>
        {trigger}
        <FloatingPortal>
          {isOpen && (
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
                  resolveVariantClass(resolvedVariant, resolvedColor),
                  sectionConfig?.className,
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
          )}
        </FloatingPortal>
      </>
    );
  },
);

Tooltip.displayName = "Tooltip";
