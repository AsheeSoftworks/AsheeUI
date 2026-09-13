import { describe, expect, it, vi } from "vitest";
import { createUser, pressKey, renderWithProvider } from "../../test";
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

  it("is inert and not focusable by default", () => {
    const { container } = renderWithProvider(<Card id="inert-card">Static</Card>);
    const card = container.querySelector("#inert-card");

    expect(card).toHaveAttribute("tabindex", "-1");
    expect(card).not.toHaveAttribute("role");
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
      <Card isClickable link={{ props: { href: "/blog/post-1" } }}>
        Linked
      </Card>,
    );
    const card = getByRole("link");

    expect(card).toHaveAttribute("href", "/blog/post-1");
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
});
