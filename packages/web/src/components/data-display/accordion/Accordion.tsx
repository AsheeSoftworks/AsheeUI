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
  ACCORDION_CONTENT_SIZE_CLASS,
  ACCORDION_HEADER_SIZE_CLASS,
  ACCORDION_VARIANT_CONTAINER_CLASS,
  ACCORDION_VARIANT_ITEM_CLASS,
  cn,
  RADIUS_CLASS,
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "@asheeui/core";
import {
  forwardRef,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";
import { ChevronDownIcon } from "../../../icons/ChevronDownIcon";
import { useAsheeConfig } from "../../../libs/context";
import {
  type AccordionConfig,
  type AccordionItem,
  type AccordionSizeKey,
  type AccordionVariant,
  FALLBACK_ACCORDION_CONFIG,
} from "./accordion-config";

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
  defaultValue?: string | string[] | undefined;

  /**
   * Controlled open item keys.
   *
   * When provided, the component becomes controlled and updates are
   * reported through `onValueChange`.
   */
  value?: string | string[] | undefined;

  /**
   * Callback fired with the current open item keys.
   * Called whenever the open state changes.
   */
  onValueChange?: ((value: string[]) => void) | undefined;

  /**
   * Custom node rendered as the expand indicator.
   *
   * Defaults to a rotating chevron-down icon.
   */
  expandIcon?: ReactNode | undefined;

  /**
   * Extra classes applied to each item container.
   */
  itemClassName?: string | undefined;

  /**
   * Extra classes applied to each header trigger button.
   */
  headerClassName?: string | undefined;

  /**
   * Extra classes applied to each content panel.
   */
  contentClassName?: string | undefined;
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
 * import { Accordion } from "@asheeui/web";
 *
 * export function Example() {
 *   return (
 *     <Accordion
 *       variant="separated"
 *       items={[
 *         { title: "What is AsheeUI?", content: "A React component library." },
 *         { title: "Is it free?", content: "Yes, it is Apache-2.0 licensed." },
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
      disableAnimation,
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

    // `disableAnimation` is a cascade axis like the others: a consumer can state it
    // on the instance, in `components.accordion`, or nowhere at all. Destructuring it
    // with a literal default would answer `false` before the config tier was asked,
    // so the component-level option could never take effect.
    const resolvedDisableAnimation = resolveCascade<boolean>(
      disableAnimation,
      sectionConfig?.disableAnimation,
      undefined,
      FALLBACK_ACCORDION_CONFIG.disableAnimation,
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

    // ─── 3. Keyboard Navigation ───────────────────────────────────────────────

    const triggerRefs = useRef<Map<string, HTMLButtonElement | null>>(
      new Map(),
    );

    /**
     * Move focus between the item triggers, which is what the WAI-ARIA accordion
     * pattern asks for: Up and Down step through the headers, Home and End jump to
     * the first and the last, and everything else is the browser's to handle.
     *
     * A disabled trigger stays in the tab order — it reports `aria-disabled`
     * rather than the native attribute — but arrowing onto it would move focus to
     * something the reader cannot operate, so the walk skips it, as `Tabs` does.
     * The walk wraps, and it starts from the current position rather than from
     * "the next enabled one", so a reader sitting on a disabled trigger still
     * lands somewhere useful.
     *
     * @param event - The key event on a trigger.
     * @param currentIndex - Position of the trigger that received the key.
     */
    const handleTriggerKeyDown = (
      event: KeyboardEvent<HTMLButtonElement>,
      currentIndex: number,
    ) => {
      const enabledIndexes: number[] = [];
      items.forEach((item, index) => {
        if (!item.disabled) enabledIndexes.push(index);
      });

      // `at` answers `undefined` only for an empty list, so this states the
      // no-enabled-trigger case and narrows both ends in one step.
      const firstEnabled = enabledIndexes.at(0);
      const lastEnabled = enabledIndexes.at(-1);

      if (firstEnabled === undefined || lastEnabled === undefined) return;

      let targetIndex: number;

      switch (event.key) {
        case "ArrowDown":
          targetIndex =
            enabledIndexes.find((index) => index > currentIndex) ??
            firstEnabled;
          break;
        case "ArrowUp": {
          const above = enabledIndexes.filter((index) => index < currentIndex);
          // The closest enabled trigger above this one, or the walk wraps.
          targetIndex = above.at(-1) ?? lastEnabled;
          break;
        }
        case "Home":
          targetIndex = firstEnabled;
          break;
        case "End":
          targetIndex = lastEnabled;
          break;
        default:
          // Every other key belongs to the trigger itself (Enter and Space
          // activate it) or to the browser (Tab leaves, the rest scroll).
          return;
      }

      // The navigation key is ours: the browser must not also scroll the page.
      event.preventDefault();

      const targetItem = items[targetIndex];
      const targetKey = targetItem?.id || `item-${targetIndex}`;
      triggerRefs.current.get(targetKey)?.focus();
    };

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
                ref={(node) => {
                  if (node) triggerRefs.current.set(itemKey, node);
                  else triggerRefs.current.delete(itemKey);
                }}
                id={headerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={contentId}
                // A disabled item is reported, not removed. The native `disabled`
                // attribute would take the trigger out of the tab order, so a
                // reader would never learn that the section exists but cannot be
                // opened; `aria-disabled` states the same thing and leaves the
                // control reachable, which is what the rest of the library does.
                // The press is refused in `handleToggle`.
                aria-disabled={item.disabled || undefined}
                onClick={() => handleToggle(itemKey, item.disabled)}
                onKeyDown={(event) => handleTriggerKeyDown(event, index)}
                className={cn(
                  "w-full min-w-full text-left flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset text-foreground transition-colors aria-disabled:opacity-50 aria-disabled:cursor-not-allowed select-none box-border",
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
                    resolvedDisableAnimation ? "transition-none" : "",
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
                // A collapsed panel is only visually collapsed. `inert` is what
                // takes its content out of the tab order and out of the
                // accessibility tree, so a collapsed panel cannot be reached
                // (`COMP-041`).
                aria-hidden={isOpen ? undefined : true}
                inert={!isOpen}
                className={cn(
                  "w-full grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  resolvedDisableAnimation ? "transition-none" : "",
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
