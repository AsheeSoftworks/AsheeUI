/**
 * EmptyState component for AsheeUI.
 *
 * This file provides the `EmptyState` pattern: the presentation of a region that
 * has nothing in it, whether because it is new, because a filter matched
 * nothing, or because a request failed. The three presentations share one
 * component because they share one layout; what differs is the tone, the icon
 * and the wording, and those are props.
 */

"use client";

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import type { ActionConfig } from "../../shared";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { ActionGroup } from "../section-kit/ActionGroup";
import { SectionHeading } from "../section-kit/SectionHeading";
import {
  type EmptyStateConfig,
  FALLBACK_EMPTY_STATE_CONFIG,
} from "./empty-state-config";
import {
  EMPTY_STATE_CLASS,
  EMPTY_STATE_ICON_CLASS,
  EMPTY_STATE_ICON_SIZE_CLASS,
  EMPTY_STATE_PANEL_CLASS,
  EMPTY_STATE_SIZE_CLASS,
} from "./empty-state-styles";

type BaseEmptyStateProps = EmptyStateConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "title">;

/**
 * Props for the EmptyState component.
 */
export interface EmptyStateProps extends BaseEmptyStateProps {
  /** Icon shown above the title. */
  icon?: ReactNode;

  /** What the region is and, where useful, why it is empty. */
  title: ReactNode;

  /** What the reader can do about it. */
  description?: ReactNode;

  /** The emphasised action, for example the one that creates the first item. */
  primaryAction?: ActionConfig;

  /** The supporting action, typically a link to the documentation. */
  secondaryAction?: ActionConfig;

  /**
   * Live-region role of the state.
   * Leave it unset for a state that is part of the page's initial markup. Pass
   * `"status"` or `"alert"` for a state that replaces content after an
   * asynchronous result, so the change is announced.
   */
  role?: "status" | "alert";

  /**
   * Element to render.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType;

  /**
   * Actions that carry a React handler.
   * A configured action describes a destination rather than a callback, so an
   * action that runs one (a retry, a dismissal) is passed here and rendered in
   * the same group as the configured actions.
   */
  actions?: ReactNode;

  /** Content below the actions. */
  children?: ReactNode;
}

/**
 * A region with nothing in it.
 *
 * EmptyState covers the empty, the "no results" and the failed presentations of
 * a region. Loading is deliberately not one of them: a loading region is a
 * `Skeleton` or a `Spinner`, and pretending an in-progress region is empty would
 * tell the reader the wrong thing.
 *
 * The state carries no live-region role of its own, because a state rendered
 * with the page should not be announced as a change and a state that replaces
 * content should be. A consumer that renders the state in response to a result
 * passes `role="status"` or `role="alert"`.
 *
 * @param props - EmptyState configuration options and element attributes.
 * @param props.title - What the region is.
 * @param props.icon - Icon shown above the title.
 * @param props.description - What the reader can do about it.
 * @param props.primaryAction - The emphasised action.
 * @param props.secondaryAction - The supporting action.
 * @param props.type - Tone of the state. Defaults to "info".
 * @param props.size - Density. Defaults to "md".
 * @param props.panel - Draw the state as a panel. Defaults to false.
 * @param props.role - Live-region role, for a state that replaces content.
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered state.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<SearchIcon />}
 *   title="No campaigns match that filter"
 *   description="Try a different name, or clear the filter to see everything."
 *   primaryAction={{ label: "See all campaigns", href: "/campaigns" }}
 * />
 * ```
 *
 * A configured action describes a destination, so an action that runs a handler
 * is passed as a child instead:
 *
 * ```tsx
 * <EmptyState title="No campaigns match that filter">
 *   <Button variant="solid" onClick={clearFilters}>
 *     Clear filters
 *   </Button>
 * </EmptyState>
 * ```
 *
 * @see Skeleton - The loading presentation of the same region.
 * @see Alert - An inline message that is not a whole region.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      title,
      description,
      primaryAction,
      secondaryAction,
      type,
      size,
      panel,
      role,
      as,
      className,
      actions,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<
      EmptyStateConfig,
      Required<EmptyStateConfig>
    >(
      { type, size, panel },
      config.components?.emptystate,
      FALLBACK_EMPTY_STATE_CONFIG,
    );

    const Component: ElementType = as ?? "div";

    return (
      <Component
        ref={ref}
        role={role}
        className={cn(
          EMPTY_STATE_CLASS,
          EMPTY_STATE_SIZE_CLASS[resolved.size],
          resolved.panel && EMPTY_STATE_PANEL_CLASS,
          className,
        )}
        {...rest}>
        {icon && (
          <div
            className={cn(
              EMPTY_STATE_ICON_CLASS[resolved.type],
              EMPTY_STATE_ICON_SIZE_CLASS[resolved.size],
            )}>
            {icon}
          </div>
        )}

        <SectionHeading
          title={title}
          description={description}
          align="center"
          size="md"
        />

        <ActionGroup
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
          align="center">
          {actions}
        </ActionGroup>

        {children}
      </Component>
    );
  },
);

EmptyState.displayName = "EmptyState";
