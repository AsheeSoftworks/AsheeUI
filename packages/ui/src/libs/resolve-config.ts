import { mergeObject } from "@ashee/utils";
import type { Config, ExternalConfig } from "./config";
import { defaultConfig } from "./default-config";

export function resolveConfig(externalConfig: ExternalConfig): Config {
  return mergeObject<Config>(defaultConfig, externalConfig);
}
