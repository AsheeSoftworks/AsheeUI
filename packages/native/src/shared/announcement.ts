/**
 * The platform's own announcement vocabulary.
 *
 * It was declared in `@asheeui/core` (shared/announcement.ts) beside the web renderer's inline
 * `role`/`aria-live`, which is a different mechanism rather than the same one spelled
 * differently: the platform states an announcement as an accessibility role plus a live-region
 * politeness, and that pair is this package's, not the shared contract's.
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
