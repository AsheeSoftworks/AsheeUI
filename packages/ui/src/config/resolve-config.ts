import { getAllComponentDefaults } from "../libs/registry";
import { defaultColorConfig } from "../theme";
import { mergeObject } from "../utils";
import type { Config, ExternalConfig } from "./config";
import { defaultConfig } from "./default-config";
import { resolveColorConfig } from "./resolve-color";

export function resolveConfig(externalConfig: ExternalConfig): Config {
  const registeredDefaults = getAllComponentDefaults() as Config["components"];
  const configWithDefaults = mergeObject<Config>(defaultConfig, {
    components: registeredDefaults,
  });
  const merged = mergeObject<Config>(configWithDefaults, externalConfig);

  // generic mergeObject can't fall back keys it has no default for (custom themes) -
  // re-resolve color specifically so unfilled fields inherit from `light` or `dark`
  merged.color = resolveColorConfig(defaultColorConfig, externalConfig.color);

  return merged;
}
