/**
 * Chip component for AsheeUI.
 * This file provides the main Chip component implementation, which renders
 * a compact element that represents an input, choice, or attribute. Chips
 * display short labels with optional avatars, icons, a status dot, and an
 * optional close button. Visual tokens resolve through the standard AsheeUI
 * cascade system.
 */
"use client";

import {
  type Color,
  resolveCascade,
  resolveChipVariant,
  resolveClassKey,
  resolveRadiusKey,
  type Size,
  type Variant,
} from "@asheeui/core";
import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { CloseIcon } from "../../../icons/CloseIcon";
import { useAsheeConfig } from "../../../libs/context";
import { resolveVariantClass } from "../../../shared/variant";
import {
  CHIP_AVATAR_CLASS,
  CHIP_BASE_CLASS,
  CHIP_CLOSE_CLASS,
  CHIP_DISABLED_CLASS,
  CHIP_DOT_CLASS,
  CHIP_FOCUS_CLASS,
  CHIP_FONT_CLASS,
  CHIP_GAP_CLASS,
  CHIP_HEIGHT_CLASS,
  CHIP_ICON_SIZE_CLASS,
  CHIP_PADDING_CLASS,
  CHIP_PRESSABLE_CLASS,
  CHIP_SLOT_CLASS,
} from "../../../styles/chip";
import { CHIP_AVATAR_SIZE_CLASS } from "../../../styles/portable";
import { RADIUS_CLASS } from "../../../styles/radius";
import { cn } from "../../../utils/cn";
import {
  type ChipConfig,
  type ChipVariant,
  FALLBACK_CHIP_CONFIG,
} from "./chip-config";

/**
 * Configuration options for the Chip component.
 */
type BaseChipProps = ChipConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "size">;

export interface ChipProps extends BaseChipProps {
  /**
   * Disables interactions and dims the chip.
   * Disabled chips cannot be clicked or closed.
   *
   * @default false
   */
  isDisabled?: boolean | undefined;

  /**
   * Leading icon rendered before the content.
   * Typically used to add visual context to the chip.
   */
  startIcon?: ReactNode | undefined;

  /**
   * Trailing icon rendered after the content (hidden when closable).
   * When onClose is provided, this is replaced by the close button.
   */
  endIcon?: ReactNode | undefined;

  /**
   * Avatar node rendered before the content, replacing `startIcon`.
   * It sits in a slot larger than the icon slot, because a face needs more
   * room than a glyph; a node that states a diameter of its own is scaled into
   * that slot rather than cropped by it.
   */
  avatar?: ReactNode | undefined;

  /**
   * Renders a small status dot.
   * Pass `true` for the current color, or a CSS color string.
   */
  dot?: boolean | string | undefined;

  /**
   * When provided, renders a remove button that fires this callback.
   * Makes the chip closable with a close button, which is keyboard-operable
   * as any other `<button>` is — <kbd>Enter</kbd> and <kbd>Space</kbd> remove
   * the chip without also pressing it.
   */
  onClose?: ((e: MouseEvent<HTMLButtonElement>) => void) | undefined;

  /**
   * Custom remove icon shown inside the close button.
   * Overrides the default CloseIcon.
   */
  closeIcon?: ReactNode | undefined;

  /**
   * Accessible name of the remove control.
   * A list of chips needs each remove control to say what it removes, so pass
   * the chip's own subject, for example `"Remove invoice.pdf"`.
   *
   * @default "Remove chip"
   */
  closeLabel?: string | undefined;

  /**
   * Chip content.
   * The label text to display inside the chip.
   */
  children?: ReactNode | undefined;
}

