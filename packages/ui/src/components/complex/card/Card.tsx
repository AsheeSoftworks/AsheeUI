"use client";

import { useSettings } from "@ashee/settings";
import { type Radius, type Size, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { createContext, forwardRef, useContext, useId, useMemo } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { Image } from "../../primitive/image/Image";
import type {
  ImageFit,
  ImageRatioKey,
} from "../../primitive/image/image-config";
import type {
  CardImagePosition,
  CardSizeKey,
  CardSizeScale,
  CardVariant,
} from "./card-config";
import { defaultCardSizeScale } from "./default-card-config";
import { flattenCardSizeScale } from "./flatten-card-size-scale";

// ─── Context ──────────────────────────────────────────────────────────────────

interface CardContextValue {
  sizeKey: CardSizeKey;
  variant: CardVariant;
  isClickable: boolean;
  isDisabled: boolean;
}

const CardContext = createContext<CardContextValue>({
  sizeKey: "md",
  variant: "bordered",
  isClickable: false,
  isDisabled: false,
});

const useCardContext = () => useContext(CardContext);

// ─── Styles ───────────────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<CardVariant, string> = {
  elevated: "bg-card text-card-foreground shadow-md border border-border/40",
  bordered: "bg-card text-card-foreground border border-border shadow-xs",
  flat: "bg-muted/50 text-foreground border-none",
  ghost: "bg-transparent text-foreground border-none shadow-none",
};

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
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { sizeKey } = useCardContext();
  return (
    <div
      ref={ref}
      className={cn("flex flex-col z-10", className)}
      style={{
        gap: `calc(var(--ashee-card-${sizeKey}-gap) * 0.35)`,
      }}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
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
  React.HTMLAttributes<HTMLParagraphElement>
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
  React.HTMLAttributes<HTMLDivElement>
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
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { sizeKey } = useCardContext();
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between z-10 mt-auto pt-2",
        className,
      )}
      style={{ gap: `var(--ashee-card-${sizeKey}-gap)` }}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

// ─── Main Card Component ──────────────────────────────────────────────────────

export interface CardProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLDivElement>,
    "title" | "children" | "size"
  > {
  variant?: CardVariant;
  size?: CardSizeKey;
  radius?: keyof Radius;
  shadow?: keyof Size;
  animation?: AnimationProp;
  isClickable?: boolean;
  isDisabled?: boolean;
  href?: string;
  // Shorthand Content Props
  title?: React.ReactNode;
  description?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: CardImagePosition;
  imageRatio?: ImageRatioKey;
  imageFit?: ImageFit;
  children?: React.ReactNode;
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
    const { settings } = useSettings();
    const sectionConfig = config.components?.card;

    const generatedId = useId();
    const cardId = id ?? generatedId;

    // Design Token Resolvers
    const sizeScale = (sectionConfig?.size ??
      defaultCardSizeScale) as CardSizeScale;
    const resolvedSizeKey = size ?? sizeScale.default;
    const responsiveVars = useMemo(
      () => flattenCardSizeScale(sizeScale),
      [sizeScale],
    );
    useResponsiveVars(
      "ashee-card-tokens",
      responsiveVars,
      config.theme.breakpoints,
    );

    const resolvedVariant = resolveValue<CardVariant>(
      variant,
      sectionConfig?.variant,
      "bordered",
    );
    const resolvedRadius = resolveScale(
      radius,
      sectionConfig?.radius,
      config.theme.radius.default,
      config.theme.radius.values,
    );
    const resolvedShadow = resolveScale(
      shadow,
      sectionConfig?.shadow,
      config.theme.shadow.default,
      config.theme.shadow.values,
    );

    const resolvedImagePos =
      imagePosition ?? sectionConfig?.imagePosition ?? "top";
    const resolvedClickable =
      isClickable ??
      Boolean(href || onClick) ??
      sectionConfig?.isClickable ??
      false;

    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
      settings.enableAnimations,
      resolvedClickable ? "scale" : "none",
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

    // Dynamic Element Wrapper
    const Component = motion.div;

    const isHorizontalImage = imageSrc && isSideLayout;

    return (
      <CardContext.Provider value={contextValue}>
        <Component
          ref={ref}
          id={cardId}
          tabIndex={resolvedClickable && !isDisabled ? 0 : undefined}
          role={resolvedClickable ? (href ? "link" : "button") : undefined}
          aria-disabled={isDisabled}
          onClick={isDisabled ? undefined : onClick}
          className={cn(
            "relative flex flex-col overflow-hidden transition-all duration-200 text-left",
            VARIANT_CLASSES[resolvedVariant],
            isHorizontalImage && "flex-row items-stretch",
            resolvedClickable &&
              !isDisabled &&
              "cursor-pointer hover:shadow-lg hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            isDisabled && "opacity-50 pointer-events-none select-none",
            sectionConfig?.className,
            className,
          )}
          style={{
            borderRadius: resolvedRadius,
            boxShadow: resolvedShadow,
            ...style,
          }}
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
            className="flex flex-col flex-1 z-10 w-full min-w-0"
            style={{
              paddingInline: `var(--ashee-card-${resolvedSizeKey}-padding-x)`,
              paddingBlock: `var(--ashee-card-${resolvedSizeKey}-padding-y)`,
              gap: `var(--ashee-card-${resolvedSizeKey}-gap)`,
            }}>
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
        </Component>
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
