import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../test";
import { useBodyScrollLock } from "./use-body-scroll-lock";

/** Minimal overlay stand-in: the lock is the only behaviour under test. */
function Overlay({ active }: { active: boolean }) {
  useBodyScrollLock(active);
  return null;
}

describe("body scroll lock", () => {
  beforeEach(() => {
    document.body.style.position = "";
    document.body.style.overflow = "";
    // jsdom cannot scroll, so the position restore is observed through the
    // call instead of through a scroll position.
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  it("locks body scroll while an overlay is active and releases it after", () => {
    const { rerender } = render(<Overlay active={false} />);

    expect(document.body.style.overflow).toBe("");

    rerender(<Overlay active />);

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.position).toBe("fixed");

    rerender(<Overlay active={false} />);

    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
  });

  it("keeps the lock while another overlay is still active", () => {
    const { rerender } = render(
      <>
        <Overlay active />
        <Overlay active />
      </>,
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <>
        <Overlay active />
        <Overlay active={false} />
      </>,
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <>
        <Overlay active={false} />
        <Overlay active={false} />
      </>,
    );

    expect(document.body.style.overflow).toBe("");
  });

  it("restores the body styles a page already had and its scroll position", () => {
    document.body.style.overflow = "auto";

    const { unmount } = render(<Overlay active />);

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("auto");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
