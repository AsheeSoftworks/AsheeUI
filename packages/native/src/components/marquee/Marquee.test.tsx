/**
 * Behaviour tests for the native Marquee.
 *
 * The tests state the primitive's contract: the content is shown once and copied for the
 * loop, the copy is kept out of the accessibility tree rather than off the screen, the
 * movement follows the axis it is given and travels the distance one set plus the gap
 * covers, the cycle time comes from the shared presets, the gap is read from the shared CSS
 * length, and the loop yields to the platform's motion setting and to `isAnimated`.
 *
 * The platform's animator reports to a native module a test environment does not have, so
 * the tests state what the component asks the animator for rather than how it looks while
 * it turns.
 */

import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AccessibilityInfo, Animated, Text } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Marquee } from "./Marquee";

/** The items a test marquee carries. */
const ITEMS = [<Text key="alpha">Alpha</Text>, <Text key="beta">Beta</Text>];

/** The size the platform reports for one set of items, which is what the loop measures. */
const SET_SIZE = 300;

/** The framework's own gap, which an unmeasured or unresolvable gap falls back to. */
const DEFAULT_GAP = 24;

/** A stand-in for the handle an animation returns. */
function compositeAnimation() {
  return { start: jest.fn(), stop: jest.fn(), reset: jest.fn() };
}

let loop: jest.SpyInstance;
let timing: jest.SpyInstance;

beforeEach(() => {
  jest
    .spyOn(AccessibilityInfo, "isReduceMotionEnabled")
    .mockResolvedValue(false);
  loop = jest
    .spyOn(Animated, "loop")
    .mockReturnValue(compositeAnimation() as ReturnType<typeof Animated.loop>);
  timing = jest
    .spyOn(Animated, "timing")
    .mockReturnValue(
      compositeAnimation() as ReturnType<typeof Animated.timing>,
    );
});

afterEach(() => {
  jest.restoreAllMocks();
});

/**
 * Render a marquee inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderMarquee(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Report the laid-out size of the first set, which is what the loop measures.
 *
 * The platform lays a view out and reports it, and the component acts on the report; the
 * event is fired inside an awaited `act` so the report and what it causes are one settled
 * step.
 *
 * @param view - The rendered tree.
 * @param size - The size along the marquee's axis.
 * @param axis - The axis the size is measured on. Defaults to "x".
 */
async function reportSetSize(
  view: RenderResult,
  size: number,
  axis: "x" | "y" = "x",
) {
  const [primary] = view.getAllByTestId("marquee-set");

  await act(async () => {
    fireEvent(primary, "layout", {
      nativeEvent: {
        layout: {
          x: 0,
          y: 0,
          width: axis === "x" ? size : 20,
          height: axis === "x" ? 20 : size,
        },
      },
    });
  });
}

/**
 * Read the animation the component asked for.
 *
 * @returns The configuration passed to the platform's timing function.
 */
function animationConfig() {
  return timing.mock.calls[0]?.[1] as {
    toValue: number;
    duration: number;
    useNativeDriver: boolean;
  };
}

/**
 * Read the transform of the track.
 *
 * @param view - The rendered tree.
 * @returns The first transform entry, which states the axis it moves along.
 */
function trackTransform(view: RenderResult) {
  return (
    view.getByTestId("marquee-track").props as {
      style: { transform: Record<string, unknown>[] };
    }
  ).style.transform[0];
}

