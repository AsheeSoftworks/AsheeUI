import { describe, expect, it } from "vitest";
import {
  createUser,
  expectPortalled,
  pressKey,
  renderWithProvider,
  screen,
  waitFor,
} from "../../test";
import { Tooltip } from "./Tooltip";

const trigger = <button type="button">Trigger</button>;

describe("Tooltip", () => {
  it("stays hidden until the trigger is focused or hovered", () => {
    const { queryByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        {trigger}
      </Tooltip>,
    );

    expect(queryByRole("tooltip")).toBeNull();
  });

  it("opens on hover and describes the trigger", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        {trigger}
      </Tooltip>,
    );
    const target = getByRole("button", { name: "Trigger" });

    await user.hover(target);

    const tooltip = await screen.findByRole("tooltip");

    expect(tooltip).toHaveTextContent("Helpful text");
    expect(target.getAttribute("aria-describedby")).toContain(tooltip.id);
  });

  it("opens on keyboard focus", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        {trigger}
      </Tooltip>,
    );
    const target = getByRole("button", { name: "Trigger" });

    await user.tab();
    expect(target).toHaveFocus();

    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });

  it("closes again on Escape", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        {trigger}
      </Tooltip>,
    );

    await user.hover(getByRole("button", { name: "Trigger" }));
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();

    await pressKey(user, "Escape");

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).toBeNull();
    });
  });

  it("never opens when disabled", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0} isDisabled>
        {trigger}
      </Tooltip>,
    );

    await user.hover(getByRole("button", { name: "Trigger" }));

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("renders outside the trigger subtree when portalled", async () => {
    const user = createUser();
    const { getByRole, container } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0} portal>
        {trigger}
      </Tooltip>,
    );

    await user.hover(getByRole("button", { name: "Trigger" }));
    const tooltip = await screen.findByRole("tooltip");

    expectPortalled(tooltip, container);
  });
});

