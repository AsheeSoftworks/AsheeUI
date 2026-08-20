import { registerComponentDefaults } from "../../libs/registry";
import type { FieldConfig } from "../field/field-config";

export interface TextAreaConfig extends FieldConfig {
  rows?: number;
}

export const defaultTextAreaConfig: TextAreaConfig = {
  size: "md",
  labelAlign: "left",
  rows: 4,
  animation: "none",
};

export const FALLBACK_TEXTAREA_CONFIG = {
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  status: "default",
  labelAlign: "left",
  rows: 4,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    textarea: TextAreaConfig;
  }
}

registerComponentDefaults("textarea", defaultTextAreaConfig);
