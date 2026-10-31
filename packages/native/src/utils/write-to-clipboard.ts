/**
 * Writing to the clipboard, for the native package.
 *
 * A copy is a platform capability rather than a rendering decision, so it lives beside the
 * package's other platform bindings instead of inside the control that offers it. Keeping
 * it here means the control is testable without a device, and that the answer a copy gives
 * is a value rather than a side effect nobody can observe.
 *
 * **The limit is stated rather than hidden.** The platform can tell this function that its
 * module accepted the string; it cannot tell it that the operating system kept it. Verifying
 * would mean reading the clipboard back, and iOS gates a read behind a paste permission
 * prompt, so every copy would become a two-step interaction. What `true` means here is
 * therefore "the platform module accepted the string", which is the strongest answer that
 * does not ask the reader a second question (`NATIVE-IMPOSSIBLE-REPORT.md` I2-6, decision
 * D-5(c)). The two failures the platform *can* see — no module, and the module throwing —
 * are reported as `false` so the control's error path is reachable.
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
 * @param text - The text to write.
 * @returns Whether the platform module accepted the string. This is not a promise that the
 *   operating system kept it; see the module comment.
 *
 * @example
 * ```ts
 * const copied = await writeToClipboard("INV-1042");
 * ```
 */
export async function writeToClipboard(text: string): Promise<boolean> {
  const setString = (
    Clipboard as { setString?: (value: string) => void }
  ).setString;

  if (typeof setString !== "function") return false;

  try {
    setString.call(Clipboard, text);
    return true;
  } catch {
    // The module exists but refused the call. That is the one refusal the platform can
    // report, and it must reach the control's error state rather than a "Copied" label.
    return false;
  }
}
