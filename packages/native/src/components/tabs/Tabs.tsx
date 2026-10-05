/**
 * Tabs component for the native package.
 *
 * The component satisfies the framework's tabs contract: the same items, the same bar
 * treatments, the same densities, the same active and inactive styling and the same
 * controlled and uncontrolled selection as the web tabs.
 *
 * What the platform forces is the shape of the bar and the movement within it. A bar that
 * does not fit scrolls with the platform's own scroll view rather than with a wrapped
 * overflow, and a reader moves between triggers with the platform's screen-reader gestures
 * rather than with the arrow keys a keyboard has. A trigger is never shorter than the
 * shared touch target, because a tab is reached with a thumb here.
 *
 * A bar of `underline` tabs marks its selected trigger with the framework's underlined
 * treatment and the rule under the bar, which is the same arrangement the web draws.
 *
 * One thing the web states and this does not: the bar is not an accessibility element of
 * its own. A container that is one hides the controls inside it from a reader, and a
 * container that is not is never reached, so a native tab bar is a row of tabs rather than
 * one tablist — each trigger carries the tab role and says whether it is selected, which is
 * what a screen reader reads a tab bar with.
 */

import {
  type Color,
  NATIVE_RADIUS_CLASS,
  NATIVE_TABS_LIST_CLASS,
  NATIVE_TABS_PANEL_CLASS,
  NATIVE_TABS_TRIGGER_CLASS,
  NATIVE_TABS_VARIANT_CONTENT_CLASS,
  NATIVE_TABS_VARIANT_LIST_CLASS,
  type Radius,
  resolveCascade,
  type Size,
  TABS_FONT_CLASS,
  TABS_PADDING_X_CLASS,
  type TabItem,
  type TabsOptionsConfig,
  type TabsVariant,
  type Variant,
} from "@asheeui/core";
import { useState } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { ScrollView, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Button } from "../button/Button";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_TABS_CONFIG,
  type NativeTabsConfig,
} from "./tabs-config";

/**
 * Options for the triggers, which the web states under `options` too.
 */
export interface NativeTabsOptions extends TabsOptionsConfig {
  /** Extra classes applied to every trigger. */
  tabClassName?: string;
}

/**
 * Props for the native Tabs.
 */
