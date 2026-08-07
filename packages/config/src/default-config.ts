import type { Config } from "./config";
import { defaultColorConfig } from "./theme/color/default-color";
import { defaultShadowConfig } from "./theme/shadow/default-shadow";
import { defaultTypographyConfig } from "./theme/typography/default-typography";
import { defaultRadiusConfig } from "./token/radius/default-radius";
import { defaultSpacingConfig } from "./token/spacing/default-spacing";

export const defaultConfig: Config = {
  theme: {
    color: defaultColorConfig,
    radius: defaultRadiusConfig,
    shadow: defaultShadowConfig,
    typography: defaultTypographyConfig,
    spacing: defaultSpacingConfig,
    defaultTheme: "system",
  },
} as const;
