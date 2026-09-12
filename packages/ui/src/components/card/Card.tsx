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
import {
  type CardConfig,
  type CardImageConfig,
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

type BaseCardProps = Omit<CardConfig, "image"> &
  Omit<HTMLAttributes<HTMLDivElement>, "title" | "children">;

/**
 * Configuration options for the card image.
 * Extends CardImageConfig with source and alt text properties.
 */
export interface CardImageProps extends CardImageConfig {
  /**
   * Source URL of the card image.
   * When provided, displays an image in the card.
   */
  src?: string;

  /**
   * Alternative text for the card image.
   * Important for accessibility.
   *
   * @default ""
   */
  alt?: string;

  /**
   * Custom image component to render the card image with instead of
   * the native `<img>` tag (e.g. `next/image`).
   */
  component?: ElementType;

  /**
   * Additional props forwarded to the image component
   * (e.g. `{ priority: true, sizes: "..." }`).
   * These take precedence over the component's own props.
   */
  props?: Record<string, unknown>;
}

// biome-ignore lint/suspicious/noEmptyInterface: Config type kept so link props can extend it
export interface CardLinkConfig {}

export interface CardLinkProps extends CardLinkConfig {
  /**
   * Custom link component used to render the card as a link instead of the
   * native `<a>` tag (e.g. `next/link`, TanStack Router `Link`).
   *
   * When provided, the card root becomes this component and `props` are
   * forwarded to it.
   */
  component?: ElementType;

  /**
   * Additional props forwarded to the link component
   * (e.g. `{ href: "/blog/post-1" }`).
   * These take precedence over the component's own props.
   */
  props?: Record<string, unknown>;
}

/**
 * Configuration options for the Card component.
 */
export interface CardProps extends BaseCardProps {
  /**
   * Whether the card is clickable.
   * When true, the card becomes interactive with hover and focus states.
   * This is automatically enabled when link or onClick is provided.
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
   * Link configuration for the card.
   * When provided, the card root renders as the given link component
   * (e.g. `next/link`) with `props` forwarded to it.
   */
  link?: CardLinkProps;

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
   * Image configuration for the card.
   * Includes src, alt, position, ratio, fit, loading, the custom image
   * component, and props forwarded to it.
   */
  image?: CardImageProps;

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
 * accessible and adopts link or button semantics based on `link`.
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
 * @param props.link - Link configuration for the card (component and props).
 * @param props.title - Heading content.
 * @param props.description - Supporting text.
 * @param props.header - Custom header node.
 * @param props.body - Explicit body content.
 * @param props.footer - Footer node.
 * @param props.image - Image configuration object containing src, alt, position, ratio, fit, loading, component and props.
 * @param props.children - Card body content.
 * @param props.className - Extra CSS classes for the card.
 * @param props.id - HTML id attribute.
 * @param props.style - Inline styles.
 * @param props.onClick - Click event handler.
 * @param props.onKeyDown - Keyboard event handler.
 * @param props.rest - Additional HTML div element props.
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
 * // Clickable card with image and a custom link component
 * <Card
 *   isClickable
 *   link={{ component: NextLink, props: { href: "/blog/post-1" } }}
 *   image={{
 *     src: "/images/post-1.jpg",
 *     alt: "Blog post cover",
 *     position: "top",
 *     ratio: "video"
 *   }}
 *   title="Blog Post Title"
 *   description="A brief description of the blog post."
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Card with background image
 * <Card
 *   image={{
 *     src: "/images/hero.jpg",
 *     alt: "Hero background",
 *     position: "background",
 *     fit: "cover"
 *   }}
 *   variant="flat"
 *   title="Hero Title"
 *   description="Content overlays the background image"
 * >
 *   <p>This content appears on top of the background image.</p>
 * </Card>
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
      link,
      title,
      description,
      header,
      body,
      footer,
      image,
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
      image?.position,
      sectionConfig?.image.position,
      undefined,
      FALLBACK_CARD_CONFIG.image.position,
    );

    // Mirrors the Sidebar's link handling: a custom link component renders the
    // card root, falling back to a native anchor when only link props are given.
    const isLink = Boolean(link);
    const LinkComponent: ElementType =
      link?.component ?? (isLink ? "a" : "div");

    const resolvedClickable = isClickable ?? Boolean(isLink || onClick);

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
      image?.loading,
      sectionConfig?.image.loading,
      undefined,
      FALLBACK_CARD_CONFIG.image.loading,
    );

    const variantClass =
      CARD_VARIANT_CLASS[resolvedVariantKey] ?? CARD_VARIANT_CLASS.bordered;

    // The link's own `onClick` is invoked from `handleClick` instead of being
    // spread onto the root, so the card's disabled guard and its `onClick` prop
    // still run — and the link handler still fires — when both are provided.
    const { onClick: linkOnClick, ...linkRestProps } = (link?.props ??
      {}) as Record<string, unknown>;

    /**
     * Handles click events on the card.
     * Prevents interaction when disabled; navigation is left to the rendered
     * link component (native `<a>` or a custom link).
     */
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
      (
        linkOnClick as ((event: MouseEvent<HTMLDivElement>) => void) | undefined
      )?.(e);
    };

    /**
     * Handles keyboard events on the card.
     * Enables Enter and Space keys to trigger click behavior when interactive.
     */
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      // Link cards keep the native activation behaviour of the element they
      // render (e.g. Enter on an anchor); only button-like cards synthesise a
      // click from Enter/Space.
      if (isLink) return;
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
    /**
     * Renders a positioned image (top or bottom) with appropriate styling.
     * Forces eager loading for custom image components to avoid rendering issues.
     */
    const renderPositionedImage = (position: CardImagePosition) => {
      if (!image?.src || resolvedImagePos !== position) return null;

      const positionStyles = {
        top: "w-full shrink-0 rounded-b-none",
        bottom: "w-full shrink-0 order-last rounded-t-none",
        background: "",
      }[position];

      // Next.js Image with priority or lazy loading can cause script errors
      // when used with AsheeUIProvider. Force eager loading as a safeguard.
      let finalImageProps = { ...(image?.props ?? {}) };

      if (image?.component) {
        // Check if user set loading="lazy" or priority
        const hasLazy = image?.props?.loading === "lazy";
        const hasPriority = image?.props?.priority === true;

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
          src={image.src}
          alt={image.alt}
          ratio={image?.ratio ?? "video"}
          fit={image.fit ?? "cover"}
          className={positionStyles}
          component={image.component}
          props={finalImageProps}
          loading={resolvedLoading}
        />
      );
    };

    // ─── Render background image directly (no Image wrapper) ──────────────
    /**
     * Renders a background image that fills the entire card.
     * Uses the custom image component directly without the Image wrapper.
     */
    const renderBackgroundImage = () => {
      if (!image?.src || resolvedImagePos !== "background") return null;

      const ImageComponent = image.component || "img";

      let finalImageProps = { ...(image?.props ?? {}) };

      if (image?.component) {
        const hasLazy = image?.props?.loading === "lazy";
        const hasPriority = image?.props?.priority === true;

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
            src={image.src}
            alt={image?.alt}
            className="h-full w-full object-cover"
            {...finalImageProps}
          />
        </div>
      );
    };

    const bodyContent = body ?? children;

    return (
      <LinkComponent
        ref={ref}
        id={cardId}
        tabIndex={resolvedClickable && !isDisabled ? 0 : -1}
        role={resolvedClickable ? (isLink ? "link" : "button") : undefined}
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
        {...rest}
        {...linkRestProps}>
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
      </LinkComponent>
    );
  },
);

Card.displayName = "Card";
