import { cn } from "@ashee/utils";
import type { ReactNode } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";

import type { GridConfig } from "./grid-config";

export interface GridProps {
  columns?: number;
  gap?: keyof import("@ashee/config").Spacing;
  className?: string;
  children: ReactNode;
}

export function Grid({ columns, gap, className, children }: GridProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.grid as GridConfig | undefined;

  const resolvedColumns = resolveValue(columns, sectionConfig?.columns, 12);
  const resolvedGap = resolveScale(
    gap,
    sectionConfig?.gap,
    config.theme.spacing.default,
    config.theme.spacing.values,
  );

  return (
    <div
      className={cn("grid", sectionConfig?.className, className)}
      style={{
        gridTemplateColumns: `repeat(${resolvedColumns}, minmax(0, 1fr))`,
        gap: resolvedGap,
      }}>
      {children}
    </div>
  );
}
