/**
 * The AsheeUI shared layer.
 *
 * This package holds the material both platforms agree on: the design language as
 * platform-neutral values, the component contracts an implementation satisfies, the
 * cascade every component resolves through, and the compatibility matrix that
 * states what each component means on each platform.
 *
 * It depends on nothing, because a shared layer that depends on a platform is not
 * shared. Each implementation maps what it finds here into its own technology:
 * Tailwind class names on the web, NativeWind class names and style objects on
 * native.
 */

export * from "./cascade";
export * from "./contracts";
export * from "./matrix";
export * from "./tokens";
