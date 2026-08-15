"use client";

import { useSettings } from "@ashee/settings";
import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { type ReactNode, useCallback, useMemo } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import type { Color, Variant } from "../../../shared/variant";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon";
import { Button } from "../../primitive/button/Button";
import { Tooltip } from "../tooltip/Tooltip";
import type { TooltipPlacement } from "../tooltip/tooltip-config";
import { defaultSidebarSizeScale } from "./default-sidebar-config";
import { flattenSidebarSizeScale } from "./flatten-sidebar-size-scale";
import type {
  SidebarConfig,
  SidebarItem,
  SidebarSizeKey,
  SidebarSizeScale,
  SidebarVariant,
} from "./sidebar-config";

// ─── Props Interface ──────────────────────────────────────────────────────────

export interface SidebarProps<T = string>
  extends Omit<HTMLMotionProps<"aside">, "onSelect" | "title"> {
  /** List of navigation items. */
  items: SidebarItem<T>[];

  /** Key of currently active item. */
  activeKey?: T;

  /** Selection callback fired when an item is clicked. */
  onSelect?: (item: SidebarItem<T>) => void;

  /** Controlled collapsed drawer state. */
  isCollapsed?: boolean;

  /** Title displayed in the sidebar header when expanded. */
  title?: ReactNode;

  /** Header back button click handler. */
  onBack?: () => void;

  /** Custom back button icon element. */
  backIcon?: ReactNode;

  /** Optional user role string to filter item visibility against item.roles. */
  userRole?: string;

  /** Footer slot element. */
  footer?: ReactNode;

  /** Visual variant style. */
  variant?: SidebarVariant;

  /** Size scale token key. */
  size?: SidebarSizeKey;

  /** Radius scale token for sidebar container. */
  radius?: keyof Radius;

  /** Radius scale token for individual items. */
  itemRadius?: keyof Radius;

  /** Animation configuration preset. */
  animation?: AnimationProp;

  /** Active item variant. */
  activeItemVariant?: Variant;

  /** Active item color. */
  activeItemColor?: Color;

  /** Header back button variant. */
  backButtonVariant?: Variant;

  /** Header back button color. */
  backButtonColor?: Color;

  /** Whether to show tooltips on hover when the sidebar is collapsed. */
  showTooltips?: boolean;

  /** Preferred tooltip placement when collapsed. */
  tooltipPlacement?: TooltipPlacement;

  /** Header section class override. */
  headerClassName?: string;

  /** Navigation container class override. */
  bodyClassName?: string;

  /** Individual navigation item class override. */
  itemClassName?: string;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export function Sidebar<T = string>({
  items = [],
  activeKey,
  onSelect,
  isCollapsed = false,
  title,
  onBack,
  backIcon,
  userRole,
  footer,
  variant: variantProp,
  size,
  radius,
  itemRadius,
  animation,
  activeItemVariant,
  activeItemColor,
  backButtonVariant,
  backButtonColor,
  showTooltips,
  tooltipPlacement,
  headerClassName,
  bodyClassName,
  itemClassName,
  className,
  style,
  ...props
}: SidebarProps<T>) {
  const config = useAsheeConfig();
  const { settings } = useSettings();
  const sectionConfig = config.components?.sidebar as SidebarConfig | undefined;

  // Design Token Resolvers
  const sizeScale = (sectionConfig?.size ??
    defaultSidebarSizeScale) as SidebarSizeScale;
  const resolvedSizeKey = size ?? sizeScale.default;
  const responsiveVars = useMemo(
    () => flattenSidebarSizeScale(sizeScale),
    [sizeScale],
  );
  useResponsiveVars(
    "ashee-sidebar-tokens",
    responsiveVars,
    config.theme.breakpoints,
  );

  const variant = resolveValue<SidebarVariant>(
    variantProp,
    sectionConfig?.variant,
    "default",
  );

  // Radius Resolvers
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

  const resolvedItemRadiusKey = (itemRadius ??
    sectionConfig?.itemRadius ??
    "md") as keyof Radius;

  const resolvedActiveItemVariant = resolveValue<Variant>(
    activeItemVariant,
    sectionConfig?.activeItemVariant,
    config.theme.defaultVariant ?? "solid",
  );
  const resolvedActiveItemColor = resolveValue<Color>(
    activeItemColor,
    sectionConfig?.activeItemColor,
    config.theme.defaultColor ?? "primary",
  );

  const resolvedBackButtonVariant = resolveValue<Variant>(
    backButtonVariant,
    sectionConfig?.backButtonVariant,
    "ghost",
  );
  const resolvedBackButtonColor = resolveValue<Color>(
    backButtonColor,
    sectionConfig?.backButtonColor,
    "secondary",
  );

  // Tooltip Resolvers
  const resolvedShowTooltips = resolveValue<boolean>(
    showTooltips,
    sectionConfig?.showTooltips,
    true,
  );
  const resolvedTooltipPlacement = resolveValue<TooltipPlacement>(
    tooltipPlacement,
    sectionConfig?.tooltipPlacement,
    "top",
  );

  const motionProps = resolveAnimation(
    animation ?? (sectionConfig?.animation as AnimationProp | undefined),
    settings.enableAnimations,
  );

  // Role Filtering
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!item.roles || item.roles.length === 0) return true;
      if (!userRole) return false;
      return item.roles.includes(userRole);
    });
  }, [items, userRole]);

  const handleItemClick = useCallback(
    (item: SidebarItem<T>) => {
      if (item.disabled) return;
      onSelect?.(item);
    },
    [onSelect],
  );

  return (
    <motion.aside
      role="navigation"
      aria-expanded={!isCollapsed}
      className={cn(
        "h-full flex flex-col bg-background/80 backdrop-blur-xs border-r border-border transition-all duration-200 select-none overflow-hidden",
        variant === "bordered" && "border-2 border-border",
        variant === "floating" &&
          "m-2 rounded-xl border border-border shadow-md",
        variant === "flush" && "border-none",
        sectionConfig?.className,
        className,
      )}
      style={{
        width: isCollapsed
          ? `var(--ashee-sidebar-${resolvedSizeKey}-collapsed-w)`
          : `var(--ashee-sidebar-${resolvedSizeKey}-expanded-w)`,
        borderRadius: resolvedRadius,
        ...style,
      }}
      {...props}>
      {/* Sidebar Header */}
      {(onBack || title) && (
        <div
          className={cn(
            "flex items-center gap-3 border-b border-border border-dashed px-3 shrink-0",
            sectionConfig?.headerClassName,
            headerClassName,
          )}
          style={{
            height: `var(--ashee-sidebar-${resolvedSizeKey}-header-h)`,
          }}>
          {onBack && (
            <Button
              icon
              aria-label="Navigate back"
              variant={resolvedBackButtonVariant}
              color={resolvedBackButtonColor}
              size={resolvedSizeKey}
              radius={resolvedItemRadiusKey}
              onClick={onBack}
              className="shrink-0">
              {backIcon ?? <ArrowLeftIcon className="w-5 h-5" />}
            </Button>
          )}

          {!isCollapsed && title && (
            <motion.span
              {...(motionProps as HTMLMotionProps<"span">)}
              className="font-semibold text-foreground truncate tracking-tight"
              style={{
                fontSize: `var(--ashee-sidebar-${resolvedSizeKey}-font-s)`,
              }}>
              {title}
            </motion.span>
          )}
        </div>
      )}

      {/* Navigation Body */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto py-3 flex flex-col gap-1 scrollable",
          sectionConfig?.bodyClassName,
          bodyClassName,
        )}
        style={{
          paddingInline: `var(--ashee-sidebar-${resolvedSizeKey}-px)`,
        }}>
        {filteredItems.map((item) => {
          const isActive = item.id === activeKey;

          const itemButton = (
            <Button
              key={String(item.id)}
              type="button"
              isDisabled={item.disabled}
              onClick={() => handleItemClick(item)}
              variant={isActive ? resolvedActiveItemVariant : "ghost"}
              color={isActive ? resolvedActiveItemColor : "none"}
              size={resolvedSizeKey}
              radius={resolvedItemRadiusKey}
              className={cn(
                "w-full flex items-center gap-3 transition-all truncate",
                isCollapsed ? "justify-center px-0" : "justify-start",
                sectionConfig?.itemClassName,
                itemClassName,
              )}
              style={{
                height: `var(--ashee-sidebar-${resolvedSizeKey}-item-h)`,
                fontSize: `var(--ashee-sidebar-${resolvedSizeKey}-font-s)`,
                paddingInline: isCollapsed
                  ? "0"
                  : `var(--ashee-sidebar-${resolvedSizeKey}-px)`,
              }}>
              {item.icon && (
                <span className="shrink-0 flex items-center justify-center">
                  {item.icon}
                </span>
              )}

              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!isCollapsed && item.badge && (
                <span className="shrink-0">{item.badge}</span>
              )}
            </Button>
          );

          if (isCollapsed && resolvedShowTooltips) {
            return (
              <Tooltip
                key={String(item.id)}
                content={item.label}
                placement={resolvedTooltipPlacement}
                variant={sectionConfig?.tooltipVariant ?? "solid"}
                color={sectionConfig?.tooltipColor ?? "secondary"}
                radius={resolvedItemRadiusKey}>
                {itemButton}
              </Tooltip>
            );
          }

          return itemButton;
        })}
      </nav>

      {/* Footer Slot */}
      {!isCollapsed && footer && (
        <div className="p-3 border-t border-border shrink-0">{footer}</div>
      )}
    </motion.aside>
  );
}

Sidebar.displayName = "Sidebar";
