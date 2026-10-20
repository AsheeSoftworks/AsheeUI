import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectState,
  renderWithProvider,
  within,
} from "../../../test";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("renders its label", () => {
    const { getByText } = renderWithProvider(<Chip>Tag</Chip>);

    expect(getByText("Tag")).toBeInTheDocument();
  });

  it("offers a remove control with an accessible name only when closable", () => {
    const closable = renderWithProvider(<Chip onClose={() => {}}>Tag</Chip>);
    const plain = renderWithProvider(<Chip>Plain</Chip>);

    expect(
      within(closable.container).getByRole("button", { name: "Remove chip" }),
    ).toBeInTheDocument();
    expect(within(plain.container).queryByRole("button")).toBeNull();
  });

  it("fires onClose from the remove control", async () => {
    const user = createUser();
    const onClose = vi.fn();
    const { getByRole } = renderWithProvider(
      <Chip onClose={onClose}>Tag</Chip>,
    );

    await user.click(getByRole("button", { name: "Remove chip" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("removes a chip from the keyboard without pressing it", async () => {
    // The remove control is a real button, so the chip's own Enter/Space handling
    // must leave the keystroke alone: pressing the remove control closes the chip,
    // and the chip's handler belongs to the chip, not to the button inside it.
    const user = createUser();
    const onClose = vi.fn();
    const onClick = vi.fn();
    const { getByRole } = renderWithProvider(
      <Chip onClick={onClick} onClose={onClose}>
        Tag
      </Chip>,
    );
    const remove = getByRole("button", { name: "Remove chip" });

    remove.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClose).toHaveBeenCalledTimes(2);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("removes a closable chip that has no press of its own", async () => {
    // The common case: a token that can only be removed. Before, the chip's own
    // handler swallowed the keystroke and cancelled the button's activation, so
    // the chip could not be closed at all from the keyboard.
    const user = createUser();
    const onClose = vi.fn();
    const { getByRole } = renderWithProvider(
      <Chip onClose={onClose}>Tag</Chip>,
    );
    const remove = getByRole("button", { name: "Remove chip" });

    remove.focus();
    await user.keyboard("{Enter}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("cannot be closed while disabled", async () => {
    const user = createUser();
    const onClose = vi.fn();
    const { getByRole } = renderWithProvider(
      <Chip isDisabled onClose={onClose}>
        Tag
      </Chip>,
    );
    const remove = getByRole("button", { name: "Remove chip" });

    expectState(remove, { disabled: true });

    await user.click(remove);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("presses a pressable chip from the keyboard", async () => {
    const user = createUser();
    const onClick = vi.fn();
    const { getByRole } = renderWithProvider(
      <Chip onClick={onClick}>Filter</Chip>,
    );
    const chip = getByRole("button", { name: "Filter" });

    await user.tab();
    expect(chip).toHaveFocus();

    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(2);
    // The handler is given the keystroke that happened, not a fabricated mouse
    // event with coordinates the chip never had.
    expect(onClick.mock.calls[0]![0].type).toBe("keydown");
  });

  it("is a token rather than a tab stop when it has no press", async () => {
    const user = createUser();
    const { getByTestId } = renderWithProvider(
      <Chip data-testid="chip">Topic</Chip>,
    );
    const chip = getByTestId("chip");

    expect(chip).not.toHaveAttribute("role");
    expect(chip).not.toHaveAttribute("tabindex");

    await user.tab();
    expect(chip).not.toHaveFocus();
  });

  it("states that it is disabled only while it is", () => {
    const enabled = renderWithProvider(
      <Chip data-testid="enabled-chip" onClick={() => {}}>
        Tag
      </Chip>,
    );
    const disabled = renderWithProvider(
      <Chip data-testid="disabled-chip" isDisabled onClick={() => {}}>
        Tag
      </Chip>,
    );

    expect(enabled.getByTestId("enabled-chip")).not.toHaveAttribute(
      "aria-disabled",
    );
    expect(disabled.getByTestId("disabled-chip")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    // A disabled control is not a tab stop, as a native disabled button is not.
    expect(disabled.getByTestId("disabled-chip")).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("draws an avatar in a slot larger than an icon's", () => {
    // An avatar is a picture rather than a glyph, so it takes more of the chip:
    // reusing the icon's box drew a face at 12 points.
    const { getByTestId } = renderWithProvider(
      <Chip size="sm" avatar={<span data-testid="avatar" />}>
        Tag
      </Chip>,
    );
    const slot = getByTestId("avatar").parentElement as HTMLElement;

    expect(slot.className).toContain("size-4");
    expect(slot.className).not.toContain("size-3");
    expect(slot.className).toContain("overflow-hidden");
    // A node that states a diameter of its own is held to the slot, not cropped.
    expect(slot.className).toContain("[&>*]:max-w-full");
  });

  it("sizes the icon slot and the drawing inside it", () => {
    // The slot and the SVG are two rules: a consumer's icon usually carries a size
    // of its own, and a box around it only clips what it draws.
    const { getByTestId } = renderWithProvider(
      <Chip size="md" startIcon={<svg data-testid="icon" />}>
        Tag
      </Chip>,
    );
    const slot = getByTestId("icon").parentElement as HTMLElement;

    expect(slot.className).toContain("size-3.5");
    expect(slot.className).toContain("[&_svg]:size-3.5");
  });

  it("uses the registered radius and honours a radius override", () => {
    const { container } = renderWithProvider(
      <>
        <Chip id="chip-default">Tag</Chip>
        <Chip id="chip-square" radius="none">
          Tag
        </Chip>
      </>,
    );

    expect(container.querySelector("#chip-default")?.className).toContain(
      "rounded-full",
    );
    expect(container.querySelector("#chip-square")?.className).toContain(
      "rounded-none",
    );
  });
});
