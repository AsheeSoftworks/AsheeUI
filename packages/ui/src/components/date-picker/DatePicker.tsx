"use client";

import { cn } from "@asheeui/utils";
import {
  autoUpdate,
  FloatingFocusManager,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
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
import { CalendarIcon } from "../../icons/CalendarIcon";
import { ChevronLeftIcon } from "../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { ClearIcon } from "../../icons/ClearIcon";
import { ClockIcon } from "../../icons/ClockIcon";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

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

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

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
  selected?: Date | null;
  onChange?: (date: Date | null) => void;
  mode?: PickerMode;
  size?: FieldSizeKey;
  radius?: Radius;
  variant?: Variant;
  color?: Color;
  status?: FieldStatus;
  label?: string;
  labelAlign?: LabelAlign;
  description?: string;
  message?: string;
  required?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  isClearable?: boolean;
  disableFuture?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  style?: CSSProperties;
}

// ─── Main DatePicker Component ───────────────────────────────────────────────

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

    // Floating UI context
    const { refs, floatingStyles, context } = useFloating<HTMLDivElement>({
      open: isOpen,
      onOpenChange: (open) => !disabled && setIsOpen(open),
      placement: "bottom-start",
      whileElementsMounted: autoUpdate,
      middleware: [offset(6), flip(), shift({ padding: 8 })],
    });

    const click = useClick(context, { enabled: !disabled });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "dialog" });
    const { getReferenceProps, getFloatingProps } = useInteractions([
      click,
      dismiss,
      role,
    ]);

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_DATE_PICKER_CONFIG.size,
    );

    const resolvedVariant = resolveCascade<Variant>(
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
      resolvedVariant,
      resolvedStatusColor,
    );
    const statusClass =
      resolvedStatus !== "default"
        ? DATE_PICKER_STATUS_BORDER_CLASS[resolvedStatus]
        : "";
    const radiusClass =
      resolvedVariant === "underlined"
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

          {/* Popover */}
          {isOpen && (
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                style={{ ...floatingStyles, zIndex: 99999 }}
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
          )}
        </div>
      </FieldShell>
    );
  },
);

DatePicker.displayName = "DatePicker";
