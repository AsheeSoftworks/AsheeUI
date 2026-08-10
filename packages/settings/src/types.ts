import type { ColorConfig, ThemeSelection } from "@ashee/theme";
import type { DeepPartial } from "@ashee/utils";

export type UserSettings = {
  theme: ThemeSelection;
  fontScale: number;
  enableAnimations: boolean;
  customColors?: DeepPartial<ColorConfig>;
};

export type ExternalUserSettings = DeepPartial<UserSettings>;

export const defaultUserSettings: UserSettings = {
  theme: "light",
  fontScale: 1,
  enableAnimations: true,
};
