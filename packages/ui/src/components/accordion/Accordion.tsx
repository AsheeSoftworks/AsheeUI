"use client";

import { cn } from "@asheeui/utils";
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useId,
  useState,
} from "react";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import { useAsheeConfig } from "../../libs/context";
import { resolveAnimation } from "../../motion/resolve-animation";
import type { AnimationProp } from "../../motion/types";
import type { Radius } from "../../theme/radius/radius-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  type AccordionConfig,
  type AccordionItem,
  type AccordionSizeKey,
  type AccordionVariant,
  FALLBACK_ACCORDION_CONFIG,
} from "./accordion-config";
import {
  ACCORDION_CONTENT_SIZE_CLASS,
  ACCORDION_HEADER_SIZE_CLASS,
  ACCORDION_RADIUS_CLASS,
  ACCORDION_VARIANT_CONTAINER_CLASS,
  ACCORDION_VARIANT_ITEM_CLASS,
} from "./accordion-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

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
  expandIcon?: ReactNode;
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
      style,
      id,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.accordion as
      | AccordionConfig
      | undefined;

    const generatedId = useId();
    const accordionId = id ?? generatedId;

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<AccordionSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_ACCORDION_CONFIG.size,
    );

    const resolvedVariant = resolveCascade<AccordionVariant>(
      variant,
      sectionConfig?.variant,
      config.theme.defaultVariant as AccordionVariant | undefined,
      FALLBACK_ACCORDION_CONFIG.variant,
    );

    const resolvedAllowMultiple = resolveCascade<boolean>(
      allowMultiple,
      sectionConfig?.allowMultiple,
      undefined,
      FALLBACK_ACCORDION_CONFIG.allowMultiple,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      typeof radius === "string" ? radius : undefined,
      typeof sectionConfig?.radius === "string" ? sectionConfig : undefined,
      config.theme.radius?.default,
      FALLBACK_ACCORDION_CONFIG.radius,
    );

    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const containerVariantClass =
      ACCORDION_VARIANT_CONTAINER_CLASS[resolvedVariant] ??
      ACCORDION_VARIANT_CONTAINER_CLASS.separated;

    const itemVariantClass =
      ACCORDION_VARIANT_ITEM_CLASS[resolvedVariant] ??
      ACCORDION_VARIANT_ITEM_CLASS.separated;

    const headerSizeClass = resolveClassKey(
      resolvedSizeKey,
      ACCORDION_HEADER_SIZE_CLASS,
      FALLBACK_ACCORDION_CONFIG.size,
    );

    const contentSizeClass = resolveClassKey(
      resolvedSizeKey,
      ACCORDION_CONTENT_SIZE_CLASS,
      FALLBACK_ACCORDION_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey,
      ACCORDION_RADIUS_CLASS,
      FALLBACK_ACCORDION_CONFIG.radius,
    );

    // Controlled vs Uncontrolled State
    const isControlled = controlledValue !== undefined;

    const normalizeValue = useCallback(
      (val: string | string[] | undefined): string[] => {
        if (val === undefined) return [];
        return Array.isArray(val) ? val : [val];
      },
      [],
    );

    const [internalValue, setInternalValue] = useState<string[]>(() =>
      normalizeValue(defaultValue),
    );

    const activeKeys = isControlled
      ? normalizeValue(controlledValue)
      : internalValue;

    const handleToggle = useCallback(
      (key: string, disabled?: boolean) => {
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
      },
      [activeKeys, isControlled, onValueChange, resolvedAllowMultiple],
    );

    return (
      <div
        ref={ref}
        id={accordionId}
        className={cn(
          "w-full",
          containerVariantClass,
          resolvedVariant !== "flush" &&
            resolvedVariant !== "ghost" &&
            radiusClass,
          sectionConfig?.className,
          className,
        )}
        style={style}
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
                itemVariantClass,
                (resolvedVariant === "separated" ||
                  resolvedVariant === "ghost") &&
                  radiusClass,
                itemClassName,
              )}>
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
                  headerSizeClass,
                  headerClassName,
                )}>
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
                            height: {
                              duration: 0.25,
                              ease: [0.16, 1, 0.3, 1],
                            },
                            opacity: { duration: 0.2 },
                          }
                    }
                    className="overflow-hidden"
                    {...(motionProps as HTMLMotionProps<"div">)}>
                    <div
                      className={cn(
                        "text-muted-foreground leading-relaxed pt-0",
                        contentSizeClass,
                        contentClassName,
                      )}>
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
