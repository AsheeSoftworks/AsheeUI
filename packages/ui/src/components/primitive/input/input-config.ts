import type { FieldConfig } from "../field/field-config";
export interface InputConfig extends FieldConfig {}

export const defaultInputConfig: InputConfig = {
  size: "md",
  labelAlign: "left",
  animation: "none",
};
