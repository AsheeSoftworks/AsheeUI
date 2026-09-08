/**
 * DatePicker component for AsheeUI.
 * This file provides the main DatePicker component implementation, which renders
 * a date, time, or datetime picker with a calendar popover. It supports
 * selection, clearing, validation states, and various visual tokens that
 * resolve through the standard AsheeUI cascade system.
 */
"use client";

import {
  FloatingFocusManager,
  useClick,
  useDismiss,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import {
  type CSSProperties,
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { ChevronLeftIcon } from "../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { ClearIcon } from "../../icons/ClearIcon";
import { ClockIcon } from "../../icons/ClockIcon";
import { useAsheeConfig } from "../../libs/context";
import {
  type Color,
  RADIUS_CLASS,
  type Radius,
  resolveVariantClass,
  type Variant,
} from "../../shared";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { FieldShell } from "../field/FieldShell";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../field/field-config";
import {
  type DatePickerConfig,
  FALLBACK_DATE_PICKER_CONFIG,
  type PickerMode,
} from "./date-picker-config";
import {
  CALENDAR_COLOR_CLASSES,
  DATE_PICKER_CELL_SIZE_CLASS,
  DATE_PICKER_SIZE_CLASS,
  DATE_PICKER_STATUS_BORDER_CLASS,
} from "./date-picker-styles";
import { useSelectFloating } from "../select-menu";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Days of the week abbreviations used in the calendar header.
 */
const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

/**
 * Full month names used in the calendar header.
 */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * Pads a number with a leading zero to ensure two digits.
 * @param n - The number to pad.
 * @returns The padded string.
 */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Formats a date according to the picker mode.
 * @param date - The date to format.
 * @param mode - The picker mode (date, time, or datetime).
 * @returns The formatted date string.
 */
function formatDisplay(date: Date, mode: PickerMode): string {
  const d = pad2(date.getDate());
  const mo = pad2(date.getMonth() + 1);
  const y = date.getFullYear();
  const h = pad2(date.getHours());
  const mi = pad2(date.getMinutes());
  switch (mode) {
    case "date":
      return `${d}/${mo}/${y}`;
    case "time":
      return `${h}:${mi}`;
    case "datetime":
      return `${d}/${mo}/${y} ${h}:${mi}`;
  }
}

/**
 * Returns the default placeholder text for a given picker mode.
 * @param mode - The picker mode.
 * @returns The placeholder string.
 */
function getDefaultPlaceholder(mode: PickerMode): string {
  switch (mode) {
    case "date":
      return "Select date...";
    case "time":
      return "Select time...";
    case "datetime":
      return "Select date & time...";
  }
}

/**
 * Builds an array of day numbers for a given month, with nulls for empty slots.
 * @param year - The year.
 * @param month - The month (0-indexed).
 * @returns An array of day numbers or nulls.
 */
function buildDayCells(year: number, month: number): (number | null)[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ─── TimeSpinner Sub-Component ──────────────────────────────────────────────

interface TimeSpinnerProps {
  value: number;
  max: number;
  label: string;
  onChange: (v: number) => void;
  resolvedColor: Color;
  radiusClass: string;
}

/**
 * A spinner control for selecting hours or minutes.
 * Renders increment and decrement buttons around a centered value display.
 */
function TimeSpinner({
  value,
  max,
  label,
  onChange,
  resolvedColor,
  radiusClass,
}: TimeSpinnerProps) {
  const inc = () => onChange(value >= max ? 0 : value + 1);
  const dec = () => onChange(value <= 0 ? max : value - 1);
  const colorStyles =
    CALENDAR_COLOR_CLASSES[resolvedColor] ?? CALENDAR_COLOR_CLASSES.primary;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-foreground/70 select-none">
        {label}
      </span>
      <button
        type="button"
        className={cn(
          "w-10 h-7 flex items-center justify-center text-xs text-foreground/70 transition-colors",
          radiusClass,
          colorStyles.hover,
        )}
        onClick={inc}
        aria-label={`Increment ${label}`}>
        ▲
      </button>
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center text-base font-mono font-bold text-foreground bg-background border border-border select-none",
          radiusClass,
        )}>
        {pad2(value)}
      </div>
      <button
        type="button"
        className={cn(
          "w-10 h-7 flex items-center justify-center text-xs text-foreground/70 transition-colors",
          radiusClass,
          colorStyles.hover,
        )}
        onClick={dec}
        aria-label={`Decrement ${label}`}>
        ▼
      </button>
    </div>
  );
}

