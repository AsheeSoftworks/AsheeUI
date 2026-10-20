import { resolveCarouselVariant } from "@asheeui/core";
import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectState,
  makeComponentConfig,
  makeConfig,
  renderWithProvider,
  stubReducedMotion,
  useFakeTimers,
} from "../../../test";
import { Carousel } from "./Carousel";

const ITEMS = [
  { content: <div>Slide one</div> },
  { content: <div>Slide two</div> },
  { content: <div>Slide three</div> },
];

describe("Carousel", () => {
  it("renders labelled navigation controls and indicators", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Carousel items={ITEMS} />,
    );

    expect(getByRole("button", { name: "Next slide" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Previous slide" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Go to slide 3" })).toBeInTheDocument();
    expect(getByText("Slide one")).toBeInTheDocument();
  });

  // `COMP-049`: the controls and the dots were labelled in two different cases
  // ("Previous Slide" beside "Go to slide 1"), so a reader heard the same kind of
  // control named two different ways.
  it("labels every control in sentence case", () => {
    const { getByRole } = renderWithProvider(<Carousel items={ITEMS} />);

    expect(getByRole("button", { name: "Previous slide" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Next slide" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Go to slide 1" })).toBeInTheDocument();
  });

  it("advances to the next slide and reports the index", async () => {
    const user = createUser();
    const onIndexChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Carousel items={ITEMS} onIndexChange={onIndexChange} />,
    );

    await user.click(getByRole("button", { name: "Next slide" }));

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("jumps to a slide from its indicator", async () => {
    const user = createUser();
    const onIndexChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Carousel items={ITEMS} onIndexChange={onIndexChange} />,
    );

    await user.click(getByRole("button", { name: "Go to slide 3" }));

    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it("disables the previous control on the first slide when looping is off", () => {
    const { getByRole } = renderWithProvider(
      <Carousel items={ITEMS} loop={false} />,
    );

    expectState(getByRole("button", { name: "Previous slide" }), {
      disabled: true,
    });
    expect(getByRole("button", { name: "Next slide" })).toBeEnabled();
  });

  it("hides controls and indicators when configured", () => {
    const { queryByRole } = renderWithProvider(
      <Carousel items={ITEMS} showControls={false} showIndicators={false} />,
    );

    expect(queryByRole("button", { name: "Next slide" })).toBeNull();
    expect(queryByRole("button", { name: "Go to slide 1" })).toBeNull();
  });

  it("starts from a given slide and respects a controlled index", async () => {
    const user = createUser();
    const onIndexChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Carousel items={ITEMS} index={2} onIndexChange={onIndexChange} />,
    );

    await user.click(getByRole("button", { name: "Next slide" }));

    expect(onIndexChange).toHaveBeenCalledWith(0);
  });

  it("renders safely without items", () => {
    const { container } = renderWithProvider(<Carousel />);

    expect(container.firstElementChild).not.toBeNull();
  });

  // Defect register (M1, D-13): transitions and autoplay were applied with plain
  // `transition-*` classes and timers, with no reduced-motion handling, so
  // `COMP-047` ("autoplay, where supported, is pausable and respects reduced
  // motion") and `TEST-033` were unmet.
  it("advances on autoplay while the user allows motion", () => {
    stubReducedMotion(false);

    const onIndexChange = vi.fn();
    const timers = useFakeTimers();

    try {
      renderWithProvider(
        <Carousel
          items={ITEMS}
          autoPlay
          autoPlayInterval={1000}
          onIndexChange={onIndexChange}
        />,
      );

      timers.advance(1000);

      expect(onIndexChange).toHaveBeenCalledWith(1);
    } finally {
      timers.restore();
    }
  });

  it("stops autoplay and transitions when the user prefers reduced motion", () => {
    stubReducedMotion(true);

    const onIndexChange = vi.fn();
    const timers = useFakeTimers();

    try {
      const { container } = renderWithProvider(
        <Carousel
          items={ITEMS}
          autoPlay
          autoPlayInterval={1000}
          onIndexChange={onIndexChange}
        />,
      );

      timers.advance(3000);

      expect(onIndexChange).not.toHaveBeenCalled();

      const track = container.querySelector(
        '[style*="translate3d"]',
      ) as HTMLElement | null;

      expect(track).not.toBeNull();
      expect(track?.className).not.toContain("transition-transform");
    } finally {
      timers.restore();
    }
  });

  // `COMP-050`: slides are translated rather than hidden, so a control inside an
  // off-screen slide stayed in the tab order and a keyboard user could land in a
  // frame the viewport never followed.
  it("takes off-screen slides out of the tab order and the accessibility tree", () => {
    const { getByText } = renderWithProvider(<Carousel items={ITEMS} />);
    const slideOf = (text: string) => getByText(text).parentElement;

    expect(slideOf("Slide one")).not.toHaveAttribute("inert");
    expect(slideOf("Slide one")).not.toHaveAttribute("aria-hidden");

    expect(slideOf("Slide two")).toHaveAttribute("inert");
    expect(slideOf("Slide two")).toHaveAttribute("aria-hidden", "true");
    expect(slideOf("Slide three")).toHaveAttribute("inert");
    expect(slideOf("Slide three")).toHaveAttribute("aria-hidden", "true");
  });

  it("moves the reachable slide with the visible one", async () => {
    const user = createUser();
    const { getByRole, getByText } = renderWithProvider(
      <Carousel items={ITEMS} />,
    );

    await user.click(getByRole("button", { name: "Next slide" }));

    expect(getByText("Slide two").parentElement).not.toHaveAttribute("inert");
    expect(getByText("Slide one").parentElement).toHaveAttribute("inert");
  });

  // `COMP-047` / `REQ-089`: `components.carousel.disableAnimation` was destructured
  // with a literal default, so the configured value never resolved.
  it("resolves disableAnimation from the component config", () => {
    const { container } = renderWithProvider(<Carousel items={ITEMS} />, {
      config: makeComponentConfig("carousel", { disableAnimation: true }),
    });
    const track = container.querySelector(
      '[style*="translate3d"]',
    ) as HTMLElement | null;

    expect(track).not.toBeNull();
    expect(track?.className).not.toContain("transition-transform");
  });

  it("keeps the transition when the component config leaves it on", () => {
    const { container } = renderWithProvider(<Carousel items={ITEMS} />, {
      config: makeComponentConfig("carousel", { disableAnimation: false }),
    });
    const track = container.querySelector(
      '[style*="translate3d"]',
    ) as HTMLElement | null;

    expect(track?.className).toContain("transition-transform");
  });

  // `COMP-051`: the shared `defaultVariant` was cast to the carousel's own type, so
  // a treatment the carousel cannot draw silently became `bordered`.
  it("maps the shared defaultVariant onto a frame the carousel can draw", () => {
    expect(resolveCarouselVariant("solid")).toBe("bordered");
    expect(resolveCarouselVariant("faded")).toBe("bordered");
    expect(resolveCarouselVariant("underlined")).toBe("bordered");
    expect(resolveCarouselVariant("bordered")).toBe("bordered");
    expect(resolveCarouselVariant("ghost")).toBe("ghost");
  });

  it("renders the filled frame for a filled defaultVariant and the ghost frame for ghost", () => {
    const filled = renderWithProvider(<Carousel items={ITEMS} />, {
      config: makeConfig({ defaultVariant: "solid" }),
    });
    const ghost = renderWithProvider(<Carousel items={ITEMS} />, {
      config: makeConfig({ defaultVariant: "ghost" }),
    });

    expect(filled.container.firstElementChild?.className).toContain("border-2");
    expect(ghost.container.firstElementChild?.className).toContain(
      "bg-transparent",
    );
  });

  // `COMP-052`: the active dot was only a colour, with nothing stating the current
  // slide to assistive technology.
  it("marks the active indicator as the current slide", () => {
    const { getByRole } = renderWithProvider(<Carousel items={ITEMS} />);

    expect(getByRole("button", { name: "Go to slide 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(getByRole("button", { name: "Go to slide 2" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("moves aria-current to the dot of the slide the reader chose", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Carousel items={ITEMS} />);

    await user.click(getByRole("button", { name: "Go to slide 2" }));

    expect(getByRole("button", { name: "Go to slide 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(getByRole("button", { name: "Go to slide 1" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
