/**
 * Stack components for AsheeUI.
 *
 * This file provides the `Stack` layout primitive and its `HStack` and `VStack`
 * presets. A stack lays its children out along one axis with a token gap, which
 * is the composition tool the framework uses wherever a group of elements needs
 * consistent spacing.
 */

"use client";

import { resolveCascade, type Space } from "@asheeui/core";
import { type ElementType, forwardRef, type HTMLAttributes } from "react";
import { useAsheeConfig } from "../../../libs/context";
import { SPACE_GAP_CLASS } from "../../../styles/portable";
import { cn } from "../../../utils/cn";
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
  as?: ElementType | undefined;

  /**
   * Space between children, from the shared spacing scale.
   * Resolved through the standard cascade: prop, then `components.stack.gap`,
   * then the framework fallback.
   *
   * @default "md"
   */
  gap?: Space | undefined;
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
export const Stack = forwardRef<HTMLDivElement, StackProps>((props, ref) => (
  <StackBase ref={ref} {...props} />
));

Stack.displayName = "Stack";

/**
 * The props of the internal stack renderer.
 *
 * The preset fields are not part of `StackProps`: they are the values `HStack`
 * and `VStack` contribute to the cascade, one tier below the component
 * configuration, so an application can override a preset's direction or
 * alignment without having to restate every usage.
 */
interface StackBaseProps extends StackProps {
  /** Direction contributed by a preset, below `components.stack.direction`. */
  presetDirection?: StackDirection | undefined;

  /** Alignment contributed by a preset, below `components.stack.align`. */
  presetAlign?: StackAlign | undefined;
}

const StackBase = forwardRef<HTMLDivElement, StackBaseProps>(
  (
    {
      as,
      direction,
      gap,
      align,
      justify,
      wrap,
      presetDirection,
      presetAlign,
      className,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const stackConfig = config.components?.stack;

    const resolvedDirection = resolveCascade<StackDirection>(
      direction,
      stackConfig?.direction,
      undefined,
      presetDirection ?? FALLBACK_STACK_CONFIG.direction,
    );

    const resolvedGap = resolveCascade<Space>(
      gap,
      stackConfig?.gap,
      undefined,
      FALLBACK_STACK_CONFIG.gap,
    );

    const resolvedAlign = resolveCascade<StackAlign>(
      align,
      stackConfig?.align,
      undefined,
      presetAlign ?? FALLBACK_STACK_CONFIG.align,
    );

    const resolvedJustify = resolveCascade<StackJustify>(
      justify,
      stackConfig?.justify,
      undefined,
      FALLBACK_STACK_CONFIG.justify,
    );

    const resolvedWrap = resolveCascade<boolean>(
      wrap,
      stackConfig?.wrap,
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

StackBase.displayName = "StackBase";

/**
 * Props for the {@link HStack} preset.
 * The shared stack options stay available, so a preset is a starting point
 * rather than a restriction.
 */
export type HStackProps = Omit<StackProps, "direction">;

/**
 * A row stack with centred items.
 *
 * `HStack` is `Stack` with a row direction and centred items, which is the
 * arrangement most toolbars, media rows and action groups want.
 *
 * The preset contributes `row` and `center` below the component configuration:
 * `components.stack.direction` and `components.stack.align` override them, and
 * an instance prop overrides both. So `components.stack` really does restyle
 * both presets, and a preset is a starting point rather than a restriction.
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
    <StackBase
      ref={ref}
      align={align}
      presetDirection="row"
      presetAlign="center"
      {...rest}
    />
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
 * `VStack` is `Stack` with a column direction and stretched items, the
 * arrangement a form, a card body or a settings panel wants. Like `HStack`, the
 * preset supplies its direction and alignment below the component
 * configuration, so `components.stack` can restyle it and an instance prop still
 * wins.
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
    <StackBase
      ref={ref}
      align={align}
      presetDirection="column"
      presetAlign="stretch"
      {...rest}
    />
  ),
);

VStack.displayName = "VStack";
