/**
 * Split component for AsheeUI.
 *
 * This file provides the `Split` layout primitive: two panes that stack on a
 * narrow screen and sit side by side from a chosen breakpoint, with the width
 * divided by a ratio. It is the layout a documentation page, a settings page and
 * a master-detail page share, and it exists so the breakpoint switch is written
 * once rather than in every consumer.
 */

"use client";

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { SPACE_GAP_CLASS } from "../../shared";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { FALLBACK_SPLIT_CONFIG, type SplitConfig } from "./split-config";
import {
  SPLIT_ALIGN_CLASS,
  SPLIT_BASE_CLASS,
  SPLIT_DIVIDER_CLASS,
  SPLIT_PANE_BASE_CLASS,
  SPLIT_PANE_WIDTH_CLASS,
  SPLIT_STACK_CLASS,
  SPLIT_STICKY_CLASS,
} from "./split-styles";

type BaseSplitProps = SplitConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color">;

/**
 * Props for the Split component.
 */
export interface SplitProps extends BaseSplitProps {
  /**
   * The first pane.
   * Left out when the layout has one pane only, which is what a page that grows
   * a second pane at a breakpoint starts as.
   */
  start?: ReactNode;

  /**
   * The second pane.
   * Left out when the layout has one pane only.
   */
  end?: ReactNode;

  /**
   * Element to render.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType;
}

/**
 * Two panes that stack on a narrow screen and sit side by side on a wide one.
 *
 * Split resolves its options through the standard configuration cascade, so
 * `components.split` states the application's breakpoint and ratio once. It
 * carries no width, no gutter and no background of its own: panes are as wide as
 * the layout allows, and the content inside them decides its own presentation.
 *
 * The primitive never hides a pane. Below the breakpoint the panes stack, so
 * everything stays in the document, reachable with the keyboard and read by a
 * screen reader in a sensible order.
 *
 * @param props - Split configuration options and element attributes.
 * @param props.start - The first pane.
 * @param props.end - The second pane.
 * @param props.stackAt - Breakpoint from which the panes sit side by side.
 * Defaults to "lg".
 * @param props.ratio - How the panes divide the width. Defaults to "equal".
 * @param props.gap - Space between the panes. Defaults to "lg".
 * @param props.align - Cross-axis alignment. Defaults to "stretch".
 * @param props.divider - Draw a rule between the panes. Defaults to false.
 * @param props.stickyEnd - Keep the second pane in view. Defaults to false.
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered layout.
 *
 * @example
 * ```tsx
 * <Split
 *   stackAt="xl"
 *   ratio="start"
 *   start={<Typography role="body-md">The article.</Typography>}
 *   end={<TableOfContents items={items} />}
 *   stickyEnd
 * />
 * ```
 *
 * @see Grid - The two-dimensional layout, for more than two regions.
 * @see SidebarLayout - The application shell, when a pane is navigation.
 */
export const Split = forwardRef<HTMLDivElement, SplitProps>(
  (
    {
      as,
      start,
      end,
      stackAt,
      ratio,
      gap,
      align,
      divider,
      stickyEnd,
      className,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<SplitConfig, Required<SplitConfig>>(
      { stackAt, ratio, gap, align, divider, stickyEnd },
      config.components?.split,
      FALLBACK_SPLIT_CONFIG,
    );

    const widths = SPLIT_PANE_WIDTH_CLASS[resolved.stackAt][resolved.ratio];
    const Component: ElementType = as ?? "div";

    return (
      <Component
        ref={ref}
        className={cn(
          SPLIT_BASE_CLASS,
          SPLIT_STACK_CLASS[resolved.stackAt],
          SPLIT_ALIGN_CLASS[resolved.align],
          SPACE_GAP_CLASS[resolved.gap],
          resolved.divider && SPLIT_DIVIDER_CLASS[resolved.stackAt],
          className,
        )}
        {...rest}>
        {start !== undefined && (
          <div className={cn(SPLIT_PANE_BASE_CLASS, widths.start)}>{start}</div>
        )}
        {end !== undefined && (
          <div
            className={cn(
              SPLIT_PANE_BASE_CLASS,
              widths.end,
              resolved.stickyEnd && SPLIT_STICKY_CLASS,
            )}>
            {end}
          </div>
        )}
      </Component>
    );
  },
);

Split.displayName = "Split";
