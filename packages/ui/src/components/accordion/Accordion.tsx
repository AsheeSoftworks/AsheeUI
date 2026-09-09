/**
 * Accordion component for AsheeUI.
 * This file provides the main Accordion component implementation, which renders
 * a vertically stacked set of expandable sections. It supports single and
 * multi-open modes, controlled or uncontrolled state, keyboard navigation,
 * and disabled items. The component uses the cascade resolution system for
 * its visual tokens and follows AsheeUI's accessibility patterns.
 */
"use client";

import {
  forwardRef,
  type ReactNode,
  useCallback,
  useId,
  useState,
} from "react";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS } from "../../shared";
import { cn } from "../../utils";
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

type BaseAccordionProps = AccordionConfig &
  Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "value" | "defaultValue" | "onChange"
  >;

/**
 * Configuration options for the Accordion component.
 */
export interface AccordionProps extends BaseAccordionProps {
  /**
   * The accordion items to render.
   * Each item must have a title and content, with optional id, subtitle,
   * icon, and disabled state.
   *
   * @default []
   */
  items: AccordionItem[];

  /**
   * Default open item keys for uncontrolled usage.
   * Can be a single key or array of keys when allowMultiple is true.
   */
  defaultValue?: string | string[];

  /**
   * Controlled open item keys.
   *
   * When provided, the component becomes controlled and updates are
   * reported through `onValueChange`.
   */
  value?: string | string[];

  /**
   * Callback fired with the current open item keys.
   * Called whenever the open state changes.
   */
  onValueChange?: (value: string[]) => void;

  /**
   * Custom node rendered as the expand indicator.
   *
   * Defaults to a rotating chevron-down icon.
   */
  expandIcon?: ReactNode;

  /**
   * Extra classes applied to each item container.
   */
  itemClassName?: string;

  /**
   * Extra classes applied to each header trigger button.
   */
  headerClassName?: string;

  /**
   * Extra classes applied to each content panel.
   */
  contentClassName?: string;
}

// ─── Component Implementation ─────────────────────────────────────────────────

/**
 * A vertically stacked set of expandable sections for showing content
 * in a compact, space-efficient way.
 *
 * Accordion supports single and multi-open modes, controlled or
 * uncontrolled open state, keyboard navigation, and disabled items.
 * Visual tokens (`variant`, `size`, `radius`, `allowMultiple`) resolve
 * through the standard AsheeUI cascade: prop, component config, global
 * theme defaults, and finally the built-in fallback.
 *
 * The component automatically handles accessibility attributes including
 * aria-expanded, aria-controls, and proper keyboard interaction. Each
 * item's header acts as a button that toggles the visibility of its
 * corresponding content panel.
 *
 * @param props - Accordion configuration options and HTML div element props.
 * @param props.items - Accordion items to render.
 * @param props.variant - Visual style variant. Defaults to "separated".
 * @param props.size - Density scale. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.allowMultiple - Allow multiple open items. Defaults to false.
 * @param props.defaultValue - Uncontrolled initial open keys.
 * @param props.value - Controlled open keys.
 * @param props.onValueChange - Change callback with open keys.
 * @param props.expandIcon - Custom expand indicator node.
 * @param props.disableAnimation - Disable animations. Defaults to false.
 * @param props.itemClassName - Extra classes for each item.
 * @param props.headerClassName - Extra classes for each header.
 * @param props.contentClassName - Extra classes for each content panel.
 * @param props.className - Extra classes for the container.
 * @param props.style - Inline styles for the container.
 * @param props.id - Optional ID for the container element.
 *
 * @example
 * ```tsx
 * import { Accordion } from "asheeui";
 *
 * export function Example() {
 *   return (
 *     <Accordion
 *       variant="separated"
 *       items={[
 *         { title: "What is AsheeUI?", content: "A React component library." },
 *         { title: "Is it free?", content: "Yes, it is MIT licensed." },
 *       ]}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Controlled accordion with multiple open items
 * const [openItems, setOpenItems] = useState(['item-1']);
 *
 * <Accordion
 *   value={openItems}
 *   onValueChange={setOpenItems}
 *   allowMultiple
 *   items={items}
 * />
 * ```
 *
 * @see AccordionConfig - The configuration type for component defaults.
 * @see AccordionItem - The structure of a single accordion item.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
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
    const sectionConfig = config.components?.accordion;

    const generatedId = useId();
    const accordionId = id ?? generatedId;

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<AccordionSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_ACCORDION_CONFIG.size,
    );

    const resolvedVariantKey = resolveCascade<AccordionVariant>(
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
      ACCORDION_VARIANT_CONTAINER_CLASS[resolvedVariantKey] ??
      ACCORDION_VARIANT_CONTAINER_CLASS.separated;

    const itemVariantClass =
      ACCORDION_VARIANT_ITEM_CLASS[resolvedVariantKey] ??
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
          resolvedVariantKey !== "ghost" &&
            resolvedVariantKey !== "flush" &&
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
                (resolvedVariantKey === "separated" ||
                  resolvedVariantKey === "ghost") &&
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
                <div className="scrollbar-hide overflow-hidden w-full">
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
