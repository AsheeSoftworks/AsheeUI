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
import { useResponsiveVars } from "../../../theme/token/responsive/use-responsive-vars";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { Button } from "../../primitive/button/Button";
import { defaultTabsSizeScale } from "./default-tabs-config";
import { flattenTabsSizeScale } from "./flatten-tabs-size-scale";
import type {
  TabItem,
  TabsConfig,
  TabsSizeKey,
  TabsSizeScale,
  TabsVariant,
} from "./tabs-config";

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

    // Design Token Resolvers
    const sizeScale = (sectionConfig?.size ??
      defaultTabsSizeScale) as TabsSizeScale;
    const resolvedSizeKey = size ?? sizeScale.default;
    const responsiveVars = useMemo(
      () => flattenTabsSizeScale(sizeScale),
      [sizeScale],
    );
    useResponsiveVars(
      "ashee-tabs-tokens",
      responsiveVars,
      config.theme.breakpoints,
    );

    const variant = resolveValue(
      variantProp,
      sectionConfig?.variant,
      "underline",
    );

    // Container Radius Resolution
    const resolvedRadiusKey = typeof radius === "string" ? radius : undefined;
    const resolvedSectionRadiusKey =
      typeof sectionConfig?.radius === "string"
        ? sectionConfig.radius
        : undefined;
    const resolvedContainerRadius = resolveScale(
      resolvedRadiusKey,
      resolvedSectionRadiusKey,
      config.theme.radius.default,
      config.theme.radius.values,
    );

    // Active Button Radius Resolution
    const resolvedActiveRadiusKey =
      activeRadiusProp ??
      sectionConfig?.activeRadius ??
      resolvedRadiusKey ??
      resolvedSectionRadiusKey;
    const resolvedActiveRadius = resolveScale(
      resolvedActiveRadiusKey,
      undefined,
      config.theme.radius.default,
      config.theme.radius.values,
    );

    // Global Active Button Fallbacks
    const globalActiveVariant =
      activeVariantProp ?? sectionConfig?.activeVariant;
    const globalActiveColor =
      activeColorProp ??
      sectionConfig?.activeColor ??
      (config.theme.defaultColor as Color) ??
      "primary";

    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
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
      switch (variant) {
        case "pills":
          return "bg-muted/50 p-1 border border-border";
        case "bordered":
          return "border border-border p-1 bg-background";
        case "ghost":
          return "bg-transparent gap-1";
        default:
          return "border-b border-border gap-2";
      }
    }, [variant]);

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
            sectionConfig?.tabListClassName,
            tabListClassName,
          )}
          style={{
            borderRadius:
              variant !== "underline" ? resolvedContainerRadius : undefined,
          }}>
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTabId;
            const tabTitle = tab.label ?? tab.name;
            const tabHeaderId = `${baseId}-tab-${tab.id}`;
            const panelId = `${baseId}-panel-${tab.id}`;

            // Resolve active button modifications
            const activeVariant =
              tab.activeVariant ?? globalActiveVariant ?? "solid";
            const activeColor = tab.activeColor ?? globalActiveColor;

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
                isDisabled={tab.disabled}
                variant={
                  isActive
                    ? variant === "underline"
                      ? "underlined"
                      : activeVariant
                    : "ghost"
                }
                color={isActive ? activeColor : "none"}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  "relative flex items-center justify-center gap-2 font-medium transition-all select-none outline-none",
                  fullWidth && "flex-1",
                  sectionConfig?.tabClassName,
                  tabClassName,
                )}
                style={{
                  height: `var(--ashee-tabs-${resolvedSizeKey}-height)`,
                  paddingInline: `var(--ashee-tabs-${resolvedSizeKey}-padding-x)`,
                  fontSize: `var(--ashee-tabs-${resolvedSizeKey}-font-s)`,
                  borderRadius:
                    isActive && variant !== "underline"
                      ? resolvedActiveRadius
                      : undefined,
                }}>
                {tab.icon && <span className="shrink-0">{tab.icon}</span>}
                <span>{tabTitle}</span>
                {tab.badge !== undefined && (
                  <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-normal">
                    {tab.badge}
                  </span>
                )}

                {/* Optional Animated Indicator for "pills" Variant */}
                {variant === "pills" && isActive && (
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