export interface TabsProps
  extends Omit<NativeTabsConfig, "options">,
    Omit<ViewProps, "children" | "style"> {
  /** The tabs to render. */
  tabs: TabItem[];

  /**
   * The selected tab.
   * When it is given the tabs are controlled and report changes through `onChange`.
   */
  activeId?: string | number;

  /** The tab selected at first, for tabs that are not controlled. */
  defaultActiveId?: string | number;

  /** Called with the identifier of the tab the reader selected. */
  onChange?: (id: string | number) => void;

  /**
   * Whether every trigger stretches to fill the bar.
   *
   * @default false
   */
  fullWidth?: boolean;

  /** Options for the triggers, with the instance-only class override. */
  options?: NativeTabsOptions;

  /** Extra classes for the bar. */
  tabListClassName?: string;

  /** Extra classes for the region a selected tab reveals. */
  tabPanelClassName?: string;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A bar of tabs and the region the selected one reveals.
 *
 * @param props - The tabs, their options and the platform's view props.
 * @param props.tabs - The tabs to render.
 * @param props.activeId - The selected tab, when the consumer owns that state.
 * @param props.defaultActiveId - The tab selected at first, otherwise.
 * @param props.onChange - Called with the identifier of the tab selected.
 * @param props.variant - Treatment of the bar. Defaults to the configured value.
 * @param props.size - Density of the triggers. Defaults to the configured value.
 * @param props.radius - Corner rounding of the bar. Defaults to the configured value.
 * @param props.fullWidth - Whether the triggers stretch to fill the bar.
 * @param props.options - Styling of a selected and an unselected trigger.
 * @param props.className - Extra classes applied last.
 * @returns The rendered tabs.
 *
 * @example
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { id: "invoices", label: "Invoices", content: "42 open" },
 *     { id: "clients", label: "Clients", content: "9 active" },
 *   ]}
 * />
 * ```
 *
 * @see NativeTabsConfig - The configuration type for component defaults.
 */
export function Tabs({
  tabs,
  activeId: activeIdProp,
  defaultActiveId,
  onChange,
  variant,
  size,
  radius,
  options,
  fullWidth = false,
  tabListClassName,
  tabPanelClassName,
  className,
  style,
  ...rest
}: TabsProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.tabs;

  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_TABS_CONFIG.size,
  );
  const resolvedVariant = resolveCascade<TabsVariant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_NATIVE_TABS_CONFIG.variant,
  );
  const resolvedActiveVariant = resolveCascade<Variant>(
    options?.active?.variant,
    sectionConfig?.options?.active?.variant,
    config.defaultVariant,
    FALLBACK_NATIVE_TABS_CONFIG.options.active.variant,
  );
  const resolvedActiveColor = resolveCascade<Color>(
    options?.active?.color,
    sectionConfig?.options?.active?.color,
    config.defaultColor as Color | undefined,
    FALLBACK_NATIVE_TABS_CONFIG.options.active.color,
  );
  const resolvedInactiveVariant = resolveCascade<Variant>(
    options?.inactive?.variant,
    sectionConfig?.options?.inactive?.variant,
    undefined,
    FALLBACK_NATIVE_TABS_CONFIG.options.inactive.variant,
  );
  const resolvedInactiveColor = resolveCascade<Color>(
    options?.inactive?.color,
    sectionConfig?.options?.inactive?.color,
    undefined,
    FALLBACK_NATIVE_TABS_CONFIG.options.inactive.color,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_TABS_CONFIG.radius,
  );
  const resolvedActiveRadius = resolveCascade<Radius>(
    options?.active?.radius,
    sectionConfig?.options?.active?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_TABS_CONFIG.options.active.radius,
  );
  const resolvedInactiveRadius = resolveCascade<Radius>(
    options?.inactive?.radius,
    sectionConfig?.options?.inactive?.radius,
    resolvedRadius,
    FALLBACK_NATIVE_TABS_CONFIG.options.inactive.radius,
  );

  const [ownActiveId, setOwnActiveId] = useState<string | number | undefined>(
    () => defaultActiveId ?? tabs[0]?.id,
  );
  const isControlled = activeIdProp !== undefined;
  const activeTabId = isControlled ? activeIdProp : ownActiveId;

  const select = (id: string | number) => {
    if (!isControlled) {
      setOwnActiveId(id);
    }

    onChange?.(id);
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  return (
    <View
      className={classNames("w-full flex-col gap-4", className)}
      style={style}
      {...rest}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={classNames(
          NATIVE_TABS_VARIANT_LIST_CLASS[resolvedVariant],
          resolvedVariant !== "underline" &&
            NATIVE_RADIUS_CLASS[resolvedRadius],
          tabListClassName,
        )}>
        <View
          className={classNames(
            NATIVE_TABS_LIST_CLASS,
            NATIVE_TABS_VARIANT_CONTENT_CLASS[resolvedVariant],
          )}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const label = tab.label ?? tab.name;

            return (
              <Button
                key={String(tab.id)}
                accessibilityRole="tab"
                accessibilityState={{
                  selected: isActive,
                  disabled: tab.disabled,
                }}
                accessibilityLabel={
                  typeof label === "string" ? label : undefined
                }
                isDisabled={tab.disabled}
                size={resolvedSize}
                radius={
                  isActive ? resolvedActiveRadius : resolvedInactiveRadius
                }
                variant={
                  isActive
                    ? resolvedVariant === "underline"
                      ? "underlined"
                      : resolvedActiveVariant
                    : resolvedInactiveVariant
                }
                color={
                  isActive
                    ? (tab.activeColor ?? resolvedActiveColor)
                    : resolvedInactiveColor
                }
                onPress={() => select(tab.id)}
                className={classNames(
                  NATIVE_TABS_TRIGGER_CLASS,
                  TABS_PADDING_X_CLASS[resolvedSize],
                  TABS_FONT_CLASS[resolvedSize],
                  fullWidth && "flex-1",
                  options?.tabClassName,
                )}>
                {tab.icon}
                {typeof label === "string" ? (
                  // The platform cannot draw a string inside a control, so a label that is
                  // one is drawn as the framework's text.
                  <Text role="label">{label}</Text>
                ) : (
                  label
                )}
                {tab.badge}
              </Button>
            );
          })}
        </View>
      </ScrollView>

      <View className={classNames(NATIVE_TABS_PANEL_CLASS, tabPanelClassName)}>
        {typeof activeTab?.content === "string" ? (
          <Text role="body-md">{activeTab.content}</Text>
        ) : (
          activeTab?.content
        )}
      </View>
    </View>
  );
}
