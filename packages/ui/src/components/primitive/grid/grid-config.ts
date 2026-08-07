import type { Spacing } from "@ashee/config";

export interface GridConfig {
  columns?: number;
  gap?: keyof Spacing;
  className?: string;
}
