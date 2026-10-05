import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { createUser, renderWithProvider } from "../../test";
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
});
