import { registerComponentDefaults } from "../../libs/registry";
import type { Size } from "../../shared/size";
import type { Color } from "../../shared/variant";

export type LinkSizeKey = Size;
export type LinkVariant = "default" | "muted" | "subtle";
export type LinkUnderline = "always" | "hover" | "never";

export interface LinkConfig {
  variant?: LinkVariant;
  color?: Color;
  size?: LinkSizeKey;
  underline?: LinkUnderline;
  isExternal?: boolean;
  className?: string;
}

export const defaultLinkConfig: LinkConfig = {
  size: "md",
  underline: "hover",
  isExternal: false,
};

export const FALLBACK_LINK_CONFIG = {
  size: "md",
  variant: "default",
  color: "primary",
  underline: "hover",
  isExternal: false,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    link: LinkConfig;
  }
}

registerComponentDefaults("link", defaultLinkConfig);
