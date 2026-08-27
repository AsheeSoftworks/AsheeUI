export type KnownThemeName = "light" | "dark";

export interface AsheeColorRegistry {
  light: true;
  dark: true;
}

export type ThemeName = keyof AsheeColorRegistry;

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

/** Built-in colors map required by the core library */
export type DefaultColorConfig = Record<KnownThemeName, ColorVariant>;

/**
 * Full color configuration.
 * Built-in themes are strictly required. Custom augmented themes are optional
 * on default/unmerged configs, but enforced via ExternalColorConfig.
 */
export type ColorConfig = Record<KnownThemeName, ColorVariant> &
  Partial<Record<Exclude<ThemeName, KnownThemeName>, ColorVariant>>;

export type ExternalColorVariant = Partial<ColorVariant> & {
  extends?: KnownThemeName;
};

type CustomThemeName = Exclude<ThemeName, KnownThemeName>;
export type ExternalColorConfig = Partial<
  Record<KnownThemeName, Partial<ColorVariant>>
> &
  Record<CustomThemeName, ExternalColorVariant>;

export const defaultColorConfig: DefaultColorConfig = {
  light: {
    background: "#ffffff",
    foreground: "#000000",
    primary: "#2563eb",
    secondary: "#ffffff",
    border: "#d5d5d5",
    danger: "#dc2626",
    warning: "#d97706",
    success: "#16a34a",
    scrollbarThumb: "#3b82f6",
    scrollbarTrack: "transparent",
  },
  dark: {
    background: "#111111",
    foreground: "#ffffff",
    primary: "#005bc4",
    secondary: "#1a1a1a",
    border: "#2a2a2a",
    danger: "#ef4444",
    warning: "#f59e0b",
    success: "#22c55e",
    scrollbarThumb: "#1e40af",
    scrollbarTrack: "#1f293700",
  },
};
