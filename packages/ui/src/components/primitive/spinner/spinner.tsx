import { cn } from "@ashee/utils";
import { useAsheeConfig } from "../../../libs/context";
import type { Color } from "../../../shared/variant";
import { resolveComponentScale } from "../../../utils/resolve-token";
import { defaultSpinnerSizeScale } from "./default-spinner-config";
import type { SpinnerConfig, SpinnerSizeKey } from "./spinner-config";

const COLOR_CLASS: Record<Color, string> = {
  none: "text-background",
  default: "text-secondary",
  primary: "text-primary",
  secondary: "text-secondary",
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

export interface SpinnerProps {
  size?: SpinnerSizeKey;
  color?: Color;
  speed?: string;
  className?: string;
}

export function Spinner({ size, color, speed, className }: SpinnerProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.spinner as SpinnerConfig;

  const sizeScale = sectionConfig?.size ?? defaultSpinnerSizeScale;
  const dimension = resolveComponentScale(size, sizeScale);
  const resolvedColor = color ?? sectionConfig?.color;
  const resolvedSpeed = speed ?? sectionConfig?.speed ?? "0.75s";

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "animate-spin",
        resolvedColor && COLOR_CLASS[resolvedColor],
        sectionConfig?.className,
        className,
      )}
      style={{
        width: dimension,
        height: dimension,
        animationDuration: resolvedSpeed,
      }}
      viewBox="0 0 24 24"
      fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
