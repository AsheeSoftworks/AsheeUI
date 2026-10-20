import type { Variant } from "@asheeui/core";
import type { ElementType } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  makeComponentConfig,
  makeConfig,
  pressKey,
  renderWithProvider,
} from "../../../test";
import { Card } from "./Card";

describe("Card", () => {
  it("renders title, description and body content", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Card title="Post title" description="Supporting text">
        Body content
      </Card>,
    );

    expect(getByRole("heading", { name: "Post title" })).toBeInTheDocument();
    expect(getByText("Supporting text")).toBeInTheDocument();
    expect(getByText("Body content")).toBeInTheDocument();
  });

  it("renders the title as an h3 by default", () => {
    const { getByRole } = renderWithProvider(<Card title="Post title" />);

    expect(getByRole("heading", { level: 3, name: "Post title" }).tagName).toBe(
      "H3",
    );
  });

  it("renders the title through titleAs so it fits the surrounding outline", () => {
    const { getByRole } = renderWithProvider(
      <>
        <Card id="page-card" title="Page title" titleAs="h1" />
        <Card id="nested-card" title="Nested title" titleAs="h4" />
      </>,
    );

    expect(getByRole("heading", { level: 1, name: "Page title" }).tagName).toBe(
      "H1",
    );
    expect(
      getByRole("heading", { level: 4, name: "Nested title" }).tagName,
    ).toBe("H4");
  });

  it("is inert and not focusable by default", () => {
    const { container } = renderWithProvider(
      <Card id="inert-card">Static</Card>,
    );
    const card = container.querySelector("#inert-card");

    expect(card).toHaveAttribute("tabindex", "-1");
    expect(card).not.toHaveAttribute("role");
    expect(card).not.toHaveAttribute("aria-disabled");
  });

  it("becomes a keyboard-operable button when clickable", async () => {
    const user = createUser();
    const onClick = vi.fn();
    const { getByRole } = renderWithProvider(
      <Card isClickable onClick={onClick}>
        Interactive
      </Card>,
    );
    const card = getByRole("button");

    expect(card).toHaveAttribute("tabindex", "0");

    card.focus();
    await pressKey(user, "Enter");
    expect(onClick).toHaveBeenCalledTimes(1);

    await pressKey(user, " ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("exposes link semantics when a link is configured", () => {
    const { getByRole } = renderWithProvider(
      <Card isClickable link={{ componentProps: { href: "/blog/post-1" } }}>
        Linked
      </Card>,
    );
    const card = getByRole("link");

    expect(card).toHaveAttribute("href", "/blog/post-1");
  });

  it("merges a link's own className into the card's classes instead of replacing them", () => {
    // `componentProps` is documented as *additional* props for the link, so a
    // class there has to be additive: spreading it last would have deleted the
    // card's whole surface class string.
    const { getByRole } = renderWithProvider(
      <Card link={{ componentProps: { href: "/blog", className: "group" } }}>
        Linked
      </Card>,
    );
    const card = getByRole("link");

    expect(card.className).toContain("group");
    expect(card.className).toContain("border-border");
    expect(card.className).toContain("bg-background");
  });

  it("keeps a real link in the tab order when isClickable is false", () => {
    // `isClickable` states whether the card reacts to input itself. Turning it off
    // does not delete the anchor the consumer asked for, so the browser's own focus
    // behaviour has to survive: a link that is in the tab order is the whole point
    // of rendering one.
    const { getByRole } = renderWithProvider(
      <Card
        isClickable={false}
        link={{ componentProps: { href: "/blog/post-1" } }}>
        Linked
      </Card>,
    );
    const card = getByRole("link");

    expect(card).toHaveAttribute("href", "/blog/post-1");
    expect(card).toHaveAttribute("tabindex", "0");
  });

  it("keeps a custom link component in the tab order when isClickable is false", () => {
    // A custom link component renders its own anchor or router link, so the card
    // cannot know whether an `href` was forwarded to it. The component itself is
    // the promise that a link exists, and that promise keeps the card focusable.
    const CustomLink: ElementType = (props) => <a {...props} />;
    const { getByRole } = renderWithProvider(
      <Card
        isClickable={false}
        link={{ component: CustomLink, componentProps: { href: "/docs" } }}>
        Linked
      </Card>,
    );

    expect(getByRole("link")).toHaveAttribute("tabindex", "0");
  });

  it("blocks interaction while disabled", async () => {
    const user = createUser();
    const onClick = vi.fn();
    const { getByRole } = renderWithProvider(
      <Card isClickable isDisabled onClick={onClick}>
        Disabled
      </Card>,
    );
    const card = getByRole("button");

    expect(card).toHaveAttribute("aria-disabled", "true");
    expect(card).toHaveAttribute("tabindex", "-1");

    await user.click(card);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("leaves the tab order and states aria-disabled when a link is disabled", () => {
    const { getByRole } = renderWithProvider(
      <Card
        isClickable
        isDisabled
        link={{ componentProps: { href: "/blog/post-1" } }}>
        Disabled link
      </Card>,
    );
    const card = getByRole("link");

    expect(card).toHaveAttribute("tabindex", "-1");
    expect(card).toHaveAttribute("aria-disabled", "true");
  });

  it("emits aria-disabled only when the card is disabled", () => {
    const { container } = renderWithProvider(
      <>
        <Card id="enabled-card" isClickable>
          Enabled
        </Card>
        <Card id="disabled-card" isClickable isDisabled>
          Disabled
        </Card>
      </>,
    );

    // `aria-disabled="false"` on every card tells assistive technology nothing and
    // misstates an inert card, so the attribute is rendered only when it applies.
    expect(container.querySelector("#enabled-card")).not.toHaveAttribute(
      "aria-disabled",
    );
    expect(container.querySelector("#disabled-card")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("renders a top image with its alternative text", () => {
    const { getByRole } = renderWithProvider(
      <Card title="With image" image={{ src: "/cover.jpg", alt: "Cover" }}>
        Body
      </Card>,
    );

    expect(getByRole("img", { name: "Cover" })).toHaveAttribute(
      "src",
      "/cover.jpg",
    );
  });

  it("resolves the configured image ratio and fit through the cascade", () => {
    const { getByRole } = renderWithProvider(
      <Card
        title="Configured image"
        image={{ src: "/cover.jpg", alt: "Cover" }}>
        Body
      </Card>,
      {
        config: makeComponentConfig("card", {
          image: { ratio: "square", fit: "contain" },
        }),
      },
    );
    const image = getByRole("img", { name: "Cover" });

    expect(image.parentElement?.className).toContain("aspect-square");
    expect(image.className).toContain("object-contain");
  });

  it("lets the instance override the configured image ratio and fit", () => {
    const { getByRole } = renderWithProvider(
      <Card
        title="Instance image"
        image={{
          src: "/cover.jpg",
          alt: "Cover",
          ratio: "portrait",
          fit: "fill",
        }}>
        Body
      </Card>,
      {
        config: makeComponentConfig("card", {
          image: { ratio: "square", fit: "contain" },
        }),
      },
    );
    const image = getByRole("img", { name: "Cover" });

    expect(image.parentElement?.className).toContain("aspect-[3/4]");
    expect(image.className).toContain("object-fill");
  });

  it("renders a partial component config that states no image options", () => {
    // A consumer states only what it cares about; the image tier comes from the
    // registered defaults rather than from the consumer's object.
    const { container } = renderWithProvider(
      <Card id="partial-card">Body</Card>,
      { config: makeComponentConfig("card", { size: "lg" }) },
    );
    const card = container.querySelector("#partial-card") as HTMLElement;
    const content = card.querySelector("div") as HTMLElement;

    expect(card).toBeInTheDocument();
    expect(content.className).toContain("p-8");
  });

  it("renders a component config whose image section is null", () => {
    // JSON configuration can state `"image": null`, which replaces the object the
    // registered defaults supply. The card must fall back to its image defaults
    // instead of reading a property off null.
    const { container, getByText } = renderWithProvider(
      <Card id="null-image-card">Body</Card>,
      { config: makeComponentConfig("card", { image: null }) },
    );

    expect(container.querySelector("#null-image-card")).toBeInTheDocument();
    expect(getByText("Body")).toBeInTheDocument();
  });

  it("keeps its documented bordered surface for the framework default", () => {
    // The shipped `defaultVariant` is `faded`, which is a control treatment rather
    // than a card one. It resolves to the card's resting surface, so the documented
    // default is unchanged.
    const { container } = renderWithProvider(
      <Card id="default-card">Body</Card>,
    );
    const card = container.querySelector("#default-card") as HTMLElement;

    expect(card.className).toContain("border-border");
    expect(card.className).toContain("shadow-xs");
    expect(card.className).not.toContain("bg-transparent");
  });

  it.each<[Variant, string]>([
    ["solid", "shadow-md"],
    ["ghost", "bg-transparent"],
    ["bordered", "border-border"],
    ["faded", "border-border"],
  ])(
    "maps the framework treatment %s onto the matching card surface",
    (defaultVariant, expectedClass) => {
      // `defaultVariant` names a treatment the whole framework shares. Before the
      // translation it missed the card's class map and every card silently rendered
      // as `bordered`; now the treatment lands on the surface the card can draw.
      const { container } = renderWithProvider(
        <Card id="mapped-card">Body</Card>,
        { config: makeConfig({ defaultVariant }) },
      );
      const card = container.querySelector("#mapped-card") as HTMLElement;

      expect(card.className).toContain(expectedClass);
    },
  );

  it("lands a treatment a card cannot draw on its resting surface", () => {
    // A card has no baseline to rule, so `underlined` resolves to `bordered`
    // instead of rendering no treatment at all.
    const { container } = renderWithProvider(
      <Card id="underlined-card">Body</Card>,
      { config: makeConfig({ defaultVariant: "underlined" }) },
    );
    const card = container.querySelector("#underlined-card") as HTMLElement;

    expect(card.className).toContain("border-border");
    expect(card.className).not.toContain("undefined");
  });

  it("keeps a card treatment named on the instance", () => {
    const { container } = renderWithProvider(
      <>
        <Card id="flat-card" variant="flat">
          Body
        </Card>
        <Card id="elevated-card" variant="elevated">
          Body
        </Card>
      </>,
    );

    expect(
      (container.querySelector("#flat-card") as HTMLElement).className,
    ).toContain("bg-secondary/50");
    expect(
      (container.querySelector("#elevated-card") as HTMLElement).className,
    ).toContain("shadow-md");
  });
});
