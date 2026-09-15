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

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { ErrorIcon } from "../../icons/ErrorIcon";
import { useAsheeConfig } from "../../libs/context";
import type { ActionConfig } from "../../shared";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { Button } from "../button";
import { EmptyState } from "../empty-state/EmptyState";
import {
  type ErrorStateConfig,
  FALLBACK_ERROR_STATE_CONFIG,
} from "./error-state-config";
import {
  ERROR_STATE_DETAIL_BODY_CLASS,
  ERROR_STATE_DETAIL_CLASS,
  ERROR_STATE_DETAIL_SUMMARY_CLASS,
} from "./error-state-styles";

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
   * What the reader can do about it.
   */
  description?: ReactNode;

  /**
   * The technical detail, typically the message a request returned.
   * It is rendered inside a disclosure rather than in the open, because it is
   * written for a developer rather than for the reader.
   */
  detail?: ReactNode;

  /**
   * Called when the reader asks to try again.
   * Its presence is what renders the retry control.
   */
  onRetry?: () => void;

  /**
   * The emphasised action, when the way out is a destination rather than a
   * retry.
   */
  primaryAction?: ActionConfig;

  /**
   * The supporting action.
   */
  secondaryAction?: ActionConfig;

  /**
   * Icon shown above the title.
   * Defaults to the framework's error icon.
   */
  icon?: ReactNode;

  /**
   * Element to render.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType;

  /**
   * Content below the actions.
   */
  children?: ReactNode;
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
 * any configured actions, so the two arrangements agree.
 *
 * @param props - ErrorState configuration options and element attributes.
 * @param props.title - What failed.
 * @param props.description - What the reader can do about it.
 * @param props.detail - The technical message, inside a disclosure.
 * @param props.onRetry - Called when the reader asks to try again.
 * @param props.primaryAction - The emphasised action.
 * @param props.secondaryAction - The supporting action.
 * @param props.size - Density. Defaults to "md".
 * @param props.panel - Draw the state as a panel. Defaults to true.
 * @param props.role - How the state is announced. Defaults to "alert".
 * @param props.retryLabel - Wording of the retry control. Defaults to "Try
 * again".
 * @param props.detailLabel - Wording of the disclosure. Defaults to "Technical
 * details".
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
        role={resolved.role === "none" ? undefined : resolved.role}
        icon={icon ?? <ErrorIcon />}
        title={title}
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
