/**
 * ErrorState component for AsheeUI.
 *
 * This file provides the `ErrorState` pattern: the presentation of a region
 * whose content could not be loaded. It composes `EmptyState` with the error
 * tone, a retry control and an optional disclosure that holds the technical
 * detail, so a reader is told what failed, what they can do about it and where
 * the detail is if they need it.
 */

"use client";

import type { ActionConfig } from "@asheeui/core";
import {
  ERROR_STATE_DETAIL_BODY_CLASS,
  ERROR_STATE_DETAIL_CLASS,
  ERROR_STATE_DETAIL_SUMMARY_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { ErrorIcon } from "../../../icons/ErrorIcon";
import { useAsheeConfig } from "../../../libs/context";
import { Button } from "../../forms/button";
import {
  EmptyState,
  type EmptyStateTitleElement,
} from "../empty-state/EmptyState";
import {
  type ErrorStateConfig,
  FALLBACK_ERROR_STATE_CONFIG,
} from "./error-state-config";

type BaseErrorStateProps = ErrorStateConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "title">;

/**
 * Props for the ErrorState component.
 */
export interface ErrorStateProps extends BaseErrorStateProps {
  /**
   * What failed, in the reader's terms.
   */
  title: ReactNode;

  /**
   * The heading element the title renders as.
   *
   * A failure that *is* the page renders an `h1`, one inside a page section
   * renders an `h2` (the default), and one inside a card's `h3` renders an `h4`.
   * Only heading elements are accepted, so the failure keeps its place in the
   * document outline.
   *
   * @default "h2"
   */
  titleAs?: EmptyStateTitleElement | undefined;

  /**
   * What the reader can do about it.
   */
  description?: ReactNode | undefined;

  /**
   * The technical detail, typically the message a request returned.
   * It is rendered inside a disclosure rather than in the open, because it is
   * written for a developer rather than for the reader.
   */
  detail?: ReactNode | undefined;

  /**
   * Called when the reader asks to try again.
   * Its presence is what renders the retry control.
   */
  onRetry?: (() => void) | undefined;

  /**
   * The emphasised action, when the way out is a destination rather than a
   * retry.
   */
  primaryAction?: ActionConfig | undefined;

  /**
   * The supporting action.
   */
  secondaryAction?: ActionConfig | undefined;

  /**
   * Icon shown above the title.
   * Defaults to the framework's error icon.
   */
  icon?: ReactNode | undefined;

  /**
   * Element to render.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType | undefined;

  /**
   * Content below the actions.
   */
  children?: ReactNode | undefined;
}

/**
 * A region whose content could not be loaded.
 *
 * The state is an `alert` by default, because it usually replaces content after
 * a request failed and therefore has to be announced. A state that is part of
 * the page from the start, such as a not-found page, passes `role="none"` so it
 * is not announced as a change that just happened.
 *
 * A retry is a React handler rather than a configured action, because a
 * configured action describes a destination. It is rendered in the same group as
 * any configured actions, and **after** them: the configured pair is the
 * consumer's own statement of where the reader can go and leads the row, while the
 * retry is the framework's recovery path for the request that failed. When no
 * configured actions are given the retry is the only control, and therefore the
 * first. The order is deliberate, and {@link EmptyStateProps.actions} states the
 * same rule for the slot it fills.
 *
 * @param props - ErrorState configuration options and element attributes.
 * @param props.title - What failed.
 * @param props.titleAs - Heading element the title renders as. Defaults to "h2".
 * @param props.description - What the reader can do about it.
 * @param props.detail - The technical message, inside a disclosure.
 * @param props.onRetry - Called when the reader asks to try again.
 * @param props.primaryAction - The emphasised action.
 * @param props.secondaryAction - The supporting action.
 * @param props.size - Density. Defaults to "md".
 * @param props.panel - Draw the state as a panel. Defaults to true.
 * @param props.role - How the state is announced. Defaults to "alert".
 * @param props.retryLabel - Wording of the retry control. Defaults to "Try
 * again". It takes a node, so the control can carry an icon.
 * @param props.detailLabel - Wording of the disclosure. Defaults to "Technical
 * details". It takes a node, as `retryLabel` does.
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered state.
 *
 * @example
 * ```tsx
 * <ErrorState
 *   title="Invoices could not be loaded"
 *   description="The request timed out. Trying again usually works."
 *   detail={error.message}
 *   onRetry={refetch}
 * />
 * ```
 *
 * @see EmptyState - The presentation for a region that has nothing in it.
 * @see LoadingState - The presentation for a region that has not arrived yet.
 */
export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      title,
      titleAs,
      description,
      detail,
      onRetry,
      primaryAction,
      secondaryAction,
      icon,
      size,
      panel,
      role,
      retryLabel,
      detailLabel,
      as,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<
      ErrorStateConfig,
      Required<ErrorStateConfig>
    >(
      { size, panel, role, retryLabel, detailLabel },
      config.components?.errorstate,
      FALLBACK_ERROR_STATE_CONFIG,
    );

    return (
      <EmptyState
        {...rest}
        ref={ref}
        as={as}
        className={className}
        type="error"
        size={resolved.size}
        panel={resolved.panel}
        // `none` is passed through rather than dropped: the empty state resolves an
        // unstated role through `components.emptystate`, and a failure that was
        // deliberately silent must stay silent whatever that configuration says.
        role={resolved.role}
        icon={icon ?? <ErrorIcon />}
        title={title}
        titleAs={titleAs}
        description={description}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
        actions={
          onRetry ? (
            <Button
              type="button"
              variant="solid"
              color="danger"
              size={resolved.size}
              onClick={onRetry}>
              {resolved.retryLabel}
            </Button>
          ) : undefined
        }>
        {detail && (
          <details className={ERROR_STATE_DETAIL_CLASS}>
            <summary className={ERROR_STATE_DETAIL_SUMMARY_CLASS}>
              {resolved.detailLabel}
            </summary>
            <div className={ERROR_STATE_DETAIL_BODY_CLASS}>{detail}</div>
          </details>
        )}
        {children}
      </EmptyState>
    );
  },
);

ErrorState.displayName = "ErrorState";
