import { registerComponentDefaults } from "../../libs/registry";
import type { FieldConfig } from "../field/field-config";
export interface InputConfig extends FieldConfig {}

export const defaultInputConfig: InputConfig = {
  size: "md",
  labelAlign: "left",
  variant: "bordered",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    input: InputConfig;
  }
}

registerComponentDefaults("input", defaultInputConfig);
