"use client";

import { useSettings } from "@ashee/settings";
import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
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
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import {
  type CSSProperties,
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../../shared/variant";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { ChevronLeftIcon } from "../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { ClearIcon } from "../../icons/ClearIcon";
import { ClockIcon } from "../../icons/ClockIcon";
import { FieldShell } from "../field/FieldShell";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../field/field-config";
import type {
  DatePickerConfig,
  DatePickerSizeScale,
  PickerMode,
} from "./date-picker-config";
import { defaultDatePickerSizeScale } from "./default-date-picker-config";
import { flattenDatePickerSizeScale } from "./flatten-date-picker-size-scale";

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

// ─── Status Class Override ───────────────────────────────────────────────────

const STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "",
  error:
    "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
  warning:
    "border-warning focus-visible:border-warning focus-visible:ring-warning/20",
  success:
    "border-success focus-visible:border-success focus-visible:ring-success/20",
};

// ─── TimeSpinner ─────────────────────────────────────────────────────────────

// ─── Color Helper Classes for Calendar Sub-elements ──────────────────────────

const CALENDAR_COLOR_CLASSES: Record<
  Color | string,
  { bg: string; text: string; border: string; hover: string }
> = {
  default: {
    bg: "bg-foreground text-background",
    text: "text-foreground",
    border: "border-foreground",
    hover: "hover:text-foreground hover:bg-muted",
  },
  primary: {
    bg: "bg-primary text-primary-foreground",
    text: "text-primary",
    border: "border-primary",
    hover: "hover:text-primary hover:bg-primary/10",
  },
  secondary: {
    bg: "bg-secondary text-secondary-foreground",
    text: "text-secondary",
    border: "border-secondary",
    hover: "hover:text-secondary hover:bg-secondary/10",
  },
  success: {
    bg: "bg-success text-success-foreground",
    text: "text-success",
    border: "border-success",
    hover: "hover:text-success hover:bg-success/10",
  },
  warning: {
    bg: "bg-warning text-warning-foreground",
    text: "text-warning",
    border: "border-warning",
    hover: "hover:text-warning hover:bg-warning/10",
  },
  danger: {
    bg: "bg-danger text-danger-foreground",
    text: "text-danger",
    border: "border-danger",
    hover: "hover:text-danger hover:bg-danger/10",
  },
};

// ─── TimeSpinner ─────────────────────────────────────────────────────────────

interface TimeSpinnerProps {
  value: number;
  max: number;
  label: string;
  onChange: (v: number) => void;
  resolvedColor: Color;
  resolvedRadius: string;
}

function TimeSpinner({
  value,
  max,
  label,
  onChange,
  resolvedColor,
  resolvedRadius,
}: TimeSpinnerProps) {
  const inc = () => onChange(value >= max ? 0 : value + 1);
  const dec = () => onChange(value <= 0 ? max : value - 1);
  const colorStyles =
    CALENDAR_COLOR_CLASSES[resolvedColor] ?? CALENDAR_COLOR_CLASSES.primary;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground select-none">
        {label}
      </span>
      <button
        type="button"
        className={cn(
          "w-10 h-7 flex items-center justify-center text-xs text-muted-foreground transition-colors",
          colorStyles.hover,
        )}
        style={{ borderRadius: resolvedRadius }}
        onClick={inc}
        aria-label={`Increment ${label}`}>
        ▲
      </button>
      <div
        className="w-10 h-10 flex items-center justify-center text-base font-mono font-bold text-foreground bg-background border border-border select-none"
        style={{ borderRadius: resolvedRadius }}>
        {pad2(value)}
      </div>
      <button
        type="button"
        className={cn(
          "w-10 h-7 flex items-center justify-center text-xs text-muted-foreground transition-colors",
          colorStyles.hover,
        )}
        style={{ borderRadius: resolvedRadius }}
        onClick={dec}
        aria-label={`Decrement ${label}`}>
        ▼
      </button>
    </div>
  );
}

// ─── Calendar Panel ──────────────────────────────────────────────────────────

