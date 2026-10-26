/**
 * Sidebar component for the native package.
 *
 * The component satisfies the framework's sidebar contract: a vertical navigation list that can be
 * collapsed, holding sections, rows with an icon, a label and a badge, a header with an optional
 * back control, and a footer with an optional slot and the collapse control. The items are data the
 * platform reads from the same description the web reads, role filtering happens the same way, and
 * every visual option resolves through the same cascade of instance prop, component configuration,
 * global default and documented fallback.
 *
 * What the platform states differently is what it has to arrange and to press with. The web draws
 * an anchor per row and a chevron per control; a native row is the framework's own `Link`, which
 * follows its destination through the platform's URL handler, and a native control states its action
 * as its label, because the platform ships no icon set. A press on a row reports the selection and
 * follows the destination, which is what a click on the web's anchor does. A collapsed row explains
 * itself through the framework's native `Tooltip`, which the platform shows on a long press rather
 * than while a pointer rests, and states its name on the row itself, because the icon is all it
 * draws and a hint is a description rather than a name. A disabled section keeps its rows on screen
 * and refuses their presses, which is what the shared contract says a section's `disabled` means.
 * The platform has no media for the hint to escape, so a hint belongs to
 * the row it describes. Colour is not inherited from a row, so a row's label carries the role the
 * web's row passes down. And the width transition and the pointer cursor the web states are not
 * declared here, because a class cannot promise movement the platform does not have; the option
 * resolves through the shared contract and changes nothing.
 */

