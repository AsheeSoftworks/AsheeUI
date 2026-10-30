/**
 * The announcement contract.
 *
 * Core cannot call a platform's accessibility API, so it holds the function a renderer
 * installs. These tests state the three properties a component relies on: a message reaches
 * the host with its level, an empty message is nothing to say, and a process with no host —
 * a server render, or a renderer that does not announce — is silently fine.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ANNOUNCEMENT_ROLE,
  announce,
  type AnnouncementHost,
  setAnnouncementHost,
} from "./announcement";

/**
 * Install a host that records what it was told.
 *
 * @returns The host and the list of what it received.
 */
function recordingHost(): {
  host: AnnouncementHost;
  calls: { message: string; level: string }[];
} {
  const calls: { message: string; level: string }[] = [];

  return {
    calls,
    host: {
      announce: (message, level) => {
        calls.push({ message, level });
      },
    },
  };
}

afterEach(() => {
  setAnnouncementHost(null);
});

describe("announce", () => {
  it("hands the message and its level to the platform's host", () => {
    const { host, calls } = recordingHost();
    setAnnouncementHost(host);

    announce("Invoice copied");
    announce("The form could not be submitted", "alert");

    expect(calls).toEqual([
      { message: "Invoice copied", level: "status" },
      { message: "The form could not be submitted", level: "alert" },
    ]);
  });

  it("says nothing when the message is empty", () => {
    const { host, calls } = recordingHost();
    setAnnouncementHost(host);

    announce("");

    expect(calls).toHaveLength(0);
  });

  it("does nothing when no host is installed", () => {
    // A server render and a renderer with no announcer both take this path, so it must not
    // throw; the message simply is not spoken.
    expect(() => announce("Hello")).not.toThrow();
  });

  it("maps each level to the role the web writes", () => {
    // The web attribute is the level's own name; the identity is stated rather than assumed,
    // because a future level that is not an ARIA role would have to be mapped here.
    expect(ANNOUNCEMENT_ROLE.alert).toBe("alert");
    expect(ANNOUNCEMENT_ROLE.status).toBe("status");
    expect(vi.isMockFunction(vi.fn())).toBe(true);
  });
});
