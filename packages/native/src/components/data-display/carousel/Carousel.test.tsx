/**
 * Behaviour tests for the native Carousel.
 *
 * The tests state the component's contract: every slide is drawn, the first is the one the
 * carousel is on, a dot or a control moves to another slide and reports it, the controls stop
 * at the ends when the carousel does not loop and return to the beginning when it does, a
 * consumer who owns the index decides what happens, the autoplay advances on its interval and
 * pauses while a thumb is on the carousel or the platform asks for less motion, an off-screen
 * slide is out of the focus and accessibility order, the parts a consumer switches off are not
 * drawn, and the frame and the height resolve through the configuration cascade.
 */

import { act, fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AccessibilityInfo, Pressable } from "react-native";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import { Carousel } from "./Carousel";

/** The slides the tests move through. */
const ITEMS = [
  { id: "one", content: "First slide" },
  { id: "two", content: "Second slide" },
  { id: "three", content: "Third slide" },
];

/**
 * Render a carousel inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderCarousel(ui: ReactElement, config?: object) {
  return render(<AsheeUIProvider config={config}>{ui}</AsheeUIProvider>);
}

describe("Native Carousel", () => {
  beforeEach(() => {
    jest
      .spyOn(AccessibilityInfo, "isReduceMotionEnabled")
      .mockResolvedValue(false);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("draws every slide, and says which one it is on", async () => {
    const view = await renderCarousel(
      <Carousel testID="carousel" items={ITEMS} />,
    );

    expect(view.getByText("First slide")).toBeTruthy();
    // The slides the carousel is not on are laid out beside it and out of the
    // accessibility tree, so a plain query does not see them.
    expect(
      view.getByText("Second slide", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      view.getByText("Third slide", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(view.getByTestId("carousel").props.accessibilityLabel).toBe(
      "Slide 1 of 3",
    );
  });

  it("marks the dot of the slide it is on", async () => {
    const view = await renderCarousel(
      <Carousel testID="carousel" items={ITEMS} />,
    );

    expect(
      view.getByRole("button", { name: "Go to slide 1" }).props
        .accessibilityState,
    ).toMatchObject({ selected: true });
    expect(
      view.getByRole("button", { name: "Go to slide 2" }).props
        .accessibilityState,
    ).toMatchObject({ selected: false });
  });

  it("moves to the slide a dot names, and reports it", async () => {
    const onIndexChange = jest.fn();
    const view = await renderCarousel(
      <Carousel
        testID="carousel"
        items={ITEMS}
        onIndexChange={onIndexChange}
      />,
    );

    await fireEvent.press(view.getByRole("button", { name: "Go to slide 2" }));

    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(view.getByTestId("carousel").props.accessibilityLabel).toBe(
      "Slide 2 of 3",
    );
  });

  it("moves with the next control, and back with the previous one", async () => {
    const view = await renderCarousel(
      <Carousel testID="carousel" items={ITEMS} />,
    );

    await fireEvent.press(view.getByRole("button", { name: "Next slide" }));
    expect(view.getByTestId("carousel").props.accessibilityLabel).toBe(
      "Slide 2 of 3",
    );

    await fireEvent.press(view.getByRole("button", { name: "Previous slide" }));
    expect(view.getByTestId("carousel").props.accessibilityLabel).toBe(
      "Slide 1 of 3",
    );
  });

  it("returns to the first slide from the last one when it loops", async () => {
    const view = await renderCarousel(
      <Carousel testID="carousel" items={ITEMS} defaultIndex={2} loop />,
    );

    await fireEvent.press(view.getByRole("button", { name: "Next slide" }));

    expect(view.getByTestId("carousel").props.accessibilityLabel).toBe(
      "Slide 1 of 3",
    );
  });

  it("stops at the ends when the consumer asked it not to loop", async () => {
    const view = await renderCarousel(
      <Carousel testID="carousel" items={ITEMS} loop={false} />,
    );

    const previous = view.getByRole("button", { name: "Previous slide" });

    // The first slide has nothing before it, so the control says so rather than wrapping.
    expect(previous.props.accessibilityState).toMatchObject({
      disabled: true,
    });

    await fireEvent.press(previous);

    expect(view.getByTestId("carousel").props.accessibilityLabel).toBe(
      "Slide 1 of 3",
    );
  });

  it("reports every move to a consumer who owns the index, and decides nothing itself", async () => {
    const onIndexChange = jest.fn();
    const view = await renderCarousel(
      <Carousel
        testID="carousel"
        items={ITEMS}
        index={0}
        onIndexChange={onIndexChange}
      />,
    );

    await fireEvent.press(view.getByRole("button", { name: "Next slide" }));

    expect(onIndexChange).toHaveBeenCalledWith(1);
    // The consumer owns the index, so the carousel stays where it was told to stay.
    expect(view.getByTestId("carousel").props.accessibilityLabel).toBe(
      "Slide 1 of 3",
    );
  });

  it("advances by itself on the interval it was given", async () => {
    jest.useFakeTimers();

    const onIndexChange = jest.fn();
    const view = await renderCarousel(
      <Carousel
        testID="carousel"
        items={ITEMS}
        autoPlay
        autoPlayInterval={3000}
        onIndexChange={onIndexChange}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(view.getByTestId("carousel").props.accessibilityLabel).toBe(
      "Slide 2 of 3",
    );

    jest.useRealTimers();
  });

  it("does not start the autoplay when the platform asks for less motion", async () => {
    jest.useFakeTimers();
    (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(
      true,
    );

    const onIndexChange = jest.fn();
    const view = await renderCarousel(
      <Carousel
        testID="carousel"
        items={ITEMS}
        autoPlay
        autoPlayInterval={3000}
        onIndexChange={onIndexChange}
      />,
    );

    // The platform answers asynchronously, and the timer must be gone by the time it does.
    await act(async () => {});

    await act(async () => {
      jest.advanceTimersByTime(30_000);
    });

    expect(onIndexChange).not.toHaveBeenCalled();
    expect(view.getByTestId("carousel").props.accessibilityLabel).toBe(
      "Slide 1 of 3",
    );

    jest.useRealTimers();
  });

  it("keeps every slide but the current one out of the focus and accessibility order", async () => {
    const view = await renderCarousel(
      <Carousel testID="carousel" items={ITEMS} />,
    );
    const slides = view.getAllByTestId("carousel-slide", {
      includeHiddenElements: true,
    });

    expect(slides).toHaveLength(3);
    expect(slides[0].props.importantForAccessibility).toBe("auto");
    expect(slides[0].props.accessibilityElementsHidden).toBeUndefined();
    expect(slides[0].props.focusable).toBeUndefined();

    for (const offScreen of slides.slice(1)) {
      expect(offScreen.props.importantForAccessibility).toBe(
        "no-hide-descendants",
      );
      expect(offScreen.props.accessibilityElementsHidden).toBe(true);
      expect(offScreen.props.focusable).toBe(false);
    }

    await fireEvent.press(view.getByRole("button", { name: "Next slide" }));

    // Reachability follows the visible slide rather than staying on the first one.
    const moved = view.getAllByTestId("carousel-slide", {
      includeHiddenElements: true,
    });

    expect(moved[1].props.importantForAccessibility).toBe("auto");
    expect(moved[1].props.accessibilityElementsHidden).toBeUndefined();
    expect(moved[0].props.importantForAccessibility).toBe(
      "no-hide-descendants",
    );
    expect(moved[0].props.accessibilityElementsHidden).toBe(true);
  });

  it("draws the ghost frame for a ghost variant", async () => {
    const view = await renderCarousel(
      <Carousel testID="carousel" items={ITEMS} variant="ghost" />,
    );
    const classes = (
      view.getByTestId("carousel").props as { className?: string }
    ).className as string;

    expect(classes).toContain("bg-transparent");
  });

  it("draws no controls or dots when the consumer switched them off", async () => {
    const view = await renderCarousel(
      <Carousel
        testID="carousel"
        items={ITEMS}
        showControls={false}
        showIndicators={false}
      />,
    );

    expect(view.queryByRole("button", { name: "Next slide" })).toBeNull();
    expect(view.queryByRole("button", { name: "Go to slide 1" })).toBeNull();
  });

  it("lets a consumer render the controls, and hands them what they need", async () => {
    const onIndexChange = jest.fn();
    const view = await renderCarousel(
      <Carousel
        testID="carousel"
        items={ITEMS}
        onIndexChange={onIndexChange}
        renderNextControl={({ onClick, disabled }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Forward"
            accessibilityState={{ disabled }}
            onPress={onClick}
          />
        )}
      />,
    );

    await fireEvent.press(view.getByRole("button", { name: "Forward" }));

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("resolves the frame and the height through the cascade, and a treatment it has none for to the one it documents", async () => {
    const view = await renderCarousel(
      <Carousel testID="carousel" items={ITEMS} />,
      {
        defaultVariant: "solid",
        components: { carousel: { size: "lg", radius: "full" } },
      },
    );
    const classes = (
      view.getByTestId("carousel").props as { className?: string }
    ).className as string;

    expect(classes).toContain("h-[400px]");
    expect(classes).toContain("bg-background");
    expect(classes).toContain("rounded-full");
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<Carousel items={ITEMS} />)).rejects.toThrow(
      /AsheeUIProvider/,
    );

    silence.mockRestore();
  });
});
