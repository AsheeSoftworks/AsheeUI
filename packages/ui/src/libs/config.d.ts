import type {
  BreakpointConfig,
  ColorConfig,
  ColorVariant,
  RadiusConfig,
  ScrollbarConfig,
  ShadowConfig,
  SpacingConfig,
  ThemeName,
  TypographyConfig,
} from "@ashee/theme";
import type { DeepPartial } from "@ashee/utils";
import type { ComponentConfigRegistry } from "../registry";
import type { Color, Variant } from "../shared/variant";

export type { DeepPartial } from "@ashee/utils";

type KnownThemeName = "light" | "dark" | "white" | "black";
type CustomThemeName = Exclude<ThemeName, KnownThemeName>;
type ExternalColorConfig = Partial<
  Record<KnownThemeName, DeepPartial<ColorVariant>>
> &
  Record<CustomThemeName, ColorVariant>;

export type ComponentsConfig = {
  [K in keyof ComponentConfigRegistry]?: DeepPartial<
    ComponentConfigRegistry[K]
  >;
};

export type Config = {
  theme: {
    color: ColorConfig;
    radius: RadiusConfig;
    typography: TypographyConfig;
    shadow: ShadowConfig;
    spacing: SpacingConfig;
    breakpoints?: BreakpointConfig;
    defaultTheme?: ThemeName | "system";
    defaultVariant?: Variant;
    defaultColor?: Color;
    scrollbar: ScrollbarConfig;
  };
  components?: ComponentsConfig;
};

export type ExternalConfig = DeepPartial<Omit<Config, "theme">> & {
  theme?: DeepPartial<Omit<Config["theme"], "color">> & {
    color?: ExternalColorConfig;
  };
  components?: ComponentsConfig;
};
