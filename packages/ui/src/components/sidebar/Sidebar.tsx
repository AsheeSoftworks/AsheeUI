"use client";

import { cn } from "@asheeui/utils";
import {
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon";
import { ChevronLeftIcon } from "../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../shared/variant";
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
  SidebarItems,
  SidebarSection,
  SidebarSizeKey,
  SidebarVariant,
} from "./sidebar-config";
import { FALLBACK_SIDEBAR_CONFIG } from "./sidebar-config";
import {
  SIDEBAR_COLLAPSED_WIDTH_CLASS,
  SIDEBAR_EXPANDED_WIDTH_CLASS,
  SIDEBAR_HEADER_CLASS,
  SIDEBAR_ITEM_CLASS,
  SIDEBAR_SECTION_LABEL_CLASS,
  SIDEBAR_VARIANT_CLASS,
} from "./sidebar-styles";

// Helper type guard to check if items are sections
function isSidebarSection<T>(
  item: SidebarItem<T> | SidebarSection<T>,
): item is SidebarSection<T> {
  return "items" in item && Array.isArray(item.items);
}

export interface SidebarProps<T = string>
  extends Omit<HTMLAttributes<HTMLElement>, "onSelect" | "title"> {
  /** List of navigation items or sections. */
  items?: SidebarItems<T>;

  /** Key of currently active item. */
  activeKey?: T;

  /** Selection callback fired when an item is clicked. */
  onSelect?: (item: SidebarItem<T>) => void;

  /** Controlled collapsed drawer state. */
  isCollapsed?: boolean;

  /** Callback when collapse state changes. */
  onCollapseChange?: (collapsed: boolean) => void;

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
  radius?: Radius;

  /** Radius scale token for individual items. */
  itemRadius?: Radius;

  /** Active item variant. */
  itemVariant?: Variant;

  /** Active item color. */
  activeItemColor?: Color;

  /** Header back button variant. */
  backButtonVariant?: Variant;

  /** Header back button color. */
  backButtonColor?: Color;

  /** Collapse toggle button variant. */
  collapseButtonVariant?: Variant;

  /** Collapse toggle button color. */
  collapseButtonColor?: Color;

  // NEW: Control collapse button visibility and collapsibility
  showCollapseButton?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;

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

  /** Section label class override. */
  sectionLabelClassName?: string;

  /** Footer class override. */
  footerClassName?: string;

  /** Anchor tag props passthrough (native <a> or custom link). */
  anchorProps?: Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "children" | "onClick" | "className"
  >;

  // NEW: Custom link component support
  /** Custom link component (e.g., Next.js Link, TanStack Router Link). */
  linkComponent?: ElementType;

  /** Additional props to pass to the custom link component (e.g., { prefetch: true }). */
  linkProps?: Record<string, unknown>;
}

