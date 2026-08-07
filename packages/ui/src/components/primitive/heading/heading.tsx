import { cn } from "@ashee/utils";
import type { ReactNode } from "react";
import { useAsheeConfig } from "../../../context";
import type { HeadingConfig, HeadingLevel } from "./heading-config";

export interface HeadingProps {
  level: HeadingLevel;
  as?: HeadingLevel;
  className?: string;
  children: ReactNode;
}

export function Heading({ level, as, className, children }: HeadingProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.heading as HeadingConfig | undefined;
  const style = sectionConfig?.levels?.[level];
  const Tag = `h${as ?? level}` as keyof React.JSX.IntrinsicElements;

  return (
    <Tag
      className={cn(sectionConfig?.className, className)}
      style={
        style && {
          fontSize: style.fontSize,
          fontWeight: config.theme.typography.weight[style.fontWeight],
          lineHeight: config.theme.typography.lineHeight[style.lineHeight],
          letterSpacing: config.theme.typography.spacing[style.letterSpacing],
        }
      }>
      {children}
    </Tag>
  );
}
