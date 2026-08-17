import type { ColorConfig } from "../theme/color/color-config";
import type { ShadowConfig } from "../theme/shadow/shadow-config";
import type { RadiusConfig } from "../theme/token/radius/radius-config";
import type { BreakpointConfig } from "../theme/token/responsive/breakpoint-config";
import type { SpacingConfig } from "../theme/token/spacing/spacing-config";
import type { TypographyConfig } from "../theme/typography/typography-config";

export type ThemeConfig = {
  color: ColorConfig;
  radius: RadiusConfig;
  typography: TypographyConfig;
  shadow: ShadowConfig;
  spacing: SpacingConfig;
  breakpoints?: BreakpointConfig;
};
