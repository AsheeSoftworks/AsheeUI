"use client";

import { cn } from "@asheeui/utils";
import { forwardRef, type ReactNode } from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Spacing } from "../../theme/token/spacing/spacing-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveSpacingKey,
} from "../../utils/resolve-token";
import { FALLBACK_GRID_CONFIG, type GridConfig } from "./grid-config";
import { GRID_COLS_CLASS, GRID_GAP_CLASS } from "./grid-styles";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  gap?: keyof Spacing;
  className?: string;
  children?: ReactNode;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ columns, gap, className, children, ...props }, ref) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.grid as GridConfig | undefined;

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedColumns = resolveCascade<number>(
      columns,
      sectionConfig?.columns,
      undefined,
      FALLBACK_GRID_CONFIG.columns,
    );

    const resolvedGapKey = resolveSpacingKey(
      gap,
      sectionConfig?.gap,
      config.theme.spacing?.default,
      FALLBACK_GRID_CONFIG.gap,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const colsClass = resolveClassKey(
      resolvedColumns,
      GRID_COLS_CLASS,
      FALLBACK_GRID_CONFIG.columns,
    );

    const gapClass = resolveClassKey(
      resolvedGapKey,
      GRID_GAP_CLASS,
      FALLBACK_GRID_CONFIG.gap,
    );

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          colsClass,
          gapClass,
          sectionConfig?.className,
          className,
        )}
        {...props}>
        {children}
      </div>
    );
  },
);

Grid.displayName = "Grid";
