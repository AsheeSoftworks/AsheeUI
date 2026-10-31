/**
 * ColorSwatch for the web.
 *
 * A colour is data, not a class: the value arrives from a theme or a reader's picker, so it is
 * painted with `style.backgroundColor`, while the square's size and corner come from the same
 * token maps every other surface uses. When it carries a label it is one image to assistive
 * technology; without one it is decoration and is hidden.
 */

"use client";

import type { Radius, Size } from "@asheeui/core";
import {
  forwardRef,
  type HTMLAttributes,
} from "react";
import {
  COLOR_SWATCH_BASE_CLASS,
  COLOR_SWATCH_SIZE_CLASS,
} from "../../../styles/color-swatch";
import { RADIUS_CLASS } from "../../../styles/radius";
import { cn } from "../../../utils/cn";

export interface ColorSwatchProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  /** The colour value to paint. A portable hex/rgb value is expected. */
  color: string;

  /**
   * The swatch's accessible name.
   *
   * Without one the swatch is decoration and is hidden from assistive technology, which is what
   * a strip of colours inside a labelled card should be.
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
}

/** A labelled block of one colour. */
export const ColorSwatch = forwardRef<HTMLSpanElement, ColorSwatchProps>(
  function ColorSwatch(
    {
      color,
      label,
      size = "md",
      radius = "sm",
      className,
      style,
      ...rest
    },
    ref,
  ) {
    return (
      <span
        {...rest}
        ref={ref}
        role="img"
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={cn(
          COLOR_SWATCH_BASE_CLASS,
          COLOR_SWATCH_SIZE_CLASS[size],
          RADIUS_CLASS[radius],
          className,
        )}
        style={{ ...style, backgroundColor: color }}
      />
    );
  },
);
