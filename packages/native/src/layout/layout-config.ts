/**
 * Layout configuration for the native package.
 *
 * The portable layout primitives share one configuration vocabulary because they
 * share one purpose: arranging content without a browser. Each primitive
 * registers its own defaults, so a native application configures the kit the way
 * it configures any other component, through `components.<name>`.
 */

import type { Space } from "@asheeui/shared";
import { registerNativeComponentDefaults } from "../config/registry";
import type { NativeBreakpoint } from "../hooks/use-breakpoint";

/**
 * Maximum width of a container, in the framework's own sizes.
 */
export type NativeContainerSize = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Configuration options for the native Container.
 */
export interface NativeContainerConfig {
  /** Maximum content width. Defaults to "lg". */
  size?: NativeContainerSize;

  /** Whether the container keeps a horizontal gutter. Defaults to true. */
  gutter?: boolean;
}

/**
 * Configuration options for the native Stack.
 */
export interface NativeStackConfig {
  /** The axis the children are laid out along. Defaults to "column". */
  direction?: "row" | "column";

  /** Space between children, from the shared spacing scale. Defaults to "md". */
  gap?: Space;

  /** Cross-axis alignment. Defaults to "stretch". */
  align?: "start" | "center" | "end" | "stretch";

  /** Main-axis distribution. Defaults to "start". */
  justify?: "start" | "center" | "end" | "between";

  /** Whether children wrap onto another line. Defaults to false. */
  wrap?: boolean;
}

/**
 * Configuration options for the native Grid.
 */
export interface NativeGridConfig {
  /** Columns from the smallest window. Defaults to 1. */
  columns?: number;

  /** Columns from the `md` breakpoint upwards. */
  columnsMd?: number;

  /** Columns from the `lg` breakpoint upwards. */
  columnsLg?: number;

  /** Space between cells. Defaults to "md". */
  gap?: Space;
}

/**
 * Configuration options for the native Section.
 */
export interface NativeSectionConfig {
  /** Vertical padding. Defaults to "md". */
  spacing?: Space;

  /** Background the section paints. Defaults to "default". */
  background?: "default" | "muted";
}

/**
 * Configuration options for the native Centered.
 */
export interface NativeCenteredConfig {
  /** The axis the content is centred on. Defaults to "both". */
  axis?: "both" | "horizontal" | "vertical";

  /** Vertical room the block claims before centring. Defaults to "none". */
  minHeight?: Space;
}

/** The defaults the native Container registers. */
export const defaultNativeContainerConfig: NativeContainerConfig = {
  size: "lg",
  gutter: true,
};

/** The defaults the native Stack registers. */
export const defaultNativeStackConfig: NativeStackConfig = {
  direction: "column",
  gap: "md",
  align: "stretch",
  justify: "start",
  wrap: false,
};

/** The defaults the native Grid registers. */
export const defaultNativeGridConfig: NativeGridConfig = {
  columns: 1,
  gap: "md",
};

/** The defaults the native Section registers. */
export const defaultNativeSectionConfig: NativeSectionConfig = {
  spacing: "md",
  background: "default",
};

/** The defaults the native Centered registers. */
export const defaultNativeCenteredConfig: NativeCenteredConfig = {
  axis: "both",
  minHeight: "none",
};

declare module "../config/registry" {
  interface NativeComponentConfigRegistry {
    container: NativeContainerConfig;
    stack: NativeStackConfig;
    grid: NativeGridConfig;
    section: NativeSectionConfig;
    centered: NativeCenteredConfig;
  }
}

registerNativeComponentDefaults("container", defaultNativeContainerConfig);
registerNativeComponentDefaults("stack", defaultNativeStackConfig);
registerNativeComponentDefaults("grid", defaultNativeGridConfig);
registerNativeComponentDefaults("section", defaultNativeSectionConfig);
registerNativeComponentDefaults("centered", defaultNativeCenteredConfig);

/** The values the native Container falls back to. */
export const FALLBACK_NATIVE_CONTAINER_CONFIG: Required<NativeContainerConfig> =
  {
    size: "lg",
    gutter: true,
  };

/** The values the native Stack falls back to. */
export const FALLBACK_NATIVE_STACK_CONFIG: Required<NativeStackConfig> = {
  direction: "column",
  gap: "md",
  align: "stretch",
  justify: "start",
  wrap: false,
};

/**
 * The values the native Grid falls back to.
 *
 * The two breakpoint columns are absent on purpose: a grid that never changes
 * shape only states `columns`, and `resolveGridColumns` reads an absent
 * breakpoint as "inherit the one below it".
 */
export const FALLBACK_NATIVE_GRID_CONFIG: Required<
  Pick<NativeGridConfig, "columns" | "gap">
> = {
  columns: 1,
  gap: "md",
};

/** The values the native Section falls back to. */
export const FALLBACK_NATIVE_SECTION_CONFIG: Required<NativeSectionConfig> = {
  spacing: "md",
  background: "default",
};

/** The values the native Centered falls back to. */
export const FALLBACK_NATIVE_CENTERED_CONFIG: Required<NativeCenteredConfig> = {
  axis: "both",
  minHeight: "none",
};

/**
 * Resolve how many columns a grid shows at a breakpoint.
 *
 * A count stated at a smaller breakpoint is inherited by the larger ones, which
 * is the same rule the web grid gets from the order of its class variants: a grid
 * that never changes shape only has to state `columns`. The function is pure so
 * the inheritance can be tested without a device, and so a component that
 * measures its own container can reuse it.
 *
 * @param config - The grid's options.
 * @param breakpoint - The breakpoint the layout is being resolved at.
 * @returns The column count to use.
 *
 * @example
 * ```ts
 * resolveGridColumns({ columns: 1, columnsMd: 2 }, "lg"); // 2
 * ```
 */
export function resolveGridColumns(
  config: NativeGridConfig,
  breakpoint: NativeBreakpoint,
): number {
  const base = config.columns ?? 1;

  if (breakpoint === "lg" || breakpoint === "xl") {
    return config.columnsLg ?? config.columnsMd ?? base;
  }

  if (breakpoint === "md") {
    return config.columnsMd ?? base;
  }

  return base;
}
