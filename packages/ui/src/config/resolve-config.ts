import { mergeObject } from "@asheeui/utils";
import { getAllComponentDefaults } from "../libs/registry";
import type { Config, ExternalConfig } from "./config";
import { defaultConfig } from "./default-config";

export function resolveConfig(externalConfig: ExternalConfig): Config {
  const registeredDefaults = getAllComponentDefaults() as Config["components"];
  const configWithDefaults = mergeObject<Config>(defaultConfig, {
    components: registeredDefaults,
  });
  return mergeObject<Config>(configWithDefaults, externalConfig);
}
