import { useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { useAsheeConfig } from "../../../context";
import { defaultHeadingConfig } from "./default-heading-config";
import { flattenHeadingSizeScale } from "./flatten-heading-size-scale";
import type {
  HeadingConfig,
  HeadingLevel,
  HeadingLevelStyle,
} from "./heading-config";

export interface HeadingProps {
  level: HeadingLevel;
  as?: HeadingLevel;
  className?: string;
  children: ReactNode;
}

export function Heading({ level, as, className, children }: HeadingProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.heading;
  const levels = (sectionConfig?.levels ??
    defaultHeadingConfig.levels) as HeadingConfig["levels"];
  const style = levels?.[level] as HeadingLevelStyle | undefined;
  const Tag = `h${as ?? level}` as keyof React.JSX.IntrinsicElements;

  const responsiveVars = useMemo(
    () => flattenHeadingSizeScale(levels),
    [levels],
  );
  useResponsiveVars(
    "ashee-heading-tokens",
    responsiveVars,
    config.theme.breakpoints,
  );

  return (
    <Tag
      className={cn(sectionConfig?.className, className)}
      style={
        style && {
          fontSize: `var(--ashee-heading-h${level}-font-size)`,
          fontWeight: config.theme.typography.weight[style.fontWeight],
          lineHeight: config.theme.typography.lineHeight[style.lineHeight],
          letterSpacing:
            config.theme.typography.letterSpacing[style.letterSpacing],
        }
      }>
      {children}
    </Tag>
  );
}
