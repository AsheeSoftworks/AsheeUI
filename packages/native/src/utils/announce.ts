/**
 * The platform's announcer.
 *
 * Core's `announce` is a message and a level; who speaks it is the platform's. This module
 * installs the platform's answer — `AccessibilityInfo.announceForAccessibility` — and
 * re-exports the call, so a component that announces imports this module and the host is
 * installed whether or not the package entry has been evaluated. A component that imported
 * core's function directly would silently do nothing in a test that imports that component
 * alone, which is exactly the failure this wrapper prevents.
 */

import {
  announce as announceOnHost,
  type AnnouncementRole,
  setAnnouncementHost,
} from "@asheeui/core";
import { AccessibilityInfo } from "react-native";

setAnnouncementHost({
  // The platform's call takes the message and not a politeness, so the level is dropped
  // here rather than turned into something the platform does not have.
  announce: (message) => {
    AccessibilityInfo.announceForAccessibility(message);
  },
});

/**
 * Announce a message at a level.
 *
 * @param message - The text a reader hears.
 * @param level - How it is announced. Defaults to `"status"`, the level that waits.
 */
export function announce(
  message: string,
  level: AnnouncementRole = "status",
): void {
  announceOnHost(message, level);
}
