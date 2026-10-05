/**
 * Drawer component for the native package.
 *
 * The component satisfies the framework's drawer contract: the same sizes, the same
 * placements, the same animation option and the same two ways of dismissing as the web drawer.
 *
 * What the platform forces is the shape of the panel. A web drawer is a column at the side of
 * the page; a panel at the side of a phone has nowhere to be, so the platform presents a
 * **sheet** that comes up from an edge a thumb already reaches. A top or bottom placement is
 * already the edge a sheet comes from and is kept; a side placement resolves to the sheet,
 * which is what a platform's own drawers do. The rules are stated in the shared class
 * dictionaries rather than decided here.
 *
 * The movement is the platform's modal presentation, which slides a sheet in from the edge it
 * was told to slide in from; the framework does not animate a panel's position itself, because
 * the platform already has the gesture and the timing for it.
 */

import {
  type DrawerPlacement,
  type DrawerSize,
  NATIVE_DRAWER_BACKDROP_CLASS,
  NATIVE_DRAWER_BORDER_CLASS,
  NATIVE_DRAWER_EDGE_CLASS,
  NATIVE_DRAWER_SHEET_CLASS,
  NATIVE_DRAWER_SHEET_EDGE,
  NATIVE_DRAWER_SIZE_CLASS,
  resolveCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { Modal, Pressable } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import {
  FALLBACK_NATIVE_DRAWER_CONFIG,
  type NativeDrawerConfig,
} from "./drawer-config";

/**
 * Overrides for the dimmed layer or the sheet.
 */
export interface DrawerPartOverride {
  /** Extra classes applied to the part. */
  className?: string;
}

/**
 * Props for the native Drawer.
 */
export interface DrawerProps
  extends NativeDrawerConfig,
    Omit<ViewProps, "children" | "style"> {
  /** Whether the drawer is showing. */
  isOpen: boolean;

  /** Called when the drawer should close, however it was dismissed. */
  onClose?: () => void;

  /** What the drawer holds. */
  children: ReactNode;

  /** Overrides the dimmed layer. */
  overlay?: DrawerPartOverride;

  /** Overrides the sheet. */
  content?: DrawerPartOverride;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A panel that comes in from an edge, as a sheet the platform presents.
 *
 * @param props - The drawer's options and the platform's view props.
 * @param props.isOpen - Whether the drawer is showing.
 * @param props.onClose - Called when it should close.
 * @param props.children - What it holds.
 * @param props.size - How much of the screen it takes. Defaults to the configured value.
 * @param props.placement - The edge it comes from. Defaults to the configured value.
 * @param props.animated - Whether it moves when it appears. Defaults to the configured value.
 * @param props.closeOnOverlayClick - Whether pressing outside dismisses it.
 * @param props.closeOnEsc - Whether the platform's own way out dismisses it.
 * @param props.overlay - Overrides the dimmed layer.
 * @param props.content - Overrides the sheet.
 * @param props.className - Extra classes applied last.
 * @returns The rendered drawer.
 *
 * @example
 * ```tsx
 * <Drawer isOpen={isOpen} onClose={close} placement="bottom" size="lg">
 *   <Text role="heading-sm">Filters</Text>
 * </Drawer>
 * ```
 *
 * @see NativeDrawerConfig - The configuration type for component defaults.
 */
export function Drawer({
  isOpen,
  onClose,
  children,
  size,
  placement,
  animated,
  closeOnOverlayClick,
  closeOnEsc,
  overlay,
  content,
  className,
  style,
  ...rest
}: DrawerProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.drawer;

  const resolvedSize = resolveCascade<DrawerSize>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_DRAWER_CONFIG.size,
  );
  const resolvedPlacement = resolveCascade<DrawerPlacement>(
    placement,
    sectionConfig?.placement,
    undefined,
    FALLBACK_NATIVE_DRAWER_CONFIG.placement,
  );
  const resolvedAnimated = resolveCascade<boolean>(
    animated,
    sectionConfig?.animated,
    undefined,
    FALLBACK_NATIVE_DRAWER_CONFIG.animated,
  );
  const resolvedCloseOnOverlay = resolveCascade<boolean>(
    closeOnOverlayClick,
    sectionConfig?.closeOnOverlayClick,
    undefined,
    FALLBACK_NATIVE_DRAWER_CONFIG.closeOnOverlayClick,
  );
  const resolvedCloseOnEsc = resolveCascade<boolean>(
    closeOnEsc,
    sectionConfig?.closeOnEsc,
    undefined,
    FALLBACK_NATIVE_DRAWER_CONFIG.closeOnEsc,
  );

  const edge = NATIVE_DRAWER_SHEET_EDGE[resolvedPlacement];

  return (
    <Modal
      visible={isOpen}
      transparent
      // The platform slides its own sheet in from the edge it was given.
      animationType={resolvedAnimated ? "slide" : "none"}
      onRequestClose={resolvedCloseOnEsc ? onClose : () => undefined}
      {...rest}>
      <Pressable
        accessibilityLabel="Close"
        accessibilityRole="button"
        onPress={resolvedCloseOnOverlay ? onClose : undefined}
        className={classNames(
          NATIVE_DRAWER_BACKDROP_CLASS,
          NATIVE_DRAWER_EDGE_CLASS[edge],
          overlay?.className,
        )}>
        <Pressable
          // The sheet takes its own presses, so a press inside the drawer cannot reach the
          // layer behind it and dismiss it.
          onPress={(event) => event.stopPropagation()}
          accessibilityViewIsModal
          className={classNames(
            NATIVE_DRAWER_SHEET_CLASS,
            NATIVE_DRAWER_SIZE_CLASS[resolvedSize],
            NATIVE_DRAWER_BORDER_CLASS[edge],
            content?.className,
            className,
          )}
          style={style}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
