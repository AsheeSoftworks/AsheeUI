/**
 * Sidebar component for AsheeUI.
 * This file provides the main Sidebar component implementation, which renders
 * a collapsible navigation sidebar with support for sections, items, icons,
 * badges, tooltips, and custom link components. It includes role-based
 * visibility filtering, collapse state management, and the standard AsheeUI
 * cascade for visual tokens.
 */
"use client";

import {
  type Color,
  cn,
  RADIUS_CLASS,
  type Radius,
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
  resolveVariantClass,
  SIDEBAR_COLLAPSED_WIDTH_CLASS,
  SIDEBAR_EXPANDED_WIDTH_CLASS,
  SIDEBAR_HEADER_CLASS,
  SIDEBAR_ITEM_CLASS,
  SIDEBAR_SECTION_LABEL_CLASS,
  SIDEBAR_VARIANT_CLASS,
  type Variant,
} from "@asheeui/core";
import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ArrowLeftIcon } from "../../../icons/ArrowLeftIcon";
import { ChevronLeftIcon } from "../../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../../icons/ChevronRightIcon";
import { useAsheeConfig } from "../../../libs/context";
import { Button } from "../../forms/button/Button";
import { useWithinSidebarColumn } from "../../layouts/sidebar-layout/sidebar-column";
import { Tooltip } from "../../overlays/tooltip/Tooltip";
import type { TooltipPlacement } from "../../overlays/tooltip/tooltip-config";
import type {
  SidebarConfig,
  SidebarItem,
  SidebarItems,
  SidebarOptionsConfig,
  SidebarSection,
  SidebarSizeKey,
  SidebarTooltipConfig,
  SidebarVariant,
} from "./sidebar-config";
import { FALLBACK_SIDEBAR_CONFIG } from "./sidebar-config";

/**
 * Helper type guard to check if items are sections.
 * Determines whether the provided item is a SidebarSection or a SidebarItem.
 */
function isSidebarSection<T>(
  item: SidebarItem<T> | SidebarSection<T>,
): item is SidebarSection<T> {
  return "items" in item && Array.isArray(item.items);
}

type BaseSidebarProps = Omit<SidebarConfig, "options"> &
  Omit<HTMLAttributes<HTMLElement>, "color" | "size" | "onSelect" | "title">;

/**
 * Options props for the sidebar's navigation items.
 * Extends the options config with sidebar-local props.
 */
export interface SidebarOptionProps extends SidebarOptionsConfig {
  /**
   * Class override applied to every navigation item.
   */
  itemClassName?: string | undefined;
}

/**
 * Props for the sidebar's navigation links.
 * Holds the instance-only link component and its props.
 */
export interface SidebarLinkProps {
  /**
   * Custom link component (e.g., Next.js Link, TanStack Router Link).
   * When provided, this component is used instead of the native <a> tag.
   */
  component?: ElementType | undefined;

  /**
   * Additional props to pass to the custom link component (e.g. { prefetch: true }).
   * These take precedence over the component's own props.
   */
  props?: Record<string, unknown> | undefined;
}

/**
 * Configuration options for the Sidebar component.
 */
export interface SidebarProps<T = string> extends BaseSidebarProps {
  /**
   * List of navigation items or sections.
   * Can be a flat array of items or an array of sections.
   */
  items?: SidebarItems<T> | undefined;

  /**
   * Key of currently active item.
   * Used to highlight the selected navigation item.
   */
  activeKey?: T | undefined;

  /**
   * Selection callback fired when an item is clicked.
   * Receives the clicked item object.
   */
  onSelect?: ((item: SidebarItem<T>) => void) | undefined;

  /**
   * Controlled collapsed drawer state.
   * When provided, the component becomes controlled.
   */
  isCollapsed?: boolean | undefined;

  /**
   * Callback when collapse state changes.
   * Receives the new collapsed state.
   */
  onCollapseChange?: ((collapsed: boolean) => void) | undefined;

  /**
   * Title displayed in the sidebar header when expanded.
   */
  title?: ReactNode | undefined;

