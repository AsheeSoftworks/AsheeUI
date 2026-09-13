import { describe, expect, it, vi } from "vitest";
import { createUser, expectState, renderWithProvider } from "../../test";
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

    expect(getByRole("button", { name: "Next Slide" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Previous Slide" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Go to slide 3" })).toBeInTheDocument();
    expect(getByText("Slide one")).toBeInTheDocument();
  });

  it("advances to the next slide and reports the index", async () => {
    const user = createUser();
    const onIndexChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Carousel items={ITEMS} onIndexChange={onIndexChange} />,
    );

    await user.click(getByRole("button", { name: "Next Slide" }));

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

    expectState(getByRole("button", { name: "Previous Slide" }), {
      disabled: true,
    });
    expect(getByRole("button", { name: "Next Slide" })).toBeEnabled();
  });

  it("hides controls and indicators when configured", () => {
    const { queryByRole } = renderWithProvider(
      <Carousel items={ITEMS} showControls={false} showIndicators={false} />,
    );

    expect(queryByRole("button", { name: "Next Slide" })).toBeNull();
    expect(queryByRole("button", { name: "Go to slide 1" })).toBeNull();
  });

  it("starts from a given slide and respects a controlled index", async () => {
    const user = createUser();
    const onIndexChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Carousel items={ITEMS} index={2} onIndexChange={onIndexChange} />,
    );

    await user.click(getByRole("button", { name: "Next Slide" }));

    expect(onIndexChange).toHaveBeenCalledWith(0);
  });

  it("renders safely without items", () => {
    const { container } = renderWithProvider(<Carousel />);

    expect(container.firstElementChild).not.toBeNull();
  });

  // Defect register (M1, D-13): transitions and autoplay are applied with plain
  // `transition-*` classes and timers. There is no reduced-motion handling, so
  // `COMP-047` ("autoplay, where supported, is pausable and respects reduced
  // motion") and `TEST-033` are unmet for this component.
  it.todo(
    "stops autoplay and transitions when the user prefers reduced motion (defect register D-13)",
  );
});
