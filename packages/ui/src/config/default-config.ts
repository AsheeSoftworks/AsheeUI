import { defaultColorConfig } from "../theme/color/default-color-config";
import { defaultShadowConfig } from "../theme/shadow/default-shadow-config";
import { defaultRadiusConfig } from "../theme/token/radius/default-radius-config";
import { defaultSpacingConfig } from "../theme/token/spacing/default-spacing-config";
import { defaultTypographyConfig } from "../theme/typography/default-typography-config";
import type { Config } from "./config";

export const defaultConfig: Config = {
  theme: {
    color: defaultColorConfig,
    radius: defaultRadiusConfig,
    typography: defaultTypographyConfig,
    shadow: defaultShadowConfig,
    spacing: defaultSpacingConfig,
    defaultTheme: "system",
    defaultVariant: "solid",
    defaultColor: "primary",
  },
  components: {},
};
