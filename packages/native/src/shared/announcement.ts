/**
 * The platform's announcement vocabulary.
 *
 * An announcement is made differently on the two renderers. The web states it as a live-region
 * role (`alert` or `status`) inline on the element. The platform has no `status` role: it states
 * the same level as a live region (`assertive` or `polite`) and takes the `alert` role only for
 * the level that interrupts. That pair — the role and the politeness — is this package's, not the
 * shared contract's, and it moved out of `@asheeui/core` in C1.
 *
 * `AnnouncementRole` stays in core: the two levels are what the framework names, and a component
 * on either renderer states one of them. B16 makes the web read this same mapping instead of
 * writing its role inline, which is why the levels are the shared half and the mechanism is not.
 */

import type { AnnouncementRole } from "@asheeui/core";

/**
 * The platform's own name for each level of announcement.
 *
 * `assertive` is the platform's word for what interrupts and `polite` is its word
 * for what waits, which is the same distinction the web's roles make.
 */
export const NATIVE_ANNOUNCEMENT_LIVE_REGION: Record<
  AnnouncementRole,
  "assertive" | "polite"
> = {
  alert: "assertive",
  status: "polite",
};

/**
 * The platform's accessibility role for an announcement, when it has one.
 *
 * Only the interrupting level has a role on the platform; a message that waits is
 * announced through its live region alone, because a role it does not have would be
 * a role the platform invented.
 *
 * @param role - How the message is announced.
 * @returns The platform's role, or undefined when the level has none.
 *
 * @example
 * ```tsx
 * resolveNativeAnnouncementRole("alert"); // "alert"
 * resolveNativeAnnouncementRole("status"); // undefined
 * ```
 */
export function resolveNativeAnnouncementRole(
  role: AnnouncementRole,
): "alert" | undefined {
  return role === "alert" ? "alert" : undefined;
}
