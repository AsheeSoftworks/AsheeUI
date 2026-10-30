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
  type CardImageConfig,
  type CardVariant,
  type Color,
  type Radius,
  resolveCascade,
  resolvePress,
  type Size,
} from "@asheeui/core";
import type { ElementType, ReactNode } from "react";
import type {
  PressableProps,
  StyleProp,
  ViewProps,
  ViewStyle,
} from "react-native";
import { Pressable, View } from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import { classNames } from "../../../utils/class-names";
import { Typography } from "../../typography/text/Text";
import { Image } from "../image/Image";
import {
  FALLBACK_NATIVE_CARD_CONFIG,
  type NativeCardConfig,
  resolveCardVariant,
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
    Pick<PressableProps, "onPress" | "accessibilityLabel" | "onClick"> {
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

  /**
   * The card's body, under the name the web card gives it.
   *
   * `body` wins over `children` when both are given, so a shared card can pass its
   * headline as children and its body separately.
   */
  body?: ReactNode;

  /**
   * The picture the card draws, under the web card's options.
   *
   * The placement is shared (`CardImageConfig`); a device also needs the source and its
   * alternative text, which the web states beside the config rather than inside it. The
   * top-level `src`/`alt` are aliases for the same two values.
   */
  image?:
    | (CardImageConfig & {
        src?: string;
        alt?: string;
      })
    | undefined;

  /** The picture's source, when it is stated beside `image` rather than inside it. */
  src?: string;

  /** Alternative text for the picture, beside `src`. */
  alt?: string;

  /**
   * Whether the surface is a control.
   *
   * The web card's name for `isPressable`; either one makes the card pressable, which is
   * what `resolvePress` and the accessibility role below read.
   */
  isClickable?: boolean;

  /** Whether the card refuses interaction and reports itself as disabled. */
  isDisabled?: boolean;

  /**
   * Called when the card is activated, under the name the web package uses.
   *
   * A card with `onClick` (or `onPress`) is a control whether or not `isPressable` says so,
   * which is the same rule the web card applies: a handler is what makes a surface
   * pressable. Both names run when both are given, `onClick` first. The type is the
   * platform's own press event, because `Pressable` is what reports it.
   */
  onClick?: PressableProps["onClick"];

  /**
   * A component that replaces the card's root, under the web renderer's shape.
   *
   * The substitute receives `href` or `to` (the card's destination), `onPress`, the
   * card's classes, style and accessibility role, and its own props last so they win. A
   * card with a link is a control whether or not `isPressable` says so, which is the web
   * card's rule too.
   */
  link?: CardLinkProps;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * The substitution a card accepts, under the web renderer's key names.
 */
export interface CardLinkProps {
  /** Component that replaces the card's root, such as a router's link. */
  component?: ElementType;

  /** Props for that component, spread last so they win. */
  props?: Record<string, unknown>;

  /** A route destination a router understands. */
  to?: string;
}

/**
 * A grouped content surface.
 *
 * @param props - The card's options and the platform's view props.
 * @param props.title - The card's title.
 * @param props.description - The card's supporting text.
 * @param props.header - Content before the headline.
 * @param props.footer - Content after the body.
 * @param props.variant - Surface treatment. Defaults to the application's `defaultVariant`.
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
  isClickable,
  isDisabled = false,
  image,
  src,
  alt,
  body: bodyProp,
  onClick,
  onPress,
  link,
  className,
  style,
  children,
  ...rest
}: CardProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components.card;

  // The cascade's component and global tiers can name a treatment from either
  // platform's vocabulary — the shared configuration states seven names, this card draws
  // five — so the cascade resolves the configured vocabulary and the shared resolver lands
  // it on a treatment the class map below always answers for.
  const resolvedVariant = resolveCardVariant(
    resolveCascade<CardVariant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_NATIVE_CARD_CONFIG.variant,
    ),
  );
  const resolvedColor = resolveCascade<Color>(
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

  // A handler is what makes a surface a control. The web card states the same rule, so a
  // card that gained `onClick` there and `onPress` here behaves alike without either
  // consumer having to remember `isPressable`. The web's `isClickable` is the same option
  // under the name it publishes, and a disabled card refuses both.
  const isPressableCard =
    Boolean(link?.component) ||
    (isClickable ?? resolvedPressable) ||
    Boolean(onClick) ||
    Boolean(onPress);

  const imageSource = image?.src ?? src;
  const imageAlt = image?.alt ?? alt;
  const imageNode = imageSource ? (
    <Image
      src={imageSource}
      alt={imageAlt}
      fit={image?.fit}
      ratio={image?.ratio}
      radius={resolvedRadius}
    />
  ) : null;

  const classes = classNames(
    CARD_BASE_CLASS,
    image?.position === "background" && "relative overflow-hidden",
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
      {image?.position === "background" ? (
        <View className="absolute inset-0">{imageNode}</View>
      ) : image?.position !== "bottom" ? (
        imageNode
      ) : null}
      {header}
      {(title || description) && (
        <View className={CARD_HEADING_CLASS}>
          {title && <Typography role="heading-sm">{title}</Typography>}
          {description && (
            <Typography role="body-sm" tone="muted">
              {description}
            </Typography>
          )}
        </View>
      )}
      {bodyProp ?? children}
      {image?.position === "bottom" ? imageNode : null}
      {footer && <View className={CARD_FOOTER_CLASS}>{footer}</View>}
    </>
  );

  if (link?.component) {
    const Substitute = link.component;
    const destination =
      link.to !== undefined ? { to: link.to } : {};

    return (
      <Substitute
        {...destination}
        onPress={
          isDisabled
            ? undefined
            : (pressEvent: Parameters<NonNullable<PressableProps["onPress"]>>[0]) =>
                resolvePress(
                  {
                    onClick,
                    onPress: onPress ? () => onPress(pressEvent) : undefined,
                  },
                  pressEvent,
                )
        }
        accessibilityRole="link"
        accessibilityState={{ disabled: isDisabled }}
        className={classes}
        style={style}
        {...link.props}>
        {body}
      </Substitute>
    );
  }

  if (isPressableCard) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        disabled={isDisabled}
        onPress={(pressEvent) =>
          isDisabled
            ? undefined
            : resolvePress(
                {
                  onClick,
                  onPress: onPress ? () => onPress(pressEvent) : undefined,
                },
                pressEvent,
              )
        }
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
