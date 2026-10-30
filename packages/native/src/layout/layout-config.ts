/**
 * Layout configuration for the native package.
 *
 * The portable layout primitives share one configuration vocabulary because they
 * share one purpose: arranging content without a browser. Each primitive
 * registers its own defaults, so a native application configures the kit the way
 * it configures any other component, through `components.<name>`.
 */

import type {
  Concrete,
  ContainerSize,
  SectionBackground,
  Space,
} from "@asheeui/core";
import { registerNativeComponentDefaults } from "../config/registry";

/**
 * Maximum width of a container, in the framework's own sizes.
 *
 * The sizes are the design language's, not this renderer's: a hero that caps its
 * content at `lg` is asking the same question on a tablet as in a browser, so the
 * shared vocabulary is what the two renderers name and this alias is kept so the
 * layout kit reads as one kit.
 *
 * @deprecated Use {@link ContainerSize} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeContainerSize = ContainerSize;

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

  /**
   * Background the section paints. Defaults to "none".
   *
   * The vocabulary is the shared one, so the same value means the same thing here
   * as in a browser. What the platform states is what `none` looks like: there is
   * no page behind a native screen to show through, so `none` paints the theme's
   * own background rather than nothing at all.
   */
  background?: SectionBackground;
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

/**
 * The defaults the native Container registers.
 *
 * @deprecated Use {@link defaultContainerConfig} — the name both renderers publish.
 */
export const defaultNativeContainerConfig: NativeContainerConfig = {
  size: "lg",
  gutter: true,
};

/**
 * The defaults the native Stack registers.
 *
 * @deprecated Use {@link defaultStackConfig} — the name both renderers publish.
 */
export const defaultNativeStackConfig: NativeStackConfig = {
  direction: "column",
  gap: "md",
  align: "stretch",
  justify: "start",
  wrap: false,
};

/**
 * The defaults the native Grid registers.
 *
 * @deprecated Use {@link defaultGridConfig} — the name both renderers publish.
 */
export const defaultNativeGridConfig: NativeGridConfig = {
  columns: 1,
  gap: "md",
};

/**
 * The defaults the native Section registers.
 *
 * @deprecated Use {@link defaultSectionConfig} — the name both renderers publish.
 */
export const defaultNativeSectionConfig: NativeSectionConfig = {
  spacing: "md",
  background: "none",
};

/**
 * The defaults the native Centered registers.
 *
 * @deprecated Use {@link defaultCenteredConfig} — the name both renderers publish.
 */
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

/**
 * The values the native Container falls back to.
 *
 * @deprecated Use {@link FALLBACK_CONTAINER_CONFIG} — the name both renderers publish.
 */
export const FALLBACK_NATIVE_CONTAINER_CONFIG = {
  size: "lg",
  gutter: true,
} satisfies NativeContainerConfig;

/**
 * The values the native Stack falls back to.
 *
 * @deprecated Use {@link FALLBACK_STACK_CONFIG} — the name both renderers publish.
 */
export const FALLBACK_NATIVE_STACK_CONFIG = {
  direction: "column",
  gap: "md",
  align: "stretch",
  justify: "start",
  wrap: false,
} satisfies NativeStackConfig;

/**
 * The values the native Grid falls back to.
 *
 * The two breakpoint columns are present but undefined, and that is not the same as
 * absent: `resolveConfigCascade` resolves exactly the keys a fallback declares, so a
 * key left out of this object never reaches the grid at all. Undefined is how the grid
 * states "inherit the count below me", which is the same rule the web grid gets from
 * the order of its class variants.
 *
 * @deprecated Use {@link FALLBACK_GRID_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_GRID_CONFIG: Concrete<
  Pick<NativeGridConfig, "columns" | "gap">
> &
  Pick<NativeGridConfig, "columnsMd" | "columnsLg"> = {
  columns: 1,
  gap: "md",
  columnsMd: undefined,
  columnsLg: undefined,
};

/**
 * The values the native Section falls back to.
 *
 * @deprecated Use {@link FALLBACK_SECTION_CONFIG} — the name both renderers publish.
 */
export const FALLBACK_NATIVE_SECTION_CONFIG = {
  spacing: "md",
  background: "none",
} satisfies NativeSectionConfig;

/**
 * The values the native Centered falls back to.
 *
 * @deprecated Use {@link FALLBACK_CENTERED_CONFIG} — the name both renderers publish.
 */
export const FALLBACK_NATIVE_CENTERED_CONFIG = {
  axis: "both",
  minHeight: "none",
} satisfies NativeCenteredConfig;

/**
 * How many columns a grid shows at a breakpoint.
 *
 * The rule is `@asheeui/core`'s: a count stated at a smaller breakpoint is inherited by
 * the larger ones, and a boundary written twice is two boundaries. It is re-exported here
 * so the layout kit's imports keep resolving, and so the package publishes the same name
 * the web renderer does.
 */
export { resolveGridColumns } from "@asheeui/core";
