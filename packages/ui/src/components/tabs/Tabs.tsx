/**
 * Tabs component for AsheeUI.
 * This file provides the main Tabs component implementation, which renders
 * a tabbed navigation interface with support for variants, sizes, icons,
 * badges, and keyboard navigation. It supports both controlled and uncontrolled
 * active tab selection, and integrates with the standard AsheeUI cascade
 * for visual tokens.
 */
"use client";

import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Color, Size, Variant } from "../../shared";
import { RADIUS_CLASS } from "../../shared";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { Button } from "../button/Button";
import {
  FALLBACK_TABS_CONFIG,
  type TabItem,
  type TabsConfig,
  type TabsVariant,
} from "./tabs-config";
import {
  TABS_FONT_CLASS,
  TABS_HEIGHT_CLASS,
  TABS_PADDING_X_CLASS,
} from "./tabs-styles";

// ─── Props Interface ──────────────────────────────────────────────────────────

type BaseTabsProps = TabsConfig &
  Omit<React.HTMLAttributes<HTMLDivElement>, "color" | "onChange">;

/**
 * Configuration options for the Tabs component.
 */
export interface TabsProps extends BaseTabsProps {
  /**
   * Array of tab items to render.
   * Each tab must have an id and either label or name for display.
   */
  tabs: TabItem[];

  /**
   * Controlled active tab identifier.
   * When provided, the component becomes controlled.
   */
  activeId?: string | number;

  /**
   * Default active tab identifier for uncontrolled state.
   * Used as the initial active tab when not controlled.
   */
  defaultActiveId?: string | number;

  /**
   * Callback fired when active tab changes.
   * Receives the new active tab ID.
   */
  onChange?: (id: string | number) => void;

  /**
   * Full width stretch tabs inside container.
   * When true, tabs expand to fill the container width.
   *
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Class name for the tablist container.
   */
  tabListClassName?: string;

  /**
   * Class name for individual tab trigger buttons.
   */
  tabClassName?: string;

  /**
   * Class name for the tab content panel wrapper.
   */
  tabPanelClassName?: string;
}

// ─── Component Implementation ─────────────────────────────────────────────────

