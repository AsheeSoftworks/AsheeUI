"use client";

import { cn } from "@asheeui/utils";
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import type { Color, Variant } from "../../../shared/variant";
import type { Radius } from "../../../theme/token/radius/radius-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../../utils/resolve-token";
import { Button } from "../../primitive/button/Button";
import {
  FALLBACK_TABS_CONFIG,
  type TabItem,
  type TabsConfig,
  type TabsSizeKey,
  type TabsVariant,
} from "./tabs-config";
import {
  TABS_FONT_CLASS,
  TABS_HEIGHT_CLASS,
  TABS_PADDING_X_CLASS,
  TABS_RADIUS_CLASS,
} from "./tabs-styles";

// ─── Props Interface ──────────────────────────────────────────────────────────

export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: TabItem[];

  /**
   * Controlled active tab identifier.
   */
  activeId?: string | number;

  /**
   * Default active tab identifier for uncontrolled state.
   */
  defaultActiveId?: string | number;

  /**
   * Callback fired when active tab changes.
   */
  onChange?: (id: string | number) => void;

  /**
   * Visual style variant for the tablist container.
   * @default "underline"
   */
  variant?: TabsVariant;

  /**
   * Size scale key.
   * @default "md"
   */
  size?: TabsSizeKey;

  /**
   * Border radius for the tablist container.
   */
  radius?: keyof Radius;

  /**
   * Border radius for only the active tab button.
   */
  activeRadius?: keyof Radius;

  /**
   * Button variant for only the active tab button.
   */
  activeVariant?: Variant;

  /**
   * Button color for only the active tab button.
   * @default "primary"
   */
  activeColor?: Color;

  /**
   * Motion animation preset for panel transitions.
   */
  animation?: AnimationProp;

  /**
   * Full width stretch tabs inside container.
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

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs = [],
      activeId: activeIdProp,
      defaultActiveId,
      onChange,
      variant: variantProp,
      size,
      radius,
      activeRadius: activeRadiusProp,
      activeVariant: activeVariantProp,
      activeColor: activeColorProp,
      animation,
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
    const sectionConfig = config.components?.tabs as TabsConfig | undefined;

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

    const resolvedSizeKey = resolveCascade<TabsSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_TABS_CONFIG.size,
    );

    const resolvedVariant = resolveCascade<TabsVariant>(
      variantProp,
      sectionConfig?.variant,
      undefined,
      FALLBACK_TABS_CONFIG.variant,
    );

    const resolvedActiveVariant = resolveCascade<Variant>(
      activeVariantProp,
      sectionConfig?.activeVariant,
      undefined,
      FALLBACK_TABS_CONFIG.activeVariant,
    );

    const resolvedActiveColor = resolveCascade<Color>(
      activeColorProp,
      sectionConfig?.activeColor,
      config.theme.defaultColor as Color | undefined,
      FALLBACK_TABS_CONFIG.activeColor,
    );

    const resolvedAnimation = resolveCascade<AnimationProp>(
      animation,
      sectionConfig?.animation as AnimationProp | undefined,
      undefined,
      FALLBACK_TABS_CONFIG.animation,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig,
      config.theme.radius?.default,
      FALLBACK_TABS_CONFIG.radius,
    );

    const resolvedActiveRadiusKey = resolveRadiusKey(
      activeRadiusProp,
      sectionConfig?.activeRadius
        ? { radius: sectionConfig.activeRadius }
        : undefined,
      config.theme.radius?.default,
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
      TABS_RADIUS_CLASS,
      FALLBACK_TABS_CONFIG.radius,
    );

    const activeRadiusClass = resolveClassKey(
      resolvedActiveRadiusKey,
      TABS_RADIUS_CLASS,
      FALLBACK_TABS_CONFIG.activeRadius,
    );

    const motionProps = resolveAnimation(resolvedAnimation);

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
      switch (resolvedVariant) {
        case "pills":
          return "bg-muted/50 p-1 border border-border";
        case "bordered":
          return "border border-border p-1 bg-background";
        case "ghost":
          return "bg-transparent gap-1";
        default:
          return "border-b border-border gap-2";
      }
    }, [resolvedVariant]);

    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-full flex flex-col gap-4",
          sectionConfig?.className,
          className,
        )}
        style={style}
        {...props}>
        {/* Tablist Trigger Bar */}
        <div
          role="tablist"
          aria-orientation="horizontal"
          className={cn(
            "flex flex-row w-full items-center overflow-x-auto scrollable shrink-0",
            listVariantClasses,
            resolvedVariant !== "underline" && radiusClass,
            sectionConfig?.tabListClassName,
            tabListClassName,
          )}>
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTabId;
            const tabTitle = tab.label ?? tab.name;
            const tabHeaderId = `${baseId}-tab-${tab.id}`;
            const panelId = `${baseId}-panel-${tab.id}`;

            // Resolve active button modifications
            const activeVariant = tab.activeVariant ?? resolvedActiveVariant;
            const activeColor = tab.activeColor ?? resolvedActiveColor;

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
                radius="none"
                isDisabled={tab.disabled}
                variant={
                  isActive
                    ? resolvedVariant === "underline"
                      ? "underlined"
                      : activeVariant
                    : "ghost"
                }
                color={isActive ? activeColor : "none"}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  "relative flex items-center justify-center gap-2 font-medium transition-all select-none outline-none",
                  heightClass,
                  paddingXClass,
                  fontClass,
                  fullWidth && "flex-1",
                  isActive &&
                    resolvedVariant !== "underline" &&
                    activeRadiusClass,
                  sectionConfig?.tabClassName,
                  tabClassName,
                )}>
                {tab.icon && <span className="shrink-0">{tab.icon}</span>}
                <span>{tabTitle}</span>
                {tab.badge !== undefined && (
                  <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-normal">
                    {tab.badge}
                  </span>
                )}

                {/* Optional Animated Indicator for "pills" Variant */}
                {resolvedVariant === "pills" && isActive && (
                  <motion.div
                    layoutId={`${baseId}-active-pill`}
                    className="absolute inset-0 z-[-1] bg-primary rounded-[inherit]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Button>
            );
          })}
        </div>

        {/* Tab Panel Content */}
        {activeTab && (
          <div
            id={`${baseId}-panel-${activeTab.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${activeTab.id}`}
            className={cn(
              "w-full h-full flex-1 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md",
              sectionConfig?.tabPanelClassName,
              tabPanelClassName,
            )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={String(activeTab.id)}
                className="w-full h-full"
                {...(motionProps as HTMLMotionProps<"div">)}>
                {activeTab.content}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  },
);

Tabs.displayName = "Tabs";
