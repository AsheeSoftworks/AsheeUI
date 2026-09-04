import { registerComponentDefaults } from "../../libs/registry";
import {
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
  type FieldSizeKey,
} from "../field/field-config";

export type PickerMode = "date" | "time" | "datetime";
export type DatePickerSizeKey = FieldSizeKey;

export interface DatePickerConfig extends FieldConfig {
  mode?: PickerMode;
}

export const defaultDatePickerConfig: DatePickerConfig = {
  size: "md",
  labelAlign: "left",
  mode: "date",
  variant: "bordered",
};

export const FALLBACK_DATE_PICKER_CONFIG: Required<DatePickerConfig> = {
  ...FALLBACK_FIELD_CONFIG,
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  status: "default",
  labelAlign: "left",
  mode: "date",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    datePicker: DatePickerConfig;
  }
}

registerComponentDefaults("datePicker", defaultDatePickerConfig);
