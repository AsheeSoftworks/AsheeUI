/**
 * The AsheeUI core layer.
 *
 * This package holds everything the platforms agree on: the design language as
 * platform-neutral values, the component contracts an implementation satisfies,
 * the component registry that collects the defaults each implementation
 * registers, the cascade every component resolves through, the compatibility
 * matrix that states what each component means on each platform, and the
 * configuration pipeline that turns a consumer's `asheeui.config.*` export into
 * the values a component reads, and the class dictionaries each renderer maps a
 * resolved value into.
 *
 * It depends on no platform — no DOM, no React runtime, no React Native — because
 * a layer that depends on a platform is not shared: React bindings stay with the
 * renderer that owns them, and the only React reference here is a type-only
 * import in the action description, erased at build time. Each implementation
 * maps what it finds here into its own technology: Tailwind class names on the
 * web, NativeWind class names and style objects on native.
 */

export * from "./components";
export * from "./config";
export * from "./contracts";
export * from "./matrix";
export * from "./registry";
export * from "./shared";
export * from "./theme";

/**
 * The token names `./shared` restates for the components that read them
 * together.
 * `./tokens` owns these unions and `./shared` repeats them, so the barrel says
 * once which module is the source of truth instead of letting two star exports
 * collide.
 */
export type { Radius, Size, Space, Variant } from "./tokens";
export * from "./tokens";
export * from "./utils";
