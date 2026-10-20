import { describe, expect, it } from "vitest";
import { renderWithProvider, stubReducedMotion } from "../../../test";
import { Marquee } from "./Marquee";
import {
  defaultMarqueeConfig,
  FALLBACK_MARQUEE_CONFIG,
} from "./marquee-config";

const ITEMS = [<span key="alpha">Alpha</span>, <span key="beta">Beta</span>];

/** The animated track, or `null` when the component chose the still path. */
function findTrack(container: HTMLElement): HTMLElement | null {
  return container.querySelector('[style*="animation-name"]');
}

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

  // `COMP-053`: the duplicate was aria-hidden but not inert, so a link inside the
  // marquee was a tab stop twice and the second stop announced nothing.
  it("keeps the duplicate copy out of the tab order as well", () => {
    const { container } = renderWithProvider(<Marquee>{ITEMS}</Marquee>);
    const inertCopies = container.querySelectorAll("[inert]");

    expect(inertCopies).toHaveLength(1);
    expect(inertCopies[0]).toHaveAttribute("aria-hidden", "true");
    expect(inertCopies[0]!.textContent).toContain("Alpha");

    // The copy the reader reads is still focusable.
    const sets = Array.from(
      inertCopies[0]!.parentElement?.children ?? [],
    ) as HTMLElement[];

    expect(sets).toHaveLength(2);
    expect(sets[0]).not.toHaveAttribute("inert");
  });

  it("applies the configured speed and pauses on hover", () => {
    const { container } = renderWithProvider(
      <Marquee speed={10} pauseOnHover>
        {ITEMS}
      </Marquee>,
    );
    const track = findTrack(container);

    expect(track).not.toBeNull();
    expect(track?.style.animationDuration).toBe("10s");
    expect(track?.className).toContain(
      "group-hover:[animation-play-state:paused]",
    );
  });

  // `COMP-054`: `pauseOnHover` is pointer-only, so WCAG 2.2.2 had no mechanism for a
  // keyboard reader. Focus anywhere inside the marquee stops the loop too.
  it("pauses for keyboard focus as well as for a resting pointer", () => {
    const { container } = renderWithProvider(
      <Marquee pauseOnHover>{ITEMS}</Marquee>,
    );
    const track = findTrack(container);

    expect(track?.className).toContain(
      "group-hover:[animation-play-state:paused]",
    );
    expect(track?.className).toContain(
      "group-focus-within:[animation-play-state:paused]",
    );
  });

  it("reverses the animation direction when configured", () => {
    const { container } = renderWithProvider(
      <Marquee direction="reverse">{ITEMS}</Marquee>,
    );
    const track = findTrack(container);

    expect(track?.style.animationDirection).toBe("reverse");
  });

  // `COMP-055`: the track carried the inter-copy gap, so translating by half its
  // length moved a copy plus half a gap instead of a copy plus the gap, and every
  // cycle jumped by half a gap.
  it("keeps the inter-copy gap inside each copy so half the track is one copy plus the gap", () => {
    const { container } = renderWithProvider(
      <Marquee gap="2rem">{ITEMS}</Marquee>,
    );
    const track = findTrack(container);

    expect(track).not.toBeNull();
    // No gap of its own: -50% is then exactly one copy plus the gap between copies.
    expect(track?.style.gap).toBe("");

    const copies = Array.from(track?.children ?? []) as HTMLElement[];

    expect(copies).toHaveLength(2);
    for (const copy of copies) {
      expect(copy.style.gap).toBe("2rem");
      expect(copy.style.paddingRight).toBe("2rem");
    }
  });

  it("states the inter-copy gap inside each copy on the vertical axis too", () => {
    const { container } = renderWithProvider(
      <Marquee axis="y" gap="2rem">
        {ITEMS}
      </Marquee>,
    );
    const track = findTrack(container);

    expect(track?.style.gap).toBe("");

    const copies = Array.from(track?.children ?? []) as HTMLElement[];

    for (const copy of copies) {
      expect(copy.style.gap).toBe("2rem");
      expect(copy.style.paddingBottom).toBe("2rem");
      expect(copy.style.paddingRight).toBe("");
    }
  });

  it("renders safely when there are no items", () => {
    const { container } = renderWithProvider(<Marquee>{[]}</Marquee>);

    expect(container.querySelector("div")).not.toBeNull();
  });

  // Defect register (M1, D-8): the animation was applied unconditionally, so
  // `COMP-048` ("motion respects reduced-motion preference") and `TEST-033`
  // were unmet for this component.
  //
  // `COMP-056`: stopping the animation left both copies clipped inside
  // `overflow-hidden`, so everything that did not fit was unreadable.
  it("shows the content once, in a reachable frame, when motion is declined", () => {
    stubReducedMotion(true);

    const { container, getAllByText } = renderWithProvider(
      <Marquee>{ITEMS}</Marquee>,
    );

    // One copy, so nothing is duplicated and nothing is clipped away.
    expect(getAllByText("Alpha")).toHaveLength(1);
    expect(getAllByText("Beta")).toHaveLength(1);
    expect(findTrack(container)).toBeNull();

    const frame = container.querySelector(".overflow-auto");

    expect(frame).not.toBeNull();
    expect(frame).toHaveTextContent("Alpha");
    expect(frame).toHaveTextContent("Beta");
    expect(frame?.className).toContain("h-full");

    const copy = frame?.firstElementChild as HTMLElement;

    // The single copy wraps, so the items that would have scrolled past read in place.
    expect(copy.className).toContain("flex-row");
    expect(copy.className).toContain("flex-wrap");
  });

  it("shows the content once, in a reachable frame, when isAnimated is false", () => {
    stubReducedMotion(false);

    const { container, getAllByText } = renderWithProvider(
      <Marquee isAnimated={false}>{ITEMS}</Marquee>,
    );

    expect(getAllByText("Alpha")).toHaveLength(1);
    expect(findTrack(container)).toBeNull();

    const frame = container.querySelector(".overflow-auto");

    expect(frame).not.toBeNull();
    expect(frame).toHaveTextContent("Beta");
    expect(frame?.firstElementChild?.className).toContain("flex-wrap");
  });

  it("makes a still vertical marquee scrollable", () => {
    stubReducedMotion(true);

    const { container, getAllByText } = renderWithProvider(
      <Marquee axis="y">{ITEMS}</Marquee>,
    );

    expect(getAllByText("Alpha")).toHaveLength(1);

    const frame = container.querySelector(".overflow-y-auto");

    expect(frame).not.toBeNull();
    expect(frame?.className).toContain("h-full");
    expect(frame?.firstElementChild?.className).toContain("flex-col");
  });

  it("keeps the animation when the user allows motion", () => {
    stubReducedMotion(false);

    const { container } = renderWithProvider(<Marquee>{ITEMS}</Marquee>);
    const track = findTrack(container);

    expect(track?.style.animationName).toBe("marquee-x");
  });

  // `COMP-057`: the fallback said `pauseOnHover: true` and `fadeEdges: true` while the
  // registered defaults and the documented defaults said false, so an option changed
  // meaning when the fallback tier answered.
  it("falls back to the values it registers", () => {
    expect(FALLBACK_MARQUEE_CONFIG.pauseOnHover).toBe(false);
    expect(FALLBACK_MARQUEE_CONFIG.fadeEdges).toBe(false);
    expect(FALLBACK_MARQUEE_CONFIG.pauseOnHover).toBe(
      defaultMarqueeConfig.pauseOnHover,
    );
    expect(FALLBACK_MARQUEE_CONFIG.fadeEdges).toBe(
      defaultMarqueeConfig.fadeEdges,
    );
  });
});
