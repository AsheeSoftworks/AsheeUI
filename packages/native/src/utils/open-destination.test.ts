/**
 * Behaviour tests for following a configured destination on the platform.
 *
 * A configured action describes a destination rather than a callback, so the
 * platform's own URL handler is what follows it. The two things worth stating are
 * that the destination reaches the platform unchanged, and that a destination the
 * platform cannot follow is reported rather than turned into a crash.
 */

import { Linking } from "react-native";
import { openDestination } from "./open-destination";

describe("following a configured destination", () => {
  it("hands the destination to the platform's own URL handler", () => {
    const open = jest
      .spyOn(Linking, "openURL")
      .mockResolvedValue(undefined as never);

    openDestination("https://example.com/campaigns");

    expect(open).toHaveBeenCalledWith("https://example.com/campaigns");

    open.mockRestore();
  });

  it("reports a destination the platform cannot follow instead of crashing", async () => {
    const open = jest
      .spyOn(Linking, "openURL")
      .mockRejectedValue(new Error("no handler for that scheme"));
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    expect(() => openDestination("nonsense://nowhere")).not.toThrow();

    // The rejection is handled after the call returns, which is what keeps it from
    // surfacing as an unhandled rejection in the application.
    await Promise.resolve();
    await Promise.resolve();

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("nonsense://nowhere"),
      expect.any(Error),
    );

    open.mockRestore();
    warn.mockRestore();
  });
});
