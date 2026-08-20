"use client";

import { cn } from "@asheeui/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useId,
  useMemo,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { resolveAnimation } from "../../motion/resolve-animation";
import type { AnimationProp } from "../../motion/types";
import type { Shadow } from "../../theme/shadow/shadow-config";
import type { Radius } from "../../theme/token/radius/radius-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { Image } from "../image/Image";
import type { ImageFit, ImageRatioKey } from "../image/image-config";
import {
  FALLBACK_CARD_CONFIG,
  type CardConfig,
  type CardImagePosition,
  type CardSizeKey,
  type CardVariant,
} from "./card-config";
import {
  CARD_GAP_CLASS,
  CARD_HEADER_GAP_CLASS,
  CARD_PADDING_CLASS,
  CARD_RADIUS_CLASS,
  CARD_SHADOW_CLASS,
  CARD_VARIANT_CLASS,
} from "./card-styles";

// ─── Context ──────────────────────────────────────────────────────────────────

interface CardContextValue {
  sizeKey: CardSizeKey;
  variant: CardVariant;
  isClickable: boolean;
  isDisabled: boolean;
}

const CardContext = createContext<CardContextValue>({
  sizeKey: FALLBACK_CARD_CONFIG.size,
  variant: FALLBACK_CARD_CONFIG.variant,
  isClickable: FALLBACK_CARD_CONFIG.isClickable,
  isDisabled: false,
});

const useCardContext = () => useContext(CardContext);

// ─── Compound Sub-Components ──────────────────────────────────────────────────

export interface CardImageProps
  extends React.ComponentPropsWithoutRef<typeof Image> {
  position?: CardImagePosition;
}

export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, ratio, fit, position = "top", ...props }, ref) => {
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
        ref={ref}
        ratio={
          ratio ??
          (position === "left" || position === "right" ? "auto" : "video")
        }
        fit={fit ?? "cover"}
        className={cn(positionStyles, className)}
        {...props}
      />
    );
  },
);
CardImage.displayName = "CardImage";

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { sizeKey } = useCardContext();
  const headerGapClass = resolveClassKey(
    sizeKey,
    CARD_HEADER_GAP_CLASS,
    FALLBACK_CARD_CONFIG.size,
  );

  return (
    <div
      ref={ref}
      className={cn("flex flex-col z-10", headerGapClass, className)}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-tight tracking-tight text-foreground text-lg md:text-xl",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 z-10 text-sm leading-relaxed", className)}
    {...props}
  />
));
CardBody.displayName = "CardBody";

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { sizeKey } = useCardContext();
  const gapClass = resolveClassKey(
    sizeKey,
    CARD_GAP_CLASS,
    FALLBACK_CARD_CONFIG.size,
  );

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between z-10 mt-auto pt-2",
        gapClass,
        className,
      )}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

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
  // Shorthand Content Props
  title?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
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

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

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

    const contextValue = useMemo(
      () => ({
        sizeKey: resolvedSizeKey,
        variant: resolvedVariant,
        isClickable: resolvedClickable,
        isDisabled,
      }),
      [resolvedSizeKey, resolvedVariant, resolvedClickable, isDisabled],
    );

    const isSideLayout =
      resolvedImagePos === "left" || resolvedImagePos === "right";

    const isHorizontalImage = Boolean(imageSrc && isSideLayout);

    return (
      <CardContext.Provider value={contextValue}>
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
          {/* Shorthand Top Image */}
          {imageSrc && resolvedImagePos === "top" && (
            <CardImage
              src={imageSrc}
              alt={imageAlt}
              position="top"
              ratio={imageRatio}
              fit={imageFit}
            />
          )}

          {/* Shorthand Background Image */}
          {imageSrc && resolvedImagePos === "background" && (
            <CardImage
              src={imageSrc}
              alt={imageAlt}
              position="background"
              ratio={imageRatio}
              fit={imageFit}
            />
          )}

          {/* Shorthand Left Image */}
          {imageSrc && resolvedImagePos === "left" && (
            <CardImage
              src={imageSrc}
              alt={imageAlt}
              position="left"
              ratio={imageRatio}
              fit={imageFit}
            />
          )}

          {/* Main Card Content Slot Wrapper */}
          <div
            className={cn(
              "flex flex-col flex-1 z-10 w-full min-w-0",
              paddingClass,
              gapClass,
            )}>
            {/* Header Slot or Title/Description Props */}
            {(header || title || description) && (
              <CardHeader>
                {header}
                {title && <CardTitle>{title}</CardTitle>}
                {description && (
                  <CardDescription>{description}</CardDescription>
                )}
              </CardHeader>
            )}

            {/* Default Children Body Slot */}
            {children && <CardBody>{children}</CardBody>}

            {/* Footer Slot Prop */}
            {footer && <CardFooter>{footer}</CardFooter>}
          </div>

          {/* Shorthand Right Image */}
          {imageSrc && resolvedImagePos === "right" && (
            <CardImage
              src={imageSrc}
              alt={imageAlt}
              position="right"
              ratio={imageRatio}
              fit={imageFit}
            />
          )}

          {/* Shorthand Bottom Image */}
          {imageSrc && resolvedImagePos === "bottom" && (
            <CardImage
              src={imageSrc}
              alt={imageAlt}
              position="bottom"
              ratio={imageRatio}
              fit={imageFit}
            />
          )}
        </motion.div>
      </CardContext.Provider>
    );
  },
);

Card.displayName = "Card";

// Attach Compound Sub-components
export const AsheeCard = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
  Image: CardImage,
});