describe("Native Marquee", () => {
  it("shows the items once, and copies them for the loop", async () => {
    const view = await renderMarquee(<Marquee>{ITEMS}</Marquee>);

    // The copy is in the tree twice so the loop has somewhere to move into, and a reader
    // is told the items once.
    expect(view.getAllByText("Alpha")).toHaveLength(1);
    expect(
      view.getAllByText("Alpha", { includeHiddenElements: true }),
    ).toHaveLength(2);
  });

  it("keeps the copy out of the accessibility tree", async () => {
    const view = await renderMarquee(<Marquee>{ITEMS}</Marquee>);
    const sets = view.getAllByTestId("marquee-set", {
      includeHiddenElements: true,
    });

    expect(sets).toHaveLength(2);
    expect(sets[0].props.importantForAccessibility).toBe("auto");
    expect(sets[1].props.importantForAccessibility).toBe("no-hide-descendants");
    expect(sets[1].props.accessibilityElementsHidden).toBe(true);
  });

  it("moves along the axis it is given", async () => {
    const horizontal = await renderMarquee(<Marquee>{ITEMS}</Marquee>);

    expect(Object.keys(trackTransform(horizontal))).toEqual(["translateX"]);

    const vertical = await renderMarquee(<Marquee axis="y">{ITEMS}</Marquee>);

    expect(Object.keys(trackTransform(vertical))).toEqual(["translateY"]);
    expect(
      String(vertical.getByTestId("marquee-track").props.className),
    ).toContain("flex-col");
  });

  it("measures one set and moves by it plus the gap", async () => {
    const view = await renderMarquee(<Marquee>{ITEMS}</Marquee>);

    // A view is measured by the platform before it can be moved, so nothing moves until
    // the platform has said how wide the content is.
    expect(loop).not.toHaveBeenCalled();

    await reportSetSize(view, SET_SIZE);

    expect(animationConfig()).toMatchObject({
      toValue: -(SET_SIZE + DEFAULT_GAP),
      duration: 30_000,
      useNativeDriver: true,
    });
  });

  it("reads the gap as a length the platform can state", async () => {
    const view = await renderMarquee(<Marquee gap="2rem">{ITEMS}</Marquee>);

    await reportSetSize(view, SET_SIZE);

    // Two of the framework's rem units are thirty-two of the platform's.
    expect(animationConfig().toValue).toBe(-(SET_SIZE + 32));
    expect(
      (view.getByTestId("marquee-track").props as { style: { gap: number } })
        .style.gap,
    ).toBe(32);
  });

  it("takes its cycle time from the shared presets, or from a number of seconds", async () => {
    const preset = await renderMarquee(<Marquee speed="fast">{ITEMS}</Marquee>);

    await reportSetSize(preset, SET_SIZE);

    expect(animationConfig().duration).toBe(15_000);

    jest.restoreAllMocks();
    timing = jest
      .spyOn(Animated, "timing")
      .mockReturnValue(
        compositeAnimation() as ReturnType<typeof Animated.timing>,
      );
    loop = jest
      .spyOn(Animated, "loop")
      .mockReturnValue(
        compositeAnimation() as ReturnType<typeof Animated.loop>,
      );

    const seconds = await renderMarquee(<Marquee speed={10}>{ITEMS}</Marquee>);

    await reportSetSize(seconds, SET_SIZE);

    expect(animationConfig().duration).toBe(10_000);
  });

  it("moves in the other direction from the far end", async () => {
    const view = await renderMarquee(
      <Marquee direction="reverse">{ITEMS}</Marquee>,
    );

    await reportSetSize(view, SET_SIZE);

    expect(animationConfig().toValue).toBe(0);
  });

  it("stands still when the platform asks for less motion", async () => {
    (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(
      true,
    );

    const view = await renderMarquee(<Marquee>{ITEMS}</Marquee>);

    await act(async () => {});

    await reportSetSize(view, SET_SIZE);

    expect(loop).not.toHaveBeenCalled();
    // The content is read in place rather than hidden: less motion is not less content.
    expect(view.getAllByText("Alpha")).toHaveLength(1);
  });

  it("stands still when it is told not to move", async () => {
    const view = await renderMarquee(
      <Marquee isAnimated={false}>{ITEMS}</Marquee>,
    );

    await reportSetSize(view, SET_SIZE);

    expect(loop).not.toHaveBeenCalled();
    expect(view.getAllByText("Beta")).toHaveLength(1);
  });

  it("resolves its options through the cascade", async () => {
    const view = await renderMarquee(<Marquee>{ITEMS}</Marquee>, {
      components: { marquee: { axis: "y", gap: "24px", speed: "slow" } },
    });

    await reportSetSize(view, SET_SIZE, "y");

    expect(Object.keys(trackTransform(view))).toEqual(["translateY"]);
    expect(animationConfig()).toMatchObject({
      toValue: -(SET_SIZE + 24),
      duration: 50_000,
    });
  });

  it("renders safely when there are no items", async () => {
    const view = await renderMarquee(<Marquee>{[]}</Marquee>);

    expect(view.getByTestId("marquee-track")).toBeTruthy();
    expect(view.getAllByTestId("marquee-set")).toHaveLength(1);
  });
});
