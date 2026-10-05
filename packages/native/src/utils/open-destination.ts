/**
 * Following a configured destination, for the native package.
 *
 * A configured action and a link describe a *destination* rather than a callback,
 * which is what keeps a pattern's actions serializable and its layout in charge. On
 * the web a destination is an anchor and the browser follows it. The platform has no
 * anchor, so the platform's own URL handler is what follows it.
 *
 * `Linking` reports a destination it cannot follow by rejecting, and this is not the
 * place to decide what an application does about that: the failure is reported where
 * a developer looks for one rather than turned into a crash, and rather than swallowed
 * into silence. A component that needs to know about the failure accepts a callback
 * instead of a configured destination.
 */

import { Linking } from "react-native";

/**
 * Follow a destination through the platform's own URL handler.
 *
 * @param href - The destination.
 *
 * @example
 * ```ts
 * openDestination("https://asheesoftworks.com");
 * ```
 */
export function openDestination(href: string): void {
  void Linking.openURL(href).catch((error: unknown) => {
    console.warn(`AsheeUI: could not open "${href}".`, error);
  });
}
