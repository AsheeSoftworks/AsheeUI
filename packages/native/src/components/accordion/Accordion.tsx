/**
 * Accordion component for the native package.
 *
 * The component satisfies the framework's accordion contract: the same item shape, the
 * same treatments, the same densities, the same single-or-multiple behaviour and the same
 * controlled and uncontrolled open state as the web accordion.
 *
 * Opening and closing are animated by the platform rather than by the framework. The web
 * transitions a grid row from nothing to its content's height; the platform has its own
 * animator for exactly this case, so the framework asks it to animate the next layout
 * change and lets the platform do the interpolation. A consumer who wants no movement at
 * all states it once.
 *
 * A closed panel is **not drawn** rather than drawn and hidden. That is what takes its
 * content out of the accessibility tree, which is what the web does with `inert`: the
 * platform has no way to hide a subtree from a reader while leaving it laid out, so
 * unmounting it is the honest answer rather than a visual-only collapse.
 *
 * A disabled item is reported as disabled and responds to nothing, which is the same
 * statement the web makes with the `disabled` attribute on the trigger.
 */

import {
  ACCORDION_CONTENT_SIZE_CLASS,
  ACCORDION_HEADER_SIZE_CLASS,
  type AccordionItem,
  type AccordionSizeKey,
  type AccordionVariant,
  NATIVE_ACCORDION_CONTENT_CLASS,
  NATIVE_ACCORDION_DIVIDER_CLASS,
  NATIVE_ACCORDION_HEADER_CLASS,
  NATIVE_ACCORDION_HEADER_TEXT_CLASS,
  NATIVE_ACCORDION_HEADING_CLASS,
  NATIVE_ACCORDION_ICON_CLASS,
  NATIVE_ACCORDION_INDICATOR_CLASS,
  NATIVE_ACCORDION_INDICATOR_GLYPH,
  NATIVE_ACCORDION_INDICATOR_OPEN_CLASS,
  NATIVE_ACCORDION_SUBTITLE_CLASS,
  NATIVE_ACCORDION_TITLE_CLASS,
  NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS,
  NATIVE_ACCORDION_VARIANT_ITEM_CLASS,
  NATIVE_RADIUS_CLASS,
  type Radius,
  resolveCascade,
} from "@asheeui/core";
import { type ReactNode, useState } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { LayoutAnimation, Pressable, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_ACCORDION_CONFIG,
  type NativeAccordionConfig,
} from "./accordion-config";

/**
 * Props for the native Accordion.
 */
export interface AccordionProps
  extends NativeAccordionConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The items to render. */
  items: AccordionItem[];

  /** The items open at first, for an accordion that is not controlled. */
  defaultValue?: string | string[];

  /**
   * The items that are open.
   * When it is given the accordion is controlled and reports changes through
   * `onValueChange` rather than deciding anything itself.
   */
  value?: string | string[];

  /** Called with the items that are open, whenever that changes. */
  onValueChange?: (value: string[]) => void;

  /** Content rendered as the expand indicator, in place of the framework's character. */
  expandIcon?: ReactNode;

  /** Extra classes applied to every item. */
  itemClassName?: string;

  /** Extra classes applied to every trigger. */
  headerClassName?: string;

  /** Extra classes applied to every revealed panel. */
  contentClassName?: string;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Read the open items as a list, whichever way they were stated.
 *
 * @param value - A single key, a list of keys, or nothing.
 * @returns The keys as a list.
 */
