import type { Spacing } from "@ashee/theme";
import { cn } from "@ashee/utils";
import type { ReactNode } from "react";
import { useAsheeConfig } from "../../../libs/context";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import type {
  FlexAlign,
  FlexConfig,
  FlexDirection,
  FlexJustify,
} from "./flex-config";

// Literal maps — never template-string these, Tailwind's scanner won't see them.
const DIRECTION_CLASS: Record<FlexDirection, string> = {
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
  col: "flex-col",
  "col-reverse": "flex-col-reverse",
};
const ALIGN_CLASS: Record<FlexAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};
const JUSTIFY_CLASS: Record<FlexJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export interface FlexProps {
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  gap?: keyof Spacing;
  wrap?: boolean;
  className?: string;
  children: ReactNode;
}

export function Flex({
  direction,
  align,
  justify,
  gap,
  wrap,
  className,
  children,
}: FlexProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.flex as FlexConfig | undefined;

  const resolvedDirection: FlexDirection = resolveValue(
    direction,
    sectionConfig?.direction,
    "row",
  );
  const resolvedAlign: FlexAlign = resolveValue(
    align,
    sectionConfig?.align,
    "stretch",
  );
  const resolvedJustify: FlexJustify = resolveValue(
    justify,
    sectionConfig?.justify,
    "start",
  );
  const resolvedWrap = resolveValue(wrap, sectionConfig?.wrap, false);
  const resolvedGap = resolveScale(
    gap,
    sectionConfig?.gap,
    config.theme.spacing.default,
    config.theme.spacing.values,
  );

  return (
    <div
      className={cn(
        "flex",
        DIRECTION_CLASS[resolvedDirection],
        ALIGN_CLASS[resolvedAlign],
        JUSTIFY_CLASS[resolvedJustify],
        resolvedWrap && "flex-wrap",
        sectionConfig?.className,
        className,
      )}
      style={{ gap: resolvedGap }}>
      {children}
    </div>
  );
}