/**
 * A compact element that represents an input, choice, or attribute.
 *
 * Chip displays short labels with optional avatars, icons, a status
 * dot, and an optional close button. A closable chip is removable from the
 * keyboard, because the remove control `onClose` adds is a real `<button>`;
 * a chip with `onClick` is pressable from the keyboard as well, and only then
 * is it a tab stop and a `button` role. Without `onClick` it is a token rather
 * than a control: it takes no focus and exposes no role, and its only control
 * is the remove button. Visual tokens resolve through the standard AsheeUI
 * cascade.
 *
 * `isDisabled` refuses both the press and the close, and states the chip as
 * disabled for as long as that is true.
 *
 * @param props - Chip configuration options and HTML div props.
 * @param props.variant - Visual style variant. Defaults to "bordered".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.size - Density scale. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "full".
 * @param props.isDisabled - Disabled state. Defaults to false.
 * @param props.startIcon - Leading icon.
 * @param props.endIcon - Trailing icon.
 * @param props.avatar - Avatar node, drawn in a slot larger than the icon's.
 * @param props.dot - Status dot.
 * @param props.onClose - Close callback, fired by the remove control.
 * @param props.closeIcon - Custom close icon.
 * @param props.children - Chip label content.
 * @param props.className - Extra CSS classes for the chip.
 * @param props.onClick - Click handler for the chip, which also makes it a
 * pressable `button` with keyboard activation.
 *
 * @example
 * ```tsx
 * import { Chip } from "@asheeui/web";
 *
 * export function Example() {
 *   return (
 *     <Chip
 *       variant="solid"
 *       color="primary"
 *       onClose={() => console.log("Removed")}
 *     >
 *       React
 *     </Chip>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Chip with avatar and status dot
 * <Chip
 *   avatar={<img src="/avatar.jpg" alt="User" />}
 *   dot
 *   color="success"
 * >
 *   John Doe
 * </Chip>
 * ```
 *
 * @see ChipConfig - The configuration type for component defaults.
 * @see resolveVariantClass - Utility for resolving variant and color styles.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      variant,
      color,
      size,
      radius,
      isDisabled = false,
      startIcon,
      endIcon,
      avatar,
      dot,
      onClose,
      closeIcon,
      closeLabel = "Remove chip",
      children,
      className,
      style,
      onClick,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.chip as ChipConfig | undefined;

    // ─── 1. Token Resolvers ──────────────────────────────────────────────────

    // The cascade's last tiers are the platform's, so they may hand back a treatment a
    // chip cannot draw; the shared rule lands it on the nearest one it can.
    const resolvedVariantKey: ChipVariant = resolveChipVariant(
      resolveCascade<Variant>(
        variant,
        sectionConfig?.variant,
        config.defaultVariant,
        FALLBACK_CHIP_CONFIG.variant,
      ),
    );

    const resolvedColorKey = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor as Color | undefined,
      FALLBACK_CHIP_CONFIG.color,
    );

    const resolvedSizeKey = resolveCascade<Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_CHIP_CONFIG.size,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_CHIP_CONFIG.radius,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const heightClass = resolveClassKey(
      resolvedSizeKey,
      CHIP_HEIGHT_CLASS,
      FALLBACK_CHIP_CONFIG.size,
    );

    const paddingClass = resolveClassKey(
      resolvedSizeKey,
      CHIP_PADDING_CLASS,
      FALLBACK_CHIP_CONFIG.size,
    );

    const fontClass = resolveClassKey(
      resolvedSizeKey,
      CHIP_FONT_CLASS,
      FALLBACK_CHIP_CONFIG.size,
    );

    const gapClass = resolveClassKey(
      resolvedSizeKey,
      CHIP_GAP_CLASS,
      FALLBACK_CHIP_CONFIG.size,
    );

    const iconSizeClass = resolveClassKey(
      resolvedSizeKey,
      CHIP_ICON_SIZE_CLASS,
      FALLBACK_CHIP_CONFIG.size,
    );

    const avatarSizeClass = resolveClassKey(
      resolvedSizeKey,
      CHIP_AVATAR_SIZE_CLASS,
      FALLBACK_CHIP_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey,
      RADIUS_CLASS,
      FALLBACK_CHIP_CONFIG.radius,
    );

    // A chip is a control only when it can be pressed. Without a handler the
    // token has no press of its own to offer, and the remove control is its
    // only target.
    const isPressable = Boolean(onClick);

    const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (isDisabled) return;
      onClose?.(e);
    };

    // Handle click events (mouse, or a keyboard activating a real button)
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      onClick?.(e);
    };

    // Keyboard activation of the chip itself. A keystroke that lands on anything
    // inside the chip belongs to that node: the remove control is a real button,
    // and the browser runs it on this same keystroke, so acting on the bubbled
    // event would prevent the removal and call the chip's handler instead.
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      if (isDisabled) return;

      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        // Space scrolls the page by default; a button must not.
        e.preventDefault();
        // `onClick` is typed for a pointer event, but this is the keyboard
        // activating the same control. The handler receives the event that
        // happened rather than a fabricated mouse event with coordinates the
        // chip never had.
        onClick?.(e as unknown as MouseEvent<HTMLDivElement>);
      }
    };

    return (
      <div
        ref={ref}
        role={isPressable ? "button" : undefined}
        tabIndex={isPressable ? (isDisabled ? -1 : 0) : undefined}
        aria-disabled={isDisabled || undefined}
        onClick={isPressable ? handleClick : undefined}
        onKeyDown={isPressable ? handleKeyDown : undefined}
        className={cn(
          CHIP_BASE_CLASS,
          CHIP_FOCUS_CLASS,
          resolveVariantClass(resolvedVariantKey, resolvedColorKey),
          heightClass,
          paddingClass,
          fontClass,
          gapClass,
          radiusClass,
          isDisabled && CHIP_DISABLED_CLASS,
          isPressable && !isDisabled && CHIP_PRESSABLE_CLASS,
          className,
        )}
        style={style}
        {...props}>
        {/* Status Dot */}
        {dot && (
          <span
            className={CHIP_DOT_CLASS}
            style={{
              width: "0.5em",
              height: "0.5em",
              backgroundColor: typeof dot === "string" ? dot : "currentColor",
            }}
          />
        )}

        {/* Avatar */}
        {avatar && (
          <span className={cn(CHIP_AVATAR_CLASS, avatarSizeClass)}>
            {avatar}
          </span>
        )}

        {/* Start Icon */}
        {startIcon && !avatar && (
          <span className={cn(CHIP_SLOT_CLASS, iconSizeClass)}>
            {startIcon}
          </span>
        )}

        {/* Content */}
        {children}

        {/* End Icon */}
        {endIcon && !onClose && (
          <span className={cn(CHIP_SLOT_CLASS, iconSizeClass)}>{endIcon}</span>
        )}

        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            aria-label={closeLabel}
            disabled={isDisabled}
            onClick={handleClose}
            className={cn(CHIP_CLOSE_CLASS, iconSizeClass)}>
            {closeIcon ?? <CloseIcon className="w-full h-full" />}
          </button>
        )}
      </div>
    );
  },
);

Chip.displayName = "Chip";
