/**
 * Centered component for AsheeUI.
 *
 * This file provides the `Centered` layout primitive: the element that places
 * its content in the middle of the space it is given. It is the counterpart of
 * `Stack` for the case where there is one thing to place rather than a list to
 * arrange, and it exists so the three flex classes a centred region needs are
 * written once instead of in every consumer.
 */

"use client";

import { type ElementType, forwardRef, type HTMLAttributes } from "react";
import { useAsheeConfig } from "../../libs/context";
import { SPACE_MIN_HEIGHT_CLASS } from "../../shared";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { Container } from "../container/Container";
import {
  type CenteredConfig,
  FALLBACK_CENTERED_CONFIG,
} from "./centered-config";
import { CENTERED_AXIS_CLASS, CENTERED_BASE_CLASS } from "./centered-styles";

type BaseCenteredProps = CenteredConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color">;

/**
 * Props for the Centered component.
 */
export interface CenteredProps extends BaseCenteredProps {
  /**
   * Element to render.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType;

  /**
   * Content to place in the middle.
   */
  children?: React.ReactNode;
}

/**
 * A block placed in the middle of the space it is given.
 *
 * Centered resolves its options through the standard configuration cascade, so
 * `components.centered` can set the axis and the reserved height once for a
 * whole application. With `contained`, the content keeps a maximum width, which
 * is what a whole-page centred region needs; without it, the block is as wide as
 * its parent and only its children are centred.
 *
 * @param props - Centered configuration options and element attributes.
 * @param props.axis - Axis to centre on. Defaults to "both".
 * @param props.minHeight - Vertical room to reserve first. Defaults to "none".
 * @param props.contained - Hold the content in a Container. Defaults to false.
 * @param props.containerSize - Maximum width when contained. Defaults to "lg".
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered block.
 *
 * @example
 * ```tsx
 * <Centered minHeight="lg" contained>
 *   <Card title="Session expired" description="Sign in again to continue." />
 * </Centered>
 * ```
 *
 * @see Container - The maximum-width column Centered can hold its content in.
 * @see Split - The two-pane layout, for content that is not a single block.
 */
export const Centered = forwardRef<HTMLDivElement, CenteredProps>(
  (
    {
      as,
      axis,
      minHeight,
      contained,
      containerSize,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<
      CenteredConfig,
      Required<CenteredConfig>
    >(
      { axis, minHeight, contained, containerSize },
      config.components?.centered,
      FALLBACK_CENTERED_CONFIG,
    );

    const Component: ElementType = as ?? "div";

    const content = (
      <Component
        ref={ref}
        className={cn(
          CENTERED_BASE_CLASS,
          CENTERED_AXIS_CLASS[resolved.axis],
          SPACE_MIN_HEIGHT_CLASS[resolved.minHeight],
          "flex-col",
          className,
        )}
        {...rest}>
        {children}
      </Component>
    );

    if (!resolved.contained) {
      return content;
    }

    return <Container size={resolved.containerSize}>{content}</Container>;
  },
);

Centered.displayName = "Centered";
