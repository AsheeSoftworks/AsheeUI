import type { ColorConfig } from "./theme/color/color-config";
import type { ShadowConfig } from "./theme/shadow/shadow-config";
import type { TypographyConfig } from "./theme/typography/typography-config";
import type { RadiusConfig } from "./token/token";

export type Config = {
  theme: {
    color: ColorConfig;
    radius: RadiusConfig;
    typography: TypographyConfig;
    shadow: ShadowConfig;
  };
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type ExternalConfig = DeepPartial<Config>;
