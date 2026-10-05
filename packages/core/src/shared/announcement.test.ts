import { describe, expect, it } from "vitest";
import {
  type AnnouncementRole,
  NATIVE_ANNOUNCEMENT_LIVE_REGION,
  resolveNativeAnnouncementRole,
} from "./announcement";

/** The two levels of announcement the framework names. */
const ROLES: AnnouncementRole[] = ["alert", "status"];

describe("how an announcement is made", () => {
  it("names the platform's level for both levels of announcement", () => {
    expect(Object.keys(NATIVE_ANNOUNCEMENT_LIVE_REGION).sort()).toEqual(
      [...ROLES].sort(),
    );
  });

  it("turns what interrupts into the platform's interrupting region, and what waits into a quiet one", () => {
    expect(NATIVE_ANNOUNCEMENT_LIVE_REGION.alert).toBe("assertive");
    expect(NATIVE_ANNOUNCEMENT_LIVE_REGION.status).toBe("polite");
  });

  it("takes the platform's role only for the level that has one", () => {
    expect(resolveNativeAnnouncementRole("alert")).toBe("alert");
    // The platform has no `status` role, so a message that waits is announced by
    // its live region alone rather than by a role it does not have.
    expect(resolveNativeAnnouncementRole("status")).toBeUndefined();
  });
});
