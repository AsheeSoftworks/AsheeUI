export interface AsheeThemeRegistry {
  light: true;
  dark: true;
  white: true;
  black: true;
}

export type ThemeName = keyof AsheeThemeRegistry;

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
