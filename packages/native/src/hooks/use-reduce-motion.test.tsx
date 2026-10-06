/**
 * Behaviour tests for the platform motion preference.
 *
 * The tests state the hook's contract: it reports the platform's setting, it follows it
 * while a screen is on, and it stops listening when the screen goes away. A reader who
 * turns the setting on in the middle of a screen is the reason this is a hook rather than
 * a value read once, so the test states exactly that.
 */

import { act, renderHook, waitFor } from "@testing-library/react-native";
import { AccessibilityInfo, type EmitterSubscription } from "react-native";
import { useReduceMotion } from "./use-reduce-motion";

/** The last handler the hook registered, which the tests call as the platform would. */
let listener: ((enabled: boolean) => void) | undefined;

/** The subscription handed back to the hook, so the test can see it released. */
let subscription: { remove: jest.Mock };

beforeEach(() => {
  subscription = { remove: jest.fn() };
  listener = undefined;

  jest
    .spyOn(AccessibilityInfo, "isReduceMotionEnabled")
    .mockResolvedValue(false);
  jest
    .spyOn(AccessibilityInfo, "addEventListener")
    .mockImplementation((_event, handler) => {
      listener = handler as (enabled: boolean) => void;

      return subscription as unknown as EmitterSubscription;
    });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useReduceMotion", () => {
  it("reports what the platform says", async () => {
    (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(
      true,
    );

    const { result } = await renderHook(() => useReduceMotion());

    await waitFor(() => expect(result.current).toBe(true));
  });

  it("allows motion when the platform does not answer", async () => {
    (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockRejectedValue(
      new Error("not available"),
    );

    const { result } = await renderHook(() => useReduceMotion());

    await act(async () => {});

    expect(result.current).toBe(false);
  });

  it("follows the setting while the screen is on", async () => {
    const { result } = await renderHook(() => useReduceMotion());

    await waitFor(() => expect(result.current).toBe(false));

    await act(async () => {
      listener?.(true);
    });

    expect(result.current).toBe(true);
  });

  it("stops listening when the screen goes away", async () => {
    const { unmount } = await renderHook(() => useReduceMotion());

    await waitFor(() => expect(listener).toBeDefined());

    await unmount();

    expect(subscription.remove).toHaveBeenCalled();
  });
});
