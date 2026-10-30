/**
 * How an announcement is made, shared by both platforms.
 *
 * Several components announce something rather than merely showing it: an alert, a
 * region that is empty, a region whose content has not arrived, a region that could
 * not be loaded. The framework names two levels for that, and they are the same two
 * on the web: one interrupts, and one waits for a pause.
 *
 * The web states the level as a live-region role (`alert` or `status`). The platform
 * has no `status` role, so it states the same level as a live region
 * (`assertive` or `polite`) and takes the `alert` role only for the level that
 * interrupts. The relation between the two vocabularies lives here, once, so four
 * components cannot each answer the question slightly differently.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

/**
 * How a component's message is announced.
 *
 * - `alert`: it interrupts what assistive technology is reading.
 * - `status`: it waits for a pause.
 */
export type AnnouncementRole = "alert" | "status";

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
