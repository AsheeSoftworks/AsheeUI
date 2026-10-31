/**
 * The substitution contract: a component a consumer supplies in place of the framework's.
 *
 * Substitution is how a shared screen keeps a router. `@asheeui/web` renders an anchor and a device
 * renders a `Pressable`, and neither can be an Expo Router or React Navigation link, so the consumer
 * names its own component and the framework hands it the same props. It is the contract `Link`,
 * `Image` and `Navbar` implement on both renderers.
 *
 * `componentProps` wins over the framework's own props, because the consumer's component knows its
 * router better than the framework does.
 *
 * These two types moved here from `contracts.ts` when B19 retired that module. They are the only
 * part of it a renderer still reads — `Button` imports `LinkSubstitution` — so they keep their own
 * module rather than living only in prose.
 */

import type { ElementType } from "react";

/**
 * A component a consumer supplies in place of the one the framework would render.
 */
export interface Substitution<P = Record<string, unknown>> {
  /** The component that replaces the framework's. */
  component?: ElementType | undefined;

  /** Props for the replacement, spread last so they win. */
  componentProps?: P | undefined;
}

/**
 * A substitution for a link, with the destination a router understands.
 *
 * `to` is the name TanStack Router and React Navigation use; a framework link without a router
 * follows `href` through its platform's own mechanism, so the same call site works before and after a
 * router exists.
 */
export interface LinkSubstitution<P = Record<string, unknown>>
  extends Substitution<P> {
  /** A destination a router understands, forwarded to the substitute. */
  to?: string | undefined;
}
