/**
 * Component config type registry.
 *
 * Each component config module augments ComponentTypeConfigRegistry with its
 * own keyed entry (see src/components/*-config.ts) and registers its
 * defaults via registerComponentDefaults from src/libs/registry.
 */

// biome-ignore lint/suspicious/noEmptyInterface: Reqired for the dynamic type insertion
export interface ComponentTypeConfigRegistry {}

export type ComponentConfigRegistry = ComponentTypeConfigRegistry;

const defaultsRegistry = new Map<string, unknown>();

export function registerComponentDefaults<
  K extends keyof ComponentConfigRegistry,
>(name: K, config: ComponentConfigRegistry[K]) {
  defaultsRegistry.set(name as string, config);
}

export function getComponentDefaults<K extends keyof ComponentConfigRegistry>(
  name: K,
): ComponentConfigRegistry[K] | undefined {
  return defaultsRegistry.get(name as string) as
    | ComponentConfigRegistry[K]
    | undefined;
}

export function getAllComponentDefaults(): Partial<ComponentConfigRegistry> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of defaultsRegistry.entries()) {
    result[key] = value;
  }
  return result as Partial<ComponentConfigRegistry>;
}