  /**
   * Header back button click handler.
   * When provided, a back button is shown in the header.
   */
  onBack?: (() => void) | undefined;

  /**
   * Custom back button icon element.
   * Defaults to ArrowLeftIcon.
   */
  backIcon?: ReactNode | undefined;

  /**
   * Optional user role string to filter item visibility against item.roles.
   * Items and sections with roles that don't match this role are hidden.
   */
  userRole?: string | undefined;

  /**
   * Footer slot element.
   * Rendered at the bottom of the sidebar.
   */
  footer?: ReactNode | undefined;

  /**
   * Header section class override.
   */
  headerClassName?: string | undefined;

  /**
   * Navigation container class override.
   */
  bodyClassName?: string | undefined;

  /**
   * Options configuration for the sidebar's navigation items
   * (radius and active/inactive styling), plus item-local props.
   */
  options?: SidebarOptionProps | undefined;

  /**
   * Tooltip configuration for collapsed sidebar items.
   */
  tooltip?: SidebarTooltipConfig | undefined;

  /**
   * Section label class override.
   */
  sectionLabelClassName?: string | undefined;

  /**
   * Footer class override.
   */
  footerClassName?: string | undefined;

  /**
   * Anchor tag props passthrough (native <a> or custom link).
   */
  anchorProps?: Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "children" | "onClick" | "className"
  >;

  /**
   * Link configuration for navigation items.
   * Provides the custom link component and props forwarded to it.
   */
  link?: SidebarLinkProps | undefined;

  /**
   * Accessible name of the navigation landmark inside the sidebar.
   *
   * The nav inside the sidebar is the landmark a reader jumps to, and it needs
   * its own name so two sidebars on one page are distinguishable in a landmark
   * list. On its own, the sidebar is also an `aside` — a complementary landmark
   * — which a consumer can name through the usual `aria-label` attribute. Inside
   * a `SidebarLayout` column the layout already provides that complementary
   * landmark, so the sidebar renders no second one and only this navigation
   * landmark is added.
   *
   * @default "Sidebar navigation"
   */
  navLabel?: string | undefined;
}

/**
 * The sidebar's public type.
 *
 * `forwardRef` erases the component's generic key type, so the wrapped
 * component is cast back to this callable type. It keeps `Sidebar<T>` usable
 * with a consumer's own key type and accepts a forwarded `ref` to the root
 * element — the `aside` on its own, or the column's `div` inside a
 * `SidebarLayout`.
 */
type SidebarComponent = {
  <T = string>(
    props: SidebarProps<T> & { ref?: Ref<HTMLElement> },
  ): ReactElement | null;
  displayName?: string | undefined;
};

