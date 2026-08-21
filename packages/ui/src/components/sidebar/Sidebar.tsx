"use client";

import { cn } from "@asheeui/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { type ReactNode, useCallback, useMemo } from "react";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon";
import { useAsheeConfig } from "../../libs/context";
import { resolveAnimation } from "../../motion/resolve-animation";
import type { AnimationProp } from "../../motion/types";
import type { Color, Variant } from "../../shared/variant";
import type { Radius } from "../../theme/token/radius/radius-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { Button } from "../button/Button";
import { Tooltip } from "../tooltip/Tooltip";
import type { TooltipPlacement } from "../tooltip/tooltip-config";
import type {
  SidebarConfig,
  SidebarItem,
  SidebarSizeKey,
  SidebarVariant,
} from "./sidebar-config";
import { FALLBACK_SIDEBAR_CONFIG } from "./sidebar-config";
import {
  SIDEBAR_COLLAPSED_WIDTH_CLASS,
  SIDEBAR_EXPANDED_WIDTH_CLASS,
  SIDEBAR_HEADER_CLASS,
  SIDEBAR_ITEM_CLASS,
  SIDEBAR_RADIUS_CLASS,
  SIDEBAR_VARIANT_CLASS,
} from "./sidebar-styles";

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
  const sectionConfig = config.components?.sidebar as SidebarConfig | undefined;

  // 1. Size & Variant Cascading
  const resolvedSizeKey = resolveCascade<SidebarSizeKey>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.size,
  );

  const resolvedVariant = resolveCascade<SidebarVariant>(
    variantProp,
    sectionConfig?.variant,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.variant,
  );

  // 2. Radius Cascading
  const resolvedRadiusKey = resolveRadiusKey(
    typeof radius === "string" ? radius : undefined,
    typeof sectionConfig?.radius === "string" ? sectionConfig : undefined,
    config.theme.radius?.default,
    FALLBACK_SIDEBAR_CONFIG.radius,
  );

  const resolvedItemRadiusKey = resolveRadiusKey(
    typeof itemRadius === "string" ? itemRadius : undefined,
    typeof sectionConfig?.itemRadius === "string" ? sectionConfig : undefined,
    config.theme.radius?.default,
    FALLBACK_SIDEBAR_CONFIG.itemRadius,
  );

  // 3. Item & Button Tokens
  const resolvedActiveItemVariant = resolveCascade<Variant>(
    activeItemVariant,
    sectionConfig?.activeItemVariant,
    config.theme.defaultVariant,
    FALLBACK_SIDEBAR_CONFIG.activeItemVariant,
  );

  const resolvedActiveItemColor = resolveCascade<Color>(
    activeItemColor,
    sectionConfig?.activeItemColor,
    config.theme.defaultColor,
    FALLBACK_SIDEBAR_CONFIG.activeItemColor,
  );

  const resolvedBackButtonVariant = resolveCascade<Variant>(
    backButtonVariant,
    sectionConfig?.backButtonVariant,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.backButtonVariant,
  );

  const resolvedBackButtonColor = resolveCascade<Color>(
    backButtonColor,
    sectionConfig?.backButtonColor,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.backButtonColor,
  );

  // 4. Tooltip Resolvers
  const resolvedShowTooltips = resolveCascade<boolean>(
    showTooltips,
    sectionConfig?.showTooltips,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.showTooltips,
  );

  const resolvedTooltipPlacement = resolveCascade<TooltipPlacement>(
    tooltipPlacement,
    sectionConfig?.tooltipPlacement,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.tooltipPlacement,
  );

  const motionProps = resolveAnimation(animation ?? sectionConfig?.animation);

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

  // Layout Class Lookup
  const widthClass = isCollapsed
    ? SIDEBAR_COLLAPSED_WIDTH_CLASS[resolvedSizeKey]
    : SIDEBAR_EXPANDED_WIDTH_CLASS[resolvedSizeKey];

  return (
    <motion.aside
      role="navigation"
      aria-expanded={!isCollapsed}
      className={cn(
        "h-full flex flex-col transition-all duration-200 select-none shrink-0",
        widthClass,
        SIDEBAR_VARIANT_CLASS[resolvedVariant],
        resolveClassKey(
          resolvedRadiusKey,
          SIDEBAR_RADIUS_CLASS,
          FALLBACK_SIDEBAR_CONFIG.radius,
        ),
        className,
      )}
      style={style}
      {...props}>
      {/* Sidebar Header */}
      {(onBack || title) && (
        <div
          className={cn(
            "flex items-center gap-3 border-b border-border border-dashed shrink-0",
            SIDEBAR_HEADER_CLASS[resolvedSizeKey],
            headerClassName,
          )}>
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
              {backIcon ?? <ArrowLeftIcon className="size-4" />}
            </Button>
          )}

          {!isCollapsed && title && (
            <motion.span
              {...(motionProps as HTMLMotionProps<"span">)}
              className="font-semibold text-foreground truncate tracking-tight">
              {title}
            </motion.span>
          )}
        </div>
      )}

      {/* Navigation Body */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-1",
          bodyClassName,
        )}>
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
                SIDEBAR_ITEM_CLASS[resolvedSizeKey],
                isCollapsed ? "justify-center px-0" : "justify-start",
                itemClassName,
              )}>
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
                variant={
                  sectionConfig?.tooltipVariant ??
                  FALLBACK_SIDEBAR_CONFIG.tooltipVariant
                }
                color={
                  sectionConfig?.tooltipColor ??
                  FALLBACK_SIDEBAR_CONFIG.tooltipColor
                }
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
