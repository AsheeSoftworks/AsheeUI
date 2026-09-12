/**
 * Button component for AsheeUI.
 * This file provides the main Button component implementation, which renders
 * a clickable element that triggers actions or events. It supports multiple
 * visual variants, theme colors, density and radius scales, icon-only mode,
 * loading state, press animation, and content slots for icons and adornments.
 * The component uses the cascade resolution system for its visual tokens and
 * follows AsheeUI's accessibility patterns.
 */
"use client";

import {
  type ElementType,
  forwardRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Size } from "../../shared";
import {
  type Color,
  RADIUS_CLASS,
  resolveVariantClass,
  UnderlineRadius,
  type Variant,
} from "../../shared";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { Spinner } from "../spinner/spinner";
import { type ButtonConfig, FALLBACK_BUTTON_CONFIG } from "./button-config";
import { BUTTON_ICON_SIZE_CLASS, BUTTON_SIZE_CLASS } from "./button-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

/**
 * Visual and behavioural options shared by button-like elements.
 * This type combines the ButtonConfig with native button HTML attributes.
 */
type BaseButtonProps = ButtonConfig &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color" | "disabled">;

/**
 * Props for the button's link behaviour.
 * Holds the instance-only link component and its props.
 */
export interface ButtonLinkProps {
  /**
   * Custom link component (e.g. `next/link`, TanStack Router `Link`).
   * When provided, this component is used instead of the native `<a>` tag.
   */
  component?: ElementType;

  /**
   * Additional props to pass to the link component (e.g. `{ prefetch: true }`).
   * These take precedence over the button's own props.
   */
  props?: Record<string, unknown>;
}

/**
 * Configuration options for the Button component.
 *
 * @see {@link ButtonCommonProps} for the shared visual props.
 */
export interface ButtonProps extends BaseButtonProps {
  /**
   * Whether the button is in a disabled state.
   * Disabled buttons cannot be interacted with and appear dimmed.
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Shows a loading spinner and blocks interaction.
   * When true, the button displays a spinner and prevents clicks.
   *
   * @default false
   */
  isLoading?: boolean;

  /**
   * Native button type.
   * Controls the button's behavior in forms.
   *
   * @default "button"
   */
  type?: "button" | "submit" | "reset";

  /**
   * Switches to the compact icon-only layout.
   * When true, the button becomes square and removes text padding.
   *
   * @default false
   */
  icon?: boolean;

  /**
   * Content rendered at the start of the button.
   * Typically an icon or adornment.
   */
  startContent?: ReactNode;

  /**
   * Content rendered at the end of the button.
   * Typically an icon, badge, or adornment.
   */
  endContent?: ReactNode;

  /**
   * Renders the button as a link to this URL.
   * The root element becomes an `<a>`, or `link.component` when provided.
   */
  href?: string;

  /**
   * Link configuration for the button.
   * Provides the custom link component and props forwarded to it.
   */
  link?: ButtonLinkProps;
}

