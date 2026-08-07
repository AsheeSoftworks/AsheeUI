import type { Size } from "@ashee/config";
import { cn } from "@ashee/utils";
import type { ReactNode } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveValue } from "../../../utils/resolve-token";
import type { ParagraphConfig } from "./paragraph-config";

export interface ParagraphProps {
  size?: keyof Size;
  className?: string;
  children: ReactNode;
}

export function P({ size, className, children }: ParagraphProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.paragraph as
    | ParagraphConfig
    | undefined;
  const resolvedSize = resolveValue(size, sectionConfig?.size, "md");

  return (
    <p
      className={cn(sectionConfig?.className, className)}
      style={{
        fontSize: config.theme.typography.size[resolvedSize],
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
