/**
 * Avatar component for AsheeUI.
 * This file provides the Avatar component, an entity representation that falls
 * back to its initials when there is no picture to show.
 */

"use client";

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Color, Radius, Size } from "../../shared";
import { RADIUS_CLASS, resolveVariantClass } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade, resolveClassKey } from "../../utils/resolve-token";
import { Image } from "../image";
import {
  type AvatarConfig,
  FALLBACK_AVATAR_CONFIG,
} from "./avatar-config";
import {
  AVATAR_BASE_CLASS,
  AVATAR_FALLBACK_VARIANT,
  AVATAR_FONT_CLASS,
  AVATAR_SIZE_CLASS,
} from "./avatar-styles";
import { getInitials } from "./avatar.helpers";

type BaseAvatarProps = AvatarConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "children">;

/**
 * Configuration options for the Avatar component.
 */
export interface AvatarProps extends BaseAvatarProps {
  /**
   * Name of the represented entity.
   * Supplies the initials the avatar falls back to and, unless `alt` overrides
   * it, the name assistive technology reads.
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
   * Custom image component, passed to {@link Image}.
   * This is how a consumer keeps a framework image working inside an avatar
   * (`DES-035`).
   */
  component?: ElementType;

  /**
   * Additional props for the custom image component, passed to {@link Image}.
   */
  imageProps?: Record<string, unknown>;

  /**
   * Content shown in place of the initials when there is no picture.
   */
  fallback?: ReactNode;
}

/**
 * An entity representation with an initials fallback.
 *
 * Avatar shows the picture of a person or an entity, and falls back to that
 * entity's initials when there is no picture or the picture fails to load. The
 * fallback sits on the accent surface of the resolved colour, and the picture
 * is rendered through the framework's {@link Image} primitive, so a consumer
 * keeps its own image component by passing `component`.
 *
 * The avatar carries the entity's name as a single image role with a label, so
 * assistive technology reads one name instead of the initials and the picture
 * separately. With neither a name nor an alternative given, the avatar is
 * decoration and is hidden from assistive technology: that is the right
 * behaviour for a purely decorative picture beside text that already names the
 * entity.
 *
 * Diameter, radius and colour resolve through the standard AsheeUI cascade:
 * prop, component config, global theme defaults, and the built-in fallback.
 *
 * @param props - Avatar configuration options and div attributes.
 * @param props.name - The represented entity's name.
 * @param props.src - The picture's source.
 * @param props.alt - Name for assistive technology, instead of `name`.
 * @param props.component - Custom image component, passed to `Image`.
 * @param props.imageProps - Additional props for that image component.
 * @param props.fallback - Content shown when there is no picture.
 * @param props.size - Diameter scale. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "full".
 * @param props.color - Accent colour of the fallback surface.
 * @param props.className - Extra classes applied last, which is where a
 * consumer overrides the diameter.
 *
 * @example
 * ```tsx
 * <Avatar name="Ada Lovelace" src="/ada.png" />
 * ```
 *
 * @example
 * ```tsx
 * // No picture: the initials carry the identity.
 * <Avatar name="Ada Lovelace" size="lg" />
 * ```
 *
 * @see AvatarConfig - The configuration type for component defaults.
 * @see Image - The framework's image primitive.
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      name,
      src,
      alt,
      component,
      imageProps,
      fallback,
      size,
      radius,
      color,
      className,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.avatar as AvatarConfig | undefined;
    const [hasImageError, setHasImageError] = useState(false);

    const resolvedSizeKey = resolveCascade<Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_AVATAR_CONFIG.size,
    );

    const resolvedRadiusKey = resolveCascade<Radius>(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_AVATAR_CONFIG.radius,
    );

    const resolvedColorKey = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_AVATAR_CONFIG.color,
    );

    const sizeClass = resolveClassKey(
      resolvedSizeKey,
      AVATAR_SIZE_CLASS,
      FALLBACK_AVATAR_CONFIG.size,
    );

    const fontClass = resolveClassKey(
      resolvedSizeKey,
      AVATAR_FONT_CLASS,
      FALLBACK_AVATAR_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey as Radius,
      RADIUS_CLASS,
      FALLBACK_AVATAR_CONFIG.radius,
    );

    const accessibleName = alt ?? name;
    const showsPicture = Boolean(src) && !hasImageError;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={accessibleName}
        aria-hidden={accessibleName ? undefined : true}
        className={cn(AVATAR_BASE_CLASS, sizeClass, radiusClass, className)}
        {...props}>
        {showsPicture ? (
          <Image
            src={src}
            // The avatar carries the name, so the picture inside it is
            // decoration and must not repeat the name.
            alt=""
            component={component}
            props={imageProps}
            fit="cover"
            radius={resolvedRadiusKey as Radius}
            showSkeleton={false}
            onError={() => setHasImageError(true)}
            className="size-full"
          />
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex items-center justify-center size-full",
              fontClass,
              resolveVariantClass(
                AVATAR_FALLBACK_VARIANT,
                resolvedColorKey,
              ),
            )}>
            {fallback ?? getInitials(name ?? "")}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";
