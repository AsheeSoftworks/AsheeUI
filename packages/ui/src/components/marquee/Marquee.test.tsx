import { describe, expect, it } from "vitest";
import { renderWithProvider } from "../../test";
import { Marquee } from "./Marquee";

const ITEMS = [
  <span key="alpha">Alpha</span>,
  <span key="beta">Beta</span>,
];

describe("Marquee", () => {
  it("renders every item in the primary track and the duplicate track", () => {
    const { getAllByText } = renderWithProvider(<Marquee>{ITEMS}</Marquee>);

    expect(getAllByText("Alpha")).toHaveLength(2);
    expect(getAllByText("Beta")).toHaveLength(2);
  });

  it("duplicates the track and hides the duplicate from assistive technology", () => {
    const { getAllByText, container } = renderWithProvider(
      <Marquee>{ITEMS}</Marquee>,
    );

    expect(getAllByText("Alpha")).toHaveLength(2);

    const hiddenText = Array.from(
      container.querySelectorAll('[aria-hidden="true"]'),
    )
      .map((node) => node.textContent ?? "")
      .join(" ");

    expect(hiddenText).toContain("Alpha");
    expect(hiddenText).toContain("Beta");
  });

  it("applies the configured speed and pauses on hover", () => {
    const { container } = renderWithProvider(
      <Marquee speed={10} pauseOnHover>
        {ITEMS}
      </Marquee>,
    );
    const track = container.querySelector(
      '[style*="animation"]',
    ) as HTMLElement | null;

    expect(track).not.toBeNull();
    expect(track?.style.animationDuration).toBe("10s");
    expect(track?.className).toContain(
      "group-hover:[animation-play-state:paused]",
    );
  });

  it("reverses the animation direction when configured", () => {
    const { container } = renderWithProvider(
      <Marquee direction="reverse">{ITEMS}</Marquee>,
    );
    const track = container.querySelector(
      '[style*="animation"]',
    ) as HTMLElement | null;

    expect(track?.style.animationDirection).toBe("reverse");
  });

  it("renders safely when there are no items", () => {
    const { container } = renderWithProvider(<Marquee>{[]}</Marquee>);

    expect(container.querySelector("div")).not.toBeNull();
  });

  // Defect register (M1, D-8): the animation is applied unconditionally. There
  // is no reduced-motion handling, so `COMP-048` ("motion respects
  // reduced-motion preference") and `TEST-033` are not met for this component.
  it.todo(
    "stops the animation when the user prefers reduced motion (defect register D-8)",
  );
});
