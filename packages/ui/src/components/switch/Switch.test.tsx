import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectAccessibleName,
  expectState,
  makeComponentConfig,
  pressKey,
  renderWithProvider,
} from "../../test";
import { Switch } from "./Switch";

/**
 * The visual track is the first `div` inside the label wrapper, which also
 * contains the visually hidden input and the thumb. The wrapper itself is the
 * label's first `div`, so the track is the wrapper's first `div` child.
 */
function getTrack(control: HTMLElement): HTMLElement | null {
  const wrapper = control.closest("label")?.querySelector("div");
  return wrapper?.querySelector("div") ?? null;
}

describe("Switch", () => {
  it("exposes switch semantics with the label as its accessible name", () => {
    const { getByRole } = renderWithProvider(<Switch label="Notifications" />);
    const control = getByRole("switch");

    expectAccessibleName(control, "Notifications");
    expectState(control, { checked: false });
  });

  it("toggles on pointer activation and reports the new state", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" onChange={onChange} />,
    );
    const control = getByRole("switch");

    await user.click(control);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBe(true);
    expectState(control, { checked: true });
  });

  it("toggles with the Space key from the tab order", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" onChange={onChange} />,
    );
    const control = getByRole("switch");

    await user.tab();
    expect(control).toHaveFocus();

    await pressKey(user, " ");

    expect(onChange).toHaveBeenCalledTimes(1);
    expectState(control, { checked: true });
  });

  it("does not self-update when controlled", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" checked onChange={onChange} />,
    );
    const control = getByRole("switch");

    await user.click(control);

    expect(onChange).toHaveBeenCalledTimes(1);
    expectState(control, { checked: true });
  });

  it("does not interact when disabled", async () => {
    const user = createUser();
    const onChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" disabled onChange={onChange} />,
    );
    const control = getByRole("switch");

    expectState(control, { disabled: true });

    await user.click(control);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("exposes a busy and disabled state while loading", () => {
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" isLoading />,
    );
    const control = getByRole("switch");

    expectState(control, { disabled: true });
    expect(control).toHaveAttribute("aria-busy", "true");
  });

  it("applies the configured colour to the checked track", () => {
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" defaultChecked />,
      { config: makeComponentConfig("switch", { color: "danger" }) },
    );
    const track = getTrack(getByRole("switch"));

    expect(track).not.toBeNull();
    expect(track?.className).toContain("bg-danger");
  });

  it("uses the registered switch radius by default", () => {
    const { getByRole } = renderWithProvider(
      <Switch label="Notifications" defaultChecked />,
    );
    const track = getTrack(getByRole("switch"));

    expect(track).not.toBeNull();
    expect(track?.className).toContain("rounded-full");
  });

  // Defect register (M1): `FieldShell` renders the description and message
  // elements, but Switch never links them to the control with
  // `aria-describedby`, unlike Input, Textarea, Dropmenu and MultiSelect. The
  // behaviour is recorded here rather than asserted, because M1 does not change
  // component implementations.
  it.todo(
    "associates its description and error message with the control via aria-describedby (defect register)",
  );
});