/**
 * A clickable element that triggers an action or event.
 *
 * Button supports multiple visual variants, theme colors, density and
 * radius scales, icon-only mode, loading state, press animation, and
 * start/end content slots for icons and adornments. Visual tokens resolve
 * through the standard AsheeUI cascade: prop, component config, global
 * theme defaults, and the built-in fallback.
 *
 * The component automatically handles accessibility attributes including
 * aria-disabled, aria-busy for loading states, and proper focus management.
 * Icon-only buttons should provide an aria-label for accessibility.
 *
 * @param props - Button configuration options and native button props.
 * @param props.variant - Visual style variant. Defaults to "bordered".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.size - Density scale. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.animate - Press animation. Defaults to true.
 * @param props.fullWidth - Full-width layout. Defaults to false.
 * @param props.isDisabled - Disabled state. Defaults to false.
 * @param props.isLoading - Loading state. Defaults to false.
 * @param props.type - Native button type. Defaults to "button".
 * @param props.icon - Icon-only compact layout. Defaults to false.
 * @param props.startContent - Content at the start of the button.
 * @param props.endContent - Content at the end of the button.
 * @param props.href - Renders the button as a link to this URL.
 * @param props.link - Link configuration (custom component and props).
 * @param props.children - Button label content.
 * @param props.className - Extra CSS classes for the button.
 *
 * @example
 * ```tsx
 * import { Button } from "asheeui";
 *
 * export function Example() {
 *   return (
 *     <Button
 *       variant="solid"
 *       color="primary"
 *       onClick={() => console.log("Clicked")}
 *       startContent={<Icon />}
 *     >
 *       Click me
 *     </Button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Icon-only button with loading state
 * <Button
 *   icon
 *   isLoading
 *   aria-label="Refresh content"
 *   onClick={handleRefresh}
 * >
 *   <RefreshIcon />
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // With end content badge
 * <Button
 *   variant="bordered"
 *   endContent={<Badge count={5} />}
 * >
 *   Notifications
 * </Button>
 * ```
 *
 * @see ButtonConfig - The configuration type for component defaults.
 * @see resolveVariantClass - Utility for resolving variant and color styles.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      variant,
      color,
      size,
      radius,
      animate,
      fullWidth,
      isDisabled,
      isLoading,
      icon,
      className,
      children,
      type = "button",
      onClick,
      startContent,
      endContent,
      href,
      link,
      ...rest
    } = props;

    const config = useAsheeConfig();
    const sectionConfig = config.components?.button;

    const resolvedVariantKey = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_BUTTON_CONFIG.variant,
    );

    const resolvedColor = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_BUTTON_CONFIG.color,
    );

    const resolvedSizeKey = resolveCascade<Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_BUTTON_CONFIG.size,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_BUTTON_CONFIG.radius,
    );

    const resolvedAnimate = resolveCascade<boolean>(
      animate,
      sectionConfig?.animate,
      FALLBACK_BUTTON_CONFIG.animate,
      FALLBACK_BUTTON_CONFIG.animate,
    );

    const resolvedFullWidth = resolveCascade<boolean>(
      fullWidth,
      sectionConfig?.fullWidth,
      undefined,
      FALLBACK_BUTTON_CONFIG.fullWidth,
    );

    const sizeClasses = icon
      ? BUTTON_ICON_SIZE_CLASS[resolvedSizeKey]
      : BUTTON_SIZE_CLASS[resolvedSizeKey];

    const isInteractionDisabled = isDisabled || isLoading;

    // When `href` or `link` is provided the button renders as a link instead of
    // a <button>, mirroring the Card's `link` part.
    const isLink = Boolean(href || link);
    const LinkComponent: ElementType =
      link?.component ?? (isLink ? "a" : "button");

    // The link's own `onClick` is invoked from `handleClick` instead of being
    // spread onto the root, so the disabled guard and the button's `onClick`
    // prop still run — and the link handler still fires — when both are given.
    const { onClick: linkOnClick, ...linkRestProps } = (link?.props ??
      {}) as Record<string, unknown>;

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (isInteractionDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
      (
        linkOnClick as
          | ((event: MouseEvent<HTMLButtonElement>) => void)
          | undefined
      )?.(e);
    };

    const sharedClassName = cn(
      "inline-flex items-center justify-center font-medium transition-colors select-none shrink-0",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "aria-disabled:pointer-events-none aria-disabled:opacity-50",
      resolvedFullWidth && "w-full",
      resolvedAnimate &&
        "motion-safe:transition-transform motion-safe:duration-100 motion-safe:active:scale-[0.99]",
      resolveVariantClass(resolvedVariantKey, resolvedColor),
      sizeClasses,
      resolveClassKey(
        UnderlineRadius(resolvedVariantKey, resolvedRadiusKey),
        RADIUS_CLASS,
        UnderlineRadius(resolvedVariantKey, FALLBACK_BUTTON_CONFIG.radius),
      ),
      className,
    );

    return (
      <LinkComponent
        ref={ref}
        {...(isLink ? { href } : { type, disabled: isInteractionDisabled })}
        aria-disabled={isInteractionDisabled}
        aria-busy={isLoading}
        onClick={handleClick}
        className={sharedClassName}
        {...rest}
        {...linkRestProps}>
        {isLoading && <Spinner className={resolvedSizeKey} />}
        {isLoading && <span className="sr-only">Loading</span>}
        {!isLoading && startContent}
        {!isLoading && children}
        {!isLoading && endContent}
      </LinkComponent>
    );
  },
);

Button.displayName = "Button";
