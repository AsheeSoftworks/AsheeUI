import { createRef, type ReactElement } from "react";
import { describe, expect, it } from "vitest";
import {
  createUser,
  expectPortalled,
  pressKey,
  renderWithProvider,
  screen,
  waitFor,
} from "../../../test";
import { Tooltip, type TooltipProps } from "./Tooltip";

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

  it("treats a count of zero as content rather than as no hint", async () => {
    // `content` is a node, so a falsy one is not the same as an empty one: a remaining
    // count of `0` is exactly the number the reader needs.
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content={0} delay={0}>
        <button type="button">Remaining</button>
      </Tooltip>,
    );
    const target = getByRole("button", { name: "Remaining" });

    await user.hover(target);

    expect(await screen.findByRole("tooltip")).toHaveTextContent("0");
  });

  it("attaches nothing when the content is empty", () => {
    const { getByRole } = renderWithProvider(
      <Tooltip content="" delay={0}>
        {trigger}
      </Tooltip>,
    );

    const target = getByRole("button", { name: "Trigger" });

    expect(target).not.toHaveAttribute("aria-describedby");
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("keeps the description the trigger already states", async () => {
    // A field that carries its own description must keep it while the hint is open: the
    // hint adds to the description list instead of replacing it.
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        <button type="button" aria-describedby="field-description">
          Trigger
        </button>
      </Tooltip>,
    );
    const target = getByRole("button", { name: "Trigger" });

    expect(target.getAttribute("aria-describedby")).toBe("field-description");

    await user.hover(target);
    const tooltip = await screen.findByRole("tooltip");
    const describedBy = target.getAttribute("aria-describedby") ?? "";

    expect(describedBy.split(" ")).toContain("field-description");
    expect(describedBy.split(" ")).toContain(tooltip.id);

    // And the trigger's own description is all that is left once the hint closes.
    await pressKey(user, "Escape");

    await waitFor(() => {
      expect(target.getAttribute("aria-describedby")).toBe("field-description");
    });
  });

  it("still measures a trigger that carries a ref of its own", async () => {
    // Under React 19 a `ref` is an ordinary prop, so the consumer's ref used to overwrite
    // the floating reference and leave the hint pinned to the origin.
    const user = createUser();
    const triggerRef = createRef<HTMLButtonElement>();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        <button ref={triggerRef} type="button">
          Trigger
        </button>
      </Tooltip>,
    );
    const target = getByRole("button", { name: "Trigger" });

    expect(triggerRef.current).toBe(target);

    await user.hover(target);
    const tooltip = await screen.findByRole("tooltip");

    // `offset(8)` on a `top` placement is only computed from a reference element, so the
    // translation proves the trigger is still the one Floating UI measures.
    expect(tooltip.style.transform).toContain("-8px");
  });

  it("refuses text as its trigger", () => {
    // A string can be neither hovered as a control nor focused, so the hint on one would be
    // pointer-only. The type is what refuses it — if `children` ever widens again, the
    // directive below stops suppressing anything and the build fails.
    // @ts-expect-error — `children` is one element a keyboard reader can reach.
    const props: TooltipProps = { content: "Hint", children: "Plain text" };

    expect(props.content).toBe("Hint");
  });

  it("keeps an untyped text child reachable with a keyboard", async () => {
    // What the type refuses, a JavaScript consumer can still pass. The wrapper takes a tab
    // stop in that case, so the hint is not pointer-only even then.
    const user = createUser();
    const textChild = "Plain text" as unknown as ReactElement;
    const { getByText } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0}>
        {textChild}
      </Tooltip>,
    );
    const fallback = getByText("Plain text");

    expect(fallback).toHaveAttribute("tabindex", "0");

    await user.tab();
    expect(fallback).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Helpful text",
    );
  });

  it("draws its pointer in the hint's surface and border", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <Tooltip content="Helpful text" delay={0} showArrow>
        {trigger}
      </Tooltip>,
    );

    await user.hover(getByRole("button", { name: "Trigger" }));
    const tooltip = await screen.findByRole("tooltip");
    const arrow = tooltip.querySelector("svg");

    expect(arrow).not.toBeNull();
    // The pointer is filled with the bubble's surface and stroked with its border, so it
    // reads as part of the hint rather than as a wedge lying on top of it.
    expect(arrow).toHaveClass("fill-background");
    expect(arrow).toHaveClass("[&>path:first-of-type]:stroke-border");
    expect(arrow).toHaveClass("[&>path:last-of-type]:stroke-background");
    expect(arrow).not.toHaveClass("text-border");
  });
});
