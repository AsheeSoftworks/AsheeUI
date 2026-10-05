/**
 * The surface, for the native package.
 *
 * Every control that opens something the reader then chooses from shows the same thing: a
 * layer that dims what is behind it, a panel with a heading, the content, and whatever
 * controls belong to it. A select opens a list, a date field opens a month, and both are one
 * surface at a time, dismissed when they are done. The web floats what it opens beside the
 * control, because a pointer can leave the field and reach it; the platform has no hover and
 * no pointer, so the surface is the platform's own answer.
 *
 * It lives here once rather than in each component for the reason the field shell does: two
 * components that drew their own would be two that drift. It is internal — it is not exported
 * from the package entry point — because a consumer composes a select or a date field, not a
 * surface.
 *
 * What it does not own is the field: the label, the description, the message and the trigger
 * around it are the family's, and the components that open the surface keep them.
 */

import type { ReactNode } from "react";
import { Modal, Pressable } from "react-native";
import { Text } from "../text/Text";
import {
  NATIVE_SURFACE_BACKDROP_CLASS,
  NATIVE_SURFACE_SHEET_CLASS,
} from "./surface-styles";

/**
 * Props for the internal surface.
 */
export interface SurfaceProps {
  /** Whether the surface is showing. */
  isOpen: boolean;

  /** Called when the surface is dismissed, however it was dismissed. */
  onClose: () => void;

  /** The surface's heading. */
  title?: string;

  /** What the surface shows. */
  children?: ReactNode;

  /** Content rendered under the content, for controls that belong to the surface. */
  footer?: ReactNode;
}

/**
 * The panel a field opens.
 *
 * @param props - Whether the surface is showing and what it holds.
 * @returns The rendered surface.
 *
 * @see PickerSheet - The list a select opens on it.
 * @see Calendar - The month a date field opens on it.
 */
export function Surface({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: SurfaceProps) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable
        accessibilityLabel="Close"
        accessibilityRole="button"
        onPress={onClose}
        className={NATIVE_SURFACE_BACKDROP_CLASS}>
        <Pressable className={NATIVE_SURFACE_SHEET_CLASS}>
          {title && <Text role="label">{title}</Text>}
          {children}
          {footer}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
