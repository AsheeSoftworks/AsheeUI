/**
 * Card component for AsheeUI.
 * This file provides the main Card component implementation, which renders
 * a versatile container for displaying content with support for headers,
 * footers, image layouts, and interactive states. It composes optional
 * image, title, description, header, body, and footer regions. Visual
 * tokens resolve through the standard AsheeUI cascade system.
 */
"use client";

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useId,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Size } from "../../shared";
import { RADIUS_CLASS, type Radius } from "../../shared";
import { cn } from "../../utils";
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
  type CardImageLoading,
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

type BaseCardProps = CardConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "title" | "children">;

/**
 * Configuration options for the Card component.
 */
export interface CardProps extends BaseCardProps {
  /**
   * Whether the card is clickable.
   * When true, the card becomes interactive with hover and focus states.
   * This is automatically enabled when href or onClick is provided.
   *
   * @default false
   */
  isClickable?: boolean;

  /**
   * Disables interactive states and dims card opacity.
   * Disabled cards cannot be clicked or focused.
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Renders the card as a link when provided with `isClickable`.
   * Clicking the card navigates to this URL.
   */
  href?: string;

  /**
   * Heading content rendered above the body.
   * Typically a string or React element.
   */
  title?: ReactNode;

  /**
   * Supporting text rendered under the title.
   * Typically a string providing additional context.
   */
  description?: ReactNode;

  /**
   * Custom header node rendered above the title.
   * Useful for adding icons, badges, or metadata.
   */
  header?: ReactNode;

  /**
   * Explicit body content; falls back to `children`.
   * Use this when you need to explicitly set the body content.
   */
  body?: ReactNode;

  /**
   * Footer node rendered at the bottom of the content column.
   * Typically used for actions or additional metadata.
   */
  footer?: ReactNode;

  /**
   * Source URL of the card image.
   * When provided, displays an image in the card.
   */
  imageSrc?: string;

  /**
   * Alternative text for the card image.
   * Important for accessibility.
   *
   * @default ""
   */
  imageAlt?: string;

  /**
   * Placement of the image relative to the content.
   * Determines whether the image appears at the top, bottom, or as a background.
   *
   * @default "top"
   */
  imagePosition?: CardImagePosition;

  /**
   * Aspect ratio of the positioned image.
   * Controls the proportional dimensions of the image container.
   *
   * @default "video"
   */
  imageRatio?: ImageRatioKey;

  /**
   * Object-fit strategy of the positioned image.
   * Controls how the image fills its container.
   *
   * @default "cover"
   */
  imageFit?: ImageFit;

  /**
   * Native loading strategy of the positioned image.
   *
   * @default "lazy"
   */
  imageLoading?: CardImageLoading;

  /**
   * Custom image component to render the card image with instead of
   * the native `<img>` tag (e.g. `next/image`).
   */
  imageComponent?: ElementType;

  /**
   * Additional props forwarded to `imageComponent`
   * (e.g. `{ priority: true, sizes: "..." }`).
   */
  imageProps?: Record<string, unknown>;

  /**
   * Card body content, used when `body` is not provided.
   */
  children?: ReactNode;
}

