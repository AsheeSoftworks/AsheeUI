import type { DeepPartial } from "@asheeui/utils";
import type { ComponentConfigRegistry } from "../libs/registry";
import type { Radius } from "../shared/radius";
import type { Color, Variant } from "../shared/variant";
import type {
  ColorConfig,
  ExternalColorConfig,
  ThemeName,
} from "../theme/color";

export type { DeepPartial } from "@asheeui/utils";

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
