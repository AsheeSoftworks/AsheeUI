import {
  resolveCarouselVariant,
  type ColumnDef,
  type Variant,
} from "@asheeui/core";
import type { ElementType } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BADGE_ICON_SIZE_CLASS } from "../../styles/badge";
import { CHIP_ICON_SIZE_CLASS } from "../../styles/chip";
import {
  createUser,
  expectFocused,
  expectHydrationClean,
  expectState,
  fireEvent,
  makeComponentConfig,
  makeConfig,
  pressArrow,
  pressKey,
  renderToServerString,
  renderWithProvider,
  screen,
  stubReducedMotion,
  useFakeTimers,
  userEvent,
  waitFor,
  within,
} from "../../test";
import { Accordion } from "./accordion/Accordion";
import { Avatar } from "./avatar/Avatar";
import { Badge } from "./badge/Badge";
import { Card } from "./card/Card";
import { Carousel } from "./carousel/Carousel";
import { Chip } from "./chip/Chip";
import { Clipboard } from "./clipboard/Clipboard";
import { CopyButton } from "./clipboard/CopyButton";
import { DataTable } from "./data-table/DataTable";
import { Image } from "./image/Image";
import { defaultImageConfig, FALLBACK_IMAGE_CONFIG } from "./image/image-config";
import { Marquee } from "./marquee/Marquee";
import {
  defaultMarqueeConfig,
  FALLBACK_MARQUEE_CONFIG,
} from "./marquee/marquee-config";
import { Table } from "./table/Table";

describe("Accordion", () => {
  const ITEMS = [
    { id: "first", title: "First", content: <p>First content</p> },
    { id: "second", title: "Second", content: <p>Second content</p> },
  ];

  const THREE_ITEMS = [
    ...ITEMS,
    { id: "third", title: "Third", content: <p>Third content</p> },
  ];

  it("renders one collapsed trigger per item", () => {
    const { getAllByRole } = renderWithProvider(<Accordion items={ITEMS} />);
    const triggers = getAllByRole("button");

    expect(triggers).toHaveLength(2);
    for (const trigger of triggers) {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    }
  });

  it("expands on click and links the trigger to its panel", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Accordion items={ITEMS} />);
    const trigger = getByRole("button", { name: /First/ });

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const panelId = trigger.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    const panel = document.getElementById(panelId ?? "");
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute("data-state", "open");
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
  });

  it("toggles with the keyboard", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Accordion items={ITEMS} />);
    const trigger = getByRole("button", { name: /First/ });

    trigger.focus();
    await pressKey(user, "Enter");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await pressKey(user, " ");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps a single item open by default", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Accordion items={ITEMS} />);
    const first = getByRole("button", { name: /First/ });
    const second = getByRole("button", { name: /Second/ });

    await user.click(first);
    await user.click(second);

    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps multiple items open when configured", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Accordion items={ITEMS} allowMultiple />,
    );
    const first = getByRole("button", { name: /First/ });
    const second = getByRole("button", { name: /Second/ });

    await user.click(first);
    await user.click(second);

    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });

  it("reports changes and respects a controlled value", async () => {
    const user = createUser();
    const onValueChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Accordion
        items={ITEMS}
        value={["first"]}
        onValueChange={onValueChange}
      />,
    );
    const first = getByRole("button", { name: /First/ });
    const second = getByRole("button", { name: /Second/ });

    expect(first).toHaveAttribute("aria-expanded", "true");

    await user.click(second);

    expect(onValueChange).toHaveBeenCalled();
    expect(second).toHaveAttribute("aria-expanded", "false");
  });

  // A disabled item used to carry the native `disabled` attribute, which takes
  // the trigger out of the tab order: a reader never learned the section existed.
  // The rest of the library reports `aria-disabled` and keeps the control
  // reachable; the press is refused in `handleToggle` instead.
  it("keeps a disabled item in the tab order and refuses its press", async () => {
    const user = createUser();
    const items = [
      {
        id: "locked",
        title: "Locked",
        content: <p>Locked content</p>,
        disabled: true,
      },
    ];
    const { getByRole } = renderWithProvider(<Accordion items={items} />);
    const trigger = getByRole("button", { name: /Locked/ });

    expect(trigger).toHaveAttribute("aria-disabled", "true");
    expect(trigger).not.toBeDisabled();

    await user.tab();
    expectFocused(trigger);

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("states aria-disabled only for a disabled item", () => {
    const { getByRole } = renderWithProvider(<Accordion items={ITEMS} />);

    expect(getByRole("button", { name: /First/ })).not.toHaveAttribute(
      "aria-disabled",
    );
  });

  it("moves focus between headers with the arrow keys, Home and End", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Accordion items={THREE_ITEMS} />);
    const first = getByRole("button", { name: /First/ });
    const second = getByRole("button", { name: /Second/ });
    const third = getByRole("button", { name: /Third/ });

    first.focus();

    await pressArrow(user, "ArrowDown");
    expectFocused(second);
    // Moving focus is not opening: the header still has to be activated.
    expect(second).toHaveAttribute("aria-expanded", "false");

    await pressArrow(user, "ArrowDown");
    expectFocused(third);

    // The walk wraps at both ends of the stack.
    await pressArrow(user, "ArrowDown");
    expectFocused(first);

    await pressArrow(user, "ArrowUp");
    expectFocused(third);

    await pressKey(user, "Home");
    expectFocused(first);

    await pressKey(user, "End");
    expectFocused(third);
  });

  it("skips a disabled header when navigating with the keyboard", async () => {
    const user = createUser();
    const items = [
      { id: "first", title: "First", content: <p>First content</p> },
      {
        id: "locked",
        title: "Locked",
        content: <p>Locked content</p>,
        disabled: true,
      },
      { id: "third", title: "Third", content: <p>Third content</p> },
    ];
    const { getByRole } = renderWithProvider(<Accordion items={items} />);
    const first = getByRole("button", { name: /First/ });
    const locked = getByRole("button", { name: /Locked/ });
    const third = getByRole("button", { name: /Third/ });

    first.focus();

    await pressArrow(user, "ArrowDown");
    expectFocused(third);

    await pressArrow(user, "ArrowUp");
    expectFocused(first);

    await pressKey(user, "End");
    expectFocused(third);

    // The disabled header is still reachable in the tab order; it is only the
    // walk that steps over it.
    locked.focus();
    expectFocused(locked);

    await pressKey(user, "Home");
    expectFocused(first);
  });

  // `disableAnimation` was destructured with a literal default, so the
  // component-level option never reached the render: only the prop did.
  it("resolves disableAnimation from component configuration", () => {
    const { container } = renderWithProvider(<Accordion items={ITEMS} />, {
      config: makeComponentConfig("accordion", { disableAnimation: true }),
    });

    expect(container.querySelector('[data-state="closed"]')).toHaveClass(
      "transition-none",
    );
  });

  it("keeps the animation by default and lets the prop override configuration", () => {
    const plain = renderWithProvider(<Accordion items={ITEMS} />);

    expect(
      plain.container.querySelector('[data-state="closed"]'),
    ).not.toHaveClass("transition-none");

    // The instance is the first tier: an explicit `false` wins over the
    // configured `true`, which is the order every other axis resolves in.
    const overridden = renderWithProvider(
      <Accordion items={ITEMS} disableAnimation={false} />,
      { config: makeComponentConfig("accordion", { disableAnimation: true }) },
    );

    expect(
      overridden.container.querySelector('[data-state="closed"]'),
    ).not.toHaveClass("transition-none");
  });

  // Defect register (M1, D-10): a collapsed panel kept its content mounted
  // with only `grid-rows-[0fr] opacity-0 pointer-events-none`, so interactive
  // content inside a collapsed panel stayed in the focus order and in the
  // accessibility tree.
  it("removes collapsed panel content from the accessibility tree", async () => {
    const user = createUser();
    const { getByRole, container } = renderWithProvider(
      <Accordion
        items={[
          {
            id: "first",
            title: "First",
            content: <button type="button">Inside the panel</button>,
          },
        ]}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Inside the panel" }),
    ).toBeNull();

    const collapsedPanel = container.querySelector('[data-state="closed"]');

    expect(collapsedPanel).toHaveAttribute("inert");
    expect(collapsedPanel).toHaveAttribute("aria-hidden", "true");

    await user.click(getByRole("button", { name: /First/ }));

    expect(
      screen.getByRole("button", { name: "Inside the panel" }),
    ).toBeInTheDocument();

    const openPanel = container.querySelector('[data-state="open"]');

    expect(openPanel).not.toHaveAttribute("inert");
    expect(openPanel).not.toHaveAttribute("aria-hidden");
  });
});

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

