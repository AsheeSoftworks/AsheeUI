import { cn } from "../utils";
import type { IconProps } from "./types";

export function ChevronUpIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("w-4 h-4 fill-none stroke-current", className)}
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}
