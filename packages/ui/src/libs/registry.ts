/**
 * Component configuration registry for AsheeUI.
 * This file provides the central registry system for component-level default
 * configurations. Components can register their default props here, which can
 * then be overridden by theme-level defaults or instance-level props.
 * The registry uses a map-based approach with TypeScript type augmentation
 * to provide type safety for component-specific configurations.
 */

// biome-ignore lint/suspicious/noEmptyInterface: Required for the dynamic type insertion
export interface ComponentTypeConfigRegistry {}

/**
 * The complete registry of component configurations.
 * This type is augmented by individual component config modules
 * (see src/components/*-config.ts) to include their specific config types.
 */
export type ComponentConfigRegistry = ComponentTypeConfigRegistry;

/**
 * Internal storage for component default configurations.
 * Maps component names to their default configuration objects.
 */
const defaultsRegistry = new Map<string, unknown>();

/**
 * Registers default configuration for a component.
 * This is typically called from component config modules during initialization.
 * The registered defaults are used as fallback values when component-level
 * props are not provided.
 *
 * @param name - The component identifier (e.g., "Button", "Input").
 * @param config - The default configuration object for the component.
 *
 * @example
 * ```tsx
 * registerComponentDefaults('Button', {
 *   variant: 'solid',
 *   color: 'primary',
 *   size: 'md',
 *   radius: 'lg'
 * });
 * ```
 *
 * @see ComponentConfigRegistry - The augmented type that provides type safety.
 */
export function registerComponentDefaults<
  K extends keyof ComponentConfigRegistry,
>(name: K, config: ComponentConfigRegistry[K]) {
  defaultsRegistry.set(name as string, config);
}

/**
 * Retrieves the default configuration for a component.
 * Returns undefined if no defaults have been registered for the component.
 *
 * @param name - The component identifier (e.g., "Button", "Input").
 * @returns The default configuration object for the component, or undefined.
 *
 * @example
 * ```tsx
 * const defaults = getComponentDefaults('Button');
 * if (defaults) {
 *   // Use default values as fallbacks
 *   const variant = props.variant ?? defaults.variant;
 * }
 * ```
 */
export function getComponentDefaults<K extends keyof ComponentConfigRegistry>(
  name: K,
): ComponentConfigRegistry[K] | undefined {
  return defaultsRegistry.get(name as string) as
    | ComponentConfigRegistry[K]
    | undefined;
}

/**
 * Retrieves all registered component defaults.
 * Returns a partial registry object containing all defaults that have
 * been registered across all components.
 *
 * @returns A partial registry containing all component defaults.
 *
 * @example
 * ```tsx
 * const allDefaults = getAllComponentDefaults();
 * // Returns: { Button: { variant: 'solid', ... }, Input: { size: 'md', ... } }
 * ```
 */
export function getAllComponentDefaults(): Partial<ComponentConfigRegistry> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of defaultsRegistry.entries()) {
    result[key] = value;
  }
  return result as Partial<ComponentConfigRegistry>;
}
