/**
 * Button component for the native package.
 *
 * The component satisfies the framework's button contract: the same prop names, the
 * same options and the same meaning as the web button, implemented the way the
 * platform behaves. It is a `Pressable`, so it gains the platform's own press
 * feedback and its own accessibility semantics, and it reports its state through
 * `accessibilityState` so a screen reader announces a disabled or busy control rather
 * than finding an ordinary one.
 */

import {
  type Color,
  type LinkSubstitution,
  type Radius,
  resolveCascade,
  resolvePress,
  type Size,
  type Variant,
} from "@asheeui/core";
import { type ElementType, type ReactNode, useRef } from "react";
import type { PressableProps, StyleProp, ViewStyle } from "react-native";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Text,
} from "react-native";
import { useReduceMotion } from "../../../hooks/use-reduce-motion";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import {
  NATIVE_BUTTON_BASE_CLASS,
  NATIVE_BUTTON_DISABLED_CLASS,
  NATIVE_BUTTON_FULL_WIDTH_CLASS,
  NATIVE_BUTTON_ICON_SIZE_CLASS,
  NATIVE_BUTTON_SIZE_CLASS,
  NATIVE_BUTTON_TEXT_CLASS,
  NATIVE_BUTTON_VARIANT_CLASS,
} from "../../../styles/button";
import { NATIVE_RADIUS_CLASS } from "../../../styles/radius";
import { cn } from "../../../utils/cn";
import { openDestination } from "../../../utils/open-destination";
import { useFormContext } from "../form/form-context";
import {
  FALLBACK_NATIVE_BUTTON_CONFIG,
  type NativeButtonConfig,
} from "./button-config";

/**
 * The substitution a button accepts, under the web renderer's key names.
 *
 * The web's `ButtonProps.link` states `component` and `props`; a router link needs a `to`
 * as well, so a native button accepts the same three rather than a shape of its own.
 */
export interface ButtonLinkProps
  extends Omit<LinkSubstitution<Record<string, unknown>>, "componentProps"> {
  /** Component that replaces the button, such as a router's link. */
  component?: ElementType;

  /** Props for that component, spread last so they win. */
  props?: Record<string, unknown>;

  /** A route destination a router understands. */
  to?: string;
}

/**
 * Props for the native Button.
 */
