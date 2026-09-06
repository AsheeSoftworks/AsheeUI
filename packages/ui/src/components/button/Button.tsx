"use client";

import { cn } from "@asheeui/utils";
import { forwardRef, type MouseEvent, type ReactNode } from "react";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, UnderlineRadius } from "../../shared/radius";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../shared/variant";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { Spinner } from "../spinner/spinner";
import {
  type ButtonConfig,
  type ButtonRadiusKey,
  type ButtonSizeKey,
  FALLBACK_BUTTON_CONFIG,
} from "./button-config";
import { BUTTON_ICON_SIZE_CLASS, BUTTON_SIZE_CLASS } from "./button-styles";

/**
 * Visual and behavioural options shared by button-like elements.
 */
export interface ButtonCommonProps {
  /** Visual style variant.
   *
   * @default "bordered"
   */
  variant?: Variant;
  /** Theme accent color.
   *
   * @default "primary"
   */
  color?: Color;
  /** Padding and font-size scale.
   *
   * @default "md"
   */
  size?: ButtonSizeKey;
  /** Corner rounding.
   *
   * @default "md"
   */
  radius?: ButtonRadiusKey;
  /** Enables the press-down scale animation.
   *
   * @default true
   */
  animate?: boolean;
  /** Makes the button stretch to fill its parent width.
   *
   * @default false
   */
  fullWidth?: boolean;
  /** Disables pointer events and dims the button.
   *
   * @default false
   */
  isDisabled?: boolean;
  /** Shows a loading spinner and blocks interaction.
   *
   * @default false
   */
  isLoading?: boolean;
  /** Extra classes merged with internal styles. */
  className?: string;
}

type CleanButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "color" | "disabled" | "className" | "children"
>;

/**
 * Configuration options for the Button component.
 *
 * @see {@link ButtonCommonProps} for the shared visual props.
 */
type ButtonProps = ButtonCommonProps &
  CleanButtonProps & {
    /** Native button type.
     *
     * @default "button"
     */
    type?: "button" | "submit" | "reset";
    /** Switches to the compact icon-only layout.
     *
     * @default false
     */
    icon?: boolean;
    /** Button label content. */
    children?: ReactNode;
  };

/**
 * A clickable element that triggers an action or event.
 *
 * Button supports multiple visual variants, theme colors, density and
 * radius scales, icon-only mode, loading state, and a press animation.
 * Visual tokens resolve through the standard AsheeUI cascade: prop,
 * component config, global theme defaults, and the built-in fallback.
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
 * @param props.children - Button label content.
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
 *     >
 *       Click me
 *     </Button>
 *   );
 * }
 * ```
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
      ...rest
    } = props;

    const config = useAsheeConfig();
    const sectionConfig = config.components?.button as ButtonConfig | undefined;

    const resolvedVariant = resolveCascade<Variant>(
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

    const resolvedSizeKey = resolveCascade<ButtonSizeKey>(
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

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (isInteractionDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    const sharedClassName = cn(
      "inline-flex items-center justify-center font-medium transition-colors select-none shrink-0",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "aria-disabled:pointer-events-none aria-disabled:opacity-50",
      resolvedFullWidth && "w-full",
      resolvedAnimate &&
        "motion-safe:transition-transform motion-safe:duration-100 motion-safe:active:scale-[0.99]",
      resolveVariantClass(resolvedVariant, resolvedColor),
      sizeClasses,
      resolveClassKey(
        UnderlineRadius(resolvedVariant, resolvedRadiusKey),
        RADIUS_CLASS,
        UnderlineRadius(resolvedVariant, FALLBACK_BUTTON_CONFIG.radius),
      ),
      className,
    );

    return (
      <button
        ref={ref}
        type={type}
        disabled={isInteractionDisabled}
        aria-disabled={isInteractionDisabled}
        aria-busy={isLoading}
        onClick={handleClick}
        className={sharedClassName}
        {...rest}>
        {isLoading && <Spinner className={resolvedSizeKey} />}
        {isLoading && <span className="sr-only">Loading</span>}
        {isLoading && icon ? null : children}
      </button>
    );
  },
);

Button.displayName = "Button";
