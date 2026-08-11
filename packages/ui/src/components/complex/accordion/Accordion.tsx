"use client";

import { useSettings } from "@ashee/settings";
import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, useId, useMemo, useState } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import type {
  AccordionConfig,
  AccordionItem,
  AccordionSizeKey,
  AccordionSizeScale,
  AccordionVariant,
} from "./accordion-config";
import { defaultAccordionSizeScale } from "./default-accordion-config";
import { flattenAccordionSizeScale } from "./flatten-accordion-size-scale";

const VARIANT_CONTAINER_CLASS: Record<AccordionVariant, string> = {
  bordered: "border border-border divide-y divide-border overflow-hidden",
  separated: "space-y-3",
  flush: "divide-y divide-border border-y border-border",
  ghost: "space-y-1",
};

const VARIANT_ITEM_CLASS: Record<AccordionVariant, string> = {
  bordered: "bg-card transition-colors hover:bg-muted/30",
  separated:
    "border border-border bg-card transition-colors hover:bg-muted/30 shadow-xs",
  flush: "bg-transparent transition-colors hover:bg-muted/20",
  ghost: "bg-transparent hover:bg-muted/50 transition-colors",
};

// ─── Props Interface ──────────────────────────────────────────────────────────

export interface AccordionProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "value" | "defaultValue" | "onChange"
  > {
  items: AccordionItem[];
  variant?: AccordionVariant;
  size?: AccordionSizeKey;
  radius?: keyof Radius;
  animation?: AnimationProp;
  allowMultiple?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string[]) => void;
  expandIcon?: React.ReactNode;
  disableAnimation?: boolean;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items = [],
      variant,
      size,
      radius,
      animation,
      allowMultiple,
      defaultValue,
      value: controlledValue,
      onValueChange,
      expandIcon,
      disableAnimation = false,
      itemClassName,
      headerClassName,
      contentClassName,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const { settings } = useSettings();
    const sectionConfig = config.components?.accordion as
      | AccordionConfig
      | undefined;

    const generatedId = useId();
    const accordionId = id ?? generatedId;

    // Design Token Resolvers
    const sizeScale = (sectionConfig?.size ??
      defaultAccordionSizeScale) as AccordionSizeScale;
    const resolvedSizeKey = size ?? sizeScale.default;
    const responsiveVars = useMemo(
      () => flattenAccordionSizeScale(sizeScale),
      [sizeScale],
    );
    useResponsiveVars(
      "ashee-accordion-tokens",
      responsiveVars,
      config.theme.breakpoints,
    );

    const resolvedVariant = resolveValue<AccordionVariant>(
      variant,
      sectionConfig?.variant,
      "separated",
    );

    const resolvedAllowMultiple =
      allowMultiple ?? sectionConfig?.allowMultiple ?? false;

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

    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
      settings.enableAnimations,
    );

    // Controlled vs Uncontrolled State
    const isControlled = controlledValue !== undefined;

    const normalizeValue = (val: string | string[] | undefined): string[] => {
      if (val === undefined) return [];
      return Array.isArray(val) ? val : [val];
    };

    const [internalValue, setInternalValue] = useState<string[]>(() =>
      normalizeValue(defaultValue),
    );

    const activeKeys = isControlled
      ? normalizeValue(controlledValue)
      : internalValue;

    const handleToggle = (key: string, disabled?: boolean) => {
      if (disabled) return;

      let nextKeys: string[];
      const isOpen = activeKeys.includes(key);

      if (isOpen) {
        nextKeys = activeKeys.filter((k) => k !== key);
      } else {
        nextKeys = resolvedAllowMultiple ? [...activeKeys, key] : [key];
      }

      if (!isControlled) {
        setInternalValue(nextKeys);
      }
      onValueChange?.(nextKeys);
    };

    return (
      <div
        ref={ref}
        id={accordionId}
        className={cn(
          "w-full",
          VARIANT_CONTAINER_CLASS[resolvedVariant],
          sectionConfig?.className,
          className,
        )}
        style={{
          borderRadius:
            resolvedVariant !== "flush" && resolvedVariant !== "ghost"
              ? resolvedRadius
              : undefined,
        }}
        {...props}>
        {items.map((item, index) => {
          const itemKey = item.id || `item-${index}`;
          const isOpen = activeKeys.includes(itemKey);
          const headerId = `${accordionId}-header-${itemKey}`;
          const contentId = `${accordionId}-content-${itemKey}`;

          return (
            <div
              key={itemKey}
              className={cn(
                "overflow-hidden transition-colors",
                VARIANT_ITEM_CLASS[resolvedVariant],
                itemClassName,
              )}
              style={{
                borderRadius:
                  resolvedVariant === "separated" || resolvedVariant === "ghost"
                    ? resolvedRadius
                    : undefined,
              }}>
              {/* Trigger Button */}
              <button
                id={headerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={contentId}
                disabled={item.disabled}
                onClick={() => handleToggle(itemKey, item.disabled)}
                className={cn(
                  "w-full text-left flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none",
                  headerClassName,
                )}
                style={{
                  paddingInline: `var(--ashee-accordion-${resolvedSizeKey}-padding-x)`,
                  paddingBlock: `var(--ashee-accordion-${resolvedSizeKey}-padding-y)`,
                  fontSize: `var(--ashee-accordion-${resolvedSizeKey}-font-s)`,
                }}>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {item.icon && (
                    <span className="shrink-0 text-muted-foreground">
                      {item.icon}
                    </span>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold truncate">{item.title}</span>
                    {item.subtitle && (
                      <span className="text-xs text-muted-foreground truncate">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rotating Expand Indicator */}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={
                    disableAnimation
                      ? { duration: 0 }
                      : { duration: 0.2, ease: "easeInOut" }
                  }
                  className="text-muted-foreground shrink-0 ml-2">
                  {expandIcon || <ChevronDownIcon className="w-4 h-4" />}
                </motion.div>
              </button>

              {/* Expandable Content Panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={contentId}
                    role="region"
                    aria-labelledby={headerId}
                    initial={
                      disableAnimation
                        ? { height: "auto" }
                        : { height: 0, opacity: 0 }
                    }
                    animate={{ height: "auto", opacity: 1 }}
                    exit={
                      disableAnimation
                        ? { height: 0 }
                        : { height: 0, opacity: 0 }
                    }
                    transition={
                      disableAnimation
                        ? { duration: 0 }
                        : {
                            height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.2 },
                          }
                    }
                    className="overflow-hidden"
                    {...(motionProps as HTMLMotionProps<"div">)}>
                    <div
                      className={cn(
                        "text-muted-foreground leading-relaxed pt-0",
                        contentClassName,
                      )}
                      style={{
                        paddingInline: `var(--ashee-accordion-${resolvedSizeKey}-padding-x)`,
                        paddingBottom: `var(--ashee-accordion-${resolvedSizeKey}-padding-y)`,
                        fontSize: `var(--ashee-accordion-${resolvedSizeKey}-font-s)`,
                      }}>
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  },
);

Accordion.displayName = "Accordion";
