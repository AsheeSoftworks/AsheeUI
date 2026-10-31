/**
 * The event vocabulary both renderers resolve through.
 *
 * These are the rules a component cannot state for itself: which name runs first, whether
 * passing both names means both run, and what the `onChange` shim actually contains. Every
 * assertion here is a promise a shared component makes to a consumer who copied a handler
 * from the other platform.
 */

import { describe, expect, it, vi } from "vitest";
import {
  type ChangeHandlers,
  type PressHandlers,
  resolveChange,
  resolvePress,
} from "./press";

/**
 * Label a call with the handler that made it.
 *
 * The order the handlers ran in is the assertion, so the list has to record the name rather
 * than a count: two handlers that both ran is not enough if the wrong one ran first.
 *
 * @param calls - The list the name is appended to.
 * @param name - The handler's name.
 * @returns A function that records the name and its argument.
 */
function record(calls: unknown[], name: string) {
  return (value: unknown) => {
    calls.push([name, value]);
  };
}

describe("resolvePress", () => {
  it("runs onClick before onPress when both were given", () => {
    const calls: unknown[] = [];
    const event = { type: "press" as const };

    resolvePress(
      { onClick: record(calls, "onClick"), onPress: () => calls.push(["onPress"]) },
      event,
    );

    expect(calls).toEqual([
      ["onClick", event],
      ["onPress"],
    ]);
  });

  it("runs the one handler it was given", () => {
    const onClick = vi.fn();
    const onPress = vi.fn();

    resolvePress({ onClick }, { type: "press" as const });
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();

    onClick.mockClear();
    resolvePress({ onPress }, { type: "press" as const });
    expect(onClick).not.toHaveBeenCalled();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does nothing when neither name was given", () => {
    // A component calls the resolver unconditionally, because it cannot know whether the
    // consumer passed a handler; the resolver is what makes that safe. The type states the
    // same thing: every handler is optional, which is why a renderer can pass the props
    // object it destructured without checking each name first.
    const shapes: PressHandlers<{ type: "press" }>[] = [
      {},
      { onClick: vi.fn() },
      { onPress: vi.fn() },
    ];

    for (const handlers of shapes) {
      expect(() =>
        resolvePress(handlers, { type: "press" }),
      ).not.toThrow();
    }
  });

  it("hands onClick the event it was called with, unchanged", () => {
    let received: unknown;
    const event = { type: "press" as const, id: "row-3" };

    resolvePress({ onClick: (value) => (received = value) }, event);

    expect(received).toBe(event);
  });
});

describe("resolveChange", () => {
  it("runs every name the caller gave, in onChange → onChangeText → onValueChange order", () => {
    const calls: unknown[] = [];

    resolveChange(
      {
        onChange: record(calls, "onChange"),
        onChangeText: record(calls, "onChangeText"),
        onValueChange: record(calls, "onValueChange"),
      },
      "next",
    );

    expect(calls.map(([name]) => name)).toEqual([
      "onChange",
      "onChangeText",
      "onValueChange",
    ]);
  });

  it("hands onChange the value inside the event shim the web's forms read", () => {
    const onChange = vi.fn();

    resolveChange({ onChange }, "typed");

    expect(onChange).toHaveBeenCalledWith({ target: { value: "typed" } });
    // The shim carries the value and nothing else: a handler that reaches for a method the
    // DOM would have is on the web, and the comment in `press.ts` says so.
    const event = onChange.mock.calls[0]?.[0] as
      | { target: Record<string, unknown> }
      | undefined;
    expect(Object.keys(event ?? {})).toEqual(["target"]);
    expect(Object.keys(event?.target ?? {})).toEqual(["value"]);
  });

  it("hands both platform names the value itself", () => {
    const onChangeText = vi.fn();
    const onValueChange = vi.fn();

    resolveChange({ onChangeText, onValueChange }, "value");

    expect(onChangeText).toHaveBeenCalledWith("value");
    expect(onValueChange).toHaveBeenCalledWith("value");
  });

  it("runs the one name it was given and leaves the others alone", () => {
    const onChange = vi.fn();
    const onChangeText = vi.fn();

    resolveChange({ onChangeText }, "value");

    expect(onChangeText).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does nothing when no name was given", () => {
    // Every name is optional, which is what lets a renderer hand over the props object it
    // destructured without checking each name first.
    const shapes: ChangeHandlers[] = [
      {},
      { onChange: vi.fn() },
      { onChangeText: vi.fn() },
      { onValueChange: vi.fn() },
    ];

    for (const handlers of shapes) {
      expect(() => resolveChange(handlers, "value")).not.toThrow();
    }
  });
});
