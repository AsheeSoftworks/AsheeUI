import type { DeepPartial } from "@asheeui/utils";
import type { ComponentConfigRegistry } from "../libs/registry";
import type { Color, Variant } from "../shared/variant";
import type {
  ColorConfig,
  ExternalColorConfig,
  ThemeName,
} from "../theme/color/color-config";
import type { ShadowConfig } from "../theme/shadow/shadow-config";
import type { RadiusConfig } from "../theme/token/radius/radius-config";
import type { SpacingConfig } from "../theme/token/spacing/spacing-config";
import type { TypographyConfig } from "../theme/typography/typography-config";
import type { ScrollbarConfig } from "../theme/scrollbar/scrollbar-config";

export type { DeepPartial } from "@asheeui/utils";

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
    scrollbar: ScrollbarConfig;
    defaultTheme?: ThemeName | "system";
    defaultVariant?: Variant;
    defaultColor?: Color;
  };
  components?: ComponentsConfig;
};

export type ExternalConfig = DeepPartial<Omit<Config, "theme">> & {
  theme?: DeepPartial<Omit<Config["theme"], "color">> & {
    color?: ExternalColorConfig;
  };
};
