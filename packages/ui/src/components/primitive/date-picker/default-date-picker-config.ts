import type {
  DatePickerConfig,
  DatePickerSizeScale,
} from "./date-picker-config";

export const defaultDatePickerSizeScale: DatePickerSizeScale = {
  default: "md",
  values: {
    sm: {
      height: { base: "2.25rem" },
      paddingX: { base: "0.625rem" },
      fontSize: { base: "0.875rem" },
      cellSize: { base: "2rem" },
    },
    md: {
      height: { base: "2.5rem" },
      paddingX: { base: "0.75rem" },
      fontSize: { base: "1rem" },
      cellSize: { base: "2.25rem" },
    },
    lg: {
      height: { base: "2.875rem" },
      paddingX: { base: "0.875rem" },
      fontSize: { base: "1.125rem" },
      cellSize: { base: "2.5rem" },
    },
  },
};

export const defaultDatePickerConfig: DatePickerConfig = {
  size: defaultDatePickerSizeScale,
  labelAlign: "left",
  animation: "none",
};
