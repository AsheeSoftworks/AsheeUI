import type { ColorConfig, ThemeSelection } from "@ashee/theme";
import type { DeepPartial } from "@ashee/utils";

export type DensityLevel = "compact" | "comfortable" | "spacious";

export type UserSettings = {
  theme: ThemeSelection;
  fontScale: number;
  enableAnimations: boolean;
  density: DensityLevel;
  highContrast: boolean;
  customColors?: DeepPartial<ColorConfig>;
};

export type ExternalUserSettings = DeepPartial<UserSettings>;

export const defaultUserSettings: UserSettings = {
  theme: "light",
  fontScale: 1,
  enableAnimations: true,
  density: "comfortable",
  highContrast: false,
};
