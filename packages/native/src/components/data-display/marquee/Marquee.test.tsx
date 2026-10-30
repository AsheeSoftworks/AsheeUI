/**
 * Behaviour tests for the native Marquee.
 *
 * The tests state the primitive's contract: the content is shown once and copied for the
 * loop, the copy is kept out of the accessibility tree and out of the focus order rather than
 * off the screen, the movement follows the axis it is given and travels the distance one set
 * plus the gap covers, the cycle time comes from the shared presets, the gap is read from the
 * shared CSS length, and the loop yields to the platform's motion setting and to `isAnimated`.
 * With the movement stopped the content is shown once in a frame that scrolls and wraps, so
 * nothing is clipped away, and a frame holding focus pauses the loop for a reader who cannot
 * hover.
 *
 * The platform's animator reports to a native module a test environment does not have, so
 * the tests state what the component asks the animator for rather than how it looks while
 * it turns.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AccessibilityInfo, Animated, Text } from "react-native";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import {
  NATIVE_MARQUEE_STILL_FRAME_CLASS,
  NATIVE_MARQUEE_STILL_SET_CLASS,
} from "../../../styles/marquee";
import { Marquee } from "./Marquee";
import {
  defaultNativeMarqueeConfig,
  FALLBACK_NATIVE_MARQUEE_CONFIG,
} from "./marquee-config";

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
  return render(<AsheeUIProvider config={config}>{ui}</AsheeUIProvider>);
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

  it("keeps the copy out of the accessibility tree and out of the focus order", async () => {
    const view = await renderMarquee(<Marquee>{ITEMS}</Marquee>);
    const sets = view.getAllByTestId("marquee-set", {
      includeHiddenElements: true,
    });

    expect(sets).toHaveLength(2);
    expect(sets[0].props.importantForAccessibility).toBe("auto");
    expect(sets[0].props.focusable).toBeUndefined();
    expect(sets[1].props.importantForAccessibility).toBe("no-hide-descendants");
    expect(sets[1].props.accessibilityElementsHidden).toBe(true);
    // A link inside the marquee is one tab stop rather than two.
    expect(sets[1].props.accessible).toBe(false);
    expect(sets[1].props.focusable).toBe(false);
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

  it("shows the content once, in a frame that scrolls and wraps, when the platform asks for less motion", async () => {
    (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(
      true,
    );

    const view = await renderMarquee(<Marquee>{ITEMS}</Marquee>);

    await act(async () => {});

    await reportSetSize(view, SET_SIZE);

    expect(loop).not.toHaveBeenCalled();
    // Nothing moves, so there is no second copy to move into place.
    expect(view.queryByTestId("marquee-track")).toBeNull();
    expect(view.getAllByTestId("marquee-set")).toHaveLength(1);
    // The content is read in place rather than hidden: less motion is not less content.
    expect(view.getAllByText("Alpha")).toHaveLength(1);
    expect(view.getAllByText("Beta")).toHaveLength(1);

    // The frame scrolls and its single copy wraps, so whatever does not fit is reachable
    // rather than clipped away by the frame that exists for the movement.
    const frame = view.getByTestId("marquee-still-frame");

    expect(frame).toBeTruthy();
    // `F-90`: the still frame's classes come from the shared style module, so the null
    // render is exactly the map the web family lives beside.
    expect(frame.props.className).toBe(NATIVE_MARQUEE_STILL_FRAME_CLASS.x);

    const [copy] = view.getAllByTestId("marquee-set");

    expect(String(copy.props.className)).toContain(
      NATIVE_MARQUEE_STILL_SET_CLASS.x,
    );
  });

  it("stands still when it is told not to move", async () => {
    const view = await renderMarquee(
      <Marquee isAnimated={false}>{ITEMS}</Marquee>,
    );

    await reportSetSize(view, SET_SIZE);

    expect(loop).not.toHaveBeenCalled();
    expect(view.queryByTestId("marquee-track")).toBeNull();
    expect(view.getByTestId("marquee-still-frame")).toBeTruthy();
    expect(view.getAllByTestId("marquee-set")).toHaveLength(1);
    expect(view.getAllByText("Beta")).toHaveLength(1);
  });

  it("stacks the single still copy on the vertical axis", async () => {
    const view = await renderMarquee(
      <Marquee axis="y" isAnimated={false}>
        {ITEMS}
      </Marquee>,
    );

    const [copy] = view.getAllByTestId("marquee-set");

    expect(view.getByTestId("marquee-still-frame").props.className).toBe(
      NATIVE_MARQUEE_STILL_FRAME_CLASS.y,
    );
    expect(String(copy.props.className)).toContain(
      NATIVE_MARQUEE_STILL_SET_CLASS.y,
    );
    expect(String(copy.props.className)).toContain("flex-col");
    expect(String(copy.props.className)).not.toContain("flex-wrap");
  });

  // `F-90`: the still-frame maps used to be declared in this component while every other
  // marquee class map lived in `@asheeui/core`, so a change to the resting marquee had to
  // be made twice. They are imported now, and the component declares no copy of its own.
  it("reads its still-frame classes from the shared style module", () => {
    const source = readFileSync(join(__dirname, "Marquee.tsx"), "utf8");

    expect(source).toContain("NATIVE_MARQUEE_STILL_FRAME_CLASS");
    expect(source).toContain("NATIVE_MARQUEE_STILL_SET_CLASS");
    expect(source).not.toContain("const STILL_FRAME_CLASS");
    expect(source).not.toContain("const STILL_SET_AXIS_CLASS");
  });

  it("stops the loop while the frame holds focus, and resumes when it lets go", async () => {
    const view = await renderMarquee(
      <Marquee testID="marquee" pauseOnHover>
        {ITEMS}
      </Marquee>,
    );

    await reportSetSize(view, SET_SIZE);

    const animation = loop.mock.results[0]?.value as ReturnType<
      typeof compositeAnimation
    >;

    expect(animation.start).toHaveBeenCalledTimes(1);

    // A touch screen has no pointer to rest on the frame; focus is the pause a keyboard or
    // remote reader can reach, and it is the platform's `group-focus-within`.
    await act(async () => {
      fireEvent(view.getByTestId("marquee"), "focus");
    });

    expect(animation.stop).toHaveBeenCalled();

    await act(async () => {
      fireEvent(view.getByTestId("marquee"), "blur");
    });

    expect(animation.start).toHaveBeenCalledTimes(2);
  });

  it("does not pause on focus unless pauseOnHover asked it to", async () => {
    const view = await renderMarquee(
      <Marquee testID="marquee">{ITEMS}</Marquee>,
    );

    await reportSetSize(view, SET_SIZE);

    const animation = loop.mock.results[0]?.value as ReturnType<
      typeof compositeAnimation
    >;

    await act(async () => {
      fireEvent(view.getByTestId("marquee"), "focus");
    });

    expect(animation.stop).not.toHaveBeenCalled();
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

  // `COMP-057`: the fallback said `pauseOnHover: true` and `fadeEdges: true` while the
  // registered defaults and the documented defaults said false, so an option changed meaning
  // when the fallback tier answered.
  it("falls back to the values it registers", () => {
    expect(FALLBACK_NATIVE_MARQUEE_CONFIG.pauseOnHover).toBe(false);
    expect(FALLBACK_NATIVE_MARQUEE_CONFIG.fadeEdges).toBe(false);
    expect(FALLBACK_NATIVE_MARQUEE_CONFIG.pauseOnHover).toBe(
      defaultNativeMarqueeConfig.pauseOnHover,
    );
    expect(FALLBACK_NATIVE_MARQUEE_CONFIG.fadeEdges).toBe(
      defaultNativeMarqueeConfig.fadeEdges,
    );
  });

  it("renders safely when there are no items", async () => {
    const view = await renderMarquee(<Marquee>{[]}</Marquee>);

    expect(view.getByTestId("marquee-track")).toBeTruthy();
    expect(view.getAllByTestId("marquee-set")).toHaveLength(1);
  });
});
