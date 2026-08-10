import { defaultFieldSizeScale } from "../field/default-field-size-scale";
import type { TextAreaConfig } from "./textarea-config";

export const defaultTextAreaConfig: TextAreaConfig = {
  size: defaultFieldSizeScale,
  labelAlign: "left",
  animation: "none",
  rows: 4,
};
