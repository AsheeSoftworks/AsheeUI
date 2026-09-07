import { cn } from "../utils";
import type { IconProps } from "./types";

export function ChevronDownIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "w-4 h-4 fill-none stroke-current transition-transform duration-200",
        className,
      )}
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
