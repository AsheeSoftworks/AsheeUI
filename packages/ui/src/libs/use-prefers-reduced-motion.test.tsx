import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  REDUCED_MOTION_QUERY,
  usePrefersReducedMotion,
} from "./use-prefers-reduced-motion";

/**
 * Installs a `matchMedia` stand-in that reports the reduced-motion preference
 * and lets the test change it, so no test depends on the host's own settings.
 *
 * @param matches - Whether the preference starts enabled.
 * @returns A function that reports the current preference to the hook.
 */
function stubMatchMedia(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          listeners.add(listener);
        },
        removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          listeners.delete(listener);
        },
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  );

  return (nextMatches: boolean) => {
    for (const listener of listeners) {
      listener({ matches: nextMatches } as MediaQueryListEvent);
    }
  };
}

/** Minimal consumer: the preference is the only behaviour under test. */
function MotionProbe() {
  return <span>{usePrefersReducedMotion() ? "reduced" : "full"}</span>;
}

describe("reduced-motion preference", () => {
  it("reports the preference the platform states", () => {
    stubMatchMedia(true);

    const { getByText } = render(<MotionProbe />);

    expect(getByText("reduced")).toBeInTheDocument();
    expect(window.matchMedia).toHaveBeenCalledWith(REDUCED_MOTION_QUERY);
  });

  it("reports motion as allowed when the platform does not ask for less", () => {
    stubMatchMedia(false);

    const { getByText } = render(<MotionProbe />);

    expect(getByText("full")).toBeInTheDocument();
  });

  it("follows the preference changing while the component is mounted", () => {
    const emitChange = stubMatchMedia(false);

    const { getByText } = render(<MotionProbe />);

    expect(getByText("full")).toBeInTheDocument();

    act(() => {
      emitChange(true);
    });

    expect(getByText("reduced")).toBeInTheDocument();
  });
});
