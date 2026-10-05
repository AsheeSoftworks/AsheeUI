import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names, resolving conflicts deterministically.
 *
 * Combines `clsx` (conditional class composition) with `tailwind-merge`
 * (later conflicting utilities win), which keeps generated class
 * strings short and predictable.
 *
 * @param inputs - Class values: strings, objects, arrays, or falsy
 *   values that are ignored.
 * @returns A single space-separated class string.
 *
 * @example
 * ```ts
 * cn("px-2 p-4", isActive && "bg-primary", "rounded-md");
 * // isActive=false -> "p-4 rounded-md"; px-2 conflicts with p-4 and is dropped
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