describe("Badge", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders its content", () => {
    const { getByText } = renderWithProvider(<Badge>Active</Badge>);

    expect(getByText("Active")).toBeInTheDocument();
  });

  it("stands its label in for an icon-only badge and hides the icon from assistive technology", () => {
    const { container, getByTestId, getByText } = renderWithProvider(
      <Badge
        id="status-badge"
        label="Active"
        startContent={<span data-testid="icon" />}
      />,
    );
    const badge = container.querySelector("#status-badge") as HTMLElement;

    // The label is the content assistive technology reads, and the icon beside
    // it is decoration.
    expect(getByText("Active")).toBeInTheDocument();
    expect(badge.querySelector('[aria-hidden="true"]')).toContainElement(
      getByTestId("icon"),
    );
  });

  it("keeps the visible content as the name when a label is given too", () => {
    // A label beside visible text used to be announced instead of it, so a badge
    // reading "Paid" said "Active". The text the reader can see is the name, and a
    // name that contradicts it is not rendered at all.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { getByTestId, queryByText } = renderWithProvider(
      <Badge data-testid="badge" label="Active">
        Paid
      </Badge>,
    );
    const badge = getByTestId("badge");

    expect(badge).toHaveTextContent("Paid");
    expect(queryByText("Active")).toBeNull();
    expect(badge.querySelector(".sr-only")).toBeNull();
    expect(badge.querySelector('[aria-hidden="true"]')).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("`label`"));
  });

  it("names an icon-only badge without warning about its own label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { getByTestId } = renderWithProvider(
      <Badge
        data-testid="badge"
        label="Sync failing"
        startContent={<svg data-testid="icon" />}
      />,
    );
    const badge = getByTestId("badge");

    expect(badge).toHaveTextContent("Sync failing");
    expect(badge.querySelector(".sr-only")?.textContent).toBe("Sync failing");
    expect(badge.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(warn).not.toHaveBeenCalled();
  });

  it("sizes an icon the way a chip does, so one node renders the same in both", () => {
    // The slot states the density's box and the SVG inside it. Styling only the
    // drawing from the root, as the badge used to, made the same inline SVG a
    // different size in each sibling.
    for (const density of ["sm", "md", "lg"] as const) {
      expect(BADGE_ICON_SIZE_CLASS[density]).toBe(
        CHIP_ICON_SIZE_CLASS[density],
      );
    }

    const { getByTestId } = renderWithProvider(
      <Badge size="lg" startContent={<svg data-testid="icon" />}>
        Synced
      </Badge>,
    );
    const slot = getByTestId("icon").parentElement as HTMLElement;

    expect(slot.className).toContain("size-4");
    expect(slot.className).toContain("[&_svg]:size-4");
  });

  it("is not interactive, so it takes no focus and exposes no control", () => {
    const { getByText } = renderWithProvider(<Badge>Active</Badge>);
    const badge = getByText("Active");

    expect(badge.tagName).toBe("SPAN");
    expect(badge).not.toHaveAttribute("tabindex");
    expect(badge).not.toHaveAttribute("role");
  });

  it("resolves the configured colour and honours a prop override", () => {
    const configured = renderWithProvider(<Badge>Active</Badge>, {
      config: makeComponentConfig("badge", { color: "danger" }),
    });
    const overridden = renderWithProvider(
      <Badge color="success">Active</Badge>,
      { config: makeComponentConfig("badge", { color: "danger" }) },
    );

    expect(
      within(configured.container).getByText("Active").className,
    ).toContain("danger");
    expect(
      within(overridden.container).getByText("Active").className,
    ).toContain("success");
  });

  it("uses the registered radius and honours a radius override", () => {
    const { container } = renderWithProvider(
      <>
        <Badge id="badge-default">Active</Badge>
        <Badge id="badge-square" radius="none">
          Active
        </Badge>
      </>,
    );

    expect(container.querySelector("#badge-default")?.className).toContain(
      "rounded-full",
    );
    expect(container.querySelector("#badge-square")?.className).toContain(
      "rounded-none",
    );
  });

  it("renders the content slots around its text", () => {
    const { getByTestId } = renderWithProvider(
      <Badge
        startContent={<span data-testid="start" />}
        endContent={<span data-testid="end" />}>
        Active
      </Badge>,
    );

    expect(getByTestId("start")).toBeInTheDocument();
    expect(getByTestId("end")).toBeInTheDocument();
  });

  it("appends consumer classes last", () => {
    const { getByText } = renderWithProvider(
      <Badge className="ml-2 align-middle">Active</Badge>,
    );
    const badge = getByText("Active");

    expect(badge.className).toContain("ml-2");
    expect(badge.className).toContain("font-medium");
  });

  it("lands a treatment a badge cannot express on the nearest one it can", () => {
    // `defaultVariant` belongs to the framework rather than to the badge, and it
    // names a treatment a badge has no baseline to draw, so the shared rule is what
    // keeps the class look-up answering instead of resolving to nothing.
    const { container } = renderWithProvider(
      <Badge id="badge-underlined">Active</Badge>,
      { config: makeConfig({ defaultVariant: "underlined" }) },
    );
    const badge = container.querySelector("#badge-underlined") as HTMLElement;

    expect(badge.className).toContain("border");
    expect(badge.className).not.toContain("undefined");
  });

  it("hydrates its server markup without a mismatch", () => {
    expectHydrationClean(<Badge color="success">Active</Badge>);
    expectHydrationClean(<Badge label="Active" />);
  });
});

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

