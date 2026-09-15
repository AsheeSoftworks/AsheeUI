/**
 * Stack components for the native package.
 *
 * A stack lays its children out along one axis with a token gap, which is the
 * composition tool the framework uses wherever a group of elements needs
 * consistent spacing. `HStack` and `VStack` are presets, so the two arrangements
 * a layout wants most often are named rather than spelled out.
 *
 * The direction is a prop rather than a breakpoint variant: React Native reports
 * the window as a value, so a screen that changes direction at a width asks
 * `useBreakpoint` and passes the answer, instead of relying on a class prefix the
 * platform does not have.
 */

import { resolveConfigCascade } from "@asheeui/shared";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useAsheeNativeConfig } from "../provider/AsheeNativeProvider";
import { classNames } from "../utils/class-names";
import {
  FALLBACK_NATIVE_STACK_CONFIG,
  type NativeStackConfig,
} from "./layout-config";
import {
  STACK_ALIGN_CLASS,
  STACK_BASE_CLASS,
  STACK_DIRECTION_CLASS,
  STACK_GAP_CLASS,
  STACK_JUSTIFY_CLASS,
  STACK_WRAP_CLASS,
} from "./layout-styles";

/**
 * Props for the native Stack.
 */
export interface StackProps
  extends NativeStackConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The stack's children. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A one-axis layout with a token gap.
 *
 * @param props - The stack's options and the platform's view props.
 * @param props.direction - Flex direction. Defaults to the configured value.
 * @param props.gap - Space between children. Defaults to the configured value.
 * @param props.align - Cross-axis alignment. Defaults to the configured value.
 * @param props.justify - Main-axis distribution. Defaults to the configured value.
 * @param props.wrap - Wrap children onto another line. Defaults to the configured value.
 * @returns The rendered stack.
 *
 * @example
 * ```tsx
 * <Stack gap="lg">
 *   <Text role="heading-lg">Recent activity</Text>
 *   <Stack direction="row" gap="sm" align="center">
 *     <Badge color="success">Paid</Badge>
 *     <Text role="body-sm" tone="muted">Invoice 1042</Text>
 *   </Stack>
 * </Stack>
 * ```
 *
 * @see HStack - A row stack with centred items.
 * @see VStack - A column stack with stretched items.
 * @see Grid - The two-dimensional equivalent.
 */
export function Stack({
  direction,
  gap,
  align,
  justify,
  wrap,
  className,
  style,
  children,
  ...rest
}: StackProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeStackConfig,
    Required<NativeStackConfig>
  >(
    { direction, gap, align, justify, wrap },
    config.components.stack,
    FALLBACK_NATIVE_STACK_CONFIG,
  );

  return (
    <View
      className={classNames(
        STACK_BASE_CLASS,
        STACK_DIRECTION_CLASS[resolved.direction],
        STACK_ALIGN_CLASS[resolved.align],
        STACK_JUSTIFY_CLASS[resolved.justify],
        STACK_GAP_CLASS[resolved.gap],
        resolved.wrap && STACK_WRAP_CLASS,
        className,
      )}
      style={style}
      {...rest}>
      {children}
    </View>
  );
}

/**
 * Props for the {@link HStack} preset.
 */
export type HStackProps = Omit<StackProps, "direction">;

/**
 * A row stack with centred items.
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
export function HStack({ align, ...rest }: HStackProps) {
  return <Stack direction="row" align={align ?? "center"} {...rest} />;
}

/**
 * Props for the {@link VStack} preset.
 */
export type VStackProps = Omit<StackProps, "direction">;

/**
 * A column stack with stretched items.
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
export function VStack({ align, ...rest }: VStackProps) {
  return <Stack direction="column" align={align ?? "stretch"} {...rest} />;
}