export interface ButtonProps
  extends NativeButtonConfig,
    Omit<PressableProps, "children" | "disabled" | "style"> {
  /** The button's visible label, and its accessible name. */
  children?: ReactNode;

  /** Whether the button is disabled. */
  isDisabled?: boolean;

  /** Whether the button shows a pending state and blocks interaction. */
  isLoading?: boolean;

  /**
   * Content rendered before the label.
   *
   * A native `Pressable` draws its children in a row, so the slot is a sibling of the
   * label rather than a wrapper around it; a string label still goes through `Text`, which
   * is the platform's own rule for a string inside a view.
   */
  startContent?: ReactNode;

  /** Content rendered after the label. */
  endContent?: ReactNode;

  /**
   * Render the compact icon-only layout.
   *
   * An icon has no text to size the control, so it takes a square from the size axis
   * instead of the padding a label would need. A consumer should also pass an
   * `accessibilityLabel`, because an icon alone has no name to announce.
   */
  icon?: boolean;

  /**
   * What activating the control means in a form.
   *
   * `"submit"` runs the enclosing `Form`'s handler and `"reset"` its reset handler; the
   * platform has no form element, so the meaning is carried by the context the form
   * provides rather than by the browser. `"button"` does nothing form-related.
   *
   * @default "button"
   */
  type?: "button" | "submit" | "reset";

  /**
   * A destination to follow when the control is pressed.
   *
   * A browser renders the button as an anchor; a device has none, so the destination is
   * followed through the platform's URL handler. A consumer's own `onPress`/`onClick`
   * wins, because a control that routes inside the application has somewhere else to go.
   */
  href?: string;

  /**
   * A component that replaces the button, under the web renderer's shape.
   *
   * The substitute receives `href`/`to`, `onPress`, the classes, the style and the
   * accessibility state; its own props are spread last, so a router's own props win.
   */
  link?: ButtonLinkProps;

  /**
   * A component that replaces the button, stated beside `link`.
   *
   * The web renderer accepts substitution both ways, so a shared call site keeps working
   * when it uses either spelling.
   */
  component?: ElementType;

  /** Props for {@link component}, spread last so they win. */
  componentProps?: Record<string, unknown>;

  /**
   * Called when the control is activated, under the name the web package uses.
   *
   * The platform's `Pressable` already accepts this name and hands the press event to it;
   * the button reads it explicitly so that it runs through the shared resolver, which owns
   * the order when both names are given. It is `onClick` first, as the web button documents.
   */
  onClick?: PressableProps["onClick"];

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A native button that resolves its appearance through the framework's cascade.
 *
 * The same prop names work here as on the web, and the platform differences are
 * defaults rather than props: the default density is larger, the press feedback is the
 * platform's, and a busy button is announced as busy. A consumer that wants the web's
 * smaller density asks for it with `size`, which is a contract both platforms share.
 *
 * @param props - The button's options and the platform's press props.
 * @param props.children - The label.
 * @param props.variant - Visual treatment. Defaults to the platform's `defaultVariant`.
 * @param props.color - Colour role. Defaults to the platform's `defaultColor`.
 * @param props.size - Density. Defaults to `"lg"`.
 * @param props.radius - Corner rounding. Defaults to the platform's `defaultRadius`.
 * @param props.fullWidth - Stretch to the container's width. Defaults to false.
 * @param props.isDisabled - Disable the control. Defaults to false.
 * @param props.isLoading - Show a pending state. Defaults to false.
 * @returns The rendered button.
 *
 * @example
 * ```tsx
 * <Button variant="solid" fullWidth onPress={save}>
 *   Save invoice
 * </Button>
 * ```
 *
 * @see Text - The typography component the label resolves through.
 */
export function Button({
  children,
  variant,
  color,
  size,
  radius,
  fullWidth,
  animate,
  isDisabled,
  isLoading,
  icon,
  type = "button",
  href,
  link,
  component,
  componentProps,
  startContent,
  endContent,
  className,
  style,
  onClick,
  onPress,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components.button;
  const form = useFormContext();
  const reduceMotion = useReduceMotion();

  // Every option resolves through the same four tiers: the instance prop, the
  // component's configuration (which already carries the registered defaults), the
  // platform default, and finally the value this component documents. Looking at one
  // option makes the rule for all of them visible.
  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    config.defaultVariant,
    FALLBACK_NATIVE_BUTTON_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<Color>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_BUTTON_CONFIG.color,
  );
  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_BUTTON_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_BUTTON_CONFIG.radius,
  );
  const resolvedFullWidth = resolveCascade<boolean>(
    fullWidth,
    sectionConfig?.fullWidth,
    undefined,
    FALLBACK_NATIVE_BUTTON_CONFIG.fullWidth,
  );
  const resolvedAnimate = resolveCascade<boolean>(
    animate,
    sectionConfig?.animate,
    undefined,
    FALLBACK_NATIVE_BUTTON_CONFIG.animate,
  );

  // A press scale is movement, so it yields to the platform's own motion setting. The
  // platform's press feedback still runs, because that is the control answering a touch
  // rather than the framework decorating the answer.
  const isAnimated = resolvedAnimate && !reduceMotion;
  const scale = useRef(new Animated.Value(1)).current;

  // A busy button is also disabled: pressing it twice would send the action twice.
  const isInteractionDisabled = Boolean(isDisabled) || Boolean(isLoading);

  const classes = cn(
    NATIVE_BUTTON_BASE_CLASS,
    icon
      ? NATIVE_BUTTON_ICON_SIZE_CLASS[resolvedSize]
      : NATIVE_BUTTON_SIZE_CLASS[resolvedSize],
    NATIVE_RADIUS_CLASS[resolvedRadius],
    NATIVE_BUTTON_VARIANT_CLASS[resolvedVariant][resolvedColor],
    NATIVE_BUTTON_TEXT_CLASS[resolvedVariant][resolvedColor],
    resolvedFullWidth && NATIVE_BUTTON_FULL_WIDTH_CLASS,
    isInteractionDisabled && NATIVE_BUTTON_DISABLED_CLASS,
    className,
  );

  const handlePress = (pressEvent: Parameters<NonNullable<PressableProps["onPress"]>>[0]) => {
    // The platform's callback may read the responder, so it is wrapped rather than
    // dropped; `resolvePress` still owns which name runs first.
    resolvePress(
      {
        onClick,
        onPress: onPress ? () => onPress(pressEvent) : undefined,
      },
      pressEvent,
    );

    // A destination is what the web's anchor would follow; it applies only when the
    // consumer stated no handler of its own, which is the rule native `Link` follows.
    // Inside a form, `type` says what the activation means.
    if (href && !onPress && !onClick) openDestination(href);
    if (type === "submit") form?.submit();
    else if (type === "reset") form?.reset();
  };

  const content = (
    <>
      {isLoading ? (
        // The spinner is decoration inside a control that already announces its busy
        // state. It is hidden from assistive technology on purpose, so a screen reader
        // hears "Save, busy" rather than "Loading, Save" and the button keeps one
        // stable name.
        <ActivityIndicator
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          size="small"
          testID="button-spinner"
        />
      ) : null}
      {startContent}
      {icon || typeof children !== "string" ? (
        children
      ) : (
        <Text>{children}</Text>
      )}
      {endContent}
    </>
  );

  // A consumer that routes internally names the component that renders the control. It
  // receives the destination a router understands (`to`) or the URL the web's anchor would
  // have followed (`href`), and its own props are spread last so they win.
  const Substitute = link?.component ?? component;
  if (Substitute) {
    const destination =
      link?.to !== undefined
        ? { to: link.to }
        : href !== undefined
          ? { href }
          : {};

    return (
      <Substitute
        {...destination}
        onPress={isInteractionDisabled ? undefined : handlePress}
        accessibilityRole="button"
        accessibilityState={{
          disabled: isInteractionDisabled,
          busy: Boolean(isLoading),
        }}
        disabled={isInteractionDisabled}
        className={classes}
        style={style}
        {...(link?.props ?? componentProps)}>
        {content}
      </Substitute>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled: isInteractionDisabled,
        busy: Boolean(isLoading),
      }}
      disabled={isInteractionDisabled}
      onPressIn={(event) => {
        if (isAnimated) {
          Animated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
            speed: 40,
            bounciness: 0,
          }).start();
        }
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        if (isAnimated) {
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 40,
            bounciness: 0,
          }).start();
        }
        onPressOut?.(event);
      }}
      onPress={isInteractionDisabled ? undefined : handlePress}
      className={classes}
      style={[style, isAnimated ? { transform: [{ scale }] } : undefined]}
      {...rest}>
      {content}
    </Pressable>
  );
}
