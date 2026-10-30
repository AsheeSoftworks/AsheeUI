/**
 * EmptyState component for AsheeUI.
 *
 * This file provides the `EmptyState` pattern: the presentation of a region that
 * has nothing in it, whether because it is new or because a filter matched
 * nothing. A region that could not be filled is `ErrorState`, which composes this
 * state with the failure's tone, its retry and its technical detail. The empty
 * presentations share one component because they share one layout; what differs is
 * the tone, the icon and the wording, and those are props.
 */

"use client";

import type { ActionConfig } from "@asheeui/core";
import { cn, resolveConfigCascade } from "@asheeui/core";
import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import {
  EMPTY_STATE_CLASS,
  EMPTY_STATE_ICON_CLASS,
  EMPTY_STATE_ICON_SIZE_CLASS,
  EMPTY_STATE_PANEL_CLASS,
  EMPTY_STATE_SIZE_CLASS,
} from "../../../styles/empty-state";
import { ActionGroup } from "../../layouts/section-kit/ActionGroup";
import { SectionHeading } from "../../layouts/section-kit/SectionHeading";
import {
  type EmptyStateConfig,
  type EmptyStateRole,
  FALLBACK_EMPTY_STATE_CONFIG,
} from "./empty-state-config";

type BaseEmptyStateProps = EmptyStateConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "title">;

/**
 * The heading element the state's title renders as.
 *
 * Restricted to the heading elements rather than any {@link ElementType}, for the
 * same reason `Card`'s `titleAs` is: the title is a heading, and it has to keep a
 * place in the document outline. A state in a page's first markup belongs in that
 * page's outline; a state nested under a card's `h3` needs an `h4`, not a second
 * `h2`.
 */
export type EmptyStateTitleElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * Props for the EmptyState component.
 */
export interface EmptyStateProps extends BaseEmptyStateProps {
  /** Icon shown above the title. */
  icon?: ReactNode | undefined;

  /** What the region is and, where useful, why it is empty. */
  title: ReactNode;

  /** What the reader can do about it. */
  description?: ReactNode | undefined;

  /** The emphasised action, for example the one that creates the first item. */
  primaryAction?: ActionConfig | undefined;

  /** The supporting action, typically a link to the documentation. */
  secondaryAction?: ActionConfig | undefined;

  /**
   * The heading element the title renders as.
   *
   * The title's level has to follow the outline it sits in: a state that *is* the
   * page renders an `h1`, a state inside a page section renders an `h2` (the
   * default), and a state inside a card's `h3` renders an `h4`. Only the heading
   * elements are accepted, so the title cannot lose its place in the outline.
   *
   * @default "h2"
   */
  titleAs?: EmptyStateTitleElement | undefined;

  /**
   * How the state is announced.
   *
   * It resolves instance → `components.emptystate` → `"none"`, so a product can
   * make every empty state that answers a query a `status` once. Leave it at
   * `"none"` for a state that is part of the page's initial markup: announcing
   * that would describe a change that never happened.
   *
   * @default "none"
   */
  role?: EmptyStateRole | undefined;

  /**
   * Element to render.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType | undefined;

  /**
   * Actions that carry a React handler.
   * A configured action describes a destination rather than a callback, so an
   * action that runs one (a retry, a dismissal) is passed here. It renders in the
   * same group as the configured actions, **after** them, so a state that offers a
   * destination and a handler still reads as one row of choices.
   */
  actions?: ReactNode | undefined;

  /** Content below the actions. */
  children?: ReactNode | undefined;
}

/**
 * A region with nothing in it.
 *
 * EmptyState covers the empty and the "no results" presentations of a region. A
 * region that could not be filled because something failed is `ErrorState`, which
 * composes this state with the failure's tone, a retry and the technical detail: a
 * bare `EmptyState type="error"` explains a failure without offering the way out
 * that a failed region owes its reader. Loading is deliberately not one of the
 * presentations either: a loading region is a `LoadingState`, a `Skeleton` or a
 * `Spinner`, and pretending an in-progress region is empty would tell the reader
 * the wrong thing.
 *
 * The state is silent unless it is asked to announce itself, because a state
 * rendered with the page should not be announced as a change and a state that
 * replaces content should be. The announcement resolves instance →
 * `components.emptystate` → `"none"`; a consumer that renders the state in
 * response to a result passes `role="status"` or `role="alert"`.
 *
 * @param props - EmptyState configuration options and element attributes.
 * @param props.title - What the region is.
 * @param props.titleAs - Heading element the title renders as. Defaults to "h2".
 * @param props.icon - Icon shown above the title.
 * @param props.description - What the reader can do about it.
 * @param props.primaryAction - The emphasised action.
 * @param props.secondaryAction - The supporting action.
 * @param props.type - Tone of the state. Defaults to "info".
 * @param props.size - Density. Defaults to "md".
 * @param props.panel - Draw the state as a panel. Defaults to false.
 * @param props.role - How the state announces itself. Defaults to "none".
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
 * @see ErrorState - The presentation for a region that could not be loaded.
 * @see LoadingState - The presentation for a region that has not arrived yet.
 * @see Skeleton - The placeholder form, for content whose shape is known.
 * @see Alert - An inline message that is not a whole region.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      title,
      titleAs,
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
      { type, size, panel, role },
      config.components?.emptystate,
      FALLBACK_EMPTY_STATE_CONFIG,
    );

    const Component: ElementType = as ?? "div";

    return (
      <Component
        ref={ref}
        role={resolved.role === "none" ? undefined : resolved.role}
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
          titleAs={titleAs}
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
