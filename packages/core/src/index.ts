/**
 * The AsheeUI core layer.
 *
 * This package holds everything the platforms agree on: the design language as
 * platform-neutral values, the component contracts an implementation satisfies,
 * the component registry that collects the defaults each implementation
 * registers, the cascade every component resolves through, and the configuration
 * pipeline that turns a consumer's `asheeui.config.*` export into the values a
 * component reads.
 *
 * It holds no class string. A class string states a decision about pixels that only one renderer
 * compiles, so each renderer owns its own dictionaries (C1–C3); what is left is the vocabulary, the
 * rules and the values both platforms name.
 *
 * The compatibility matrix is not part of this entry. It is data only tooling reads — no component
 * imports it — so it is published from `@asheeui/core/dev` (C4): an application imports the contract,
 * and a tool imports the inventory.
 *
 * It depends on no platform — no DOM, no React runtime, no React Native — because
 * a layer that depends on a platform is not shared: React bindings stay with the
 * renderer that owns them, and the only React reference here is a type-only
 * import in the action description, erased at build time. Each implementation
 * maps what it finds here into its own technology: Tailwind class names on the
 * web, NativeWind class names and style objects on native.
 */

export * from "./components";
export * from "./components/data-display/avatar/avatar-styles";
export * from "./components/data-display/marquee/marquee-styles";
export * from "./components/feedback/alert/alert-styles";
export * from "./components/feedback/toast/toast-styles";
export * from "./components/forms/stepper/stepper-styles";
export * from "./config";
export * from "./contracts";
export * from "./registry";
export * from "./shared";
export * from "./theme";
/**
 * The token names `./shared` and `./tokens` both reach, exported explicitly so
 * the package states one source of truth instead of letting two star exports
 * collide.
 * `./tokens` owns these unions; `./shared` derives its radius, size and spacing
 * unions from the token maps rather than restating them.
 */
export type { Radius, Size, Space, Variant } from "./tokens";
export * from "./tokens";
export * from "./utils";
