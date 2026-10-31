/**
 * The built-in close control of a dismissible layer.
 *
 * A layer whose backdrop press is switched off, and whose platform way out the consumer has
 * also switched off, still needs one control that closes it: a reader who cannot aim at a
 * backdrop, or a screen that presents a transparent modal, would otherwise have no way out.
 * The web draws the same control in `OverlayCloseControl`; this is its platform counterpart,
 * with the same rule about where it sits and the same accessible name.
 */

import type { ReactNode } from "react";
import { Pressable } from "react-native";
import { Typography } from "../typography/text/Text";
import {
  NATIVE_LAYER_CLOSE_CLASS,
  NATIVE_LAYER_CLOSE_GLYPH,
} from "../../styles/layer";

/**
 * Props for the layer's close control.
 */
export interface LayerCloseControlProps {
  /** Accessible name of the control, for example "Close dialog". */
  label: string;

  /** Called when the reader activates the control. */
  onClose: () => void;

  /** Content shown in place of the framework's glyph. */
  icon?: ReactNode;
}

/**
 * Render the layer's built-in close control.
 *
 * @param props - The accessible name, the dismissal callback and an optional icon.
 * @returns The rendered control.
 */
export function LayerCloseControl({
  label,
  onClose,
  icon,
}: LayerCloseControlProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onClose}
      hitSlop={8}
      className={NATIVE_LAYER_CLOSE_CLASS}>
      {icon ?? (
        <Typography role="label" accessible={false}>
          {NATIVE_LAYER_CLOSE_GLYPH}
        </Typography>
      )}
    </Pressable>
  );
}
