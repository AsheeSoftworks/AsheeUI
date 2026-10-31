/**
 * ColorSwatch for React Native.
 *
 * The same contract as the web: `color` is data painted as a background, `size` and `radius` are
 * the shared token names, and `label` decides whether the block is one image or decoration.
 */

import type { Radius, Size } from "@asheeui/core";
import type { ViewProps } from "react-native";
import { View } from "react-native";
import {
  NATIVE_COLOR_SWATCH_BASE_CLASS,
  NATIVE_COLOR_SWATCH_SIZE_CLASS,
} from "../../../styles/color-swatch";
import { NATIVE_RADIUS_CLASS } from "../../../styles/radius";
import { cn } from "../../../utils/cn";

export interface ColorSwatchProps
  extends Omit<ViewProps, "children" | "style"> {
  /** The colour value to paint. A portable hex/rgb value is expected. */
  color: string;

  /**
   * The swatch's accessible name.
   *
   * Without one the swatch is decoration and is hidden from assistive technology.
   */
  label?: string;

  /**
   * The square's density.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * The square's corner.
   *
   * @default "sm"
   */
  radius?: Radius;

  /** Platform styles, applied after the colour so a consumer can size or position it. */
  style?: ViewProps["style"];
}

/** A labelled block of one colour. */
export function ColorSwatch({
  color,
  label,
  size = "md",
  radius = "sm",
  className,
  style,
  ...rest
}: ColorSwatchProps) {
  return (
    <View
      {...rest}
      accessible={label !== undefined}
      accessibilityRole={label ? "image" : undefined}
      accessibilityLabel={label}
      className={cn(
        NATIVE_COLOR_SWATCH_BASE_CLASS,
        NATIVE_COLOR_SWATCH_SIZE_CLASS[size],
        NATIVE_RADIUS_CLASS[radius],
        className,
      )}
      style={[{ backgroundColor: color }, style]}
    />
  );
}
