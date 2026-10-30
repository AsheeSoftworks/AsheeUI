/**
 * How an announcement is stated, shared by both platforms.
 *
 * Several components announce something rather than merely showing it: an alert, a region that
 * is empty, a region whose content has not arrived, a region that could not be loaded. The
 * framework names two levels for that, and they are the same two on the web: one interrupts, and
 * one waits for a pause.
 *
 * The *level* is shared — a component states `"alert"` or `"status"` on either renderer — and so
 * is this type. The *mechanism* is not: the web writes the level as a live-region role
 * (`role="alert"`/`"status"`), while the platform states it as a politeness plus a role of its own.
 * That mapping moved to `@asheeui/native` in C1; B16 makes the web read it rather than writing
 * its role inline.
 */

/**
 * How a component's message is announced.
 *
 * - `alert`: it interrupts what assistive technology is reading.
 * - `status`: it waits for a pause.
 */
export type AnnouncementRole = "alert" | "status";
