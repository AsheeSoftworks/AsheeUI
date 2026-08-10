import { cn } from "@ashee/utils";
import type { IconProps } from "./types";

export function ChevronLeftIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("w-4 h-4 fill-none stroke-current", className)}
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
