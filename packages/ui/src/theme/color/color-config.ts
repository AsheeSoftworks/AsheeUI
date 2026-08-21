export type KnownThemeName = "light" | "dark";

export interface AsheeThemeRegistry {
  light: true;
  dark: true;
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
