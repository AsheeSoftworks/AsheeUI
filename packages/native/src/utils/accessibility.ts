/**
 * Accessibility helpers that need the platform's own module.
 *
 * `AccessibilityInfo.setAccessibilityFocus` takes a native node handle, so the helper that
 * moves focus lives here rather than in core: a document has a focus model of its own, and
 * the web needs no equivalent call.
 */

import type { ComponentRef, RefObject } from "react";
import { AccessibilityInfo, findNodeHandle } from "react-native";

/** The native node a `View` ref points at. */
export type ViewRef = ComponentRef<typeof import("react-native").View>;

/**
 * Move assistive technology's focus to a view.
 *
 * This is what a screen does after an action it could not complete — a failed form submit,
 * a refused copy — so that the reader is placed at the explanation rather than left where
 * the action started. It is a request: a platform that refuses the focus simply leaves it
 * where it was.
 *
 * @param ref - The view to focus.
 *
 * @example
 * ```tsx
 * const formRef = useRef<ViewRef>(null);
 * setAccessibilityFocus(formRef);
 * ```
 */
export function setAccessibilityFocus(ref: RefObject<ViewRef | null>): void {
  const target = ref.current;
  if (!target) return;

  const handle = findNodeHandle(target);
  if (typeof handle === "number") {
    AccessibilityInfo.setAccessibilityFocus(handle);
  }
}
