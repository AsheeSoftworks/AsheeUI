/**
 * Card component for the native package.
 *
 * The component satisfies the framework's card contract: the same headline and
 * supporting text, the same optional header and footer, and the same treatment
 * options as the web card, implemented as a platform surface. A pressable card is
 * a `Pressable`, so it gains the platform's own press feedback and announces
 * itself as a control.
 */

import {
  type ColorRole,
  type Radius,
  resolveCascade,
  type Size,
  type Variant,
} from "@asheeui/shared";
import type { ReactNode } from "react";
import type {
  PressableProps,
  StyleProp,
  ViewProps,
  ViewStyle,
} from "react-native";
import { Pressable, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_CARD_CONFIG,
  type NativeCardConfig,
} from "./card-config";
import {
  CARD_BASE_CLASS,
  CARD_COLOR_CLASS,
  CARD_FOOTER_CLASS,
  CARD_HEADING_CLASS,
  CARD_RADIUS_CLASS,
  CARD_SIZE_CLASS,
  CARD_VARIANT_CLASS,
} from "./card-styles";

/**
 * Props for the native Card.
 */
export interface CardProps
  extends NativeCardConfig,
    Omit<ViewProps, "children" | "style">,
    Pick<PressableProps, "onPress" | "accessibilityLabel"> {
  /** The card's title. */
  title?: string;

  /** The card's supporting text. */
  description?: string;

  /** Content rendered before the headline, typically an accent element. */
  header?: ReactNode;

  /** Content rendered after the body, typically actions. */
  footer?: ReactNode;

  /** The card's body, when it holds more than a headline. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A grouped content surface.
 *
 * @param props - The card's options and the platform's view props.
 * @param props.title - The card's title.
 * @param props.description - The card's supporting text.
 * @param props.header - Content before the headline.
 * @param props.footer - Content after the body.
 * @param props.variant - Surface treatment. Defaults to the configured value.
 * @param props.color - Accent colour of the border. Defaults to the configured value.
 * @param props.size - Density. Defaults to the configured value.
 * @param props.radius - Corner rounding. Defaults to the configured value.
 * @param props.isPressable - Make the whole card a control. Defaults to the configured value.
 * @returns The rendered card.
 *
 * @example
 * ```tsx
 * <Card title="Inbox" description="12 unread" footer={<Button size="sm">Open</Button>} />
 * ```
 *
 * @see Badge - A compact status label, which a card usually carries.
 */
export function Card({
  title,
  description,
  header,
  footer,
  variant,
  color,
  size,
  radius,
  isPressable,
  onPress,
  className,
  style,
  children,
  ...rest
}: CardProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.card;

  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    config.defaultVariant,
    FALLBACK_NATIVE_CARD_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<ColorRole>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_CARD_CONFIG.color,
  );
  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_CARD_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_CARD_CONFIG.radius,
  );
  const resolvedPressable = resolveCascade<boolean>(
    isPressable,
    sectionConfig?.isPressable,
    undefined,
    FALLBACK_NATIVE_CARD_CONFIG.isPressable,
  );

  const classes = classNames(
    CARD_BASE_CLASS,
    CARD_VARIANT_CLASS[resolvedVariant],
    // The accent only shows on a treatment that draws a border.
    resolvedVariant === "bordered" || resolvedVariant === "underlined"
      ? CARD_COLOR_CLASS[resolvedColor]
      : undefined,
    CARD_SIZE_CLASS[resolvedSize],
    CARD_RADIUS_CLASS[resolvedRadius],
    className,
  );

  const body = (
    <>
      {header}
      {(title || description) && (
        <View className={CARD_HEADING_CLASS}>
          {title && <Text role="heading-sm">{title}</Text>}
          {description && (
            <Text role="body-sm" tone="muted">
              {description}
            </Text>
          )}
        </View>
      )}
      {children}
      {footer && <View className={CARD_FOOTER_CLASS}>{footer}</View>}
    </>
  );

  if (resolvedPressable) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className={classes}
        style={style}
        {...rest}>
        {body}
      </Pressable>
    );
  }

  return (
    <View className={classes} style={style} {...rest}>
      {body}
    </View>
  );
}
