import type { Spacing } from "../../../theme/token/spacing/spacing-config";

export interface GridConfig {
  columns?: number;
  gap?: keyof Spacing;
  className?: string;
}
