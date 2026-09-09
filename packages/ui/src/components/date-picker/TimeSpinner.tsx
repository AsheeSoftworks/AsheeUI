/**
 * TimeSpinner component for AsheeUI.
 * This file provides the TimeSpinner implementation, which renders
 * a spinner control for selecting hours, minutes, or seconds in
 * the DatePicker component.
 */

import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "../../icons";
import type { Color } from "../../shared";
import { cn } from "../../utils";
import { pad2 } from "./date-picker.helpers";
import { CALENDAR_COLOR_CLASSES } from "./date-picker-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

interface TimeSpinnerProps {
  /**
   * The current value of the spinner.
   * Range is 0-23 for hours, 0-59 for minutes and seconds.
   */
  value: number;
  /**
   * The maximum value for the spinner.
   * Used for wrapping when incrementing/decrementing past the limit.
   */
  max: number;
  /**
   * Display label for the spinner.
   * Typically "HH", "MM", or "SS".
   */
  label: string;
  /**
   * Callback fired when the value changes.
   * Receives the new value.
   */
  onChange: (v: number) => void;
  /**
   * Resolved color for the spinner.
   * Used for hover states and accent colors.
   */
  resolvedColor: Color;
  /**
   * CSS class for corner rounding.
   * Applied to the increment/decrement buttons and input.
   */
  radiusClass: string;
}

/**
 * Time spinner control for selecting hours, minutes, or seconds.
 *
 * TimeSpinner renders a vertical spinner with increment and decrement
 * buttons around a display input. The value wraps around when reaching
 * the min or max limits (0 to max, and max to 0). It also allows direct
 * keyboard input with automatic validation and fallback.
 *
 * @param props - TimeSpinner configuration options.
 */
export function TimeSpinner({
  value,
  max,
  label,
  onChange,
  resolvedColor,
  radiusClass,
}: TimeSpinnerProps) {
  // Local state to handle temporary user input before validation
  const [inputValue, setInputValue] = useState(pad2(value));

  // Sync external value changes (e.g., from buttons) to the local input state
  useEffect(() => {
    setInputValue(pad2(value));
  }, [value]);

  const inc = () => onChange(value >= max ? 0 : value + 1);
  const dec = () => onChange(value <= 0 ? max : value - 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric characters
    const val = e.target.value.replace(/\D/g, "");
    setInputValue(val);
  };

  const handleValidation = () => {
    const parsed = parseInt(inputValue, 10);

    // If invalid, empty, or out of range, revert to the previous valid value
    if (Number.isNaN(parsed) || parsed < 0 || parsed > max) {
      setInputValue(pad2(value));
    } else {
      // Valid input: update external state and format local state
      onChange(parsed);
      setInputValue(pad2(parsed));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      inc();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      dec();
    }
  };

  const colorStyles =
    CALENDAR_COLOR_CLASSES[resolvedColor] ?? CALENDAR_COLOR_CLASSES.primary;

  return (
    <div className="flex flex-col items-center gap-1 group">
      <span className="text-[10px] font-medium uppercase tracking-widest text-foreground/50 select-none mb-0.5">
        {label}
      </span>

      <button
        type="button"
        className={cn(
          "w-10 h-7 flex items-center justify-center text-foreground/50 transition-all",
          "hover:text-foreground active:scale-95",
          radiusClass,
          colorStyles.hover,
        )}
        onClick={inc}
        aria-label={`Increment ${label}`}>
        <ChevronUpIcon />
      </button>

      <input
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleValidation}
        onKeyDown={handleKeyDown}
        aria-label={`${label} input`}
        className={cn(
          "w-11 h-11 text-center text-base font-mono font-medium text-foreground bg-background transition-shadow",
          "border border-border/70 hover:border-border focus:outline-none focus:ring-2 focus:border-transparent focus:z-10",
          radiusClass,
        )}
      />

      <button
        type="button"
        className={cn(
          "w-10 h-7 flex items-center justify-center text-foreground/50 transition-all",
          "hover:text-foreground active:scale-95",
          radiusClass,
          colorStyles.hover,
        )}
        onClick={dec}
        aria-label={`Decrement ${label}`}>
        <ChevronDownIcon />
      </button>
    </div>
  );
}
