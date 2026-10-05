/**
 * Alert component for the native package.
 *
 * The component satisfies the framework's alert contract: the same intents, the same
 * treatment options, the same dismissal and the same wording as the web alert. What
 * differs is how the platform says the things it can say, and how it says the things
 * it cannot.
 *
 * An intent decides two things, and both are the framework's rather than the
 * renderer's: the colour role the message takes, and how urgently it is announced.
 * The colour comes from the map both renderers read. The urgency is stated twice,
 * deliberately, because the platform names it differently: the web exposes a live
 * region with the role `alert` or `status`, the platform has no `status` role, so a
 * message that interrupts carries the platform's `alert` role and an acknowledgement
 * is announced through a polite live region.
 *
 * The leading affordance is a character rather than a drawing, because this package
 * ships no icon set and the framework's native components already draw their
 * affordances from text (the stepper's tick, the picker's check, the calendar's
 * chevron). A consumer who wants a drawing passes `icon`, and the character is what
 * stands in its place when they do not.
 */

import {
  ALERT_TYPE_COLOR,
  ALERT_TYPE_ROLE,
  type AlertType,
  NATIVE_ALERT_BASE_CLASS,
  NATIVE_ALERT_BODY_CLASS,
  NATIVE_ALERT_DISMISS_CLASS,
  NATIVE_ALERT_DISMISS_GLYPH_CLASS,
  NATIVE_ALERT_GLYPH_CLASS,
  NATIVE_ALERT_ICON_CLASS,
  NATIVE_ALERT_TITLE_CLASS,
  NATIVE_ALERT_TYPE_GLYPH,
  NATIVE_ANNOUNCEMENT_LIVE_REGION,
  NATIVE_MESSAGE_SURFACE_CLASS,
  NATIVE_MESSAGE_TEXT_CLASS,
  NATIVE_RADIUS_CLASS,
  type Radius,
  resolveCascade,
  resolveMessageVariant,
  resolveNativeAnnouncementRole,
  type Variant,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { Pressable, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_ALERT_CONFIG,
  type NativeAlertConfig,
} from "./alert-config";

/**
 * Props for the native Alert.
 */
export interface AlertProps
  extends NativeAlertConfig,
    Omit<ViewProps, "children" | "style"> {
  /** Short heading for the message. */
  title?: string;

  /** Leading content, shown in place of the intent's default character. */
  icon?: ReactNode;

  /** The message body. */
  children?: ReactNode;

  /**
   * Whether the alert can be dismissed by the reader.
   * The dismiss control appears only when this is true and `onClose` is given.
   *
   * @default false
   */
  isClosable?: boolean;

  /** Called when the dismiss control is used. */
  onClose?: () => void;

  /**
   * Name of the dismiss control, for assistive technology.
   *
   * @default "Dismiss alert"
   */
  closeLabel?: string;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * An inline message or validation summary.
 *
 * @param props - The alert's options and the platform's view props.
 * @param props.type - Intent of the alert. Defaults to the configured value.
 * @param props.variant - Surface treatment. Defaults to the configured value.
 * @param props.radius - Corner rounding. Defaults to the configured value.
 * @param props.title - Short heading for the message.
 * @param props.icon - Leading content, in place of the intent's character.
 * @param props.isClosable - Whether a dismiss control is shown. Defaults to false.
 * @param props.onClose - Called when the dismiss control is used.
 * @param props.closeLabel - Name of the dismiss control. Defaults to "Dismiss alert".
 * @param props.className - Extra classes applied last.
 * @returns The rendered alert.
 *
 * @example
 * ```tsx
 * <Alert type="error" title="Payment failed">
 *   The card was declined. Check the details and try again.
 * </Alert>
 * ```
 *
 * @see NativeAlertConfig - The configuration type for component defaults.
 * @see ToastProvider - For messages that appear above the screen instead of inline.
 */
export function Alert({
  type,
  variant,
  radius,
  title,
  icon,
  isClosable = false,
  onClose,
  closeLabel = "Dismiss alert",
  className,
  style,
  children,
  ...rest
}: AlertProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.alert;

  const resolvedType = resolveCascade<AlertType>(
    type,
    sectionConfig?.type,
    undefined,
    FALLBACK_NATIVE_ALERT_CONFIG.type,
  );
  const resolvedVariant = resolveMessageVariant(
    resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_NATIVE_ALERT_CONFIG.variant,
    ),
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_ALERT_CONFIG.radius,
  );

  const role = ALERT_TYPE_ROLE[resolvedType];
  const colour = ALERT_TYPE_COLOR[resolvedType];
  const textClass = NATIVE_MESSAGE_TEXT_CLASS[resolvedVariant][colour];

  return (
    <View
      // The platform has no `status` role, so only a message that interrupts takes
      // a role, and the two levels are told apart by the live region instead. The
      // relation between the levels lives in the shared announcement module, so an
      // alert and a state region announce themselves the same way. A consumer's own
      // accessibility props are spread last, so they still win.
      accessibilityRole={resolveNativeAnnouncementRole(role)}
      accessibilityLiveRegion={NATIVE_ANNOUNCEMENT_LIVE_REGION[role]}
      className={classNames(
        NATIVE_ALERT_BASE_CLASS,
        NATIVE_MESSAGE_SURFACE_CLASS[resolvedVariant][colour],
        NATIVE_RADIUS_CLASS[resolvedRadius],
        className,
      )}
      style={style}
      {...rest}>
      <View
        // The decoration is hidden, so the message is announced once and the alert
        // keeps one stable reading instead of opening with a character.
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className={NATIVE_ALERT_ICON_CLASS}>
        {icon ?? (
          <Text
            role="label"
            className={classNames(NATIVE_ALERT_GLYPH_CLASS, textClass)}>
            {NATIVE_ALERT_TYPE_GLYPH[resolvedType]}
          </Text>
        )}
      </View>

      <View className={NATIVE_ALERT_BODY_CLASS}>
        {title && (
          <Text
            role="label"
            className={classNames(NATIVE_ALERT_TITLE_CLASS, textClass)}>
            {title}
          </Text>
        )}
        {children && (
          <Text role="body-sm" className={textClass}>
            {children}
          </Text>
        )}
      </View>

      {isClosable && onClose && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          onPress={onClose}
          className={NATIVE_ALERT_DISMISS_CLASS}>
          <Text
            role="label"
            className={classNames(NATIVE_ALERT_DISMISS_GLYPH_CLASS, textClass)}>
            ✕
          </Text>
        </Pressable>
      )}
    </View>
  );
}
