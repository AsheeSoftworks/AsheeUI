/**
 * DatePicker component for AsheeUI.
 * This file provides the main DatePicker component implementation, which renders
 * a date/time picker with calendar popover, time spinner, and input field.
 * It integrates with Floating UI for popover positioning and supports the
 * standard AsheeUI cascade for visual tokens.
 */
"use client";

import { FloatingFocusManager, FloatingPortal } from "@floating-ui/react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { ClearIcon } from "../../icons/ClearIcon";
import { ClockIcon } from "../../icons/ClockIcon";
import { useAsheeConfig } from "../../libs/context";
import { type Color, RADIUS_CLASS } from "../../shared";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import type { FieldSizeKey } from "../field/field-config";
import { Input, type InputProps } from "../input/Input";
import { FALLBACK_SELECT_MENU_CONFIG, useSelectFloating } from "../select-menu";
import { Calendar } from "./Calendar";
import {
  formatDisplay,
  getDefaultPlaceholder,
  getNewCursorPosition,
  parseDateString,
} from "./date-picker.helpers";
import {
  type DatePickerConfig,
  FALLBACK_DATE_PICKER_CONFIG,
  type PickerConfig,
  type PickerMode,
} from "./date-picker-config";

/**
 * Picker menu configuration that extends PickerConfig with className.
 * Used for styling the calendar popover.
 */
export interface PickerMenu extends PickerConfig {
  /**
   * Extra CSS classes for the calendar popover.
   */
  className?: string;
}

// ─── Component Interface ──────────────────────────────────────────────────────

/**
 * Base DatePicker props excluding the picker configuration.
 * Combines DatePickerConfig (minus picker) with InputProps (minus value-related props).
 */
export type BaseDatePickerProps = Omit<DatePickerConfig, "picker"> &
  Omit<
    InputProps,
    "onChange" | "value" | "defaultValue" | "endContent" | "startContent"
  >;

/**
 * Configuration options for the DatePicker component.
 * Extends InputProps but omits value-related props that are replaced
 * with date-specific equivalents.
 */
export interface DatePickerProps extends BaseDatePickerProps {
  /**
   * The currently selected date.
   * Pass null for no selection.
   */
  selected?: Date | null;

  /**
   * Callback fired when the selected date changes.
   * Receives the new date or null if cleared.
   */
  onChange?: (date: Date | null) => void;

  /**
   * Picker configuration overrides including portal, portalTarget, and className.
   * All picker-related props should be passed through this object.
   */
  picker?: PickerMenu;

  /**
   * Whether a clear button is shown in the input.
   * When true, a clear button appears when a date is selected.
   *
   * @default false
   */
  isClearable?: boolean;

  /**
   * Whether future dates are disabled in the calendar.
   * When true, dates after today cannot be selected.
   *
   * @default false
   */
  disableFuture?: boolean;
}

