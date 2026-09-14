import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectAccessibleName,
  expectState,
  makeConfig,
  pressKey,
  renderWithProvider,
} from "../../test";
import { Button } from "./Button";

/** Match a utility as a complete class, not as a substring of a variant. */
const hasClass = (className: string, utility: string): boolean =>
  new RegExp(`(?:^|\\s)${utility}(?:\\s|$)`).test(className);

describe("Button", () => {
  it("renders an accessible button and activates it on click", async () => {
    const user = createUser();
    const onClick = vi.fn();
    const { getByRole } = renderWithProvider(
      <Button onClick={onClick}>Save</Button>,
    );
    const button = getByRole("button", { name: "Save" });

    expectAccessibleName(button, "Save");

    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("activates with the keyboard and shows focus", async () => {
    const user = createUser();
    const onClick = vi.fn();
    const { getByRole } = renderWithProvider(
      <Button onClick={onClick}>Save</Button>,
    );
    const button = getByRole("button", { name: "Save" });

    await user.tab();
    expect(button).toHaveFocus();

    await pressKey(user, "Enter");
    expect(onClick).toHaveBeenCalledTimes(1);

    await pressKey(user, " ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("applies an explicit variant over the global default", () => {
    const { getByRole } = renderWithProvider(
      <Button variant="ghost">Ghost</Button>,
      { config: makeConfig({ defaultVariant: "solid" }) },
    );

    expect(hasClass(getByRole("button").className, "bg-transparent")).toBe(true);
  });

  it("inherits the global default variant when no prop is given", () => {
    const { getByRole } = renderWithProvider(<Button>Default</Button>, {
      config: makeConfig({ defaultVariant: "solid", defaultColor: "primary" }),
    });

    expect(hasClass(getByRole("button").className, "bg-primary")).toBe(true);
  });

  it("lets component configuration override the global default", () => {
    const { getByRole } = renderWithProvider(
      <Button>Configured</Button>,
      {
        config: makeConfig({
          defaultVariant: "ghost",
          components: { button: { variant: "solid" } },
        }),
      },
    );

    expect(hasClass(getByRole("button").className, "bg-primary")).toBe(true);
  });

  it("lets consumer classes win over framework classes", () => {
    const { getByRole } = renderWithProvider(
      <Button className="bg-danger">Danger</Button>,
    );

    expect(hasClass(getByRole("button").className, "bg-danger")).toBe(true);
    expect(hasClass(getByRole("button").className, "bg-primary")).toBe(false);
  });

  it("honours the animate option", () => {
    const animated = renderWithProvider(<Button>Animated</Button>);
    const staticButton = renderWithProvider(<Button animate={false}>Static</Button>);

    expect(
      animated.getByRole("button", { name: "Animated" }).className,
    ).toContain("motion-safe:transition-transform");
    expect(
      staticButton.getByRole("button", { name: "Static" }).className,
    ).not.toContain("motion-safe:transition-transform");
  });

  it("does not interact when disabled", async () => {
    const user = createUser();
    const onClick = vi.fn();
    const { getByRole } = renderWithProvider(
      <Button isDisabled onClick={onClick}>
        Disabled
      </Button>,
    );
    const button = getByRole("button");

    expectState(button, { disabled: true });
    expect(button).toHaveAttribute("aria-disabled", "true");

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("exposes a busy state, keeps its name and blocks interaction while loading", async () => {
    const user = createUser();
    const onClick = vi.fn();
    const { getByRole, queryByText } = renderWithProvider(
      <Button isLoading onClick={onClick}>
        Save
      </Button>,
    );
    const button = getByRole("button");

    expect(button).toHaveAttribute("aria-busy", "true");
    // The label stays in the accessible name while the control is busy, so a
    // reader still hears which action is running.
    expect(button).toHaveAccessibleName(/Save/);
    expect(queryByText("Loading")).not.toBeNull();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders as a link when an href is provided", () => {
    const { getByRole } = renderWithProvider(
      <Button href="/docs">Documentation</Button>,
    );
    const link = getByRole("link", { name: "Documentation" });

    expect(link).toHaveAttribute("href", "/docs");
  });
});
