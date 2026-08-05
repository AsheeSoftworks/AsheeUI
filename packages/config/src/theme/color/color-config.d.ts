export type ThemeName = "light" | "dark" | "white" | "black";

export interface ColorVariant {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  border: string;
  danger: string;
  warning: string;
  success: string;
  scrollbarThumb: string;
  scrollbarTrack: string;
}

export type ColorConfig = Record<ThemeName, ColorVariant>;
