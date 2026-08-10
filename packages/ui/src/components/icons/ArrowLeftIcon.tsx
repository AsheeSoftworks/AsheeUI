import { cn } from "@ashee/utils";
import type { IconProps } from "./types";

export function ArrowLeftIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("w-4 h-4 fill-none stroke-current", className)}
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}
