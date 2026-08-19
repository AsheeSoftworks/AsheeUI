import type { AnimationProp } from "../../../motion/types";
import type {
  FieldConfig,
  FieldSizeKey,
  InputAnimationPreset,
} from "../field/field-config";

export type PickerMode = "date" | "time" | "datetime";
export type DatePickerSizeKey = FieldSizeKey;

export interface DatePickerConfig extends FieldConfig {
  mode?: PickerMode;
  animation?: AnimationProp<InputAnimationPreset>;
}

export const defaultDatePickerConfig: DatePickerConfig = {
  size: "md",
  labelAlign: "left",
  mode: "date",
};

export const FALLBACK_DATE_PICKER_CONFIG = {
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  status: "default",
  labelAlign: "left",
  mode: "date",
} as const;
