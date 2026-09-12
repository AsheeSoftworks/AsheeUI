/**
 * Calendar component for AsheeUI.
 * This file provides the Calendar popover implementation, which renders
 * a month grid with day selection and optional time spinners for
 * the DatePicker component.
 */

import { memo, useMemo, useState } from "react";
import { ChevronLeftIcon } from "../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import type { Color } from "../../shared";
import { cn } from "../../utils";
import type { FieldSizeKey } from "../field/field-config";
import { buildDayCells, DAYS_OF_WEEK, MONTHS } from "./date-picker.helpers";
import type { DatePickerMode } from "./date-picker-config";
import {
  CALENDAR_COLOR_CLASSES,
  DATE_PICKER_CELL_SIZE_CLASS,
} from "./date-picker-styles";
import { TimeSpinner } from "./TimeSpinner";

// ─── Component Interface ──────────────────────────────────────────────────────

interface CalendarProps {
  /**
   * The currently selected date.
   * Used to highlight the selected day and initialize time values.
   */
  selected: Date | null | undefined;
  /**
   * Selection mode of the picker.
   * Controls whether the calendar, time spinners, or both are shown.
   */
  mode: DatePickerMode;
  /**
   * Whether a clear button is shown in the footer.
   */
  isClearable: boolean;
  /**
   * Resolved size key for the calendar cells.
   * Controls the size of day buttons in the grid.
   */
  resolvedSizeKey: FieldSizeKey;
  /**
   * Resolved color for the calendar.
   * Used for accent colors and hover states.
   */
  resolvedColor: Color;
  /**
   * CSS class for corner rounding.
   * Applied to the calendar container.
   */
  radiusClass: string;
  /**
   * Callback fired when a date is selected.
   * Receives the selected date or null.
   */
  onSelect: (date: Date | null) => void;
  /**
   * Callback fired when the calendar should close.
   * Called after date selection or when "Done" is clicked.
   */
  onClose: () => void;
  /**
   * Whether future dates are disabled.
   * Prevents selection of dates after today.
   *
   * @default false
   */
  disableFuture?: boolean;
}

/**
 * Calendar popover component with month navigation and date selection.
 *
 * Memoized so parent-driven renders (the DatePicker popover's one-time
 * `isPositioned` flip, input typing, open/close) do not rebuild the month
 * grid. Every prop is a primitive or a stable callback, so React.memo can
 * skip those renders.
 */
export const Calendar = memo(function Calendar({
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
  const [seconds, setSeconds] = useState<number>(selected?.getSeconds() ?? 0);

  const colorStyles =
    CALENDAR_COLOR_CLASSES[resolvedColor] ?? CALENDAR_COLOR_CLASSES.primary;

  function applyTime(h: number, m: number, s: number): void {
    const base = selected ?? new Date();
    onSelect(
      new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, m, s, 0),
    );
  }

  function handleHoursChange(h: number): void {
    setHours(h);
    applyTime(h, minutes, seconds);
  }

  function handleMinutesChange(m: number): void {
    setMinutes(m);
    applyTime(hours, m, seconds);
  }

  function handleSecondsChange(s: number): void {
    setSeconds(s);
    applyTime(hours, minutes, s);
  }

  function handleDayClick(day: number): void {
    onSelect(new Date(viewYear, viewMonth, day, hours, minutes, seconds, 0));
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
        "bg-background border border-border/70 shadow-xl select-none p-4 w-max",
        radiusClass,
      )}>
      <div className="flex flex-row">
        {/* Calendar Picker */}
        {showCalendar && (
          <div className="flex flex-col w-[264px]">
            {/* Month/Year Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/60">
              <button
                type="button"
                onClick={prevMonth}
                aria-label="Previous month"
                className={cn(
                  "p-1.5 text-foreground/70 transition-all active:scale-95",
                  "hover:text-foreground hover:bg-secondary",
                  radiusClass,
                )}>
                <ChevronLeftIcon />
              </button>
              <span className="font-semibold text-sm text-foreground tracking-wide">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                disabled={!canGoNext}
                aria-label="Next month"
                className={cn(
                  "p-1.5 text-foreground/70 transition-all",
                  !canGoNext
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:text-foreground hover:bg-secondary active:scale-95",
                  radiusClass,
                )}>
                <ChevronRightIcon />
              </button>
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {DAYS_OF_WEEK.map((d) => (
                <div
                  key={d}
                  className="text-[11px] font-bold tracking-wider text-foreground/50 uppercase py-1 mb-1">
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
                      "w-full flex items-center justify-center font-medium transition-all duration-200",
                      DATE_PICKER_CELL_SIZE_CLASS[resolvedSizeKey],
                      radiusClass,
                      isDisabled(day)
                        ? "opacity-30 cursor-not-allowed text-foreground/50"
                        : "active:scale-90",
                      !isDisabled(day) &&
                        !isSelected(day) &&
                        !isToday(day) &&
                        colorStyles.hover,
                      isSelected(day) &&
                        cn(colorStyles.bg, "font-semibold shadow-sm"),
                      isToday(day) &&
                        !isSelected(day) &&
                        cn("border", colorStyles.border, colorStyles.text),
                      !isSelected(day) && !isToday(day) && "text-foreground",
                    )}>
                    {day}
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {/* Time Picker */}
        {showTime && (
          <div
            className={cn(
              "flex items-center justify-center gap-4",
              showCalendar && "pl-5 ml-4 border-l border-border/60",
            )}>
            <TimeSpinner
              value={hours}
              max={23}
              label="HH"
              onChange={handleHoursChange}
              resolvedColor={resolvedColor}
              radiusClass={radiusClass}
            />
            <TimeSpinner
              value={minutes}
              max={59}
              label="MM"
              onChange={handleMinutesChange}
              resolvedColor={resolvedColor}
              radiusClass={radiusClass}
            />
            <TimeSpinner
              value={seconds}
              max={59}
              label="SS"
              onChange={handleSecondsChange}
              resolvedColor={resolvedColor}
              radiusClass={radiusClass}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-3">
          {isClearable && selected ? (
            <button
              type="button"
              onClick={() => {
                onSelect(null);
                onClose();
              }}
              className="text-xs font-medium text-foreground/50 hover:text-danger transition-colors active:scale-95 px-2 py-1">
              Clear
            </button>
          ) : (
            <div />
          )}

          {mode !== "date" && (
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "ml-auto text-xs font-semibold px-4 py-2 transition-all hover:opacity-90 active:scale-95 shadow-sm",
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
});
