import { mergeObject } from "@asheeui/utils";
import type { Config, ExternalConfig } from "./config";
import { defaultConfig } from "./default-config";
import { getAllComponentDefaults } from "../libs/registry";

export function resolveConfig(externalConfig: ExternalConfig): Config {
  const registeredDefaults = getAllComponentDefaults() as Config["components"];
  const configWithDefaults = mergeObject<Config>(defaultConfig, {
    components: registeredDefaults,
  });
  return mergeObject<Config>(configWithDefaults, externalConfig);
}
