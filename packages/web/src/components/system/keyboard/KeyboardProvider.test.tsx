import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  fireEvent,
  renderWithProvider,
  useFakeTimers,
} from "../../../test";
import { useKeyboard } from "./KeyboardContext";
import { KeyboardProvider } from "./KeyboardProvider";
import { useKeyboardField } from "./use-keyboard-field";

/**
 * A field wired the way `Input` and `Textarea` wire one. `layout` is the
 * per-field override the field promises; omitting it is the provider-default
 * case.
 */
function Field({
  id,
  label,
  layout,
}: {
  id: string;
  label: string;
  layout?: "numeric" | undefined;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { handleFocus, handleBlur } = useKeyboardField(
    id,
    ref,
    true,
    layout ? { layout } : undefined,
  );

  return (
    <input
      aria-label={label}
      ref={ref}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}

/** Opens and requests a close for a real input element through the context. */
function CloseHarness() {
  const { openKeyboard, requestClose } = useKeyboard();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input aria-label="Field" ref={inputRef} />
      <button
        type="button"
        onClick={() => {
          if (inputRef.current) openKeyboard("field", inputRef.current);
        }}>
        Show keyboard
      </button>
      <button type="button" onClick={() => requestClose("field")}>
        Leave field
      </button>
    </>
  );
}

const keyboardRegion = { name: "Virtual Keyboard" } as const;

describe("KeyboardProvider", () => {
  it("opens the layout a field asked for instead of the provider default", async () => {
    const user = createUser();
    const { getByRole, queryByRole } = renderWithProvider(
      <KeyboardProvider>
        <Field id="quantity" label="Quantity" layout="numeric" />
        <Field id="name" label="Name" />
      </KeyboardProvider>,
    );

    await user.click(getByRole("textbox", { name: "Quantity" }));

    expect(getByRole("region", keyboardRegion)).toBeInTheDocument();
    // The numeric layout has no `q`; the default one does.
    expect(queryByRole("button", { name: "q" })).toBeNull();
    expect(getByRole("button", { name: "Clear" })).toBeInTheDocument();

    // A field with no override still opens the provider's layout.
    await user.click(getByRole("textbox", { name: "Name" }));
    expect(getByRole("button", { name: "q" })).toBeInTheDocument();
  });

  it("uses the registered 500 ms close delay when the provider states none", () => {
    const timers = useFakeTimers();

    try {
      const { getByRole, queryByRole } = renderWithProvider(
        <KeyboardProvider>
          <CloseHarness />
        </KeyboardProvider>,
      );

      // Real timers would make the boundary depend on how long the clicks
      // take, so the clicks are dispatched directly and time is advanced by
      // the test.
      fireEvent.click(getByRole("button", { name: "Show keyboard" }));
      fireEvent.click(getByRole("button", { name: "Leave field" }));

      timers.advance(499);
      expect(getByRole("region", keyboardRegion)).toBeInTheDocument();

      timers.advance(1);
      expect(queryByRole("region", keyboardRegion)).toBeNull();
    } finally {
      timers.restore();
    }
  });

  it("lets the registered closeDelay reach the provider through the configuration", () => {
    const timers = useFakeTimers();

    try {
      const { getByRole, queryByRole } = renderWithProvider(
        <KeyboardProvider>
          <CloseHarness />
        </KeyboardProvider>,
        { config: { components: { keyboard: { closeDelay: 200 } } } },
      );

      fireEvent.click(getByRole("button", { name: "Show keyboard" }));
      fireEvent.click(getByRole("button", { name: "Leave field" }));

      timers.advance(199);
      expect(getByRole("region", keyboardRegion)).toBeInTheDocument();

      timers.advance(1);
      expect(queryByRole("region", keyboardRegion)).toBeNull();
    } finally {
      timers.restore();
    }
  });

  it("keeps an open keyboard and its layout when the same field takes focus back", () => {
    const timers = useFakeTimers();

    try {
      const { getAllByRole, getByRole } = renderWithProvider(
        <KeyboardProvider>
          <Field id="name" label="Name" />
        </KeyboardProvider>,
      );
      const field = getByRole("textbox", { name: "Name" });

      fireEvent.focus(field);
      fireEvent.click(getByRole("button", { name: "Symbols" }));
      expect(
        getAllByRole("button", { name: "Letters" }).length,
      ).toBeGreaterThan(0);

      // The field loses focus and takes it back inside the close delay.
      fireEvent.blur(field);
      fireEvent.focus(field);
      timers.advance(600);

      // Returning to the same field cancels the pending close and keeps the
      // layout the reader was using.
      expect(getByRole("region", keyboardRegion)).toBeInTheDocument();
      expect(
        getAllByRole("button", { name: "Letters" }).length,
      ).toBeGreaterThan(0);
    } finally {
      timers.restore();
    }
  });

  it("stays open when a keyboard-only reader tabs into it", async () => {
    const timers = useFakeTimers({ shouldAdvanceTime: true });

    try {
      const user = createUser({ advanceTimers: vi.advanceTimersByTime });
      const { getByRole } = renderWithProvider(
        <KeyboardProvider>
          <Field id="name" label="Name" />
        </KeyboardProvider>,
      );

      const field = getByRole("textbox", { name: "Name" }) as HTMLInputElement;
      await user.click(field);

      const firstKey = getByRole("button", { name: "1" });
      const secondKey = getByRole("button", { name: "2" });

      await user.tab();

      // Tab moves from the field to the keyboard's first key, and the field's
      // blur must not be read as "the reader left".
      expect(document.activeElement).toBe(firstKey);
      timers.advance(600);
      expect(getByRole("region", keyboardRegion)).toBeInTheDocument();

      // Arrows walk the grid, and the key can be pressed from the keyboard.
      await user.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(secondKey);

      await user.keyboard("{Enter}");
      timers.advance(50);
      expect(field.value).toBe("2");

      // Typing from the keyboard leaves focus on the key rather than pulling it
      // back to the field, so the reader does not have to tab in again.
      expect(document.activeElement).toBe(secondKey);
    } finally {
      timers.restore();
    }
  });

  it("closes when disabled becomes true and does not re-show when it is lifted", async () => {
    const user = createUser();
    const enabled = (
      <KeyboardProvider>
        <CloseHarness />
      </KeyboardProvider>
    );
    const disabled = (
      <KeyboardProvider disabled>
        <CloseHarness />
      </KeyboardProvider>
    );
    const { getByRole, queryByRole, rerender } = renderWithProvider(enabled);

    await user.click(getByRole("button", { name: "Show keyboard" }));
    expect(getByRole("region", keyboardRegion)).toBeInTheDocument();

    rerender(disabled);
    expect(queryByRole("region", keyboardRegion)).toBeNull();

    // Nobody opened a keyboard while it was disabled, so none comes back.
    rerender(enabled);
    expect(queryByRole("region", keyboardRegion)).toBeNull();
  });
});
