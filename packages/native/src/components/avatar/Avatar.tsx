/**
 * Avatar component for the native package.
 *
 * The component satisfies the framework's avatar contract: the same name, the same
 * picture, the same alternative name, the same custom fallback and the same diameter,
 * rounding and accent options as the web avatar, implemented as the platform's own
 * surfaces. The picture is drawn through the framework's `Image`, so a consumer keeps its
 * own image component by passing `component`, and the initials come from
 * `getInitials` in `@asheeui/core`, so the same entity is presented the same way on both
 * platforms.
 *
 * The avatar carries the entity's name as one image role with a label, so assistive
 * technology reads one name instead of the initials and the picture separately. With
 * neither a name nor an alternative given, the avatar is decoration and is kept out of
 * the accessibility tree: that is the right behaviour for a purely decorative picture
 * beside text that already names the entity.
 */

import {
  type Color,
  getInitials,
  NATIVE_AVATAR_BASE_CLASS,
  NATIVE_AVATAR_FALLBACK_CLASS,
  NATIVE_AVATAR_FALLBACK_TEXT_CLASS,
  NATIVE_AVATAR_FONT_CLASS,
  NATIVE_AVATAR_INITIALS_CLASS,
  NATIVE_AVATAR_SIZE_CLASS,
  NATIVE_AVATAR_TEXT_BLOCK_CLASS,
  NATIVE_IMAGE_PICTURE_FILL_CLASS,
  NATIVE_RADIUS_CLASS,
  type Radius,
  resolveCascade,
  resolveClassKey,
  type Size,
} from "@asheeui/core";
import { type ElementType, type ReactNode, useState } from "react";
import {
  type StyleProp,
  Text,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Image } from "../image/Image";
import {
  FALLBACK_NATIVE_AVATAR_CONFIG,
  type NativeAvatarConfig,
} from "./avatar-config";

/**
 * Props for the native Avatar.
 */
export interface AvatarProps
  extends NativeAvatarConfig,
    Omit<ViewProps, "children" | "style"> {
  /**
   * Name of the represented entity.
   * Supplies the initials the avatar falls back to and, unless `alt` overrides it, the
   * name assistive technology reads.
   */
  name?: string;

  /**
   * Picture of the represented entity.
   * When it is missing or fails to load, the avatar shows its fallback.
   */
  src?: string;

  /**
   * Name assistive technology reads, instead of `name`.
   * Use it when the entity's name is not the wording the avatar should carry.
   */
  alt?: string;

  /**
   * Component that replaces the picture inside the avatar, passed to {@link Image}.
   * This is how a consumer keeps an optimised image component working inside an avatar.
   */
  component?: ElementType;

  /** Additional props for that component, passed to {@link Image}. */
  componentProps?: Record<string, unknown>;

  /** Content shown in place of the initials when there is no picture. */
  fallback?: ReactNode;

  /** Extra classes appended last, which is where a consumer overrides the diameter. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * An entity representation with an initials fallback.
 *
 * Avatar shows the picture of a person or an entity, and falls back to that entity's
 * initials when there is no picture or the picture fails to load. The fallback sits on
 * the accent surface of the resolved colour, and the picture is rendered through the
 * framework's {@link Image} primitive, so a consumer keeps its own image component by
 * passing `component`.
 *
 * Diameter, radius and colour resolve through the standard AsheeUI cascade: prop,
 * component config, global theme defaults and the built-in fallback.
 *
 * @param props - The avatar's options and the platform's view props.
 * @param props.name - The represented entity's name.
 * @param props.src - The picture's source.
 * @param props.alt - Name for assistive technology, instead of `name`.
 * @param props.component - Custom image component, passed to `Image`.
 * @param props.componentProps - Additional props for that component.
 * @param props.fallback - Content shown when there is no picture.
 * @param props.size - Diameter scale. Defaults to `"md"`.
 * @param props.radius - Corner rounding. Defaults to `"full"`.
 * @param props.color - Accent colour of the fallback surface.
 * @param props.className - Extra classes applied last.
 * @returns The rendered avatar.
 *
 * @example
 * ```tsx
 * <Avatar name="Ada Lovelace" src={ada.photo} />
 * ```
 *
 * @example
 * ```tsx
 * // No picture: the initials carry the identity.
 * <Avatar name="Ada Lovelace" size="lg" />
 * ```
 *
 * @see NativeAvatarConfig - The configuration type for component defaults.
 * @see Image - The framework's picture primitive.
 */
export function Avatar({
  name,
  src,
  alt,
  component,
  componentProps,
  fallback,
  size,
  radius,
  color,
  className,
  style,
  ...rest
}: AvatarProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.avatar;
  const [hasImageError, setHasImageError] = useState(false);

  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_AVATAR_CONFIG.size,
  );

  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_AVATAR_CONFIG.radius,
  );

  const resolvedColor = resolveCascade<Color>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_AVATAR_CONFIG.color,
  );

  const sizeClass = resolveClassKey(
    resolvedSize,
    NATIVE_AVATAR_SIZE_CLASS,
    FALLBACK_NATIVE_AVATAR_CONFIG.size,
  );

  const fontClass = resolveClassKey(
    resolvedSize,
    NATIVE_AVATAR_FONT_CLASS,
    FALLBACK_NATIVE_AVATAR_CONFIG.size,
  );

  const radiusClass = resolveClassKey(
    resolvedRadius,
    NATIVE_RADIUS_CLASS,
    FALLBACK_NATIVE_AVATAR_CONFIG.radius,
  );

  const accessibleName = alt ?? name;
  const showsPicture = Boolean(src) && !hasImageError;

  return (
    <View
      accessible={Boolean(accessibleName)}
      accessibilityRole="image"
      accessibilityLabel={accessibleName}
      accessibilityElementsHidden={accessibleName ? undefined : true}
      importantForAccessibility={
        accessibleName ? "auto" : "no-hide-descendants"
      }
      className={classNames(
        NATIVE_AVATAR_BASE_CLASS,
        sizeClass,
        radiusClass,
        className,
      )}
      style={style}
      {...rest}>
      {showsPicture ? (
        <Image
          src={src}
          // The avatar carries the name, so the picture inside it is decoration and must
          // not repeat the name.
          alt=""
          fit="cover"
          // The frame keeps the shape, which is what makes the picture fill the avatar.
          ratio="square"
          radius={resolvedRadius}
          showSkeleton={false}
          component={component}
          componentProps={componentProps}
          onError={() => setHasImageError(true)}
          // The framework's own picture class, because the picture inside an avatar is
          // the same picture the image module draws: it fills the frame it is given.
          className={NATIVE_IMAGE_PICTURE_FILL_CLASS}
        />
      ) : (
        <View
          className={classNames(
            NATIVE_AVATAR_TEXT_BLOCK_CLASS,
            NATIVE_AVATAR_FALLBACK_CLASS[resolvedColor],
          )}>
          <Text
            // The frame carries the layout and the text carries its own treatment.
            className={classNames(
              NATIVE_AVATAR_INITIALS_CLASS,
              fontClass,
              NATIVE_AVATAR_FALLBACK_TEXT_CLASS,
            )}>
            {fallback ?? getInitials(name ?? "")}
          </Text>
        </View>
      )}
    </View>
  );
}
