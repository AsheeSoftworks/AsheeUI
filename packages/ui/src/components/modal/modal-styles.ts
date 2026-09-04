import type { ModalPosition, ModalSizeKey } from "./modal-config";

export const MODAL_MAX_WIDTH_CLASS: Record<ModalSizeKey, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)]",
};

export const MODAL_PADDING_CLASS: Record<ModalSizeKey, string> = {
  sm: "p-5",
  md: "p-6",
  lg: "p-7",
  xl: "p-8",
  full: "p-8",
};

export const MODAL_POSITION_CLASS: Record<ModalPosition, string> = {
  center: "",
  top: "self-start mt-12",
  bottom: "self-end mb-12",
};