/**
 * A tabbed navigation interface with support for variants, sizes,
 * icons, badges, and keyboard navigation.
 *
 * Tabs renders a horizontal list of tab triggers and a content panel
 * that displays the content of the active tab. It supports multiple
 * visual variants (underline, bordered, ghost), configurable sizes,
 * and active state styling. The component handles keyboard navigation
 * with arrow keys, Home, and End keys for accessibility.
 *
 * Visual tokens resolve through the standard AsheeUI cascade: prop,
 * component config, global theme defaults, and the built-in fallback.
 *
 * @param props - Tabs configuration options.
 * @param props.tabs - Array of tab items to render.
 * @param props.activeId - Controlled active tab identifier.
 * @param props.defaultActiveId - Default active tab for uncontrolled state.
 * @param props.onChange - Callback fired when active tab changes.
 * @param props.fullWidth - Whether tabs stretch to fill container. Defaults to false.
 * @param props.variant - Visual style variant. Defaults to "underline".
 * @param props.size - Density scale. Defaults to "md".
 * @param props.radius - Corner rounding of the container. Defaults to "md".
 * @param props.activeRadius - Corner rounding of the active tab. Defaults to "md".
 * @param props.activeVariant - Visual variant for the active tab. Defaults to "solid".
 * @param props.activeColor - Theme color for the active tab. Defaults to "primary".
 * @param props.tabListClassName - Extra classes for the tablist.
 * @param props.tabClassName - Extra classes for individual tabs.
 * @param props.tabPanelClassName - Extra classes for the content panel.
 *
 * @example
 * ```tsx
 * import { Tabs } from "asheeui";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [activeId, setActiveId] = useState("tab-1");
 *
 *   return (
 *     <Tabs
 *       tabs={[
 *         { id: "tab-1", label: "Tab 1", content: <div>Content 1</div> },
 *         { id: "tab-2", label: "Tab 2", content: <div>Content 2</div> },
 *         { id: "tab-3", label: "Tab 3", content: <div>Content 3</div> },
 *       ]}
 *       activeId={activeId}
 *       onChange={setActiveId}
 *       variant="bordered"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With icons and badges
 * <Tabs
 *   tabs={[
 *     { id: "home", label: "Home", icon: <HomeIcon />, badge: 5 },
 *     { id: "settings", label: "Settings", icon: <SettingsIcon /> },
 *   ]}
 *   fullWidth
 * />
 * ```
 *
 * @see TabsConfig - The configuration type for component defaults.
 * @see TabItem - The tab item type.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs = [],
      activeId: activeIdProp,
      defaultActiveId,
      onChange,
      variant,
      size,
      radius,
      activeRadius,
      activeVariant,
      activeColor,
      fullWidth = false,
      tabListClassName,
      tabClassName,
      tabPanelClassName,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.tabs;

    const baseId = useId();
    const tabRefs = useRef<Map<string | number, HTMLButtonElement | null>>(
      new Map(),
    );

    // Controlled / Uncontrolled active state resolution
    const [internalActiveId, setInternalActiveId] = useState<string | number>(
      () => defaultActiveId ?? tabs[0]?.id,
    );

    const isControlled = activeIdProp !== undefined;
    const activeTabId = isControlled ? activeIdProp : internalActiveId;

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_TABS_CONFIG.size,
    );

    const resolvedVariantKey = resolveCascade<TabsVariant>(
      variant,
      sectionConfig?.variant,
      undefined,
      FALLBACK_TABS_CONFIG.variant,
    );

    const resolvedActiveVariant = resolveCascade<Variant>(
      activeVariant,
      sectionConfig?.activeVariant,
      config.defaultVariant,
      FALLBACK_TABS_CONFIG.activeVariant,
    );

    const resolvedActiveColorKey = resolveCascade<Color>(
      activeColor,
      sectionConfig?.activeColor,
      config.defaultColor,
      FALLBACK_TABS_CONFIG.activeColor,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_TABS_CONFIG.radius,
    );

    const resolvedActiveRadiusKey = resolveRadiusKey(
      activeRadius,
      sectionConfig?.activeRadius,
      config.defaultRadius,
      FALLBACK_TABS_CONFIG.activeRadius,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const heightClass = resolveClassKey(
      resolvedSizeKey,
      TABS_HEIGHT_CLASS,
      FALLBACK_TABS_CONFIG.size,
    );

    const paddingXClass = resolveClassKey(
      resolvedSizeKey,
      TABS_PADDING_X_CLASS,
      FALLBACK_TABS_CONFIG.size,
    );

    const fontClass = resolveClassKey(
      resolvedSizeKey,
      TABS_FONT_CLASS,
      FALLBACK_TABS_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey,
      RADIUS_CLASS,
      FALLBACK_TABS_CONFIG.radius,
    );

    const handleTabChange = useCallback(
      (id: string | number) => {
        if (!isControlled) {
          setInternalActiveId(id);
        }
        onChange?.(id);
      },
      [isControlled, onChange],
    );

    // Keyboard Focus & Navigation Handling
    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLButtonElement>,
      currentIndex: number,
    ) => {
      const enabledTabs = tabs.filter((t) => !t.disabled);
      if (enabledTabs.length === 0) return;

      let nextIndex = -1;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % tabs.length;
        while (tabs[nextIndex]?.disabled) {
          nextIndex = (nextIndex + 1) % tabs.length;
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        while (tabs[nextIndex]?.disabled) {
          nextIndex = (nextIndex - 1 + tabs.length) % tabs.length;
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIndex = tabs.findIndex((t) => !t.disabled);
      } else if (e.key === "End") {
        e.preventDefault();
        for (let i = tabs.length - 1; i >= 0; i--) {
          if (!tabs[i]?.disabled) {
            nextIndex = i;
            break;
          }
        }
      }

      if (nextIndex !== -1 && tabs[nextIndex]) {
        const nextTab = tabs[nextIndex];
        handleTabChange(nextTab.id);
        tabRefs.current.get(nextTab.id)?.focus();
      }
    };

    const activeTab = useMemo(
      () => tabs.find((tab) => tab.id === activeTabId) ?? tabs[0],
      [tabs, activeTabId],
    );

    // Variant-driven container layout classes
    const listVariantClasses = useMemo(() => {
      switch (resolvedVariantKey) {
        case "bordered":
          return "border border-border p-1 bg-background";
        case "ghost":
          return "bg-transparent gap-1";
        default:
          return "border-b border-border gap-2";
      }
    }, [resolvedVariantKey]);

    return (
      <div
        ref={ref}
        className={cn("w-full h-full flex flex-col gap-4", className)}
        style={style}
        {...props}>
        {/* Tablist Trigger Bar */}
        <div
          role="tablist"
          aria-orientation="horizontal"
          className={cn(
            "flex flex-row w-full items-center overflow-x-auto scrollable-hidden shrink-0",
            listVariantClasses,
            resolvedVariantKey !== "underline" && radiusClass,
            tabListClassName,
          )}>
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTabId;
            const tabTitle = tab.label ?? tab.name;
            const tabHeaderId = `${baseId}-tab-${tab.id}`;
            const panelId = `${baseId}-panel-${tab.id}`;

            // Resolve active button modifications
            const activeVariant = tab.activeVariant ?? resolvedActiveVariant;
            const activeColor = tab.activeColor ?? resolvedActiveColorKey;

            return (
              <Button
                key={String(tab.id)}
                ref={(node) => {
                  if (node) tabRefs.current.set(tab.id, node);
                  else tabRefs.current.delete(tab.id);
                }}
                id={tabHeaderId}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                aria-disabled={tab.disabled}
                tabIndex={isActive ? 0 : -1}
                radius={isActive ? resolvedActiveRadiusKey : resolvedRadiusKey}
                isDisabled={tab.disabled}
                size={resolvedSizeKey}
                variant={
                  isActive
                    ? resolvedVariantKey === "underline"
                      ? "underlined"
                      : activeVariant
                    : "ghost"
                }
                color={isActive ? activeColor : "none"}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  "relative flex items-center justify-center gap-2 font-medium transition-all duration-200 select-none outline-none active:scale-[0.98]",
                  heightClass,
                  paddingXClass,
                  fontClass,
                  fullWidth && "flex-1",
                  tabClassName,
                )}>
                {tab.icon && <span className="shrink-0">{tab.icon}</span>}
                <span>{tabTitle}</span>
                {tab.badge !== undefined && (
                  <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full bg-secondary text-foreground/70 font-normal">
                    {tab.badge}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Tab Panel Content */}
        {activeTab && (
          <div
            key={String(activeTab.id)}
            id={`${baseId}-panel-${activeTab.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${activeTab.id}`}
            className={cn(
              "w-full h-full flex-1 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md transition-all duration-200 animate-in fade-in-50",
              tabPanelClassName,
            )}>
            {activeTab.content}
          </div>
        )}
      </div>
    );
  },
);

Tabs.displayName = "Tabs";
