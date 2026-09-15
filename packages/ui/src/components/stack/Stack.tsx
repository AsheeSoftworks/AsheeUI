/**
 * Stack components for AsheeUI.
 *
 * This file provides the `Stack` layout primitive and its `HStack` and `VStack`
 * presets. A stack lays its children out along one axis with a token gap, which
 * is the composition tool the framework uses wherever a group of elements needs
 * consistent spacing.
 */

"use client";

import { type ElementType, forwardRef, type HTMLAttributes } from "react";
import { useAsheeConfig } from "../../libs/context";
import { SPACE_GAP_CLASS, type Space } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade } from "../../utils/resolve-token";
import {
  FALLBACK_STACK_CONFIG,
  type StackAlign,
  type StackConfig,
  type StackDirection,
  type StackJustify,
} from "./stack-config";
import {
  STACK_ALIGN_CLASS,
  STACK_BASE_CLASS,
  STACK_DIRECTION_CLASS,
  STACK_JUSTIFY_CLASS,
} from "./stack-styles";

type BaseStackProps = StackConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color">;

/**
 * Props for the Stack component.
 */
export interface StackProps extends BaseStackProps {
  /**
   * Element to render.
   * Defaults to a `div`. A stack that is a list should render `ul` or `ol`
   * and receive `li` children.
   *
   * @default "div"
   */
  as?: ElementType;

  /**
   * Space between children, from the shared spacing scale.
   * Resolved through the standard cascade: prop, then `components.stack.gap`,
   * then the framework fallback.
   *
   * @default "md"
   */
  gap?: Space;
}

/**
 * A one-axis layout with a token gap.
 *
 * Stack resolves its own appearance through the standard configuration
 * cascade, so an application can restate the framework's default rhythm (or its
 * direction and alignment) once, in configuration, instead of repeating classes
 * on every usage.
 *
 * @param props - Stack configuration options and element attributes.
 * @param props.direction - Flex direction. Defaults to "column".
 * @param props.gap - Space between children. Defaults to "md".
 * @param props.align - Cross-axis alignment. Defaults to "stretch".
 * @param props.justify - Main-axis distribution. Defaults to "start".
 * @param props.wrap - Wrap children onto another line. Defaults to false.
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered stack.
 *
 * @example
 * ```tsx
 * <Stack gap="lg">
 *   <Typography role="heading-lg">Recent activity</Typography>
 *   <Stack direction="row" gap="sm" align="center">
 *     <Badge color="success">Paid</Badge>
 *     <Typography role="body-sm" tone="muted">Invoice 1042</Typography>
 *   </Stack>
 * </Stack>
 * ```
 *
 * @see HStack - A row stack with centred items.
 * @see VStack - A column stack with stretched items.
 * @see Grid - The two-dimensional equivalent.
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ as, direction, gap, align, justify, wrap, className, ...rest }, ref) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.stack;

    const resolvedDirection = resolveCascade<StackDirection>(
      direction,
      sectionConfig?.direction,
      undefined,
      FALLBACK_STACK_CONFIG.direction,
    );

    const resolvedGap = resolveCascade<Space>(
      gap,
      sectionConfig?.gap,
      undefined,
      FALLBACK_STACK_CONFIG.gap,
    );

    const resolvedAlign = resolveCascade<StackAlign>(
      align,
      sectionConfig?.align,
      undefined,
      FALLBACK_STACK_CONFIG.align,
    );

    const resolvedJustify = resolveCascade<StackJustify>(
      justify,
      sectionConfig?.justify,
      undefined,
      FALLBACK_STACK_CONFIG.justify,
    );

    const resolvedWrap = resolveCascade<boolean>(
      wrap,
      sectionConfig?.wrap,
      undefined,
      FALLBACK_STACK_CONFIG.wrap,
    );

    const Component: ElementType = as ?? "div";

    return (
      <Component
        ref={ref}
        className={cn(
          STACK_BASE_CLASS,
          STACK_DIRECTION_CLASS[resolvedDirection],
          STACK_ALIGN_CLASS[resolvedAlign],
          STACK_JUSTIFY_CLASS[resolvedJustify],
          SPACE_GAP_CLASS[resolvedGap],
          resolvedWrap ? "flex-wrap" : "flex-nowrap",
          className,
        )}
        {...rest}
      />
    );
  },
);

Stack.displayName = "Stack";

/**
 * Props for the {@link HStack} preset.
 * The shared stack options stay available, so a preset is a starting point
 * rather than a restriction.
 */
export type HStackProps = Omit<StackProps, "direction">;

/**
 * A row stack with centred items.
 *
 * `HStack` is `Stack` with `direction="row"` and `align="center"`, which is the
 * arrangement most toolbars, media rows and action groups want. It shares the
 * Stack component's configuration, so `components.stack` restyles both.
 *
 * @param props - The same options as {@link StackProps}, without `direction`.
 * @returns The rendered stack.
 *
 * @example
 * ```tsx
 * <HStack gap="sm">
 *   <Button size="sm">Save</Button>
 *   <Button size="sm" variant="ghost">Cancel</Button>
 * </HStack>
 * ```
 */
export const HStack = forwardRef<HTMLDivElement, HStackProps>(
  ({ align, ...rest }, ref) => (
    <Stack ref={ref} direction="row" align={align ?? "center"} {...rest} />
  ),
);

HStack.displayName = "HStack";

/**
 * Props for the {@link VStack} preset.
 */
export type VStackProps = Omit<StackProps, "direction">;

/**
 * A column stack with stretched items.
 *
 * `VStack` is `Stack` with `direction="column"` and `align="stretch"`, the
 * arrangement a form, a card body or a settings panel wants.
 *
 * @param props - The same options as {@link StackProps}, without `direction`.
 * @returns The rendered stack.
 *
 * @example
 * ```tsx
 * <VStack gap="sm">
 *   <Input label="Full name" />
 *   <Input label="Email" />
 * </VStack>
 * ```
 */
export const VStack = forwardRef<HTMLDivElement, VStackProps>(
  ({ align, ...rest }, ref) => (
    <Stack ref={ref} direction="column" align={align ?? "stretch"} {...rest} />
  ),
);

VStack.displayName = "VStack";