// ─── Calendar Panel Sub-Component ───────────────────────────────────────────

interface CalendarProps {
  selected: Date | null | undefined;
  mode: PickerMode;
  isClearable: boolean;
  resolvedSizeKey: FieldSizeKey;
  resolvedColor: Color;
  radiusClass: string;
  onSelect: (date: Date | null) => void;
  onClose: () => void;
  disableFuture?: boolean;
}

/**
 * The calendar panel that renders the date grid and time picker.
 * Displays a month grid with selectable days, and optionally time controls.
 */
function Calendar({
  selected,
  mode,
  isClearable,
  resolvedSizeKey,
  resolvedColor,
  radiusClass,
  onSelect,
  onClose,
  disableFuture = false,
}: CalendarProps) {
  const today = new Date();

  const [viewYear, setViewYear] = useState<number>(
    selected?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState<number>(
    selected?.getMonth() ?? today.getMonth(),
  );
  const [hours, setHours] = useState<number>(selected?.getHours() ?? 0);
  const [minutes, setMinutes] = useState<number>(selected?.getMinutes() ?? 0);

  const colorStyles =
    CALENDAR_COLOR_CLASSES[resolvedColor] ?? CALENDAR_COLOR_CLASSES.primary;

  function applyTime(h: number, m: number): void {
    const base = selected ?? new Date();
    onSelect(
      new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, m, 0, 0),
    );
  }

  function handleHoursChange(h: number): void {
    setHours(h);
    applyTime(h, minutes);
  }

  function handleMinutesChange(m: number): void {
    setMinutes(m);
    applyTime(hours, m);
  }

  function handleDayClick(day: number): void {
    onSelect(new Date(viewYear, viewMonth, day, hours, minutes, 0, 0));
    if (mode === "date") onClose();
  }

  function prevMonth(): void {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth(): void {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  function isSelected(day: number): boolean {
    return (
      !!selected &&
      selected.getFullYear() === viewYear &&
      selected.getMonth() === viewMonth &&
      selected.getDate() === day
    );
  }

  function isToday(day: number): boolean {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  }

  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  function isDisabled(day: number): boolean {
    if (!disableFuture) return false;
    return new Date(viewYear, viewMonth, day) > todayMidnight;
  }

  const canGoNext =
    !disableFuture ||
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth < today.getMonth());

  const showCalendar = mode === "date" || mode === "datetime";
  const showTime = mode === "time" || mode === "datetime";
  const showFooter = mode !== "date" || (isClearable && !!selected);

  const cells = buildDayCells(viewYear, viewMonth);
  const memoizedCells = useMemo(() => {
    return cells.map((day, index) => ({
      key: day !== null ? `day-${day}` : `empty-slot-${index}`,
      day,
    }));
  }, [cells]);

  return (
    <div
      className={cn(
        "bg-background border border-border shadow-xl select-none p-3 min-w-70",
        radiusClass,
      )}>
      {showCalendar && (
        <>
          {/* Month/Year Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Previous month"
              className={cn(
                "p-1 text-foreground transition-colors",
                radiusClass,
                colorStyles.hover,
              )}>
              <ChevronLeftIcon />
            </button>
            <span className="font-medium text-sm text-foreground">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              disabled={!canGoNext}
              aria-label="Next month"
              className={cn(
                "p-1 text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                radiusClass,
                colorStyles.hover,
              )}>
              <ChevronRightIcon />
            </button>
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS_OF_WEEK.map((d) => (
              <div
                key={d}
                className="text-xs font-semibold text-foreground/70 py-1">
                {d}
              </div>
            ))}
            {memoizedCells.map(({ key, day }) =>
              day === null ? (
                <div key={key} />
              ) : (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  disabled={isDisabled(day)}
                  className={cn(
                    "w-full flex items-center justify-center font-medium transition-colors",
                    DATE_PICKER_CELL_SIZE_CLASS[resolvedSizeKey],
                    radiusClass,
                    isDisabled(day)
                      ? "opacity-30 cursor-not-allowed text-foreground/70"
                      : isSelected(day)
                        ? cn(colorStyles.bg, "font-semibold")
                        : isToday(day)
                          ? cn("border", colorStyles.border, colorStyles.text)
                          : cn("text-foreground", colorStyles.hover),
                  )}>
                  {day}
                </button>
              ),
            )}
          </div>
        </>
      )}

      {/* Time Picker */}
      {showTime && (
        <div className="flex items-center justify-center gap-4 py-3 border-t border-border mt-2">
          <TimeSpinner
            value={hours}
            max={23}
            label="HH"
            onChange={handleHoursChange}
            resolvedColor={resolvedColor}
            radiusClass={radiusClass}
          />
          <span className="text-xl font-bold text-foreground/70 select-none pt-3">
            :
          </span>
          <TimeSpinner
            value={minutes}
            max={59}
            label="MM"
            onChange={handleMinutesChange}
            resolvedColor={resolvedColor}
            radiusClass={radiusClass}
          />
        </div>
      )}

      {/* Footer */}
      {showFooter && (
        <div className="flex items-center justify-between border-t border-border pt-2 mt-2">
          {isClearable && selected && (
            <button
              type="button"
              onClick={() => {
                onSelect(null);
                onClose();
              }}
              className="text-xs text-foreground/70 hover:text-danger transition-colors">
              Clear
            </button>
          )}
          {mode !== "date" && (
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "ml-auto text-xs font-medium px-3 py-1.5 hover:opacity-90 transition-opacity",
                radiusClass,
                colorStyles.bg,
              )}>
              Done
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Component Interface ──────────────────────────────────────────────────────

export interface DatePickerProps {
  /**
   * The currently selected date.
   * Use null for no selection.
   */
  selected?: Date | null;

  /**
   * Callback fired when the selected date changes.
   * Receives the new date or null when cleared.
   */
  onChange?: (date: Date | null) => void;

  /**
   * The selection mode of the picker.
   * Determines whether the picker shows date, time, or both.
   *
   * @default "date"
   */
  mode?: PickerMode;

  /**
   * Size of the date picker.
   * Controls the height and font size of the trigger.
   *
   * @default "md"
   */
  size?: FieldSizeKey;

  /**
   * Corner rounding of the date picker.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Visual style variant of the date picker trigger.
   *
   * @default "bordered"
   */
  variant?: Variant;

  /**
   * Theme accent color of the date picker.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Validation status of the field.
   * Controls border color and message styling.
   */
  status?: FieldStatus;

  /**
   * Label text for the date picker.
   */
  label?: string;

  /**
   * Alignment of the label relative to the input.
   *
   * @default "left"
   */
  labelAlign?: LabelAlign;

  /**
   * Description text shown below the field.
   */
  description?: string;

  /**
   * Validation message shown below the field.
   * Color is determined by the status prop.
   */
  message?: string;

  /**
   * Whether the field is required.
   * Adds a required indicator to the label.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Whether the field is in a loading state.
   * Shows a loading spinner.
   *
   * @default false
   */
  isLoading?: boolean;

  /**
   * Whether the field is disabled.
   * Prevents interaction and dims the field.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether a clear button is shown when a value is selected.
   *
   * @default false
   */
  isClearable?: boolean;

  /**
   * Whether future dates are disabled for selection.
   *
   * @default false
   */
  disableFuture?: boolean;

  /**
   * Custom placeholder text.
   * Overrides the default placeholder for the selected mode.
   */
  placeholder?: string;

  /**
   * Extra CSS classes for the date picker.
   */
  className?: string;

  /**
   * Optional ID for the field.
   */
  id?: string;

  /**
   * Inline styles for the date picker.
   */
  style?: CSSProperties;

  /**
   * Whether to render the calendar popover in a React portal.
   * When true, the popover is rendered at the document body level.
   * Defaults to true.
   */
  portal?: boolean;

  /**
   * Custom portal target element for the calendar popover.
   * When portal is enabled, the popover is rendered into this element.
   * Defaults to document.body.
   */
  portalTarget?: HTMLElement | null;
}

// ─── Main DatePicker Component ───────────────────────────────────────────────

/**
 * A date, time, or datetime picker component with a calendar popover.
 *
 * DatePicker displays a trigger input that opens a calendar panel for
 * selecting dates and times. It supports multiple modes (date, time,
 * datetime), clearable values, validation states, and the standard
 * AsheeUI cascade for visual tokens.
 *
 * The component automatically handles accessibility attributes including
 * role="combobox", aria-expanded, aria-invalid, and proper focus management
 * through Floating UI.
 *
 * By default, the calendar popover uses React's createPortal to render at the
 * document body level. This ensures the popover escapes CSS containment,
 * overflow clipping, and stacking context issues. The portal can be disabled
 * via the `portal` prop or `components.datePicker.portal` in the config if
 * the popover needs to stay within a specific parent container.
 *
 * @param props - DatePicker configuration options.
 * @param props.selected - The currently selected date.
 * @param props.onChange - Callback fired when the selected date changes.
 * @param props.mode - Selection mode. Defaults to "date".
 * @param props.size - Size of the picker. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.variant - Visual style variant. Defaults to "bordered".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.status - Validation status.
 * @param props.label - Label text.
 * @param props.labelAlign - Label alignment. Defaults to "left".
 * @param props.description - Description text.
 * @param props.message - Validation message.
 * @param props.required - Whether the field is required.
 * @param props.isLoading - Loading state.
 * @param props.disabled - Disabled state.
 * @param props.isClearable - Whether a clear button is shown.
 * @param props.disableFuture - Whether future dates are disabled.
 * @param props.placeholder - Custom placeholder text.
 * @param props.className - Extra CSS classes.
 * @param props.id - Optional ID for the field.
 * @param props.style - Inline styles.
 * @param props.portal - Whether to render the popover in a portal. Defaults to true.
 * @param props.portalTarget - Custom portal target element. Defaults to document.body.
 *
 * @example
 * ```tsx
 * import { DatePicker } from "asheeui";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [date, setDate] = useState<Date | null>(null);
 *
 *   return (
 *     <DatePicker
 *       selected={date}
 *       onChange={setDate}
 *       label="Select a date"
 *       isClearable
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // DateTime picker with time selection
 * <DatePicker
 *   mode="datetime"
 *   selected={dateTime}
 *   onChange={setDateTime}
 *   label="Select date and time"
 *   disableFuture
 * />
 * ```
 *
 * @see DatePickerConfig - The configuration type for component defaults.
 * @see FieldShell - The wrapper component for label and validation.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      selected,
      onChange,
      mode,
      size,
      radius,
      variant,
      color,
      status,
      label,
      labelAlign,
      description,
      message,
      required,
      isLoading,
      disabled,
      isClearable = false,
      disableFuture = false,
      placeholder,
      className,
      id,
      style,
      portal: portalProp,
      portalTarget: portalTargetProp,
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.datePicker as
      | DatePickerConfig
      | undefined;

    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_DATE_PICKER_CONFIG.size,
    );

    const resolvedVariantKey = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_DATE_PICKER_CONFIG.variant,
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

    const resolvedStatus = status ?? FALLBACK_DATE_PICKER_CONFIG.status;

    const resolvedLabelAlign = resolveCascade<LabelAlign>(
      labelAlign,
      sectionConfig?.labelAlign,
      undefined,
      FALLBACK_DATE_PICKER_CONFIG.labelAlign,
    );

    const resolvedMode =
      mode ?? sectionConfig?.mode ?? FALLBACK_DATE_PICKER_CONFIG.mode;

    const resolvedPortal = resolveCascade<boolean>(
      portalProp,
      sectionConfig?.portal,
      undefined,
      FALLBACK_DATE_PICKER_CONFIG.portal,
    );

    const resolvedPortalTarget = resolveCascade<HTMLElement | null>(
      portalTargetProp,
      sectionConfig?.portalTarget,
      undefined,
      FALLBACK_DATE_PICKER_CONFIG.portalTarget,
    );

    const resolvedStatusColor: Color =
      resolvedStatus === "error"
        ? "danger"
        : resolvedStatus === "success"
          ? "success"
          : resolvedStatus === "warning"
            ? "warning"
            : resolvedColor;

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const variantClass = resolveVariantClass(
      resolvedVariantKey,
      resolvedStatusColor,
    );
    const statusClass =
      resolvedStatus !== "default"
        ? DATE_PICKER_STATUS_BORDER_CLASS[resolvedStatus]
        : "";
    const radiusClass =
      resolvedVariantKey === "underlined"
        ? "rounded-none"
        : resolveClassKey(
            resolvedRadiusKey,
            RADIUS_CLASS,
            FALLBACK_DATE_PICKER_CONFIG.radius,
          );

    const calenderRadiusClass = resolveClassKey(
      resolvedRadiusKey === "full" ? "xl" : resolvedRadiusKey,
      RADIUS_CLASS,
      FALLBACK_DATE_PICKER_CONFIG.radius,
    );

    // ─── 3. Floating UI ──────────────────────────────────────────────────────

    const { refs, floatingStyles, context } =
      useSelectFloating<HTMLButtonElement>({
        isOpen,
        onOpenChange: setIsOpen,
        disabled,
      });

    const click = useClick(context, { enabled: !disabled });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "dialog" });
    const { getReferenceProps, getFloatingProps } = useInteractions([
      click,
      dismiss,
      role,
    ]);

    // ─── 4. Handlers ──────────────────────────────────────────────────────────

    const handleSelect = useCallback(
      (date: Date | null) => onChange?.(date),
      [onChange],
    );

    const handleClose = useCallback(() => setIsOpen(false), []);

    const handleClear = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onChange?.(null);
      },
      [onChange],
    );

    const displayPlaceholder =
      placeholder ?? getDefaultPlaceholder(resolvedMode);
    const displayValue = selected
      ? formatDisplay(selected, resolvedMode)
      : null;

    // ─── 5. Render ────────────────────────────────────────────────────────────

    const popoverContent = isOpen ? (
      <FloatingFocusManager context={context} modal={false}>
        <div
          ref={refs.setFloating}
          style={{ ...floatingStyles, zIndex: 999999 }}
          className="outline-none"
          {...getFloatingProps()}>
          <div className="animate-in fade-in-0 zoom-in-95 duration-150 ease-out">
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
        </div>
      </FloatingFocusManager>
    ) : null;

    // Resolve portal target - use prop > config > document.body fallback
    const finalPortalTarget =
      resolvedPortalTarget ??
      (typeof document !== "undefined" ? document.body : null);

    return (
      <FieldShell
        id={fieldId}
        label={label}
        labelAlign={resolvedLabelAlign}
        description={description}
        message={message}
        status={resolvedStatus}
        required={required}
        isLoading={isLoading}>
        <div className="w-full relative inline-block">
          {/* Trigger Box */}
          <div
            ref={(node) => {
              refs.setReference(node);
              if (typeof ref === "function") ref(node);
              else if (ref)
                (ref as React.RefObject<HTMLDivElement | null>).current = node;
            }}
            role="combobox"
            tabIndex={disabled ? -1 : 0}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-invalid={resolvedStatus === "error"}
            aria-disabled={disabled}
            className={cn(
              "w-full flex items-center justify-between cursor-pointer text-foreground outline-none transition-colors select-none shrink-0",
              "focus-visible:ring-2 focus-visible:ring-offset-2",
              disabled && "pointer-events-none opacity-50 cursor-not-allowed",
              DATE_PICKER_SIZE_CLASS[resolvedSizeKey],
              variantClass,
              statusClass,
              radiusClass,
              className,
            )}
            style={style}
            {...getReferenceProps()}>
            <span
              className={
                displayValue ? "text-foreground" : "text-foreground/70"
              }>
              {displayValue ?? displayPlaceholder}
            </span>

            <div className="flex items-center gap-1.5 ml-2 shrink-0">
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
            </div>
          </div>

          {/* Popover with optional portal */}
          {isOpen &&
            (resolvedPortal && finalPortalTarget
              ? createPortal(popoverContent, finalPortalTarget)
              : popoverContent)}
        </div>
      </FieldShell>
    );
  },
);

DatePicker.displayName = "DatePicker";
