"use client";

import { cn } from "@asheeui/utils";
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
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { resolveAnimation } from "../../motion/resolve-animation";
import type { AnimationProp } from "../../motion/types";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../shared/variant";
import type { Radius } from "../../theme/radius/radius-config";
import type { ShadowConfig } from "../../theme/shadow/shadow-config";
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
  TOOLTIP_RADIUS_CLASS,
  TOOLTIP_SHADOW_CLASS,
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
  radius?: keyof Radius;
  shadow?: keyof ShadowConfig["values"];
  animation?: AnimationProp;
  showArrow?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export function Tooltip({
  content,
  children,
  variant,
  color,
  size,
  placement,
  delay,
  offset: offsetProp,
  radius,
  shadow,
  animation,
  showArrow,
  isDisabled = false,
  className,
}: TooltipProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.tooltip as TooltipConfig | undefined;
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
    config.theme.defaultVariant,
    FALLBACK_TOOLTIP_CONFIG.variant,
  );

  const resolvedColor = resolveCascade<Color>(
    color,
    sectionConfig?.color,
    config.theme.defaultColor as Color | undefined,
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

  const resolvedAnimation = resolveCascade<AnimationProp>(
    animation,
    sectionConfig?.animation,
    undefined,
    FALLBACK_TOOLTIP_CONFIG.animation,
  );

  const resolvedRadiusKey = resolveRadiusKey(
    radius,
    sectionConfig,
    config.theme.radius?.default,
    FALLBACK_TOOLTIP_CONFIG.radius,
  );

  const resolvedShadowKey = resolveCascade<keyof ShadowConfig["values"]>(
    shadow,
    sectionConfig?.shadow,
    undefined,
    FALLBACK_TOOLTIP_CONFIG.shadow,
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
    TOOLTIP_RADIUS_CLASS,
    FALLBACK_TOOLTIP_CONFIG.radius,
  );

  const shadowClass = resolveClassKey(
    resolvedShadowKey,
    TOOLTIP_SHADOW_CLASS,
    FALLBACK_TOOLTIP_CONFIG.shadow,
  );

  const motionProps = resolveAnimation(resolvedAnimation);

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
        <AnimatePresence>
          {isOpen && (
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="z-50 pointer-events-none"
              {...getFloatingProps()}>
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className={cn(
                  "font-medium border whitespace-nowrap select-none bg-background",
                  paddingXClass,
                  paddingYClass,
                  fontClass,
                  radiusClass,
                  shadowClass,
                  resolveVariantClass(resolvedVariant, resolvedColor),
                  sectionConfig?.className,
                  className,
                )}
                {...(motionProps as HTMLMotionProps<"div">)}>
                {content}
                {resolvedShowArrow && (
                  <FloatingArrow
                    ref={arrowRef}
                    context={context}
                    className="fill-current text-border"
                  />
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
}

Tooltip.displayName = "Tooltip";
