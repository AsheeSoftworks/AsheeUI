import { mergeObject } from "@ashee/utils";
import type { Config, ExternalConfig } from "./config";
import { defaultConfig } from "./default-config";

export function defineConfig(externalConfig: ExternalConfig) {
  return mergeObject<Config>(defaultConfig, externalConfig);
}
