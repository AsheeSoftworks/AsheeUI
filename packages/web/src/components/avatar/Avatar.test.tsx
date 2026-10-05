import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  fireEvent,
  makeComponentConfig,
  renderWithProvider,
  within,
} from "../../test";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("represents the entity as a single named image", () => {
    const { getByRole } = renderWithProvider(
      <Avatar name="Ada Lovelace" src="/ada.png" />,
    );

    expect(getByRole("img", { name: "Ada Lovelace" })).toBeInTheDocument();
  });

  it("keeps the picture beside the name as decoration", () => {
    const { container } = renderWithProvider(
      <Avatar name="Ada Lovelace" src="/ada.png" />,
    );
    const image = container.querySelector("img");

    expect(image).not.toBeNull();
    expect(image).toHaveAttribute("alt", "");
  });

  it("falls back to the entity's initials when there is no picture", () => {
    const { getByText } = renderWithProvider(<Avatar name="Ada Lovelace" />);

    expect(getByText("AL")).toBeInTheDocument();
  });

  it("falls back to the initials when the picture fails to load", () => {
    const { container, getByText } = renderWithProvider(
      <Avatar name="Grace Hopper" src="/grace.png" />,
    );
    const image = container.querySelector("img") as HTMLImageElement;

    fireEvent.error(image);

    expect(getByText("GH")).toBeInTheDocument();
  });

  it("accepts a fallback of its own", () => {
    const { getByText, queryByText } = renderWithProvider(
      <Avatar name="Ada Lovelace" fallback={<span>Guest</span>} />,
    );

    expect(getByText("Guest")).toBeInTheDocument();
    expect(queryByText("AL")).toBeNull();
  });

  it("prefers the alternative name for assistive technology", () => {
    const { getByRole } = renderWithProvider(
      <Avatar name="Ada Lovelace" alt="Signed in as Ada" />,
    );

    expect(getByRole("img", { name: "Signed in as Ada" })).toBeInTheDocument();
  });

  it("hides an avatar that names nothing from assistive technology", () => {
    const { container } = renderWithProvider(
      <Avatar id="mark" src="/logo.png" />,
    );
    const avatar = container.querySelector("#mark") as HTMLElement;

    expect(avatar).toHaveAttribute("aria-hidden", "true");
    expect(avatar).not.toHaveAttribute("aria-label");
    expect(avatar.querySelector('[role="img"]')).toBeNull();
  });

  it("resolves the configured size, colour and radius and honours overrides", () => {
    const configured = renderWithProvider(
      <Avatar id="configured" name="Ada" />,
      {
        config: makeComponentConfig("avatar", {
          size: "lg",
          color: "danger",
          radius: "none",
        }),
      },
    );
    const overridden = renderWithProvider(
      <Avatar
        id="overridden"
        name="Ada"
        size="sm"
        color="success"
        radius="full"
      />,
      {
        config: makeComponentConfig("avatar", {
          size: "lg",
          color: "danger",
          radius: "none",
        }),
      },
    );
    const configuredAvatar = within(configured.container).getByRole("img");
    const overriddenAvatar = within(overridden.container).getByRole("img");

    expect(configuredAvatar.className).toContain("size-12");
    expect(configuredAvatar.className).toContain("rounded-none");
    expect(configured.container.innerHTML).toContain("danger");

    expect(overriddenAvatar.className).toContain("size-8");
    expect(overriddenAvatar.className).toContain("rounded-full");
    expect(overridden.container.innerHTML).toContain("success");
  });

  it("hydrates its server markup without a mismatch", () => {
    expectHydrationClean(<Avatar name="Ada Lovelace" />);
    expectHydrationClean(<Avatar name="Ada Lovelace" src="/ada.png" />);
  });
});
