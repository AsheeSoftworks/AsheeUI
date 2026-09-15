/**
 * Container component for AsheeUI.
 *
 * This file provides the `Container` layout primitive: the element that holds
 * page content at a readable maximum width, with a gutter that widens with the
 * viewport. It is the first step of the framework's composition ladder, and the
 * element that `Page`, `Section` and the marketing components place their
 * content in.
 */

"use client";

import { type ElementType, forwardRef, type HTMLAttributes } from "react";
import { useAsheeConfig } from "../../libs/context";
import { cn } from "../../utils";
import { resolveCascade } from "../../utils/resolve-token";
import {
  type ContainerConfig,
  type ContainerSize,
  FALLBACK_CONTAINER_CONFIG,
} from "./container-config";
import {
  CONTAINER_BASE_CLASS,
  CONTAINER_GUTTER_CLASS,
  CONTAINER_MAX_WIDTH_CLASS,
} from "./container-styles";

type BaseContainerProps = ContainerConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color">;

/**
 * Props for the Container component.
 */
export interface ContainerProps extends BaseContainerProps {
  /**
   * Element to render.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType;

  /**
   * Maximum content width.
   * Resolved through the standard cascade: prop, then
   * `components.container.size`, then the framework fallback.
   *
   * @default "lg"
   */
  size?: ContainerSize;
}

/**
 * A centred content column with a maximum width.
 *
 * Container adds the three things a page needs from its outermost layout
 * element and nothing else: a maximum width, a responsive gutter and horizontal
 * centring. It carries no background and no vertical rhythm, so a `Section` can
 * add those without the two fighting over the same properties.
 *
 * @param props - Container configuration options and element attributes.
 * @param props.size - Maximum content width. Defaults to "lg".
 * @param props.gutter - Reserve a horizontal gutter. Defaults to true.
 * @param props.centered - Centre the content. Defaults to true.
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered container.
 *
 * @example
 * ```tsx
 * <Container size="sm">
 *   <Typography role="body-md">A single reading column.</Typography>
 * </Container>
 * ```
 *
 * @see Section - Adds vertical rhythm and a background around a container.
 * @see PageContent - The application-page equivalent.
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ as, size, gutter, centered, className, ...rest }, ref) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.container;

    const resolvedSize = resolveCascade<ContainerSize>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_CONTAINER_CONFIG.size,
    );

    const resolvedGutter = resolveCascade<boolean>(
      gutter,
      sectionConfig?.gutter,
      undefined,
      FALLBACK_CONTAINER_CONFIG.gutter,
    );

    const resolvedCentered = resolveCascade<boolean>(
      centered,
      sectionConfig?.centered,
      undefined,
      FALLBACK_CONTAINER_CONFIG.centered,
    );

    const Component: ElementType = as ?? "div";

    return (
      <Component
        ref={ref}
        className={cn(
          CONTAINER_BASE_CLASS,
          CONTAINER_MAX_WIDTH_CLASS[resolvedSize],
          resolvedCentered && "mx-auto",
          resolvedGutter && CONTAINER_GUTTER_CLASS,
          className,
        )}
        {...rest}
      />
    );
  },
);

Container.displayName = "Container";
