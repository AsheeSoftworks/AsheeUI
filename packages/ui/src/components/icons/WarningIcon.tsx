import { cn } from "@ashee/utils";
import type { IconProps } from "./types";

export function WarningIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("w-4 h-4 fill-none stroke-current", className)}
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" />
    </svg>
  );
}
