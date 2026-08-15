"use client";

import { useSettings } from "@ashee/settings";
import {
  type Radius,
  type ShadowConfig,
  useResponsiveVars,
} from "@ashee/theme";
import { cn } from "@ashee/utils";
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
  useMemo,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../../shared/variant";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { defaultTooltipSizeScale } from "./default-tooltip-config";
import { flattenTooltipSizeScale } from "./flatten-tooltip-size-scale";
import type {
  TooltipConfig,
  TooltipPlacement,
  TooltipSizeKey,
} from "./tooltip-config";

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
  const { settings } = useSettings();
  const sectionConfig = config.components?.tooltip as TooltipConfig | undefined;
  const arrowRef = useRef<SVGSVGElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  // Responsive Size Scale Engine
  const sizeScale = sectionConfig?.size ?? defaultTooltipSizeScale;
  const resolvedSizeKey = size ?? sizeScale.default;
  const responsiveVars = useMemo(
    () => flattenTooltipSizeScale(sizeScale),
    [sizeScale],
  );
  useResponsiveVars(
    "ashee-tooltip-tokens",
    responsiveVars,
    config.theme.breakpoints,
  );

  // Resolvers
  const resolvedPlacement = resolveValue(
    placement,
    sectionConfig?.placement,
    "top",
  );
  const resolvedVariant = resolveValue(
    variant,
    sectionConfig?.variant,
    config.theme.defaultVariant ?? "solid",
  );
  const resolvedColor = resolveValue(color, sectionConfig?.color, "secondary");
  const resolvedDelay = resolveValue(delay, sectionConfig?.delay, 200);
  const resolvedOffset = resolveValue(offsetProp, sectionConfig?.offset, 8);
  const resolvedShowArrow = resolveValue(
    showArrow,
    sectionConfig?.showArrow,
    false,
  );

  const resolvedRadiusKey = typeof radius === "string" ? radius : undefined;
  const resolvedSectionRadiusKey =
    typeof sectionConfig?.radius === "string"
      ? sectionConfig.radius
      : undefined;
  const resolvedRadius = resolveScale(
    resolvedRadiusKey,
    resolvedSectionRadiusKey,
    config.theme.radius.default,
    config.theme.radius.values,
  );

  const resolvedShadowKey = typeof shadow === "string" ? shadow : undefined;
  const resolvedSectionShadowKey =
    typeof sectionConfig?.shadow === "string"
      ? sectionConfig.shadow
      : undefined;
  const resolvedShadow = resolveScale(
    resolvedShadowKey,
    resolvedSectionShadowKey,
    "md",
    config.theme.shadow.values,
  );

  const motionProps = resolveAnimation(
    animation ?? sectionConfig?.animation ?? "scale",
    settings.enableAnimations,
  );

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
                  "font-medium border whitespace-nowrap select-none",
                  resolveVariantClass(resolvedVariant, resolvedColor),
                  sectionConfig?.className,
                  className,
                )}
                style={{
                  borderRadius: resolvedRadius,
                  boxShadow: resolvedShadow,
                  paddingInline: `var(--ashee-tooltip-${resolvedSizeKey}-padding-x)`,
                  paddingBlock: `var(--ashee-tooltip-${resolvedSizeKey}-padding-y)`,
                  fontSize: `var(--ashee-tooltip-${resolvedSizeKey}-font-size)`,
                }}
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
