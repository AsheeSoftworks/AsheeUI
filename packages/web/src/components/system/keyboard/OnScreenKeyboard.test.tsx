import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { createUser, renderWithProvider } from "../../../test";
import { useKeyboard } from "./KeyboardContext";
import { KeyboardProvider } from "./KeyboardProvider";

/** Opens and closes the on-screen keyboard for a real input element. */
function Harness() {
  const { openKeyboard, forceClose } = useKeyboard();
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
      <button type="button" onClick={() => forceClose()}>
        Hide keyboard
      </button>
    </>
  );
}

describe("OnScreenKeyboard", () => {
  it("stays closed until it is requested", () => {
    const { queryByRole } = renderWithProvider(
      <KeyboardProvider>
        <Harness />
      </KeyboardProvider>,
    );

    expect(queryByRole("region", { name: "Virtual Keyboard" })).toBeNull();
  });

  it("opens as a labelled region with labelled keys that type into the field", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <KeyboardProvider>
        <Harness />
      </KeyboardProvider>,
    );

    await user.click(getByRole("button", { name: "Show keyboard" }));

    expect(
      getByRole("region", { name: "Virtual Keyboard" }),
    ).toBeInTheDocument();

    const field = getByRole("textbox", { name: "Field" }) as HTMLInputElement;

    await user.click(getByRole("button", { name: "a" }));

    expect(field.value).toBe("a");
  });

  it("closes when the keyboard is dismissed", async () => {
    const user = createUser();
    const { getByRole, queryByRole } = renderWithProvider(
      <KeyboardProvider>
        <Harness />
      </KeyboardProvider>,
    );

    await user.click(getByRole("button", { name: "Show keyboard" }));
    expect(
      getByRole("region", { name: "Virtual Keyboard" }),
    ).toBeInTheDocument();

    await user.click(getByRole("button", { name: "Hide keyboard" }));

    expect(queryByRole("region", { name: "Virtual Keyboard" })).toBeNull();
  });

  it("never renders when the keyboard system is disabled", async () => {
    const user = createUser();
    const { getByRole, queryByRole } = renderWithProvider(
      <KeyboardProvider disabled>
        <Harness />
      </KeyboardProvider>,
    );

    await user.click(getByRole("button", { name: "Show keyboard" }));

    expect(queryByRole("region", { name: "Virtual Keyboard" })).toBeNull();
  });

  it("names the special keys by action while drawing their glyphs", async () => {
    const user = createUser();
    const { getAllByRole, getByRole } = renderWithProvider(
      <KeyboardProvider>
        <Harness />
      </KeyboardProvider>,
    );

    await user.click(getByRole("button", { name: "Show keyboard" }));

    expect(getByRole("button", { name: "Backspace" })).toHaveTextContent("⌫");
    expect(getByRole("button", { name: "Enter" })).toHaveTextContent("↵");
    // The default layout draws two shift keys, one at each end of its row.
    const shiftKeys = getAllByRole("button", { name: "Shift" });
    expect(shiftKeys).toHaveLength(2);
    for (const shiftKey of shiftKeys) {
      expect(shiftKey).toHaveTextContent("⇧");
    }
    expect(getByRole("button", { name: "Symbols" })).toHaveTextContent("?123");
    expect(getByRole("button", { name: "Space" })).toHaveTextContent("space");

    // `{abc}` only appears once the symbols layout is showing, and that layout
    // draws it more than once.
    await user.click(getByRole("button", { name: "Symbols" }));
    const lettersKeys = getAllByRole("button", { name: "Letters" });
    expect(lettersKeys.length).toBeGreaterThan(0);
    for (const lettersKey of lettersKeys) {
      expect(lettersKey).toHaveTextContent("ABC");
    }
  });

  it("honours the shift token in a custom layout and returns to it", async () => {
    const user = createUser();
    const { getByRole, queryByRole } = renderWithProvider(
      <KeyboardProvider
        layouts={{
          code: ["7 8 9", "{shift} 0 {bksp}"],
          shift: ["A B", "{shift} C {bksp}"],
          default: ["a b"],
        }}
        defaultLayout="code">
        <Harness />
      </KeyboardProvider>,
    );

    await user.click(getByRole("button", { name: "Show keyboard" }));
    expect(getByRole("button", { name: "7" })).toBeInTheDocument();
    expect(queryByRole("button", { name: "A" })).toBeNull();

    // Shift used to be ignored outside the default and shift layouts.
    await user.click(getByRole("button", { name: "Shift" }));
    expect(getByRole("button", { name: "A" })).toBeInTheDocument();

    // Pressing it again returns to the layout it came from, not to `default`.
    await user.click(getByRole("button", { name: "Shift" }));
    expect(getByRole("button", { name: "7" })).toBeInTheDocument();
  });
});
