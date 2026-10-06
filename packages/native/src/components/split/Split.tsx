/**
 * Split component for the native package.
 *
 * The component satisfies the framework's split contract: two panes that stack on a
 * narrow screen and sit side by side on a wide one, with the width divided by a ratio,
 * a shared gap, cross-axis alignment and an optional rule between them. What differs is
 * how the platform says the breakpoint.
 *
 * The web states it as a variant prefix, because a browser has media queries. The
 * platform has no media query to imitate, so the component asks `useBreakpoint` what the
 * window has reached and decides the direction from the answer. That also means the
 * breakpoint is a decision the render pass makes rather than a style the stylesheet
 * applies, which is why the direction and the division of the width are branches here
 * and class names on the web.
 */

import {
  NATIVE_SPLIT_ALIGN_CLASS,
  NATIVE_SPLIT_BASE_CLASS,
  NATIVE_SPLIT_DIRECTION_CLASS,
  NATIVE_SPLIT_DIVIDER_ROW_CLASS,
  NATIVE_SPLIT_DIVIDER_STACKED_CLASS,
  NATIVE_SPLIT_PANE_STACKED_CLASS,
  NATIVE_SPLIT_PANE_WIDTH_CLASS,
  NATIVE_SPLIT_STICKY_CLASS,
  resolveConfigCascade,
  SPACE_GAP_CLASS,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useBreakpoint } from "../../hooks/use-breakpoint";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import {
  FALLBACK_NATIVE_SPLIT_CONFIG,
  type NativeSplitConfig,
} from "./split-config";

/**
 * Props for the native Split.
 */
export interface SplitProps
  extends NativeSplitConfig,
    Omit<ViewProps, "children" | "style"> {
  /**
   * The first pane.
   * Left out when the layout has one pane only, which is what a screen that grows a
   * second pane at a breakpoint starts as.
   */
  start?: ReactNode;

  /**
   * The second pane.
   * Left out when the layout has one pane only.
   */
  end?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Two panes that stack on a narrow screen and sit side by side on a wide one.
 *
 * Split resolves its options through the standard configuration cascade, so
 * `components.split` states the application's breakpoint and ratio once. It carries no
 * width, no gutter and no background of its own: panes are as wide as the layout allows,
 * and the content inside them decides its own presentation.
 *
 * The primitive never unmounts a pane. Below the breakpoint the panes stack, so
 * everything stays in the tree, reachable by a screen reader and read in a sensible
 * order — the same promise the web makes when it keeps both panes in the document.
 *
 * @param props - The split's options and the platform's view props.
 * @param props.start - The first pane.
 * @param props.end - The second pane.
 * @param props.stackAt - Breakpoint from which the panes sit side by side. Defaults to
 * "lg".
 * @param props.ratio - How the panes divide the width. Defaults to "equal".
 * @param props.gap - Space between the panes. Defaults to "lg".
 * @param props.align - Cross-axis alignment. Defaults to "stretch".
 * @param props.divider - Draw a rule between the panes. Defaults to false.
 * @param props.stickyEnd - Keep the second pane in view. Defaults to false. The platform
 * has no sticky positioning, so the pane is rendered in place; see
 * `NATIVE_SPLIT_STICKY_CLASS`.
 * @returns The rendered layout.
 *
 * @example
 * ```tsx
 * const { isAtLeast } = useBreakpoint();
 *
 * <Split
 *   stackAt="md"
 *   ratio="end"
 *   start={<Sidebar items={items} />}
 *   end={<Text role="body-md">The article.</Text>}
 * />
 * ```
 *
 * @see Grid - The two-dimensional layout, for more than two regions.
 */
export function Split({
  start,
  end,
  stackAt,
  ratio,
  gap,
  align,
  divider,
  stickyEnd,
  className,
  style,
  ...rest
}: SplitProps) {
  const config = useAsheeNativeConfig();
  const { isAtLeast } = useBreakpoint();

  const resolved = resolveConfigCascade<
    NativeSplitConfig,
    Required<NativeSplitConfig>
  >(
    { stackAt, ratio, gap, align, divider, stickyEnd },
    config.components.split,
    FALLBACK_NATIVE_SPLIT_CONFIG,
  );

  const sideBySide = isAtLeast(resolved.stackAt);
  const widths = NATIVE_SPLIT_PANE_WIDTH_CLASS[resolved.ratio];

  const paneClass = (pane: "start" | "end") =>
    sideBySide ? widths[pane] : NATIVE_SPLIT_PANE_STACKED_CLASS;

  // The web draws the rule with a `divide` utility that follows the flex direction; here
  // the rule belongs to the second pane and follows the direction the breakpoint chose.
  const dividerClass = resolved.divider
    ? sideBySide
      ? NATIVE_SPLIT_DIVIDER_ROW_CLASS
      : NATIVE_SPLIT_DIVIDER_STACKED_CLASS
    : undefined;

  return (
    <View
      className={classNames(
        NATIVE_SPLIT_BASE_CLASS,
        sideBySide
          ? NATIVE_SPLIT_DIRECTION_CLASS.sideBySide
          : NATIVE_SPLIT_DIRECTION_CLASS.stacked,
        NATIVE_SPLIT_ALIGN_CLASS[resolved.align],
        SPACE_GAP_CLASS[resolved.gap],
        className,
      )}
      style={style}
      {...rest}>
      {start !== undefined && (
        <View className={classNames(paneClass("start"))}>{start}</View>
      )}

      {end !== undefined && (
        <View
          className={classNames(
            paneClass("end"),
            dividerClass,
            resolved.stickyEnd && NATIVE_SPLIT_STICKY_CLASS,
          )}>
          {end}
        </View>
      )}
    </View>
  );
}
