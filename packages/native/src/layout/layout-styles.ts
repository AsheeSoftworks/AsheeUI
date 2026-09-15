/**
 * Layout styles for the native package.
 *
 * Every entry is a complete, static NativeWind class string, because NativeWind
 * compiles the classes it can read in the source. The maps are derived from the
 * shared spacing scale, so a native layout and a web layout that say `gap="lg"`
 * mean the same rhythm.
 *
 * The primitives avoid responsive variant prefixes and resolve the breakpoint in
 * `useBreakpoint` instead. A variant prefix would depend on NativeWind's own
 * breakpoints agreeing with the framework's, and the framework states its
 * breakpoints as data, so a component reads them rather than assuming them.
 */

import type { Space } from "@asheeui/shared";
import type {
  NativeCenteredConfig,
  NativeContainerSize,
  NativeSectionConfig,
  NativeStackConfig,
} from "./layout-config";

/** Shared classes for every container. */
export const CONTAINER_BASE_CLASS = "w-full";

/** Maximum width for each container size. */
export const CONTAINER_MAX_WIDTH_CLASS: Record<NativeContainerSize, string> = {
  sm: "max-w-xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

/** The horizontal gutter a container keeps. */
export const CONTAINER_GUTTER_CLASS = "px-4";

/** Shared classes for every stack. */
export const STACK_BASE_CLASS = "flex";

/** The direction classes. */
export const STACK_DIRECTION_CLASS: Record<
  NonNullable<NativeStackConfig["direction"]>,
  string
> = {
  row: "flex-row",
  column: "flex-col",
};

/** Cross-axis alignment classes. */
export const STACK_ALIGN_CLASS: Record<
  NonNullable<NativeStackConfig["align"]>,
  string
> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

/** Main-axis distribution classes. */
export const STACK_JUSTIFY_CLASS: Record<
  NonNullable<NativeStackConfig["justify"]>,
  string
> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

/** Space between children, from the shared spacing scale. */
export const STACK_GAP_CLASS: Record<Space, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
};

/** The wrapping treatment. */
export const STACK_WRAP_CLASS = "flex-wrap";

/** Shared classes for every grid. */
export const GRID_BASE_CLASS = "flex flex-row flex-wrap justify-between";

/**
 * Width of one cell for each supported column count.
 * A percentage leaves room for the gap, because a percentage width cannot know
 * how wide the container turned out to be.
 */
export const GRID_COLUMN_CLASS: Record<number, string> = {
  1: "w-full",
  2: "w-[48%]",
  3: "w-[31%]",
  4: "w-[23%]",
};

/** Space between rows and between cells. */
export const GRID_GAP_CLASS: Record<Space, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
};

/** Shared classes for every section. */
export const SECTION_BASE_CLASS = "w-full";

/** Vertical rhythm for each spacing token. */
export const SECTION_SPACING_CLASS: Record<Space, string> = {
  none: "py-0",
  xs: "py-2",
  sm: "py-6",
  md: "py-8",
  lg: "py-12",
  xl: "py-16",
  "2xl": "py-20",
};

/** The background a section paints. */
export const SECTION_BACKGROUND_CLASS: Record<
  NonNullable<NativeSectionConfig["background"]>,
  string
> = {
  default: "bg-background",
  muted: "bg-secondary/40",
};

/** Shared classes for every centred block. */
export const CENTERED_BASE_CLASS = "flex w-full flex-col";

/** Centring classes for each axis. */
export const CENTERED_AXIS_CLASS: Record<
  NonNullable<NativeCenteredConfig["axis"]>,
  string
> = {
  both: "items-center justify-center",
  horizontal: "items-center",
  vertical: "justify-center",
};

/**
 * Minimum height for each spacing token, in density-independent pixels.
 * The scale mirrors the web scale, so the two platforms agree on what a step
 * means even though the units differ.
 */
export const CENTERED_MIN_HEIGHT_CLASS: Record<Space, string> = {
  none: "",
  xs: "min-h-[64px]",
  sm: "min-h-[96px]",
  md: "min-h-[192px]",
  lg: "min-h-[288px]",
  xl: "min-h-[384px]",
  "2xl": "min-h-screen",
};
