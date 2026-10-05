/**
 * Behaviour tests for the Centered layout primitive.
 *
 * The primitive has one job, so the tests state that job: the axis it centres on,
 * the room it reserves before centring, the container it optionally holds its
 * content in, and that it never assembles a class name at runtime.
 */

import { createRef } from "react";
import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { Centered } from "./Centered";

describe("Centered", () => {
  it("centres its content on both axes and in the text direction", () => {
    const { container } = renderWithProvider(<Centered>Sign in</Centered>);
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("flex");
    expect(className).toContain("items-center");
    expect(className).toContain("justify-center");
    expect(className).toContain("text-center");
  });

  it("centres on the axis it is asked for", () => {
    const { container } = renderWithProvider(
      <Centered axis="horizontal">Heading</Centered>,
    );
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("items-center");
    expect(className).not.toContain("justify-center");
    expect(className).not.toContain("text-center");
  });

  it("reserves vertical room before centring", () => {
    const { container } = renderWithProvider(
      <Centered minHeight="lg">Sign in</Centered>,
    );

    expect((container.firstElementChild as HTMLElement).className).toContain(
      "min-h-72",
    );
  });

  it("reserves no height unless it is asked to", () => {
    const { container } = renderWithProvider(<Centered>Sign in</Centered>);

    expect(
      (container.firstElementChild as HTMLElement).className,
    ).not.toContain("min-h-");
  });

  it("holds its content in a container when asked, and not otherwise", () => {
    const { container } = renderWithProvider(
      <Centered contained containerSize="sm">
        Sign in
      </Centered>,
    );
    const outer = container.firstElementChild as HTMLElement;
    const inner = outer.firstElementChild as HTMLElement;

    expect(outer.className).toContain("max-w-2xl");
    expect(outer.className).toContain("mx-auto");
    expect(inner.className).toContain("items-center");

    const { container: bare } = renderWithProvider(
      <Centered>Sign in</Centered>,
    );

    expect((bare.firstElementChild as HTMLElement).className).not.toContain(
      "mx-auto",
    );
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<Centered>Sign in</Centered>, {
      config: makeComponentConfig("centered", {
        axis: "vertical",
        minHeight: "sm",
        contained: true,
      }),
    });
    // A contained block renders its container first, so the block itself is the
    // container's only child.
    const block = container.firstElementChild?.firstElementChild as HTMLElement;

    expect(block.className).toContain("justify-center");
    expect(block.className).not.toContain("items-center");
    expect(block.className).toContain("min-h-24");
  });

  it("lets an instance prop win over the configured value", () => {
    const { container } = renderWithProvider(
      <Centered axis="horizontal">Sign in</Centered>,
      { config: makeComponentConfig("centered", { axis: "vertical" }) },
    );

    expect((container.firstElementChild as HTMLElement).className).toContain(
      "items-center",
    );
  });

  it("renders the element it is asked for and forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderWithProvider(
      <Centered as="section" ref={ref}>
        Sign in
      </Centered>,
    );

    expect(container.firstElementChild?.tagName).toBe("SECTION");
    expect(ref.current).toBe(container.firstElementChild);
  });

  it("carries the consumer's class last, so it wins", () => {
    const { container } = renderWithProvider(
      <Centered className="items-start">Sign in</Centered>,
    );
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className.endsWith("items-start")).toBe(true);
  });

  it("renders on the server and hydrates without a mismatch", () => {
    expect(
      renderToServerString(<Centered minHeight="sm">x</Centered>),
    ).toContain("min-h-24");
    expectHydrationClean(
      <Centered contained>
        <span>x</span>
      </Centered>,
    );
  });
});
