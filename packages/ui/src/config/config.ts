import type { ComponentConfigRegistry } from "../libs/registry";
import type { Radius } from "../shared/radius";
import type { Color, Variant } from "../shared/variant";
import type {
  ColorConfig,
  ExternalColorConfig,
  ThemeName,
} from "../theme/color";
import type { DeepPartial } from "../utils";

export type { DeepPartial } from "../utils";

export type ComponentsConfig = {
  [K in keyof ComponentConfigRegistry]?: DeepPartial<
    ComponentConfigRegistry[K]
  >;
};

export type Config = {
  color: ColorConfig;
  defaultTheme?: ThemeName | "system";
  defaultVariant?: Variant;
  defaultColor?: Color;
  defaultRadius?: Radius;
  components?: ComponentsConfig;
};

export type ExternalConfig = DeepPartial<Omit<Config, "color">> & {
  color?: ExternalColorConfig;
};
