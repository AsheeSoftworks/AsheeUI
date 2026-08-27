import type {
  ModalAnimationPreset,
  ModalPosition,
  ModalSizeKey,
} from "./modal-config";

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

export const MODAL_ANIMATION_CLASS: Record<ModalAnimationPreset, string> = {
  scale: "animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
  zoom: "animate-in fade-in-0 zoom-in-90 duration-200 ease-out",
  "slide-up":
    "animate-in fade-in-0 slide-in-from-bottom-6 duration-200 ease-out",
  "slide-down":
    "animate-in fade-in-0 slide-in-from-top-6 duration-200 ease-out",
  fade: "animate-in fade-in-0 duration-200 ease-out",
  drop: "animate-in fade-in-0 slide-in-from-top-10 zoom-in-95 duration-200 ease-out",
  flip: "animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
  pop: "animate-in fade-in-0 zoom-in-85 duration-200 ease-out",
  none: "",
};
