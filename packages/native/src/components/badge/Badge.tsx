/**
 * Badge component for the native package.
 *
 * The component satisfies the framework's badge contract: a compact status label
 * with the shared treatment, colour, density and radius axes, implemented as a
 * platform view with its own text. It announces itself to assistive technology as
 * one piece of text rather than as a container with a label inside it, so a
 * screen reader reads "Paid" rather than two nested elements.
 */

import {
  type ColorRole,
  type Radius,
  resolveCascade,
  type Size,
  type Variant,
} from "@asheeui/shared";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { Text, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import {
  FALLBACK_NATIVE_BADGE_CONFIG,
  type NativeBadgeConfig,
} from "./badge-config";
import {
  BADGE_BASE_CLASS,
  BADGE_RADIUS_CLASS,
  BADGE_SIZE_CLASS,
  BADGE_TEXT_CLASS,
  BADGE_VARIANT_CLASS,
} from "./badge-styles";

/**
 * Props for the native Badge.
 */
export interface BadgeProps
  extends NativeBadgeConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The label's text. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A compact status label.
 *
 * @param props - The badge's options and the platform's view props.
 * @param props.variant - Visual treatment. Defaults to the configured value.
 * @param props.color - Colour role. Defaults to the configured value.
 * @param props.size - Density. Defaults to the configured value.
 * @param props.radius - Corner rounding. Defaults to the configured value.
 * @returns The rendered label.
 *
 * @example
 * ```tsx
 * <Badge color="success">Paid</Badge>
 * ```
 */
export function Badge({
  variant,
  color,
  size,
  radius,
  className,
  style,
  children,
  ...rest
}: BadgeProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.badge;

  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    config.defaultVariant,
    FALLBACK_NATIVE_BADGE_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<ColorRole>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_BADGE_CONFIG.color,
  );
  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_BADGE_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_BADGE_CONFIG.radius,
  );

  return (
    <View
      className={classNames(
        BADGE_BASE_CLASS,
        BADGE_VARIANT_CLASS[resolvedVariant][resolvedColor],
        BADGE_RADIUS_CLASS[resolvedRadius],
        className,
      )}
      style={style}
      {...rest}>
      <Text
        accessible
        // The label is the badge's one accessible name, so it is read as a
        // single piece of text rather than as a view containing a text node.
        accessibilityLabel={typeof children === "string" ? children : undefined}
        className={classNames(
          BADGE_SIZE_CLASS[resolvedSize],
          BADGE_TEXT_CLASS[resolvedVariant][resolvedColor],
        )}>
        {children}
      </Text>
    </View>
  );
}
