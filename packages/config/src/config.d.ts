import type { DeepPartial } from "@ashee/utils";
import type {
  ColorConfig,
  ColorVariant,
  ThemeName,
} from "./theme/color/color-config";
import type { ShadowConfig } from "./theme/shadow/shadow-config";
import type { TypographyConfig } from "./theme/typography/typography-config";
import type { RadiusConfig } from "./token/radius/radius-config";

export type { DeepPartial } from "@ashee/utils";

type KnownThemeName = "light" | "dark" | "white" | "black";
type CustomThemeName = Exclude<ThemeName, KnownThemeName>;

// When no custom theme is registered, CustomThemeName is `never`,
// so Record<never, ColorVariant> is `{}` — no required keys, fully backward compatible.
type ExternalColorConfig = Partial<
  Record<KnownThemeName, DeepPartial<ColorVariant>>
> &
  Record<CustomThemeName, ColorVariant>;

export type Config = {
  theme: {
    color: ColorConfig;
    radius: RadiusConfig;
    typography: TypographyConfig;
    shadow: ShadowConfig;
    defaultTheme?: ThemeName | "system";
  };
};

export type ExternalConfig = DeepPartial<Omit<Config, "theme">> & {
  theme?: DeepPartial<Omit<Config["theme"], "color">> & {
    color?: ExternalColorConfig;
  };
};
