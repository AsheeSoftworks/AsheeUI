"use client";

import { cn } from "@asheeui/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, type HTMLAttributes, type ReactNode, useId } from "react";
import { useAsheeConfig } from "../../libs/context";
import { resolveAnimation } from "../../motion/resolve-animation";
import type { AnimationProp } from "../../motion/types";
import type { Radius } from "../../theme/radius/radius-config";
import type { Shadow } from "../../theme/shadow/shadow-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { Image } from "../image/Image";
import type { ImageFit, ImageRatioKey } from "../image/image-config";
import {
  type CardConfig,
  type CardImagePosition,
  type CardSizeKey,
  type CardVariant,
  FALLBACK_CARD_CONFIG,
} from "./card-config";
import {
  CARD_GAP_CLASS,
  CARD_HEADER_GAP_CLASS,
  CARD_PADDING_CLASS,
  CARD_RADIUS_CLASS,
  CARD_SHADOW_CLASS,
  CARD_VARIANT_CLASS,
} from "./card-styles";

// ─── Main Card Component ──────────────────────────────────────────────────────

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children" | "size"> {
  variant?: CardVariant;
  size?: CardSizeKey;
  radius?: keyof Radius;
  shadow?: keyof Shadow;
  animation?: AnimationProp;
  isClickable?: boolean;
  isDisabled?: boolean;
  href?: string;
  // Content Props
  title?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: CardImagePosition;
  imageRatio?: ImageRatioKey;
  imageFit?: ImageFit;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant,
      size,
      radius,
      shadow,
      animation,
      isClickable,
      isDisabled = false,
      href,
      title,
      description,
      header,
      body,
      footer,
      imageSrc,
      imageAlt = "",
      imagePosition,
      imageRatio,
      imageFit,
      className,
      children,
      onClick,
      id,
      style,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.card as CardConfig | undefined;

    const generatedId = useId();
    const cardId = id ?? generatedId;

    // ─── 1. Token Resolvers ───────────────────────────────────────────────────

    const resolvedSizeKey = resolveCascade<CardSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_CARD_CONFIG.size,
    );

    const resolvedVariant = resolveCascade<CardVariant>(
      variant,
      sectionConfig?.variant,
      config.theme.defaultVariant as CardVariant | undefined,
      FALLBACK_CARD_CONFIG.variant,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      typeof radius === "string" ? radius : undefined,
      typeof sectionConfig?.radius === "string" ? sectionConfig : undefined,
      config.theme.radius?.default,
      FALLBACK_CARD_CONFIG.radius,
    );

    const resolvedShadowKey = resolveCascade<string>(
      shadow,
      sectionConfig?.shadow,
      config.theme.shadow?.default,
      FALLBACK_CARD_CONFIG.shadow,
    );

    const resolvedImagePos = resolveCascade<CardImagePosition>(
      imagePosition,
      sectionConfig?.imagePosition,
      undefined,
      FALLBACK_CARD_CONFIG.imagePosition,
    );

    const resolvedClickable =
      isClickable ??
      Boolean(href || onClick) ??
      sectionConfig?.isClickable ??
      FALLBACK_CARD_CONFIG.isClickable;

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const paddingClass = resolveClassKey(
      resolvedSizeKey,
      CARD_PADDING_CLASS,
      FALLBACK_CARD_CONFIG.size,
    );

    const gapClass = resolveClassKey(
      resolvedSizeKey,
      CARD_GAP_CLASS,
      FALLBACK_CARD_CONFIG.size,
    );

    const headerGapClass = resolveClassKey(
      resolvedSizeKey,
      CARD_HEADER_GAP_CLASS,
      FALLBACK_CARD_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey,
      CARD_RADIUS_CLASS,
      FALLBACK_CARD_CONFIG.radius,
    );

    const shadowClass = resolveClassKey(
      resolvedShadowKey,
      CARD_SHADOW_CLASS,
      FALLBACK_CARD_CONFIG.shadow,
    );

    const variantClass =
      CARD_VARIANT_CLASS[resolvedVariant] ?? CARD_VARIANT_CLASS.bordered;

    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
    );

    const isSideLayout =
      resolvedImagePos === "left" || resolvedImagePos === "right";

    const isHorizontalImage = Boolean(imageSrc && isSideLayout);

    const renderImage = (position: CardImagePosition) => {
      if (!imageSrc || resolvedImagePos !== position) return null;

      const positionStyles = {
        top: "w-full shrink-0",
        bottom: "w-full shrink-0 order-last",
        left: "w-1/3 shrink-0 rounded-l-[inherit]",
        right: "w-1/3 shrink-0 order-last rounded-r-[inherit]",
        background:
          "absolute inset-0 z-0 w-full h-full opacity-40 pointer-events-none",
      }[position];

      return (
        <Image
          src={imageSrc}
          alt={imageAlt}
          ratio={
            imageRatio ??
            (position === "left" || position === "right" ? "auto" : "video")
          }
          fit={imageFit ?? "cover"}
          className={cn(positionStyles)}
        />
      );
    };

    const bodyContent = body ?? children;

    return (
      <motion.div
        ref={ref}
        id={cardId}
        tabIndex={resolvedClickable && !isDisabled ? 0 : undefined}
        role={resolvedClickable ? (href ? "link" : "button") : undefined}
        aria-disabled={isDisabled}
        onClick={isDisabled ? undefined : onClick}
        className={cn(
          "relative flex flex-col overflow-hidden transition-all duration-200 text-left",
          variantClass,
          radiusClass,
          shadowClass,
          isHorizontalImage && "flex-row items-stretch",
          resolvedClickable &&
            !isDisabled &&
            "cursor-pointer hover:shadow-lg hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isDisabled && "opacity-50 pointer-events-none select-none",
          sectionConfig?.className,
          className,
        )}
        style={style}
        {...(motionProps as HTMLMotionProps<"div">)}
        {...(rest as HTMLMotionProps<"div">)}>
        {renderImage("top")}
        {renderImage("background")}
        {renderImage("left")}

        {/* Main Content Slot Wrapper */}
        <div
          className={cn(
            "flex flex-col flex-1 z-10 w-full min-w-0",
            paddingClass,
            gapClass,
          )}>
          {/* Header Slot or Title/Description Props */}
          {(header || title || description) && (
            <div className={cn("flex flex-col z-10", headerGapClass)}>
              {header}
              {title && (
                <h3 className="font-semibold leading-tight tracking-tight text-foreground text-lg md:text-xl">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Body Slot */}
          {bodyContent && (
            <div className="flex-1 z-10 text-sm leading-relaxed">
              {bodyContent}
            </div>
          )}

          {/* Footer Slot */}
          {footer && (
            <div
              className={cn(
                "flex items-center justify-between z-10 mt-auto pt-2",
                gapClass,
              )}>
              {footer}
            </div>
          )}
        </div>

        {renderImage("right")}
        {renderImage("bottom")}
      </motion.div>
    );
  },
);

Card.displayName = "Card";