describe("Carousel", () => {
  const ITEMS = [
    { content: <div>Slide one</div> },
    { content: <div>Slide two</div> },
    { content: <div>Slide three</div> },
  ];

  it("renders labelled navigation controls and indicators", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Carousel items={ITEMS} />,
    );

    expect(getByRole("button", { name: "Next slide" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Previous slide" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Go to slide 3" })).toBeInTheDocument();
    expect(getByText("Slide one")).toBeInTheDocument();
  });

  // `COMP-049`: the controls and the dots were labelled in two different cases
  // ("Previous Slide" beside "Go to slide 1"), so a reader heard the same kind of
  // control named two different ways.
  it("labels every control in sentence case", () => {
    const { getByRole } = renderWithProvider(<Carousel items={ITEMS} />);

    expect(getByRole("button", { name: "Previous slide" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Next slide" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Go to slide 1" })).toBeInTheDocument();
  });

  it("advances to the next slide and reports the index", async () => {
    const user = createUser();
    const onIndexChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Carousel items={ITEMS} onIndexChange={onIndexChange} />,
    );

    await user.click(getByRole("button", { name: "Next slide" }));

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("jumps to a slide from its indicator", async () => {
    const user = createUser();
    const onIndexChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Carousel items={ITEMS} onIndexChange={onIndexChange} />,
    );

    await user.click(getByRole("button", { name: "Go to slide 3" }));

    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it("disables the previous control on the first slide when looping is off", () => {
    const { getByRole } = renderWithProvider(
      <Carousel items={ITEMS} loop={false} />,
    );

    expectState(getByRole("button", { name: "Previous slide" }), {
      disabled: true,
    });
    expect(getByRole("button", { name: "Next slide" })).toBeEnabled();
  });

  it("hides controls and indicators when configured", () => {
    const { queryByRole } = renderWithProvider(
      <Carousel items={ITEMS} showControls={false} showIndicators={false} />,
    );

    expect(queryByRole("button", { name: "Next slide" })).toBeNull();
    expect(queryByRole("button", { name: "Go to slide 1" })).toBeNull();
  });

  it("starts from a given slide and respects a controlled index", async () => {
    const user = createUser();
    const onIndexChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Carousel items={ITEMS} index={2} onIndexChange={onIndexChange} />,
    );

    await user.click(getByRole("button", { name: "Next slide" }));

    expect(onIndexChange).toHaveBeenCalledWith(0);
  });

  it("renders safely without items", () => {
    const { container } = renderWithProvider(<Carousel />);

    expect(container.firstElementChild).not.toBeNull();
  });

  // Defect register (M1, D-13): transitions and autoplay were applied with plain
  // `transition-*` classes and timers, with no reduced-motion handling, so
  // `COMP-047` ("autoplay, where supported, is pausable and respects reduced
  // motion") and `TEST-033` were unmet.
  it("advances on autoplay while the user allows motion", () => {
    stubReducedMotion(false);

    const onIndexChange = vi.fn();
    const timers = useFakeTimers();

    try {
      renderWithProvider(
        <Carousel
          items={ITEMS}
          autoPlay
          autoPlayInterval={1000}
          onIndexChange={onIndexChange}
        />,
      );

      timers.advance(1000);

      expect(onIndexChange).toHaveBeenCalledWith(1);
    } finally {
      timers.restore();
    }
  });

  it("stops autoplay and transitions when the user prefers reduced motion", () => {
    stubReducedMotion(true);

    const onIndexChange = vi.fn();
    const timers = useFakeTimers();

    try {
      const { container } = renderWithProvider(
        <Carousel
          items={ITEMS}
          autoPlay
          autoPlayInterval={1000}
          onIndexChange={onIndexChange}
        />,
      );

      timers.advance(3000);

      expect(onIndexChange).not.toHaveBeenCalled();

      const track = container.querySelector(
        '[style*="translate3d"]',
      ) as HTMLElement | null;

      expect(track).not.toBeNull();
      expect(track?.className).not.toContain("transition-transform");
    } finally {
      timers.restore();
    }
  });

  // `COMP-050`: slides are translated rather than hidden, so a control inside an
  // off-screen slide stayed in the tab order and a keyboard user could land in a
  // frame the viewport never followed.
  it("takes off-screen slides out of the tab order and the accessibility tree", () => {
    const { getByText } = renderWithProvider(<Carousel items={ITEMS} />);
    const slideOf = (text: string) => getByText(text).parentElement;

    expect(slideOf("Slide one")).not.toHaveAttribute("inert");
    expect(slideOf("Slide one")).not.toHaveAttribute("aria-hidden");

    expect(slideOf("Slide two")).toHaveAttribute("inert");
    expect(slideOf("Slide two")).toHaveAttribute("aria-hidden", "true");
    expect(slideOf("Slide three")).toHaveAttribute("inert");
    expect(slideOf("Slide three")).toHaveAttribute("aria-hidden", "true");
  });

  it("moves the reachable slide with the visible one", async () => {
    const user = createUser();
    const { getByRole, getByText } = renderWithProvider(
      <Carousel items={ITEMS} />,
    );

    await user.click(getByRole("button", { name: "Next slide" }));

    expect(getByText("Slide two").parentElement).not.toHaveAttribute("inert");
    expect(getByText("Slide one").parentElement).toHaveAttribute("inert");
  });

  // `COMP-047` / `REQ-089`: `components.carousel.disableAnimation` was destructured
  // with a literal default, so the configured value never resolved.
  it("resolves disableAnimation from the component config", () => {
    const { container } = renderWithProvider(<Carousel items={ITEMS} />, {
      config: makeComponentConfig("carousel", { disableAnimation: true }),
    });
    const track = container.querySelector(
      '[style*="translate3d"]',
    ) as HTMLElement | null;

    expect(track).not.toBeNull();
    expect(track?.className).not.toContain("transition-transform");
  });

  it("keeps the transition when the component config leaves it on", () => {
    const { container } = renderWithProvider(<Carousel items={ITEMS} />, {
      config: makeComponentConfig("carousel", { disableAnimation: false }),
    });
    const track = container.querySelector(
      '[style*="translate3d"]',
    ) as HTMLElement | null;

    expect(track?.className).toContain("transition-transform");
  });

  // `COMP-051`: the shared `defaultVariant` was cast to the carousel's own type, so
  // a treatment the carousel cannot draw silently became `bordered`.
  it("maps the shared defaultVariant onto a frame the carousel can draw", () => {
    expect(resolveCarouselVariant("solid")).toBe("bordered");
    expect(resolveCarouselVariant("faded")).toBe("bordered");
    expect(resolveCarouselVariant("underlined")).toBe("bordered");
    expect(resolveCarouselVariant("bordered")).toBe("bordered");
    expect(resolveCarouselVariant("ghost")).toBe("ghost");
  });

  it("renders the filled frame for a filled defaultVariant and the ghost frame for ghost", () => {
    const filled = renderWithProvider(<Carousel items={ITEMS} />, {
      config: makeConfig({ defaultVariant: "solid" }),
    });
    const ghost = renderWithProvider(<Carousel items={ITEMS} />, {
      config: makeConfig({ defaultVariant: "ghost" }),
    });

    expect(filled.container.firstElementChild?.className).toContain("border-2");
    expect(ghost.container.firstElementChild?.className).toContain(
      "bg-transparent",
    );
  });

  // `COMP-052`: the active dot was only a colour, with nothing stating the current
  // slide to assistive technology.
  it("marks the active indicator as the current slide", () => {
    const { getByRole } = renderWithProvider(<Carousel items={ITEMS} />);

    expect(getByRole("button", { name: "Go to slide 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(getByRole("button", { name: "Go to slide 2" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("moves aria-current to the dot of the slide the reader chose", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(<Carousel items={ITEMS} />);

    await user.click(getByRole("button", { name: "Go to slide 2" }));

    expect(getByRole("button", { name: "Go to slide 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(getByRole("button", { name: "Go to slide 1" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});

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

/** Install a clipboard that records what it was given. */
function installClipboard(options: { fail?: boolean } = {}) {
  const writeText = vi.fn(async (_text: string) => {
    if (options.fail) {
      throw new Error("Clipboard access was refused");
    }
  });

  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });

  return writeText;
}

/**
 * Behaviour tests for the clipboard pair.
 *
 * jsdom has no clipboard API, so the tests install one on `navigator` and assert
 * what the components do with the result: the copied state, the announced
 * result, the failure path, and the timer that ends the copied state.
 */
describe("Clipboard", () => {
  it("hands the copied state to its render function", async () => {
    const user = userEvent.setup();
    const writeText = installClipboard();

    const { getByRole, getByText } = renderWithProvider(
      <Clipboard value="INV-1042" timeout={1000}>
        {({ copied, copy }) => (
          <button type="button" onClick={() => void copy()}>
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </Clipboard>,
    );

    await user.click(getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith("INV-1042");
    await waitFor(() => expect(getByText("Copied")).toBeDefined());
  });

  it("reports a refusal without claiming success", async () => {
    const user = userEvent.setup();
    installClipboard({ fail: true });
    const errors: unknown[] = [];

    const { getByRole, getByText } = renderWithProvider(
      <Clipboard value="INV-1042" onError={(error) => errors.push(error)}>
        {({ copied, error, copy }) => (
          <button type="button" onClick={() => void copy()}>
            {copied ? "Copied" : error ? "Failed" : "Copy"}
          </button>
        )}
      </Clipboard>,
    );

    await user.click(getByRole("button", { name: "Copy" }));

    expect(errors).toHaveLength(1);
    await waitFor(() => expect(getByText("Failed")).toBeDefined());
  });

  it("copies the text it is given instead of its value", async () => {
    const user = userEvent.setup();
    const writeText = installClipboard();

    const { getByRole } = renderWithProvider(
      <Clipboard value="INV-1042">
        {({ copy }) => (
          <button type="button" onClick={() => void copy("INV-9999")}>
            Copy other
          </button>
        )}
      </Clipboard>,
    );

    await user.click(getByRole("button", { name: "Copy other" }));

    expect(writeText).toHaveBeenCalledWith("INV-9999");
  });

  it("fails instead of copying nothing when there is no text", async () => {
    const user = userEvent.setup();
    const writeText = installClipboard();
    const errors: unknown[] = [];
    const results: boolean[] = [];

    // Neither a `Clipboard` with no `value` nor an explicit empty string has
    // anything to write, so both must take the failure path: no clipboard call,
    // `false` from `copy()`, `error` set and `onError` told.
    const { getByRole, getByText, queryByText } = renderWithProvider(
      <Clipboard onError={(error) => errors.push(error)}>
        {({ copied, error, copy }) => (
          <>
            <button
              type="button"
              onClick={async () => {
                results.push(await copy());
              }}>
              {copied ? "Copied" : error ? "Failed" : "Copy"}
            </button>
            <button
              type="button"
              onClick={async () => {
                results.push(await copy(""));
              }}>
              Copy empty
            </button>
          </>
        )}
      </Clipboard>,
    );

    await user.click(getByRole("button", { name: "Copy" }));
    await waitFor(() => expect(results).toHaveLength(1));
    await user.click(getByRole("button", { name: "Copy empty" }));
    await waitFor(() => expect(results).toHaveLength(2));

    expect(writeText).not.toHaveBeenCalled();
    expect(results).toEqual([false, false]);
    expect(errors).toHaveLength(2);
    await waitFor(() => expect(getByText("Failed")).toBeDefined());
    expect(queryByText("Copied")).toBeNull();
  });
});

describe("CopyButton", () => {
  it("renames itself and announces the result", async () => {
    const user = userEvent.setup();
    const writeText = installClipboard();

    const { getByRole, getByText } = renderWithProvider(
      <CopyButton value="INV-1042" timeout={1000} />,
    );

    await user.click(getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith("INV-1042");
    await waitFor(() =>
      expect(getByRole("button", { name: "Copied" })).toBeDefined(),
    );
    expect(getByRole("status").textContent).toContain("INV-1042");
    expect(getByText("Copied: INV-1042")).toBeDefined();
  });

  it("takes its wording, its announcement and its emphasis from props and config", async () => {
    const user = userEvent.setup();
    installClipboard();

    const { getByRole } = renderWithProvider(
      <CopyButton
        value="INV-1042"
        label="Copy invoice number"
        copiedLabel="Number copied"
        copiedAnnouncement="Invoice number on the clipboard"
      />,
      {
        config: makeComponentConfig("clipboard", {
          variant: "ghost",
          timeout: 500,
        }),
      },
    );
    const button = getByRole("button", { name: "Copy invoice number" });

    expect(button.className).toContain("bg-transparent");

    await user.click(button);

    expect(getByRole("status").textContent).toContain(
      "Invoice number on the clipboard",
    );
  });

  it("renders the control on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(<CopyButton value="INV-1042" />);

    expect(html).toContain("Copy");
    expect(html).toContain("<button");
    expectHydrationClean(<CopyButton value="INV-1042" />);
  });

  it("announces a failed copy instead of claiming success", async () => {
    const user = userEvent.setup();
    const writeText = installClipboard();
    const errors: unknown[] = [];

    const { getByRole, getByText } = renderWithProvider(
      <CopyButton
        value=""
        onError={(error) => {
          errors.push(error);
        }}
      />,
    );

    await user.click(getByRole("button", { name: "Copy" }));

    expect(writeText).not.toHaveBeenCalled();
    expect(errors).toHaveLength(1);

    // The label stays where it was — a control that could not copy must not
    // rename itself "Copied" — and the region says what went wrong instead.
    expect(getByRole("button", { name: "Copy" })).toBeDefined();
    expect(getByRole("status").textContent).toBe("Copy failed");
    expect(getByText("Copy failed")).toBeDefined();
  });

  it("uses the failure announcement it is given", async () => {
    const user = userEvent.setup();
    installClipboard();

    const { getByRole } = renderWithProvider(
      <CopyButton value="" errorAnnouncement="Nothing to copy" />,
    );

    await user.click(getByRole("button", { name: "Copy" }));

    expect(getByRole("status").textContent).toBe("Nothing to copy");
  });

  it("resolves the control's radius through the cascade", () => {
    const unconfigured = renderWithProvider(<CopyButton value="INV-1042" />);
    expect(
      unconfigured.getByRole("button", { name: "Copy" }).className,
    ).toContain("rounded-xs");
    unconfigured.unmount();

    const themed = renderWithProvider(<CopyButton value="INV-1042" />, {
      config: makeComponentConfig("clipboard", { radius: "full" }),
    });
    expect(themed.getByRole("button", { name: "Copy" }).className).toContain(
      "rounded-full",
    );
    themed.unmount();

    const instance = renderWithProvider(
      <CopyButton value="INV-1042" radius="none" />,
      { config: makeComponentConfig("clipboard", { radius: "full" }) },
    );
    expect(instance.getByRole("button", { name: "Copy" }).className).toContain(
      "rounded-none",
    );
  });
});

/**
 * Behaviour tests for the table composition.
 *
 * The tests state what the composition promises: it renders the rows it is
 * given, it searches and pages them through the components it composes, it says
 * how many rows are left — counting the result set the consumer states when it
 * holds one page of a remote list — it reports a query when the reader pauses if
 * it is asked to, it shows a loading region while the rows are on their way and
 * an empty presentation when there are none.
 */
describe("DataTable", () => {
  interface Invoice {
    id: string;
    number: string;
    customer: string;
  }

  const invoices: Invoice[] = [
    { id: "1", number: "INV-001", customer: "Ashee" },
    { id: "2", number: "INV-002", customer: "Northwind" },
    { id: "3", number: "INV-003", customer: "Contoso" },
  ];

  const columns = [
    {
      id: "number",
      header: "Number",
      cell: (row: Invoice) => row.number,
    },
    {
      id: "customer",
      header: "Customer",
      cell: (row: Invoice) => row.customer,
    },
  ];

  it("renders the rows, the columns and the count", () => {
    const { getByText } = renderWithProvider(
      <DataTable
        title="Invoices"
        data={invoices}
        columns={columns}
        rowKeyAccessor={(row) => row.id}
      />,
    );

    expect(getByText("Invoices")).toBeTruthy();
    expect(getByText("Number")).toBeTruthy();
    expect(getByText("INV-001")).toBeTruthy();
    expect(getByText("INV-003")).toBeTruthy();
    expect(getByText("Showing 1 to 3 of 3")).toBeTruthy();
  });

  it("tells a reader how many rows are left, as a status", () => {
    const { getByRole } = renderWithProvider(
      <DataTable data={invoices} columns={columns} />,
    );

    expect(getByRole("status")).toHaveTextContent("Showing 1 to 3 of 3");
  });

  it("names the table after the heading above it", () => {
    const { getByRole, getByText } = renderWithProvider(
      <DataTable
        title="Invoices"
        description="Everything issued this quarter."
        data={invoices}
        columns={columns}
      />,
    );

    const heading = getByText("Invoices");
    const table = getByRole("table");

    expect(heading.id).toBeTruthy();
    expect(table).toHaveAttribute("aria-labelledby", heading.id);
    expect(table).toHaveAccessibleName("Invoices");
  });

  it("names the table with a caption when one is given", () => {
    const { getByRole, getByText } = renderWithProvider(
      <DataTable
        title="Invoices"
        caption="Invoices issued this quarter"
        data={invoices}
        columns={columns}
      />,
    );

    const table = getByRole("table");

    // The consumer's caption is the table's name, so the heading is not also
    // wired to it.
    expect(getByText("Invoices issued this quarter").tagName).toBe("CAPTION");
    expect(table).toHaveAccessibleName("Invoices issued this quarter");
    expect(table).not.toHaveAttribute("aria-labelledby");
  });

  it("searches the rows through the accessor it is given", async () => {
    const { getByRole, getByText, queryByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        searchAccessor={(row) => `${row.number} ${row.customer}`}
      />,
    );
    const user = userEvent.setup();

    await user.type(getByRole("searchbox"), "north");

    expect(getByText("INV-002")).toBeTruthy();
    expect(queryByText("INV-001")).toBeNull();
    expect(getByText("Showing 1 to 1 of 1")).toBeTruthy();
  });

  it("reports the query, and leaves the search to the consumer when it is told to", async () => {
    const onSearchChange = vi.fn();
    const { getByRole, getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        onSearchChange={onSearchChange}
      />,
    );
    const user = userEvent.setup();

    await user.type(getByRole("searchbox"), "in");
    await user.clear(getByRole("searchbox"));
    await user.type(getByRole("searchbox"), "north");

    expect(onSearchChange).toHaveBeenLastCalledWith("north");
    // Without an accessor the table does not filter: the consumer replaced the rows.
    expect(getByText("INV-001")).toBeTruthy();
  });

  it("reports a debounced query once, after the reader stops typing", () => {
    const timers = useFakeTimers();

    try {
      const onSearchChange = vi.fn();
      const { getByRole } = renderWithProvider(
        <DataTable
          data={invoices}
          columns={columns}
          searchDebounce={300}
          onSearchChange={onSearchChange}
        />,
      );
      const searchbox = getByRole("searchbox");

      fireEvent.change(searchbox, { target: { value: "n" } });
      fireEvent.change(searchbox, { target: { value: "no" } });
      fireEvent.change(searchbox, { target: { value: "nor" } });

      // The field shows what the reader typed, but nothing is reported per keystroke: the
      // table waits for the pause so one pause is one search.
      expect(searchbox).toHaveValue("nor");
      expect(onSearchChange).not.toHaveBeenCalled();

      timers.advance(299);
      expect(onSearchChange).not.toHaveBeenCalled();

      timers.advance(1);
      expect(onSearchChange).toHaveBeenCalledTimes(1);
      expect(onSearchChange).toHaveBeenCalledWith("nor");
    } finally {
      timers.restore();
    }
  });

  it("takes the debounce from components.datatable", () => {
    const timers = useFakeTimers();

    try {
      const onSearchChange = vi.fn();
      const { getByRole } = renderWithProvider(
        <DataTable
          data={invoices}
          columns={columns}
          onSearchChange={onSearchChange}
        />,
        { config: makeComponentConfig("datatable", { searchDebounce: 200 }) },
      );

      fireEvent.change(getByRole("searchbox"), {
        target: { value: "north" },
      });

      timers.advance(199);
      expect(onSearchChange).not.toHaveBeenCalled();

      timers.advance(1);
      expect(onSearchChange).toHaveBeenCalledWith("north");
    } finally {
      timers.restore();
    }
  });

  it("reports every keystroke when no debounce is configured", () => {
    const onSearchChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        onSearchChange={onSearchChange}
      />,
    );
    const searchbox = getByRole("searchbox");

    fireEvent.change(searchbox, { target: { value: "n" } });
    fireEvent.change(searchbox, { target: { value: "no" } });

    // Zero is the neutral default: the registered value states no wait, so existing
    // consumers see exactly the per-keystroke reporting they always did.
    expect(onSearchChange).toHaveBeenCalledTimes(2);
    expect(onSearchChange).toHaveBeenLastCalledWith("no");
  });

  it("shows the empty presentation when nothing matches", async () => {
    const { getByRole, getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        searchAccessor={(row) => row.customer}
      />,
    );
    const user = userEvent.setup();

    await user.type(getByRole("searchbox"), "nothing");

    expect(getByText("No results")).toBeTruthy();
    expect(getByText("Showing 0 to 0 of 0")).toBeTruthy();
    // The search control stays, so the reader can undo the query.
    expect(getByRole("searchbox")).toBeTruthy();
  });

  it("announces an empty result, not only its count", async () => {
    const { getAllByRole, getByRole, getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        searchAccessor={(row) => row.customer}
      />,
    );
    const user = userEvent.setup();

    await user.type(getByRole("searchbox"), "nothing");

    const statuses = getAllByRole("status");

    // The count is announced, and so is the sentence that explains it.
    expect(statuses).toHaveLength(2);
    expect(
      statuses.some((status) => status.textContent?.includes("No results")),
    ).toBe(true);
    expect(getByText("Showing 0 to 0 of 0")).toBeTruthy();
  });

  it("does not announce an empty table that is part of the first markup", () => {
    const { getByText } = renderWithProvider(
      <DataTable data={[]} columns={columns} />,
    );

    // Nothing replaced anything, so the empty presentation is not a change.
    expect(getByText("No results").closest('[role="status"]')).toBeNull();
  });

  it("keeps a first-paint empty table silent under a configured announcement", () => {
    // The table states `none` explicitly on the first paint, so a configured
    // `components.emptystate.role` cannot turn a page load into an announcement.
    const { getByText } = renderWithProvider(
      <DataTable data={[]} columns={columns} />,
      {
        config: makeConfig({
          components: { emptystate: { role: "status" } },
        }),
      },
    );

    expect(getByText("No results").closest('[role="status"]')).toBeNull();
  });

  it("marks the row it is told is chosen", () => {
    const { getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        rowKeyAccessor={(row) => row.id}
        selectedRowKey="2"
      />,
    );

    expect(getByText("INV-002").closest("tr")).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(getByText("INV-001").closest("tr")).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("states the count with the configured template", () => {
    const { getByText } = renderWithProvider(
      <DataTable data={invoices} columns={columns} />,
      {
        config: makeComponentConfig("datatable", {
          rowCountLabel: "Rows {first}–{last} of {total}",
        }),
      },
    );

    expect(getByText("Rows 1–3 of 3")).toBeTruthy();
    // The default wording is gone, rather than used as well.
    expect(() => getByText("Showing 1 to 3 of 3")).toThrow();
  });

  it("lets an instance row-count template win over the configured one", () => {
    const { getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        rowCountLabel="{total} invoices, showing {first} to {last}"
      />,
      {
        config: makeComponentConfig("datatable", {
          rowCountLabel: "Rows {first}–{last} of {total}",
        }),
      },
    );

    expect(getByText("3 invoices, showing 1 to 3")).toBeTruthy();
  });

  it("publishes the column type its props are declared with", () => {
    const viaDataTable: ColumnDef<Invoice>[] = columns;

    expect(viaDataTable).toHaveLength(2);
  });

  it("pages the rows and starts at the first page of a new query", async () => {
    const { getByRole, getByText, queryByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        pageSize={2}
        searchAccessor={(row) => row.customer}
      />,
    );
    const user = userEvent.setup();

    expect(getByText("INV-001")).toBeTruthy();
    expect(queryByText("INV-003")).toBeNull();

    await user.click(getByRole("button", { name: "Page 2" }));
    expect(getByText("INV-003")).toBeTruthy();

    // "o" matches Northwind and Contoso, and the search starts at the first page.
    await user.type(getByRole("searchbox"), "o");
    expect(getByText("Showing 1 to 2 of 2")).toBeTruthy();
  });

  it("reports the page a reader asked for", async () => {
    const onPageChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        pageSize={1}
        onPageChange={onPageChange}
      />,
    );
    const user = userEvent.setup();

    await user.click(getByRole("button", { name: "Page 2" }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("takes the result-set total from rowCount, so a page of a remote list still pages", async () => {
    const onPageChange = vi.fn();
    const { getByRole, getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        rowCount={42}
        pageSize={3}
        onPageChange={onPageChange}
      />,
    );

    // The rows shown are still the ones handed in, but the pager counts every page of the
    // result set and the sentence reports its size rather than this page's three rows.
    expect(getByText("INV-001")).toBeTruthy();
    expect(getByText("Showing 1 to 3 of 42")).toBeTruthy();
    expect(getByRole("button", { name: "Page 14" })).toBeTruthy();

    const user = userEvent.setup();
    await user.click(getByRole("button", { name: "Page 2" }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("states the last page from rowCount rather than from the rows it holds", () => {
    const { getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        rowCount={42}
        pageSize={3}
        page={14}
      />,
    );

    expect(getByText("Showing 40 to 42 of 42")).toBeTruthy();
  });

  it("keeps deriving the total from the rows when rowCount is absent", () => {
    const { getByText } = renderWithProvider(
      <DataTable data={invoices} columns={columns} />,
    );

    // The historical behaviour, unchanged: three rows are three rows.
    expect(getByText("Showing 1 to 3 of 3")).toBeTruthy();
  });

  it("names what is loading while the rows are on their way", () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <DataTable data={[]} columns={columns} isLoading />,
    );

    // The table knows what it is loading, so it says so rather than announcing the
    // generic sentence.
    expect(getByRole("status")).toHaveTextContent("Loading results");
    expect(queryByRole("table")).toBeNull();
  });

  it("takes the loading wording from configuration and from the instance", () => {
    const configured = renderWithProvider(
      <DataTable data={[]} columns={columns} isLoading />,
      {
        config: makeComponentConfig("datatable", {
          loadingLabel: "Loading invoices",
        }),
      },
    );

    expect(configured.getByRole("status")).toHaveTextContent(
      "Loading invoices",
    );
    configured.unmount();

    const stated = renderWithProvider(
      <DataTable
        data={[]}
        columns={columns}
        isLoading
        loadingLabel="Opening the ledger"
      />,
      {
        config: makeComponentConfig("datatable", {
          loadingLabel: "Loading invoices",
        }),
      },
    );

    expect(stated.getByRole("status")).toHaveTextContent("Opening the ledger");
  });

  it("reports the row a reader activates", async () => {
    const onRowClick = vi.fn();
    const { getByText } = renderWithProvider(
      <DataTable
        data={invoices}
        columns={columns}
        rowKeyAccessor={(row) => row.id}
        onRowClick={onRowClick}
      />,
    );
    const user = userEvent.setup();

    await user.click(getByText("INV-002"));

    expect(onRowClick).toHaveBeenCalledWith(invoices[1], "2");
  });

  it("takes its paging, its search and its wording from configuration", () => {
    const { getByRole, getByText, queryByRole, queryByText } =
      renderWithProvider(
        <DataTable
          data={invoices}
          columns={columns}
          searchAccessor={(row) => row.customer}
        />,
        {
          config: makeComponentConfig("datatable", {
            pageSize: 1,
            showRowCount: false,
            searchLabel: "Find an invoice",
            emptyTitle: "Nothing here",
          }),
        },
      );

    expect(getByText("INV-001")).toBeTruthy();
    expect(queryByText("INV-002")).toBeNull();
    expect(getByRole("searchbox")).toHaveAccessibleName("Find an invoice");
    expect(queryByRole("status")).toBeNull();
  });

  it("leaves the search control out when the table cannot search", () => {
    const { queryByRole } = renderWithProvider(
      <DataTable data={invoices} columns={columns} />,
    );

    expect(queryByRole("searchbox")).toBeNull();
  });

  it("lets an instance prop win over the configured value", () => {
    const { getAllByRole } = renderWithProvider(
      <DataTable data={invoices} columns={columns} pageSize={2} />,
      { config: makeComponentConfig("datatable", { pageSize: 3 }) },
    );

    // Two rows and a header row.
    expect(getAllByRole("row")).toHaveLength(3);
  });

  it("renders the element it is asked for and carries the consumer's class", () => {
    const { container } = renderWithProvider(
      <DataTable
        as="section"
        className="bg-primary"
        data={invoices}
        columns={columns}
      />,
    );

    expect(container.firstElementChild?.tagName).toBe("SECTION");
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "bg-primary",
    );
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const markup = renderToServerString(
      <DataTable
        title="Invoices"
        data={invoices}
        columns={columns}
        searchAccessor={(row) => row.customer}
      />,
    );

    expect(markup).toContain("INV-001");
    expect(markup).toContain("Showing 1 to 3 of 3");
    // The heading's id is generated on the server and used by the table, so the
    // naming survives a server render.
    expect(markup).toContain("aria-labelledby=");
    expectHydrationClean(
      <DataTable data={invoices} columns={columns} pageSize={2} />,
    );
  });
});

/**
 * A substituted image that records the props it receives, so a test can state what
 * the component was actually handed rather than what `Image` meant to hand it.
 */
function RecordingImage({
  src,
  alt,
  loading,
  priority,
}: {
  src?: string | undefined;
  alt?: string | undefined;
  loading?: string | undefined;
  priority?: boolean | undefined;
}) {
  return (
    <img
      data-testid="custom-image"
      src={src}
      alt={alt}
      data-loading={loading}
      data-priority={priority === undefined ? undefined : String(priority)}
    />
  );
}

describe("Image", () => {
  it("renders an image with its source and alternative text", () => {
    const { getByRole } = renderWithProvider(
      <Image src="/photo.jpg" alt="A photo" />,
    );
    const image = getByRole("img", { name: "A photo" });

    expect(image).toHaveAttribute("src", "/photo.jpg");
  });

  it("supports substituting the underlying image implementation", () => {
    function CustomImage({ src, alt }: { src?: string; alt?: string }) {
      return <img data-testid="custom-image" src={src} alt={alt} />;
    }

    const { getByTestId } = renderWithProvider(
      <Image src="/photo.jpg" alt="A photo" component={CustomImage} />,
    );

    expect(getByTestId("custom-image")).toHaveAttribute("src", "/photo.jpg");
  });

  it("reports load and error outcomes to the consumer", () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    const { getByRole } = renderWithProvider(
      <Image
        src="/photo.jpg"
        alt="A photo"
        onLoad={onLoad}
        onError={onError}
      />,
    );
    const image = getByRole("img", { name: "A photo" });

    fireEvent.load(image);
    expect(onLoad).toHaveBeenCalledTimes(1);

    fireEvent.error(image);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("keeps the alternative text while a fallback source is available", () => {
    const { getByRole } = renderWithProvider(
      <Image src="/missing.jpg" fallbackSrc="/fallback.jpg" alt="A photo" />,
    );

    expect(getByRole("img", { name: "A photo" })).toBeInTheDocument();
  });

  it("renders to markup on the server without browser access", () => {
    const html = renderToServerString(<Image src="/photo.jpg" alt="A photo" />);

    expect(html).toContain('src="/photo.jpg"');
    expect(html).toContain('alt="A photo"');
  });
});

describe("Image radius", () => {
  it("does not register a radius, so the application default can answer", () => {
    // Registering `md` here would make the component tier always answer, and
    // `defaultRadius` would never reach a picture. The hard fallback still states it.
    expect(defaultImageConfig.radius).toBeUndefined();
    expect(FALLBACK_IMAGE_CONFIG.radius).toBe("md");
  });

  it("follows the application's defaultRadius", () => {
    const { container } = renderWithProvider(
      <Image src="/photo.jpg" alt="A photo" />,
      { config: { defaultRadius: "lg" } },
    );

    expect(container.firstElementChild).toHaveClass("rounded-lg");
  });

  it("still lets components.image.radius override the application default", () => {
    const { container } = renderWithProvider(
      <Image src="/photo.jpg" alt="A photo" />,
      {
        config: {
          defaultRadius: "lg",
          components: { image: { radius: "sm" } },
        },
      },
    );

    expect(container.firstElementChild).toHaveClass("rounded-sm");
  });
});

describe("Image with a substituted component", () => {
  it("forwards a loading value stated in componentProps instead of forcing eager", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { getByTestId } = renderWithProvider(
      <Image
        src="/photo.jpg"
        alt="A photo"
        component={RecordingImage}
        componentProps={{ loading: "lazy" }}
      />,
    );

    expect(getByTestId("custom-image")).toHaveAttribute("data-loading", "lazy");
    // The old safeguard warned about lazy here and overrode it; neither happens now.
    expect(warn).not.toHaveBeenCalled();
  });

  it("forwards the instance's own loading value", () => {
    const { getByTestId } = renderWithProvider(
      <Image
        src="/photo.jpg"
        alt="A photo"
        loading="lazy"
        component={RecordingImage}
      />,
    );

    expect(getByTestId("custom-image")).toHaveAttribute("data-loading", "lazy");
  });

  it("forwards priority instead of clearing it", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { getByTestId } = renderWithProvider(
      <Image
        src="/photo.jpg"
        alt="A photo"
        component={RecordingImage}
        componentProps={{ priority: true }}
      />,
    );

    expect(getByTestId("custom-image")).toHaveAttribute(
      "data-priority",
      "true",
    );
    // `priority` is a legitimate prop of such a component, not a mistake to warn about.
    expect(warn).not.toHaveBeenCalled();
  });

  it("keeps the eager default when the component states no loading", () => {
    const { getByTestId } = renderWithProvider(
      <Image src="/photo.jpg" alt="A photo" component={RecordingImage} />,
    );

    expect(getByTestId("custom-image")).toHaveAttribute(
      "data-loading",
      "eager",
    );
  });

  it("warns when priority and lazy loading contradict each other", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { getByTestId } = renderWithProvider(
      <Image
        src="/photo.jpg"
        alt="A photo"
        component={RecordingImage}
        componentProps={{ priority: true, loading: "lazy" }}
      />,
    );

    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain("contradict");
    // The warning reports the contradiction; it does not resolve it by rewriting props.
    expect(getByTestId("custom-image")).toHaveAttribute("data-loading", "lazy");
    expect(getByTestId("custom-image")).toHaveAttribute(
      "data-priority",
      "true",
    );
  });

  it("does not animate a placeholder when it has no source to render", () => {
    // Nothing mounts for an invalid source with a substituted component, so no load
    // event can settle the placeholder; it must not pulse forever.
    const { container } = renderWithProvider(
      <Image src="" alt="A photo" component={RecordingImage} />,
    );

    expect(container.querySelector("[data-testid='custom-image']")).toBeNull();
    expect(container.querySelector(".animate-pulse")).toBeNull();
  });

  it("still holds the frame with a placeholder while a rendered picture loads", () => {
    const { container } = renderWithProvider(
      <Image src="/photo.jpg" alt="A photo" component={RecordingImage} />,
    );

    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });
});

describe("Marquee", () => {
  const ITEMS = [<span key="alpha">Alpha</span>, <span key="beta">Beta</span>];

  /** The animated track, or `null` when the component chose the still path. */
  function findTrack(container: HTMLElement): HTMLElement | null {
    return container.querySelector('[style*="animation-name"]');
  }

  it("renders every item in the primary track and the duplicate track", () => {
    const { getAllByText } = renderWithProvider(<Marquee>{ITEMS}</Marquee>);

    expect(getAllByText("Alpha")).toHaveLength(2);
    expect(getAllByText("Beta")).toHaveLength(2);
  });

  it("duplicates the track and hides the duplicate from assistive technology", () => {
    const { getAllByText, container } = renderWithProvider(
      <Marquee>{ITEMS}</Marquee>,
    );

    expect(getAllByText("Alpha")).toHaveLength(2);

    const hiddenText = Array.from(
      container.querySelectorAll('[aria-hidden="true"]'),
    )
      .map((node) => node.textContent ?? "")
      .join(" ");

    expect(hiddenText).toContain("Alpha");
    expect(hiddenText).toContain("Beta");
  });

  // `COMP-053`: the duplicate was aria-hidden but not inert, so a link inside the
  // marquee was a tab stop twice and the second stop announced nothing.
  it("keeps the duplicate copy out of the tab order as well", () => {
    const { container } = renderWithProvider(<Marquee>{ITEMS}</Marquee>);
    const inertCopies = container.querySelectorAll("[inert]");

    expect(inertCopies).toHaveLength(1);
    expect(inertCopies[0]).toHaveAttribute("aria-hidden", "true");
    expect(inertCopies[0]!.textContent).toContain("Alpha");

    // The copy the reader reads is still focusable.
    const sets = Array.from(
      inertCopies[0]!.parentElement?.children ?? [],
    ) as HTMLElement[];

    expect(sets).toHaveLength(2);
    expect(sets[0]).not.toHaveAttribute("inert");
  });

  it("applies the configured speed and pauses on hover", () => {
    const { container } = renderWithProvider(
      <Marquee speed={10} pauseOnHover>
        {ITEMS}
      </Marquee>,
    );
    const track = findTrack(container);

    expect(track).not.toBeNull();
    expect(track?.style.animationDuration).toBe("10s");
    expect(track?.className).toContain(
      "group-hover:[animation-play-state:paused]",
    );
  });

  // `COMP-054`: `pauseOnHover` is pointer-only, so WCAG 2.2.2 had no mechanism for a
  // keyboard reader. Focus anywhere inside the marquee stops the loop too.
  it("pauses for keyboard focus as well as for a resting pointer", () => {
    const { container } = renderWithProvider(
      <Marquee pauseOnHover>{ITEMS}</Marquee>,
    );
    const track = findTrack(container);

    expect(track?.className).toContain(
      "group-hover:[animation-play-state:paused]",
    );
    expect(track?.className).toContain(
      "group-focus-within:[animation-play-state:paused]",
    );
  });

  it("reverses the animation direction when configured", () => {
    const { container } = renderWithProvider(
      <Marquee direction="reverse">{ITEMS}</Marquee>,
    );
    const track = findTrack(container);

    expect(track?.style.animationDirection).toBe("reverse");
  });

  // `COMP-055`: the track carried the inter-copy gap, so translating by half its
  // length moved a copy plus half a gap instead of a copy plus the gap, and every
  // cycle jumped by half a gap.
  it("keeps the inter-copy gap inside each copy so half the track is one copy plus the gap", () => {
    const { container } = renderWithProvider(
      <Marquee gap="2rem">{ITEMS}</Marquee>,
    );
    const track = findTrack(container);

    expect(track).not.toBeNull();
    // No gap of its own: -50% is then exactly one copy plus the gap between copies.
    expect(track?.style.gap).toBe("");

    const copies = Array.from(track?.children ?? []) as HTMLElement[];

    expect(copies).toHaveLength(2);
    for (const copy of copies) {
      expect(copy.style.gap).toBe("2rem");
      expect(copy.style.paddingRight).toBe("2rem");
    }
  });

  it("states the inter-copy gap inside each copy on the vertical axis too", () => {
    const { container } = renderWithProvider(
      <Marquee axis="y" gap="2rem">
        {ITEMS}
      </Marquee>,
    );
    const track = findTrack(container);

    expect(track?.style.gap).toBe("");

    const copies = Array.from(track?.children ?? []) as HTMLElement[];

    for (const copy of copies) {
      expect(copy.style.gap).toBe("2rem");
      expect(copy.style.paddingBottom).toBe("2rem");
      expect(copy.style.paddingRight).toBe("");
    }
  });

  it("renders safely when there are no items", () => {
    const { container } = renderWithProvider(<Marquee>{[]}</Marquee>);

    expect(container.querySelector("div")).not.toBeNull();
  });

  // Defect register (M1, D-8): the animation was applied unconditionally, so
  // `COMP-048` ("motion respects reduced-motion preference") and `TEST-033`
  // were unmet for this component.
  //
  // `COMP-056`: stopping the animation left both copies clipped inside
  // `overflow-hidden`, so everything that did not fit was unreadable.
  it("shows the content once, in a reachable frame, when motion is declined", () => {
    stubReducedMotion(true);

    const { container, getAllByText } = renderWithProvider(
      <Marquee>{ITEMS}</Marquee>,
    );

    // One copy, so nothing is duplicated and nothing is clipped away.
    expect(getAllByText("Alpha")).toHaveLength(1);
    expect(getAllByText("Beta")).toHaveLength(1);
    expect(findTrack(container)).toBeNull();

    const frame = container.querySelector(".overflow-auto");

    expect(frame).not.toBeNull();
    expect(frame).toHaveTextContent("Alpha");
    expect(frame).toHaveTextContent("Beta");
    expect(frame?.className).toContain("h-full");

    const copy = frame?.firstElementChild as HTMLElement;

    // The single copy wraps, so the items that would have scrolled past read in place.
    expect(copy.className).toContain("flex-row");
    expect(copy.className).toContain("flex-wrap");
  });

  it("shows the content once, in a reachable frame, when isAnimated is false", () => {
    stubReducedMotion(false);

    const { container, getAllByText } = renderWithProvider(
      <Marquee isAnimated={false}>{ITEMS}</Marquee>,
    );

    expect(getAllByText("Alpha")).toHaveLength(1);
    expect(findTrack(container)).toBeNull();

    const frame = container.querySelector(".overflow-auto");

    expect(frame).not.toBeNull();
    expect(frame).toHaveTextContent("Beta");
    expect(frame?.firstElementChild?.className).toContain("flex-wrap");
  });

  it("makes a still vertical marquee scrollable", () => {
    stubReducedMotion(true);

    const { container, getAllByText } = renderWithProvider(
      <Marquee axis="y">{ITEMS}</Marquee>,
    );

    expect(getAllByText("Alpha")).toHaveLength(1);

    const frame = container.querySelector(".overflow-y-auto");

    expect(frame).not.toBeNull();
    expect(frame?.className).toContain("h-full");
    expect(frame?.firstElementChild?.className).toContain("flex-col");
  });

  it("keeps the animation when the user allows motion", () => {
    stubReducedMotion(false);

    const { container } = renderWithProvider(<Marquee>{ITEMS}</Marquee>);
    const track = findTrack(container);

    expect(track?.style.animationName).toBe("marquee-x");
  });

  // `COMP-057`: the fallback said `pauseOnHover: true` and `fadeEdges: true` while the
  // registered defaults and the documented defaults said false, so an option changed
  // meaning when the fallback tier answered.
  it("falls back to the values it registers", () => {
    expect(FALLBACK_MARQUEE_CONFIG.pauseOnHover).toBe(false);
    expect(FALLBACK_MARQUEE_CONFIG.fadeEdges).toBe(false);
    expect(FALLBACK_MARQUEE_CONFIG.pauseOnHover).toBe(
      defaultMarqueeConfig.pauseOnHover,
    );
    expect(FALLBACK_MARQUEE_CONFIG.fadeEdges).toBe(
      defaultMarqueeConfig.fadeEdges,
    );
  });
});

describe("Table", () => {
  interface Row {
    id: string;
    name: string;
    role: string;
  }

  const COLUMNS = [
    { id: "name", header: "Name", cell: (row: Row) => row.name },
    { id: "role", header: "Role", cell: (row: Row) => row.role },
  ];

  const DATA: Row[] = [
    { id: "1", name: "Ada", role: "Engineer" },
    { id: "2", name: "Linus", role: "Maintainer" },
  ];

  it("renders a semantic table with header association", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Table
        data={DATA}
        columns={COLUMNS}
        rowKeyAccessor={(row: Row) => row.id}
      />,
    );

    expect(getByRole("table")).toBeInTheDocument();
    expect(getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(getByRole("columnheader", { name: "Role" })).toBeInTheDocument();
    expect(getByText("Ada")).toBeInTheDocument();
    expect(getByText("Maintainer")).toBeInTheDocument();
  });

  it("shows an explicit empty state", () => {
    const { getByText } = renderWithProvider(
      <Table
        data={[]}
        columns={COLUMNS}
        rowKeyAccessor={(row: Row) => row.id}
        emptyMessage="No records"
      />,
    );

    expect(getByText("No records")).toBeInTheDocument();
  });

  it("keeps rows inert unless they are interactive", () => {
    const { getByText } = renderWithProvider(
      <Table
        data={DATA}
        columns={COLUMNS}
        rowKeyAccessor={(row: Row) => row.id}
      />,
    );
    const row = getByText("Ada").closest("tr");

    expect(row).toHaveAttribute("tabindex", "-1");
    // A row of a plain table is not a selected option, so it states nothing.
    expect(row).not.toHaveAttribute("aria-current");
  });

  it("activates a clickable row with the pointer and the keyboard", async () => {
    const user = createUser();
    const handleClick = vi.fn();
    const { getByText } = renderWithProvider(
      <Table
        data={DATA}
        columns={COLUMNS}
        rowKeyAccessor={(row: Row) => row.id}
        isClickable
        handleClick={handleClick}
      />,
    );
    const row = getByText("Ada").closest("tr") as HTMLElement;

    expect(row).toHaveAttribute("tabindex", "0");

    await user.click(row);
    expect(handleClick).toHaveBeenCalledTimes(1);

    row.focus();
    await pressKey(user, "Enter");
    expect(handleClick).toHaveBeenCalledTimes(2);

    await pressKey(user, " ");
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it("exposes the selected row as the current one", () => {
    const { getByText } = renderWithProvider(
      <Table
        data={DATA}
        columns={COLUMNS}
        rowKeyAccessor={(row: Row) => row.id}
        isClickable
        selectedRowKey="2"
      />,
    );

    // `aria-current` is announced on any element; `aria-selected` belongs to a
    // grid and would say nothing here.
    expect(getByText("Linus").closest("tr")).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(getByText("Ada").closest("tr")).not.toHaveAttribute("aria-current");
  });

  it("scrolls inside its own box, so the header sticks to the table", () => {
    const { getByRole } = renderWithProvider(
      <Table data={DATA} columns={COLUMNS} />,
    );
    const container = getByRole("table").parentElement as HTMLElement;

    // No `scrollable` utility exists in this package, so the container states
    // the scroll with Tailwind's own class.
    expect(container.className).toContain("overflow-auto");
    expect(container.className).not.toContain("scrollable");
  });

  it("merges the consumer's grid classes onto the table, last", () => {
    const { getByRole } = renderWithProvider(
      <Table data={DATA} columns={COLUMNS} gridClasses="table-fixed w-auto" />,
    );
    const table = getByRole("table");

    expect(table.className).toContain("table-fixed");
    // The consumer's width wins over the table's own `w-full`.
    expect(table.className).toContain("w-auto");
    expect(table.className).not.toContain("w-full");
  });

  it("names the table with a caption", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Table data={DATA} columns={COLUMNS} caption="Team members" />,
    );

    expect(getByRole("table")).toHaveAccessibleName("Team members");
    expect(getByText("Team members").tagName).toBe("CAPTION");
  });

  it("names the table with the attributes it is given", () => {
    const { getByRole } = renderWithProvider(
      <Table data={DATA} columns={COLUMNS} aria-label="Team" />,
    );

    // The name belongs to the table, not to the element around it.
    expect(getByRole("table")).toHaveAccessibleName("Team");
  });

  it("states a column's sort order on its header cell", () => {
    const sortedColumns: ColumnDef<Row>[] = [
      {
        id: "name",
        header: "Name",
        cell: (row) => row.name,
        sortDirection: "ascending",
      },
      { id: "role", header: "Role", cell: (row) => row.role },
    ];
    const { getByRole } = renderWithProvider(
      <Table data={DATA} columns={sortedColumns} />,
    );

    expect(getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    // A column that states no order says nothing rather than "none".
    expect(getByRole("columnheader", { name: "Role" })).not.toHaveAttribute(
      "aria-sort",
    );
  });

  it("keys two identically labelled columns apart", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const duplicateColumns: ColumnDef<Row>[] = [
      { header: "Value", cell: (row) => row.name },
      { header: "Value", cell: (row) => row.role },
    ];

    const { getAllByRole, getByText, rerender } = renderWithProvider(
      <Table data={DATA} columns={duplicateColumns} />,
    );

    expect(getAllByRole("columnheader", { name: "Value" })).toHaveLength(2);
    expect(getByText("Ada")).toBeInTheDocument();

    // A reorder must not re-use a key for a different column.
    rerender(<Table data={DATA} columns={[...duplicateColumns].reverse()} />);

    expect(getAllByRole("columnheader", { name: "Value" })).toHaveLength(2);
    // Keys come from the column's position, so there is no duplicate-key warning.
    expect(error).not.toHaveBeenCalled();

    error.mockRestore();
  });
});