export function Sidebar<T = string>({
  items: itemsProp,
  activeKey,
  onSelect,
  isCollapsed: isCollapsedProp,
  onCollapseChange,
  title,
  onBack,
  backIcon,
  userRole,
  footer,
  variant: variantProp,
  size,
  radius,
  itemRadius,
  itemVariant,
  activeItemColor,
  backButtonVariant,
  backButtonColor,
  collapseButtonVariant,
  collapseButtonColor,
  showCollapseButton: showCollapseButtonProp,
  collapsible: collapsibleProp,
  defaultCollapsed: defaultCollapsedProp,
  showTooltips,
  tooltipPlacement,
  headerClassName,
  bodyClassName,
  itemClassName,
  sectionLabelClassName,
  footerClassName,
  anchorProps,
  linkComponent,
  linkProps: linkPropsProp,
  className,
  style,
  ...props
}: SidebarProps<T>) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.sidebar as SidebarConfig | undefined;

  // NEW: Resolve collapsible and collapse button visibility
  const resolvedCollapsible = resolveCascade<boolean>(
    collapsibleProp,
    sectionConfig?.collapsible,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.collapsible,
  );

  const resolvedShowCollapseButton = resolveCascade<boolean>(
    showCollapseButtonProp,
    sectionConfig?.showCollapseButton,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.showCollapseButton,
  );

  // NEW: Resolve default collapsed state
  const resolvedDefaultCollapsed = resolveCascade<boolean>(
    defaultCollapsedProp,
    sectionConfig?.defaultCollapsed,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.defaultCollapsed,
  );

  // NEW: Use resolved default collapsed state if no controlled prop is provided
  const [internalCollapsed, setInternalCollapsed] = useState(
    isCollapsedProp ?? resolvedDefaultCollapsed,
  );

  // Update internal state if controlled prop changes
  useEffect(() => {
    if (isCollapsedProp !== undefined) {
      setInternalCollapsed(isCollapsedProp);
    }
  }, [isCollapsedProp]);

  const isCollapsed = isCollapsedProp ?? internalCollapsed;

  const handleCollapseToggle = useCallback(() => {
    if (!resolvedCollapsible) return; // Don't toggle if not collapsible

    const newState = !isCollapsed;
    if (onCollapseChange) {
      onCollapseChange(newState);
    } else {
      setInternalCollapsed(newState);
    }
  }, [isCollapsed, onCollapseChange, resolvedCollapsible]);

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
  // NEW: Filter out 'full' radius and fallback to 'none'
  const filterRadius = (
    radiusValue: Radius | undefined,
  ): Radius | undefined => {
    if (radiusValue === "full") return "xl";
    return radiusValue;
  };

  const resolvedRadiusKey = resolveRadiusKey(
    filterRadius(radius),
    filterRadius(sectionConfig?.radius),
    config.defaultRadius as Radius,
    FALLBACK_SIDEBAR_CONFIG.radius,
  );

  const resolvedItemRadiusKey = resolveRadiusKey(
    filterRadius(itemRadius),
    filterRadius(sectionConfig?.itemRadius),
    config.defaultRadius as Radius,
    FALLBACK_SIDEBAR_CONFIG.itemRadius,
  );

  // 3. Item & Button Tokens
  const resolvedItemVariant = resolveCascade<Variant>(
    itemVariant,
    sectionConfig?.itemVariant,
    config.defaultVariant as Variant,
    FALLBACK_SIDEBAR_CONFIG.itemVariant,
  );

  const resolvedActiveItemColor = resolveCascade<Color>(
    activeItemColor,
    sectionConfig?.activeItemColor,
    config.defaultColor as Color,
    FALLBACK_SIDEBAR_CONFIG.activeItemColor,
  );

  const activeVariantClasses = resolveVariantClass(
    resolvedItemVariant,
    resolvedActiveItemColor,
  );

  const inactiveVariantClasses = resolveVariantClass(
    "ghost" as Variant,
    "default" as Color,
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

  const resolvedCollapseButtonVariant = resolveCascade<Variant>(
    collapseButtonVariant,
    sectionConfig?.collapseButtonVariant,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.collapseButtonVariant,
  );

  const resolvedCollapseButtonColor = resolveCascade<Color>(
    collapseButtonColor,
    sectionConfig?.collapseButtonColor,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.collapseButtonColor,
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

  const rawItems = itemsProp;

  // Normalize items to sections array
  const normalizedSections = useMemo(() => {
    if (!rawItems) return [];

    // Check if first item is a section (has items property)
    const firstItem = rawItems[0];
    if (!firstItem) return [];

    // If it's already a section array, return as is
    if (isSidebarSection(firstItem)) {
      return rawItems as SidebarSection<T>[];
    }

    // Otherwise, treat as flat items array and wrap in a single section
    const flatItems = rawItems as SidebarItem<T>[];

    // Create a section with no label (or a default one if needed)
    return [
      {
        id: "__root" as T,
        label: undefined,
        items: flatItems,
      },
    ];
  }, [rawItems]);

  // Filter sections and items by role
  const filteredSections = useMemo(() => {
    return normalizedSections
      .filter((section) => {
        if (!section.roles || section.roles.length === 0) return true;
        if (!userRole) return false;
        return section.roles.includes(userRole);
      })
      .map((section) => ({
        ...section,
        items: section.items?.filter((item) => {
          if (!item.roles || item.roles.length === 0) return true;
          if (!userRole) return false;
          return item.roles.includes(userRole);
        }),
      }))
      .filter((section) => section.items && section.items.length > 0);
  }, [normalizedSections, userRole]);

  const handleItemClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, item: SidebarItem<T>) => {
      if (item.disabled) {
        e.preventDefault();
        return;
      }
      onSelect?.(item);
    },
    [onSelect],
  );

  const widthClass = isCollapsed
    ? SIDEBAR_COLLAPSED_WIDTH_CLASS[resolvedSizeKey]
    : SIDEBAR_EXPANDED_WIDTH_CLASS[resolvedSizeKey];

  // Render a single item
  const renderItem = (item: SidebarItem<T>) => {
    const isActive = item.id === activeKey;

    // Build the class name for the link
    const linkClassName = cn(
      "w-full flex items-center gap-3 transition-all truncate no-underline",
      SIDEBAR_ITEM_CLASS[resolvedSizeKey],
      isCollapsed ? "justify-center px-0" : "justify-start",
      isActive && "font-medium",
      // Use the resolved variant classes
      isActive ? activeVariantClasses : inactiveVariantClasses,
      // Disabled styles
      item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
      // Radius
      resolveClassKey(
        resolvedItemVariant === "underlined" ? "none" : resolvedItemRadiusKey,
        RADIUS_CLASS,
        FALLBACK_SIDEBAR_CONFIG.itemRadius,
      ),
      itemClassName,
    );

    // Choose the component: custom or native <a>
    const LinkComponent = linkComponent || "a";
    const linkProps = {
      href: item.disabled ? undefined : item.href,
      target: item.target,
      rel: item.rel,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) =>
        handleItemClick(e, item),
      className: linkClassName,
      ...anchorProps,
      ...(linkPropsProp || {}),
    };

    const anchorElement = (
      <LinkComponent key={String(item.id)} {...linkProps}>
        {item.icon && (
          <span
            className={cn(
              "shrink-0 flex items-center justify-center",
              isCollapsed && "w-full", // Make the icon span take full width in collapsed mode
            )}>
            {item.icon}
          </span>
        )}

        {!isCollapsed && (
          <>
            <span className="truncate flex-1 text-left">{item.label}</span>
            {item.badge && <span className="shrink-0">{item.badge}</span>}
          </>
        )}
      </LinkComponent>
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
            sectionConfig?.tooltipColor ?? FALLBACK_SIDEBAR_CONFIG.tooltipColor
          }
          radius={resolvedItemRadiusKey}>
          {anchorElement}
        </Tooltip>
      );
    }

    return anchorElement;
  };

  // Render a section
  const renderSection = (section: SidebarSection<T>) => {
    if (!section.items || section.items.length === 0) return null;

    return (
      <div key={String(section.id)} className="flex flex-col gap-0.5">
        {!isCollapsed && section.label && (
          <div
            className={cn(
              "text-foreground/70 font-medium uppercase tracking-wider truncate",
              SIDEBAR_SECTION_LABEL_CLASS[resolvedSizeKey],
              sectionLabelClassName,
            )}>
            {section.label}
          </div>
        )}
        {section.items.map(renderItem)}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "h-full flex flex-col transition-all duration-200 select-none shrink-0",
        widthClass,
        SIDEBAR_VARIANT_CLASS[resolvedVariant],
        resolveClassKey(
          resolvedRadiusKey,
          RADIUS_CLASS,
          FALLBACK_SIDEBAR_CONFIG.radius,
        ),
        className,
      )}
      style={style}
      {...props}>
      {/* Sidebar Header with Back Button */}
      {(onBack || title) && (
        <div
          className={cn(
            "flex items-center gap-3 border-b border-border border-dashed shrink-0",
            SIDEBAR_HEADER_CLASS[resolvedSizeKey],
            isCollapsed && "justify-center px-0",
            headerClassName,
          )}>
          {onBack && (
            <Button
              icon
              aria-label="Go back"
              variant={resolvedBackButtonVariant}
              color={resolvedBackButtonColor}
              size={resolvedSizeKey}
              radius={resolvedItemRadiusKey}
              onClick={onBack}
              className="shrink-0">
              <span
                className={cn(
                  "flex items-center justify-center transition-transform duration-200",
                )}>
                {backIcon ?? <ArrowLeftIcon className="size-4" />}
              </span>
            </Button>
          )}

          {!isCollapsed && title && (
            <span className="font-semibold text-foreground truncate tracking-tight transition-opacity duration-200">
              {title}
            </span>
          )}
        </div>
      )}

      {/* Navigation Body */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-3 scrollbar-hide",
          bodyClassName,
        )}>
        {filteredSections.map(renderSection)}
      </nav>

      {/* Footer with Collapse Button - Now optional and conditionally rendered */}
      {resolvedShowCollapseButton && resolvedCollapsible && (
        <div
          className={cn(
            "border-t border-border shrink-0",
            isCollapsed ? "p-2" : "p-3",
            footerClassName,
          )}>
          {!isCollapsed && footer && <div className="mb-2">{footer}</div>}

          {/* Collapse Toggle Button at Bottom */}
          <Button
            icon
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            variant={resolvedCollapseButtonVariant}
            color={resolvedCollapseButtonColor}
            size={resolvedSizeKey}
            radius={resolvedItemRadiusKey}
            onClick={handleCollapseToggle}
            className={cn(
              "w-full",
              isCollapsed ? "justify-center px-0" : "justify-start",
            )}>
            <span className="flex items-center gap-2">
              {isCollapsed ? (
                <ChevronRightIcon className="size-4" />
              ) : (
                <>
                  <ChevronLeftIcon className="size-4" />
                  <span className="text-sm">Collapse</span>
                </>
              )}
            </span>
          </Button>
        </div>
      )}

      {/* If footer exists but collapse button is hidden or not collapsible */}
      {!resolvedShowCollapseButton && footer && (
        <div
          className={cn(
            "border-t border-border shrink-0 p-3",
            footerClassName,
          )}>
          {footer}
        </div>
      )}
    </aside>
  );
}

Sidebar.displayName = "Sidebar";
