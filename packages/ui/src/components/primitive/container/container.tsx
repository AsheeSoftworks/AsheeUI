import { cn } from "@ashee/utils";
import type { ReactNode } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import type { ContainerConfig, ContainerMaxWidth } from "./container-config";

const DEFAULT_MAX_WIDTHS: Record<ContainerMaxWidth, string> = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  full: "100%",
};

export interface ContainerProps {
  maxWidth?: ContainerMaxWidth;
  padding?: keyof import("@ashee/config").Spacing;
  center?: boolean;
  className?: string;
  children: ReactNode;
}

export function Container({
  maxWidth,
  padding,
  center,
  className,
  children,
}: ContainerProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.container as
    | ContainerConfig
    | undefined;

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
  const isCentered = resolveValue(center, sectionConfig?.center, true);

  return (
    <div
      className={cn(
        isCentered && "mx-auto",
        sectionConfig?.className,
        className,
      )}
      style={{ maxWidth: resolvedMaxWidth, paddingInline: resolvedPadding }}>
      {children}
    </div>
  );
}
