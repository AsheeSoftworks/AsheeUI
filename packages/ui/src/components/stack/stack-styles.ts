/**
 * Stack component styles for AsheeUI.
 * This file provides the static class mappings for the Stack layout primitive:
 * direction, cross-axis alignment, main-axis justification and wrapping.
 */

import type { StackAlign, StackDirection, StackJustify } from "./stack-config";

/** Flex direction classes. */
export const STACK_DIRECTION_CLASS: Record<StackDirection, string> = {
  row: "flex-row",
  column: "flex-col",
};

/** Cross-axis alignment classes. */
export const STACK_ALIGN_CLASS: Record<StackAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

/** Main-axis distribution classes. */
export const STACK_JUSTIFY_CLASS: Record<StackJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

/** Shared base classes for every stack. */
export const STACK_BASE_CLASS = "flex min-w-0";
