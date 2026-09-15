/**
 * Centered component for the native package.
 *
 * The centred block places its content in the middle of the space it is given,
 * which is the arrangement a sign-in screen, a permission prompt and an error
 * screen all want. It is the native counterpart of the web `Centered`.
 */

import { resolveConfigCascade } from "@asheeui/shared";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useAsheeNativeConfig } from "../provider/AsheeNativeProvider";
import { classNames } from "../utils/class-names";
import {
  FALLBACK_NATIVE_CENTERED_CONFIG,
  type NativeCenteredConfig,
} from "./layout-config";
import {
  CENTERED_AXIS_CLASS,
  CENTERED_BASE_CLASS,
  CENTERED_MIN_HEIGHT_CLASS,
} from "./layout-styles";

/**
 * Props for the native Centered.
 */
export interface CenteredProps
  extends NativeCenteredConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The content to place in the middle. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A block placed in the middle of the space it is given.
 *
 * @param props - The block's options and the platform's view props.
 * @param props.axis - Axis to centre on. Defaults to the configured value.
 * @param props.minHeight - Vertical room to claim first. Defaults to the configured value.
 * @returns The rendered block.
 *
 * @example
 * ```tsx
 * <Centered minHeight="lg">
 *   <Card title="Session expired" description="Sign in again to continue." />
 * </Centered>
 * ```
 *
 * @see Container - The maximum-width column the block can hold its content in.
 */
export function Centered({
  axis,
  minHeight,
  className,
  style,
  children,
  ...rest
}: CenteredProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeCenteredConfig,
    Required<NativeCenteredConfig>
  >(
    { axis, minHeight },
    config.components.centered,
    FALLBACK_NATIVE_CENTERED_CONFIG,
  );

  return (
    <View
      className={classNames(
        CENTERED_BASE_CLASS,
        CENTERED_AXIS_CLASS[resolved.axis],
        CENTERED_MIN_HEIGHT_CLASS[resolved.minHeight],
        className,
      )}
      style={style}
      {...rest}>
      {children}
    </View>
  );
}
