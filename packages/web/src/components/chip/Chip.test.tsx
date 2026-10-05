import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectState,
  renderWithProvider,
  within,
} from "../../test";
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
