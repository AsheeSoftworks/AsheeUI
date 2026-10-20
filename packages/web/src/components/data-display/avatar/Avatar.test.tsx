import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  fireEvent,
  makeComponentConfig,
  renderWithProvider,
  within,
} from "../../../test";
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

  it("tries a new picture after the previous one failed", () => {
    // A list recycles the avatar slot for the next entity. The failure belonged to
    // the old source, so the new one has to be tried rather than inheriting the
    // fallback it never earned.
    const { container, getByText, queryByText, rerender } = renderWithProvider(
      <Avatar name="Grace Hopper" src="/grace.png" />,
    );
    fireEvent.error(container.querySelector("img") as HTMLImageElement);
    expect(getByText("GH")).toBeInTheDocument();

    rerender(<Avatar name="Grace Hopper" src="/grace-2.png" />);

    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "/grace-2.png",
    );
    expect(queryByText("GH")).toBeNull();
  });

  it("keeps the fallback when the source that failed is rendered again", () => {
    // The same source is the same answer: re-rendering must not retry it on every
    // pass, which would flicker between the initials and a broken picture.
    const { container, getByText, rerender } = renderWithProvider(
      <Avatar name="Grace Hopper" src="/grace.png" />,
    );
    fireEvent.error(container.querySelector("img") as HTMLImageElement);

    rerender(<Avatar name="Grace Hopper" src="/grace.png" />);

    expect(getByText("GH")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
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

  // A circle with a flat right edge is what a flex item does when it shrinks: the avatar is a flex
  // container, so the initials span and the picture both resolved `size-full` against their content and
  // stopped short of the 40px circle, which then clipped them into a "D". `shrink-0` is the fix, so it is
  // the thing worth asserting.
  it("fills its circle instead of shrinking to its content", () => {
    const initials = renderWithProvider(
      <Avatar name="Ada Lovelace" color="success" />,
    );
    const fallback = within(initials.container).getByText("AL");

    expect(fallback.className).toContain("shrink-0");
    expect(fallback.className).toContain("size-full");

    const picture = renderWithProvider(
      <Avatar name="Ada Lovelace" src="/ada.png" />,
    );
    const image = picture.container.querySelector("img");

    expect(image?.className).toContain("shrink-0");
    expect(image?.className).toContain("size-full");
  });

  it("hydrates its server markup without a mismatch", () => {
    expectHydrationClean(<Avatar name="Ada Lovelace" />);
    expectHydrationClean(<Avatar name="Ada Lovelace" src="/ada.png" />);
  });
});
