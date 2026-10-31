/**
 * How an announcement is stated, shared by both platforms.
 *
 * Several components announce something rather than merely showing it: an alert, a region that
 * is empty, a region whose content has not arrived, a region that could not be loaded, the
 * result of a copy. The framework names two levels for that, and they are the same two on the
 * web: one interrupts, and one waits for a pause.
 *
 * The *level* is shared — a component states `"alert"` or `"status"` on either renderer — and so
 * is the map from that level to the attribute each platform writes. The web's attribute is the
 * live-region role; the platform's is a politeness plus a role of its own, which moved to
 * `@asheeui/native` in C1. B16 makes the web read this map rather than writing its role inline,
 * so the level of an announcement is decided once.
 *
 * **Announcing is a host.** Core cannot call a platform's accessibility API, so it holds the
 * one function a renderer installs and calls it. A platform that has not installed one
 * announces nothing, which is what a server render and a test both want; a device installs
 * `AccessibilityInfo.announceForAccessibility` when the package loads, and a browser keeps its
 * live region instead — the region is what a browser announces with, and there is nothing for
 * an imperative call to add.
 */

/**
 * How a component's message is announced.
 *
 * - `alert`: it interrupts what assistive technology is reading.
 * - `status`: it waits for a pause.
 */
export type AnnouncementRole = "alert" | "status";

/**
 * The role attribute each level is written as on the web.
 *
 * It is an identity map on purpose: the level names the roles the ARIA vocabulary already has.
 * Stating it here is what lets a web component write `role={ANNOUNCEMENT_ROLE[level]}` instead
 * of a literal, so both renderers resolve the same level through the same table.
 */
export const ANNOUNCEMENT_ROLE: Record<AnnouncementRole, AnnouncementRole> = {
  alert: "alert",
  status: "status",
};

/**
 * What a platform must provide for {@link announce} to speak.
 */
export interface AnnouncementHost {
  /**
   * Announce a message now.
   *
   * @param message - The text a reader hears.
   * @param level - How it is announced; a platform that cannot vary the politeness ignores it.
   */
  announce(message: string, level: AnnouncementRole): void;
}

/** The host a renderer installed, or `null` before one has. */
let host: AnnouncementHost | null = null;

/**
 * Install the platform's announcer.
 *
 * A renderer calls this once when its package loads. Passing `null` removes it, which is what
 * a test that wants to prove "nothing is announced without a host" uses.
 *
 * @param next - The announcer, or `null`.
 */
export function setAnnouncementHost(next: AnnouncementHost | null): void {
  host = next;
}

/**
 * Announce a message at a level.
 *
 * @param message - The text a reader hears. An empty message is nothing to say and is
 *   dropped rather than announced as silence.
 * @param level - How it is announced. Defaults to `"status"`, the level that waits.
 *
 * @example
 * ```ts
 * announce("Invoice number copied");
 * announce("The form could not be submitted", "alert");
 * ```
 */
export function announce(
  message: string,
  level: AnnouncementRole = "status",
): void {
  if (!message) return;
  host?.announce(message, level);
}
