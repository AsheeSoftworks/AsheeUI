/**
 * Modal component for the native package.
 *
 * The component satisfies the framework's modal contract: the same widths, the same
 * positions, the same rounding, the same animation option and the same two ways of
 * dismissing as the web modal.
 *
 * What the platform forces is what a modal *is*. The web renders a dialog into the document
 * and traps focus inside it; the platform does not have a document, and has something better
 * for exactly this case: its own modal presentation, which takes the screen above everything
 * else, keeps the reader inside it, and hands the framework the platform's own way out — the
 * back gesture or button — through `onRequestClose`. That is why `closeOnEscape` here names
 * the platform's way out rather than a key, and why the surface tells the platform that what
 * is behind it should not be read (`accessibilityViewIsModal`).
 *
 * The two overrides the web offers are offered here too, in the platform's form: classes for
 * the dimmed layer and for the surface a consumer's `overlay` and `content` name.
 */

import {
  type ModalPosition,
  type ModalSizeKey,
  NATIVE_MODAL_BACKDROP_CLASS,
  NATIVE_MODAL_PANEL_CLASS,
  NATIVE_MODAL_POSITION_CLASS,
  NATIVE_MODAL_WIDTH_CLASS,
  NATIVE_RADIUS_CLASS,
  type Radius,
  resolveCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type {
  DimensionValue,
  StyleProp,
  ViewProps,
  ViewStyle,
} from "react-native";
import { Modal as PlatformModal, Pressable } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import {
  FALLBACK_NATIVE_MODAL_CONFIG,
  type NativeModalConfig,
} from "./modal-config";

/**
 * Overrides for the dimmed layer or the surface.
 *
 * The web states these as element props; the platform states them as classes, because a
 * platform view is not an element and has no attributes to override.
 */
export interface ModalPartOverride {
  /** Extra classes applied to the part. */
  className?: string;
}

/**
 * Props for the native Modal.
 */
export interface ModalProps
  extends NativeModalConfig,
    Omit<ViewProps, "children" | "style"> {
  /** Whether the modal is showing. */
  isOpen: boolean;

  /** Called when the modal should close, however it was dismissed. */
  onClose?: () => void;

  /** What the modal holds. */
  children: ReactNode;

  /** Overrides the width the size resolved to, as a number or a percentage. */
  width?: DimensionValue;

  /** Overrides the height, as a number or a percentage. */
  height?: DimensionValue;

  /** Overrides the dimmed layer. */
  overlay?: ModalPartOverride;

  /** Overrides the surface. */
  content?: ModalPartOverride;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A surface that takes the screen until the reader has dealt with it.
 *
 * @param props - The modal's options and the platform's view props.
 * @param props.isOpen - Whether the modal is showing.
 * @param props.onClose - Called when it should close.
 * @param props.children - What it holds.
 * @param props.size - How wide it is. Defaults to the configured value.
 * @param props.position - Where it sits. Defaults to the configured value.
 * @param props.radius - Corner rounding. Defaults to the configured value.
 * @param props.animated - Whether it moves when it appears. Defaults to the configured value.
 * @param props.closeOnBackdropClick - Whether pressing outside dismisses it.
 * @param props.closeOnEscape - Whether the platform's own way out dismisses it.
 * @param props.width - Overrides the width the size resolved to.
 * @param props.height - Overrides the height.
 * @param props.overlay - Overrides the dimmed layer.
 * @param props.content - Overrides the surface.
 * @param props.className - Extra classes applied last.
 * @returns The rendered modal.
 *
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={close} size="lg">
 *   <Text role="heading-sm">Delete this invoice?</Text>
 *   <Text role="body-sm">It cannot be recovered afterwards.</Text>
 * </Modal>
 * ```
 *
 * @see NativeModalConfig - The configuration type for component defaults.
 */
export function Modal({
  isOpen,
  onClose,
  children,
  size,
  position,
  radius,
  animated,
  closeOnBackdropClick,
  closeOnEscape,
  width,
  height,
  overlay,
  content,
  className,
  style,
  ...rest
}: ModalProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.modal;

  const resolvedSize = resolveCascade<ModalSizeKey>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_MODAL_CONFIG.size,
  );
  const resolvedPosition = resolveCascade<ModalPosition>(
    position,
    sectionConfig?.position,
    undefined,
    FALLBACK_NATIVE_MODAL_CONFIG.position,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_MODAL_CONFIG.radius,
  );
  const resolvedAnimated = resolveCascade<boolean>(
    animated,
    sectionConfig?.animated,
    undefined,
    FALLBACK_NATIVE_MODAL_CONFIG.animated,
  );
  const resolvedCloseOnBackdrop = resolveCascade<boolean>(
    closeOnBackdropClick,
    sectionConfig?.closeOnBackdropClick,
    undefined,
    FALLBACK_NATIVE_MODAL_CONFIG.closeOnBackdropClick,
  );
  const resolvedCloseOnEscape = resolveCascade<boolean>(
    closeOnEscape,
    sectionConfig?.closeOnEscape,
    undefined,
    FALLBACK_NATIVE_MODAL_CONFIG.closeOnEscape,
  );

  return (
    <PlatformModal
      visible={isOpen}
      transparent
      animationType={resolvedAnimated ? "fade" : "none"}
      // The platform's own way out is the back gesture or button; a modal that does not
      // close on it is asked to close by whoever asked for it.
      onRequestClose={resolvedCloseOnEscape ? onClose : () => undefined}
      {...rest}>
      <Pressable
        accessibilityLabel="Close"
        accessibilityRole="button"
        // A press on the dimmed layer dismisses the modal, unless the consumer asked for it
        // not to. The press is not announced as a control of the modal's own: the layer is
        // what a reader touches to get back to the screen behind it.
        onPress={resolvedCloseOnBackdrop ? onClose : undefined}
        className={classNames(NATIVE_MODAL_BACKDROP_CLASS, overlay?.className)}>
        <Pressable
          // The surface takes its own presses, so a press inside the modal does not reach the
          // layer behind it and dismiss it. Without this, pressing anything the modal holds
          // would close it, which is the opposite of what a modal is for.
          onPress={(event) => event.stopPropagation()}
          accessibilityViewIsModal
          className={classNames(
            NATIVE_MODAL_WIDTH_CLASS[resolvedSize],
            NATIVE_MODAL_PANEL_CLASS,
            NATIVE_MODAL_POSITION_CLASS[resolvedPosition],
            NATIVE_RADIUS_CLASS[resolvedRadius],
            content?.className,
            className,
          )}
          style={[{ width, height }, style]}>
          {children}
        </Pressable>
      </Pressable>
    </PlatformModal>
  );
}
