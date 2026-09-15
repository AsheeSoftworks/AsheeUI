/**
 * LoadingState component for AsheeUI.
 *
 * This file provides the `LoadingState` pattern: the presentation of a region
 * whose content has not arrived yet. It composes the framework's `Spinner` and
 * `Typography`, and it is deliberately not an `EmptyState` with a spinner in it:
 * a region that is loading is not empty, and telling a reader that it is would
 * be telling them the wrong thing.
 */

"use client";

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { SPACE_MIN_HEIGHT_CLASS } from "../../shared";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { Spinner } from "../spinner/spinner";
import { Typography } from "../typography/Typography";
import {
  FALLBACK_LOADING_STATE_CONFIG,
  type LoadingStateConfig,
} from "./loading-state-config";
import {
  LOADING_STATE_CLASS,
  LOADING_STATE_PANEL_CLASS,
  LOADING_STATE_SIZE_CLASS,
} from "./loading-state-styles";

type BaseLoadingStateProps = LoadingStateConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color">;

/**
 * Props for the LoadingState component.
 */
export interface LoadingStateProps extends BaseLoadingStateProps {
  /**
   * Supporting sentence under the label, for example what is being fetched.
   */
  description?: ReactNode;

  /**
   * Element that replaces the framework's spinner, for a progress bar or a
   * consumer's own indicator.
   */
  indicator?: ReactNode;

  /**
   * Element to render.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType;

  /**
   * Content below the label, for example a cancel control.
   */
  children?: ReactNode;
}

/**
 * A region whose content has not arrived yet.
 *
 * The state is a `status` region, so assistive technology is told that something
 * is in progress rather than being left with a silent gap. It claims room by
 * default, so the page does not jump when the content arrives, and it says what
 * is loading rather than only that something is.
 *
 * @param props - LoadingState configuration options and element attributes.
 * @param props.label - Text shown and announced. Defaults to "Loading".
 * @param props.description - Supporting sentence.
 * @param props.indicator - Element that replaces the framework's spinner.
 * @param props.size - Density of the indicator and the padding. Defaults to "md".
 * @param props.panel - Draw the state as a panel. Defaults to false.
 * @param props.minHeight - Room the state claims. Defaults to "sm".
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered state.
 *
 * @example
 * ```tsx
 * <LoadingState label="Loading invoices" description="This usually takes a moment." />
 * ```
 *
 * @see Skeleton - The placeholder form, for content whose shape is known.
 * @see EmptyState - The presentation for a region that has nothing in it.
 */
export const LoadingState = forwardRef<HTMLDivElement, LoadingStateProps>(
  (
    {
      as,
      label,
      description,
      indicator,
      size,
      panel,
      minHeight,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<
      LoadingStateConfig,
      Required<LoadingStateConfig>
    >(
      { label, size, panel, minHeight },
      config.components?.loadingstate,
      FALLBACK_LOADING_STATE_CONFIG,
    );

    const Component: ElementType = as ?? "div";

    return (
      <Component
        ref={ref}
        role="status"
        className={cn(
          LOADING_STATE_CLASS,
          LOADING_STATE_SIZE_CLASS[resolved.size],
          SPACE_MIN_HEIGHT_CLASS[resolved.minHeight],
          resolved.panel && LOADING_STATE_PANEL_CLASS,
          className,
        )}
        {...rest}>
        {indicator ?? <Spinner size={resolved.size} />}
        <Typography role="body-sm" tone="muted">
          {resolved.label}
        </Typography>
        {description && (
          <Typography role="caption" tone="muted">
            {description}
          </Typography>
        )}
        {children}
      </Component>
    );
  },
);

LoadingState.displayName = "LoadingState";