interface CalendarProps {
  selected: Date | null | undefined;
  mode: PickerMode;
  isClearable: boolean;
  resolvedSizeKey: FieldSizeKey;
  resolvedColor: Color;
  resolvedRadius: string;
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
  resolvedRadius,
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
      className="bg-background border border-border shadow-xl select-none p-3 min-w-70"
      style={{ borderRadius: resolvedRadius }}>
      {showCalendar && (
        <>
          {/* Month/Year Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Previous month"
              style={{ borderRadius: resolvedRadius }}
              className={cn(
                "p-1 text-foreground transition-colors",
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
              style={{ borderRadius: resolvedRadius }}
              className={cn(
                "p-1 text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
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
                className="text-xs font-semibold text-muted-foreground py-1">
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
                  style={{
                    height: `var(--ashee-date-picker-${resolvedSizeKey}-cell-s)`,
                    borderRadius: resolvedRadius,
                  }}
                  className={cn(
                    "w-full flex items-center justify-center text-xs font-medium transition-colors",
                    isDisabled(day)
                      ? "opacity-30 cursor-not-allowed text-muted-foreground"
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
            resolvedRadius={resolvedRadius}
          />
          <span className="text-xl font-bold text-muted-foreground select-none pt-3">
            :
          </span>
          <TimeSpinner
            value={minutes}
            max={59}
            label="MM"
            onChange={handleMinutesChange}
            resolvedColor={resolvedColor}
            resolvedRadius={resolvedRadius}
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
              className="text-xs text-muted-foreground hover:text-danger transition-colors">
              Clear
            </button>
          )}
          {mode !== "date" && (
            <button
              type="button"
              onClick={onClose}
              style={{ borderRadius: resolvedRadius }}
              className={cn(
                "ml-auto text-xs font-medium px-3 py-1.5 hover:opacity-90 transition-opacity",
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

// ─── Main DatePicker Component ───────────────────────────────────────────────

export interface DatePickerProps {
  selected?: Date | null;
  onChange?: (date: Date | null) => void;
  mode?: PickerMode;
  size?: FieldSizeKey;
  radius?: keyof Radius;
  variant?: Variant;
  color?: Color;
  animation?: AnimationProp;
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

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      selected,
      onChange,
      mode = "date",
      size,
      radius,
      variant,
      color,
      animation,
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
    const { settings } = useSettings();
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

    // Token Scale Resolvers
    const sizeScale = (sectionConfig?.size ??
      defaultDatePickerSizeScale) as DatePickerSizeScale;
    const resolvedSizeKey = size ?? sizeScale.default;
    const responsiveVars = useMemo(
      () => flattenDatePickerSizeScale(sizeScale),
      [sizeScale],
    );
    useResponsiveVars(
      "ashee-date-picker-tokens",
      responsiveVars,
      config.theme.breakpoints,
    );

    const resolvedRadiusKey = typeof radius === "string" ? radius : undefined;
    const resolvedSectionRadiusKey =
      typeof sectionConfig?.radius === "string"
        ? sectionConfig.radius
        : undefined;
    const resolvedRadius = resolveScale(
      resolvedRadiusKey,
      resolvedSectionRadiusKey,
      config.theme.radius.default,
      config.theme.radius.values,
    );

    const resolvedVariant = resolveValue<Variant>(
      variant,
      sectionConfig?.variant,
      (config.theme.defaultVariant as Variant) ?? "bordered",
    );

    const resolvedColor = resolveValue<Color>(
      color,
      sectionConfig?.color,
      (config.theme.defaultColor as Color) ?? "primary",
    );

    const resolvedStatus = status ?? "default";
    const resolvedLabelAlign = resolveValue(
      labelAlign,
      sectionConfig?.labelAlign,
      "left",
    );
    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
      settings.enableAnimations,
    );

    const variantClass = resolveVariantClass(resolvedVariant, resolvedColor);
    const statusClass =
      resolvedStatus !== "default" ? STATUS_BORDER_CLASS[resolvedStatus] : "";

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

    const displayPlaceholder = placeholder ?? getDefaultPlaceholder(mode);
    const displayValue = selected ? formatDisplay(selected, mode) : null;

    return (
      <FieldShell
        id={fieldId}
        label={label}
        labelAlign={resolvedLabelAlign}
        description={description}
        message={message}
        status={resolvedStatus}
        required={required}
        isLoading={isLoading}
        labelClassName={sectionConfig?.labelClassName}
        descriptionClassName={sectionConfig?.descriptionClassName}
        messageClassName={sectionConfig?.messageClassName}>
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
              "w-full flex items-center justify-between cursor-pointer text-foreground outline-none transition-colors select-none",
              "focus-visible:ring-2 focus-visible:ring-offset-2",
              disabled && "pointer-events-none opacity-50 cursor-not-allowed",
              variantClass,
              statusClass,
              sectionConfig?.className,
              className,
            )}
            style={{
              borderRadius:
                resolvedVariant === "underlined" ? "0px" : resolvedRadius,
              height: `var(--ashee-date-picker-${resolvedSizeKey}-height)`,
              paddingInline: `var(--ashee-date-picker-${resolvedSizeKey}-padding-x)`,
              fontSize: `var(--ashee-date-picker-${resolvedSizeKey}-font-s)`,
              ...style,
            }}
            {...getReferenceProps()}>
            <span
              className={
                displayValue ? "text-foreground" : "text-muted-foreground"
              }>
              {displayValue ?? displayPlaceholder}
            </span>

            <div className="flex items-center gap-1.5 ml-2 shrink-0">
              {isClearable && selected && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear selection"
                  className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors">
                  <ClearIcon className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="text-muted-foreground pointer-events-none">
                {mode === "time" ? <ClockIcon /> : <CalendarIcon />}
              </span>
            </div>
          </div>

          {/* Floating Animated Popover */}
          <AnimatePresence>
            {isOpen && (
              <FloatingFocusManager context={context} modal={false}>
                <div
                  ref={refs.setFloating}
                  style={{ ...floatingStyles, zIndex: 99999 }}
                  className="outline-none"
                  {...getFloatingProps()}>
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    {...(motionProps as HTMLMotionProps<"div">)}>
                    <Calendar
                      selected={selected}
                      mode={mode}
                      isClearable={isClearable}
                      resolvedSizeKey={resolvedSizeKey}
                      onSelect={handleSelect}
                      onClose={handleClose}
                      disableFuture={disableFuture}
                      resolvedColor={resolvedColor}
                      resolvedRadius={
                        resolvedVariant === "underlined"
                          ? "0px"
                          : resolvedRadius
                      }
                    />
                  </motion.div>
                </div>
              </FloatingFocusManager>
            )}
          </AnimatePresence>
        </div>
      </FieldShell>
    );
  },
);
DatePicker.displayName = "DatePicker";
