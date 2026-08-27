import type {
  ColorConfig,
  ColorVariant,
  DefaultColorConfig,
  ExternalColorConfig,
  ExternalColorVariant,
  ThemeName,
} from "../theme/color";

export function resolveColorConfig(
  defaults: DefaultColorConfig,
  external?: ExternalColorConfig,
): ColorConfig {
  const result = { ...defaults } as ColorConfig;
  if (!external) return result;

  for (const key of Object.keys(external) as ThemeName[]) {
    const userValue = external[key as keyof ExternalColorConfig];
    if (!userValue) continue;

    if (key === "light" || key === "dark") {
      // known themes always fall back to their own defaults, never "extends"
      result[key] = {
        ...defaults[key],
        ...(userValue as Partial<ColorVariant>),
      };
      continue;
    }

    const { extends: baseName, ...overrides } =
      userValue as ExternalColorVariant;
    const base = defaults[baseName ?? "light"];
    (result as Record<string, ColorVariant>)[key] = {
      ...base,
      ...overrides,
    };
  }

  return result;
}
