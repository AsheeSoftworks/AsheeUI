"use client";
import { cn } from "@asheeui/utils";
import type { ReactNode } from "react";
import { useAsheeConfig } from "../../../libs/context";
import type { Spacing } from "../../../theme/token/spacing/spacing-config";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import type { ContainerMaxWidth, ScrollbarOverride } from "./container-config";

const DEFAULT_MAX_WIDTHS: Record<ContainerMaxWidth, string> = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  full: "100%",
};

// a small helper — CSS custom properties aren't in React's CSSProperties type by default
type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

function resolveScrollbarVars(
  instance?: ScrollbarOverride,
  section?: ScrollbarOverride,
): CSSVars {
  const merged = { ...section, ...instance };
  const style: CSSVars = {};
  if (merged.thumb) style["--ashee-scrollbar-thumb"] = merged.thumb;
  if (merged.track) style["--ashee-scrollbar-track"] = merged.track;
  if (merged.width) style["--ashee-scrollbar-width"] = merged.width;
  if (merged.radius) style["--ashee-scrollbar-radius"] = merged.radius;
  return style;
}

export interface ContainerProps {
  maxWidth?: ContainerMaxWidth;
  padding?: keyof Spacing;
  margin?: keyof Spacing;
  center?: boolean;
  className?: string;
  style?: CSSVars;
  children: ReactNode;
  scrollable?: boolean;
  scrollbar?: ScrollbarOverride;
}

export function Container({
  maxWidth,
  padding,
  margin,
  center,
  className,
  children,
  style,
  scrollable,
  scrollbar,
}: ContainerProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.container;

  const resolvedKey = resolveValue(
    maxWidth,
    sectionConfig?.defaultMaxWidth,
    "lg",
  );
  const resolvedMaxWidth = (sectionConfig?.maxWidth ?? DEFAULT_MAX_WIDTHS)[
    resolvedKey
  ];
  const resolvedPadding = resolveScale(
    padding,
    sectionConfig?.padding,
    config.theme.spacing.default,
    config.theme.spacing.values,
  );
  const resolvedMargin = resolveScale(
    margin,
    sectionConfig?.margin,
    "none",
    config.theme.spacing.values,
  );
  const isCentered = resolveValue(center, sectionConfig?.center, true);

  const isScrollable = resolveValue(
    scrollable,
    sectionConfig?.scrollable,
    false,
  );
  const scrollbarVars = resolveScrollbarVars(
    scrollbar,
    sectionConfig?.scrollbar,
  );

  return (
    <div
      className={cn(
        isCentered && "mx-auto",
        isScrollable && "scrollable",
        sectionConfig?.className,
        className,
      )}
      style={{
        maxWidth: resolvedMaxWidth,
        paddingInline: resolvedPadding,
        marginBlock: resolvedMargin,
        ...scrollbarVars,
        ...style,
      }}>
      {children}
    </div>
  );
}
