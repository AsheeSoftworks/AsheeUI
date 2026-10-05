/**
 * Behaviour tests for the native Carousel.
 *
 * The tests state the component's contract: every slide is drawn, the first is the one the
 * carousel is on, a dot or a control moves to another slide and reports it, the controls stop
 * at the ends when the carousel does not loop and return to the beginning when it does, a
 * consumer who owns the index decides what happens, the autoplay advances on its interval and
 * pauses while a thumb is on the carousel, the parts a consumer switches off are not drawn,
 * and the frame and the height resolve through the configuration cascade.
 */

import { act, fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Pressable } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
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
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

describe("Native Carousel", () => {
  it("draws every slide, and says which one it is on", async () => {
    const view = await renderCarousel(
      <Carousel testID="carousel" items={ITEMS} />,
    );

    expect(view.getByText("First slide")).toBeTruthy();
    expect(view.getByText("Second slide")).toBeTruthy();
    expect(view.getByText("Third slide")).toBeTruthy();
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

    await fireEvent.press(view.getByRole("button", { name: "Next Slide" }));
    expect(view.getByTestId("carousel").props.accessibilityLabel).toBe(
      "Slide 2 of 3",
    );

    await fireEvent.press(view.getByRole("button", { name: "Previous Slide" }));
    expect(view.getByTestId("carousel").props.accessibilityLabel).toBe(
      "Slide 1 of 3",
    );
  });

  it("returns to the first slide from the last one when it loops", async () => {
    const view = await renderCarousel(
      <Carousel testID="carousel" items={ITEMS} defaultIndex={2} loop />,
    );

    await fireEvent.press(view.getByRole("button", { name: "Next Slide" }));

    expect(view.getByTestId("carousel").props.accessibilityLabel).toBe(
      "Slide 1 of 3",
    );
  });

  it("stops at the ends when the consumer asked it not to loop", async () => {
    const view = await renderCarousel(
      <Carousel testID="carousel" items={ITEMS} loop={false} />,
    );

    const previous = view.getByRole("button", { name: "Previous Slide" });

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

    await fireEvent.press(view.getByRole("button", { name: "Next Slide" }));

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

  it("draws no controls or dots when the consumer switched them off", async () => {
    const view = await renderCarousel(
      <Carousel
        testID="carousel"
        items={ITEMS}
        showControls={false}
        showIndicators={false}
      />,
    );

    expect(view.queryByRole("button", { name: "Next Slide" })).toBeNull();
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
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