/**
 * A date/time picker component with calendar popover and time selection.
 *
 * DatePicker renders an input field with a calendar popover that allows
 * selecting dates and/or times. It supports date, time, and datetime modes,
 * clearable selection, and future date restrictions. The component integrates
 * with Floating UI for popover positioning and follows the standard AsheeUI
 * cascade system for visual tokens.
 *
 * By default, the calendar popover uses Floating UI's FloatingPortal to
 * render at the document body level. This ensures the popover escapes CSS
 * containment, overflow clipping, and stacking context issues. The portal
 * can be disabled via the `picker.portal` prop or
 * `components.datePicker.picker.portal` in the config if the popover needs
 * to stay within a specific parent container.
 *
 * @param props - DatePicker configuration options.
 * @param props.selected - Currently selected date or null.
 * @param props.onChange - Callback fired when the date changes.
 * @param props.mode - Selection mode: "date", "time", or "datetime". Defaults to "date".
 * @param props.isClearable - Whether a clear button is shown. Defaults to false.
 * @param props.disableFuture - Whether future dates are disabled. Defaults to false.
 * @param props.placeholder - Placeholder text.
 * @param props.size - Size of the input. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.disabled - Whether the input is disabled. Defaults to false.
 * @param props.picker - Picker configuration overrides including className, portal, portalTarget, and lockScroll.
 * @param props.label - Field label text.
 * @param props.description - Description text.
 * @param props.message - Validation message.
 * @param props.required - Whether the field is required. Defaults to false.
 * @param props.isLoading - Loading state. Defaults to false.
 * @param props.status - Validation status.
 * @param props.labelAlign - Alignment of the label. Defaults to "left".
 *
 * @example
 * ```tsx
 * import { DatePicker } from "asheeui";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [selected, setSelected] = useState<Date | null>(null);
 *
 *   return (
 *     <DatePicker
 *       selected={selected}
 *       onChange={setSelected}
 *       label="Select Date"
 *       isClearable
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With datetime mode and custom picker configuration
 * <DatePicker
 *   mode="datetime"
 *   label="Select Date and Time"
 *   isClearable
 *   picker={{
 *     className: "custom-calendar",
 *     portal: false,
 *   }}
 * />
 * ```
 *
 * @see DatePickerConfig - The configuration type for component defaults.
 * @see Input - The underlying input component.
 * @see Calendar - The calendar popover component.
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      selected,
      onChange,
      mode,
      isClearable = false,
      disableFuture = false,
      placeholder,
      size,
      radius,
      color,
      disabled,
      picker,
      ...inputProps
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.datePicker as
      | DatePickerConfig
      | undefined;

    const generatedId = useId();
    const fieldId = inputProps.id ?? generatedId;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    // ─── Token Resolvers ──────────────────────────────────────────────────

    const resolvedMode = resolveCascade<PickerMode>(
      mode,
      sectionConfig?.mode,
      undefined,
      FALLBACK_DATE_PICKER_CONFIG.mode,
    );

    const resolvedPortal = resolveCascade<boolean>(
      picker?.portal,
      sectionConfig?.picker?.portal,
      undefined,
      FALLBACK_SELECT_MENU_CONFIG.portal,
    );

    const resolvedPortalTarget = resolveCascade<HTMLElement | null>(
      picker?.portalTarget,
      sectionConfig?.picker?.portalTarget,
      undefined,
      null,
    );

    const resolvedLockScroll = resolveCascade<boolean>(
      picker?.lockScroll,
      sectionConfig?.picker?.lockScroll,
      undefined,
      true,
    );

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_DATE_PICKER_CONFIG.size,
    );

    const resolvedColor = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_DATE_PICKER_CONFIG.color,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      typeof radius === "string" ? radius : undefined,
      typeof sectionConfig?.radius === "string"
        ? sectionConfig.radius
        : undefined,
      config.defaultRadius,
      FALLBACK_DATE_PICKER_CONFIG.radius,
    );

    const calenderRadiusClass = resolveClassKey(
      resolvedRadiusKey === "full" ? "xl" : resolvedRadiusKey,
      RADIUS_CLASS,
      FALLBACK_DATE_PICKER_CONFIG.radius,
    );

    // ─── Floating UI ─────────────────────────────────────────────────────

    const {
      refs,
      context,
      floatingStyles,
      isPositioned,
      getReferenceProps,
      getFloatingProps,
    } = useSelectFloating<HTMLInputElement>({
      isOpen,
      onOpenChange: setIsOpen,
      disabled,
      matchReferenceWidth: false, // Allow calendar to size naturally side-by-side
      role: "dialog",
    });

    // ─── Scroll Lock ────────────────────────────────────────────────────────

    // Lock body scroll while the calendar popover is open. Setting
    // `position: fixed` on <body> makes it ignore the page's scroll position,
    // so compensate with `top: -scrollY` and restore the offset on cleanup —
    // otherwise the page would jump to the top the moment the lock applies.
    useEffect(() => {
      if (!isOpen || !resolvedLockScroll) return;

      const scrollY = window.scrollY;

      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalLeft = document.body.style.left;
      const originalRight = document.body.style.right;
      const originalWidth = document.body.style.width;
      const originalOverflow = document.body.style.overflow;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.left = originalLeft;
        document.body.style.right = originalRight;
        document.body.style.width = originalWidth;
        document.body.style.overflow = originalOverflow;

        window.scrollTo(0, scrollY);
      };
    }, [isOpen, resolvedLockScroll]);

    // ─── Input value sync with selected date ─────────────────────────────

    useEffect(() => {
      if (selected) {
        setInputValue(formatDisplay(selected, resolvedMode));
      } else {
        setInputValue("");
      }
    }, [selected, resolvedMode]);

    // ─── Handlers ────────────────────────────────────────────────────────

    /**
     * Handles date selection from the calendar.
     * Updates the input value and closes the popover for date mode.
     */
    const handleSelect = useCallback(
      (date: Date | null) => {
        onChange?.(date);
        if (date) {
          setInputValue(formatDisplay(date, resolvedMode));
        } else {
          setInputValue("");
        }
        if (resolvedMode === "date" || date === null) {
          setIsOpen(false);
        }
      },
      [onChange, resolvedMode],
    );

    /**
     * Closes the calendar popover.
     */
    const handleClose = useCallback(() => setIsOpen(false), []);

    /**
     * Clears the selected date and input value.
     * Focuses the input after clearing.
     */
    const handleClear = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onChange?.(null);
        setInputValue("");
        setIsOpen(false);
        inputRef.current?.focus();
      },
      [onChange],
    );

    /**
     * Handles manual input changes with date parsing.
     * Parses numeric input and updates the date accordingly.
     */
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const raw = input.value;
        const oldValue = inputValue;
        const oldSelectionStart = input.selectionStart ?? 0;

        const digits = raw.replace(/\D/g, "");
        if (digits.length === 0) {
          setInputValue("");
          onChange?.(null);
          return;
        }

        const parsed = parseDateString(
          digits,
          resolvedMode,
          selected ?? undefined,
        );
        if (parsed) {
          onChange?.(parsed);
          const formatted = formatDisplay(parsed, resolvedMode);
          setInputValue(formatted);

          const newCursor = getNewCursorPosition(
            oldValue,
            formatted,
            oldSelectionStart,
          );
          requestAnimationFrame(() => {
            input.setSelectionRange(newCursor, newCursor);
          });
        } else {
          if (selected) {
            setInputValue(formatDisplay(selected, resolvedMode));
          } else {
            setInputValue("");
          }
        }
      },
      [resolvedMode, selected, onChange, inputValue],
    );

    const displayPlaceholder =
      placeholder ?? getDefaultPlaceholder(resolvedMode);

    const endContent = (
      <>
        {isClearable && selected && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear selection"
            className="p-0.5 rounded text-foreground/70 hover:text-foreground transition-colors">
            <ClearIcon className="size-3.5" />
          </button>
        )}
        <span className="text-foreground/70 pointer-events-none">
          {resolvedMode === "time" ? <ClockIcon /> : <CalendarIcon />}
        </span>
      </>
    );

    const popoverContent = isOpen ? (
      <FloatingFocusManager
        context={context}
        modal={false}
        initialFocus={-1}
        returnFocus={false}>
        <div
          ref={refs.setFloating}
          style={{ ...floatingStyles }}
          className={cn(
            "z-100 outline-none w-max",
            // Disable transitions on the floating node. Floating UI applies
            // position via `transform` on every scroll tick, and any inherited
            // transform transition would ease toward each new position instead
            // of snapping, producing a spring/bounce effect.
            "transition-none",
            isPositioned
              ? "animate-in fade-in-0 zoom-in-95 duration-150 ease-out"
              : "invisible opacity-0 pointer-events-none",
            picker?.className,
          )}
          {...getFloatingProps()}>
          <Calendar
            selected={selected}
            mode={resolvedMode}
            isClearable={isClearable}
            resolvedSizeKey={resolvedSizeKey}
            onSelect={handleSelect}
            onClose={handleClose}
            disableFuture={disableFuture}
            resolvedColor={resolvedColor}
            radiusClass={calenderRadiusClass}
          />
        </div>
      </FloatingFocusManager>
    ) : null;

    const finalPortalTarget =
      resolvedPortalTarget ??
      (typeof document !== "undefined" ? document.body : null);

    // ─── Ref callback for the Input component ────────────────────────────

    /**
     * Sets the ref for the input element and connects it to Floating UI.
     */
    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        if (node) {
          refs.setReference(node);
          inputRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.RefObject<HTMLInputElement | null>).current = node;
          }
        }
      },
      [refs, ref],
    );

    return (
      <div className="w-full relative inline-block">
        <Input
          {...inputProps}
          ref={setInputRef}
          id={fieldId}
          size={size}
          radius={radius}
          color={color}
          placeholder={displayPlaceholder}
          value={inputValue}
          onChange={handleInputChange}
          endContent={endContent}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          {...getReferenceProps()}
        />
        {isOpen &&
          (resolvedPortal ? (
            <FloatingPortal root={finalPortalTarget}>
              {popoverContent}
            </FloatingPortal>
          ) : (
            popoverContent
          ))}
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";
