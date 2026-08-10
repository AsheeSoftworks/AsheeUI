import type { FontSizeKey, Size } from "@ashee/theme";
import { cn } from "@ashee/utils";
import type { ReactNode } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveValue } from "../../../utils/resolve-token";

export interface ParagraphProps {
  size?: keyof Size;
  className?: string;
  children: ReactNode;
}

const SIZE_CLASS: Record<FontSizeKey, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
};

export function P({ size, className, children }: ParagraphProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.paragraph;
  const resolvedSize = resolveValue(size, sectionConfig?.size, "md");

  return (
    <p
      className={cn(
        SIZE_CLASS[resolvedSize],
        sectionConfig?.className,
        className,
      )}
      style={{
        fontWeight:
          config.theme.typography.weight[sectionConfig?.weight ?? "normal"],
        lineHeight:
          config.theme.typography.lineHeight[
            sectionConfig?.lineHeight ?? "base"
          ],
      }}>
      {children}
    </p>
  );
}
