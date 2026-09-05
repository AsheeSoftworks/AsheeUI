"use client";

import { cn } from "@asheeui/utils";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useId,
  useState,
} from "react";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
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
  radius?: Radius;
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
      config.defaultVariant as AccordionVariant | undefined,
      FALLBACK_ACCORDION_CONFIG.variant,
    );

    const resolvedAllowMultiple = resolveCascade<boolean>(
      allowMultiple,
      sectionConfig?.allowMultiple,
      undefined,
      FALLBACK_ACCORDION_CONFIG.allowMultiple,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_ACCORDION_CONFIG.radius,
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
      RADIUS_CLASS,
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
          resolvedVariant !== "ghost" &&
            resolvedVariant !== "flush" &&
            radiusClass,
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
                "w-full transition-colors box-border",
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
                  "w-full min-w-full text-left flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none box-border",
                  headerSizeClass,
                  headerClassName,
                )}>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {item.icon && (
                    <span className="shrink-0 text-foreground/70">
                      {item.icon}
                    </span>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold truncate">{item.title}</span>
                    {item.subtitle && (
                      <span className="text-xs text-foreground/70 truncate">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rotating Expand Indicator */}
                <div
                  className={cn(
                    "text-foreground/70 shrink-0 ml-2 transition-transform duration-200 ease-in-out",
                    disableAnimation ? "transition-none" : "",
                    isOpen && "rotate-180",
                  )}>
                  {expandIcon || <ChevronDownIcon className="w-4 h-4" />}
                </div>
              </button>

              {/* Expandable Content Panel */}
              <section
                id={contentId}
                aria-labelledby={headerId}
                data-state={isOpen ? "open" : "closed"}
                className={cn(
                  "w-full grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  disableAnimation ? "transition-none" : "",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0 pointer-events-none",
                )}>
                <div className="overflow-hidden w-full">
                  <div
                    className={cn(
                      "text-foreground/70 leading-relaxed pt-0",
                      contentSizeClass,
                      contentClassName,
                    )}>
                    {item.content}
                  </div>
                </div>
              </section>
            </div>
          );
        })}
      </div>
    );
  },
);

Accordion.displayName = "Accordion";
