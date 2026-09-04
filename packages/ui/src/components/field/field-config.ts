import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";

export type FieldSizeKey = Size;
export type FieldStatus = "default" | "error" | "warning" | "success";
export type LabelAlign = "left" | "center" | "right";

export interface FieldConfig {
  size?: FieldSizeKey;
  radius?: Radius;
  variant?: Variant;
  color?: Color;
  labelAlign?: LabelAlign;
  fullWidth?: boolean;
  status?: FieldStatus;
}

export const defaultFieldConfig: FieldConfig = {
  size: "md",
  labelAlign: "left",
  fullWidth: false,
};

export const FALLBACK_FIELD_CONFIG: Required<FieldConfig> = {
  size: "md" as FieldSizeKey,
  radius: "md" as Radius,
  variant: "bordered" as Variant,
  color: "primary" as Color,
  labelAlign: "left" as LabelAlign,
  fullWidth: false,
  status: "default",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    field: FieldConfig;
  }
}

registerComponentDefaults("field", defaultFieldConfig);
