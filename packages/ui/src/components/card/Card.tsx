"use client";

import { cn } from "@asheeui/utils";
import {
  type ButtonHTMLAttributes,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useId,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import {
  resolveAnimate,
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { Image } from "../image/Image";
import type { ImageFit, ImageRatioKey } from "../image/image-config";
import {
  type CardConfig,
  type CardImagePosition,
  type CardVariant,
  FALLBACK_CARD_CONFIG,
} from "./card-config";
import {
  CARD_GAP_CLASS,
  CARD_HEADER_GAP_CLASS,
  CARD_PADDING_CLASS,
  CARD_VARIANT_CLASS,
} from "./card-styles";

export interface CardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title" | "children"> {
  variant?: CardVariant;
  size?: Size;
  radius?: Radius;
  animate?: boolean;
  isClickable?: boolean;
  isDisabled?: boolean;
  href?: string;
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

export const Card = forwardRef<HTMLButtonElement, CardProps>(
  (
    {
      variant,
      size,
      radius,
      animate,
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
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.card as CardConfig | undefined;

    const generatedId = useId();
    const cardId = id ?? generatedId;

    const resolvedSizeKey = resolveCascade<Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_CARD_CONFIG.size,
    );

    const resolvedVariant = resolveCascade<CardVariant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant as CardVariant | undefined,
      FALLBACK_CARD_CONFIG.variant,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_CARD_CONFIG.radius,
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

    const resolvedAnimate = resolveAnimate<boolean>(
      animate,
      sectionConfig?.animate,
      FALLBACK_CARD_CONFIG.animate,
    );

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
      resolvedRadiusKey as Radius,
      RADIUS_CLASS,
      FALLBACK_CARD_CONFIG.radius,
    );

    const variantClass =
      CARD_VARIANT_CLASS[resolvedVariant] ?? CARD_VARIANT_CLASS.bordered;

    const isSideLayout =
      resolvedImagePos === "left" || resolvedImagePos === "right";

    const isHorizontalImage = Boolean(imageSrc && isSideLayout);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
      if (href && !e.defaultPrevented) {
        window.location.href = href;
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (
        resolvedClickable &&
        !isDisabled &&
        (e.key === "Enter" || e.key === " ")
      ) {
        e.preventDefault();
      }
    };

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
      <button
        ref={ref}
        id={cardId}
        tabIndex={resolvedClickable && !isDisabled ? 0 : undefined}
        role={resolvedClickable ? (href ? "link" : "button") : undefined}
        aria-disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative flex flex-col overflow-hidden transition-colors duration-200 text-left",
          variantClass,
          radiusClass,
          isHorizontalImage && "flex-row items-stretch",
          resolvedClickable &&
            !isDisabled &&
            "cursor-pointer hover:shadow-lg hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 select-none",
          resolvedClickable &&
            !isDisabled &&
            resolvedAnimate &&
            "motion-safe:transition-transform motion-safe:duration-100 motion-safe:active:scale-[0.99]",
          isDisabled && "opacity-50 pointer-events-none select-none",
          sectionConfig?.className,
          className,
        )}
        style={style}
        {...rest}>
        {renderImage("top")}
        {renderImage("background")}
        {renderImage("left")}

        <div
          className={cn(
            "flex flex-col flex-1 z-10 w-full min-w-0",
            paddingClass,
            gapClass,
          )}>
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

          {bodyContent && (
            <div className="flex-1 z-10 text-sm leading-relaxed">
              {bodyContent}
            </div>
          )}

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
      </button>
    );
  },
);

Card.displayName = "Card";