/**
 * A versatile container component for displaying content, with support
 * for headers, footers, image layouts, and interactive states.
 *
 * Card composes optional image, title, description, header, body, and
 * footer regions. Visual tokens (`variant`, `size`, `radius`,
 * `animate`, `isClickable`) resolve through the standard AsheeUI
 * cascade. When `isClickable` is enabled, the card becomes keyboard
 * accessible and adopts link or button semantics based on `href`.
 *
 * The component automatically handles accessibility attributes including
 * role, tabIndex, aria-disabled, and proper keyboard interaction with
 * Enter and Space keys.
 *
 * @param props - Card configuration options and HTML div element props.
 * @param props.variant - Visual style variant. Defaults to "bordered".
 * @param props.size - Content density scale. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.animate - Press animation. Defaults to true.
 * @param props.isClickable - Interactive behaviour. Defaults to false.
 * @param props.isDisabled - Disabled state. Defaults to false.
 * @param props.href - Optional link destination.
 * @param props.title - Heading content.
 * @param props.description - Supporting text.
 * @param props.header - Custom header node.
 * @param props.body - Explicit body content.
 * @param props.footer - Footer node.
 * @param props.imageSrc - Image source URL.
 * @param props.imageAlt - Image alternative text.
 * @param props.imagePosition - Image placement.
 * @param props.imageRatio - Image aspect ratio.
 * @param props.imageFit - Image object-fit.
 * @param props.imageLoading - Image loading strategy.
 * @param props.imageComponent - Custom image component.
 * @param props.imageProps - Props forwarded to the image component.
 * @param props.children - Card body content.
 * @param props.className - Extra CSS classes for the card.
 *
 * @example
 * ```tsx
 * import { Card, Button } from "asheeui";
 *
 * export function Example() {
 *   return (
 *     <Card
 *       variant="elevated"
 *       radius="lg"
 *       title="Card Title"
 *       description="Card description goes here."
 *       footer={<Button size="sm">Action</Button>}
 *     >
 *       Card body content.
 *     </Card>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Clickable card with image
 * <Card
 *   isClickable
 *   href="/blog/post-1"
 *   imageSrc="/images/post-1.jpg"
 *   imageAlt="Blog post cover"
 *   title="Blog Post Title"
 *   description="A brief description of the blog post."
 * />
 * ```
 *
 * @see CardConfig - The configuration type for component defaults.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
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
      imageLoading = "lazy",
      imageComponent,
      imageProps,
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

    const resolvedVariantKey = resolveCascade<CardVariant>(
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

    const resolvedClickable = isClickable ?? Boolean(href || onClick);

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

    const resolvedLoading = resolveCascade<CardImageLoading>(
      imageLoading,
      sectionConfig?.imageLoading,
      undefined,
      FALLBACK_CARD_CONFIG.imageLoading,
    );

    const variantClass =
      CARD_VARIANT_CLASS[resolvedVariantKey] ?? CARD_VARIANT_CLASS.bordered;

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
      if (href && !e.defaultPrevented) {
        window.location.href = href;
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (
        resolvedClickable &&
        !isDisabled &&
        (e.key === "Enter" || e.key === " ")
      ) {
        e.preventDefault();
        handleClick(e as unknown as MouseEvent<HTMLDivElement>);
      }
    };

    // ─── Render helper for top/bottom images ──────────────────────────────
    const renderPositionedImage = (position: CardImagePosition) => {
      if (!imageSrc || resolvedImagePos !== position) return null;

      const positionStyles = {
        top: "w-full shrink-0 rounded-b-none",
        bottom: "w-full shrink-0 order-last rounded-t-none",
        background: "",
      }[position];

      // ─── FIX: Force eager loading for custom image components ────────────
      // Next.js Image with priority or lazy loading can cause script errors
      // when used with AsheeUIProvider. Force eager loading as a safeguard.
      let finalImageProps = { ...(imageProps ?? {}) };

      if (imageComponent) {
        // Check if user set loading="lazy" or priority
        const hasLazy = imageProps?.loading === "lazy";
        const hasPriority = imageProps?.priority === true;

        if (hasLazy || hasPriority) {
          console.warn(
            `[Card] ${
              hasLazy ? '`loading="lazy"`' : "`priority={true}`"
            } with custom image component may cause rendering issues. ` +
              `Consider using \`loading="eager"\` and removing \`priority\` for card images.`,
          );
        }

        // Force loading to "eager" if custom component is used
        finalImageProps = {
          ...finalImageProps,
          loading: "eager",
          // Remove priority if present to avoid conflicts
          ...(finalImageProps.priority !== undefined && { priority: false }),
        };
      }

      return (
        <Image
          src={imageSrc}
          alt={imageAlt}
          ratio={imageRatio ?? "video"}
          fit={imageFit ?? "cover"}
          className={positionStyles}
          imageComponent={imageComponent}
          imageProps={finalImageProps}
          loading={resolvedLoading}
        />
      );
    };

    // ─── Render background image directly (no Image wrapper) ──────────────
    const renderBackgroundImage = () => {
      if (!imageSrc || resolvedImagePos !== "background") return null;

      const ImageComponent = imageComponent || "img";

      // ─── FIX: Force eager loading for background images too ──────────────
      let finalImageProps = { ...(imageProps ?? {}) };

      if (imageComponent) {
        const hasLazy = imageProps?.loading === "lazy";
        const hasPriority = imageProps?.priority === true;

        if (hasLazy || hasPriority) {
          console.warn(
            `[Card] ${
              hasLazy ? '`loading="lazy"`' : "`priority={true}`"
            } with custom image component may cause rendering issues. ` +
              `Consider using \`loading="eager"\` and removing \`priority\` for card images.`,
          );
        }

        finalImageProps = {
          ...finalImageProps,
          loading: "eager",
          ...(finalImageProps.priority !== undefined && { priority: false }),
        };
      }

      return (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ImageComponent
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover"
            {...finalImageProps}
          />
        </div>
      );
    };

    const bodyContent = body ?? children;

    return (
      <div
        ref={ref}
        id={cardId}
        tabIndex={resolvedClickable && !isDisabled ? 0 : -1}
        role={resolvedClickable ? (href ? "link" : "button") : undefined}
        aria-disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative flex flex-col transition-colors duration-200 text-left",
          variantClass,
          radiusClass,
          resolvedClickable &&
            !isDisabled &&
            "cursor-pointer hover:shadow-lg hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 select-none",
          resolvedClickable &&
            !isDisabled &&
            resolvedAnimate &&
            "motion-safe:transition-transform motion-safe:duration-100 motion-safe:active:scale-[0.99]",
          isDisabled && "opacity-50 pointer-events-none select-none",
          className,
        )}
        style={style}
        {...rest}>
        {/* Top image */}
        {renderPositionedImage("top")}

        {/* Background image - rendered directly */}
        {renderBackgroundImage()}

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

        {/* Bottom image */}
        {renderPositionedImage("bottom")}
      </div>
    );
  },
);

Card.displayName = "Card";
