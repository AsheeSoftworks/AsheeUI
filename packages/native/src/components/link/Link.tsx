/**
 * Link component for the native package.
 *
 * The component satisfies the framework's link contract: the same emphasis, the same
 * colour roles, the same densities, the same underline behaviour and the same external
 * affordance as the web link. What differs is what follows the destination.
 *
 * On the web a link is an anchor and the browser follows it. The platform has no anchor,
 * so the destination is handed to the platform's own URL handler through the same
 * `openDestination` helper the framework's configured actions use. A consumer whose
 * application routes internally passes `onPress` instead, or names the component that
 * should render the link through `component` and `componentProps`, which is the same
 * substitution API the web link offers.
 *
 * Two things follow from the platform rather than from a preference. The underline is
 * revealed while the link is **pressed**, because there is no pointer to hover with. And
 * the role's colour is stated on the label as well as on the link, because the platform's
 * text does not inherit the colour of the container around it the way the web's does.
 */

import {
  type ColorRole,
  LINK_SIZE_CLASS,
  type LinkUnderline,
  type LinkVariant,
  NATIVE_LINK_BASE_CLASS,
  NATIVE_LINK_COLOR_CLASS,
  NATIVE_LINK_DISABLED_CLASS,
  NATIVE_LINK_EXTERNAL_GLYPH,
  NATIVE_LINK_ICON_CLASS,
  NATIVE_LINK_ICON_SIZE_CLASS,
  NATIVE_LINK_UNDERLINE_CLASS,
  NATIVE_LINK_VARIANT_CLASS,
  resolveCascade,
  type Size,
} from "@asheeui/core";
import type { ElementType, ReactNode } from "react";
import type { PressableProps, StyleProp, ViewStyle } from "react-native";
import { Pressable, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { openDestination } from "../../utils/open-destination";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_LINK_CONFIG,
  type NativeLinkConfig,
} from "./link-config";

/**
 * Props for the native Link.
 */
export interface LinkProps
  extends NativeLinkConfig,
    Omit<PressableProps, "children" | "style"> {
  /** The destination URL of the link. */
  href?: string;

  /**
   * Whether the link points to another resource.
   * When true the link shows the external affordance, so a reader knows the platform
   * will leave the application.
   */
  isExternal?: boolean;

  /**
   * Whether the link is disabled.
   * A disabled link follows nothing and is reported as disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /** Content rendered before the link text. */
  startIcon?: ReactNode;

  /**
   * Content rendered after the link text.
   * When it is not given and the link is external, the framework shows the external
   * affordance instead.
   */
  endIcon?: ReactNode;

  /** The link's text. */
  children?: ReactNode;

  /**
   * Component that replaces the link, such as a navigation library's own link.
   *
   * The substitution API is shared with `Image` and `Form`: `component` names the
   * component and `componentProps` carries the props it needs.
   */
  component?: ElementType;

  /**
   * Additional props for `component`.
   * These take precedence over the props the framework passes itself.
   */
  componentProps?: Record<string, unknown>;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A navigational link.
 *
 * The link resolves its emphasis, colour, density and underline through the standard
 * AsheeUI cascade, and follows its destination through the platform's own URL handler
 * unless the consumer supplies one.
 *
 * @param props - The link's options and the platform's pressable props.
 * @param props.href - The destination URL.
 * @param props.variant - Emphasis. Defaults to the configured value.
 * @param props.color - Colour role. Defaults to the configured value.
 * @param props.size - Density. Defaults to the configured value.
 * @param props.underline - When the underline is shown. Defaults to the configured value.
 * @param props.isExternal - Whether the destination is outside the application.
 * @param props.disabled - Whether the link responds at all. Defaults to false.
 * @param props.startIcon - Content before the text.
 * @param props.endIcon - Content after the text.
 * @param props.component - Component that replaces the link.
 * @param props.componentProps - Props for that component.
 * @param props.className - Extra classes applied last.
 * @returns The rendered link.
 *
 * @example
 * ```tsx
 * <Link href="https://asheesoftworks.com" isExternal>
 *   Ashee Softworks
 * </Link>
 * ```
 *
 * @see NativeLinkConfig - The configuration type for component defaults.
 * @see openDestination - How a configured destination is followed here.
 */
export function Link({
  href,
  isExternal,
  disabled = false,
  startIcon,
  endIcon,
  variant,
  color,
  size,
  underline,
  component,
  componentProps,
  onPress,
  className,
  style,
  children,
  ...rest
}: LinkProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.link;

  const resolvedVariant = resolveCascade<LinkVariant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_NATIVE_LINK_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<ColorRole>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_LINK_CONFIG.color,
  );
  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_LINK_CONFIG.size,
  );
  const resolvedUnderline = resolveCascade<LinkUnderline>(
    underline,
    sectionConfig?.underline,
    undefined,
    FALLBACK_NATIVE_LINK_CONFIG.underline,
  );
  const resolvedIsExternal = resolveCascade<boolean>(
    isExternal,
    sectionConfig?.isExternal,
    undefined,
    FALLBACK_NATIVE_LINK_CONFIG.isExternal,
  );

  // A muted link takes the quiet treatment instead of a colour role, which is what the
  // web link does: the variant is the emphasis, and a colour role would fight it.
  const colourClass =
    resolvedVariant === "muted"
      ? NATIVE_LINK_VARIANT_CLASS.muted
      : classNames(
          NATIVE_LINK_COLOR_CLASS[resolvedColor],
          NATIVE_LINK_VARIANT_CLASS[resolvedVariant],
        );

  const classes = classNames(
    NATIVE_LINK_BASE_CLASS,
    LINK_SIZE_CLASS[resolvedSize],
    colourClass,
    NATIVE_LINK_UNDERLINE_CLASS[resolvedUnderline],
    disabled && NATIVE_LINK_DISABLED_CLASS,
    className,
  );

  const iconSizeClass = NATIVE_LINK_ICON_SIZE_CLASS[resolvedSize];

  const content = (
    <>
      {startIcon && (
        <View className={classNames(NATIVE_LINK_ICON_CLASS, iconSizeClass)}>
          {startIcon}
        </View>
      )}

      {typeof children === "string" ? (
        // The platform's text does not inherit a container's colour, so the label states
        // the role's colour itself rather than relying on the link's own classes.
        <Text role="body-md" className={colourClass}>
          {children}
        </Text>
      ) : (
        children
      )}

      {endIcon ? (
        <View className={classNames(NATIVE_LINK_ICON_CLASS, iconSizeClass)}>
          {endIcon}
        </View>
      ) : (
        resolvedIsExternal && (
          <Text role="label" className={classNames(iconSizeClass, colourClass)}>
            {NATIVE_LINK_EXTERNAL_GLYPH}
          </Text>
        )
      )}
    </>
  );

  /** Follow the destination through the platform's URL handler. */
  const followDestination = () => {
    if (href) {
      openDestination(href);
    }
  };

  // The consumer's own handler wins: a link that routes inside the application has
  // somewhere else to go than the platform's URL handler, and it says so by handling the
  // press itself. A disabled link has no handler at all.
  const press = disabled ? undefined : (onPress ?? followDestination);

  // A consumer that routes internally names the component that renders the link, which
  // is the same substitution API the web link offers.
  if (component) {
    const Component = component;

    return (
      <Component
        href={href}
        onPress={press}
        accessibilityRole="link"
        accessibilityState={{ disabled }}
        className={classes}
        style={style}
        {...componentProps}>
        {content}
      </Component>
    );
  }

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={press}
      className={classes}
      style={style}
      {...rest}>
      {content}
    </Pressable>
  );
}