function toKeys(value?: string | string[]): string[] {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

/**
 * A stack of expandable sections.
 *
 * @param props - The accordion's items, its options and the platform's view props.
 * @param props.items - The sections.
 * @param props.value - The items that are open, when the consumer owns that state.
 * @param props.defaultValue - The items open at first, otherwise.
 * @param props.onValueChange - Called with the open items.
 * @param props.variant - Treatment of the stack. Defaults to the configured value.
 * @param props.size - Density of the triggers and panels. Defaults to the configured value.
 * @param props.radius - Corner rounding. Defaults to the configured value.
 * @param props.allowMultiple - Whether more than one item may stay open.
 * @param props.disableAnimation - Whether opening and closing happen without movement.
 * @param props.expandIcon - Content that replaces the framework's indicator.
 * @param props.className - Extra classes applied last.
 * @returns The rendered accordion.
 *
 * @example
 * ```tsx
 * <Accordion
 *   items={[
 *     { id: "plan", title: "Which plan suits me?", content: "The standard plan." },
 *     { id: "refund", title: "Can I get a refund?", content: "Within thirty days." },
 *   ]}
 * />
 * ```
 *
 * @see NativeAccordionConfig - The configuration type for component defaults.
 */
export function Accordion({
  items,
  defaultValue,
  value,
  onValueChange,
  expandIcon,
  itemClassName,
  headerClassName,
  contentClassName,
  variant,
  size,
  radius,
  allowMultiple,
  disableAnimation = false,
  className,
  style,
  ...rest
}: AccordionProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.accordion;

  const resolvedSize = resolveCascade<AccordionSizeKey>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_ACCORDION_CONFIG.size,
  );
  const resolvedVariant = resolveCascade<AccordionVariant>(
    variant,
    sectionConfig?.variant,
    config.defaultVariant as AccordionVariant | undefined,
    FALLBACK_NATIVE_ACCORDION_CONFIG.variant,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_ACCORDION_CONFIG.radius,
  );
  const resolvedAllowMultiple = resolveCascade<boolean>(
    allowMultiple,
    sectionConfig?.allowMultiple,
    undefined,
    FALLBACK_NATIVE_ACCORDION_CONFIG.allowMultiple,
  );

  // A treatment the accordion has none for — a global default stated for a filled
  // control — becomes the treatment it documents, which is what the web accordion does
  // with the same configuration.
  const containerVariantClass =
    NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS[resolvedVariant] ??
    NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS.separated;
  const itemVariantClass =
    NATIVE_ACCORDION_VARIANT_ITEM_CLASS[resolvedVariant] ??
    NATIVE_ACCORDION_VARIANT_ITEM_CLASS.separated;
  const itemRadiusClass =
    (resolvedVariant === "separated" || resolvedVariant === "ghost") &&
    NATIVE_RADIUS_CLASS[resolvedRadius];

  const [ownKeys, setOwnKeys] = useState<string[]>(() => toKeys(defaultValue));
  const isControlled = value !== undefined;
  const openKeys = isControlled ? toKeys(value) : ownKeys;

  const toggle = (key: string, isDisabled?: boolean) => {
    if (isDisabled) {
      return;
    }

    const isOpen = openKeys.includes(key);
    const next = resolvedAllowMultiple
      ? isOpen
        ? openKeys.filter((open) => open !== key)
        : [...openKeys, key]
      : isOpen
        ? []
        : [key];

    if (!disableAnimation) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    if (!isControlled) {
      setOwnKeys(next);
    }

    onValueChange?.(next);
  };

  return (
    <View
      className={classNames(containerVariantClass, className)}
      style={style}
      {...rest}>
      {items.map((item, index) => {
        const key = item.id ?? `item-${index}`;
        const isOpen = openKeys.includes(key);
        const isDivided =
          index > 0 &&
          (resolvedVariant === "bordered" || resolvedVariant === "ghost");

        return (
          <View
            key={key}
            className={classNames(
              itemVariantClass,
              itemRadiusClass,
              isDivided && NATIVE_ACCORDION_DIVIDER_CLASS,
              itemClassName,
            )}>
            <Pressable
              accessibilityRole="button"
              // The trigger's own name is its title and its supporting line, so a reader
              // hears "Can I get a refund? Within thirty days" rather than the title
              // followed by the expand indicator, which is decoration.
              accessibilityLabel={
                typeof item.title === "string"
                  ? typeof item.subtitle === "string"
                    ? `${item.title}. ${item.subtitle}`
                    : item.title
                  : undefined
              }
              accessibilityState={{ expanded: isOpen, disabled: item.disabled }}
              disabled={item.disabled}
              onPress={() => toggle(key, item.disabled)}
              className={classNames(
                NATIVE_ACCORDION_HEADER_CLASS,
                ACCORDION_HEADER_SIZE_CLASS[resolvedSize],
                headerClassName,
              )}>
              <View className={NATIVE_ACCORDION_HEADER_TEXT_CLASS}>
                {item.icon && (
                  <View className={NATIVE_ACCORDION_ICON_CLASS}>
                    {item.icon}
                  </View>
                )}
                <View className={NATIVE_ACCORDION_HEADING_CLASS}>
                  <Text
                    role="label"
                    className={NATIVE_ACCORDION_TITLE_CLASS}
                    numberOfLines={1}>
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text
                      role="caption"
                      className={NATIVE_ACCORDION_SUBTITLE_CLASS}
                      numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  )}
                </View>
              </View>

              <View
                // The indicator repeats the trigger's expanded state, which is already
                // announced, so the character is decoration and is kept out of the
                // announcement.
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                className={classNames(
                  NATIVE_ACCORDION_INDICATOR_CLASS,
                  isOpen && NATIVE_ACCORDION_INDICATOR_OPEN_CLASS,
                )}>
                {expandIcon ?? (
                  <Text role="label">{NATIVE_ACCORDION_INDICATOR_GLYPH}</Text>
                )}
              </View>
            </Pressable>

            {isOpen && (
              <View
                className={classNames(
                  NATIVE_ACCORDION_CONTENT_CLASS,
                  ACCORDION_CONTENT_SIZE_CLASS[resolvedSize],
                  contentClassName,
                )}>
                {/* The platform cannot draw a string inside a view, so a content that is
                    one is drawn as the framework's text, which is the same rule the
                    button and the link follow for their labels. */}
                {typeof item.content === "string" ? (
                  <Text role="body-md">{item.content}</Text>
                ) : (
                  item.content
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