import {
  type Color,
  type ColorRole,
  NATIVE_RADIUS_CLASS,
  NATIVE_SIDEBAR_BASE_CLASS,
  NATIVE_SIDEBAR_BODY_CLASS,
  NATIVE_SIDEBAR_COLLAPSED_WIDTH_CLASS,
  NATIVE_SIDEBAR_EXPANDED_WIDTH_CLASS,
  NATIVE_SIDEBAR_FOOTER_CLASS,
  NATIVE_SIDEBAR_FOOTER_PADDING_CLASS,
  NATIVE_SIDEBAR_HEADER_BASE_CLASS,
  NATIVE_SIDEBAR_HEADER_CLASS,
  NATIVE_SIDEBAR_ITEM_ACTIVE_CLASS,
  NATIVE_SIDEBAR_ITEM_BADGE_CLASS,
  NATIVE_SIDEBAR_ITEM_BASE_CLASS,
  NATIVE_SIDEBAR_ITEM_CLASS,
  NATIVE_SIDEBAR_ITEM_DISABLED_CLASS,
  NATIVE_SIDEBAR_ITEM_ICON_CLASS,
  NATIVE_SIDEBAR_ITEM_LABEL_CLASS,
  NATIVE_SIDEBAR_ITEM_ROLE,
  NATIVE_SIDEBAR_ITEM_TEXT_CLASS,
  NATIVE_SIDEBAR_ITEM_VARIANT_CLASS,
  NATIVE_SIDEBAR_SECTION_CLASS,
  NATIVE_SIDEBAR_SECTION_LABEL_CLASS,
  NATIVE_SIDEBAR_SECTION_LABEL_ROLE,
  NATIVE_SIDEBAR_TITLE_ROLE,
  NATIVE_SIDEBAR_VARIANT_CLASS,
  NATIVE_VISUALLY_HIDDEN_CLASS,
  type Radius,
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
  type TooltipPlacement,
  type Variant,
} from "@asheeui/core";
import {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { ScrollView, View } from "react-native";
import { useAsheeNativeConfig } from "../../../provider/AsheeNativeProvider";
import { classNames } from "../../../utils/class-names";
import { openDestination } from "../../../utils/open-destination";
import { Button } from "../../forms/button/Button";
import { Tooltip } from "../../overlays/tooltip/Tooltip";
import { Text } from "../../typography/text/Text";
import { Link } from "../link/Link";
import type { SidebarCollapse } from "./sidebar-collapse";
import { SidebarCollapseContext } from "./sidebar-collapse";
import {
  FALLBACK_NATIVE_SIDEBAR_CONFIG,
  type NativeSidebarConfig,
  type SidebarItem,
  type SidebarItems,
  type SidebarLinkSubstitution,
  type SidebarOptionsConfig,
  type SidebarSection,
  type SidebarSizeKey,
  type SidebarTooltipConfig,
  type SidebarVariant,
} from "./sidebar-config";

/**
 * Whether an entry of the items list is a section rather than a row.
 * The two shapes are told apart by the list a section carries, which is the same rule the
 * web renderer reads.
 *
 * @param item - The entry to examine.
 * @returns True when the entry is a section.
 */
function isSidebarSection<T>(
  item: SidebarItem<T> | SidebarSection<T>,
): item is SidebarSection<T> {
  return "items" in item && Array.isArray(item.items);
}

type BaseSidebarProps = Omit<NativeSidebarConfig, "options"> &
  Omit<ViewProps, "children" | "style">;

/**
 * Options props for the sidebar's navigation rows.
 * Extends the options config with sidebar-local props.
 */
export interface SidebarOptionProps extends SidebarOptionsConfig {
  /** Class override applied to every navigation row. */
  itemClassName?: string;
}

/**
 * Props for the native Sidebar.
 */
export interface SidebarProps<T = string> extends BaseSidebarProps {
  /**
   * List of navigation items or sections.
   * Can be a flat list of items or an array of sections.
   */
  items?: SidebarItems<T>;

  /**
   * Key of the row that leads to the page being shown.
   * Used to highlight the current destination.
   */
  activeKey?: T;

  /**
   * Selection callback fired when a row is pressed.
   * Receives the pressed item object.
   */
  onSelect?: (item: SidebarItem<T>) => void;

  /**
   * Controlled collapsed state.
   * When provided, the component becomes controlled.
   */
  isCollapsed?: boolean;

  /**
   * Callback when the collapsed state changes.
   * Receives the new collapsed state.
   */
  onCollapseChange?: (collapsed: boolean) => void;

  /**
   * Title displayed in the header when expanded.
   */
  title?: ReactNode;

  /**
   * Header back control press handler.
   * When provided, a back control is shown in the header.
   */
  onBack?: () => void;

  /**
   * Custom back control content.
   * Defaults to the platform's own word for it, because the platform ships no icon set.
   */
  backIcon?: ReactNode;

  /**
   * Optional user role string to filter row visibility against item.roles.
   * Items and sections with roles that don't match this role are hidden.
   */
  userRole?: string;

  /**
   * Footer slot content.
   * Rendered above the collapse control in the footer.
   */
  footer?: ReactNode;

  /** Header section class override. */
  headerClassName?: string;

  /** Navigation container class override. */
  bodyClassName?: string;

  /**
   * Options configuration for the sidebar's navigation rows
   * (radius and active/inactive styling), plus row-local props.
   */
  options?: SidebarOptionProps;

  /** Tooltip configuration for collapsed rows. */
  tooltip?: SidebarTooltipConfig;

  /** Section label class override. */
  sectionLabelClassName?: string;

  /** Footer class override. */
  footerClassName?: string;

  /**
   * Link configuration for navigation rows.
   * Provides the component that replaces the framework's row and the props forwarded to it.
   */
  link?: SidebarLinkSubstitution;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A collapsible navigation sidebar with sections, rows, icons, badges, tooltips and a
 * substitution for the platform's own link component.
 *
 * Sidebar renders a vertical navigation list that can be collapsed to an icon-only rail. It
 * supports sections with labels, rows with icons and badges, role-based visibility filtering, and
 * hints for collapsed rows. Every visual option resolves through the standard AsheeUI cascade:
 * instance prop, component configuration, global theme defaults, and the built-in fallback.
 *
 * @param props - Sidebar configuration options.
 * @param props.items - List of navigation items or sections.
 * @param props.activeKey - Key of the row that leads to the page being shown.
 * @param props.onSelect - Selection callback fired when a row is pressed.
 * @param props.isCollapsed - Controlled collapsed state.
 * @param props.onCollapseChange - Callback when the collapsed state changes.
 * @param props.title - Title displayed in the header.
 * @param props.onBack - Header back control press handler.
 * @param props.backIcon - Custom back control content.
 * @param props.userRole - Role for filtering rows by visibility.
 * @param props.footer - Footer slot content.
 * @param props.size - Size scale. Defaults to "md".
 * @param props.variant - Surface of the sidebar. Defaults to "default".
 * @param props.radius - Corner rounding of the sidebar.
 * @param props.options - Row options (radius, active and inactive variant and colour).
 * @param props.tooltip - Hint configuration for collapsed rows (show, placement, variant, colour).
 * @param props.collapsible - Whether the sidebar can be collapsed. Defaults to true.
 * @param props.defaultCollapsed - Initial collapsed state. Defaults to false.
 * @param props.animated - Whether the web moves the sidebar when it collapses. Defaults to true.
 * The platform lays the new width out directly, so the option resolves and states nothing here.
 * @param props.link - Link configuration for navigation rows (component and props).
 * @returns The rendered sidebar.
 *
 * @example
 * ```tsx
 * <Sidebar
 *   items={[
 *     { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
 *     { id: "settings", label: "Settings", icon: <SettingsIcon /> },
 *   ]}
 *   activeKey={active}
 *   onSelect={(item) => setActive(item.id)}
 *   title="My App"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // The control that folds the column is the application's, from its own Pressable.
 * import { Sidebar, useSidebarCollapse } from "@asheeui/native";
 *
 * function CollapseButton() {
 *   const { isCollapsed, collapsible, toggleCollapse } = useSidebarCollapse();
 *   return (
 *     <Pressable disabled={!collapsible} onPress={toggleCollapse}>
 *       <Text>{isCollapsed ? "Expand" : "Collapse"}</Text>
 *     </Pressable>
 *   );
 * }
 *
 * <Sidebar items={items} title="My App" footer={<CollapseButton />} />;
 * ```
 *
 * @see SidebarConfig - The configuration type for component defaults.
 * @see useSidebarCollapse - The hook a control uses to fold the column.
 * @see SidebarLayout - The shell the sidebar is usually placed in.
 */

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
  variant,
  size,
  radius,
  options,
  collapsible: collapsibleProp,
  defaultCollapsed: defaultCollapsedProp,
  tooltip,
  headerClassName,
  bodyClassName,
  sectionLabelClassName,
  footerClassName,
  link,
  className,
  style,
  ...rest
}: SidebarProps<T>) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components?.sidebar;

  const resolvedCollapsible = resolveCascade<boolean>(
    collapsibleProp,
    sectionConfig?.collapsible,
    undefined,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.collapsible,
  );

  const resolvedDefaultCollapsed = resolveCascade<boolean>(
    defaultCollapsedProp,
    sectionConfig?.defaultCollapsed,
    undefined,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.defaultCollapsed,
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

  const handleSetCollapsed = useCallback(
    (nextCollapsed: boolean) => {
      if (!resolvedCollapsible) return;

      // A controlled sidebar reports the request and lets its owner decide; an uncontrolled one
      // updates itself as well, so the control works without an owner that feeds the state back.
      if (isCollapsedProp === undefined) {
        setInternalCollapsed(nextCollapsed);
      }
      onCollapseChange?.(nextCollapsed);
    },
    [isCollapsedProp, onCollapseChange, resolvedCollapsible],
  );

  const handleCollapseToggle = useCallback(() => {
    handleSetCollapsed(!isCollapsed);
  }, [handleSetCollapsed, isCollapsed]);

  /**
   * What the application's own control reads from the column.
   *
   * Memoised so a control inside the column re-renders when the state changes and not on every render of
   * the column itself.
   */
  const collapseState = useMemo<SidebarCollapse>(
    () => ({
      isCollapsed,
      collapsible: resolvedCollapsible,
      setCollapsed: handleSetCollapsed,
      toggleCollapse: handleCollapseToggle,
    }),
    [
      isCollapsed,
      resolvedCollapsible,
      handleSetCollapsed,
      handleCollapseToggle,
    ],
  );

  const resolvedSizeKey = resolveCascade<SidebarSizeKey>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.size,
  );

  const resolvedVariantKey = resolveCascade<SidebarVariant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.variant,
  );

  // A sidebar is a column beside the page, so a pill-shaped one is rounded to `xl` rather than
  // to the shape its own height would make, which is the rule the web renderer applies.
  const filterRadius = (value: Radius | undefined): Radius | undefined =>
    value === "full" ? "xl" : value;

  const resolvedRadiusKey = resolveRadiusKey(
    filterRadius(radius),
    filterRadius(sectionConfig?.radius),
    config.defaultRadius,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.radius,
  );

  const resolvedItemRadiusKey = resolveRadiusKey(
    filterRadius(options?.radius),
    filterRadius(sectionConfig?.options?.radius),
    config.defaultRadius,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.options.radius,
  );

  const resolvedItemVariant = resolveCascade<Variant>(
    options?.inactive?.variant,
    sectionConfig?.options?.inactive?.variant,
    config.defaultVariant,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.options.inactive.variant,
  );

  const resolvedItemColor = resolveCascade<Color>(
    options?.inactive?.color,
    sectionConfig?.options?.inactive?.color,
    undefined,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.options.inactive.color,
  );

  const resolvedActiveItemVariant = resolveCascade<Variant>(
    options?.active?.variant,
    sectionConfig?.options?.active?.variant,
    config.defaultVariant,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.options.active.variant,
  );

  const resolvedActiveItemColor = resolveCascade<Color>(
    options?.active?.color,
    sectionConfig?.options?.active?.color,
    config.defaultColor,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.options.active.color,
  );

  // The treatment of a row is the pair of its variant and its colour, and the platform states
  // the pair twice: once as the row's surface and once as its label's colour, because a label
  // does not inherit a colour from the view around it.
  const activeSurfaceClass =
    NATIVE_SIDEBAR_ITEM_VARIANT_CLASS[resolvedActiveItemVariant][
      resolvedActiveItemColor
    ];

  const inactiveSurfaceClass =
    NATIVE_SIDEBAR_ITEM_VARIANT_CLASS[resolvedItemVariant][resolvedItemColor];

  const activeTextClass =
    NATIVE_SIDEBAR_ITEM_TEXT_CLASS[resolvedActiveItemVariant][
      resolvedActiveItemColor
    ];

  const inactiveTextClass =
    NATIVE_SIDEBAR_ITEM_TEXT_CLASS[resolvedItemVariant][resolvedItemColor];

  const resolvedShowTooltips = resolveCascade<boolean>(
    tooltip?.show,
    sectionConfig?.tooltip?.show,
    undefined,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.tooltip.show,
  );

  const resolvedTooltipPlacement = resolveCascade<TooltipPlacement>(
    tooltip?.placement,
    sectionConfig?.tooltip?.placement,
    undefined,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.tooltip.placement,
  );

  const resolvedTooltipVariant = resolveCascade<Variant>(
    tooltip?.variant,
    sectionConfig?.tooltip?.variant,
    undefined,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.tooltip.variant,
  );

  const resolvedTooltipColor = resolveCascade<ColorRole>(
    tooltip?.color,
    sectionConfig?.tooltip?.color,
    undefined,
    FALLBACK_NATIVE_SIDEBAR_CONFIG.tooltip.color,
  );

  const rawItems = itemsProp;

  // A flat list is one unnamed section, so the two shapes a consumer may hand over become the one
  // shape the renderer walks.
  const normalizedSections = useMemo(() => {
    if (!rawItems) return [];

    const firstItem = rawItems[0];
    if (!firstItem) return [];

    if (isSidebarSection(firstItem)) {
      return rawItems as SidebarSection<T>[];
    }

    return [
      {
        id: "__root" as T,
        label: undefined,
        items: rawItems as SidebarItem<T>[],
      },
    ];
  }, [rawItems]);

  // A section or a row with roles is shown to the consumer's role and to nobody else, and a
  // section left with no rows is dropped rather than drawn as a label over nothing.
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

  const widthClass = isCollapsed
    ? NATIVE_SIDEBAR_COLLAPSED_WIDTH_CLASS[resolvedSizeKey]
    : NATIVE_SIDEBAR_EXPANDED_WIDTH_CLASS[resolvedSizeKey];

  // One navigation row: the framework's own link, because a row leads somewhere, with the row's
  // own metrics and treatment on top of it.
  //
  // A row can be unavailable on its own or because the section that holds it is. Either way it is
  // still a row — it says what the application offers — but it cannot act, which is what
  // `SidebarSection.disabled` states on the web too.
  const renderItem = (item: SidebarItem<T>, isSectionDisabled = false) => {
    const isActive = item.id === activeKey;
    const isDisabled = isSectionDisabled || item.disabled === true;

    const rowClasses = classNames(
      NATIVE_SIDEBAR_ITEM_BASE_CLASS,
      NATIVE_SIDEBAR_ITEM_CLASS[resolvedSizeKey],
      isCollapsed ? "justify-center px-0" : "justify-start",
      isActive && NATIVE_SIDEBAR_ITEM_ACTIVE_CLASS,
      isActive ? activeSurfaceClass : inactiveSurfaceClass,
      isDisabled && NATIVE_SIDEBAR_ITEM_DISABLED_CLASS,
      resolveClassKey(
        resolvedItemVariant === "underlined" ? "none" : resolvedItemRadiusKey,
        NATIVE_RADIUS_CLASS,
        FALLBACK_NATIVE_SIDEBAR_CONFIG.options.radius,
      ),
      options?.itemClassName,
    );

    const labelTextClasses = classNames(
      NATIVE_SIDEBAR_ITEM_LABEL_CLASS,
      isActive ? activeTextClass : inactiveTextClass,
    );

    const row = (
      <Link
        // The active row is the page the consumer is on, which is what `aria-current` says on
        // the web; the platform states the same thing as the row being selected.
        accessibilityState={{
          disabled: isDisabled,
          selected: isActive,
        }}
        // Collapsed, the icon is the only thing the row draws, so the row states its name
        // itself. The web keeps the label in the accessibility tree as visually hidden text;
        // the platform names the control it is, which is the same fact in the vocabulary it
        // has. The tooltip stays a description — a hint — rather than becoming the name.
        accessibilityLabel={
          isCollapsed && typeof item.label === "string" ? item.label : undefined
        }
        component={link?.component}
        componentProps={link?.props}
        disabled={isDisabled}
        className={rowClasses}
        href={item.href}
        onPress={
          isDisabled
            ? undefined
            : () => {
                // A press reports the selection, which is what the web's click handler does.
                onSelect?.(item);

                // The row leads somewhere: the framework follows the destination through the
                // platform's own URL handler, unless the consumer named the component that
                // renders the row, because then that component owns where the row leads.
                if (item.href && !link?.component) {
                  openDestination(item.href);
                }
              }
        }>
        {item.icon && (
          <View
            className={classNames(
              NATIVE_SIDEBAR_ITEM_ICON_CLASS,
              "flex items-center justify-center",
              isCollapsed && "w-full",
            )}>
            {item.icon}
          </View>
        )}

        {typeof item.label === "string" ? (
          // The platform's text takes one line and gives the room back to the row, which is
          // what the web's truncating span does. Collapsed, the row is named above instead, so
          // the label is not drawn a second time.
          !isCollapsed && (
            <Text
              truncate
              role={NATIVE_SIDEBAR_ITEM_ROLE[resolvedSizeKey]}
              className={labelTextClasses}>
              {item.label}
            </Text>
          )
        ) : (
          // A consumer's own label is its own element, so the platform cannot restate its
          // type; it only gives it the room the icon and the badge leave. The type is not a
          // string, so it cannot name the row from a prop: collapsed, it stays in the tree
          // through the platform's visually hidden treatment, which is what the web's
          // `sr-only` span does with the same element.
          <View
            className={classNames(
              NATIVE_SIDEBAR_ITEM_LABEL_CLASS,
              isCollapsed && NATIVE_VISUALLY_HIDDEN_CLASS,
            )}>
            {item.label}
          </View>
        )}

        {!isCollapsed && item.badge && (
          <View className={NATIVE_SIDEBAR_ITEM_BADGE_CLASS}>
            {typeof item.badge === "string" ||
            typeof item.badge === "number" ? (
              // A badge written as a count is text, and the platform renders a text node
              // through its own component rather than inside a view.
              <Text role="label">{item.badge}</Text>
            ) : (
              item.badge
            )}
          </View>
        )}
      </Link>
    );

    if (isCollapsed && resolvedShowTooltips) {
      return (
        <Tooltip
          key={String(item.id)}
          color={resolvedTooltipColor}
          content={item.label}
          placement={resolvedTooltipPlacement}
          radius={resolvedItemRadiusKey}
          variant={resolvedTooltipVariant}>
          {row}
        </Tooltip>
      );
    }

    return <Fragment key={String(item.id)}>{row}</Fragment>;
  };

  // One section: its label, when the sidebar is expanded, and its rows.
  const renderSection = (section: SidebarSection<T>) => {
    if (!section.items || section.items.length === 0) return null;

    // A disabled section keeps its rows on screen — they are still information about what the
    // application offers — but none of them can act, which is what `SidebarSection.disabled`
    // states. The section says so itself as well, and its label stays where it is and stays
    // readable, dimmed with the rows exactly as the web dims it, so the section still says what
    // it is rather than disappearing.
    const isSectionDisabled = section.disabled === true;

    const labelClasses = classNames(
      NATIVE_SIDEBAR_SECTION_LABEL_CLASS[resolvedSizeKey],
      sectionLabelClassName,
      isSectionDisabled && "opacity-50",
    );

    return (
      <View
        key={String(section.id)}
        className={NATIVE_SIDEBAR_SECTION_CLASS}
        accessibilityState={isSectionDisabled ? { disabled: true } : undefined}>
        {!isCollapsed &&
          section.label &&
          (typeof section.label === "string" ? (
            <Text
              numberOfLines={1}
              role={NATIVE_SIDEBAR_SECTION_LABEL_ROLE}
              className={labelClasses}>
              {section.label}
            </Text>
          ) : (
            // A consumer's own label is its own element, so the platform only gives it the
            // placement and the spacing a label has.
            <View className={labelClasses}>{section.label}</View>
          ))}

        {section.items.map((item) => renderItem(item, isSectionDisabled))}
      </View>
    );
  };

  return (
    <SidebarCollapseContext.Provider value={collapseState}>
      <View
        className={classNames(
          NATIVE_SIDEBAR_BASE_CLASS,
          widthClass,
          NATIVE_SIDEBAR_VARIANT_CLASS[resolvedVariantKey],
          resolveClassKey(
            resolvedRadiusKey,
            NATIVE_RADIUS_CLASS,
            FALLBACK_NATIVE_SIDEBAR_CONFIG.radius,
          ),
          className,
        )}
        style={style}
        {...rest}>
        {/* A folded column hides its title, so a header that held nothing else would be an empty band: it is
            drawn only while it has something to show. */}
        {(onBack || (!isCollapsed && title)) && (
          <View
            testID="sidebar-header"
            className={classNames(
              NATIVE_SIDEBAR_HEADER_BASE_CLASS,
              NATIVE_SIDEBAR_HEADER_CLASS[resolvedSizeKey],
              isCollapsed && "justify-center px-0",
              headerClassName,
            )}>
            {onBack && (
              <Button
                // The web names the control with `aria-label` and draws a chevron in it; the
                // platform states the same name and shows the action, because it ships no icons.
                accessibilityLabel="Go back"
                className="shrink-0"
                color="secondary"
                radius={resolvedItemRadiusKey}
                size={resolvedSizeKey}
                variant={resolvedItemVariant}
                onPress={onBack}>
                {backIcon ?? "Back"}
              </Button>
            )}

            {!isCollapsed &&
              title &&
              (typeof title === "string" ? (
                <Text
                  numberOfLines={1}
                  role={NATIVE_SIDEBAR_TITLE_ROLE[resolvedSizeKey]}
                  className="flex-1">
                  {title}
                </Text>
              ) : (
                <View className="flex-1">{title}</View>
              ))}
          </View>
        )}

        <ScrollView
          testID="sidebar-body"
          className={classNames(NATIVE_SIDEBAR_BODY_CLASS, bodyClassName)}>
          {filteredSections.map(renderSection)}
        </ScrollView>

        {/*
          The footer slot belongs to the consumer, and it is where their collapse control usually goes, so
          it is drawn in both states rather than only while expanded: a control that folds the column away
          and then disappears with it is a control nobody can use.
        */}
        {footer && (
          <View
            testID="sidebar-footer"
            className={classNames(
              NATIVE_SIDEBAR_FOOTER_CLASS,
              NATIVE_SIDEBAR_FOOTER_PADDING_CLASS[resolvedSizeKey],
              footerClassName,
            )}>
            {footer}
          </View>
        )}
      </View>
    </SidebarCollapseContext.Provider>
  );
}
