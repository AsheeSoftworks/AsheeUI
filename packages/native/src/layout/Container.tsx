/**
 * Container component for the native package.
 *
 * The container is the portable half of the web `Container`: a maximum width, a
 * horizontal gutter and horizontal centring. It is the framework's own way of
 * saying "this content keeps a readable width on a tablet and a desktop-sized
 * window", which the platform has no equivalent of, because a native window is
 * usually the screen.
 */

import { resolveConfigCascade } from "@asheeui/shared";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useAsheeNativeConfig } from "../provider/AsheeNativeProvider";
import { classNames } from "../utils/class-names";
import {
  FALLBACK_NATIVE_CONTAINER_CONFIG,
  type NativeContainerConfig,
} from "./layout-config";
import {
  CONTAINER_BASE_CLASS,
  CONTAINER_GUTTER_CLASS,
  CONTAINER_MAX_WIDTH_CLASS,
} from "./layout-styles";

/**
 * Props for the native Container.
 */
export interface ContainerProps
  extends NativeContainerConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The content the container holds. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A centred content column with a maximum width.
 *
 * @param props - The container's options and the platform's view props.
 * @param props.size - Maximum content width. Defaults to the configured value.
 * @param props.gutter - Keep a horizontal gutter. Defaults to the configured value.
 * @returns The rendered container.
 *
 * @example
 * ```tsx
 * <Container size="sm">
 *   <Text role="body-md">A single reading column.</Text>
 * </Container>
 * ```
 *
 * @see Section - Adds vertical rhythm and a background around a container.
 */
export function Container({
  size,
  gutter,
  className,
  style,
  children,
  ...rest
}: ContainerProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeContainerConfig,
    Required<NativeContainerConfig>
  >(
    { size, gutter },
    config.components.container,
    FALLBACK_NATIVE_CONTAINER_CONFIG,
  );

  return (
    <View
      className={classNames(
        CONTAINER_BASE_CLASS,
        "self-center",
        CONTAINER_MAX_WIDTH_CLASS[resolved.size],
        resolved.gutter && CONTAINER_GUTTER_CLASS,
        className,
      )}
      style={style}
      {...rest}>
      {children}
    </View>
  );
}
