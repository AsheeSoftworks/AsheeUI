import type { Config, ExternalConfig } from "./config";
import { defaultConfig } from "./default-config";
import { mergeConfig } from "./merge-config";

export function defineConfig(externalConfig: ExternalConfig) {
  return mergeConfig<Config>(defaultConfig, externalConfig);
}
