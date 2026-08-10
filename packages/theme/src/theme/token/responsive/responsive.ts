export type BreakpointKey = "sm" | "md" | "lg" | "xl";
export const BREAKPOINT_KEYS: BreakpointKey[] = ["sm", "md", "lg", "xl"];

export interface ResponsiveValue<T> {
  base: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}
