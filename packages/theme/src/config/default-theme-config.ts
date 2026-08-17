import { defaultColorConfig } from "../theme/color/default-color-config";
import { defaultShadowConfig } from "../theme/shadow/default-shadow-config";
import { defaultRadiusConfig } from "../theme/token/radius/default-radius-config";
import { defaultBreakpointConfig } from "../theme/token/responsive/default-breakpoint-config";
import { defaultSpacingConfig } from "../theme/token/spacing/default-spacing-config";
import { defaultTypographyConfig } from "../theme/typography/default-typography-config";

export const defaultThemeConfig = {
  color: defaultColorConfig,
  radius: defaultRadiusConfig,
  typography: defaultTypographyConfig,
  shadow: defaultShadowConfig,
  breakpoints: defaultBreakpointConfig,
  spacing: defaultSpacingConfig,
};