/**
 * A collapsible navigation sidebar with support for sections, items,
 * icons, badges, tooltips, and custom link components.
 *
 * Sidebar renders a vertical navigation menu that can be collapsed to
 * an icon-only state. It supports sections with labels, items with icons
 * and badges, role-based visibility filtering, and tooltips for collapsed
 * items. Visual tokens resolve through the standard AsheeUI cascade:
 * prop, component config, global theme defaults, and the built-in fallback.
 *
 * The component automatically handles accessibility attributes including
 * proper navigation landmarks, aria-label for tooltips, and focus
 * management for interactive elements.
 *
 * @param props - Sidebar configuration options.
 * @param props.items - List of navigation items or sections.
 * @param props.activeKey - Key of currently active item.
 * @param props.onSelect - Selection callback fired when an item is clicked.
 * @param props.isCollapsed - Controlled collapsed state.
 * @param props.onCollapseChange - Callback when collapse state changes.
 * @param props.title - Title displayed in the header.
 * @param props.onBack - Header back button click handler.
 * @param props.userRole - Role for filtering items by visibility.
 * @param props.footer - Footer slot element.
 * @param props.size - Size scale. Defaults to "md".
 * @param props.variant - Visual style variant. Defaults to "default".
 * @param props.radius - Corner rounding of the sidebar.
 * @param props.options - Navigation item options (radius, active/inactive variant and color).
 * @param props.tooltip - Tooltip configuration for collapsed items (show, placement, variant, color).
 * @param props.showCollapseButton - Whether the collapse button is shown. Defaults to true.
 * @param props.collapsible - Whether the sidebar can be collapsed. Defaults to true.
 * @param props.animated - Whether the sidebar transitions between widths. Defaults to true.
 * @param props.link - Link configuration for navigation items (component and props).
 * @param props.navLabel - Accessible name of the navigation landmark. Defaults
 * to "Sidebar navigation".
 *
 * @example
 * ```tsx
 * import { Sidebar } from "@asheeui/web";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [active, setActive] = useState("dashboard");
 *
 *   return (
 *     <Sidebar
 *       items={[
 *         { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
 *         { id: "settings", label: "Settings", icon: <SettingsIcon /> },
 *       ]}
 *       activeKey={active}
 *       onSelect={(item) => setActive(item.id)}
 *       title="My App"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With sections and Next.js Link
 * import NextLink from "next/link";
 *
 * <Sidebar
 *   items={[
 *     { id: "main", label: "Main", items: mainItems },
 *     { id: "admin", label: "Admin", items: adminItems },
 *   ]}
 *   link={{ component: NextLink }}
 *   userRole="admin"
 * />
 * ```
 *
 * @see SidebarConfig - The configuration type for component defaults.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const Sidebar = forwardRef(SidebarInner) as SidebarComponent;

function SidebarInner<T = string>(
  {
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
    variant,
    size,
    radius,
    options,
    animated: animatedProp,
    showCollapseButton: showCollapseButtonProp,
    collapsible: collapsibleProp,
    defaultCollapsed: defaultCollapsedProp,
    tooltip,
    headerClassName,
    bodyClassName,
    sectionLabelClassName,
    footerClassName,
    anchorProps,
    link,
    navLabel = "Sidebar navigation",
    className,
    style,
    ...props
  }: SidebarProps<T>,
  ref: Ref<HTMLElement>,
) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.sidebar;

  // Inside a `SidebarLayout` column the layout has already rendered the
  // complementary landmark, so rendering another `aside` here would nest one
  // complementary landmark inside another. The column's landmark is the region;
  // this component contributes the navigation landmark inside it.
  const withinSidebarColumn = useWithinSidebarColumn();
  const Column: ElementType = withinSidebarColumn ? "div" : "aside";

  // Resolve collapsible and collapse button visibility
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

  const resolvedDefaultCollapsed = resolveCascade<boolean>(
    defaultCollapsedProp,
    sectionConfig?.defaultCollapsed,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.defaultCollapsed,
  );

  // `animated` is part of the shared sidebar contract, so it resolves like any
  // other option; when it is off the sidebar lays out its new width without a
  // transition, as `Drawer` and `Modal` do.
  const resolvedAnimated = resolveCascade<boolean>(
    animatedProp,
    sectionConfig?.animated,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.animated,
  );

  const [internalCollapsed, setInternalCollapsed] = useState(
    isCollapsedProp ?? resolvedDefaultCollapsed,
  );

  useEffect(() => {
    if (isCollapsedProp !== undefined) {
      setInternalCollapsed(isCollapsedProp);
    }
  }, [isCollapsedProp]);

  const isCollapsed = isCollapsedProp ?? internalCollapsed;

  const handleCollapseToggle = useCallback(() => {
    if (!resolvedCollapsible) return;

    const newState = !isCollapsed;

    // A controlled sidebar reports the request and lets its owner decide; an
    // uncontrolled one updates itself as well, so the control works without an
    // owner that feeds the state back (`REQ-087`).
    if (isCollapsedProp === undefined) {
      setInternalCollapsed(newState);
    }
    onCollapseChange?.(newState);
  }, [isCollapsed, isCollapsedProp, onCollapseChange, resolvedCollapsible]);

  // Size & Variant Cascading
  const resolvedSizeKey = resolveCascade<SidebarSizeKey>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.size,
  );

  const resolvedVariantKey = resolveCascade<SidebarVariant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.variant,
  );

  // Radius Cascading
  const filterRadius = (
    radiusValue: Radius | undefined,
  ): Radius | undefined => {
    if (radiusValue === "full") return "xl";
    return radiusValue;
  };

  const resolvedRadiusKey = resolveRadiusKey(
    filterRadius(radius),
    filterRadius(sectionConfig?.radius),
    config.defaultRadius,
    FALLBACK_SIDEBAR_CONFIG.radius,
  );

  const resolvedItemRadiusKey = resolveRadiusKey(
    filterRadius(options?.radius),
    filterRadius(sectionConfig?.options?.radius),
    config.defaultRadius,
    FALLBACK_SIDEBAR_CONFIG.options.radius,
  );

  // Item option variants and colors (inactive / active)
  const resolvedItemVariant = resolveCascade<Variant>(
    options?.inactive?.variant,
    sectionConfig?.options?.inactive?.variant,
    config.defaultVariant,
    FALLBACK_SIDEBAR_CONFIG.options.inactive.variant,
  );

  const resolvedItemColor = resolveCascade<Color>(
    options?.inactive?.color,
    sectionConfig?.options?.inactive?.color,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.options.inactive.color,
  );

  const resolvedActiveItemVariant = resolveCascade<Variant>(
    options?.active?.variant,
    sectionConfig?.options?.active?.variant,
    config.defaultVariant,
    FALLBACK_SIDEBAR_CONFIG.options.active.variant,
  );

  const resolvedActiveItemColor = resolveCascade<Color>(
    options?.active?.color,
    sectionConfig?.options?.active?.color,
    config.defaultColor,
    FALLBACK_SIDEBAR_CONFIG.options.active.color,
  );

  const activeVariantClasses = resolveVariantClass(
    resolvedActiveItemVariant,
    resolvedActiveItemColor,
  );

  const inactiveVariantClasses = resolveVariantClass(
    resolvedItemVariant,
    resolvedItemColor,
  );

  // Tooltip Resolvers
  const resolvedShowTooltips = resolveCascade<boolean>(
    tooltip?.show,
    sectionConfig?.tooltip?.show,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.tooltip.show,
  );

  const resolvedTooltipPlacement = resolveCascade<TooltipPlacement>(
    tooltip?.placement,
    sectionConfig?.tooltip?.placement,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.tooltip.placement,
  );

  const resolvedTooltipVariant = resolveCascade<Variant>(
    tooltip?.variant,
    sectionConfig?.tooltip?.variant,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.tooltip.variant,
  );

  const resolvedTooltipColor = resolveCascade<Color>(
    tooltip?.color,
    sectionConfig?.tooltip?.color,
    undefined,
    FALLBACK_SIDEBAR_CONFIG.tooltip.color,
  );

  const rawItems = itemsProp;

  // Normalize items to sections array
  const normalizedSections = useMemo(() => {
    if (!rawItems) return [];

    const firstItem = rawItems[0];
    if (!firstItem) return [];

    if (isSidebarSection(firstItem)) {
      return rawItems as SidebarSection<T>[];
    }

    const flatItems = rawItems as SidebarItem<T>[];
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

  // Render a single item - simplified with only itemVariant and active state
  const renderItem = (item: SidebarItem<T>, isSectionDisabled = false) => {
    const isActive = item.id === activeKey;
    const isDisabled = isSectionDisabled || item.disabled === true;

    const linkClassName = cn(
      "w-full flex items-center gap-3 transition-all truncate no-underline",
      SIDEBAR_ITEM_CLASS[resolvedSizeKey],
      isCollapsed ? "justify-center px-0" : "justify-start",
      isActive && "font-medium",
      // Use resolved variant classes - active items use activeItemVariant
      isActive ? activeVariantClasses : inactiveVariantClasses,
      isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
      resolveClassKey(
        resolvedItemVariant === "underlined" ? "none" : resolvedItemRadiusKey,
        RADIUS_CLASS,
        FALLBACK_SIDEBAR_CONFIG.options.radius,
      ),
      options?.itemClassName,
    );

    const LinkComponent = link?.component || "a";
    const linkProps = {
      href: isDisabled ? undefined : item.href,
      target: item.target,
      rel: item.rel,
      // A disabled row is still a row, so it says so rather than pretending to
      // be an ordinary destination.
      "aria-disabled": isDisabled ? true : undefined,
      // The active item is the page the consumer is on, which is what
      // `aria-current` conveys (`COMP-044`).
      "aria-current": isActive ? "page" : undefined,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) =>
        isDisabled ? e.preventDefault() : handleItemClick(e, item),
      className: linkClassName,
      ...anchorProps,
      ...(link?.props ?? {}),
    };

    const anchorElement = (
      <LinkComponent key={String(item.id)} {...linkProps}>
        {item.icon && (
          <span
            className={cn(
              "shrink-0 flex items-center justify-center",
              isCollapsed && "w-full",
            )}>
            {item.icon}
          </span>
        )}

        {isCollapsed ? (
          // The icon is the only visible content once collapsed, and a tooltip
          // is a description rather than a name, so the label stays in the
          // accessibility tree as visually hidden text.
          <span className="sr-only">{item.label}</span>
        ) : (
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
          variant={resolvedTooltipVariant}
          color={resolvedTooltipColor}
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

    // A disabled section keeps its rows on screen — they are still information
    // about what the application offers — but none of them can act, which is
    // what `SidebarSection.disabled` states.
    const isSectionDisabled = section.disabled === true;

    return (
      <div
        key={String(section.id)}
        className="flex flex-col gap-0.5"
        aria-disabled={isSectionDisabled ? true : undefined}>
        {!isCollapsed && section.label && (
          <div
            className={cn(
              "text-foreground/70 font-medium uppercase tracking-wider truncate",
              SIDEBAR_SECTION_LABEL_CLASS[resolvedSizeKey],
              sectionLabelClassName,
              isSectionDisabled && "opacity-50",
            )}>
            {section.label}
          </div>
        )}
        {section.items.map((item) => renderItem(item, isSectionDisabled))}
      </div>
    );
  };

  return (
    <Column
      // The root is an `aside` on its own and a `div` inside a `SidebarLayout`
      // column, and both carry the consumer's `HTMLElement` ref.
      ref={ref as Ref<HTMLDivElement>}
      className={cn(
        "h-full flex flex-col select-none shrink-0",
        // The width moves only when the contract asks it to; `animated: false`
        // lays the new width out directly.
        resolvedAnimated && "transition-all duration-200",
        widthClass,
        SIDEBAR_VARIANT_CLASS[resolvedVariantKey],
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
              variant={resolvedItemVariant}
              color="secondary"
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
        aria-label={navLabel}
        className={cn(
          "flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-3 scrollable-hidden",
          bodyClassName,
        )}>
        {filteredSections.map(renderSection)}
      </nav>

      {/* Footer slot and collapse control. The footer belongs to the consumer
          and renders whenever it is given, whatever the collapse settings are;
          only the control is gated. A collapsed sidebar keeps its footer
          wrapper for the control but hides the slot, as the native renderer
          does. */}
      {(footer || (resolvedShowCollapseButton && resolvedCollapsible)) && (
        <div
          className={cn(
            "border-t border-border shrink-0",
            isCollapsed ? "p-2" : "p-3",
            footerClassName,
          )}>
          {!isCollapsed && footer && (
            <div
              className={cn(
                resolvedShowCollapseButton && resolvedCollapsible && "mb-2",
              )}>
              {footer}
            </div>
          )}

          {resolvedShowCollapseButton && resolvedCollapsible && (
            <Button
              icon
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              variant={resolvedItemVariant}
              color="secondary"
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
          )}
        </div>
      )}
    </Column>
  );
}

Sidebar.displayName = "Sidebar";
