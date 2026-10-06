/**
 * Writing to the clipboard, for the native package.
 *
 * A copy is a platform capability rather than a rendering decision, so it lives beside the
 * package's other platform bindings instead of inside the control that offers it. Keeping
 * it here means the control is testable without a device, and that the answer a copy gives
 * is a value rather than a side effect nobody can observe.
 *
 * The module that performs the write is React Native's own `Clipboard`. React Native is
 * extracting it from the core and now warns when it is read, because a third-party package
 * is where it recommends applications go; the framework still reads the platform's own
 * module, since the alternative is a runtime dependency every consumer's bundle pays for
 * whether or not they copy anything. A screen that wants a specific clipboard
 * implementation keeps its own control and asks `Clipboard` for the state instead.
 */

import { Clipboard } from "react-native";

/**
 * Write text to the platform's clipboard.
 *
 * The platform reports a refused write by throwing, and that is a real answer rather than
 * a defect: the value never reached the clipboard, so the caller must not show a copied
 * state. The rejection carries the platform's own cause, which is what the control hands
 * to the consumer's `onError`.
 *
 * @param text - The text to write.
 * @returns Whether the text reached the clipboard.
 *
 * @example
 * ```ts
 * const copied = await writeToClipboard("INV-1042");
 * ```
 */
export async function writeToClipboard(text: string): Promise<boolean> {
  Clipboard.setString(text);

  return true;
}
